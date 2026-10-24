/**
 * Catalog Hunting Lantern (`WF-HAZ-HUNT_LANTERN`) plants **one** walkable
 * HP-tax orb (`extraHazardCount` min = max = 1) from a `"floor"` raster
 * that skips portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the orb.
 * Occupancy floods still walk portals, so leftover-islands stays 0, unique-
 * bridge unseal never runs, and the dest can sit on a far-side leftover CA
 * crumb or a floor-under-void — the −5% max-HP landing tax never appears
 * on the fight graph. In battle the occupancy-blind chase then takes **one
 * orthogonal step toward the last MP spender** (dominant axis first) and
 * can hop the gate onto that far crumb. Out of battle / no MP spend stays.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker / Creeping Ash / Ember Vein helpers
 * (#589–#1030). Those snap units, rewrite walls, raster-scan `SpawnData`,
 * take one occupancy-blind toward-axis orthogonal step, point-reflect,
 * average two bodies, plant impassable voids at Manhattan-2, plant *two*
 * required-step DAMAGE_IMMUNE glyphs, plant a walkable spike at a knight L
 * dest, plant lava at the *origin*, pick the closest orthogonal
 * `floor||portal` neighbor, pick a random orthogonal `!== "wall"` neighbor,
 * take the Chebyshev king corner, plant `activeShockTiles`, plant
 * IllusionData, plant LarvaData, plant 3–4 stealth/trap `glyphedTiles`,
 * plant count-capped adjacent `SpawnData`, plant a 2×2 AP-tax
 * `boardClaimZone`, plant one runtime `voidRiftTile`, plant generate-time
 * lava/ice/spikes from a floor raster that skips the **center 7×7**, plant
 * one impassable `blocksWalk` cell, plant one contiguous **3-tile
 * orthogonal lane** that then shifts by its heading, or plant 3–6
 * **independent static** extraHazard dests. This is one **chasing orb**
 * (walkable HP tax, not occupancy, not `hazardTiles` lava/ice/spikes, not
 * a painted lane, not a static scatter). `#859` snaps the *unit* of greedy
 * `moveToward`. `#965` is BOARD_CLAIM (static 2×2). `#970` is Void Rift
 * (one floor cell/turn, no chase). `#976` is eligibleHazard (independent
 * dests, skip is grid center). `#1013` is walk-blockers (impassable;
 * unique-corridor snaps off). `#1023` is Creeping Ash (3-tile lane +
 * painted heading). `#1030` is Ember Vein (3–6 independent static dests).
 * Unique-corridor / destacked-player / occupied dests stay. Drop leftover-
 * island dests rather than punch. Chase onto portal / void / leftover
 * crumb **stays** (drop the step) rather than snap or hop the choke.
 *
 * Fight-graph snap of the origin dest. Does not restack occupancy.ts,
 * occupancyEmberVeinUnseal, occupancyCreepingAshUnseal,
 * occupancyWalkBlockerUnseal, occupancyEligibleHazardUnseal,
 * occupancyBoardClaimUnseal, occupancyVoidRiftUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Hunting Lantern is exactly one cell. */
export const HUNTING_LANTERN_COUNT = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const HUNTING_LANTERN_SPAWN_CLEAR = 3;

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
 */
export function floodHuntingLanternBattleGraph(
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

export function isOnHuntingLanternBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodHuntingLanternBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the orb (gate, void, barrier,
 * leftover crumb). The Hunting Lantern landing tax then never hits the
 * fight graph.
 */
export function huntingLanternUnreachable(
  player: OccCell,
  dest: OccCell | null,
  ctx: OccupancyContext,
): boolean {
  if (!dest) return true;
  return !isOnHuntingLanternBattleGraph(dest, player, ctx);
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isHuntingLanternSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= HUNTING_LANTERN_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= HUNTING_LANTERN_SPAWN_CLEAR
  );
}

/**
 * Raw Hunting Lantern dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawHuntingLanternDests(
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
      if (isHuntingLanternSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog `extraHazardRoll` for Hunting Lantern is always 1. */
export function pickHuntingLanternCount(): number {
  return HUNTING_LANTERN_COUNT;
}

/** Uniform pick of the single orb dest. */
export function pickHuntingLanternDest(
  dests: readonly OccCell[],
  rng: () => number,
): OccCell | null {
  if (dests.length === 0) return null;
  const i = Math.floor(rng() * dests.length);
  const picked = dests[i];
  if (!picked) return null;
  return { x: picked.x, y: picked.y };
}

/**
 * Occupancy-blind chase hop: one orthogonal step toward `target`
 * (dominant Manhattan axis first). Already-on-target or missing target
 * stays. Unlike Creeping Ash this is **not** a painted heading — the
 * last MP spender chooses the facing each round. Unlike `#859` greedy
 * `moveToward` this hops a hazard marker, not a unit, and does not skip
 * occupied neighbors (the orb may land on a body).
 */
export function rawHuntingLanternChaseDest(
  origin: OccCell,
  target: OccCell | null,
): OccCell {
  if (!target) return { x: origin.x, y: origin.y };
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  if (dx === 0 && dy === 0) return { x: origin.x, y: origin.y };
  if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
    return { x: origin.x + (dx > 0 ? 1 : -1), y: origin.y };
  }
  if (dy !== 0) {
    return { x: origin.x, y: origin.y + (dy > 0 ? 1 : -1) };
  }
  return { x: origin.x, y: origin.y };
}

function acceptLanternLanding(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (isHuntingLanternSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate the Hunting Lantern onto the fight graph. Returns `null` when
 * the fight graph is empty (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal. Covering a destacked player
 * outside spawn±3 stays legal. Occupied fight-graph cells stay legal (no
 * occupancy filter). Leftover-island dests snap onto the fight graph or
 * drop — they must not punch a join.
 */
export function legalizeHuntingLanternPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodHuntingLanternBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) => acceptLanternLanding(cell, spawn, ctx, battle);
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
 * Occupancy-blind round-start chase. If the next cell is a portal, spawn
 * diamond, void, or leftover crumb, **drop the step** (stay) rather than
 * snap sideways or hop the choke. Unlike initial placement, chase must
 * not relocate the orb onto a different origin.
 */
export function legalizeHuntingLanternAdvance(
  origin: OccCell,
  target: OccCell | null,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell {
  const next = rawHuntingLanternChaseDest(origin, target);
  const battle = floodHuntingLanternBattleGraph(player, ctx);
  if (acceptLanternLanding(next, spawn, ctx, battle)) {
    return { x: next.x, y: next.y };
  }
  return { x: origin.x, y: origin.y };
}

/**
 * Raw catalog dest from the occupancy grid, then snap so the orb sits on
 * the fight graph. `null` when the fight graph cannot host a lantern.
 */
export function resolveHuntingLantern(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: OccCell,
  spawn: OccCell = player,
  existing?: ReadonlySet<string>,
): OccCell | null {
  const raw =
    dest ??
    (rng
      ? pickHuntingLanternDest(
          rawHuntingLanternDests(ctx, spawn, existing),
          rng,
        )
      : (rawHuntingLanternDests(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizeHuntingLanternPlacement(raw, player, ctx, spawn);
}

/**
 * Round-start chase of a live orb. Stays put when the next step would
 * leave the fight graph, or when no unit spent MP this round.
 */
export function resolveHuntingLanternAdvance(
  origin: OccCell,
  target: OccCell | null,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell {
  return legalizeHuntingLanternAdvance(origin, target, player, ctx, spawn);
}
