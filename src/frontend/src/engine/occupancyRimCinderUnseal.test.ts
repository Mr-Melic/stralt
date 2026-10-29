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
  RIM_CINDER_COUNT,
  RIM_CINDER_FEATURE_ID,
  RIM_CINDER_HP_TAX_PCT,
  RIM_CINDER_MIN_RIM,
  RIM_CINDER_MIN_SIZE,
  RIM_CINDER_SLIDE,
  RIM_CINDER_SPAWN_CLEAR,
  type RimCinder,
  cloneRimCinder,
  floodRimCinderBattleGraph,
  isOnRimCinderBattleGraph,
  isRimCinderSpawnClear,
  legalizeRimCinderAdvance,
  legalizeRimCinderPlacement,
  pickRimCinderCount,
  pickRimCinderRing,
  rawRimCinderAdvance,
  rawRimCinderRings,
  resolveRimCinder,
  resolveRimCinderAfterRoundStart,
  rimCinderCells,
  rimCinderInteriorCells,
  rimCinderIsOuterRing,
  rimCinderOrb,
  rimCinderRimLength,
  rimCinderRingKey,
  rimCinderRingUnreachable,
  rimCinderSlideManhattan,
  rimCinderUnreachable,
  rimCinderWraps,
} from "./occupancyRimCinderUnseal.ts";
import { type WorldFeature, extraHazardRoll } from "./worldFeatures.ts";

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

function orbKey(ring: RimCinder): string {
  return occKey(rimCinderOrb(ring).x, rimCinderOrb(ring).y);
}

function square3(origin: OccCell, index = 0): RimCinder {
  return {
    origin: { x: origin.x, y: origin.y },
    width: 3,
    height: 3,
    index,
  };
}

describe("occupancyRimCinderUnseal regressions", () => {
  it("seed-rim-cinder-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, P, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 2, y: 2 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawRimCinderRings(occupancy, player);
    assert.equal(
      raw.some((ring) =>
        rimCinderCells(ring).some(
          (cell) => occKey(cell.x, cell.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((ring) =>
        [...rimCinderCells(ring), ...rimCinderInteriorCells(ring)].some(
          (cell) => cell.x === 5 && cell.y === 5,
        ),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(RIM_CINDER_COUNT, 1);
    assert.equal(RIM_CINDER_MIN_SIZE, 3);
    assert.equal(RIM_CINDER_MIN_RIM, 8);
    assert.equal(RIM_CINDER_SLIDE, 1);
    assert.equal(RIM_CINDER_HP_TAX_PCT, 0.05);
    assert.equal(RIM_CINDER_FEATURE_ID, "WF-HAZ-RIM_CINDER");
    assert.equal(rimCinderRimLength(3, 3), 8);
    assert.equal(rimCinderRimLength(2, 2), 0);
  });

  it("seed-rim-cinder-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 7 }], [spawn], spawn);
    const raw = rawRimCinderRings(occupancy, spawn);
    assert.equal(isRimCinderSpawnClear(0, 0, spawn), true);
    assert.equal(isRimCinderSpawnClear(3, 3, spawn), true);
    assert.equal(isRimCinderSpawnClear(4, 0, spawn), false);
    assert.equal(RIM_CINDER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((ring) =>
        rimCinderCells(ring).some((cell) =>
          isRimCinderSpawnClear(cell.x, cell.y, spawn),
        ),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((ring) =>
        rimCinderCells(ring).some((cell) => cell.x === 6 && cell.y === 6),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-rim-cinder-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawRimCinderRings(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isRimCinderSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((ring) =>
        rimCinderCells(ring).some((cell) => cell.x === cx && cell.y === cy),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((ring) =>
        rimCinderCells(ring).some((cell) => cell.x === 0 && cell.y === 0),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-rim-cinder-extraHazardRoll-one: catalog min=max=1 plants one cinder", () => {
    const stub = {
      extraHazardCount: { min: 1, max: 1 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      1,
      "unlike Twin Sparks / Windrow band=2, Rim Cinder rides extraHazardRoll = 1",
    );
    assert.equal(pickRimCinderCount(), RIM_CINDER_COUNT);
  });

  it("seed-rim-cinder-through-portal-far-side: leftover 3×3 snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, F, F, W, F, F, F],
      [F, F, F, W, F, F, F],
      [F, F, F, W, F, F, F],
      [F, F, F, W, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = square3({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnRimCinderBattleGraph(dest.origin, player, occupancy),
      false,
      "far crumb origin must start battle-isolated",
    );
    assert.equal(rimCinderRingUnreachable(player, dest, occupancy), true);
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of rimCinderCells(landed)) {
      assert.equal(isOnRimCinderBattleGraph(cell, player, occupancy), true);
    }
    for (const cell of rimCinderInteriorCells(landed)) {
      assert.equal(isOnRimCinderBattleGraph(cell, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(rimCinderUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-rim-cinder-on-unique-bridge-1-wide-drops: a 1-wide cannot host a 3×3 rim", () => {
    const tiles = [
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, P, W],
    ];
    const player = { x: 1, y: 0 };
    const portal = { x: 1, y: 11 };
    const dest = square3({ x: 1, y: 5 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "Plumb Ember / Skipping Cinder would stay on this 1-wide; Rim Cinder needs interior",
    );
    assert.equal(tiles[5][1], F, "must not punch the unique corridor");
    assert.equal(tiles[5][0], W, "must not punch a west alcove");
  });

  it("seed-rim-cinder-on-unique-bridge-2-wide-drops: a 2-wide cannot host interior", () => {
    const tiles = [
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, F, W],
      [W, F, P, W],
    ];
    const player = { x: 1, y: 0 };
    const dest = square3({ x: 1, y: 5 });
    const occupancy = ctxFrom(tiles, [{ x: 2, y: 11 }], [player], player);
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "Windrow would stay on this 2-wide; Rim Cinder needs a 3×3 interior",
    );
    assert.equal(tiles[5][1], F, "must not punch the unique corridor");
    assert.equal(tiles[5][0], W, "must not punch a west alcove");
  });

  it("seed-rim-cinder-on-unique-bridge-3-wide-stays: a 3-wide of length ≥ 3 keeps the slide walkable", () => {
    const tiles = [
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, P, W],
    ];
    const player = { x: 1, y: 0 };
    const portal = { x: 3, y: 11 };
    const dest = square3({ x: 1, y: 5 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const walkBefore = floodRimCinderBattleGraph(player, occupancy).size;
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.ok(
      landed,
      "unlike Windrow's 2-wide, Rim Cinder fits a 3-wide of length ≥ 3",
    );
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      floodRimCinderBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const hopped = resolveRimCinderAfterRoundStart(landed, player, occupancy);
    const next = rawRimCinderAdvance(landed);
    assert.equal(orbKey(hopped), orbKey(next));
    assert.equal(
      floodRimCinderBattleGraph(player, occupancy).size,
      walkBefore,
      "slide is not a wall — Spent Bridge would cut the corridor",
    );
  });

  it("seed-rim-cinder-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRimCinderPlacement(
      square3({ x: 4, y: 1 }),
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnRimCinderBattleGraph(rimCinderOrb(landed), player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "4,1");
  });

  it("seed-rim-cinder-onto-void: a generation void is not a legal painted cell", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 9, y: 0 };
    const dest = square3({ x: 4, y: 2 });
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["5,3"]),
    );
    assert.equal(
      rawRimCinderRings(occupancy, player).some((ring) =>
        rimCinderCells(ring).some((cell) => occKey(cell.x, cell.y) === "5,3"),
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      rimCinderCells(landed).some((cell) => occKey(cell.x, cell.y) === "5,3"),
      false,
    );
    assert.equal(
      rimCinderInteriorCells(landed).some(
        (cell) => occKey(cell.x, cell.y) === "5,3",
      ),
      false,
    );
    for (const cell of rimCinderCells(landed)) {
      assert.equal(isOnRimCinderBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-open-field-rim-cinder-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = square3({ x: 4, y: 4 }, 2);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 7 }], [player], player);
    assert.equal(
      isRimCinderSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-rim-cinder-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 5 };
    const dest = square3({ x: 4, y: 4 });
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const landed = legalizeRimCinderPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    const covers = [
      ...rimCinderCells(landed),
      ...rimCinderInteriorCells(landed),
    ];
    assert.equal(
      covers.some(
        (cell) => occKey(cell.x, cell.y) === occKey(player.x, player.y),
      ),
      true,
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-rim-cinder-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 4 };
    const dest = square3({ x: 4, y: 4 });
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    assert.equal(
      isRimCinderSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      rimCinderCells(landed).some(
        (cell) => occKey(cell.x, cell.y) === occKey(boss.x, boss.y),
      ),
      true,
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(boss), true);
  });

  it("seed-rim-cinder-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, F, F, W, F, F, F],
      [F, F, F, W, F, F, F],
      [F, F, F, W, F, F, F],
      [F, F, F, W, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = square3({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnRimCinderBattleGraph(rimCinderOrb(landed), player, occupancy),
      true,
    );
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      tiles[5][5],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[1][4], F, "leftover crumb stays a floor island");
  });

  it("seed-rim-cinder-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveRimCinder(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodRimCinderBattleGraph(player, occupancy).size, 0);
    assert.equal(rawRimCinderRings(occupancy, player).length, 0);
  });

  it("seed-rim-cinder-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dest = square3({ x: 4, y: 1 });
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      isRimCinderSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
  });

  it("seed-rim-cinder-skips-existing: a second hazard roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const existing = new Set(["5,2"]);
    const raw = rawRimCinderRings(occupancy, player, existing);
    assert.equal(
      raw.some((ring) =>
        rimCinderCells(ring).some((cell) => occKey(cell.x, cell.y) === "5,2"),
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-rim-cinder-count-one-ring: catalog pick is one ≥ 3×3 rim, not Orbiting 2×2", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawRimCinderRings(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickRimCinderCount();
      assert.equal(count, RIM_CINDER_COUNT);
      const picked = pickRimCinderRing(raw, rng);
      if (!picked) continue;
      assert.equal(rimCinderIsOuterRing(picked), true);
      assert.ok(picked.width >= RIM_CINDER_MIN_SIZE);
      assert.ok(picked.height >= RIM_CINDER_MIN_SIZE);
      assert.ok(rimCinderCells(picked).length >= RIM_CINDER_MIN_RIM);
      assert.ok(rimCinderInteriorCells(picked).length >= 1);
      for (const cell of rimCinderCells(picked)) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isRimCinderSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-rim-cinder-not-orbiting-cinder-square: rim is a ≥ 3×3 perimeter, not a filled 2×2", () => {
    const dest = square3({ x: 4, y: 2 }, 0);
    assert.equal(rimCinderIsOuterRing(dest), true);
    const cells = rimCinderCells(dest);
    assert.equal(cells.length, 8);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size, 3);
    assert.equal(ys.size, 3);
    assert.equal(xs.size === 2 && ys.size === 2, false);
    assert.equal(rimCinderInteriorCells(dest).length, 1);
    assert.equal(rimCinderSlideManhattan(dest), 1);
  });

  it("seed-rim-cinder-not-plumb-ember-column: wrap is Manhattan 1, not a 4-tile south fall", () => {
    const dest = square3({ x: 4, y: 2 }, 7);
    assert.equal(rimCinderWraps(dest), true);
    assert.equal(
      rimCinderSlideManhattan(dest),
      1,
      "Plumb Ember wrap fall is Manhattan 3 on a 4-cell column",
    );
    const cells = rimCinderCells(dest);
    const xs = new Set(cells.map((c) => c.x));
    assert.equal(xs.size === 1, false);
    const hopped = rawRimCinderAdvance(dest);
    assert.equal(hopped.index, 0);
  });

  it("seed-rim-cinder-not-skip-cinder-hop-two: slide is one tile on ≥ 8 cells, not hop-two on five", () => {
    const dest = square3({ x: 4, y: 2 }, 0);
    assert.equal(rimCinderSlideManhattan(dest), 1);
    const cells = rimCinderCells(dest);
    assert.equal(cells.length, 8);
    assert.equal(rimCinderWraps(dest), false);
    const hopped = rawRimCinderAdvance(dest);
    assert.equal(hopped.index, 1, "Skip Cinder hop-2 from 0 lands on 2");
  });

  it("seed-rim-cinder-not-turnstile-plus: consecutive cells are Manhattan 1 including corners", () => {
    const dest = square3({ x: 4, y: 2 });
    const cells = rimCinderCells(dest);
    for (let i = 0; i < cells.length; i++) {
      const a = cells[i];
      const b = cells[(i + 1) % cells.length];
      assert.ok(a && b);
      assert.equal(Math.abs(a.x - b.x) + Math.abs(a.y - b.y), 1);
    }
    assert.equal(
      rimCinderSlideManhattan(dest),
      1,
      "Turnstile Ember consecutive arms are Manhattan 2 from a hollow center",
    );
    assert.equal(cells.length, 8);
  });

  it("seed-rim-cinder-not-windrow-2x2: painted run is a 3×3 perimeter, not a filled 2×2", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dest = square3({ x: 4, y: 2 });
    const landed = legalizeRimCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = rimCinderCells(landed);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.ok(xs.size >= 3);
    assert.ok(ys.size >= 3);
    assert.equal(xs.size === 2 && ys.size === 2, false);
    assert.equal(rimCinderIsOuterRing(landed), true);
    assert.ok(rimCinderInteriorCells(landed).length >= 1);
  });

  it("seed-rim-cinder-not-twin-sparks-line: one orb on eight rim cells, not two on a line", () => {
    const dest = square3({ x: 4, y: 2 }, 0);
    const before = orbKey(dest);
    const after = orbKey(rawRimCinderAdvance(dest));
    assert.equal(rimCinderCells(dest).length, 8);
    assert.notEqual(before, after);
    assert.equal(
      rimCinderSlideManhattan(dest),
      1,
      "Twin Sparks opposite orbs are Manhattan 2 on a 4-tile line with two bodies",
    );
  });

  it("seed-rim-cinder-not-pendulum-reverse: slide wraps instead of reversing at the end", () => {
    const atEnd = square3({ x: 4, y: 2 }, 7);
    const hopped = rawRimCinderAdvance(atEnd);
    assert.equal(atEnd.index, 7);
    assert.equal(
      hopped.index,
      0,
      "Pendulum at the last cell reverses instead of wrapping",
    );
    assert.equal(rimCinderWraps(atEnd), true);
    assert.equal(rimCinderWraps(square3({ x: 4, y: 2 }, 0)), false);
  });

  it("seed-rim-cinder-period-eight: eight +1 slides return to the start, unlike Orbiting's 4", () => {
    let ring = square3({ x: 4, y: 2 }, 0);
    const seen: number[] = [ring.index];
    for (let i = 0; i < 8; i++) {
      ring = rawRimCinderAdvance(ring);
      seen.push(ring.index);
    }
    assert.deepEqual(seen, [0, 1, 2, 3, 4, 5, 6, 7, 0]);
    assert.equal(ring.index, 0);
  });

  it("seed-rim-cinder-interior-unmarked: the live orb never sits on interior floor", () => {
    const dest = square3({ x: 4, y: 2 }, 0);
    const interior = new Set(
      rimCinderInteriorCells(dest).map((c) => occKey(c.x, c.y)),
    );
    assert.equal(interior.size, 1);
    assert.equal(interior.has("5,3"), true);
    let ring = dest;
    for (let i = 0; i < 8; i++) {
      assert.equal(interior.has(orbKey(ring)), false);
      ring = rawRimCinderAdvance(ring);
    }
  });

  it("seed-rim-cinder-not-creeping-ash-three: slide does not translate the painted window", () => {
    const dest = square3({ x: 4, y: 2 }, 0);
    const before = rimCinderCells(dest).map((c) => occKey(c.x, c.y));
    const after = rimCinderCells(rawRimCinderAdvance(dest)).map((c) =>
      occKey(c.x, c.y),
    );
    assert.deepEqual(before, after, "Creeping Ash slides the painted window");
    assert.equal(before.length, 8);
    assert.notEqual(orbKey(dest), orbKey(rawRimCinderAdvance(dest)));
  });

  it("seed-rim-cinder-first-round-clockwise: round start slides index 0 onto index 1 (east)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = square3({ x: 4, y: 2 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawRimCinderAdvance(dest);
    assert.equal(raw.index, 1);
    assert.equal(orbKey(raw), "5,2");
    const hopped = resolveRimCinderAfterRoundStart(dest, player, occupancy);
    assert.equal(orbKey(hopped), "5,2");
  });

  it("seed-rim-cinder-slide-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = square3({ x: 6, y: 0 }, 1);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(orbKey(rawRimCinderAdvance(dest)), occKey(portal.x, portal.y));
    const action = legalizeRimCinderAdvance(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const hopped = resolveRimCinderAfterRoundStart(dest, player, occupancy);
    assert.equal(orbKey(hopped), orbKey(dest));
  });

  it("seed-rim-cinder-slide-through-portal-far-side: leftover next cell stays painted", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = square3({ x: 4, y: 1 }, 0);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnRimCinderBattleGraph(dest.origin, player, occupancy),
      false,
    );
    const action = legalizeRimCinderAdvance(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[2][4], F, "must not punch the leftover crumb");
  });

  it("seed-rim-cinder-slide-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = square3({ x: 4, y: 1 }, 0);
    const occupancy = ctxFrom(
      tiles,
      [{ x: 8, y: 0 }],
      [player],
      player,
      new Set(["5,1"]),
    );
    assert.equal(orbKey(rawRimCinderAdvance(dest)), "5,1");
    const action = legalizeRimCinderAdvance(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-rim-cinder-slide-on-3-wide: walkable slide still fires", () => {
    const tiles = [
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, F, W],
      [W, F, F, P, W],
    ];
    const player = { x: 1, y: 0 };
    const dest = square3({ x: 1, y: 5 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 11 }], [player], player);
    const action = legalizeRimCinderAdvance(dest, player, occupancy);
    assert.equal(action.kind, "slide");
    if (action.kind === "slide") {
      assert.equal(orbKey(action.ring), "2,5");
    }
  });

  it("seed-rim-cinder-occupied-slide-lands: occupied next cell still slides (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 2 };
    const dest = square3({ x: 4, y: 2 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const action = legalizeRimCinderAdvance(dest, player, occupancy);
    assert.equal(
      action.kind,
      "slide",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "slide") {
      assert.equal(orbKey(action.ring), occKey(boss.x, boss.y));
    }
  });

  it("seed-rim-cinder-clone-keeps-orientation: stay copies do not alias", () => {
    const dest = square3({ x: 4, y: 2 }, 0);
    const copy = cloneRimCinder(dest);
    copy.origin.x = 9;
    copy.index = 3;
    copy.width = 5;
    copy.height = 4;
    assert.equal(dest.origin.x, 4);
    assert.equal(dest.index, 0);
    assert.equal(dest.width, 3);
    assert.equal(dest.height, 3);
  });

  it("seed-rim-cinder-ring-key-is-origin-size: two indices share one painted ring", () => {
    const a = square3({ x: 5, y: 2 }, 0);
    const b = square3({ x: 5, y: 2 }, 4);
    assert.equal(rimCinderRingKey(a), rimCinderRingKey(b));
  });
});

function assertRimCinderOnWorld(
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
  const snapped = resolveRimCinder(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodRimCinderBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} Rim Cinder placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodRimCinderBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Rim Cinder shrunk the walk flood at plant`;
  }
  if (!snapped) return null;
  if (rimCinderUnreachable(player, snapped, occupancy)) {
    return `${label} Rim Cinder unreachable at ${occKey(snapped.origin.x, snapped.origin.y)}`;
  }
  if (!rimCinderIsOuterRing(snapped)) {
    return `${label} dest is not a ≥ 3×3 outer rim`;
  }
  const slideManhattan = rimCinderSlideManhattan(snapped);
  if (slideManhattan !== 1) {
    return `${label} slide Manhattan is ${slideManhattan}, want 1`;
  }
  for (const cell of rimCinderCells(snapped)) {
    if (!isOnRimCinderBattleGraph(cell, player, occupancy)) {
      return `${label} cell misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (isRimCinderSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
  }
  for (const cell of rimCinderInteriorCells(snapped)) {
    if (!isOnRimCinderBattleGraph(cell, player, occupancy)) {
      return `${label} interior misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
  }
  const hopped = resolveRimCinderAfterRoundStart(
    snapped,
    player,
    occupancy,
    spawn,
  );
  if (!isOnRimCinderBattleGraph(rimCinderOrb(hopped), player, occupancy)) {
    return `${label} slide left the fight graph at ${orbKey(hopped)}`;
  }
  if (floodRimCinderBattleGraph(player, occupancy).size !== walkBefore) {
    return `${label} slide shrunk the walk flood`;
  }
  return null;
}

describe("occupancyRimCinderUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Rim Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRimCinderOnWorld(
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

  it("corridorMaze wander Rim Cinder stays on the fight graph", () => {
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
      const miss = assertRimCinderOnWorld(
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

  it("chessboard destack Rim Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRimCinderOnWorld(
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

  it("Boss Rush destack Rim Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRimCinderOnWorld(
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

  it("rest-exit destack Rim Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertRimCinderOnWorld(
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
    const snapped = resolveRimCinder(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (snapped) {
      for (const cell of rimCinderCells(snapped)) {
        assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
        assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
      }
    }
  });
});
