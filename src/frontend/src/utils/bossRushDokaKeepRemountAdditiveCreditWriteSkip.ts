/**
 * #864 stamps remount Doka keep after Boss Rush room-clear `applyRewards`
 * throw-after-add (`pbv_boss_rush_doka_keep_remount_slotN`) and honours
 * replica wallet on remount **heal / shop** `persistAbsoluteProgress`.
 * #866 honours that stamp as the remount **death-cut** base. #1020
 * honours replica as the remount **rename / upgrade debit** base. Those
 * helpers never enter `claimAchievementReward` / `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` from the
 * remount lock. `createProgressPersist` on remount seeds GameFlow
 * `dokaBalance` — room-clear HUD credit waits for `.then` after
 * `persistBossRushRewardsThroughLock`, and the throw-after-add catch
 * only `logDebugError`s, so that seed is still **200**.
 * `claimAchievementReward` / `redeemGameKey` add the grant onto the
 * **canister** wallet (700 after a +500 grant). The lock then sits 500
 * below stored. Seeded leftover `persistAbsoluteProgress` does not
 * fetch; a later Items Buy writes that lie and wipes the room-clear
 * grant (`saveBattleStats` incoming-below-stored). The room already
 * advanced, so the grant cannot be re-farmed.
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for commit, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Room 0 clear writes `currentRoom` first, then
 *    `applyRewards(slot, 500, xp)` invokes then throws (canister 700).
 *    Catch only `logDebugError`s. Lock stays 200. No unpaid death.
 *    #864 stamps `{ preDoka: 200 }`. #864 / #866 / #1020 do not enter
 *    claim / redeem. Trophy / Buy Doka stay live.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone.
 * 4. Leftover #864: shop / heal honour replica 700. Leftover #866:
 *    death taxes replica. Leftover #1020: rename / upgrade debit from
 *    replica. Unique leftover: Claim `#ok(100)` commits **300**.
 *    Canister adds 100 to 700 → **800**. Leftover shop spend 50 then
 *    writes **250** over 800 (wipes the +500 grant and the feat; correct
 *    remaining is 750). GameKey `#ok(1000)` commits **1200** over
 *    canister 1700.
 *
 * Unique vs **#864** (heal/shop honour of this stamp), **#866** (death
 * honour), **#1020** (rename/upgrade debit honour of this stamp),
 * **#1021** (shop/heal throw remount feat/GameKey — replica dropped,
 * different stamp key), **#979** (handleBattleEnd victory remount
 * rename), **#992** / **#1019** (feat / GameKey keep stamps' remount
 * rename), **#812** / **#811** (those stamps' remount heal), and
 * **#657** (session unconfirmed keep then additive — not remount).
 *
 * This sidecar reads the same #864 stamp and honours replica wallet as
 * the feat / GameKey additive **base** so the lock commit is 800 /
 * 1700, not Play-entry 300 / 1200. Stale live ≤ stamped `preDoka`
 * fail-closes (`applyRewards` only adds — a live wallet that did not
 * rise is stale or placeholder 0). Pickup-only (no stamp) still
 * commits 200 + grant.
 *
 * Do not stamp here — #864 notes keep after Boss Rush throw-after-add.
 * Stamp only after `persistRoomClear` succeeded and `applyAndCommit`
 * threw. A progress-only reject never invoked `applyRewards`. Explicit
 * `applyRewards failed` never stamps.
 * Do not restack WX / progressPersist / deathPenalty / rewardResolver /
 * bossRushProgress / achievementReward / shopPurchase / DokaGameKeyShop
 * / #864 / #866 / #1020 / #1021 files.
 *
 * Tests reproduce remount claim / redeem vs the gated honour.
 * Restack feat / GameKey enqueue onto
 * `persistClaimThroughBossRushDokaKeepRemount` /
 * `persistRedeemThroughBossRushDokaKeepRemount` after #864 lands.
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
 * Same key as #864 `bossRushDokaKeepRemountKey`. Remount feat /
 * GameKey honour must read the Boss Rush throw-after-add stamp, not a
 * second key and not #1021's shop/heal-throw additive key or #1020's
 * rename-only helper name.
 */
export function bossRushDokaKeepRemountAdditiveCreditKey(slot: number): string {
  return `pbv_boss_rush_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type BossRushDokaKeepRemountAdditiveCreditStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readBossRushDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): BossRushDokaKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(bossRushDokaKeepRemountAdditiveCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<BossRushDokaKeepRemountAdditiveCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeBossRushDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: BossRushDokaKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      bossRushDokaKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearBossRushDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(bossRushDokaKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasBossRushDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readBossRushDokaKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #864
 * `noteBossRushDokaKeepRemount` after Boss Rush throw-after-add.
 */
export function noteBossRushDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeBossRushDokaKeepRemountAdditiveCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromBossRushDokaKeepAdditiveCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromBossRushDokaKeepAdditiveCreditWalletRecord(
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
export function shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka(args: {
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
 * wallet when the #864 keep stamp says room-clear already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: claim commits 300 over 800).
 */
export function dokaForBossRushDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseBossRushDokaKeepRemountAdditiveCreditStaleDoka({
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
 * 300. Gated fresh Boss Rush 700 + 100 → 800.
 */
export function committedDokaAfterAchievementCreditWithBossRushDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForBossRushDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterAchievementCredit(base, args.granted);
}

/**
 * GameKey-redeem lock commit. Ungated remount uses Play-entry 200 +
 * 1000 → 1200. Gated fresh Boss Rush 700 + 1000 → 1700.
 */
export function committedDokaAfterGameKeyRedeemWithBossRushDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForBossRushDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterGameKeyRedeem(base, args.granted);
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still looks like
 * the pre-grant wallet so Trophy / Buy Doka credit from a lie. Honour
 * replica so the additive grant matches the canister.
 */
export function sessionDokaAfterBossRushDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForBossRushDokaKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount claim lock-lie. Ungated writes
 * `claim(200)+grant − shopSpend` over the canister post-claim wallet
 * and wipes the room-clear grant.
 */
export function dokaAfterShopSpendWithBossRushDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
  shopSpend: number;
}): number | null {
  const credited =
    committedDokaAfterAchievementCreditWithBossRushDokaKeepRemount({
      remountDoka: args.remountDoka,
      liveDoka: args.liveDoka,
      keep: args.keep,
      stampedPreDoka: args.stampedPreDoka,
      granted: args.granted,
    });
  if (credited == null) return null;
  return applySpendToCommitted(credited, args.shopSpend);
}

function refuseStaleBossRushDokaKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type BossRushDokaKeepRemountAdditiveCreditPersist = {
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
 * Feat / GameKey remount wallet used Play-entry Doka 200 after a Boss
 * Rush applyRewards throw-after-add. Fetch `getCallerDokaBalance` when
 * the #864 remount keep stamp exists. Stale live ≤ stamped `preDoka`
 * throws so the lock cannot commit `200 + grant`. Fresh replica is
 * adopted onto the lock **before** `applyAndCommit` so production
 * `committedDokaAfterAchievementCredit(snapshot, grant)` /
 * `committedDokaAfterGameKeyRedeem(snapshot, grant)` add onto 700.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughBossRushDokaKeepRemount<
  T,
>(args: {
  persist: BossRushDokaKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readBossRushDokaKeepRemountAdditiveCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromBossRushDokaKeepAdditiveCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleBossRushDokaKeepRemountAdditiveCredit();
    }

    const honoured = dokaForBossRushDokaKeepRemountAdditiveCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleBossRushDokaKeepRemountAdditiveCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearBossRushDokaKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: BossRushDokaKeepRemountAdditiveCreditPersist,
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
export async function persistClaimThroughBossRushDokaKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: BossRushDokaKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughBossRushDokaKeepRemount({
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
 * claim: `#ok` must add onto replica 700, not remount 200.
 */
export async function persistRedeemThroughBossRushDokaKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: BossRushDokaKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughBossRushDokaKeepRemount({
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
