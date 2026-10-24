/**
 * Catalog Creeping Ash (`WF-HAZ-CREEP_MIST`) plants a 3-tile walkable HP-tax
 * cloud on a painted orthogonal lane (`extraHazardCount` min = max = 3) and
 * then **advances one tile along that heading at round start**, with **no**
 * occupancy / void / fight-graph check. Placement skips portals and
 * Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS` /
 * `isTileReservedForSpawnOrPortal`, not grid center `WORLD_GRID_SIZE/2`).
 * Occupancy 1+1 unseal relocates combatants and cannot move the cloud.
 * Occupancy floods still walk portals, so leftover-islands stays 0, unique-
 * bridge unseal never runs, and a 3-tile crumb on the far side of a portal
 * choke never appears on the fight graph — the −6% max-HP end-turn tax
 * never lands on the player route. The occupancy-blind advance then slides
 * the window onto the gate or that far crumb in one step.
 *
 * Unique extra vs occupancy.ts 1+1 unseal (walks portals) and vs destack /
 * wander dump / choke / 2+2 peel / knockback / swap / ignore-walls / ghost
 * raster / Eternal Pawn advance / Twin Bishop / summoner midpoint / VOID /
 * ANCHOR / SPIKE / LAVA / greedy moveToward / erratic / king-step / SHOCK /
 * ILLUSION / LARVAE / INK_VEIL / adjacent SpawnData / BOARD_CLAIM / Void
 * Rift / eligibleHazard / walk-blocker helpers (#589–#1013). Those snap
 * units, rewrite walls, raster-scan `SpawnData`, take one occupancy-blind
 * toward-axis orthogonal step, point-reflect, average two bodies, plant
 * impassable voids at Manhattan-2, plant *two* required-step DAMAGE_IMMUNE
 * glyphs, plant a walkable spike at a knight L dest, plant lava at the
 * *origin*, pick the closest orthogonal `floor||portal` neighbor, pick a
 * random orthogonal `!== "wall"` neighbor, take the Chebyshev king corner,
 * plant `activeShockTiles`, plant IllusionData, plant LarvaData, plant 3–4
 * stealth/trap `glyphedTiles`, plant count-capped adjacent `SpawnData`,
 * plant a 2×2 AP-tax `boardClaimZone`, plant one runtime `voidRiftTile`,
 * plant generate-time lava/ice/spikes from a floor raster that skips the
 * **center 7×7**, or plant one impassable `blocksWalk` cell. This is one
 * contiguous **3-tile orthogonal lane** that then **shifts by its heading**
 * (walkable HP tax, not occupancy, not `hazardTiles` scatter, not 2×2
 * BOARD_CLAIM, not 1-cell Void Rift, not 1-cell walk-blocker). `#965` is
 * BOARD_CLAIM (static 2×2 AP tax, no heading). `#970` is Void Rift (one
 * floor cell per player turn). `#976` is eligibleHazard (independent dests,
 * skip is grid center). `#1013` is walk-blockers (impassable; unique-
 * corridor must snap off). Unique-corridor landings stay legal (walkable
 * tax; unlike VOID / walk-blockers they must not punch the only exit).
 * Covering a destacked player outside spawn±3 stays legal. Occupied fight-
 * graph cells stay legal (no occupancy filter). Catalog forbids covering
 * spawn or the only portal. Drop leftover-island lanes rather than punch.
 * Advance onto portal / void / leftover crumb **stays** (drop the step)
 * rather than snap or hop the choke.
 *
 * Fight-graph snap of the 3-cell origin (keep heading). Does not restack
 * occupancy.ts, occupancyWalkBlockerUnseal, occupancyEligibleHazardUnseal,
 * occupancyBoardClaimUnseal, occupancyVoidRiftUnseal, WorldExploration,
 * worldFeatures.ts, useBossSystem, or mapGen.simulate.ts.
 */

import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";

/** Catalog `extraHazardCount` for Creeping Ash is exactly 3 contiguous cells. */
export const CREEPING_ASH_LANE_LENGTH = 3;

/** Catalog `isTileReservedForSpawnOrPortal` Chebyshev ≤ 3 from legalized spawn. */
export const CREEPING_ASH_SPAWN_CLEAR = 3;

export interface CreepingAshHeading {
  dx: number;
  dy: number;
}

/** Cardinal headings. Production paints one orthogonal lane. */
export const CREEPING_ASH_HEADINGS: readonly CreepingAshHeading[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

export interface CreepingAshLane {
  cells: OccCell[];
  heading: CreepingAshHeading;
}

const ORTH: ReadonlyArray<[number, number]> = [
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

function cloneHeading(heading: CreepingAshHeading): CreepingAshHeading {
  return { dx: heading.dx, dy: heading.dy };
}

function cloneLane(lane: CreepingAshLane): CreepingAshLane {
  return {
    cells: lane.cells.map((c) => ({ x: c.x, y: c.y })),
    heading: cloneHeading(lane.heading),
  };
}

/**
 * Battle-walkable island containing `start`. Portals / voids / barriers /
 * walls are cuts — the same contract as destack `floodOriginComponent`.
 */
export function floodCreepingAshBattleGraph(
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

export function isOnCreepingAshBattleGraph(
  cell: OccCell,
  start: OccCell,
  ctx: OccupancyContext,
): boolean {
  if (ctx.portals.has(occKey(cell.x, cell.y))) return false;
  return floodCreepingAshBattleGraph(start, ctx).has(occKey(cell.x, cell.y));
}

/**
 * True when the player cannot step on any of the 3 lane cells (gate, void,
 * leftover crumb). The end-turn HP tax then never hits the fight graph.
 */
export function creepingAshUnreachable(
  player: OccCell,
  lane: CreepingAshLane | null,
  ctx: OccupancyContext,
): boolean {
  if (!lane || lane.cells.length === 0) return true;
  return !lane.cells.some((cell) =>
    isOnCreepingAshBattleGraph(cell, player, ctx),
  );
}

/** Production `|hx - spawn.x| <= 3 && |hy - spawn.y| <= 3`. */
export function isCreepingAshSpawnClear(
  x: number,
  y: number,
  spawn: OccCell,
): boolean {
  return (
    Math.abs(x - spawn.x) <= CREEPING_ASH_SPAWN_CLEAR &&
    Math.abs(y - spawn.y) <= CREEPING_ASH_SPAWN_CLEAR
  );
}

/** Three cells from `origin` along `heading` (trailing → lead). */
export function creepingAshLaneCells(
  origin: OccCell,
  heading: CreepingAshHeading,
): OccCell[] {
  const cells: OccCell[] = [];
  for (let i = 0; i < CREEPING_ASH_LANE_LENGTH; i++) {
    cells.push({
      x: origin.x + heading.dx * i,
      y: origin.y + heading.dy * i,
    });
  }
  return cells;
}

/** Occupancy-blind window shift: every cell + heading. */
export function creepingAshAdvanceCells(lane: CreepingAshLane): OccCell[] {
  return lane.cells.map((c) => ({
    x: c.x + lane.heading.dx,
    y: c.y + lane.heading.dy,
  }));
}

/** Lead cell after one occupancy-blind step (can be portal / crumb / void). */
export function rawCreepingAshAdvanceLead(lane: CreepingAshLane): OccCell {
  const last = lane.cells[lane.cells.length - 1] ?? lane.cells[0];
  return {
    x: last.x + lane.heading.dx,
    y: last.y + lane.heading.dy,
  };
}

function inGrid(cell: OccCell, w: number, h: number): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < w && cell.y < h;
}

/**
 * Raw Creeping Ash lanes: every 3-cell orthogonal floor run outside spawn±3.
 * Occupancy `tiles` is `!== "wall"` (floor OR portal); production `===
 * "floor"` skips the gate. No occupancy / void / fight-graph check —
 * leftover crumbs and floor-under-void are included.
 */
export function rawCreepingAshLanes(
  ctx: OccupancyContext,
  spawn: OccCell,
): CreepingAshLane[] {
  const dests: CreepingAshLane[] = [];
  const { w, h } = gridSize(ctx);
  for (const heading of CREEPING_ASH_HEADINGS) {
    for (let gy = 0; gy < h; gy++) {
      for (let gx = 0; gx < w; gx++) {
        const cells = creepingAshLaneCells({ x: gx, y: gy }, heading);
        if (!cells.every((c) => inGrid(c, w, h))) continue;
        if (!cells.every((c) => ctx.tiles[c.y]?.[c.x])) continue;
        if (cells.some((c) => ctx.portals.has(occKey(c.x, c.y)))) continue;
        if (cells.some((c) => isCreepingAshSpawnClear(c.x, c.y, spawn))) {
          continue;
        }
        dests.push({ cells, heading: cloneHeading(heading) });
      }
    }
  }
  return dests;
}

/** Uniform pick from the raw raster. */
export function pickCreepingAshLane(
  lanes: readonly CreepingAshLane[],
  rng: () => number,
): CreepingAshLane | null {
  if (lanes.length === 0) return null;
  const i = Math.floor(rng() * lanes.length);
  const picked = lanes[i];
  if (!picked) return null;
  return cloneLane(picked);
}

function acceptAshCell(
  cell: OccCell,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  const { w, h } = gridSize(ctx);
  if (!inGrid(cell, w, h)) return false;
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (isCreepingAshSpawnClear(cell.x, cell.y, spawn)) return false;
  if (ctx.voidTiles.has(k) || ctx.barriers.has(k)) return false;
  if (!ctx.tiles[cell.y]?.[cell.x]) return false;
  return battle.has(k);
}

function acceptAshLane(
  lane: CreepingAshLane,
  spawn: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
): boolean {
  if (lane.cells.length !== CREEPING_ASH_LANE_LENGTH) return false;
  return lane.cells.every((cell) => acceptAshCell(cell, spawn, ctx, battle));
}

/**
 * Relocate a 3-tile cloud onto a fight-graph run that keeps `heading`.
 * Returns `null` when the fight graph cannot host 3 contiguous cells
 * (caller drops the feature instead of punching). Unique-corridor overlap
 * stays legal. Occupied fight-graph cells stay legal. Leftover-island dests
 * snap onto the fight graph or drop.
 */
export function legalizeCreepingAshLane(
  dest: CreepingAshLane,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): CreepingAshLane | null {
  const battle = floodCreepingAshBattleGraph(player, ctx);
  if (battle.size === 0) return null;
  const heading = cloneHeading(dest.heading);
  const origin = dest.cells[0];
  if (!origin) return null;
  const ok = (start: OccCell) =>
    acceptAshLane(
      { cells: creepingAshLaneCells(start, heading), heading },
      spawn,
      ctx,
      battle,
    );
  if (ok(origin)) {
    return {
      cells: creepingAshLaneCells(origin, heading),
      heading,
    };
  }
  const { w, h } = gridSize(ctx);
  const maxR = Math.max(1, w + h);
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      const a = { x: origin.x + dx, y: origin.y + dy };
      if (ok(a)) {
        return { cells: creepingAshLaneCells(a, heading), heading };
      }
      if (dy !== 0) {
        const b = { x: origin.x + dx, y: origin.y - dy };
        if (ok(b)) {
          return { cells: creepingAshLaneCells(b, heading), heading };
        }
      }
    }
  }
  return null;
}

/**
 * Occupancy-blind round-start advance. If the next 3-cell window covers a
 * portal, spawn diamond, void, or leftover crumb, **drop the step** (stay)
 * rather than snap sideways or hop the choke. Unlike initial placement,
 * advance must not relocate the painted lane onto a different origin.
 */
export function legalizeCreepingAshAdvance(
  lane: CreepingAshLane,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): CreepingAshLane {
  const next: CreepingAshLane = {
    cells: creepingAshAdvanceCells(lane),
    heading: cloneHeading(lane.heading),
  };
  const battle = floodCreepingAshBattleGraph(player, ctx);
  if (acceptAshLane(next, spawn, ctx, battle)) return next;
  return cloneLane(lane);
}

/**
 * Raw catalog lane from the occupancy grid, then snap so the 3-cell cloud
 * sits on the fight graph. `null` when the fight graph cannot host a lane.
 */
export function resolveCreepingAsh(
  player: OccCell,
  ctx: OccupancyContext,
  rng?: () => number,
  dest?: CreepingAshLane,
  spawn: OccCell = player,
): CreepingAshLane | null {
  const raw =
    dest ??
    (rng
      ? pickCreepingAshLane(rawCreepingAshLanes(ctx, spawn), rng)
      : (rawCreepingAshLanes(ctx, spawn)[0] ?? null));
  if (!raw) return null;
  return legalizeCreepingAshLane(raw, player, ctx, spawn);
}

/**
 * Round-start window shift of a live cloud. Stays put when the next step
 * would leave the fight graph.
 */
export function resolveCreepingAshAdvance(
  lane: CreepingAshLane,
  player: OccCell,
  ctx: OccupancyContext,
  spawn: OccCell = player,
): CreepingAshLane {
  return legalizeCreepingAshAdvance(lane, player, ctx, spawn);
}
