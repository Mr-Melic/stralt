/**
 * Boss kit self-buffs (Iron Skin / Enrage / Haste / Shield) ignore
 * advertised `buffStat`.
 *
 * Catalog Iron Skin: `buffStat: "res"`, `buffModifier: 1.3`,
 * `buffDuration: 3`, `spellType: "damage"`, `damage: 0`. Alabaster
 * Fortress phase-2 first-id is Iron Skin, so every phase-2 turn picks it.
 *
 * Kit apply self-buff arm (`WorldExploration` ~15947) requires
 * `bossSpellType !== "damage"` (and not drain/heal), then writes
 * `stat: bossSpell.debuffStat ?? "atk"` — never `buffStat`. Iron Skin /
 * Enrage / Haste / Shield all stamp `spellType: "damage"` with 0 damage,
 * so the arm is skipped and the advertised RES/DMG/MP buff never lands.
 * Dest occupancy leftover (#1280) still walks the caster onto the player.
 *
 * After #1323 Inferno CD, Countess phase-2 falls through to Enrage
 * (`phase2SpellIds[1]`) and that Enrage is the same no-op.
 *
 * Sequence: Alabaster Fortress phase 2 → advertised Iron Skin +30% RES
 * for 3 turns on the boss; live leftover 0 RES buff, then dest occupancy.
 *
 * Unique vs:
 * - **#1280** kit caster dest occupancy (move, not the missing buff)
 * - **#1323** kit Inferno CD 3 (pick-path empty Map, not buff apply)
 * - **#1200** Iron Curse player RES (map modifier, not kit Iron Skin)
 * - **#1262** boss kit SR soak (incoming SR, not outgoing self-buff)
 *
 * Do not restack WorldExploration / useBossAI / spellEngine. Restack kit
 * apply onto `advertisedKitSelfBuffEffect` after older combat PRs land.
 * Do not change Iron Skin 1.3 / Enrage 1.4 / Haste +2 (balance).
 */

import type { ActiveEffect } from "../types/gameTypes.ts";

export const SPELL_IRON_SKIN_ID = "spell-iron-skin";
export const SPELL_ENRAGE_ID = "spell-enrage";
export const SPELL_HASTE_ID = "spell-haste";
export const SPELL_SHIELD_ID = "starter-shield";

export const ALABASTER_FORTRESS_ID = "alabaster_fortress";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const ALABASTER_FORTRESS_PHASE2_KIT_FIRST_ID = SPELL_IRON_SKIN_ID;

export const CRIMSON_COUNTESS_ID = "crimson_countess";

/** Phase-2 second kit id — Inferno CD 3 leftover (#1323) falls through here. */
export const CRIMSON_COUNTESS_PHASE2_ENRAGE_ID = SPELL_ENRAGE_ID;

export const IRON_SKIN_BUFF_STAT = "res";
export const IRON_SKIN_BUFF_MODIFIER = 1.3;
export const IRON_SKIN_BUFF_DURATION = 3;

export const ENRAGE_BUFF_STAT = "dmg";
export const ENRAGE_BUFF_MODIFIER = 1.4;
export const ENRAGE_BUFF_DURATION = 2;

export const HASTE_BUFF_STAT = "mp";
export const HASTE_BUFF_MODIFIER = 2;
export const HASTE_BUFF_DURATION = 1;

export const SHIELD_BUFF_STAT = "res";
export const SHIELD_BUFF_MODIFIER = 1.3;
export const SHIELD_BUFF_DURATION = 3;

export type KitSelfBuffSpell = {
  id?: string;
  spellType?: string;
  targetType?: string;
  damage?: unknown;
  buffStat?: string;
  buffModifier?: number;
  buffDuration?: number;
  debuffStat?: string;
  debuffModifier?: number;
  debuffDuration?: number;
  dotDamagePerTurn?: number;
  dotDamage?: number;
};

export type KitSelfBuffEffect = {
  stat: string;
  modifier: number;
  duration: number;
  targetId: string;
};

/**
 * Live leftover — kit self-buff arm is gated on `spellType !== "damage"`.
 * Catalog Iron Skin / Enrage / Haste / Shield all stamp `spellType: "damage"`.
 */
export function liveWxKitSelfBuffRequiresNonDamageSpellType(): boolean {
  return true;
}

/**
 * Live leftover — when the arm does run, it uses `debuffStat ?? "atk"`,
 * never `buffStat`.
 */
export function liveWxKitSelfBuffReadsBuffStat(): boolean {
  return false;
}

/**
 * Mirror of the live kit apply self-buff predicate + payload. Returns
 * null for every catalog self-buff (spellType damage, 0 damage).
 */
export function liveWxKitSelfBuffEffect(
  spell: KitSelfBuffSpell,
  bossId: string,
): KitSelfBuffEffect | null {
  const bossSpellType = spell.spellType ?? "damage";
  if (
    bossSpellType === "damage" ||
    bossSpellType === "drain" ||
    bossSpellType === "heal"
  ) {
    return null;
  }
  if (spell.debuffStat) return null;
  if (spell.dotDamagePerTurn ?? spell.dotDamage) return null;
  if (spell.targetType !== "self" && spell.targetType !== "ally") {
    return null;
  }
  return {
    stat: spell.debuffStat ?? "atk",
    modifier: spell.debuffModifier ?? 1,
    duration: spell.debuffDuration ?? 3,
    targetId: bossId,
  };
}

/**
 * Advertised kit self-buff: apply catalog `buffStat` / `buffModifier` /
 * `buffDuration` on the boss. Same fields player Shield uses
 * (`resolvePlayerCast` isShieldSpell). Multipliers stay 1.3 / 1.4 / +2.
 */
export function advertisedKitSelfBuffEffect(
  spell: KitSelfBuffSpell,
  bossId: string,
): KitSelfBuffEffect | null {
  const stat = spell.buffStat;
  const modifier = Number(spell.buffModifier);
  if (typeof stat !== "string" || stat.length === 0) return null;
  if (!Number.isFinite(modifier)) return null;
  const durationRaw = Number(spell.buffDuration);
  const duration =
    Number.isFinite(durationRaw) && durationRaw > 0 ? durationRaw : 3;
  return {
    stat,
    modifier,
    duration,
    targetId: bossId,
  };
}

export function kitSelfBuffAsActiveEffect(
  effect: KitSelfBuffEffect,
  effectName: string,
): ActiveEffect {
  return {
    id: `boss-buff-${effect.stat}`,
    effectName,
    type: "buff",
    targetId: effect.targetId,
    stat: effect.stat,
    modifier: effect.modifier,
    duration: effect.duration,
    iconEmoji: "",
    description: `${effectName} active`,
  };
}
