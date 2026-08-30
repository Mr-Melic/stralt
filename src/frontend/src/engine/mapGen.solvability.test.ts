import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  persistBossRushRewardsThroughLock,
  persistBossRushRoomClear,
  progressAfterRoomClear,
  resumeRoomFromPersisted,
} from "../hooks/bossRushProgress.ts";
import {
  generateSeededBossRushRoom,
  generateSeededRestMap,
  generateSeededWorld,
  reportWorld,
  simulateCleanupSnapshotProgression,
  simulateClearUnlocksPortal,
  simulateRestExitEncounter,
} from "./mapGen.simulate.ts";
import {
  MAP_ARCHETYPES,
  evaluateSolvability,
  finalizePlayableLayout,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

describe("ensureReachability / finalizePlayableLayout regressions", () => {
  it("seed-wall-spawn: legalizes a player standing on a wall", () => {
    const tiles = [
      [W, W, W, W, W],
      [W, W, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, W, W, W, W],
    ];
    const before = evaluateSolvability(
      tiles,
      new Set(),
      { x: 1, y: 1 },
      [{ x: 3, y: 1 }],
      [{ x: 3, y: 3 }],
      5,
      5,
    );
    assert.equal(before.playerSpawnLegal, false, "fixture must start illegal");
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 1 },
      portals: [{ x: 3, y: 1 }],
      spawns: [{ x: 3, y: 3 }],
      w: 5,
      h: 5,
    });
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      5,
      5,
    );
    assert.equal(after.ok, true, after.failures.join(","));
  });

  it("seed-void-portal: relocates a void-pocket exit onto the walkable graph", () => {
    const tiles = [
      [F, F, F, W, W],
      [F, F, F, W, W],
      [F, F, F, W, W],
      [W, W, W, W, W],
      [W, W, W, W, F],
    ];
    const voidTiles = new Set(["4,4"]);
    const before = evaluateSolvability(
      tiles,
      voidTiles,
      { x: 0, y: 0 },
      [{ x: 4, y: 4 }],
      [{ x: 1, y: 1 }],
      5,
      5,
    );
    assert.equal(before.portalReachable, false, "fixture must start sealed");
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles,
      playerSpawn: { x: 0, y: 0 },
      portals: [{ x: 4, y: 4 }],
      spawns: [{ x: 1, y: 1 }],
      w: 5,
      h: 5,
    });
    const after = evaluateSolvability(
      finalized.tiles,
      voidTiles,
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      5,
      5,
    );
    assert.equal(after.ok, true, after.failures.join(","));
  });

  it("seed-long-carve: relocates a portal more than 8 walls away", () => {
    const tiles = Array.from({ length: 12 }, () => Array(12).fill(W));
    tiles[0][0] = F;
    tiles[0][1] = F;
    tiles[0][11] = F;
    const before = evaluateSolvability(
      tiles,
      new Set(),
      { x: 0, y: 0 },
      [{ x: 11, y: 0 }],
      [],
      12,
      12,
    );
    assert.equal(before.portalReachable, false);
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 0, y: 0 },
      portals: [{ x: 11, y: 0 }],
      spawns: [],
      w: 12,
      h: 12,
    });
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      12,
      12,
    );
    assert.equal(after.portalReachable, true, after.failures.join(","));
    assert.equal(after.playerSpawnLegal, true);
  });

  it("seed-missing-exit: inserts a reachable portal when the generator omitted one", () => {
    const tiles = [
      [F, F, F],
      [F, F, F],
      [F, F, F],
    ];
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 0, y: 0 },
      portals: [],
      spawns: [{ x: 2, y: 2 }],
      w: 3,
      h: 3,
    });
    assert.ok(finalized.portal);
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      3,
      3,
    );
    assert.equal(after.ok, true, after.failures.join(","));
  });

  it("seed-isolated-hostile: punches a CA pocket so clearing can unlock", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [W, F, F, F, W, W, W, W],
      [W, F, F, F, W, W, W, W],
      [W, F, F, F, W, W, W, W],
      [W, W, W, W, W, W, W, W],
      [W, W, W, W, W, F, W, W],
      [W, W, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W],
    ];
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 1 },
      portals: [{ x: 2, y: 1 }],
      spawns: [{ x: 5, y: 5 }],
      w: 8,
      h: 8,
    });
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      8,
      8,
    );
    assert.equal(after.enemiesReachable, true, after.failures.join(","));
    assert.equal(after.portalReachable, true);
  });
});

describe("seeded world property suite", () => {
  const seeds = Array.from({ length: 128 }, (_, i) => 1000 + i * 17);
  const archetypes = MAP_ARCHETYPES.map((a) => a.type);
  const modes = ["none", "dungeon", "bossRush"] as const;

  for (const mode of modes) {
    it(`keeps a legal route for runMode=${mode} across ${seeds.length} seeds`, () => {
      const failures: string[] = [];
      for (const seed of seeds) {
        const world = generateSeededWorld({
          seed,
          runMode: mode,
          archetype: archetypes[seed % archetypes.length],
        });
        const report = reportWorld(world);
        if (!report.ok) {
          failures.push(
            `seed ${seed} ${world.archetype}: ${report.failures.join(",")}`,
          );
        }
        if (mode !== "none") {
          assert.ok(
            world.portals.some((p) => p.isProgressionPortal),
            `seed ${seed} missing progression portal`,
          );
        }
      }
      assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
    });
  }

  it("Boss Rush preferred cells stay walk-reachable across seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededBossRushRoom(seed);
      const report = reportWorld(world);
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest map exits stay reachable and rest-exit encounters unlock", () => {
    const rest = generateSeededRestMap();
    const restReport = reportWorld(rest);
    assert.equal(restReport.ok, true, restReport.failures.join(","));
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = simulateRestExitEncounter(seed);
      const report = reportWorld(world);
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});

describe("portal lock / unlock / cleanup sequencing", () => {
  it("stays locked while hostiles remain and unlocks on clear", () => {
    const locked = simulateClearUnlocksPortal("dungeon", 2);
    assert.equal(locked.locked, true);
    assert.equal(locked.unlocked, false);
    const open = simulateClearUnlocksPortal("dungeon", 0);
    assert.equal(open.locked, false);
    assert.equal(open.unlocked, true);
    const overworld = simulateClearUnlocksPortal("none", 0);
    assert.equal(overworld.unlocked, false);
  });

  it("cleanupMap zeros cannot drop a snapshotted dungeon chain", () => {
    assert.deepEqual(simulateCleanupSnapshotProgression(true, 2, 4), {
      kind: "progress",
      nextDepth: 3,
    });
    assert.deepEqual(simulateCleanupSnapshotProgression(true, 4, 4), {
      kind: "complete",
      bonus: 200,
    });
    assert.deepEqual(simulateCleanupSnapshotProgression(false, 0, 0), {
      kind: "none",
    });
  });
});

describe("reload cannot duplicate Boss Rush room rewards", () => {
  it("replays a 10-room persist sequence without re-farming a cleared room", async () => {
    const paid = new Set<number>();
    const actor = {
      currentRoom: 0,
      setBossRushProgress: async (_slot: bigint, room: bigint) => {
        actor.currentRoom = Number(room);
      },
      resetBossRush: async () => {
        actor.currentRoom = 0;
      },
      completeBossRushRoom: async () => undefined,
    };
    let doka = 0;
    for (let room = 0; room < 10; room++) {
      assert.equal(
        resumeRoomFromPersisted(actor.currentRoom),
        room === 0 ? 0 : room,
        `reload before room ${room} must not rewind`,
      );
      await persistBossRushRewardsThroughLock(
        {
          enqueue: async (fn) => fn(),
        },
        () => persistBossRushRoomClear(actor, 1, room),
        async () => {
          assert.equal(paid.has(room), false, `room ${room} paid twice`);
          paid.add(room);
          doka += 100;
          return { doka };
        },
      );
      const progress = progressAfterRoomClear(room);
      assert.equal(actor.currentRoom, progress.nextCurrentRoom);
    }
    assert.equal(paid.size, 10);
    assert.equal(doka, 1000);
    assert.equal(actor.currentRoom, 0);
    assert.equal(resumeRoomFromPersisted(actor.currentRoom), 0);
  });
});

describe("map bounds", () => {
  it("keeps spawn and portals inside WORLD_GRID_SIZE on seeded worlds", () => {
    for (let seed = 0; seed < 32; seed++) {
      const world = generateSeededWorld({ seed: 5000 + seed });
      const inb = (c: { x: number; y: number }) =>
        c.x >= 0 && c.y >= 0 && c.x < WORLD_GRID_SIZE && c.y < WORLD_GRID_SIZE;
      assert.ok(inb(world.playerSpawn), `seed ${seed} spawn oob`);
      for (const p of world.portals) {
        assert.ok(inb(p), `seed ${seed} portal oob`);
      }
      for (const s of world.spawns) {
        assert.ok(inb(s), `seed ${seed} enemy oob`);
      }
    }
  });
});
