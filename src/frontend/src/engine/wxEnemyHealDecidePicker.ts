/**
 * Pack-enemy `pickBestDamageSpell` vs advertised 0-damage heal+CHC kits.
 *
 * Queen `buildEnemyKit` z>=1 carries Blood Mend (`starter-heal`) and king
 * carries Rallying Cry (`spell-rallying-cry`) as `spellType: "heal"`,
 * `healAmount` 12 / 20, `buffStat: "chc"` 0.15 / 2, `range: 0`,
 * `targetType: "self"`. `inferArchetype` marks those kits healer;
 * `decideHealer` only aims at wounded *allies* (self is excluded), then
 * falls back to `decideCaster` → `pickBestDamageSpell`.
 *
 * Live `pickBestDamageSpell` (`enemyAI.ts`) filters
 * `Number(s.damage) > 0` plus damage/drain type. Blood Mend / Rallying
 * Cry never pass, so decide cannot feed the WX heal arm even after
 * #924 restacks execute CHC. Range 0 plus live WX `inRange` vs
 * `targetCell` means the decided dest **is** the caster tile (the
 * overlapping player) — do not remap a distant dest onto origin (#757).
 *
 * This module is that decide-side picker those call sites must restack
 * onto. It does **not** steal a live in-range `damage > 0` pick (#762
 * Strike / Frost / Drain). It does **not** steal an in-range 0-damage
 * DoT (#967 Inferno / Poison / Venom) or 0-damage buff (#978 Iron
 * Skin). Only when those fills are empty does it select an in-range
 * heal+CHC (first in `availableSpells` / kit order). Chebyshev vs
 * `Number(spell.range)` — do not switch to `spellRangeBase` (would
 * rebalance). No LoS (the live picker does not check LoS; healer
 * skips LoS on purpose). No AP (WX does not debit enemy AP). Execute
 * CHC writes stay on #924. Execute HP stays on #757.
 *
 * Unique vs #692 / #757 / #762 / #857 / #862 / #924 / #967 / #978.
 * WorldExploration / enemyAI / summonExecutor / targeting /
 * spellEngine / statusEffects left untouched so older open PRs stay
 * merge-clean. Restack `pickBestDamageSpell` onto
 * `pickWxEnemyBestDamageOrHealSpell` after those PRs land. Do not
 * expand #924 execute.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealDecideSpell =
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

export type WxEnemyHealDecideTile = CasterPosition;

export type WxEnemyHealDecideOccupant = WxEnemyHealDecideTile & {
  id: string;
  hp?: number;
  side?: string;
};

/**
 * Catalog range-0 self/ally kits that advertise heal plus a buff
 * (Blood Mend / Rallying Cry). Do not require `spell.name`. Buff-only
 * stays on #978. DoT stays on #967. Execute writes stay on #924.
 */
export function isWxEnemyHealDecidePickerSpell(
  spell: WxEnemyHealDecideSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (Number(spell.healAmount ?? 0) <= 0) return false;
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
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

/**
 * 0-damage DoT leftover identity (#967). Inlined so this sidecar does
 * not import that PR's file. Heal must not fill when Inferno / Poison /
 * Venom is already in range.
 */
export function isWxEnemyHealDecideBlockedDotSpell(
  spell: WxEnemyHealDecideSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/**
 * 0-damage buff leftover identity (#978). Inlined so this sidecar does
 * not import that PR's file. Heal must not fill when Iron Skin is
 * already in range.
 */
export function isWxEnemyHealDecideBlockedBuffSpell(
  spell: WxEnemyHealDecideSpell,
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
  return true;
}

/** Same `Number(spell.range)` live `pickBestDamageSpell` compares to Chebyshev. */
export function wxEnemyHealDecidePickerRange(
  spell: WxEnemyHealDecideSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/**
 * WX heal branch requires `spellRange === 0`. Ally-range heals never
 * enter it (#757). Catalog Blood Mend / Rallying Cry are range 0.
 */
export function wxEnemyHealDecidePickerRequiresZeroRange(
  spell: WxEnemyHealDecideSpell,
): boolean {
  return wxEnemyHealDecidePickerRange(spell) === 0;
}

/** Live picker range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealDecidePickerInRange(
  origin: WxEnemyHealDecideTile,
  targetCell: WxEnemyHealDecideTile,
  spell: WxEnemyHealDecideSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live `pickBestDamageSpell` candidate filter (`Number(s.damage) > 0`
 * plus damage/drain type). Blood Mend / Rallying Cry never pass.
 */
export function wxEnemyHealLivePickBestDamageSpellSelects(
  spell: WxEnemyHealDecideSpell,
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
 * then highest `Number(damage)`. Returns null for Blood Mend / Rallying
 * Cry even when dest is the caster tile.
 */
export function wxEnemyHealLivePickBestDamageSpell<
  T extends WxEnemyHealDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealDecideTile;
  targetCell: WxEnemyHealDecideTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyHealLivePickBestDamageSpellSelects(s) &&
      wxEnemyHealDecidePickerInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

function wxEnemyHealDecideOtherLeftoverInRange<
  T extends WxEnemyHealDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealDecideTile;
  targetCell: WxEnemyHealDecideTile;
}): boolean {
  return args.availableSpells.some(
    (s) =>
      (isWxEnemyHealDecideBlockedDotSpell(s) ||
        isWxEnemyHealDecideBlockedBuffSpell(s)) &&
      wxEnemyHealDecidePickerInRange(args.origin, args.targetCell, s),
  );
}

/**
 * Unique leftover: when live `damage > 0` is empty and no in-range DoT
 * (#967) or buff (#978) leftover exists, pick the first in-range
 * heal+CHC in kit / `availableSpells` order. Returns null when a
 * Strike / Frost / Drain pick is already in range so this cannot steal
 * #762.
 */
export function pickWxEnemyHealDecideSpell<
  T extends WxEnemyHealDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealDecideTile;
  targetCell: WxEnemyHealDecideTile;
}): T | null {
  if (wxEnemyHealLivePickBestDamageSpell(args) != null) return null;
  if (wxEnemyHealDecideOtherLeftoverInRange(args)) return null;
  const inRange = args.availableSpells.filter(
    (s) =>
      isWxEnemyHealDecidePickerSpell(s) &&
      wxEnemyHealDecidePickerRequiresZeroRange(s) &&
      wxEnemyHealDecidePickerInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange[0] ?? null;
}

/**
 * Restack helper for `pickBestDamageSpell`: keep the live highest-damage
 * pick when one exists, otherwise the range-0 heal leftover. Additive —
 * numbers, LoS, and AP are unchanged.
 */
export function pickWxEnemyBestDamageOrHealSpell<
  T extends WxEnemyHealDecideSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealDecideTile;
  targetCell: WxEnemyHealDecideTile;
}): T | null {
  return (
    wxEnemyHealLivePickBestDamageSpell(args) ?? pickWxEnemyHealDecideSpell(args)
  );
}

export function isWxEnemyHealDecidePickerHostile(args: {
  occupant: WxEnemyHealDecideOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyHealDecidePickerCast(args: {
  spell: WxEnemyHealDecideSpell;
  origin: WxEnemyHealDecideTile;
  targetCell: WxEnemyHealDecideTile;
  occupant: WxEnemyHealDecideOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyHealDecidePickerSpell(args.spell)) return false;
  if (!wxEnemyHealDecidePickerRequiresZeroRange(args.spell)) return false;
  if (
    !wxEnemyHealDecidePickerInRange(args.origin, args.targetCell, args.spell)
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
  return isWxEnemyHealDecidePickerHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX range-0 heal branch cannot fork. */
export function shouldDecideWxEnemyHealPickerCast(
  args: Parameters<typeof canExecuteWxEnemyHealDecidePickerCast>[0],
): boolean {
  return canExecuteWxEnemyHealDecidePickerCast(args);
}

export function wxEnemyHealPickerHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
