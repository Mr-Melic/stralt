/**
 * Leader-death erratic hop (`WorldExploration` ~15531).
 *
 * After the designated leader dies, remaining hostiles pick a random
 * orthogonal neighbor with:
 *   `tiles[y]?.[x] !== "wall"`
 *   in-bounds on `WORLD_GRID_SIZE`
 *   not occupied by another enemy
 *   not the player
 *
 * Portal / void / barrier cells are therefore legal raw dests. A missing
 * row/column (`undefined !== "wall"`) is also legal, so a unit on the
 * edge of a generated pocket can hop onto a leftover CA crumb or off the
 * painted map. Occupancy floods still walk portals, leftover-islands
 * stays 0, unique-bridge unseal never runs, and `isProgressionLocked`
 * never clears because the required hostile cannot be engaged.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint /
 * VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL / greedy
 * `moveToward` (#859). Greedy `getWalkableMoves` is N→S→W→E closest-to-
 * player on `floor || portal` and skips occupied cells, so a closer east
 * floor wins over a west portal. Erratic is W→E→N→S random among
 * `!== "wall"` neighbors — `rng=0` takes the west gate even when east
 * floor is closer to the player. `#859` therefore never sees this dest.
 *
 * Fight-graph snap; prefer dump so occupancy unseal is not needed; refuse
 * leftover-island hops. Unique-corridor landings stay legal. Does not
 * restack occupancy.ts, occupancyMoveTowardUnseal, WorldExploration, or
 * mapGen.simulate.ts.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  occKey,
  occupancyVacating,
  progressionReserved,
  progressionSearchRadius,
} from "./occupancy.ts";

/** W, E, N, S — same order as the erratic `adjCells` literal in WX. */
const ERRATIC_DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

/**
 * WX erratic walkability: any in-bounds non-wall, including portal, void
 * (still painted as floor), barriers the string map does not encode, and
 * missing cells (`undefined !== "wall"`).
 */
export function wxErraticTileWalkable(
  tiles: string[][],
  x: number,
  y: number,
  gridSize: number = WORLD_GRID_SIZE,
): boolean {
  const size = Math.max(1, Math.floor(Number(gridSize) || 0));
  if (x < 0 || y < 0 || x >= size || y >= size) return false;
  return tiles[y]?.[x] !== "wall";
}

/** Boolean grid for occupancy floods: only real floor cells, not portals. */
export function tilesForErraticOccupancy(tiles: string[][]): boolean[][] {
  return tiles.map((row) => (row ?? []).map((t) => t === "floor"));
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodErraticBattleGraph(
  start: OccCell,
  ctx: OccupancyContext,
): Set<string> {
  const { w, h } = gridSize(ctx);
  const seen = new Set<string>();
  const walk = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.voidTiles.has(k) || ctx.barriers.has(k) || ctx.portals.has(k)) {
      return false;
    }
    return true;
  };
  const seeds: OccCell[] = [];
  if (walk(start.x, start.y)) {
    seeds.push({ x: start.x, y: start.y });
  } else {
    for (const [dx, dy] of ERRATIC_DIRS) {
      const nx = start.x + dx;
      const ny = start.y + dy;
      if (walk(nx, ny)) seeds.push({ x: nx, y: ny });
    }
  }
  for (const seed of seeds) {
    const sk = occKey(seed.x, seed.y);
    if (seen.has(sk)) continue;
    const q: OccCell[] = [seed];
    seen.add(sk);
    while (q.length > 0) {
      const cur = q.shift()!;
      for (const [dx, dy] of ERRATIC_DIRS) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        const k = occKey(nx, ny);
        if (seen.has(k) || !walk(nx, ny)) continue;
        seen.add(k);
        q.push({ x: nx, y: ny });
      }
    }
  }
  return seen;
}

export function isOnErraticBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodErraticBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when every erratic dest sits off the fight graph (gate, void,
 * leftover crumb, missing-tile hop, or empty pick). The required hostile
 * then cannot be engaged, so clearing never unlocks.
 */
export function erraticOffFightGraph(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnErraticBattleGraph(cell, player, ctx));
}

/**
 * Orthogonal neighbors WX would offer. Occupied cells besides the hopper
 * and the player cell are skipped. Missing tiles remain when they are not
 * the string `"wall"`.
 */
export function rawErraticAdjacentDests(
  origin: OccCell,
  tiles: string[][],
  occupied: readonly OccCell[] = [],
  player?: OccCell | null,
  gridSize: number = WORLD_GRID_SIZE,
): OccCell[] {
  const blocked = new Set(occupied.map((o) => occKey(o.x, o.y)));
  blocked.delete(occKey(origin.x, origin.y));
  if (player) blocked.add(occKey(player.x, player.y));
  const dests: OccCell[] = [];
  for (const [dx, dy] of ERRATIC_DIRS) {
    const x = origin.x + dx;
    const y = origin.y + dy;
    if (!wxErraticTileWalkable(tiles, x, y, gridSize)) continue;
    if (blocked.has(occKey(x, y))) continue;
    dests.push({ x, y });
  }
  return dests;
}

/** `adjCells[Math.floor(rng * length)]` — WX uses `Math.random`. */
export function pickRawErraticDest(
  dests: readonly OccCell[],
  rand: () => number = Math.random,
): OccCell | null {
  if (dests.length === 0) return null;
  const r = Number(rand());
  const u = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  const idx = Math.min(dests.length - 1, Math.floor(u * dests.length));
  return dests[idx] ?? null;
}

/**
 * Production WX: pick among `!== "wall"` neighbors and commit that cell.
 * Portal / void / missing-tile dests are not snapped.
 */
export function wxErraticCommitWithoutUnseal(opts: {
  origin: OccCell;
  tiles: string[][];
  occupied?: readonly OccCell[];
  player?: OccCell | null;
  rand?: () => number;
  gridSize?: number;
}): OccCell {
  const raw = rawErraticAdjacentDests(
    opts.origin,
    opts.tiles,
    opts.occupied ?? [],
    opts.player,
    opts.gridSize,
  );
  return pickRawErraticDest(raw, opts.rand) ?? { ...opts.origin };
}

function snapOntoFightGraph(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  const graph = floodErraticBattleGraph(player, ctx);
  if (graph.size === 0) return null;
  const destKey = occKey(dest.x, dest.y);
  if (graph.has(destKey) && !ctx.portals.has(destKey)) {
    return { x: dest.x, y: dest.y };
  }
  const mandatory =
    ctx.progressStart && ctx.portals.size > 0
      ? progressionReserved(ctx, player)
      : new Set<string>();
  const radius = progressionSearchRadius(ctx);
  const dump = findNearestFreeCell(dest, ctx, radius, undefined, (cell) => {
    const k = occKey(cell.x, cell.y);
    return graph.has(k) && !mandatory.has(k);
  });
  if (dump) return dump;
  return findNearestFreeCell(dest, ctx, radius, undefined, (cell) =>
    graph.has(occKey(cell.x, cell.y)),
  );
}

/**
 * Relocate a portal-as-floor / missing-tile erratic landing onto the
 * player's fight graph. Returns `dest` unchanged when it is already a
 * legal fight-graph cell. Returns `null` when no fight-graph cell exists
 * (caller keeps the origin).
 */
export function legalizeErraticLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  return snapOntoFightGraph(dest, player, ctx);
}

/**
 * Snap several erratic dests off the gate and leftover crumbs. Drops a dest
 * that cannot legalize. Does not restack occupancy unseal or punch walls.
 */
export function legalizeErraticLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const taken = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const graph = floodErraticBattleGraph(player, ctx);
    const destKey = occKey(dest.x, dest.y);
    if (
      graph.has(destKey) &&
      !ctx.portals.has(destKey) &&
      !taken.has(destKey)
    ) {
      taken.add(destKey);
      result.push({ x: dest.x, y: dest.y });
      continue;
    }
    const snapped = findNearestFreeCell(
      dest,
      ctx,
      progressionSearchRadius(ctx),
      taken,
      (cell) => graph.has(occKey(cell.x, cell.y)),
    );
    if (snapped) {
      taken.add(occKey(snapped.x, snapped.y));
      result.push(snapped);
    }
  }
  return result;
}

/**
 * One erratic hop, then snap off the portal / far crumb / missing tile.
 * Vacates the origin so the snap can reuse that cell. Stays put when the
 * raw pick is missing or the snap would join a leftover island that is
 * not on the player's fight graph.
 */
export function resolveErraticLanding(
  origin: OccCell,
  player: OccCell,
  tiles: string[][],
  ctx: OccupancyContext,
  occupied: readonly OccCell[] = [],
  rand: () => number = Math.random,
  gridSize: number = WORLD_GRID_SIZE,
): OccCell {
  const raw = pickRawErraticDest(
    rawErraticAdjacentDests(origin, tiles, occupied, player, gridSize),
    rand,
  );
  if (!raw) return { x: origin.x, y: origin.y };
  const moving = occupancyVacating(ctx, origin);
  const snapped = snapOntoFightGraph(raw, player, moving);
  if (!snapped) return { x: origin.x, y: origin.y };
  return snapped;
}
