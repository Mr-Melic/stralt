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
import { createSeededRng, evaluateSolvability } from "./mapGen.ts";
import {
  type OccupancyContext,
  applyAttract,
  applyPushback,
  collectMandatoryProgressionCells,
  occKey,
  occupantsSealProgression,
} from "./occupancy.ts";
import {
  applyAttractUnsealing,
  applyPushbackUnsealing,
  floodKnockbackBattleGraph,
  unsealKnockbackLanding,
} from "./occupancyKnockbackUnseal.ts";

/**
 * Stem at (0,1) splits into two 1-wide corridors that rejoin at (4,0).
 * Unique-bridge reserve is empty; one summon per path still cuts every route.
 */
function dualCorridor(extraOccupied: string[] = []) {
  const tiles = [
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, true, true, true, true],
  ];
  const voidTiles = new Set<string>();
  const portals = new Set(["4,0"]);
  const occupied = new Set<string>(["0,1", ...extraOccupied]);
  const ctx: OccupancyContext = {
    tiles,
    barriers: new Set(),
    voidTiles,
    portals,
    progressStart: { x: 0, y: 1 },
    isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
  };
  return { tiles, voidTiles, portals, occupied, ctx };
}

function leftoverIslandFixture() {
  // Dual corridors plus a 1-tile CA crumb at (1,4) behind wall (1,3).
  // Manhattan dump from (2,0) must not hop onto the crumb.
  const tiles = [
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, true, true, true, true],
    [false, false, false, false, false],
    [false, true, false, false, false],
  ];
  const voidTiles = new Set<string>();
  const portals = new Set(["4,0"]);
  const occupied = new Set<string>(["0,1", "2,2"]);
  const ctx: OccupancyContext = {
    tiles,
    barriers: new Set(),
    voidTiles,
    portals,
    progressStart: { x: 0, y: 1 },
    isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
  };
  return { tiles, voidTiles, portals, ctx };
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

describe("knockback dual-path unseal", () => {
  it("seed-dual-push-seals: occupancy pushback stays on the second corridor", () => {
    const { tiles, voidTiles, portals, ctx } = dualCorridor(["2,2", "1,0"]);
    const unique = collectMandatoryProgressionCells(tiles, voidTiles, portals, {
      x: 0,
      y: 1,
    });
    assert.equal(unique.size, 0, "two routes ⇒ no unique bridge");
    const raw = applyPushback({ x: 1, y: 0 }, { x: 0, y: 0 }, 1, ctx);
    assert.equal(occKey(raw.x, raw.y), "2,0");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        raw,
        { x: 2, y: 2 },
      ]),
      true,
      "fixture must start sealed after unique-bridge-only slide",
    );
  });

  it("seed-dual-push-seals: helper unseals the knockback landing", () => {
    const { tiles, voidTiles, portals, ctx } = dualCorridor(["2,2", "1,0"]);
    const landed = applyPushbackUnsealing(
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      1,
      ctx,
    );
    assert.notEqual(occKey(landed.x, landed.y), "2,0");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        landed,
        { x: 2, y: 2 },
      ]),
      false,
    );
  });

  it("seed-dual-attract-seals: helper unseals an attraction onto the second corridor", () => {
    const { tiles, voidTiles, portals, ctx } = dualCorridor(["2,0", "3,2"]);
    const raw = applyAttract({ x: 3, y: 2 }, { x: 0, y: 1 }, 1, ctx);
    assert.equal(occKey(raw.x, raw.y), "2,2");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        { x: 2, y: 0 },
        raw,
      ]),
      true,
    );
    const landed = applyAttractUnsealing(
      { x: 3, y: 2 },
      { x: 0, y: 1 },
      1,
      ctx,
    );
    assert.notEqual(occKey(landed.x, landed.y), "2,2");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        { x: 2, y: 0 },
        landed,
      ]),
      false,
    );
  });

  it("seed-unique-push-still-slides: unique-bridge pushback stays off the only exit", () => {
    const tiles = [
      [true, true, true, true, true, true],
      [true, true, false, false, false, false],
    ];
    const voidTiles = new Set<string>();
    const portals = new Set(["5,0"]);
    const occupied = new Set<string>(["0,0", "1,0"]);
    const ctx: OccupancyContext = {
      tiles,
      barriers: new Set(),
      voidTiles,
      portals,
      progressStart: { x: 0, y: 0 },
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    const mandatory = collectMandatoryProgressionCells(
      tiles,
      voidTiles,
      portals,
      { x: 0, y: 0 },
    );
    ctx.reserved = mandatory;
    assert.equal(mandatory.has("2,0"), true);
    const landed = applyPushbackUnsealing(
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      1,
      ctx,
    );
    assert.equal(mandatory.has(occKey(landed.x, landed.y)), false);
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 0 }, [
        landed,
      ]),
      false,
    );
  });

  it("seed-open-field-knockback-noop: an open room does not relocate a free landing", () => {
    const tiles = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    const ctx: OccupancyContext = {
      tiles,
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(["2,2"]),
      progressStart: { x: 0, y: 0 },
      isOccupied: (c) => c.x === 0 && c.y === 0,
    };
    const landed = unsealKnockbackLanding({ x: 1, y: 0 }, { x: 1, y: 0 }, ctx);
    assert.equal(occKey(landed.x, landed.y), "1,0");
  });

  it("seed-knockback-no-join-island: landing stays on the spawn fight graph", () => {
    const { tiles, voidTiles, portals, ctx } = leftoverIslandFixture();
    const battle = floodKnockbackBattleGraph(ctx, { x: 0, y: 1 });
    assert.equal(
      battle.has("1,4"),
      false,
      "crumb must start off the fight graph",
    );
    const landed = applyPushbackUnsealing(
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      1,
      ctx,
    );
    assert.equal(battle.has(occKey(landed.x, landed.y)), true);
    assert.notEqual(occKey(landed.x, landed.y), "1,4");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        landed,
        { x: 2, y: 2 },
      ]),
      false,
    );
  });
});

function knockbackFirstHostile(world: {
  tiles: string[][];
  voidTiles: Set<string>;
  portals: { x: number; y: number }[];
  playerSpawn: { x: number; y: number };
  spawns: { x: number; y: number }[];
}): { ok: boolean; failures: string[] } {
  const size = world.tiles[0]?.length ?? WORLD_GRID_SIZE;
  if (world.spawns.length === 0) {
    const report = evaluateSolvability(
      world.tiles,
      world.voidTiles,
      world.playerSpawn,
      world.portals,
      world.spawns,
      size,
      world.tiles.length,
    );
    return { ok: report.ok, failures: report.failures };
  }
  const target = world.spawns[0];
  const rest = world.spawns.slice(1);
  const ctx = worldOccupancy(
    world.tiles,
    world.voidTiles,
    world.playerSpawn,
    world.portals,
    world.spawns,
  );
  const landed = applyPushbackUnsealing(target, world.playerSpawn, 2, ctx);
  const nextSpawns = [landed, ...rest];
  const report = evaluateSolvability(
    world.tiles,
    world.voidTiles,
    world.playerSpawn,
    world.portals,
    nextSpawns,
    size,
    world.tiles.length,
  );
  const battle = floodKnockbackBattleGraph(ctx, world.playerSpawn);
  const onGraph = battle.size === 0 || battle.has(occKey(landed.x, landed.y));
  if (!onGraph) {
    return {
      ok: false,
      failures: [`off-fight-graph:${occKey(landed.x, landed.y)}`],
    };
  }
  return { ok: report.ok, failures: report.failures };
}

describe("knockback unseal property suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack knockback stays solvable across 256 seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
        enemyCount: 6,
      });
      const destack = simulateBattleStartOnWorld(world);
      const after = knockbackFirstHostile({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      });
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander knockback stays solvable across 256 seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
        enemyCount: 6,
      });
      const wander = simulateEnemyWanderOnWorld(
        world,
        12,
        createSeededRng(seed + 99),
      );
      const after = knockbackFirstHostile({
        ...world,
        spawns: wander.spawns,
      });
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack knockback stays solvable across 64 seeds", () => {
    const failures: string[] = [];
    for (let i = 0; i < 64; i++) {
      const seed = 2000 + i * 13;
      const world = generateSeededBossRushRoom(seed);
      const destack = simulateBattleStartOnWorld(world);
      const after = knockbackFirstHostile({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      });
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack knockback stays solvable across 64 seeds", () => {
    const failures: string[] = [];
    for (let i = 0; i < 64; i++) {
      const seed = 3000 + i * 19;
      const world = simulateRestExitEncounter(seed, "dungeon");
      const destack = simulateBattleStartOnWorld(world);
      const after = knockbackFirstHostile({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      });
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
