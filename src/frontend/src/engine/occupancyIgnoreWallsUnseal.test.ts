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
  isCellFree,
  occKey,
  occupantsSealProgression,
} from "./occupancy.ts";
import {
  floodIgnoreWallsBattleGraph,
  legalizeIgnoreWallsLanding,
  mirrorCellHorizontal,
  resolveKnightLeapLanding,
  resolveMapMirrorUnsealing,
  resolveMapRotateUnsealing,
  rotateCellClockwise,
} from "./occupancyIgnoreWallsUnseal.ts";

/**
 * Even/even cells are walls — the Chessboard Lich tile rule
 * (`r % 2 === 0 && c % 2 === 0`). Tiles do not rotate with entities.
 */
function chessboardTiles(n: number): boolean[][] {
  return Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => !(x % 2 === 0 && y % 2 === 0)),
  );
}

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

describe("chessboard rotate / mirror land on walls", () => {
  it("seed-rotate-onto-wall: raw rotate parks the player on an even/even wall", () => {
    const n = 6;
    const tiles = chessboardTiles(n);
    const player = { x: 2, y: 1 };
    assert.equal(tiles[player.y][player.x], true, "origin must be floor");
    const raw = rotateCellClockwise(player, n);
    assert.deepEqual(raw, { x: 4, y: 2 });
    assert.equal(tiles[raw.y][raw.x], false, "fixture must land on a wall");
  });

  it("seed-rotate-onto-wall: helper snaps the player onto a fight-graph floor", () => {
    const n = 6;
    const tiles = chessboardTiles(n);
    const portals = new Set(["5,1"]);
    const occupied = new Set<string>(["2,1"]);
    const ctx = ctxFrom(tiles, portals, occupied, { x: 2, y: 1 });
    const resolved = resolveMapRotateUnsealing({ x: 2, y: 1 }, [], ctx, {
      size: n,
    });
    assert.equal(tiles[resolved.player.y][resolved.player.x], true);
    assert.equal(
      occupantsSealProgression(
        tiles,
        new Set(),
        portals,
        resolved.player,
        resolved.occupants,
      ),
      false,
    );
  });

  it("seed-mirror-onto-wall: raw mirror parks the player on an even/even wall", () => {
    const n = 6;
    const tiles = chessboardTiles(n);
    const player = { x: 1, y: 2 };
    assert.equal(tiles[player.y][player.x], true);
    const raw = mirrorCellHorizontal(player, n);
    assert.deepEqual(raw, { x: 4, y: 2 });
    assert.equal(tiles[raw.y][raw.x], false, "fixture must land on a wall");
  });

  it("seed-mirror-onto-wall: helper snaps the player onto a fight-graph floor", () => {
    const n = 6;
    const tiles = chessboardTiles(n);
    const portals = new Set(["5,1"]);
    const occupied = new Set<string>(["1,2"]);
    const ctx = ctxFrom(tiles, portals, occupied, { x: 1, y: 2 });
    const resolved = resolveMapMirrorUnsealing({ x: 1, y: 2 }, [], ctx, {
      size: n,
    });
    assert.equal(tiles[resolved.player.y][resolved.player.x], true);
    assert.equal(
      occupantsSealProgression(
        tiles,
        new Set(),
        portals,
        resolved.player,
        resolved.occupants,
      ),
      false,
    );
  });

  it("seed-rotate-boss-center: boss still legalizes when center is occupied", () => {
    const n = 6;
    const tiles = chessboardTiles(n);
    const portals = new Set(["5,1"]);
    const center = { x: 2, y: 2 };
    assert.equal(tiles[center.y][center.x], false, "n=6 center is a wall");
    const occupied = new Set<string>(["2,1", "1,1"]);
    const ctx = ctxFrom(tiles, portals, occupied, { x: 2, y: 1 });
    const resolved = resolveMapRotateUnsealing(
      { x: 2, y: 1 },
      [{ x: 1, y: 1 }],
      ctx,
      { size: n, bossIndex: 0 },
    );
    assert.equal(tiles[resolved.player.y][resolved.player.x], true);
    assert.equal(resolved.occupants.length, 1);
    assert.equal(tiles[resolved.occupants[0].y][resolved.occupants[0].x], true);
    assert.notEqual(
      occKey(resolved.player.x, resolved.player.y),
      occKey(resolved.occupants[0].x, resolved.occupants[0].y),
    );
  });
});

describe("knight leap ignore-walls landing", () => {
  it("seed-leap-onto-wall: raw L-jump can sit on a chessboard wall", () => {
    const n = 6;
    const tiles = chessboardTiles(n);
    const origin = { x: 1, y: 1 };
    // Wall cells are even/even; (2,2) is the ignore-walls landing a raw leap
    // can write without going through isCellFree.
    assert.equal(tiles[origin.y][origin.x], true);
    assert.equal(tiles[2][2], false);
    const occupied = new Set<string>(["1,1", "5,1"]);
    const ctx = ctxFrom(tiles, new Set(["5,1"]), occupied, { x: 5, y: 1 });
    const rawFree = isCellFree({ x: 2, y: 2 }, ctx);
    assert.equal(rawFree, false, "wall landing is not a free fight cell");
    const landed = resolveKnightLeapLanding(origin, { x: 2, y: 2 }, ctx);
    assert.equal(tiles[landed.y][landed.x], true);
    assert.notEqual(occKey(landed.x, landed.y), "2,2");
  });

  it("seed-leap-dual-seals: helper unseals a leap onto the second corridor", () => {
    const { tiles, voidTiles, portals, ctx } = dualCorridor(["2,2"]);
    const uniqueEmpty = occupantsSealProgression(
      tiles,
      voidTiles,
      portals,
      { x: 0, y: 1 },
      [{ x: 2, y: 2 }],
    );
    assert.equal(uniqueEmpty, false, "one corridor still open");
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        { x: 2, y: 2 },
        { x: 2, y: 0 },
      ]),
      true,
      "fixture must start sealed after a raw leap onto the second path",
    );
    const landed = resolveKnightLeapLanding(
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      ctx,
    );
    assert.equal(
      occupantsSealProgression(tiles, voidTiles, portals, { x: 0, y: 1 }, [
        { x: 2, y: 2 },
        landed,
      ]),
      false,
    );
    assert.notEqual(occKey(landed.x, landed.y), "2,0");
  });

  it("seed-open-field-leap-noop: an open landing stays put", () => {
    const tiles = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    const occupied = new Set<string>(["0,0", "2,2"]);
    const ctx = ctxFrom(tiles, new Set(["2,2"]), occupied, { x: 0, y: 0 });
    const landed = resolveKnightLeapLanding(
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      ctx,
    );
    assert.deepEqual(landed, { x: 1, y: 1 });
  });

  it("seed-leap-no-join-island: leftover CA crumb hops are refused", () => {
    const tiles = [
      [true, true, true, true, true],
      [true, false, false, false, true],
      [true, true, true, true, true],
      [false, false, false, false, false],
      [false, true, false, false, false],
    ];
    const occupied = new Set<string>(["0,1"]);
    const ctx = ctxFrom(tiles, new Set(["4,0"]), occupied, { x: 0, y: 1 });
    const battle = floodIgnoreWallsBattleGraph(ctx, { x: 0, y: 1 });
    assert.equal(battle.has("1,4"), false, "crumb is outside the fight graph");
    const landed = resolveKnightLeapLanding(
      { x: 1, y: 2 },
      { x: 1, y: 4 },
      ctx,
    );
    assert.deepEqual(landed, { x: 1, y: 2 });
  });
});

describe("legalizeIgnoreWallsLanding", () => {
  it("keeps a floor cell that already reaches the exit", () => {
    const tiles = chessboardTiles(6);
    const ctx = ctxFrom(tiles, new Set(["5,1"]), new Set(), { x: 1, y: 1 });
    const battle = floodIgnoreWallsBattleGraph(ctx, { x: 1, y: 1 });
    const kept = legalizeIgnoreWallsLanding({ x: 1, y: 1 }, ctx, battle);
    assert.deepEqual(kept, { x: 1, y: 1 });
  });
});

function transformFirstHostile(
  world: {
    tiles: string[][];
    voidTiles: Set<string>;
    playerSpawn: { x: number; y: number };
    portals: { x: number; y: number }[];
    spawns: { x: number; y: number }[];
  },
  kind: "rotate" | "mirror",
): { ok: boolean; failures: string[] } {
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
  const ctx = worldOccupancy(
    world.tiles,
    world.voidTiles,
    world.playerSpawn,
    world.portals,
    world.spawns,
  );
  const resolved =
    kind === "rotate"
      ? resolveMapRotateUnsealing(world.playerSpawn, world.spawns, ctx, {
          size,
          bossIndex: 0,
        })
      : resolveMapMirrorUnsealing(world.playerSpawn, world.spawns, ctx, {
          size,
          bossIndex: 0,
        });
  const battle = floodIgnoreWallsBattleGraph(
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
  const walkable =
    world.tiles[resolved.player.y]?.[resolved.player.x] !== "wall" &&
    !world.voidTiles.has(`${resolved.player.x},${resolved.player.y}`);
  if (!walkable) {
    return {
      ok: false,
      failures: [
        `player-on-wall:${occKey(resolved.player.x, resolved.player.y)}`,
      ],
    };
  }
  for (const o of resolved.occupants) {
    if (
      world.tiles[o.y]?.[o.x] === "wall" ||
      world.voidTiles.has(`${o.x},${o.y}`)
    ) {
      return {
        ok: false,
        failures: [`occupant-on-wall:${occKey(o.x, o.y)}`],
      };
    }
  }
  const portalOpen = !occupantsSealProgression(
    ctx.tiles,
    world.voidTiles,
    ctx.portals,
    resolved.player,
    [],
  );
  if (!portalOpen) {
    return { ok: false, failures: ["player-cannot-reach-portal"] };
  }
  const mandatory = collectMandatoryProgressionCells(
    ctx.tiles,
    world.voidTiles,
    ctx.portals,
    resolved.player,
    ctx.barriers,
  );
  const onBridge = resolved.occupants.filter((o) =>
    mandatory.has(occKey(o.x, o.y)),
  );
  if (onBridge.length > 0) {
    return {
      ok: false,
      failures: [
        `occupant-on-unique-bridge:${onBridge.map((o) => occKey(o.x, o.y)).join("/")}`,
      ],
    };
  }
  const isolated = resolved.occupants.filter(
    (o) => battle.size > 0 && !battle.has(occKey(o.x, o.y)),
  );
  if (isolated.length > 0) {
    return {
      ok: false,
      failures: [
        `occupant-off-fight-graph:${isolated.map((o) => occKey(o.x, o.y)).join("/")}`,
      ],
    };
  }
  return { ok: true, failures: [] };
}

describe("ignore-walls unseal property suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("chessboard destack rotate stays solvable across 256 seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
        enemyCount: 6,
      });
      const destack = simulateBattleStartOnWorld(world);
      const after = transformFirstHostile(
        {
          ...world,
          playerSpawn: destack.playerSpawn,
          spawns: destack.spawns,
        },
        "rotate",
      );
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("chessboard destack mirror stays solvable across 256 seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
        enemyCount: 6,
      });
      const destack = simulateBattleStartOnWorld(world);
      const after = transformFirstHostile(
        {
          ...world,
          playerSpawn: destack.playerSpawn,
          spawns: destack.spawns,
        },
        "mirror",
      );
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze destack rotate stays solvable across 256 seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
        enemyCount: 6,
      });
      const destack = simulateBattleStartOnWorld(world);
      const after = transformFirstHostile(
        {
          ...world,
          playerSpawn: destack.playerSpawn,
          spawns: destack.spawns,
        },
        "rotate",
      );
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander rotate stays solvable across 256 seeds", () => {
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
      const after = transformFirstHostile(
        {
          ...world,
          spawns: wander.spawns,
        },
        "rotate",
      );
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack rotate stays solvable across 64 seeds", () => {
    const failures: string[] = [];
    for (let i = 0; i < 64; i++) {
      const seed = 2000 + i * 13;
      const world = generateSeededBossRushRoom(seed);
      const destack = simulateBattleStartOnWorld(world);
      const after = transformFirstHostile(
        {
          ...world,
          playerSpawn: destack.playerSpawn,
          spawns: destack.spawns,
        },
        "rotate",
      );
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack rotate stays solvable across 64 seeds", () => {
    const failures: string[] = [];
    for (let i = 0; i < 64; i++) {
      const seed = 3000 + i * 19;
      const world = simulateRestExitEncounter(seed, "dungeon");
      const destack = simulateBattleStartOnWorld(world);
      const after = transformFirstHostile(
        {
          ...world,
          playerSpawn: destack.playerSpawn,
          spawns: destack.spawns,
        },
        "rotate",
      );
      if (!after.ok) {
        failures.push(`seed ${seed}: ${after.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
