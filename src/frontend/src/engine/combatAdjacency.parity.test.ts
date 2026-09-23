import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { physicalAttackSpell } from "../data/spellData.ts";
import type { Enemy } from "../types/gameTypes.ts";
import {
  attractStopsBeforeStacking,
  canExecuteEnemyMelee,
  isChebyshevMeleeAdjacent,
  isManhattanAdjacent,
  manhattanOnBoard,
} from "./combatAdjacency.ts";
import { type OccupancyContext, applyAttract, occKey } from "./occupancy.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  isTileCastableLive,
  pickNearestLiveHostileTile,
  shouldExecuteLiveCast,
  spellHighlightRangeBase,
} from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    side: "enemy",
    ...extras,
  } as Enemy;
}

function walkableTiles(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function occupancy(occupied: Set<string> = new Set()): OccupancyContext {
  return {
    tiles: walkableTiles(),
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: (cell) => occupied.has(occKey(cell.x, cell.y)),
  };
}

describe("combat adjacency metrics stay split", () => {
  const origin = { x: 5, y: 5 };
  const cardinal = { x: 6, y: 5 };
  const diagonal = { x: 6, y: 6 };
  const twoAway = { x: 7, y: 5 };

  it("Strike Chebyshev melee is diagonal-legal; Manhattan boss melee is not", () => {
    assert.equal(isChebyshevMeleeAdjacent(origin, cardinal), true);
    assert.equal(isChebyshevMeleeAdjacent(origin, diagonal), true);
    assert.equal(isChebyshevMeleeAdjacent(origin, twoAway), false);
    assert.equal(isChebyshevMeleeAdjacent(origin, origin), false);

    assert.equal(isManhattanAdjacent(origin, cardinal), true);
    assert.equal(isManhattanAdjacent(origin, diagonal), false);
    assert.equal(isManhattanAdjacent(origin, twoAway), false);
    assert.equal(manhattanOnBoard(origin, diagonal), 2);
  });

  it("enemy melee execute matches Strike Chebyshev, not boss Manhattan", () => {
    assert.equal(canExecuteEnemyMelee(origin, diagonal), true);
    assert.equal(canExecuteEnemyMelee(origin, cardinal), true);
    assert.equal(canExecuteEnemyMelee(origin, twoAway), false);
    assert.equal(canExecuteEnemyMelee(origin, origin), false);
  });
});

describe("Strike highlight vs live execute", () => {
  const caster = { x: 5, y: 5 };
  const tiles = floorGrid(12);
  const range = spellHighlightRangeBase(physicalAttackSpell);

  it("a highlighted Chebyshev-diagonal hostile is executable", () => {
    const hostile = unit("rat", 6, 6);
    const enemies = [hostile];
    const highlighted = computeTargetableTiles(physicalAttackSpell, caster, {
      tiles,
      enemies,
      worldGridSize: tiles.length,
      effectiveRange: range,
    });
    assert.equal(highlighted.has("6,6"), true);
    const live = isTileCastableLive(
      physicalAttackSpell,
      caster,
      { x: 6, y: 6 },
      enemies,
      tiles,
      range,
    );
    assert.equal(shouldExecuteLiveCast(live), true);
    assert.equal(live.ok, true);
  });

  it("a Chebyshev-2 hostile is not highlighted and cannot execute", () => {
    const hostile = unit("rat", 7, 5);
    const enemies = [hostile];
    const highlighted = computeTargetableTiles(physicalAttackSpell, caster, {
      tiles,
      enemies,
      worldGridSize: tiles.length,
      effectiveRange: range,
    });
    assert.equal(highlighted.has("7,5"), false);
    const live = isTileCastableLive(
      physicalAttackSpell,
      caster,
      { x: 7, y: 5 },
      enemies,
      tiles,
      range,
    );
    assert.equal(shouldExecuteLiveCast(live), false);
    assert.equal(
      pickNearestLiveHostileTile(
        physicalAttackSpell,
        caster,
        [{ x: 7, y: 5 }],
        enemies,
        tiles,
        range,
      ),
      null,
    );
  });

  it("every highlighted Strike tile is executable and illegal tiles cannot", () => {
    const enemies = [unit("diag", 6, 6), unit("card", 5, 6), unit("far", 8, 5)];
    const { highlightOnly, liveOnly } = collectHighlightLiveMismatches(
      physicalAttackSpell,
      caster,
      enemies,
      tiles,
      range,
    );
    assert.deepEqual(highlightOnly, []);
    assert.deepEqual(liveOnly, []);
  });
});

describe("attract stop-before-stack stays Manhattan", () => {
  const toward = { x: 5, y: 5 };

  it("halts on self or a cardinal neighbor; a diagonal still pulls", () => {
    assert.equal(attractStopsBeforeStacking(toward, toward), true);
    assert.equal(attractStopsBeforeStacking({ x: 6, y: 5 }, toward), true);
    assert.equal(attractStopsBeforeStacking({ x: 6, y: 6 }, toward), false);
  });

  it("applyAttract leaves a cardinal neighbor put and pulls a diagonal one step", () => {
    const ctx = occupancy();
    assert.deepEqual(applyAttract({ x: 6, y: 5 }, toward, 3, ctx), {
      x: 6,
      y: 5,
    });
    const pulled = applyAttract({ x: 6, y: 6 }, toward, 3, ctx);
    assert.equal(attractStopsBeforeStacking(pulled, toward), true);
    assert.equal(isManhattanAdjacent(pulled, toward), true);
    assert.notDeepEqual(pulled, { x: 6, y: 6 });
  });
});
