/**
 * Catalog Shy Cinder (`WF-HAZ-SHY_CINDER`) plants **one** walkable HP-tax
 * cinder (`extraHazardCount` min = max = 1) from a `"floor"` raster that
 * skips portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the orb.
 * Occupancy floods still walk portals, leftover-islands stays 0, unique-
 * bridge unseal never runs, and the dest can sit on a far-side leftover CA
 * crumb or a floor-under-void — the −5% max-HP landing tax never appears
 * on the fight graph. In battle the occupancy-blind flee then takes **one
 * cardinal step away from the nearest living unit** (the cardinal that
 * increases Chebyshev; ties keep ORTH order E/W/N/S). If every step is
 * blocked or would not increase distance it stays. Out of battle it still
 * flees on wander ticks. Co-located (D = 0) still flees.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swapPositions /
 * ignore-walls / ghost raster / Eternal Pawn advance / Twin Bishop /
 * summoner midpoint / VOID / ANCHOR / SPIKE / LAVA / greedy moveToward /
 * erratic / king-step / SHOCK / ILLUSION / LARVAE / INK_VEIL / adjacent
 * SpawnData / BOARD_CLAIM / Void Rift / eligibleHazard / walk-blocker /
 * Creeping Ash / Ember Vein / Hunting Lantern / Orbiting Cinder / Gutter
 * Steam / Frost Pane / Triune Pads / Spent Bridge / Slipstream / Cinder
 * Barrel / MAP_ROTATE / Latch Gate / Pendulum Censer / Hourglass Arch /
 * Shift Slab / Raise Slab / Ratchet Cog / Turnstile Ember / Twin Sparks /
 * Windrow / Skipping Cinder / Plumb Ember / Rim Cinder helpers
 * (#589–#1327). Those snap units, rewrite walls, plant impassable voids,
 * plant walkable tax, plant one **chasing** orb toward the last MP
 * spender, plant a clockwise **4-cycle square**, plant a 3-tile one-way
 * lane, plant delayed walls after three leaves **or three round-starts**,
 * plant teleports, plant a 1 AP wall **roll**, rewrite every body, plant
 * one unarmed extra portal, plant a **5-tile reverse nave**, plant a
 * two-cell oscillating **wall pair**, plant a 1 AP floor→wall pry, plant
 * a **2-cell adjacent HP-tax swap**, plant a **4-arm plus clockwise
 * rotate**, plant a **4-tile collinear opposite-pair swap**, plant a
 * **2-tile bar that hops onto the parallel pair of a painted 2×2**,
 * plant a **5-tile line whose one cinder hops two tiles and wraps**,
 * plant a **4-tile vertical column whose one cinder falls one tile and
 * wraps**, or plant a **≥ 3×3 outer rim whose one cinder slides one tile
 * clockwise and wraps**. This is a **walkable single orb that steps one
 * tile away from the nearest living body**. `#1038` is Hunting Lantern
 * (toward the last MP spender; co-located stays). `#1071` is Orbiting
 * Cinder (4-cycle square). `#1201` is Pendulum Censer (5-tile reverse).
 * `#1327` is Rim Cinder (outer-ring wrap). Unique-corridor /
 * destacked-player / occupied dests stay. Drop leftover-island dests
 * rather than punch. Flee onto portal / void / leftover crumb **stays**
 * (drop the step). Occupied next cell still flees (landing tax).
 *
 * Fight-graph snap of the origin dest. Does not restack occupancy.ts,
 * occupancyHuntingLanternUnseal, occupancyRimCinderUnseal,
 * occupancyOrbitingCinderUnseal, occupancyPendulumCenserUnseal,
 * occupancyCreepingAshUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, targeting.ts, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Shy Cinder is exactly one cell. */
export const SHY_CINDER_COUNT = 1;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const SHY_CINDER_SPAWN_CLEAR = 3;

/** Catalog landing tax as a fraction of current max HP. */
export const SHY_CINDER_HP_TAX_PCT = 0.05;

export const SHY_CINDER_FEATURE_ID = "WF-HAZ-SHY_CINDER";

/** Catalog flee is one cardinal. */
export const SHY_CINDER_FLEE = 1;

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

export function shyCinderChebyshev(a: OccCell, b: OccCell): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodShyCinderBattleGraph(
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

export function isOnShyCinderBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodShyCinderBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the orb (gate, void, barrier,
 * leftover crumb). The Shy Cinder landing tax then never hits the fight
 * graph.
 */
export function shyCinderUnreachable(
  player: OccCell,
  dest: OccCell | null,
  ctx: OccupancyContext,
): boolean {
  if (!dest) return true;
  return !isOnShyCinderBattleGraph(dest, player, ctx);
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isShyCinderSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= SHY_CINDER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= SHY_CINDER_SPAWN_CLEAR
  );
}

/**
 * Raw Shy Cinder dests: row-major `"floor"` cells outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included. `existing` skips
 * already-budgeted hazard keys (`MAX_HAZARD_TILES`).
 */
export function rawShyCinderDests(
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
      if (isShyCinderSpawnClear(gx, gy, spawn)) continue;
      if (existing?.has(k)) continue;
      dests.push({ x: gx, y: gy });
    }
  }
  return dests;
}

/** Catalog `extraHazardRoll` for Shy Cinder is always 1. */
export function pickShyCinderCount(): number {
  return SHY_CINDER_COUNT;
}

/** Uniform pick of the single orb dest. */
export function pickShyCinderDest(
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
 * Nearest living body in Chebyshev. Ties: smaller Manhattan, then
 * lexicographic `occKey`. Empty roster stays (`null`) so the orb does
 * not invent a heading.
 */
export function pickNearestLiving(
  origin: OccCell,
  bodies: readonly OccCell[],
): OccCell | null {
  let best: OccCell | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  let bestMan = Number.POSITIVE_INFINITY;
  let bestKey = "";
  for (const body of bodies) {
    const d = shyCinderChebyshev(origin, body);
    const man = Math.abs(origin.x - body.x) + Math.abs(origin.y - body.y);
    const k = occKey(body.x, body.y);
    if (
      d < bestD ||
      (d === bestD && man < bestMan) ||
      (d === bestD && man === bestMan && (best === null || k < bestKey))
    ) {
      best = { x: body.x, y: body.y };
      bestD = d;
      bestMan = man;
      bestKey = k;
    }
  }
  return best;
}

/**
 * Occupancy-blind flee hop: one cardinal that **increases** Chebyshev
 * distance to `nearest`. Equal increases keep first-in-ORTH (E, W, N, S)
 * so a co-located orb flees east. Missing nearest stays. Unlike Hunting
 * Lantern (`#1038`) this is **away**, not toward the last MP spender —
 * co-located lantern stays; this orb still steps. Unlike greedy
 * `moveToward` (`#859`) this hops a hazard marker, not a unit, and does
 * not skip occupied neighbors (the orb may land on a body).
 */
export function rawShyCinderFleeDest(
  origin: OccCell,
  nearest: OccCell | null,
): OccCell {
  if (!nearest) return { x: origin.x, y: origin.y };
  const current = shyCinderChebyshev(origin, nearest);
  let best: OccCell | null = null;
  let bestD = current;
  for (const [dx, dy] of ORTH) {
    const next = { x: origin.x + dx, y: origin.y + dy };
    const d = shyCinderChebyshev(next, nearest);
    if (d > bestD) {
      best = next;
      bestD = d;
    }
  }
  return best ?? { x: origin.x, y: origin.y };
}

function acceptShyLanding(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (isShyCinderSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

/**
 * Relocate the Shy Cinder onto the fight graph. Returns `null` when the
 * fight graph is empty (caller drops the hazard instead of punching).
 * Unique-corridor overlap stays legal. Covering a destacked player
 * outside spawn±3 stays legal. Occupied fight-graph cells stay legal (no
 * occupancy filter — landing tax). Leftover-island dests snap onto the
 * fight graph or drop — they must not punch a join.
 */
export function legalizeShyCinderPlacement(
  dest: OccCell,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell | null {
  const { w, h } = gridSize(ctx);
  const battle = floodShyCinderBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const ok = (cell: OccCell) => acceptShyLanding(cell, spawn, ctx, battle);
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
 * Occupancy-blind round-start flee. If the next cell is a portal, spawn
 * diamond, void, or leftover crumb, **drop the step** (stay) rather than
 * snap sideways or hop the choke. Unlike initial placement, flee must
 * not relocate the orb onto a different origin. Occupied next cell still
 * flees — landing tax, not a wall.
 */
export function legalizeShyCinderAdvance(
  origin: OccCell,
  nearest: OccCell | null,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell {
  const next = rawShyCinderFleeDest(origin, nearest);
  const battle = floodShyCinderBattleGraph(player, ctx);
  if (acceptShyLanding(next, spawn, ctx, battle)) {
    return { x: next.x, y: next.y };
  }
  return { x: origin.x, y: origin.y };
}

/**
 * Raw catalog dest from the occupancy grid, then snap so the orb sits on
 * the fight graph. `null` when the fight graph cannot host a cinder.
 */
export function resolveShyCinder(
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
      ? pickShyCinderDest(rawShyCinderDests(ctx, spawn, existing), rng)
      : (rawShyCinderDests(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizeShyCinderPlacement(raw, player, ctx, spawn);
}

/**
 * Round-start flee of a live orb given an already-picked nearest body.
 * Stays put when the next step would leave the fight graph, or when no
 * living unit exists to flee.
 */
export function resolveShyCinderAdvance(
  origin: OccCell,
  nearest: OccCell | null,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell {
  return legalizeShyCinderAdvance(origin, nearest, player, ctx, spawn);
}

/**
 * Apply one round start. Picks the nearest living body from `bodies`,
 * then flees one cardinal if that landing still sits on the fight graph.
 * A dropped hop keeps the current cell so later ticks retry the same
 * legalize instead of punching.
 */
export function resolveShyCinderAfterRoundStart(
  origin: OccCell,
  bodies: readonly OccCell[],
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OccCell {
  const nearest = pickNearestLiving(origin, bodies);
  return legalizeShyCinderAdvance(origin, nearest, player, ctx, spawn);
}
