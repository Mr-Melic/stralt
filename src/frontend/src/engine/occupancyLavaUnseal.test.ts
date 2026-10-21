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
import { createSeededRng } from "./mapGen.ts";
import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";
import {
  floodLavaBattleGraph,
  isOnLavaBattleGraph,
  lavaOffFightGraph,
  legalizeLavaPlacement,
  legalizeLavaPlacements,
  rawLavaTrailDest,
  rawMoveTowardDest,
  resolveLavaTrail,
  tilesForLavaAi,
} from "./occupancyLavaUnseal.ts";

const W = "wall";
const F = "floor";
const P = "portal";

function ctxFrom(
  tiles: string[][],
  portals: OccCell[],
  occupied: OccCell[],
  player: OccCell,
  voidTiles: Set<string> = new Set(),
): OccupancyContext {
  const occ = new Set(occupied.map((c) => occKey(c.x, c.y)));
  return {
    tiles: tiles.map((row) => (row ?? []).map((t) => t !== W)),
    barriers: new Set(),
    voidTiles,
    portals: new Set(portals.map((p) => occKey(p.x, p.y))),
    progressStart: player,
    isOccupied: (c) => occ.has(occKey(c.x, c.y)),
  };
}

describe("occupancyLavaUnseal regressions", () => {
  it("seed-lava-after-portal-step: greedy allTiles hop sits on the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 1 };
    const boss = { x: 2, y: 1 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForLavaAi(tiles);
    const step = rawMoveTowardDest(boss, player, allTiles, [boss]);
    assert.deepEqual(step, portal, "manhattan hop must pick the portal");
    const origin = rawLavaTrailDest(boss);
    assert.deepEqual(origin, boss);
    const thisTurn = legalizeLavaPlacement(origin, player, occupancy);
    assert.ok(thisTurn);
    assert.equal(
      occKey(thisTurn.x, thisTurn.y),
      occKey(boss.x, boss.y),
      "origin on the fight graph stays — lava is walkable",
    );
    const nextOccupancy = ctxFrom(tiles, [portal], [player, portal], player);
    const nextOrigin = rawLavaTrailDest(portal);
    assert.deepEqual(nextOrigin, portal);
    assert.equal(
      lavaOffFightGraph(player, [portal], nextOccupancy),
      true,
      "a lava on the gate must be off the fight graph",
    );
    const landed = legalizeLavaPlacement(portal, player, nextOccupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.equal(isOnLavaBattleGraph(landed, player, nextOccupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(lavaOffFightGraph(player, [landed], nextOccupancy), false);
  });

  it("seed-lava-onto-portal: trail origin is the gate after the hop", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 3, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const origin = rawLavaTrailDest(boss);
    assert.deepEqual(origin, portal, "fixture must start as a portal origin");
    assert.equal(lavaOffFightGraph(player, [portal], occupancy), true);
    const landed = legalizeLavaPlacement(portal, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnLavaBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(lavaOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-lava-on-unique-bridge: walkable lava may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 3, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(isOnLavaBattleGraph(boss, player, occupancy), true);
    const landed = resolveLavaTrail(boss, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(boss.x, boss.y),
      "unlike VOID_TILES, a unique-corridor lava stays — it is walkable",
    );
    assert.equal(lavaOffFightGraph(player, [landed], occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-lava-through-portal-far-side: origin hops the gate onto a crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, farCrumb], player);
    assert.equal(
      isOnLavaBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = legalizeLavaPlacements([farCrumb], player, occupancy);
    for (const cell of snapped) {
      assert.equal(
        isOnLavaBattleGraph(cell, player, occupancy),
        true,
        `lava snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(lavaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-lava-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeLavaPlacements([{ x: 4, y: 0 }], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnLavaBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(lavaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-lava-onto-void: a generation void is not a walkable trail", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 4, y: 0 };
    const voidCell = { x: 2, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set([occKey(voidCell.x, voidCell.y)]),
    );
    assert.equal(isOnLavaBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeLavaPlacement(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnLavaBattleGraph(landed, player, occupancy), true);
    assert.equal(lavaOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-open-field-lava-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dests = [
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ];
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    const snapped = legalizeLavaPlacements(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(lavaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-lava-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnLavaBattleGraph(island, player, occupancy), false);
    const snapped = legalizeLavaPlacements([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnLavaBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(lavaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-lava-dual-far: two far dests both snap onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landings = [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ];
    assert.equal(
      lavaOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeLavaPlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one lava should still place");
    assert.equal(lavaOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "lavas must not stack");
    for (const cell of snapped) {
      assert.equal(isOnLavaBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-lava-only-portal: drop every dest when the fight graph is empty", () => {
    const tiles = [
      [P, P],
      [P, P],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [player],
      player,
    );
    const snapped = legalizeLavaPlacements(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodLavaBattleGraph(player, occupancy).size, 0);
    assert.equal(lavaOffFightGraph(player, snapped, occupancy), true);
  });
});

function assertLavasOnWorld(
  label: string,
  tiles: string[][],
  voidTiles: Set<string>,
  portals: OccCell[],
  player: OccCell,
  units: OccCell[],
): string | null {
  const occupancy = ctxFrom(
    tiles,
    portals,
    [player, ...units],
    player,
    voidTiles,
  );
  for (const unit of units) {
    const landed = resolveLavaTrail(unit, player, occupancy);
    if (!landed) continue;
    if (occupancy.portals.has(occKey(landed.x, landed.y))) {
      return `${label} lava on portal ${occKey(landed.x, landed.y)}`;
    }
    if (!isOnLavaBattleGraph(landed, player, occupancy)) {
      return `${label} lava ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
    }
  }
  return null;
}

describe("occupancyLavaUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack lava stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLavasOnWorld(
        `destack ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander lava stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateEnemyWanderOnWorld(
        world,
        12,
        createSeededRng(seed + 99),
      );
      const miss = assertLavasOnWorld(
        `wander ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        world.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("chessboard destack lava stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLavasOnWorld(
        `chess ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack lava stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLavasOnWorld(
        `bossRush ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack lava stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertLavasOnWorld(
          `rest-${restExitType} ${seed}`,
          world.tiles,
          world.voidTiles,
          world.portals,
          after.playerSpawn,
          after.spawns,
        );
        if (miss) failures.push(miss);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps landings inside WORLD_GRID_SIZE", () => {
    const world = generateSeededWorld({ seed: 4242, runMode: "dungeon" });
    const occupancy = ctxFrom(
      world.tiles,
      world.portals,
      [world.playerSpawn, ...world.spawns],
      world.playerSpawn,
      world.voidTiles,
    );
    for (const unit of world.spawns) {
      const landed = resolveLavaTrail(unit, world.playerSpawn, occupancy);
      if (!landed) continue;
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
