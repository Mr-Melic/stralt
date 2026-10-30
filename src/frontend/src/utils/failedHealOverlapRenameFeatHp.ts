/**
 * Failed overworld Heal persist overlapping rename / upgrade / feat / GameKey.
 *
 * Distinct from **#1326** (failed heal + BuffShop Buy). Shop sync-debits
 * Doka and enqueues `persistAbsoluteProgress` with clickHp already at the
 * unpaid bar, so the shop write stamps HP before the heal `.then`.
 *
 * Rename / upgrade / feat claim / GameKey redeem do **not** write HP.
 * They still break `shouldRollbackFailedHeal`'s AND: the UI debit/credit
 * lands after their await, while a heal enqueued behind them is in flight.
 * Heal `.then` sees liveDoka ≠ expectedDoka and skips the whole rollback.
 * Unpaid HP stays on `characterStatsRef` until a later absolute write
 * (BuffShop Buy / another heal / death) calls
 * `resolveAbsoluteWriteHp(live, …)` and persists it.
 *
 * Production (`WorldExploration.tsx`):
 *   - Rename UI debit after await (2105–2157) — not reserved on begin.
 *   - Upgrade UI debit after await (3140–3219).
 *   - Feat claim `creditLiveDoka` after persist (1516–1529).
 *   - GameKey `onDokaCredited` → `creditLiveDoka` (19166–19168).
 *   - Heal AND rollback (18463–18484) / `itemShop.ts` shouldRollbackFailedHeal.
 *
 * Chronology (rename; upgrade is the same debit axis):
 * 1. World hydrated. HP 50/200. Doka 200. Lock seeded 200.
 * 2. Confirm rename (100 Doka). `renameCharacter` enqueued; UI wallet
 *    still 200 (debit waits on `#ok`).
 * 3. While Saving, click Heal. Optimistic HP 200, Doka 150. Heal
 *    `saveBattleStats` queued behind rename.
 * 4. Rename `#ok`. Lock commits −100. UI
 *    `liveDokaAfterRename(150) → 50` (debit from post-heal wallet).
 * 5. Heal persist returns false. AND rollback: liveDoka 50 ≠ expected
 *    150 → no-op. Unpaid HP 200 stays on the ref.
 * 6. BuffShop Buy (or death / later heal) runs
 *    `persistAbsoluteProgress(liveHp=200, …)` → canister HP 200.
 *
 * Feat / GameKey credit the wallet up instead of down; AND still fails
 * and the later absolute write stamps the same unpaid HP.
 *
 * Accounting: start HP 50 Doka 200 − rename 100 = HP 50 Doka 100.
 * Ungated path: canister HP 200 Doka 100 (unpaid +150 HP) + new name.
 * Survives reload; backend HP; repeatable on the next failed heal.
 *
 * #1326's shop-while-heal gate does **not** close this path. Split-axis
 * HP/Doka rollback does. Sidecar only so WX / itemShop / #387 / #595 /
 * #1310 / #1326 stay merge-clean. Restack after those PRs:
 *   - Heal `.then`: restore HP when live HP still matches this click,
 *     independently of Doka (do not AND).
 *   - Optionally keep Doka restore on its own axis.
 *
 * Intended 1 Doka : 3 HP and rename/upgrade/feat prices unchanged.
 */

import {
  resolveAbsoluteWriteHp,
  shouldRollbackFailedHeal,
} from "./itemShop.ts";

/** Live WX ANDs both axes, so a rename/feat Doka move skips HP rollback. */
export function liveWxAndsFailedHealRollbackForRenameFeat(): boolean {
  return true;
}

/**
 * Restore `hpBefore` when this heal click still owns live HP.
 * Named apart from **#1326** `shouldRollbackFailedHealHp` so both
 * sidecars can land without duplicate-export collisions.
 */
export function shouldRestoreUnpaidHealHpAfterOverlap(args: {
  liveHp: number;
  expectedHp: number;
}): boolean {
  const liveHp = Math.max(0, Math.floor(Number(args.liveHp) || 0));
  const expectedHp = Math.max(0, Math.floor(Number(args.expectedHp) || 0));
  return liveHp === expectedHp;
}

/** Restore `dokaBefore` when this heal click still owns the live wallet. */
export function shouldRestoreUnpaidHealDokaAfterOverlap(args: {
  liveDoka: number;
  expectedDoka: number;
}): boolean {
  const liveDoka = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
  const expectedDoka = Math.max(0, Math.floor(Number(args.expectedDoka) || 0));
  return liveDoka === expectedDoka;
}

export function restoreUnpaidHealHpAfterOverlap(args: {
  liveHp: number;
  expectedHp: number;
  hpBefore: number;
}): number | null {
  if (!shouldRestoreUnpaidHealHpAfterOverlap(args)) return null;
  return Math.max(0, Math.floor(Number(args.hpBefore) || 0));
}

export function restoreUnpaidHealDokaAfterOverlap(args: {
  liveDoka: number;
  expectedDoka: number;
  dokaBefore: number;
}): number | null {
  if (!shouldRestoreUnpaidHealDokaAfterOverlap(args)) return null;
  return Math.max(0, Math.floor(Number(args.dokaBefore) || 0));
}

/**
 * #1326 gates BuffShop while `dokaHealInFlightRef`. Rename / feat / upgrade
 * / GameKey are not shop spends, so that gate never runs.
 */
export function shopWhileHealGateBlocksRenameFeatOverlap(): boolean {
  return false;
}

export type FailedHealOverlapRenameFeatWrite = {
  canisterHp: number;
  canisterDoka: number;
  liveHp: number;
  liveDoka: number;
  laterAbsoluteWrote: boolean;
};

export type OverlapDokaMove = "rename_debit" | "upgrade_debit" | "feat_credit";

/**
 * Reproduce rename/upgrade/feat completing their UI Doka move while a
 * heal `saveBattleStats` is still in flight, then a later absolute write
 * stamping live HP. `splitAxisRollback` restores HP even when Doka moved.
 */
export function simulateRenameFeatBeforeFailedHeal(args: {
  startHp: number;
  startDoka: number;
  healExpectedHp: number;
  healExpectedDoka: number;
  overlap: OverlapDokaMove;
  overlapAmount: number;
  laterShopCost: number;
  splitAxisRollback: boolean;
}): FailedHealOverlapRenameFeatWrite {
  const startHp = Math.max(0, Math.floor(Number(args.startHp) || 0));
  const startDoka = Math.max(0, Math.floor(Number(args.startDoka) || 0));
  const healExpectedHp = Math.max(
    0,
    Math.floor(Number(args.healExpectedHp) || 0),
  );
  const healExpectedDoka = Math.max(
    0,
    Math.floor(Number(args.healExpectedDoka) || 0),
  );
  const overlapAmount = Math.max(
    0,
    Math.floor(Number(args.overlapAmount) || 0),
  );
  const laterShopCost = Math.max(
    0,
    Math.floor(Number(args.laterShopCost) || 0),
  );

  // Optimistic heal already applied; overlap UI move lands next.
  let liveHp = healExpectedHp;
  let liveDoka = healExpectedDoka;
  // Rename/upgrade commit on the lock before heal runs; feat credits after.
  let canisterHp = startHp;
  let canisterDoka = startDoka;

  if (args.overlap === "feat_credit") {
    liveDoka = liveDoka + overlapAmount;
    canisterDoka = canisterDoka + overlapAmount;
  } else {
    // rename_debit / upgrade_debit: lock already took the spend; UI debits
    // from the post-heal wallet (live WX `liveDokaAfterRename` pattern).
    liveDoka = Math.max(0, liveDoka - overlapAmount);
    canisterDoka = Math.max(0, canisterDoka - overlapAmount);
  }

  // Heal persist returns false. No heal canister write.

  if (args.splitAxisRollback) {
    const nextHp = restoreUnpaidHealHpAfterOverlap({
      liveHp,
      expectedHp: healExpectedHp,
      hpBefore: startHp,
    });
    if (nextHp != null) liveHp = nextHp;
    const nextDoka = restoreUnpaidHealDokaAfterOverlap({
      liveDoka,
      expectedDoka: healExpectedDoka,
      dokaBefore: startDoka,
    });
    if (nextDoka != null) liveDoka = nextDoka;
  } else if (
    shouldRollbackFailedHeal({
      liveHp,
      liveDoka,
      expectedHp: healExpectedHp,
      expectedDoka: healExpectedDoka,
    })
  ) {
    liveHp = startHp;
    liveDoka = startDoka;
  }

  // Later BuffShop Buy (or death) absolute-writes live HP.
  let laterAbsoluteWrote = false;
  if (laterShopCost > 0 && liveDoka >= laterShopCost) {
    laterAbsoluteWrote = true;
    canisterHp = resolveAbsoluteWriteHp(liveHp, liveHp);
    canisterDoka = Math.max(0, canisterDoka - laterShopCost);
    liveDoka = Math.max(0, liveDoka - laterShopCost);
  }

  return {
    canisterHp,
    canisterDoka,
    liveHp,
    liveDoka,
    laterAbsoluteWrote,
  };
}

/** Unpaid HP a later absolute write would stamp onto the canister. */
export function leftoverUnpaidHealHpAfterRenameFeat(args: {
  startHp: number;
  wroteHp: number;
}): number {
  const startHp = Math.max(0, Math.floor(Number(args.startHp) || 0));
  const wroteHp = Math.max(0, Math.floor(Number(args.wroteHp) || 0));
  return Math.max(0, wroteHp - startHp);
}
