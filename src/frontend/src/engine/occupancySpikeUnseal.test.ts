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
  floodSpikeBattleGraph,
  isOnSpikeBattleGraph,
  legalizeSpikePlacement,
  legalizeSpikePlacements,
  rawKnightLeapDest,
  resolveSpikeOnLand,
  spikesOffFightGraph,
  tilesForKnightAi,
} from "./occupancySpikeUnseal.ts";

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

describe("occupancySpikeUnseal regressions", () => {
  it("seed-spike-onto-portal: ignoreWalls knight dest is the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F],
    ];
    const player = { x: 5, y: 1 };
    const boss = { x: 1, y: 0 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForKnightAi(tiles);
    const raw = rawKnightLeapDest(boss, player, allTiles, true);
    assert.deepEqual(raw, portal, "fixture must start as a portal landing");
    assert.equal(
      spikesOffFightGraph(player, [portal], occupancy),
      true,
      "a spike on the gate must be off the fight graph",
    );
    const landed = legalizeSpikePlacement(portal, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.equal(
      isOnSpikeBattleGraph(landed, player, occupancy),
      true,
      `snapped onto ${occKey(landed.x, landed.y)} off the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(spikesOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-spike-onto-wall: ignoreWalls dest is a non-allTiles wall", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, W, F, F, F],
    ];
    const player = { x: 5, y: 1 };
    const boss = { x: 1, y: 0 };
    const wall = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 0 }], [player, boss], player);
    const allTiles = tilesForKnightAi(tiles);
    const raw = rawKnightLeapDest(boss, player, allTiles, true);
    assert.deepEqual(raw, wall, "ignoreWalls must accept the wall landing");
    assert.equal(allTiles[wall.y]?.[wall.x], false);
    assert.equal(isOnSpikeBattleGraph(wall, player, occupancy), false);
    const landed = legalizeSpikePlacement(wall, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(wall.x, wall.y));
    assert.equal(isOnSpikeBattleGraph(landed, player, occupancy), true);
    assert.equal(tiles[1][3], W, "must not punch the wall landing");
  });

  it("seed-spike-onto-player: knight leap has no occupancy filter", () => {
    const tiles = [
      [F, F, F],
      [F, F, F],
    ];
    const player = { x: 2, y: 1 };
    const boss = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 2, y: 0 }], [player, boss], player);
    const allTiles = tilesForKnightAi(tiles);
    const raw = rawKnightLeapDest(boss, player, allTiles, true);
    assert.deepEqual(
      raw,
      player,
      "raw leap must be allowed to land on the player",
    );
    const landed = legalizeSpikePlacement(player, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(player.x, player.y));
    assert.equal(isOnSpikeBattleGraph(landed, player, occupancy), true);
  });

  it("seed-spike-on-unique-bridge: walkable spikes may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 5, y: 1 };
    const bridge = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(isOnSpikeBattleGraph(bridge, player, occupancy), true);
    const landed = legalizeSpikePlacement(bridge, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(bridge.x, bridge.y),
      "unlike VOID_TILES, a unique-corridor spike stays — it is walkable",
    );
    assert.equal(spikesOffFightGraph(player, [landed], occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-spike-through-portal-far-side: L-shape hops the gate onto a crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnSpikeBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = legalizeSpikePlacements([farCrumb], player, occupancy);
    for (const cell of snapped) {
      assert.equal(
        isOnSpikeBattleGraph(cell, player, occupancy),
        true,
        `spike snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(spikesOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-spike-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeSpikePlacements(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    for (const cell of snapped) {
      assert.equal(isOnSpikeBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(spikesOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-spike-onto-void: a generation void is not a walkable spike", () => {
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
    assert.equal(isOnSpikeBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeSpikePlacement(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnSpikeBattleGraph(landed, player, occupancy), true);
    assert.equal(spikesOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-open-field-spike-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeSpikePlacements(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(spikesOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-spike-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnSpikeBattleGraph(island, player, occupancy), false);
    const snapped = legalizeSpikePlacements([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnSpikeBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(spikesOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-spike-dual-far: two far dests both snap onto the fight graph", () => {
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
      spikesOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeSpikePlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one spike should still place");
    assert.equal(spikesOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "spikes must not stack");
    for (const cell of snapped) {
      assert.equal(isOnSpikeBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-spike-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeSpikePlacements(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodSpikeBattleGraph(player, occupancy).size, 0);
    assert.equal(spikesOffFightGraph(player, snapped, occupancy), true);
  });
});

function assertSpikesOnWorld(
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
  const allTiles = tilesForKnightAi(tiles);
  for (const unit of units) {
    const landed = resolveSpikeOnLand(unit, player, allTiles, occupancy);
    if (!landed) continue;
    if (occupancy.portals.has(occKey(landed.x, landed.y))) {
      return `${label} spike on portal ${occKey(landed.x, landed.y)}`;
    }
    if (!isOnSpikeBattleGraph(landed, player, occupancy)) {
      return `${label} spike ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
    }
  }
  return null;
}

describe("occupancySpikeUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack spikes stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSpikesOnWorld(
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

  it("corridorMaze wander spikes stay on the fight graph", () => {
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
      const miss = assertSpikesOnWorld(
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

  it("chessboard destack spikes stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSpikesOnWorld(
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

  it("Boss Rush destack spikes stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSpikesOnWorld(
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

  it("rest-exit destack spikes stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertSpikesOnWorld(
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
    const allTiles = tilesForKnightAi(world.tiles);
    for (const unit of world.spawns) {
      const landed = resolveSpikeOnLand(
        unit,
        world.playerSpawn,
        allTiles,
        occupancy,
      );
      if (!landed) continue;
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
