/**
 * Incoming RES% after Shield / Iron Skin (and other `stat: "res"` rows).
 *
 * Enemy spell hits already multiply `characterStats.res` by
 * `getStatModifier("player", "res")`. Fallback melee (Crush / Fire Bolt)
 * used the raw persisted stat, so a spent Shield did not reduce that hit.
 */

import { type StatModifiableEffect, getStatModifier } from "./statusEffects.ts";

/**
 * Effective RES percent for an incoming hit against `targetId`.
 * Missing / non-finite base RES is 0. Buffs multiply; no matching row
 * leaves the base unchanged (`getStatModifier` returns 1).
 */
export function effectiveResistancePercent(
  baseRes: number,
  targetId: string,
  effects: readonly StatModifiableEffect[],
): number {
  const base = Math.max(0, Number(baseRes) || 0);
  return base * getStatModifier(targetId, "res", effects);
}

/**
 * Same post-RES hit as the enemy melee fallback:
 * `Math.max(1, round(raw * (1 - res/100)))`.
 */
export function incomingDamageAfterResistance(
  rawDamage: number,
  effectiveResPercent: number,
): number {
  const raw = Math.max(0, Number(rawDamage) || 0);
  const res = Number(effectiveResPercent) || 0;
  return Math.max(1, Math.round(raw * (1 - res / 100)));
}
