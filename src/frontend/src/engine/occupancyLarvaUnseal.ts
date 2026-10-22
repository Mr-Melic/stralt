/**
 * Broodmother Rook `LARVAE_SPAWN` plants LarvaData from `getAdjacentTiles`
 * (`allTiles` = floor OR portal, occupancy-blind for portals). One random
 * orthogonal neighbor becomes the larva; after a `tilesForBossAI`
 * `moveToward` hop sits the unit on the portal, that neighbor can be the
 * gate or a far-side leftover CA crumb. Occupancy 1+1 unseal relocates
 * combatants and cannot move larva markers (`isOccupied` never sees
 * `bossState.larvae`). Occupancy floods still walk portals, so
 * leftover-islands stays 0, unique-bridge unseal never runs, and a larva
 * on the gate or far crumb never appears on the fight graph — SHELL_ARMOR
 * stays up because larvae cannot be engaged, so clearing never unlocks.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner
 * midpoint / VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL /
 * greedy `moveToward` / erratic / Chebyshev king-step / SHOCK_TILES /
 * ILLUSION_SPLIT helpers (#589–#914). Those snap units onto already-walkable
 * fight-graph cells, rewrite walls, raster-spawn `SpawnData` minions, take
 * one occupancy-blind toward-axis orthogonal step, point-reflect, average
 * two bodies, plant impassable voids at Manhattan-2, plant required-step
 * glyphs, plant a walkable spike at a knight L dest, plant walkable lava
 * at the *origin*, pick the closest orthogonal `floor||portal` neighbor,
 * pick a random orthogonal `!== "wall"` neighbor, take the Chebyshev king
 * corner, plant `activeShockTiles` at the moveToward origin, or plant
 * IllusionData copies whose `isReal` copy is the only legal hit. This is
 * LarvaData (not SpawnData, not IllusionData, not ShockTile, not
 * glyphedTiles, not hazardTiles). `#711` / `#732` snap `SpawnData` that
 * occupancy can see; `#914` snaps IllusionData. Unique-corridor landings
 * stay legal — larvae on an already-walkable fight-graph cell explode on
 * contact and do not need a punch.
 *
 * Fight-graph snap onto a walkable cell; drop leftover-island dests rather
 * than punch. Prefer dump when snapping so occupancy unseal is not needed.
 * Does not restack occupancy.ts, occupancyIllusionUnseal, occupancyShockUnseal,
 * occupancyAdvanceUnseal, occupancyBossSpawnUnseal, WorldExploration,
 * useBossSystem, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  collectMandatoryProgressionCells,
  findNearestFreeCell,
  occKey,
  progressionSearchRadius,
} from "./occupancy.ts";

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

function gridSize(ctx: OccupancyContext): { w: number; h: number } {
  const h = ctx.tiles.length;
  const w = ctx.tiles[0]?.length ?? 0;
  return { w, h };
}

/** WX `tilesForBossAI`: portals count as walkable floor for boss AI. */
export function tilesForLarvaAi(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodLarvaBattleGraph(
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

export function isOnLarvaBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodLarvaBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when any larva is off the fight graph (gate, void, barrier, or
 * leftover crumb). Shell armor stays up while larvae live; an unreachable
 * marker can never be engaged, so `isProgressionLocked` never clears.
 */
export function larvaOffFightGraph(
  player: OccCell,
  larvae: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (larvae.length === 0) return false;
  return larvae.some((larva) => !isOnLarvaBattleGraph(larva, player, ctx));
}

/**
 * Production `getAdjacentTiles` — N, S, W, E, `allTiles`, skip occupied
 * (combatants and existing larvae). Hardcoded 16 in useBossSystem; tests
 * use the live grid size.
 */
export function rawLarvaAdjDests(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
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
 * Production `LARVAE_SPAWN` dest: `randomFrom(adj)`. `pick` is the
 * deterministic stand-in for that roll (clamped onto the live adj list).
 * Returns `null` when every neighbor is blocked — production plants nothing.
 */
export function rawLarvaSpawnDest(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  pick = 0,
): OccCell | null {
  const adj = rawLarvaAdjDests(boss, allTiles, occupied);
  if (adj.length === 0) return null;
  const idx = ((pick % adj.length) + adj.length) % adj.length;
  return adj[idx] ?? null;
}

function larvaMandatory(player: OccCell, ctx: OccupancyContext): Set<string> {
  if (ctx.portals.size === 0) return new Set();
  return collectMandatoryProgressionCells(
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    player,
    ctx.barriers,
  );
}

function acceptLarvaLanding(
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
 * Relocate a larva onto a fight-graph cell the player can walk.
 * Returns `null` when every candidate is a leftover island (caller drops
 * the spawn instead of punching). Unique-corridor cells stay legal when
 * they are already the dest. Occupied cells are allowed for an
 * already-legal dest (contact explode is walkable); snaps use
 * `findNearestFreeCell` so they do not stack, preferring dump.
 */
export function legalizeLarvaLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodLarvaBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptLarvaLanding(cell, player, ctx, battle, placed);
  if (ok(dest)) return { x: dest.x, y: dest.y };
  const avoid = new Set([
    occKey(player.x, player.y),
    ...ctx.portals,
    ...placed,
  ]);
  const radius = progressionSearchRadius(ctx);
  const mandatory = larvaMandatory(player, ctx);
  const dump = findNearestFreeCell(dest, ctx, radius, avoid, (cell) => {
    return ok(cell) && !mandatory.has(occKey(cell.x, cell.y));
  });
  if (dump) return dump;
  return findNearestFreeCell(dest, ctx, radius, avoid, (cell) => ok(cell));
}

/**
 * Snap several larvae off the gate, voids, and leftover crumbs.
 * Drops a dest that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeLarvaLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeLarvaLanding(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

/**
 * Raw adjacent dest, then snap off the portal / void / far crumb.
 * Empty adj (or an unsappable leftover) drops the spawn — unlike
 * ILLUSION_SPLIT, larvae have no origin copy on the boss cell.
 */
export function resolveLarvaeSpawn(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  pick = 0,
): OccCell | null {
  const raw = rawLarvaSpawnDest(boss, allTiles, occupied, pick);
  if (!raw) return null;
  return legalizeLarvaLanding(raw, player, ctx);
}
