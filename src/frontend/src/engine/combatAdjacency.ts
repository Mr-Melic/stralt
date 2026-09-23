/**
 * Shared board adjacency used by player casts, enemy melee, boss AI,
 * and attract/push resolution.
 *
 * Player Strike / enemy melee / Attack Nearest live gates use Chebyshev
 * (`max(|dx|,|dy|)`). A diagonally neighboring tile is melee-legal.
 *
 * Boss decide still uses Manhattan (`|dx|+|dy|`) for `isAdjacent` and
 * kit range bands. That is a different policy — same split as player
 * LoS (`!!lineOfSight`) vs enemy LoS (`lineOfSight !== false`). Do not
 * merge the metrics: swapping boss melee onto Chebyshev would let every
 * boss attack on the diagonal and rebalance those fights.
 *
 * Attract stop-before-stack uses Manhattan ≤ 1 (self or cardinal). A
 * Chebyshev-adjacent (diagonal) unit is still pulled one step. Keep that.
 */

import { chebyshevOnBoard } from "./targeting.ts";

export type BoardCell = { x: number; y: number };

/** Manhattan distance. Boss adjacency / attract stop / boss kit bands. */
export function manhattanOnBoard(a: BoardCell, b: BoardCell): number {
  const ax = Number(a.x);
  const ay = Number(a.y);
  const bx = Number(b.x);
  const by = Number(b.y);
  if (![ax, ay, bx, by].every(Number.isFinite)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/**
 * Player Strike range 1 and enemy melee execute (`nd <= 1`, excluding self).
 * Same metric as {@link chebyshevOnBoard} in the live gate.
 */
export function isChebyshevMeleeAdjacent(a: BoardCell, b: BoardCell): boolean {
  const d = chebyshevOnBoard(a, b);
  return d > 0 && d <= 1;
}

/**
 * Boss `isAdjacent`: cardinal only (`manhattan === 1`). Diagonal is not
 * melee — Final Pawn treats Manhattan 2 as a ranged band instead.
 */
export function isManhattanAdjacent(a: BoardCell, b: BoardCell): boolean {
  return manhattanOnBoard(a, b) === 1;
}

/**
 * Attract halt: already on the attractor or a cardinal neighbor.
 * Matches occupancy `applyAttract` (`manhattan <= 1`).
 */
export function attractStopsBeforeStacking(
  cur: BoardCell,
  toward: BoardCell,
): boolean {
  return manhattanOnBoard(cur, toward) <= 1;
}

/** Enemy melee execute after a step: Chebyshev ≤ 1, same as Strike range 1. */
export function canExecuteEnemyMelee(
  origin: BoardCell,
  target: BoardCell,
): boolean {
  return isChebyshevMeleeAdjacent(origin, target);
}
