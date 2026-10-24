/**
 * Catalog `blocksWalk` world features (Crumble Pillar, Fallen Gate, Cinder
 * Barrel, Tide Door, Spent Bridge) plant one impassable floor cell from a
 * `"floor"` raster with **no** occupancy / void / fight-graph check. They
 * skip portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS`, not grid center `WORLD_GRID_SIZE/2`). Occupancy 1+1
 * unseal relocates combatants and cannot lift a pillar on the gate or the
 * only player→exit corridor. Occupancy floods still walk portals, so
 * leftover-islands stays 0, unique-bridge unseal never runs, and a blocker
 * on a far-side leftover CA crumb never appears on the fight graph — the
 * wall occupancy never taxes the route, while `canPlaceWalkBlocker` (overworld
 * `evaluateSolvability`) still accepts that crumb because overworld flood
 * walks through portals. After `applyFinalizedLayout` walls leftover crumbs,
 * those keys stay pointing at walls.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void Rift
 * / eligibleHazard helpers (#589–#976). Those snap units, rewrite walls,
 * raster-scan `SpawnData`, take one occupancy-blind toward-axis orthogonal
 * step, point-reflect, average two bodies, plant impassable voids at
 * Manhattan-2 from the boss, plant *two* required-step DAMAGE_IMMUNE glyphs,
 * plant a walkable spike at a knight L dest, plant lava at the *origin*,
 * pick the closest orthogonal `floor||portal` neighbor, pick a random
 * orthogonal `!== "wall"` neighbor, take the Chebyshev king corner, plant
 * `activeShockTiles`, plant IllusionData, plant LarvaData, plant 3–4
 * stealth/trap `glyphedTiles`, plant count-capped adjacent `SpawnData`,
 * plant a 2×2 AP-tax `boardClaimZone`, plant one runtime `voidRiftTile`, or
 * plant generate-time lava/ice/spikes from a floor raster that skips the
 * **center 7×7**. This is one generate-time / catalog `blocksWalk` cell
 * (impassable wall occupancy, not a walkable HP/MP tax). `#765` is
 * VOID_TILES (Manhattan-2 cardinals, skip is boss-relative). `#976` is
 * eligibleHazard (same floor raster, but walkable tax: unique-corridor
 * stays, covering the player stays, occupied stays, skip is grid center).
 * Unique-corridor landings must NOT stay (unlike lava). Covering the player
 * / an occupied fight-graph cell must NOT stay. Drop leftover-island dests
 * rather than punch. Do not import worldFeatures.ts or mapGen.ts (sibling
 * PRs restack those).
 *
 * Fight-graph snap of each dest. Does not restack occupancy.ts,
 * occupancyEligibleHazardUnseal, occupancyVoidUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, or mapGen.simulate.ts.
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

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const WALK_BLOCKER_SPAWN_CLEAR = 3;

/** Catalog places one `blocksWalk` cell per rolled feature. */
export const WALK_BLOCKER_GENERATE_MIN = 1;
export const WALK_BLOCKER_GENERATE_MAX = 1;

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

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodWalkBlockerBattleGraph(
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

export function isOnWalkBlockerBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodWalkBlockerBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

function withExtraWalkBlockers(
  ctx: OccupancyContext,
  extra: readonly OccCell[],
): OccupancyContext {
  if (extra.length === 0) return ctx;
  const voidTiles = new Set(ctx.voidTiles);
  for (const cell of extra) voidTiles.add(occKey(cell.x, cell.y));
  return { ...ctx, voidTiles };
}

/**
 * True when adding `extra` as occupancy voids (wall occupancy) cuts every
 * player→exit route.
 */
export function walkBlockerSealsProgression(
  player: OccCell,
  extra: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.size === 0) return false;
  const live = withExtraWalkBlockers(ctx, extra);
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
 * True when no dest sits on the fight graph (gate, void, leftover crumb).
 * The wall occupancy then never taxes the battle route.
 */
export function walkBlockerUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnWalkBlockerBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isWalkBlockerSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= WALK_BLOCKER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= WALK_BLOCKER_SPAWN_CLEAR
  );
}

/**
 * Raw catalog dests: row-major `"floor"` cells outside spawn±3. Occupancy
 * `tiles` is `!== "wall"` (floor OR portal); production `=== "floor"` skips
 * the gate. No occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` matches a second `blocksWalk`
 * roll (`Do not place on the same cell as another blocksWalk feature`).
 */
export function rawWalkBlockerDests(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): OccCell[] {
  const dests: OccCell[] = [];
  const { w, h } = gridSize(ctx);
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      if (!ctx.tiles[gy]?.[gx]) continue;
      const k = occKey(gx, gy);
      if (ctx.portals.has(k)) continue;
      if (isWalkBlockerSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog one cell per rolled `blocksWalk` feature. */
export function pickWalkBlockerCount(rng: () => number): number {
  return (
    WALK_BLOCKER_GENERATE_MIN +
    Math.floor(
      rng() * (WALK_BLOCKER_GENERATE_MAX - WALK_BLOCKER_GENERATE_MIN + 1),
    )
  );
}

/** Fisher–Yates pick of `count` dests. */
export function pickWalkBlockerDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number,
): OccCell[] {
  const shuffled = dests.map((c) => ({ x: c.x, y: c.y }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  const n = Math.min(count, shuffled.length);
  return shuffled.slice(0, n);
}

function acceptWalkBlockerLanding(
  cell: OccCell,
  player: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
  reserved: Set<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (k === occKey(player.x, player.y)) return false;
  if (isWalkBlockerSpawnClear(cell.x, cell.y, spawn)) return false;
  if (!battle.has(k)) return false;
  if (reserved.has(k)) return false;
  if (!isCellFree(cell, ctx)) return false;
  return !walkBlockerSealsProgression(player, [{ x: cell.x, y: cell.y }], ctx);
}

/**
 * Relocate a `blocksWalk` cell onto a fight-graph dump cell that still
 * reaches an exit. Returns `null` when every candidate would seal (caller
 * drops the blocker instead of punching a leftover island). Unique-corridor
 * overlap must not stay. Covering the player / an occupied cell must not
 * stay. Leftover-island dests snap onto the fight graph or drop.
 */
export function legalizeWalkBlockerPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  placed: ReadonlySet<string> = new Set(),
  spawn: OccCell = player,
): OccCell | null {
  const battle = floodWalkBlockerBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const reserved = progressionReserved(ctx, player);
  const ok = (cell: OccCell) =>
    acceptWalkBlockerLanding(
      cell,
      player,
      spawn,
      ctx,
      battle,
      placed,
      reserved,
    );
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
 * Snap several catalog blockers off the gate, unique bridges, spawn diamond,
 * occupied cells, and leftover crumbs. Drops a dest that cannot legalize.
 * Does not restack occupancy unseal or punch walls.
 */
export function legalizeWalkBlockerPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  already: ReadonlySet<string> = new Set(),
): OccCell[] {
  const placed = new Set(already);
  const result: OccCell[] = [];
  let live = ctx;
  if (already.size > 0) {
    const prior: OccCell[] = [];
    for (const k of already) {
      const [xs, ys] = k.split(",");
      prior.push({ x: Number(xs), y: Number(ys) });
    }
    live = withExtraWalkBlockers(live, prior);
  }
  for (const dest of dests) {
    const snapped = legalizeWalkBlockerPlacement(
      dest,
      player,
      live,
      placed,
      spawn,
    );
    if (!snapped) continue;
    const k = occKey(snapped.x, snapped.y);
    placed.add(k);
    result.push(snapped);
    live = withExtraWalkBlockers(live, [snapped]);
  }
  return result;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so blockers sit on
 * a non-cut-vertex fight-graph cell. Empty when the fight graph cannot host
 * a wall plant.
 */
export function resolveWalkBlockers(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  existing?: ReadonlySet<string>,
  spawn: OccCell = player,
): OccCell[] {
  const raw =
    dests ??
    (rng
      ? pickWalkBlockerDests(
          rawWalkBlockerDests(ctx, spawn, existing),
          rng,
          pickWalkBlockerCount(rng),
        )
      : rawWalkBlockerDests(ctx, spawn, existing).slice(
          0,
          WALK_BLOCKER_GENERATE_MIN,
        ));
  return legalizeWalkBlockerPlacements(
    raw,
    player,
    ctx,
    spawn,
    existing ?? new Set(),
  );
}
