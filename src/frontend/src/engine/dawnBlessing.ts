/**
 * Twin Monarchs (boss 19) phase-1 Dawn blessing outcomes.
 *
 * WX consumes only `playerApModifier` and `damageToPlayer > 0`
 * (`WorldExploration.tsx` boss-ability flush). There is no
 * `playerMpModifier` on `BossAbilityResult`, so the third roll is +1 AP —
 * the live log used to say "+1 MP bonus" while AP was granted.
 *
 * Roll 1 still returns `damageToPlayer: -10` (heal). WX ignores
 * non-positive damage, so that heal does not land until a WX consumer
 * exists (MIMA-2026-09-02-006). Do not change that roll here.
 */

import type { BossAbilityResult } from "../types/bossTypes";

export type DawnBlessingRoll = 0 | 1 | 2;

/** +2 AP this turn. */
export const DAWN_BLESSING_AP_BURST = 2;
/** Intended +10 HP heal — WX does not apply negative damageToPlayer. */
export const DAWN_BLESSING_HEAL = -10;
/** +1 AP this turn (logged as AP; never MP). */
export const DAWN_BLESSING_AP_SMALL = 1;

export function dawnBlessingForRoll(roll: DawnBlessingRoll): BossAbilityResult {
  if (roll === 0) {
    return {
      playerApModifier: DAWN_BLESSING_AP_BURST,
      logMessages: ["Dawn briefly blesses you with +2 AP!"],
    };
  }
  if (roll === 1) {
    return {
      damageToPlayer: DAWN_BLESSING_HEAL,
      logMessages: ["Dawn briefly blesses you with a +10 HP heal!"],
    };
  }
  return {
    playerApModifier: DAWN_BLESSING_AP_SMALL,
    logMessages: ["Dawn briefly blesses you with +1 AP!"],
  };
}
