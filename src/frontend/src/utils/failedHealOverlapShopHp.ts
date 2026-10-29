/**
 * Failed overworld Heal persist overlapping a BuffShop Buy.
 *
 * `shouldRollbackFailedHeal` ANDs live HP and Doka against this click's
 * expected snapshot. A shop spend during `dokaHealInFlightRef` moves only
 * Doka, so the whole rollback is skipped. BuffShop `onDeductDoka` then
 * enqueues `persistAbsoluteProgress(liveHp, nextDoka)` while live HP is
 * still the unpaid heal. `resolveAbsoluteWriteHp(live, clickHp)` writes
 * that HP because both sides are the optimistic full bar.
 *
 * Production (`WorldExploration.tsx`):
 *   - Heal click sets `dokaHealInFlightRef` then persist (18420–18484).
 *   - Shop buy is not gated on that ref (17911–17937).
 *   - Heal `.then` rolls back only when AND matches (18463–18484).
 *
 * Chronology:
 * 1. World hydrated. HP 50/200. Canister Doka 100. Lock seeded 100.
 * 2. Overworld Heal. `resolveOverworldHealSpend` → nextHp 200, nextDoka 50
 *    (150 HP / 3 = 50 Doka). Optimistic HP 200, Doka 50. In-flight true.
 * 3. Escape/open Items. Buy a 50-cost shield. Live wallet still 50 so
 *    `canSpendLiveDoka` clears. Optimistic Doka 0. Shop persist queued
 *    with clickHp 200.
 * 4. Heal `saveBattleStats` returns false (unseeded skip / replica
 *    reject / transport). AND rollback sees liveDoka 0 ≠ expected 50
 *    and no-ops. Unpaid HP 200 stays on the ref.
 * 5. Shop persist runs: `resolveAbsoluteWriteHp(200, 200) = 200`,
 *    `applySpendToCommitted(100, 50) = 50`. Canister HP 200 Doka 50
 *    plus the item. Start 50/100 − shop 50 = 50/50. Unpaid +150 HP.
 *
 * Survives reload (backend HP). Repeatable on the next failed heal.
 * Distinct from **#1310** (upgrade/rename deferred debit), **#1317**
 * (jackpot_heal 200 Doka feat), **#860/#971** leftover HP stamps,
 * **#1276** inventory keep, **#1157** leftover-Doka wipe.
 *
 * Sidecar only so WX / itemShop / BuffShop / #387 / #595 stay
 * merge-clean. Restack after those PRs:
 *   - `onDeductDoka`: `shouldBeginShopSpendDuringHealPersist` before
 *     `persistAbsoluteProgress`.
 *   - Heal `.then`: `failedHealRollbackHp` / `failedHealRollbackDoka`
 *     independently (do not AND).
 *
 * Intended 1 Doka : 3 HP and shop prices are unchanged.
 */

import {
  canSpendLiveDoka,
  resolveAbsoluteWriteHp,
  shouldRollbackFailedHeal,
} from "./itemShop.ts";

export function shouldRollbackFailedHealHp(args: {
  liveHp: number;
  expectedHp: number;
}): boolean {
  const liveHp = Math.max(0, Math.floor(Number(args.liveHp) || 0));
  const expectedHp = Math.max(0, Math.floor(Number(args.expectedHp) || 0));
  return liveHp === expectedHp;
}

export function shouldRollbackFailedHealDoka(args: {
  liveDoka: number;
  expectedDoka: number;
}): boolean {
  const liveDoka = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
  const expectedDoka = Math.max(0, Math.floor(Number(args.expectedDoka) || 0));
  return liveDoka === expectedDoka;
}

/** Live WX ANDs both axes, so a shop debit skips the unpaid-HP rollback. */
export function liveWxAndsFailedHealRollback(): boolean {
  return true;
}

/**
 * Shop must not enqueue `persistAbsoluteProgress` while a heal
 * `saveBattleStats` is in flight. The shop write would land the unpaid
 * HP before the heal `.then` can restore `hpBefore`.
 */
export function shouldAllowShopSpendWhileHealPersist(
  healInFlight: boolean,
): boolean {
  return healInFlight !== true;
}

export function shouldBeginShopSpendDuringHealPersist(args: {
  healInFlight: boolean;
  liveDoka: number;
  amount: number;
}): boolean {
  if (!shouldAllowShopSpendWhileHealPersist(args.healInFlight)) {
    return false;
  }
  return canSpendLiveDoka(args.liveDoka, args.amount);
}

/** Restore `hpBefore` when this click still owns live HP. */
export function failedHealRollbackHp(args: {
  liveHp: number;
  expectedHp: number;
  hpBefore: number;
}): number | null {
  if (!shouldRollbackFailedHealHp(args)) return null;
  return Math.max(0, Math.floor(Number(args.hpBefore) || 0));
}

/** Restore `dokaBefore` when this click still owns the live wallet. */
export function failedHealRollbackDoka(args: {
  liveDoka: number;
  expectedDoka: number;
  dokaBefore: number;
}): number | null {
  if (!shouldRollbackFailedHealDoka(args)) return null;
  return Math.max(0, Math.floor(Number(args.dokaBefore) || 0));
}

export type FailedHealOverlapShopWrite = {
  canisterHp: number;
  canisterDoka: number;
  liveHp: number;
  liveDoka: number;
  shopQueued: boolean;
};

/**
 * Reproduce the live WX AND-rollback + shop persist, or the gated
 * split-axis path. Heal persist is a failed absolute write (no canister
 * mutation). Shop persist spends committed Doka and writes
 * `resolveAbsoluteWriteHp(live, clickHp)`.
 */
export function simulateFailedHealOverlapShop(args: {
  startHp: number;
  startDoka: number;
  healExpectedHp: number;
  healExpectedDoka: number;
  shopCost: number;
  gateShopWhileHealInFlight: boolean;
  splitAxisRollback: boolean;
}): FailedHealOverlapShopWrite {
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
  const shopCost = Math.max(0, Math.floor(Number(args.shopCost) || 0));

  let liveHp = healExpectedHp;
  let liveDoka = healExpectedDoka;
  let canisterHp = startHp;
  let canisterDoka = startDoka;
  let shopQueued = false;
  let shopClickHp = startHp;

  const shopAllowed = args.gateShopWhileHealInFlight
    ? shouldBeginShopSpendDuringHealPersist({
        healInFlight: true,
        liveDoka,
        amount: shopCost,
      })
    : canSpendLiveDoka(liveDoka, shopCost);

  if (shopAllowed) {
    shopQueued = true;
    shopClickHp = liveHp;
    liveDoka = Math.max(0, liveDoka - shopCost);
  }

  // Heal persist returns false. No canister write.
  // Persist-lock order: shop enqueue is already queued, so it runs
  // before the heal `.then` rollback. Writing after rollback would
  // hide the unpaid HP (`min(rolledBack, clickHp)`).
  if (shopQueued) {
    canisterHp = resolveAbsoluteWriteHp(liveHp, shopClickHp);
    canisterDoka = Math.max(0, canisterDoka - shopCost);
  }

  if (args.splitAxisRollback) {
    const nextHp = failedHealRollbackHp({
      liveHp,
      expectedHp: healExpectedHp,
      hpBefore: startHp,
    });
    if (nextHp != null) liveHp = nextHp;
    const nextDoka = failedHealRollbackDoka({
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

  return {
    canisterHp,
    canisterDoka,
    liveHp,
    liveDoka,
    shopQueued,
  };
}

/** Unpaid HP the shop persist would stamp onto the canister. */
export function leftoverUnpaidHealHp(args: {
  startHp: number;
  wroteHp: number;
}): number {
  const startHp = Math.max(0, Math.floor(Number(args.startHp) || 0));
  const wroteHp = Math.max(0, Math.floor(Number(args.wroteHp) || 0));
  return Math.max(0, wroteHp - startHp);
}
