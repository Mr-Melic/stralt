/**
 * Chessboard Lich `MAP_ROTATE` / `MIRROR_INVERT` rewrite entity cells
 * without moving tiles, and knight leap lists landings with
 * `ignoreWalls`. Unique-bridge slide / dual-path 1+1 unseal live on
 * occupancy.ts but are never called, so a unit on a floor that maps onto
 * an even/even chessboard wall (or a leftover CA crumb) leaves the player
 * standing on a wall — or jointly seals the unlocked portal.
 *
 * Unique extra vs occupancy.ts unique-bridge relocate / dual-path 1+1
 * unseal (those run only when callers invoke `unsealProgressionOccupants`)
 * and vs destack/wander dump punches, choke-pocket snap, 2+2 joint peel,
 * knockback landing, and two-body swap (#589/#600/#603/#608/#628/#648/
 * #651/#656/#688/#697: those stay on already-walkable fight-graph cells
 * and cannot ignore walls).
 *
 * After the tentative transform or leap, snap each landing onto a
 * fight-graph floor that still reaches an exit. Skip leftover-island hops
 * (portals are battle walls). Not imported from occupancy.ts,
 * WorldExploration, or mapGen.simulate.ts — those files 3-way on the
 * oldest-first prefix. Property tests apply the helper after destack/wander.
 * Call after live rotate/mirror/leap when that hunk lands.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  type OccCell,
  type OccupancyContext,
  collectOccupiedCells,
  findNearestFreeCell,
  isCellFree,
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

/** 90° clockwise. Matches `applyMapRotate` (`newX = n-1-y`, `newY = x`). */
export function rotateCellClockwise(
  cell: OccCell,
  n: number = WORLD_GRID_SIZE,
): OccCell {
  return { x: n - 1 - cell.y, y: cell.x };
}

/** Horizontal mirror. Matches `applyMirrorInvert` (`newX = n-1-x`). */
export function mirrorCellHorizontal(
  cell: OccCell,
  n: number = WORLD_GRID_SIZE,
): OccCell {
  return { x: n - 1 - cell.x, y: cell.y };
}

/** Boss teleport after a board transform. `n=16` → (7,7). */
export function boardTransformCenter(n: number = WORLD_GRID_SIZE): OccCell {
  const c = Math.floor((n - 1) / 2);
  return { x: c, y: c };
}

/**
 * Fight-graph flood from `start` (portals / voids / barriers are walls).
 * Occupants are not walls — dump alcoves must stay legal landings.
 * A wall/void origin expands to the largest adjacent floor island.
 */
export function floodIgnoreWallsBattleGraph(
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

function occupyingCells(
  ctx: OccupancyContext,
  cells: OccCell[],
  start?: OccCell,
): OccupancyContext {
  const taken = new Set(cells.map((c) => occKey(c.x, c.y)));
  return {
    ...ctx,
    progressStart: start ?? ctx.progressStart,
    isOccupied: (c) => taken.has(occKey(c.x, c.y)),
  };
}

function sealedFrom(
  ctx: OccupancyContext,
  player: OccCell,
  occupants: OccCell[],
): boolean {
  if (ctx.portals.size === 0) return false;
  return occupantsSealProgression(
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    player,
    occupants,
    ctx.barriers,
  );
}

function reachesPortal(cell: OccCell, ctx: OccupancyContext): boolean {
  if (ctx.portals.size === 0) {
    const { w, h } = gridSize(ctx.tiles);
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) return false;
    return ctx.tiles[cell.y]?.[cell.x] === true;
  }
  return !occupantsSealProgression(
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    cell,
    [],
    ctx.barriers,
  );
}

function onFightGraph(
  cell: OccCell,
  battle: Set<string>,
  ctx: OccupancyContext,
): boolean {
  const k = occKey(cell.x, cell.y);
  if (ctx.portals.has(k)) return false;
  return battle.size === 0 || battle.has(k);
}

/**
 * Snap an ignore-walls landing onto a fight-graph floor. Used by rotate,
 * mirror, and knight leap so a raw even/even chessboard cell cannot trap
 * the player on a wall.
 */
export function legalizeIgnoreWallsLanding(
  cell: OccCell,
  ctx: OccupancyContext,
  battle: Set<string>,
  player?: OccCell,
  fallback?: OccCell,
): OccCell {
  const spawnKey = player ? occKey(player.x, player.y) : "";
  const ok = (c: OccCell) => {
    const k = occKey(c.x, c.y);
    if (player && k === spawnKey) return false;
    if (!isCellFree(c, ctx)) return false;
    if (!onFightGraph(c, battle, ctx)) return false;
    return reachesPortal(c, ctx);
  };
  if (ok(cell)) return { x: cell.x, y: cell.y };
  const found = findNearestFreeCell(
    cell,
    ctx,
    progressionSearchRadius(ctx),
    new Set([...(player ? [spawnKey] : []), ...ctx.portals]),
    (c) => ok(c),
  );
  if (found) return found;
  if (fallback && ok(fallback)) return { x: fallback.x, y: fallback.y };
  return cell;
}

function snapOccupantOntoFightGraph(
  cell: OccCell,
  player: OccCell,
  occupants: OccCell[],
  ctx: OccupancyContext,
  battle: Set<string>,
): OccCell {
  const others = occupants.filter(
    (o) => occKey(o.x, o.y) !== occKey(cell.x, cell.y),
  );
  const live = occupyingCells(ctx, [player, ...others], player);
  const trialSeals = (c: OccCell) => sealedFrom(ctx, player, [...others, c]);
  const onGraph = (c: OccCell) => onFightGraph(c, battle, ctx);
  if (onGraph(cell) && isCellFree(cell, live) && !trialSeals(cell)) {
    return cell;
  }
  const found = findNearestFreeCell(
    cell,
    live,
    progressionSearchRadius(live),
    new Set([occKey(player.x, player.y), ...ctx.portals]),
    (c) => onGraph(c) && !trialSeals(c) && reachesPortal(c, ctx),
  );
  return found ?? cell;
}

export interface IgnoreWallsUnsealResult {
  player: OccCell;
  occupants: OccCell[];
}

function legalizeTransformedParty(
  rawPlayer: OccCell,
  rawOccupants: OccCell[],
  originals: { player: OccCell; occupants: OccCell[] },
  ctx: OccupancyContext,
): IgnoreWallsUnsealResult {
  // Tiles do not rotate. Flood from the pre-transform player so a raw wall
  // landing cannot shrink the fight graph to a one-cell pocket.
  const empty: OccupancyContext = {
    ...ctx,
    isOccupied: () => false,
    progressStart: originals.player,
  };
  const battle = floodIgnoreWallsBattleGraph(empty, originals.player);
  const player = legalizeIgnoreWallsLanding(
    rawPlayer,
    empty,
    battle,
    undefined,
    originals.player,
  );
  const placed: OccCell[] = [];
  for (let i = 0; i < rawOccupants.length; i++) {
    const live = occupyingCells(ctx, [player, ...placed], player);
    const next = legalizeIgnoreWallsLanding(
      rawOccupants[i],
      live,
      battle,
      player,
      originals.occupants[i],
    );
    const snapped = snapOccupantOntoFightGraph(
      next,
      player,
      [...placed, next],
      ctx,
      battle,
    );
    placed.push(snapped);
  }
  const live = occupyingCells(ctx, [player, ...placed], player);
  if (!sealedFrom(ctx, player, placed)) {
    return { player, occupants: placed };
  }
  const cut = unsealProgressionOccupants(
    placed,
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    player,
    live,
  );
  const after: OccCell[] = [];
  for (const cell of cut) {
    after.push(
      snapOccupantOntoFightGraph(cell, player, [...after, cell], ctx, battle),
    );
  }
  return { player, occupants: after };
}

/**
 * Rotate every combatant 90° clockwise, then legalize wall / leftover
 * landings. Optional `bossIndex` teleports that occupant to board center
 * (Chessboard Lich), matching `applyMapRotate`.
 */
export function resolveMapRotateUnsealing(
  player: OccCell,
  occupants: OccCell[],
  ctx: OccupancyContext,
  opts?: { bossIndex?: number; size?: number },
): IgnoreWallsUnsealResult {
  const n = opts?.size ?? ctx.tiles[0]?.length ?? WORLD_GRID_SIZE;
  const rawPlayer = rotateCellClockwise(player, n);
  const rawOccupants = occupants.map((o, i) =>
    i === opts?.bossIndex ? boardTransformCenter(n) : rotateCellClockwise(o, n),
  );
  return legalizeTransformedParty(
    rawPlayer,
    rawOccupants,
    { player, occupants },
    ctx,
  );
}

/**
 * Mirror every combatant horizontally, then legalize wall / leftover
 * landings. Optional `bossIndex` teleports that occupant to board center.
 */
export function resolveMapMirrorUnsealing(
  player: OccCell,
  occupants: OccCell[],
  ctx: OccupancyContext,
  opts?: { bossIndex?: number; size?: number },
): IgnoreWallsUnsealResult {
  const n = opts?.size ?? ctx.tiles[0]?.length ?? WORLD_GRID_SIZE;
  const rawPlayer = mirrorCellHorizontal(player, n);
  const rawOccupants = occupants.map((o, i) =>
    i === opts?.bossIndex
      ? boardTransformCenter(n)
      : mirrorCellHorizontal(o, n),
  );
  return legalizeTransformedParty(
    rawPlayer,
    rawOccupants,
    { player, occupants },
    ctx,
  );
}

/**
 * Relocate a knight-leap / ignore-walls landing that sat on a wall,
 * leftover island, or jointly cut every player→exit route. Stay on the
 * fight graph so the mover cannot hop a portal choke onto a CA crumb.
 */
export function unsealIgnoreWallsLanding(
  origin: OccCell,
  landing: OccCell,
  ctx: OccupancyContext,
): OccCell {
  const start = ctx.progressStart ?? origin;
  const vacated = occupancyVacating(ctx, origin);
  const battle = floodIgnoreWallsBattleGraph(vacated, start);
  const legal = legalizeIgnoreWallsLanding(landing, vacated, battle, start);
  const spawnKey = occKey(start.x, start.y);
  const onGraph = (cell: OccCell) => {
    const k = occKey(cell.x, cell.y);
    if (k === spawnKey || ctx.portals.has(k)) return false;
    return battle.size === 0 || battle.has(k);
  };
  if (!onGraph(legal) || !isCellFree(legal, vacated)) return origin;
  const live: OccupancyContext = {
    ...vacated,
    isOccupied: (c) => {
      if (c.x === legal.x && c.y === legal.y) return true;
      return vacated.isOccupied(c);
    },
  };
  const [cut] = unsealProgressionOccupants(
    [legal],
    ctx.tiles,
    ctx.voidTiles,
    ctx.portals,
    start,
    live,
  );
  if (!onGraph(cut) || !isCellFree(cut, occupancyVacating(live, legal))) {
    return origin;
  }
  const legalKey = occKey(legal.x, legal.y);
  const cutKey = occKey(cut.x, cut.y);
  const others = collectOccupiedCells(live).filter((o) => {
    const k = occKey(o.x, o.y);
    return k !== cutKey && k !== legalKey;
  });
  if (sealedFrom(ctx, start, [...others, cut])) return origin;
  return cut;
}

/** Apply a proposed knight leap, then unseal a wall / dual-path landing. */
export function resolveKnightLeapLanding(
  origin: OccCell,
  landing: OccCell,
  ctx: OccupancyContext,
): OccCell {
  if (origin.x === landing.x && origin.y === landing.y) return origin;
  return unsealIgnoreWallsLanding(origin, landing, ctx);
}
