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
  floodMidpointBattleGraph,
  isOnMidpointBattleGraph,
  legalizeMidpointLanding,
  legalizeMidpointLandings,
  rawMidpointDest,
  resolveMidpointLanding,
} from "./occupancyMidpointUnseal.ts";

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

function gridWH(tiles: string[][]): { w: number; h: number } {
  return { w: tiles[0]?.length ?? 0, h: tiles.length };
}

/** Portal choke: midpoint hops the gate onto a far crumb. */
function portalChokeFixture(): {
  tiles: string[][];
  player: OccCell;
  ally: OccCell;
  origin: OccCell;
  portal: OccCell;
  farCrumb: OccCell;
} {
  const tiles = [
    [F, F, F, F, P, F, F, F, F],
    [F, W, W, W, W, W, W, W, W],
    [F, F, F, F, F, F, F, F, F],
  ];
  return {
    tiles,
    player: { x: 2, y: 0 },
    ally: { x: 8, y: 0 },
    origin: { x: 0, y: 2 },
    portal: { x: 4, y: 0 },
    farCrumb: { x: 5, y: 0 },
  };
}

describe("occupancyMidpointUnseal regressions", () => {
  it("seed-midpoint-onto-portal: (player+ally)/2 lands on the gate", () => {
    const tiles = [
      [F, P, F, F],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const ally = { x: 2, y: 0 };
    const origin = { x: 0, y: 1 };
    const portal = { x: 1, y: 0 };
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    assert.deepEqual(raw, portal, "fixture must start as a portal landing");
    const occupancy = ctxFrom(tiles, [portal], [player, ally, origin], player);
    const landed = legalizeMidpointLanding(portal, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph cell");
    assert.equal(
      isOnMidpointBattleGraph(landed, player, occupancy),
      true,
      `snapped onto ${occKey(landed.x, landed.y)} off the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-midpoint-through-portal-far-side: one hop isolates the minion", () => {
    const { tiles, player, ally, origin, portal, farCrumb } =
      portalChokeFixture();
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    assert.deepEqual(
      raw,
      farCrumb,
      "midpoint across the gate must park on the far crumb",
    );
    const occupancy = ctxFrom(tiles, [portal], [player, ally, origin], player);
    assert.equal(
      isOnMidpointBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.equal(
      isOnMidpointBattleGraph(landed, player, occupancy),
      true,
      `midpoint snap ${occKey(landed.x, landed.y)} left the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(farCrumb.x, farCrumb.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-midpoint-onto-wall: midpoint has no allTiles filter so a wall dest relocates", () => {
    const tiles = [
      [F, F, W, F, P],
      [F, W, W, W, W],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const ally = { x: 4, y: 0 };
    const origin = { x: 0, y: 2 };
    const wall = { x: 2, y: 0 };
    const portal = { x: 4, y: 0 };
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    assert.deepEqual(raw, wall, "fixture must start as a wall landing");
    const occupancy = ctxFrom(tiles, [portal], [player, ally, origin], player);
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.equal(isOnMidpointBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(wall.x, wall.y));
    assert.equal(tiles[0][2], W, "must not punch the midpoint wall");
  });

  it("seed-midpoint-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const ally = { x: 7, y: 0 };
    const origin = { x: 0, y: 2 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    assert.deepEqual(
      raw,
      farCrumb,
      "round((0+7)/2) hops the 1-wide gate onto the crumb",
    );
    const occupancy = ctxFrom(tiles, [portal], [player, ally, origin], player);
    assert.equal(isOnMidpointBattleGraph(farCrumb, player, occupancy), false);
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.equal(isOnMidpointBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "3,0");
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
  });

  it("seed-open-field-midpoint-noop: already-legal midpoint is unchanged", () => {
    const tiles = [
      [F, F, F],
      [F, F, F],
      [F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const ally = { x: 2, y: 0 };
    const origin = { x: 0, y: 1 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 2, y: 2 }],
      [player, ally, origin],
      player,
    );
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    assert.deepEqual(raw, { x: 1, y: 0 });
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.deepEqual(landed, raw);
  });

  it("seed-midpoint-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const ally = { x: 2, y: 0 };
    const origin = { x: 0, y: 2 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, ally, origin], player);
    assert.equal(isOnMidpointBattleGraph(island, player, occupancy), false);
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.equal(isOnMidpointBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(island.x, island.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
  });

  it("seed-midpoint-dual-seals: two portal midpoints destack on-graph", () => {
    const tiles = [
      [F, P, F, F],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 1, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player, { x: 2, y: 0 }],
      player,
    );
    const landings = [
      { x: 1, y: 0 },
      { x: 1, y: 0 },
    ];
    const snapped = legalizeMidpointLandings(landings, player, occupancy);
    assert.equal(snapped.length, 2);
    const keys = snapped.map((c) => occKey(c.x, c.y));
    assert.equal(new Set(keys).size, 2, "dual landings must not stack");
    for (const cell of snapped) {
      assert.equal(isOnMidpointBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-midpoint-only-portal: stay put when the fight graph is empty", () => {
    const tiles = [
      [P, P],
      [P, P],
    ];
    const player = { x: 0, y: 0 };
    const ally = { x: 1, y: 0 };
    const origin = { x: 0, y: 1 };
    const occupancy = ctxFrom(
      tiles,
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [player, ally, origin],
      player,
    );
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.deepEqual(landed, origin);
    assert.equal(floodMidpointBattleGraph(player, occupancy).size, 0);
  });

  it("seed-midpoint-no-ally: missing ally keeps the summoner tile", () => {
    const tiles = [
      [F, F, P],
      [F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const origin = { x: 1, y: 1 };
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, null, origin, w, h);
    assert.deepEqual(raw, origin);
    const occupancy = ctxFrom(
      tiles,
      [{ x: 2, y: 0 }],
      [player, origin],
      player,
    );
    const landed = resolveMidpointLanding(player, null, occupancy, origin);
    assert.deepEqual(landed, origin);
  });

  it("seed-midpoint-clamp-oob: midpoint past the occupancy grid stays in bounds", () => {
    const tiles = [
      [F, F, F],
      [F, F, P],
    ];
    const player = { x: 2, y: 0 };
    const ally = { x: 2, y: 0 };
    const origin = { x: 0, y: 0 };
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    assert.equal(raw.x, 2);
    assert.equal(raw.y, 0);
    assert.ok(raw.x >= 0 && raw.x < w);
    assert.ok(raw.y >= 0 && raw.y < h);
    const occupancy = ctxFrom(
      tiles,
      [{ x: 2, y: 1 }],
      [player, origin],
      player,
    );
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    assert.ok(landed.x >= 0 && landed.x < w);
    assert.ok(landed.y >= 0 && landed.y < h);
  });
});

function assertMidpointOnWorld(
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
  const origin = units[0];
  for (const ally of units) {
    const landed = resolveMidpointLanding(player, ally, occupancy, origin);
    if (!isOnMidpointBattleGraph(landed, player, occupancy)) {
      return `${label} midpoint ${occKey(ally.x, ally.y)} → ${occKey(landed.x, landed.y)}`;
    }
    const { w, h } = gridWH(tiles);
    const raw = rawMidpointDest(player, ally, origin, w, h);
    const snapped = legalizeMidpointLandings([raw], player, occupancy);
    for (const cell of snapped) {
      if (!isOnMidpointBattleGraph(cell, player, occupancy)) {
        return `${label} landing ${occKey(cell.x, cell.y)}`;
      }
    }
  }
  return null;
}

describe("occupancyMidpointUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack midpoint stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertMidpointOnWorld(
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

  it("corridorMaze wander midpoint stays on the fight graph", () => {
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
      const miss = assertMidpointOnWorld(
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

  it("chessboard destack midpoint stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertMidpointOnWorld(
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

  it("Boss Rush destack midpoint stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertMidpointOnWorld(
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

  it("rest-exit destack midpoint stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertMidpointOnWorld(
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
    const origin = world.spawns[0] ?? world.playerSpawn;
    for (const unit of world.spawns) {
      const landed = resolveMidpointLanding(
        world.playerSpawn,
        unit,
        occupancy,
        origin,
      );
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
