/**
 * engine/groundDokaSpawn.ts
 *
 * Pure ground-Doka loot roll extracted from WorldExploration portal
 * map-swap. WorldExploration still owns `setDokaLoot`, the claimed-id
 * reset, battle-log copy, and pickup persist (`utils/dokaPersist.ts`).
 *
 * Live rules — do not "improve" them here:
 *   - Death Realm never rolls.
 *   - Chance short-circuits as `rng() * 100 < spawnChance` *before* the
 *     empty-roster check (a miss still consumes one rng draw).
 *   - `dokaSpawnChance === 0` is legal (no ground Doka).
 *   - Count is `max(1, ceil(enemies / 3))` only after the roster is
 *     non-empty.
 *   - Walkable = tile `"floor"`, not void, not the map spawn cell, not an
 *     enemy cell. Portals, hazards, and spawnPolicy keep-clears are NOT
 *     applied — do not fold those in.
 *   - Value is `max(1, round((base + avgLevel * 2) * (0.8 + rng * 0.4)))`.
 *   - Ids are `doka-${now()}-${x}-${y}` with `now()` called per item.
 */

import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import type { DokaLootItem } from "../types/gameTypes.ts";

export type Rng = () => number;

export type GroundDokaEnemyProbe = {
  x?: number;
  y?: number;
  level?: number;
};

export type VoidKeySet = { has(key: string): boolean };

export type GroundDokaSpawnInput = {
  isDeathRealm: boolean;
  spawnChance: number;
  spawnBase: number;
  enemies: readonly GroundDokaEnemyProbe[];
  spawnPosition: { x: number; y: number };
  tiles: readonly (readonly string[])[];
  voidTiles?: VoidKeySet | null;
  rng: Rng;
  now: () => number;
  gridSize?: number;
};

/** Live `Math.max(1, Math.ceil(enemyCount / 3))`. Caller must skip count-0. */
export function groundDokaLootCount(enemyCount: number): number {
  return Math.max(1, Math.ceil(enemyCount / 3));
}

/**
 * Live value formula. `unitRand` is one `rng()` draw in `[0, 1)`.
 * `avgLevel` is `sum(Number(e.level)) / enemies.length` — missing level
 * is `NaN` and stays `NaN` through the product (current behaviour).
 */
export function groundDokaLootValue(
  spawnBase: number,
  avgLevel: number,
  unitRand: number,
): number {
  return Math.max(
    1,
    Math.round((spawnBase + avgLevel * 2) * (0.8 + unitRand * 0.4)),
  );
}

export function averageEnemyLevel(
  enemies: readonly GroundDokaEnemyProbe[],
): number {
  if (enemies.length === 0) return 0;
  return (
    enemies.reduce((sum, enemy) => sum + Number(enemy.level), 0) /
    enemies.length
  );
}

/**
 * Chance gate matching the live `&&` order:
 * death realm → skip (no rng); else roll; else empty roster → skip.
 */
export function shouldSpawnGroundDokaLoot(
  isDeathRealm: boolean,
  spawnChance: number,
  enemyCount: number,
  chanceUnitRand: number,
): boolean {
  if (isDeathRealm) return false;
  if (!(chanceUnitRand * 100 < spawnChance)) return false;
  return enemyCount > 0;
}

export function collectGroundDokaWalkableTiles(args: {
  tiles: readonly (readonly string[])[];
  voidTiles?: VoidKeySet | null;
  spawnPosition: { x: number; y: number };
  enemies: readonly GroundDokaEnemyProbe[];
  gridSize?: number;
}): { x: number; y: number }[] {
  const gridSize = args.gridSize ?? WORLD_GRID_SIZE;
  const walkable: { x: number; y: number }[] = [];
  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      if (
        args.tiles[gy]?.[gx] === "floor" &&
        !args.voidTiles?.has(`${gx},${gy}`) &&
        !(gx === args.spawnPosition.x && gy === args.spawnPosition.y) &&
        !args.enemies.some((enemy) => enemy.x === gx && enemy.y === gy)
      ) {
        walkable.push({ x: gx, y: gy });
      }
    }
  }
  return walkable;
}

function shuffleInPlace<T>(items: T[], rng: Rng): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Full live roll. Returns `[]` when the map should have no ground Doka
 * (death realm, chance miss, empty roster, or no walkable tiles).
 */
export function planGroundDokaLoot(
  input: GroundDokaSpawnInput,
): DokaLootItem[] {
  if (input.isDeathRealm) return [];
  const chanceRoll = input.rng();
  if (
    !shouldSpawnGroundDokaLoot(
      false,
      input.spawnChance,
      input.enemies.length,
      chanceRoll,
    )
  ) {
    return [];
  }
  const avgLevel = averageEnemyLevel(input.enemies);
  const lootCount = groundDokaLootCount(input.enemies.length);
  const walkable = shuffleInPlace(
    collectGroundDokaWalkableTiles({
      tiles: input.tiles,
      voidTiles: input.voidTiles,
      spawnPosition: input.spawnPosition,
      enemies: input.enemies,
      gridSize: input.gridSize,
    }),
    input.rng,
  );
  return walkable.slice(0, lootCount).map((tile) => ({
    id: `doka-${input.now()}-${tile.x}-${tile.y}`,
    tileX: tile.x,
    tileY: tile.y,
    value: groundDokaLootValue(input.spawnBase, avgLevel, input.rng()),
    collected: false,
  }));
}
