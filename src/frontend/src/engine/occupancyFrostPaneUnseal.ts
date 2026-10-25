/**
 * Catalog Frost Pane (`WF-TER-FROST_PANE`) plants **one** walkable LoS-block
 * cell (catalog mechanic is singular; `extraHazardCount` is omitted so
 * `extraHazardRoll` would plant nothing) from a `"floor"` raster that skips
 * portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the pane.
 * Occupancy floods still walk portals, so leftover-islands stays 0, unique-
 * bridge unseal never runs, and the dest can sit on a far-side leftover CA
 * crumb or a floor-under-void — the LoS wall never appears on the fight
 * graph. Linear / Attack Nearest engagement on the player island is
 * unchanged; smash (adjacent 1 AP) stays optional because walk occupancy
 * is floor.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker / Creeping Ash / Ember Vein /
 * Hunting Lantern / Orbiting Cinder / Gutter Steam helpers (#589–#1086).
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
 * `blocksWalk` cell, plant one contiguous **3-tile orthogonal lane** that
 * then shifts by its heading, plant 3–6 **independent always-on**
 * extraHazard dests, plant **one chasing orb**, plant one **closed 4-cycle
 * square**, or plant **two independent even/odd vents**. This is **one
 * walkable LoS wall** (floor for occupancy, wall for Bresenham; smash is
 * optional 1 AP — not occupancy, not `hazardTiles`, not HP/AP tax, not a
 * painted lane, not a chase, not a 2×2). `#965` is BOARD_CLAIM (static
 * 2×2 AP tax). `#970` is Void Rift (one floor cell/turn, walk HP tax).
 * `#976` is eligibleHazard (independent dests, skip is grid center).
 * `#1013` is walk-blockers (impassable; unique-corridor snaps off).
 * `#1023` is Creeping Ash. `#1030` is Ember Vein (3–6 HP-tax dests).
 * `#1038` is Hunting Lantern. `#1071` is Orbiting Cinder. `#1086` is
 * Gutter Steam (two even/odd vents). Unique-corridor / destacked-player /
 * occupied dests stay (walkable; smash optional). Drop leftover-island
 * dests rather than punch.
 *
 * Fight-graph snap of the dest. Does not restack occupancy.ts,
 * occupancyGutterSteamUnseal, occupancyOrbitingCinderUnseal,
 * occupancyHuntingLanternUnseal, occupancyEmberVeinUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * occupancyEligibleHazardUnseal, occupancyBoardClaimUnseal,
 * occupancyVoidRiftUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog mechanic is one sheet. `extraHazardCount` is omitted (roll = 0). */
export const FROST_PANE_COUNT = 1;

/** Catalog smash is an adjacent occupancy action, not a spell. */
export const FROST_PANE_SMASH_AP = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const FROST_PANE_SPAWN_CLEAR = 3;

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

function inGrid(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 * Frost Pane markers are **not** cuts (walk occupancy is floor).
 */
export function floodFrostPaneBattleGraph(
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

export function isOnFrostPaneBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodFrostPaneBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of `dests` (gate, void, barrier,
 * leftover crumb). The Frost Pane LoS wall then never hits the fight graph.
 */
export function frostPaneUnreachable(
  player: OccCell,
  dests: readonly OccCell[],
  ctx: OccupancyContext,
): boolean {
  if (dests.length === 0) return true;
  return !dests.some((cell) => isOnFrostPaneBattleGraph(cell, player, ctx));
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isFrostPaneSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= FROST_PANE_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= FROST_PANE_SPAWN_CLEAR
  );
}

/**
 * Bresenham LoS with Frost Pane cells counted as walls. Intermediate walls
 * and barriers block; origin / dest / void / portals do not — the same
 * contract as `hasBresenhamLoS` plus pane keys. Does not restack
 * targeting.ts.
 */
export function hasFrostPaneLos(
  from: OccCell,
  to: OccCell,
  ctx: OccupancyContext,
  panes: readonly OccCell[],
): boolean {
  const paneKeys = new Set(panes.map((p) => occKey(p.x, p.y)));
  let cx = from.x;
  let cy = from.y;
  const ddx = Math.abs(to.x - cx);
  const ddy = Math.abs(to.y - cy);
  const sx = cx < to.x ? 1 : -1;
  const sy = cy < to.y ? 1 : -1;
  let err = ddx - ddy;
  while (true) {
    if ((cx !== from.x || cy !== from.y) && (cx !== to.x || cy !== to.y)) {
      if (!ctx.tiles[cy]?.[cx]) return false;
      const k = occKey(cx, cy);
      if (ctx.barriers.has(k)) return false;
      if (paneKeys.has(k)) return false;
    }
    if (cx === to.x && cy === to.y) break;
    const e2 = 2 * err;
    if (e2 > -ddy) {
      err -= ddy;
      cx += sx;
    }
    if (e2 < ddx) {
      err += ddx;
      cy += sy;
    }
  }
  return true;
}

/**
 * True when a pane sits on a fight-graph ray and cuts LoS that was open
 * without it. Leftover-island panes return false — they never tax the
 * player island.
 */
export function frostPaneCutsFightGraphLos(
  from: OccCell,
  to: OccCell,
  ctx: OccupancyContext,
  panes: readonly OccCell[],
): boolean {
  if (!isOnFrostPaneBattleGraph(from, from, ctx)) return false;
  if (!isOnFrostPaneBattleGraph(to, from, ctx)) return false;
  if (!hasFrostPaneLos(from, to, ctx, [])) return false;
  return !hasFrostPaneLos(from, to, ctx, panes);
}

/** Adjacent smash: Manhattan 1, 1 AP, optional. Diagonal does not smash. */
export function canSmashFrostPane(actor: OccCell, pane: OccCell): boolean {
  return Math.abs(actor.x - pane.x) + Math.abs(actor.y - pane.y) === 1;
}

export function smashFrostPane(
  panes: readonly OccCell[],
  pane: OccCell,
): OccCell[] {
  const k = occKey(pane.x, pane.y);
  return panes.filter((p) => occKey(p.x, p.y) !== k);
}

/**
 * Raw Frost Pane dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawFrostPaneDests(
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
      if (isFrostPaneSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog plants exactly one sheet. */
export function pickFrostPaneCount(): number {
  return FROST_PANE_COUNT;
}

/** Fisher–Yates pick of `count` dests. Catalog plants one independent cell. */
export function pickFrostPaneDests(
  dests: readonly OccCell[],
  rng: () => number,
  count: number = FROST_PANE_COUNT,
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

function acceptFrostPaneLanding(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  placed: ReadonlySet<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (placed.has(k)) return false;
  if (ctx.portals.has(k)) return false;
  if (isFrostPaneSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate a Frost Pane onto the fight graph. Returns `null` when the
 * fight graph is empty (caller drops the pane instead of punching).
 * Unique-corridor overlap stays legal (walkable LoS wall; smash optional).
 * Covering a destacked player outside spawn±3 stays legal. Occupied
 * fight-graph cells stay legal (no occupancy filter). Leftover-island
 * dests snap onto the fight graph or drop — they must not punch a join.
 */
export function legalizeFrostPanePlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
  placed: ReadonlySet<string> = new Set(),
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodFrostPaneBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) =>
    acceptFrostPaneLanding(cell, spawn, ctx, battle, placed);
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
 * Snap several Frost Pane dests off leftover crumbs, voids, and the spawn
 * diamond. Drops a dest that cannot legalize. Does not restack occupancy
 * unseal or punch walls.
 */
export function legalizeFrostPanePlacements(
  dests: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell[] {
  const placed = new Set<string>();
  const result: OccCell[] = [];
  for (const dest of dests) {
    const snapped = legalizeFrostPanePlacement(
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
 * Raw catalog dests from the occupancy grid, then snap so Frost Pane sits
 * on the fight graph. Empty when the fight graph cannot host a pane.
 */
export function resolveFrostPane(
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
      ? pickFrostPaneDests(
          rawFrostPaneDests(ctx, spawn, existing),
          rng,
          pickFrostPaneCount(),
        )
      : rawFrostPaneDests(ctx, spawn, existing).slice(0, FROST_PANE_COUNT));
  return legalizeFrostPanePlacements(
    raw.slice(0, pickFrostPaneCount()),
    player,
    ctx,
    spawn,
  );
}
