import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  reportWorld,
  simulateRestExitEncounter,
} from "./mapGen.simulate.ts";
import {
  MAP_ARCHETYPES,
  applyFinalizedLayout,
  countStrayPortalTiles,
  evaluateSolvability,
  finalizePlayableLayout,
  placeBossRushSpawns,
  punchRosterReachability,
  reconcilePortalTiles,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

function strayCount(
  tiles: string[][],
  portals: { x: number; y: number }[],
): number {
  return countStrayPortalTiles(
    tiles,
    portals,
    tiles[0]?.length ?? 0,
    tiles.length,
  );
}

function cloneTiles(tiles: string[][]): string[][] {
  return tiles.map((row) => row.slice());
}

/**
 * Spawn (2,0) + exit object (0,0) share a 3-wide landing. Unique
 * orthogonal bridge (2,1) is the only battle path to the far hostile
 * at (4,2). A leftover portal *tile* on that bridge is a battle wall
 * (`collectPortalBlockers`) even when the portal object sits at (0,0).
 * `bfsCarvePath` would join a 1-wall island instead of relocating, so
 * the phantom is planted after punch — the WX leftover-tile class.
 */
function bridgeRoom(): string[][] {
  return [
    [F, F, F, W, W],
    [W, W, F, W, W],
    [W, W, F, F, F],
    [W, W, W, W, W],
    [W, W, W, W, W],
  ];
}

describe("stale punch portal objects vs punched tiles", () => {
  it("seed-stale-boss-rush-portal: WX-style leftover tile cannot cut the fight graph", () => {
    const tiles = bridgeRoom();
    const stalePortal = { x: 0, y: 0 };
    tiles[0][0] = "portal";
    const placed = placeBossRushSpawns(
      tiles,
      new Set(),
      [{ x: 4, y: 2 }],
      { x: 2, y: 0 },
      stalePortal,
      5,
      5,
    );
    // spawnBossRushRoom copies punched.tiles but keeps nextMap.portals[0]
    // at the pre-punch object. Inject the leftover tile on the unique
    // bridge — independent of whether punch carved or relocated.
    const wxTiles = cloneTiles(placed.tiles);
    wxTiles[1][2] = "portal";
    assert.equal(
      strayCount(wxTiles, [stalePortal]) > 0,
      true,
      "punched tiles + stale object must start with a phantom portal tile",
    );
    const before = evaluateSolvability(
      wxTiles,
      new Set(),
      placed.playerSpawn,
      [stalePortal],
      placed.spawns,
      5,
      5,
    );
    assert.equal(before.strayPortalTiles > 0, true);
    assert.equal(
      before.clearingUnlocks,
      false,
      "phantom on the unique bridge must seal sequential clear",
    );

    const finalized = finalizePlayableLayout({
      tiles: wxTiles,
      voidTiles: new Set(),
      playerSpawn: placed.playerSpawn,
      portals: [{ ...stalePortal }],
      spawns: placed.spawns,
      w: 5,
      h: 5,
    });
    assert.equal(
      strayCount(finalized.tiles, finalized.portals),
      0,
      "phantom portal tiles must be floored so they cannot cut battle walk",
    );
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
    assert.equal(after.strayPortalTiles, 0);
    assert.equal(after.portalTileMismatch, 0);
    assert.equal(after.clearingUnlocks, true);
  });

  it("seed-stale-rest-exit-portal: punchRosterReachability tiles cannot orphan a choke", () => {
    const tiles = bridgeRoom();
    const stalePortal = { x: 0, y: 0 };
    tiles[0][0] = "portal";
    const punched = punchRosterReachability(
      tiles,
      new Set(),
      [{ x: 4, y: 2, id: "rat" }],
      { x: 2, y: 0 },
      stalePortal,
      5,
      5,
    );
    const wxTiles = cloneTiles(punched.tiles);
    wxTiles[1][2] = "portal";
    const map = {
      tiles: wxTiles,
      portals: [{ ...stalePortal }],
    };
    assert.equal(strayCount(map.tiles, map.portals) > 0, true);
    const applied = applyFinalizedLayout(
      map,
      punched.roster,
      punched.playerSpawn,
      5,
    );
    assert.equal(strayCount(map.tiles, map.portals), 0);
    const after = evaluateSolvability(
      map.tiles,
      new Set(),
      applied.spawn,
      map.portals,
      applied.roster,
      5,
      5,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(after.strayPortalTiles, 0);
    assert.equal(after.clearingUnlocks, true);
  });

  it("reconcilePortalTiles floors orphans and restamps objects", () => {
    const tiles = [
      [F, "portal", F],
      [F, F, "portal"],
      [F, F, F],
    ];
    const portals = [{ x: 1, y: 0 }];
    const cleared = reconcilePortalTiles(tiles, portals, 3, 3);
    assert.equal(cleared, 1);
    assert.equal(tiles[1][2], F);
    assert.equal(tiles[0][1], "portal");
    assert.equal(strayCount(tiles, portals), 0);
  });
});

describe("seeded maps have no stray portal tiles", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);
  const archetypes = MAP_ARCHETYPES.map((a) => a.type);

  it("keeps tile/object portal parity after Boss Rush preferred-cell punch", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededBossRushRoom(seed);
      const report = reportWorld(world);
      if (!report.ok || report.strayPortalTiles > 0) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps tile/object portal parity on rest-exit punch then finalize", () => {
    const failures: string[] = [];
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of seeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const report = reportWorld(world);
        if (!report.ok || report.strayPortalTiles > 0) {
          failures.push(
            `${restExitType} seed ${seed}: ${report.failures.join(",")}`,
          );
        }
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("generated worlds have no orphan portal tiles", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: archetypes[seed % archetypes.length],
      });
      const report = reportWorld(world);
      if (report.strayPortalTiles > 0) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("WORLD_GRID_SIZE Boss Rush rooms stay stray-free across 10-room sequences", () => {
    const failures: string[] = [];
    for (let seq = 0; seq < 32; seq++) {
      for (let room = 0; room < 10; room++) {
        const world = generateSeededBossRushRoom(9000 + seq * 97 + room);
        const report = reportWorld(world);
        if (report.strayPortalTiles > 0 || !report.ok) {
          failures.push(
            `seq ${seq} room ${room}: ${report.failures.join(",")}`,
          );
        }
        assert.equal(world.tiles.length, WORLD_GRID_SIZE);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
