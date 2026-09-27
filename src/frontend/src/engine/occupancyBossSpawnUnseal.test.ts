import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  generateSeededBossRushRoom,
  generateSeededWorld,
  simulateBattleStartOnWorld,
  simulateEnemyWanderOnWorld,
  simulateRestExitEncounter,
} from "./mapGen.simulate.ts";
import {
  createSeededRng,
  evaluateSolvability,
  sequentialClearUnlocks,
} from "./mapGen.ts";
import {
  type OccupancyContext,
  isCellFree,
  occKey,
  occupantsSealProgression,
} from "./occupancy.ts";
import {
  floodBossSpawnBattleGraph,
  legalizeBossSpawnLanding,
  legalizeBossSpawnLandings,
  resolveTeleportAdjacentLanding,
} from "./occupancyBossSpawnUnseal.ts";

function ctxFrom(
  tiles: boolean[][],
  portals: Set<string>,
  occupied: Set<string>,
  start: { x: number; y: number },
  voidTiles: Set<string> = new Set(),
): OccupancyContext {
  return {
    tiles,
    barriers: new Set(),
    voidTiles,
    portals,
    progressStart: start,
    isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
  };
}

function worldOccupancy(
  tiles: string[][],
  voidTiles: Set<string>,
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupants: { x: number; y: number }[],
): OccupancyContext {
  const boolTiles = tiles.map((row) => row.map((t) => t !== "wall"));
  const portalSet = new Set(portals.map((p) => `${p.x},${p.y}`));
  const taken = new Set<string>([
    `${spawn.x},${spawn.y}`,
    ...occupants.map((c) => occKey(c.x, c.y)),
  ]);
  return {
    tiles: boolTiles,
    barriers: new Set(),
    voidTiles,
    portals: portalSet,
    progressStart: spawn,
    isOccupied: (c) => taken.has(occKey(c.x, c.y)),
  };
}

/** Same scan `applyGhostSummon` uses: first walkable tile that is not occupied. */
function rawGhostRasterCell(
  tiles: boolean[][],
  occupied: Set<string>,
): { x: number; y: number } | null {
  for (let gy = 0; gy < tiles.length; gy++) {
    for (let gx = 0; gx < (tiles[gy]?.length ?? 0); gx++) {
      if (!tiles[gy]?.[gx]) continue;
      const k = occKey(gx, gy);
      if (occupied.has(k)) continue;
      return { x: gx, y: gy };
    }
  }
  return null;
}

function dualFarIsland() {
  // Left crumb (0,0)-(1,0), portal (2,0), fight room (3,0)-(5,0).
  // Overworld flood walks the portal; battle does not.
  const tiles = [
    [true, true, true, true, true, true],
    [false, false, false, false, false, false],
  ];
  const portals = new Set(["2,0"]);
  const occupied = new Set<string>(["4,0"]);
  const ctx = ctxFrom(tiles, portals, occupied, { x: 4, y: 0 });
  return { tiles, portals, occupied, ctx };
}

describe("ghost raster parks off the fight graph", () => {
  it("seed-ghost-raster-far-island: raw (0,0) scan picks the far crumb", () => {
    const { tiles, occupied, ctx } = dualFarIsland();
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.deepEqual(raw, { x: 0, y: 0 });
    const battle = floodBossSpawnBattleGraph(ctx, { x: 4, y: 0 });
    assert.equal(battle.has("0,0"), false, "fixture must start off-graph");
    assert.equal(battle.has("4,0"), true);
  });

  it("seed-ghost-raster-far-island: helper snaps onto the fight room", () => {
    const { tiles, portals, occupied, ctx } = dualFarIsland();
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.ok(raw);
    const landed = legalizeBossSpawnLanding(raw, ctx, { x: 4, y: 0 });
    const battle = floodBossSpawnBattleGraph(ctx, { x: 4, y: 0 });
    assert.equal(battle.has(occKey(landed.x, landed.y)), true);
    assert.equal(occKey(landed.x, landed.y) === "0,0", false);
    assert.equal(occKey(landed.x, landed.y) === "1,0", false);
    assert.equal(
      occupantsSealProgression(tiles, new Set(), portals, { x: 4, y: 0 }, [
        landed,
      ]),
      false,
    );
  });

  it("seed-ghost-chess-3: raster (1,0) is isolated; helper restores sequential clear", () => {
    const world = generateSeededWorld({
      seed: 3,
      runMode: "none",
      archetype: "chessboard",
    });
    const destack = simulateBattleStartOnWorld(world);
    const occupied = new Set<string>([
      `${destack.playerSpawn.x},${destack.playerSpawn.y}`,
      ...destack.spawns.map((s) => occKey(s.x, s.y)),
    ]);
    const tiles = world.tiles.map((row) => row.map((t) => t !== "wall"));
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.ok(raw);
    const before = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      [...destack.spawns, raw],
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(
      before.isolatedEnemies > 0,
      true,
      "fixture must start isolated",
    );
    const ctx = worldOccupancy(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      destack.spawns,
    );
    const landed = legalizeBossSpawnLanding(raw, ctx, destack.playerSpawn);
    const after = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      [...destack.spawns, landed],
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(after.isolatedEnemies, 0, after.failures.join(","));
    assert.equal(
      sequentialClearUnlocks(
        world.tiles,
        world.voidTiles,
        destack.playerSpawn,
        world.portals,
        [...destack.spawns, landed],
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      ),
      true,
    );
  });

  it("seed-ghost-corridor-8: raster (0,0) is isolated; helper restores sequential clear", () => {
    const world = generateSeededWorld({
      seed: 8,
      runMode: "dungeon",
      archetype: "corridorMaze",
    });
    const destack = simulateBattleStartOnWorld(world);
    const occupied = new Set<string>([
      `${destack.playerSpawn.x},${destack.playerSpawn.y}`,
      ...destack.spawns.map((s) => occKey(s.x, s.y)),
    ]);
    const tiles = world.tiles.map((row) => row.map((t) => t !== "wall"));
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.ok(raw);
    const before = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      [...destack.spawns, raw],
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(before.clearingUnlocks, false, "fixture must start locked");
    const ctx = worldOccupancy(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      destack.spawns,
    );
    const landed = legalizeBossSpawnLanding(raw, ctx, destack.playerSpawn);
    const after = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      [...destack.spawns, landed],
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(after.isolatedEnemies, 0, after.failures.join(","));
    assert.equal(after.clearingUnlocks, true, after.failures.join(","));
  });

  it("seed-open-field-ghost-noop: raster already on the fight graph stays put", () => {
    const tiles = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    const portals = new Set(["2,2"]);
    const occupied = new Set<string>(["0,0"]);
    const ctx = ctxFrom(tiles, portals, occupied, { x: 0, y: 0 });
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.deepEqual(raw, { x: 1, y: 0 });
    const landed = legalizeBossSpawnLanding(raw!, ctx, { x: 0, y: 0 });
    assert.deepEqual(landed, { x: 1, y: 0 });
  });

  it("seed-ghost-no-join-island: snap must not punch the portal into a corridor", () => {
    const { tiles, occupied, ctx } = dualFarIsland();
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.ok(raw);
    const before = tiles.map((row) => row.slice());
    legalizeBossSpawnLanding(raw, ctx, { x: 4, y: 0 });
    assert.deepEqual(tiles, before);
  });

  it("seed-ghost-dual-spawns: second raster still stays on the fight graph", () => {
    const { tiles, occupied, ctx } = dualFarIsland();
    const first = rawGhostRasterCell(tiles, occupied);
    assert.ok(first);
    const landed = legalizeBossSpawnLandings([first, { x: 1, y: 0 }], ctx, {
      x: 4,
      y: 0,
    });
    const battle = floodBossSpawnBattleGraph(ctx, { x: 4, y: 0 });
    assert.equal(landed.length, 2);
    assert.equal(battle.has(occKey(landed[0].x, landed[0].y)), true);
    assert.equal(battle.has(occKey(landed[1].x, landed[1].y)), true);
    assert.notEqual(
      occKey(landed[0].x, landed[0].y),
      occKey(landed[1].x, landed[1].y),
    );
  });

  it("seed-ghost-chess-106: leftover (1,0) crumb snaps onto the fight room", () => {
    const world = generateSeededWorld({
      seed: 106,
      runMode: "none",
      archetype: "chessboard",
    });
    const destack = simulateBattleStartOnWorld(world);
    const occupied = new Set<string>([
      `${destack.playerSpawn.x},${destack.playerSpawn.y}`,
      ...destack.spawns.map((s) => occKey(s.x, s.y)),
    ]);
    const tiles = world.tiles.map((row) => row.map((t) => t !== "wall"));
    const raw = rawGhostRasterCell(tiles, occupied);
    assert.deepEqual(raw, { x: 1, y: 0 });
    const ctx = worldOccupancy(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      destack.spawns,
    );
    const battle = floodBossSpawnBattleGraph(ctx, destack.playerSpawn);
    assert.equal(battle.has("1,0"), false, "fixture must start off-graph");
    const landed = legalizeBossSpawnLanding(raw!, ctx, destack.playerSpawn);
    assert.equal(battle.has(occKey(landed.x, landed.y)), true);
    const after = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      [...destack.spawns, landed],
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(after.isolatedEnemies, 0, after.failures.join(","));
    assert.equal(after.clearingUnlocks, true, after.failures.join(","));
  });
});

describe("teleport-adjacent portal-as-floor", () => {
  it("seed-teleport-onto-portal: raw adjacent includes the gate; helper refuses it", () => {
    const tiles = [
      [true, true, true, true],
      [false, false, false, false],
    ];
    const portals = new Set(["1,0"]);
    const occupied = new Set<string>(["2,0"]);
    const ctx = ctxFrom(tiles, portals, occupied, { x: 2, y: 0 });
    const landed = resolveTeleportAdjacentLanding(
      [
        { x: 1, y: 0 },
        { x: 3, y: 0 },
      ],
      ctx,
      { x: 2, y: 0 },
    );
    assert.ok(landed);
    assert.equal(occKey(landed.x, landed.y), "3,0");
    assert.equal(isCellFree(landed, ctx), true);
  });

  it("seed-teleport-only-portal: snaps onto the fight graph instead of the gate", () => {
    // Far crumb (0,0), gate (1,0), player (2,0), dump (3,0). The only
    // candidate is the portal-as-floor neighbor.
    const tiles = [
      [true, true, true, true],
      [false, false, false, false],
    ];
    const portals = new Set(["1,0"]);
    const occupied = new Set<string>(["2,0"]);
    const ctx = ctxFrom(tiles, portals, occupied, { x: 2, y: 0 });
    const landed = resolveTeleportAdjacentLanding([{ x: 1, y: 0 }], ctx, {
      x: 2,
      y: 0,
    });
    assert.ok(landed);
    assert.equal(ctx.portals.has(occKey(landed.x, landed.y)), false);
    assert.equal(occKey(landed.x, landed.y), "3,0");
    const battle = floodBossSpawnBattleGraph(ctx, { x: 2, y: 0 });
    assert.equal(battle.has(occKey(landed.x, landed.y)), true);
  });
});

function assertGhostLegalized(
  label: string,
  seed: number,
  world: ReturnType<typeof generateSeededWorld>,
): void {
  const destack = simulateBattleStartOnWorld(world);
  const occupied = new Set<string>([
    `${destack.playerSpawn.x},${destack.playerSpawn.y}`,
    ...destack.spawns.map((s) => occKey(s.x, s.y)),
  ]);
  const tiles = world.tiles.map((row) => row.map((t) => t !== "wall"));
  const raw = rawGhostRasterCell(tiles, occupied);
  if (!raw) return;
  const ctx = worldOccupancy(
    world.tiles,
    world.voidTiles,
    destack.playerSpawn,
    world.portals,
    destack.spawns,
  );
  const landed = legalizeBossSpawnLanding(raw, ctx, destack.playerSpawn);
  const report = evaluateSolvability(
    world.tiles,
    world.voidTiles,
    destack.playerSpawn,
    world.portals,
    [...destack.spawns, landed],
    WORLD_GRID_SIZE,
    WORLD_GRID_SIZE,
  );
  assert.equal(
    report.isolatedEnemies,
    0,
    `${label} seed ${seed}: ${report.failures.join(",")}`,
  );
  assert.equal(
    sequentialClearUnlocks(
      world.tiles,
      world.voidTiles,
      destack.playerSpawn,
      world.portals,
      [...destack.spawns, landed],
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    ),
    true,
    `${label} seed ${seed}: sequential clear locked`,
  );
}

describe("256-seed destack ghost raster stays engageable", () => {
  it("corridorMaze dungeon destack + ghost raster", () => {
    for (let seed = 0; seed < 256; seed++) {
      assertGhostLegalized(
        "corridor",
        seed,
        generateSeededWorld({
          seed,
          runMode: "dungeon",
          archetype: "corridorMaze",
        }),
      );
    }
  });

  it("chessboard destack + ghost raster", () => {
    for (let seed = 0; seed < 256; seed++) {
      assertGhostLegalized(
        "chess",
        seed,
        generateSeededWorld({
          seed,
          runMode: "none",
          archetype: "chessboard",
        }),
      );
    }
  });

  it("corridorMaze wander then destack + ghost raster", () => {
    for (let seed = 0; seed < 256; seed++) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const wandered = simulateEnemyWanderOnWorld(
        world,
        8,
        createSeededRng(seed + 91),
      );
      assertGhostLegalized("wander", seed, {
        ...world,
        spawns: wandered.spawns,
      });
    }
  });
});

describe("64-seed Boss Rush / rest-exit destack ghost raster", () => {
  it("Boss Rush destack + ghost raster", () => {
    for (let seed = 0; seed < 64; seed++) {
      assertGhostLegalized("bossRush", seed, generateSeededBossRushRoom(seed));
    }
  });

  it("rest-exit destack + ghost raster", () => {
    for (let seed = 0; seed < 64; seed++) {
      assertGhostLegalized(
        "restExit",
        seed,
        simulateRestExitEncounter(seed, "dungeon"),
      );
    }
  });
});
