/**
 * Pack-enemy `pickBestDamageSpell` vs advertised 0-damage DoT kits.
 *
 * Bishop / pawn / queen+king `buildEnemyKit` carry Poison Arrow
 * (`starter-poison`), Venom Strike (`spell-venom-strike`), and Inferno
 * (`spell-inferno`) as `spellType: "damage"`, `damage: 0`, `isDotSpell`,
 * `dotDamagePerTurn` 4 / 4 / 8, `dotDuration: 3`.
 *
 * Live `pickBestDamageSpell` (`enemyAI.ts`) filters
 * `Number(s.damage) > 0` plus damage/drain type, then keeps the highest
 * `Number(damage)`. Poison / Venom / Inferno never pass, so decide
 * cannot feed the WX apply arm even after #947 restacks execute ticks.
 * Queen/king zone-2 kits are Inferno + a heal: when `decideHealer`
 * falls back to `decideCaster`, the picker returns null and the pack
 * melee-falls-through. Pawn Venom at Chebyshev 2 (Strike range 1) is
 * the same miss.
 *
 * This module is that decide-side picker those call sites must restack
 * onto. It does **not** steal a live in-range `damage > 0` pick (#762
 * Strike / Frost / Drain). Only when that filter is empty does it
 * select an in-range 0-damage DoT (highest advertised dpt). Chebyshev
 * vs `Number(spell.range)` — do not switch to `spellRangeBase` (would
 * rebalance). No LoS (the live picker does not check LoS; `aiCanCast`
 * is a later caster-only step). No AP (WX does not debit enemy AP).
 * Inferno splash stays catalog `areaRadius` 0 — bomber kamikaze radius
 * is #799. Summon applyCast ticks are #856. Heal+CHC is #924. Execute
 * tick writes are #947 (`wxEnemyDotExecute.ts`).
 *
 * Unique vs #762 / #757 / #799 / #856 / #924 / #947. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects
 * left untouched so older open PRs stay merge-clean. Restack
 * `pickBestDamageSpell` onto `pickWxEnemyBestDamageOrDotSpell` after
 * those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyDotDecideSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "effectType"
      | "isDotSpell"
      | "areaRadius"
      | "hitsMultiple"
      | "aoe"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
      id?: string;
      range?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      effectType?: string | null;
      isDotSpell?: boolean | null;
      areaRadius?: unknown;
      hitsMultiple?: boolean | null;
      aoe?: boolean | null;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type WxEnemyDotDecideTile = CasterPosition;

export type WxEnemyDotDecideOccupant = WxEnemyDotDecideTile & {
  id: string;
  hp?: number;
  side?: string;
};

/**
 * Catalog 0-damage DoT kits (Poison Arrow / Venom Strike / pack Inferno).
 * Do not require `spell.name`. Inferno stays in: this is the pack
 * `pickBestDamageSpell` miss, not bomber splash (#799) and not summon
 * applyCast (#856).
 */
export function isWxEnemyDotDecidePickerSpell(
  spell: WxEnemyDotDecideSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/** Same `Number(spell.range)` live `pickBestDamageSpell` compares to Chebyshev. */
export function wxEnemyDotDecidePickerRange(
  spell: WxEnemyDotDecideSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

export function wxEnemyDotDecidePickerDpt(
  spell: WxEnemyDotDecideSpell,
): number {
  return Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
}

/**
 * Pack Inferno is a single-target DoT (`areaRadius` 0). Do not grow
 * this to `AI_KAMIKAZE_BLAST_RADIUS` — that splash is #799.
 */
export function wxEnemyDotDecidePickerSplashRadius(
  spell: WxEnemyDotDecideSpell,
): number {
  return Math.max(0, Math.floor(Number(spell.areaRadius ?? 0)));
}

/** Live picker range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyDotDecidePickerInRange(
  origin: WxEnemyDotDecideTile,
  targetCell: WxEnemyDotDecideTile,
  spell: WxEnemyDotDecideSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live `pickBestDamageSpell` candidate filter (`Number(s.damage) > 0`
 * plus damage/drain type). Poison / Venom / Inferno never pass.
 */
export function wxEnemyLivePickBestDamageSpellSelects(
  spell: WxEnemyDotDecideSpell,
): boolean {
  const spellType = spell.spellType ?? "damage";
  const effectType = spell.effectType ?? "damage";
  return (
    Number(spell.damage ?? 0) > 0 &&
    (spellType === "damage" ||
      effectType === "damage" ||
      effectType === "drain")
  );
}

/**
 * Byte-for-byte the live picker: in-range `damage > 0` damage/drain,
 * then highest `Number(damage)`. Returns null for Poison / Venom /
 * Inferno kits even when they sit inside Chebyshev range.
 */
export function wxEnemyLivePickBestDamageSpell<
  T extends WxEnemyDotDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyDotDecideTile;
  targetCell: WxEnemyDotDecideTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyLivePickBestDamageSpellSelects(s) &&
      wxEnemyDotDecidePickerInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/**
 * Unique leftover: when live `damage > 0` is empty, pick the in-range
 * 0-damage DoT with the highest advertised dpt. Returns null when a
 * Strike / Frost / Drain pick is already in range so this cannot steal
 * #762.
 */
export function pickWxEnemyDotDecideSpell<
  T extends WxEnemyDotDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyDotDecideTile;
  targetCell: WxEnemyDotDecideTile;
}): T | null {
  if (wxEnemyLivePickBestDamageSpell(args) != null) return null;
  const inRange = args.availableSpells.filter(
    (s) =>
      isWxEnemyDotDecidePickerSpell(s) &&
      wxEnemyDotDecidePickerInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    wxEnemyDotDecidePickerDpt(s) > wxEnemyDotDecidePickerDpt(best) ? s : best,
  );
}

/**
 * Restack helper for `pickBestDamageSpell`: keep the live highest-damage
 * pick when one exists, otherwise the 0-damage DoT leftover. Additive —
 * numbers, LoS, and AP are unchanged.
 */
export function pickWxEnemyBestDamageOrDotSpell<
  T extends WxEnemyDotDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyDotDecideTile;
  targetCell: WxEnemyDotDecideTile;
}): T | null {
  return (
    wxEnemyLivePickBestDamageSpell(args) ?? pickWxEnemyDotDecideSpell(args)
  );
}

export function isWxEnemyDotDecidePickerHostile(args: {
  occupant: WxEnemyDotDecideOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyDotDecidePickerCast(args: {
  spell: WxEnemyDotDecideSpell;
  origin: WxEnemyDotDecideTile;
  targetCell: WxEnemyDotDecideTile;
  occupant: WxEnemyDotDecideOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyDotDecidePickerSpell(args.spell)) return false;
  if (
    !wxEnemyDotDecidePickerInRange(args.origin, args.targetCell, args.spell)
  ) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyDotDecidePickerHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and execute cannot fork on the picker leftover. */
export function shouldDecideWxEnemyDotPickerCast(
  args: Parameters<typeof canExecuteWxEnemyDotDecidePickerCast>[0],
): boolean {
  return canExecuteWxEnemyDotDecidePickerCast(args);
}

export function wxEnemyDotPickerHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
