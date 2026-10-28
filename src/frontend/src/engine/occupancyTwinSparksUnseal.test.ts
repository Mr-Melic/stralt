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
  TWIN_SPARK_COUNT,
  TWIN_SPARK_FEATURE_ID,
  TWIN_SPARK_HP_TAX_PCT,
  TWIN_SPARK_LINE_SIZE,
  TWIN_SPARK_ORB_COUNT,
  TWIN_SPARK_SPAWN_CLEAR,
  type TwinSparkLine,
  cloneTwinSparkLine,
  floodTwinSparkBattleGraph,
  isOnTwinSparkBattleGraph,
  isTwinSparkSpawnClear,
  legalizeTwinSparkPlacement,
  legalizeTwinSparkSwap,
  pickTwinSparkCount,
  pickTwinSparkLines,
  rawTwinSparkLines,
  rawTwinSparkSwap,
  resolveTwinSparks,
  resolveTwinSparksAfterRoundStart,
  twinSparkCells,
  twinSparkEmpty,
  twinSparkIsLineNotSquare,
  twinSparkLineKey,
  twinSparkLineUnreachable,
  twinSparkOppositeManhattan,
  twinSparkOrbs,
  twinSparkUnreachable,
} from "./occupancyTwinSparksUnseal.ts";
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

function lineKeyOrbs(line: TwinSparkLine): string[] {
  return twinSparkOrbs(line).map((cell) => occKey(cell.x, cell.y));
}

describe("occupancyTwinSparksUnseal regressions", () => {
  it("seed-twin-sparks-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawTwinSparkLines(occupancy, player);
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some(
          (cell) => occKey(cell.x, cell.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some((cell) => cell.x === 7 && cell.y === 1),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(TWIN_SPARK_COUNT, 1);
    assert.equal(TWIN_SPARK_LINE_SIZE, 4);
    assert.equal(TWIN_SPARK_ORB_COUNT, 2);
    assert.equal(TWIN_SPARK_HP_TAX_PCT, 0.05);
    assert.equal(TWIN_SPARK_FEATURE_ID, "WF-HAZ-TWIN_SPARK");
  });

  it("seed-twin-sparks-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 3 }], [spawn], spawn);
    const raw = rawTwinSparkLines(occupancy, spawn);
    assert.equal(isTwinSparkSpawnClear(0, 0, spawn), true);
    assert.equal(isTwinSparkSpawnClear(3, 0, spawn), true);
    assert.equal(isTwinSparkSpawnClear(4, 0, spawn), false);
    assert.equal(TWIN_SPARK_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some((cell) =>
          isTwinSparkSpawnClear(cell.x, cell.y, spawn),
        ),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some((cell) => cell.x === 5 && cell.y === 1),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-twin-sparks-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawTwinSparkLines(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isTwinSparkSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some((cell) => cell.x === cx && cell.y === cy),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some((cell) => cell.x === 0 && cell.y === 0),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-twin-sparks-extraHazardRoll-two: catalog min=max=2 plants two orbs", () => {
    const stub = {
      extraHazardCount: { min: 2, max: 2 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      2,
      "unlike Turnstile Ember band=1, Twin Sparks rides extraHazardRoll = 2",
    );
    assert.equal(pickTwinSparkCount(), TWIN_SPARK_COUNT);
  });

  it("seed-twin-sparks-through-portal-far-side: leftover line snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 5, y: 1 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnTwinSparkBattleGraph(dest.origin, player, occupancy),
      false,
      "far crumb origin must start battle-isolated",
    );
    assert.equal(twinSparkLineUnreachable(player, dest, occupancy), true);
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of twinSparkCells(landed)) {
      assert.equal(isOnTwinSparkBattleGraph(cell, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(twinSparkUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the leftover crumb");
  });

  it("seed-twin-sparks-on-unique-bridge: walkable line stays on the 1-wide", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest: TwinSparkLine = {
      origin: { x: 5, y: 1 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const walkBefore = floodTwinSparkBattleGraph(player, occupancy).size;
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed, "walkable unique-corridor line must stay");
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike Turnstile Ember, a 1-wide Twin Sparks line stays",
    );
    assert.equal(
      floodTwinSparkBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const swapped = resolveTwinSparksAfterRoundStart(landed, player, occupancy);
    const next = rawTwinSparkSwap(landed);
    assert.deepEqual(lineKeyOrbs(swapped).sort(), lineKeyOrbs(next).sort());
    assert.equal(
      floodTwinSparkBattleGraph(player, occupancy).size,
      walkBefore,
      "swap is not a wall — Shift Slab would cut the corridor",
    );
  });

  it("seed-twin-sparks-on-unique-bridge-too-short-drops: 8-wide 1-wide cannot host four cells outside spawn±3", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "cells 4..7 collide with the gate; spawn±3 eats 0..3",
    );
    assert.equal(tiles[1][4], F, "must not punch the unique corridor");
    assert.equal(tiles[0][4], W, "must not punch a north alcove");
  });

  it("seed-twin-sparks-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, W, W, W, F, F, F, F, F],
      [F, W, W, W, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTwinSparkPlacement(
      { origin: { x: 5, y: 1 }, axis: "h", phase: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    for (const orb of twinSparkOrbs(landed)) {
      assert.equal(isOnTwinSparkBattleGraph(orb, player, occupancy), true);
    }
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "5,1");
  });

  it("seed-twin-sparks-onto-void: a generation void is not a legal painted cell", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["7,2"]),
    );
    assert.equal(
      rawTwinSparkLines(occupancy, player).some((line) =>
        twinSparkCells(line).some((cell) => occKey(cell.x, cell.y) === "7,2"),
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      twinSparkCells(landed).some((cell) => occKey(cell.x, cell.y) === "7,2"),
      false,
    );
    for (const cell of twinSparkCells(landed)) {
      assert.equal(isOnTwinSparkBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-open-field-twin-sparks-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 3, y: 4 },
      axis: "h",
      phase: 1,
    };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 6 }], [player], player);
    assert.equal(
      isTwinSparkSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-twin-sparks-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 2 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const landed = legalizeTwinSparkPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      lineKeyOrbs(landed).includes(occKey(player.x, player.y)),
      true,
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-twin-sparks-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 2 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    assert.equal(
      isTwinSparkSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      lineKeyOrbs(landed).includes(occKey(boss.x, boss.y)),
      true,
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(boss), true);
  });

  it("seed-twin-sparks-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 5, y: 1 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const orb of twinSparkOrbs(landed)) {
      assert.equal(isOnTwinSparkBattleGraph(orb, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      tiles[3][5],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[1][5], F, "leftover crumb stays a floor island");
  });

  it("seed-twin-sparks-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveTwinSparks(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodTwinSparkBattleGraph(player, occupancy).size, 0);
    assert.equal(rawTwinSparkLines(occupancy, player).length, 0);
  });

  it("seed-twin-sparks-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      isTwinSparkSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
  });

  it("seed-twin-sparks-skips-existing: a second hazard roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["5,1"]);
    const raw = rawTwinSparkLines(occupancy, player, existing);
    assert.equal(
      raw.some((line) =>
        twinSparkCells(line).some((cell) => occKey(cell.x, cell.y) === "5,1"),
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-twin-sparks-count-one-line: catalog pick is one 4-tile line, not Pendulum 5", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const raw = rawTwinSparkLines(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickTwinSparkCount();
      assert.equal(count, TWIN_SPARK_COUNT);
      const picked = pickTwinSparkLines(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const line of picked) {
        assert.equal(twinSparkIsLineNotSquare(line), true);
        assert.equal(twinSparkCells(line).length, 4);
        assert.equal(twinSparkOrbs(line).length, 2);
        for (const cell of twinSparkCells(line)) {
          assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
          assert.equal(isTwinSparkSpawnClear(cell.x, cell.y, player), false);
        }
      }
    }
  });

  it("seed-twin-sparks-not-orbiting-cinder-square: painted run is collinear", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = twinSparkCells(landed);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(
      xs.size === 1 || ys.size === 1,
      true,
      "Orbiting Cinder consecutive square corners span both axes",
    );
    assert.equal(twinSparkIsLineNotSquare(landed), true);
    assert.equal(twinSparkOrbs(landed).length, 2);
  });

  it("seed-twin-sparks-not-ratchet-cog-pair: opposite orbs are Manhattan 2", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(twinSparkCells(landed).length, TWIN_SPARK_LINE_SIZE);
    assert.equal(twinSparkOrbs(landed).length, TWIN_SPARK_ORB_COUNT);
    assert.equal(
      twinSparkOppositeManhattan(landed),
      2,
      "Ratchet Cog adjacent cells are Manhattan 1",
    );
  });

  it("seed-twin-sparks-not-turnstile-plus: line is not a 4-arm plus", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    const xs = new Set(twinSparkCells(landed).map((cell) => cell.x));
    const ys = new Set(twinSparkCells(landed).map((cell) => cell.y));
    assert.equal(
      xs.size === 1 || ys.size === 1,
      true,
      "Turnstile Ember painted arms span both axes around a hollow",
    );
  });

  it("seed-twin-sparks-not-gutter-steam-vents: swap hops, it does not jet in place", () => {
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const before = new Set(lineKeyOrbs(dest));
    const after = new Set(lineKeyOrbs(rawTwinSparkSwap(dest)));
    assert.equal(
      [...before].every((k) => after.has(k)),
      false,
      "Gutter Steam even/odd vents stay on the same two cells",
    );
    assert.equal(twinSparkEmpty(dest).length, 2);
  });

  it("seed-twin-sparks-not-windrow-bar: painted run is a line, not a 2×2 pair hop", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const landed = legalizeTwinSparkPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = twinSparkCells(landed);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(
      xs.size === 1 || ys.size === 1,
      true,
      "Windrow hops a 2-tile bar onto a parallel pair (both axes)",
    );
  });

  it("seed-twin-sparks-first-round-swap: round start hops even pair onto odd pair", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const raw = rawTwinSparkSwap(dest);
    assert.equal(raw.phase, 1);
    assert.deepEqual(lineKeyOrbs(raw).sort(), ["5,2", "7,2"]);
    const swapped = resolveTwinSparksAfterRoundStart(dest, player, occupancy);
    assert.deepEqual(lineKeyOrbs(swapped).sort(), ["5,2", "7,2"]);
  });

  it("seed-twin-sparks-swap-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 7, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 0 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const action = legalizeTwinSparkSwap(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const swapped = resolveTwinSparksAfterRoundStart(dest, player, occupancy);
    assert.deepEqual(lineKeyOrbs(swapped).sort(), lineKeyOrbs(dest).sort());
  });

  it("seed-twin-sparks-swap-through-portal-far-side: leftover next pair stays painted", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 0 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnTwinSparkBattleGraph(dest.origin, player, occupancy),
      false,
    );
    const action = legalizeTwinSparkSwap(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[0][5], F, "must not punch the leftover crumb");
  });

  it("seed-twin-sparks-swap-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 1 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 7, y: 0 }],
      [player],
      player,
      new Set(["7,1"]),
    );
    const action = legalizeTwinSparkSwap(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-twin-sparks-swap-on-unique-bridge: walkable hop still fires", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest: TwinSparkLine = {
      origin: { x: 5, y: 1 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const action = legalizeTwinSparkSwap(dest, player, occupancy);
    assert.equal(action.kind, "swap");
    if (action.kind === "swap") {
      assert.deepEqual(lineKeyOrbs(action.line).sort(), ["6,1", "8,1"]);
    }
  });

  it("seed-twin-sparks-occupied-swap-lands: occupied next pair still swaps (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 2 };
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const action = legalizeTwinSparkSwap(dest, player, occupancy);
    assert.equal(
      action.kind,
      "swap",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "swap") {
      assert.equal(
        lineKeyOrbs(action.line).includes(occKey(boss.x, boss.y)),
        true,
      );
    }
  });

  it("seed-twin-sparks-clone-keeps-orientation: stay copies do not alias", () => {
    const dest: TwinSparkLine = {
      origin: { x: 4, y: 2 },
      axis: "h",
      phase: 0,
    };
    const copy = cloneTwinSparkLine(dest);
    copy.origin.x = 9;
    copy.phase = 1;
    copy.axis = "v";
    assert.equal(dest.origin.x, 4);
    assert.equal(dest.phase, 0);
    assert.equal(dest.axis, "h");
  });

  it("seed-twin-sparks-line-key-is-origin-axis: two phases share one line", () => {
    const a: TwinSparkLine = {
      origin: { x: 5, y: 2 },
      axis: "h",
      phase: 0,
    };
    const b: TwinSparkLine = {
      origin: { x: 5, y: 2 },
      axis: "h",
      phase: 1,
    };
    assert.equal(twinSparkLineKey(a), twinSparkLineKey(b));
  });
});

function assertTwinSparksOnWorld(
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
  const snapped = resolveTwinSparks(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodTwinSparkBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} sparks placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodTwinSparkBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Twin Sparks shrunk the walk flood at plant`;
  }
  for (const line of snapped) {
    if (twinSparkUnreachable(player, line, occupancy)) {
      return `${label} Twin Sparks unreachable at ${occKey(line.origin.x, line.origin.y)}`;
    }
    if (!twinSparkIsLineNotSquare(line)) {
      return `${label} dest is not a 4-tile line`;
    }
    if (twinSparkOppositeManhattan(line) !== 2) {
      return `${label} opposite orbs are not Manhattan 2`;
    }
    for (const cell of twinSparkCells(line)) {
      if (!isOnTwinSparkBattleGraph(cell, player, occupancy)) {
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
      if (isTwinSparkSpawnClear(cell.x, cell.y, spawn)) {
        return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
      }
    }
    const swapped = resolveTwinSparksAfterRoundStart(
      line,
      player,
      occupancy,
      spawn,
    );
    for (const orb of twinSparkOrbs(swapped)) {
      if (!isOnTwinSparkBattleGraph(orb, player, occupancy)) {
        return `${label} swap left the fight graph at ${occKey(orb.x, orb.y)}`;
      }
    }
    if (floodTwinSparkBattleGraph(player, occupancy).size !== walkBefore) {
      return `${label} swap shrunk the walk flood`;
    }
  }
  const keys = new Set(snapped.map((line) => twinSparkLineKey(line)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two Twin Sparks on one line`;
  }
  return null;
}

describe("occupancyTwinSparksUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Twin Sparks stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTwinSparksOnWorld(
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

  it("corridorMaze wander Twin Sparks stays on the fight graph", () => {
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
      const miss = assertTwinSparksOnWorld(
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

  it("chessboard destack Twin Sparks stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTwinSparksOnWorld(
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

  it("Boss Rush destack Twin Sparks stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTwinSparksOnWorld(
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

  it("rest-exit destack Twin Sparks stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertTwinSparksOnWorld(
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
    const snapped = resolveTwinSparks(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const line of snapped) {
      for (const cell of twinSparkCells(line)) {
        assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
        assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
      }
    }
    assert.ok(snapped.length <= TWIN_SPARK_COUNT);
  });
});
