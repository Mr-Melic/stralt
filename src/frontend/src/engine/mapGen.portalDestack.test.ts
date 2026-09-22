import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateSeededWorld, reportWorld } from "./mapGen.simulate.ts";
import {
  MAP_ARCHETYPES,
  evaluateSolvability,
  finalizePlayableLayout,
  portalSteppableFromBattle,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

/**
 * 1-wide corridor, portal choke at (3,1), far room (4,1)–(5,1).
 * Two portal objects stacked on the choke — destack used to hop the
 * duplicate onto (4,1)/(5,1). Stepping on the kept choke leaves the map,
 * so the destacked exit was not a legal second route.
 */
function portalCutStackFixture(): {
  tiles: string[][];
  spawn: { x: number; y: number };
  portals: { x: number; y: number; color: string }[];
} {
  const tiles = [
    [W, W, W, W, W, W, W],
    [W, F, F, "portal", F, F, W],
    [W, W, W, W, W, W, W],
  ];
  return {
    tiles,
    spawn: { x: 1, y: 1 },
    portals: [
      { x: 3, y: 1, color: "blue" },
      { x: 3, y: 1, color: "red" },
    ],
  };
}

function nearRoomBattleKeys(tiles: string[][]): Set<string> {
  // Fixture fight graph: floors west of the choke, not the choke, not far.
  const keys = new Set<string>();
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < (tiles[y]?.length ?? 0); x++) {
      if (x >= 3) continue;
      if (tiles[y][x] === F) keys.add(`${x},${y}`);
    }
  }
  return keys;
}

describe("seed-portal-cut-stacked-destack", () => {
  it("does not relocate a stacked exit onto the far side of a portal choke", () => {
    const { tiles, spawn, portals } = portalCutStackFixture();
    const before = evaluateSolvability(
      tiles,
      new Set(),
      spawn,
      portals,
      [],
      7,
      3,
    );
    assert.ok(before.stackedPortals > 0, "fixture must start stacked");

    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: spawn,
      portals,
      spawns: [],
      w: 7,
      h: 3,
    });
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
    assert.equal(after.stackedPortals, 0);
    assert.equal(after.battleIsolatedPortals, 0);
    assert.equal(after.portalTileMismatch, 0);

    const choke = { x: 3, y: 1 };
    const farKeys = new Set(["4,1", "5,1"]);
    const nearBattle = nearRoomBattleKeys(finalized.tiles);
    for (const p of finalized.portals) {
      assert.equal(
        farKeys.has(`${p.x},${p.y}`),
        false,
        `destacked portal at ${p.x},${p.y} hopped the choke`,
      );
      assert.equal(
        portalSteppableFromBattle(p, finalized.playerSpawn, nearBattle),
        true,
        `portal at ${p.x},${p.y} must be steppable from the near room`,
      );
    }
    assert.equal(
      finalized.tiles[choke.y][choke.x],
      "portal",
      "must keep the original choke tile (aesthetics / first exit)",
    );
    assert.equal(
      finalized.tiles[1][4],
      F,
      "must not wall the far-side floor (aesthetics)",
    );
    assert.equal(
      finalized.tiles[1][5],
      F,
      "must not wall the far-side floor (aesthetics)",
    );
  });

  it("relocates a far-island exit that is only overworld-reachable through a choke", () => {
    const tiles = [
      [W, W, W, W, W, W, W],
      [W, F, F, "portal", F, F, W],
      [W, W, W, W, W, W, W],
    ];
    const spawn = { x: 1, y: 1 };
    const portals = [
      { x: 3, y: 1, color: "blue" },
      { x: 5, y: 1, color: "red" },
    ];
    const before = evaluateSolvability(
      tiles,
      new Set(),
      spawn,
      portals,
      [],
      7,
      3,
    );
    assert.ok(
      before.battleIsolatedPortals > 0,
      "fixture must start with a fight-graph-isolated exit",
    );

    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: spawn,
      portals,
      spawns: [],
      w: 7,
      h: 3,
    });
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
    assert.equal(after.battleIsolatedPortals, 0);
    const farKeys = new Set(["4,1", "5,1"]);
    const nearBattle = nearRoomBattleKeys(finalized.tiles);
    for (const p of finalized.portals) {
      assert.equal(
        farKeys.has(`${p.x},${p.y}`),
        false,
        `portal at ${p.x},${p.y} stayed on the far island`,
      );
      assert.equal(
        portalSteppableFromBattle(p, finalized.playerSpawn, nearBattle),
        true,
        `portal at ${p.x},${p.y} must be steppable from the near room`,
      );
    }
    assert.equal(finalized.tiles[1][3], "portal");
    assert.equal(finalized.tiles[1][4], F);
    assert.equal(finalized.tiles[1][5], F);
  });

  it("recorded chessboard seeds keep every portal on the fight graph", () => {
    const recorded = [2876, 2967];
    const archetypes = MAP_ARCHETYPES.map((a) => a.type);
    for (const seed of recorded) {
      const world = generateSeededWorld({
        seed,
        runMode: "none",
        archetype: archetypes[seed % archetypes.length],
      });
      const report = reportWorld(world);
      assert.equal(
        report.ok,
        true,
        `seed ${seed} ${world.archetype}: ${report.failures.join(",")}`,
      );
      assert.equal(report.battleIsolatedPortals, 0, `seed ${seed}`);
    }
  });

  it("keeps every generated overworld portal steppable from the fight graph", () => {
    const seeds = Array.from({ length: 256 }, (_, i) => 2200 + i * 13);
    const archetypes = MAP_ARCHETYPES.map((a) => a.type);
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "none",
        archetype: archetypes[seed % archetypes.length],
      });
      const report = reportWorld(world);
      if (!report.ok || report.battleIsolatedPortals > 0) {
        failures.push(
          `seed ${seed} ${world.archetype}: ${report.failures.join(",")}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
