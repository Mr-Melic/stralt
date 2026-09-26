import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  WANDER_DUMP_FLOOR,
  countWanderDumpFloorCells,
  ensureDumpFloorAfterWander,
  floodWanderDumpFloorBattleFrom,
} from "./enemyWanderDumpFloor.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  simulateCorpsesOnWorld,
  simulateEnemyWanderOnWorld,
  simulateRestExitEncounter,
  simulateSummonsOnWorld,
} from "./mapGen.simulate.ts";
import { createSeededRng, evaluateSolvability } from "./mapGen.ts";
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
 * Unique player→exit corridor with two side alcoves. Generate-time
 * dump-floor-2 sees dump=2 and skips. Wander free-dump (floor 1) sees
 * free=1 and skips. Wander then sits a hostile on one alcove so a
 * second corpse has nowhere to go except the unique bridge.
 */
function wanderOccupiesOneOfTwoDumpsFixture() {
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
    occupied: [{ x: 1, y: 1 }],
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
  return countWanderDumpFloorCells(
    tiles,
    new Set(),
    spawn,
    portals,
    occupied,
    w,
    h,
  );
}

function twoBridgeCorpses(
  tiles: string[][],
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupied: { x: number; y: number }[],
): { corpses: { x: number; y: number }[]; sealed: boolean } {
  const occTiles = tiles.map((row) => row.map((t) => t !== "wall"));
  const portalSet = new Set(portals.map((p) => `${p.x},${p.y}`));
  const taken = new Set<string>([
    `${spawn.x},${spawn.y}`,
    ...occupied.map((c) => `${c.x},${c.y}`),
  ]);
  const ctx: OccupancyContext = {
    tiles: occTiles,
    barriers: new Set(),
    voidTiles: new Set(),
    portals: portalSet,
    isOccupied: (c) => taken.has(occKey(c.x, c.y)),
  };
  const mandatory = collectMandatoryProgressionCells(
    occTiles,
    new Set(),
    portalSet,
    spawn,
  );
  const ranked = [...mandatory]
    .map((k) => {
      const p = k.split(",");
      return { x: Number(p[0]), y: Number(p[1]) };
    })
    .sort((a, b) => b.x - a.x || b.y - a.y);
  const corpses = ranked.slice(0, 2);
  const moved = relocateOffMandatoryCells(corpses, mandatory, ctx);
  return {
    corpses: moved,
    sealed: occupantsSealProgression(occTiles, new Set(), portalSet, spawn, [
      ...occupied,
      ...moved,
    ]),
  };
}

describe("ensureDumpFloorAfterWander", () => {
  it("seed-wander-occupies-one-of-two-dumps: punches when wander sits on one of two dump alcoves", () => {
    const fx = wanderOccupiesOneOfTwoDumpsFixture();
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
    assert.equal(before.free, 1, "wandered hostile occupies one dump");
    assert.ok(
      before.free < WANDER_DUMP_FLOOR,
      "wander free-dump floor 1 would no-op on this fixture",
    );

    const stuck = twoBridgeCorpses(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
    );
    assert.equal(
      stuck.sealed,
      true,
      "occupied dump plus two bridge corpses must seal before the punch",
    );

    const punched = ensureDumpFloorAfterWander(
      fx.tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.ok(punched > 0, "must punch a second unoccupied dump cell");
    const after = freeCounts(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
      fx.w,
      fx.h,
    );
    assert.ok(
      after.free >= WANDER_DUMP_FLOOR,
      `free dump floor 2 missing (${after.free})`,
    );

    const moved = twoBridgeCorpses(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      fx.occupied,
    );
    assert.equal(
      moved.sealed,
      false,
      `relocated corpses at ${moved.corpses.map((c) => `${c.x},${c.y}`).join("/")} must leave a route`,
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

  it("seed-wander-dump-floor-noop: no-ops when fight-graph free dump already meets floor 2", () => {
    const fx = wanderOccupiesOneOfTwoDumpsFixture();
    const before = freeCounts(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      [],
      fx.w,
      fx.h,
    );
    assert.ok(
      before.free >= WANDER_DUMP_FLOOR,
      `empty alcoves are free dumps (got ${before.free})`,
    );
    const snapshot = fx.tiles.map((row) => row.slice());
    const punched = ensureDumpFloorAfterWander(
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

  it("seed-wander-dump-floor-no-join-island: skips a punch that would join a leftover island", () => {
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
    const occupied = [{ x: 1, y: 1 }];
    const before = freeCounts(tiles, spawn, portals, occupied, 9, 6);
    assert.equal(before.dump, 2, "both alcoves still count as dump");
    assert.equal(before.free, 1, "wandered hostile occupies one dump");
    assert.ok(before.mandatory > 0, "corridor must stay a unique bridge");

    const punched = ensureDumpFloorAfterWander(
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
      after.free >= WANDER_DUMP_FLOOR,
      `free dump floor 2 missing (${after.free})`,
    );
    const battle = floodWanderDumpFloorBattleFrom(
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

  it("keeps dump floor 2 after wander occupies alcoves across seeded dungeons", () => {
    const seeds = Array.from({ length: 256 }, (_, i) => 8900 + i * 17);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateEnemyWanderOnWorld(
        world,
        12,
        createSeededRng(seed + 43),
      );
      ensureDumpFloorAfterWander(
        world.tiles,
        world.voidTiles,
        world.playerSpawn,
        world.portals,
        after.spawns,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      const dump = countWanderDumpFloorCells(
        world.tiles,
        world.voidTiles,
        world.playerSpawn,
        world.portals,
        after.spawns,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      if (dump.mandatory > 0 && dump.free < WANDER_DUMP_FLOOR) {
        failures.push(
          `seed ${seed}: wander free=${dump.free} dump=${dump.dump}`,
        );
      }
      const report = evaluateSolvability(
        world.tiles,
        world.voidTiles,
        world.playerSpawn,
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

  it("keeps dump floor 2 after wander on Boss Rush and rest-exit rooms", () => {
    const seeds = Array.from({ length: 64 }, (_, i) => 9900 + i * 11);
    const failures: string[] = [];
    for (const seed of seeds) {
      const worlds = [
        generateSeededBossRushRoom(seed),
        simulateRestExitEncounter(seed, "dungeon"),
      ];
      for (const world of worlds) {
        const after = simulateEnemyWanderOnWorld(
          world,
          12,
          createSeededRng(seed + 9),
        );
        ensureDumpFloorAfterWander(
          world.tiles,
          world.voidTiles,
          world.playerSpawn,
          world.portals,
          after.spawns,
          world.tiles[0]?.length ?? WORLD_GRID_SIZE,
          world.tiles.length,
        );
        const dump = countWanderDumpFloorCells(
          world.tiles,
          world.voidTiles,
          world.playerSpawn,
          world.portals,
          after.spawns,
          world.tiles[0]?.length ?? WORLD_GRID_SIZE,
          world.tiles.length,
        );
        if (dump.mandatory > 0 && dump.free < WANDER_DUMP_FLOOR) {
          failures.push(
            `seed ${seed} ${world.runMode}: free=${dump.free} dump=${dump.dump}`,
          );
        }
        if (!after.ok) {
          failures.push(`seed ${seed} ${world.runMode}: wander isolated`);
        }
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
