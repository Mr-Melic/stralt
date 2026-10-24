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
  EMBER_VEIN_COUNT_MAX,
  EMBER_VEIN_COUNT_MIN,
  EMBER_VEIN_SPAWN_CLEAR,
  emberVeinUnreachable,
  floodEmberVeinBattleGraph,
  isEmberVeinSpawnClear,
  isOnEmberVeinBattleGraph,
  legalizeEmberVeinPlacement,
  legalizeEmberVeinPlacements,
  pickEmberVeinCount,
  pickEmberVeinDests,
  rawEmberVeinDests,
  resolveEmberVein,
} from "./occupancyEmberVeinUnseal.ts";

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

describe("occupancyEmberVeinUnseal regressions", () => {
  it("seed-ember-vein-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawEmberVeinDests(occupancy, player);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((c) => c.x === 6 && c.y === 0),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(EMBER_VEIN_COUNT_MIN, 3);
    assert.equal(EMBER_VEIN_COUNT_MAX, 6);
  });

  it("seed-ember-vein-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawEmberVeinDests(occupancy, spawn);
    assert.equal(isEmberVeinSpawnClear(0, 0, spawn), true);
    assert.equal(isEmberVeinSpawnClear(3, 0, spawn), true);
    assert.equal(isEmberVeinSpawnClear(4, 0, spawn), false);
    assert.equal(EMBER_VEIN_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isEmberVeinSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-ember-vein-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawEmberVeinDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isEmberVeinSpawnClear(cx, cy, spawn),
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

  it("seed-ember-vein-through-portal-far-side: one floor hop parks the tax on a crumb", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 5, y: 0 };
    const dest = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnEmberVeinBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(emberVeinUnreachable(player, [dest], occupancy), true);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnEmberVeinBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(emberVeinUnreachable(player, [landed], occupancy), false);
    assert.equal(isEmberVeinSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-ember-vein-on-unique-bridge: walkable tax may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnEmberVeinBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    assert.equal(isEmberVeinSpawnClear(5, 1, player), false);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor Ember Vein stays — it is a walkable tax",
    );
    assert.equal(emberVeinUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-ember-vein-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeEmberVeinPlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnEmberVeinBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(emberVeinUnreachable(player, [landed], occupancy), false);
  });

  it("seed-ember-vein-onto-void: a generation void is not a steppable tax", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 7, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["5,0"]),
    );
    assert.equal(
      rawEmberVeinDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(emberVeinUnreachable(player, [dest], occupancy), true);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnEmberVeinBattleGraph(landed, player, occupancy), true);
    assert.equal(emberVeinUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-ember-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 5, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 4 }], [player], player);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(emberVeinUnreachable(player, [landed!], occupancy), false);
  });

  it("seed-ember-vein-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isEmberVeinSpawnClear(5, 0, spawn), false);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(emberVeinUnreachable(player, [landed], occupancy), false);
  });

  it("seed-ember-vein-snaps-off-spawn-diamond: catalog never taxes spawn±3", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const dest = { x: 1, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [spawn], spawn);
    assert.equal(isEmberVeinSpawnClear(1, 0, spawn), true);
    const landed = legalizeEmberVeinPlacement(dest, spawn, occupancy, spawn);
    assert.ok(landed);
    assert.equal(isEmberVeinSpawnClear(landed.x, landed.y, spawn), false);
    assert.equal(isOnEmberVeinBattleGraph(landed, spawn, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
  });

  it("seed-ember-vein-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(isOnEmberVeinBattleGraph(landed, player, occupancy), true);
  });

  it("seed-ember-vein-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, F, F, P, W, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const dest = { x: 7, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnEmberVeinBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(emberVeinUnreachable(player, [dest], occupancy), true);
    const landed = legalizeEmberVeinPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnEmberVeinBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(emberVeinUnreachable(player, [landed], occupancy), false);
  });

  it("seed-ember-vein-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveEmberVein(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodEmberVeinBattleGraph(player, occupancy).size, 0);
    assert.equal(emberVeinUnreachable(player, snapped, occupancy), true);
    assert.equal(rawEmberVeinDests(occupancy, player).length, 0);
  });

  it("seed-ember-vein-triple-far: three leftover dests snap without stacking", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const dests = [
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
    ];
    const landed = legalizeEmberVeinPlacements(dests, player, occupancy);
    assert.equal(landed.length, 3);
    const keys = new Set(landed.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, 3, "snapped veins must not collapse onto one cell");
    for (const cell of landed) {
      assert.equal(isOnEmberVeinBattleGraph(cell, player, occupancy), true);
      assert.equal(isEmberVeinSpawnClear(cell.x, cell.y, player), false);
    }
    assert.equal(emberVeinUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][6], F);
  });

  it("seed-ember-vein-independent-dests: picks are not a contiguous 3-tile lane", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dests = [
      { x: 4, y: 0 },
      { x: 7, y: 0 },
      { x: 4, y: 2 },
    ];
    const landed = legalizeEmberVeinPlacements(dests, player, occupancy);
    assert.equal(landed.length, 3);
    const manhattan = (a: OccCell, b: OccCell) =>
      Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    const adjacentPairs = [
      manhattan(landed[0]!, landed[1]!),
      manhattan(landed[1]!, landed[2]!),
      manhattan(landed[0]!, landed[2]!),
    ].filter((d) => d === 1).length;
    assert.equal(
      adjacentPairs < 2,
      true,
      "unlike Creeping Ash, Ember Vein dests need not form one orthogonal run",
    );
  });

  it("seed-ember-vein-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawEmberVeinDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawEmberVeinDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-ember-vein-count-three-to-six: catalog pick is 3–6 independent cells", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawEmberVeinDests(occupancy, player);
    const seenCounts = new Set<number>();
    for (let seed = 0; seed < 64; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickEmberVeinCount(rng);
      assert.ok(count >= EMBER_VEIN_COUNT_MIN);
      assert.ok(count <= EMBER_VEIN_COUNT_MAX);
      seenCounts.add(count);
      const picked = pickEmberVeinDests(raw, rng, count);
      assert.ok(picked.length >= 1);
      assert.ok(picked.length <= count);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isEmberVeinSpawnClear(cell.x, cell.y, player), false);
      }
    }
    assert.equal(seenCounts.has(EMBER_VEIN_COUNT_MIN), true);
    assert.equal(seenCounts.has(EMBER_VEIN_COUNT_MAX), true);
    assert.ok(seenCounts.size >= 3, "rng must visit more than two vein counts");
  });
});

function assertEmberVeinOnWorld(
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
  const raw = rawEmberVeinDests(occupancy, spawn);
  const snapped = resolveEmberVein(player, occupancy, rng, undefined, spawn);
  const battle = floodEmberVeinBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} vein placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = [...battle].some((k) => {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    return (
      !occupancy.portals.has(k) &&
      !isEmberVeinSpawnClear(x, y, spawn) &&
      !occupancy.voidTiles.has(k)
    );
  });
  if (raw.length > 0 && hostable && snapped.length === 0) {
    return `${label} dropped every vein even though the fight graph is nonempty`;
  }
  for (const cell of snapped) {
    if (emberVeinUnreachable(player, [cell], occupancy)) {
      return `${label} Ember Vein unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnEmberVeinBattleGraph(cell, player, occupancy)) {
      return `${label} vein misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isEmberVeinSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two veins on one cell`;
  }
  return null;
}

describe("occupancyEmberVeinUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Ember Vein stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertEmberVeinOnWorld(
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

  it("corridorMaze wander Ember Vein stays on the fight graph", () => {
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
      const miss = assertEmberVeinOnWorld(
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

  it("chessboard destack Ember Vein stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertEmberVeinOnWorld(
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

  it("Boss Rush destack Ember Vein stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertEmberVeinOnWorld(
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

  it("rest-exit destack Ember Vein stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertEmberVeinOnWorld(
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
    const snapped = resolveEmberVein(
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
