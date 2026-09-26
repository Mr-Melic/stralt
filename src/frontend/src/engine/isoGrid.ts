/**
 * engine/isoGrid.ts
 *
 * Pure isometric projection used by WorldExploration for draw anchors,
 * tile-center cache, and client→tile picking.
 *
 * WorldExploration still owns:
 *   - canvas DOM (`pointerToRenderSpace`, getBoundingClientRect)
 *   - camera refs and the desktop cam=0 gate
 *   - the rounded `gridToScreen` result cache
 *   - spriteRectsRef / hitTestSprite (open PR #427)
 *
 * Rounding is intentionally split — do not unify:
 *   - `isoTileTopVertexRounded` (`gridToScreen`) Math.rounds the top vertex
 *   - `isoTileCenter` / `buildIsoTileCenterCache` keep unrounded centers
 *     so `pickIsoTileFromPoint` does not inherit inverse-formula drift
 *
 * `_screenToGrid` is the unclamped inverse (`isoApproxGrid`).
 * `clientToGrid` clamps that guess, then point-in-diamond tests a 5×5
 * neighborhood against the unrounded cache.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";

export type IsoPoint = { x: number; y: number };

export type IsoTileCenter = { cx: number; cy: number };

/** CSS-space view. Callers resolve desktop cam=0 before passing camX/camY. */
export type IsoView = {
  canvasWidth: number;
  canvasHeight: number;
  tileW: number;
  tileH: number;
  camX: number;
  camY: number;
  gridSize?: number;
};

export const ISO_PICK_NEIGHBORHOOD = 2;

export function isoGridSize(view: IsoView): number {
  return view.gridSize ?? WORLD_GRID_SIZE;
}

/**
 * Origin of the iso projection: canvas center + camera, with the map
 * vertically centered and shifted down by half a tile so (0,0)'s top
 * vertex sits on the origin Y used by `gridToScreen`.
 */
export function isoMapOrigin(view: IsoView): IsoPoint {
  const gridSize = isoGridSize(view);
  const mapH = gridSize * view.tileH;
  const halfH = view.tileH / 2;
  return {
    x: view.canvasWidth / 2 + view.camX,
    y: (view.canvasHeight - mapH) / 2 + halfH + view.camY,
  };
}

/** Unrounded top vertex of tile (gx, gy). Same algebra as live gridToScreen. */
export function isoTileTopVertex(
  view: IsoView,
  gx: number,
  gy: number,
): IsoPoint {
  const origin = isoMapOrigin(view);
  const halfW = view.tileW / 2;
  const halfH = view.tileH / 2;
  return {
    x: (gx - gy) * halfW + origin.x,
    y: (gx + gy) * halfH + origin.y,
  };
}

/** Rounded top vertex — the value `gridToScreen` caches and returns. */
export function isoTileTopVertexRounded(
  view: IsoView,
  gx: number,
  gy: number,
): IsoPoint {
  const top = isoTileTopVertex(view, gx, gy);
  return { x: Math.round(top.x), y: Math.round(top.y) };
}

/**
 * Unrounded visual center (top + half tile height). Used by the click
 * cache — not the rounded `gridToScreen` top.
 */
export function isoTileCenter(
  view: IsoView,
  gx: number,
  gy: number,
): IsoTileCenter {
  const top = isoTileTopVertex(view, gx, gy);
  return { cx: top.x, cy: top.y + view.tileH / 2 };
}

/**
 * Unclamped inverse of the top-vertex projection. Clicks aim at the tile
 * center, so Y is shifted by −halfH before the inverse (same as live
 * `_screenToGrid` / `clientToGrid` approx).
 */
export function isoApproxGrid(view: IsoView, px: number, py: number): IsoPoint {
  const origin = isoMapOrigin(view);
  const halfW = view.tileW / 2;
  const halfH = view.tileH / 2;
  const dx = px - origin.x;
  const dy = py - halfH - origin.y;
  return {
    x: Math.round((dx / halfW + dy / halfH) / 2),
    y: Math.round((dy / halfH - dx / halfW) / 2),
  };
}

export function clampIsoGrid(
  x: number,
  y: number,
  gridSize: number = WORLD_GRID_SIZE,
): IsoPoint {
  return {
    x: Math.max(0, Math.min(gridSize - 1, x)),
    y: Math.max(0, Math.min(gridSize - 1, y)),
  };
}

/** Manhattan diamond in half-tile units. Inclusive at the edge (`<= 1`). */
export function pointInIsoDiamond(
  px: number,
  py: number,
  cx: number,
  cy: number,
  halfW: number,
  halfH: number,
): boolean {
  const ndx = Math.abs(px - cx) / halfW;
  const ndy = Math.abs(py - cy) / halfH;
  return ndx + ndy <= 1.0;
}

export function buildIsoTileCenterCache(
  view: IsoView,
): Map<string, IsoTileCenter> {
  const gridSize = isoGridSize(view);
  const cache = new Map<string, IsoTileCenter>();
  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      cache.set(`${gx},${gy}`, isoTileCenter(view, gx, gy));
    }
  }
  return cache;
}

/**
 * Live `clientToGrid` after the caller has converted the pointer into
 * CSS/render space. Clamps the inverse guess so the 5×5 search stays on
 * the board, then returns the first diamond hit (scan order: y then x).
 */
export function pickIsoTileFromPoint(
  view: IsoView,
  px: number,
  py: number,
  cache: ReadonlyMap<string, IsoTileCenter>,
): IsoPoint | null {
  const gridSize = isoGridSize(view);
  const approx = isoApproxGrid(view, px, py);
  const clamped = clampIsoGrid(approx.x, approx.y, gridSize);
  const halfW = view.tileW / 2;
  const halfH = view.tileH / 2;
  for (
    let gy = clamped.y - ISO_PICK_NEIGHBORHOOD;
    gy <= clamped.y + ISO_PICK_NEIGHBORHOOD;
    gy++
  ) {
    for (
      let gx = clamped.x - ISO_PICK_NEIGHBORHOOD;
      gx <= clamped.x + ISO_PICK_NEIGHBORHOOD;
      gx++
    ) {
      if (gx < 0 || gx >= gridSize || gy < 0 || gy >= gridSize) continue;
      const entry = cache.get(`${gx},${gy}`);
      if (!entry) continue;
      if (pointInIsoDiamond(px, py, entry.cx, entry.cy, halfW, halfH)) {
        return { x: gx, y: gy };
      }
    }
  }
  return null;
}
