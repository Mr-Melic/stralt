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
  SKIP_CINDER_COUNT,
  SKIP_CINDER_FEATURE_ID,
  SKIP_CINDER_HEADINGS,
  SKIP_CINDER_HOP,
  SKIP_CINDER_HP_TAX_PCT,
  SKIP_CINDER_LINE_LENGTH,
  SKIP_CINDER_SPAWN_CLEAR,
  type SkipCinder,
  cloneSkipCinder,
  floodSkipCinderBattleGraph,
  isOnSkipCinderBattleGraph,
  isSkipCinderSpawnClear,
  legalizeSkipCinderHop,
  legalizeSkipCinderPlacement,
  pickSkipCinderCount,
  pickSkipCinderLine,
  rawSkipCinderHop,
  rawSkipCinderLines,
  resolveSkipCinder,
  resolveSkipCinderAfterRoundStart,
  skipCinderCells,
  skipCinderHopManhattan,
  skipCinderIsLineNotSquare,
  skipCinderLineKey,
  skipCinderLineUnreachable,
  skipCinderOrb,
  skipCinderSkipped,
  skipCinderUnreachable,
  skipCinderWraps,
} from "./occupancySkipCinderUnseal.ts";
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

function orbKey(line: SkipCinder): string {
  return occKey(skipCinderOrb(line).x, skipCinderOrb(line).y);
}

function eastLine(origin: OccCell, index = 0): SkipCinder {
  return {
    origin: { x: origin.x, y: origin.y },
    heading: { dx: 1, dy: 0 },
    index,
  };
}

describe("occupancySkipCinderUnseal regressions", () => {
  it("seed-skip-cinder-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawSkipCinderLines(occupancy, player);
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => occKey(cell.x, cell.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => cell.x === 6 && cell.y === 1,
        ),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(SKIP_CINDER_COUNT, 1);
    assert.equal(SKIP_CINDER_LINE_LENGTH, 5);
    assert.equal(SKIP_CINDER_HOP, 2);
    assert.equal(SKIP_CINDER_HP_TAX_PCT, 0.05);
    assert.equal(SKIP_CINDER_FEATURE_ID, "WF-HAZ-SKIP_CINDER");
    assert.equal(SKIP_CINDER_HEADINGS.length, 2);
  });

  it("seed-skip-cinder-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 3 }], [spawn], spawn);
    const raw = rawSkipCinderLines(occupancy, spawn);
    assert.equal(isSkipCinderSpawnClear(0, 0, spawn), true);
    assert.equal(isSkipCinderSpawnClear(3, 0, spawn), true);
    assert.equal(isSkipCinderSpawnClear(4, 0, spawn), false);
    assert.equal(SKIP_CINDER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some((cell) =>
          isSkipCinderSpawnClear(cell.x, cell.y, spawn),
        ),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => cell.x === 7 && cell.y === 1,
        ),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-skip-cinder-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawSkipCinderLines(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isSkipCinderSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => cell.x === cx && cell.y === cy,
        ),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => cell.x === 0 && cell.y === 0,
        ),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-skip-cinder-extraHazardRoll-one: catalog min=max=1 plants one cinder", () => {
    const stub = {
      extraHazardCount: { min: 1, max: 1 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      1,
      "unlike Twin Sparks / Windrow band=2, Skipping Cinder rides extraHazardRoll = 1",
    );
    assert.equal(pickSkipCinderCount(), SKIP_CINDER_COUNT);
  });

  it("seed-skip-cinder-through-portal-far-side: leftover 5-line snaps onto the fight graph", () => {
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
    const dest = eastLine({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnSkipCinderBattleGraph(dest.origin, player, occupancy),
      false,
      "far crumb origin must start battle-isolated",
    );
    assert.equal(skipCinderLineUnreachable(player, dest, occupancy), true);
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of skipCinderCells(landed.origin, landed.heading)) {
      assert.equal(isOnSkipCinderBattleGraph(cell, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(skipCinderUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-skip-cinder-on-unique-bridge-1-wide-stays: a 1-wide of length ≥ 5 keeps the hop walkable", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest = eastLine({ x: 5, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const walkBefore = floodSkipCinderBattleGraph(player, occupancy).size;
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.ok(
      landed,
      "unlike Windrow, Skipping Cinder fits a 1-wide of length ≥ 5",
    );
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      floodSkipCinderBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const hopped = resolveSkipCinderAfterRoundStart(landed, player, occupancy);
    const next = rawSkipCinderHop(landed);
    assert.equal(orbKey(hopped), orbKey(next));
    assert.equal(
      floodSkipCinderBattleGraph(player, occupancy).size,
      walkBefore,
      "hop is not a wall — Spent Bridge would cut the corridor",
    );
  });

  it("seed-skip-cinder-short-1-wide-drops: a 1-wide shorter than 5 cannot host the line", () => {
    const tiles = [
      [W, W, W, W, W, W, W],
      [F, F, F, F, P, W, W],
      [W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = eastLine({ x: 0, y: 1 });
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 1 }], [player], player);
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "four fight-graph floors plus the gate cannot host a 5-tile line",
    );
    assert.equal(tiles[1][2], F, "must not punch the unique corridor");
    assert.equal(tiles[0][2], W, "must not punch a north alcove");
  });

  it("seed-skip-cinder-corridor-8: 1-wide gate still snaps off the far crumb", () => {
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
    const landed = legalizeSkipCinderPlacement(
      eastLine({ x: 4, y: 1 }),
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnSkipCinderBattleGraph(skipCinderOrb(landed), player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "4,1");
  });

  it("seed-skip-cinder-onto-void: a generation void is not a legal painted cell", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 9, y: 0 };
    const dest = eastLine({ x: 4, y: 2 });
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["6,2"]),
    );
    assert.equal(
      rawSkipCinderLines(occupancy, player).some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => occKey(cell.x, cell.y) === "6,2",
        ),
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      skipCinderCells(landed.origin, landed.heading).some(
        (cell) => occKey(cell.x, cell.y) === "6,2",
      ),
      false,
    );
    for (const cell of skipCinderCells(landed.origin, landed.heading)) {
      assert.equal(isOnSkipCinderBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-open-field-skip-cinder-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = eastLine({ x: 4, y: 4 }, 2);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 6 }], [player], player);
    assert.equal(
      isSkipCinderSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-skip-cinder-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 2 };
    const dest = eastLine({ x: 4, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const landed = legalizeSkipCinderPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      skipCinderCells(landed.origin, landed.heading).some(
        (cell) => occKey(cell.x, cell.y) === occKey(player.x, player.y),
      ),
      true,
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-skip-cinder-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 2 };
    const dest = eastLine({ x: 4, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    assert.equal(
      isSkipCinderSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      skipCinderCells(landed.origin, landed.heading).some(
        (cell) => occKey(cell.x, cell.y) === occKey(boss.x, boss.y),
      ),
      true,
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(boss), true);
  });

  it("seed-skip-cinder-no-join-island: does not punch a leftover CA crumb", () => {
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
    const dest = eastLine({ x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnSkipCinderBattleGraph(skipCinderOrb(landed), player, occupancy),
      true,
    );
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
    );
    assert.equal(
      tiles[3][5],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[1][4], F, "leftover crumb stays a floor island");
  });

  it("seed-skip-cinder-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveSkipCinder(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodSkipCinderBattleGraph(player, occupancy).size, 0);
    assert.equal(rawSkipCinderLines(occupancy, player).length, 0);
  });

  it("seed-skip-cinder-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dest = eastLine({ x: 4, y: 1 });
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      isSkipCinderSpawnClear(dest.origin.x, dest.origin.y, player),
      false,
    );
  });

  it("seed-skip-cinder-skips-existing: a second hazard roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const existing = new Set(["5,1"]);
    const raw = rawSkipCinderLines(occupancy, player, existing);
    assert.equal(
      raw.some((line) =>
        skipCinderCells(line.origin, line.heading).some(
          (cell) => occKey(cell.x, cell.y) === "5,1",
        ),
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-skip-cinder-count-one-line: catalog pick is one 5-line, not Twin Sparks 4-line", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawSkipCinderLines(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickSkipCinderCount();
      assert.equal(count, SKIP_CINDER_COUNT);
      const picked = pickSkipCinderLine(raw, rng);
      if (!picked) continue;
      assert.equal(skipCinderIsLineNotSquare(picked), true);
      assert.equal(skipCinderCells(picked.origin, picked.heading).length, 5);
      for (const cell of skipCinderCells(picked.origin, picked.heading)) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isSkipCinderSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-skip-cinder-not-pendulum-reverse: hop wraps instead of reversing at the end", () => {
    const atEnd = eastLine({ x: 4, y: 2 }, 4);
    const hopped = rawSkipCinderHop(atEnd);
    assert.equal(atEnd.index, 4);
    assert.equal(hopped.index, 1, "Pendulum at index 4 dir+1 reverses to 3");
    assert.equal(skipCinderWraps(atEnd), true);
    assert.equal(skipCinderWraps(eastLine({ x: 4, y: 2 }, 0)), false);
    const fromThree = rawSkipCinderHop(eastLine({ x: 4, y: 2 }, 3));
    assert.equal(fromThree.index, 0, "wrap 3→0; Pendulum 3 dir+1 steps to 4");
  });

  it("seed-skip-cinder-period-five: five +2 hops return to the start, unlike Pendulum's 8", () => {
    let line = eastLine({ x: 4, y: 2 }, 0);
    const seen: number[] = [line.index];
    for (let i = 0; i < SKIP_CINDER_LINE_LENGTH; i++) {
      line = rawSkipCinderHop(line);
      seen.push(line.index);
    }
    assert.deepEqual(seen, [0, 2, 4, 1, 3, 0]);
    assert.equal(line.index, 0);
  });

  it("seed-skip-cinder-skipped-cell-is-safe: the cell between hop start and land is not taxed", () => {
    const line = eastLine({ x: 4, y: 2 }, 0);
    const skipped = skipCinderSkipped(line);
    const landing = skipCinderOrb(rawSkipCinderHop(line));
    assert.equal(occKey(skipped.x, skipped.y), "5,2");
    assert.equal(occKey(landing.x, landing.y), "6,2");
    const wrapSkip = skipCinderSkipped(eastLine({ x: 4, y: 2 }, 3));
    assert.equal(
      occKey(wrapSkip.x, wrapSkip.y),
      "8,2",
      "wrap 3→0 skips index 4, the last painted cell",
    );
  });

  it("seed-skip-cinder-not-orbiting-cinder-square: hop is a 5-tile line, not a 2×2", () => {
    const dest = eastLine({ x: 4, y: 2 }, 0);
    assert.equal(skipCinderIsLineNotSquare(dest), true);
    assert.equal(skipCinderHopManhattan(dest), 2);
    const cells = skipCinderCells(dest.origin, dest.heading);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size, 5);
    assert.equal(ys.size, 1);
    assert.equal(skipCinderWraps(dest), false);
    assert.equal(skipCinderHopManhattan(eastLine({ x: 4, y: 2 }, 3)), 3);
  });

  it("seed-skip-cinder-not-twin-sparks-line: one orb on five cells, not two on four", () => {
    const dest = eastLine({ x: 4, y: 2 }, 0);
    const before = orbKey(dest);
    const after = orbKey(rawSkipCinderHop(dest));
    assert.equal(skipCinderCells(dest.origin, dest.heading).length, 5);
    assert.notEqual(before, after);
    assert.equal(
      skipCinderHopManhattan(dest),
      2,
      "Twin Sparks opposite orbs are Manhattan 2 on a 4-tile line with two bodies",
    );
  });

  it("seed-skip-cinder-not-windrow-2x2: painted run is collinear, not a filled 2×2", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dest = eastLine({ x: 4, y: 2 });
    const landed = legalizeSkipCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = skipCinderCells(landed.origin, landed.heading);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.equal(xs.size === 1 || ys.size === 1, true);
    assert.equal(xs.size === 2 && ys.size === 2, false);
    assert.equal(skipCinderIsLineNotSquare(landed), true);
  });

  it("seed-skip-cinder-not-turnstile-plus: consecutive cells are Manhattan 1 on one axis", () => {
    const dest = eastLine({ x: 4, y: 2 });
    const cells = skipCinderCells(dest.origin, dest.heading);
    for (let i = 1; i < cells.length; i++) {
      const a = cells[i - 1];
      const b = cells[i];
      assert.ok(a && b);
      assert.equal(Math.abs(a.x - b.x) + Math.abs(a.y - b.y), 1);
    }
    assert.equal(
      skipCinderHopManhattan(dest),
      2,
      "Turnstile Ember consecutive arms are Manhattan 2 from a hollow center",
    );
  });

  it("seed-skip-cinder-not-creeping-ash-three: hop does not translate a 3-tile window", () => {
    const dest = eastLine({ x: 4, y: 2 }, 0);
    const before = skipCinderCells(dest.origin, dest.heading).map((c) =>
      occKey(c.x, c.y),
    );
    const after = skipCinderCells(
      rawSkipCinderHop(dest).origin,
      rawSkipCinderHop(dest).heading,
    ).map((c) => occKey(c.x, c.y));
    assert.deepEqual(before, after, "Creeping Ash slides the painted window");
    assert.equal(before.length, 5);
    assert.notEqual(orbKey(dest), orbKey(rawSkipCinderHop(dest)));
  });

  it("seed-skip-cinder-first-round-hop: round start hops index 0 onto index 2", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = eastLine({ x: 4, y: 2 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawSkipCinderHop(dest);
    assert.equal(raw.index, 2);
    assert.equal(orbKey(raw), "6,2");
    const hopped = resolveSkipCinderAfterRoundStart(dest, player, occupancy);
    assert.equal(orbKey(hopped), "6,2");
  });

  it("seed-skip-cinder-hop-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = eastLine({ x: 4, y: 0 }, 2);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(orbKey(rawSkipCinderHop(dest)), occKey(portal.x, portal.y));
    const action = legalizeSkipCinderHop(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const hopped = resolveSkipCinderAfterRoundStart(dest, player, occupancy);
    assert.equal(orbKey(hopped), orbKey(dest));
  });

  it("seed-skip-cinder-hop-through-portal-far-side: leftover next cell stays painted", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = eastLine({ x: 4, y: 0 }, 0);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnSkipCinderBattleGraph(dest.origin, player, occupancy),
      false,
    );
    const action = legalizeSkipCinderHop(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[0][6], F, "must not punch the leftover crumb");
  });

  it("seed-skip-cinder-hop-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = eastLine({ x: 4, y: 1 }, 0);
    const occupancy = ctxFrom(
      tiles,
      [{ x: 8, y: 0 }],
      [player],
      player,
      new Set(["6,1"]),
    );
    assert.equal(orbKey(rawSkipCinderHop(dest)), "6,1");
    const action = legalizeSkipCinderHop(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-skip-cinder-hop-on-1-wide: walkable hop still fires", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = eastLine({ x: 5, y: 1 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const action = legalizeSkipCinderHop(dest, player, occupancy);
    assert.equal(action.kind, "hop");
    if (action.kind === "hop") {
      assert.equal(orbKey(action.line), "7,1");
    }
  });

  it("seed-skip-cinder-occupied-hop-lands: occupied next cell still hops (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 6, y: 2 };
    const dest = eastLine({ x: 4, y: 2 }, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const action = legalizeSkipCinderHop(dest, player, occupancy);
    assert.equal(
      action.kind,
      "hop",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "hop") {
      assert.equal(orbKey(action.line), occKey(boss.x, boss.y));
    }
  });

  it("seed-skip-cinder-clone-keeps-orientation: stay copies do not alias", () => {
    const dest = eastLine({ x: 4, y: 2 }, 0);
    const copy = cloneSkipCinder(dest);
    copy.origin.x = 9;
    copy.index = 4;
    copy.heading.dx = 0;
    copy.heading.dy = 1;
    assert.equal(dest.origin.x, 4);
    assert.equal(dest.index, 0);
    assert.equal(dest.heading.dx, 1);
    assert.equal(dest.heading.dy, 0);
  });

  it("seed-skip-cinder-line-key-is-origin-heading: two indices share one painted line", () => {
    const a = eastLine({ x: 5, y: 2 }, 0);
    const b = eastLine({ x: 5, y: 2 }, 2);
    assert.equal(skipCinderLineKey(a), skipCinderLineKey(b));
  });
});

function assertSkipCinderOnWorld(
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
  const snapped = resolveSkipCinder(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodSkipCinderBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} Skipping Cinder placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodSkipCinderBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Skipping Cinder shrunk the walk flood at plant`;
  }
  if (!snapped) return null;
  if (skipCinderUnreachable(player, snapped, occupancy)) {
    return `${label} Skipping Cinder unreachable at ${occKey(snapped.origin.x, snapped.origin.y)}`;
  }
  if (!skipCinderIsLineNotSquare(snapped)) {
    return `${label} dest is not a 5-tile orthogonal line`;
  }
  const hopManhattan = skipCinderHopManhattan(snapped);
  if (hopManhattan !== 2 && hopManhattan !== 3) {
    return `${label} hop Manhattan is ${hopManhattan}, want 2 or wrap-3`;
  }
  if (skipCinderWraps(snapped) && hopManhattan !== 3) {
    return `${label} wrap hop is not Manhattan 3`;
  }
  if (!skipCinderWraps(snapped) && hopManhattan !== 2) {
    return `${label} non-wrap hop is not Manhattan 2`;
  }
  for (const cell of skipCinderCells(snapped.origin, snapped.heading)) {
    if (!isOnSkipCinderBattleGraph(cell, player, occupancy)) {
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
    if (isSkipCinderSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
  }
  const hopped = resolveSkipCinderAfterRoundStart(
    snapped,
    player,
    occupancy,
    spawn,
  );
  if (!isOnSkipCinderBattleGraph(skipCinderOrb(hopped), player, occupancy)) {
    return `${label} hop left the fight graph at ${orbKey(hopped)}`;
  }
  if (floodSkipCinderBattleGraph(player, occupancy).size !== walkBefore) {
    return `${label} hop shrunk the walk flood`;
  }
  return null;
}

describe("occupancySkipCinderUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Skipping Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSkipCinderOnWorld(
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

  it("corridorMaze wander Skipping Cinder stays on the fight graph", () => {
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
      const miss = assertSkipCinderOnWorld(
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

  it("chessboard destack Skipping Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSkipCinderOnWorld(
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

  it("Boss Rush destack Skipping Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSkipCinderOnWorld(
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

  it("rest-exit destack Skipping Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertSkipCinderOnWorld(
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
    const snapped = resolveSkipCinder(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (snapped) {
      for (const cell of skipCinderCells(snapped.origin, snapped.heading)) {
        assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
        assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
      }
    }
  });
});
