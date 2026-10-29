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
  WINDROW_BAR_SIZE,
  WINDROW_COUNT,
  WINDROW_FEATURE_ID,
  WINDROW_HP_TAX_PCT,
  WINDROW_RECT_SIZE,
  WINDROW_SPAWN_CLEAR,
  type WindrowRect,
  cloneWindrowRect,
  floodWindrowBattleGraph,
  isOnWindrowBattleGraph,
  isWindrowSpawnClear,
  legalizeWindrowHop,
  legalizeWindrowPlacement,
  pickWindrowCount,
  pickWindrowRects,
  rawWindrowHop,
  rawWindrowRects,
  resolveWindrow,
  resolveWindrowAfterRoundStart,
  windrowBar,
  windrowBarManhattan,
  windrowCells,
  windrowEmpty,
  windrowHopManhattan,
  windrowIsRectNotLine,
  windrowRectKey,
  windrowRectUnreachable,
  windrowUnreachable,
} from "./occupancyWindrowUnseal.ts";
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

function barKeys(rect: WindrowRect): string[] {
  return windrowBar(rect).map((cell) => occKey(cell.x, cell.y));
}

describe("occupancyWindrowUnseal regressions", () => {
  it("seed-windrow-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawWindrowRects(occupancy, player);
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some(
          (cell) => occKey(cell.x, cell.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some((cell) => cell.x === 7 && cell.y === 1),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(WINDROW_COUNT, 1);
    assert.equal(WINDROW_RECT_SIZE, 4);
    assert.equal(WINDROW_BAR_SIZE, 2);
    assert.equal(WINDROW_HP_TAX_PCT, 0.05);
    assert.equal(WINDROW_FEATURE_ID, "WF-HAZ-WINDROW");
  });

  it("seed-windrow-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 3 }], [spawn], spawn);
    const raw = rawWindrowRects(occupancy, spawn);
    assert.equal(isWindrowSpawnClear(0, 0, spawn), true);
    assert.equal(isWindrowSpawnClear(3, 0, spawn), true);
    assert.equal(isWindrowSpawnClear(4, 0, spawn), false);
    assert.equal(WINDROW_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some((cell) =>
          isWindrowSpawnClear(cell.x, cell.y, spawn),
        ),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some((cell) => cell.x === 5 && cell.y === 1),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-windrow-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawWindrowRects(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isWindrowSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some((cell) => cell.x === cx && cell.y === cy),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some((cell) => cell.x === 0 && cell.y === 0),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-windrow-extraHazardRoll-two: catalog min=max=2 plants two bar cells", () => {
    const stub = {
      extraHazardCount: { min: 2, max: 2 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      2,
      "unlike Turnstile Ember band=1, Windrow rides extraHazardRoll = 2",
    );
    assert.equal(pickWindrowCount(), WINDROW_COUNT);
  });

  it("seed-windrow-through-portal-far-side: leftover 2×2 snaps onto the fight graph", () => {
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
    const dest: WindrowRect = {
      origin: { x: 5, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnWindrowBattleGraph(dest.origin, player, occupancy),
      false,
      "far crumb origin must start battle-isolated",
    );
    assert.equal(windrowRectUnreachable(player, dest, occupancy), true);
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of windrowCells(landed)) {
      assert.equal(isOnWindrowBattleGraph(cell, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(windrowUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the leftover crumb");
  });

  it("seed-windrow-on-unique-bridge-1-wide-drops: a 1-wide cannot host a 2×2", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest: WindrowRect = {
      origin: { x: 5, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "unlike Twin Sparks, Windrow needs both axes — a 1-wide drops",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
    assert.equal(tiles[0][5], W, "must not punch a north alcove");
  });

  it("seed-windrow-on-2-wide-stays: a 2-wide pocket keeps the bar walkable", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest: WindrowRect = {
      origin: { x: 5, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const walkBefore = floodWindrowBattleGraph(player, occupancy).size;
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed, "walkable 2-wide Windrow must stay");
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      floodWindrowBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const hopped = resolveWindrowAfterRoundStart(landed, player, occupancy);
    const next = rawWindrowHop(landed);
    assert.deepEqual(barKeys(hopped).sort(), barKeys(next).sort());
    assert.equal(
      floodWindrowBattleGraph(player, occupancy).size,
      walkBefore,
      "hop is not a wall — Shift Slab would cut the corridor",
    );
  });

  it("seed-windrow-corridor-8: 1-wide gate still snaps off the far crumb", () => {
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
    const landed = legalizeWindrowPlacement(
      { origin: { x: 5, y: 1 }, barAxis: "h", phase: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    for (const cell of windrowBar(landed)) {
      assert.equal(isOnWindrowBattleGraph(cell, player, occupancy), true);
    }
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "5,1");
  });

  it("seed-windrow-onto-void: a generation void is not a legal painted cell", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["5,2"]),
    );
    assert.equal(
      rawWindrowRects(occupancy, player).some((rect) =>
        windrowCells(rect).some((cell) => occKey(cell.x, cell.y) === "5,2"),
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      windrowCells(landed).some((cell) => occKey(cell.x, cell.y) === "5,2"),
      false,
    );
    for (const cell of windrowCells(landed)) {
      assert.equal(isOnWindrowBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-open-field-windrow-noop: already-legal dests are unchanged", () => {
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
    const dest: WindrowRect = {
      origin: { x: 4, y: 4 },
      barAxis: "h",
      phase: 1,
    };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 6 }], [player], player);
    assert.equal(
      isWindrowSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-windrow-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 2 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const landed = legalizeWindrowPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      barKeys(landed).includes(occKey(player.x, player.y)),
      true,
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-windrow-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 2 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    assert.equal(
      isWindrowSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      barKeys(landed).includes(occKey(boss.x, boss.y)),
      true,
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(boss), true);
  });

  it("seed-windrow-no-join-island: does not punch a leftover CA crumb", () => {
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
    const dest: WindrowRect = {
      origin: { x: 5, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of windrowBar(landed)) {
      assert.equal(isOnWindrowBattleGraph(cell, player, occupancy), true);
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

  it("seed-windrow-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveWindrow(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodWindrowBattleGraph(player, occupancy).size, 0);
    assert.equal(rawWindrowRects(occupancy, player).length, 0);
  });

  it("seed-windrow-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: WindrowRect = {
      origin: { x: 4, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      isWindrowSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
  });

  it("seed-windrow-skips-existing: a second hazard roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["5,1"]);
    const raw = rawWindrowRects(occupancy, player, existing);
    assert.equal(
      raw.some((rect) =>
        windrowCells(rect).some((cell) => occKey(cell.x, cell.y) === "5,1"),
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-windrow-count-one-rect: catalog pick is one 2×2, not Twin Sparks 4-line", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const raw = rawWindrowRects(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickWindrowCount();
      assert.equal(count, WINDROW_COUNT);
      const picked = pickWindrowRects(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const rect of picked) {
        assert.equal(windrowIsRectNotLine(rect), true);
        assert.equal(windrowCells(rect).length, 4);
        assert.equal(windrowBar(rect).length, 2);
        for (const cell of windrowCells(rect)) {
          assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
          assert.equal(isWindrowSpawnClear(cell.x, cell.y, player), false);
        }
      }
    }
  });

  it("seed-windrow-not-twin-sparks-line: painted run spans both axes", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = windrowCells(landed);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size, 2, "Twin Sparks consecutive cells share one axis");
    assert.equal(ys.size, 2, "Twin Sparks consecutive cells share one axis");
    assert.equal(windrowIsRectNotLine(landed), true);
  });

  it("seed-windrow-not-orbiting-cinder-square: hop moves a 2-tile bar, not one orb", () => {
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    assert.equal(windrowBar(dest).length, WINDROW_BAR_SIZE);
    assert.equal(windrowHopManhattan(dest), 1);
    const before = new Set(barKeys(dest));
    const after = new Set(barKeys(rawWindrowHop(dest)));
    assert.equal(before.size, 2);
    assert.equal(after.size, 2);
    assert.equal(
      [...before].some((k) => after.has(k)),
      false,
      "Orbiting Cinder keeps three empty corners; Windrow swaps the whole bar",
    );
  });

  it("seed-windrow-not-ratchet-cog-pair: painted track is four cells, not two", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: WindrowRect = {
      origin: { x: 4, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(windrowCells(landed).length, WINDROW_RECT_SIZE);
    assert.equal(windrowBar(landed).length, WINDROW_BAR_SIZE);
    assert.equal(windrowBarManhattan(landed), 1);
    assert.equal(
      windrowEmpty(landed).length,
      2,
      "Ratchet Cog has no parallel empty pair on a 2×2",
    );
  });

  it("seed-windrow-not-turnstile-plus: filled 2×2 is not a 4-arm plus", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest: WindrowRect = {
      origin: { x: 4, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const landed = legalizeWindrowPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = windrowCells(landed);
    const xs = [...new Set(cells.map((cell) => cell.x))].sort((a, b) => a - b);
    const ys = [...new Set(cells.map((cell) => cell.y))].sort((a, b) => a - b);
    assert.equal(xs.length, 2);
    assert.equal(ys.length, 2);
    assert.equal(
      xs[1] - xs[0],
      1,
      "Turnstile Ember arms are Manhattan 2 from a hollow center",
    );
    assert.equal(ys[1] - ys[0], 1);
    assert.equal(windrowHopManhattan(landed), 1);
  });

  it("seed-windrow-not-gutter-steam-vents: hop hops, it does not jet in place", () => {
    const dest: WindrowRect = {
      origin: { x: 4, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const before = new Set(barKeys(dest));
    const after = new Set(barKeys(rawWindrowHop(dest)));
    assert.equal(
      [...before].every((k) => after.has(k)),
      false,
      "Gutter Steam even/odd vents stay on the same two cells",
    );
    assert.equal(windrowEmpty(dest).length, 2);
  });

  it("seed-windrow-first-round-hop: round start hops the north pair onto the south pair", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const raw = rawWindrowHop(dest);
    assert.equal(raw.phase, 1);
    assert.deepEqual(barKeys(raw).sort(), ["4,3", "5,3"]);
    const hopped = resolveWindrowAfterRoundStart(dest, player, occupancy);
    assert.deepEqual(barKeys(hopped).sort(), ["4,3", "5,3"]);
  });

  it("seed-windrow-hop-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 7, y: 0 };
    const dest: WindrowRect = {
      origin: { x: 6, y: 0 },
      barAxis: "v",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const action = legalizeWindrowHop(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const hopped = resolveWindrowAfterRoundStart(dest, player, occupancy);
    assert.deepEqual(barKeys(hopped).sort(), barKeys(dest).sort());
  });

  it("seed-windrow-hop-through-portal-far-side: leftover next pair stays painted", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 0 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnWindrowBattleGraph(dest.origin, player, occupancy), false);
    const action = legalizeWindrowHop(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[0][5], F, "must not punch the leftover crumb");
  });

  it("seed-windrow-hop-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 7, y: 0 }],
      [player],
      player,
      new Set(["4,2"]),
    );
    const action = legalizeWindrowHop(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-windrow-hop-on-2-wide: walkable hop still fires", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest: WindrowRect = {
      origin: { x: 5, y: 1 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const action = legalizeWindrowHop(dest, player, occupancy);
    assert.equal(action.kind, "hop");
    if (action.kind === "hop") {
      assert.deepEqual(barKeys(action.rect).sort(), ["5,2", "6,2"]);
    }
  });

  it("seed-windrow-occupied-hop-lands: occupied next pair still hops (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 3 };
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const action = legalizeWindrowHop(dest, player, occupancy);
    assert.equal(
      action.kind,
      "hop",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "hop") {
      assert.equal(barKeys(action.rect).includes(occKey(boss.x, boss.y)), true);
    }
  });

  it("seed-windrow-clone-keeps-orientation: stay copies do not alias", () => {
    const dest: WindrowRect = {
      origin: { x: 4, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const copy = cloneWindrowRect(dest);
    copy.origin.x = 9;
    copy.phase = 1;
    copy.barAxis = "v";
    assert.equal(dest.origin.x, 4);
    assert.equal(dest.phase, 0);
    assert.equal(dest.barAxis, "h");
  });

  it("seed-windrow-rect-key-is-origin-axis: two phases share one 2×2", () => {
    const a: WindrowRect = {
      origin: { x: 5, y: 2 },
      barAxis: "h",
      phase: 0,
    };
    const b: WindrowRect = {
      origin: { x: 5, y: 2 },
      barAxis: "h",
      phase: 1,
    };
    assert.equal(windrowRectKey(a), windrowRectKey(b));
  });
});

function assertWindrowOnWorld(
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
  const snapped = resolveWindrow(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodWindrowBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} Windrow placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodWindrowBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Windrow shrunk the walk flood at plant`;
  }
  for (const rect of snapped) {
    if (windrowUnreachable(player, rect, occupancy)) {
      return `${label} Windrow unreachable at ${occKey(rect.origin.x, rect.origin.y)}`;
    }
    if (!windrowIsRectNotLine(rect)) {
      return `${label} dest is not a filled 2×2`;
    }
    if (windrowBarManhattan(rect) !== 1) {
      return `${label} bar cells are not Manhattan 1`;
    }
    if (windrowHopManhattan(rect) !== 1) {
      return `${label} hop is not Manhattan 1`;
    }
    for (const cell of windrowCells(rect)) {
      if (!isOnWindrowBattleGraph(cell, player, occupancy)) {
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
      if (isWindrowSpawnClear(cell.x, cell.y, spawn)) {
        return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
      }
    }
    const hopped = resolveWindrowAfterRoundStart(
      rect,
      player,
      occupancy,
      spawn,
    );
    for (const cell of windrowBar(hopped)) {
      if (!isOnWindrowBattleGraph(cell, player, occupancy)) {
        return `${label} hop left the fight graph at ${occKey(cell.x, cell.y)}`;
      }
    }
    if (floodWindrowBattleGraph(player, occupancy).size !== walkBefore) {
      return `${label} hop shrunk the walk flood`;
    }
  }
  const keys = new Set(snapped.map((rect) => windrowRectKey(rect)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two Windrows on one 2×2 axis`;
  }
  return null;
}

describe("occupancyWindrowUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Windrow stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertWindrowOnWorld(
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

  it("corridorMaze wander Windrow stays on the fight graph", () => {
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
      const miss = assertWindrowOnWorld(
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

  it("chessboard destack Windrow stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertWindrowOnWorld(
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

  it("Boss Rush destack Windrow stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertWindrowOnWorld(
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

  it("rest-exit destack Windrow stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertWindrowOnWorld(
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
    const snapped = resolveWindrow(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const rect of snapped) {
      for (const cell of windrowCells(rect)) {
        assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
        assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
      }
    }
    assert.ok(snapped.length <= WINDROW_COUNT);
  });
});
