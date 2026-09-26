import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  countBattleStartChokeBridges,
  findBattleStartOffChokeCell,
  floodBattleStartChokeFrom,
  snapBattleStartOffChokePocket,
} from "./battleStartChokePocket.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  simulateBattleStartOnWorld,
  simulateCorpsesOnWorld,
  simulateRestExitEncounter,
} from "./mapGen.simulate.ts";
import { evaluateSolvability } from "./mapGen.ts";

const W = "wall";
const F = "floor";

/**
 * Open room with a 1-cell south pocket. Destack max-spacing sits the
 * player in the pocket so the neck is a unique bridge; four corpses on
 * that neck jointly seal despite the room having abundant dump.
 */
function destackChokePocketFixture() {
  const tiles = [
    [W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, F, W, W],
    [W, W, W, W, W, W, F, W, W],
    [W, W, W, W, W, W, W, W, W],
  ];
  tiles[1][7] = "portal";
  return {
    tiles,
    playerSpawn: { x: 6, y: 5 },
    portals: [{ x: 7, y: 1 }],
    occupied: [{ x: 1, y: 3 }],
    w: 9,
    h: 7,
  };
}

describe("snapBattleStartOffChokePocket", () => {
  it("seed-destack-choke-pocket: snaps out of a side pocket so corpses cannot seal", () => {
    const fx = destackChokePocketFixture();
    const beforeBridges = countBattleStartChokeBridges(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
    );
    assert.ok(beforeBridges > 0, "pocket must start with unique bridges");
    const after = snapBattleStartOffChokePocket(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.equal(after.snapped, true);
    assert.notEqual(
      `${after.playerSpawn.x},${after.playerSpawn.y}`,
      `${fx.playerSpawn.x},${fx.playerSpawn.y}`,
    );
    assert.equal(
      countBattleStartChokeBridges(
        fx.tiles,
        new Set(),
        after.playerSpawn,
        fx.portals,
      ),
      0,
    );
    const afterWorld = {
      tiles: fx.tiles,
      voidTiles: new Set<string>(),
      portals: fx.portals.map((p) => ({ ...p, color: "progression" })),
      playerSpawn: after.playerSpawn,
      spawns: fx.occupied,
      runMode: "dungeon" as const,
      archetype: "openField" as const,
      seed: 0,
    };
    assert.equal(simulateCorpsesOnWorld(afterWorld).sealed, false);
    const report = evaluateSolvability(
      fx.tiles,
      new Set(),
      after.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.equal(report.ok, true, report.failures.join(","));
  });

  it("seed-2105-destack-choke-pocket: asymmetric destack pocket unseals after snap", () => {
    const world = generateSeededWorld({
      seed: 2105,
      runMode: "dungeon",
      archetype: "asymmetric",
    });
    const destack = simulateBattleStartOnWorld(world);
    const before = simulateCorpsesOnWorld({
      ...world,
      playerSpawn: destack.playerSpawn,
      spawns: destack.spawns,
    });
    assert.equal(before.sealed, true, "fixture must start sealed");
    const after = snapBattleStartOffChokePocket(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      destack.spawns,
    );
    assert.equal(after.snapped, true);
    const snappedWorld = {
      ...world,
      playerSpawn: after.playerSpawn,
      spawns: destack.spawns,
    };
    assert.equal(simulateCorpsesOnWorld(snappedWorld).sealed, false);
    const report = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      after.playerSpawn,
      world.portals,
      destack.spawns,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(report.ok, true, report.failures.join(","));
  });

  it("seed-1434-chessboard-destack-choke: checkerboard destack corner unseals", () => {
    const world = generateSeededWorld({
      seed: 1434,
      runMode: "dungeon",
      archetype: "chessboard",
    });
    const destack = simulateBattleStartOnWorld(world);
    assert.equal(
      simulateCorpsesOnWorld({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      }).sealed,
      true,
    );
    const after = snapBattleStartOffChokePocket(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      destack.spawns,
    );
    assert.equal(after.snapped, true);
    assert.equal(
      simulateCorpsesOnWorld({
        ...world,
        playerSpawn: after.playerSpawn,
        spawns: destack.spawns,
      }).sealed,
      false,
    );
  });

  it("seed-destack-choke-noop: open rooms with no unique bridges stay put", () => {
    const tiles = [
      [W, W, W, W, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, W, W, W, W],
    ];
    tiles[1][3] = "portal";
    const spawn = { x: 1, y: 1 };
    const portals = [{ x: 3, y: 1 }];
    assert.equal(
      countBattleStartChokeBridges(tiles, new Set(), spawn, portals),
      0,
    );
    const after = snapBattleStartOffChokePocket(
      tiles,
      new Set(),
      spawn,
      portals,
      [{ x: 3, y: 3 }],
      5,
      5,
    );
    assert.equal(after.snapped, false);
    assert.deepEqual(after.playerSpawn, spawn);
  });

  it("seed-destack-choke-no-join-island: does not snap onto a leftover crumb", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, W, F, F, F, F, W],
      [W, W, W, F, F, F, F, W],
      [W, W, W, F, F, F, F, W],
      [W, W, W, W, W, F, W, W],
      [W, W, W, W, W, F, W, W],
      [W, W, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W],
    ];
    tiles[1][6] = "portal";
    const spawn = { x: 5, y: 5 };
    const portals = [{ x: 6, y: 1 }];
    const battle = floodBattleStartChokeFrom(
      tiles,
      new Set(),
      spawn,
      portals,
      8,
      8,
    );
    assert.equal(
      battle.has("0,1"),
      false,
      "crumb must stay off the fight graph",
    );
    const next = findBattleStartOffChokeCell(
      tiles,
      new Set(),
      spawn,
      portals,
      [],
      8,
      8,
    );
    assert.ok(next);
    assert.equal(battle.has(`${next.x},${next.y}`), true);
    assert.notEqual(`${next.x},${next.y}`, "0,1");
    assert.notEqual(`${next.x},${next.y}`, "1,1");
  });

  it("keeps destack corpses from sealing seeded dungeon maps", () => {
    const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({ seed, runMode: "dungeon" });
      const destack = simulateBattleStartOnWorld(world);
      const after = snapBattleStartOffChokePocket(
        world.tiles,
        world.voidTiles,
        destack.playerSpawn,
        world.portals,
        destack.spawns,
      );
      const snappedWorld = {
        ...world,
        playerSpawn: after.playerSpawn,
        spawns: destack.spawns,
      };
      const report = evaluateSolvability(
        world.tiles,
        world.voidTiles,
        after.playerSpawn,
        world.portals,
        destack.spawns,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
      const corpses = simulateCorpsesOnWorld(snappedWorld);
      if (!report.ok || corpses.sealed) {
        failures.push(
          `seed ${seed}: ${report.failures.join(",") || "corpses sealed"}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps chessboard destack corpses from sealing across seeds", () => {
    const seeds = [1434, 1777, 1896, 2015, 2106, 2253, 2288, 2414, 3079, 3177];
    const extra = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    const failures: string[] = [];
    for (const seed of [...seeds, ...extra]) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const destack = simulateBattleStartOnWorld(world);
      const after = snapBattleStartOffChokePocket(
        world.tiles,
        world.voidTiles,
        destack.playerSpawn,
        world.portals,
        destack.spawns,
      );
      const corpses = simulateCorpsesOnWorld({
        ...world,
        playerSpawn: after.playerSpawn,
        spawns: destack.spawns,
      });
      const report = evaluateSolvability(
        world.tiles,
        world.voidTiles,
        after.playerSpawn,
        world.portals,
        destack.spawns,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
      if (!report.ok || corpses.sealed) {
        failures.push(
          `seed ${seed}: ${report.failures.join(",") || "corpses sealed"}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps Boss Rush and rest-exit destack corpses from sealing", () => {
    const seeds = Array.from({ length: 64 }, (_, i) => 5000 + i * 13);
    const failures: string[] = [];
    for (const seed of seeds) {
      const worlds = [
        generateSeededBossRushRoom(seed),
        simulateRestExitEncounter(seed, "dungeon"),
      ];
      for (const world of worlds) {
        const destack = simulateBattleStartOnWorld(world);
        const after = snapBattleStartOffChokePocket(
          world.tiles,
          world.voidTiles,
          destack.playerSpawn,
          world.portals,
          destack.spawns,
        );
        const corpses = simulateCorpsesOnWorld({
          ...world,
          playerSpawn: after.playerSpawn,
          spawns: destack.spawns,
        });
        const report = evaluateSolvability(
          world.tiles,
          world.voidTiles,
          after.playerSpawn,
          world.portals,
          destack.spawns,
          WORLD_GRID_SIZE,
          WORLD_GRID_SIZE,
          {
            allowSpawnOnPortal: world.portals.some((p) => p.isWhitePortal),
          },
        );
        if (!report.ok || corpses.sealed) {
          failures.push(
            `seed ${seed}: ${report.failures.join(",") || "corpses sealed"}`,
          );
        }
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
