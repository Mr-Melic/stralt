/**
 * `SPAWN_MINIONS` / `SPLIT_ROOKS` / `SCROLL_SUMMON` / `PHANTOM_SPAWN` plant
 * `SpawnData` from `getAdjacentTiles` (`allTiles` = floor OR portal,
 * occupancy-blind for portals). After a `tilesForBossAI` `moveToward` hop
 * sits the boss on the gate, N/S/W/E neighbors include the portal and a
 * far-side leftover CA crumb. Occupancy 1+1 unseal relocates combatants it
 * can see, but occupancy floods still walk portals, so leftover-islands
 * stays 0, unique-bridge unseal never runs, and a required minion on the
 * gate or far crumb never appears on the fight graph — clearing never
 * unlocks.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL helpers (#589–#925). Those snap units,
 * rewrite walls, raster-scan `SpawnData` from (0,0), take one occupancy-blind
 * toward-axis orthogonal step (`ADVANCE_PER_TURN`), point-reflect, average
 * two bodies, plant impassable voids at Manhattan-2, plant required-step
 * glyphs, plant a walkable spike at a knight L dest, plant lava at the
 * *origin*, pick the closest orthogonal `floor||portal` neighbor, pick a
 * random orthogonal `!== "wall"` neighbor, take the Chebyshev king corner,
 * plant `activeShockTiles`, plant IllusionData, plant LarvaData, or plant
 * 3–4 stealth/trap `glyphedTiles`. This is count-capped adjacent `SpawnData`
 * (first-N for minions/scrolls/split, `randomFrom` for one phantom) — not
 * `#711` full-board raster, not `#732` `rawAdvanceDest` / generic
 * `legalizeAdjacentMinionLandings` (do not restack occupancyAdvanceUnseal).
 * Unique-corridor landings stay legal (occupancy can still slide a living
 * minion off a unique bridge once unseal is wired). Drop leftover-island
 * dests rather than punch.
 *
 * Fight-graph snap; prefer dump so occupancy unseal is not needed. Does not
 * restack occupancy.ts, occupancyBossSpawnUnseal, occupancyAdvanceUnseal,
 * occupancyLarvaUnseal, occupancyInkVeilUnseal, WorldExploration,
 * useBossSystem, or mapGen.simulate.ts.
 */

import {
  type OccCell,
  type OccupancyContext,
  collectMandatoryProgressionCells,
  findNearestFreeCell,
  isCellFree,
  occKey,
  progressionSearchRadius,
} from "./occupancy.ts";

/** Production C6 cap: 19 enemies including the boss, 20 with the player. */
export const ADJACENT_SPAWN_ENEMY_CAP = 19;

/** Production `SPLIT_ROOKS` plants at most two adjacent rooks. */
export const SPLIT_ROOKS_SPAWN_COUNT = 2;

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
export function tilesForAdjacentSpawnAi(tiles: string[][]): boolean[][] {
  return tiles.map((row) =>
    (row ?? []).map((t) => t === "floor" || t === "portal"),
  );
}

export function remainingAdjacentSpawnSlots(currentEnemyCount: number): number {
  return Math.max(0, ADJACENT_SPAWN_ENEMY_CAP - currentEnemyCount);
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodAdjacentSpawnBattleGraph(
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

export function isOnAdjacentSpawnBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodAdjacentSpawnBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when any minion is off the fight graph (gate, void, barrier, or
 * leftover crumb). Required SpawnData cannot be engaged there, so
 * `isProgressionLocked` never clears.
 */
export function adjacentSpawnOffFightGraph(
  player: OccCell,
  spawns: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (spawns.length === 0) return false;
  return spawns.some(
    (cell) => !isOnAdjacentSpawnBattleGraph(cell, player, ctx),
  );
}

/**
 * Production `getAdjacentTiles` — N, S, W, E, `allTiles`, skip occupied.
 * Hardcoded 16 in useBossSystem; tests use the live grid size.
 */
export function rawAdjacentSpawnAdjDests(
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

function capAdjacentDests(
  dests: readonly OccCell[],
  count: number,
  currentEnemyCount: number,
): OccCell[] {
  const maxNew = remainingAdjacentSpawnSlots(currentEnemyCount);
  if (maxNew === 0 || count <= 0) return [];
  const n = Math.min(count, dests.length, maxNew);
  return dests.slice(0, n).map((c) => ({ x: c.x, y: c.y }));
}

/** `SPAWN_MINIONS`: first `count` N/S/W/E dests, C6-capped. */
export function rawSpawnMinionsDests(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
  count: number,
  currentEnemyCount = 0,
): OccCell[] {
  return capAdjacentDests(
    rawAdjacentSpawnAdjDests(boss, allTiles, occupied),
    count,
    currentEnemyCount,
  );
}

/** `SPLIT_ROOKS`: first two adjacent dests, C6-capped. */
export function rawSplitRooksDests(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  currentEnemyCount = 0,
): OccCell[] {
  return capAdjacentDests(
    rawAdjacentSpawnAdjDests(boss, allTiles, occupied),
    SPLIT_ROOKS_SPAWN_COUNT,
    currentEnemyCount,
  );
}

/** `SCROLL_SUMMON`: same first-N adjacent scan as `SPAWN_MINIONS`. */
export function rawScrollSummonDests(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
  count: number,
  currentEnemyCount = 0,
): OccCell[] {
  return rawSpawnMinionsDests(
    boss,
    allTiles,
    occupied,
    count,
    currentEnemyCount,
  );
}

/**
 * Production `PHANTOM_SPAWN` dest: `randomFrom(adj)`. `pick` is the
 * deterministic stand-in for that roll (clamped onto the live adj list).
 * Returns `null` when every neighbor is blocked or the C6 cap is full.
 */
export function rawPhantomSpawnDest(
  boss: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  pick = 0,
  currentEnemyCount = 0,
): OccCell | null {
  if (remainingAdjacentSpawnSlots(currentEnemyCount) === 0) return null;
  const adj = rawAdjacentSpawnAdjDests(boss, allTiles, occupied);
  if (adj.length === 0) return null;
  const idx = ((pick % adj.length) + adj.length) % adj.length;
  return adj[idx] ?? null;
}

function spawnMandatory(player: OccCell, ctx: OccupancyContext): Set<string> {
  if (ctx.portals.size === 0) return new Set();
  return collectMandatoryProgressionCells(
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    player,
    ctx.barriers,
  );
}

function acceptAdjacentSpawnLanding(
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
  if (!isCellFree(cell, ctx)) return false;
  return true;
}

/**
 * Relocate a minion onto a fight-graph cell the player can engage.
 * Returns `null` when every candidate is a leftover island (caller drops
 * the spawn instead of punching). Unique-corridor cells stay legal when
 * they are already the dest. Snaps prefer dump so occupancy unseal is
 * not needed, and never stack.
 */
export function legalizeAdjacentSpawnLanding(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const battle = floodAdjacentSpawnBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptAdjacentSpawnLanding(cell, player, ctx, battle, placed);
  if (ok(dest)) return { x: dest.x, y: dest.y };
  const avoid = new Set([
    occKey(player.x, player.y),
    ...ctx.portals,
    ...placed,
  ]);
  const radius = progressionSearchRadius(ctx);
  const mandatory = spawnMandatory(player, ctx);
  const dump = findNearestFreeCell(dest, ctx, radius, avoid, (cell) => {
    return ok(cell) && !mandatory.has(occKey(cell.x, cell.y));
  });
  if (dump) return dump;
  return findNearestFreeCell(dest, ctx, radius, avoid, (cell) => ok(cell));
}

/**
 * Snap several adjacent minions off the gate, voids, and leftover crumbs.
 * Drops a dest that cannot legalize. Does not restack occupancy unseal or
 * punch walls.
 */
export function legalizeAdjacentSpawnLandings(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeAdjacentSpawnLanding(dest, player, ctx, placed);
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
  }
  return result;
}

export function resolveSpawnMinions(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
  count: number,
  currentEnemyCount = 0,
): OccCell[] {
  return legalizeAdjacentSpawnLandings(
    rawSpawnMinionsDests(boss, allTiles, occupied, count, currentEnemyCount),
    player,
    ctx,
  );
}

export function resolveSplitRooks(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  currentEnemyCount = 0,
): OccCell[] {
  return legalizeAdjacentSpawnLandings(
    rawSplitRooksDests(boss, allTiles, occupied, currentEnemyCount),
    player,
    ctx,
  );
}

export function resolveScrollSummon(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
  count: number,
  currentEnemyCount = 0,
): OccCell[] {
  return legalizeAdjacentSpawnLandings(
    rawScrollSummonDests(boss, allTiles, occupied, count, currentEnemyCount),
    player,
    ctx,
  );
}

export function resolvePhantomSpawn(
  boss: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  allTiles: boolean[][],
  occupied: readonly OccCell[] = [],
  pick = 0,
  currentEnemyCount = 0,
): OccCell | null {
  const raw = rawPhantomSpawnDest(
    boss,
    allTiles,
    occupied,
    pick,
    currentEnemyCount,
  );
  if (!raw) return null;
  return legalizeAdjacentSpawnLanding(raw, player, ctx);
}
