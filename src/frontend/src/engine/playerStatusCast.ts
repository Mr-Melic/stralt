/**
 * Player debuff-only casts (Weaken / Slow).
 *
 * Highlight paints a living hostile for `targetType: "enemy"`. Execute used
 * to enter the damage loop with `damage === 0`, so `calcScaledDamageInline`
 * floored to 1 and `applyEffect` never ran. Enemy AI (`resolveSpellCast`)
 * and summon-kit 0-damage casts already apply `debuffStat`. These helpers
 * are the single “does this highlighted hostile resolve the advertised
 * debuff?” check so preview and effect resolution cannot fork.
 *
 * Damage+debuff spells (Frost Bolt, Frost Nova) are left on the damage
 * loop — applying a new slow there would rebalance those kits.
 */

import { formatBattleEffectMagnitude } from "./statusEffects.ts";

export type PlayerDebuffOnlySpell = {
  damage?: unknown;
  debuffStat?: string;
  debuffModifier?: number;
  debuffDuration?: unknown;
  hitsMultiple?: boolean;
  aoe?: boolean;
  isDotSpell?: boolean;
  isMark?: boolean;
  isSwap?: boolean;
  isSacrifice?: boolean;
  isBarrier?: boolean;
  isSummon?: boolean;
  name?: string;
  iconEmoji?: string;
};

export function playerDebuffOnlyResolves(
  spell: PlayerDebuffOnlySpell,
): boolean {
  if (!spell.debuffStat) return false;
  const duration = Math.floor(Number(spell.debuffDuration) || 0);
  if (!(duration > 0)) return false;
  if (Number(spell.damage) > 0) return false;
  if (spell.hitsMultiple === true || spell.aoe === true) return false;
  if (spell.isDotSpell === true) return false;
  if (spell.isMark === true) return false;
  if (spell.isSwap === true) return false;
  if (spell.isSacrifice === true) return false;
  if (spell.isBarrier === true) return false;
  if (spell.isSummon === true) return false;
  return true;
}

export function playerDebuffResolvesOnHostile(
  spell: PlayerDebuffOnlySpell,
  hasLivingHostile: boolean,
): boolean {
  return hasLivingHostile === true && playerDebuffOnlyResolves(spell);
}

export type PlayerDebuffEffect = {
  effectName: string;
  type: "debuff";
  targetId: string;
  stat?: string;
  modifier?: number;
  duration: number;
  iconEmoji: string;
  description: string;
};

export function buildPlayerDebuffEffect(
  spell: PlayerDebuffOnlySpell,
  targetId: string,
): PlayerDebuffEffect {
  const duration = Math.max(1, Math.floor(Number(spell.debuffDuration) || 0));
  return {
    effectName: spell.name ?? "Debuff",
    type: "debuff",
    targetId,
    stat: spell.debuffStat,
    modifier: spell.debuffModifier,
    duration,
    iconEmoji: spell.iconEmoji || "💀",
    description: `${spell.name ?? "Debuff"} debuff`,
  };
}

export function playerDebuffOnlyLogLine(spell: PlayerDebuffOnlySpell): string {
  const stat = spell.debuffStat ?? "";
  const modifier = Number(spell.debuffModifier);
  const duration = Math.max(1, Math.floor(Number(spell.debuffDuration) || 0));
  const mag = Number.isFinite(modifier)
    ? formatBattleEffectMagnitude(stat, modifier)
    : "";
  return `${spell.name}: ${mag} ${stat.toUpperCase()} for ${duration} turns!`;
}

export type PlayerDebuffOnlyDecision =
  | { action: "skip" }
  | { action: "abort"; reason: "no_hostile" }
  | {
      action: "apply";
      targetId: string;
      effect: PlayerDebuffEffect;
      logLine: string;
    };

/**
 * Highlight/live already decided the tile. This is the effect-resolution
 * half: a living hostile applies the advertised debuff; empty/corpse tiles
 * abort (no AP) the way drain does; damage kits skip so Frost Bolt stays
 * on the damage loop.
 */
export function decidePlayerDebuffOnlyCast(
  spell: PlayerDebuffOnlySpell,
  targetEnemy: { id: string } | null | undefined,
): PlayerDebuffOnlyDecision {
  if (!playerDebuffOnlyResolves(spell)) return { action: "skip" };
  if (!targetEnemy) return { action: "abort", reason: "no_hostile" };
  return {
    action: "apply",
    targetId: targetEnemy.id,
    effect: buildPlayerDebuffEffect(spell, targetEnemy.id),
    logLine: playerDebuffOnlyLogLine(spell),
  };
}
