/**
 * Summon-hunter `decideSummonHunter` LoS-blocked Venom vs stalk/melee.
 *
 * `SUMMON_KIT.hunter` is `["physical_attack", "spell-venom-strike"]`. Live
 * looks up kit[1] Venom (`findKitSpell`) and prefers it when Chebyshev
 * `Number(range)` (2) holds. `aiCanCast` requires range AND LoS; catalog
 * Venom has no `lineOfSight: false`, so `enemySpellRequiresLos` defaults
 * ON. Unlike `decideSummonArcher`, hunter has **no** `repositionForLOS`
 * arm: in-range wall-blocked Venom falls through to melee when adjacent
 * or `intent: "advance"` stalk when Chebyshev is 2. `executeSummonAction`
 * `applyCast` still has no LoS check: a decided `kind: "cast"` Venom
 * lands on the 0-damage `applyEffect` arm (#856 then stamps advertised
 * `dotDamagePerTurn`).
 *
 * Chebyshev 1 Bresenham has no intermediate, so live already casts
 * (`#856` ticks). Clear-LoS Chebyshev 2 already decides cast (`#856`).
 * Pack `pickBestDamageSpell` never selects 0-damage Venom (`#967`).
 * Archer Poison LoS stays `#1095` / `#1096`. Archer Slow LoS-reposition
 * stays `#1098`. This sidecar only fills the *hunter Venom* LoS-blocked
 * stalk hole: live would stalk, Venom is in Chebyshev 2 of a living
 * hostile, LoS is required and blocked, the wallet can pay `apCost` 3
 * (`applyCast` after `#379` / `#762`). Catalog wolf `summonUnitDef.ap`
 * is 2, which cannot pay Venom 3 — unique fire needs `currentAp >= 3`;
 * do not rebalance wolf AP or Venom cost.
 *
 * Do not steal Poison (`#1095` / `#1096`), Slow (`#1098`), Frost
 * (`#1081` / `#1090` / `#1054`), pack Inferno (`#967` / `#947`), Iron
 * Skin (`#978`), Strike (`#762` / `#1087` / `#1091`), or Venom ticks
 * (`#856`). Chebyshev vs `Number(spell.range)` — do not switch to
 * `spellRangeBase` (would rebalance). Unique vs `#762` / `#799` / `#856`
 * / `#878` / `#947` / `#967` / `#978` / `#1054` / `#1081` / `#1087` /
 * `#1090` / `#1091` / `#1095` / `#1096` / `#1098`. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects
 * left untouched so older open PRs stay merge-clean. Restack the
 * `decideSummonHunter` failed-`aiCanCast` fallthrough onto
 * `pickWxSummonHunterLosVenomSpell` after those PRs land.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  chebyshevOnBoard,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
  resolveCastApCost,
} from "./targeting.ts";

export type WxSummonHunterLosVenomSpell =
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

export type WxSummonHunterLosVenomTile = CasterPosition;

export type WxSummonHunterLosVenomOccupant = WxSummonHunterLosVenomTile & {
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
export function isWxSummonHunterLosVenomHealKitSpell(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxSummonHunterLosVenomKitIsHealer(
  spells: readonly WxSummonHunterLosVenomSpell[],
): boolean {
  return spells.some((s) => isWxSummonHunterLosVenomHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isWxSummonHunterLosVenomBlockedFrostSpell(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

function isZeroDamageDot(spell: WxSummonHunterLosVenomSpell): boolean {
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

/**
 * Poison leftover identity (`#1095` / `#1096`): 0-damage DoT whose
 * Chebyshev range is strictly greater than Inferno (3) / Venom (2).
 */
export function isWxSummonHunterLosVenomBlockedPoisonSpell(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) > 3;
}

/**
 * Inferno leftover identity (`#799` / `#967`): 0-damage DoT at Chebyshev 3.
 */
export function isWxSummonHunterLosVenomBlockedInfernoSpell(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 3;
}

/**
 * Slow leftover identity (`#1098`): 0-upfront-damage MP debuff, no DoT.
 */
export function isWxSummonHunterLosVenomBlockedSlowSpell(
  spell: WxSummonHunterLosVenomSpell,
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
  return true;
}

/**
 * Live `inferSummonArchetype` hunter arm: `summonAI === "hunter"`, then
 * name/pieceType containing "wolf". Archer / guardian / bomber / healer
 * never reach `decideSummonHunter`. Do not use live's unknown-default
 * hunter (that would steal pack pawn Strike+Venom).
 */
export function wxSummonHunterLosVenomIsHunterUnit(unit: {
  summonAI?: string;
  pieceType?: string;
  name?: string;
}): boolean {
  const raw = (unit.summonAI ?? "").toLowerCase();
  if (raw === "hunter") return true;
  if (
    raw === "kiter" ||
    raw === "archer" ||
    raw === "bomber" ||
    raw === "healer" ||
    raw === "guardian" ||
    raw === "kamikaze"
  ) {
    return false;
  }
  const pt = (unit.pieceType ?? unit.name ?? "").toLowerCase();
  return pt.includes("wolf");
}

/**
 * Venom leftover identity: 0-upfront-damage DoT at Chebyshev 2. Poison
 * is range 4. Inferno is range 3. Strike has damage 10. Slow is MP
 * debuff with no ticks.
 */
export function isWxSummonHunterLosVenomSpell(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 2;
}

/** 0-damage DoT leftover identity (Poison `#1095`/`#1096`, Inferno `#967`). */
export function isWxSummonHunterLosVenomBlockedDotSpell(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  return isZeroDamageDot(spell);
}

/** 0-damage buff leftover identity (`#978`). */
export function isWxSummonHunterLosVenomBlockedBuffSpell(
  spell: WxSummonHunterLosVenomSpell,
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
 * Live hunter kit for this leftover: assigned Strike+Venom (catalog) or
 * Venom-only after Strike is spent. Pack bishop is Frost+Poison. Archer
 * is Poison+Slow. Bomber is Inferno-only.
 */
export function wxSummonHunterLosVenomKitIsHunter(
  spells: readonly WxSummonHunterLosVenomSpell[],
): boolean {
  if (wxSummonHunterLosVenomKitIsHealer(spells)) return false;
  if (spells.some((s) => isWxSummonHunterLosVenomBlockedFrostSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonHunterLosVenomBlockedPoisonSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonHunterLosVenomBlockedSlowSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonHunterLosVenomBlockedInfernoSpell(s))) {
    return false;
  }
  return spells.some((s) => isWxSummonHunterLosVenomSpell(s));
}

export function wxSummonHunterLosVenomRange(
  spell: WxSummonHunterLosVenomSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live picker / execute range half: Chebyshev vs `Number(spell.range)`. */
export function wxSummonHunterLosVenomInRange(
  origin: WxSummonHunterLosVenomTile,
  targetCell: WxSummonHunterLosVenomTile,
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Adjacent Chebyshev 1 always has clear Bresenham LoS, so live already
 * venom-strikes (`#856`). This leftover is the Chebyshev-2 stalk tile.
 */
export function wxSummonHunterLosVenomIsStalkDistance(
  origin: WxSummonHunterLosVenomTile,
  targetCell: WxSummonHunterLosVenomTile,
): boolean {
  return chebyshevOnBoard(origin, targetCell) > 1;
}

export function wxSummonHunterLosVenomSpellRequiresLos(
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  return enemySpellRequiresLos({
    lineOfSight: spell.lineOfSight === null ? undefined : spell.lineOfSight,
  });
}

/** Same debit `applyCast` uses after `#379` / `#762`. */
export function wxSummonHunterLosVenomApCost(
  spell: WxSummonHunterLosVenomSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordWxSummonHunterLosVenomCast(
  currentAp: number,
  spell: WxSummonHunterLosVenomSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Live `findKitSpell(kit[1])`: available first, then assigned. Catalog
 * wolf AP 2 cannot pay; callers that omit `currentAp` keep that miss.
 */
export function wxSummonHunterLosVenomLivePreferredSpell<
  T extends WxSummonHunterLosVenomSpell,
>(
  availableSpells: readonly T[],
  assignedSpells: readonly T[] = availableSpells,
): T | null {
  const fromAvailable = availableSpells.find((s) =>
    isWxSummonHunterLosVenomSpell(s),
  );
  if (fromAvailable) return fromAvailable;
  return assignedSpells.find((s) => isWxSummonHunterLosVenomSpell(s)) ?? null;
}

/**
 * Live `decideSummonHunter` LoS-blocked fallthrough: unit infers hunter,
 * kit carries Venom, Venom is in Chebyshev 2 (not adjacent), LoS is
 * required and blocked, AP can pay `applyCast`. Clear LoS already casts
 * (`#856`). Adjacent already casts (`#856`). Catalog 2 AP cannot pay.
 */
export function wxSummonHunterLiveWouldStalkLosBlockedVenom(args: {
  assignedSpells?: readonly WxSummonHunterLosVenomSpell[];
  availableSpells: readonly WxSummonHunterLosVenomSpell[];
  origin: WxSummonHunterLosVenomTile;
  targetCell: WxSummonHunterLosVenomTile;
  hunter: WxSummonHunterLosVenomOccupant;
  opponents: readonly WxSummonHunterLosVenomOccupant[];
  hasLoS: boolean;
  currentAp?: number;
}): boolean {
  if (!wxSummonHunterLosVenomIsHunterUnit(args.hunter)) return false;
  const kit = args.assignedSpells ?? args.availableSpells;
  if (!wxSummonHunterLosVenomKitIsHunter(kit)) return false;
  if (args.opponents.length === 0) return false;
  if (!isAliveCombatant({ hp: args.hunter.hp ?? 0 })) return false;
  if (args.hasLoS) return false;
  if (!wxSummonHunterLosVenomIsStalkDistance(args.origin, args.targetCell)) {
    return false;
  }
  const preferred = wxSummonHunterLosVenomLivePreferredSpell(
    args.availableSpells,
    kit,
  );
  if (!preferred || !isWxSummonHunterLosVenomSpell(preferred)) return false;
  if (!canAffordWxSummonHunterLosVenomCast(args.currentAp ?? 2, preferred)) {
    return false;
  }
  if (!wxSummonHunterLosVenomSpellRequiresLos(preferred)) return false;
  return wxSummonHunterLosVenomInRange(args.origin, args.targetCell, preferred);
}

/**
 * Unique leftover: when live would stalk because LoS is blocked and
 * Venom is the live preferred dest, pick that Venom. Returns null when
 * LoS is already clear (`#856`), when the tile is adjacent (`#856`),
 * when the wallet cannot pay `applyCast` (`#762`), when the kit is not
 * a hunter (archer Poison/Slow, pack Frost, healer, bomber), or when
 * preferred is Inferno / Strike / Poison / Slow.
 */
export function pickWxSummonHunterLosVenomSpell<
  T extends WxSummonHunterLosVenomSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxSummonHunterLosVenomTile;
  targetCell: WxSummonHunterLosVenomTile;
  opponents: readonly WxSummonHunterLosVenomOccupant[];
  hunter: WxSummonHunterLosVenomOccupant;
  hasLoS: boolean;
  currentAp?: number;
}): T | null {
  if (
    !wxSummonHunterLiveWouldStalkLosBlockedVenom({
      assignedSpells: args.assignedSpells,
      availableSpells: args.availableSpells,
      origin: args.origin,
      targetCell: args.targetCell,
      hunter: args.hunter,
      opponents: args.opponents,
      hasLoS: args.hasLoS,
      currentAp: args.currentAp,
    })
  ) {
    return null;
  }
  const live = wxSummonHunterLosVenomLivePreferredSpell(
    args.availableSpells,
    args.assignedSpells ?? args.availableSpells,
  );
  if (!live || !isWxSummonHunterLosVenomSpell(live)) return null;
  return live;
}

export function isWxSummonHunterLosVenomHostile(args: {
  occupant: WxSummonHunterLosVenomOccupant;
  hunterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.hunterSide;
}

export function canExecuteWxSummonHunterLosVenomCast(args: {
  spell: WxSummonHunterLosVenomSpell;
  assignedSpells?: readonly WxSummonHunterLosVenomSpell[];
  availableSpells?: readonly WxSummonHunterLosVenomSpell[];
  origin: WxSummonHunterLosVenomTile;
  targetCell: WxSummonHunterLosVenomTile;
  occupant: WxSummonHunterLosVenomOccupant | null;
  opponents: readonly WxSummonHunterLosVenomOccupant[];
  hunter: WxSummonHunterLosVenomOccupant;
  hunterSide: "player" | "enemy";
  hasLoS: boolean;
  currentAp?: number;
}): boolean {
  if (!isWxSummonHunterLosVenomSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxSummonHunterLosVenomSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      hunter: args.hunter,
      hasLoS: args.hasLoS,
      currentAp: args.currentAp,
    }) == null
  ) {
    return false;
  }
  if (
    !wxSummonHunterLosVenomInRange(args.origin, args.targetCell, args.spell)
  ) {
    return false;
  }
  if (!canAffordWxSummonHunterLosVenomCast(args.currentAp ?? 2, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxSummonHunterLosVenomHostile({
    occupant: args.occupant,
    hunterSide: args.hunterSide,
  });
}

/** Alias so decide and the summon execute branch cannot fork. */
export function shouldDecideWxSummonHunterLosVenomCast(
  args: Parameters<typeof canExecuteWxSummonHunterLosVenomCast>[0],
): boolean {
  return canExecuteWxSummonHunterLosVenomCast(args);
}

export function wxSummonHunterLosVenomHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
