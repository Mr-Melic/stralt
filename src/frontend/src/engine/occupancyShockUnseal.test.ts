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
  floodShockBattleGraph,
  isOnShockBattleGraph,
  legalizeChainAdjDests,
  legalizeShockPlacement,
  legalizeShockPlacements,
  rawChainAdjDests,
  rawShockMoveTowardDest,
  rawShockTrailDest,
  resolveShockTrail,
  shockOffFightGraph,
  tilesForShockAi,
} from "./occupancyShockUnseal.ts";

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

describe("occupancyShockUnseal regressions", () => {
  it("seed-shock-after-portal-step: greedy allTiles hop sits on the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 1 };
    const boss = { x: 2, y: 1 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForShockAi(tiles);
    const step = rawShockMoveTowardDest(boss, player, allTiles, [boss]);
    assert.deepEqual(step, portal, "manhattan hop must pick the portal");
    const origin = rawShockTrailDest(boss);
    assert.deepEqual(origin, boss);
    const thisTurn = legalizeShockPlacement(origin, player, occupancy);
    assert.ok(thisTurn);
    assert.equal(
      occKey(thisTurn.x, thisTurn.y),
      occKey(boss.x, boss.y),
      "origin on the fight graph stays — shock is walkable",
    );
    const nextOccupancy = ctxFrom(tiles, [portal], [player, portal], player);
    const nextOrigin = rawShockTrailDest(portal);
    assert.deepEqual(nextOrigin, portal);
    assert.equal(
      shockOffFightGraph(player, [portal], nextOccupancy),
      true,
      "a shock on the gate must be off the fight graph",
    );
    const landed = legalizeShockPlacement(portal, player, nextOccupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.equal(isOnShockBattleGraph(landed, player, nextOccupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(shockOffFightGraph(player, [landed], nextOccupancy), false);
  });

  it("seed-shock-onto-portal: trail origin is the gate after the hop", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 3, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const origin = rawShockTrailDest(boss);
    assert.deepEqual(origin, portal, "fixture must start as a portal origin");
    assert.equal(shockOffFightGraph(player, [portal], occupancy), true);
    const landed = legalizeShockPlacement(portal, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnShockBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(shockOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-shock-on-unique-bridge: walkable shock may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 3, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(isOnShockBattleGraph(boss, player, occupancy), true);
    const landed = resolveShockTrail(boss, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(boss.x, boss.y),
      "unlike VOID_TILES, a unique-corridor shock stays — it is walkable",
    );
    assert.equal(shockOffFightGraph(player, [landed], occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-shock-through-portal-far-side: origin hops the gate onto a crumb", () => {
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
      isOnShockBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = legalizeShockPlacements([farCrumb], player, occupancy);
    for (const cell of snapped) {
      assert.equal(
        isOnShockBattleGraph(cell, player, occupancy),
        true,
        `shock snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(shockOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-shock-chain-from-far-crumb: leftover origin chain never hits the fight graph until snapped", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const allTiles = tilesForShockAi(tiles);
    const rawAdj = rawChainAdjDests(farCrumb, allTiles);
    assert.ok(
      rawAdj.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      "chain from the leftover crumb must see the portal as floor",
    );
    assert.equal(
      rawAdj.some((c) => isOnShockBattleGraph(c, player, occupancy)),
      false,
      "raw chain neighbors must stay off the fight graph",
    );
    const snapped = legalizeChainAdjDests(
      farCrumb,
      player,
      occupancy,
      allTiles,
    );
    assert.ok(snapped.length >= 1, "snap must recover a fight-graph origin");
    for (const cell of snapped) {
      assert.equal(isOnShockBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(shockOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-shock-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeShockPlacements(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    for (const cell of snapped) {
      assert.equal(isOnShockBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(shockOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-shock-onto-void: a generation void is not a walkable trail", () => {
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
    assert.equal(isOnShockBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeShockPlacement(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnShockBattleGraph(landed, player, occupancy), true);
    assert.equal(shockOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-open-field-shock-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeShockPlacements(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(shockOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-shock-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnShockBattleGraph(island, player, occupancy), false);
    const snapped = legalizeShockPlacements([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnShockBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(shockOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-shock-dual-far: two far dests both snap onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const landings = [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ];
    assert.equal(
      shockOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeShockPlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one shock should still place");
    assert.equal(shockOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "shocks must not stack");
    for (const cell of snapped) {
      assert.equal(isOnShockBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-shock-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeShockPlacements(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodShockBattleGraph(player, occupancy).size, 0);
    assert.equal(shockOffFightGraph(player, snapped, occupancy), true);
  });
});

function assertShocksOnWorld(
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
    const landed = resolveShockTrail(unit, player, occupancy);
    if (!landed) continue;
    if (occupancy.portals.has(occKey(landed.x, landed.y))) {
      return `${label} shock on portal ${occKey(landed.x, landed.y)}`;
    }
    if (!isOnShockBattleGraph(landed, player, occupancy)) {
      return `${label} shock ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
    }
  }
  return null;
}

describe("occupancyShockUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack shock stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShocksOnWorld(
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

  it("corridorMaze wander shock stays on the fight graph", () => {
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
      const miss = assertShocksOnWorld(
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

  it("chessboard destack shock stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShocksOnWorld(
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

  it("Boss Rush destack shock stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShocksOnWorld(
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

  it("rest-exit destack shock stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertShocksOnWorld(
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
      const landed = resolveShockTrail(unit, world.playerSpawn, occupancy);
      if (!landed) continue;
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
