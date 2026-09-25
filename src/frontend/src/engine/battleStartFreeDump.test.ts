import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  BATTLE_START_FREE_DUMP_FLOOR,
  countFreeBattleDumpCells,
  ensureFreeDumpAfterBattleStart,
  floodFreeDumpBattleFrom,
} from "./battleStartFreeDump.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  simulateBattleStartOnWorld,
  simulateCorpsesOnWorld,
  simulateRestExitEncounter,
  simulateSummonsOnWorld,
} from "./mapGen.simulate.ts";
import { evaluateSolvability } from "./mapGen.ts";
import {
  type OccupancyContext,
  collectMandatoryProgressionCells,
  occKey,
  occupantsSealProgression,
  relocateOffMandatoryCells,
} from "./occupancy.ts";

const W = "wall";
const F = "floor";

/**
 * Unique player→exit corridor with two side alcoves. Destack sits the
 * player on the corridor mouth and hostiles on both dumps so dump=2
 * (destack dump-floor-2 no-ops) and free dump=0.
 */
function destackOccupiedDumpFixture() {
  const tiles = [
    [W, W, W, W, W, W, W, W],
    [W, F, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, W],
    [W, F, W, W, W, W, W, W],
    [W, W, W, W, W, W, W, W],
  ];
  tiles[2][6] = "portal";
  return {
    tiles,
    playerSpawn: { x: 1, y: 2 },
    portals: [{ x: 6, y: 2 }],
    occupied: [
      { x: 1, y: 1 },
      { x: 1, y: 3 },
    ],
    w: 8,
    h: 5,
  };
}

function freeCounts(
  tiles: string[][],
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupied: { x: number; y: number }[],
  w: number,
  h: number,
) {
  return countFreeBattleDumpCells(
    tiles,
    new Set(),
    spawn,
    portals,
    occupied,
    w,
    h,
  );
}

describe("ensureFreeDumpAfterBattleStart", () => {
  it("seed-destack-occupies-every-dump: punches a free alcove when destack fills dump floor 2", () => {
    const fx = destackOccupiedDumpFixture();
    const before = freeCounts(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.ok(before.mandatory > 0, "corridor must stay a unique bridge");
    assert.equal(before.dump, 2, "both alcoves still count as dump");
    assert.equal(before.free, 0, "destacked hostiles occupy every dump cell");

    const occTiles = fx.tiles.map((row) => row.map((t) => t !== "wall"));
    const portalSet = new Set(fx.portals.map((p) => `${p.x},${p.y}`));
    const occupied = new Set<string>([
      `${fx.playerSpawn.x},${fx.playerSpawn.y}`,
      ...fx.occupied.map((c) => `${c.x},${c.y}`),
    ]);
    const ctx: OccupancyContext = {
      tiles: occTiles,
      barriers: new Set(),
      voidTiles: new Set(),
      portals: portalSet,
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    const mandatory = collectMandatoryProgressionCells(
      occTiles,
      new Set(),
      portalSet,
      fx.playerSpawn,
    );
    const corpse = [...mandatory]
      .map((k) => {
        const p = k.split(",");
        return { x: Number(p[0]), y: Number(p[1]) };
      })
      .sort((a, b) => b.x - a.x)[0];
    assert.ok(corpse, "fixture must have a unique-bridge cell");
    const [stuck] = relocateOffMandatoryCells([corpse], mandatory, ctx);
    assert.equal(
      occupantsSealProgression(occTiles, new Set(), portalSet, fx.playerSpawn, [
        ...fx.occupied,
        stuck,
      ]),
      true,
      "occupied dumps plus a bridge corpse must seal before the punch",
    );

    const punched = ensureFreeDumpAfterBattleStart(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.ok(punched > 0, "must punch an unoccupied dump cell");
    const after = freeCounts(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.ok(
      after.free >= BATTLE_START_FREE_DUMP_FLOOR,
      `free dump missing (${after.free})`,
    );
    assert.ok(after.dump >= 3, "occupied alcoves stay; punch adds a third");

    const afterTiles = fx.tiles.map((row) => row.map((t) => t !== "wall"));
    const afterCtx: OccupancyContext = {
      tiles: afterTiles,
      barriers: new Set(),
      voidTiles: new Set(),
      portals: portalSet,
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    const afterMandatory = collectMandatoryProgressionCells(
      afterTiles,
      new Set(),
      portalSet,
      fx.playerSpawn,
    );
    const [moved] = relocateOffMandatoryCells(
      [corpse],
      afterMandatory,
      afterCtx,
    );
    assert.equal(
      occupantsSealProgression(
        afterTiles,
        new Set(),
        portalSet,
        fx.playerSpawn,
        [...fx.occupied, moved],
      ),
      false,
      `relocated corpse at ${moved.x},${moved.y} must leave a route`,
    );
    const report = evaluateSolvability(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.equal(report.ok, true, report.failures.join(","));
  });

  it("seed-destack-free-dump-noop: no-ops when a fight-graph dump cell is already free", () => {
    const fx = destackOccupiedDumpFixture();
    const before = freeCounts(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      [],
      fx.w,
      fx.h,
    );
    assert.ok(
      before.free >= BATTLE_START_FREE_DUMP_FLOOR,
      `empty alcoves are free dumps (got ${before.free})`,
    );
    const snapshot = fx.tiles.map((row) => row.slice());
    const punched = ensureFreeDumpAfterBattleStart(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      [],
      fx.w,
      fx.h,
    );
    assert.equal(punched, 0);
    assert.deepEqual(fx.tiles, snapshot);
  });

  it("seed-destack-free-dump-no-join-island: skips a punch that would join a leftover island", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W],
      [W, F, W, W, W, W, W, W, W],
      [W, F, F, F, F, F, F, F, W],
      [W, F, W, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W, W],
      [F, F, W, W, W, W, W, W, W],
    ];
    tiles[2][7] = "portal";
    const spawn = { x: 1, y: 2 };
    const portals = [{ x: 7, y: 2 }];
    const occupied = [
      { x: 1, y: 1 },
      { x: 1, y: 3 },
    ];
    const before = freeCounts(tiles, spawn, portals, occupied, 9, 6);
    assert.equal(before.dump, 2, "alcoves still count as dump");
    assert.equal(before.free, 0, "destacked hostiles occupy every dump cell");
    assert.ok(before.mandatory > 0, "corridor must stay a unique bridge");

    const punched = ensureFreeDumpAfterBattleStart(
      tiles,
      new Set(),
      spawn,
      portals,
      occupied,
      9,
      6,
    );
    assert.ok(punched > 0, "must punch a safe free alcove");
    const after = freeCounts(tiles, spawn, portals, occupied, 9, 6);
    assert.ok(
      after.free >= BATTLE_START_FREE_DUMP_FLOOR,
      `free dump missing (${after.free})`,
    );
    const battle = floodFreeDumpBattleFrom(
      tiles,
      new Set(),
      spawn,
      portals,
      9,
      6,
    );
    assert.equal(
      battle.has("0,5"),
      false,
      "leftover island must stay off the fight graph",
    );
    assert.equal(battle.has("1,5"), false);
    assert.equal(tiles[4][1], W, "join wall beside the leftover island stays");
    assert.equal(tiles[5][0], F);
    assert.equal(tiles[5][1], F);
  });

  it("keeps a free fight-graph dump after destack occupies alcoves across seeded dungeons", () => {
    const seeds = Array.from({ length: 256 }, (_, i) => 8300 + i * 17);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      ensureFreeDumpAfterBattleStart(
        world.tiles,
        world.voidTiles,
        after.playerSpawn,
        world.portals,
        after.spawns,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      const dump = countFreeBattleDumpCells(
        world.tiles,
        world.voidTiles,
        after.playerSpawn,
        world.portals,
        after.spawns,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      if (dump.mandatory > 0 && dump.free < BATTLE_START_FREE_DUMP_FLOOR) {
        failures.push(
          `seed ${seed}: destack ${after.playerSpawn.x},${after.playerSpawn.y} free=${dump.free} dump=${dump.dump}`,
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
      const corpses = simulateCorpsesOnWorld({
        ...world,
        playerSpawn: after.playerSpawn,
        spawns: after.spawns,
      });
      if (corpses.sealed) {
        failures.push(
          `seed ${seed}: corpses at ${corpses.cells.map((c) => `${c.x},${c.y}`).join("/")}`,
        );
      }
      const summons = simulateSummonsOnWorld(
        {
          ...world,
          playerSpawn: after.playerSpawn,
          spawns: after.spawns,
        },
        2,
      );
      if (summons.sealed) {
        failures.push(
          `seed ${seed}: summons at ${summons.cells.map((c) => `${c.x},${c.y}`).join("/")}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps a free fight-graph dump after destack on Boss Rush and rest-exit rooms", () => {
    const seeds = Array.from({ length: 64 }, (_, i) => 9400 + i * 11);
    const failures: string[] = [];
    for (const seed of seeds) {
      const worlds = [
        generateSeededBossRushRoom(seed),
        simulateRestExitEncounter(seed, "dungeon"),
      ];
      for (const world of worlds) {
        const after = simulateBattleStartOnWorld(world);
        ensureFreeDumpAfterBattleStart(
          world.tiles,
          world.voidTiles,
          after.playerSpawn,
          world.portals,
          after.spawns,
          world.tiles[0]?.length ?? WORLD_GRID_SIZE,
          world.tiles.length,
        );
        const dump = countFreeBattleDumpCells(
          world.tiles,
          world.voidTiles,
          after.playerSpawn,
          world.portals,
          after.spawns,
          world.tiles[0]?.length ?? WORLD_GRID_SIZE,
          world.tiles.length,
        );
        if (dump.mandatory > 0 && dump.free < BATTLE_START_FREE_DUMP_FLOOR) {
          failures.push(
            `seed ${seed} ${world.runMode}: free=${dump.free} destack ${after.playerSpawn.x},${after.playerSpawn.y}`,
          );
        }
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
