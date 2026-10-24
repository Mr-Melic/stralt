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
  WALK_BLOCKER_GENERATE_MAX,
  WALK_BLOCKER_GENERATE_MIN,
  WALK_BLOCKER_SPAWN_CLEAR,
  floodWalkBlockerBattleGraph,
  isOnWalkBlockerBattleGraph,
  isWalkBlockerSpawnClear,
  legalizeWalkBlockerPlacement,
  legalizeWalkBlockerPlacements,
  pickWalkBlockerCount,
  pickWalkBlockerDests,
  rawWalkBlockerDests,
  resolveWalkBlockers,
  walkBlockerSealsProgression,
  walkBlockerUnreachable,
} from "./occupancyWalkBlockerUnseal.ts";

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

describe("occupancyWalkBlockerUnseal regressions", () => {
  it("seed-walk-blocker-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawWalkBlockerDests(occupancy, player);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(WALK_BLOCKER_GENERATE_MIN, 1);
    assert.equal(WALK_BLOCKER_GENERATE_MAX, 1);
  });

  it("seed-walk-blocker-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawWalkBlockerDests(occupancy, spawn);
    assert.equal(isWalkBlockerSpawnClear(0, 0, spawn), true);
    assert.equal(isWalkBlockerSpawnClear(3, 0, spawn), true);
    assert.equal(isWalkBlockerSpawnClear(4, 0, spawn), false);
    assert.equal(WALK_BLOCKER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isWalkBlockerSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-walk-blocker-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawWalkBlockerDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isWalkBlockerSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((c) => c.x === cx && c.y === cy),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((c) => c.x === 0 && c.y === 0),
      false,
      "the legalized spawn cell itself is skipped",
    );
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(size - 1, 0)),
      false,
      "the corner portal is still skipped",
    );
  });

  it("seed-walk-blocker-through-portal-far-side: one floor hop parks the wall on a crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnWalkBlockerBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(walkBlockerUnreachable(player, [dest], occupancy), true);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(walkBlockerUnreachable(player, [landed], occupancy), false);
    assert.equal(
      walkBlockerSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-walk-blocker-on-unique-bridge: impassable plant must not stay on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, F, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { x: 6, y: 1 };
    const dump = { x: 8, y: 2 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnWalkBlockerBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      walkBlockerSealsProgression(player, [dest], occupancy),
      true,
      "walling the unique corridor must seal the exit",
    );
    assert.equal(isWalkBlockerSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, a unique-corridor pillar must snap off",
    );
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.equal(
      walkBlockerSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dump.x, dump.y),
      "dump alcove outside spawn±3 is the legal plant",
    );
    assert.equal(tiles[1][6], F, "must not punch or wall the unique corridor");
  });

  it("seed-walk-blocker-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(walkBlockerSealsProgression(player, [dest], occupancy), true);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-walk-blocker-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeWalkBlockerPlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(walkBlockerUnreachable(player, [landed], occupancy), false);
    assert.equal(
      walkBlockerSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-walk-blocker-onto-void: a generation void is not a legal wall plant", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 6, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["5,0"]),
    );
    assert.equal(
      rawWalkBlockerDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(walkBlockerUnreachable(player, [dest], occupancy), true);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.equal(walkBlockerUnreachable(player, [landed], occupancy), false);
    assert.equal(
      walkBlockerSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-open-field-blocker-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    assert.equal(isWalkBlockerSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(walkBlockerUnreachable(player, [landed!], occupancy), false);
    assert.equal(
      walkBlockerSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-walk-blocker-covers-player: wall occupancy on the player cell snaps off", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 4, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, covering the player is illegal",
    );
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.equal(
      walkBlockerSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-walk-blocker-occupied: production occupancy-blind dest snaps off the unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isWalkBlockerSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, an occupied fight-graph cell must snap off",
    );
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.equal(occupancy.isOccupied(landed), false);
  });

  it("seed-walk-blocker-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnWalkBlockerBattleGraph({ x: 5, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(walkBlockerUnreachable(player, [dest], occupancy), true);
    const landed = legalizeWalkBlockerPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnWalkBlockerBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(walkBlockerUnreachable(player, [landed], occupancy), false);
  });

  it("seed-walk-blocker-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveWalkBlockers(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodWalkBlockerBattleGraph(player, occupancy).size, 0);
    assert.equal(walkBlockerUnreachable(player, snapped, occupancy), true);
    assert.equal(rawWalkBlockerDests(occupancy, player).length, 0);
  });

  it("seed-walk-blocker-dual-path: two corridor dests cannot jointly cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landings = [
      { x: 4, y: 0 },
      { x: 3, y: 0 },
    ];
    assert.equal(
      walkBlockerSealsProgression(player, landings, occupancy),
      true,
      "both unique-corridor cells together must seal",
    );
    const snapped = legalizeWalkBlockerPlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one blocker should still place");
    assert.equal(
      walkBlockerSealsProgression(player, snapped, occupancy),
      false,
    );
    for (const cell of snapped) {
      assert.equal(isOnWalkBlockerBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-walk-blocker-skips-existing: a second blocksWalk roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawWalkBlockerDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog must not stack two blocksWalk features on one cell",
    );
    assert.equal(
      rawWalkBlockerDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-walk-blocker-no-restamp-snap: leftover dest must not snap onto an existing pillar", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const first = legalizeWalkBlockerPlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(first);
    const existing = new Set([occKey(first.x, first.y)]);
    const second = resolveWalkBlockers(
      player,
      occupancy,
      undefined,
      [{ x: 5, y: 0 }],
      existing,
    );
    assert.equal(
      second.some((c) => existing.has(occKey(c.x, c.y))),
      false,
      "snap must not restack a leftover dest onto the first pillar",
    );
    assert.equal(
      walkBlockerSealsProgression(player, [first, ...second], occupancy),
      false,
    );
  });

  it("seed-walk-blocker-count-one: catalog pick is one cell", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawWalkBlockerDests(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickWalkBlockerCount(rng);
      assert.equal(count, WALK_BLOCKER_GENERATE_MIN);
      const picked = pickWalkBlockerDests(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isWalkBlockerSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });
});

function assertWalkBlockerOnWorld(
  label: string,
  tiles: string[][],
  voidTiles: Set<string>,
  portals: OccCell[],
  player: OccCell,
  units: OccCell[],
  rng: () => number,
  spawn: OccCell = player,
): string | null {
  const occupancy = ctxFrom(
    tiles,
    portals,
    [player, ...units],
    player,
    voidTiles,
  );
  const snapped = resolveWalkBlockers(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodWalkBlockerBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} blocker placed on an empty fight graph`;
    }
    return null;
  }
  for (const cell of snapped) {
    if (walkBlockerUnreachable(player, [cell], occupancy)) {
      return `${label} walk-blocker unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnWalkBlockerBattleGraph(cell, player, occupancy)) {
      return `${label} blocker misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (occKey(cell.x, cell.y) === occKey(player.x, player.y)) {
      return `${label} dest ${occKey(cell.x, cell.y)} covered the player`;
    }
    if (isWalkBlockerSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (occupancy.isOccupied(cell)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on an occupant`;
    }
  }
  if (walkBlockerSealsProgression(player, snapped, occupancy)) {
    return `${label} blockers jointly sealed every exit`;
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two blockers on one cell`;
  }
  return null;
}

describe("occupancyWalkBlockerUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack walk-blockers stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertWalkBlockerOnWorld(
        `destack ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 7),
        world.playerSpawn,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander walk-blockers stay on the fight graph", () => {
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
      const miss = assertWalkBlockerOnWorld(
        `wander ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        world.playerSpawn,
        after.spawns,
        createSeededRng(seed + 11),
        world.playerSpawn,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("chessboard destack walk-blockers stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertWalkBlockerOnWorld(
        `chess ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 13),
        world.playerSpawn,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack walk-blockers stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertWalkBlockerOnWorld(
        `bossRush ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 17),
        world.playerSpawn,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack walk-blockers stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertWalkBlockerOnWorld(
          `rest-${restExitType} ${seed}`,
          world.tiles,
          world.voidTiles,
          world.portals,
          after.playerSpawn,
          after.spawns,
          createSeededRng(seed + 19),
          world.playerSpawn,
        );
        if (miss) failures.push(miss);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("second roll skips existing and still does not seal", () => {
    const failures: string[] = [];
    for (const seed of seeds.slice(0, 64)) {
      const world = generateSeededWorld({ seed, runMode: "dungeon" });
      const occupancy = ctxFrom(
        world.tiles,
        world.portals,
        [world.playerSpawn, ...world.spawns],
        world.playerSpawn,
        world.voidTiles,
      );
      const existing = new Set(
        resolveWalkBlockers(
          world.playerSpawn,
          occupancy,
          createSeededRng(seed + 3),
        ).map((c) => occKey(c.x, c.y)),
      );
      const snapped = resolveWalkBlockers(
        world.playerSpawn,
        occupancy,
        createSeededRng(seed + 5),
        undefined,
        existing,
      );
      const battle = floodWalkBlockerBattleGraph(world.playerSpawn, occupancy);
      for (const cell of snapped) {
        const k = occKey(cell.x, cell.y);
        if (existing.has(k)) {
          failures.push(`seed ${seed} restamped ${k}`);
          break;
        }
        if (battle.size > 0 && !battle.has(k)) {
          failures.push(`seed ${seed} second blocker off graph at ${k}`);
          break;
        }
      }
      const combined = [
        ...[...existing].map((k) => {
          const [x, y] = k.split(",").map(Number);
          return { x, y };
        }),
        ...snapped,
      ];
      if (walkBlockerSealsProgression(world.playerSpawn, combined, occupancy)) {
        failures.push(`seed ${seed} jointly sealed after second roll`);
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
    const snapped = resolveWalkBlockers(
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
