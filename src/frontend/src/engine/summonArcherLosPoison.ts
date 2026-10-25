/**
 * Player auto-summon `decideSummonArcher` LoS-reposition vs in-range Poison.
 *
 * Summon Archer kit is `[starter-poison, spell-slow]`. `decideSummonArcher`
 * prefers Poison (`findKitSpell` of the first kit id) and requires
 * `aiCanCast` (range AND LoS; Poison has no `lineOfSight: false`, so
 * `enemySpellRequiresLos` defaults ON). When Poison is in Chebyshev range
 * but LoS is blocked, live returns `intent: "reposition-los"` (`sidesteps
 * for a shot`) with `spell: null` instead of casting. `executeSummonAction`
 * `applyCast` still skips LoS: a `kind: "cast"` Poison with AP and a
 * living target applies the advertised DoT ticks.
 *
 * Pack bishop Poison when Frost is absent stays on `#967`. Pack caster
 * LoS Frost stays on `#1081`. Hunter Venom is 3 AP on a 2-AP wolf
 * (`#762` AP gate) and has no reposition arm. Bomber Inferno is `#799`.
 * Slow-on-approaching is `#878`. Player-controlled kit highlight is
 * `#757`. This sidecar only fills the *auto-summon archer* LoS-reposition
 * hole: live would sidestep, Poison is in Chebyshev of a living opposite-
 * side occupant, the 2-AP wallet can pay `apCost` 2, decide Poison.
 *
 * Unique vs `#432` / `#700` / `#757` / `#762` / `#799` / `#856` / `#861` /
 * `#878` / `#967` / `#1081`. WorldExploration / enemyAI / summonExecutor /
 * targeting / spellEngine / statusEffects left untouched so older open
 * PRs stay merge-clean. Restack the `decideSummonArcher` reposition-los
 * branch onto `pickSummonArcherLosPoisonSpell` after those PRs land.
 */

import { AI_LOS_REPOSITION_ENABLED } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonArcherLosPoisonSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "apCost"
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
      | "dotType"
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
      apCost?: unknown;
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
      dotType?: string | null;
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

export type SummonArcherLosPoisonTile = CasterPosition;

export type SummonArcherLosPoisonOccupant = SummonArcherLosPoisonTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
  summonAI?: string;
};

/** Live `inferSummonArchetype`: `summonAI` archer, plus the kiter alias. */
export function isSummonArcherLosPoisonArchetype(
  summonAI: string | null | undefined,
): boolean {
  const raw = (summonAI ?? "").toLowerCase();
  return raw === "archer" || raw === "kiter";
}

/**
 * Poison Arrow leftover identity: 0-upfront-damage DoT whose Chebyshev
 * range is strictly greater than Venom (2) and Inferno (3). Slow carries
 * `debuffStat`. Frost / Strike have `damage > 0`.
 */
export function isSummonArcherLosPoisonSpell(
  spell: SummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  if (spell.isDotSpell !== true && spell.effectType !== "dot") return false;
  if (enemySpellRange(spell as Pick<SpellConfig, "range">) <= 3) return false;
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

/** Hunter Venom leftover identity (range 2, 3 AP on a 2-AP wolf). */
export function isSummonArcherLosPoisonBlockedVenomSpell(
  spell: SummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  if (spell.isDotSpell !== true && spell.effectType !== "dot") return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 2;
}

/** Bomber Inferno leftover identity (`#799` / `#967`). */
export function isSummonArcherLosPoisonBlockedInfernoSpell(
  spell: SummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  if (spell.isDotSpell !== true && spell.effectType !== "dot") return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 3;
}

export function summonArcherLosPoisonRange(
  spell: SummonArcherLosPoisonSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

export function summonArcherLosPoisonInRange(
  origin: SummonArcherLosPoisonTile,
  targetCell: SummonArcherLosPoisonTile,
  spell: SummonArcherLosPoisonSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

export function summonArcherLosPoisonSpellRequiresLos(
  spell: SummonArcherLosPoisonSpell,
): boolean {
  return enemySpellRequiresLos({
    lineOfSight: spell.lineOfSight === null ? undefined : spell.lineOfSight,
  });
}

/** Same debit `applyCast` uses after `#379` / `#762`. */
export function summonArcherLosPoisonApCost(
  spell: SummonArcherLosPoisonSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonArcherLosPoisonCast(
  currentAp: number,
  spell: SummonArcherLosPoisonSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Live `decideSummonArcher` preferred-shot pick: first kit id that is
 * ready (available, else assigned) and matches the Poison leftover.
 */
export function summonArcherLosPoisonLivePreferredSpell<
  T extends SummonArcherLosPoisonSpell,
>(args: {
  availableSpells: readonly T[];
  assignedSpells?: readonly T[];
}): T | null {
  const fromAvailable = args.availableSpells.find((s) =>
    isSummonArcherLosPoisonSpell(s),
  );
  if (fromAvailable) return fromAvailable;
  const assigned = args.assignedSpells ?? [];
  return assigned.find((s) => isSummonArcherLosPoisonSpell(s)) ?? null;
}

/**
 * Live `decideSummonArcher` reposition-los return: archer/kiter AI, a
 * threat exists, Poison is the preferred kit shot in Chebyshev, LoS is
 * required and blocked, AP can pay `applyCast`, and
 * `AI_LOS_REPOSITION_ENABLED` still arms the sidestep.
 */
export function summonArcherLiveWouldRepositionLosForPoison(args: {
  summonAI?: string | null;
  assignedSpells?: readonly SummonArcherLosPoisonSpell[];
  availableSpells: readonly SummonArcherLosPoisonSpell[];
  origin: SummonArcherLosPoisonTile;
  targetCell: SummonArcherLosPoisonTile;
  caster: SummonArcherLosPoisonOccupant;
  opponents: readonly SummonArcherLosPoisonOccupant[];
  currentAp: number;
  hasLoS: boolean;
}): boolean {
  if (!AI_LOS_REPOSITION_ENABLED) return false;
  if (
    !isSummonArcherLosPoisonArchetype(args.summonAI ?? args.caster.summonAI)
  ) {
    return false;
  }
  if (args.opponents.length === 0) return false;
  if (!isAliveCombatant({ hp: args.caster.hp ?? 0 })) return false;
  if (args.hasLoS) return false;
  const preferred = summonArcherLosPoisonLivePreferredSpell({
    availableSpells: args.availableSpells,
    assignedSpells: args.assignedSpells,
  });
  if (!preferred || !isSummonArcherLosPoisonSpell(preferred)) return false;
  if (!canAffordSummonArcherLosPoisonCast(args.currentAp, preferred)) {
    return false;
  }
  if (!summonArcherLosPoisonSpellRequiresLos(preferred)) return false;
  return summonArcherLosPoisonInRange(args.origin, args.targetCell, preferred);
}

/**
 * Unique leftover: when live would sidestep for LoS and Poison is the
 * preferred kit dest, pick that Poison. Returns null when LoS is already
 * clear (live already casts), when the wallet cannot pay `applyCast`
 * (`#762`), when the unit is not an archer, or when the ready shot is
 * Venom / Inferno / Slow / Frost.
 */
export function pickSummonArcherLosPoisonSpell<
  T extends SummonArcherLosPoisonSpell,
>(args: {
  summonAI?: string | null;
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: SummonArcherLosPoisonTile;
  targetCell: SummonArcherLosPoisonTile;
  opponents: readonly SummonArcherLosPoisonOccupant[];
  caster: SummonArcherLosPoisonOccupant;
  currentAp: number;
  hasLoS: boolean;
}): T | null {
  if (
    !summonArcherLiveWouldRepositionLosForPoison({
      summonAI: args.summonAI,
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      origin: args.origin,
      targetCell: args.targetCell,
      caster: args.caster,
      opponents: args.opponents,
      currentAp: args.currentAp,
      hasLoS: args.hasLoS,
    })
  ) {
    return null;
  }
  const preferred = summonArcherLosPoisonLivePreferredSpell({
    availableSpells: args.availableSpells,
    assignedSpells: args.assignedSpells,
  });
  if (!preferred || !isSummonArcherLosPoisonSpell(preferred)) return null;
  return preferred;
}

export function isSummonArcherLosPoisonHostile(args: {
  occupant: SummonArcherLosPoisonOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteSummonArcherLosPoisonCast(args: {
  spell: SummonArcherLosPoisonSpell;
  summonAI?: string | null;
  assignedSpells?: readonly SummonArcherLosPoisonSpell[];
  availableSpells?: readonly SummonArcherLosPoisonSpell[];
  origin: SummonArcherLosPoisonTile;
  targetCell: SummonArcherLosPoisonTile;
  occupant: SummonArcherLosPoisonOccupant | null;
  opponents: readonly SummonArcherLosPoisonOccupant[];
  caster: SummonArcherLosPoisonOccupant;
  casterSide: "player" | "enemy";
  currentAp: number;
  hasLoS: boolean;
}): boolean {
  if (!isSummonArcherLosPoisonSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickSummonArcherLosPoisonSpell({
      summonAI: args.summonAI,
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      caster: args.caster,
      currentAp: args.currentAp,
      hasLoS: args.hasLoS,
    }) == null
  ) {
    return false;
  }
  if (!summonArcherLosPoisonInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!canAffordSummonArcherLosPoisonCast(args.currentAp, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isSummonArcherLosPoisonHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and `applyCast` cannot fork. */
export function shouldDecideSummonArcherLosPoisonCast(
  args: Parameters<typeof canExecuteSummonArcherLosPoisonCast>[0],
): boolean {
  return canExecuteSummonArcherLosPoisonCast(args);
}

export function summonArcherLosPoisonHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
