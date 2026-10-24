/**
 * #811 stamps remount Doka keep after GameKey `redeemGameKey`
 * throw-after-add (`pbv_gamekey_doka_keep_remount_slotN`) and honours
 * replica wallet on remount **heal / shop** `persistAbsoluteProgress`.
 * #900 honours that stamp as the remount **death-cut** base. #1019
 * honours replica as the remount **rename / upgrade debit** base.
 * Those helpers never enter `claimAchievementReward` / a later
 * `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` from the
 * remount lock. `createProgressPersist` on remount seeds GameFlow
 * `dokaBalance` — HUD credit waits for parsed `#ok` then
 * `onDokaCredited` in `DokaGameKeyShop.redeem`, and a throw-after-add
 * catch only toasts "Redeem failed", so that seed is still **200**.
 * `claimAchievementReward` / a later `redeemGameKey` add the grant
 * onto the **canister** wallet (1200 after a +1000 GameKey). The lock
 * then sits 1000 below stored. Seeded leftover
 * `persistAbsoluteProgress` does not fetch; a later Items Buy writes
 * that lie and wipes the paid GameKey grant (`saveBattleStats`
 * incoming-below-stored). Retry hits "GameKey already used".
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for parsed `#ok`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Shop `redeemGameKey` adds 1000 (canister 1200) then the replica
 *    rejects. `#ok` is never parsed. Commit never runs. Shop catch only
 *    toasts "Redeem failed". Lock stays 200. No unpaid death. #811
 *    stamps `{ preDoka: 200 }`. #811 / #900 / #1019 do not enter claim
 *    / a later redeem. Trophy / Buy Doka stay live.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone.
 * 4. Leftover #811: shop / heal honour replica 1200. Leftover #900:
 *    death taxes replica. Leftover #1019: rename / upgrade debit from
 *    replica. Unique leftover: Claim `#ok(100)` commits **300**.
 *    Canister adds 100 to 1200 → **1300**. Leftover shop spend 50 then
 *    writes **250** over 1300 (wipes the +1000 grant; correct remaining
 *    is 1250). A later GameKey `#ok(1000)` commits **1200** over
 *    canister 2200.
 *
 * Unique vs **#811** (heal/shop honour of this stamp), **#900** (death
 * honour), **#1019** (rename/upgrade debit honour of this stamp),
 * **#1028** (victory keep remount feat/GameKey — different stamp
 * key; grant is +50), **#1029** (one-shot keep remount feat/GameKey),
 * **#1025** (Boss Rush keep remount feat/GameKey), **#1021**
 * (shop/heal throw remount feat/GameKey — replica dropped), **#1024**
 * (spend-keep remount feat/GameKey), **#992** (feat keep stamp's
 * remount rename), **#812** (feat keep remount heal), and **#657**
 * (session unconfirmed keep then additive — not remount).
 *
 * This sidecar reads the same #811 stamp and honours replica wallet as
 * the feat / GameKey additive **base** so the lock commit is 1300 /
 * 2200, not Play-entry 300 / 1200. Stale live ≤ stamped `preDoka`
 * fail-closes (`redeemGameKey` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only (no stamp) still
 * commits 200 + grant.
 *
 * Do not stamp here — #811 notes keep after GameKey throw-after-add.
 * Explicit `#err` (`GameKey already used`, `Invalid GameKey`, `not yet
 * approved`, `redeemGameKey failed`) never stamps.
 * Do not restack WX / progressPersist / shopPurchase / DokaGameKeyShop /
 * achievementReward / deathPenalty / #811 / #900 / #1019 / #1028 /
 * #1029 files.
 *
 * Tests reproduce remount claim / redeem vs the gated honour.
 * Restack feat / GameKey enqueue onto
 * `persistClaimThroughGameKeyDokaKeepRemount` /
 * `persistRedeemThroughGameKeyDokaKeepRemount` after #811 lands.
 * No Motoko.
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
 * Same key as #811 `gameKeyDokaKeepRemountKey`. Remount feat /
 * GameKey honour must read the GameKey throw-after-add stamp, not a
 * second key and not #1028's victory additive key or #1019's
 * rename-only helper name.
 */
export function gameKeyDokaKeepRemountAdditiveCreditKey(slot: number): string {
  return `pbv_gamekey_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type GameKeyDokaKeepRemountAdditiveCreditStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readGameKeyDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): GameKeyDokaKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(gameKeyDokaKeepRemountAdditiveCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<GameKeyDokaKeepRemountAdditiveCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeGameKeyDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: GameKeyDokaKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      gameKeyDokaKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearGameKeyDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(gameKeyDokaKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasGameKeyDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readGameKeyDokaKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #811
 * `noteGameKeyDokaKeepRemount` after GameKey throw-after-add.
 */
export function noteGameKeyDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeGameKeyDokaKeepRemountAdditiveCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the
 * pre-keep lock. `redeemGameKey` only adds, so a live wallet that did
 * not rise is stale (or placeholder 0). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka(args: {
  keep: boolean;
  liveDoka: number | null;
  stampedPreDoka: number;
}): boolean {
  if (args.keep !== true) return false;
  if (args.liveDoka == null) return true;
  return toNat(args.liveDoka) <= toNat(args.stampedPreDoka);
}

/**
 * Honour remount feat / GameKey additive **base** Doka from replica
 * wallet when the #811 keep stamp says GameKey already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: claim commits 300 over 1300).
 */
export function dokaForGameKeyDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseGameKeyDokaKeepRemountAdditiveCreditStaleDoka({
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
 * 300. Gated fresh GameKey 1200 + 100 → 1300.
 */
export function committedDokaAfterAchievementCreditWithGameKeyDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForGameKeyDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterAchievementCredit(base, args.granted);
}

/**
 * Later GameKey-redeem lock commit. Ungated remount uses Play-entry
 * 200 + 1000 → 1200. Gated fresh GameKey 1200 + 1000 → 2200.
 */
export function committedDokaAfterGameKeyRedeemWithGameKeyDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForGameKeyDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterGameKeyRedeem(base, args.granted);
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still looks like
 * the pre-grant wallet so Trophy / Buy Doka credit from a lie. Honour
 * replica so the additive grant matches the canister.
 */
export function sessionDokaAfterGameKeyDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForGameKeyDokaKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount claim lock-lie. Ungated writes
 * `claim(200)+grant − shopSpend` over the canister post-claim wallet
 * and wipes the paid GameKey grant.
 */
export function dokaAfterShopSpendWithGameKeyDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
  shopSpend: number;
}): number | null {
  const credited =
    committedDokaAfterAchievementCreditWithGameKeyDokaKeepRemount({
      remountDoka: args.remountDoka,
      liveDoka: args.liveDoka,
      keep: args.keep,
      stampedPreDoka: args.stampedPreDoka,
      granted: args.granted,
    });
  if (credited == null) return null;
  return applySpendToCommitted(credited, args.shopSpend);
}

function refuseStaleGameKeyDokaKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type GameKeyDokaKeepRemountAdditiveCreditPersist = {
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
 * Feat / later GameKey remount wallet used Play-entry Doka 200 after a
 * GameKey redeem throw-after-add. Fetch `getCallerDokaBalance` when the
 * #811 remount keep stamp exists. Stale live ≤ stamped `preDoka`
 * throws so the lock cannot commit `200 + grant`. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * `committedDokaAfterAchievementCredit(snapshot, grant)` /
 * `committedDokaAfterGameKeyRedeem(snapshot, grant)` add onto 1200.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughGameKeyDokaKeepRemount<
  T,
>(args: {
  persist: GameKeyDokaKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readGameKeyDokaKeepRemountAdditiveCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromGameKeyDokaKeepAdditiveCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleGameKeyDokaKeepRemountAdditiveCredit();
    }

    const honoured = dokaForGameKeyDokaKeepRemountAdditiveCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleGameKeyDokaKeepRemountAdditiveCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearGameKeyDokaKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: GameKeyDokaKeepRemountAdditiveCreditPersist,
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
export async function persistClaimThroughGameKeyDokaKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: GameKeyDokaKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughGameKeyDokaKeepRemount({
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
 * claim: a later `#ok` must add onto replica 1200, not remount 200.
 */
export async function persistRedeemThroughGameKeyDokaKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: GameKeyDokaKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughGameKeyDokaKeepRemount({
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
