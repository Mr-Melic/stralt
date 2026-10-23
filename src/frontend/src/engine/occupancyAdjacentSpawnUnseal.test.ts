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
  ADJACENT_SPAWN_ENEMY_CAP,
  SPLIT_ROOKS_SPAWN_COUNT,
  adjacentSpawnOffFightGraph,
  floodAdjacentSpawnBattleGraph,
  isOnAdjacentSpawnBattleGraph,
  legalizeAdjacentSpawnLanding,
  legalizeAdjacentSpawnLandings,
  rawAdjacentSpawnAdjDests,
  rawPhantomSpawnDest,
  rawScrollSummonDests,
  rawSpawnMinionsDests,
  rawSplitRooksDests,
  remainingAdjacentSpawnSlots,
  resolvePhantomSpawn,
  resolveScrollSummon,
  resolveSpawnMinions,
  resolveSplitRooks,
  tilesForAdjacentSpawnAi,
} from "./occupancyAdjacentSpawnUnseal.ts";

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

function assertSpawnsOnGraph(
  player: OccCell,
  spawns: readonly OccCell[],
  occupancy: OccupancyContext,
  label: string,
): void {
  assert.ok(spawns.length > 0, `${label}: dropped every minion`);
  const keys = new Set(spawns.map((c) => occKey(c.x, c.y)));
  assert.equal(keys.size, spawns.length, `${label}: minions stacked`);
  for (const cell of spawns) {
    assert.equal(
      occupancy.portals.has(occKey(cell.x, cell.y)),
      false,
      `${label}: minion sat on the gate`,
    );
    assert.equal(
      isOnAdjacentSpawnBattleGraph(cell, player, occupancy),
      true,
      `${label}: minion ${occKey(cell.x, cell.y)} left the fight graph`,
    );
  }
  assert.equal(
    adjacentSpawnOffFightGraph(player, spawns, occupancy),
    false,
    `${label}: minion still isolated`,
  );
}

describe("occupancyAdjacentSpawnUnseal regressions", () => {
  it("seed-spawn-minions-onto-portal: first-N N/S/W/E dests include the gate", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    const adj = rawAdjacentSpawnAdjDests(boss, allTiles, [player, boss]);
    assert.ok(
      adj.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      "N/S/W/E scan must treat the portal as floor",
    );
    const raw = rawSpawnMinionsDests(boss, allTiles, [player, boss], 2, 1);
    assert.ok(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      "SPAWN_MINIONS first-N must plant on the gate",
    );
    assert.equal(adjacentSpawnOffFightGraph(player, raw, occupancy), true);
    const landed = resolveSpawnMinions(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      2,
      1,
    );
    assertSpawnsOnGraph(player, landed, occupancy, "spawn-minions portal");
  });

  it("seed-scroll-summon-onto-portal: Pale Archivist first-N matches minions", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    const minions = rawSpawnMinionsDests(boss, allTiles, [player, boss], 2, 1);
    const scrolls = rawScrollSummonDests(boss, allTiles, [player, boss], 2, 1);
    assert.deepEqual(
      scrolls.map((c) => occKey(c.x, c.y)),
      minions.map((c) => occKey(c.x, c.y)),
    );
    const landed = resolveScrollSummon(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      2,
      1,
    );
    assertSpawnsOnGraph(player, landed, occupancy, "scroll-summon portal");
  });

  it("seed-split-rooks-onto-portal: two-rook slice plants the gate", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    const raw = rawSplitRooksDests(boss, allTiles, [player, boss], 1);
    assert.equal(raw.length, SPLIT_ROOKS_SPAWN_COUNT);
    assert.ok(raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)));
    const landed = resolveSplitRooks(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      1,
    );
    assertSpawnsOnGraph(player, landed, occupancy, "split-rooks portal");
  });

  it("seed-phantom-onto-portal: randomFrom adj can pick the gate", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    const adj = rawAdjacentSpawnAdjDests(boss, allTiles, [player, boss]);
    const portalPick = adj.findIndex(
      (c) => occKey(c.x, c.y) === occKey(portal.x, portal.y),
    );
    const raw = rawPhantomSpawnDest(
      boss,
      allTiles,
      [player, boss],
      portalPick,
      1,
    );
    assert.ok(raw);
    assert.equal(occKey(raw.x, raw.y), occKey(portal.x, portal.y));
    assert.equal(adjacentSpawnOffFightGraph(player, [raw], occupancy), true);
    const landed = resolvePhantomSpawn(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      portalPick,
      1,
    );
    assert.ok(landed);
    assertSpawnsOnGraph(player, [landed], occupancy, "phantom portal");
  });

  it("seed-adjacent-spawn-through-portal-far-side: hop onto the gate then spawn onto a crumb", () => {
    const tiles = [
      [F, F, F, P, F, W],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 2 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    assert.equal(
      isOnAdjacentSpawnBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const adj = rawAdjacentSpawnAdjDests(portal, allTiles, [player]);
    assert.ok(
      adj.some((c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y)),
      "spawn from the gate must be able to plant on the leftover crumb",
    );
    const crumbPick = adj.findIndex(
      (c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y),
    );
    const raw = rawPhantomSpawnDest(portal, allTiles, [player], crumbPick, 1);
    assert.ok(raw);
    assert.equal(occKey(raw.x, raw.y), occKey(farCrumb.x, farCrumb.y));
    assert.equal(adjacentSpawnOffFightGraph(player, [raw], occupancy), true);
    const landed = resolvePhantomSpawn(
      portal,
      player,
      occupancy,
      allTiles,
      [player],
      crumbPick,
      1,
    );
    assert.ok(landed);
    assertSpawnsOnGraph(player, [landed], occupancy, "far-crumb spawn");
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(farCrumb.x, farCrumb.y));
  });

  it("seed-adjacent-spawn-on-unique-bridge: living minions may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 3, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    assert.equal(isOnAdjacentSpawnBattleGraph(boss, player, occupancy), true);
    const west = rawPhantomSpawnDest(boss, allTiles, [player, boss], 0, 1);
    assert.ok(west);
    const landed = resolvePhantomSpawn(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      0,
      1,
    );
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(west.x, west.y),
      "unlike VOID_TILES, a unique-corridor minion stays — occupancy can slide it",
    );
    assertSpawnsOnGraph(player, [landed], occupancy, "unique-bridge");
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-adjacent-spawn-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const snapped = legalizeAdjacentSpawnLandings(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    assert.equal(snapped.length, 1);
    for (const cell of snapped) {
      assert.equal(isOnAdjacentSpawnBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(adjacentSpawnOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-open-field-adjacent-spawn-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeAdjacentSpawnLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(adjacentSpawnOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-adjacent-spawn-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnAdjacentSpawnBattleGraph(island, player, occupancy),
      false,
    );
    const snapped = legalizeAdjacentSpawnLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnAdjacentSpawnBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(adjacentSpawnOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-adjacent-spawn-dual-seals: two far dests both snap onto the fight graph", () => {
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
      adjacentSpawnOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeAdjacentSpawnLandings(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one minion should still place");
    assert.equal(adjacentSpawnOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "minions must not stack");
    for (const cell of snapped) {
      assert.equal(isOnAdjacentSpawnBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-adjacent-spawn-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeAdjacentSpawnLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodAdjacentSpawnBattleGraph(player, occupancy).size, 0);
    const landed = resolvePhantomSpawn(
      { x: 1, y: 0 },
      player,
      occupancy,
      tilesForAdjacentSpawnAi(tiles),
      [player],
      0,
      1,
    );
    assert.equal(landed, null);
    assert.equal(adjacentSpawnOffFightGraph(player, [], occupancy), false);
  });

  it("seed-adjacent-spawn-stay-when-blocked: missing adj dests plant nothing", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const blockers = [player, boss, { x: 1, y: 1 }, { x: 2, y: 0 }];
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], blockers, player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    const adj = rawAdjacentSpawnAdjDests(boss, allTiles, blockers);
    assert.deepEqual(adj, [], "occupied neighbors must not plant a minion");
    const raw = rawPhantomSpawnDest(boss, allTiles, blockers, 0, 1);
    assert.equal(raw, null);
    const landed = resolvePhantomSpawn(
      boss,
      player,
      occupancy,
      allTiles,
      blockers,
      9,
      1,
    );
    assert.equal(landed, null, "full adjacent occupancy plants nothing");
    const minions = resolveSpawnMinions(
      boss,
      player,
      occupancy,
      allTiles,
      blockers,
      3,
      1,
    );
    assert.deepEqual(minions, []);
  });

  it("seed-adjacent-spawn-cap-full: C6 19-enemy cap plants nothing", () => {
    const tiles = [[F, F, F, F, P]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player, boss], player);
    const allTiles = tilesForAdjacentSpawnAi(tiles);
    assert.equal(remainingAdjacentSpawnSlots(ADJACENT_SPAWN_ENEMY_CAP), 0);
    assert.deepEqual(
      rawSpawnMinionsDests(
        boss,
        allTiles,
        [player, boss],
        4,
        ADJACENT_SPAWN_ENEMY_CAP,
      ),
      [],
    );
    assert.deepEqual(
      rawSplitRooksDests(
        boss,
        allTiles,
        [player, boss],
        ADJACENT_SPAWN_ENEMY_CAP,
      ),
      [],
    );
    assert.equal(
      rawPhantomSpawnDest(
        boss,
        allTiles,
        [player, boss],
        0,
        ADJACENT_SPAWN_ENEMY_CAP,
      ),
      null,
    );
    assert.deepEqual(
      resolveSpawnMinions(
        boss,
        player,
        occupancy,
        allTiles,
        [player, boss],
        4,
        ADJACENT_SPAWN_ENEMY_CAP,
      ),
      [],
    );
  });

  it("legalizeAdjacentSpawnLanding snaps a void dest onto dump", () => {
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
    assert.equal(
      isOnAdjacentSpawnBattleGraph(voidCell, player, occupancy),
      false,
    );
    const landed = legalizeAdjacentSpawnLanding(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnAdjacentSpawnBattleGraph(landed, player, occupancy), true);
  });
});

function assertAdjacentSpawnsOnWorld(
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
  const allTiles = tilesForAdjacentSpawnAi(tiles);
  const occupied = [player, ...units];
  const currentEnemyCount = Math.min(
    units.length,
    ADJACENT_SPAWN_ENEMY_CAP - 1,
  );
  for (const unit of units) {
    const adj = rawAdjacentSpawnAdjDests(unit, allTiles, occupied);
    const minions = resolveSpawnMinions(
      unit,
      player,
      occupancy,
      allTiles,
      occupied,
      3,
      currentEnemyCount,
    );
    const rooks = resolveSplitRooks(
      unit,
      player,
      occupancy,
      allTiles,
      occupied,
      currentEnemyCount,
    );
    const scrolls = resolveScrollSummon(
      unit,
      player,
      occupancy,
      allTiles,
      occupied,
      2,
      currentEnemyCount,
    );
    for (const batch of [minions, rooks, scrolls]) {
      for (const cell of batch) {
        if (occupancy.portals.has(occKey(cell.x, cell.y))) {
          return `${label} minion on portal ${occKey(cell.x, cell.y)}`;
        }
        if (!isOnAdjacentSpawnBattleGraph(cell, player, occupancy)) {
          return `${label} ${occKey(unit.x, unit.y)} → ${occKey(cell.x, cell.y)}`;
        }
      }
      if (adjacentSpawnOffFightGraph(player, batch, occupancy)) {
        return `${label} batch still isolated`;
      }
    }
    for (let pick = 0; pick < Math.max(1, adj.length); pick++) {
      const landed = resolvePhantomSpawn(
        unit,
        player,
        occupancy,
        allTiles,
        occupied,
        pick,
        currentEnemyCount,
      );
      if (!landed) continue;
      if (occupancy.portals.has(occKey(landed.x, landed.y))) {
        return `${label} phantom on portal ${occKey(landed.x, landed.y)}`;
      }
      if (!isOnAdjacentSpawnBattleGraph(landed, player, occupancy)) {
        return `${label} phantom ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
      }
    }
  }
  return null;
}

describe("occupancyAdjacentSpawnUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack adjacent SpawnData stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAdjacentSpawnsOnWorld(
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

  it("corridorMaze wander adjacent SpawnData stays on the fight graph", () => {
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
      const miss = assertAdjacentSpawnsOnWorld(
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

  it("chessboard destack adjacent SpawnData stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAdjacentSpawnsOnWorld(
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

  it("Boss Rush destack adjacent SpawnData stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertAdjacentSpawnsOnWorld(
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

  it("rest-exit destack adjacent SpawnData stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertAdjacentSpawnsOnWorld(
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
    const allTiles = tilesForAdjacentSpawnAi(world.tiles);
    const occupied = [world.playerSpawn, ...world.spawns];
    for (const unit of world.spawns) {
      const adj = rawAdjacentSpawnAdjDests(unit, allTiles, occupied);
      const batches = [
        resolveSpawnMinions(
          unit,
          world.playerSpawn,
          occupancy,
          allTiles,
          occupied,
          3,
          world.spawns.length,
        ),
        resolveSplitRooks(
          unit,
          world.playerSpawn,
          occupancy,
          allTiles,
          occupied,
          world.spawns.length,
        ),
        resolveScrollSummon(
          unit,
          world.playerSpawn,
          occupancy,
          allTiles,
          occupied,
          2,
          world.spawns.length,
        ),
      ];
      for (const batch of batches) {
        for (const landed of batch) {
          assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
          assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
        }
      }
      for (let pick = 0; pick < Math.max(1, adj.length); pick++) {
        const landed = resolvePhantomSpawn(
          unit,
          world.playerSpawn,
          occupancy,
          allTiles,
          occupied,
          pick,
          world.spawns.length,
        );
        if (!landed) continue;
        assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
        assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
      }
    }
  });
});
