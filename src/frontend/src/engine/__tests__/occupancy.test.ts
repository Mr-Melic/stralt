import { describe, expect, it } from "vitest";
import { WORLD_GRID_SIZE } from "../../data/gameConstants";
import {
  type OccupancyContext,
  applyAttract,
  applyPushback,
  findNearestFreeCell,
  isCellFree,
  isCellFreeDiagnostic,
  occKey,
} from "../occupancy";

function walkableGrid(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function occCtx(overrides: Partial<OccupancyContext> = {}): OccupancyContext {
  return {
    tiles: walkableGrid(),
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: () => false,
    ...overrides,
  };
}

describe("isCellFree", () => {
  it("accepts an in-bounds walkable empty tile", () => {
    expect(isCellFree({ x: 2, y: 3 }, occCtx())).toBe(true);
  });

  it("rejects out-of-bounds, walls, barriers, portals, voids, and occupants", () => {
    const tiles = walkableGrid();
    tiles[1][1] = false;
    const ctx = occCtx({
      tiles,
      barriers: new Set([occKey(2, 2)]),
      portals: new Set([occKey(3, 3)]),
      voidTiles: new Set([occKey(4, 4)]),
      isOccupied: (cell) => cell.x === 5 && cell.y === 5,
    });
    expect(isCellFree({ x: -1, y: 0 }, ctx)).toBe(false);
    expect(isCellFree({ x: WORLD_GRID_SIZE, y: 0 }, ctx)).toBe(false);
    expect(isCellFree({ x: 1, y: 1 }, ctx)).toBe(false);
    expect(isCellFree({ x: 2, y: 2 }, ctx)).toBe(false);
    expect(isCellFree({ x: 3, y: 3 }, ctx)).toBe(false);
    expect(isCellFree({ x: 4, y: 4 }, ctx)).toBe(false);
    expect(isCellFree({ x: 5, y: 5 }, ctx)).toBe(false);
  });
});

describe("isCellFreeDiagnostic", () => {
  it("reports the same rejection causes as isCellFree", () => {
    const tiles = walkableGrid();
    tiles[1][1] = false;
    const ctx = occCtx({
      tiles,
      barriers: new Set([occKey(2, 2)]),
      voidTiles: new Set([occKey(4, 4)]),
      isOccupied: (cell) => cell.x === 5 && cell.y === 5,
    });
    expect(isCellFreeDiagnostic({ x: -1, y: 0 }, ctx)).toEqual({
      ok: false,
      cause: "oob",
    });
    expect(isCellFreeDiagnostic({ x: 1, y: 1 }, ctx)).toEqual({
      ok: false,
      cause: "wall",
    });
    expect(isCellFreeDiagnostic({ x: 2, y: 2 }, ctx)).toEqual({
      ok: false,
      cause: "wall",
    });
    expect(isCellFreeDiagnostic({ x: 4, y: 4 }, ctx)).toEqual({
      ok: false,
      cause: "void",
    });
    expect(isCellFreeDiagnostic({ x: 5, y: 5 }, ctx)).toEqual({
      ok: false,
      cause: "occupied",
    });
    expect(isCellFreeDiagnostic({ x: 0, y: 0 }, ctx)).toEqual({ ok: true });
  });
});

describe("findNearestFreeCell", () => {
  it("returns the origin when it is already free", () => {
    expect(findNearestFreeCell({ x: 4, y: 4 }, occCtx(), 3)).toEqual({
      x: 4,
      y: 4,
    });
  });

  it("walks Manhattan rings until it finds a free neighbor", () => {
    const ctx = occCtx({
      isOccupied: (cell) => cell.x === 4 && cell.y === 4,
    });
    expect(findNearestFreeCell({ x: 4, y: 4 }, ctx, 2)).toEqual({
      x: 3,
      y: 4,
    });
  });

  it("returns null when no free cell exists in the radius", () => {
    const ctx = occCtx({ isOccupied: () => true });
    expect(findNearestFreeCell({ x: 4, y: 4 }, ctx, 1)).toBeNull();
  });
});

describe("applyPushback", () => {
  it("moves the target away from the source up to distance", () => {
    expect(applyPushback({ x: 5, y: 5 }, { x: 4, y: 5 }, 2, occCtx())).toEqual({
      x: 7,
      y: 5,
    });
  });

  it("stops before a blocked tile and stays put when direction is undefined", () => {
    const blocked = occCtx({
      isOccupied: (cell) => cell.x === 6 && cell.y === 5,
    });
    expect(applyPushback({ x: 5, y: 5 }, { x: 4, y: 5 }, 3, blocked)).toEqual({
      x: 5,
      y: 5,
    });
    expect(applyPushback({ x: 5, y: 5 }, { x: 5, y: 5 }, 3, occCtx())).toEqual({
      x: 5,
      y: 5,
    });
  });
});

describe("applyAttract", () => {
  it("moves toward the source but never stacks on it", () => {
    expect(applyAttract({ x: 6, y: 5 }, { x: 2, y: 5 }, 4, occCtx())).toEqual({
      x: 3,
      y: 5,
    });
  });

  it("does not move a target that is already adjacent", () => {
    expect(applyAttract({ x: 3, y: 5 }, { x: 2, y: 5 }, 3, occCtx())).toEqual({
      x: 3,
      y: 5,
    });
  });
});
