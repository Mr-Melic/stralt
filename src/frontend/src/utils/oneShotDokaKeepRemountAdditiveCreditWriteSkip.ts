/**
 * #800 stamps remount Doka keep after shrine / ground / dungeon-complete
 * `persistDokaCreditResult` transport-keep
 * (`pbv_oneshot_doka_keep_remount_slotN`) and honours replica wallet on
 * remount **heal / shop** `persistAbsoluteProgress`. #877 honours that
 * stamp as the remount **death-cut** base. #986 / #987 honour replica
 * as the remount **rename / upgrade debit** base. Those helpers never
 * enter `claimAchievementReward` / `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` from the
 * remount lock. `createProgressPersist` on remount seeds GameFlow
 * `dokaBalance` — one-shot HUD credit waits for settle `commit`, and
 * transport-keep + stale confirm never call `onDokaBalanceChange`, so
 * that seed is still **200**. `claimAchievementReward` /
 * `redeemGameKey` add the grant onto the **canister** wallet (250 after
 * a +50 pickup). The lock then sits 50 below stored. Seeded leftover
 * `persistAbsoluteProgress` does not fetch; a later Items Buy writes
 * that lie and wipes the pickup (`saveBattleStats`
 * incoming-below-stored). The one-shot id is already claimed, so the
 * grant cannot be re-farmed.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for settle `commit`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Ground / shrine / dungeon-complete `applyRewards(slot, 50, 0)`
 *    invokes then throws transport (canister 250). Confirm still reads
 *    200. `settle` is `keep`. Session flag set. No unpaid death.
 *    #800 stamps `{ preDoka: 200 }`. #800 / #877 / #986 / #987 do not
 *    enter claim / redeem. Trophy / Buy Doka stay live.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone.
 * 4. Leftover #800: shop / heal honour replica 250. Leftover #877:
 *    death taxes replica. Leftover #986 / #987: rename / upgrade debit
 *    from replica. Unique leftover: Claim `#ok(100)` commits **300**.
 *    Canister adds 100 to 250 → **350**. Leftover shop spend 50 then
 *    writes **250** over 350 (wipes the +50 pickup; correct remaining
 *    is 300). GameKey `#ok(1000)` commits **1200** over canister 1250.
 *
 * Unique vs **#800** (heal/shop honour of this stamp), **#877** (death
 * honour), **#986 / #987** (rename/upgrade debit honour of this stamp),
 * **#1028** (victory keep remount feat/GameKey — different stamp key),
 * **#1025** (Boss Rush keep remount feat/GameKey), **#1021** (shop/heal
 * throw remount feat/GameKey — replica dropped, different stamp key),
 * **#1024** (spend-keep remount feat/GameKey), **#992** / **#1019**
 * (feat / GameKey keep stamps' remount rename), **#812** / **#811**
 * (those stamps' remount heal), and **#657** (session unconfirmed keep
 * then additive — not remount).
 *
 * This sidecar reads the same #800 stamp and honours replica wallet as
 * the feat / GameKey additive **base** so the lock commit is 350 /
 * 1250, not Play-entry 300 / 1200. Stale live ≤ stamped `preDoka`
 * fail-closes (`applyRewards` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only (no stamp) still
 * commits 200 + grant.
 *
 * Do not stamp here — #800 notes keep after one-shot transport-keep.
 * Stamp only a seeded `keep`. Explicit `applyRewards failed` is settle
 * `release` and never stamps. Unseeded keep is #493.
 * Do not restack WX / progressPersist / dokaPersist / deathPenalty /
 * achievementReward / shopPurchase / DokaGameKeyShop / #800 / #877 /
 * #986 / #987 / #1021 / #1025 / #1028 files.
 *
 * Tests reproduce remount claim / redeem vs the gated honour.
 * Restack feat / GameKey enqueue onto
 * `persistClaimThroughOneShotDokaKeepRemount` /
 * `persistRedeemThroughOneShotDokaKeepRemount` after #800 lands.
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
 * Same key as #800 `oneShotDokaKeepRemountKey`. Remount feat /
 * GameKey honour must read the one-shot transport-keep stamp, not a
 * second key and not #1028's victory additive key or #986's
 * rename-only helper name.
 */
export function oneShotDokaKeepRemountAdditiveCreditKey(slot: number): string {
  return `pbv_oneshot_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type OneShotDokaKeepRemountAdditiveCreditStamp = {
  /** Lock wallet before the transport-keep grant. */
  preDoka: number;
};

export function readOneShotDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): OneShotDokaKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(oneShotDokaKeepRemountAdditiveCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<OneShotDokaKeepRemountAdditiveCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeOneShotDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: OneShotDokaKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      oneShotDokaKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearOneShotDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(oneShotDokaKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasOneShotDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readOneShotDokaKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #800
 * `noteOneShotDokaKeepRemount` after one-shot transport-keep.
 */
export function noteOneShotDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeOneShotDokaKeepRemountAdditiveCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromOneShotDokaKeepAdditiveCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromOneShotDokaKeepAdditiveCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the
 * pre-keep lock. `applyRewards` only adds, so a live wallet that did
 * not rise is stale (or placeholder 0). Missing live is fail-closed
 * only when a keep stamp exists.
 */
export function shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka(args: {
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
 * wallet when the #800 keep stamp says a one-shot grant already
 * invoked. Stale Play-entry equal to stamped `preDoka` must not fall
 * back to remount wallet (that is the wipe: claim commits 300 over
 * 350).
 */
export function dokaForOneShotDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseOneShotDokaKeepRemountAdditiveCreditStaleDoka({
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
 * 300. Gated fresh one-shot 250 + 100 → 350.
 */
export function committedDokaAfterAchievementCreditWithOneShotDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForOneShotDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterAchievementCredit(base, args.granted);
}

/**
 * GameKey-redeem lock commit. Ungated remount uses Play-entry 200 +
 * 1000 → 1200. Gated fresh one-shot 250 + 1000 → 1250.
 */
export function committedDokaAfterGameKeyRedeemWithOneShotDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForOneShotDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterGameKeyRedeem(base, args.granted);
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still looks like
 * the pre-grant wallet so Trophy / Buy Doka credit from a lie. Honour
 * replica so the additive grant matches the canister.
 */
export function sessionDokaAfterOneShotDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForOneShotDokaKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount claim lock-lie. Ungated writes
 * `claim(200)+grant − shopSpend` over the canister post-claim wallet
 * and wipes the one-shot pickup.
 */
export function dokaAfterShopSpendWithOneShotDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
  shopSpend: number;
}): number | null {
  const credited =
    committedDokaAfterAchievementCreditWithOneShotDokaKeepRemount({
      remountDoka: args.remountDoka,
      liveDoka: args.liveDoka,
      keep: args.keep,
      stampedPreDoka: args.stampedPreDoka,
      granted: args.granted,
    });
  if (credited == null) return null;
  return applySpendToCommitted(credited, args.shopSpend);
}

function refuseStaleOneShotDokaKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type OneShotDokaKeepRemountAdditiveCreditPersist = {
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
 * Feat / GameKey remount wallet used Play-entry Doka 200 after a
 * one-shot applyRewards transport-keep. Fetch `getCallerDokaBalance`
 * when the #800 remount keep stamp exists. Stale live ≤ stamped
 * `preDoka` throws so the lock cannot commit `200 + grant`. Fresh
 * replica is adopted onto the lock **before** `applyAndCommit` so
 * production `committedDokaAfterAchievementCredit(snapshot, grant)` /
 * `committedDokaAfterGameKeyRedeem(snapshot, grant)` add onto 250.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughOneShotDokaKeepRemount<
  T,
>(args: {
  persist: OneShotDokaKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readOneShotDokaKeepRemountAdditiveCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromOneShotDokaKeepAdditiveCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleOneShotDokaKeepRemountAdditiveCredit();
    }

    const honoured = dokaForOneShotDokaKeepRemountAdditiveCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleOneShotDokaKeepRemountAdditiveCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearOneShotDokaKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: OneShotDokaKeepRemountAdditiveCreditPersist,
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
export async function persistClaimThroughOneShotDokaKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: OneShotDokaKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughOneShotDokaKeepRemount({
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
 * claim: `#ok` must add onto replica 250, not remount 200.
 */
export async function persistRedeemThroughOneShotDokaKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: OneShotDokaKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughOneShotDokaKeepRemount({
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
