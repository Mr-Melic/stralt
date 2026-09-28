/**
 * Void Grandmaster `VOID_TILES` plants four cardinal cells at range 2 using
 * `allTiles` (floor OR portal) and no unique-bridge / occupancy check.
 * Unlike ADVANCE_PER_TURN / getAdjacentTiles (one orthogonal step) and
 * unlike Twin Bishop reflection / summoner midpoint / ghost raster, this is
 * a Manhattan-2 skip that mutates tiles — occupancy 1+1 unseal relocates
 * units and cannot lift a void on the gate or the only player→exit corridor.
 * Occupancy floods still walk portals, so leftover-islands stays 0 and
 * `isProgressionLocked` never clears after the exit cell itself is voided.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner midpoint
 * helpers (those snap units onto already-walkable fight-graph cells, rewrite
 * walls, raster-scan, take one orthogonal allTiles step, point-reflect, or
 * average two bodies). This writes impassable voids at range 2.
 *
 * Fight-graph snap onto dump cells so occupancy unseal is not needed; drop
 * the void rather than punch a leftover-island join. Does not restack
 * occupancy.ts, WorldExploration, useBossSystem, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  isCellFree,
  occKey,
  occupantsSealProgression,
  progressionReserved,
  progressionSearchRadius,
} from "./occupancy.ts";

/** Cardinal offsets matching `applyVoidTiles` (`[0,±2]`, `[±2,0]`). */
export const VOID_CARDINAL_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [0, -2],
  [0, 2],
  [-2, 0],
  [2, 0],
];

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

function inBounds(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodVoidBattleGraph(
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
    for (const [dx, dy] of ORTH) {
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
      for (const [dx, dy] of ORTH) {
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

export function isOnVoidBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodVoidBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

function withExtraVoids(
  ctx: OccupancyContext,
  extra: readonly OccCell[],
): OccupancyContext {
  if (extra.length === 0) return ctx;
  const voidTiles = new Set(ctx.voidTiles);
  for (const cell of extra) voidTiles.add(occKey(cell.x, cell.y));
  return { ...ctx, voidTiles };
}

/**
 * True when adding `extra` as occupancy voids cuts every player→exit route
 * (including voiding the portal cell itself so it cannot be stepped on).
 */
export function voidsSealProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withExtraVoids(ctx, extra);
  return occupantsSealProgression(
    live.tiles,
    live.voidTiles,
    live.portals,
    player,
    [],
    live.barriers,
  );
}

/**
 * Raw VOID_TILES dests: four cardinal cells at range 2, then keep in-bounds
 * cells whose `allTiles` bit is set (floor OR portal — matches
 * `applyVoidTiles`). No unique-bridge / occupancy / void check.
 */
export function rawVoidDests(boss: OccCell, tiles: boolean[][]): OccCell[] {
  const h = tiles.length;
  const w = tiles[0]?.length ?? 0;
  const dests: OccCell[] = [];
  for (const [dx, dy] of VOID_CARDINAL_OFFSETS) {
    const cell = { x: boss.x + dx, y: boss.y + dy };
    if (!inBounds(cell, w, h)) continue;
    if (!tiles[cell.y]?.[cell.x]) continue;
    dests.push(cell);
  }
  return dests;
}

function acceptVoidLanding(
  cell: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
  reserved: Set<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (k === occKey(player.x, player.y)) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k)) return false;
  if (!isCellFree(cell, ctx)) return false;
  return !voidsSealProgression(player, [{ x: cell.x, y: cell.y }], ctx);
}

/**
 * Relocate a range-2 void onto a fight-graph dump cell that still reaches
 * an exit. Returns `null` when every candidate would seal (caller drops
 * the void instead of punching a leftover island).
 */
export function legalizeVoidPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodVoidBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptVoidLanding(cell, player, ctx, battle, placed, reserved);
  if (ok(dest)) return { x: dest.x, y: dest.y };
  return findNearestFreeCell(
    dest,
    ctx,
    progressionSearchRadius(ctx),
    new Set([occKey(player.x, player.y), ...ctx.portals, ...placed]),
    (cell) => ok(cell),
  );
}

/**
 * Snap several range-2 voids off the gate, unique bridges, and leftover
 * crumbs. Drops a dest that cannot legalize. Does not restack occupancy
 * unseal or punch walls.
 */
export function legalizeVoidPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  let live = ctx;
  for (const dest of dests) {
    const snapped = legalizeVoidPlacement(dest, player, live, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
    live = withExtraVoids(live, [snapped]);
  }
  return result;
}

/**
 * Raw VOID_TILES dests from `boss`, then snap off the portal / unique
 * corridor / far crumb. Empty when the fight graph cannot host a void.
 */
export function resolveVoidTiles(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  return legalizeVoidPlacements(rawVoidDests(boss, ctx.tiles), player, ctx);
}
