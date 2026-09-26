/**
 * Battle-start destack can sit a hostile on one of two generate-time dump
 * alcoves. Unique player→exit bridges then still report dump ≥ 2 and free
 * dump ≥ 1, so generate-time dump-floor-2 (#494), destack dump-floor-2
 * (#600, occupancy-unaware), and destack free-dump (#603, floor 1) no-op,
 * but a second corpse or summon seals the unlocked progression portal.
 *
 * Unique extra vs destack free-dump (#603: punch until free ≥ 1) and
 * destack dump-floor-2 (#600: occupancy-unaware dump ≥ 2 after the player
 * destacks onto an alcove). Destack that parks a hostile on one alcove
 * keeps dump = 2 while free dump drops to 1. This pass restores free
 * fight-graph dump ≥ 2 after destack.
 *
 * Punches that would join a leftover island or a corridor around a portal
 * choke are skipped. WorldExploration destack should call this after
 * `ensureFreeDumpAfterBattleStart` (#603) / live destack. This module is
 * not imported from WX or `mapGen.simulate.ts` — those files 3-way on the
 * oldest-first prefix. Property tests apply the helper after destack.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { toVoidSet } from "./mapGen.ts";
import { collectMandatoryProgressionCells } from "./occupancy.ts";

/** Same floor as generate-time `PROGRESSION_DUMP_FLOOR` (#494). */
export const BATTLE_START_OCCUPIED_DUMP_FLOOR = 2;

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
 * tile, expand to the largest adjacent floor component so dump counting
 * does not see an empty graph.
 */
export function floodOccupiedDumpFloorBattleFrom(
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

/**
 * Fight-graph dump cells after destack. Occupied alcoves still count as
 * `dump` so destack dump-floor-2 and destack free-dump (floor 1) can no-op
 * while free dump stays 1. Far-island floors past a portal choke do not
 * count — corpses relocated there cannot unseal the unlocked gate.
 */
export function countOccupiedDumpFloorCells(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupied: { x: number; y: number }[],
  w: number,
  h: number,
): { dump: number; free: number; mandatory: number; battle: number } {
  const vt = toVoidSet(voidTiles);
  const portalKeys = portalKeysOf(portals);
  const taken = occupiedKeysOf(occupied);
  const mandatory = collectMandatoryProgressionCells(
    occTiles(tiles),
    vt,
    portalKeys,
    playerSpawn,
  );
  const battle = floodOccupiedDumpFloorBattleFrom(
    tiles,
    vt,
    playerSpawn,
    portals,
    w,
    h,
  );
  const spawnKey = `${playerSpawn.x},${playerSpawn.y}`;
  let dump = 0;
  let free = 0;
  for (const k of battle) {
    if (k === spawnKey || portalKeys.has(k) || mandatory.has(k)) continue;
    dump += 1;
    if (!taken.has(k)) free += 1;
  }
  return { dump, free, mandatory: mandatory.size, battle: battle.size };
}

function punchJoinsLeftoverWalkable(
  tiles: string[][],
  vt: Set<string>,
  x: number,
  y: number,
  reachable: Set<string>,
  w: number,
  h: number,
): boolean {
  for (const [dx, dy] of PUNCH_DIRS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
    const nk = `${nx},${ny}`;
    if (vt.has(nk) || reachable.has(nk)) continue;
    const t = tiles[ny]?.[nx] as string;
    if (t === "wall" || t === "portal") continue;
    return true;
  }
  return false;
}

function punchSafeOccupiedDumpAlcove(
  tiles: string[][],
  vt: Set<string>,
  reachable: Set<string>,
  exclude: Set<string>,
  w: number,
  h: number,
): { x: number; y: number } | null {
  for (const k of reachable) {
    const p = k.split(",");
    const x = Number(p[0]);
    const y = Number(p[1]);
    for (const [dx, dy] of PUNCH_DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nk = `${nx},${ny}`;
      if (vt.has(nk) || exclude.has(nk)) continue;
      if ((tiles[ny]?.[nx] as string) !== "wall") continue;
      if (punchJoinsLeftoverWalkable(tiles, vt, nx, ny, reachable, w, h)) {
        continue;
      }
      tiles[ny][nx] = "floor";
      reachable.add(nk);
      return { x: nx, y: ny };
    }
  }
  return null;
}

/**
 * After battle-start destack, punch alcoves until the fight graph has
 * {@link BATTLE_START_OCCUPIED_DUMP_FLOOR} unoccupied dump cells. Returns
 * how many walls were opened (0 when free dump already meets the floor /
 * no unique bridge / no safe wall neighbor).
 */
export function ensureOccupiedDumpFloorAfterBattleStart(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupied: { x: number; y: number }[] = [],
  w: number = WORLD_GRID_SIZE,
  h: number = WORLD_GRID_SIZE,
): number {
  const vt = toVoidSet(voidTiles);
  const exclude = new Set<string>([
    `${playerSpawn.x},${playerSpawn.y}`,
    ...portals.map((p) => `${p.x},${p.y}`),
    ...occupied.map((c) => `${c.x},${c.y}`),
  ]);
  let punched = 0;
  for (let i = 0; i < BATTLE_START_OCCUPIED_DUMP_FLOOR * 8; i++) {
    const counts = countOccupiedDumpFloorCells(
      tiles,
      vt,
      playerSpawn,
      portals,
      occupied,
      w,
      h,
    );
    if (
      counts.mandatory === 0 ||
      counts.free >= BATTLE_START_OCCUPIED_DUMP_FLOOR
    ) {
      return punched;
    }
    const reachable = floodOccupiedDumpFloorBattleFrom(
      tiles,
      vt,
      playerSpawn,
      portals,
      w,
      h,
    );
    if (reachable.size === 0) return punched;
    const cell = punchSafeOccupiedDumpAlcove(
      tiles,
      vt,
      reachable,
      exclude,
      w,
      h,
    );
    if (!cell) return punched;
    punched += 1;
    const next = countOccupiedDumpFloorCells(
      tiles,
      vt,
      playerSpawn,
      portals,
      occupied,
      w,
      h,
    );
    if (next.free <= counts.free) return punched;
  }
  return punched;
}
