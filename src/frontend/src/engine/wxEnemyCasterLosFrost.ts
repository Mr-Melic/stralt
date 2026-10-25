/**
 * Pack-enemy `decideCaster` LoS-reposition vs in-range Frost.
 *
 * Queen `buildEnemyKit` z=0 and bishop kits are Frost casters.
 * `decideCaster` requires `aiCanCast` (range AND LoS; Frost has no
 * `lineOfSight: false`, so `enemySpellRequiresLos` defaults ON). When Frost
 * is in Chebyshev range but LoS is blocked, live returns
 * `intent: "reposition-los"` (`sidesteps for a shot`) with `spell: null`
 * instead of casting. WorldExploration pack execute still skips LoS: a
 * `kind: "cast"` Frost with `Number(range)` covering the dest fires.
 *
 * Healthy in-range Frost with LoS already casts (#762 / #1054 healthy
 * path). Wounded casters retreat before pick (#1054). Queen z>=1 / king
 * z>=1 infer healer — those stay on #985 / #1026 / #1033 / #1034 / #1039.
 * This sidecar only fills the *caster* LoS-reposition hole: live would
 * sidestep, Frost is in Chebyshev of a living hostile, decide Frost.
 *
 * Do not steal Strike (#762), Inferno (#967 / #1039), Iron Skin (#978),
 * Slow, Drain (#921), wounded-retreat Frost (#1054), or player Frost Bolt
 * MP (#905). Chebyshev vs `Number(spell.range)`. No AP (WX does not debit
 * enemy AP).
 *
 * Unique vs #762 / #905 / #921 / #967 / #978 / #985 / #989 / #1026 /
 * #1033 / #1034 / #1039 / #1054. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine / statusEffects left untouched
 * so older open PRs stay merge-clean. Restack the `decideCaster`
 * reposition-los branch onto `pickWxEnemyCasterLosFrostSpell` after those
 * PRs land.
 */

import {
  AI_LOS_REPOSITION_ENABLED,
  ENEMY_RETREAT_HP_PCT,
} from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";

export type WxEnemyCasterLosFrostSpell =
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
      | "lineOfSight"
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
      lineOfSight?: boolean | null;
    };

export type WxEnemyCasterLosFrostTile = CasterPosition;

export type WxEnemyCasterLosFrostOccupant = WxEnemyCasterLosFrostTile & {
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
export function isWxEnemyCasterLosFrostHealKitSpell(
  spell: WxEnemyCasterLosFrostSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxEnemyCasterLosFrostKitIsHealer(
  spells: readonly WxEnemyCasterLosFrostSpell[],
): boolean {
  return spells.some((s) => isWxEnemyCasterLosFrostHealKitSpell(s));
}

/**
 * Frost Bolt leftover identity: `damage > 0` + advertised MP debuff.
 * Strike has no `debuffStat`. Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on #967 / #978.
 */
export function isWxEnemyCasterLosFrostSpell(
  spell: WxEnemyCasterLosFrostSpell,
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
export function isWxEnemyCasterLosFrostBlockedDotSpell(
  spell: WxEnemyCasterLosFrostSpell,
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
export function isWxEnemyCasterLosFrostBlockedBuffSpell(
  spell: WxEnemyCasterLosFrostSpell,
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

export function wxEnemyCasterLosFrostRange(
  spell: WxEnemyCasterLosFrostSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. */
export function wxEnemyCasterLosFrostInRange(
  origin: WxEnemyCasterLosFrostTile,
  targetCell: WxEnemyCasterLosFrostTile,
  spell: WxEnemyCasterLosFrostSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyCasterLosFrostLivePickBestDamageSpellSelects(
  spell: WxEnemyCasterLosFrostSpell,
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

export function wxEnemyCasterLosFrostLivePickBestDamageSpell<
  T extends WxEnemyCasterLosFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyCasterLosFrostTile;
  targetCell: WxEnemyCasterLosFrostTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyCasterLosFrostLivePickBestDamageSpellSelects(s) &&
      wxEnemyCasterLosFrostInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyCasterLosFrostHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? 0));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function wxEnemyCasterLosFrostCasterWouldRetreat(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyCasterLosFrostHpFrac(caster) < ENEMY_RETREAT_HP_PCT;
}

export function wxEnemyCasterLosFrostSpellRequiresLos(
  spell: WxEnemyCasterLosFrostSpell,
): boolean {
  return enemySpellRequiresLos({
    lineOfSight: spell.lineOfSight === null ? undefined : spell.lineOfSight,
  });
}

/**
 * Live `decideCaster` reposition-los return: HP at/above 30% (so retreat
 * does not run — #1054), a threat exists, kit is not a healer, Frost is
 * the live damage pick in Chebyshev, LoS is required and blocked, and
 * `AI_LOS_REPOSITION_ENABLED` still arms the sidestep.
 */
export function wxEnemyCasterLiveWouldRepositionLosForFrost(args: {
  assignedSpells?: readonly WxEnemyCasterLosFrostSpell[];
  availableSpells: readonly WxEnemyCasterLosFrostSpell[];
  origin: WxEnemyCasterLosFrostTile;
  targetCell: WxEnemyCasterLosFrostTile;
  caster: WxEnemyCasterLosFrostOccupant;
  opponents: readonly WxEnemyCasterLosFrostOccupant[];
  hasLoS: boolean;
}): boolean {
  if (!AI_LOS_REPOSITION_ENABLED) return false;
  const kit = args.assignedSpells ?? args.availableSpells;
  if (wxEnemyCasterLosFrostKitIsHealer(kit)) return false;
  if (args.opponents.length === 0) return false;
  if (!isAliveCombatant({ hp: args.caster.hp ?? 0 })) return false;
  if (wxEnemyCasterLosFrostCasterWouldRetreat(args.caster)) return false;
  if (args.hasLoS) return false;
  const live = wxEnemyCasterLosFrostLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyCasterLosFrostSpell(live)) return false;
  if (!wxEnemyCasterLosFrostSpellRequiresLos(live)) return false;
  return wxEnemyCasterLosFrostInRange(args.origin, args.targetCell, live);
}

/**
 * Unique leftover: when live would sidestep for LoS and Frost is the live
 * `pickBestDamageSpell` dest, pick that Frost. Returns null when LoS is
 * already clear (#762), when the caster would retreat (#1054), when live
 * damage>0 is empty (Poison / Inferno / Iron Skin stay on #967 / #978),
 * or when a heal kit still drives healer leftovers.
 */
export function pickWxEnemyCasterLosFrostSpell<
  T extends WxEnemyCasterLosFrostSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxEnemyCasterLosFrostTile;
  targetCell: WxEnemyCasterLosFrostTile;
  opponents: readonly WxEnemyCasterLosFrostOccupant[];
  caster: WxEnemyCasterLosFrostOccupant;
  hasLoS: boolean;
}): T | null {
  if (
    !wxEnemyCasterLiveWouldRepositionLosForFrost({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      origin: args.origin,
      targetCell: args.targetCell,
      caster: args.caster,
      opponents: args.opponents,
      hasLoS: args.hasLoS,
    })
  ) {
    return null;
  }
  const live = wxEnemyCasterLosFrostLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyCasterLosFrostSpell(live)) return null;
  return live;
}

export function isWxEnemyCasterLosFrostHostile(args: {
  occupant: WxEnemyCasterLosFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyCasterLosFrostCast(args: {
  spell: WxEnemyCasterLosFrostSpell;
  assignedSpells?: readonly WxEnemyCasterLosFrostSpell[];
  availableSpells?: readonly WxEnemyCasterLosFrostSpell[];
  origin: WxEnemyCasterLosFrostTile;
  targetCell: WxEnemyCasterLosFrostTile;
  occupant: WxEnemyCasterLosFrostOccupant | null;
  opponents: readonly WxEnemyCasterLosFrostOccupant[];
  caster: WxEnemyCasterLosFrostOccupant;
  casterSide: "player" | "enemy";
  hasLoS: boolean;
}): boolean {
  if (!isWxEnemyCasterLosFrostSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyCasterLosFrostSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      caster: args.caster,
      hasLoS: args.hasLoS,
    }) == null
  ) {
    return false;
  }
  if (!wxEnemyCasterLosFrostInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyCasterLosFrostHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyCasterLosFrostCast(
  args: Parameters<typeof canExecuteWxEnemyCasterLosFrostCast>[0],
): boolean {
  return canExecuteWxEnemyCasterLosFrostCast(args);
}

export function wxEnemyCasterLosFrostHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
