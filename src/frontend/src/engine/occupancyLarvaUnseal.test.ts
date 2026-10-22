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
  floodLarvaBattleGraph,
  isOnLarvaBattleGraph,
  larvaOffFightGraph,
  legalizeLarvaLanding,
  legalizeLarvaLandings,
  rawLarvaAdjDests,
  rawLarvaSpawnDest,
  resolveLarvaeSpawn,
  tilesForLarvaAi,
} from "./occupancyLarvaUnseal.ts";

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

function assertLarvaOnGraph(
  player: OccCell,
  larva: OccCell | null,
  occupancy: OccupancyContext,
  label: string,
): void {
  assert.ok(larva, `${label}: dropped the larva`);
  assert.equal(
    occupancy.portals.has(occKey(larva.x, larva.y)),
    false,
    `${label}: larva sat on the gate`,
  );
  assert.equal(
    isOnLarvaBattleGraph(larva, player, occupancy),
    true,
    `${label}: larva ${occKey(larva.x, larva.y)} left the fight graph`,
  );
  assert.equal(
    larvaOffFightGraph(player, [larva], occupancy),
    false,
    `${label}: larva still isolated`,
  );
}

describe("occupancyLarvaUnseal regressions", () => {
  it("seed-larva-onto-portal: N/S/W/E allTiles adj dests include the gate", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForLarvaAi(tiles);
    const adj = rawLarvaAdjDests(boss, allTiles, [player, boss]);
    assert.ok(
      adj.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      "N/S/W/E scan must treat the portal as floor",
    );
    const portalPick = adj.findIndex(
      (c) => occKey(c.x, c.y) === occKey(portal.x, portal.y),
    );
    const raw = rawLarvaSpawnDest(boss, allTiles, [player, boss], portalPick);
    assert.ok(raw);
    assert.equal(occKey(raw.x, raw.y), occKey(portal.x, portal.y));
    assert.equal(larvaOffFightGraph(player, [raw], occupancy), true);
    const landed = resolveLarvaeSpawn(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      portalPick,
    );
    assertLarvaOnGraph(player, landed, occupancy, "portal-adj spawn");
  });

  it("seed-larva-through-portal-far-side: hop onto the gate then spawn onto a crumb", () => {
    const tiles = [
      [F, F, F, P, F, W],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 2 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const allTiles = tilesForLarvaAi(tiles);
    assert.equal(
      isOnLarvaBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const adj = rawLarvaAdjDests(portal, allTiles, [player]);
    assert.ok(
      adj.some((c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y)),
      "spawn from the gate must be able to plant on the leftover crumb",
    );
    const crumbPick = adj.findIndex(
      (c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y),
    );
    const raw = rawLarvaSpawnDest(portal, allTiles, [player], crumbPick);
    assert.ok(raw);
    assert.equal(occKey(raw.x, raw.y), occKey(farCrumb.x, farCrumb.y));
    assert.equal(larvaOffFightGraph(player, [raw], occupancy), true);
    const landed = resolveLarvaeSpawn(
      portal,
      player,
      occupancy,
      allTiles,
      [player],
      crumbPick,
    );
    assertLarvaOnGraph(player, landed, occupancy, "far-crumb spawn");
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(farCrumb.x, farCrumb.y));
  });

  it("seed-larva-on-unique-bridge: walkable larvae may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 3, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForLarvaAi(tiles);
    assert.equal(isOnLarvaBattleGraph(boss, player, occupancy), true);
    const west = rawLarvaSpawnDest(boss, allTiles, [player, boss], 0);
    assert.ok(west);
    const landed = resolveLarvaeSpawn(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      0,
    );
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(west.x, west.y),
      "unlike VOID_TILES, a unique-corridor larva stays — it is walkable",
    );
    assertLarvaOnGraph(player, landed, occupancy, "unique-bridge");
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-larva-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const snapped = legalizeLarvaLandings([{ x: 4, y: 0 }], player, occupancy);
    assert.equal(snapped.length, 1);
    for (const cell of snapped) {
      assert.equal(isOnLarvaBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(larvaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-open-field-larva-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeLarvaLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(larvaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-larva-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnLarvaBattleGraph(island, player, occupancy), false);
    const snapped = legalizeLarvaLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnLarvaBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(larvaOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-larva-dual-seals: two far dests both snap onto the fight graph", () => {
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
      larvaOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeLarvaLandings(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one larva should still place");
    assert.equal(larvaOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "larvae must not stack");
    for (const cell of snapped) {
      assert.equal(isOnLarvaBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-larva-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeLarvaLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodLarvaBattleGraph(player, occupancy).size, 0);
    const landed = resolveLarvaeSpawn(
      { x: 1, y: 0 },
      player,
      occupancy,
      tilesForLarvaAi(tiles),
      [player],
      0,
    );
    assert.equal(landed, null);
    assert.equal(larvaOffFightGraph(player, [], occupancy), false);
  });

  it("seed-larva-stay-when-blocked: missing adj dests plant nothing", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const blockers = [player, boss, { x: 1, y: 1 }, { x: 2, y: 0 }];
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], blockers, player);
    const allTiles = tilesForLarvaAi(tiles);
    const adj = rawLarvaAdjDests(boss, allTiles, blockers);
    assert.deepEqual(adj, [], "occupied neighbors must not plant a larva");
    const raw = rawLarvaSpawnDest(boss, allTiles, blockers, 0);
    assert.equal(raw, null);
    const landed = resolveLarvaeSpawn(
      boss,
      player,
      occupancy,
      allTiles,
      blockers,
      9,
    );
    assert.equal(
      landed,
      null,
      "unlike ILLUSION_SPLIT, larvae have no origin copy",
    );
  });

  it("seed-larva-existing-occupies-portal: a second spawn skips the occupied gate", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const firstLarva = { x: 3, y: 0 };
    const occupied = [player, boss, firstLarva];
    const occupancy = ctxFrom(tiles, [portal], occupied, player);
    const allTiles = tilesForLarvaAi(tiles);
    const adj = rawLarvaAdjDests(boss, allTiles, occupied);
    assert.equal(
      adj.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      false,
      "existing larvae occupy the gate the way production occupied[] does",
    );
    for (let pick = 0; pick < Math.max(1, adj.length); pick++) {
      const landed = resolveLarvaeSpawn(
        boss,
        player,
        occupancy,
        allTiles,
        occupied,
        pick,
      );
      if (!landed) continue;
      assertLarvaOnGraph(
        player,
        landed,
        occupancy,
        `second-spawn pick ${pick}`,
      );
      assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    }
  });

  it("legalizeLarvaLanding snaps a void dest onto dump", () => {
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
    assert.equal(isOnLarvaBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeLarvaLanding(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnLarvaBattleGraph(landed, player, occupancy), true);
  });
});

function assertLarvaeOnWorld(
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
  const allTiles = tilesForLarvaAi(tiles);
  for (const unit of units) {
    const adj = rawLarvaAdjDests(unit, allTiles, [player, ...units]);
    for (let pick = 0; pick < Math.max(1, adj.length); pick++) {
      const landed = resolveLarvaeSpawn(
        unit,
        player,
        occupancy,
        allTiles,
        [player, ...units],
        pick,
      );
      if (!landed) continue;
      if (occupancy.portals.has(occKey(landed.x, landed.y))) {
        return `${label} larva on portal ${occKey(landed.x, landed.y)}`;
      }
      if (!isOnLarvaBattleGraph(landed, player, occupancy)) {
        return `${label} ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
      }
      if (larvaOffFightGraph(player, [landed], occupancy)) {
        return `${label} larva still isolated at ${occKey(landed.x, landed.y)}`;
      }
    }
  }
  return null;
}

describe("occupancyLarvaUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack larva stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLarvaeOnWorld(
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

  it("corridorMaze wander larva stays on the fight graph", () => {
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
      const miss = assertLarvaeOnWorld(
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

  it("chessboard destack larva stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLarvaeOnWorld(
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

  it("Boss Rush destack larva stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLarvaeOnWorld(
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

  it("rest-exit destack larva stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertLarvaeOnWorld(
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
    const allTiles = tilesForLarvaAi(world.tiles);
    for (const unit of world.spawns) {
      const adj = rawLarvaAdjDests(unit, allTiles, [
        world.playerSpawn,
        ...world.spawns,
      ]);
      for (let pick = 0; pick < Math.max(1, adj.length); pick++) {
        const landed = resolveLarvaeSpawn(
          unit,
          world.playerSpawn,
          occupancy,
          allTiles,
          [world.playerSpawn, ...world.spawns],
          pick,
        );
        if (!landed) continue;
        assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
        assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
      }
    }
  });
});
