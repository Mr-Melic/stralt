/**
 * `applyPushback` / `applyAttract` only `slideOffReserved` (unique
 * player→exit bridges). Dual-path 1+1 cuts have an empty unique-bridge
 * set, so a knockback onto the second 1-wide corridor jointly seals the
 * unlocked progression portal with a living summon already on the first.
 *
 * Unique extra vs occupancy.ts unique-bridge slide / dual-path 1+1 unseal
 * (those run only when callers invoke `unsealProgressionOccupants`) and vs
 * destack/wander dump punches and 2+2 joint peel (#589–#656: those no-op
 * when mandatory=0 because every floor counts as dump, and they are not
 * knockback landing).
 *
 * After the occupancy resolver lands, relocate the mover onto a fight-graph
 * cell that restores a player→exit route. Skip leftover-island hops
 * (portals are battle walls). Not imported from occupancy.ts,
 * WorldExploration, or mapGen.simulate.ts — those files 3-way on the
 * oldest-first prefix. Property tests apply the helper after destack/wander.
 * Call after live push/attract when that hunk lands.
 */

import {
  type OccCell,
  type OccupancyContext,
  applyAttract,
  applyPushback,
  collectOccupiedCells,
  findNearestFreeCell,
  occKey,
  occupancyVacating,
  occupantsSealProgression,
  progressionSearchRadius,
  unsealProgressionOccupants,
} from "./occupancy.ts";

const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function gridSize(tiles: boolean[][]): { w: number; h: number } {
  return { h: tiles.length, w: tiles[0]?.length ?? 0 };
}

/**
 * Fight-graph flood from `start` (portals / voids / barriers are walls).
 * Occupants are not walls — dump alcoves must stay legal landings.
 */
export function floodKnockbackBattleGraph(
  ctx: OccupancyContext,
  start: OccCell,
): Set<string> {
  const { w, h } = gridSize(ctx.tiles);
  const walk = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (!ctx.tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (ctx.voidTiles.has(k) || ctx.barriers.has(k) || ctx.portals.has(k)) {
      return false;
    }
    return true;
  };
  const starts: OccCell[] = [];
  if (walk(start.x, start.y)) {
    starts.push(start);
  } else {
    for (const [dx, dy] of DIRS) {
      const nx = start.x + dx;
      const ny = start.y + dy;
      if (walk(nx, ny)) starts.push({ x: nx, y: ny });
    }
  }
  const seen = new Set<string>();
  const q: OccCell[] = [];
  for (const s of starts) {
    const k = occKey(s.x, s.y);
    if (seen.has(k)) continue;
    seen.add(k);
    q.push(s);
  }
  while (q.length > 0) {
    const cur = q.shift()!;
    for (const [dx, dy] of DIRS) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      const k = occKey(nx, ny);
      if (seen.has(k) || !walk(nx, ny)) continue;
      seen.add(k);
      q.push({ x: nx, y: ny });
    }
  }
  return seen;
}

function occupyingLanding(
  ctx: OccupancyContext,
  origin: OccCell,
  landing: OccCell,
): OccupancyContext {
  const vacating = occupancyVacating(ctx, origin);
  return {
    ...vacating,
    isOccupied: (c) => {
      if (c.x === landing.x && c.y === landing.y) return true;
      return vacating.isOccupied(c);
    },
  };
}

function othersOf(ctx: OccupancyContext, mover: OccCell): OccCell[] {
  const mk = occKey(mover.x, mover.y);
  return collectOccupiedCells(ctx).filter((o) => occKey(o.x, o.y) !== mk);
}

/**
 * Relocate a knockback/attract landing that jointly cuts every player→exit
 * route, staying on the fight graph so the mover cannot hop a portal choke
 * onto a leftover CA island.
 */
export function unsealKnockbackLanding(
  origin: OccCell,
  landing: OccCell,
  ctx: OccupancyContext,
): OccCell {
  const start = ctx.progressStart;
  if (!start || ctx.portals.size === 0) return landing;
  const live = occupyingLanding(ctx, origin, landing);
  const [cut] = unsealProgressionOccupants(
    [landing],
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    start,
    live,
  );
  const battle = floodKnockbackBattleGraph(ctx, start);
  const spawnKey = occKey(start.x, start.y);
  const onGraph = (cell: OccCell) => {
    const k = occKey(cell.x, cell.y);
    if (k === spawnKey || ctx.portals.has(k)) return false;
    return battle.size === 0 || battle.has(k);
  };
  const staticOccupants = othersOf(live, cut);
  const trialSeals = (cell: OccCell) =>
    occupantsSealProgression(
      ctx.tiles,
      ctx.voidTiles,
      ctx.portals,
      start,
      [...staticOccupants, cell],
      ctx.barriers,
    );
  if (onGraph(cut) && !trialSeals(cut)) return cut;
  const vacating = occupancyVacating(live, cut);
  const found = findNearestFreeCell(
    cut,
    vacating,
    progressionSearchRadius(vacating),
    new Set([spawnKey, ...[...ctx.portals]]),
    (cell) => onGraph(cell) && !trialSeals(cell),
  );
  return found ?? cut;
}

/** Apply occupancy pushback, then unseal a dual-path joint cut. */
export function applyPushbackUnsealing(
  target: OccCell,
  from: OccCell,
  distance: number,
  ctx: OccupancyContext,
): OccCell {
  const landed = applyPushback(target, from, distance, ctx);
  return unsealKnockbackLanding(target, landed, ctx);
}

/** Apply occupancy attraction, then unseal a dual-path joint cut. */
export function applyAttractUnsealing(
  target: OccCell,
  toward: OccCell,
  distance: number,
  ctx: OccupancyContext,
): OccCell {
  const landed = applyAttract(target, toward, distance, ctx);
  return unsealKnockbackLanding(target, landed, ctx);
}
