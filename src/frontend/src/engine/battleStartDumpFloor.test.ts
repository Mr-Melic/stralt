import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  BATTLE_START_DUMP_FLOOR,
  countBattleDumpCells,
  ensureDumpFloorAfterBattleStart,
  floodBattleFromSpawn,
} from "./battleStartDumpFloor.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  simulateBattleStartOnWorld,
  simulateCorpsesOnWorld,
  simulateRestExitEncounter,
  simulateSummonsOnWorld,
} from "./mapGen.simulate.ts";
import { evaluateSolvability, finalizePlayableLayout } from "./mapGen.ts";

const W = "wall";
const F = "floor";

function dumpCounts(
  tiles: string[][],
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  w: number,
  h: number,
) {
  return countBattleDumpCells(tiles, new Set(), spawn, portals, w, h);
}

describe("ensureDumpFloorAfterBattleStart", () => {
  it("seed-destack-occupies-one-of-two-dumps: restores dump floor 2 after destack sits on one alcove", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W],
      [W, F, F, F, F, F, F, F, W],
      [W, F, W, W, F, W, W, W, W],
      [W, W, W, W, W, W, W, W, W],
    ];
    tiles[1][7] = "portal";
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 1 },
      portals: [{ x: 7, y: 1 }],
      spawns: [{ x: 4, y: 1 }],
      w: 9,
      h: 4,
    });
    const afterGen = dumpCounts(
      finalized.tiles,
      finalized.playerSpawn,
      finalized.portals,
      9,
      4,
    );
    assert.ok(
      afterGen.dump >= 2,
      `fixture must start with two dump cells (got ${afterGen.dump})`,
    );
    assert.ok(afterGen.mandatory > 0, "corridor must stay a unique bridge");

    const destackCells: { x: number; y: number }[] = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 9; x++) {
        if (finalized.tiles[y][x] === W) continue;
        if (finalized.tiles[y][x] === "portal") continue;
        const trial = dumpCounts(
          finalized.tiles,
          { x, y },
          finalized.portals,
          9,
          4,
        );
        if (trial.dump === 1 && trial.mandatory > 0) {
          destackCells.push({ x, y });
        }
      }
    }
    assert.ok(
      destackCells.length > 0,
      "fixture must have a destack cell that leaves dump=1",
    );
    const destack = destackCells[0];
    const before = dumpCounts(
      finalized.tiles,
      destack,
      finalized.portals,
      9,
      4,
    );
    assert.equal(before.dump, 1, "destack onto one alcove must leave dump=1");
    assert.ok(before.mandatory > 0, "corridor must stay a unique bridge");

    const punched = ensureDumpFloorAfterBattleStart(
      finalized.tiles,
      new Set(),
      destack,
      finalized.portals,
      9,
      4,
    );
    assert.ok(punched > 0, "must punch a replacement alcove");
    const after = dumpCounts(finalized.tiles, destack, finalized.portals, 9, 4);
    assert.ok(
      after.dump >= BATTLE_START_DUMP_FLOOR,
      `dump floor 2 missing (${after.dump})`,
    );
    const report = evaluateSolvability(
      finalized.tiles,
      new Set(),
      destack,
      finalized.portals,
      finalized.spawns,
      9,
      4,
    );
    assert.equal(report.ok, true, report.failures.join(","));
    const occ = simulateCorpsesOnWorld({
      tiles: finalized.tiles,
      voidTiles: new Set(),
      portals: finalized.portals,
      playerSpawn: destack,
      spawns: finalized.spawns,
      runMode: "dungeon",
      archetype: "corridorMaze",
      seed: 0,
    });
    assert.equal(
      occ.sealed,
      false,
      `corpses at ${occ.cells.map((c) => `${c.x},${c.y}`).join("/")} sealed the exit`,
    );
    const summons = simulateSummonsOnWorld(
      {
        tiles: finalized.tiles,
        voidTiles: new Set(),
        portals: finalized.portals,
        playerSpawn: destack,
        spawns: finalized.spawns,
        runMode: "dungeon",
        archetype: "corridorMaze",
        seed: 0,
      },
      2,
    );
    assert.equal(
      summons.sealed,
      false,
      `two summons at ${summons.cells.map((c) => `${c.x},${c.y}`).join("/")} sealed the exit`,
    );
  });

  it("seed-destack-dump-floor-noop: no-ops when fight-graph dump already meets floor 2", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [W, F, F, F, F, W],
      [W, F, W, F, W, W],
      [W, W, W, W, W, W],
    ];
    tiles[1][4] = "portal";
    const spawn = { x: 1, y: 1 };
    const portals = [{ x: 4, y: 1 }];
    const before = dumpCounts(tiles, spawn, portals, 6, 4);
    assert.ok(
      before.dump >= BATTLE_START_DUMP_FLOOR,
      `alcoves at (1,2) and (3,2) are dumps (got ${before.dump})`,
    );
    const snapshot = tiles.map((row) => row.slice());
    const punched = ensureDumpFloorAfterBattleStart(
      tiles,
      new Set(),
      spawn,
      portals,
      6,
      4,
    );
    assert.equal(punched, 0);
    assert.deepEqual(tiles, snapshot);
  });

  it("seed-destack-dump-no-join-island: skips a punch that would join a leftover island", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W],
      [W, F, F, F, F, F, F, F, W],
      [W, W, W, W, W, W, W, W, W],
      [F, F, W, W, W, W, W, W, W],
    ];
    tiles[1][7] = "portal";
    const destack = { x: 1, y: 1 };
    const portals = [{ x: 7, y: 1 }];
    const before = dumpCounts(tiles, destack, portals, 9, 4);
    assert.equal(before.dump, 0, "1-wide corridor has no fight-graph dump");
    assert.ok(before.mandatory > 0, "corridor must stay a unique bridge");

    const punched = ensureDumpFloorAfterBattleStart(
      tiles,
      new Set(),
      destack,
      portals,
      9,
      4,
    );
    assert.ok(punched > 0, "must punch a safe alcove");
    const after = dumpCounts(tiles, destack, portals, 9, 4);
    assert.ok(
      after.dump >= BATTLE_START_DUMP_FLOOR,
      `dump floor 2 missing (${after.dump})`,
    );
    const battle = floodBattleFromSpawn(
      tiles,
      new Set(),
      destack,
      portals,
      9,
      4,
    );
    assert.equal(
      battle.has("0,3"),
      false,
      "leftover island must stay off the fight graph",
    );
    assert.equal(battle.has("1,3"), false);
    assert.equal(tiles[2][1], W, "join wall beside the leftover island stays");
    assert.equal(tiles[3][0], F);
    assert.equal(tiles[3][1], F);
  });

  it("keeps dump floor 2 after battle-start destack across seeded dungeons", () => {
    const seeds = Array.from({ length: 256 }, (_, i) => 8100 + i * 17);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      ensureDumpFloorAfterBattleStart(
        world.tiles,
        world.voidTiles,
        after.playerSpawn,
        world.portals,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      const dump = dumpCounts(
        world.tiles,
        after.playerSpawn,
        world.portals,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      if (dump.mandatory > 0 && dump.dump < BATTLE_START_DUMP_FLOOR) {
        failures.push(
          `seed ${seed}: destack ${after.playerSpawn.x},${after.playerSpawn.y} dump=${dump.dump}`,
        );
      }
      const report = evaluateSolvability(
        world.tiles,
        world.voidTiles,
        after.playerSpawn,
        world.portals,
        after.spawns,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps dump floor 2 after destack on Boss Rush and rest-exit rooms", () => {
    const seeds = Array.from({ length: 64 }, (_, i) => 9200 + i * 11);
    const failures: string[] = [];
    for (const seed of seeds) {
      const worlds = [
        generateSeededBossRushRoom(seed),
        simulateRestExitEncounter(seed, "dungeon"),
      ];
      for (const world of worlds) {
        const after = simulateBattleStartOnWorld(world);
        ensureDumpFloorAfterBattleStart(
          world.tiles,
          world.voidTiles,
          after.playerSpawn,
          world.portals,
          world.tiles[0]?.length ?? WORLD_GRID_SIZE,
          world.tiles.length,
        );
        const dump = dumpCounts(
          world.tiles,
          after.playerSpawn,
          world.portals,
          world.tiles[0]?.length ?? WORLD_GRID_SIZE,
          world.tiles.length,
        );
        if (dump.mandatory > 0 && dump.dump < BATTLE_START_DUMP_FLOOR) {
          failures.push(
            `seed ${seed} ${world.runMode}: dump=${dump.dump} destack ${after.playerSpawn.x},${after.playerSpawn.y}`,
          );
        }
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
