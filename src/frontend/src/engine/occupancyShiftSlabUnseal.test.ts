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
  SHIFT_SLAB_FEATURE_ID,
  SHIFT_SLAB_GENERATE_MAX,
  SHIFT_SLAB_GENERATE_MIN,
  SHIFT_SLAB_SPAWN_CLEAR,
  type ShiftSlabPair,
  floodShiftSlabBattleGraph,
  isOnShiftSlabBattleGraph,
  isShiftSlabSpawnClear,
  legalizeShiftSlabPlacement,
  legalizeShiftSlabSwap,
  pickShiftSlabCount,
  pickShiftSlabPairs,
  rawShiftSlabPairs,
  rawShiftSlabSwap,
  resolveShiftSlab,
  resolveShiftSlabAfterRoundStart,
  shiftSlabCellsOrthogonal,
  shiftSlabPairKey,
  shiftSlabSealsProgression,
  shiftSlabSharesExisting,
  shiftSlabUnreachable,
  withShiftSlabWalls,
} from "./occupancyShiftSlabUnseal.ts";
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

function pair(open: OccCell, shut: OccCell): ShiftSlabPair {
  return {
    open: { x: open.x, y: open.y },
    shut: { x: shut.x, y: shut.y },
  };
}

function swapAfterRounds(
  start: ShiftSlabPair,
  player: OccCell,
  occupancy: OccupancyContext,
  rounds: number,
): ShiftSlabPair {
  let live = start;
  for (let i = 0; i < rounds; i++) {
    live = resolveShiftSlabAfterRoundStart(live, player, occupancy);
  }
  return live;
}

describe("occupancyShiftSlabUnseal regressions", () => {
  it("seed-shift-slab-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawShiftSlabPairs(occupancy, player);
    assert.equal(
      raw.some(
        (p) =>
          occKey(p.open.x, p.open.y) === occKey(portal.x, portal.y) ||
          occKey(p.shut.x, p.shut.y) === occKey(portal.x, portal.y),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.open.x === 4 && p.open.y === 0) ||
          (p.shut.x === 4 && p.shut.y === 0),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(SHIFT_SLAB_GENERATE_MIN, 1);
    assert.equal(SHIFT_SLAB_GENERATE_MAX, 1);
    assert.equal(SHIFT_SLAB_FEATURE_ID, "WF-OBS-SHIFT_SLAB");
  });

  it("seed-shift-slab-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawShiftSlabPairs(occupancy, spawn);
    assert.equal(isShiftSlabSpawnClear(0, 0, spawn), true);
    assert.equal(isShiftSlabSpawnClear(3, 0, spawn), true);
    assert.equal(isShiftSlabSpawnClear(4, 0, spawn), false);
    assert.equal(SHIFT_SLAB_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some(
        (p) =>
          isShiftSlabSpawnClear(p.open.x, p.open.y, spawn) ||
          isShiftSlabSpawnClear(p.shut.x, p.shut.y, spawn),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.open.x === 4 && p.open.y === 0) ||
          (p.shut.x === 4 && p.shut.y === 0),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-shift-slab-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawShiftSlabPairs(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isShiftSlabSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.open.x === cx && p.open.y === cy) ||
          (p.shut.x === cx && p.shut.y === cy),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.open.x === 0 && p.open.y === 0) ||
          (p.shut.x === 0 && p.shut.y === 0),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-shift-slab-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const stub = {
      extraHazardCount: undefined,
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      0,
      "unlike Gutter Steam min=max=2, Shift Slab must not ride extraHazardRoll",
    );
    assert.equal(pickShiftSlabCount(), SHIFT_SLAB_GENERATE_MIN);
  });

  it("seed-shift-slab-through-portal-far-side: leftover pair snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = pair({ x: 4, y: 0 }, { x: 5, y: 0 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnShiftSlabBattleGraph(dest.open, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(shiftSlabUnreachable(player, dest, occupancy), true);
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnShiftSlabBattleGraph(landed.open, player, occupancy),
      true,
    );
    assert.equal(
      isOnShiftSlabBattleGraph(landed.shut, player, occupancy),
      true,
    );
    assert.notEqual(shiftSlabPairKey(landed), shiftSlabPairKey(dest));
    assert.equal(shiftSlabUnreachable(player, landed, occupancy), false);
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
    assert.equal(
      shiftSlabSealsProgression(player, rawShiftSlabSwap(landed), occupancy),
      false,
    );
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-shift-slab-on-unique-bridge: oscillating wall must not plant on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, F, W],
      [W, W, W, W, W, W, W, W, F, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = pair({ x: 6, y: 1 }, { x: 7, y: 1 });
    const dump = pair({ x: 8, y: 2 }, { x: 8, y: 3 });
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnShiftSlabBattleGraph(dest.open, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      shiftSlabSealsProgression(player, dest, occupancy),
      true,
      "walling one unique-corridor slab must seal the exit",
    );
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump pair");
    assert.notEqual(
      shiftSlabPairKey(landed),
      shiftSlabPairKey(dest),
      "unlike Ember Vein, a unique-corridor Shift Slab must snap off",
    );
    assert.equal(shiftSlabPairKey(landed), shiftSlabPairKey(dump));
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
    assert.equal(
      shiftSlabSealsProgression(player, rawShiftSlabSwap(landed), occupancy),
      false,
    );
    assert.equal(tiles[1][6], F, "must not punch or wall the unique corridor");
    assert.equal(shiftSlabCellsOrthogonal(landed.open, landed.shut), true);
  });

  it("seed-shift-slab-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = pair({ x: 5, y: 1 }, { x: 6, y: 1 });
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 1 }], [player], player);
    assert.equal(shiftSlabSealsProgression(player, dest, occupancy), true);
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-shift-slab-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const landed = legalizeShiftSlabPlacement(
      pair({ x: 4, y: 0 }, { x: 5, y: 0 }),
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnShiftSlabBattleGraph(landed.open, player, occupancy),
      true,
    );
    assert.notEqual(shiftSlabPairKey(landed), "4,0|5,0");
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
  });

  it("seed-shift-slab-onto-void: a generation void is not a legal oscillating wall", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 5, y: 0 }, { x: 4, y: 0 });
    const occupancy = ctxFrom(
      tiles,
      [{ x: 6, y: 0 }],
      [player],
      player,
      new Set(["5,0"]),
    );
    assert.equal(
      rawShiftSlabPairs(occupancy, player).some(
        (p) =>
          occKey(p.open.x, p.open.y) === "5,0" ||
          occKey(p.shut.x, p.shut.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.open.x, landed.open.y), "5,0");
    assert.notEqual(occKey(landed.shut.x, landed.shut.y), "5,0");
    assert.equal(
      isOnShiftSlabBattleGraph(landed.open, player, occupancy),
      true,
    );
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
    const dest = pair({ x: 4, y: 2 }, { x: 4, y: 3 });
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(shiftSlabPairKey(landed), shiftSlabPairKey(dest));
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
    assert.equal(
      shiftSlabSealsProgression(player, rawShiftSlabSwap(landed), occupancy),
      false,
    );
  });

  it("seed-shift-slab-covers-player: walkable plant stays on a destacked player as the open slab", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 1 };
    const dest = pair({ x: 4, y: 1 }, { x: 4, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeShiftSlabPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      occKey(landed.open.x, landed.open.y),
      occKey(player.x, player.y),
      "unlike walk-blockers, covering a destacked player stays — as the open slab",
    );
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
  });

  it("seed-shift-slab-occupied-stays: occupancy-blind dest stays on a dual-path unit as the open slab", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = pair({ x: 4, y: 0 }, { x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.open.x, landed.open.y),
      occKey(boss.x, boss.y),
      "unlike walk-blockers, an occupied fight-graph cell stays as the open slab",
    );
    assert.equal(occupancy.isOccupied(landed.open), true);
    assert.equal(occupancy.isOccupied(landed.shut), false);
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
  });

  it("seed-shift-slab-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 5, y: 0 }, { x: 5, y: 0 });
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const landed = legalizeShiftSlabPlacement(
      pair({ x: 5, y: 0 }, { x: 4, y: 0 }),
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnShiftSlabBattleGraph(landed.open, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.open.x, landed.open.y), "5,0");
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(
      dest.open.x,
      5,
      "fixture dest records the leftover crumb for the punch check",
    );
  });

  it("seed-shift-slab-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveShiftSlab(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodShiftSlabBattleGraph(player, occupancy).size, 0);
    assert.equal(rawShiftSlabPairs(occupancy, player).length, 0);
  });

  it("seed-shift-slab-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dest = pair({ x: 4, y: 2 }, { x: 5, y: 2 });
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(shiftSlabPairKey(landed), shiftSlabPairKey(dest));
    assert.equal(shiftSlabSealsProgression(player, landed, occupancy), false);
    assert.equal(
      shiftSlabSealsProgression(player, rawShiftSlabSwap(landed), occupancy),
      false,
    );
  });

  it("seed-shift-slab-skips-existing: a second blocksWalk roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawShiftSlabPairs(occupancy, player, existing);
    assert.equal(
      raw.some((p) => shiftSlabSharesExisting(p, existing)),
      false,
      "catalog must not stack two blocksWalk features on one cell",
    );
  });

  it("seed-shift-slab-count-one: catalog pick is one pair", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawShiftSlabPairs(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickShiftSlabCount(rng);
      assert.equal(count, SHIFT_SLAB_GENERATE_MIN);
      const picked = pickShiftSlabPairs(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const p of picked) {
        assert.equal(occupancy.portals.has(occKey(p.open.x, p.open.y)), false);
        assert.equal(occupancy.portals.has(occKey(p.shut.x, p.shut.y)), false);
        assert.equal(shiftSlabCellsOrthogonal(p.open, p.shut), true);
      }
    }
  });

  it("seed-shift-slab-not-hourglass-three-rounds: first round start already swaps on a dual path", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 4, y: 2 }, { x: 3, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const afterOne = swapAfterRounds(dest, player, occupancy, 1);
    assert.equal(shiftSlabPairKey(afterOne), shiftSlabPairKey(dest));
    assert.equal(occKey(afterOne.open.x, afterOne.open.y), "3,2");
    assert.equal(occKey(afterOne.shut.x, afterOne.shut.y), "4,2");
    const afterTwo = swapAfterRounds(dest, player, occupancy, 2);
    assert.equal(occKey(afterTwo.open.x, afterTwo.open.y), "4,2");
    assert.equal(
      occKey(afterTwo.shut.x, afterTwo.shut.y),
      "3,2",
      "Hourglass would still be floor after two rounds; Shift Slab has already swapped twice",
    );
  });

  it("seed-shift-slab-not-tide-door-one-cell: pair is two adjacent cells, never a singleton", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dest = pair({ x: 4, y: 1 }, { x: 4, y: 1 });
    const landed = legalizeShiftSlabPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(samePairCells(landed.open, landed.shut), false);
    assert.equal(shiftSlabCellsOrthogonal(landed.open, landed.shut), true);
  });

  it("seed-shift-slab-not-ratchet-cog-walkable: the shut slab is wall occupancy, not HP tax", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 4, y: 2 }, { x: 3, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const openFlood = floodShiftSlabBattleGraph(player, occupancy);
    const shutFlood = floodShiftSlabBattleGraph(
      player,
      withShiftSlabWalls(occupancy, dest),
    );
    assert.equal(openFlood.has("3,2"), true);
    assert.equal(
      shutFlood.has("3,2"),
      false,
      "Ratchet Cog keeps both cells walkable; Shift Slab walls the shut slab",
    );
    assert.equal(shutFlood.has("4,2"), true);
    assert.equal(shiftSlabSealsProgression(player, dest, occupancy), false);
  });

  it("seed-shift-slab-swap-on-unique-bridge-drops: occupancy-blind round start stays open", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, F, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = pair({ x: 5, y: 1 }, { x: 5, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 1 }], [player], player);
    assert.equal(
      shiftSlabSealsProgression(player, rawShiftSlabSwap(dest), occupancy),
      true,
      "walling the unique corridor after a swap must seal the exit",
    );
    const swap = legalizeShiftSlabSwap(dest, player, occupancy);
    assert.equal(swap.kind, "stay");
    if (swap.kind === "stay") {
      assert.equal(swap.reason, "would-seal");
    }
    const after = resolveShiftSlabAfterRoundStart(dest, player, occupancy);
    assert.equal(occKey(after.open.x, after.open.y), "5,1");
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-shift-slab-swap-leftover-stays: round start on a crumb drops the swap", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 4, y: 0 }, { x: 5, y: 0 });
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    assert.equal(isOnShiftSlabBattleGraph(dest.open, player, occupancy), false);
    const swap = legalizeShiftSlabSwap(dest, player, occupancy);
    assert.equal(swap.kind, "stay");
    if (swap.kind === "stay") {
      assert.equal(swap.reason, "off-graph");
    }
    assert.equal(tiles[0][4], F, "leftover crumb stays a floor island");
  });

  it("seed-shift-slab-swap-onto-portal: drop the swap rather than hop the choke", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = pair({ x: 2, y: 0 }, portal);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const swap = legalizeShiftSlabSwap(dest, player, occupancy);
    assert.equal(swap.kind, "stay");
    if (swap.kind === "stay") {
      assert.equal(swap.reason, "off-graph");
    }
  });

  it("seed-shift-slab-swap-onto-void: drop the swap on a generation void", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 3, y: 0 }, { x: 4, y: 0 });
    const occupancy = ctxFrom(
      tiles,
      [{ x: 5, y: 0 }],
      [player],
      player,
      new Set(["4,0"]),
    );
    const swap = legalizeShiftSlabSwap(dest, player, occupancy);
    assert.equal(swap.kind, "stay");
    if (swap.kind === "stay") {
      assert.equal(swap.reason, "off-graph");
    }
  });

  it("seed-shift-slab-swap-occupied-stays: do not wall a required body", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = pair({ x: 4, y: 0 }, { x: 4, y: 1 });
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    const swap = legalizeShiftSlabSwap(dest, player, occupancy);
    assert.equal(swap.kind, "stay");
    if (swap.kind === "stay") {
      assert.equal(swap.reason, "occupied-shut");
    }
  });

  it("seed-shift-slab-dual-path-swap-proceeds: both orientations leave an exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = pair({ x: 4, y: 2 }, { x: 3, y: 2 });
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const swap = legalizeShiftSlabSwap(dest, player, occupancy);
    assert.equal(swap.kind, "swap");
    if (swap.kind === "swap") {
      assert.equal(occKey(swap.pair.open.x, swap.pair.open.y), "3,2");
      assert.equal(occKey(swap.pair.shut.x, swap.pair.shut.y), "4,2");
    }
  });
});

function samePairCells(a: OccCell, b: OccCell): boolean {
  return a.x === b.x && a.y === b.y;
}

function assertShiftSlabOnWorld(
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
  const snapped = resolveShiftSlab(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodShiftSlabBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} slab placed on an empty fight graph`;
    }
    return null;
  }
  for (const slab of snapped) {
    if (!shiftSlabCellsOrthogonal(slab.open, slab.shut)) {
      return `${label} pair is not orthogonal at ${shiftSlabPairKey(slab)}`;
    }
    if (samePairCells(slab.open, slab.shut)) {
      return `${label} pair collapsed to one cell at ${occKey(slab.open.x, slab.open.y)}`;
    }
    if (shiftSlabUnreachable(player, slab, occupancy)) {
      return `${label} Shift Slab unreachable at ${shiftSlabPairKey(slab)}`;
    }
    for (const cell of [slab.open, slab.shut]) {
      if (!isOnShiftSlabBattleGraph(cell, player, occupancy)) {
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
      if (isShiftSlabSpawnClear(cell.x, cell.y, spawn)) {
        return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
      }
    }
    if (shiftSlabSealsProgression(player, slab, occupancy)) {
      return `${label} dest ${shiftSlabPairKey(slab)} seals with the shut slab`;
    }
    if (shiftSlabSealsProgression(player, rawShiftSlabSwap(slab), occupancy)) {
      return `${label} dest ${shiftSlabPairKey(slab)} would seal after swap`;
    }
    const next = resolveShiftSlabAfterRoundStart(slab, player, occupancy);
    if (shiftSlabSealsProgression(player, next, occupancy)) {
      return `${label} swapped dest sealed every exit at ${shiftSlabPairKey(next)}`;
    }
  }
  const keys = new Set(snapped.map((p) => shiftSlabPairKey(p)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two slabs on one pair`;
  }
  return null;
}

describe("occupancyShiftSlabUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Shift Slab stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShiftSlabOnWorld(
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

  it("corridorMaze wander Shift Slab stays on the fight graph", () => {
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
      const miss = assertShiftSlabOnWorld(
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

  it("chessboard destack Shift Slab stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShiftSlabOnWorld(
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

  it("Boss Rush destack Shift Slab stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShiftSlabOnWorld(
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

  it("rest-exit destack Shift Slab stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertShiftSlabOnWorld(
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
    const snapped = resolveShiftSlab(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const slab of snapped) {
      assert.ok(slab.open.x >= 0 && slab.open.x < WORLD_GRID_SIZE);
      assert.ok(slab.open.y >= 0 && slab.open.y < WORLD_GRID_SIZE);
      assert.ok(slab.shut.x >= 0 && slab.shut.x < WORLD_GRID_SIZE);
      assert.ok(slab.shut.y >= 0 && slab.shut.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= SHIFT_SLAB_GENERATE_MAX);
  });
});
