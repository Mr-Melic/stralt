/**
 * Summon-archer `decideSummonArcher` LoS-reposition vs in-range Poison Arrow.
 *
 * `SUMMON_KIT.archer` is `["starter-poison", "spell-slow"]`. Live prefers
 * Poison (`findKitSpell` kit[0] then Slow). `aiCanCast` requires range AND
 * LoS; catalog Poison has no `lineOfSight: false`, so
 * `enemySpellRequiresLos` defaults ON. When Poison is in Chebyshev
 * `Number(range)` (4) but LoS is blocked, live calls `repositionForLOS`
 * and returns `intent: "reposition-los"` (`sidesteps for a shot`) with
 * `spell: null` / `kind: "move"` instead of casting. `executeSummonAction`
 * `applyCast` still has no LoS check: a decided `kind: "cast"` Poison
 * lands on the 0-damage `applyEffect` arm (#856 then stamps advertised
 * `dotDamagePerTurn`).
 *
 * Clear-LoS in-range Poison already decides cast (#856 execute). Pack
 * caster Frost LoS stays `#1081`. Pack healer Frost LoS stays `#1090`.
 * Pack 0-damage DoT decide stays `#967`. Hunter Venom (range 2, no
 * reposition-los arm) and bomber Inferno stay `#856` / `#799`. Slow
 * after a failed Poison shot stays `#878`. This sidecar only fills the
 * *archer* LoS-reposition hole: live would sidestep, Poison is in
 * Chebyshev of a living hostile, decide Poison.
 *
 * Do not steal Frost (`#1081` / `#1090` / `#1054`), Slow (`#878`),
 * pack Inferno (`#967` / `#947`), Iron Skin (`#978`), Strike (`#762` /
 * `#1087` / `#1091`), or player Poison. Chebyshev vs `Number(spell.range)`
 * — do not switch to `spellRangeBase` (would rebalance). No AP (live
 * summon AP is the execute gate on `#856`).
 *
 * Unique vs `#762` / `#799` / `#856` / `#878` / `#947` / `#967` / `#978` /
 * `#1054` / `#1081` / `#1087` / `#1090` / `#1091`. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects left
 * untouched so older open PRs stay merge-clean. Restack the
 * `decideSummonArcher` reposition-los branch onto
 * `pickWxSummonArcherLosPoisonSpell` after those PRs land.
 */

import { AI_LOS_REPOSITION_ENABLED } from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";

export type WxSummonArcherLosPoisonSpell =
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

export type WxSummonArcherLosPoisonTile = CasterPosition;

export type WxSummonArcherLosPoisonOccupant = WxSummonArcherLosPoisonTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
  summonAI?: string;
  pieceType?: string;
  name?: string;
};

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxSummonArcherLosPoisonHealKitSpell(
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxSummonArcherLosPoisonKitIsHealer(
  spells: readonly WxSummonArcherLosPoisonSpell[],
): boolean {
  return spells.some((s) => isWxSummonArcherLosPoisonHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isWxSummonArcherLosPoisonBlockedFrostSpell(
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

/**
 * Slow leftover identity (`#878`): 0-damage MP debuff, no DoT.
 */
export function isWxSummonArcherLosPoisonBlockedSlowSpell(
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
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
  return true;
}

/**
 * Live `inferSummonArchetype` archer arm: `summonAI === "archer"` or the
 * legacy `kiter` alias, then name/pieceType containing "archer". Hunter /
 * guardian / bomber / healer never reach `decideSummonArcher`.
 */
export function wxSummonArcherLosPoisonIsArcherUnit(unit: {
  summonAI?: string;
  pieceType?: string;
  name?: string;
}): boolean {
  const raw = (unit.summonAI ?? "").toLowerCase();
  if (raw === "kiter" || raw === "archer") return true;
  const pt = (unit.pieceType ?? unit.name ?? "").toLowerCase();
  return pt.includes("archer");
}

/**
 * Poison Arrow leftover identity: 0-damage DoT with Chebyshev range above
 * Inferno (3) and Venom (2). Slow is 0-damage MP without ticks. Frost is
 * upfront damage. Inferno / Venom stay on `#967` / `#856` / `#799`.
 */
export function isWxSummonArcherLosPoisonSpell(
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  if (!(spell.isDotSpell === true || spell.effectType === "dot")) return false;
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

/** 0-damage shorter-range DoT leftover identity (Venom `#856`, Inferno `#967`). */
export function isWxSummonArcherLosPoisonBlockedOtherDotSpell(
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  if (!(spell.isDotSpell === true || spell.effectType === "dot")) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) <= 3;
}

/** 0-damage buff leftover identity (`#978`). */
export function isWxSummonArcherLosPoisonBlockedBuffSpell(
  spell: WxSummonArcherLosPoisonSpell,
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

/**
 * Live archer kit: Poison Arrow + Slow, no heal, no Frost. Pack bishop is
 * Frost+Poison. Hunter is Strike+Venom. Bomber is Inferno-only.
 */
export function wxSummonArcherLosPoisonKitIsArcher(
  spells: readonly WxSummonArcherLosPoisonSpell[],
): boolean {
  if (wxSummonArcherLosPoisonKitIsHealer(spells)) return false;
  if (spells.some((s) => isWxSummonArcherLosPoisonBlockedFrostSpell(s))) {
    return false;
  }
  const hasPoison = spells.some((s) => isWxSummonArcherLosPoisonSpell(s));
  const hasSlow = spells.some((s) =>
    isWxSummonArcherLosPoisonBlockedSlowSpell(s),
  );
  return hasPoison && hasSlow;
}

export function wxSummonArcherLosPoisonRange(
  spell: WxSummonArcherLosPoisonSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / execute range half: Chebyshev vs `Number(spell.range)`. */
export function wxSummonArcherLosPoisonInRange(
  origin: WxSummonArcherLosPoisonTile,
  targetCell: WxSummonArcherLosPoisonTile,
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

export function wxSummonArcherLosPoisonSpellRequiresLos(
  spell: WxSummonArcherLosPoisonSpell,
): boolean {
  return enemySpellRequiresLos({
    lineOfSight: spell.lineOfSight === null ? undefined : spell.lineOfSight,
  });
}

/**
 * Live `preferred = poison ?? slow`. This leftover only fires when Poison
 * is present so Slow (`#878`) is not stolen on a Poison-empty kit.
 */
export function wxSummonArcherLosPoisonLivePreferredSpell<
  T extends WxSummonArcherLosPoisonSpell,
>(availableSpells: readonly T[]): T | null {
  const poison = availableSpells.find((s) => isWxSummonArcherLosPoisonSpell(s));
  return poison ?? null;
}

/**
 * Live `decideSummonArcher` reposition-los return: `AI_LOS_REPOSITION_ENABLED`,
 * unit infers archer, kit is Poison+Slow, Poison is preferred and in
 * Chebyshev, LoS is required and blocked. Clear LoS already casts (`#856`).
 */
export function wxSummonArcherLiveWouldRepositionLosForPoison(args: {
  assignedSpells?: readonly WxSummonArcherLosPoisonSpell[];
  availableSpells: readonly WxSummonArcherLosPoisonSpell[];
  origin: WxSummonArcherLosPoisonTile;
  targetCell: WxSummonArcherLosPoisonTile;
  archer: WxSummonArcherLosPoisonOccupant;
  opponents: readonly WxSummonArcherLosPoisonOccupant[];
  hasLoS: boolean;
}): boolean {
  if (!AI_LOS_REPOSITION_ENABLED) return false;
  if (!wxSummonArcherLosPoisonIsArcherUnit(args.archer)) return false;
  const kit = args.assignedSpells ?? args.availableSpells;
  if (!wxSummonArcherLosPoisonKitIsArcher(kit)) return false;
  if (args.opponents.length === 0) return false;
  if (!isAliveCombatant({ hp: args.archer.hp ?? 0 })) return false;
  if (args.hasLoS) return false;
  const preferred = wxSummonArcherLosPoisonLivePreferredSpell(
    args.availableSpells,
  );
  if (!preferred || !isWxSummonArcherLosPoisonSpell(preferred)) return false;
  if (!wxSummonArcherLosPoisonSpellRequiresLos(preferred)) return false;
  return wxSummonArcherLosPoisonInRange(
    args.origin,
    args.targetCell,
    preferred,
  );
}

/**
 * Unique leftover: when live would sidestep for LoS and Poison is the live
 * preferred dest, pick that Poison. Returns null when LoS is already
 * clear (`#856`), when the kit is not an archer (hunter Venom, pack Frost,
 * healer), or when preferred is Slow / Inferno / Strike.
 */
export function pickWxSummonArcherLosPoisonSpell<
  T extends WxSummonArcherLosPoisonSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxSummonArcherLosPoisonTile;
  targetCell: WxSummonArcherLosPoisonTile;
  opponents: readonly WxSummonArcherLosPoisonOccupant[];
  archer: WxSummonArcherLosPoisonOccupant;
  hasLoS: boolean;
}): T | null {
  if (
    !wxSummonArcherLiveWouldRepositionLosForPoison({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      origin: args.origin,
      targetCell: args.targetCell,
      archer: args.archer,
      opponents: args.opponents,
      hasLoS: args.hasLoS,
    })
  ) {
    return null;
  }
  const live = wxSummonArcherLosPoisonLivePreferredSpell(args.availableSpells);
  if (!live || !isWxSummonArcherLosPoisonSpell(live)) return null;
  return live;
}

export function isWxSummonArcherLosPoisonHostile(args: {
  occupant: WxSummonArcherLosPoisonOccupant;
  archerSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.archerSide;
}

export function canExecuteWxSummonArcherLosPoisonCast(args: {
  spell: WxSummonArcherLosPoisonSpell;
  assignedSpells?: readonly WxSummonArcherLosPoisonSpell[];
  availableSpells?: readonly WxSummonArcherLosPoisonSpell[];
  origin: WxSummonArcherLosPoisonTile;
  targetCell: WxSummonArcherLosPoisonTile;
  occupant: WxSummonArcherLosPoisonOccupant | null;
  opponents: readonly WxSummonArcherLosPoisonOccupant[];
  archer: WxSummonArcherLosPoisonOccupant;
  archerSide: "player" | "enemy";
  hasLoS: boolean;
}): boolean {
  if (!isWxSummonArcherLosPoisonSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxSummonArcherLosPoisonSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      archer: args.archer,
      hasLoS: args.hasLoS,
    }) == null
  ) {
    return false;
  }
  if (
    !wxSummonArcherLosPoisonInRange(args.origin, args.targetCell, args.spell)
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
  return isWxSummonArcherLosPoisonHostile({
    occupant: args.occupant,
    archerSide: args.archerSide,
  });
}

/** Alias so decide and the summon execute branch cannot fork. */
export function shouldDecideWxSummonArcherLosPoisonCast(
  args: Parameters<typeof canExecuteWxSummonArcherLosPoisonCast>[0],
): boolean {
  return canExecuteWxSummonArcherLosPoisonCast(args);
}

export function wxSummonArcherLosPoisonHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
