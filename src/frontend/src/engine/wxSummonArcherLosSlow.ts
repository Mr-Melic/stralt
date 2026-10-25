/**
 * Summon-archer `decideSummonArcher` LoS-reposition vs in-range Slow.
 *
 * `SUMMON_KIT.archer` is `["starter-poison", "spell-slow"]`. Live prefers
 * Poison (`findKitSpell` kit[0] then Slow: `preferred = poison ?? slow`).
 * When Poison is missing from `availableSpells` (cooldown / spent), Slow
 * is the preferred shot. `aiCanCast` requires range AND LoS; catalog Slow
 * has no `lineOfSight: false`, so `enemySpellRequiresLos` defaults ON.
 * When Slow is in Chebyshev `Number(range)` (3) but LoS is blocked, live
 * calls `repositionForLOS` and returns `intent: "reposition-los"`
 * (`sidesteps for a shot`) with `spell: null` instead of casting.
 * `executeSummonAction` `applyCast` still has no LoS check: a decided
 * `kind: "cast"` Slow lands on the 0-damage `applyEffect` arm (#878 then
 * stamps advertised `debuffStat: "mp"`).
 *
 * Poison-present preferred Poison stays `#1095` / `#1096`. Clear-LoS
 * in-range Slow already decides cast (`#878` execute). Pack caster Frost
 * LoS stays `#1081`. Pack healer Frost LoS stays `#1090`. Hunter Venom
 * (range 2, no reposition-los arm) and bomber Inferno stay `#856` /
 * `#799`. This sidecar only fills the *archer Slow* LoS-reposition hole:
 * live would sidestep, Poison is absent so Slow is preferred, Slow is in
 * Chebyshev of a living hostile, the 2-AP wallet can pay `apCost` 2,
 * decide Slow.
 *
 * Do not steal Poison (`#1095` / `#1096`), Frost (`#1081` / `#1090` /
 * `#1054`), pack Inferno (`#967` / `#947`), Iron Skin (`#978`), Strike
 * (`#762` / `#1087` / `#1091`), or player Slow. Chebyshev vs
 * `Number(spell.range)` — do not switch to `spellRangeBase` (would
 * rebalance). Unique vs `#762` / `#799` / `#856` / `#878` / `#947` /
 * `#967` / `#978` / `#1054` / `#1081` / `#1087` / `#1090` / `#1091` /
 * `#1095` / `#1096`. WorldExploration / enemyAI / summonExecutor /
 * targeting / spellEngine / statusEffects left untouched so older open
 * PRs stay merge-clean. Restack the `decideSummonArcher` reposition-los
 * branch onto `pickWxSummonArcherLosSlowSpell` after those PRs land.
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

export type WxSummonArcherLosSlowSpell =
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

export type WxSummonArcherLosSlowTile = CasterPosition;

export type WxSummonArcherLosSlowOccupant = WxSummonArcherLosSlowTile & {
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
export function isWxSummonArcherLosSlowHealKitSpell(
  spell: WxSummonArcherLosSlowSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxSummonArcherLosSlowKitIsHealer(
  spells: readonly WxSummonArcherLosSlowSpell[],
): boolean {
  return spells.some((s) => isWxSummonArcherLosSlowHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isWxSummonArcherLosSlowBlockedFrostSpell(
  spell: WxSummonArcherLosSlowSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

/**
 * Poison leftover identity (`#1095` / `#1096`): 0-damage DoT whose
 * Chebyshev range is strictly greater than Inferno (3) / Venom (2).
 */
export function isWxSummonArcherLosSlowBlockedPoisonSpell(
  spell: WxSummonArcherLosSlowSpell,
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
  return enemySpellRange(spell as Pick<SpellConfig, "range">) > 3;
}

/**
 * Live `inferSummonArchetype` archer arm: `summonAI === "archer"` or the
 * legacy `kiter` alias, then name/pieceType containing "archer". Hunter /
 * guardian / bomber / healer never reach `decideSummonArcher`.
 */
export function wxSummonArcherLosSlowIsArcherUnit(unit: {
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
 * Slow leftover identity: 0-upfront-damage MP debuff, no DoT ticks.
 * Frost carries damage 20. Frost Nova is `hitsMultiple`. Poison / Venom
 * / Inferno are DoTs. Weaken is `debuffStat: "dmg"`.
 */
export function isWxSummonArcherLosSlowSpell(
  spell: WxSummonArcherLosSlowSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat !== "mp") return false;
  if (!spell.debuffDuration) return false;
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

/** 0-damage DoT leftover identity (Poison `#1095`/`#1096`, Venom `#856`, Inferno `#967`). */
export function isWxSummonArcherLosSlowBlockedDotSpell(
  spell: WxSummonArcherLosSlowSpell,
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

/** 0-damage buff leftover identity (`#978`). */
export function isWxSummonArcherLosSlowBlockedBuffSpell(
  spell: WxSummonArcherLosSlowSpell,
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
 * Live archer kit for this leftover: assigned Poison+Slow (catalog) or
 * Slow-only after Poison is spent. Pack bishop is Frost+Poison. Hunter
 * is Strike+Venom. Bomber is Inferno-only.
 */
export function wxSummonArcherLosSlowKitIsArcher(
  spells: readonly WxSummonArcherLosSlowSpell[],
): boolean {
  if (wxSummonArcherLosSlowKitIsHealer(spells)) return false;
  if (spells.some((s) => isWxSummonArcherLosSlowBlockedFrostSpell(s))) {
    return false;
  }
  return spells.some((s) => isWxSummonArcherLosSlowSpell(s));
}

export function wxSummonArcherLosSlowRange(
  spell: WxSummonArcherLosSlowSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / execute range half: Chebyshev vs `Number(spell.range)`. */
export function wxSummonArcherLosSlowInRange(
  origin: WxSummonArcherLosSlowTile,
  targetCell: WxSummonArcherLosSlowTile,
  spell: WxSummonArcherLosSlowSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

export function wxSummonArcherLosSlowSpellRequiresLos(
  spell: WxSummonArcherLosSlowSpell,
): boolean {
  return enemySpellRequiresLos({
    lineOfSight: spell.lineOfSight === null ? undefined : spell.lineOfSight,
  });
}

/** Same debit `applyCast` uses after `#379` / `#762`. */
export function wxSummonArcherLosSlowApCost(
  spell: WxSummonArcherLosSlowSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordWxSummonArcherLosSlowCast(
  currentAp: number,
  spell: WxSummonArcherLosSlowSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Live `preferred = poison ?? slow`. This leftover only fires when Poison
 * is absent from available so `#1095` / `#1096` keep the Poison-present
 * preferred shot.
 */
export function wxSummonArcherLosSlowLivePreferredSpell<
  T extends WxSummonArcherLosSlowSpell,
>(availableSpells: readonly T[]): T | null {
  const poison = availableSpells.find((s) =>
    isWxSummonArcherLosSlowBlockedPoisonSpell(s),
  );
  if (poison) return null;
  return availableSpells.find((s) => isWxSummonArcherLosSlowSpell(s)) ?? null;
}

/**
 * Live `decideSummonArcher` reposition-los return: `AI_LOS_REPOSITION_ENABLED`,
 * unit infers archer, kit carries Slow, Poison is not the preferred
 * available shot, Slow is in Chebyshev, LoS is required and blocked, AP
 * can pay `applyCast`. Clear LoS already casts (`#878`). Poison-present
 * preferred Poison stays `#1095` / `#1096`.
 */
export function wxSummonArcherLiveWouldRepositionLosForSlow(args: {
  assignedSpells?: readonly WxSummonArcherLosSlowSpell[];
  availableSpells: readonly WxSummonArcherLosSlowSpell[];
  origin: WxSummonArcherLosSlowTile;
  targetCell: WxSummonArcherLosSlowTile;
  archer: WxSummonArcherLosSlowOccupant;
  opponents: readonly WxSummonArcherLosSlowOccupant[];
  hasLoS: boolean;
  currentAp?: number;
}): boolean {
  if (!AI_LOS_REPOSITION_ENABLED) return false;
  if (!wxSummonArcherLosSlowIsArcherUnit(args.archer)) return false;
  const kit = args.assignedSpells ?? args.availableSpells;
  if (!wxSummonArcherLosSlowKitIsArcher(kit)) return false;
  if (args.opponents.length === 0) return false;
  if (!isAliveCombatant({ hp: args.archer.hp ?? 0 })) return false;
  if (args.hasLoS) return false;
  const preferred = wxSummonArcherLosSlowLivePreferredSpell(
    args.availableSpells,
  );
  if (!preferred || !isWxSummonArcherLosSlowSpell(preferred)) return false;
  if (!canAffordWxSummonArcherLosSlowCast(args.currentAp ?? 2, preferred)) {
    return false;
  }
  if (!wxSummonArcherLosSlowSpellRequiresLos(preferred)) return false;
  return wxSummonArcherLosSlowInRange(args.origin, args.targetCell, preferred);
}

/**
 * Unique leftover: when live would sidestep for LoS and Slow is the live
 * preferred dest (Poison absent), pick that Slow. Returns null when LoS
 * is already clear (`#878`), when Poison is still preferred (`#1095` /
 * `#1096`), when the wallet cannot pay `applyCast` (`#762`), when the
 * kit is not an archer (hunter Venom, pack Frost, healer), or when
 * preferred is Inferno / Strike / Poison.
 */
export function pickWxSummonArcherLosSlowSpell<
  T extends WxSummonArcherLosSlowSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxSummonArcherLosSlowTile;
  targetCell: WxSummonArcherLosSlowTile;
  opponents: readonly WxSummonArcherLosSlowOccupant[];
  archer: WxSummonArcherLosSlowOccupant;
  hasLoS: boolean;
  currentAp?: number;
}): T | null {
  if (
    !wxSummonArcherLiveWouldRepositionLosForSlow({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      origin: args.origin,
      targetCell: args.targetCell,
      archer: args.archer,
      opponents: args.opponents,
      hasLoS: args.hasLoS,
      currentAp: args.currentAp,
    })
  ) {
    return null;
  }
  const live = wxSummonArcherLosSlowLivePreferredSpell(args.availableSpells);
  if (!live || !isWxSummonArcherLosSlowSpell(live)) return null;
  return live;
}

export function isWxSummonArcherLosSlowHostile(args: {
  occupant: WxSummonArcherLosSlowOccupant;
  archerSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.archerSide;
}

export function canExecuteWxSummonArcherLosSlowCast(args: {
  spell: WxSummonArcherLosSlowSpell;
  assignedSpells?: readonly WxSummonArcherLosSlowSpell[];
  availableSpells?: readonly WxSummonArcherLosSlowSpell[];
  origin: WxSummonArcherLosSlowTile;
  targetCell: WxSummonArcherLosSlowTile;
  occupant: WxSummonArcherLosSlowOccupant | null;
  opponents: readonly WxSummonArcherLosSlowOccupant[];
  archer: WxSummonArcherLosSlowOccupant;
  archerSide: "player" | "enemy";
  hasLoS: boolean;
  currentAp?: number;
}): boolean {
  if (!isWxSummonArcherLosSlowSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxSummonArcherLosSlowSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      archer: args.archer,
      hasLoS: args.hasLoS,
      currentAp: args.currentAp,
    }) == null
  ) {
    return false;
  }
  if (!wxSummonArcherLosSlowInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!canAffordWxSummonArcherLosSlowCast(args.currentAp ?? 2, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxSummonArcherLosSlowHostile({
    occupant: args.occupant,
    archerSide: args.archerSide,
  });
}

/** Alias so decide and the summon execute branch cannot fork. */
export function shouldDecideWxSummonArcherLosSlowCast(
  args: Parameters<typeof canExecuteWxSummonArcherLosSlowCast>[0],
): boolean {
  return canExecuteWxSummonArcherLosSlowCast(args);
}

export function wxSummonArcherLosSlowHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
