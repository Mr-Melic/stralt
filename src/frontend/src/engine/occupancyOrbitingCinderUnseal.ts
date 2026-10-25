/**
 * Catalog Orbiting Cinder (`WF-HAZ-ORBIT_CINDER`) plants **one** walkable
 * HP-tax orb (`extraHazardCount` min = max = 1) that occupies one cell of a
 * painted **4-tile clockwise square** and steps one cell clockwise at each
 * round start. Placement is a `"floor"` raster of 2×2 runs that skips
 * portals and Chebyshev ≤ 3 from the **legalized spawn**
 * (`SPAWN_SAFE_RADIUS` / `isTileReservedForSpawnOrPortal`, not grid center
 * `WORLD_GRID_SIZE/2`) with **no** occupancy / void / fight-graph check.
 * Occupancy 1+1 unseal relocates combatants and cannot move the orb.
 * Occupancy floods still walk portals, so leftover-islands stays 0, unique-
 * bridge unseal never runs, and the whole 2×2 can sit on a far-side leftover
 * CA crumb or a floor-under-void — the −5% max-HP landing tax never appears
 * on the fight graph. The occupancy-blind clockwise hop then visits that
 * far crumb even when the current orb cell was still on the fight graph.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker / Creeping Ash / Ember Vein /
 * Hunting Lantern helpers (#589–#1038). Those snap units, rewrite walls,
 * raster-scan `SpawnData`, take one occupancy-blind toward-axis orthogonal
 * step, point-reflect, average two bodies, plant impassable voids at
 * Manhattan-2, plant *two* required-step DAMAGE_IMMUNE glyphs, plant a
 * walkable spike at a knight L dest, plant lava at the *origin*, pick the
 * closest orthogonal `floor||portal` neighbor, pick a random orthogonal
 * `!== "wall"` neighbor, take the Chebyshev king corner, plant
 * `activeShockTiles`, plant IllusionData, plant LarvaData, plant 3–4
 * stealth/trap `glyphedTiles`, plant count-capped adjacent `SpawnData`,
 * plant a 2×2 AP-tax `boardClaimZone`, plant one runtime `voidRiftTile`,
 * plant generate-time lava/ice/spikes from a floor raster that skips the
 * **center 7×7**, plant one impassable `blocksWalk` cell, plant one
 * contiguous **3-tile orthogonal lane** that then shifts by its heading,
 * plant 3–6 **independent static** extraHazard dests, or plant **one
 * chasing orb** that hops toward the last MP spender. This is one **closed
 * 4-cycle square** (walkable HP tax, not occupancy, not `hazardTiles`
 * lava/ice/spikes, not a painted linear lane, not a static scatter, not a
 * chase). `#859` snaps the *unit* of greedy `moveToward`. `#965` is
 * BOARD_CLAIM (static 2×2 AP tax, row-major cells, at-least-one steppable,
 * no spawn±3 skip). `#970` is Void Rift (one floor cell/turn, no orbit).
 * `#976` is eligibleHazard (independent dests, skip is grid center).
 * `#1013` is walk-blockers (impassable; unique-corridor snaps off).
 * `#1023` is Creeping Ash (3-tile lane + painted heading). `#1030` is Ember
 * Vein (3–6 independent static dests). `#1038` is Hunting Lantern (one
 * chasing orb, dominant-axis hop). Unique-corridor / destacked-player /
 * occupied dests stay. Drop leftover-island squares rather than punch.
 * Clockwise onto portal / void / leftover crumb **stays** (drop the step)
 * rather than snap or hop the choke. All four painted cells must be
 * fight-graph floor — unlike BOARD_CLAIM a single steppable corner is not
 * enough, because the orb will visit every corner.
 *
 * Fight-graph snap of the 2×2 origin (keep orb index). Does not restack
 * occupancy.ts, occupancyHuntingLanternUnseal, occupancyEmberVeinUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * occupancyEligibleHazardUnseal, occupancyBoardClaimUnseal,
 * occupancyVoidRiftUnseal, WorldExploration, worldFeatures.ts,
 * useBossSystem, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Orbiting Cinder is exactly one orb. */
export const ORBITING_CINDER_COUNT = 1;

/** Painted track is a 2×2 / 4-cell clockwise square. */
export const ORBITING_CINDER_SQUARE_SIZE = 4;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const ORBITING_CINDER_SPAWN_CLEAR = 3;

/**
 * Clockwise corners from the NW origin, y-down screen space:
 * NW → NE → SE → SW. Distinct from BOARD_CLAIM row-major
 * (NW, NE, SW, SE).
 */
export const ORBITING_CINDER_CLOCKWISE: ReadonlyArray<
  readonly [number, number]
> = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

export interface OrbitingCinder {
  origin: OccCell;
  /** 0..3 index into `ORBITING_CINDER_CLOCKWISE`. */
  orbIndex: number;
}

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

export function clampOrbitingCinderIndex(index: number): number {
  const n = ORBITING_CINDER_SQUARE_SIZE;
  return ((index % n) + n) % n;
}

export function cloneOrbitingCinder(square: OrbitingCinder): OrbitingCinder {
  return {
    origin: { x: square.origin.x, y: square.origin.y },
    orbIndex: clampOrbitingCinderIndex(square.orbIndex),
  };
}

/** Four painted cells in clockwise order from `origin`. */
export function orbitingCinderCells(origin: OccCell): OccCell[] {
  return ORBITING_CINDER_CLOCKWISE.map(([dx, dy]) => ({
    x: origin.x + dx,
    y: origin.y + dy,
  }));
}

/** The live orb cell. Catalog extraHazard budget is this one tile. */
export function orbitingCinderOrb(square: OrbitingCinder): OccCell {
  const cells = orbitingCinderCells(square.origin);
  const i = clampOrbitingCinderIndex(square.orbIndex);
  const cell = cells[i] ?? cells[0];
  return { x: cell.x, y: cell.y };
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodOrbitingCinderBattleGraph(
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

export function isOnOrbitingCinderBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodOrbitingCinderBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the orb (gate, void, barrier,
 * leftover crumb). The Orbiting Cinder landing tax then never hits the
 * fight graph.
 */
export function orbitingCinderUnreachable(
  player: OccCell,
  square: OrbitingCinder | null,
  ctx: OccupancyContext,
): boolean {
  if (!square) return true;
  return !isOnOrbitingCinderBattleGraph(orbitingCinderOrb(square), player, ctx);
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isOrbitingCinderSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= ORBITING_CINDER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= ORBITING_CINDER_SPAWN_CLEAR
  );
}

/**
 * Raw Orbiting Cinder squares: every 2×2 of occupancy-walkable cells
 * outside spawn±3. Occupancy `tiles` is `!== "wall"` (floor OR portal);
 * production `=== "floor"` skips any square that includes the gate. No
 * occupancy / void / fight-graph check — leftover crumbs and
 * floor-under-void are included. `existing` skips already-budgeted hazard
 * keys (`MAX_HAZARD_TILES`).
 */
export function rawOrbitingCinderSquares(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): OrbitingCinder[] {
  const dests: OrbitingCinder[] = [];
  const { w, h } = gridSize(ctx);
  const maxX = w - 2;
  const maxY = h - 2;
  if (maxX < 0 || maxY < 0) return dests;
  for (let gy = 0; gy <= maxY; gy++) {
    for (let gx = 0; gx <= maxX; gx++) {
      const origin = { x: gx, y: gy };
      const cells = orbitingCinderCells(origin);
      if (!cells.every((c) => inGrid(c, w, h))) continue;
      if (!cells.every((c) => ctx.tiles[c.y]?.[c.x])) continue;
      if (cells.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
      if (cells.some((c) => isOrbitingCinderSpawnClear(c.x, c.y, spawn))) {
        continue;
      }
      if (existing && cells.some((c) => existing.has(occKey(c.x, c.y)))) {
        continue;
      }
      dests.push({ origin, orbIndex: 0 });
    }
  }
  return dests;
}

/** Catalog `extraHazardRoll` for Orbiting Cinder is always 1. */
export function pickOrbitingCinderCount(): number {
  return ORBITING_CINDER_COUNT;
}

/** Uniform pick of the 2×2 origin, then a uniform clockwise orb index. */
export function pickOrbitingCinderSquare(
  squares: readonly OrbitingCinder[],
  rng: () => number,
): OrbitingCinder | null {
  if (squares.length === 0) return null;
  const i = Math.floor(rng() * squares.length);
  const picked = squares[i];
  if (!picked) return null;
  const orbIndex = Math.floor(rng() * ORBITING_CINDER_SQUARE_SIZE);
  return {
    origin: { x: picked.origin.x, y: picked.origin.y },
    orbIndex: clampOrbitingCinderIndex(orbIndex),
  };
}

/**
 * Occupancy-blind clockwise hop on the painted square. Unlike Hunting
 * Lantern this is **not** a chase toward the last MP spender — the
 * facing is the closed 4-cycle. Unlike Creeping Ash this does not
 * translate the painted cells.
 */
export function rawOrbitingCinderAdvance(
  square: OrbitingCinder,
): OrbitingCinder {
  return {
    origin: { x: square.origin.x, y: square.origin.y },
    orbIndex: clampOrbitingCinderIndex(square.orbIndex + 1),
  };
}

function acceptCinderCell(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (isOrbitingCinderSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptCinderSquare(
  square: OrbitingCinder,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const cells = orbitingCinderCells(square.origin);
  if (cells.length !== ORBITING_CINDER_SQUARE_SIZE) return false;
  return cells.every((cell) => acceptCinderCell(cell, spawn, ctx, battle));
}

/**
 * Relocate the painted 2×2 onto the fight graph so **every** corner is
 * steppable. Returns `null` when the fight graph cannot host a 2×2
 * (caller drops the hazard instead of punching). Unique-corridor overlap
 * stays legal. Covering a destacked player outside spawn±3 stays legal.
 * Occupied fight-graph cells stay legal (no occupancy filter). Leftover-
 * island dests snap onto the fight graph or drop — they must not punch a
 * join. Unlike BOARD_CLAIM, one steppable cell of four is not enough.
 */
export function legalizeOrbitingCinderSquare(
  dest: OrbitingCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OrbitingCinder | null {
  const battle = floodOrbitingCinderBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const orbIndex = clampOrbitingCinderIndex(dest.orbIndex);
  const ok = (origin: OccCell) =>
    acceptCinderSquare({ origin, orbIndex }, spawn, ctx, battle);
  if (ok(dest.origin)) {
    return { origin: { x: dest.origin.x, y: dest.origin.y }, orbIndex };
  }
  const { w, h } = gridSize(ctx);
  const maxR = Math.max(1, w + h);
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      const a = { x: dest.origin.x + dx, y: dest.origin.y + dy };
      if (ok(a)) return { origin: a, orbIndex };
      if (dy !== 0) {
        const b = { x: dest.origin.x + dx, y: dest.origin.y - dy };
        if (ok(b)) return { origin: b, orbIndex };
      }
    }
  }
  return null;
}

/**
 * Occupancy-blind round-start clockwise step. If the next corner is a
 * portal, spawn diamond, void, or leftover crumb, **drop the step** (stay)
 * rather than snap the square sideways or hop the choke. Unlike initial
 * placement, advance must not relocate the painted square onto a different
 * origin.
 */
export function legalizeOrbitingCinderAdvance(
  square: OrbitingCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OrbitingCinder {
  const next = rawOrbitingCinderAdvance(square);
  const battle = floodOrbitingCinderBattleGraph(player, ctx);
  if (acceptCinderCell(orbitingCinderOrb(next), spawn, ctx, battle)) {
    return next;
  }
  return cloneOrbitingCinder(square);
}

/**
 * Raw catalog square from the occupancy grid, then snap so all four
 * corners sit on the fight graph. `null` when the fight graph cannot
 * host a 2×2.
 */
export function resolveOrbitingCinder(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: OrbitingCinder,
  spawn: OccCell = player,
  existing?: ReadonlySet<string>,
): OrbitingCinder | null {
  const raw =
    dest ??
    (rng
      ? pickOrbitingCinderSquare(
          rawOrbitingCinderSquares(ctx, spawn, existing),
          rng,
        )
      : (rawOrbitingCinderSquares(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizeOrbitingCinderSquare(raw, player, ctx, spawn);
}

/**
 * Round-start clockwise step of a live orb. Stays put when the next
 * corner would leave the fight graph.
 */
export function resolveOrbitingCinderAdvance(
  square: OrbitingCinder,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): OrbitingCinder {
  return legalizeOrbitingCinderAdvance(square, player, ctx, spawn);
}
