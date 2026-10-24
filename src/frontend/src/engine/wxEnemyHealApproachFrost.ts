/**
 * Pack-enemy `decideHealer` wounded-ally approach vs in-range Frost.
 *
 * Queen `buildEnemyKit` z>=1 is `[starter-frost, starter-heal]`.
 * `inferArchetype` marks any heal kit as healer. `decideHealer` then
 * heals the most-wounded *ally* below 50% when Chebyshev ≤
 * `Number(healSpell.range)`. Blood Mend is `range: 0` / `targetType:
 * "self"`, so a distinct ally is always out of range and the branch
 * returns `kind: "move"` / `intent: "approach-ally"` before
 * `decideCaster` → `pickBestDamageSpell`. In-range Frost never fires.
 *
 * #989 is the empty-damage heal *picker* once `decideCaster` is
 * reached. #985 is self-heal when *no* wounded ally exists. #757 /
 * #924 are range-0 heal execute. This sidecar is the remaining
 * approach-vs-Frost leftover: when live would walk toward an
 * unhealable ally and Frost is in Chebyshev range of a living
 * hostile, decide Frost instead of approach.
 *
 * Do not steal queen z>=2 Inferno (#967), rook Iron Skin (#978),
 * Strike / Drain (#762 / #921), Slow, or player Frost Bolt MP (#905).
 * Chebyshev vs `Number(spell.range)` — do not switch to
 * `spellRangeBase` (would rebalance). No LoS (healer skips LoS; WX
 * pack execute does too). No AP (WX does not debit enemy AP).
 *
 * Unique vs #692 / #757 / #762 / #905 / #924 / #967 / #978 / #985 /
 * #989. WorldExploration / enemyAI / summonExecutor / targeting /
 * spellEngine / statusEffects left untouched so older open PRs stay
 * merge-clean. Restack the `decideHealer` out-of-range branch onto
 * `pickWxEnemyHealApproachFrostSpell` after those PRs land.
 */

import { ENEMY_HEAL_ALLY_THRESHOLD_PCT } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealApproachFrostSpell =
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

export type WxEnemyHealApproachFrostTile = CasterPosition;

export type WxEnemyHealApproachFrostOccupant = WxEnemyHealApproachFrostTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
};

/**
 * Range-0 self/ally heal that `decideHealer` uses as `healSpell`
 * (Blood Mend). Drain `healAmount` stays on #921. Do not require
 * `buffStat` — that identity is #989 / #924.
 */
export function isWxEnemyHealApproachTriggerSpell(
  spell: WxEnemyHealApproachFrostSpell,
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
export function wxEnemyHealApproachTriggerRequiresZeroRange(
  spell: WxEnemyHealApproachFrostSpell,
): boolean {
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 0;
}

/**
 * Frost Bolt leftover identity: `damage > 0` + advertised MP debuff.
 * Strike has no `debuffStat`. Slow is 0-damage. Frost Nova is
 * `hitsMultiple`. Inferno / Iron Skin stay on #967 / #978.
 */
export function isWxEnemyHealApproachFrostSpell(
  spell: WxEnemyHealApproachFrostSpell,
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

/** 0-damage DoT leftover identity (#967). Inlined so this sidecar does not import that PR. */
export function isWxEnemyHealApproachBlockedDotSpell(
  spell: WxEnemyHealApproachFrostSpell,
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
export function isWxEnemyHealApproachBlockedBuffSpell(
  spell: WxEnemyHealApproachFrostSpell,
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

export function wxEnemyHealApproachFrostRange(
  spell: WxEnemyHealApproachFrostSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealApproachFrostInRange(
  origin: WxEnemyHealApproachFrostTile,
  targetCell: WxEnemyHealApproachFrostTile,
  spell: WxEnemyHealApproachFrostSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyHealApproachLivePickBestDamageSpellSelects(
  spell: WxEnemyHealApproachFrostSpell,
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

export function wxEnemyHealApproachLivePickBestDamageSpell<
  T extends WxEnemyHealApproachFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealApproachFrostTile;
  targetCell: WxEnemyHealApproachFrostTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyHealApproachLivePickBestDamageSpellSelects(s) &&
      wxEnemyHealApproachFrostInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

export function wxEnemyHealApproachAllyHpFrac(ally: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(ally.hp ?? 0);
  const max = Math.max(1, Number(ally.maxHp ?? hp));
  return Math.max(0, Math.min(1, hp / max));
}

export function isWxEnemyHealApproachWoundedAlly(args: {
  ally: WxEnemyHealApproachFrostOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isAliveCombatant({ hp: args.ally.hp ?? 0 })) return false;
  if (args.casterId && args.ally.id === args.casterId) return false;
  const side = args.ally.side === "player" ? "player" : "enemy";
  if (side !== args.casterSide) return false;
  return (
    wxEnemyHealApproachAllyHpFrac(args.ally) < ENEMY_HEAL_ALLY_THRESHOLD_PCT
  );
}

export function pickWxEnemyHealApproachTriggerSpell<
  T extends WxEnemyHealApproachFrostSpell,
>(availableSpells: readonly T[]): T | null {
  const found = availableSpells.find(
    (s) =>
      isWxEnemyHealApproachTriggerSpell(s) &&
      wxEnemyHealApproachTriggerRequiresZeroRange(s),
  );
  return found ?? null;
}

/**
 * Live `decideHealer` out-of-range branch: wounded ally exists, range-0
 * heal cannot reach them, so the function returns approach-ally and
 * never reaches `decideCaster`.
 */
export function wxEnemyHealLiveWouldApproachWoundedAlly(args: {
  availableSpells: readonly WxEnemyHealApproachFrostSpell[];
  origin: WxEnemyHealApproachFrostTile;
  woundedAlly: WxEnemyHealApproachFrostOccupant | null;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  const healSpell = pickWxEnemyHealApproachTriggerSpell(args.availableSpells);
  if (!healSpell || !args.woundedAlly) return false;
  if (
    !isWxEnemyHealApproachWoundedAlly({
      ally: args.woundedAlly,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return false;
  }
  return !wxEnemyHealApproachFrostInRange(
    args.origin,
    args.woundedAlly,
    healSpell,
  );
}

function wxEnemyHealApproachOtherLeftoverInRange<
  T extends WxEnemyHealApproachFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealApproachFrostTile;
  targetCell: WxEnemyHealApproachFrostTile;
}): boolean {
  return args.availableSpells.some(
    (s) =>
      (isWxEnemyHealApproachBlockedDotSpell(s) ||
        isWxEnemyHealApproachBlockedBuffSpell(s)) &&
      wxEnemyHealApproachFrostInRange(args.origin, args.targetCell, s),
  );
}

/**
 * Unique leftover: when live would approach an unhealable ally and
 * Frost is in range of `targetCell`, pick that Frost. Returns null
 * when live damage>0 is empty, when Inferno / Iron Skin leftovers
 * already own the dest, or when there is no wounded-ally approach.
 */
export function pickWxEnemyHealApproachFrostSpell<
  T extends WxEnemyHealApproachFrostSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealApproachFrostTile;
  targetCell: WxEnemyHealApproachFrostTile;
  woundedAlly: WxEnemyHealApproachFrostOccupant | null;
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | null {
  if (
    !wxEnemyHealLiveWouldApproachWoundedAlly({
      availableSpells: args.availableSpells,
      origin: args.origin,
      woundedAlly: args.woundedAlly,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return null;
  }
  if (wxEnemyHealApproachOtherLeftoverInRange(args)) return null;
  const live = wxEnemyHealApproachLivePickBestDamageSpell({
    availableSpells: args.availableSpells,
    origin: args.origin,
    targetCell: args.targetCell,
  });
  if (!live || !isWxEnemyHealApproachFrostSpell(live)) return null;
  return live;
}

export function isWxEnemyHealApproachFrostHostile(args: {
  occupant: WxEnemyHealApproachFrostOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyHealApproachFrostCast(args: {
  spell: WxEnemyHealApproachFrostSpell;
  availableSpells?: readonly WxEnemyHealApproachFrostSpell[];
  origin: WxEnemyHealApproachFrostTile;
  targetCell: WxEnemyHealApproachFrostTile;
  occupant: WxEnemyHealApproachFrostOccupant | null;
  woundedAlly: WxEnemyHealApproachFrostOccupant | null;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isWxEnemyHealApproachFrostSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyHealApproachFrostSpell({
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
    !wxEnemyHealApproachFrostInRange(args.origin, args.targetCell, args.spell)
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
  return isWxEnemyHealApproachFrostHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyHealApproachFrostCast(
  args: Parameters<typeof canExecuteWxEnemyHealApproachFrostCast>[0],
): boolean {
  return canExecuteWxEnemyHealApproachFrostCast(args);
}

export function wxEnemyHealApproachFrostHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
