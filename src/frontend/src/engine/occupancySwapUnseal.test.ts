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
  collectMandatoryProgressionCells,
  occKey,
  occupantsSealProgression,
} from "./occupancy.ts";
import {
  floodSwapBattleGraph,
  resolveSwapPositions,
  unsealOccupantsAfterPlayerDisplace,
} from "./occupancySwapUnseal.ts";

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
  const tiles = [
    [true, true, true, true, true],
    [true, false, false, false, true],
    [true, true, true, true, true],
    [false, false, false, false, false],
    [false, true, false, false, false],
  ];
  const voidTiles = new Set<string>();
  const portals = new Set(["4,0"]);
  const occupied = new Set<string>(["0,1", "1,4"]);
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

describe("swap dual-path / choke unseal", () => {
  it("seed-swap-onto-choke: raw swap parks the enemy on the unique corridor", () => {
    const tiles = [
      [true, true, true, true, true, true],
      [true, true, false, false, false, false],
    ];
    const voidTiles = new Set<string>();
    const portals = new Set(["5,0"]);
    const mandatory = collectMandatoryProgressionCells(
      tiles,
      voidTiles,
      portals,
      { x: 1, y: 1 },
    );
    assert.equal(mandatory.has("2,0"), true);
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 1, y: 1 }, [
        { x: 2, y: 0 },
      ]),
      true,
      "fixture must start sealed after a raw player↔pocket swap",
    );
  });

  it("seed-swap-onto-choke: helper relocates the enemy off the unique corridor", () => {
    const tiles = [
      [true, true, true, true, true, true],
      [true, true, false, false, false, false],
    ];
    const voidTiles = new Set<string>();
    const portals = new Set(["5,0"]);
    const occupied = new Set<string>(["2,0", "1,1"]);
    const ctx: OccupancyContext = {
      tiles,
      barriers: new Set(),
      voidTiles,
      portals,
      progressStart: { x: 2, y: 0 },
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    const resolved = resolveSwapPositions({ x: 2, y: 0 }, { x: 1, y: 1 }, ctx);
    assert.equal(occKey(resolved.player.x, resolved.player.y), "1,1");
    assert.equal(
      resolved.occupants.length,
      1,
      "enemy must still occupy a cell",
    );
    assert.equal(
      occupantsSealProgression(
        tiles,
        voidTiles,
        portals,
        resolved.player,
        resolved.occupants,
      ),
      false,
    );
    assert.equal(
      resolved.occupants.some((o) => occKey(o.x, o.y) === "2,0"),
      false,
    );
  });

  it("seed-dual-swap-seals: raw swap onto the stem jointly cuts both corridors", () => {
    const { tiles, voidTiles, portals } = dualCorridor(["2,0", "2,2"]);
    const unique = collectMandatoryProgressionCells(tiles, voidTiles, portals, {
      x: 0,
      y: 1,
    });
    assert.equal(unique.size, 0, "two routes ⇒ no unique bridge");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        { x: 2, y: 0 },
        { x: 2, y: 2 },
      ]),
      true,
      "fixture must start sealed after swapping the player off a corridor",
    );
  });

  it("seed-dual-swap-seals: helper unseals the swapped enemy", () => {
    const { tiles, voidTiles, portals, ctx } = dualCorridor(["2,0", "2,2"]);
    ctx.progressStart = { x: 2, y: 0 };
    const resolved = resolveSwapPositions({ x: 2, y: 0 }, { x: 0, y: 1 }, ctx);
    assert.equal(occKey(resolved.player.x, resolved.player.y), "0,1");
    assert.equal(
      resolved.occupants.length,
      2,
      "enemy and the other corridor occupant must remain",
    );
    assert.equal(
      occupantsSealProgression(
        tiles,
        voidTiles,
        portals,
        resolved.player,
        resolved.occupants,
      ),
      false,
    );
  });

  it("seed-open-field-swap-noop: an open room keeps the exchanged cells", () => {
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
      isOccupied: (c) => (c.x === 0 && c.y === 0) || (c.x === 1 && c.y === 1),
    };
    const resolved = resolveSwapPositions({ x: 0, y: 0 }, { x: 1, y: 1 }, ctx);
    assert.equal(occKey(resolved.player.x, resolved.player.y), "1,1");
    assert.deepEqual(resolved.occupants, [{ x: 0, y: 0 }]);
  });

  it("seed-swap-no-join-island: refuse swapping the player onto a leftover crumb", () => {
    const { tiles, voidTiles, portals, ctx } = leftoverIslandFixture();
    const battle = floodSwapBattleGraph(ctx, { x: 0, y: 1 });
    assert.equal(
      battle.has("1,4"),
      false,
      "crumb must start off the fight graph",
    );
    const resolved = resolveSwapPositions({ x: 0, y: 1 }, { x: 1, y: 4 }, ctx);
    assert.equal(occKey(resolved.player.x, resolved.player.y), "0,1");
    assert.equal(
      resolved.occupants.some((o) => occKey(o.x, o.y) === "1,4"),
      true,
    );
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, resolved.player, [
        { x: 1, y: 4 },
      ]),
      false,
    );
  });

  it("seed-displace-unseals: player already in the pocket relocates the choke occupant", () => {
    const tiles = [
      [true, true, true, true, true, true],
      [true, true, false, false, false, false],
    ];
    const voidTiles = new Set<string>();
    const portals = new Set(["5,0"]);
    const occupied = new Set<string>(["1,1", "2,0"]);
    const ctx: OccupancyContext = {
      tiles,
      barriers: new Set(),
      voidTiles,
      portals,
      progressStart: { x: 1, y: 1 },
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    const movers = unsealOccupantsAfterPlayerDisplace({ x: 1, y: 1 }, ctx);
    assert.equal(
      occupantsSealProgression(
        tiles,
        voidTiles,
        portals,
        { x: 1, y: 1 },
        movers,
      ),
      false,
    );
    assert.equal(
      movers.some((o) => occKey(o.x, o.y) === "2,0"),
      false,
    );
  });
});

function swapFirstHostile(world: {
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
  const ctx = worldOccupancy(
    world.tiles,
    world.voidTiles,
    world.playerSpawn,
    world.portals,
    world.spawns,
  );
  const resolved = resolveSwapPositions(world.playerSpawn, target, ctx);
  const report = evaluateSolvability(
    world.tiles,
    world.voidTiles,
    resolved.player,
    world.portals,
    resolved.occupants,
    size,
    world.tiles.length,
  );
  const battle = floodSwapBattleGraph(
    worldOccupancy(
      world.tiles,
      world.voidTiles,
      resolved.player,
      world.portals,
      resolved.occupants,
    ),
    resolved.player,
  );
  const playerOnGraph =
    battle.size === 0 ||
    battle.has(occKey(resolved.player.x, resolved.player.y));
  if (!playerOnGraph) {
    return {
      ok: false,
      failures: [
        `off-fight-graph:${occKey(resolved.player.x, resolved.player.y)}`,
      ],
    };
  }
  const sealed = occupantsSealProgression(
    ctx.tiles,
    world.voidTiles,
    ctx.portals,
    resolved.player,
    resolved.occupants,
  );
  if (sealed) {
    return { ok: false, failures: ["swap-sealed-portal"] };
  }
  return { ok: report.ok, failures: report.failures };
}

describe("swap unseal property suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack swap stays solvable across 256 seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
        enemyCount: 6,
      });
      const destack = simulateBattleStartOnWorld(world);
      const after = swapFirstHostile({
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

  it("corridorMaze wander swap stays solvable across 256 seeds", () => {
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
      const after = swapFirstHostile({
        ...world,
        spawns: wander.spawns,
      });
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack swap stays solvable across 64 seeds", () => {
    const failures: string[] = [];
    for (let i = 0; i < 64; i++) {
      const seed = 2000 + i * 13;
      const world = generateSeededBossRushRoom(seed);
      const destack = simulateBattleStartOnWorld(world);
      const after = swapFirstHostile({
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

  it("rest-exit destack swap stays solvable across 64 seeds", () => {
    const failures: string[] = [];
    for (let i = 0; i < 64; i++) {
      const seed = 3000 + i * 19;
      const world = simulateRestExitEncounter(seed, "dungeon");
      const destack = simulateBattleStartOnWorld(world);
      const after = swapFirstHostile({
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
