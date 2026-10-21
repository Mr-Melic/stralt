/**
 * Summon kit DoT decide vs `executeSummonAction` applyCast.
 *
 * `decideSummonArcher` prefers Poison Arrow (`starter-poison`) and
 * `decideSummonHunter` prefers Venom Strike when Chebyshev
 * `enemyCastRangeOk` (and, for archer/hunter, `aiCanCast` LoS) says
 * yes. applyCast then:
 *   1. rejects when `currentAp < Number(apCost)`
 *   2. deals damage only when `Number(damage) > 0`
 *   3. heals when `healAmount > 0`
 *   4. else `applyEffect` with type from `effectType`, duration from
 *      `buffDuration ?? debuffDuration ?? dotDuration ?? 1`, and **no
 *      `dotDamagePerTurn`**
 *
 * Catalog Poison Arrow / Venom Strike are `damage: 0`, `isDotSpell`,
 * `dotDamagePerTurn: 4`, `dotDuration: 3`. They miss (2) and land on
 * (4). `tickDotStacks` / `processActiveEffects` ignore type-"dot"
 * rows without `dotDamagePerTurn > 0`, so a decided in-range Poison
 * spends AP and writes a 0-tick effect instead of the advertised 4
 * dmg/turn. Wolf `maxAp` 2 also cannot afford Venom's 3 AP.
 *
 * This module is that execute gate: AP + Chebyshev vs
 * `Number(spell.range)` + living opposite-side occupant, then
 * advertised `dotDamagePerTurn` / `dotDuration`. No LoS (WX / applyCast
 * skip it; hunter/archer LoS lives only in decide). Do not switch
 * range to `spellRangeBase` (would rebalance). Do not steal Inferno
 * (#799 bomber kamikaze splash / suicide). enemyAI / summonExecutor /
 * WorldExploration / targeting left untouched so older open PRs stay
 * merge-clean (#432 execute range, #762 kit AP+range, #799 bomber).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  enemyCastRangeOk,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonDotCastSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "apCost"
      | "range"
      | "spellType"
      | "damage"
      | "healAmount"
      | "effectType"
      | "isDotSpell"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "buffDuration"
      | "debuffDuration"
      | "debuffStat"
      | "buffStat"
    >
  | {
      id?: string | null;
      apCost?: unknown;
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      healAmount?: unknown;
      effectType?: string | null;
      isDotSpell?: boolean | null;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      buffDuration?: unknown;
      debuffDuration?: unknown;
      debuffStat?: string | null;
      buffStat?: string | null;
    };

export type SummonDotOccupant = CasterPosition & {
  id: string;
  hp?: number;
  side?: string;
};

export type SummonDotEffectFields = {
  type: "dot";
  targetId: string;
  dotDamagePerTurn: number;
  duration: number;
};

/** Bomber Inferno primary/splash/suicide stays in `bomberKamikazeBlast`. */
export const SUMMON_DOT_INFERNO_ID = "spell-inferno";

export function summonDotCastApCost(spell: SummonDotCastSpell): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonDotCast(
  currentAp: number,
  spell: SummonDotCastSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/** Same Chebyshev vs `Number(spell.range)` applyCast does not re-check. */
export function summonDotCastRangeOk(
  origin: CasterPosition,
  target: CasterPosition,
  spell: SummonDotCastSpell,
): boolean {
  return enemyCastRangeOk(origin, target, spell as Pick<SpellConfig, "range">);
}

/**
 * Catalog 0-damage DoT kits (Poison Arrow / Venom Strike). Inferno is
 * the same shape but owned by #799 — do not take that primary.
 */
export function isSummonDotExecuteSpell(spell: SummonDotCastSpell): boolean {
  if (spell.id === SUMMON_DOT_INFERNO_ID) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (spell.debuffStat) return false;
  if (spell.buffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const isDot =
    spell.isDotSpell === true || spell.effectType === "dot" || dpt > 0;
  return isDot && dpt > 0;
}

/** Advertised tick. Must not omit `dotDamagePerTurn` the way applyCast does. */
export function summonDotEffectFields(
  spell: SummonDotCastSpell,
  targetId: string,
): SummonDotEffectFields | null {
  if (!isSummonDotExecuteSpell(spell)) return null;
  return {
    type: "dot",
    targetId,
    dotDamagePerTurn: Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0),
    duration: Math.max(1, Math.floor(Number(spell.dotDuration) || 0)),
  };
}

/**
 * Live applyCast fallback payload — kept only to lock the drift.
 * Duration is copied; per-turn damage is not.
 */
export function summonDotLegacyApplyCastFields(
  spell: SummonDotCastSpell,
  targetId: string,
): {
  type: "buff" | "debuff" | "dot";
  targetId: string;
  duration: number;
} {
  const type =
    spell.effectType === "buff"
      ? "buff"
      : spell.effectType === "debuff"
        ? "debuff"
        : "dot";
  return {
    type,
    targetId,
    duration: Math.max(
      1,
      Math.floor(
        Number(
          spell.buffDuration ?? spell.debuffDuration ?? spell.dotDuration ?? 1,
        ) || 1,
      ),
    ),
  };
}

export function isSummonDotHostileOccupant(args: {
  occupant: SummonDotOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteSummonDotCast(args: {
  currentAp: number;
  origin: CasterPosition;
  target: CasterPosition;
  spell: SummonDotCastSpell;
  occupant: SummonDotOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isSummonDotExecuteSpell(args.spell)) return false;
  if (!canAffordSummonDotCast(args.currentAp, args.spell)) return false;
  if (!summonDotCastRangeOk(args.origin, args.target, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (args.occupant.x !== args.target.x || args.occupant.y !== args.target.y) {
    return false;
  }
  return isSummonDotHostileOccupant({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and applyCast cannot fork. */
export function shouldDecideSummonDotCast(
  args: Parameters<typeof canExecuteSummonDotCast>[0],
): boolean {
  return canExecuteSummonDotCast(args);
}

export function executeSummonDotCast(args: {
  currentAp: number;
  origin: CasterPosition;
  target: CasterPosition;
  spell: SummonDotCastSpell;
  occupant: SummonDotOccupant | null;
  casterSide: "player" | "enemy";
}): SummonDotEffectFields | null {
  if (!canExecuteSummonDotCast(args) || !args.occupant) return null;
  return summonDotEffectFields(args.spell, args.occupant.id);
}

export function summonDotHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
