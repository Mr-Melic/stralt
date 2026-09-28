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
  floodVoidBattleGraph,
  isOnVoidBattleGraph,
  legalizeVoidPlacement,
  legalizeVoidPlacements,
  rawVoidDests,
  resolveVoidTiles,
  voidsSealProgression,
} from "./occupancyVoidUnseal.ts";

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

describe("occupancyVoidUnseal regressions", () => {
  it("seed-void-onto-portal: range-2 east lands on the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const raw = rawVoidDests(boss, occupancy.tiles);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      true,
      "fixture must start as a portal landing",
    );
    assert.equal(
      voidsSealProgression(player, [portal], occupancy),
      true,
      "voiding the gate must seal the exit",
    );
    const landed = legalizeVoidPlacement(portal, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.equal(
      isOnVoidBattleGraph(landed, player, occupancy),
      true,
      `snapped onto ${occKey(landed.x, landed.y)} off the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(voidsSealProgression(player, [landed], occupancy), false);
  });

  it("seed-void-onto-unique-bridge: range-2 east seals the 1-wide corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, F, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 5, y: 1 };
    const bridge = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const raw = rawVoidDests(boss, occupancy.tiles);
    assert.deepEqual(
      raw,
      [bridge],
      "the only in-bounds allTiles dest is the unique bridge",
    );
    assert.equal(
      voidsSealProgression(player, [bridge], occupancy),
      true,
      "voiding the unique corridor must seal the exit",
    );
    const snapped = resolveVoidTiles(boss, player, occupancy);
    assert.equal(snapped.length, 1);
    assert.notEqual(
      occKey(snapped[0].x, snapped[0].y),
      occKey(bridge.x, bridge.y),
    );
    assert.notEqual(
      occKey(snapped[0].x, snapped[0].y),
      occKey(portal.x, portal.y),
    );
    assert.equal(isOnVoidBattleGraph(snapped[0], player, occupancy), true);
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-void-through-portal-far-side: range-2 hops the gate onto a crumb", () => {
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
    const raw = rawVoidDests(boss, occupancy.tiles);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y)),
      true,
      "range-2 east must park on the far crumb",
    );
    assert.equal(
      isOnVoidBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = resolveVoidTiles(boss, player, occupancy);
    for (const cell of snapped) {
      assert.equal(
        isOnVoidBattleGraph(cell, player, occupancy),
        true,
        `void snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
  });

  it("seed-void-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const raw = rawVoidDests(boss, occupancy.tiles);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,0"),
      true,
      "boss at x=2 range-2 east hops the gate onto the crumb",
    );
    const snapped = resolveVoidTiles(boss, player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnVoidBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
  });

  it("seed-void-onto-player: range-2 east onto the player relocates", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 2, y: 0 };
    const boss = { x: 0, y: 0 };
    const portal = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const raw = rawVoidDests(boss, occupancy.tiles);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(player.x, player.y)),
      true,
      "fixture must start as a player-tile landing",
    );
    const snapped = resolveVoidTiles(boss, player, occupancy);
    for (const cell of snapped) {
      assert.notEqual(occKey(cell.x, cell.y), occKey(player.x, player.y));
      assert.equal(isOnVoidBattleGraph(cell, player, occupancy), true);
    }
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
  });

  it("seed-open-field-void-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player, boss], player);
    const raw = rawVoidDests(boss, occupancy.tiles);
    assert.deepEqual(raw.map((c) => occKey(c.x, c.y)).sort(), [
      "0,2",
      "2,0",
      "2,4",
      "4,2",
    ]);
    const snapped = resolveVoidTiles(boss, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      raw.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
  });

  it("seed-void-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(isOnVoidBattleGraph(island, player, occupancy), false);
    const snapped = resolveVoidTiles(boss, player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnVoidBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
  });

  it("seed-void-dual-seals: two corridor dests cannot jointly cut every exit", () => {
    const tiles = [
      [F, F, F, P],
      [F, W, W, W],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landings = [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    assert.equal(
      voidsSealProgression(player, landings, occupancy),
      true,
      "both unique-corridor cells together must seal",
    );
    const snapped = legalizeVoidPlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one void should still place");
    assert.equal(voidsSealProgression(player, snapped, occupancy), false);
    for (const cell of snapped) {
      assert.equal(isOnVoidBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-void-only-portal: drop every dest when the fight graph is empty", () => {
    const tiles = [
      [P, P],
      [P, P],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 1 };
    const occupancy = ctxFrom(
      tiles,
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [player, boss],
      player,
    );
    const snapped = resolveVoidTiles(boss, player, occupancy);
    assert.deepEqual(snapped, []);
    assert.equal(floodVoidBattleGraph(player, occupancy).size, 0);
  });
});

function assertVoidsOnWorld(
  label: string,
  tiles: string[][],
  voidTiles: Set<string>,
  portals: OccCell[],
  player: OccCell,
  units: OccCell[],
): string | null {
  if (units.length === 0) return null;
  const occupancy = ctxFrom(
    tiles,
    portals,
    [player, ...units],
    player,
    voidTiles,
  );
  for (const boss of units) {
    const snapped = resolveVoidTiles(boss, player, occupancy);
    if (voidsSealProgression(player, snapped, occupancy)) {
      return `${label} voids sealed ${occKey(boss.x, boss.y)}`;
    }
    for (const cell of snapped) {
      if (occupancy.portals.has(occKey(cell.x, cell.y))) {
        return `${label} void on portal ${occKey(cell.x, cell.y)}`;
      }
      if (!isOnVoidBattleGraph(cell, player, occupancy)) {
        return `${label} void ${occKey(cell.x, cell.y)} off fight graph`;
      }
    }
  }
  return null;
}

describe("occupancyVoidUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack voids stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertVoidsOnWorld(
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

  it("corridorMaze wander voids stay on the fight graph", () => {
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
      const miss = assertVoidsOnWorld(
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

  it("chessboard destack voids stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertVoidsOnWorld(
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

  it("Boss Rush destack voids stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertVoidsOnWorld(
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

  it("rest-exit destack voids stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertVoidsOnWorld(
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
    const bosses = world.spawns.length > 0 ? world.spawns : [world.playerSpawn];
    for (const boss of bosses) {
      const snapped = resolveVoidTiles(boss, world.playerSpawn, occupancy);
      for (const landed of snapped) {
        assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
        assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
      }
    }
  });
});
