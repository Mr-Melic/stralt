import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  type OccupancyContext,
  applyAttract,
  findNearestFreeCell,
  isCellFree,
  occKey,
} from "./occupancy.ts";

function openGrid(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function ctx(overrides: Partial<OccupancyContext> = {}): OccupancyContext {
  return {
    tiles: openGrid(),
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: () => false,
    ...overrides,
  };
}

describe("isCellFree", () => {
  it("rejects out-of-bounds, walls, barriers, portals, void, and occupants", () => {
    const occupied = new Set(["5,5"]);
    const blocked = ctx({
      barriers: new Set([occKey(2, 2)]),
      portals: new Set([occKey(3, 3)]),
      voidTiles: new Set([occKey(4, 4)]),
      isOccupied: (cell) => occupied.has(occKey(cell.x, cell.y)),
    });
    blocked.tiles[1][1] = false;

    assert.equal(isCellFree({ x: 6, y: 6 }, blocked), true);
    assert.equal(isCellFree({ x: -1, y: 0 }, blocked), false);
    assert.equal(isCellFree({ x: WORLD_GRID_SIZE, y: 0 }, blocked), false);
    assert.equal(isCellFree({ x: 1, y: 1 }, blocked), false);
    assert.equal(isCellFree({ x: 2, y: 2 }, blocked), false);
    assert.equal(isCellFree({ x: 3, y: 3 }, blocked), false);
    assert.equal(isCellFree({ x: 4, y: 4 }, blocked), false);
    assert.equal(isCellFree({ x: 5, y: 5 }, blocked), false);
  });
});

describe("findNearestFreeCell", () => {
  it("starts the first ring at dx = -r (left of origin), not the +y neighbor", () => {
    const occupied = new Set(["5,5"]);
    const board = ctx({
      isOccupied: (cell) => occupied.has(occKey(cell.x, cell.y)),
    });
    assert.deepEqual(findNearestFreeCell({ x: 5, y: 5 }, board, 2), {
      x: 4,
      y: 5,
    });

    occupied.add("4,5");
    assert.deepEqual(findNearestFreeCell({ x: 5, y: 5 }, board, 2), {
      x: 5,
      y: 6,
    });
  });

  it("returns null when every cell in the radius is blocked", () => {
    const wall = ctx({
      isOccupied: () => true,
    });
    assert.equal(findNearestFreeCell({ x: 5, y: 5 }, wall, 1), null);
  });
});

describe("applyAttract", () => {
  it("stops one tile short so two combatants never stack", () => {
    const board = ctx();
    const end = applyAttract({ x: 8, y: 5 }, { x: 5, y: 5 }, 6, board);
    assert.deepEqual(end, { x: 6, y: 5 });
    assert.equal(isCellFree(end, board), true);
  });
});
