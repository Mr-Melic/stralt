/**
 * Battle-start destack can sit the player on the only generate-time dump
 * alcove. Unique player→exit bridges then have nowhere to relocate a
 * corpse/summon, so the unlocked progression portal stays sealed.
 *
 * Generate-time `ensureProgressionAlcove` / free-dump (#538) run from the
 * pre-fight spawn. This is the destack-time correction — punch one more
 * dead-end floor when the moved player consumed the last dump cell.
 * Does not carve a new corridor or join leftover islands.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  countProgressionDumpCells,
  floodWalkable,
  toVoidSet,
} from "./mapGen.ts";

const PUNCH_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function punchAdjacentFloor(
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
    for (const d of PUNCH_DIRS) {
      const nx = x + d[0];
      const ny = y + d[1];
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nk = `${nx},${ny}`;
      if (vt.has(nk) || exclude.has(nk)) continue;
      if ((tiles[ny]?.[nx] as string) === "wall") {
        tiles[ny][nx] = "floor";
        reachable.add(nk);
        return { x: nx, y: ny };
      }
    }
  }
  return null;
}

/**
 * After battle-start destack, punch one alcove when destack sat on the
 * last dump cell. Returns the punched cell, or null when dump already
 * exists / no unique bridge / no wall neighbor.
 */
export function ensureDumpAfterBattleStart(
  tiles: string[][],
  voidTiles: Set<string> | Map<string, unknown> | undefined,
  playerSpawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  w: number = WORLD_GRID_SIZE,
  h: number = WORLD_GRID_SIZE,
): { x: number; y: number } | null {
  const vt = toVoidSet(voidTiles);
  const counts = countProgressionDumpCells(
    tiles,
    vt,
    playerSpawn,
    portals,
    w,
    h,
  );
  if (counts.mandatory === 0 || counts.dump > 0) return null;
  const reachable = floodWalkable(tiles, vt, playerSpawn, w, h);
  const exclude = new Set<string>([
    `${playerSpawn.x},${playerSpawn.y}`,
    ...portals.map((p) => `${p.x},${p.y}`),
  ]);
  return punchAdjacentFloor(tiles, vt, reachable, exclude, w, h);
}
