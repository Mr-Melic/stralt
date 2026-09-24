import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  reportWorld,
  simulateCorpsesOnWorld,
  simulateSummonsOnWorld,
} from "./mapGen.simulate.ts";
import {
  MAP_ARCHETYPES,
  countFreeProgressionDumpCells,
  countProgressionDumpCells,
  evaluateSolvability,
  finalizePlayableLayout,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

/**
 * Unique player→exit corridor with two side alcoves, both occupied by
 * hostiles. dump=2 so ensureProgressionAlcove skips; free dump=0 so a
 * corpse/summon had nowhere to sit but the bridge.
 */
function occupiedDumpFixture() {
  const tiles = [
    [W, W, W, W, W, W, W],
    [W, F, W, W, W, W, W],
    [W, F, F, F, F, W, W],
    [W, F, W, W, W, W, W],
    [W, W, W, W, W, W, W],
  ];
  tiles[2][4] = "portal";
  return {
    tiles,
    playerSpawn: { x: 1, y: 2 },
    portals: [{ x: 4, y: 2 }],
    spawns: [
      { x: 1, y: 1 },
      { x: 1, y: 3 },
    ],
    w: 7,
    h: 5,
  };
}

describe("occupied dump cells cannot fake a progression alcove", () => {
  it("seed-two-occupied-dumps: fixture starts with dump>0 and free dump=0", () => {
    const fx = occupiedDumpFixture();
    const dump = countProgressionDumpCells(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.w,
      fx.h,
    );
    assert.ok(dump.mandatory > 0, "unique corridor must have a bridge");
    assert.equal(dump.dump, 2, "both alcoves count as dump before occupancy");
    const free = countFreeProgressionDumpCells(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.spawns,
      fx.w,
      fx.h,
    );
    assert.equal(free.free, 0, "hostiles occupy every dump cell");
    const before = evaluateSolvability(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.spawns,
      fx.w,
      fx.h,
    );
    assert.equal(
      before.failures.includes("no-free-dump-cell"),
      true,
      before.failures.join(","),
    );
  });

  it("seed-two-occupied-dumps: finalize punches a free alcove", () => {
    const fx = occupiedDumpFixture();
    const finalized = finalizePlayableLayout({
      tiles: fx.tiles,
      voidTiles: new Set(),
      playerSpawn: fx.playerSpawn,
      portals: fx.portals,
      spawns: fx.spawns,
      w: fx.w,
      h: fx.h,
    });
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      fx.w,
      fx.h,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    const free = countFreeProgressionDumpCells(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      fx.w,
      fx.h,
    );
    assert.ok(free.free >= 1, "must punch an unoccupied dump cell");
    const world = {
      tiles: finalized.tiles,
      voidTiles: new Set<string>(),
      portals: finalized.portals,
      playerSpawn: finalized.playerSpawn,
      spawns: finalized.spawns,
      runMode: "dungeon" as const,
      archetype: "corridorMaze" as const,
      seed: 0,
    };
    const corpses = simulateCorpsesOnWorld(world);
    assert.equal(corpses.sealed, false, "relocated corpses must leave a route");
    const summons = simulateSummonsOnWorld(world, 1);
    assert.equal(
      summons.sealed,
      false,
      "one summon must not sit on the bridge",
    );
  });

  it("seed-one-occupied-dump: a single occupied alcove still gets a free cell", () => {
    const tiles = [
      [W, W, W, W, W, W, W],
      [W, F, W, W, W, W, W],
      [W, F, F, F, F, W, W],
      [W, W, W, W, W, W, W],
    ];
    tiles[2][4] = "portal";
    const beforeFree = countFreeProgressionDumpCells(
      tiles,
      new Set(),
      { x: 1, y: 2 },
      [{ x: 4, y: 2 }],
      [{ x: 1, y: 1 }],
      7,
      4,
    );
    assert.equal(beforeFree.dump, 1);
    assert.equal(beforeFree.free, 0);
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 2 },
      portals: [{ x: 4, y: 2 }],
      spawns: [{ x: 1, y: 1 }],
      w: 7,
      h: 4,
    });
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      7,
      4,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    const free = countFreeProgressionDumpCells(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      7,
      4,
    );
    assert.ok(free.free >= 1);
  });
});

describe("seeded worlds keep an unoccupied dump cell", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);
  const archetypes = MAP_ARCHETYPES.map((a) => a.type);

  it(`keeps free dump across ${seeds.length} dungeon seeds`, () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: archetypes[seed % archetypes.length],
      });
      const report = reportWorld(world);
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
        continue;
      }
      const free = countFreeProgressionDumpCells(
        world.tiles,
        world.voidTiles,
        world.playerSpawn,
        world.portals,
        world.spawns,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      if (free.mandatory > 0 && free.free === 0) {
        failures.push(`seed ${seed}: occupied-only dump`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush rooms keep a free dump cell across seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededBossRushRoom(seed);
      const report = reportWorld(world);
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
        continue;
      }
      const free = countFreeProgressionDumpCells(
        world.tiles,
        world.voidTiles,
        world.playerSpawn,
        world.portals,
        world.spawns,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
      if (free.mandatory > 0 && free.free === 0) {
        failures.push(`seed ${seed}: occupied-only dump`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
