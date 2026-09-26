import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  TILE_HEIGHT,
  TILE_WIDTH,
  WORLD_GRID_SIZE,
} from "../data/gameConstants.ts";
import {
  type IsoView,
  buildIsoTileCenterCache,
  clampIsoGrid,
  isoApproxGrid,
  isoGridSize,
  isoMapOrigin,
  isoTileCenter,
  isoTileTopVertex,
  isoTileTopVertexRounded,
  pickIsoTileFromPoint,
  pointInIsoDiamond,
} from "./isoGrid.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change rounding or origin. Do not "improve" these.
 */
function legacyOrigin(
  canvasW: number,
  canvasH: number,
  _tileW: number,
  tileH: number,
  camX: number,
  camY: number,
): { x: number; y: number } {
  const mapH = WORLD_GRID_SIZE * tileH;
  return {
    x: canvasW / 2 + camX,
    y: (canvasH - mapH) / 2 + tileH / 2 + camY,
  };
}

function legacyTopRounded(
  canvasW: number,
  canvasH: number,
  tileW: number,
  tileH: number,
  camX: number,
  camY: number,
  gx: number,
  gy: number,
): { x: number; y: number } {
  const origin = legacyOrigin(canvasW, canvasH, tileW, tileH, camX, camY);
  const screenX = (gx - gy) * (tileW / 2) + origin.x;
  const screenY = (gx + gy) * (tileH / 2) + origin.y;
  return { x: Math.round(screenX), y: Math.round(screenY) };
}

function legacyCenterUnrounded(
  canvasW: number,
  canvasH: number,
  tileW: number,
  tileH: number,
  camX: number,
  camY: number,
  gx: number,
  gy: number,
): { cx: number; cy: number } {
  const origin = legacyOrigin(canvasW, canvasH, tileW, tileH, camX, camY);
  const halfW = tileW / 2;
  const halfH = tileH / 2;
  const topX = (gx - gy) * halfW + origin.x;
  const topY = (gx + gy) * halfH + origin.y;
  return { cx: topX, cy: topY + halfH };
}

function legacyApproxUnclamped(
  canvasW: number,
  canvasH: number,
  tileW: number,
  tileH: number,
  camX: number,
  camY: number,
  px: number,
  py: number,
): { x: number; y: number } {
  const origin = legacyOrigin(canvasW, canvasH, tileW, tileH, camX, camY);
  const halfW = tileW / 2;
  const halfH = tileH / 2;
  const dx = px - origin.x;
  const dy = py - halfH - origin.y;
  return {
    x: Math.round((dx / halfW + dy / halfH) / 2),
    y: Math.round((dy / halfH - dx / halfW) / 2),
  };
}

const desktop: IsoView = {
  canvasWidth: 1280,
  canvasHeight: 720,
  tileW: TILE_WIDTH,
  tileH: TILE_HEIGHT,
  camX: 0,
  camY: 0,
};

const mobile: IsoView = {
  canvasWidth: 390,
  canvasHeight: 844,
  tileW: TILE_WIDTH * 1.75,
  tileH: TILE_HEIGHT * 1.75,
  camX: 12.4,
  camY: -8.2,
};

describe("isoMapOrigin / isoTileTopVertex", () => {
  it("matches the live gridToScreen origin on desktop and mobile zoom", () => {
    assert.deepEqual(
      isoMapOrigin(desktop),
      legacyOrigin(1280, 720, TILE_WIDTH, TILE_HEIGHT, 0, 0),
    );
    assert.deepEqual(
      isoMapOrigin(mobile),
      legacyOrigin(390, 844, TILE_WIDTH * 1.75, TILE_HEIGHT * 1.75, 12.4, -8.2),
    );
  });

  it("rounded top vertex matches live gridToScreen for corner and mid tiles", () => {
    for (const [gx, gy] of [
      [0, 0],
      [8, 8],
      [15, 15],
      [15, 0],
      [0, 15],
      [3, 11],
    ] as const) {
      assert.deepEqual(
        isoTileTopVertexRounded(desktop, gx, gy),
        legacyTopRounded(1280, 720, TILE_WIDTH, TILE_HEIGHT, 0, 0, gx, gy),
      );
      assert.deepEqual(
        isoTileTopVertexRounded(mobile, gx, gy),
        legacyTopRounded(
          390,
          844,
          TILE_WIDTH * 1.75,
          TILE_HEIGHT * 1.75,
          12.4,
          -8.2,
          gx,
          gy,
        ),
      );
    }
  });

  it("does not round the cache center even when the top vertex is fractional", () => {
    const top = isoTileTopVertex(mobile, 3, 11);
    const center = isoTileCenter(mobile, 3, 11);
    const rounded = isoTileTopVertexRounded(mobile, 3, 11);
    assert.notEqual(top.x, rounded.x);
    assert.equal(center.cx, top.x);
    assert.equal(center.cy, top.y + mobile.tileH / 2);
    assert.deepEqual(
      center,
      legacyCenterUnrounded(
        390,
        844,
        TILE_WIDTH * 1.75,
        TILE_HEIGHT * 1.75,
        12.4,
        -8.2,
        3,
        11,
      ),
    );
  });
});

describe("isoApproxGrid / clampIsoGrid", () => {
  it("is the unclamped _screenToGrid inverse", () => {
    const center = isoTileCenter(desktop, 8, 8);
    assert.deepEqual(
      isoApproxGrid(desktop, center.cx, center.cy),
      legacyApproxUnclamped(
        1280,
        720,
        TILE_WIDTH,
        TILE_HEIGHT,
        0,
        0,
        center.cx,
        center.cy,
      ),
    );
    assert.deepEqual(isoApproxGrid(desktop, center.cx, center.cy), {
      x: 8,
      y: 8,
    });
  });

  it("does not clamp off-board guesses (live _screenToGrid)", () => {
    const far = isoApproxGrid(desktop, -10_000, -10_000);
    assert.ok(far.x < 0 || far.y < 0);
    assert.deepEqual(
      far,
      legacyApproxUnclamped(
        1280,
        720,
        TILE_WIDTH,
        TILE_HEIGHT,
        0,
        0,
        -10_000,
        -10_000,
      ),
    );
  });

  it("clientToGrid clamps the 5×5 neighborhood onto the board", () => {
    assert.deepEqual(clampIsoGrid(-4, 99), { x: 0, y: 15 });
    assert.deepEqual(clampIsoGrid(0, 0), { x: 0, y: 0 });
    assert.deepEqual(clampIsoGrid(15, 15), { x: 15, y: 15 });
  });
});

describe("pointInIsoDiamond / pickIsoTileFromPoint", () => {
  it("includes the diamond edge (ndx + ndy === 1) and rejects the AABB corner", () => {
    assert.equal(pointInIsoDiamond(40, 0, 0, 0, 40, 20), true);
    assert.equal(pointInIsoDiamond(0, 20, 0, 0, 40, 20), true);
    assert.equal(pointInIsoDiamond(40, 20, 0, 0, 40, 20), false);
    assert.equal(pointInIsoDiamond(40.1, 0, 0, 0, 40, 20), false);
  });

  it("picks the tile whose unrounded center contains the point", () => {
    const cache = buildIsoTileCenterCache(desktop);
    const mid = isoTileCenter(desktop, 8, 8);
    assert.deepEqual(pickIsoTileFromPoint(desktop, mid.cx, mid.cy, cache), {
      x: 8,
      y: 8,
    });
    const corner = isoTileCenter(desktop, 0, 0);
    assert.deepEqual(
      pickIsoTileFromPoint(desktop, corner.cx, corner.cy, cache),
      { x: 0, y: 0 },
    );
  });

  it("returns null when the point is outside every nearby diamond", () => {
    const cache = buildIsoTileCenterCache(desktop);
    assert.equal(pickIsoTileFromPoint(desktop, 2, 2, cache), null);
  });

  it("builds a full-grid cache with unrounded centers", () => {
    const cache = buildIsoTileCenterCache(desktop);
    assert.equal(cache.size, WORLD_GRID_SIZE * WORLD_GRID_SIZE);
    assert.equal(isoGridSize(desktop), WORLD_GRID_SIZE);
    const expected = legacyCenterUnrounded(
      1280,
      720,
      TILE_WIDTH,
      TILE_HEIGHT,
      0,
      0,
      4,
      9,
    );
    assert.deepEqual(cache.get("4,9"), expected);
  });

  it("still hits a map-edge tile after the approx is clamped", () => {
    const cache = buildIsoTileCenterCache(desktop);
    const edge = isoTileCenter(desktop, 0, 15);
    assert.deepEqual(pickIsoTileFromPoint(desktop, edge.cx, edge.cy, cache), {
      x: 0,
      y: 15,
    });
  });
});
