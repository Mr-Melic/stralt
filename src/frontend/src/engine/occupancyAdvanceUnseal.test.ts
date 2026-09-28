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
  bossAiTilesFromMap,
  floodAdvanceBattleGraph,
  isOnAdvanceBattleGraph,
  legalizeAdjacentMinionLandings,
  legalizeAdvanceLanding,
  rawAdjacentPortalAsFloor,
  rawAdvanceDest,
  resolveAdvancePerTurnLanding,
} from "./occupancyAdvanceUnseal.ts";

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

/** Portal choke with a far crumb the greedy step can walk onto. */
function portalChokeFixture(): {
  tiles: string[][];
  player: OccCell;
  boss: OccCell;
  portal: OccCell;
  farCrumb: OccCell;
} {
  const tiles = [
    [F, F, F, P, F, W],
    [F, W, W, W, W, W],
    [F, F, F, F, F, F],
  ];
  return {
    tiles,
    player: { x: 4, y: 2 },
    boss: { x: 2, y: 0 },
    portal: { x: 3, y: 0 },
    farCrumb: { x: 4, y: 0 },
  };
}

describe("occupancyAdvanceUnseal regressions", () => {
  it("seed-advance-onto-portal: greedy horizontal step lands on the gate", () => {
    const { tiles, player, boss, portal } = portalChokeFixture();
    const allTiles = bossAiTilesFromMap(tiles);
    const raw = rawAdvanceDest(boss, player, allTiles);
    assert.deepEqual(raw, portal, "fixture must start as a portal landing");
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const landed = legalizeAdvanceLanding(portal, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph cell");
    assert.equal(
      isOnAdvanceBattleGraph(landed, player, occupancy),
      true,
      `snapped onto ${occKey(landed.x, landed.y)} off the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-advance-through-portal-far-side: second raw step isolates the pawn", () => {
    const { tiles, player, boss, portal, farCrumb } = portalChokeFixture();
    const allTiles = bossAiTilesFromMap(tiles);
    const first = rawAdvanceDest(boss, player, allTiles);
    assert.deepEqual(first, portal);
    const second = rawAdvanceDest(portal, player, allTiles);
    assert.deepEqual(
      second,
      farCrumb,
      "second greedy step must park on the far crumb",
    );
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnAdvanceBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const landed = resolveAdvancePerTurnLanding(
      boss,
      player,
      allTiles,
      occupancy,
    );
    assert.equal(
      isOnAdvanceBattleGraph(landed, player, occupancy),
      true,
      `advance snap ${occKey(landed.x, landed.y)} left the fight graph`,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(farCrumb.x, farCrumb.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-advance-corridor-8: 1-wide gate still snaps off the portal", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 7, y: 2 };
    const boss = { x: 6, y: 0 };
    const portal = { x: 7, y: 0 };
    const farCrumb = { x: 8, y: 0 };
    const allTiles = bossAiTilesFromMap(tiles);
    const raw = rawAdvanceDest(boss, player, allTiles);
    assert.deepEqual(
      raw,
      portal,
      "horizontal step toward the player is the gate",
    );
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(isOnAdvanceBattleGraph(farCrumb, player, occupancy), false);
    const landed = resolveAdvancePerTurnLanding(
      boss,
      player,
      allTiles,
      occupancy,
    );
    assert.equal(isOnAdvanceBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "7,0");
    assert.notEqual(occKey(landed.x, landed.y), "8,0");
  });

  it("seed-open-field-advance-noop: already-legal step is unchanged", () => {
    const tiles = [
      [F, F, F],
      [F, F, F],
      [F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 2, y: 2 }], [player, boss], player);
    const allTiles = bossAiTilesFromMap(tiles);
    const raw = rawAdvanceDest(boss, player, allTiles);
    assert.deepEqual(raw, { x: 1, y: 0 });
    const landed = resolveAdvancePerTurnLanding(
      boss,
      player,
      allTiles,
      occupancy,
    );
    assert.deepEqual(landed, raw);
  });

  it("seed-advance-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 4, y: 2 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(isOnAdvanceBattleGraph(island, player, occupancy), false);
    const allTiles = bossAiTilesFromMap(tiles);
    const landed = resolveAdvancePerTurnLanding(
      boss,
      player,
      allTiles,
      occupancy,
    );
    assert.equal(isOnAdvanceBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(island.x, island.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
  });

  it("seed-adjacent-minion-on-portal: getAdjacentTiles portal landing relocates", () => {
    const { tiles, player, boss, portal, farCrumb } = portalChokeFixture();
    const allTiles = bossAiTilesFromMap(tiles);
    const raw = rawAdjacentPortalAsFloor(boss, allTiles, [player, boss]);
    assert.equal(
      raw.some((c) => c.x === portal.x && c.y === portal.y),
      true,
      "fixture must offer the portal as an adjacent spawn",
    );
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const snapped = legalizeAdjacentMinionLandings(raw, player, occupancy);
    for (const cell of snapped) {
      assert.equal(
        isOnAdvanceBattleGraph(cell, player, occupancy),
        true,
        `minion ${occKey(cell.x, cell.y)} not on the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
    }
  });

  it("seed-adjacent-minion-dual-seals: two portal-adjacent spawns destack on-graph", () => {
    const tiles = [
      [F, F, P, F],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const portal = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const landings = [
      { x: 2, y: 0 },
      { x: 2, y: 0 },
    ];
    const snapped = legalizeAdjacentMinionLandings(landings, player, occupancy);
    assert.equal(snapped.length, 2);
    const keys = snapped.map((c) => occKey(c.x, c.y));
    assert.equal(new Set(keys).size, 2, "dual landings must not stack");
    for (const cell of snapped) {
      assert.equal(isOnAdvanceBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-advance-only-portal: stay put when the fight graph is empty", () => {
    const tiles = [
      [P, P],
      [P, P],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
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
    const allTiles = bossAiTilesFromMap(tiles);
    const landed = resolveAdvancePerTurnLanding(
      boss,
      player,
      allTiles,
      occupancy,
    );
    assert.deepEqual(landed, boss);
    assert.equal(floodAdvanceBattleGraph(player, occupancy).size, 0);
  });
});

function assertAdvanceOnWorld(
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
  const allTiles = bossAiTilesFromMap(tiles);
  for (const unit of units) {
    const landed = resolveAdvancePerTurnLanding(
      unit,
      player,
      allTiles,
      occupancy,
    );
    if (!isOnAdvanceBattleGraph(landed, player, occupancy)) {
      return `${label} advance ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
    }
    const adj = rawAdjacentPortalAsFloor(unit, allTiles, [player, ...units]);
    const snapped = legalizeAdjacentMinionLandings(adj, player, occupancy);
    for (const cell of snapped) {
      if (!isOnAdvanceBattleGraph(cell, player, occupancy)) {
        return `${label} minion ${occKey(cell.x, cell.y)}`;
      }
    }
  }
  return null;
}

describe("occupancyAdvanceUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack advance stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAdvanceOnWorld(
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

  it("corridorMaze wander advance stays on the fight graph", () => {
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
      const miss = assertAdvanceOnWorld(
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

  it("chessboard destack advance stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAdvanceOnWorld(
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

  it("Boss Rush destack advance stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAdvanceOnWorld(
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

  it("rest-exit destack advance stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertAdvanceOnWorld(
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
    const allTiles = bossAiTilesFromMap(world.tiles);
    for (const unit of world.spawns) {
      const landed = resolveAdvancePerTurnLanding(
        unit,
        world.playerSpawn,
        allTiles,
        occupancy,
      );
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
