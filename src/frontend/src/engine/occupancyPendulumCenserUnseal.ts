/**
 * Catalog Pendulum Censer (`WF-HAZ-PENDULUM_CENSER`) plants **one** walkable
 * HP-tax orb (`extraHazardCount` min = max = 1) that occupies one cell of a
 * painted **5-tile nave line** and steps one cell along that line at each
 * round start, **reversing at the ends**. Placement is a `"floor"` raster of
 * 5-cell orthogonal runs that skips portals and Chebyshev ≤ 3 from the
 * **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`)
 * with **no** occupancy / void / fight-graph check. Occupancy 1+1 unseal
 * relocates combatants and cannot move the censer. Occupancy floods still
 * walk portals, so leftover-islands stays 0, unique-bridge unseal never
 * runs, and the whole nave can sit on a far-side leftover CA crumb or a
 * floor-under-void — the −5% max-HP landing tax never appears on the fight
 * graph. The occupancy-blind reverse-step then visits that far crumb even
 * when the current censer cell was still on the fight graph.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker / Creeping Ash / Ember Vein /
 * Hunting Lantern / Orbiting Cinder / Gutter Steam / Frost Pane / Triune
 * Pads / Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE / Latch
 * Gate helpers (#589–#1174). Those snap units, rewrite walls, raster-scan
 * `SpawnData`, take one occupancy-blind toward-axis orthogonal step,
 * point-reflect, average two bodies, plant impassable voids at
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
 * plant 3–6 **independent static** extraHazard dests, plant **one chasing
 * orb**, plant a **clockwise 4-cycle square**, plant two independent
 * even/odd vents, plant one walkable LoS wall, plant a 3-pad carousel,
 * plant a delayed floor→wall after three leaves, plant a one-way A→B
 * pair, plant a 1 AP wall roll, rewrite every body with a 90° / flip, or
 * plant one extra sealed portal that is not an exit until armed. This is
 * one **5-tile nave that reverses at the ends** (walkable HP tax, not
 * occupancy, not `hazardTiles` lava/ice/spikes, not a 3-tile one-way
 * cloud, not a 2×2 clockwise square, not a chase, not a delayed wall, not
 * an unarmed portal). `#1023` is Creeping Ash (3-tile lane + painted
 * heading, no reverse). `#1038` is Hunting Lantern (chase toward last MP
 * spender). `#1071` is Orbiting Cinder (closed 4-cycle square; wrap, not
 * reverse). `#1086` is Gutter Steam (two independent even/odd vents).
 * `#1103` is Triune Pads (1→2→3 carousel). `#1127` is Spent Bridge
 * (3-leave delayed wall). `#1174` is Latch Gate (unarmed floor→portal).
 * Unique-corridor / destacked-player / occupied dests stay. Drop leftover-
 * island naves rather than punch. Reverse onto portal / void / leftover
 * crumb **stays** (drop the step) rather than snap or hop the choke. All
 * five painted cells must be fight-graph floor — unlike BOARD_CLAIM
 * at-least-one, because the censer will visit every cell.
 *
 * Fight-graph snap of the 5-cell origin (keep heading / index / dir). Does
 * not restack occupancy.ts, occupancyLatchGateUnseal,
 * occupancyMapRotateUnseal, occupancyCinderBarrelUnseal,
 * occupancySlipstreamUnseal, occupancySpentBridgeUnseal,
 * occupancyTriunePadsUnseal, occupancyFrostPaneUnseal,
 * occupancyGutterSteamUnseal, occupancyOrbitingCinderUnseal,
 * occupancyHuntingLanternUnseal, occupancyEmberVeinUnseal,
 * occupancyCreepingAshUnseal, occupancyWalkBlockerUnseal,
 * WorldExploration, worldFeatures.ts, useBossSystem, or
 * mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Pendulum Censer is exactly one orb. */
export const PENDULUM_CENSER_COUNT = 1;

/** Painted nave is a 5-cell orthogonal line. */
export const PENDULUM_CENSER_NAVE_LENGTH = 5;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const PENDULUM_CENSER_SPAWN_CLEAR = 3;

export type PendulumCenserDir = 1 | -1;

export interface PendulumCenserHeading {
  dx: number;
  dy: number;
}

/**
 * East and south only. A 5-cell nave that reverses is the same physical
 * line as its opposite heading, unlike Creeping Ash's one-way cloud.
 */
export const PENDULUM_CENSER_HEADINGS: readonly PendulumCenserHeading[] = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
];

export interface PendulumCenser {
  origin: OccCell;
  heading: PendulumCenserHeading;
  /** 0..4 index along `heading` from `origin`. */
  index: number;
  /** Current swing along `heading`. Reverses at either end. */
  dir: PendulumCenserDir;
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

export function clampPendulumCenserIndex(index: number): number {
  const n = PENDULUM_CENSER_NAVE_LENGTH;
  if (index < 0) return 0;
  if (index > n - 1) return n - 1;
  return index;
}

export function clampPendulumCenserDir(dir: number): PendulumCenserDir {
  return dir < 0 ? -1 : 1;
}

export function clonePendulumCenserHeading(
  heading: PendulumCenserHeading,
): PendulumCenserHeading {
  return { dx: heading.dx, dy: heading.dy };
}

export function clonePendulumCenser(nave: PendulumCenser): PendulumCenser {
  return {
    origin: { x: nave.origin.x, y: nave.origin.y },
    heading: clonePendulumCenserHeading(nave.heading),
    index: clampPendulumCenserIndex(nave.index),
    dir: clampPendulumCenserDir(nave.dir),
  };
}

/** Five painted cells from `origin` along `heading`. */
export function pendulumCenserCells(
  origin: OccCell,
  heading: PendulumCenserHeading,
): OccCell[] {
  const cells: OccCell[] = [];
  for (let i = 0; i < PENDULUM_CENSER_NAVE_LENGTH; i++) {
    cells.push({
      x: origin.x + heading.dx * i,
      y: origin.y + heading.dy * i,
    });
  }
  return cells;
}

/** The live censer cell. Catalog extraHazard budget is this one tile. */
export function pendulumCenserOrb(nave: PendulumCenser): OccCell {
  const cells = pendulumCenserCells(nave.origin, nave.heading);
  const i = clampPendulumCenserIndex(nave.index);
  const cell = cells[i] ?? cells[0];
  return { x: cell.x, y: cell.y };
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodPendulumCenserBattleGraph(
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

export function isOnPendulumCenserBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodPendulumCenserBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on the censer (gate, void, barrier,
 * leftover crumb). The Pendulum Censer landing tax then never hits the
 * fight graph.
 */
export function pendulumCenserUnreachable(
  player: OccCell,
  nave: PendulumCenser | null,
  ctx: OccupancyContext,
): boolean {
  if (!nave) return true;
  return !isOnPendulumCenserBattleGraph(pendulumCenserOrb(nave), player, ctx);
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isPendulumCenserSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= PENDULUM_CENSER_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= PENDULUM_CENSER_SPAWN_CLEAR
  );
}

/**
 * Raw Pendulum Censer naves: every 5-cell orthogonal floor run outside
 * spawn±3. Occupancy `tiles` is `!== "wall"` (floor OR portal); production
 * `=== "floor"` skips any nave that includes the gate. No occupancy /
 * void / fight-graph check — leftover crumbs and floor-under-void are
 * included. `existing` skips already-budgeted hazard keys
 * (`MAX_HAZARD_TILES`).
 */
export function rawPendulumCenserNaves(
  ctx: OccupancyContext,
  spawn: OccCell,
  existing?: ReadonlySet<string>,
): PendulumCenser[] {
  const dests: PendulumCenser[] = [];
  const { w, h } = gridSize(ctx);
  for (const heading of PENDULUM_CENSER_HEADINGS) {
    for (let gy = 0; gy < h; gy++) {
      for (let gx = 0; gx < w; gx++) {
        const origin = { x: gx, y: gy };
        const cells = pendulumCenserCells(origin, heading);
        if (!cells.every((c) => inGrid(c, w, h))) continue;
        if (!cells.every((c) => ctx.tiles[c.y]?.[c.x])) continue;
        if (cells.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
        if (cells.some((c) => isPendulumCenserSpawnClear(c.x, c.y, spawn))) {
          continue;
        }
        if (existing && cells.some((c) => existing.has(occKey(c.x, c.y)))) {
          continue;
        }
        dests.push({
          origin,
          heading: clonePendulumCenserHeading(heading),
          index: 0,
          dir: 1,
        });
      }
    }
  }
  return dests;
}

/** Catalog `extraHazardRoll` for Pendulum Censer is always 1. */
export function pickPendulumCenserCount(): number {
  return PENDULUM_CENSER_COUNT;
}

/** Uniform pick of the 5-cell nave, then a uniform index and swing dir. */
export function pickPendulumCenserNave(
  naves: readonly PendulumCenser[],
  rng: () => number,
): PendulumCenser | null {
  if (naves.length === 0) return null;
  const i = Math.floor(rng() * naves.length);
  const picked = naves[i];
  if (!picked) return null;
  const index = Math.floor(rng() * PENDULUM_CENSER_NAVE_LENGTH);
  const dir: PendulumCenserDir = rng() < 0.5 ? -1 : 1;
  return {
    origin: { x: picked.origin.x, y: picked.origin.y },
    heading: clonePendulumCenserHeading(picked.heading),
    index: clampPendulumCenserIndex(index),
    dir,
  };
}

/**
 * Occupancy-blind reverse-step on the painted nave. Unlike Hunting Lantern
 * this is **not** a chase toward the last MP spender. Unlike Creeping Ash
 * this does not translate the painted cells. Unlike Orbiting Cinder this
 * **reverses at the ends** instead of wrapping to index 0.
 */
export function rawPendulumCenserAdvance(nave: PendulumCenser): PendulumCenser {
  const index = clampPendulumCenserIndex(nave.index);
  const dir = clampPendulumCenserDir(nave.dir);
  let nextIndex = index + dir;
  let nextDir = dir;
  if (nextIndex < 0 || nextIndex > PENDULUM_CENSER_NAVE_LENGTH - 1) {
    nextDir = dir < 0 ? 1 : -1;
    nextIndex = index + nextDir;
  }
  return {
    origin: { x: nave.origin.x, y: nave.origin.y },
    heading: clonePendulumCenserHeading(nave.heading),
    index: clampPendulumCenserIndex(nextIndex),
    dir: nextDir,
  };
}

function acceptCenserCell(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (isPendulumCenserSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptCenserNave(
  nave: PendulumCenser,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const cells = pendulumCenserCells(nave.origin, nave.heading);
  if (cells.length !== PENDULUM_CENSER_NAVE_LENGTH) return false;
  return cells.every((cell) => acceptCenserCell(cell, spawn, ctx, battle));
}

/**
 * Relocate the painted 5-cell nave onto the fight graph so **every** cell
 * is steppable. Returns `null` when the fight graph cannot host a 5-cell
 * run (caller drops the hazard instead of punching). Unique-corridor
 * overlap stays legal. Covering a destacked player outside spawn±3 stays
 * legal. Occupied fight-graph cells stay legal (no occupancy filter).
 * Leftover-island dests snap onto the fight graph or drop — they must not
 * punch a join. Unlike BOARD_CLAIM, one steppable cell of five is not
 * enough.
 */
export function legalizePendulumCenserNave(
  dest: PendulumCenser,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): PendulumCenser | null {
  const battle = floodPendulumCenserBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const heading = clonePendulumCenserHeading(dest.heading);
  const index = clampPendulumCenserIndex(dest.index);
  const dir = clampPendulumCenserDir(dest.dir);
  const ok = (origin: OccCell) =>
    acceptCenserNave({ origin, heading, index, dir }, spawn, ctx, battle);
  if (ok(dest.origin)) {
    return {
      origin: { x: dest.origin.x, y: dest.origin.y },
      heading,
      index,
      dir,
    };
  }
  const { w, h } = gridSize(ctx);
  const maxR = Math.max(1, w + h);
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      const a = { x: dest.origin.x + dx, y: dest.origin.y + dy };
      if (ok(a)) return { origin: a, heading, index, dir };
      if (dy !== 0) {
        const b = { x: dest.origin.x + dx, y: dest.origin.y - dy };
        if (ok(b)) return { origin: b, heading, index, dir };
      }
    }
  }
  return null;
}

/**
 * Occupancy-blind round-start reverse-step. If the next cell is a portal,
 * spawn diamond, void, or leftover crumb, **drop the step** (stay) rather
 * than snap the nave sideways or hop the choke. Unlike initial placement,
 * advance must not relocate the painted nave onto a different origin.
 */
export function legalizePendulumCenserAdvance(
  nave: PendulumCenser,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): PendulumCenser {
  const next = rawPendulumCenserAdvance(nave);
  const battle = floodPendulumCenserBattleGraph(player, ctx);
  if (acceptCenserCell(pendulumCenserOrb(next), spawn, ctx, battle)) {
    return next;
  }
  return clonePendulumCenser(nave);
}

/**
 * Raw catalog nave from the occupancy grid, then snap so all five cells
 * sit on the fight graph. `null` when the fight graph cannot host a 5-cell
 * run.
 */
export function resolvePendulumCenser(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: PendulumCenser,
  spawn: OccCell = player,
  existing?: ReadonlySet<string>,
): PendulumCenser | null {
  const raw =
    dest ??
    (rng
      ? pickPendulumCenserNave(
          rawPendulumCenserNaves(ctx, spawn, existing),
          rng,
        )
      : (rawPendulumCenserNaves(ctx, spawn, existing)[0] ?? null));
  if (!raw) return null;
  return legalizePendulumCenserNave(raw, player, ctx, spawn);
}

/**
 * Round-start reverse-step of a live censer. Stays put when the next cell
 * would leave the fight graph.
 */
export function resolvePendulumCenserAdvance(
  nave: PendulumCenser,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): PendulumCenser {
  return legalizePendulumCenserAdvance(nave, player, ctx, spawn);
}
