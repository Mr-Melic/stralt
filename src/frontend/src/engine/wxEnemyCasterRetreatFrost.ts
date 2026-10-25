/**
 * Pack-enemy `decideCaster` wounded-retreat vs in-range Frost.
 *
 * Queen `buildEnemyKit` z=0 and bishop kits are Frost-only (or Frost +
 * Poison). `inferArchetype` marks those as caster (ranged + default LoS).
 * `decideCaster` returns `intent: "retreat"` whenever
 * `hpFrac < ENEMY_RETREAT_HP_PCT` (0.3) *before* `pickBestDamageSpell`,
 * so advertised Frost never fires on a wounded bishop / early queen even
 * when a living hostile sits in Chebyshev `Number(range)`.
 *
 * Queen z>=1 / king z>=1 carry Blood Mend / Rallying Cry and infer
 * healer — those leftovers stay on #985 (wounded-caster self-heal),
 * #1026 / #1033 (wounded-ally approach), #1034 / #1039 (healthy-pack
 * backline-guard). This sidecar only fills the *caster* retreat hole:
 * live would walk away, Frost is in Chebyshev of a living hostile,
 * decide Frost instead of retreat.
 *
 * Do not steal Strike (#762), Inferno (#967 / #1039), Iron Skin (#978),
 * Slow, Drain (#921), or player Frost Bolt MP (#905). Chebyshev vs
 * `Number(spell.range)` — do not switch to `spellRangeBase` (would
 * rebalance). No LoS (WX pack execute skips it). No AP (WX does not
 * debit enemy AP).
 *
 * Unique vs #762 / #905 / #921 / #967 / #978 / #985 / #989 / #1026 /
 * #1033 / #1034 / #1039. WorldExploration / enemyAI / summonExecutor /
 * targeting / spellEngine / statusEffects left untouched so older
 * open PRs stay merge-clean. Restack the `decideCaster` retreat
 * branch onto `pickWxEnemyCasterRetreatFrostSpell` after those PRs
 * land.
 */

import { ENEMY_RETREAT_HP_PCT } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyCasterRetreatFrostSpell =
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

export type WxEnemyCasterRetreatFrostTile = CasterPosition;

export type WxEnemyCasterRetreatFrostOccupant =
  WxEnemyCasterRetreatFrostTile & {
    id: string;
    hp?: number;
    maxHp?: number;
    side?: string;
    isSummon?: boolean;
  };

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxEnemyCasterRetreatFrostHealKitSpell(
  spell: WxEnemyCasterRetreatFrostSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxEnemyCasterRetreatFrostKitIsHealer(
  spells: readonly WxEnemyCasterRetreatFrostSpell[],
): boolean {
  return spells.some((s) => isWxEnemyCasterRetreatFrostHealKitSpell(s));
}

/**
 * Frost Bolt leftover identity: `damage > 0` + advertised MP debuff.
 * Strike has no `debuffStat`. Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on #967 / #978.
 */
export function isWxEnemyCasterRetreatFrostSpell(
  spell: WxEnemyCasterRetreatFrostSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  if (!spell.debuffDuration) return false;
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
export function isWxEnemyCasterRetreatFrostBlockedDotSpell(
  spell: WxEnemyCasterRetreatFrostSpell,
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
export function isWxEnemyCasterRetreatFrostBlockedBuffSpell(
  spell: WxEnemyCasterRetreatFrostSpell,
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

export function wxEnemyCasterRetreatFrostRange(
  spell: WxEnemyCasterRetreatFrostSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyCasterRetreatFrostInRange(
  origin: WxEnemyCasterRetreatFrostTile,
  targetCell: WxEnemyCasterRetreatFrostTile,
  spell: WxEnemyCasterRetreatFrostSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyCasterRetreatFrostLivePickBestDamageSpellSelects(
  spell: WxEnemyCasterRetreatFrostSpell,
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

export function wxEnemyCasterRetreatFrostLivePickBestDamageSpell<
  T extends WxEnemyCasterRetreatFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyCasterRetreatFrostTile;
  targetCell: WxEnemyCasterRetreatFrostTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyCasterRetreatFrostLivePickBestDamageSpellSelects(s) &&
      wxEnemyCasterRetreatFrostInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyCasterRetreatFrostHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? 0));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function wxEnemyCasterRetreatFrostCasterWouldRetreat(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyCasterRetreatFrostHpFrac(caster) < ENEMY_RETREAT_HP_PCT;
}

/**
 * Live `decideCaster` retreat return: HP below 30%, a threat exists,
 * and the kit is not a healer (healers never reach this branch —
 * #985 / #1034 / #1039).
 */
export function wxEnemyCasterLiveWouldRetreatForFrost(args: {
  assignedSpells?: readonly WxEnemyCasterRetreatFrostSpell[];
  availableSpells: readonly WxEnemyCasterRetreatFrostSpell[];
  caster: WxEnemyCasterRetreatFrostOccupant;
  opponents: readonly WxEnemyCasterRetreatFrostOccupant[];
}): boolean {
  const kit = args.assignedSpells ?? args.availableSpells;
  if (wxEnemyCasterRetreatFrostKitIsHealer(kit)) return false;
  if (args.opponents.length === 0) return false;
  return wxEnemyCasterRetreatFrostCasterWouldRetreat(args.caster);
}

/**
 * Unique leftover: when live would retreat and Frost is the live
 * `pickBestDamageSpell` dest, pick that Frost. Returns null when live
 * damage>0 is empty (Poison / Inferno / Iron Skin stay on #967 / #978),
 * when Strike / Drain win the damage pick (#762 / #921), or when a
 * heal kit still drives healer leftovers.
 */
export function pickWxEnemyCasterRetreatFrostSpell<
  T extends WxEnemyCasterRetreatFrostSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxEnemyCasterRetreatFrostTile;
  targetCell: WxEnemyCasterRetreatFrostTile;
  opponents: readonly WxEnemyCasterRetreatFrostOccupant[];
  caster: WxEnemyCasterRetreatFrostOccupant;
}): T | null {
  if (
    !wxEnemyCasterLiveWouldRetreatForFrost({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      caster: args.caster,
      opponents: args.opponents,
    })
  ) {
    return null;
  }
  const live = wxEnemyCasterRetreatFrostLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyCasterRetreatFrostSpell(live)) return null;
  return live;
}

export function isWxEnemyCasterRetreatFrostHostile(args: {
  occupant: WxEnemyCasterRetreatFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyCasterRetreatFrostCast(args: {
  spell: WxEnemyCasterRetreatFrostSpell;
  assignedSpells?: readonly WxEnemyCasterRetreatFrostSpell[];
  availableSpells?: readonly WxEnemyCasterRetreatFrostSpell[];
  origin: WxEnemyCasterRetreatFrostTile;
  targetCell: WxEnemyCasterRetreatFrostTile;
  occupant: WxEnemyCasterRetreatFrostOccupant | null;
  opponents: readonly WxEnemyCasterRetreatFrostOccupant[];
  caster: WxEnemyCasterRetreatFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isWxEnemyCasterRetreatFrostSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyCasterRetreatFrostSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      caster: args.caster,
    }) == null
  ) {
    return false;
  }
  if (
    !wxEnemyCasterRetreatFrostInRange(args.origin, args.targetCell, args.spell)
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
  return isWxEnemyCasterRetreatFrostHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyCasterRetreatFrostCast(
  args: Parameters<typeof canExecuteWxEnemyCasterRetreatFrostCast>[0],
): boolean {
  return canExecuteWxEnemyCasterRetreatFrostCast(args);
}

export function wxEnemyCasterRetreatFrostHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
