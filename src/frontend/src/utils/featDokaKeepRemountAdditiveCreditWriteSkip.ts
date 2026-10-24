/**
 * #812 stamps remount Doka keep after feat `claimAchievementReward`
 * throw-after-add (`pbv_feat_doka_keep_remount_slotN`) and honours replica
 * wallet on remount **heal / shop** `persistAbsoluteProgress`. #909
 * honours that stamp as the remount **death-cut** base. #992 honours
 * replica as the remount **rename / upgrade debit** base. Those helpers
 * never enter a later `claimAchievementReward` / `redeemGameKey`.
 *
 * Production feat / GameKey commits `snapshot().doka + grant` from the
 * remount lock. `createProgressPersist` on remount seeds GameFlow
 * `dokaBalance` — HUD credit waits for parsed `#ok` then
 * `creditLiveDoka` in `persistAchievementClaim`, so a throw-after-add
 * leaves that seed at **200**. `claimAchievementReward` /
 * `redeemGameKey` add the grant onto the **canister** wallet (700 after
 * a +500 feat). The lock then sits 500 below stored. Seeded leftover
 * `persistAbsoluteProgress` does not fetch; a later Items Buy writes
 * that lie and wipes the feat grant (`saveBattleStats`
 * incoming-below-stored). Retry of the first feat hits "Reward already
 * claimed".
 *
 * Chronology:
 * 1. World hydrated. Lock doka=200 seeded. Canister 200. GameFlow
 *    `dokaBalance` stays 200: HUD credit waits for parsed `#ok`, and
 *    `shouldApplyCallerDokaHydrate` ignores later wallet refetches while
 *    the world session is mounted.
 * 2. Trophy `claimAchievementReward` adds 500 (canister 700) then the
 *    replica rejects. `#ok` is never parsed. Commit never runs. Panel
 *    catch only toasts. Lock stays 200. No unpaid death. #812 stamps
 *    `{ preDoka: 200 }`. #812 / #909 / #992 do not enter a later claim
 *    / redeem. Trophy / Buy Doka stay live.
 * 3. Actor reconnect remounts WorldExploration. New lock seeds
 *    `{ doka: dokaBalance }` = **200**. Session unconfirmed flags are
 *    gone.
 * 4. Leftover #812: shop / heal honour replica 700. Leftover #909:
 *    death taxes replica. Leftover #992: rename / upgrade debit from
 *    replica. Unique leftover: a second feat `#ok(100)` commits
 *    **300**. Canister adds 100 to 700 → **800**. Leftover shop spend
 *    50 then writes **250** over 800 (wipes the +500 grant; correct
 *    remaining is 750). GameKey `#ok(1000)` commits **1200** over
 *    canister 1700.
 *
 * Unique vs **#812** (heal/shop honour of this stamp), **#909** (death
 * honour), **#992** (rename/upgrade debit honour of this stamp),
 * **#1029** (one-shot keep remount feat/GameKey — different stamp key;
 * grant is +50), **#1028** (victory keep remount feat/GameKey),
 * **#1025** (Boss Rush keep remount feat/GameKey), **#1021** (shop/heal
 * throw remount feat/GameKey — replica dropped, different stamp key),
 * **#1024** (spend-keep remount feat/GameKey), **#1019** (GameKey keep
 * stamp remount rename), **#811** (GameKey keep remount heal), and
 * **#657** (session unconfirmed keep then additive — not remount).
 *
 * This sidecar reads the same #812 stamp and honours replica wallet as
 * the feat / GameKey additive **base** so the lock commit is 800 /
 * 1700, not Play-entry 300 / 1200. Stale live ≤ stamped `preDoka`
 * fail-closes (`claimAchievementReward` only adds — a live wallet that
 * did not rise is stale or placeholder 0). Pickup-only (no stamp) still
 * commits 200 + grant.
 *
 * Do not stamp here — #812 notes keep after feat throw-after-add.
 * Explicit `#err` (`Reward already claimed`, `Achievement not yet
 * unlocked`, `Unknown achievement`, `claimAchievementReward failed`)
 * never stamps. Parsed `#err` from
 * `creditAchievementRewardThroughPersist` is a return, not a throw.
 * Do not restack WX / progressPersist / deathPenalty /
 * achievementReward / AchievementsPanel / shopPurchase /
 * DokaGameKeyShop / #812 / #909 / #992 / #1021 / #1028 / #1029 files.
 *
 * Tests reproduce remount claim / redeem vs the gated honour.
 * Restack feat / GameKey enqueue onto
 * `persistClaimThroughFeatDokaKeepRemount` /
 * `persistRedeemThroughFeatDokaKeepRemount` after #812 lands.
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
 * Same key as #812 `featDokaKeepRemountKey`. Remount feat /
 * GameKey honour must read the feat throw-after-add stamp, not a
 * second key and not #1029's one-shot additive key or #992's
 * rename-only helper name.
 */
export function featDokaKeepRemountAdditiveCreditKey(slot: number): string {
  return `pbv_feat_doka_keep_remount_slot${Math.max(1, toNat(slot))}`;
}

export type FeatDokaKeepRemountAdditiveCreditStamp = {
  /** Lock wallet before the throw-after-add grant. */
  preDoka: number;
};

export function readFeatDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): FeatDokaKeepRemountAdditiveCreditStamp | null {
  try {
    const raw = storage.getItem(featDokaKeepRemountAdditiveCreditKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(
      raw,
    ) as Partial<FeatDokaKeepRemountAdditiveCreditStamp>;
    if (parsed.preDoka == null) return null;
    return { preDoka: toNat(parsed.preDoka) };
  } catch {
    return null;
  }
}

export function writeFeatDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  stamp: FeatDokaKeepRemountAdditiveCreditStamp,
): void {
  try {
    storage.setItem(
      featDokaKeepRemountAdditiveCreditKey(slot),
      JSON.stringify({ preDoka: toNat(stamp.preDoka) }),
    );
  } catch {
    // private mode
  }
}

export function clearFeatDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): void {
  try {
    storage.removeItem(featDokaKeepRemountAdditiveCreditKey(slot));
  } catch {
    // ignore
  }
}

export function hasFeatDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
): boolean {
  return readFeatDokaKeepRemountAdditiveCredit(storage, slot) != null;
}

/**
 * Tests / restack fixtures. Production stamping stays on #812
 * `noteFeatDokaKeepRemount` after feat throw-after-add.
 */
export function noteFeatDokaKeepRemountAdditiveCredit(
  storage: DeathPenaltyStorage,
  slot: number,
  preDoka: number,
): void {
  writeFeatDokaKeepRemountAdditiveCredit(storage, slot, {
    preDoka: toNat(preDoka),
  });
}

export function dokaFromFeatDokaKeepAdditiveCreditWalletRecord(
  raw: unknown,
): number | null {
  if (raw == null) return null;
  if (typeof raw === "object" && raw !== null && "ok" in raw) {
    return dokaFromFeatDokaKeepAdditiveCreditWalletRecord(
      (raw as { ok: unknown }).ok,
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return toNat(n);
}

/**
 * Stale Play-entry / session cache still equals or sits below the
 * pre-keep lock. `claimAchievementReward` only adds, so a live wallet
 * that did not rise is stale (or placeholder 0). Missing live is
 * fail-closed only when a keep stamp exists.
 */
export function shouldRefuseFeatDokaKeepRemountAdditiveCreditStaleDoka(args: {
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
 * wallet when the #812 keep stamp says feat already invoked.
 * Stale Play-entry equal to stamped `preDoka` must not fall back to
 * remount wallet (that is the wipe: second claim commits 300 over 800).
 */
export function dokaForFeatDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number | null {
  if (
    shouldRefuseFeatDokaKeepRemountAdditiveCreditStaleDoka({
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
 * 300. Gated fresh feat-keep 700 + 100 → 800.
 */
export function committedDokaAfterAchievementCreditWithFeatDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForFeatDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterAchievementCredit(base, args.granted);
}

/**
 * GameKey-redeem lock commit. Ungated remount uses Play-entry 200 +
 * 1000 → 1200. Gated fresh feat-keep 700 + 1000 → 1700.
 */
export function committedDokaAfterGameKeyRedeemWithFeatDokaKeepRemount(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
}): number | null {
  const base = dokaForFeatDokaKeepRemountAdditiveCredit(args);
  if (base == null) return null;
  return committedDokaAfterGameKeyRedeem(base, args.granted);
}

/**
 * Session HUD after remount. Ungated Play-entry 200 still looks like
 * the pre-grant wallet so Trophy / Buy Doka credit from a lie. Honour
 * replica so the additive grant matches the canister.
 */
export function sessionDokaAfterFeatDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
}): number {
  const honoured = dokaForFeatDokaKeepRemountAdditiveCredit(args);
  return honoured == null ? toNat(args.remountDoka) : honoured;
}

/**
 * Leftover shop after the remount claim lock-lie. Ungated writes
 * `claim(200)+grant − shopSpend` over the canister post-claim wallet
 * and wipes the first feat grant.
 */
export function dokaAfterShopSpendWithFeatDokaKeepRemountAdditiveCredit(args: {
  remountDoka: number;
  liveDoka: number | null;
  keep: boolean;
  stampedPreDoka: number;
  granted: number;
  shopSpend: number;
}): number | null {
  const credited = committedDokaAfterAchievementCreditWithFeatDokaKeepRemount({
    remountDoka: args.remountDoka,
    liveDoka: args.liveDoka,
    keep: args.keep,
    stampedPreDoka: args.stampedPreDoka,
    granted: args.granted,
  });
  if (credited == null) return null;
  return applySpendToCommitted(credited, args.shopSpend);
}

function refuseStaleFeatDokaKeepRemountAdditiveCredit(): never {
  throw new Error(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT);
}

export type FeatDokaKeepRemountAdditiveCreditPersist = {
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
 * Feat / GameKey remount wallet used Play-entry Doka 200 after a feat
 * claim throw-after-add. Fetch `getCallerDokaBalance` when the #812
 * remount keep stamp exists. Stale live ≤ stamped `preDoka` throws so
 * the lock cannot commit `200 + grant`. Fresh replica is adopted onto
 * the lock **before** `applyAndCommit` so production
 * `committedDokaAfterAchievementCredit(snapshot, grant)` /
 * `committedDokaAfterGameKeyRedeem(snapshot, grant)` add onto 700.
 *
 * Success clears the stamp so a later leftover shop cannot reconstruct
 * from Play-entry again. Fail-close keeps the stamp. Do not skip the
 * canister claim / redeem — those already credit stored Doka.
 */
export async function persistAdditiveCreditThroughFeatDokaKeepRemount<T>(args: {
  persist: FeatDokaKeepRemountAdditiveCreditPersist;
  storage: DeathPenaltyStorage;
  slot: number;
  readWallet: () => Promise<unknown>;
  applyAndCommit: () => Promise<T>;
}): Promise<T> {
  return args.persist.enqueue(async () => {
    const stamp = readFeatDokaKeepRemountAdditiveCredit(
      args.storage,
      args.slot,
    );
    if (!stamp) return args.applyAndCommit();

    let liveDoka: number | null = null;
    try {
      liveDoka = dokaFromFeatDokaKeepAdditiveCreditWalletRecord(
        await args.readWallet(),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === ABSOLUTE_WRITE_UNCONFIRMED_CREDIT
      ) {
        throw err;
      }
      refuseStaleFeatDokaKeepRemountAdditiveCredit();
    }

    const honoured = dokaForFeatDokaKeepRemountAdditiveCredit({
      remountDoka: toNat(args.persist.snapshot().doka),
      liveDoka,
      keep: true,
      stampedPreDoka: stamp.preDoka,
    });
    if (honoured == null) {
      refuseStaleFeatDokaKeepRemountAdditiveCredit();
    }
    args.persist.commit?.({ doka: honoured });
    clearFeatDokaKeepRemountAdditiveCredit(args.storage, args.slot);
    return args.applyAndCommit();
  });
}

/**
 * Production `creditAchievementRewardThroughPersist` already enqueues.
 * Call it from `applyAndCommit` via a passthrough enqueue so the honour
 * job cannot deadlock on a nested persist lock.
 */
function passthroughEnqueuePersist(
  persist: FeatDokaKeepRemountAdditiveCreditPersist,
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
export async function persistClaimThroughFeatDokaKeepRemount(
  actor: Parameters<typeof creditAchievementRewardThroughPersist>[0],
  persist: FeatDokaKeepRemountAdditiveCreditPersist,
  achievementId: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof creditAchievementRewardThroughPersist> {
  return persistAdditiveCreditThroughFeatDokaKeepRemount({
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
export async function persistRedeemThroughFeatDokaKeepRemount(
  actor: Parameters<typeof redeemGameKeyThroughPersist>[0],
  persist: FeatDokaKeepRemountAdditiveCreditPersist,
  code: string,
  args: {
    storage: DeathPenaltyStorage;
    slot: number;
    readWallet: () => Promise<unknown>;
  },
): ReturnType<typeof redeemGameKeyThroughPersist> {
  return persistAdditiveCreditThroughFeatDokaKeepRemount({
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
