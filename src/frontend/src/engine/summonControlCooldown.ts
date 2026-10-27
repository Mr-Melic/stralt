/**
 * Player-controlled summon kit highlight vs execute CD.
 *
 * `planSummonControlCast` / `pickSummonControlClickTarget` gate AP,
 * Chebyshev range, and the live tile helper. They never read remaining
 * cooldown. `SummonControlPanel` kit buttons have no CD field.
 * `getSpellRangeTiles` still paints the leftover player bar (`#757`).
 * Catalog Inferno is the only summon-kit row with `cooldown: 3`. After
 * applyCast arm (`#1166`), available-list filter (`#1158`), and
 * assigned-fallback lookup (`#1150`), a controlled bomber Inferno click
 * still fires while remaining is 3 because this path never consults it.
 *
 * Distinct from auto-AI applyCast never writing CD (`#1166`), WX summon
 * availableSpells unfiltered (`#1158`), findKitSpell assigned fallback
 * (`#1150`), pack Inferno CD nested under `damage > 0` (`#972`), player
 * bar AP/CD highlight (`#708`), and summon-control LoS/AP highlight
 * (`#757`). Cluster radius / self-detonate stay `#799`. Inferno ticks
 * stay `#856` / `#947`. Do not write `areaRadius: 2` onto Inferno
 * (would rebalance). Catalog bomber `summonUnitDef.ap` is 1, which
 * cannot pay Inferno 5 — unique fire needs `currentAp >= 5`; do not
 * rebalance bomber AP or Inferno cost. Do not drop Rallying Cry via
 * `usableByEnemy` (player-side wisp kit; pack-only). A lone living
 * hostile at Chebyshev 3 is legal here (click dest); auto-AI cluster-of-2
 * stays `#799` / `#1166`.
 *
 * Unique vs `#708` / `#757` / `#762` / `#799` / `#856` / `#878` /
 * `#947` / `#967` / `#972` / `#978` / `#1054` / `#1081` / `#1087` /
 * `#1090` / `#1091` / `#1095` / `#1096` / `#1098` / `#1123` / `#1150` /
 * `#1158` / `#1166`. WorldExploration / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / enemyAI /
 * summonExecutor / statusEffects left untouched so older open PRs stay
 * merge-clean. Restack `planSummonControlCast` + kit highlight onto
 * `canExecuteSummonControlCooldownCast` after those PRs land.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  isSpellOnCooldown,
  nextSpellCooldownTurns,
} from "../utils/challengeCompletion.ts";
import {
  type SummonKitCatalogSpell,
  pickSummonControlClickTarget,
  planSummonControlCast,
  resolveSummonControlSpell,
} from "../utils/summonControlCast.ts";
import {
  type BarrierTiles,
  type CasterPosition,
  type TileType,
  canAffordCastAp,
  chebyshevOnBoard,
  computeTargetableTiles,
  resolveCastApCost,
} from "./targeting.ts";

export type SummonControlCooldownSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "maxRange"
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
      | "cooldown"
      | "usableByEnemy"
      | "summonUnitDef"
    >
  | {
      id?: string;
      range?: unknown;
      maxRange?: number;
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
      cooldown?: unknown;
      usableByEnemy?: boolean | null;
      summonUnitDef?: {
        pieceType?: string;
        summonKit?: string[];
      };
    };

export type SummonControlCooldownTile = CasterPosition;

export type SummonControlCooldownOccupant = SummonControlCooldownTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
  summonAI?: string;
  pieceType?: string;
  name?: string;
};

export type SummonControlCooldownRemaining = unknown;

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isSummonControlCooldownHealKitSpell(
  spell: SummonControlCooldownSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function summonControlCooldownKitIsHealer(
  spells: readonly SummonControlCooldownSpell[],
): boolean {
  return spells.some((s) => isSummonControlCooldownHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isSummonControlCooldownBlockedFrostSpell(
  spell: SummonControlCooldownSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

function isZeroDamageDot(spell: SummonControlCooldownSpell): boolean {
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
export function isSummonControlCooldownBlockedPoisonSpell(
  spell: SummonControlCooldownSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return Number(spell.range) > 3;
}

/**
 * Venom leftover identity (`#856` / `#1123`): 0-damage DoT at Chebyshev 2.
 */
export function isSummonControlCooldownBlockedVenomSpell(
  spell: SummonControlCooldownSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return Number(spell.range) === 2;
}

/**
 * Slow leftover identity (`#1098`): 0-upfront-damage MP debuff, no DoT.
 */
export function isSummonControlCooldownBlockedSlowSpell(
  spell: SummonControlCooldownSpell,
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

/** 0-damage buff leftover identity (`#978`). */
export function isSummonControlCooldownBlockedBuffSpell(
  spell: SummonControlCooldownSpell,
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

/** 0-damage DoT leftover identity (Poison `#1095`/`#1096`, Venom `#856`). */
export function isSummonControlCooldownBlockedDotSpell(
  spell: SummonControlCooldownSpell,
): boolean {
  return isZeroDamageDot(spell);
}

/**
 * Live `inferSummonArchetype` bomber arm: `summonAI === "bomber"` or
 * legacy `kamikaze`, then name/pieceType containing "bomber". Hunter /
 * archer / guardian / healer never reach the Inferno kit. Do not use
 * live's unknown-default hunter.
 */
export function summonControlCooldownIsBomberUnit(unit: {
  summonAI?: string;
  pieceType?: string;
  name?: string;
}): boolean {
  const raw = (unit.summonAI ?? "").toLowerCase();
  if (raw === "bomber" || raw === "kamikaze") return true;
  if (
    raw === "hunter" ||
    raw === "kiter" ||
    raw === "archer" ||
    raw === "healer" ||
    raw === "guardian"
  ) {
    return false;
  }
  const pt = (unit.pieceType ?? unit.name ?? "").toLowerCase();
  return pt.includes("bomber");
}

/**
 * Inferno leftover identity: 0-upfront-damage DoT at Chebyshev 3 with
 * advertised cooldown > 0. Poison is range 4. Venom is range 2. Strike
 * has damage 10. Slow is MP debuff with no ticks. Pack Inferno is the
 * same catalog row — kitIsBomber rejects heal kits (`#967` / `#972`).
 */
export function isSummonControlCooldownSpell(
  spell: SummonControlCooldownSpell,
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
  if (summonControlCooldownAdvertisedTurns(spell) <= 0) {
    return false;
  }
  return Number(spell.range) === 3;
}

/**
 * Live bomber kit for this leftover: assigned Inferno-only (catalog).
 * Queen/king Inferno+heal is `#967` / `#972`. Archer is Poison+Slow.
 * Hunter is Strike+Venom.
 */
export function summonControlCooldownKitIsBomber(
  spells: readonly SummonControlCooldownSpell[],
): boolean {
  if (summonControlCooldownKitIsHealer(spells)) return false;
  if (spells.some((s) => isSummonControlCooldownBlockedFrostSpell(s))) {
    return false;
  }
  if (spells.some((s) => isSummonControlCooldownBlockedPoisonSpell(s))) {
    return false;
  }
  if (spells.some((s) => isSummonControlCooldownBlockedVenomSpell(s))) {
    return false;
  }
  if (spells.some((s) => isSummonControlCooldownBlockedSlowSpell(s))) {
    return false;
  }
  return spells.some((s) => isSummonControlCooldownSpell(s));
}

/**
 * Same range `planSummonControlCast` / `#757` highlight use: floor of
 * `effectiveRange ?? maxRange ?? range`, at least 1. Not AI
 * `Number(spell.range)` (`enemySpellRange`).
 */
export function summonControlCooldownRange(
  spell: Pick<SummonControlCooldownSpell, "range" | "maxRange">,
  effectiveRange?: number,
): number {
  return Math.max(
    1,
    Math.floor(Number(effectiveRange ?? spell.maxRange ?? spell.range) || 0),
  );
}

/** Click-path range half: Chebyshev vs {@link summonControlCooldownRange}. */
export function summonControlCooldownInRange(
  origin: SummonControlCooldownTile,
  targetCell: SummonControlCooldownTile,
  spell: SummonControlCooldownSpell,
  effectiveRange?: number,
): boolean {
  return (
    chebyshevOnBoard(origin, targetCell) <=
    summonControlCooldownRange(spell, effectiveRange)
  );
}

/**
 * Advertised cooldown turns. Same floor as player
 * {@link nextSpellCooldownTurns}. Catalog Inferno is 3.
 */
export function summonControlCooldownAdvertisedTurns(
  spell: SummonControlCooldownSpell,
): number {
  return nextSpellCooldownTurns(spell.cooldown);
}

/**
 * Remaining after a prior arm. Missing / non-positive is ready. Same
 * predicate player tile/sprite/Attack Nearest use (`isSpellOnCooldown`).
 */
export function summonControlCooldownRemaining(
  remainingTurns?: SummonControlCooldownRemaining,
): number {
  const turns = Math.max(0, Math.floor(Number(remainingTurns) || 0));
  return turns > 0 ? turns : 0;
}

export function summonControlCooldownIsReady(
  remainingTurns?: SummonControlCooldownRemaining,
): boolean {
  return !isSpellOnCooldown(remainingTurns);
}

/** Same debit `planSummonControlCast` uses (no Arcane Surge). */
export function summonControlCooldownApCost(
  spell: SummonControlCooldownSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordSummonControlCooldownCast(
  currentAp: number,
  spell: SummonControlCooldownSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/**
 * Live `planSummonControlCast` has no remaining argument. Always true:
 * a spent Inferno still plans when AP + range + live geometry agree.
 */
export function summonControlLivePlanIgnoresCooldown(): boolean {
  return true;
}

export type SummonControlCooldownCastArgs<
  T extends SummonControlCooldownSpell &
    Partial<SpellConfig> = SummonControlCooldownSpell & Partial<SpellConfig>,
> = {
  spell: T;
  pieceType: string;
  selectedSummonSpellId?: string | null;
  catalog?: readonly T[];
  fallbackSpells?: readonly T[];
  remainingTurns?: SummonControlCooldownRemaining;
  currentAp?: number;
  caster: SummonControlCooldownOccupant;
  tile: SummonControlCooldownTile;
  combatants: readonly SummonControlCooldownOccupant[];
  tiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
  controllingSummon: boolean;
};

function asKitCatalog<T extends SummonControlCooldownSpell>(
  rows: readonly T[],
): SummonKitCatalogSpell[] {
  return rows as unknown as SummonKitCatalogSpell[];
}

function kitFromArgs<T extends SummonControlCooldownSpell>(args: {
  spell: T;
  catalog?: readonly T[];
  fallbackSpells?: readonly T[];
  pieceType: string;
}): readonly T[] {
  const catalog = args.catalog ?? [args.spell];
  const unitDef = catalog.find(
    (sp) => sp.summonUnitDef?.pieceType === args.pieceType,
  )?.summonUnitDef;
  const kitIds = Array.isArray(unitDef?.summonKit) ? unitDef.summonKit : [];
  if (kitIds.length > 0) {
    const resolved: T[] = [];
    for (const id of kitIds) {
      const found =
        catalog.find((s) => s.id === id) ??
        args.fallbackSpells?.find((s) => s.id === id);
      if (found) resolved.push(found);
    }
    if (resolved.length > 0) return resolved;
  }
  return catalog;
}

function resolveKitSpell<T extends SummonControlCooldownSpell>(args: {
  pieceType: string;
  spellId: string;
  catalog: readonly T[];
  fallbackSpells?: readonly T[];
}): T | undefined {
  return resolveSummonControlSpell(
    args.pieceType,
    args.spellId,
    asKitCatalog(args.catalog),
    asKitCatalog(args.fallbackSpells ?? args.catalog),
  ) as T | undefined;
}

/**
 * Ready Inferno on the selected kit. Remaining 3 returns null so
 * highlight (empty ring) matches execute. Do not fall back to assigned
 * (`#1150`) and do not rebuild available (`#1158`). Do not arm (`#1166`).
 */
export function pickSummonControlCooldownSpell<
  T extends SummonControlCooldownSpell,
>(args: {
  assignedSpells?: readonly T[];
  remainingTurns?: SummonControlCooldownRemaining;
  pieceType?: string;
  selectedSummonSpellId?: string | null;
  catalog?: readonly T[];
  fallbackSpells?: readonly T[];
}): T | null {
  if (!summonControlCooldownIsReady(args.remainingTurns)) return null;
  const kit = args.assignedSpells ?? args.catalog ?? [];
  if (!summonControlCooldownKitIsBomber(kit)) return null;
  if (args.pieceType && args.selectedSummonSpellId && args.catalog) {
    const resolved = resolveKitSpell({
      pieceType: args.pieceType,
      spellId: args.selectedSummonSpellId,
      catalog: args.catalog,
      fallbackSpells: args.fallbackSpells ?? kit,
    });
    if (resolved && !isSummonControlCooldownSpell(resolved)) return null;
    if (resolved) return resolved;
  }
  return kit.find((s) => isSummonControlCooldownSpell(s)) ?? null;
}

function livePlanAndTarget<
  T extends SummonControlCooldownSpell & Partial<SpellConfig>,
>(args: SummonControlCooldownCastArgs<T>): boolean {
  const spellId =
    args.selectedSummonSpellId ??
    (typeof args.spell.id === "string" ? args.spell.id : "");
  const catalog = (args.catalog ?? [args.spell]) as T[];
  const range = summonControlCooldownRange(args.spell, args.effectiveRange);
  const barriers = args.barrierTiles ?? new Map<string, number>();
  const barrierMap =
    barriers instanceof Map
      ? (barriers as Map<string, number>)
      : new Map<string, number>();
  const occupant = pickSummonControlClickTarget({
    spell: args.spell,
    caster: args.caster,
    tile: args.tile,
    combatants: args.combatants as SummonControlCooldownOccupant[],
    tiles: args.tiles,
    effectiveRange: range,
    barrierTiles: barrierMap,
  });
  if (!occupant) return false;
  const plan = planSummonControlCast({
    pieceType: args.pieceType,
    spellId,
    catalog: asKitCatalog(catalog),
    fallbackSpells: asKitCatalog(args.fallbackSpells ?? catalog),
    currentAp: args.currentAp ?? 0,
    caster: args.caster,
    target: args.tile,
    liveGate: {
      tiles: args.tiles,
      combatants: args.combatants as Enemy[],
      effectiveRange: range,
      barrierTiles: barrierMap,
    },
  });
  return plan.ok;
}

/**
 * Live hole: remaining is already 3 and the click dest is otherwise
 * legal, so `planSummonControlCast` still returns ok. Distinct from
 * `#1166` (remaining never written) and `#1158` (still listed in
 * unfiltered available).
 */
export function summonControlLiveWouldCastThroughCooldown<
  T extends SummonControlCooldownSpell & Partial<SpellConfig>,
>(args: SummonControlCooldownCastArgs<T>): boolean {
  if (summonControlCooldownIsReady(args.remainingTurns)) return false;
  if (!isSummonControlCooldownSpell(args.spell)) return false;
  if (!summonControlLivePlanIgnoresCooldown()) return false;
  return livePlanAndTarget(args);
}

/**
 * Shared highlight + execute gate. Remaining uses
 * {@link isSpellOnCooldown} so a painted kit tile cannot recast while
 * Inferno CD 3 is ticking. Auto-AI / player-bar callers
 * (`controllingSummon !== true`) cannot steal `#1166` / `#708`.
 */
export function canExecuteSummonControlCooldownCast<
  T extends SummonControlCooldownSpell & Partial<SpellConfig>,
>(args: SummonControlCooldownCastArgs<T>): boolean {
  if (args.controllingSummon !== true) return false;
  if (args.caster.isSummon !== true) return false;
  if (args.caster.side !== "player") return false;
  if (!isSummonControlCooldownSpell(args.spell)) return false;
  if (!summonControlCooldownIsBomberUnit(args.caster)) return false;
  const kit = kitFromArgs(args);
  if (!summonControlCooldownKitIsBomber(kit)) return false;
  if (!summonControlCooldownIsReady(args.remainingTurns)) return false;
  if (
    pickSummonControlCooldownSpell({
      assignedSpells: kit,
      remainingTurns: args.remainingTurns,
      pieceType: args.pieceType,
      selectedSummonSpellId:
        args.selectedSummonSpellId ??
        (typeof args.spell.id === "string" ? args.spell.id : null),
      catalog: args.catalog,
      fallbackSpells: args.fallbackSpells,
    }) == null
  ) {
    return false;
  }
  if (!canAffordSummonControlCooldownCast(args.currentAp ?? 0, args.spell)) {
    return false;
  }
  if (
    !summonControlCooldownInRange(
      args.caster,
      args.tile,
      args.spell,
      args.effectiveRange,
    )
  ) {
    return false;
  }
  return livePlanAndTarget(args);
}

/** Alias so kit highlight and the click execute branch cannot fork. */
export function shouldHighlightSummonControlCooldownCast<
  T extends SummonControlCooldownSpell & Partial<SpellConfig>,
>(args: SummonControlCooldownCastArgs<T>): boolean {
  return canExecuteSummonControlCooldownCast(args);
}

/**
 * Painted kit set for a selected Inferno. Remaining 3 empties the ring
 * (same CD-before-geometry order as player {@link isSpellOnCooldown}).
 * Empty / corpse / ally cells that the click router cannot resolve are
 * omitted so a painted cell is executable.
 */
export function computeSummonControlCooldownTargetableTiles<
  T extends SummonControlCooldownSpell & Partial<SpellConfig>,
>(args: {
  pieceType: string;
  selectedSummonSpellId: string | null | undefined;
  catalog: readonly T[];
  fallbackSpells?: readonly T[];
  remainingTurns?: SummonControlCooldownRemaining;
  currentAp: number;
  caster: SummonControlCooldownOccupant;
  combatants: readonly SummonControlCooldownOccupant[];
  tiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
  controllingSummon: boolean;
}): Set<string> {
  if (args.controllingSummon !== true) return new Set();
  if (!summonControlCooldownIsReady(args.remainingTurns)) return new Set();
  const spell = resolveKitSpell({
    pieceType: args.pieceType,
    spellId: args.selectedSummonSpellId ?? "",
    catalog: args.catalog,
    fallbackSpells: args.fallbackSpells,
  });
  if (!spell || !isSummonControlCooldownSpell(spell)) return new Set();
  if (!canAffordSummonControlCooldownCast(args.currentAp, spell)) {
    return new Set();
  }
  const range = summonControlCooldownRange(spell, args.effectiveRange);
  const barriers = args.barrierTiles ?? new Map<string, number>();
  const painted = computeTargetableTiles(spell as SpellConfig, args.caster, {
    tiles: args.tiles,
    enemies: args.combatants as Enemy[],
    worldGridSize: args.tiles.length,
    effectiveRange: range,
    barrierTiles: barriers,
  });
  const executable = new Set<string>();
  for (const key of painted) {
    const comma = key.indexOf(",");
    const tile = {
      x: Number(key.slice(0, comma)),
      y: Number(key.slice(comma + 1)),
    };
    if (
      !canExecuteSummonControlCooldownCast({
        spell,
        pieceType: args.pieceType,
        selectedSummonSpellId: args.selectedSummonSpellId,
        catalog: args.catalog,
        fallbackSpells: args.fallbackSpells,
        remainingTurns: args.remainingTurns,
        currentAp: args.currentAp,
        caster: args.caster,
        tile,
        combatants: args.combatants,
        tiles: args.tiles,
        effectiveRange: range,
        barrierTiles: barriers,
        controllingSummon: true,
      })
    ) {
      continue;
    }
    executable.add(key);
  }
  return executable;
}

export function summonControlCooldownHighlightedTargetIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}
