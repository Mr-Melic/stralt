/**
 * Battle-start destack can occupy one of two generate-time dump alcoves.
 * Unique player→exit bridges then have only one leftover dump, so a second
 * corpse or summon seals the unlocked portal.
 *
 * Generate-time dump-floor-2 (#494) and destack dump=0 (#589) run from
 * different spawn cells. This is the destack-time floor restore: punch
 * until the fight graph has two dump cells. Punches that would join a
 * leftover island or a corridor around a portal choke are skipped.
 *
 * WorldExploration destack should call this after `ensureDumpAfterBattleStart`
 * (#589). This PR does not import it from WX — that adjacent destack hunk
 * 3-way conflicts on the oldest-first prefix. Property tests apply it after
 * `simulateBattleStartOnWorld`.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { toVoidSet } from "./mapGen.ts";
import { collectMandatoryProgressionCells } from "./occupancy.ts";

/** Same floor as generate-time `PROGRESSION_DUMP_FLOOR` (#494). */
export const BATTLE_START_DUMP_FLOOR = 2;

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
export function floodBattleFromSpawn(
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
 * Walkable fight-graph cells that are not spawn, not an exit, and not a
 * unique player→exit bridge. Far-island floors past a portal choke do not
 * count — corpses relocated there cannot unseal the unlocked gate.
 */
export function countBattleDumpCells(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  w: number,
  h: number,
): { dump: number; mandatory: number; battle: number } {
  const vt = toVoidSet(voidTiles);
  const portalKeys = portalKeysOf(portals);
  const mandatory = collectMandatoryProgressionCells(
    occTiles(tiles),
    vt,
    portalKeys,
    playerSpawn,
  );
  const battle = floodBattleFromSpawn(tiles, vt, playerSpawn, portals, w, h);
  const spawnKey = `${playerSpawn.x},${playerSpawn.y}`;
  let dump = 0;
  for (const k of battle) {
    if (k === spawnKey || portalKeys.has(k) || mandatory.has(k)) continue;
    dump += 1;
  }
  return { dump, mandatory: mandatory.size, battle: battle.size };
}

function punchJoinsForeignWalkable(
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

function punchSafeAlcove(
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
      if (punchJoinsForeignWalkable(tiles, vt, nx, ny, reachable, w, h)) {
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
 * {@link BATTLE_START_DUMP_FLOOR} dump cells. Returns how many walls were
 * opened (0 when dump already meets the floor / no unique bridge / no
 * safe wall neighbor).
 */
export function ensureDumpFloorAfterBattleStart(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  w: number = WORLD_GRID_SIZE,
  h: number = WORLD_GRID_SIZE,
): number {
  const vt = toVoidSet(voidTiles);
  const exclude = new Set<string>([
    `${playerSpawn.x},${playerSpawn.y}`,
    ...portals.map((p) => `${p.x},${p.y}`),
  ]);
  let punched = 0;
  for (let i = 0; i < BATTLE_START_DUMP_FLOOR * 4; i++) {
    const counts = countBattleDumpCells(tiles, vt, playerSpawn, portals, w, h);
    if (counts.mandatory === 0 || counts.dump >= BATTLE_START_DUMP_FLOOR) {
      return punched;
    }
    const reachable = floodBattleFromSpawn(
      tiles,
      vt,
      playerSpawn,
      portals,
      w,
      h,
    );
    if (reachable.size === 0) return punched;
    const cell = punchSafeAlcove(tiles, vt, reachable, exclude, w, h);
    if (!cell) return punched;
    punched += 1;
    const next = countBattleDumpCells(tiles, vt, playerSpawn, portals, w, h);
    if (next.dump <= counts.dump) return punched;
  }
  return punched;
}
