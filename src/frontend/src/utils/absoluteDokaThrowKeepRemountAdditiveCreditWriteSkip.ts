/**
 * #964 stamps remount Doka keep after shop / Doka-heal `saveBattleStats`
 * throw-after-accept (`pbv_absolute_doka_throw_keep_remount_slotN`) and
 * honours replica wallet on remount **heal / shop**
 * `persistAbsoluteProgress`. #969 honours that stamp as the remount
 * **death-cut** base. #971 skips a second Doka-heal when replica HP is
 * already the paid postHp. #977 honours replica as the remount **rename
 * / upgrade debit** base. Those helpers never enter
 * `claimAchievementReward` / `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` from the
 * remount lock. `createProgressPersist` on remount seeds GameFlow
 * `dokaBalance` — heal / shop catch rolls HUD Doka back to Play-entry,
 * so that seed is still **200**. `claimAchievementReward` / `redeemGameKey`
 * add the grant onto the **canister** wallet (183 after a heal throw,
 * 150 after a shop throw). The lock then sits 17 / 50 above stored.
 * Seeded leftover `persistAbsoluteProgress` does not fetch; a later
 * Items Buy writes that lie and refunds the original fee
 * (`saveBattleStats` incoming-below-stored).
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200.
 * 2. Doka-heal `saveBattleStats` accepts Doka 183 then throws
 *    (`replica went away`). Commit never runs. Catch returns false.
 *    Heal rollback HUD 200. Same class: Items Buy accepts Doka 150
 *    then throws; HUD + inventory roll back. No unpaid death. #964
 *    stamps `{ preDoka: 200 }`. #977 does not enter claim / redeem.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone. Trophy / Buy Doka stay live.
 * 4. Leftover #964: shop / heal honour replica 183 / 150. Leftover
 *    #969: death taxes replica. Leftover #971: skip second heal.
 *    Leftover #977: rename / upgrade debit from replica. Unique
 *    leftover: Claim `#ok(100)` commits **300**. Canister adds 100
 *    to 183 → **283** (heal) or 150 → **250** (shop). Leftover shop
 *    spend 50 then writes **250** over 283 (refunds the 17 heal fee)
 *    or **250** over 250 (refunds the original 50 purchase). GameKey
 *    `#ok(1000)` commits **1200** over canister 1183 / 1150.
 *
 * Unique vs **#964** (heal/shop honour of this stamp), **#969** (death
 * honour), **#971** (second Doka-heal skip of the #860 HP stamp),
 * **#977** (rename/upgrade debit honour of this stamp), **#657**
 * (session unconfirmed keep then additive — not remount), **#604**
 * (Death Realm claim/redeem gate), **#812** / **#811** (feat / GameKey
 * keep stamps, remount heal), and **#992** / **#1019** (those stamps'
 * remount rename).
 *
 * This sidecar reads the same #964 stamp and honours replica wallet as
 * the feat / GameKey additive **base** so the lock commit is 283 / 250
 * / 1183, not Play-entry 300 / 1200. Stale live ≥ stamped `preDoka`
 * fail-closes (a live wallet that did not drop is stale or the
 * rollback cache). Pickup-only (no stamp) still commits 200 + grant.
 *
 * Do not stamp here — #964 notes keep after shop / heal
 * throw-after-accept. Explicit `saveBattleStats failed` never stamps.
 * Do not restack WX / progressPersist / deathPenalty / itemShop /
 * achievementReward / shopPurchase / DokaGameKeyShop / #964 / #969 /
 * #971 / #977 files.
 *
 * Tests reproduce remount claim / redeem vs the gated honour.
 * Restack feat / GameKey enqueue onto
 * `persistClaimThroughAbsoluteDokaThrowKeepRemount` /
 * `persistRedeemThroughAbsoluteDokaThrowKeepRemount` after #964
 * lands. No Motoko.
 */

import {
  committedDokaAfterAchievementCredit,
  creditAchievementRewardThroughPersist,
} from "./achievementReward.ts";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
} from "./progressPersist.ts";
import {
  committedDokaAfterGameKeyRedeem,
  redeemGameKeyThroughPersist,
} from "./shopPurchase.ts";

function toNat(n: number | null | undefined): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

/**
 * Same key as #964 `absoluteDokaThrowKeepRemountKey`. Remount feat /
 * GameKey honour must read the shop / heal throw-after-accept stamp,
 * not a second key and not #977's rename-only helper name.
 */
export function absoluteDokaThrowKeepRemountAdditiveCreditKey(
  slot: number,
): string {
  return `pbv_absolute_doka_throw_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type AbsoluteDokaThrowKeepRemountAdditiveCreditStamp = {
  /** Lock wallet before the shop / heal saveBattleStats throw. */
  preDoka: number;
};

export function readAbsoluteDokaThrowKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): AbsoluteDokaThrowKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(slot),
    );
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<AbsoluteDokaThrowKeepRemountAdditiveCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeAbsoluteDokaThrowKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: AbsoluteDokaThrowKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      absoluteDokaThrowKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearAbsoluteDokaThrowKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(absoluteDokaThrowKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasAbsoluteDokaThrowKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #964
 * `noteAbsoluteDokaThrowKeepRemount` after shop / heal throw-after-accept.
 */
export function noteAbsoluteDokaThrowKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeAbsoluteDokaThrowKeepRemountAdditiveCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / rollback HUD still equals or sits above the
 * pre-spend lock. Shop / heal only debit, so a live wallet that did not
 * drop is stale (or the rollback cache). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) >= toNat(args.stampedPreDoka);
}

/**
 * Honour remount feat / GameKey additive **base** Doka from replica
 * wallet when the #964 keep stamp says shop / heal already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the refund: claim commits 300 over 283).
 */
export function dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseAbsoluteDokaThrowKeepRemountAdditiveCreditStaleDoka({
      keep: args.keep,
      liveDoka: args.liveDoka,
      stampedPreDoka: args.stampedPreDoka,
    })
  ) {
    return null;
  }
  if (args.keep === true) {
    return args.liveDoka == null ? null : toNat(args.liveDoka);
  }
  return toNat(args.remountDoka);
}

/**
 * Feat-claim lock commit. Ungated remount uses Play-entry 200 + 100 →
 * 300. Gated fresh heal 183 + 100 → 283; shop 150 + 100 → 250.
 */
export function committedDokaAfterAchievementCreditWithAbsoluteDokaThrowKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterAchievementCredit(base, args.granted);
}

/**
 * GameKey-redeem lock commit. Ungated remount uses Play-entry 200 +
 * 1000 → 1200. Gated fresh heal 183 + 1000 → 1183.
 */
export function committedDokaAfterGameKeyRedeemWithAbsoluteDokaThrowKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterGameKeyRedeem(base, args.granted);
}

/**
 * Session HUD after remount. Ungated rollback 200 still looks like the
 * pre-spend wallet so Trophy / Buy Doka credit from a lie. Honour
 * replica so the additive grant matches the canister.
 */
export function sessionDokaAfterAbsoluteDokaThrowKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount claim lock-lie. Ungated writes
 * `claim(200)+grant − shopSpend` over the canister post-claim wallet
 * and refunds the original shop / heal fee.
 */
export function dokaAfterShopSpendWithAbsoluteDokaThrowKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
  shopSpend: number;
}): number | null {
  const credited =
    committedDokaAfterAchievementCreditWithAbsoluteDokaThrowKeepRemount({
      remountDoka: args.remountDoka,
      liveDoka: args.liveDoka,
      keep: args.keep,
      stampedPreDoka: args.stampedPreDoka,
      granted: args.granted,
    });
  if (credited == null) return null;
  return applySpendToCommitted(credited, args.shopSpend);
}

function refuseStaleAbsoluteDokaThrowKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type AbsoluteDokaThrowKeepRemountAdditiveCreditPersist = {
  snapshot: () => { doka: number };
  commit?: (next: { doka?: number }) => void;
  enqueue: <T>(
    fn: () => Promise<T>,
    opts?: { skipBeforeEach?: boolean },
  ) => Promise<T>;
  isWalletSeeded?: () => boolean;
  noteUnseededCredit?: () => void;
};

/**
 * Feat / GameKey remount wallet used Play-entry Doka 200 after a shop /
 * heal saveBattleStats throw-after-accept. Fetch `getCallerDokaBalance`
 * when the #964 remount keep stamp exists. Stale live ≥ stamped
 * `preDoka` throws so the lock cannot commit `200 + grant`. Fresh
 * replica is adopted onto the lock **before** `applyAndCommit` so
 * production `committedDokaAfterAchievementCredit(snapshot, grant)` /
 * `committedDokaAfterGameKeyRedeem(snapshot, grant)` add onto 183 /
 * 150.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount<
  T,
>(args: {
  persist: AbsoluteDokaThrowKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readAbsoluteDokaThrowKeepRemountAdditiveCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromAbsoluteDokaThrowAdditiveCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleAbsoluteDokaThrowKeepRemountAdditiveCredit();
    }

    const honoured = dokaForAbsoluteDokaThrowKeepRemountAdditiveCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleAbsoluteDokaThrowKeepRemountAdditiveCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearAbsoluteDokaThrowKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: AbsoluteDokaThrowKeepRemountAdditiveCreditPersist,
): {
  enqueue: <T>(fn: () => Promise<T>) => Promise<T>;
  commit: (next: { doka?: number }) => void;
  snapshot: () => { doka: number };
  isWalletSeeded: () => boolean;
  noteUnseededCredit?: () => void;
} {
  return {
    enqueue: <T>(fn: () => Promise<T>) => fn(),
    commit: (next: { doka?: number }) => {
      persist.commit?.(next);
    },
    snapshot: () => persist.snapshot(),
    isWalletSeeded: () =>
      persist.isWalletSeeded?.() ?? persist.snapshot().doka > 0,
    noteUnseededCredit: persist.noteUnseededCredit,
  };
}

/**
 * `creditAchievementRewardThroughPersist` already enqueues. Honour
 * replica onto the remount lock first, then run the production claim
 * body without a nested queue hop.
 */
export async function persistClaimThroughAbsoluteDokaThrowKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: AbsoluteDokaThrowKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
    persist,
    storage: args.storage,
    slot: args.slot,
    readWallet: args.readWallet,
    applyAndCommit: () =>
      creditAchievementRewardThroughPersist(
        actor,
        passthroughEnqueuePersist(persist),
        achievementId,
      ),
  });
}

/**
 * `redeemGameKeyThroughPersist` already enqueues. Same honour as feat
 * claim: `#ok` must add onto replica 183 / 150, not remount 200.
 */
export async function persistRedeemThroughAbsoluteDokaThrowKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: AbsoluteDokaThrowKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughAbsoluteDokaThrowKeepRemount({
    persist,
    storage: args.storage,
    slot: args.slot,
    readWallet: args.readWallet,
    applyAndCommit: () =>
      redeemGameKeyThroughPersist(
        actor,
        passthroughEnqueuePersist(persist),
        code,
      ),
  });
}
