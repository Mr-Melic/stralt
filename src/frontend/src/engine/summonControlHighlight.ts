/**
 * Summon-control kit highlight vs execute.
 *
 * `getSpellRangeTiles` only reads `selectedSpellIdRef` (player bar) from
 * `getActiveCasterPos()` (summon tile while controlling). Kit select lives
 * on `selectedSummonSpellId`. A leftover Strike ring can therefore paint
 * from the summon while mouse / touch / kit execute use
 * `planSummonControlCast` + `pickSummonControlClickTarget`.
 *
 * This module is the shared painted set for a selected kit spell:
 *   - leftover player ids never paint while a summon is controlled
 *   - AP uses the same raw `Number(apCost)` debit as execute (no Arcane
 *     Surge — summon-control has no `applyApCost`)
 *   - geometry is `computeTargetableTiles` / `isTileCastableLive`
 *   - empty / corpse / ally tiles that the click router cannot resolve
 *     are omitted so a painted cell is executable
 *
 * Do not change kit AP, range, or damage. WorldExploration /
 * SummonControlPanel / targeting / summonControlCast are left untouched
 * so older open PRs stay merge-clean (#340 picker, #379 summon AP,
 * #432 execute range, #467 walk occupancy, #714 Pacifist).
 */

import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
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
  computeTargetableTiles,
} from "./targeting.ts";

export function summonControlHighlightRange(
  spell: Pick<SummonKitCatalogSpell, "range" | "maxRange">,
  effectiveRange?: number,
): number {
  return Math.max(
    1,
    Math.floor(Number(effectiveRange ?? spell.maxRange ?? spell.range) || 0),
  );
}

/**
 * Same wallet check as `planSummonControlCast` / the kit slot
 * `currentAp < apCost` disable. 0-AP kits still paint.
 */
export function canAffordSummonControlHighlight(
  currentAp: number,
  spell: Pick<SummonKitCatalogSpell, "apCost">,
): boolean {
  const cost = Math.max(0, Math.floor(Number(spell.apCost) || 0));
  const have = Math.max(0, Math.floor(Number(currentAp) || 0));
  return have >= cost;
}

/**
 * While a summon is controlled, only the selected kit id paints.
 * A leftover player slot must not leak onto the blue ring.
 */
export function summonControlPaintedSpellId(args: {
  controllingSummon: boolean;
  selectedSummonSpellId: string | null | undefined;
  selectedPlayerSpellId: string | null | undefined;
}): string | null {
  if (args.controllingSummon) {
    return args.selectedSummonSpellId ?? null;
  }
  return args.selectedPlayerSpellId ?? null;
}

export function resolveSummonControlHighlightSpell<
  T extends SummonKitCatalogSpell,
>(args: {
  controllingSummon: boolean;
  selectedSummonSpellId: string | null | undefined;
  selectedPlayerSpellId?: string | null;
  pieceType: string;
  catalog: T[];
  fallbackSpells?: T[];
}): T | undefined {
  const id = summonControlPaintedSpellId({
    controllingSummon: args.controllingSummon,
    selectedSummonSpellId: args.selectedSummonSpellId,
    selectedPlayerSpellId: args.selectedPlayerSpellId,
  });
  if (!id || !args.controllingSummon) return undefined;
  return resolveSummonControlSpell(
    args.pieceType,
    id,
    args.catalog,
    args.fallbackSpells,
  );
}

type SummonClickUnit = {
  id: string;
  x: number;
  y: number;
  hp?: number;
  side?: string;
  isSummon?: boolean;
};

export function computeSummonControlTargetableTiles<
  T extends SummonKitCatalogSpell & Partial<SpellConfig>,
>(args: {
  pieceType: string;
  selectedSummonSpellId: string | null | undefined;
  catalog: T[];
  fallbackSpells?: T[];
  currentAp: number;
  caster: SummonClickUnit & CasterPosition;
  combatants: SummonClickUnit[];
  tiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
}): Set<string> {
  const spell = resolveSummonControlSpell(
    args.pieceType,
    args.selectedSummonSpellId ?? "",
    args.catalog,
    args.fallbackSpells,
  );
  if (!spell) return new Set();
  if (!canAffordSummonControlHighlight(args.currentAp, spell)) {
    return new Set();
  }
  const range = summonControlHighlightRange(spell, args.effectiveRange);
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
      !summonControlHighlightedTileIsExecutable({
        pieceType: args.pieceType,
        selectedSummonSpellId: args.selectedSummonSpellId,
        catalog: args.catalog,
        fallbackSpells: args.fallbackSpells,
        currentAp: args.currentAp,
        caster: args.caster,
        tile,
        combatants: args.combatants,
        tiles: args.tiles,
        effectiveRange: range,
        barrierTiles: barriers,
        highlighted: true,
      })
    ) {
      continue;
    }
    executable.add(key);
  }
  return executable;
}

/**
 * A painted kit tile must resolve a click target and pass
 * `planSummonControlCast`. Unpainted / empty / LoS-blocked / missing-AP
 * tiles cannot execute.
 */
export function summonControlHighlightedTileIsExecutable<
  T extends SummonKitCatalogSpell & Partial<SpellConfig>,
>(args: {
  pieceType: string;
  selectedSummonSpellId: string | null | undefined;
  catalog: T[];
  fallbackSpells?: T[];
  currentAp: number;
  caster: SummonClickUnit & CasterPosition;
  tile: { x: number; y: number };
  combatants: SummonClickUnit[];
  tiles: TileType[][];
  effectiveRange?: number;
  barrierTiles?: BarrierTiles;
  highlighted: boolean;
}): boolean {
  if (args.highlighted !== true) return false;
  const spell = resolveSummonControlSpell(
    args.pieceType,
    args.selectedSummonSpellId ?? "",
    args.catalog,
    args.fallbackSpells,
  );
  if (!spell) return false;
  const range = summonControlHighlightRange(spell, args.effectiveRange);
  const barriers = args.barrierTiles ?? new Map<string, number>();
  const occupant = pickSummonControlClickTarget({
    spell: spell as T & Partial<SpellConfig>,
    caster: args.caster,
    tile: args.tile,
    combatants: args.combatants,
    tiles: args.tiles,
    effectiveRange: range,
    barrierTiles:
      barriers instanceof Map
        ? (barriers as Map<string, number>)
        : new Map<string, number>(),
  });
  if (!occupant) return false;
  const plan = planSummonControlCast({
    pieceType: args.pieceType,
    spellId: args.selectedSummonSpellId ?? "",
    catalog: args.catalog,
    fallbackSpells: args.fallbackSpells,
    currentAp: args.currentAp,
    caster: args.caster,
    target: args.tile,
    liveGate: {
      tiles: args.tiles,
      combatants: args.combatants as Enemy[],
      effectiveRange: range,
      barrierTiles:
        barriers instanceof Map
          ? (barriers as Map<string, number>)
          : new Map<string, number>(),
    },
  });
  return plan.ok;
}
