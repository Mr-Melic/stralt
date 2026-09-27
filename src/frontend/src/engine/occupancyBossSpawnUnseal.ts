/**
 * Ghost / scroll / phantom raster and TELEPORT_ADJACENT build a walkable
 * grid that treats portal tiles as floor (`tilesForBossAI`: floor OR
 * portal). Overworld flood walks through that gate, so far-side floors
 * are not leftover CA islands (`evaluateSolvability` leftover-islands
 * stays 0). Battle walk does not. Raster from (0,0) then parks a
 * required minion off the fight graph — `isProgressionLocked` never
 * clears because the unit cannot be engaged.
 *
 * Unique extra vs occupancy.ts unique-bridge relocate / dual-path 1+1
 * unseal (those run only when callers invoke `unsealProgressionOccupants`,
 * and occupancy floods still walk portal tiles — sliding a unique-bridge
 * landing onto a far crumb) and vs destack/wander dump punches, choke-
 * pocket snap, 2+2 joint peel, knockback landing, two-body swap, and
 * Chessboard Lich ignore-walls rewrite
 * (#589/#600/#603/#608/#628/#648/#651/#656/#688/#697/#704: destack
 * stays on the fight graph; rotate/mirror/leap land on walls). This
 * pass is already-walkable far-side floors plus portal-as-walkable
 * adjacent.
 *
 * Snap each spawn onto a fight-graph floor (portals are battle walls).
 * Prefer a non-unique-bridge dump cell so occupancy unseal is not
 * needed. Skip leftover-island joins. Not imported from occupancy.ts,
 * WorldExploration, useBossSystem, or mapGen.simulate.ts — those files
 * 3-way on the oldest-first prefix. Property tests apply the helper
 * after destack. Call after live ghost/minion spawn when that hunk
 * lands.
 */

import {
  type OccCell,
  type OccupancyContext,
  findNearestFreeCell,
  isCellFree,
  occKey,
  progressionReserved,
  progressionSearchRadius,
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

function floodFrom(
  start: OccCell,
  walk: (x: number, y: number) => boolean,
): Set<string> {
  const seen = new Set<string>();
  if (!walk(start.x, start.y)) return seen;
  const q: OccCell[] = [start];
  seen.add(occKey(start.x, start.y));
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

/**
 * Fight-graph flood from `start` (portals / voids / barriers are walls).
 * Occupants are not walls — dump alcoves must stay legal landings.
 * A portal-tile origin expands to the largest adjacent floor island.
 */
export function floodBossSpawnBattleGraph(
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
  let best = new Set<string>();
  const seen = new Set<string>();
  for (const s of starts) {
    const sk = occKey(s.x, s.y);
    if (seen.has(sk)) continue;
    const component = floodFrom(s, walk);
    for (const k of component) seen.add(k);
    if (component.size > best.size) best = component;
  }
  return best;
}

function occupyingCells(
  ctx: OccupancyContext,
  cells: OccCell[],
  start?: OccCell,
): OccupancyContext {
  const taken = new Set(cells.map((c) => occKey(c.x, c.y)));
  return {
    ...ctx,
    progressStart: start ?? ctx.progressStart,
    isOccupied: (c) => taken.has(occKey(c.x, c.y)) || ctx.isOccupied(c),
  };
}

function onFightGraph(
  cell: OccCell,
  battle: Set<string>,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  if (battle.size === 0) return false;
  return battle.has(k);
}

function acceptLanding(
  cell: OccCell,
  battle: Set<string>,
  ctx: OccupancyContext,
  live: OccupancyContext,
  spawnKey: string,
  reserved: Set<string>,
  allowMandatory: boolean,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (k === spawnKey) return false;
  if (!isCellFree(cell, live)) return false;
  if (!onFightGraph(cell, battle, ctx)) return false;
  if (!allowMandatory && reserved.has(k)) return false;
  return true;
}

/**
 * Snap a boss-minion / ghost / teleport landing onto the player's
 * fight graph. Far-side overworld floors and portal tiles are refused.
 * Prefer a dump cell so a unique player→exit bridge stays open.
 * Does not punch a corridor that would join a leftover island.
 */
export function legalizeBossSpawnLanding(
  cell: OccCell,
  ctx: OccupancyContext,
  player: OccCell,
): OccCell {
  const battle = floodBossSpawnBattleGraph(ctx, player);
  const spawnKey = occKey(player.x, player.y);
  const live = occupyingCells(ctx, [player], player);
  const reserved = progressionReserved(live, player);
  const search = (allowMandatory: boolean): OccCell | null => {
    const ok = (c: OccCell) =>
      acceptLanding(c, battle, ctx, live, spawnKey, reserved, allowMandatory);
    if (ok(cell)) return { x: cell.x, y: cell.y };
    return findNearestFreeCell(
      cell,
      live,
      progressionSearchRadius(live),
      new Set([spawnKey, ...ctx.portals]),
      (c) => ok(c),
    );
  };
  return search(false) ?? search(true) ?? { x: cell.x, y: cell.y };
}

/** Place several raster / adjacent minions without stacking or leaving the graph. */
export function legalizeBossSpawnLandings(
  cells: OccCell[],
  ctx: OccupancyContext,
  player: OccCell,
): OccCell[] {
  const placed: OccCell[] = [];
  let live = occupyingCells(ctx, [player], player);
  for (const cell of cells) {
    const next = legalizeBossSpawnLanding(cell, live, player);
    placed.push(next);
    live = occupyingCells(live, [player, ...placed], player);
  }
  return placed;
}

/**
 * TELEPORT_ADJACENT / ADVANCE pick a 4-neighbor using portal-as-floor.
 * Prefer an already-legal candidate; otherwise snap the first one.
 */
export function resolveTeleportAdjacentLanding(
  candidates: OccCell[],
  ctx: OccupancyContext,
  player: OccCell,
): OccCell | null {
  if (candidates.length === 0) return null;
  const battle = floodBossSpawnBattleGraph(ctx, player);
  for (const c of candidates) {
    if (onFightGraph(c, battle, ctx) && isCellFree(c, ctx)) {
      return legalizeBossSpawnLanding(c, ctx, player);
    }
  }
  return legalizeBossSpawnLanding(candidates[0], ctx, player);
}
