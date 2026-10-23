/**
 * Pack-enemy `pickBestDamageSpell` vs advertised 0-damage buff kits.
 *
 * Rook `buildEnemyKit` z>=1 carries Iron Skin (`spell-iron-skin`) as
 * `spellType: "damage"`, `damage: 0`, `buffStat: "res"`, `buffModifier`
 * 1.3, `buffDuration: 3`, `targetType: "ally"`, Chebyshev range 3.
 * Catalog Shield / Haste / Enrage share that shape.
 *
 * Live `pickBestDamageSpell` (`enemyAI.ts`) filters
 * `Number(s.damage) > 0` plus damage/drain type, then keeps the highest
 * `Number(damage)`. Iron Skin never passes, so decide cannot feed the
 * WX apply arm even after #974 restacks execute. At Chebyshev 2–3
 * Strike is out of range (`Number(range)` 1) and the picker returns
 * null, so the pack melee-falls-through instead of buffing own RES.
 *
 * This module is that decide-side picker those call sites must restack
 * onto. It does **not** steal a live in-range `damage > 0` pick (#762
 * Strike / Frost / Drain). Only when that filter is empty does it
 * select an in-range 0-damage buff (first in `availableSpells` order —
 * kit order). Chebyshev vs `Number(spell.range)` — do not switch to
 * `spellRangeBase` (would rebalance). No LoS (the live picker does not
 * check LoS). No AP (WX does not debit enemy AP). Pack dest is the
 * resolved player / player-side summon; advertised Iron Skin is
 * "Buff own RES" so execute (#974) lands on the caster. This leftover
 * is decide only — do not write ActiveEffect rows here.
 *
 * Unique vs #762 / #757 / #843 / #865 / #924 / #947 / #967 / #972 /
 * #974. WorldExploration / enemyAI / summonExecutor / targeting /
 * spellEngine / statusEffects left untouched so older open PRs stay
 * merge-clean. Restack `pickBestDamageSpell` onto
 * `pickWxEnemyBestDamageOrBuffSpell` after those PRs land. Do not
 * expand #974 execute.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyBuffDecideSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "buffModifier"
      | "buffDuration"
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
      buffModifier?: unknown;
      buffDuration?: unknown;
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

export type WxEnemyBuffDecideTile = CasterPosition;

export type WxEnemyBuffDecideOccupant = WxEnemyBuffDecideTile & {
  id: string;
  hp?: number;
  side?: string;
};

/**
 * Catalog 0-damage self/ally kits that advertise a buff and do not
 * heal (Iron Skin / Shield / Haste / Enrage). Do not require
 * `spell.name`. Heal+buff stays on #924. DoT stays on #967. Execute
 * writes stay on #974.
 */
export function isWxEnemyBuffDecidePickerSpell(
  spell: WxEnemyBuffDecideSpell,
): boolean {
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** Same `Number(spell.range)` live `pickBestDamageSpell` compares to Chebyshev. */
export function wxEnemyBuffDecidePickerRange(
  spell: WxEnemyBuffDecideSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyBuffDecidePickerInRange(
  origin: WxEnemyBuffDecideTile,
  targetCell: WxEnemyBuffDecideTile,
  spell: WxEnemyBuffDecideSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live `pickBestDamageSpell` candidate filter (`Number(s.damage) > 0`
 * plus damage/drain type). Iron Skin never passes.
 */
export function wxEnemyBuffLivePickBestDamageSpellSelects(
  spell: WxEnemyBuffDecideSpell,
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
 * then highest `Number(damage)`. Returns null for Iron Skin / Shield /
 * Haste / Enrage even when they sit inside Chebyshev range.
 */
export function wxEnemyBuffLivePickBestDamageSpell<
  T extends WxEnemyBuffDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyBuffDecideTile;
  targetCell: WxEnemyBuffDecideTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyBuffLivePickBestDamageSpellSelects(s) &&
      wxEnemyBuffDecidePickerInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/**
 * Unique leftover: when live `damage > 0` is empty, pick the first
 * in-range 0-damage buff in kit / `availableSpells` order. Returns
 * null when a Strike / Frost / Drain pick is already in range so this
 * cannot steal #762.
 */
export function pickWxEnemyBuffDecideSpell<
  T extends WxEnemyBuffDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyBuffDecideTile;
  targetCell: WxEnemyBuffDecideTile;
}): T | null {
  if (wxEnemyBuffLivePickBestDamageSpell(args) != null) return null;
  const inRange = args.availableSpells.filter(
    (s) =>
      isWxEnemyBuffDecidePickerSpell(s) &&
      wxEnemyBuffDecidePickerInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange[0] ?? null;
}

/**
 * Restack helper for `pickBestDamageSpell`: keep the live highest-damage
 * pick when one exists, otherwise the 0-damage buff leftover. Additive —
 * numbers, LoS, and AP are unchanged.
 */
export function pickWxEnemyBestDamageOrBuffSpell<
  T extends WxEnemyBuffDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyBuffDecideTile;
  targetCell: WxEnemyBuffDecideTile;
}): T | null {
  return (
    wxEnemyBuffLivePickBestDamageSpell(args) ?? pickWxEnemyBuffDecideSpell(args)
  );
}

export function isWxEnemyBuffDecidePickerHostile(args: {
  occupant: WxEnemyBuffDecideOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyBuffDecidePickerCast(args: {
  spell: WxEnemyBuffDecideSpell;
  origin: WxEnemyBuffDecideTile;
  targetCell: WxEnemyBuffDecideTile;
  occupant: WxEnemyBuffDecideOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyBuffDecidePickerSpell(args.spell)) return false;
  if (
    !wxEnemyBuffDecidePickerInRange(args.origin, args.targetCell, args.spell)
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
  return isWxEnemyBuffDecidePickerHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX 0-damage buff branch cannot fork. */
export function shouldDecideWxEnemyBuffPickerCast(
  args: Parameters<typeof canExecuteWxEnemyBuffDecidePickerCast>[0],
): boolean {
  return canExecuteWxEnemyBuffDecidePickerCast(args);
}

export function wxEnemyBuffPickerHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
