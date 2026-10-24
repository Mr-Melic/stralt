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
  CREEPING_ASH_LANE_LENGTH,
  CREEPING_ASH_SPAWN_CLEAR,
  type CreepingAshLane,
  creepingAshAdvanceCells,
  creepingAshLaneCells,
  creepingAshUnreachable,
  floodCreepingAshBattleGraph,
  isCreepingAshSpawnClear,
  isOnCreepingAshBattleGraph,
  legalizeCreepingAshAdvance,
  legalizeCreepingAshLane,
  pickCreepingAshLane,
  rawCreepingAshAdvanceLead,
  rawCreepingAshLanes,
  resolveCreepingAsh,
  resolveCreepingAshAdvance,
} from "./occupancyCreepingAshUnseal.ts";

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

function laneKeys(lane: CreepingAshLane): string[] {
  return lane.cells.map((c) => occKey(c.x, c.y));
}

describe("occupancyCreepingAshUnseal regressions", () => {
  it("seed-creeping-ash-raw-skips-portal: production floor raster never paints the gate", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawCreepingAshLanes(occupancy, player);
    assert.equal(
      raw.some((lane) =>
        lane.cells.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((lane) =>
        lane.cells.every(
          (c, i) => c.x === 4 + i && c.y === 0 && lane.heading.dx === 1,
        ),
      ),
      true,
      "a leftover 3-tile crumb is a legal raw lane",
    );
    assert.equal(CREEPING_ASH_LANE_LENGTH, 3);
  });

  it("seed-creeping-ash-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawCreepingAshLanes(occupancy, spawn);
    assert.equal(isCreepingAshSpawnClear(0, 0, spawn), true);
    assert.equal(isCreepingAshSpawnClear(3, 0, spawn), true);
    assert.equal(isCreepingAshSpawnClear(4, 0, spawn), false);
    assert.equal(CREEPING_ASH_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((lane) =>
        lane.cells.some((c) => isCreepingAshSpawnClear(c.x, c.y, spawn)),
      ),
      false,
      "raw lanes must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((lane) =>
        lane.cells.every(
          (c, i) => c.x === 4 + i && c.y === 0 && lane.heading.dx === 1,
        ),
      ),
      true,
      "a 3-tile floor outside spawn±3 is a legal raw lane",
    );
  });

  it("seed-creeping-ash-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawCreepingAshLanes(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isCreepingAshSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((lane) => lane.cells.some((c) => c.x === cx && c.y === cy)),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((lane) => lane.cells.some((c) => c.x === 0 && c.y === 0)),
      false,
      "the legalized spawn cell itself is skipped",
    );
    assert.equal(
      raw.some((lane) =>
        lane.cells.some((c) => occKey(c.x, c.y) === occKey(size - 1, 0)),
      ),
      false,
      "the corner portal is still skipped",
    );
  });

  it("seed-creeping-ash-through-portal-far-side: a 3-tile crumb snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 9, y: 0 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      dest.cells.every(
        (c) => !isOnCreepingAshBattleGraph(c, player, occupancy),
      ),
      true,
      "far crumb must start battle-isolated",
    );
    assert.equal(creepingAshUnreachable(player, dest, occupancy), true);
    const landed = legalizeCreepingAshLane(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(landed.cells.length, CREEPING_ASH_LANE_LENGTH);
    assert.equal(landed.heading.dx, 1);
    assert.equal(landed.heading.dy, 0);
    assert.equal(
      landed.cells.every((c) =>
        isOnCreepingAshBattleGraph(c, player, occupancy),
      ),
      true,
    );
    assert.notEqual(laneKeys(landed).join("/"), laneKeys(dest).join("/"));
    assert.equal(creepingAshUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][9], F, "must not punch or wall the leftover crumb");
  });

  it("seed-creeping-ash-on-unique-bridge: walkable tax stays on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 5, y: 1 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      dest.cells.every((c) => isOnCreepingAshBattleGraph(c, player, occupancy)),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(isCreepingAshSpawnClear(5, 1, player), false);
    const landed = legalizeCreepingAshLane(dest, player, occupancy);
    assert.ok(landed, "walkable tax must stay, unlike a walk-blocker pillar");
    assert.equal(laneKeys(landed).join("/"), laneKeys(dest).join("/"));
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-creeping-ash-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeCreepingAshLane(
      {
        cells: creepingAshLaneCells({ x: 9, y: 0 }, { dx: 1, dy: 0 }),
        heading: { dx: 1, dy: 0 },
      },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      landed.cells.every((c) =>
        isOnCreepingAshBattleGraph(c, player, occupancy),
      ),
      true,
    );
    assert.equal(laneKeys(landed).includes("9,0"), false);
    assert.equal(creepingAshUnreachable(player, landed, occupancy), false);
  });

  it("seed-creeping-ash-onto-void: a generation void is not a legal cloud cell", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 8, y: 0 }],
      [player],
      player,
      new Set(["5,1", "6,1", "7,1"]),
    );
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 5, y: 1 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    assert.equal(creepingAshUnreachable(player, dest, occupancy), true);
    const landed = legalizeCreepingAshLane(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      landed.cells.some((c) => occupancy.voidTiles.has(occKey(c.x, c.y))),
      false,
    );
    assert.equal(
      landed.cells.every((c) =>
        isOnCreepingAshBattleGraph(c, player, occupancy),
      ),
      true,
    );
  });

  it("seed-open-field-ash-noop: a fight-graph lane stays put", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 4, y: 0 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [player], player);
    const landed = legalizeCreepingAshLane(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(laneKeys(landed).join("/"), "4,0/5,0/6,0");
  });

  it("seed-creeping-ash-covers-player: destack off spawn±3 stays (walkable tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 1 };
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 4, y: 1 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isCreepingAshSpawnClear(5, 1, spawn), false);
    const landed = legalizeCreepingAshLane(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      landed.cells.some((c) => occKey(c.x, c.y) === occKey(player.x, player.y)),
      true,
      "covering a destacked player outside spawn±3 stays; walk-blockers snap off",
    );
  });

  it("seed-creeping-ash-occupied-stays: a fight-graph occupant is not a filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const rat = { x: 5, y: 0 };
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 4, y: 0 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, rat], player);
    const landed = legalizeCreepingAshLane(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(laneKeys(landed).join("/"), "4,0/5,0/6,0");
    assert.equal(occupancy.isOccupied(rat), true);
  });

  it("seed-creeping-ash-no-join-island: leftover dests must not punch a join", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dest: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 9, y: 0 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const landed = legalizeCreepingAshLane(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(tiles[0][8], P, "must not floor the portal choke");
    assert.equal(tiles[1][8], W, "must not punch a wall join");
    assert.equal(tiles[0][9], F);
  });

  it("seed-creeping-ash-only-portal: empty fight graph drops the cloud", () => {
    const tiles = [
      [W, W, W],
      [W, P, W],
      [W, W, W],
    ];
    const player = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 1, y: 1 }], [player], player);
    const battle = floodCreepingAshBattleGraph(player, occupancy);
    assert.equal(battle.size, 0);
    const landed = legalizeCreepingAshLane(
      {
        cells: creepingAshLaneCells({ x: 0, y: 0 }, { dx: 1, dy: 0 }),
        heading: { dx: 1, dy: 0 },
      },
      player,
      occupancy,
    );
    assert.equal(landed, null);
  });

  it("seed-creeping-ash-advance-onto-portal: round-start step stays off the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const lane: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 5, y: 0 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const lead = rawCreepingAshAdvanceLead(lane);
    assert.equal(occKey(lead.x, lead.y), "8,0");
    const next = legalizeCreepingAshAdvance(lane, player, occupancy);
    assert.equal(laneKeys(next).join("/"), "5,0/6,0/7,0");
    assert.equal(
      next.cells.some((c) => occupancy.portals.has(occKey(c.x, c.y))),
      false,
    );
  });

  it("seed-creeping-ash-advance-through-portal-far-side: drop the hop, do not park on the crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const lane: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 5, y: 0 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const advanced = creepingAshAdvanceCells(lane);
    assert.equal(
      laneKeys({ cells: advanced, heading: lane.heading }).join("/"),
      "6,0/7,0/8,0",
    );
    const next = legalizeCreepingAshAdvance(lane, player, occupancy);
    assert.equal(laneKeys(next).join("/"), "5,0/6,0/7,0");
    assert.equal(
      next.cells.some((c) => c.x >= 9),
      false,
      "advance must not hop the portal onto the leftover crumb",
    );
    assert.equal(tiles[0][9], F);
  });

  it("seed-creeping-ash-advance-on-unique-bridge: walkable tax does step along the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const lane: CreepingAshLane = {
      cells: creepingAshLaneCells({ x: 4, y: 1 }, { dx: 1, dy: 0 }),
      heading: { dx: 1, dy: 0 },
    };
    const next = legalizeCreepingAshAdvance(lane, player, occupancy);
    assert.equal(laneKeys(next).join("/"), "5,1/6,1/7,1");
    assert.equal(tiles[1][4], F);
  });

  it("seed-creeping-ash-count-three: extraHazardCount is a 3-cell contiguous run", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const lanes = rawCreepingAshLanes(occupancy, player);
    assert.ok(lanes.length > 0);
    for (const lane of lanes) {
      assert.equal(lane.cells.length, CREEPING_ASH_LANE_LENGTH);
      const [a, b, c] = lane.cells;
      assert.ok(a && b && c);
      assert.equal(b.x - a.x, lane.heading.dx);
      assert.equal(b.y - a.y, lane.heading.dy);
      assert.equal(c.x - b.x, lane.heading.dx);
      assert.equal(c.y - b.y, lane.heading.dy);
    }
    const picked = pickCreepingAshLane(lanes, () => 0);
    assert.ok(picked);
    assert.equal(picked.cells.length, 3);
  });
});

function assertCreepingAshOnWorld(
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
  const snapped = resolveCreepingAsh(player, occupancy, rng, undefined, spawn);
  const battle = floodCreepingAshBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} ash placed on an empty fight graph`;
    }
    return null;
  }
  if (!snapped) return null;
  if (snapped.cells.length !== CREEPING_ASH_LANE_LENGTH) {
    return `${label} lane length ${snapped.cells.length}`;
  }
  if (creepingAshUnreachable(player, snapped, occupancy)) {
    return `${label} creeping ash unreachable at ${laneKeys(snapped).join("/")}`;
  }
  const h = occupancy.tiles.length;
  const w = occupancy.tiles[0]?.length ?? 0;
  for (const cell of snapped.cells) {
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (isCreepingAshSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (!isOnCreepingAshBattleGraph(cell, player, occupancy)) {
      return `${label} ash misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
  }
  const keys = new Set(laneKeys(snapped));
  if (keys.size !== snapped.cells.length) {
    return `${label} stacked two ash cells`;
  }
  const advanced = resolveCreepingAshAdvance(snapped, player, occupancy, spawn);
  for (const cell of advanced.cells) {
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} advance sat on a portal at ${occKey(cell.x, cell.y)}`;
    }
    if (isCreepingAshSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} advance sat in spawn±3 at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnCreepingAshBattleGraph(cell, player, occupancy)) {
      return `${label} advance left the fight graph at ${occKey(cell.x, cell.y)}`;
    }
  }
  return null;
}

describe("occupancyCreepingAshUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack creeping-ash stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertCreepingAshOnWorld(
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

  it("corridorMaze wander creeping-ash stays on the fight graph", () => {
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
      const miss = assertCreepingAshOnWorld(
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

  it("chessboard destack creeping-ash stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertCreepingAshOnWorld(
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

  it("Boss Rush destack creeping-ash stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertCreepingAshOnWorld(
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

  it("rest-exit destack creeping-ash stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertCreepingAshOnWorld(
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

  it("keeps landings inside WORLD_GRID_SIZE", () => {
    const world = generateSeededWorld({ seed: 4242, runMode: "dungeon" });
    const occupancy = ctxFrom(
      world.tiles,
      world.portals,
      [world.playerSpawn, ...world.spawns],
      world.playerSpawn,
      world.voidTiles,
    );
    const snapped = resolveCreepingAsh(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    for (const landed of snapped.cells) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
