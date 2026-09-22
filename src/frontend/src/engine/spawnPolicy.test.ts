import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import type { EnemyFamily } from "../types/gameTypes.ts";
import { generateSeededWorld } from "./mapGen.simulate.ts";
import {
  evaluateSolvability,
  finalizePlayableLayout,
  isEnemyWanderFloor,
} from "./mapGen.ts";
import {
  FAMILY_STAT_MULTS,
  FAMILY_TYPES,
  FAMILY_VARIANT_CHANCE,
  type FamilySpawnTarget,
  MAP_SPAWN_CELL,
  MAP_SPAWN_KEEP_CLEAR_CHEBYSHEV,
  PORTAL_KEEP_CLEAR_MANHATTAN,
  SPAWN_MIN_CHEBYSHEV,
  applyEnemyFamilyStats,
  applyFamilyVariantsToRoster,
  collectValidEnemySpawnCells,
  dungeonScaledEnemyLevel,
  dungeonSpawnExtras,
  generateEnemyScaleFactors,
  isInsideMapSpawnKeepClear,
  isSpawnAdjacentToPortal,
  isSpawnFarEnough,
  maybeApplyEnemyFamilyVariant,
  rollOverworldEnemyCount,
} from "./spawnPolicy.ts";

function seqRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i];
    i += 1;
    if (v === undefined) throw new Error(`rng exhausted at call ${i}`);
    return v;
  };
}

function stub(partial: Partial<FamilySpawnTarget> = {}): FamilySpawnTarget {
  return {
    family: "default",
    hp: 100,
    maxHp: 100,
    damage: 10,
    res: 0.2,
    sp: 8,
    ...partial,
  };
}

function openFloor(): string[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => "floor"),
  );
}

describe("dungeonSpawnExtras", () => {
  it("overworld depth 0 adds no extras", () => {
    assert.deepEqual(dungeonSpawnExtras(0), {
      extraEnemies: 0,
      tierBoost: 0,
    });
  });

  it("matches the WX depth table 1–5 and clamps past 5", () => {
    assert.deepEqual(dungeonSpawnExtras(1), {
      extraEnemies: 2,
      tierBoost: 1,
    });
    assert.deepEqual(dungeonSpawnExtras(2), {
      extraEnemies: 3,
      tierBoost: 2,
    });
    assert.deepEqual(dungeonSpawnExtras(3), {
      extraEnemies: 4,
      tierBoost: 2,
    });
    assert.deepEqual(dungeonSpawnExtras(4), {
      extraEnemies: 4,
      tierBoost: 3,
    });
    assert.deepEqual(dungeonSpawnExtras(5), {
      extraEnemies: 5,
      tierBoost: 3,
    });
    assert.deepEqual(dungeonSpawnExtras(99), dungeonSpawnExtras(5));
  });
});

describe("rollOverworldEnemyCount", () => {
  it("is 1..8 plus dungeon extras (no MAX_ENEMIES cap)", () => {
    assert.equal(
      rollOverworldEnemyCount(0, () => 0),
      1,
    );
    assert.equal(
      rollOverworldEnemyCount(0, () => 0.999),
      8,
    );
    assert.equal(
      rollOverworldEnemyCount(5, () => 0),
      6,
    );
    assert.equal(
      rollOverworldEnemyCount(5, () => 0.999),
      13,
    );
  });
});

describe("dungeonScaledEnemyLevel", () => {
  it("leaves the tier pick unchanged on overworld (boost 0)", () => {
    assert.equal(dungeonScaledEnemyLevel(12, 0, 10), 12);
  });

  it("adds boost * tierSize when boost > 0", () => {
    assert.equal(dungeonScaledEnemyLevel(12, 2, 10), 32);
    assert.equal(dungeonScaledEnemyLevel(1, 1, 10), 11);
  });
});

describe("distance metrics stay distinct", () => {
  it("portal keep-clear is Manhattan, not Chebyshev", () => {
    const portals = [{ x: 5, y: 5 }];
    // Manhattan 2: (7,5) blocked; Chebyshev 2 diagonal (7,7) is Manhattan 4.
    assert.equal(isSpawnAdjacentToPortal(7, 5, portals), true);
    assert.equal(isSpawnAdjacentToPortal(7, 7, portals), false);
    assert.equal(PORTAL_KEEP_CLEAR_MANHATTAN, 2);
  });

  it("map-spawn keep-clear is Chebyshev <= 3 from (8,8)", () => {
    assert.equal(MAP_SPAWN_CELL.x, 8);
    assert.equal(MAP_SPAWN_CELL.y, 8);
    assert.equal(MAP_SPAWN_KEEP_CLEAR_CHEBYSHEV, 3);
    assert.equal(isInsideMapSpawnKeepClear(8, 8), true);
    assert.equal(isInsideMapSpawnKeepClear(11, 8), true);
    assert.equal(isInsideMapSpawnKeepClear(12, 8), false);
    // Diagonal Chebyshev 3 is blocked; Manhattan 6 would look "far".
    assert.equal(isInsideMapSpawnKeepClear(11, 11), true);
    // Live spawn (void at center, spiral to the border) must keep-clear
    // around the actual cell, not the hardcoded (8,8) diamond.
    assert.equal(isInsideMapSpawnKeepClear(12, 8, { x: 12, y: 8 }), true);
    assert.equal(isInsideMapSpawnKeepClear(8, 8, { x: 12, y: 8 }), false);
  });

  it("enemy spacing is Chebyshev >= 4 (not the battle-start 2/3)", () => {
    assert.equal(SPAWN_MIN_CHEBYSHEV, 4);
    const placed = [{ x: 0, y: 0 }];
    assert.equal(isSpawnFarEnough({ x: 3, y: 0 }, placed), false);
    assert.equal(isSpawnFarEnough({ x: 4, y: 0 }, placed), true);
    assert.equal(isSpawnFarEnough({ x: 3, y: 3 }, placed), false);
    assert.equal(isSpawnFarEnough({ x: 4, y: 4 }, placed), true);
  });
});

describe("collectValidEnemySpawnCells", () => {
  it("keeps floors that are not portal-adjacent, not spawn-clear, not void", () => {
    const tiles = openFloor();
    tiles[0][0] = "wall";
    const cells = collectValidEnemySpawnCells(
      tiles,
      [{ x: 0, y: 2 }],
      new Set(["1,1"]),
    );
    const keys = new Set(cells.map((c) => `${c.x},${c.y}`));
    assert.equal(keys.has("0,0"), false); // wall
    assert.equal(keys.has("1,1"), false); // void
    assert.equal(keys.has("0,2"), false); // portal cell (Manhattan 0)
    assert.equal(keys.has("2,2"), false); // portal Manhattan 2
    assert.equal(keys.has("8,8"), false); // map spawn
    assert.equal(keys.has("11,8"), false); // spawn keep-clear edge
    assert.equal(keys.has("12,8"), true);
    assert.equal(keys.has("3,2"), true); // Manhattan 3 from portal
  });

  it("seed-portal-cut-far-spawn: does not place a rat on the far island of a choke", () => {
    // 1-wide east-west corridor, portal choke at (3,8). Keep-clear eats the
    // center 7×7, so (0,8) (Manhattan 3 from the gate) used to be a legal
    // spawn despite being fight-graph-isolated — melee cannot cross a
    // battle-impassable portal, so isProgressionLocked never clears.
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => "wall"),
    );
    for (let x = 0; x <= 12; x++) tiles[8][x] = "floor";
    tiles[8][3] = "portal";
    const portals = [{ x: 3, y: 8 }];
    const unfilteredFar = !isSpawnAdjacentToPortal(0, 8, portals);
    assert.equal(unfilteredFar, true, "fixture far cell must pass keep-clear");
    assert.equal(isInsideMapSpawnKeepClear(0, 8), false);
    assert.equal(isInsideMapSpawnKeepClear(12, 8), false);

    const cells = collectValidEnemySpawnCells(tiles, portals, new Set(), {
      x: 8,
      y: 8,
    });
    const keys = new Set(cells.map((c) => `${c.x},${c.y}`));
    assert.equal(
      keys.has("0,8"),
      false,
      "far-island floor must not be a spawn candidate",
    );
    assert.equal(keys.has("1,8"), false);
    assert.equal(keys.has("2,8"), false);
    assert.equal(
      keys.has("12,8"),
      true,
      "near-side border floor must stay legal",
    );
  });

  it("falls back to keep-clear fight-graph cells, not the far island", () => {
    // Near side is only the keep-clear diamond; every keep-clear-legal
    // floor sits past the choke. Falling back to allValid used to drop a
    // rat on (0,8). Finalize cannot punch when the near cell is boxed by
    // voids — isProgressionLocked never clears.
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => "wall"),
    );
    for (let x = 0; x <= 3; x++) tiles[8][x] = "floor";
    tiles[8][3] = "portal";
    tiles[8][8] = "floor";
    const voids = new Set<string>();
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      voids.add(`${8 + dx},${8 + dy}`);
    }
    const cells = collectValidEnemySpawnCells(tiles, [{ x: 3, y: 8 }], voids, {
      x: 8,
      y: 8,
    });
    const keys = new Set(cells.map((c) => `${c.x},${c.y}`));
    assert.equal(
      keys.has("0,8"),
      false,
      "far-island floor must not be the keep-clear fallback",
    );
    assert.equal(
      keys.has("8,8"),
      true,
      "fallback must still place someone on the fight graph",
    );

    const placed = finalizePlayableLayout({
      tiles,
      voidTiles: voids,
      playerSpawn: { x: 8, y: 8 },
      portals: [{ x: 3, y: 8 }],
      spawns: cells.map((c) => ({ ...c })),
      w: WORLD_GRID_SIZE,
      h: WORLD_GRID_SIZE,
    });
    const after = evaluateSolvability(
      placed.tiles,
      voids,
      placed.playerSpawn,
      placed.portals,
      placed.spawns,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(after.isolatedEnemies, 0, after.failures.join(","));
    assert.equal(after.clearingUnlocks, true, after.failures.join(","));
  });

  it("seed-portal-ring-only-near: last-resort places on the gate ring, not past the choke", () => {
    // Portal on the spawn-diamond rim. Every near floor is portal
    // Manhattan ≤ 2, so #436's onGraph (fight-graph AND not portal-adj)
    // is empty. generateEnemies then returns [] and a dungeon progression
    // portal unlocks with no hostiles (skip the run).
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => "wall"),
    );
    for (let x = 8; x <= 12; x++) tiles[8][x] = "floor";
    tiles[8][10] = "portal";
    const portals = [{ x: 10, y: 8 }];
    const spawn = { x: 8, y: 8 };
    assert.equal(
      isSpawnAdjacentToPortal(8, 8, portals),
      true,
      "spawn itself is inside the portal ring",
    );
    assert.equal(isSpawnAdjacentToPortal(9, 8, portals), true);
    assert.equal(
      isSpawnAdjacentToPortal(12, 8, portals),
      true,
      "far cell is also portal-adjacent; unfiltered keep-clear is empty",
    );

    const cells = collectValidEnemySpawnCells(tiles, portals, new Set(), spawn);
    const keys = new Set(cells.map((c) => `${c.x},${c.y}`));
    assert.ok(cells.length > 0, "must not skip the room");
    assert.equal(keys.has("11,8"), false, "far island must stay empty");
    assert.equal(keys.has("12,8"), false, "far island must stay empty");
    assert.equal(keys.has("10,8"), false, "must not sit on the portal tile");
    assert.equal(
      keys.has("9,8"),
      true,
      "last resort is the near-side portal ring",
    );

    const placed = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: spawn,
      portals,
      spawns: cells.map((c) => ({ ...c })),
      w: WORLD_GRID_SIZE,
      h: WORLD_GRID_SIZE,
    });
    const after = evaluateSolvability(
      placed.tiles,
      new Set(),
      placed.playerSpawn,
      placed.portals,
      placed.spawns,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(after.isolatedEnemies, 0);
    assert.equal(after.clearingUnlocks, true);
  });

  it("seeded chessboard maps stay on the fight graph when a near cell exists", () => {
    const seeds = Array.from({ length: 64 }, (_, i) => 2400 + i * 19);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "none",
        archetype: "chessboard",
        finalize: false,
      });
      const cells = collectValidEnemySpawnCells(
        world.tiles,
        world.portals,
        world.voidTiles,
        world.playerSpawn,
      );
      const size = world.tiles[0]?.length ?? WORLD_GRID_SIZE;
      const isolated = cells.filter(
        (cell) =>
          !isEnemyWanderFloor(
            world.tiles,
            world.voidTiles,
            world.portals,
            world.playerSpawn,
            cell,
            size,
            world.tiles.length,
          ),
      );
      if (isolated.length > 0) {
        failures.push(
          `seed ${seed}: far-island spawns ${isolated.map((c) => `${c.x},${c.y}`).join("/")}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});

describe("generateEnemyScaleFactors", () => {
  it("consumes two unused draws before the variation roll (tall branch)", () => {
    const rng = seqRng([
      0.11, // unused scaleX
      0.22, // unused scaleY
      0.0, // variation < 0.3 → tall
      0.5, // scaleX
      0.5, // scaleY
    ]);
    assert.deepEqual(generateEnemyScaleFactors(rng), {
      scaleX: 0.5 * 0.3 + 0.6,
      scaleY: 0.5 * 0.4 + 1.1,
    });
  });

  it("wide branch when 0.3 <= variation < 0.6", () => {
    const rng = seqRng([0, 0, 0.3, 0.5, 0.5]);
    assert.deepEqual(generateEnemyScaleFactors(rng), {
      scaleX: 0.5 * 0.4 + 1.1,
      scaleY: 0.5 * 0.3 + 0.6,
    });
  });

  it("uniform branch when variation >= 0.6 uses one shared scale", () => {
    const rng = seqRng([0, 0, 0.6, 0.5]);
    const scale = 0.5 * (1.4 - 0.6) + 0.6;
    assert.deepEqual(generateEnemyScaleFactors(rng), {
      scaleX: scale,
      scaleY: scale,
    });
  });
});

describe("applyEnemyFamilyStats", () => {
  it("applies every catalog family HP/damage/res/sp and leaves ap/mp unused", () => {
    for (const fam of FAMILY_TYPES) {
      const m = FAMILY_STAT_MULTS[fam];
      const en = applyEnemyFamilyStats(stub({ hp: 100, damage: 10 }), fam);
      assert.equal(en.family, fam);
      assert.equal(en.hp, Math.max(1, Math.round(100 * m.hpMult)));
      assert.equal(en.maxHp, en.hp);
      assert.equal(en.damage, Math.max(1, Math.round(10 * m.dmgMult)));
      assert.equal(en.res, m.res);
      assert.equal(en.sp, m.spRes);
      assert.equal("ap" in en, false);
      assert.equal("mp" in en, false);
    }
  });

  it("floors hp and damage at 1", () => {
    const en = applyEnemyFamilyStats(stub({ hp: 1, damage: 1 }), "plague_rat");
    assert.equal(en.hp, 1);
    assert.equal(en.damage, 1);
  });

  it("treats missing damage as 0 before the 1-floor", () => {
    const en = applyEnemyFamilyStats(stub({ damage: undefined }), "iron_golem");
    assert.equal(en.damage, 1);
  });
});

describe("maybeApplyEnemyFamilyVariant", () => {
  it("does not mutate when the 30% roll fails", () => {
    const en = stub();
    const applied = maybeApplyEnemyFamilyVariant(en, seqRng([0.3]));
    assert.equal(applied, false);
    assert.equal(en.family, "default");
    assert.equal(en.hp, 100);
    assert.equal(FAMILY_VARIANT_CHANCE, 0.3);
  });

  it("picks the first family when the index roll is 0", () => {
    const en = stub();
    const applied = maybeApplyEnemyFamilyVariant(en, seqRng([0.29, 0]));
    assert.equal(applied, true);
    assert.equal(en.family, FAMILY_TYPES[0]);
    assert.equal(en.family, "wraith_bishop");
    assert.equal(en.hp, 60);
    assert.equal(en.damage, 14);
  });

  it("picks the last family at the top of the unit interval", () => {
    const en = stub();
    const last = FAMILY_TYPES[FAMILY_TYPES.length - 1];
    const applied = maybeApplyEnemyFamilyVariant(en, seqRng([0, 0.999]));
    assert.equal(applied, true);
    assert.equal(en.family, last);
    assert.equal(en.family, "void_mirror");
  });
});

describe("applyFamilyVariantsToRoster", () => {
  it("calls onApplied only for units that rolled a family", () => {
    const a = stub();
    const b = stub();
    const seen: string[] = [];
    // a: fail 0.3; b: succeed 0 + first family
    applyFamilyVariantsToRoster([a, b], seqRng([0.3, 0, 0]), (en) => {
      seen.push(en.family);
    });
    assert.equal(a.family, "default");
    assert.equal(b.family, "wraith_bishop");
    assert.deepEqual(seen, ["wraith_bishop"]);
  });

  it("catalog lists exactly the seven non-default families", () => {
    const expected: EnemyFamily[] = [
      "wraith_bishop",
      "iron_golem",
      "plague_rat",
      "ember_knight",
      "tide_shade",
      "bone_scribe",
      "void_mirror",
    ];
    assert.deepEqual([...FAMILY_TYPES], expected);
  });
});
