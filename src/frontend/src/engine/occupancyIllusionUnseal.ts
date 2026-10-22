/**
 * Void Grandmaster `ILLUSION_SPLIT` plants IllusionData copies from
 * `getAdjacentTiles` (`allTiles` = floor OR portal, occupancy-blind for
 * portals). The first two orthogonal neighbors become fakes; `realIndex`
 * can pick the boss cell, the gate, or — after a `tilesForBossAI`
 * `moveToward` hop sits the unit on the portal — the far-side leftover CA
 * crumb. Occupancy 1+1 unseal relocates combatants and cannot move
 * illusion markers (`isOccupied` never sees `bossState.illusions`).
 * Occupancy floods still walk portals, so leftover-islands stays 0,
 * unique-bridge unseal never runs, and a *real* copy on the gate or far
 * crumb never appears on the fight graph — clearing never unlocks.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop reflection / summoner
 * midpoint / VOID_TILES / ANCHOR_TILES / SPIKE_ON_LAND / LAVA_TRAIL /
 * greedy `moveToward` / erratic / Chebyshev king-step / SHOCK_TILES
 * helpers (#589–#896). Those snap units onto already-walkable fight-graph
 * cells, rewrite walls, raster-spawn `SpawnData` minions, take one
 * occupancy-blind toward-axis orthogonal step, point-reflect, average two
 * bodies, plant impassable voids at Manhattan-2, plant required-step
 * glyphs, plant a walkable spike at a knight L dest, plant walkable lava
 * at the *origin*, pick the closest orthogonal `floor||portal` neighbor,
 * pick a random orthogonal `!== "wall"` neighbor, take the Chebyshev king
 * corner, or plant `activeShockTiles` at the moveToward origin. This is
 * IllusionData (not SpawnData, not ShockTile, not glyphedTiles) whose
 * `isReal` copy is the only legal hit; `#711` / `#732` snap `SpawnData`
 * that occupancy can see. Unique-corridor landings stay legal — copies on
 * an already-walkable fight-graph cell do not need a punch.
 *
 * Fight-graph snap onto a walkable cell; drop leftover-island dests rather
 * than punch. Prefer dump when snapping so occupancy unseal is not needed.
 * Does not restack occupancy.ts, occupancyShockUnseal, occupancyAdvanceUnseal,
 * occupancyBossSpawnUnseal, WorldExploration, useBossSystem, or
 * mapGen.simulate.ts.
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
export function tilesForIllusionAi(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodIllusionBattleGraph(
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

export function isOnIllusionBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodIllusionBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the real copy is off the fight graph (gate, void, barrier, or
 * leftover crumb). Fakes on leftover islands are decoys; a *real* copy
 * there can never be engaged, so `isProgressionLocked` never clears.
 */
export function illusionRealOffFightGraph(
  player: OccCell,
  copies: readonly OccCell[],
  realIndex: number,
  ctx: OccupancyContext,
): boolean {
  if (copies.length === 0) return true;
  const idx = Math.max(0, Math.min(copies.length - 1, realIndex));
  const real = copies[idx];
  if (!real) return true;
  return !isOnIllusionBattleGraph(real, player, ctx);
}

/**
 * Production `getAdjacentTiles` — N, S, W, E, `allTiles`, skip occupied.
 * Hardcoded 16 in useBossSystem; tests use the live grid size.
 */
export function rawIllusionAdjDests(
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
 * Production `ILLUSION_SPLIT` positions: the boss cell plus the first two
 * orthogonal `allTiles` neighbors. `realIndex` 0..2 picks which copy is
 * real (clamped to the live list length at resolve time).
 */
export function rawIllusionSplitDests(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
): OccCell[] {
  const fakes = rawIllusionAdjDests(boss, allTiles, occupied).slice(0, 2);
  return [{ x: boss.x, y: boss.y }, ...fakes];
}

function illusionMandatory(
  player: OccCell,
  ctx: OccupancyContext,
): Set<string> {
  if (ctx.portals.size === 0) return new Set();
  return collectMandatoryProgressionCells(
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    player,
    ctx.barriers,
  );
}

function acceptIllusionLanding(
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
 * Relocate an illusion onto a fight-graph cell the player can walk.
 * Returns `null` when every candidate is a leftover island (caller drops
 * the copy instead of punching). Unique-corridor cells stay legal when
 * they are already the dest. Occupied cells are allowed for an
 * already-legal dest (the real copy often stays on the boss); snaps use
 * `findNearestFreeCell` so they do not stack, preferring dump.
 */
export function legalizeIllusionLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodIllusionBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptIllusionLanding(cell, player, ctx, battle, placed);
  if (ok(dest)) return { x: dest.x, y: dest.y };
  const avoid = new Set([
    occKey(player.x, player.y),
    ...ctx.portals,
    ...placed,
  ]);
  const radius = progressionSearchRadius(ctx);
  const mandatory = illusionMandatory(player, ctx);
  const dump = findNearestFreeCell(dest, ctx, radius, avoid, (cell) => {
    return ok(cell) && !mandatory.has(occKey(cell.x, cell.y));
  });
  if (dump) return dump;
  return findNearestFreeCell(dest, ctx, radius, avoid, (cell) => ok(cell));
}

/**
 * Snap several illusion copies off the gate, voids, and leftover crumbs.
 * Drops a dest that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeIllusionLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeIllusionLanding(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

export interface IllusionSplitResult {
  positions: OccCell[];
  realIndex: number;
}

/**
 * Raw split dests, then snap every copy off the portal / void / far crumb.
 * Guarantees a real copy on the fight graph when any legal cell exists:
 * an empty snap list keeps the legalized boss origin so `realIndex` cannot
 * point at a dropped leftover. `realIndex` is clamped to the live list.
 */
export function resolveIllusionSplit(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  realIndex = 0,
): IllusionSplitResult {
  const raw = rawIllusionSplitDests(boss, allTiles, occupied);
  let positions = legalizeIllusionLandings(raw, player, ctx);
  if (positions.length === 0) {
    const origin = legalizeIllusionLanding(boss, player, ctx);
    if (origin) positions = [origin];
  }
  if (positions.length === 0) {
    return { positions: [], realIndex: 0 };
  }
  const idx = Math.max(0, Math.min(positions.length - 1, realIndex));
  return { positions, realIndex: idx };
}
