/**
 * Overworld enemy wander helpers. WorldExploration.updateEnemyMovement owns
 * the RAF tick, path interpolation, view facing, and findPath. This module
 * is React-free.
 *
 * Target picks stay on the origin's battle-walkable island
 * (`isEnemyWanderFloor`). That is NOT spawn keep-clear: portal Manhattan ≤ 2
 * and map-spawn Chebyshev ≤ 3 from (8, 8) must not be folded in here.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { isEnemyWanderFloor } from "./mapGen.ts";

export type WanderEnemyProbe = {
  isMoving?: boolean;
  isWandering?: boolean;
  nextMoveTime?: number;
};

export type WanderRng = () => number;

/** Same 50-try budget WorldExploration used before the extraction. */
export const WANDER_TARGET_ATTEMPTS = 50;

export type PickRandomWanderTargetInput = {
  voidTiles?: Set<string> | Map<string, unknown>;
  portals?: readonly { x: number; y: number }[];
  gridWidth?: number;
  gridHeight?: number;
  rng?: WanderRng;
  attempts?: number;
};

/**
 * Skip the per-frame enemies.map() when nobody is moving and nobody is due.
 */
export function shouldTickEnemyWander(
  enemies: readonly WanderEnemyProbe[],
  now: number,
): boolean {
  for (const enemy of enemies) {
    if (enemy.isMoving) return true;
    if (
      enemy.isWandering === true &&
      now >= (enemy.nextMoveTime ?? Number.POSITIVE_INFINITY)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Chebyshev-box fallback used when an overworld enemy is due to wander.
 * Independent axis draws in [-range, range]; origin, walls, voids, portal
 * tiles, and cells off the origin fight graph are skipped. Exhausting
 * `attempts` returns null so the RAF tick can reschedule.
 */
export function pickRandomWanderTarget(
  tiles: string[][],
  currentX: number,
  currentY: number,
  range: number,
  input: PickRandomWanderTargetInput = {},
): { x: number; y: number } | null {
  const gridWidth = input.gridWidth ?? WORLD_GRID_SIZE;
  const gridHeight = input.gridHeight ?? gridWidth;
  const rng = input.rng ?? Math.random;
  const attempts = input.attempts ?? WANDER_TARGET_ATTEMPTS;
  const portals = input.portals ?? [];
  const voidTiles = input.voidTiles;
  for (let i = 0; i < attempts; i++) {
    const deltaX = Math.floor(rng() * (range * 2 + 1)) - range;
    const deltaY = Math.floor(rng() * (range * 2 + 1)) - range;
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    if (
      newX >= 0 &&
      newX < gridWidth &&
      newY >= 0 &&
      newY < gridHeight &&
      tiles[newY][newX] === "floor" &&
      !voidTiles?.has(`${newX},${newY}`) &&
      (newX !== currentX || newY !== currentY) &&
      isEnemyWanderFloor(
        tiles,
        voidTiles,
        portals as { x: number; y: number }[],
        { x: currentX, y: currentY },
        { x: newX, y: newY },
        gridWidth,
        gridHeight,
      )
    ) {
      return { x: newX, y: newY };
    }
  }
  return null;
}
