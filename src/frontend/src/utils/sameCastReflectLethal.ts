/**
 * Void Mirror and Reflect Shield write player HP inside
 * `applyDamageToEnemy` before `processCombatantDeath` of that same
 * target, and never call `_handlePlayerDeath`. Killing the last
 * hostile therefore still passes `shouldAwardVictory` until the
 * HP-watch effect — hook order, not a plague/melee linchpin.
 *
 * Distinct from hitsAllies `__player__` (self-AoE after the enemy
 * list) and from #652 (enemy killing blow). Wire later: after the
 * reflect `setCharacterStats`, if lethal, run the death linchpin
 * before `processCombatantDeath`.
 *
 * Ratios match live `castHelpers.ts`. Do not change 0.25 / 0.3.
 */

import {
  hpAfterIncomingDamage,
  shouldAwardVictory,
} from "../engine/battleSetup.ts";

/** Live Void Mirror: `Math.floor(preCritDmgBM * 0.25)`. */
export const VOID_MIRROR_REFLECT_RATIO = 0.25;

/** Live Reflect Shield: `Math.floor(finalDmg * 0.3)`. */
export const REFLECT_SHIELD_RATIO = 0.3;

export function voidMirrorReflectAmount(preCritDmgBM: number): number {
  const n = Math.floor(Number(preCritDmgBM) || 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n * VOID_MIRROR_REFLECT_RATIO);
}

export function reflectShieldAmount(finalDmg: number): number {
  const n = Math.floor(Number(finalDmg) || 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n * REFLECT_SHIELD_RATIO);
}

/**
 * HP after the reflect `setCharacterStats` line. Same floor-at-0 as
 * live `Math.max(0, prev.hp - reflectAmt)`.
 */
export function playerHpAfterReflect(
  hpBefore: number,
  reflectDmg: number,
): { newHp: number; lethal: boolean } {
  const dmg = Math.max(0, Math.floor(Number(reflectDmg) || 0));
  return hpAfterIncomingDamage(hpBefore, dmg);
}

export function shouldRunReflectPlayerDeath(lethal: boolean): boolean {
  return lethal === true;
}

/**
 * Same-cast last-hostile kill + lethal reflect must not persist
 * applyRewards. Treat the reflect as deathTriggered even if the
 * HP-watch effect has not run yet.
 */
export function shouldAwardVictoryAfterSameCastReflect(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  reflectLethal: boolean;
  battleStartIdsSize: number;
  hostilesRemaining: number;
}): boolean {
  return shouldAwardVictory({
    inBattle: opts.inBattle,
    deathTriggered: opts.deathTriggered || opts.reflectLethal,
    battleStartIdsSize: opts.battleStartIdsSize,
    hostilesRemaining: opts.hostilesRemaining,
  });
}
