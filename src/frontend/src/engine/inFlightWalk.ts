/**
 * Leftover player-walk rAF still owns `movementPath` after last-MP spend
 * flips HUD to attack. Canvas has no `isMoving` gate, so a ground summon
 * can land on a remaining path tile and the stepper then stacks the player
 * on that summon. Occupancy only checks live combatants + the current
 * player tile — upcoming path cells are treated as free.
 *
 * Official Swap (#541) aborts leftover walk after teleport. Player summons
 * need the same abort before spawn so the clicked dest is free and the
 * leftover stepper cannot walk onto the new unit. Do not change walk rAF
 * timing or MP debit.
 */

export type WalkCell = { x: number; y: number };

/** True while leftover rAF still has tiles to commit. */
export function shouldAbortInFlightWalkAfterSummon(
  pathLength: number,
): boolean {
  return pathLength > 0;
}

/** Upcoming walk cells the leftover stepper will still visit. */
export function remainingWalkOccupies(
  cell: WalkCell,
  path: ReadonlyArray<WalkCell>,
): boolean {
  return path.some((step) => step.x === cell.x && step.y === cell.y);
}

/**
 * After abort, leftover path is empty so the clicked dest is no longer
 * reserved. Before abort, dest-on-path must not be treated as free.
 */
export function leftoverWalkAfterSummonAbort(
  path: ReadonlyArray<WalkCell>,
): WalkCell[] {
  if (!shouldAbortInFlightWalkAfterSummon(path.length)) {
    return path.map((step) => ({ x: step.x, y: step.y }));
  }
  return [];
}
