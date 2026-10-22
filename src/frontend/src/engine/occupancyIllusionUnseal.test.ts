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
  floodIllusionBattleGraph,
  illusionRealOffFightGraph,
  isOnIllusionBattleGraph,
  legalizeIllusionLanding,
  legalizeIllusionLandings,
  rawIllusionAdjDests,
  rawIllusionSplitDests,
  resolveIllusionSplit,
  tilesForIllusionAi,
} from "./occupancyIllusionUnseal.ts";

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

function assertRealOnGraph(
  player: OccCell,
  copies: OccCell[],
  realIndex: number,
  occupancy: OccupancyContext,
  label: string,
): void {
  assert.ok(copies.length > 0, `${label}: dropped every copy`);
  const idx = Math.max(0, Math.min(copies.length - 1, realIndex));
  const real = copies[idx];
  assert.ok(real, `${label}: missing real copy`);
  assert.equal(
    occupancy.portals.has(occKey(real.x, real.y)),
    false,
    `${label}: real copy sat on the gate`,
  );
  assert.equal(
    isOnIllusionBattleGraph(real, player, occupancy),
    true,
    `${label}: real ${occKey(real.x, real.y)} left the fight graph`,
  );
  assert.equal(
    illusionRealOffFightGraph(player, copies, idx, occupancy),
    false,
    `${label}: real copy still isolated`,
  );
}

describe("occupancyIllusionUnseal regressions", () => {
  it("seed-illusion-onto-portal: first two allTiles adj dests include the gate", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForIllusionAi(tiles);
    const adj = rawIllusionAdjDests(boss, allTiles, [player, boss]);
    assert.ok(
      adj.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      "N/S/W/E scan must treat the portal as floor",
    );
    const raw = rawIllusionSplitDests(boss, allTiles, [player, boss]);
    assert.equal(occKey(raw[0].x, raw[0].y), occKey(boss.x, boss.y));
    assert.ok(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      "raw split must plant a copy on the gate",
    );
    const portalIdx = raw.findIndex(
      (c) => occKey(c.x, c.y) === occKey(portal.x, portal.y),
    );
    assert.equal(
      illusionRealOffFightGraph(player, raw, portalIdx, occupancy),
      true,
      "a real copy on the gate must be off the fight graph",
    );
    const resolved = resolveIllusionSplit(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      portalIdx,
    );
    assertRealOnGraph(
      player,
      resolved.positions,
      resolved.realIndex,
      occupancy,
      "portal-adj split",
    );
  });

  it("seed-illusion-through-portal-far-side: hop onto the gate then split onto a crumb", () => {
    const tiles = [
      [F, F, F, P, F, W],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 2 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const allTiles = tilesForIllusionAi(tiles);
    assert.equal(
      isOnIllusionBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    const raw = rawIllusionSplitDests(portal, allTiles, [player]);
    assert.equal(occKey(raw[0].x, raw[0].y), occKey(portal.x, portal.y));
    assert.ok(
      raw.some((c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y)),
      "split from the gate must plant a copy on the leftover crumb",
    );
    const crumbIdx = raw.findIndex(
      (c) => occKey(c.x, c.y) === occKey(farCrumb.x, farCrumb.y),
    );
    assert.equal(
      illusionRealOffFightGraph(player, raw, crumbIdx, occupancy),
      true,
    );
    const resolved = resolveIllusionSplit(
      portal,
      player,
      occupancy,
      allTiles,
      [player],
      crumbIdx,
    );
    assertRealOnGraph(
      player,
      resolved.positions,
      resolved.realIndex,
      occupancy,
      "far-crumb split",
    );
    for (const cell of resolved.positions) {
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
    }
  });

  it("seed-illusion-on-unique-bridge: walkable copies may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 3, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForIllusionAi(tiles);
    assert.equal(isOnIllusionBattleGraph(boss, player, occupancy), true);
    const resolved = resolveIllusionSplit(
      boss,
      player,
      occupancy,
      allTiles,
      [player, boss],
      0,
    );
    assert.ok(resolved.positions.length >= 1);
    assert.equal(
      occKey(resolved.positions[0].x, resolved.positions[0].y),
      occKey(boss.x, boss.y),
      "unlike VOID_TILES, a unique-corridor real copy stays — it is walkable",
    );
    assertRealOnGraph(
      player,
      resolved.positions,
      resolved.realIndex,
      occupancy,
      "unique-bridge",
    );
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-illusion-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeIllusionLandings(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    for (const cell of snapped) {
      assert.equal(isOnIllusionBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(
      illusionRealOffFightGraph(player, snapped, 0, occupancy),
      false,
    );
  });

  it("seed-open-field-illusion-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeIllusionLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(
      illusionRealOffFightGraph(player, snapped, 0, occupancy),
      false,
    );
  });

  it("seed-illusion-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnIllusionBattleGraph(island, player, occupancy), false);
    const snapped = legalizeIllusionLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnIllusionBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(
      illusionRealOffFightGraph(player, snapped, 0, occupancy),
      false,
    );
  });

  it("seed-illusion-dual-seals: two far dests both snap onto the fight graph", () => {
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
      illusionRealOffFightGraph(player, landings, 0, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeIllusionLandings(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one copy should still place");
    assert.equal(
      illusionRealOffFightGraph(player, snapped, 0, occupancy),
      false,
    );
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "copies must not stack");
    for (const cell of snapped) {
      assert.equal(isOnIllusionBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-illusion-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeIllusionLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodIllusionBattleGraph(player, occupancy).size, 0);
    const resolved = resolveIllusionSplit(
      { x: 1, y: 0 },
      player,
      occupancy,
      tilesForIllusionAi(tiles),
      [player],
      1,
    );
    assert.deepEqual(resolved.positions, []);
    assert.equal(
      illusionRealOffFightGraph(
        player,
        resolved.positions,
        resolved.realIndex,
        occupancy,
      ),
      true,
    );
  });

  it("seed-illusion-stay-when-blocked: missing adj dests keep the origin", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const blockers = [player, boss, { x: 1, y: 1 }, { x: 2, y: 0 }];
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], blockers, player);
    const allTiles = tilesForIllusionAi(tiles);
    const raw = rawIllusionSplitDests(boss, allTiles, blockers);
    assert.deepEqual(raw, [boss], "occupied neighbors must not plant fakes");
    const resolved = resolveIllusionSplit(
      boss,
      player,
      occupancy,
      allTiles,
      blockers,
      2,
    );
    assert.deepEqual(resolved.positions, [boss]);
    assert.equal(resolved.realIndex, 0, "realIndex must clamp onto the origin");
    assertRealOnGraph(
      player,
      resolved.positions,
      resolved.realIndex,
      occupancy,
      "stay-when-blocked",
    );
  });

  it("seed-illusion-real-index-portal: realIndex on the gate still snaps", () => {
    const tiles = [[F, F, F, P, F, F, F]];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const allTiles = tilesForIllusionAi(tiles);
    const raw = rawIllusionSplitDests(boss, allTiles, [player, boss]);
    const portalIdx = raw.findIndex(
      (c) => occKey(c.x, c.y) === occKey(portal.x, portal.y),
    );
    assert.ok(portalIdx >= 0, "raw split must include the portal copy");
    for (const realIndex of [0, 1, 2, portalIdx, 9]) {
      const resolved = resolveIllusionSplit(
        boss,
        player,
        occupancy,
        allTiles,
        [player, boss],
        realIndex,
      );
      assertRealOnGraph(
        player,
        resolved.positions,
        resolved.realIndex,
        occupancy,
        `realIndex ${realIndex}`,
      );
    }
  });

  it("legalizeIllusionLanding snaps a void dest onto dump", () => {
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
    assert.equal(isOnIllusionBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeIllusionLanding(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnIllusionBattleGraph(landed, player, occupancy), true);
  });
});

function assertIllusionsOnWorld(
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
  const allTiles = tilesForIllusionAi(tiles);
  for (const unit of units) {
    for (const realIndex of [0, 1, 2]) {
      const resolved = resolveIllusionSplit(
        unit,
        player,
        occupancy,
        allTiles,
        [player, ...units],
        realIndex,
      );
      if (resolved.positions.length === 0) continue;
      const idx = resolved.realIndex;
      const real = resolved.positions[idx];
      if (!real) {
        return `${label} missing real copy from ${occKey(unit.x, unit.y)}`;
      }
      if (occupancy.portals.has(occKey(real.x, real.y))) {
        return `${label} real copy on portal ${occKey(real.x, real.y)}`;
      }
      if (!isOnIllusionBattleGraph(real, player, occupancy)) {
        return `${label} real ${occKey(unit.x, unit.y)} → ${occKey(real.x, real.y)}`;
      }
      for (const cell of resolved.positions) {
        if (occupancy.portals.has(occKey(cell.x, cell.y))) {
          return `${label} fake on portal ${occKey(cell.x, cell.y)}`;
        }
        if (!isOnIllusionBattleGraph(cell, player, occupancy)) {
          return `${label} fake ${occKey(cell.x, cell.y)} left the fight graph`;
        }
      }
    }
  }
  return null;
}

describe("occupancyIllusionUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack illusion stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertIllusionsOnWorld(
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

  it("corridorMaze wander illusion stays on the fight graph", () => {
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
      const miss = assertIllusionsOnWorld(
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

  it("chessboard destack illusion stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertIllusionsOnWorld(
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

  it("Boss Rush destack illusion stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertIllusionsOnWorld(
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

  it("rest-exit destack illusion stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertIllusionsOnWorld(
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
    const allTiles = tilesForIllusionAi(world.tiles);
    for (const unit of world.spawns) {
      const resolved = resolveIllusionSplit(
        unit,
        world.playerSpawn,
        occupancy,
        allTiles,
        [world.playerSpawn, ...world.spawns],
        1,
      );
      for (const cell of resolved.positions) {
        assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
        assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
      }
    }
  });
});
