/**
 * Auto-summon kit casts (Shield, Iron Skin, Slow, Poison Arrow) spend AP
 * through `executeSummonAction` and call `applyEffect` with only
 * name/type/duration. `getStatModifier` and `sumDotTicks` key off `stat` /
 * `modifier` / `dotDamagePerTurn`, so advertised RES/MP/DoT never landed.
 *
 * Player-bar `resolvePlayerCast` already writes those fields. Player Enrage
 * on a summon is #699 (casterId). Player Weaken/Slow on a hostile is #528.
 * Control-mode budget ignoring Slow is #598. This helper is the AI executor
 * payload only.
 */

import type { SpellConfig } from "../types/gameTypes";
import type { ActiveEffectLike } from "./spellEngine.ts";

export type KitCastSpell = Pick<
  SpellConfig,
  | "id"
  | "name"
  | "effectType"
  | "iconEmoji"
  | "description"
  | "buffStat"
  | "buffModifier"
  | "buffDuration"
  | "debuffStat"
  | "debuffModifier"
  | "debuffDuration"
  | "isDotSpell"
  | "dotDamage"
  | "dotDamagePerTurn"
  | "dotDuration"
>;

export function kitCastEffectType(
  spell: KitCastSpell,
): ActiveEffectLike["type"] {
  if (spell.isDotSpell === true || spell.effectType === "dot") return "dot";
  if (spell.buffStat || spell.effectType === "buff") return "buff";
  if (spell.debuffStat || spell.effectType === "debuff") return "debuff";
  return "dot";
}

/**
 * Status row the kit executor must apply. Copies explicit spell metadata —
 * never spell-name heuristics.
 */
export function kitCastStatusEffect(
  spell: KitCastSpell,
  targetId: string,
): ActiveEffectLike {
  const type = kitCastEffectType(spell);
  const effect: ActiveEffectLike = {
    id: `kit-${String(spell.id ?? "spell")}-${targetId}`,
    effectName: String(spell.name ?? spell.effectType ?? "effect"),
    type,
    targetId,
    duration:
      spell.buffDuration ?? spell.debuffDuration ?? spell.dotDuration ?? 1,
    iconEmoji: spell.iconEmoji ?? "✨",
    description: spell.description ?? "",
  };
  if (type === "buff" && spell.buffStat) {
    effect.stat = spell.buffStat;
    effect.modifier = spell.buffModifier ?? 1;
  } else if (type === "debuff" && spell.debuffStat) {
    effect.stat = spell.debuffStat;
    effect.modifier = spell.debuffModifier ?? 1;
  } else if (type === "dot") {
    const ppt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
    if (Number.isFinite(ppt) && ppt > 0) effect.dotDamagePerTurn = ppt;
  }
  return effect;
}
