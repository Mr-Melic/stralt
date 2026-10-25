/**
 * Pack-enemy `decideFlanker` wounded-retreat vs in-range Strike.
 *
 * Knight `buildEnemyKit` is `["physical_attack"]` (Strike). `inferArchetype`
 * returns `"flanker"` for `pieceType === "knight"` after the healer / caster
 * checks. `decideFlanker` returns `intent: "retreat"` whenever
 * `hpFrac < ENEMY_RETREAT_HP_PCT` (0.3) *before* the adjacent
 * `pickBestDamageSpell` arm, so advertised Strike never fires on a wounded
 * knight even when a living hostile sits in Chebyshev `Number(range)` (1).
 *
 * Pawn uses the same Strike id but infers charger (no 30% retreat). Rook
 * z≥1 infers caster via Iron Skin range (`#978`). Bishop / queen / king
 * Frost leftovers stay on `#1054` / `#1081` / `#1085`. Healthy adjacent
 * Strike already casts (`#762`). This sidecar only fills the *flanker*
 * retreat hole: live would walk away, Strike is in Chebyshev of a living
 * hostile, decide Strike instead of retreat.
 *
 * Do not steal Frost (`#1054` / `#1081` / `#1085`), Inferno (`#967` /
 * `#1039`), Iron Skin (`#978`), Slow, Drain (`#921`), empty-tile Strike
 * leave, or player Strike copy. Chebyshev vs `Number(spell.range)` — do
 * not switch to `spellRangeBase` (would rebalance). No LoS (WX pack
 * execute skips it; melee range 1 is adjacent). No AP (WX does not
 * debit enemy AP).
 *
 * Unique vs `#762` / `#921` / `#967` / `#978` / `#985` / `#989` / `#1026` /
 * `#1033` / `#1034` / `#1039` / `#1054` / `#1081` / `#1085`.
 * WorldExploration / enemyAI / summonExecutor / targeting / spellEngine /
 * statusEffects left untouched so older open PRs stay merge-clean. Restack
 * the `decideFlanker` retreat branch onto
 * `pickWxEnemyFlankerRetreatStrikeSpell` after those PRs land.
 */

import { ENEMY_RETREAT_HP_PCT } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyFlankerRetreatStrikeSpell =
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
      | "isPhysical"
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
      isPhysical?: boolean | null;
    };

export type WxEnemyFlankerRetreatStrikeTile = CasterPosition;

export type WxEnemyFlankerRetreatStrikeOccupant =
  WxEnemyFlankerRetreatStrikeTile & {
    id: string;
    hp?: number;
    maxHp?: number;
    side?: string;
    isSummon?: boolean;
    pieceType?: string;
  };

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxEnemyFlankerRetreatStrikeHealKitSpell(
  spell: WxEnemyFlankerRetreatStrikeSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxEnemyFlankerRetreatStrikeKitIsHealer(
  spells: readonly WxEnemyFlankerRetreatStrikeSpell[],
): boolean {
  return spells.some((s) => isWxEnemyFlankerRetreatStrikeHealKitSpell(s));
}

/**
 * Live `inferArchetype` flanker arm: `pieceType === "knight"` after healer
 * and caster checks. Pawn Strike-only kits infer charger (no 30% retreat).
 */
export function wxEnemyFlankerRetreatStrikePieceIsFlanker(
  pieceType: string | undefined,
): boolean {
  return pieceType === "knight";
}

/**
 * Strike leftover identity: `damage > 0` melee (`Number(range) <= 1`)
 * without an advertised debuff. Frost is range 4 + `debuffStat === "mp"`
 * (`#1054` / `#1081` / `#1085`). Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on `#967` / `#978`.
 */
export function isWxEnemyFlankerRetreatStrikeSpell(
  spell: WxEnemyFlankerRetreatStrikeSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (enemySpellRange(spell as Pick<SpellConfig, "range">) > 1) return false;
  if (spell.debuffStat) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
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

/** 0-damage DoT leftover identity (#967 / #1039). */
export function isWxEnemyFlankerRetreatStrikeBlockedDotSpell(
  spell: WxEnemyFlankerRetreatStrikeSpell,
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

/** 0-damage buff leftover identity (#978). */
export function isWxEnemyFlankerRetreatStrikeBlockedBuffSpell(
  spell: WxEnemyFlankerRetreatStrikeSpell,
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

export function wxEnemyFlankerRetreatStrikeRange(
  spell: WxEnemyFlankerRetreatStrikeSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyFlankerRetreatStrikeInRange(
  origin: WxEnemyFlankerRetreatStrikeTile,
  targetCell: WxEnemyFlankerRetreatStrikeTile,
  spell: WxEnemyFlankerRetreatStrikeSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyFlankerRetreatStrikeLivePickBestDamageSpellSelects(
  spell: WxEnemyFlankerRetreatStrikeSpell,
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

export function wxEnemyFlankerRetreatStrikeLivePickBestDamageSpell<
  T extends WxEnemyFlankerRetreatStrikeSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyFlankerRetreatStrikeTile;
  targetCell: WxEnemyFlankerRetreatStrikeTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyFlankerRetreatStrikeLivePickBestDamageSpellSelects(s) &&
      wxEnemyFlankerRetreatStrikeInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyFlankerRetreatStrikeHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? 0));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function wxEnemyFlankerRetreatStrikeWouldRetreat(flanker: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: flanker.hp ?? 0 })) return false;
  return wxEnemyFlankerRetreatStrikeHpFrac(flanker) < ENEMY_RETREAT_HP_PCT;
}

/**
 * Live `decideFlanker` retreat return: HP below 30%, a threat exists,
 * the kit is not a healer (healers never reach this branch —
 * `#985` / `#1034` / `#1039` / `#1085`), and `pieceType === "knight"`.
 */
export function wxEnemyFlankerLiveWouldRetreatForStrike(args: {
  assignedSpells?: readonly WxEnemyFlankerRetreatStrikeSpell[];
  availableSpells: readonly WxEnemyFlankerRetreatStrikeSpell[];
  flanker: WxEnemyFlankerRetreatStrikeOccupant;
  opponents: readonly WxEnemyFlankerRetreatStrikeOccupant[];
}): boolean {
  const kit = args.assignedSpells ?? args.availableSpells;
  if (wxEnemyFlankerRetreatStrikeKitIsHealer(kit)) return false;
  if (!wxEnemyFlankerRetreatStrikePieceIsFlanker(args.flanker.pieceType)) {
    return false;
  }
  if (args.opponents.length === 0) return false;
  return wxEnemyFlankerRetreatStrikeWouldRetreat(args.flanker);
}

/**
 * Unique leftover: when live would retreat and Strike is the live
 * `pickBestDamageSpell` dest, pick that Strike. Returns null when live
 * damage>0 is empty (Poison / Inferno / Iron Skin stay on `#967` / `#978`),
 * when Frost / Drain win the damage pick (`#1054` / `#921`), when the
 * piece is not a knight (pawn charger / rook caster), or when a heal kit
 * still drives healer leftovers.
 */
export function pickWxEnemyFlankerRetreatStrikeSpell<
  T extends WxEnemyFlankerRetreatStrikeSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxEnemyFlankerRetreatStrikeTile;
  targetCell: WxEnemyFlankerRetreatStrikeTile;
  opponents: readonly WxEnemyFlankerRetreatStrikeOccupant[];
  flanker: WxEnemyFlankerRetreatStrikeOccupant;
}): T | null {
  if (
    !wxEnemyFlankerLiveWouldRetreatForStrike({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      flanker: args.flanker,
      opponents: args.opponents,
    })
  ) {
    return null;
  }
  const live = wxEnemyFlankerRetreatStrikeLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyFlankerRetreatStrikeSpell(live)) return null;
  return live;
}

export function isWxEnemyFlankerRetreatStrikeHostile(args: {
  occupant: WxEnemyFlankerRetreatStrikeOccupant;
  flankerSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.flankerSide;
}

export function canExecuteWxEnemyFlankerRetreatStrikeCast(args: {
  spell: WxEnemyFlankerRetreatStrikeSpell;
  assignedSpells?: readonly WxEnemyFlankerRetreatStrikeSpell[];
  availableSpells?: readonly WxEnemyFlankerRetreatStrikeSpell[];
  origin: WxEnemyFlankerRetreatStrikeTile;
  targetCell: WxEnemyFlankerRetreatStrikeTile;
  occupant: WxEnemyFlankerRetreatStrikeOccupant | null;
  opponents: readonly WxEnemyFlankerRetreatStrikeOccupant[];
  flanker: WxEnemyFlankerRetreatStrikeOccupant;
  flankerSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyFlankerRetreatStrikeSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyFlankerRetreatStrikeSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      flanker: args.flanker,
    }) == null
  ) {
    return false;
  }
  if (
    !wxEnemyFlankerRetreatStrikeInRange(
      args.origin,
      args.targetCell,
      args.spell,
    )
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
  return isWxEnemyFlankerRetreatStrikeHostile({
    occupant: args.occupant,
    flankerSide: args.flankerSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyFlankerRetreatStrikeCast(
  args: Parameters<typeof canExecuteWxEnemyFlankerRetreatStrikeCast>[0],
): boolean {
  return canExecuteWxEnemyFlankerRetreatStrikeCast(args);
}

export function wxEnemyFlankerRetreatStrikeHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
