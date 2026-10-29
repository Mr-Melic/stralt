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
  PLUMB_EMBER_COLUMN_LENGTH,
  PLUMB_EMBER_COUNT,
  PLUMB_EMBER_FALL,
  PLUMB_EMBER_FEATURE_ID,
  PLUMB_EMBER_HEADINGS,
  PLUMB_EMBER_HP_TAX_PCT,
  PLUMB_EMBER_SPAWN_CLEAR,
  type PlumbEmber,
  clonePlumbEmber,
  floodPlumbEmberBattleGraph,
  isOnPlumbEmberBattleGraph,
  isPlumbEmberSpawnClear,
  legalizePlumbEmberFall,
  legalizePlumbEmberPlacement,
  pickPlumbEmberColumn,
  pickPlumbEmberCount,
  plumbEmberCells,
  plumbEmberColumnKey,
  plumbEmberColumnUnreachable,
  plumbEmberFallManhattan,
  plumbEmberIsColumnNotRow,
  plumbEmberOrb,
  plumbEmberUnreachable,
  plumbEmberWraps,
  rawPlumbEmberColumns,
  rawPlumbEmberFall,
  resolvePlumbEmber,
  resolvePlumbEmberAfterRoundStart,
} from "./occupancyPlumbEmberUnseal.ts";
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

function orbKey(column: PlumbEmber): string {
  return occKey(plumbEmberOrb(column).x, plumbEmberOrb(column).y);
}

function southColumn(origin: OccCell, index = 0): PlumbEmber {
  return {
    origin: { x: origin.x, y: origin.y },
    heading: { dx: 0, dy: 1 },
    index,
  };
}

describe("occupancyPlumbEmberUnseal regressions", () => {
  it("seed-plumb-ember-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, P, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 2, y: 2 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawPlumbEmberColumns(occupancy, player);
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => occKey(cell.x, cell.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => cell.x === 4 && cell.y === 4,
        ),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(PLUMB_EMBER_COUNT, 1);
    assert.equal(PLUMB_EMBER_COLUMN_LENGTH, 4);
    assert.equal(PLUMB_EMBER_FALL, 1);
    assert.equal(PLUMB_EMBER_HP_TAX_PCT, 0.05);
    assert.equal(PLUMB_EMBER_FEATURE_ID, "WF-HAZ-CINDER_PLUMB");
    assert.equal(PLUMB_EMBER_HEADINGS.length, 1);
    assert.equal(PLUMB_EMBER_HEADINGS[0]?.dx, 0);
    assert.equal(PLUMB_EMBER_HEADINGS[0]?.dy, 1);
  });

  it("seed-plumb-ember-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
      [F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 7 }], [spawn], spawn);
    const raw = rawPlumbEmberColumns(occupancy, spawn);
    assert.equal(isPlumbEmberSpawnClear(0, 0, spawn), true);
    assert.equal(isPlumbEmberSpawnClear(3, 3, spawn), true);
    assert.equal(isPlumbEmberSpawnClear(4, 0, spawn), false);
    assert.equal(PLUMB_EMBER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some((cell) =>
          isPlumbEmberSpawnClear(cell.x, cell.y, spawn),
        ),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => cell.x === 5 && cell.y === 5,
        ),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-plumb-ember-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawPlumbEmberColumns(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isPlumbEmberSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => cell.x === cx && cell.y === cy,
        ),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => cell.x === 0 && cell.y === 0,
        ),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-plumb-ember-extraHazardRoll-one: catalog min=max=1 plants one cinder", () => {
    const stub = {
      extraHazardCount: { min: 1, max: 1 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      1,
      "unlike Twin Sparks / Windrow band=2, Plumb Ember rides extraHazardRoll = 1",
    );
    assert.equal(pickPlumbEmberCount(), PLUMB_EMBER_COUNT);
  });

  it("seed-plumb-ember-through-portal-far-side: leftover 4-column snaps onto the fight graph", () => {
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
    const dest = southColumn({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnPlumbEmberBattleGraph(dest.origin, player, occupancy),
      false,
      "far crumb origin must start battle-isolated",
    );
    assert.equal(plumbEmberColumnUnreachable(player, dest, occupancy), true);
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of plumbEmberCells(landed.origin, landed.heading)) {
      assert.equal(isOnPlumbEmberBattleGraph(cell, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(plumbEmberUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-plumb-ember-on-unique-bridge-1-wide-stays: a vertical 1-wide of length ≥ 4 keeps the fall walkable", () => {
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
    const dest = southColumn({ x: 1, y: 5 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const walkBefore = floodPlumbEmberBattleGraph(player, occupancy).size;
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.ok(
      landed,
      "unlike Windrow, Plumb Ember fits a vertical 1-wide of length ≥ 4",
    );
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      floodPlumbEmberBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const hopped = resolvePlumbEmberAfterRoundStart(landed, player, occupancy);
    const next = rawPlumbEmberFall(landed);
    assert.equal(orbKey(hopped), orbKey(next));
    assert.equal(
      floodPlumbEmberBattleGraph(player, occupancy).size,
      walkBefore,
      "fall is not a wall — Spent Bridge would cut the corridor",
    );
  });

  it("seed-plumb-ember-horizontal-1-wide-drops: an east corridor cannot host a south column", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = southColumn({ x: 5, y: 1 });
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "Skipping Cinder would stay on this 1-wide of length ≥ 5; Plumb Ember is south-only",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
    assert.equal(tiles[0][5], W, "must not punch a north alcove");
  });

  it("seed-plumb-ember-short-1-wide-drops: a 1-wide shorter than 4 cannot host the column", () => {
    const tiles = [
      [W, F, W],
      [W, F, W],
      [W, F, W],
      [W, P, W],
    ];
    const player = { x: 1, y: 0 };
    const dest = southColumn({ x: 1, y: 0 });
    const occupancy = ctxFrom(tiles, [{ x: 1, y: 3 }], [player], player);
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "three fight-graph floors plus the gate cannot host a 4-tile column",
    );
    assert.equal(tiles[1][1], F, "must not punch the unique corridor");
    assert.equal(tiles[1][0], W, "must not punch a west alcove");
  });

  it("seed-plumb-ember-corridor-8: 1-wide gate still snaps off the far crumb", () => {
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
    const landed = legalizePlumbEmberPlacement(
      southColumn({ x: 4, y: 1 }),
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnPlumbEmberBattleGraph(plumbEmberOrb(landed), player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "4,1");
  });

  it("seed-plumb-ember-onto-void: a generation void is not a legal painted cell", () => {
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
    const dest = southColumn({ x: 4, y: 2 });
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["4,4"]),
    );
    assert.equal(
      rawPlumbEmberColumns(occupancy, player).some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => occKey(cell.x, cell.y) === "4,4",
        ),
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      plumbEmberCells(landed.origin, landed.heading).some(
        (cell) => occKey(cell.x, cell.y) === "4,4",
      ),
      false,
    );
    for (const cell of plumbEmberCells(landed.origin, landed.heading)) {
      assert.equal(isOnPlumbEmberBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-open-field-plumb-ember-noop: already-legal dests are unchanged", () => {
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
    const dest = southColumn({ x: 4, y: 4 }, 2);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 7 }], [player], player);
    assert.equal(
      isPlumbEmberSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-plumb-ember-covers-player: walkable plant stays on a destacked player", () => {
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
    const player = { x: 4, y: 4 };
    const dest = southColumn({ x: 4, y: 3 });
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const landed = legalizePlumbEmberPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      plumbEmberCells(landed.origin, landed.heading).some(
        (cell) => occKey(cell.x, cell.y) === occKey(player.x, player.y),
      ),
      true,
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-plumb-ember-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
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
    const dest = southColumn({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    assert.equal(
      isPlumbEmberSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      plumbEmberCells(landed.origin, landed.heading).some(
        (cell) => occKey(cell.x, cell.y) === occKey(boss.x, boss.y),
      ),
      true,
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(boss), true);
  });

  it("seed-plumb-ember-no-join-island: does not punch a leftover CA crumb", () => {
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
    const dest = southColumn({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnPlumbEmberBattleGraph(plumbEmberOrb(landed), player, occupancy),
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

  it("seed-plumb-ember-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolvePlumbEmber(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodPlumbEmberBattleGraph(player, occupancy).size, 0);
    assert.equal(rawPlumbEmberColumns(occupancy, player).length, 0);
  });

  it("seed-plumb-ember-dual-path: one corridor dest cannot cut every exit", () => {
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
    const dest = southColumn({ x: 4, y: 1 });
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      isPlumbEmberSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
  });

  it("seed-plumb-ember-skips-existing: a second hazard roll does not restamp", () => {
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
    const raw = rawPlumbEmberColumns(occupancy, player, existing);
    assert.equal(
      raw.some((column) =>
        plumbEmberCells(column.origin, column.heading).some(
          (cell) => occKey(cell.x, cell.y) === "5,2",
        ),
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-plumb-ember-count-one-column: catalog pick is one 4-column, not Skip Cinder 5-line", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawPlumbEmberColumns(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickPlumbEmberCount();
      assert.equal(count, PLUMB_EMBER_COUNT);
      const picked = pickPlumbEmberColumn(raw, rng);
      if (!picked) continue;
      assert.equal(plumbEmberIsColumnNotRow(picked), true);
      assert.equal(plumbEmberCells(picked.origin, picked.heading).length, 4);
      assert.equal(picked.heading.dx, 0);
      assert.equal(picked.heading.dy, 1);
      for (const cell of plumbEmberCells(picked.origin, picked.heading)) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isPlumbEmberSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-plumb-ember-not-pendulum-reverse: fall wraps instead of reversing at the end", () => {
    const atEnd = southColumn({ x: 4, y: 2 }, 3);
    const hopped = rawPlumbEmberFall(atEnd);
    assert.equal(atEnd.index, 3);
    assert.equal(
      hopped.index,
      0,
      "Pendulum at index 3 dir+1 steps to 4 then reverses",
    );
    assert.equal(plumbEmberWraps(atEnd), true);
    assert.equal(plumbEmberWraps(southColumn({ x: 4, y: 2 }, 0)), false);
    const fromTwo = rawPlumbEmberFall(southColumn({ x: 4, y: 2 }, 2));
    assert.equal(
      fromTwo.index,
      3,
      "non-wrap 2→3; Skip Cinder hop-2 would land at 0 wrap",
    );
  });

  it("seed-plumb-ember-period-four: four +1 falls return to the start, unlike Skip Cinder's 5", () => {
    let column = southColumn({ x: 4, y: 2 }, 0);
    const seen: number[] = [column.index];
    for (let i = 0; i < PLUMB_EMBER_COLUMN_LENGTH; i++) {
      column = rawPlumbEmberFall(column);
      seen.push(column.index);
    }
    assert.deepEqual(seen, [0, 1, 2, 3, 0]);
    assert.equal(column.index, 0);
  });

  it("seed-plumb-ember-not-skip-cinder-hop-two: fall is one tile on four cells, not hop-two on five", () => {
    const dest = southColumn({ x: 4, y: 2 }, 0);
    assert.equal(plumbEmberIsColumnNotRow(dest), true);
    assert.equal(plumbEmberFallManhattan(dest), 1);
    const cells = plumbEmberCells(dest.origin, dest.heading);
    assert.equal(cells.length, 4);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size, 1);
    assert.equal(ys.size, 4);
    assert.equal(plumbEmberWraps(dest), false);
    assert.equal(plumbEmberFallManhattan(southColumn({ x: 4, y: 2 }, 3)), 3);
    const hopped = rawPlumbEmberFall(dest);
    assert.equal(hopped.index, 1, "Skip Cinder hop-2 from 0 lands on 2");
  });

  it("seed-plumb-ember-not-orbiting-cinder-square: fall is a 4-tile column, not a 2×2", () => {
    const dest = southColumn({ x: 4, y: 2 }, 0);
    assert.equal(plumbEmberIsColumnNotRow(dest), true);
    const cells = plumbEmberCells(dest.origin, dest.heading);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size === 2 && ys.size === 2, false);
    assert.equal(plumbEmberFallManhattan(dest), 1);
  });

  it("seed-plumb-ember-not-twin-sparks-line: one orb on four vertical cells, not two on a line", () => {
    const dest = southColumn({ x: 4, y: 2 }, 0);
    const before = orbKey(dest);
    const after = orbKey(rawPlumbEmberFall(dest));
    assert.equal(plumbEmberCells(dest.origin, dest.heading).length, 4);
    assert.notEqual(before, after);
    assert.equal(
      plumbEmberFallManhattan(dest),
      1,
      "Twin Sparks opposite orbs are Manhattan 2 on a 4-tile line with two bodies",
    );
    assert.equal(dest.heading.dx, 0);
    assert.equal(dest.heading.dy, 1);
  });

  it("seed-plumb-ember-not-windrow-2x2: painted run is collinear vertical, not a filled 2×2", () => {
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
    const dest = southColumn({ x: 4, y: 2 });
    const landed = legalizePlumbEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = plumbEmberCells(landed.origin, landed.heading);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size, 1);
    assert.equal(ys.size, 4);
    assert.equal(xs.size === 2 && ys.size === 2, false);
    assert.equal(plumbEmberIsColumnNotRow(landed), true);
  });

  it("seed-plumb-ember-not-turnstile-plus: consecutive cells are Manhattan 1 on the south axis", () => {
    const dest = southColumn({ x: 4, y: 2 });
    const cells = plumbEmberCells(dest.origin, dest.heading);
    for (let i = 1; i < cells.length; i++) {
      const a = cells[i - 1];
      const b = cells[i];
      assert.ok(a && b);
      assert.equal(Math.abs(a.x - b.x) + Math.abs(a.y - b.y), 1);
      assert.equal(b.y, a.y + 1);
    }
    assert.equal(
      plumbEmberFallManhattan(dest),
      1,
      "Turnstile Ember consecutive arms are Manhattan 2 from a hollow center",
    );
  });

  it("seed-plumb-ember-not-creeping-ash-three: fall does not translate a 3-tile window", () => {
    const dest = southColumn({ x: 4, y: 2 }, 0);
    const before = plumbEmberCells(dest.origin, dest.heading).map((c) =>
      occKey(c.x, c.y),
    );
    const after = plumbEmberCells(
      rawPlumbEmberFall(dest).origin,
      rawPlumbEmberFall(dest).heading,
    ).map((c) => occKey(c.x, c.y));
    assert.deepEqual(before, after, "Creeping Ash slides the painted window");
    assert.equal(before.length, 4);
    assert.notEqual(orbKey(dest), orbKey(rawPlumbEmberFall(dest)));
  });

  it("seed-plumb-ember-first-round-fall: round start falls index 0 onto index 1", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = southColumn({ x: 4, y: 2 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawPlumbEmberFall(dest);
    assert.equal(raw.index, 1);
    assert.equal(orbKey(raw), "4,3");
    const hopped = resolvePlumbEmberAfterRoundStart(dest, player, occupancy);
    assert.equal(orbKey(hopped), "4,3");
  });

  it("seed-plumb-ember-fall-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = southColumn({ x: 8, y: 0 }, 3);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(orbKey(rawPlumbEmberFall(dest)), occKey(portal.x, portal.y));
    const action = legalizePlumbEmberFall(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const hopped = resolvePlumbEmberAfterRoundStart(dest, player, occupancy);
    assert.equal(orbKey(hopped), orbKey(dest));
  });

  it("seed-plumb-ember-fall-through-portal-far-side: leftover next cell stays painted", () => {
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
    const dest = southColumn({ x: 4, y: 1 }, 0);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnPlumbEmberBattleGraph(dest.origin, player, occupancy),
      false,
    );
    const action = legalizePlumbEmberFall(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[2][4], F, "must not punch the leftover crumb");
  });

  it("seed-plumb-ember-fall-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = southColumn({ x: 4, y: 1 }, 0);
    const occupancy = ctxFrom(
      tiles,
      [{ x: 8, y: 0 }],
      [player],
      player,
      new Set(["4,2"]),
    );
    assert.equal(orbKey(rawPlumbEmberFall(dest)), "4,2");
    const action = legalizePlumbEmberFall(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-plumb-ember-fall-on-1-wide: walkable fall still fires", () => {
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
    const dest = southColumn({ x: 1, y: 5 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 1, y: 11 }], [player], player);
    const action = legalizePlumbEmberFall(dest, player, occupancy);
    assert.equal(action.kind, "fall");
    if (action.kind === "fall") {
      assert.equal(orbKey(action.column), "1,6");
    }
  });

  it("seed-plumb-ember-occupied-fall-lands: occupied next cell still falls (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 3 };
    const dest = southColumn({ x: 4, y: 2 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const action = legalizePlumbEmberFall(dest, player, occupancy);
    assert.equal(
      action.kind,
      "fall",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "fall") {
      assert.equal(orbKey(action.column), occKey(boss.x, boss.y));
    }
  });

  it("seed-plumb-ember-clone-keeps-orientation: stay copies do not alias", () => {
    const dest = southColumn({ x: 4, y: 2 }, 0);
    const copy = clonePlumbEmber(dest);
    copy.origin.x = 9;
    copy.index = 3;
    copy.heading.dx = 1;
    copy.heading.dy = 0;
    assert.equal(dest.origin.x, 4);
    assert.equal(dest.index, 0);
    assert.equal(dest.heading.dx, 0);
    assert.equal(dest.heading.dy, 1);
  });

  it("seed-plumb-ember-column-key-is-origin: two indices share one painted column", () => {
    const a = southColumn({ x: 5, y: 2 }, 0);
    const b = southColumn({ x: 5, y: 2 }, 2);
    assert.equal(plumbEmberColumnKey(a), plumbEmberColumnKey(b));
  });
});

function assertPlumbEmberOnWorld(
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
  const snapped = resolvePlumbEmber(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodPlumbEmberBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} Plumb Ember placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodPlumbEmberBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Plumb Ember shrunk the walk flood at plant`;
  }
  if (!snapped) return null;
  if (plumbEmberUnreachable(player, snapped, occupancy)) {
    return `${label} Plumb Ember unreachable at ${occKey(snapped.origin.x, snapped.origin.y)}`;
  }
  if (!plumbEmberIsColumnNotRow(snapped)) {
    return `${label} dest is not a 4-tile vertical column`;
  }
  const fallManhattan = plumbEmberFallManhattan(snapped);
  if (fallManhattan !== 1 && fallManhattan !== 3) {
    return `${label} fall Manhattan is ${fallManhattan}, want 1 or wrap-3`;
  }
  if (plumbEmberWraps(snapped) && fallManhattan !== 3) {
    return `${label} wrap fall is not Manhattan 3`;
  }
  if (!plumbEmberWraps(snapped) && fallManhattan !== 1) {
    return `${label} non-wrap fall is not Manhattan 1`;
  }
  for (const cell of plumbEmberCells(snapped.origin, snapped.heading)) {
    if (!isOnPlumbEmberBattleGraph(cell, player, occupancy)) {
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
    if (isPlumbEmberSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
  }
  const hopped = resolvePlumbEmberAfterRoundStart(
    snapped,
    player,
    occupancy,
    spawn,
  );
  if (!isOnPlumbEmberBattleGraph(plumbEmberOrb(hopped), player, occupancy)) {
    return `${label} fall left the fight graph at ${orbKey(hopped)}`;
  }
  if (floodPlumbEmberBattleGraph(player, occupancy).size !== walkBefore) {
    return `${label} fall shrunk the walk flood`;
  }
  return null;
}

describe("occupancyPlumbEmberUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Plumb Ember stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertPlumbEmberOnWorld(
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

  it("corridorMaze wander Plumb Ember stays on the fight graph", () => {
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
      const miss = assertPlumbEmberOnWorld(
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

  it("chessboard destack Plumb Ember stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertPlumbEmberOnWorld(
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

  it("Boss Rush destack Plumb Ember stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertPlumbEmberOnWorld(
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

  it("rest-exit destack Plumb Ember stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertPlumbEmberOnWorld(
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
    const snapped = resolvePlumbEmber(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (snapped) {
      for (const cell of plumbEmberCells(snapped.origin, snapped.heading)) {
        assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
        assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
      }
    }
  });
});
