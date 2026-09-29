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
  anchorsUnreachable,
  floodAnchorBattleGraph,
  isOnAnchorBattleGraph,
  legalizeAnchorPlacement,
  legalizeAnchorPlacements,
  pickAnchorDests,
  rawAnchorDests,
  resolveAnchorTiles,
} from "./occupancyAnchorUnseal.ts";

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

describe("occupancyAnchorUnseal regressions", () => {
  it("seed-anchor-onto-portal: raster includes the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const occKeys = new Set([
      occKey(player.x, player.y),
      occKey(boss.x, boss.y),
    ]);
    const raw = rawAnchorDests(occupancy.tiles, occKeys);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      true,
      "fixture must start as a portal landing",
    );
    assert.equal(
      anchorsUnreachable(player, [portal], occupancy),
      true,
      "an anchor on the gate must be unsteppable",
    );
    const landed = legalizeAnchorPlacement(portal, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.equal(
      isOnAnchorBattleGraph(landed, player, occupancy),
      true,
      `snapped onto ${occKey(landed.x, landed.y)} off the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(anchorsUnreachable(player, [landed], occupancy), false);
  });

  it("seed-anchor-on-unique-bridge: required-step glyphs may sit on the corridor", () => {
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
    assert.equal(isOnAnchorBattleGraph(bridge, player, occupancy), true);
    const landed = legalizeAnchorPlacement(bridge, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(bridge.x, bridge.y),
      "unlike VOID_TILES, a unique-corridor glyph stays — the player must step on it",
    );
    assert.equal(anchorsUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-anchor-through-portal-far-side: raster hops the gate onto a crumb", () => {
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
    const occKeys = new Set([
      occKey(player.x, player.y),
      occKey(boss.x, boss.y),
    ]);
    const raw = rawAnchorDests(occupancy.tiles, occKeys);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y)),
      true,
      "row-major allTiles must include the far crumb",
    );
    assert.equal(
      isOnAnchorBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = legalizeAnchorPlacements([farCrumb], player, occupancy);
    for (const cell of snapped) {
      assert.equal(
        isOnAnchorBattleGraph(cell, player, occupancy),
        true,
        `anchor snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(anchorsUnreachable(player, snapped, occupancy), false);
  });

  it("seed-anchor-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeAnchorPlacements(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    for (const cell of snapped) {
      assert.equal(isOnAnchorBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(anchorsUnreachable(player, snapped, occupancy), false);
  });

  it("seed-anchor-onto-void: a generation void is not a steppable glyph", () => {
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
    assert.equal(isOnAnchorBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeAnchorPlacement(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnAnchorBattleGraph(landed, player, occupancy), true);
    assert.equal(anchorsUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-anchor-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeAnchorPlacements(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(anchorsUnreachable(player, snapped, occupancy), false);
  });

  it("seed-anchor-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnAnchorBattleGraph(island, player, occupancy), false);
    const snapped = legalizeAnchorPlacements([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnAnchorBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(anchorsUnreachable(player, snapped, occupancy), false);
  });

  it("seed-anchor-dual-far: two far dests both snap onto the fight graph", () => {
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
      anchorsUnreachable(player, landings, occupancy),
      true,
      "both far crumbs must start unsteppable",
    );
    const snapped = legalizeAnchorPlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one glyph should still place");
    assert.equal(anchorsUnreachable(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "glyphs must not stack");
    for (const cell of snapped) {
      assert.equal(isOnAnchorBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-anchor-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = resolveAnchorTiles(player, occupancy);
    assert.deepEqual(snapped, []);
    assert.equal(floodAnchorBattleGraph(player, occupancy).size, 0);
    assert.equal(anchorsUnreachable(player, snapped, occupancy), true);
  });

  it("seed-anchor-shuffle-picks-two: Fisher–Yates keeps count", () => {
    const dests = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ];
    const rng = createSeededRng(42);
    const picked = pickAnchorDests(dests, rng, 2);
    assert.equal(picked.length, 2);
    const keys = new Set(picked.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, 2);
  });
});

function assertAnchorsOnWorld(
  label: string,
  tiles: string[][],
  voidTiles: Set<string>,
  portals: OccCell[],
  player: OccCell,
  units: OccCell[],
  rng: () => number,
): string | null {
  const occupancy = ctxFrom(
    tiles,
    portals,
    [player, ...units],
    player,
    voidTiles,
  );
  const snapped = resolveAnchorTiles(player, occupancy, rng);
  if (anchorsUnreachable(player, snapped, occupancy) && snapped.length > 0) {
    return `${label} anchors unreachable`;
  }
  for (const cell of snapped) {
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} anchor on portal ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnAnchorBattleGraph(cell, player, occupancy)) {
      return `${label} anchor ${occKey(cell.x, cell.y)} off fight graph`;
    }
  }
  return null;
}

describe("occupancyAnchorUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack anchors stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAnchorsOnWorld(
        `destack ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 7),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander anchors stay on the fight graph", () => {
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
      const miss = assertAnchorsOnWorld(
        `wander ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        world.playerSpawn,
        after.spawns,
        createSeededRng(seed + 11),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("chessboard destack anchors stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAnchorsOnWorld(
        `chess ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 13),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack anchors stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAnchorsOnWorld(
        `bossRush ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 17),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack anchors stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertAnchorsOnWorld(
          `rest-${restExitType} ${seed}`,
          world.tiles,
          world.voidTiles,
          world.portals,
          after.playerSpawn,
          after.spawns,
          createSeededRng(seed + 19),
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
    const snapped = resolveAnchorTiles(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
