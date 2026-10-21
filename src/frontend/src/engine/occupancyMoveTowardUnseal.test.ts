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
  floodMoveTowardBattleGraph,
  isOnMoveTowardBattleGraph,
  legalizeMoveTowardLanding,
  legalizeMoveTowardLandings,
  moveTowardOffFightGraph,
  rawGreedyMoveTowardDest,
  resolveMoveTowardLanding,
  tilesForMoveTowardAi,
} from "./occupancyMoveTowardUnseal.ts";

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

/** `#732` ADVANCE: horizontal then vertical. Local so this PR does not restack occupancyAdvanceUnseal. */
function rawDirectedAdvanceDest(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
): OccCell | null {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const dx = Math.sign(player.x - boss.x);
  const dy = Math.sign(player.y - boss.y);
  const candidates: OccCell[] = [];
  if (dx !== 0) candidates.push({ x: boss.x + dx, y: boss.y });
  if (dy !== 0) candidates.push({ x: boss.x, y: boss.y + dy });
  const valid = candidates.filter(
    (p) => p.x >= 0 && p.x < w && p.y >= 0 && p.y < h && allTiles[p.y]?.[p.x],
  );
  return valid[0] ?? null;
}

describe("occupancyMoveTowardUnseal regressions", () => {
  it("seed-movetoward-side-portal: occupied toward-axis makes greedy pick the gate; ADVANCE still writes the stacked cell", () => {
    const tiles = [
      [F, F, P, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 0 };
    const boss = { x: 2, y: 1 };
    const minion = { x: 3, y: 1 };
    const portal = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss, minion], player);
    const allTiles = tilesForMoveTowardAi(tiles);
    const greedy = rawGreedyMoveTowardDest(boss, player, allTiles, [
      boss,
      minion,
    ]);
    const advance = rawDirectedAdvanceDest(boss, player, allTiles);
    assert.deepEqual(
      greedy,
      portal,
      "occupancy skip must leave the north portal as the closest remaining hop",
    );
    assert.deepEqual(
      advance,
      minion,
      "ADVANCE is occupancy-blind and still writes the stacked toward-axis cell",
    );
    assert.equal(moveTowardOffFightGraph(player, [portal], occupancy), true);
    const landed = resolveMoveTowardLanding(boss, player, allTiles, occupancy, [
      boss,
      minion,
      player,
    ]);
    assert.equal(isOnMoveTowardBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(minion.x, minion.y));
    assert.equal(moveTowardOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-movetoward-onto-portal: greedy hop between boss and player sits on the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 1 };
    const boss = { x: 2, y: 1 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForMoveTowardAi(tiles);
    const step = rawGreedyMoveTowardDest(boss, player, allTiles, [boss]);
    assert.deepEqual(step, portal, "manhattan hop must pick the portal");
    const landed = resolveMoveTowardLanding(boss, player, allTiles, occupancy, [
      boss,
      player,
    ]);
    assert.equal(isOnMoveTowardBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(moveTowardOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-movetoward-on-unique-bridge: a corridor landing stays — the unit is walkable occupancy", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 2, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForMoveTowardAi(tiles);
    const raw = rawGreedyMoveTowardDest(boss, player, allTiles, [boss]);
    assert.ok(raw);
    assert.equal(isOnMoveTowardBattleGraph(raw, player, occupancy), true);
    const landed = resolveMoveTowardLanding(boss, player, allTiles, occupancy, [
      boss,
      player,
    ]);
    assert.deepEqual(landed, raw);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-movetoward-through-portal-far-side: a gate landing then hops the leftover crumb", () => {
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
      isOnMoveTowardBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = legalizeMoveTowardLandings([farCrumb], player, occupancy);
    assert.ok(snapped.length >= 1);
    for (const cell of snapped) {
      assert.equal(
        isOnMoveTowardBattleGraph(cell, player, occupancy),
        true,
        `moveToward snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(moveTowardOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-movetoward-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeMoveTowardLandings(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    for (const cell of snapped) {
      assert.equal(isOnMoveTowardBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(moveTowardOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-open-field-movetoward-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeMoveTowardLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(moveTowardOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-movetoward-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnMoveTowardBattleGraph(island, player, occupancy), false);
    const snapped = legalizeMoveTowardLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnMoveTowardBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(moveTowardOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-movetoward-dual-seals: two far dests both snap onto the fight graph", () => {
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
      moveTowardOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeMoveTowardLandings(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one hop should still place");
    assert.equal(moveTowardOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "landings must not stack");
    for (const cell of snapped) {
      assert.equal(isOnMoveTowardBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-movetoward-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeMoveTowardLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodMoveTowardBattleGraph(player, occupancy).size, 0);
    assert.equal(moveTowardOffFightGraph(player, snapped, occupancy), true);
  });

  it("seed-movetoward-stay-when-blocked: missing raw step keeps the origin", () => {
    const tiles = [
      [W, W, W],
      [W, F, W],
      [W, W, P],
    ];
    const player = { x: 2, y: 2 };
    const boss = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [player], [player, boss], player);
    const allTiles = tilesForMoveTowardAi(tiles);
    const raw = rawGreedyMoveTowardDest(boss, player, allTiles, [boss, player]);
    assert.equal(raw, null);
    const landed = resolveMoveTowardLanding(boss, player, allTiles, occupancy, [
      boss,
      player,
    ]);
    assert.deepEqual(landed, boss);
  });

  it("legalizeMoveTowardLanding snaps a void dest onto dump", () => {
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
    assert.equal(isOnMoveTowardBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeMoveTowardLanding(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnMoveTowardBattleGraph(landed, player, occupancy), true);
  });
});

function assertMoveTowardOnWorld(
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
  const allTiles = tilesForMoveTowardAi(tiles);
  for (const unit of units) {
    if (!isOnMoveTowardBattleGraph(unit, player, occupancy)) continue;
    const landed = resolveMoveTowardLanding(unit, player, allTiles, occupancy, [
      player,
      ...units,
    ]);
    if (occupancy.portals.has(occKey(landed.x, landed.y))) {
      return `${label} hop on portal ${occKey(landed.x, landed.y)}`;
    }
    if (!isOnMoveTowardBattleGraph(landed, player, occupancy)) {
      return `${label} hop ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
    }
  }
  return null;
}

describe("occupancyMoveTowardUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack moveToward stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertMoveTowardOnWorld(
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

  it("corridorMaze wander moveToward stays on the fight graph", () => {
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
      const miss = assertMoveTowardOnWorld(
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

  it("chessboard destack moveToward stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertMoveTowardOnWorld(
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

  it("Boss Rush destack moveToward stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertMoveTowardOnWorld(
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

  it("rest-exit destack moveToward stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertMoveTowardOnWorld(
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
    const allTiles = tilesForMoveTowardAi(world.tiles);
    for (const unit of world.spawns) {
      const landed = resolveMoveTowardLanding(
        unit,
        world.playerSpawn,
        allTiles,
        occupancy,
        [world.playerSpawn, ...world.spawns],
      );
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
