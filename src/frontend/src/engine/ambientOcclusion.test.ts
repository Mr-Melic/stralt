import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  AO_BIT_LEFT,
  AO_BIT_RIGHT,
  AO_BIT_TOP_LEFT,
  AO_BIT_TOP_RIGHT,
  aoMaskIndex,
  buildAmbientOcclusionMask,
} from "./ambientOcclusion.ts";

/**
 * Legacy WorldExploration loop copied here so the extraction cannot
 * silently add north/south occlusion, skip portals, or drop unused bits.
 * Do not "improve" these.
 */
function legacyBuild(
  tiles: readonly (readonly string[])[],
  gridSize: number,
): Uint8Array {
  const mask = new Uint8Array(gridSize * gridSize);
  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      if (tiles[gy][gx] === "wall") continue;
      let bits = 0;
      if (gx + 1 < gridSize && gy > 0 && tiles[gy - 1][gx + 1] === "wall")
        bits |= 1;
      if (gx > 0 && gy > 0 && tiles[gy - 1][gx - 1] === "wall") bits |= 2;
      if (gx + 1 < gridSize && tiles[gy][gx + 1] === "wall") bits |= 4;
      if (gx > 0 && tiles[gy][gx - 1] === "wall") bits |= 8;
      mask[gy * gridSize + gx] = bits;
    }
  }
  return mask;
}

function grid(
  size: number,
  walls: ReadonlySet<string> = new Set(),
  portals: ReadonlySet<string> = new Set(),
): string[][] {
  const tiles: string[][] = [];
  for (let y = 0; y < size; y++) {
    const row: string[] = [];
    for (let x = 0; x < size; x++) {
      const key = `${x},${y}`;
      if (walls.has(key)) row.push("wall");
      else if (portals.has(key)) row.push("portal");
      else row.push("floor");
    }
    tiles.push(row);
  }
  return tiles;
}

function bitsAt(
  mask: Uint8Array,
  x: number,
  y: number,
  gridSize: number,
): number {
  return mask[aoMaskIndex(x, y, gridSize)];
}

describe("AO bit flags", () => {
  it("matches the live 1/2/4/8 neighbor layout", () => {
    assert.equal(AO_BIT_TOP_RIGHT, 1);
    assert.equal(AO_BIT_TOP_LEFT, 2);
    assert.equal(AO_BIT_RIGHT, 4);
    assert.equal(AO_BIT_LEFT, 8);
  });
});

describe("buildAmbientOcclusionMask", () => {
  it("is all zeros on an open floor and on a solid wall grid", () => {
    const open = buildAmbientOcclusionMask(grid(4), 4);
    assert.equal(open.length, 16);
    assert.ok(open.every((b) => b === 0));
    const allWalls = new Set<string>();
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) allWalls.add(`${x},${y}`);
    }
    const solid = buildAmbientOcclusionMask(grid(4, allWalls), 4);
    assert.ok(solid.every((b) => b === 0));
  });

  it("sets only the four live neighbor directions around a single wall", () => {
    const tiles = grid(5, new Set(["2,2"]));
    const mask = buildAmbientOcclusionMask(tiles, 5);
    assert.equal(bitsAt(mask, 1, 2, 5), AO_BIT_RIGHT);
    assert.equal(bitsAt(mask, 3, 2, 5), AO_BIT_LEFT);
    assert.equal(bitsAt(mask, 1, 3, 5), AO_BIT_TOP_RIGHT);
    assert.equal(bitsAt(mask, 3, 3, 5), AO_BIT_TOP_LEFT);
    // North/south and iso-down are intentionally not occluders.
    assert.equal(bitsAt(mask, 2, 1, 5), 0);
    assert.equal(bitsAt(mask, 2, 3, 5), 0);
    assert.equal(bitsAt(mask, 1, 1, 5), 0);
    assert.equal(bitsAt(mask, 3, 1, 5), 0);
    assert.equal(bitsAt(mask, 2, 2, 5), 0);
  });

  it("still writes unused iso-up bits even though the live draw only shades 4/8", () => {
    const mask = buildAmbientOcclusionMask(grid(4, new Set(["2,1"])), 4);
    assert.equal(bitsAt(mask, 1, 2, 4) & AO_BIT_TOP_RIGHT, AO_BIT_TOP_RIGHT);
    assert.equal(bitsAt(mask, 3, 2, 4) & AO_BIT_TOP_LEFT, AO_BIT_TOP_LEFT);
    assert.equal(bitsAt(mask, 1, 2, 4) & AO_BIT_RIGHT, 0);
    assert.equal(bitsAt(mask, 3, 2, 4) & AO_BIT_LEFT, 0);
  });

  it("treats portal cells as occludees, not walls", () => {
    const tiles = grid(4, new Set(["2,1"]), new Set(["1,1"]));
    const mask = buildAmbientOcclusionMask(tiles, 4);
    assert.equal(bitsAt(mask, 1, 1, 4), AO_BIT_RIGHT);
    assert.equal(tiles[1][1], "portal");
  });

  it("does not treat a portal neighbor as an occluder", () => {
    const tiles = grid(4, new Set(), new Set(["2,1"]));
    const mask = buildAmbientOcclusionMask(tiles, 4);
    assert.equal(bitsAt(mask, 1, 1, 4), 0);
    assert.equal(bitsAt(mask, 3, 1, 4), 0);
  });

  it("combines left+right bits and skips off-board neighbors", () => {
    const tiles = grid(3, new Set(["0,1", "2,1"]));
    const mask = buildAmbientOcclusionMask(tiles, 3);
    assert.equal(bitsAt(mask, 1, 1, 3), AO_BIT_LEFT | AO_BIT_RIGHT);
    const corner = buildAmbientOcclusionMask(grid(3, new Set(["0,0"])), 3);
    assert.equal(bitsAt(corner, 1, 0, 3), AO_BIT_LEFT);
    assert.equal(bitsAt(corner, 0, 1, 3), 0);
  });

  it("defaults to WORLD_GRID_SIZE and matches the legacy loop byte-for-byte", () => {
    const walls = new Set([
      "0,0",
      "3,2",
      "8,8",
      "15,0",
      "0,15",
      "15,15",
      "7,4",
    ]);
    const tiles = grid(WORLD_GRID_SIZE, walls, new Set(["4,4"]));
    const extracted = buildAmbientOcclusionMask(tiles);
    const live = legacyBuild(tiles, WORLD_GRID_SIZE);
    assert.equal(extracted.length, WORLD_GRID_SIZE * WORLD_GRID_SIZE);
    assert.deepEqual(Buffer.from(extracted), Buffer.from(live));
  });
});
