/**
 * WorldExploration generateRandomMap does NOT finalize. Call sites then
 * punch Boss Rush / rest-exit / boss-portal rosters and run
 * applyFinalizedLayout. simulate.ts used to finalize first, then punch,
 * which hid leftover CA islands and isolated rest-exit hostiles.
 *
 * These tests replay that production order. Do not restack mapGen.ts —
 * leftover-island seal / punch already live on main; this file only locks
 * the WX sequence and failing seeds.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  type SimWorld,
  generateSeededWorld,
  reportWorld,
} from "./mapGen.simulate.ts";
import {
  BOSS_RUSH_PREFERRED_CELLS,
  finalizePlayableLayout,
  placeBossRushSpawns,
  punchRosterReachability,
} from "./mapGen.ts";
import {
  restExitSpawnDepth,
  shouldArmDungeonChainOnRestExit,
} from "./portalRules.ts";

const SEEDS = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

/** Portal tiles with no portal object cut battle walk like a wall. */
function strayPortalTileCount(world: SimWorld): number {
  const objs = new Set(world.portals.map((p) => `${p.x},${p.y}`));
  let n = 0;
  for (let y = 0; y < world.tiles.length; y++) {
    for (let x = 0; x < (world.tiles[0]?.length ?? 0); x++) {
      if (world.tiles[y][x] === "portal" && !objs.has(`${x},${y}`)) n += 1;
    }
  }
  return n;
}

function reportWx(world: SimWorld) {
  const report = reportWorld(world, {
    allowSpawnOnPortal: world.portals.some((p) => p.isWhitePortal),
  });
  return {
    ...report,
    strayPortalTiles: strayPortalTileCount(world),
  };
}

function wxFinalize(
  world: SimWorld,
  punched: {
    tiles: string[][];
    playerSpawn: { x: number; y: number };
    spawns: { x: number; y: number }[];
  },
): SimWorld {
  const finalized = finalizePlayableLayout({
    tiles: punched.tiles,
    voidTiles: world.voidTiles,
    playerSpawn: punched.playerSpawn,
    portals: world.portals,
    spawns: punched.spawns,
    w: WORLD_GRID_SIZE,
    h: WORLD_GRID_SIZE,
    requireExit: true,
  });
  return {
    ...world,
    tiles: finalized.tiles,
    portals: finalized.portals,
    playerSpawn: finalized.playerSpawn,
    spawns: finalized.spawns,
  };
}

/** Rest-exit / dungeon: generateRandomMap → generateEnemies → punch → finalize. */
function wxRestExitSequence(seed: number, restExitType: string): SimWorld {
  const arm = shouldArmDungeonChainOnRestExit(restExitType);
  const depth = restExitSpawnDepth(restExitType);
  const world = generateSeededWorld({
    seed,
    runMode: arm ? "dungeon" : "none",
    enemyCount: 2 + depth,
    finalize: false,
  });
  const punched = punchRosterReachability(
    world.tiles,
    world.voidTiles,
    world.spawns,
    world.playerSpawn,
    world.portals[0],
    WORLD_GRID_SIZE,
    WORLD_GRID_SIZE,
  );
  return wxFinalize(world, {
    tiles: punched.tiles,
    playerSpawn: punched.playerSpawn,
    spawns: punched.roster,
  });
}

/** spawnBossRushRoom: generateRandomMap → placeBossRushSpawns → finalize. */
function wxBossRushSequence(seed: number): SimWorld {
  const world = generateSeededWorld({
    seed,
    runMode: "bossRush",
    enemyCount: 0,
    finalize: false,
  });
  const placed = placeBossRushSpawns(
    world.tiles,
    world.voidTiles,
    BOSS_RUSH_PREFERRED_CELLS.map((c) => ({ x: c.x, y: c.y })),
    world.playerSpawn,
    world.portals[0],
    WORLD_GRID_SIZE,
    WORLD_GRID_SIZE,
  );
  return wxFinalize(world, {
    tiles: placed.tiles,
    playerSpawn: placed.playerSpawn,
    spawns: placed.spawns,
  });
}

/** Boss-portal entry: generateRandomMap → punch (11,5) → finalize. */
function wxBossPortalSequence(seed: number): SimWorld {
  const world = generateSeededWorld({
    seed,
    runMode: "none",
    enemyCount: 0,
    finalize: false,
  });
  const mid = Math.floor(WORLD_GRID_SIZE / 2);
  const punched = punchRosterReachability(
    world.tiles,
    world.voidTiles,
    [{ x: mid + 3, y: mid - 3 }],
    world.playerSpawn,
    world.portals[0],
    WORLD_GRID_SIZE,
    WORLD_GRID_SIZE,
  );
  return wxFinalize(world, {
    tiles: punched.tiles,
    playerSpawn: punched.playerSpawn,
    spawns: punched.roster,
  });
}

describe("WX generate → punch → finalize sequencing", () => {
  it("seed-1459-unfinalized-dungeon: isolated pocket + leftover islands recover", () => {
    const raw = generateSeededWorld({
      seed: 1459,
      runMode: "dungeon",
      finalize: false,
    });
    const before = reportWorld(raw);
    assert.equal(before.enemiesReachable, false, "fixture must start isolated");
    assert.equal(before.clearingUnlocks, false, "fixture must start locked");
    assert.ok(before.leftoverIslands > 0, "fixture must start with CA crumbs");
    const after = reportWx(wxRestExitSequence(1459, "dungeon"));
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(after.strayPortalTiles, 0);
    assert.equal(after.leftoverIslands, 0);
    assert.equal(after.clearingUnlocks, true);
  });

  it("seed-1068-unfinalized-leftover: 20-tile CA crumbs seal after WX sequence", () => {
    const raw = generateSeededWorld({
      seed: 1068,
      runMode: "dungeon",
      finalize: false,
    });
    const before = reportWorld(raw);
    assert.ok(
      before.leftoverIslands >= 20,
      `fixture leftover ${before.leftoverIslands}`,
    );
    const after = reportWx(wxRestExitSequence(1068, "dungeon"));
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(after.leftoverIslands, 0);
  });

  it("rest-exit dungeon punch-then-finalize stays solvable across seeds", () => {
    const failures: string[] = [];
    for (const seed of SEEDS) {
      const world = wxRestExitSequence(seed, "dungeon");
      const report = reportWx(world);
      if (!report.ok || report.strayPortalTiles > 0) {
        failures.push(
          `seed ${seed}: ${report.failures.join(",") || `stray:${report.strayPortalTiles}`}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit overworld and boss punch-then-finalize stay solvable", () => {
    const failures: string[] = [];
    for (const restExitType of ["normal", "boss"] as const) {
      for (const seed of SEEDS) {
        const world = wxRestExitSequence(seed, restExitType);
        const report = reportWx(world);
        if (!report.ok || report.strayPortalTiles > 0) {
          failures.push(
            `${restExitType} seed ${seed}: ${report.failures.join(",") || `stray:${report.strayPortalTiles}`}`,
          );
        }
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush preferred-cell punch-then-finalize stays solvable across seeds", () => {
    const failures: string[] = [];
    for (const seed of SEEDS) {
      const world = wxBossRushSequence(seed);
      const report = reportWx(world);
      if (!report.ok || report.strayPortalTiles > 0) {
        failures.push(
          `seed ${seed}: ${report.failures.join(",") || `stray:${report.strayPortalTiles}`}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("boss-portal (11,5) punch-then-finalize stays walk-reachable across seeds", () => {
    const failures: string[] = [];
    for (const seed of SEEDS) {
      const world = wxBossPortalSequence(seed);
      const report = reportWx(world);
      if (!report.ok || report.strayPortalTiles > 0) {
        failures.push(
          `seed ${seed}: ${report.failures.join(",") || `stray:${report.strayPortalTiles}`}`,
        );
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
