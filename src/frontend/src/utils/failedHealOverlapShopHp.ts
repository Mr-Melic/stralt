/**
 * Overworld Doka→HP heal sets live HP/Doka, then awaits
 * `persistAbsoluteProgress`. `shouldRollbackFailedHeal` ANDs HP and Doka,
 * so a BuffShop Buy that moves the wallet during that await skips the
 * whole rollback. Shop `persistAbsoluteProgress` then writes
 * `resolveAbsoluteWriteHp(live, clickHp)` — live is still the unpaid
 * heal — and the extra HP survives reload.
 *
 * Chronology:
 * 1. World hydrated. HP 50/200. Canister Doka 100. Lock seeded 100.
 * 2. Heal click (1 Doka : 3 HP). Optimistic HP 200, Doka 50. Persist in flight.
 * 3. BuffShop Buy 50 while `dokaHealInFlightRef` is true. UI Doka 0.
 *    Shop enqueue captures newHp=200.
 * 4. Heal `saveBattleStats` returns false (unseeded / reject / transport).
 *    AND-rollback sees liveDoka 0 ≠ 50 and skips. HP stays 200.
 * 5. Shop persist writes HP 200, Doka 50. Canister never took the heal
 *    spend. Unique leftover: +150 HP. Repeatable on the next failed heal.
 *
 * Distinct from **#1310** (upgrade/rename deferred UI debit so shop
 * affordability passes), **#1317** (jackpot_heal feat before persist),
 * **#860** / **#971** remount leftover HP/heal stamps.
 *
 * Gates:
 * - Rollback HP when live HP still matches this click, even if Doka moved.
 * - Rollback Doka when live Doka still matches this click, even if HP moved.
 * - BuffShop must not enqueue while heal persist is in flight.
 *
 * `WorldExploration.tsx`, `itemShop.ts`, `progressPersist.ts`, and
 * **#387** / **#595** / **#1310** / **#1317** occupy WX, so this PR
 * does not restack them. Tests lock ungated leftover vs the gated
 * persist. Restack WX after those PRs:
 *   - heal `.then`: `shouldRollbackFailedHealHp` / `Doka` independently
 *   - BuffShop `onDeductDoka`: `shouldAllowShopSpendWhileHealPersist`
 * Distinct from **#1317** sidecar (jackpot feat on banner).
 * `itemShop.ts` `shouldRollbackFailedHeal` AND stays for older tests.
 * No Motoko.
 */

import { shouldRollbackFailedHeal, shouldStartDokaHeal } from "./itemShop.ts";

export const FAILED_HEAL_OVERLAP_PRE_HP = 50;
export const FAILED_HEAL_OVERLAP_MAX_HP = 200;
export const FAILED_HEAL_OVERLAP_PRE_DOKA = 100;
export const FAILED_HEAL_OVERLAP_SHOP_COST = 50;

/** Live WX still ANDs both axes (`shouldRollbackFailedHeal`). */
export function liveWxAndsHealRollbackAxes(): boolean {
  return true;
}

export function shouldRollbackFailedHealHp(args: {
  liveHp: number;
  expectedHp: number;
}): boolean {
  const liveHp = Math.floor(Number(args.liveHp) || 0);
  const expectedHp = Math.floor(Number(args.expectedHp) || 0);
  return liveHp === expectedHp;
}

export function shouldRollbackFailedHealDoka(args: {
  liveDoka: number;
  expectedDoka: number;
}): boolean {
  const liveDoka = Math.floor(Number(args.liveDoka) || 0);
  const expectedDoka = Math.floor(Number(args.expectedDoka) || 0);
  return liveDoka === expectedDoka;
}

/** BuffShop Buy must not enqueue while Heal's saveBattleStats is in flight. */
export function shouldAllowShopSpendWhileHealPersist(
  healInFlight: boolean,
): boolean {
  return healInFlight !== true;
}

export function leftoverUnpaidHealHpAfterFailedPersistOverlapShop(args: {
  persistOk: boolean;
  liveHp: number;
  liveDoka: number;
  expectedHp: number;
  expectedDoka: number;
  shopWroteHp: number;
  preHp: number;
  ungatedAndRollback: boolean;
}): boolean {
  if (args.persistOk) return false;
  if (args.ungatedAndRollback !== true) return false;
  if (
    shouldRollbackFailedHeal({
      liveHp: args.liveHp,
      liveDoka: args.liveDoka,
      expectedHp: args.expectedHp,
      expectedDoka: args.expectedDoka,
    })
  ) {
    return false;
  }
  return args.shopWroteHp > args.preHp;
}

export type FailedHealOverlapShopResult = {
  ok: boolean;
  wroteHp: number;
  wroteDoka: number;
};

/**
 * Heal persist then overlapping shop persist. Call this instead of the
 * AND-rollback when restacking WorldExploration.
 *
 * `false` / throw fail-closed: roll HP back when this click still owns it,
 * then let shop write `min(live, clickHp)`.
 */
export async function persistHealThenShopThroughHpGate(args: {
  persistHeal: () => Promise<boolean>;
  persistShop: (hp: number, doka: number) => Promise<boolean>;
  liveHp: { current: number };
  liveDoka: { current: number };
  healHp: number;
  healDoka: number;
  preHp: number;
  preDoka: number;
  shopCost: number;
  healInFlight: boolean;
}): Promise<FailedHealOverlapShopResult> {
  const shopCost = Math.max(0, Math.floor(Number(args.shopCost) || 0));
  try {
    if (!shouldAllowShopSpendWhileHealPersist(args.healInFlight)) {
      const ok = await args.persistHeal();
      if (!ok) {
        if (
          shouldRollbackFailedHealHp({
            liveHp: args.liveHp.current,
            expectedHp: args.healHp,
          })
        ) {
          args.liveHp.current = args.preHp;
        }
        if (
          shouldRollbackFailedHealDoka({
            liveDoka: args.liveDoka.current,
            expectedDoka: args.healDoka,
          })
        ) {
          args.liveDoka.current = args.preDoka;
        }
      }
      return {
        ok,
        wroteHp: args.liveHp.current,
        wroteDoka: args.liveDoka.current,
      };
    }
    const ok = await args.persistHeal();
    if (!ok) {
      if (
        shouldRollbackFailedHealHp({
          liveHp: args.liveHp.current,
          expectedHp: args.healHp,
        })
      ) {
        args.liveHp.current = args.preHp;
      }
      if (
        shouldRollbackFailedHealDoka({
          liveDoka: args.liveDoka.current,
          expectedDoka: args.healDoka,
        })
      ) {
        args.liveDoka.current = args.preDoka;
      }
    }
    const nextDoka = Math.max(0, args.liveDoka.current - shopCost);
    args.liveDoka.current = nextDoka;
    const shopOk = await args.persistShop(args.liveHp.current, nextDoka);
    return {
      ok: ok && shopOk,
      wroteHp: args.liveHp.current,
      wroteDoka: args.liveDoka.current,
    };
  } catch {
    if (
      shouldRollbackFailedHealHp({
        liveHp: args.liveHp.current,
        expectedHp: args.healHp,
      })
    ) {
      args.liveHp.current = args.preHp;
    }
    return {
      ok: false,
      wroteHp: args.liveHp.current,
      wroteDoka: args.liveDoka.current,
    };
  }
}

/** Official Heal click still starts from the live wallet / missing HP. */
export function officialHealClickStillPaysFromLiveWallet(): boolean {
  return shouldStartDokaHeal({
    currentHp: FAILED_HEAL_OVERLAP_PRE_HP,
    maxHp: FAILED_HEAL_OVERLAP_MAX_HP,
    liveDoka: FAILED_HEAL_OVERLAP_PRE_DOKA,
  });
}
