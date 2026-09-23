import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  generateSeededWorld,
  reportWorld,
  simulateCorpsesOnWorld,
} from "./mapGen.simulate.ts";
import {
  MAP_ARCHETYPES,
  PROGRESSION_DUMP_FLOOR,
  countProgressionDumpCells,
  evaluateSolvability,
  finalizePlayableLayout,
} from "./mapGen.ts";
import {
  collectMandatoryProgressionCells,
  occKey,
  occupantsSealProgression,
  relocateOffMandatoryCells,
  unsealProgressionOccupants,
} from "./occupancy.ts";

const W = "wall";
const F = "floor";

describe("PROGRESSION_DUMP_FLOOR alcoves", () => {
  it("seed-one-dump-two-corpses: a unique corridor keeps two dump cells", () => {
    // 1-wide floor (1,1)→(6,1); portal at (6,1). One alcove used to leave
    // the second summon on the only remaining bridge.
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [W, F, F, F, F, F, F, W],
      [W, W, W, W, W, W, W, W],
    ];
    tiles[1][6] = "portal";
    const before = countProgressionDumpCells(
      tiles,
      new Set(),
      { x: 1, y: 1 },
      [{ x: 6, y: 1 }],
      8,
      3,
    );
    assert.equal(before.mandatory > 0, true);
    assert.equal(
      before.dump < PROGRESSION_DUMP_FLOOR,
      true,
      "fixture must start thinner than two living occupants",
    );

    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 1 },
      portals: [{ x: 6, y: 1 }],
      spawns: [],
      w: 8,
      h: 3,
    });
    const dump = countProgressionDumpCells(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      8,
      3,
    );
    assert.equal(
      dump.dump >= PROGRESSION_DUMP_FLOOR,
      true,
      `need ${PROGRESSION_DUMP_FLOOR} dump cells, got ${dump.dump}`,
    );
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      8,
      3,
    );
    assert.equal(after.ok, true, after.failures.join(","));

    const occTiles = finalized.tiles.map((row) => row.map((t) => t !== "wall"));
    const portalSet = new Set(finalized.portals.map((p) => `${p.x},${p.y}`));
    const occupied = new Set<string>([
      `${finalized.playerSpawn.x},${finalized.playerSpawn.y}`,
    ]);
    const ctx = {
      tiles: occTiles,
      barriers: new Set<string>(),
      voidTiles: new Set<string>(),
      portals: portalSet,
      progressStart: finalized.playerSpawn,
      isOccupied: (c: { x: number; y: number }) =>
        occupied.has(occKey(c.x, c.y)),
    };
    const mandatory = collectMandatoryProgressionCells(
      occTiles,
      new Set(),
      portalSet,
      finalized.playerSpawn,
    );
    const ranked = [...mandatory]
      .map((k) => {
        const p = k.split(",");
        return { x: Number(p[0]), y: Number(p[1]) };
      })
      .slice(0, 2);
    assert.equal(ranked.length, 2, "fixture must have two unique-bridge cells");
    const moved = relocateOffMandatoryCells(ranked, mandatory, ctx);
    const unsealed = unsealProgressionOccupants(
      moved,
      occTiles,
      new Set(),
      portalSet,
      finalized.playerSpawn,
      ctx,
    );
    assert.equal(
      occupantsSealProgression(
        occTiles,
        new Set(),
        portalSet,
        finalized.playerSpawn,
        unsealed,
      ),
      false,
      "two corpses must both leave the unique bridge",
    );
  });

  it("seed-portal-cut-thin-dump: far-side floors do not count as the second dump", () => {
    // Near corridor (0,1)→(3,1) + portal choke + far room. Overworld dump
    // used to skip the second alcove because the far island looked empty.
    const tiles = [
      [W, W, W, W, W, W, W],
      [F, F, F, "portal", F, F, F],
      [W, W, W, W, W, W, W],
    ];
    const before = countProgressionDumpCells(
      tiles,
      new Set(),
      { x: 0, y: 1 },
      [{ x: 3, y: 1 }],
      7,
      3,
    );
    assert.equal(before.mandatory > 0, true);
    assert.equal(
      before.dump < PROGRESSION_DUMP_FLOOR,
      true,
      "far-side floors must not satisfy the dump floor",
    );

    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 0, y: 1 },
      portals: [{ x: 3, y: 1 }],
      spawns: [],
      w: 7,
      h: 3,
    });
    const dump = countProgressionDumpCells(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      7,
      3,
    );
    assert.equal(
      dump.dump >= PROGRESSION_DUMP_FLOOR,
      true,
      `near-side dump ${dump.dump} must reach ${PROGRESSION_DUMP_FLOOR}`,
    );
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      7,
      3,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    const occ = simulateCorpsesOnWorld({
      tiles: finalized.tiles,
      voidTiles: new Set(),
      portals: finalized.portals.map((p) => ({
        x: p.x,
        y: p.y,
        color: "progression",
      })),
      playerSpawn: finalized.playerSpawn,
      spawns: finalized.spawns,
      runMode: "dungeon",
      archetype: "corridorMaze",
      seed: 0,
    });
    assert.equal(occ.sealed, false);
  });
});

describe("seeded dump-capacity property", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);
  const archetypes = MAP_ARCHETYPES.map((a) => a.type);

  it(`keeps ${PROGRESSION_DUMP_FLOOR} fight-graph dump cells when a unique bridge exists`, () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: archetypes[seed % archetypes.length],
      });
      const w = world.tiles[0]?.length ?? WORLD_GRID_SIZE;
      const h = world.tiles.length;
      const dump = countProgressionDumpCells(
        world.tiles,
        world.voidTiles,
        world.playerSpawn,
        world.portals,
        w,
        h,
      );
      if (dump.mandatory > 0 && dump.dump < PROGRESSION_DUMP_FLOOR) {
        failures.push(`seed ${seed} dump=${dump.dump}`);
        continue;
      }
      const report = reportWorld(world);
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
        continue;
      }
      const occ = simulateCorpsesOnWorld(world);
      if (occ.sealed) {
        failures.push(`seed ${seed}: two+ corpses sealed the exit`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
