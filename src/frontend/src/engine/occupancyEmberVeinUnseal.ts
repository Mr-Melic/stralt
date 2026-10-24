/**
 * Catalog Ember Vein (`WF-HAZ-EMBER_VEIN`) plants 3–6 independent walkable
 * HP-tax floor cells (`extraHazardCount` min 3 max 6) from a `"floor"` raster
 * that skips portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the vein
 * markers. Occupancy floods still walk portals, so leftover-islands stays
 * 0, unique-bridge unseal never runs, and every dest can sit on a far-side
 * leftover CA crumb or a floor-under-void — the −4% max-HP step tax never
 * appears on the fight graph.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker / Creeping Ash helpers (#589–#1023).
 * Those snap units, rewrite walls, raster-scan `SpawnData`, take one
 * occupancy-blind toward-axis orthogonal step, point-reflect, average two
 * bodies, plant impassable voids at Manhattan-2, plant *two* required-step
 * DAMAGE_IMMUNE glyphs, plant a walkable spike at a knight L dest, plant
 * lava at the *origin*, pick the closest orthogonal `floor||portal`
 * neighbor, pick a random orthogonal `!== "wall"` neighbor, take the
 * Chebyshev king corner, plant `activeShockTiles`, plant IllusionData,
 * plant LarvaData, plant 3–4 stealth/trap `glyphedTiles`, plant
 * count-capped adjacent `SpawnData`, plant a 2×2 AP-tax `boardClaimZone`,
 * plant one runtime `voidRiftTile`, plant generate-time lava/ice/spikes
 * from a floor raster that skips the **center 7×7**, plant one impassable
 * `blocksWalk` cell, or plant one contiguous **3-tile orthogonal lane**
 * that then shifts by its heading. This is **independent** catalog
 * extraHazard dests (walkable HP tax, not occupancy, not `hazardTiles`
 * lava/ice/spikes, not a moving lane). `#965` is BOARD_CLAIM (static 2×2).
 * `#970` is Void Rift (one floor cell/turn). `#976` is eligibleHazard
 * (independent dests, skip is grid center, count 1–3 / 3–8). `#1013` is
 * walk-blockers (impassable; unique-corridor snaps off). `#1023` is
 * Creeping Ash (contiguous 3-tile lane + advance). Unique-corridor /
 * destacked-player / occupied dests stay. Drop leftover-island dests
 * rather than punch.
 *
 * Fight-graph snap of each dest. Does not restack occupancy.ts,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * occupancyEligibleHazardUnseal, occupancyBoardClaimUnseal,
 * occupancyVoidRiftUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Ember Vein is 3–6 independent cells. */
export const EMBER_VEIN_COUNT_MIN = 3;
export const EMBER_VEIN_COUNT_MAX = 6;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const EMBER_VEIN_SPAWN_CLEAR = 3;

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
export function floodEmberVeinBattleGraph(
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
      const cur = q.shift();
      if (!cur) break;
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

export function isOnEmberVeinBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodEmberVeinBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `dests` (gate, void, barrier,
 * leftover crumb). The Ember Vein walk tax then never hits the fight graph.
 */
export function emberVeinUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnEmberVeinBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isEmberVeinSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= EMBER_VEIN_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= EMBER_VEIN_SPAWN_CLEAR
  );
}

/**
 * Raw Ember Vein dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawEmberVeinDests(
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
      if (isEmberVeinSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Production `extraHazardRoll` for Ember Vein: `3 + floor(random * 4)` (3–6). */
export function pickEmberVeinCount(rng: () => number): number {
  return (
    EMBER_VEIN_COUNT_MIN +
    Math.floor(rng() * (EMBER_VEIN_COUNT_MAX - EMBER_VEIN_COUNT_MIN + 1))
  );
}

/** Fisher–Yates pick of `count` dests. Catalog plants independent cells. */
export function pickEmberVeinDests(
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

function acceptEmberVeinLanding(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (isEmberVeinSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate an Ember Vein marker onto the fight graph. Returns `null` when
 * the fight graph is empty (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal. Covering a destacked player
 * outside spawn±3 stays legal. Occupied fight-graph cells stay legal (no
 * occupancy filter). Leftover-island dests snap onto the fight graph or
 * drop — they must not punch a join.
 */
export function legalizeEmberVeinPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodEmberVeinBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptEmberVeinLanding(cell, spawn, ctx, battle, placed);
  if (ok(dest)) return { x: dest.x, y: dest.y };
  const maxR = Math.max(1, w + h);
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      const a = { x: dest.x + dx, y: dest.y + dy };
      if (ok(a)) return a;
      if (dy !== 0) {
        const b = { x: dest.x + dx, y: dest.y - dy };
        if (ok(b)) return b;
      }
    }
  }
  return null;
}

/**
 * Snap several Ember Vein dests off leftover crumbs, voids, and the
 * spawn diamond. Drops a dest that cannot legalize. Does not restack
 * occupancy unseal or punch walls.
 */
export function legalizeEmberVeinPlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeEmberVeinPlacement(
      dest,
      player,
      ctx,
      spawn,
      placed,
    );
    if (!snapped) continue;
    placed.add(occKey(snapped.x, snapped.y));
    result.push(snapped);
  }
  return result;
}

/**
 * Raw catalog dests from the occupancy grid, then snap so Ember Vein sits
 * on the fight graph. Empty when the fight graph cannot host a vein.
 */
export function resolveEmberVein(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dests?: readonly OccCell[],
  spawn: OccCell = player,
  existing?: ReadonlySet<string>,
): OccCell[] {
  const raw =
    dests ??
    (rng
      ? pickEmberVeinDests(
          rawEmberVeinDests(ctx, spawn, existing),
          rng,
          pickEmberVeinCount(rng),
        )
      : rawEmberVeinDests(ctx, spawn, existing).slice(0, EMBER_VEIN_COUNT_MIN));
  return legalizeEmberVeinPlacements(raw, player, ctx, spawn);
}
