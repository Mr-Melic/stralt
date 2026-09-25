/**
 * Overworld enemy wander helpers. WorldExploration.updateEnemyMovement owns
 * the RAF tick, battle/shop/transition gates, findPath, and syncCombatants.
 * This module is React-free.
 *
 * Target picks stay on the origin's battle-walkable island
 * (`isEnemyWanderFloor`). That is NOT spawn keep-clear: portal Manhattan ≤ 2
 * and map-spawn Chebyshev ≤ 3 from (8, 8) must not be folded in here.
 *
 * Path interpolation, facing, and ENEMY_MOVE_INTERVAL_* reschedule live here
 * (`advanceEnemyWander`). findPath stays in WorldExploration (battle portals
 * + barrierTilesRef + inBattleRef).
 */

import {
  ENEMY_MOVE_INTERVAL_MAX,
  ENEMY_MOVE_INTERVAL_MIN,
  WORLD_GRID_SIZE,
} from "../data/gameConstants.ts";
import { isEnemyWanderFloor } from "./mapGen.ts";

export type WanderEnemyProbe = {
  isMoving?: boolean;
  isWandering?: boolean;
  nextMoveTime?: number;
};

export type WanderRng = () => number;

export type WanderPathPoint = { x: number; y: number };

export type WanderView = "front" | "back" | "left" | "right";

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

export type WanderStepEnemy = {
  x: number;
  y: number;
  isMoving: boolean;
  isWandering?: boolean;
  movementPath: WanderPathPoint[];
  currentStepIndex?: number;
  movementStartTime?: number;
  movementSpeed?: number;
  currentView: WanderView;
  nextMoveTime: number;
  lastMoveTime?: number;
  wanderTarget?: WanderPathPoint | null;
  movementRange?: number;
};

export type AdvanceEnemyWanderInput = {
  now: number;
  pickTarget: (enemy: WanderStepEnemy) => WanderPathPoint | null;
  findPath: (from: WanderPathPoint, to: WanderPathPoint) => WanderPathPoint[];
  rng?: WanderRng;
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

/**
 * Same [min, max] roll WorldExploration used on wander complete / retry.
 * Called only on those two paths — a successful start-move must not consume
 * an rng sample (it would shift later Math.random draws in the same tick).
 */
export function rollEnemyWanderDelay(
  rng: WanderRng = Math.random,
  min: number = ENEMY_MOVE_INTERVAL_MIN,
  max: number = ENEMY_MOVE_INTERVAL_MAX,
): number {
  return rng() * (max - min) + min;
}

/**
 * Cardinal facing from one path cell to the next. Unchanged axes keep
 * `fallback` (including a zero-length step).
 */
export function wanderFacingFromStep(
  prev: WanderPathPoint,
  current: WanderPathPoint,
  fallback: WanderView,
): WanderView {
  if (current.x > prev.x) return "right";
  if (current.x < prev.x) return "left";
  if (current.y > prev.y) return "front";
  if (current.y < prev.y) return "back";
  return fallback;
}

/**
 * One enemy's overworld wander step. WorldExploration still decides whether
 * the roster should tick and still injects findPath.
 */
export function advanceEnemyWander<T extends WanderStepEnemy>(
  enemy: T,
  input: AdvanceEnemyWanderInput,
): { enemy: T; changed: boolean } {
  const rng = input.rng ?? Math.random;
  if (enemy.isMoving) {
    const elapsed = input.now - enemy.movementStartTime!;
    const stepDuration =
      enemy.movementSpeed! / Math.max(enemy.movementPath.length, 1);
    const targetStepIndex = Math.floor(elapsed / stepDuration);
    if (targetStepIndex >= enemy.movementPath.length) {
      const finalPosition = enemy.movementPath[enemy.movementPath.length - 1];
      const nextMoveDelay = rollEnemyWanderDelay(rng);
      return {
        changed: true,
        enemy: {
          ...enemy,
          x: finalPosition.x,
          y: finalPosition.y,
          isMoving: false,
          movementPath: [],
          currentStepIndex: 0,
          nextMoveTime: input.now + nextMoveDelay,
          lastMoveTime: input.now,
          wanderTarget: null,
        },
      };
    }
    if (targetStepIndex > enemy.currentStepIndex!) {
      const newPosition = enemy.movementPath[targetStepIndex];
      let newView = enemy.currentView;
      if (targetStepIndex > 0) {
        const prev = enemy.movementPath[targetStepIndex - 1];
        const current = enemy.movementPath[targetStepIndex];
        newView = wanderFacingFromStep(prev, current, enemy.currentView);
      }
      return {
        changed: true,
        enemy: {
          ...enemy,
          x: newPosition.x,
          y: newPosition.y,
          currentView: newView,
          currentStepIndex: targetStepIndex,
        },
      };
    }
    return { enemy, changed: false };
  }
  if (input.now >= enemy.nextMoveTime && enemy.isWandering) {
    const target = input.pickTarget(enemy);
    if (target) {
      const path = input.findPath({ x: enemy.x, y: enemy.y }, target);
      if (path.length > 0) {
        return {
          changed: true,
          enemy: {
            ...enemy,
            isMoving: true,
            movementPath: path,
            currentStepIndex: 0,
            movementStartTime: input.now,
            wanderTarget: target,
          },
        };
      }
    }
    const nextMoveDelay = rollEnemyWanderDelay(rng);
    return {
      changed: true,
      enemy: {
        ...enemy,
        nextMoveTime: input.now + nextMoveDelay,
      },
    };
  }
  return { enemy, changed: false };
}
