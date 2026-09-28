/**
 * engine/ambientOcclusion.ts
 *
 * Pure tile-neighbor wall bitmask used by WorldExploration's canvas AO
 * pass. WorldExploration still owns:
 *   - aoMaskRef / aoMapIdRef (rebuild when map id changes)
 *   - dust-mote seeding that shares that map-id gate
 *   - the per-tile canvas gradients
 *
 * Live neighbor bits — do not "improve" them:
 *   - bit 0 (1) = iso top-right wall at (gx+1, gy-1)
 *   - bit 1 (2) = iso top-left wall at (gx-1, gy-1)
 *   - bit 2 (4) = grid-right wall at (gx+1, gy)
 *   - bit 3 (8) = grid-left wall at (gx-1, gy)
 *
 * The live draw only shades bits 4 and 8. Bits 1 and 2 are still written.
 * North/south grid neighbors and iso-down diagonals are intentionally
 * omitted. Wall cells stay 0 (`continue`). `"portal"` is not a wall.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";

/** Iso top-right neighbor is a wall: (gx+1, gy-1). Computed; live draw unused. */
export const AO_BIT_TOP_RIGHT = 1;
/** Iso top-left neighbor is a wall: (gx-1, gy-1). Computed; live draw unused. */
export const AO_BIT_TOP_LEFT = 2;
/** Grid-right neighbor is a wall: (gx+1, gy). Live draw uses this. */
export const AO_BIT_RIGHT = 4;
/** Grid-left neighbor is a wall: (gx-1, gy). Live draw uses this. */
export const AO_BIT_LEFT = 8;

export function aoMaskIndex(
  x: number,
  y: number,
  gridSize: number = WORLD_GRID_SIZE,
): number {
  return y * gridSize + x;
}

/**
 * One Uint8Array, row-major `y * gridSize + x`. Wall cells remain 0.
 * Neighbor lookups use `=== "wall"` with no optional chaining — same as live.
 */
export function buildAmbientOcclusionMask(
  tiles: readonly (readonly string[])[],
  gridSize: number = WORLD_GRID_SIZE,
): Uint8Array {
  const mask = new Uint8Array(gridSize * gridSize);
  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      if (tiles[gy][gx] === "wall") continue;
      let bits = 0;
      // top-right neighbor (gx+1, gy-1 in iso = wall to the upper-right)
      if (gx + 1 < gridSize && gy > 0 && tiles[gy - 1][gx + 1] === "wall") {
        bits |= AO_BIT_TOP_RIGHT;
      }
      // top-left neighbor (gx-1, gy-1 in iso = wall to the upper-left)
      if (gx > 0 && gy > 0 && tiles[gy - 1][gx - 1] === "wall") {
        bits |= AO_BIT_TOP_LEFT;
      }
      // right neighbor in grid
      if (gx + 1 < gridSize && tiles[gy][gx + 1] === "wall") {
        bits |= AO_BIT_RIGHT;
      }
      // left neighbor in grid
      if (gx > 0 && tiles[gy][gx - 1] === "wall") {
        bits |= AO_BIT_LEFT;
      }
      mask[aoMaskIndex(gx, gy, gridSize)] = bits;
    }
  }
  return mask;
}
