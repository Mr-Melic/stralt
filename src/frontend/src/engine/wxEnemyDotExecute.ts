/**
 * WorldExploration pack-enemy 0-damage DoT advertised ticks vs the
 * damage-then-stop apply arm.
 *
 * Bishop / pawn / queen+king `buildEnemyKit` carry Poison Arrow
 * (`starter-poison`), Venom Strike (`spell-venom-strike`), and Inferno
 * (`spell-inferno`) as `spellType: "damage"`, `damage: 0`, `isDotSpell`,
 * `dotDamagePerTurn` 4 / 4 / 8, `dotDuration: 3`.
 *
 * After dest commit, WX fires (WorldExploration enemy apply block):
 *   1. inRange && (spellType damage|drain) && Number(damage) > 0
 *      → `wxEnemyCastExecute.ts` (#762). Nested DoT lives **inside**
 *      this arm, so 0-damage Poison / Venom / Inferno never write a
 *      `dotDamagePerTurn` row.
 *   2. else if inRange && spellType === "heal" && Number(range) === 0
 *      → `enemyHealExecute.ts` (#757) / heal+CHC (#924)
 *   3. else if inRange && debuffStat && debuffDuration
 *      → standalone Slow / Weaken (#762)
 *
 * There is no fourth DoT arm. `didAct` stays false, so a decided
 * in-range 0-damage DoT falls through to adjacent melee. Boss apply
 * is a sibling `if` (not nested under damage) and already ticks —
 * not this module. Summon applyCast omits dpt (#856) and bomber
 * Inferno splash/suicide is #799 (`AI_KAMIKAZE_BLAST_RADIUS`).
 *
 * `pickBestDamageSpell` also filters `Number(s.damage) > 0`, so live
 * decide never selects these kits either. This module is the execute
 * gate those pickers must restack onto: `shouldDecideWxEnemyDotCast`
 * === `canExecuteWxEnemyDotCast` (Chebyshev vs `Number(spell.range)`
 * on the decided dest, living opposite-side occupant, no LoS, no AP —
 * WX does not debit enemy AP here). Do not switch to `spellRangeBase`
 * (would rebalance). Do not grow Inferno `areaRadius` (would steal
 * #799). Do not steal Strike damage, Slow debuff, Blood Mend CHC,
 * Iron Skin buff, Drain, Frost Bolt / Nova, or summon ticks (#856).
 * Do not require `spell.name`.
 *
 * Unique vs #762 / #757 / #799 / #856 / #924. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects
 * left untouched so older open PRs stay merge-clean. Restack the WX
 * apply arm onto `executeWxEnemyDotCast` after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyDotSpell =
  | Pick<
      SpellConfig,
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

export type WxEnemyDotTile = CasterPosition;

export type WxEnemyDotOccupant = WxEnemyDotTile & {
  id: string;
  hp?: number;
  side?: string;
};

export type WxEnemyDotEffectFields = {
  type: "dot";
  targetId: string;
  dotDamagePerTurn: number;
  duration: number;
};

export type WxEnemyDotExecute = WxEnemyDotEffectFields & {
  tile: WxEnemyDotTile;
};

export type WxEnemyDotLiveKind = "damage" | "heal" | "debuff" | "dot";

/**
 * Catalog 0-damage DoT kits (Poison Arrow / Venom Strike / pack Inferno).
 * Do not require `spell.name`. Inferno stays in: this is the pack-WX
 * primary tick, not bomber splash (#799) and not summon applyCast (#856).
 */
export function isWxEnemyDotExecuteSpell(spell: WxEnemyDotSpell): boolean {
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
  return spell.isDotSpell === true || spell.effectType === "dot" || dpt > 0;
}

/** Same `Number(spell.range)` the WX `inRange` Chebyshev gate uses. */
export function wxEnemyDotExecuteRange(spell: WxEnemyDotSpell): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/**
 * Pack Inferno is a single-target DoT (`areaRadius` 0). Do not grow
 * this to `AI_KAMIKAZE_BLAST_RADIUS` — that splash is #799.
 */
export function wxEnemyDotExecuteSplashRadius(spell: WxEnemyDotSpell): number {
  return Math.max(0, Math.floor(Number(spell.areaRadius ?? 0)));
}

/**
 * Live WX `inRange` is Chebyshev vs `Number(spell.range)` from the
 * post-move tile to `targetCell`. No LoS (WX skips it).
 */
export function wxEnemyDotInRange(
  origin: WxEnemyDotTile,
  targetCell: WxEnemyDotTile,
  spell: WxEnemyDotSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live `pickBestDamageSpell` candidate filter (`Number(s.damage) > 0`
 * plus damage/drain type). Poison / Venom / Inferno never pass, so
 * decide cannot feed the WX apply arm even after execute is restacked.
 */
export function wxEnemyLiveDamagePickerWouldSelect(
  spell: WxEnemyDotSpell,
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
 * observes. 0-damage DoTs miss every arm and yield `[]` (fallback melee).
 */
export function wxEnemyDotLiveKinds(
  spell: WxEnemyDotSpell,
): WxEnemyDotLiveKind[] {
  const spellType = spell.spellType ?? "damage";
  if (
    (spellType === "damage" || spellType === "drain") &&
    Number(spell.damage ?? 0) > 0
  ) {
    return ["damage"];
  }
  if (spellType === "heal" && wxEnemyDotExecuteRange(spell) === 0) {
    return ["heal"];
  }
  if (spell.debuffStat && spell.debuffDuration) {
    return ["debuff"];
  }
  return [];
}

export function wxEnemyDotAdvertisedKinds(
  spell: WxEnemyDotSpell,
): WxEnemyDotLiveKind[] {
  if (!isWxEnemyDotExecuteSpell(spell)) {
    return wxEnemyDotLiveKinds(spell);
  }
  return ["dot"];
}

/** Advertised tick. Must not omit `dotDamagePerTurn` the way live WX does. */
export function wxEnemyDotEffectFields(
  spell: WxEnemyDotSpell,
  targetId: string,
): WxEnemyDotEffectFields | null {
  if (!isWxEnemyDotExecuteSpell(spell)) return null;
  return {
    type: "dot",
    targetId,
    dotDamagePerTurn: Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0),
    duration: Math.max(1, Math.floor(Number(spell.dotDuration) || 0)),
  };
}

/**
 * Live WX payload — kept only to lock the drift. 0-damage DoTs write
 * no ActiveEffect row (nested apply never runs).
 */
export function wxEnemyDotLegacyApplyFields(
  spell: WxEnemyDotSpell,
): WxEnemyDotEffectFields | null {
  if (!isWxEnemyDotExecuteSpell(spell)) return null;
  // Nested apply never runs when Number(damage) is 0.
  return null;
}

export function wxEnemyDotFallsThroughToMelee(spell: WxEnemyDotSpell): boolean {
  return (
    isWxEnemyDotExecuteSpell(spell) && wxEnemyDotLiveKinds(spell).length === 0
  );
}

export function isWxEnemyDotHostileOccupant(args: {
  occupant: WxEnemyDotOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyDotCast(args: {
  spell: WxEnemyDotSpell;
  origin: WxEnemyDotTile;
  targetCell: WxEnemyDotTile;
  occupant: WxEnemyDotOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyDotExecuteSpell(args.spell)) return false;
  if (!wxEnemyDotInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyDotHostileOccupant({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX 0-damage DoT branch cannot fork. */
export function shouldDecideWxEnemyDotCast(
  args: Parameters<typeof canExecuteWxEnemyDotCast>[0],
): boolean {
  return canExecuteWxEnemyDotCast(args);
}

export function wxEnemyDotHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided 0-damage DoT. Non-DoT kits return null so restack
 * cannot treat Strike / Slow / Blood Mend as a tick write. The shield
 * tile is the decided dest; live WX already aims `targetCell` there.
 */
export function executeWxEnemyDotCast(args: {
  spell: WxEnemyDotSpell;
  origin: WxEnemyDotTile;
  targetCell: WxEnemyDotTile;
  occupant: WxEnemyDotOccupant | null;
  casterSide: "player" | "enemy";
}): WxEnemyDotExecute | null {
  if (!canExecuteWxEnemyDotCast(args) || !args.occupant) return null;
  const fields = wxEnemyDotEffectFields(args.spell, args.occupant.id);
  if (!fields) return null;
  return {
    tile: { x: args.targetCell.x, y: args.targetCell.y },
    ...fields,
  };
}
