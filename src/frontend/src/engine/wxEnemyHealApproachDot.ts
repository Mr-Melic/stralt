/**
 * Pack-enemy `decideHealer` wounded-ally approach vs in-range Inferno.
 *
 * Queen `buildEnemyKit` z≥2 is `[spell-inferno, starter-heal]`.
 * `inferArchetype` marks any heal kit as healer. `decideHealer` then
 * heals the most-wounded *ally* below 50% when Chebyshev ≤
 * `Number(healSpell.range)`. Blood Mend is `range: 0` / `targetType:
 * "self"`, so a distinct ally is always out of range and the branch
 * returns `kind: "move"` / `intent: "approach-ally"` before
 * `decideCaster`. Inferno is `damage: 0` / `effectType: "dot"`, so
 * even if `decideCaster` ran, live `pickBestDamageSpell`
 * (`Number(s.damage) > 0`) would skip it — that decide hole is #967.
 * This sidecar is the remaining *approach* leftover: live never
 * reaches decideCaster, so advertised Inferno (range 3, 8 dpt / 3
 * turns) never fires while the healer walks toward an unhealable ally.
 *
 * #1026 is the Frost (`damage > 0` + MP debuff) approach fill for
 * queen z=1. #967 is pack DoT decide once `decideCaster` is reached.
 * #972 is Inferno advertised cooldown 3. #978 is Iron Skin decide.
 * #985 / #989 are heal decide when there is no wounded-ally approach.
 * Do not steal Strike / Drain / Slow / Frost Nova / player Frost Bolt
 * MP (#905). Chebyshev vs `Number(spell.range)` — do not switch to
 * `spellRangeBase` (would rebalance). No LoS (healer skips LoS; WX
 * pack execute does too). No AP (WX does not debit enemy AP).
 *
 * Unique vs #762 / #905 / #967 / #972 / #978 / #985 / #989 / #1026.
 * WorldExploration / enemyAI / summonExecutor / targeting /
 * spellEngine / statusEffects left untouched so older open PRs stay
 * merge-clean. Restack the `decideHealer` out-of-range branch onto
 * `pickWxEnemyHealApproachDotSpell` after those PRs land.
 */

import { ENEMY_HEAL_ALLY_THRESHOLD_PCT } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealApproachDotSpell =
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

export type WxEnemyHealApproachDotTile = CasterPosition;

export type WxEnemyHealApproachDotOccupant = WxEnemyHealApproachDotTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
};

/**
 * Range-0 self/ally heal that `decideHealer` uses as `healSpell`
 * (Blood Mend). Drain `healAmount` stays on #921. Do not require
 * `buffStat` — Blood Mend carries CHC; that identity is #989 / #924.
 */
export function isWxEnemyHealApproachDotTriggerSpell(
  spell: WxEnemyHealApproachDotSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (Number(spell.healAmount ?? 0) <= 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
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

/** Catalog Blood Mend / Rallying Cry never reach a distinct ally. */
export function wxEnemyHealApproachDotTriggerRequiresZeroRange(
  spell: WxEnemyHealApproachDotSpell,
): boolean {
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 0;
}

export function wxEnemyHealApproachDotPerTurn(
  spell: WxEnemyHealApproachDotSpell,
): number {
  return Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
}

/**
 * Inferno leftover identity: `damage === 0` + advertised DoT ticks.
 * Frost is `damage > 0` + MP (#1026). Iron Skin is buffStat (#978).
 * Strike has no ticks. Poison Arrow matches the same metadata class
 * but is not on a live healer kit (bishop has no Blood Mend).
 */
export function isWxEnemyHealApproachDotSpell(
  spell: WxEnemyHealApproachDotSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = wxEnemyHealApproachDotPerTurn(spell);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  if (!(spell.isDotSpell === true || spell.effectType === "dot")) {
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

/** Frost leftover identity (#1026). Do not remap dest onto that fill. */
export function isWxEnemyHealApproachDotBlockedFrostSpell(
  spell: WxEnemyHealApproachDotSpell,
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

export function wxEnemyHealApproachDotRange(
  spell: WxEnemyHealApproachDotSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live healer / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealApproachDotInRange(
  origin: WxEnemyHealApproachDotTile,
  targetCell: WxEnemyHealApproachDotTile,
  spell: WxEnemyHealApproachDotSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyHealApproachDotLivePickBestDamageSpellSelects(
  spell: WxEnemyHealApproachDotSpell,
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

export function wxEnemyHealApproachDotLivePickBestDamageSpell<
  T extends WxEnemyHealApproachDotSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealApproachDotTile;
  targetCell: WxEnemyHealApproachDotTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyHealApproachDotLivePickBestDamageSpellSelects(s) &&
      wxEnemyHealApproachDotInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

export function wxEnemyHealApproachDotAllyHpFrac(ally: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(ally.hp ?? 0);
  const max = Math.max(1, Number(ally.maxHp ?? hp));
  return Math.max(0, Math.min(1, hp / max));
}

export function isWxEnemyHealApproachDotWoundedAlly(args: {
  ally: WxEnemyHealApproachDotOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isAliveCombatant({ hp: args.ally.hp ?? 0 })) return false;
  if (args.casterId && args.ally.id === args.casterId) return false;
  const side = args.ally.side === "player" ? "player" : "enemy";
  if (side !== args.casterSide) return false;
  return (
    wxEnemyHealApproachDotAllyHpFrac(args.ally) < ENEMY_HEAL_ALLY_THRESHOLD_PCT
  );
}

export function pickWxEnemyHealApproachDotTriggerSpell<
  T extends WxEnemyHealApproachDotSpell,
>(availableSpells: readonly T[]): T | null {
  const found = availableSpells.find(
    (s) =>
      isWxEnemyHealApproachDotTriggerSpell(s) &&
      wxEnemyHealApproachDotTriggerRequiresZeroRange(s),
  );
  return found ?? null;
}

/**
 * Live `decideHealer` out-of-range branch: wounded ally exists, range-0
 * heal cannot reach them, so the function returns approach-ally and
 * never reaches `decideCaster` / #967.
 */
export function wxEnemyHealLiveWouldApproachWoundedAllyForDot(args: {
  availableSpells: readonly WxEnemyHealApproachDotSpell[];
  origin: WxEnemyHealApproachDotTile;
  woundedAlly: WxEnemyHealApproachDotOccupant | null;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  const healSpell = pickWxEnemyHealApproachDotTriggerSpell(
    args.availableSpells,
  );
  if (!healSpell || !args.woundedAlly) return false;
  if (
    !isWxEnemyHealApproachDotWoundedAlly({
      ally: args.woundedAlly,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return false;
  }
  return !wxEnemyHealApproachDotInRange(
    args.origin,
    args.woundedAlly,
    healSpell,
  );
}

/**
 * Unique leftover: when live would approach an unhealable ally and a
 * 0-damage DoT is in range of `targetCell`, pick that DoT (highest
 * advertised dpt). Returns null when live damage>0 is the only in-range
 * nuke (Frost stays #1026), when there is no wounded-ally approach, or
 * when no DoT is in Chebyshev range.
 */
export function pickWxEnemyHealApproachDotSpell<
  T extends WxEnemyHealApproachDotSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealApproachDotTile;
  targetCell: WxEnemyHealApproachDotTile;
  woundedAlly: WxEnemyHealApproachDotOccupant | null;
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | null {
  if (
    !wxEnemyHealLiveWouldApproachWoundedAllyForDot({
      availableSpells: args.availableSpells,
      origin: args.origin,
      woundedAlly: args.woundedAlly,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return null;
  }
  const dots = args.availableSpells.filter(
    (s) =>
      isWxEnemyHealApproachDotSpell(s) &&
      wxEnemyHealApproachDotInRange(args.origin, args.targetCell, s),
  );
  if (dots.length === 0) return null;
  return dots.reduce((best, s) =>
    wxEnemyHealApproachDotPerTurn(s) > wxEnemyHealApproachDotPerTurn(best)
      ? s
      : best,
  );
}

export function isWxEnemyHealApproachDotHostile(args: {
  occupant: WxEnemyHealApproachDotOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyHealApproachDotCast(args: {
  spell: WxEnemyHealApproachDotSpell;
  availableSpells?: readonly WxEnemyHealApproachDotSpell[];
  origin: WxEnemyHealApproachDotTile;
  targetCell: WxEnemyHealApproachDotTile;
  occupant: WxEnemyHealApproachDotOccupant | null;
  woundedAlly: WxEnemyHealApproachDotOccupant | null;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isWxEnemyHealApproachDotSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyHealApproachDotSpell({
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      woundedAlly: args.woundedAlly,
      casterSide: args.casterSide,
      casterId: args.casterId,
    }) == null
  ) {
    return false;
  }
  if (
    !wxEnemyHealApproachDotInRange(args.origin, args.targetCell, args.spell)
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
  return isWxEnemyHealApproachDotHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX DoT branch cannot fork. */
export function shouldDecideWxEnemyHealApproachDotCast(
  args: Parameters<typeof canExecuteWxEnemyHealApproachDotCast>[0],
): boolean {
  return canExecuteWxEnemyHealApproachDotCast(args);
}

export function wxEnemyHealApproachDotHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
