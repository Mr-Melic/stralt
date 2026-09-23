/**
 * Player-controlled summon walk occupancy.
 *
 * Player walk execute floats "Occupied" only for a living combatant
 * (`isAliveCombatant`). Summon-control execute used every store occupant
 * (including hp ≤ 0 corpses) inside `resolveControlledSummonMoveDest`, so a
 * corpse tile the green MP ring and the player walk both treat as free
 * returned "Cannot move there".
 *
 * Living occupancy is the shared rule. Do not fold corpses back in — that
 * would re-split summon walk from player walk. The MP-ring BFS wrap that
 * drops living dests from the highlight lives in an older open PR; this
 * module is the execute-side `isOccupied` callback for
 * `resolveControlledSummonMoveDest`. WorldExploration still lists every
 * store occupant until that file can union with the oldest-first queue.
 */

import { isAliveCombatant } from "./battleSetup.ts";

export type SummonWalkOccupant = {
  x: number;
  y: number;
  hp?: number;
};

/**
 * True when summon-control execute must refuse this dest — same living
 * filter as player walk Occupied, plus the player tile (the occupancy
 * callback used to list the player even when they are missing from the
 * enemy snapshot).
 */
export function summonWalkDestinationOccupied(args: {
  occupants: ReadonlyArray<SummonWalkOccupant>;
  tile: { x: number; y: number };
  playerPos?: { x: number; y: number } | null;
}): boolean {
  const { occupants, tile, playerPos } = args;
  if (playerPos != null && playerPos.x === tile.x && playerPos.y === tile.y) {
    return true;
  }
  return occupants.some(
    (e) =>
      e.x === tile.x &&
      e.y === tile.y &&
      isAliveCombatant({ hp: Number(e.hp) || 0 }),
  );
}

/** Highlight-legal dest is executable iff nobody living occupies it. */
export function canExecuteSummonWalkDest(args: {
  occupants: ReadonlyArray<SummonWalkOccupant>;
  tile: { x: number; y: number };
  playerPos?: { x: number; y: number } | null;
}): boolean {
  return !summonWalkDestinationOccupied(args);
}
