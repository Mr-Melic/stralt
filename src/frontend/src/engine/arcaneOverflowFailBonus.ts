/**
 * Arcane Overflow vs advertised +10 FAIL-roll fizzle on player casts.
 *
 * Registry (`mapModifiers.ts` `arcane_overflow`) announces
 *   "Arcane Overflow: AP cheaper, but spells fizzle 10% more."
 * `MAP_MODIFIER_ARCANE_OVERFLOW_FAIL_BONUS` is 10 (percentage points).
 * Player `resolvePlayerCast` FAIL-rolls first for non-physical spells:
 * `failRoll = rng() * 100`, fizzle when `failRoll < ctx.spellFailChance`.
 *
 * Live WorldExploration never does:
 * - `spellFailChance` is only
 *   `spellFailBaseChance - (level-1) * spellFailReductionPerLevel`
 *   (DEFAULT 20 at level 1). It never adds FAIL_BONUS.
 * - WX has `_isArcaneSurge` / `isPlagueZone` / `isVoidRift` and no
 *   `isArcaneOverflow`. The file never mentions `arcane_overflow`.
 * - Registry `onEffectApplication` is a separate `rng() < 0.1` veto on
 *   `applyActiveEffect` for non-dot `ActiveEffect.type` (`buff`/`debuff`).
 *   Chain Lightning never enters that hook — it FAIL-rolls, then
 *   `dealDamage`. A suppressed buff is not a `"fizzled"` result.
 *
 * AP cheaper already works: `onApCost` is `Math.max(1, base-1)` and live
 * `planPlayerCastResources` / `executeCastAttempt` / Attack Nearest /
 * highlight all call `applyApCost`. Do not restack AP here.
 *
 * Sequence: Arcane Overflow map → level-1 Chain Lightning
 * (`starter-blast`, not physical) → FAIL roll 25.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | fail chance | 30 (20+10) | 20 |
 * | failRoll 25 | `"fizzled"` | `"cast"` (20 damage lands) |
 *
 * Unique vs **#581** (0-AP Timestep under Arcane Surge — different id,
 * AP path), **#1155** (Iron Curse heal ×0.5 via effectApplication),
 * Null Field buff/debuff veto, **#1208** (Titan 1–5× damage), **#1206**
 * (summon-control Inferno remaining). Physical Strike skips the FAIL
 * roll (`isPhysical`) — not this fire. Enemy `resolveSpellCast` uses
 * `caster.stats.fail / 100`, not `spellFailChance`.
 *
 * Do not restack WorldExploration / spellEngine / mapModifiers.
 * Restack `spellFailChance` (or the FAIL compare in `resolvePlayerCast`)
 * onto `executeArcaneOverflowFailBonus` after older combat PRs land.
 * Do not undo `applyApCost`.
 */

import { MAP_MODIFIER_ARCANE_OVERFLOW_FAIL_BONUS } from "../data/gameConstants.ts";

export const ARCANE_OVERFLOW_FAIL_MODIFIER_ID = "arcane_overflow";

export type ArcaneOverflowFailBonusExecute = {
  failChance: number;
  fizzled: boolean;
};

export function isArcaneOverflowFailModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === ARCANE_OVERFLOW_FAIL_MODIFIER_ID;
}

/**
 * Advertised FAIL chance: live level formula plus +10 when overflow is
 * active. Missing / negative bases yield 0 so a NaN config cannot mint
 * a 100% fizzle.
 */
export function advertisedSpellFailChance(
  baseFailChance: number,
  modifierActive: boolean,
): number {
  const base = Number(baseFailChance);
  if (!Number.isFinite(base) || base < 0) return 0;
  if (modifierActive !== true) return base;
  return base + MAP_MODIFIER_ARCANE_OVERFLOW_FAIL_BONUS;
}

/** Live WX spellFailChance never adds FAIL_BONUS. */
export function liveWxSpellFailChanceIncludesOverflowBonus(): boolean {
  return false;
}

/** Live resolvePlayerCast compares failRoll to ctx.spellFailChance only. */
export function wxPlayerFailRollUsesOverflowBonus(): boolean {
  return false;
}

/**
 * Registry onEffectApplication 10% is a buff/debuff apply veto, not the
 * FAIL roll. Chain Lightning never calls it.
 */
export function wxChainLightningUsesEffectApplicationFizzle(): boolean {
  return false;
}

/** Physical Strike skips the FAIL roll. Not this execute. */
export function wxPhysicalStrikeFailRolls(): boolean {
  return false;
}

export function canExecuteArcaneOverflowFailBonus(args: {
  modifierActive: boolean;
  isPhysical: boolean;
  baseFailChance: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  if (args.isPhysical === true) return false;
  const base = Number(args.baseFailChance);
  return Number.isFinite(base) && base >= 0;
}

/** Alias so decide and the FAIL-roll restack cannot fork. */
export function shouldDecideArcaneOverflowFailBonus(
  args: Parameters<typeof canExecuteArcaneOverflowFailBonus>[0],
): boolean {
  return canExecuteArcaneOverflowFailBonus(args);
}

export function arcaneOverflowHighlightedFailIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised FAIL_BONUS onto the player FAIL compare. Physical
 * packets and a missing modifier return null. AP discount / heal / buff
 * veto / Titan roll are not in this payload.
 */
export function executeArcaneOverflowFailBonus(args: {
  modifierActive: boolean;
  isPhysical: boolean;
  baseFailChance: number;
  failRoll: number;
}): ArcaneOverflowFailBonusExecute | null {
  if (!canExecuteArcaneOverflowFailBonus(args)) return null;
  const roll = Number(args.failRoll);
  if (!Number.isFinite(roll)) return null;
  const failChance = advertisedSpellFailChance(args.baseFailChance, true);
  return { failChance, fizzled: roll < failChance };
}
