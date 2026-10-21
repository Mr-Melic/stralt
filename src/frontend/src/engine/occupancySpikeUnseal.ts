/**
 * Cinder Knight `SPIKE_ON_LAND` plants a spike hazard at the RAW
 * `KNIGHT_JUMP_IGNORE_WALLS` dest (`getKnightMoves(..., ignoreWalls: true)`).
 * That filter is in-bounds only — walls, portals, leftover CA crumbs, and
 * the player cell are valid landings. Occupancy 1+1 unseal relocates units
 * and cannot move hazard markers. Occupancy floods still walk portals, so
 * leftover-islands stays 0, unique-bridge unseal never runs, and a spike on
 * the gate or a far-side crumb never appears on the fight graph — the
 * landing tax is wasted while `#704` snaps the *unit* elsewhere.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner midpoint /
 * VOID_TILES / ANCHOR_TILES helpers (those snap units onto already-walkable
 * fight-graph cells, rewrite walls, raster-spawn minions, take one orthogonal
 * allTiles step, point-reflect, average two bodies, plant impassable voids at
 * Manhattan-2, or plant required-step glyphs via a full-board shuffle). This
 * is a knight L-shape *tile* mutation. ignoreWalls dests can be non-allTiles
 * walls, which VOID/ANCHOR/ADVANCE never emit. Unique-corridor landings stay
 * legal — spikes are walkable, unlike a void on the same cell.
 *
 * Fight-graph snap onto a walkable cell; drop leftover-island dests rather
 * than punch. Does not restack occupancy.ts, occupancyIgnoreWallsUnseal,
 * WorldExploration, useBossSystem, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  occKey,
  progressionSearchRadius,
} from "./occupancy.ts";

/** Knight L offsets matching `getKnightMoves` in `useBossSystem`. */
export const KNIGHT_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-2, -1],
  [-2, 1],
  [2, -1],
  [2, 1],
  [-1, -2],
  [1, -2],
  [-1, 2],
  [1, 2],
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

function manhattan(a: OccCell, b: OccCell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/** WX `tilesForBossAI`: portals count as walkable floor for boss AI. */
export function tilesForKnightAi(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodSpikeBattleGraph(
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

export function isOnSpikeBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodSpikeBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when no spike sits on the fight graph (gate, void, barrier, leftover
 * crumb, or empty pick). The landing tax then never applies on the route
 * the player must walk.
 */
export function spikesOffFightGraph(
  player: OccCell,
  spikes: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (spikes.length === 0) return true;
  return !spikes.some((cell) => isOnSpikeBattleGraph(cell, player, ctx));
}

/**
 * Raw knight L dests. `ignoreWalls: true` matches production
 * `KNIGHT_JUMP_IGNORE_WALLS` (in-bounds only). `allTiles` is used only when
 * `ignoreWalls` is false.
 */
export function rawKnightLeapDests(
  boss: OccCell,
  allTiles: boolean[][],
  ignoreWalls: boolean,
): OccCell[] {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const dests: OccCell[] = [];
  for (const [dx, dy] of KNIGHT_OFFSETS) {
    const x = boss.x + dx;
    const y = boss.y + dy;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    if (!ignoreWalls && !allTiles[y]?.[x]) continue;
    dests.push({ x, y });
  }
  return dests;
}

/**
 * Closest knight dest to the player — same reduce as
 * `applyKnightJumpIgnoreWalls` (ties keep the earlier offset).
 */
export function rawKnightLeapDest(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  ignoreWalls = true,
): OccCell | null {
  const dests = rawKnightLeapDests(boss, allTiles, ignoreWalls);
  if (dests.length === 0) return null;
  return dests.reduce((a, b) =>
    manhattan(a, player) < manhattan(b, player) ? a : b,
  );
}

function acceptSpikeLanding(
  cell: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (k === occKey(player.x, player.y)) return false;
  if (!battle.has(k)) return false;
  return true;
}

/**
 * Relocate a spike onto a fight-graph cell the player can walk. Returns
 * `null` when every candidate is a leftover island (caller drops the spike
 * instead of punching). Unique-corridor cells stay legal. Occupied cells
 * are allowed for an already-legal dest (the boss lands on its own spike);
 * snaps still use `findNearestFreeCell` so they do not stack on units.
 */
export function legalizeSpikePlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodSpikeBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptSpikeLanding(cell, player, ctx, battle, placed);
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
 * Snap several spike dests off the gate, walls, voids, and leftover crumbs.
 * Drops a dest that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeSpikePlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeSpikePlacement(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

/**
 * Raw ignoreWalls knight dest toward the player, then snap the spike off
 * the portal / wall / far crumb. Empty when the fight graph cannot host a
 * spike or the leap has no in-bounds dest.
 */
export function resolveSpikeOnLand(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  ctx: OccupancyContext,
  ignoreWalls = true,
): OccCell | null {
  const raw = rawKnightLeapDest(boss, player, allTiles, ignoreWalls);
  if (!raw) return null;
  return legalizeSpikePlacement(raw, player, ctx);
}
