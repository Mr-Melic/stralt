/**
 * Battle-start destack max-spacing can sit the player in a side pocket
 * (asymmetric seed 2105, many chessboard corners). Unique player→exit
 * bridges then appear only from that pocket. Four corpses/summons on the
 * neck jointly seal the unlocked portal even though generate-time dump
 * is abundant (191+ non-bridge floors on the far side of the neck).
 *
 * Unique extra vs destack dump-floor helpers (#589/#600/#603/#648: punch
 * alcoves when dump/free is low) and leftover-island snap (#484: far CA
 * crumbs outside the spawn flood). The pocket is still on the fight graph
 * — destack dump counts stay high — so those helpers no-op. Portal-origin
 * destack (#553) is a different empty-flood case.
 *
 * After destack, snap the player onto the nearest fight-graph floor whose
 * unique-bridge set is empty (an open room). Punches that would join a
 * leftover island are not used — this pass only relocates the player.
 * WorldExploration destack should call this after live destack. This
 * module is not imported from WX or `mapGen.simulate.ts` — those files
 * 3-way on the oldest-first prefix. Property tests apply the helper
 * after `simulateBattleStartOnWorld`.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { toVoidSet } from "./mapGen.ts";
import { collectMandatoryProgressionCells } from "./occupancy.ts";

const PUNCH_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function occTiles(tiles: string[][]): boolean[][] {
  return tiles.map((row) => (row ?? []).map((t) => t !== "wall"));
}

function portalKeysOf(portals: { x: number; y: number }[]): Set<string> {
  return new Set(portals.map((p) => `${p.x},${p.y}`));
}

function occupiedKeysOf(occupied: { x: number; y: number }[]): Set<string> {
  return new Set(occupied.map((c) => `${c.x},${c.y}`));
}

function isBattleFloor(
  tiles: string[][],
  vt: Set<string>,
  portalKeys: Set<string>,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  if (x < 0 || y < 0 || x >= w || y >= h) return false;
  const k = `${x},${y}`;
  if (vt.has(k) || portalKeys.has(k)) return false;
  const t = tiles[y]?.[x] as string;
  if (t === "wall" || t === "portal") return false;
  return true;
}

/**
 * Fight-graph island containing `seed`. When destack sits on a portal
 * tile, expand to the largest adjacent floor component so choke counting
 * does not see an empty graph.
 */
export function floodBattleStartChokeFrom(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  seed: { x: number; y: number },
  portals: { x: number; y: number }[],
  w: number,
  h: number,
): Set<string> {
  const vt = toVoidSet(voidTiles);
  const portalKeys = portalKeysOf(portals);
  const starts: { x: number; y: number }[] = [];
  if (isBattleFloor(tiles, vt, portalKeys, seed.x, seed.y, w, h)) {
    starts.push(seed);
  } else {
    for (const [dx, dy] of PUNCH_DIRS) {
      const nx = seed.x + dx;
      const ny = seed.y + dy;
      if (isBattleFloor(tiles, vt, portalKeys, nx, ny, w, h)) {
        starts.push({ x: nx, y: ny });
      }
    }
  }
  let best = new Set<string>();
  const seenStart = new Set<string>();
  for (const start of starts) {
    const sk = `${start.x},${start.y}`;
    if (seenStart.has(sk)) continue;
    seenStart.add(sk);
    const seen = new Set<string>([sk]);
    const q = [{ x: start.x, y: start.y }];
    while (q.length > 0) {
      const cur = q.shift()!;
      for (const [dx, dy] of PUNCH_DIRS) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        const nk = `${nx},${ny}`;
        if (seen.has(nk)) continue;
        if (!isBattleFloor(tiles, vt, portalKeys, nx, ny, w, h)) continue;
        seen.add(nk);
        q.push({ x: nx, y: ny });
      }
    }
    if (seen.size > best.size) best = seen;
  }
  return best;
}

/** Unique player→exit bridges from `playerSpawn` (occupancy flood). */
export function countBattleStartChokeBridges(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
): number {
  const vt = toVoidSet(voidTiles);
  return collectMandatoryProgressionCells(
    occTiles(tiles),
    vt,
    portalKeysOf(portals),
    playerSpawn,
  ).size;
}

/**
 * Nearest fight-graph floor whose unique-bridge set is empty. Skips
 * portals, leftover islands (not on the fight flood), and occupied cells.
 */
export function findBattleStartOffChokeCell(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupied: { x: number; y: number }[],
  w: number,
  h: number,
): { x: number; y: number } | null {
  const vt = toVoidSet(voidTiles);
  const portalKeys = portalKeysOf(portals);
  const taken = occupiedKeysOf(occupied);
  taken.add(`${playerSpawn.x},${playerSpawn.y}`);
  const grid = occTiles(tiles);
  const battle = floodBattleStartChokeFrom(
    tiles,
    vt,
    playerSpawn,
    portals,
    w,
    h,
  );
  const maxR = Math.max(1, w + h);
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      const candidates = [
        { x: playerSpawn.x + dx, y: playerSpawn.y + dy },
        ...(dy === 0 ? [] : [{ x: playerSpawn.x + dx, y: playerSpawn.y - dy }]),
      ];
      for (const cell of candidates) {
        const k = `${cell.x},${cell.y}`;
        if (!battle.has(k) || portalKeys.has(k) || taken.has(k)) continue;
        if (
          collectMandatoryProgressionCells(grid, vt, portalKeys, cell).size !==
          0
        ) {
          continue;
        }
        return { x: cell.x, y: cell.y };
      }
    }
  }
  return null;
}

/**
 * After battle-start destack, snap the player off a choke pocket onto an
 * open fight-graph cell (no unique bridges). Returns the (possibly same)
 * spawn. No-ops when the destack cell already has no unique bridges, or
 * when every fight-graph floor is itself a unique corridor.
 */
export function snapBattleStartOffChokePocket(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupied: { x: number; y: number }[] = [],
  w: number = WORLD_GRID_SIZE,
  h: number = WORLD_GRID_SIZE,
): { playerSpawn: { x: number; y: number }; snapped: boolean } {
  if (
    countBattleStartChokeBridges(tiles, voidTiles, playerSpawn, portals) === 0
  ) {
    return {
      playerSpawn: { x: playerSpawn.x, y: playerSpawn.y },
      snapped: false,
    };
  }
  const next = findBattleStartOffChokeCell(
    tiles,
    voidTiles,
    playerSpawn,
    portals,
    occupied,
    w,
    h,
  );
  if (!next) {
    return {
      playerSpawn: { x: playerSpawn.x, y: playerSpawn.y },
      snapped: false,
    };
  }
  return { playerSpawn: next, snapped: true };
}
