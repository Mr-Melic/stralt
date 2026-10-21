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
  floodKingBattleGraph,
  isOnKingBattleGraph,
  kingOffFightGraph,
  kingStepCandidates,
  legalizeKingLanding,
  legalizeKingLandings,
  rawKingAwayDest,
  rawKingTowardDest,
  resolveKingLanding,
} from "./occupancyKingUnseal.ts";

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

/** `#859` greedy moveToward: N→S→W→E closest-to-player on floor||portal. */
function rawGreedyMoveTowardDest(
  boss: OccCell,
  player: OccCell,
  allTiles: boolean[][],
  occupied: readonly OccCell[],
): OccCell | null {
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  const blocked = new Set(
    occupied
      .filter((o) => !(o.x === boss.x && o.y === boss.y))
      .map((o) => occKey(o.x, o.y)),
  );
  blocked.add(occKey(player.x, player.y));
  const dirs: Array<[number, number]> = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  const moves: OccCell[] = [];
  for (const [dx, dy] of dirs) {
    const x = boss.x + dx;
    const y = boss.y + dy;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    if (!allTiles[y]?.[x]) continue;
    if (blocked.has(occKey(x, y))) continue;
    moves.push({ x, y });
  }
  if (moves.length === 0) return null;
  return moves.reduce((a, b) => {
    const da = Math.abs(a.x - player.x) + Math.abs(a.y - player.y);
    const db = Math.abs(b.x - player.x) + Math.abs(b.y - player.y);
    return da < db ? a : b;
  });
}

function tilesForBossAI(tiles: string[][]): boolean[][] {
  return tiles.map((row) => (row ?? []).map((t) => t === F || t === P));
}

describe("occupancyKingUnseal regressions", () => {
  it("seed-king-diagonal-crumb: both cardinals blocked, diagonal leftover crumb is the hop", () => {
    const tiles = [
      [F, F, W, F, P],
      [F, F, F, W, W],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 1 };
    const unit = { x: 2, y: 1 };
    const portal = { x: 4, y: 0 };
    const crumb = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const toward = { x: 4, y: 0 };
    const candidates = kingStepCandidates(unit, toward);
    assert.deepEqual(candidates, [{ x: 3, y: 1 }, { x: 2, y: 0 }, crumb]);
    const king = rawKingTowardDest(unit, toward, occupancy);
    assert.deepEqual(
      king,
      crumb,
      "Chebyshev corner must take the leftover crumb",
    );
    const advance = rawDirectedAdvanceDest(unit, toward, tilesForBossAI(tiles));
    assert.equal(
      advance,
      null,
      "ADVANCE never pushes the diagonal candidate, so both walls yield no dest",
    );
    const greedy = rawGreedyMoveTowardDest(
      unit,
      toward,
      tilesForBossAI(tiles),
      [unit, player],
    );
    assert.ok(greedy);
    assert.notEqual(
      occKey(greedy.x, greedy.y),
      occKey(crumb.x, crumb.y),
      "greedy 4-dir must not see the diagonal crumb",
    );
    assert.equal(isOnKingBattleGraph(crumb, player, occupancy), false);
    assert.equal(kingOffFightGraph(player, [crumb], occupancy), true);
    const landed = resolveKingLanding(unit, toward, player, occupancy);
    assert.equal(isOnKingBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(crumb.x, crumb.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(kingOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-king-away-diagonal-crumb: flee uses the same corner when cardinals fail", () => {
    const tiles = [
      [F, F, W, F, P],
      [F, F, F, W, W],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 1 };
    const unit = { x: 2, y: 1 };
    const threat = { x: 1, y: 2 };
    const portal = { x: 4, y: 0 };
    const crumb = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const raw = rawKingAwayDest(unit, threat, occupancy);
    assert.deepEqual(raw, crumb);
    const landed = legalizeKingLanding(raw ?? unit, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnKingBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(crumb.x, crumb.y));
  });

  it("seed-king-onto-portal: isCellFree rejects the gate; ADVANCE still writes it", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 1 };
    const unit = { x: 2, y: 1 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const allTiles = tilesForBossAI(tiles);
    const king = rawKingTowardDest(unit, player, occupancy);
    assert.equal(
      king,
      null,
      "shared isCellFree must refuse the portal; dy=0 so there is no diagonal fallback",
    );
    const advance = rawDirectedAdvanceDest(unit, player, allTiles);
    assert.deepEqual(
      advance,
      portal,
      "ADVANCE treats tilesForBossAI portals as floor",
    );
    const greedy = rawGreedyMoveTowardDest(unit, player, allTiles, [
      unit,
      player,
    ]);
    assert.deepEqual(greedy, portal, "greedy 4-dir also sits on the gate");
    const landed = resolveKingLanding(unit, player, player, occupancy);
    assert.deepEqual(landed, unit, "missing raw step keeps the origin");
    assert.equal(isOnKingBattleGraph(landed, player, occupancy), true);
  });

  it("seed-king-on-unique-bridge: a corridor landing stays — the unit is walkable occupancy", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const unit = { x: 2, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const raw = rawKingTowardDest(unit, player, occupancy);
    assert.ok(raw);
    assert.equal(isOnKingBattleGraph(raw, player, occupancy), true);
    const landed = resolveKingLanding(unit, player, player, occupancy);
    assert.deepEqual(landed, raw);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-king-through-portal-far-side: a gate-adjacent crumb hops off the fight graph", () => {
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
      isOnKingBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const snapped = legalizeKingLandings([farCrumb], player, occupancy);
    assert.ok(snapped.length >= 1);
    for (const cell of snapped) {
      assert.equal(
        isOnKingBattleGraph(cell, player, occupancy),
        true,
        `king snap ${occKey(cell.x, cell.y)} left the fight graph`,
      );
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(kingOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-king-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeKingLandings([{ x: 4, y: 0 }], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnKingBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(kingOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-open-field-king-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeKingLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(kingOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-king-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnKingBattleGraph(island, player, occupancy), false);
    const snapped = legalizeKingLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnKingBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(kingOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-king-dual-seals: two far dests both snap onto the fight graph", () => {
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
      kingOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeKingLandings(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one hop should still place");
    assert.equal(kingOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "landings must not stack");
    for (const cell of snapped) {
      assert.equal(isOnKingBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-king-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeKingLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodKingBattleGraph(player, occupancy).size, 0);
    assert.equal(kingOffFightGraph(player, snapped, occupancy), true);
  });

  it("seed-king-stay-when-blocked: missing raw step keeps the origin", () => {
    const tiles = [
      [W, W, W],
      [W, F, W],
      [W, W, P],
    ];
    const player = { x: 2, y: 2 };
    const unit = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [player], [player, unit], player);
    const raw = rawKingTowardDest(unit, player, occupancy);
    assert.equal(raw, null);
    const landed = resolveKingLanding(unit, player, player, occupancy);
    assert.deepEqual(landed, unit);
  });

  it("legalizeKingLanding snaps a void dest onto dump", () => {
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
    assert.equal(isOnKingBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeKingLanding(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnKingBattleGraph(landed, player, occupancy), true);
  });
});

function assertKingOnWorld(
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
    if (!isOnKingBattleGraph(unit, player, occupancy)) continue;
    const landed = resolveKingLanding(unit, player, player, occupancy);
    if (occupancy.portals.has(occKey(landed.x, landed.y))) {
      return `${label} hop on portal ${occKey(landed.x, landed.y)}`;
    }
    if (!isOnKingBattleGraph(landed, player, occupancy)) {
      return `${label} hop ${occKey(unit.x, unit.y)} → ${occKey(landed.x, landed.y)}`;
    }
  }
  return null;
}

describe("occupancyKingUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack king-step stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertKingOnWorld(
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

  it("corridorMaze wander king-step stays on the fight graph", () => {
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
      const miss = assertKingOnWorld(
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

  it("chessboard destack king-step stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertKingOnWorld(
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

  it("Boss Rush destack king-step stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertKingOnWorld(
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

  it("rest-exit destack king-step stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertKingOnWorld(
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
      const landed = resolveKingLanding(
        unit,
        world.playerSpawn,
        world.playerSpawn,
        occupancy,
      );
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
