import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { ensureDumpAfterBattleStart } from "./battleStartDump.ts";
import {
  generateSeededWorld,
  simulateBattleStartOnWorld,
  simulateCorpsesOnWorld,
} from "./mapGen.simulate.ts";
import {
  countProgressionDumpCells,
  evaluateSolvability,
  finalizePlayableLayout,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

function dumpCounts(
  tiles: string[][],
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  w: number,
  h: number,
) {
  return countProgressionDumpCells(tiles, new Set(), spawn, portals, w, h);
}

describe("ensureDumpAfterBattleStart", () => {
  it("seed-destack-on-only-dump: punches a new alcove after spawn sits on the generate-time dump", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [W, F, F, F, F, F, F, W],
      [W, W, W, W, W, W, W, W],
    ];
    tiles[1][6] = "portal";
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 1 },
      portals: [{ x: 6, y: 1 }],
      spawns: [{ x: 4, y: 1 }],
      w: 8,
      h: 3,
    });
    const afterGen = dumpCounts(
      finalized.tiles,
      finalized.playerSpawn,
      finalized.portals,
      8,
      3,
    );
    assert.ok(
      afterGen.dump >= 1,
      `fixture must start with a generate-time dump (got ${afterGen.dump})`,
    );

    // Battle-start destack onto the only dump cell — the generate-time
    // alcove is now the player tile, so dump drops to 0.
    const dumpCells: { x: number; y: number }[] = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 8; x++) {
        if (finalized.tiles[y][x] === W) continue;
        if (finalized.tiles[y][x] === "portal") continue;
        if (x === finalized.playerSpawn.x && y === finalized.playerSpawn.y) {
          continue;
        }
        const trial = dumpCounts(
          finalized.tiles,
          { x, y },
          finalized.portals,
          8,
          3,
        );
        if (trial.dump === 0 && trial.mandatory > 0) {
          dumpCells.push({ x, y });
        }
      }
    }
    assert.ok(
      dumpCells.length > 0,
      "fixture must have a destack cell that consumes the only dump",
    );
    const destack = dumpCells[0];
    const before = dumpCounts(
      finalized.tiles,
      destack,
      finalized.portals,
      8,
      3,
    );
    assert.equal(before.dump, 0, "destack onto the alcove must leave dump=0");
    assert.ok(before.mandatory > 0, "corridor must stay a unique bridge");

    const punched = ensureDumpAfterBattleStart(
      finalized.tiles,
      new Set(),
      destack,
      finalized.portals,
      8,
      3,
    );
    assert.ok(punched, "must punch a replacement alcove");
    const after = dumpCounts(finalized.tiles, destack, finalized.portals, 8, 3);
    assert.ok(after.dump >= 1, `replacement dump missing (${after.dump})`);
    const report = evaluateSolvability(
      finalized.tiles,
      new Set(),
      destack,
      finalized.portals,
      finalized.spawns,
      8,
      3,
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
  });

  it("seed-destack-on-only-dump: no-ops when a dump cell already exists", () => {
    const tiles = [
      [W, W, W, W],
      [W, F, F, W],
      [W, F, W, W],
      [W, W, W, W],
    ];
    tiles[1][2] = "portal";
    const spawn = { x: 1, y: 1 };
    const portals = [{ x: 2, y: 1 }];
    const before = dumpCounts(tiles, spawn, portals, 4, 4);
    assert.ok(before.dump >= 1, "alcove at (1,2) is already a dump");
    const punched = ensureDumpAfterBattleStart(
      tiles,
      new Set(),
      spawn,
      portals,
      4,
      4,
    );
    assert.equal(punched, null);
    assert.equal(tiles[2][1], F);
  });

  it("keeps a dump cell after battle-start destack across seeded dungeons", () => {
    const seeds = Array.from({ length: 256 }, (_, i) => 7000 + i * 13);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const dump = dumpCounts(
        world.tiles,
        after.playerSpawn,
        world.portals,
        world.tiles[0]?.length ?? WORLD_GRID_SIZE,
        world.tiles.length,
      );
      if (dump.mandatory > 0 && dump.dump === 0) {
        failures.push(
          `seed ${seed}: destack ${after.playerSpawn.x},${after.playerSpawn.y} dump=0`,
        );
      }
      if (!after.ok) {
        failures.push(`seed ${seed}: destack not ok`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
