/**
 * Lord of Static `SHOCK_TILES` plants a ShockTile at the RAW origin of
 * `moveToward` (`prevX`/`prevY` = the boss cell before the orthogonal
 * `tilesForBossAI` step). That filter treats portals as floor, so a greedy
 * Manhattan hop can sit the unit on the gate; the *next* trail then stamps
 * shock on the portal or, one hop later, on a far-side leftover CA crumb.
 * Phase-2 `CHAIN_LIGHTNING` then spreads with `getAdjacentTiles` from those
 * markers (again `allTiles` = floor OR portal). Occupancy 1+1 unseal
 * relocates units and cannot move shock markers. Occupancy floods still
 * walk portals, so leftover-islands stays 0, unique-bridge unseal never
 * runs, and a shock on the gate or far crumb never appears on the fight
 * graph — phase-2 chain never taxes the route the player must walk, while
 * `#732` / `#859` snap the *unit* elsewhere.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner
 * midpoint / VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL /
 * greedy `moveToward` / erratic / Chebyshev king-step helpers
 * (#589–#867). Those snap units onto already-walkable fight-graph cells,
 * rewrite walls, raster-spawn minions, take one occupancy-blind toward-axis
 * orthogonal step, point-reflect, average two bodies, plant impassable
 * voids at Manhattan-2, plant required-step glyphs, plant a walkable spike
 * at a knight L dest, plant walkable lava at the *origin* (`hazardTiles`
 * type lava, walk-damage tax), pick the closest orthogonal `floor||portal`
 * neighbor, pick a random orthogonal `!== "wall"` neighbor, or take the
 * Chebyshev king corner. This is a ShockTile marker (`activeShockTiles`)
 * whose downstream is `getAdjacentTiles` chain-lightning spread, not walk
 * damage. `LAVA_TRAIL` never writes `activeShockTiles`; `SHOCK_TILES` never
 * writes `hazardTiles`. Unique-corridor landings stay legal — shock is
 * walkable, unlike a void on the same cell.
 *
 * Fight-graph snap onto a walkable cell; drop leftover-island dests rather
 * than punch. Does not restack occupancy.ts, occupancyLavaUnseal,
 * occupancyKingUnseal, WorldExploration, useBossSystem, or
 * mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  occKey,
  progressionSearchRadius,
} from "./occupancy.ts";

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
export function tilesForShockAi(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodShockBattleGraph(
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

export function isOnShockBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodShockBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when no shock sits on the fight graph (gate, void, barrier, leftover
 * crumb, or empty pick). Phase-2 chain then never originates on the route
 * the player must walk.
 */
export function shockOffFightGraph(
  player: OccCell,
  shocks: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (shocks.length === 0) return true;
  return !shocks.some((cell) => isOnShockBattleGraph(cell, player, ctx));
}

/**
 * Production `SHOCK_TILES` origin — the cell the boss occupies before
 * `moveToward`. Never a wall under `tilesForBossAI`; can be a portal.
 */
export function rawShockTrailDest(boss: OccCell): OccCell {
  return { x: boss.x, y: boss.y };
}

function shockWalkableMoves(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
): OccCell[] {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const blocked = new Set(occupied.map((o) => occKey(o.x, o.y)));
  const dests: OccCell[] = [];
  for (const [dx, dy] of ORTH) {
    const x = boss.x + dx;
    const y = boss.y + dy;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    if (!allTiles[y]?.[x]) continue;
    if (blocked.has(occKey(x, y))) continue;
    dests.push({ x, y });
  }
  return dests;
}

/**
 * Closest orthogonal `tilesForBossAI` step toward the player — same reduce
 * as `moveToward` in `useBossAI` (ties keep the earlier offset). Local so
 * this PR does not restack occupancyLavaUnseal / occupancyMoveTowardUnseal.
 */
export function rawShockMoveTowardDest(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
): OccCell | null {
  const others = occupied.filter((o) => !(o.x === boss.x && o.y === boss.y));
  const blocked = [...others, { x: player.x, y: player.y }];
  const moves = shockWalkableMoves(boss, allTiles, blocked);
  if (moves.length === 0) return null;
  return moves.reduce((a, b) =>
    manhattan(a, player) < manhattan(b, player) ? a : b,
  );
}

/**
 * Production `CHAIN_LIGHTNING` neighbors from a shock origin — the same
 * `getAdjacentTiles` scan (`allTiles`, no occupancy). A leftover-crumb
 * origin only sees leftover / portal neighbors, never the fight graph.
 */
export function rawChainAdjDests(
  origin: OccCell,
  allTiles: boolean[][],
): OccCell[] {
  return shockWalkableMoves(origin, allTiles, []);
}

function acceptShockLanding(
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
 * Relocate a shock onto a fight-graph cell the player can walk. Returns
 * `null` when every candidate is a leftover island (caller drops the shock
 * instead of punching). Unique-corridor cells stay legal. Occupied cells
 * are allowed for an already-legal dest (the boss leaves its own trail);
 * snaps still use `findNearestFreeCell` so they do not stack on units.
 */
export function legalizeShockPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodShockBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptShockLanding(cell, player, ctx, battle, placed);
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
 * Snap several shock origins off the gate, voids, and leftover crumbs.
 * Drops a dest that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeShockPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeShockPlacement(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

/**
 * Raw trail origin (the boss cell), then snap the shock off the portal /
 * void / far crumb. Empty when the fight graph cannot host a trail.
 */
export function resolveShockTrail(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
): OccCell | null {
  return legalizeShockPlacement(rawShockTrailDest(boss), player, ctx);
}

/**
 * Snap chain-lightning adjacency so a leftover-crumb origin cannot keep
 * the tax off the fight graph. Drops neighbors that cannot legalize.
 */
export function legalizeChainAdjDests(
  origin: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
): OccCell[] {
  return legalizeShockPlacements(
    rawChainAdjDests(origin, allTiles),
    player,
    ctx,
  );
}
