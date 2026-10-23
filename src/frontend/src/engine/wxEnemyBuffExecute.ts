/**
 * WorldExploration pack-enemy 0-damage buff advertised fields vs the
 * damage-then-stop apply arm.
 *
 * Rook `buildEnemyKit` z>=1 carries Iron Skin (`spell-iron-skin`) as
 * `spellType: "damage"`, `damage: 0`, `buffStat: "res"`, `buffModifier`
 * 1.3, `buffDuration: 3`, `targetType: "ally"`, Chebyshev range 3.
 * Catalog Shield / Haste / Enrage share that shape.
 *
 * After dest commit, pack WX fires (WorldExploration enemy apply block):
 *   1. inRange && (spellType damage|drain) && Number(damage) > 0
 *      → `wxEnemyCastExecute.ts` (#762)
 *   2. else if inRange && spellType === "heal" && Number(range) === 0
 *      → `enemyHealExecute.ts` (#757) / heal+CHC (#924)
 *   3. else if inRange && debuffStat && debuffDuration
 *      → standalone Slow / Weaken (#762)
 *
 * There is no fourth buff arm. `didAct` stays false, so a decided
 * in-range 0-damage Iron Skin falls through to adjacent melee. WX never
 * reads `buffStat` (boss apply uses `debuffStat ?? "atk"` — #843; summon
 * applyCast omits `stat` — #865). Pack dest is the resolved player /
 * player-side summon; advertised Iron Skin is "Buff own RES", so the
 * payload lands on the caster, not the dest.
 *
 * `pickBestDamageSpell` also filters `Number(s.damage) > 0`, so live
 * decide never selects these kits either. This module is the execute
 * gate those pickers must restack onto: `shouldDecideWxEnemyBuffCast`
 * === `canExecuteWxEnemyBuffCast` (Chebyshev vs `Number(spell.range)`
 * on the decided dest, living opposite-side occupant, no LoS, no AP —
 * WX does not debit enemy AP here). Do not switch to `spellRangeBase`
 * (would rebalance). Do not steal Strike damage, Slow debuff, Blood
 * Mend CHC, Inferno ticks (#947), Drain, Frost Bolt / Nova, boss WX
 * buff (#843), or summon Shield-on-ward (#865). Do not require
 * `spell.name` or `spellType === "buff"` (catalog uses `"damage"`).
 *
 * Unique vs #762 / #757 / #843 / #865 / #924 / #947 / #967 / #972.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine
 * / statusEffects left untouched so older open PRs stay merge-clean.
 * Restack the WX apply arm onto `executeWxEnemyBuffCast` after those
 * PRs land. Next leftover: pack `pickBestDamageSpell` 0-damage buff
 * skip (`wxEnemyBuffDecidePicker.ts`); do not expand this PR.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyBuffSpell =
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

export type WxEnemyBuffTile = CasterPosition;

export type WxEnemyBuffOccupant = WxEnemyBuffTile & {
  id: string;
  hp?: number;
  side?: string;
};

export type WxEnemyBuffEffectFields = {
  type: "buff";
  targetId: string;
  stat: string;
  modifier: number;
  duration: number;
};

export type WxEnemyBuffExecute = WxEnemyBuffEffectFields & {
  tile: WxEnemyBuffTile;
};

export type WxEnemyBuffLiveKind = "damage" | "heal" | "debuff" | "buff";

/**
 * Catalog 0-damage self/ally kits that advertise a buff and do not
 * heal (Iron Skin / Shield / Haste / Enrage). Do not require
 * `spell.name`. Heal+buff stays on #924. DoT stays on #947.
 */
export function isWxEnemyBuffExecuteSpell(spell: WxEnemyBuffSpell): boolean {
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

/** Same `Number(spell.range)` the WX `inRange` Chebyshev gate uses. */
export function wxEnemyBuffExecuteRange(spell: WxEnemyBuffSpell): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/**
 * Live WX `inRange` is Chebyshev vs `Number(spell.range)` from the
 * post-move tile to `targetCell`. No LoS (WX skips it).
 */
export function wxEnemyBuffInRange(
  origin: WxEnemyBuffTile,
  targetCell: WxEnemyBuffTile,
  spell: WxEnemyBuffSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Pack WX has no ally-target buff dest. Advertised Iron Skin / Haste /
 * Enrage are "Buff own …"; Shield in a pack kit would still land on
 * the caster. Do not reuse summon ward targeting (#865).
 */
export function wxEnemyBuffApplyCell(
  origin: WxEnemyBuffTile,
  _targetCell: WxEnemyBuffTile,
): WxEnemyBuffTile {
  return { x: origin.x, y: origin.y };
}

/**
 * Live `pickBestDamageSpell` candidate filter (`Number(s.damage) > 0`
 * plus damage/drain type). Iron Skin never passes, so decide cannot
 * feed the WX apply arm even after execute is restacked.
 */
export function wxEnemyLiveDamagePickerWouldSelect(
  spell: WxEnemyBuffSpell,
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
 * Live WX enemy apply if / else-if order for the branches this module
 * observes. 0-damage buffs miss every arm and yield `[]` (fallback melee).
 */
export function wxEnemyBuffLiveKinds(
  spell: WxEnemyBuffSpell,
): WxEnemyBuffLiveKind[] {
  const spellType = spell.spellType ?? "damage";
  if (
    (spellType === "damage" || spellType === "drain") &&
    Number(spell.damage ?? 0) > 0
  ) {
    return ["damage"];
  }
  if (spellType === "heal" && wxEnemyBuffExecuteRange(spell) === 0) {
    return ["heal"];
  }
  if (spell.debuffStat && spell.debuffDuration) {
    return ["debuff"];
  }
  return [];
}

export function wxEnemyBuffAdvertisedKinds(
  spell: WxEnemyBuffSpell,
): WxEnemyBuffLiveKind[] {
  if (!isWxEnemyBuffExecuteSpell(spell)) {
    return wxEnemyBuffLiveKinds(spell);
  }
  return ["buff"];
}

/** Advertised RES / DMG / MP payload. Must not use `debuffStat ?? "atk"`. */
export function wxEnemyBuffEffectFields(
  spell: WxEnemyBuffSpell,
  casterId: string,
): WxEnemyBuffEffectFields | null {
  if (!isWxEnemyBuffExecuteSpell(spell) || !spell.buffStat) return null;
  if (!casterId) return null;
  return {
    type: "buff",
    targetId: casterId,
    stat: spell.buffStat,
    modifier: Number(spell.buffModifier ?? 1),
    duration: Math.max(1, Math.floor(Number(spell.buffDuration) || 0)),
  };
}

/**
 * Live WX payload — kept only to lock the drift. 0-damage buffs write
 * no ActiveEffect row (no pack buff arm).
 */
export function wxEnemyBuffLegacyApplyFields(
  spell: WxEnemyBuffSpell,
): WxEnemyBuffEffectFields | null {
  if (!isWxEnemyBuffExecuteSpell(spell)) return null;
  return null;
}

export function wxEnemyBuffFallsThroughToMelee(
  spell: WxEnemyBuffSpell,
): boolean {
  return (
    isWxEnemyBuffExecuteSpell(spell) && wxEnemyBuffLiveKinds(spell).length === 0
  );
}

export function isWxEnemyBuffHostileOccupant(args: {
  occupant: WxEnemyBuffOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyBuffCast(args: {
  spell: WxEnemyBuffSpell;
  origin: WxEnemyBuffTile;
  targetCell: WxEnemyBuffTile;
  occupant: WxEnemyBuffOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyBuffExecuteSpell(args.spell)) return false;
  if (!wxEnemyBuffInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyBuffHostileOccupant({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX 0-damage buff branch cannot fork. */
export function shouldDecideWxEnemyBuffCast(
  args: Parameters<typeof canExecuteWxEnemyBuffCast>[0],
): boolean {
  return canExecuteWxEnemyBuffCast(args);
}

export function wxEnemyBuffHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided 0-damage pack buff. Non-buff kits return null so
 * restack cannot treat Strike / Slow / Blood Mend as a RES write. The
 * shield tile is the caster — pack WX has no ward dest (#865).
 */
export function executeWxEnemyBuffCast(args: {
  spell: WxEnemyBuffSpell;
  origin: WxEnemyBuffTile;
  targetCell: WxEnemyBuffTile;
  occupant: WxEnemyBuffOccupant | null;
  casterSide: "player" | "enemy";
  casterId: string;
}): WxEnemyBuffExecute | null {
  if (!canExecuteWxEnemyBuffCast(args) || !args.casterId) return null;
  const fields = wxEnemyBuffEffectFields(args.spell, args.casterId);
  if (!fields) return null;
  return {
    tile: wxEnemyBuffApplyCell(args.origin, args.targetCell),
    ...fields,
  };
}
