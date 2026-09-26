/**
 * Greedy `unsealProgressionOccupants` relocates one mover at a time and
 * only when THAT mover's trial cell restores a player→exit route.
 * Two corpses on each of two 1-wide corridors (min-cut=2, unique-bridge
 * set empty) jointly seal: moving any single occupant still leaves both
 * paths blocked, so greedy no-ops and the unlocked portal stays sealed.
 *
 * Unique extra vs unique-bridge relocate / dual-path 1+1 unseal
 * (occupancy.ts) and vs destack/wander dump punches (#589–#651: those
 * no-op when mandatory=0 because every floor counts as dump). Generate-
 * time `ensureProgressionAlcove` also skips when unique bridges are empty.
 *
 * Peel a blocker onto any fight-graph cell that strictly grows the
 * player-side safe flood (alcove or far-side room). Repeat until greedy
 * 1+1 unseal can finish. When no growth move exists, punch one adjacent
 * wall; skip leftover-island joins and portal-choke corridors.
 *
 * Not imported from occupancy.ts, WorldExploration, or mapGen.simulate.ts
 * — those files 3-way on the oldest-first prefix. Property tests apply
 * the helper after destack/wander. Call after live unseal when that hunk
 * lands.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { toVoidSet } from "./mapGen.ts";
import {
  type OccCell,
  type OccupancyContext,
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

const MAX_JOINT_PEELS = 16;
const MAX_JOINT_PUNCHES = 4;

function gridSize(tiles: boolean[][]): { w: number; h: number } {
  return { h: tiles.length, w: tiles[0]?.length ?? 0 };
}

function floodWalk(
  walk: (x: number, y: number) => boolean,
  start: OccCell,
): Set<string> {
  if (!walk(start.x, start.y)) return new Set();
  const seen = new Set<string>([occKey(start.x, start.y)]);
  const q = [{ x: start.x, y: start.y }];
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

function openWalk(
  tiles: boolean[][],
  voidTiles: Set<string>,
  barriers: Set<string>,
): (x: number, y: number) => boolean {
  const { w, h } = gridSize(tiles);
  return (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (!tiles[y]?.[x]) return false;
    const k = occKey(x, y);
    if (voidTiles.has(k) || barriers.has(k)) return false;
    return true;
  };
}

function blockedWalk(
  tiles: boolean[][],
  voidTiles: Set<string>,
  barriers: Set<string>,
  blocked: Set<string>,
): (x: number, y: number) => boolean {
  const base = openWalk(tiles, voidTiles, barriers);
  return (x, y) => base(x, y) && !blocked.has(occKey(x, y));
}

function occupantKeys(cells: OccCell[]): Set<string> {
  return new Set(cells.map((c) => occKey(c.x, c.y)));
}

function sealBlockedSet(
  start: OccCell,
  occupants: OccCell[],
  portals: Set<string>,
  barriers: Set<string>,
): Set<string> {
  const blocked = new Set(barriers);
  for (const o of occupants) blocked.add(occKey(o.x, o.y));
  blocked.delete(occKey(start.x, start.y));
  for (const p of portals) blocked.delete(p);
  return blocked;
}

function occupyingCtx(
  base: OccupancyContext,
  start: OccCell,
  movers: OccCell[],
  staticOccupants: OccCell[],
): OccupancyContext {
  const keys = occupantKeys([...movers, ...staticOccupants]);
  keys.add(occKey(start.x, start.y));
  return {
    ...base,
    isOccupied: (c) => keys.has(occKey(c.x, c.y)),
  };
}

function staticOccupantsOf(
  ctx: OccupancyContext,
  movers: OccCell[],
): OccCell[] {
  const moverKeys = occupantKeys(movers);
  return collectOccupiedCells(ctx).filter(
    (o) => !moverKeys.has(occKey(o.x, o.y)),
  );
}

function stillSealed(
  tiles: boolean[][],
  voidTiles: Set<string>,
  portals: Set<string>,
  start: OccCell,
  movers: OccCell[],
  staticOccupants: OccCell[],
  barriers: Set<string>,
): boolean {
  return occupantsSealProgression(
    tiles,
    voidTiles,
    portals,
    start,
    [...staticOccupants, ...movers],
    barriers,
  );
}

function safeFlood(
  tiles: boolean[][],
  voidTiles: Set<string>,
  portals: Set<string>,
  start: OccCell,
  movers: OccCell[],
  staticOccupants: OccCell[],
  barriers: Set<string>,
): Set<string> {
  const blocked = sealBlockedSet(
    start,
    [...staticOccupants, ...movers],
    portals,
    barriers,
  );
  return floodWalk(blockedWalk(tiles, voidTiles, barriers, blocked), start);
}

function peelOneIntoSafeAlcove(
  movers: OccCell[],
  tiles: boolean[][],
  voidTiles: Set<string>,
  portals: Set<string>,
  start: OccCell,
  ctx: OccupancyContext,
  staticOccupants: OccCell[],
): OccCell[] | null {
  const open = floodWalk(openWalk(tiles, voidTiles, ctx.barriers), start);
  const safe = safeFlood(
    tiles,
    voidTiles,
    portals,
    start,
    movers,
    staticOccupants,
    ctx.barriers,
  );
  const liveCtx = occupyingCtx(ctx, start, movers, staticOccupants);
  const adjSafe: number[] = [];
  const rest: number[] = [];
  for (let i = 0; i < movers.length; i++) {
    const mover = movers[i];
    let nextToSafe = false;
    for (const [dx, dy] of DIRS) {
      if (safe.has(occKey(mover.x + dx, mover.y + dy))) {
        nextToSafe = true;
        break;
      }
    }
    if (nextToSafe) adjSafe.push(i);
    else rest.push(i);
  }
  const spawnKey = occKey(start.x, start.y);
  for (const i of [...adjSafe, ...rest]) {
    const mover = movers[i];
    const vacating = occupancyVacating(liveCtx, mover);
    const avoid = occupantKeys([
      ...staticOccupants,
      ...movers.filter((_, j) => j !== i),
    ]);
    const found = findNearestFreeCell(
      mover,
      vacating,
      progressionSearchRadius(vacating),
      avoid,
      (cell) => {
        const k = occKey(cell.x, cell.y);
        if (k === spawnKey || portals.has(k) || !open.has(k)) return false;
        const trial = movers.map((m, j) => (j === i ? cell : m));
        const next = safeFlood(
          tiles,
          voidTiles,
          portals,
          start,
          trial,
          staticOccupants,
          ctx.barriers,
        );
        return next.size > safe.size;
      },
    );
    if (!found) continue;
    if (found.x === mover.x && found.y === mover.y) continue;
    return movers.map((m, j) => (j === i ? found : { x: m.x, y: m.y }));
  }
  return null;
}

/**
 * Relocate movers that jointly cut every player→exit route when greedy
 * one-at-a-time unseal cannot break a 2+2 (or larger) dual-path cut.
 */
export function unsealJointProgressionOccupants(
  movers: OccCell[],
  tiles: boolean[][],
  voidTiles: Set<string>,
  portals: Set<string>,
  start: OccCell,
  ctx: OccupancyContext,
): OccCell[] {
  if (movers.length === 0 || portals.size === 0) return movers;
  const staticOccupants = staticOccupantsOf(ctx, movers).filter(
    (o) => o.x !== start.x || o.y !== start.y,
  );
  let result = unsealProgressionOccupants(
    movers,
    tiles,
    voidTiles,
    portals,
    start,
    occupyingCtx(ctx, start, movers, staticOccupants),
  );
  for (let peel = 0; peel < MAX_JOINT_PEELS; peel++) {
    if (
      !stillSealed(
        tiles,
        voidTiles,
        portals,
        start,
        result,
        staticOccupants,
        ctx.barriers,
      )
    ) {
      return result;
    }
    result = unsealProgressionOccupants(
      result,
      tiles,
      voidTiles,
      portals,
      start,
      occupyingCtx(ctx, start, result, staticOccupants),
    );
    if (
      !stillSealed(
        tiles,
        voidTiles,
        portals,
        start,
        result,
        staticOccupants,
        ctx.barriers,
      )
    ) {
      return result;
    }
    const peeled = peelOneIntoSafeAlcove(
      result,
      tiles,
      voidTiles,
      portals,
      start,
      ctx,
      staticOccupants,
    );
    if (!peeled) break;
    result = peeled;
  }
  result = unsealProgressionOccupants(
    result,
    tiles,
    voidTiles,
    portals,
    start,
    occupyingCtx(ctx, start, result, staticOccupants),
  );
  return result;
}

function occTiles(tiles: string[][]): boolean[][] {
  return tiles.map((row) => (row ?? []).map((t) => t !== "wall"));
}

function portalKeysOf(portals: { x: number; y: number }[]): Set<string> {
  return new Set(portals.map((p) => `${p.x},${p.y}`));
}

function spawnFlood(
  tiles: string[][],
  vt: Set<string>,
  spawn: OccCell,
  w: number,
  h: number,
): Set<string> {
  return floodWalk((x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if ((tiles[y]?.[x] as string) === "wall") return false;
    return !vt.has(occKey(x, y));
  }, spawn);
}

function punchJoinsForeignWalkable(
  tiles: string[][],
  vt: Set<string>,
  spawnReachable: Set<string>,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  for (const [dx, dy] of DIRS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
    if ((tiles[ny]?.[nx] as string) === "wall") continue;
    if (vt.has(occKey(nx, ny))) continue;
    if (!spawnReachable.has(occKey(nx, ny))) return true;
  }
  return false;
}

function punchSafeAlcove(
  tiles: string[][],
  vt: Set<string>,
  spawn: OccCell,
  portals: { x: number; y: number }[],
  occupants: OccCell[],
  w: number,
  h: number,
): boolean {
  const boolTiles = occTiles(tiles);
  const portalKeys = portalKeysOf(portals);
  const barriers = new Set<string>();
  const blocked = sealBlockedSet(spawn, occupants, portalKeys, barriers);
  const walk = blockedWalk(boolTiles, vt, barriers, blocked);
  const safe = floodWalk(walk, spawn);
  const reachable = spawnFlood(tiles, vt, spawn, w, h);
  const exclude = new Set<string>([
    occKey(spawn.x, spawn.y),
    ...portalKeys,
    ...occupants.map((o) => occKey(o.x, o.y)),
  ]);
  for (const k of safe) {
    const p = k.split(",");
    const x = Number(p[0]);
    const y = Number(p[1]);
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nk = occKey(nx, ny);
      if (exclude.has(nk) || vt.has(nk)) continue;
      if ((tiles[ny]?.[nx] as string) !== "wall") continue;
      if (punchJoinsForeignWalkable(tiles, vt, reachable, nx, ny, w, h)) {
        continue;
      }
      tiles[ny][nx] = "floor";
      return true;
    }
  }
  return false;
}

function ctxFromOccupants(
  tiles: boolean[][],
  voidTiles: Set<string>,
  portals: Set<string>,
  start: OccCell,
  occupants: OccCell[],
): OccupancyContext {
  const keys = occupantKeys(occupants);
  keys.add(occKey(start.x, start.y));
  return {
    tiles,
    barriers: new Set(),
    voidTiles,
    portals,
    progressStart: start,
    isOccupied: (c) => keys.has(occKey(c.x, c.y)),
  };
}

/**
 * Relocate joint-cut corpses/summons on a live string map. Punches a
 * player-side alcove when unique bridges are empty so greedy dump
 * helpers cannot no-op the dual-path 2+2 seal.
 */
export function ensureJointCutUnseal(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: OccCell,
  portals: { x: number; y: number }[],
  occupants: OccCell[],
  w: number = tiles[0]?.length ?? WORLD_GRID_SIZE,
  h: number = tiles.length,
): { occupants: OccCell[]; punched: number } {
  const vt = toVoidSet(voidTiles);
  const portalKeys = portalKeysOf(portals);
  let movers = occupants.map((o) => ({ x: o.x, y: o.y }));
  let punched = 0;
  for (let step = 0; step < MAX_JOINT_PUNCHES + 1; step++) {
    const boolTiles = occTiles(tiles);
    const ctx = ctxFromOccupants(
      boolTiles,
      vt,
      portalKeys,
      playerSpawn,
      movers,
    );
    movers = unsealJointProgressionOccupants(
      movers,
      boolTiles,
      vt,
      portalKeys,
      playerSpawn,
      ctx,
    );
    if (
      !stillSealed(
        boolTiles,
        vt,
        portalKeys,
        playerSpawn,
        movers,
        [],
        ctx.barriers,
      )
    ) {
      return { occupants: movers, punched };
    }
    if (step >= MAX_JOINT_PUNCHES) break;
    if (!punchSafeAlcove(tiles, vt, playerSpawn, portals, movers, w, h)) {
      break;
    }
    punched += 1;
  }
  return { occupants: movers, punched };
}
