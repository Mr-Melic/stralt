import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import type { DokaLootItem } from "../types/gameTypes.ts";
import {
  type GroundDokaEnemyProbe,
  type GroundDokaSpawnInput,
  averageEnemyLevel,
  collectGroundDokaWalkableTiles,
  groundDokaLootCount,
  groundDokaLootValue,
  planGroundDokaLoot,
  shouldSpawnGroundDokaLoot,
} from "./groundDokaSpawn.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change chance order, count, walkable filter, or value.
 * Do not "improve" these.
 */
function legacyShouldSpawn(
  isDeathRealm: boolean,
  spawnChance: number,
  enemyCount: number,
  unitRand: number,
): boolean {
  return !isDeathRealm && unitRand * 100 < spawnChance && enemyCount > 0;
}

function legacyLootCount(enemyCount: number): number {
  return Math.max(1, Math.ceil(enemyCount / 3));
}

function legacyLootValue(
  spawnBase: number,
  avgLevel: number,
  unitRand: number,
): number {
  return Math.max(
    1,
    Math.round((spawnBase + avgLevel * 2) * (0.8 + unitRand * 0.4)),
  );
}

function seqRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i];
    i += 1;
    if (v === undefined) throw new Error(`rng exhausted at call ${i}`);
    return v;
  };
}

function floorGrid(
  size = WORLD_GRID_SIZE,
  walls: ReadonlySet<string> = new Set(),
): string[][] {
  const tiles: string[][] = [];
  for (let y = 0; y < size; y++) {
    const row: string[] = [];
    for (let x = 0; x < size; x++) {
      row.push(walls.has(`${x},${y}`) ? "wall" : "floor");
    }
    tiles.push(row);
  }
  return tiles;
}

function baseInput(
  partial: Partial<GroundDokaSpawnInput> = {},
): GroundDokaSpawnInput {
  return {
    isDeathRealm: false,
    spawnChance: 100,
    spawnBase: 5,
    enemies: [{ x: 1, y: 1, level: 2 }],
    spawnPosition: { x: 8, y: 8 },
    tiles: floorGrid(),
    voidTiles: new Set<string>(),
    rng: () => 0,
    now: () => 1_700_000_000_000,
    ...partial,
  };
}

describe("shouldSpawnGroundDokaLoot", () => {
  it("matches the live && order including dokaSpawnChance=0", () => {
    assert.equal(shouldSpawnGroundDokaLoot(true, 100, 4, 0), false);
    assert.equal(legacyShouldSpawn(true, 100, 4, 0), false);
    assert.equal(shouldSpawnGroundDokaLoot(false, 0, 4, 0.5), false);
    assert.equal(legacyShouldSpawn(false, 0, 4, 0.5), false);
    assert.equal(shouldSpawnGroundDokaLoot(false, 40, 4, 0.399), true);
    assert.equal(legacyShouldSpawn(false, 40, 4, 0.399), true);
    assert.equal(shouldSpawnGroundDokaLoot(false, 40, 4, 0.4), false);
    assert.equal(legacyShouldSpawn(false, 40, 4, 0.4), false);
    assert.equal(shouldSpawnGroundDokaLoot(false, 100, 0, 0), false);
    assert.equal(legacyShouldSpawn(false, 100, 0, 0), false);
  });
});

describe("groundDokaLootCount / value / average", () => {
  it("uses ceil(enemies/3) with a floor of 1", () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 9]) {
      assert.equal(groundDokaLootCount(n), legacyLootCount(n));
    }
    assert.equal(groundDokaLootCount(1), 1);
    assert.equal(groundDokaLootCount(3), 1);
    assert.equal(groundDokaLootCount(4), 2);
    assert.equal(groundDokaLootCount(7), 3);
  });

  it("matches (base + avgLevel*2) * (0.8..1.2) rounded, floored at 1", () => {
    assert.equal(groundDokaLootValue(5, 1, 0), legacyLootValue(5, 1, 0));
    assert.equal(groundDokaLootValue(5, 1, 1), legacyLootValue(5, 1, 1));
    assert.equal(groundDokaLootValue(5, 1, 0), 6);
    assert.equal(groundDokaLootValue(5, 1, 1), 8);
    assert.equal(groundDokaLootValue(0, 0, 0), 1);
    assert.equal(
      groundDokaLootValue(5, 10, 0.25),
      legacyLootValue(5, 10, 0.25),
    );
  });

  it("averages Number(level) including missing → NaN", () => {
    assert.equal(averageEnemyLevel([{ level: 2 }, { level: 4 }]), 3);
    assert.equal(averageEnemyLevel([]), 0);
    assert.ok(Number.isNaN(averageEnemyLevel([{}])));
  });
});

describe("collectGroundDokaWalkableTiles", () => {
  it("keeps floor tiles and drops walls, void, spawn, and enemy cells", () => {
    const tiles = floorGrid(WORLD_GRID_SIZE, new Set(["0,0"]));
    const walkable = collectGroundDokaWalkableTiles({
      tiles,
      voidTiles: new Set(["2,2"]),
      spawnPosition: { x: 8, y: 8 },
      enemies: [{ x: 3, y: 4 }],
    });
    const keys = new Set(walkable.map((t) => `${t.x},${t.y}`));
    assert.equal(keys.has("0,0"), false);
    assert.equal(keys.has("2,2"), false);
    assert.equal(keys.has("8,8"), false);
    assert.equal(keys.has("3,4"), false);
    assert.equal(keys.has("1,1"), true);
    assert.equal(walkable.length, WORLD_GRID_SIZE * WORLD_GRID_SIZE - 4);
  });

  it("does not apply portal or map-spawn keep-clear", () => {
    const walkable = collectGroundDokaWalkableTiles({
      tiles: floorGrid(),
      spawnPosition: { x: 8, y: 8 },
      enemies: [],
    });
    const keys = new Set(walkable.map((t) => `${t.x},${t.y}`));
    // Portal-adjacent (0,1) and Chebyshev-3-from-(8,8) (7,8) stay eligible.
    assert.equal(keys.has("0,1"), true);
    assert.equal(keys.has("7,8"), true);
    assert.equal(keys.has("8,8"), false);
  });
});

describe("planGroundDokaLoot", () => {
  it("does not draw rng on Death Realm", () => {
    const loot = planGroundDokaLoot(
      baseInput({
        isDeathRealm: true,
        rng: () => {
          throw new Error("rng must not run on death realm");
        },
      }),
    );
    assert.deepEqual(loot, []);
  });

  it("consumes the chance draw before the empty-roster check", () => {
    const draws: number[] = [];
    const loot = planGroundDokaLoot(
      baseInput({
        enemies: [],
        spawnChance: 100,
        rng: () => {
          draws.push(0);
          return 0;
        },
      }),
    );
    assert.deepEqual(loot, []);
    assert.deepEqual(draws, [0]);
  });

  it("returns [] on a chance miss without shuffling", () => {
    const rng = seqRng([0.5]);
    const loot = planGroundDokaLoot(baseInput({ spawnChance: 40, rng }));
    assert.deepEqual(loot, []);
  });

  it("places ceil(n/3) coins with live ids, values, and collected:false", () => {
    const enemies: GroundDokaEnemyProbe[] = [
      { x: 1, y: 1, level: 2 },
      { x: 2, y: 2, level: 2 },
      { x: 3, y: 3, level: 2 },
      { x: 4, y: 4, level: 2 },
    ];
    // chance 0; then Fisher-Yates on 16*16-1-4 = 251 cells (many draws);
    // then one value rng per placed coin. Use a constant rng instead.
    let calls = 0;
    const rng = () => {
      calls += 1;
      return 0;
    };
    const nowCalls: number[] = [];
    const loot = planGroundDokaLoot(
      baseInput({
        enemies,
        rng,
        now: () => {
          nowCalls.push(9);
          return 9;
        },
      }),
    );
    assert.equal(loot.length, 2);
    assert.equal(nowCalls.length, 2);
    for (const item of loot) {
      assert.equal(item.collected, false);
      assert.match(item.id, /^doka-9-\d+-\d+$/);
      assert.equal(item.value, groundDokaLootValue(5, 2, 0));
    }
    assert.notEqual(`${loot[0].tileX},${loot[0].tileY}`, "8,8");
    for (const enemy of enemies) {
      assert.notEqual(
        `${loot[0].tileX},${loot[0].tileY}`,
        `${enemy.x},${enemy.y}`,
      );
    }
    assert.ok(calls >= 1 + loot.length);
  });

  it("matches a fully scripted live shuffle + value + id sequence", () => {
    const size = 3;
    const tiles = floorGrid(size);
    const enemies: GroundDokaEnemyProbe[] = [{ x: 0, y: 0, level: 1 }];
    const spawnPosition = { x: 1, y: 1 };
    // Walkable in gy,gx order excluding enemy (0,0) and spawn (1,1):
    // (1,0) (2,0) (0,1) (2,1) (0,2) (1,2) (2,2)
    const walkable = collectGroundDokaWalkableTiles({
      tiles,
      spawnPosition,
      enemies,
      gridSize: size,
    });
    assert.deepEqual(
      walkable.map((t) => `${t.x},${t.y}`),
      ["1,0", "2,0", "0,1", "2,1", "0,2", "1,2", "2,2"],
    );

    function legacyPlan(rng: () => number, now: () => number): DokaLootItem[] {
      if (!legacyShouldSpawn(false, 100, enemies.length, rng())) return [];
      const avgLevel =
        enemies.reduce((s, e) => s + Number(e.level), 0) / enemies.length;
      const lootCount = legacyLootCount(enemies.length);
      const cells = walkable.map((t) => ({ ...t }));
      for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
      }
      return cells.slice(0, lootCount).map((tile) => ({
        id: `doka-${now()}-${tile.x}-${tile.y}`,
        tileX: tile.x,
        tileY: tile.y,
        value: legacyLootValue(5, avgLevel, rng()),
        collected: false,
      }));
    }

    const script = [0, 0.9, 0.1, 0.4, 0.2, 0.8, 0.3, 0.55];
    const extracted = planGroundDokaLoot({
      isDeathRealm: false,
      spawnChance: 100,
      spawnBase: 5,
      enemies,
      spawnPosition,
      tiles,
      rng: seqRng(script),
      now: () => 42,
      gridSize: size,
    });
    const live = legacyPlan(seqRng(script), () => 42);
    assert.deepEqual(extracted, live);
    assert.equal(extracted.length, 1);
  });
});
