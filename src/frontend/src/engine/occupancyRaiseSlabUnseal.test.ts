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
  RAISE_SLAB_AP,
  RAISE_SLAB_FEATURE_ID,
  RAISE_SLAB_GENERATE_MAX,
  RAISE_SLAB_GENERATE_MIN,
  RAISE_SLAB_SPAWN_CLEAR,
  floodRaiseSlabBattleGraph,
  initialRaiseSlabState,
  isAdjacentRaiseSlab,
  isOnRaiseSlabBattleGraph,
  isRaiseSlabSpawnClear,
  legalizeRaiseSlabPlacement,
  legalizeRaiseSlabRaise,
  pickRaiseSlabCount,
  pickRaiseSlabDests,
  raiseSlabIsWall,
  raiseSlabSealsProgression,
  raiseSlabUnreachable,
  rawRaiseSlabDests,
  rawRaiseSlabRaise,
  resolveRaiseSlab,
  resolveRaiseSlabAfterRaise,
} from "./occupancyRaiseSlabUnseal.ts";
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

function adjacentRaiser(
  cell: OccCell,
  player: OccCell,
  occupancy: OccupancyContext,
): OccCell | null {
  if (isAdjacentRaiseSlab(player, cell)) return player;
  const dirs: ReadonlyArray<readonly [number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dx, dy] of dirs) {
    const n = { x: cell.x + dx, y: cell.y + dy };
    if (!isOnRaiseSlabBattleGraph(n, player, occupancy)) continue;
    if (occupancy.portals.has(occKey(n.x, n.y))) continue;
    return n;
  }
  return null;
}

describe("occupancyRaiseSlabUnseal regressions", () => {
  it("seed-raise-slab-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawRaiseSlabDests(occupancy, player);
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
    assert.equal(RAISE_SLAB_GENERATE_MIN, 1);
    assert.equal(RAISE_SLAB_GENERATE_MAX, 1);
    assert.equal(RAISE_SLAB_AP, 1);
    assert.equal(RAISE_SLAB_FEATURE_ID, "WF-TER-RAISE_SLAB");
  });

  it("seed-raise-slab-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawRaiseSlabDests(occupancy, spawn);
    assert.equal(isRaiseSlabSpawnClear(0, 0, spawn), true);
    assert.equal(isRaiseSlabSpawnClear(3, 0, spawn), true);
    assert.equal(isRaiseSlabSpawnClear(4, 0, spawn), false);
    assert.equal(RAISE_SLAB_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isRaiseSlabSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-raise-slab-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawRaiseSlabDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isRaiseSlabSpawnClear(cx, cy, spawn),
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
  });

  it("seed-raise-slab-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const stub = {
      extraHazardCount: undefined,
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      0,
      "unlike Gutter Steam min=max=2, Raise Slab must not ride extraHazardRoll",
    );
    assert.equal(pickRaiseSlabCount(), RAISE_SLAB_GENERATE_MIN);
  });

  it("seed-raise-slab-through-portal-far-side: leftover dest snaps onto the fight graph", () => {
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
      isOnRaiseSlabBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(raiseSlabUnreachable(player, [dest], occupancy), true);
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnRaiseSlabBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(raiseSlabUnreachable(player, [landed], occupancy), false);
    assert.equal(raiseSlabSealsProgression(player, [landed], occupancy), false);
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-raise-slab-on-unique-bridge: delayed wall must not plant on the corridor", () => {
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
      isOnRaiseSlabBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      raiseSlabSealsProgression(player, [dest], occupancy),
      true,
      "walling the unique corridor after 1 AP must seal the exit",
    );
    const walkBefore = floodRaiseSlabBattleGraph(player, occupancy).size;
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike Ember Vein, a unique-corridor Raise Slab must snap off",
    );
    assert.equal(isOnRaiseSlabBattleGraph(landed, player, occupancy), true);
    assert.equal(raiseSlabSealsProgression(player, [landed], occupancy), false);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dump.x, dump.y),
      "dump alcove outside spawn±3 is the legal plant",
    );
    assert.equal(tiles[1][6], F, "must not punch or wall the unique corridor");
    assert.equal(
      floodRaiseSlabBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — unlike walk-blockers the flood does not shrink yet",
    );
  });

  it("seed-raise-slab-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(raiseSlabSealsProgression(player, [dest], occupancy), true);
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-raise-slab-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRaiseSlabPlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnRaiseSlabBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(raiseSlabSealsProgression(player, [landed], occupancy), false);
  });

  it("seed-raise-slab-onto-void: a generation void is not a legal delayed wall", () => {
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
      rawRaiseSlabDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnRaiseSlabBattleGraph(landed, player, occupancy), true);
  });

  it("seed-open-field-slab-noop: already-legal dests are unchanged", () => {
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
    assert.equal(isRaiseSlabSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      raiseSlabSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-raise-slab-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeRaiseSlabPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike walk-blockers, covering a destacked player stays — the cell is still floor",
    );
    assert.equal(raiseSlabSealsProgression(player, [landed], occupancy), false);
  });

  it("seed-raise-slab-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isRaiseSlabSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike walk-blockers, an occupied fight-graph cell stays — pry waits for 1 AP",
    );
    assert.equal(occupancy.isOccupied(landed), true);
    assert.equal(raiseSlabSealsProgression(player, [landed], occupancy), false);
  });

  it("seed-raise-slab-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnRaiseSlabBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
  });

  it("seed-raise-slab-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveRaiseSlab(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodRaiseSlabBattleGraph(player, occupancy).size, 0);
    assert.equal(rawRaiseSlabDests(occupancy, player).length, 0);
  });

  it("seed-raise-slab-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dest = { x: 4, y: 2 };
    const landed = legalizeRaiseSlabPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      raiseSlabSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-raise-slab-skips-existing: a second blocksWalk roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawRaiseSlabDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog must not stack two blocksWalk features on one cell",
    );
  });

  it("seed-raise-slab-count-one: catalog pick is one cell, not a Shift Slab pair", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawRaiseSlabDests(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickRaiseSlabCount(rng);
      assert.equal(count, RAISE_SLAB_GENERATE_MIN);
      const picked = pickRaiseSlabDests(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isRaiseSlabSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-raise-slab-not-hourglass-round: three round-starts do not pry the slab", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const state = initialRaiseSlabState(dest);
    assert.equal(raiseSlabIsWall(state), false);
    const raw = rawRaiseSlabRaise(state, player, RAISE_SLAB_AP);
    assert.equal(raw.kind, "stay");
    if (raw.kind === "stay") {
      assert.equal(raw.reason, "not-adjacent");
    }
    assert.equal(tiles[1][4], F, "Hourglass would wall after three ticks");
  });

  it("seed-raise-slab-not-spent-bridge-leave: leaving the cell does not pry", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const idle = initialRaiseSlabState(dest);
    assert.equal(
      raiseSlabIsWall(idle),
      false,
      "a leave is not a 1 AP pry — Spent Bridge would burn a pip here",
    );
    assert.equal(isAdjacentRaiseSlab(player, dest), false);
    assert.equal(tiles[1][4], F);
  });

  it("seed-raise-slab-1-ap-adjacent-raises: dual-path adjacent 1 AP becomes a wall", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 3, y: 2 };
    const dest = { x: 4, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    assert.equal(isAdjacentRaiseSlab(player, dest), true);
    assert.equal(raiseSlabSealsProgression(player, [dest], occupancy), false);
    const raised = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      player,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(raised), true);
    assert.equal(raised.cell.x, dest.x);
    assert.equal(raised.cell.y, dest.y);
  });

  it("seed-raise-slab-0-ap-stays: pry without AP stays floor", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 3, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawRaiseSlabRaise(initialRaiseSlabState(dest), player, 0);
    assert.equal(raw.kind, "stay");
    if (raw.kind === "stay") {
      assert.equal(raw.reason, "no-ap");
    }
    const raised = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      player,
      player,
      occupancy,
      0,
    );
    assert.equal(raiseSlabIsWall(raised), false);
  });

  it("seed-raise-slab-cannot-lower: a raised slab stays a wall", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 3, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raised = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      player,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(raised), true);
    const again = rawRaiseSlabRaise(raised, player, RAISE_SLAB_AP);
    assert.equal(again.kind, "stay");
    if (again.kind === "stay") {
      assert.equal(again.reason, "already-raised");
    }
    const still = resolveRaiseSlabAfterRaise(
      raised,
      player,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(still), true);
  });

  it("seed-raise-slab-not-cinder-barrel-roll: pry walls in place and does not hop", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 3, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raised = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      player,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(raised), true);
    assert.equal(
      occKey(raised.cell.x, raised.cell.y),
      occKey(dest.x, dest.y),
      "Cinder Barrel 1 AP hops a cardinal; Raise Slab stays on the painted cell",
    );
  });

  it("seed-raise-slab-raise-on-unique-bridge-drops: occupancy-blind 1 AP stays floor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 4, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 1 }], [player], player);
    assert.equal(raiseSlabSealsProgression(player, [dest], occupancy), true);
    assert.equal(isAdjacentRaiseSlab(player, dest), true);
    const state = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      player,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(state), false, "must not seal the only exit");
    const action = legalizeRaiseSlabRaise(
      initialRaiseSlabState(dest),
      player,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "would-seal");
    }
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-raise-slab-raise-leftover-stays: 1 AP on a crumb drops the pry", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 0 };
    const actor = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    assert.equal(isOnRaiseSlabBattleGraph(dest, player, occupancy), false);
    assert.equal(isAdjacentRaiseSlab(actor, dest), true);
    const state = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(state), false);
    const action = legalizeRaiseSlabRaise(
      initialRaiseSlabState(dest),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[0][4], F, "leftover crumb stays a floor island");
  });

  it("seed-raise-slab-raise-onto-portal: drop the pry rather than hop the choke", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const actor = { x: 2, y: 0 };
    const state = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(portal),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(state), false);
    const action = legalizeRaiseSlabRaise(
      initialRaiseSlabState(portal),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-raise-slab-raise-onto-void: drop the pry on a generation void", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 5, y: 0 }],
      [player],
      player,
      new Set(["4,0"]),
    );
    const actor = { x: 3, y: 0 };
    const state = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(state), false);
    const action = legalizeRaiseSlabRaise(
      initialRaiseSlabState(dest),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-raise-slab-occupied-raise-drops: 1 AP must not wall a living body", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const actor = { x: 3, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isAdjacentRaiseSlab(actor, dest), true);
    const action = legalizeRaiseSlabRaise(
      initialRaiseSlabState(dest),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "occupied");
    }
    const raised = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(dest),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    assert.equal(raiseSlabIsWall(raised), false);
  });
});

function assertRaiseSlabOnWorld(
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
  const snapped = resolveRaiseSlab(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodRaiseSlabBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} slab placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodRaiseSlabBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Raise Slab shrunk the walk flood at plant`;
  }
  for (const cell of snapped) {
    if (raiseSlabUnreachable(player, [cell], occupancy)) {
      return `${label} Raise Slab unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnRaiseSlabBattleGraph(cell, player, occupancy)) {
      return `${label} slab misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (isRaiseSlabSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (
      occKey(cell.x, cell.y) !== occKey(player.x, player.y) &&
      raiseSlabSealsProgression(player, [cell], occupancy)
    ) {
      return `${label} dest ${occKey(cell.x, cell.y)} would seal after raise`;
    }
    const actor = adjacentRaiser(cell, player, occupancy);
    if (!actor) continue;
    const raised = resolveRaiseSlabAfterRaise(
      initialRaiseSlabState(cell),
      actor,
      player,
      occupancy,
      RAISE_SLAB_AP,
    );
    if (occupancy.isOccupied(cell)) {
      if (raiseSlabIsWall(raised)) {
        return `${label} occupied dest walled a living body at ${occKey(cell.x, cell.y)}`;
      }
      continue;
    }
    if (
      raiseSlabIsWall(raised) &&
      raiseSlabSealsProgression(player, [cell], occupancy)
    ) {
      return `${label} raised dest sealed every exit at ${occKey(cell.x, cell.y)}`;
    }
    if (
      occKey(cell.x, cell.y) !== occKey(player.x, player.y) &&
      !raiseSlabIsWall(raised)
    ) {
      return `${label} legal dual-path dest refused to raise at ${occKey(cell.x, cell.y)}`;
    }
  }
  if (raiseSlabSealsProgression(player, snapped, occupancy)) {
    return `${label} slabs jointly sealed every exit`;
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two slabs on one cell`;
  }
  return null;
}

describe("occupancyRaiseSlabUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Raise Slab stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRaiseSlabOnWorld(
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

  it("corridorMaze wander Raise Slab stays on the fight graph", () => {
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
      const miss = assertRaiseSlabOnWorld(
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

  it("chessboard destack Raise Slab stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRaiseSlabOnWorld(
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

  it("Boss Rush destack Raise Slab stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRaiseSlabOnWorld(
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

  it("rest-exit destack Raise Slab stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertRaiseSlabOnWorld(
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
    const snapped = resolveRaiseSlab(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= RAISE_SLAB_GENERATE_MAX);
  });
});
