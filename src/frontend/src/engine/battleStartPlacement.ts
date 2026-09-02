/**
 * engine/battleStartPlacement.ts
 *
 * Pure battle-start spacing. WorldExploration.checkBattleTrigger builds an
 * OccupancyContext (mutable `placed` set) and calls this for the player
 * (>= 3 Chebyshev from every enemy) then each enemy (>= 3 from the player,
 * >= 2 from already-placed enemies).
 *
 * Pass 1: every free cell that meets ALL per-position minDist constraints;
 *         pick highest min Chebyshev, then nearest to origin.
 * Pass 2: cramped map — findNearestFreeCell (no spacing), never overlap.
 *
 * React-free. Callers own refs/setters and the OccupancyContext.
 */

import {
  type OccupancyContext,
  findNearestFreeCell,
  isCellFree,
  occKey,
} from "./occupancy.ts";

/** A cell other combatants must stay at least `minDist` Chebyshev from. */
export interface BattleStartAvoid {
  x: number;
  y: number;
  minDist: number;
}

function occupancyGridSize(ctx: OccupancyContext): { w: number; h: number } {
  return { h: ctx.tiles.length, w: ctx.tiles[0]?.length ?? 0 };
}

/** Walkable island containing `origin` (tiles + void + barriers, ignore occupancy). */
function floodOriginComponent(
  origin: { x: number; y: number },
  ctx: OccupancyContext,
): Set<string> {
  const { w, h } = occupancyGridSize(ctx);
  const seen = new Set<string>();
  const walk = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
    return true;
  };
  if (!walk(origin.x, origin.y)) return seen;
  const q = [{ x: origin.x, y: origin.y }];
  seen.add(occKey(origin.x, origin.y));
  while (q.length > 0) {
    const cur = q.shift()!;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      const k = occKey(nx, ny);
      if (seen.has(k) || !walk(nx, ny)) continue;
      seen.add(k);
      q.push({ x: nx, y: ny });
    }
  }
  return seen;
}

/**
 * Pick a unique passable battle-start cell near `origin`.
 *
 * Pass 1 collects every `isCellFree` cell that satisfies every avoid
 * constraint (Chebyshev(cell, p) >= p.minDist). Among those, prefer the
 * largest min-distance to any avoided cell, then the nearest to origin so
 * units spread around the player instead of stacking on one far corner.
 *
 * Pass 2 (no cell meets spacing): `findNearestFreeCell` ring-scan from
 * origin using `minDistFallback` as the radius. That fallback does not
 * re-apply spacing — it only guarantees a free tile when the map is cramped.
 *
 * Scan stays on the origin walkable component so leftover CA islands cannot
 * win max-spacing. Returns null only when the fallback also finds no free cell.
 */
export function findBattleStartCell(
  origin: { x: number; y: number },
  avoid: BattleStartAvoid[],
  minDistFallback: number,
  ctx: OccupancyContext,
): { x: number; y: number } | null {
  // Max-spacing used to scan the whole WORLD_GRID_SIZE and teleport onto a
  // leftover CA island. Stay on the origin's walkable component.
  const component = floodOriginComponent(origin, ctx);
  const { w, h } = occupancyGridSize(ctx);
  // Pass 1: collect every cell that is free AND meets EVERY per-position
  // spacing target. A cell qualifies iff for each avoided position p,
  // Chebyshev(cell, p) >= p.minDist. This lets the caller demand, e.g.,
  // >= 3 from the player AND >= 2 from each already-placed enemy in one pass.
  const spaced: {
    x: number;
    y: number;
    minD: number;
    dFromOrigin: number;
  }[] = [];
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      const cell = { x: gx, y: gy };
      if (!component.has(occKey(gx, gy))) continue;
      if (!isCellFree(cell, ctx)) continue;
      let ok = true;
      let minD = Number.POSITIVE_INFINITY;
      for (const p of avoid) {
        const d = Math.max(Math.abs(gx - p.x), Math.abs(gy - p.y));
        if (d < minD) minD = d;
        if (d < p.minDist) {
          ok = false;
          break;
        }
      }
      if (ok) {
        const dFromOrigin = Math.max(
          Math.abs(gx - origin.x),
          Math.abs(gy - origin.y),
        );
        spaced.push({ x: gx, y: gy, minD, dFromOrigin });
      }
    }
  }
  if (spaced.length > 0) {
    // Pick the best-spaced cell; break ties by NEAREST to origin so
    // multiple enemies spread around the player instead of piling on one
    // far corner. Stable sort: highest minD first, then lowest dFromOrigin.
    spaced.sort((a, b) =>
      a.minD !== b.minD ? b.minD - a.minD : a.dFromOrigin - b.dFromOrigin,
    );
    return { x: spaced[0].x, y: spaced[0].y };
  }
  // Pass 2 (cramped map): fall back to the nearest free cell to origin.
  // findNearestFreeCell uses isCellFree under the hood, so the result is
  // guaranteed unique + passable (it cannot overlap any combatant that
  // ctx.isOccupied already knows about, including the ones we just placed).
  // minDistFallback is the ring-scan radius used here (typically the
  // loosest spacing target so the fallback still tries to respect spacing).
  return findNearestFreeCell(origin, ctx, minDistFallback, undefined, (cell) =>
    component.has(occKey(cell.x, cell.y)),
  );
}
