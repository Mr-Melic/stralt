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
import {
  type OccCell,
  type OccupancyContext,
  occKey,
  occupancyVacating,
} from "./occupancy.ts";
import {
  SPENT_BRIDGE_CROSSINGS,
  SPENT_BRIDGE_FEATURE_ID,
  SPENT_BRIDGE_GENERATE_MAX,
  SPENT_BRIDGE_GENERATE_MIN,
  SPENT_BRIDGE_SPAWN_CLEAR,
  floodSpentBridgeBattleGraph,
  initialSpentBridgeState,
  isOnSpentBridgeBattleGraph,
  isSpentBridgeSpawnClear,
  legalizeSpentBridgeCollapse,
  legalizeSpentBridgePlacement,
  pickSpentBridgeCount,
  pickSpentBridgeDests,
  rawSpentBridgeCollapse,
  rawSpentBridgeDests,
  resolveSpentBridge,
  resolveSpentBridgeAfterLeave,
  spentBridgeIsWall,
  spentBridgeSealsProgression,
  spentBridgeUnreachable,
} from "./occupancySpentBridgeUnseal.ts";
import { extraHazardRoll, getWorldFeature } from "./worldFeatures.ts";

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

const ORTH: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function neighborAfterLeave(
  cell: OccCell,
  player: OccCell,
  occupancy: OccupancyContext,
): OccCell {
  if (occKey(player.x, player.y) !== occKey(cell.x, cell.y)) return player;
  for (const [dx, dy] of ORTH) {
    const next = { x: cell.x + dx, y: cell.y + dy };
    if (isOnSpentBridgeBattleGraph(next, player, occupancy)) return next;
  }
  return player;
}

function collapseAfterLeaves(
  cell: OccCell,
  player: OccCell,
  occupancy: OccupancyContext,
  leaves: number,
) {
  let state = initialSpentBridgeState(cell);
  const vacated = occupancyVacating(occupancy, cell);
  const start = neighborAfterLeave(cell, player, vacated);
  for (let i = 0; i < leaves; i++) {
    state = resolveSpentBridgeAfterLeave(state, cell, start, vacated);
  }
  return state;
}

describe("occupancySpentBridgeUnseal regressions", () => {
  it("seed-spent-bridge-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawSpentBridgeDests(occupancy, player);
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
    assert.equal(SPENT_BRIDGE_GENERATE_MIN, 1);
    assert.equal(SPENT_BRIDGE_GENERATE_MAX, 1);
    assert.equal(SPENT_BRIDGE_CROSSINGS, 3);
    assert.equal(SPENT_BRIDGE_FEATURE_ID, "WF-OBS-SPENT_BRIDGE");
  });

  it("seed-spent-bridge-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawSpentBridgeDests(occupancy, spawn);
    assert.equal(isSpentBridgeSpawnClear(0, 0, spawn), true);
    assert.equal(isSpentBridgeSpawnClear(3, 0, spawn), true);
    assert.equal(isSpentBridgeSpawnClear(4, 0, spawn), false);
    assert.equal(SPENT_BRIDGE_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isSpentBridgeSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-spent-bridge-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawSpentBridgeDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isSpentBridgeSpawnClear(cx, cy, spawn),
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

  it("seed-spent-bridge-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const feature = getWorldFeature(SPENT_BRIDGE_FEATURE_ID);
    assert.ok(feature);
    assert.equal(feature.extraHazardCount, undefined);
    assert.equal(feature.blocksWalk, true);
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(feature, rng),
      0,
      "unlike Gutter Steam min=max=2, Spent Bridge must not ride extraHazardRoll",
    );
    assert.equal(pickSpentBridgeCount(), SPENT_BRIDGE_GENERATE_MIN);
  });

  it("seed-spent-bridge-through-portal-far-side: leftover dest snaps onto the fight graph", () => {
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
      isOnSpentBridgeBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(spentBridgeUnreachable(player, [dest], occupancy), true);
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnSpentBridgeBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(spentBridgeUnreachable(player, [landed], occupancy), false);
    assert.equal(
      spentBridgeSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-spent-bridge-on-unique-bridge: delayed wall must not plant on the corridor", () => {
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
      isOnSpentBridgeBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      spentBridgeSealsProgression(player, [dest], occupancy),
      true,
      "walling the unique corridor after three leaves must seal the exit",
    );
    const walkBefore = floodSpentBridgeBattleGraph(player, occupancy).size;
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike Ember Vein, a unique-corridor Spent Bridge must snap off",
    );
    assert.equal(isOnSpentBridgeBattleGraph(landed, player, occupancy), true);
    assert.equal(
      spentBridgeSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dump.x, dump.y),
      "dump alcove outside spawn±3 is the legal plant",
    );
    assert.equal(tiles[1][6], F, "must not punch or wall the unique corridor");
    assert.equal(
      floodSpentBridgeBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — unlike walk-blockers the flood does not shrink yet",
    );
  });

  it("seed-spent-bridge-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(spentBridgeSealsProgression(player, [dest], occupancy), true);
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-spent-bridge-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeSpentBridgePlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnSpentBridgeBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(
      spentBridgeSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-spent-bridge-onto-void: a generation void is not a legal delayed wall", () => {
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
      rawSpentBridgeDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnSpentBridgeBattleGraph(landed, player, occupancy), true);
  });

  it("seed-open-field-bridge-noop: already-legal dests are unchanged", () => {
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
    assert.equal(isSpentBridgeSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      spentBridgeSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-spent-bridge-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeSpentBridgePlacement(
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
    assert.equal(
      spentBridgeSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-spent-bridge-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isSpentBridgeSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike walk-blockers, an occupied fight-graph cell stays — collapse waits for the leave",
    );
    assert.equal(occupancy.isOccupied(landed), true);
    assert.equal(
      spentBridgeSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-spent-bridge-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnSpentBridgeBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
  });

  it("seed-spent-bridge-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveSpentBridge(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodSpentBridgeBattleGraph(player, occupancy).size, 0);
    assert.equal(rawSpentBridgeDests(occupancy, player).length, 0);
  });

  it("seed-spent-bridge-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dest = { x: 4, y: 2 };
    const landed = legalizeSpentBridgePlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      spentBridgeSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-spent-bridge-skips-existing: a second blocksWalk roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawSpentBridgeDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog must not stack two blocksWalk features on one cell",
    );
  });

  it("seed-spent-bridge-count-one: catalog pick is one cell", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawSpentBridgeDests(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickSpentBridgeCount(rng);
      assert.equal(count, SPENT_BRIDGE_GENERATE_MIN);
      const picked = pickSpentBridgeDests(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isSpentBridgeSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-spent-bridge-two-leaves-still-floor: collapse waits for the third leave", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const afterTwo = collapseAfterLeaves(dest, player, occupancy, 2);
    assert.equal(afterTwo.pipsLeft, 1);
    assert.equal(spentBridgeIsWall(afterTwo), false);
    const raw = rawSpentBridgeCollapse(afterTwo, dest);
    assert.equal(raw.kind, "stay");
    if (raw.kind === "stay") {
      assert.equal(raw.reason, "pips-remain");
    }
    assert.equal(tiles[1][4], F);
  });

  it("seed-spent-bridge-three-leaves-collapse: dual-path third leave becomes a wall", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const afterThree = collapseAfterLeaves(dest, player, occupancy, 3);
    assert.equal(afterThree.pipsLeft, 0);
    assert.equal(spentBridgeIsWall(afterThree), true);
    assert.equal(spentBridgeSealsProgression(player, [dest], occupancy), false);
  });

  it("seed-spent-bridge-collapse-on-unique-bridge-drops: occupancy-blind third leave stays floor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 1 }], [player], player);
    assert.equal(spentBridgeSealsProgression(player, [dest], occupancy), true);
    const state = collapseAfterLeaves(dest, player, occupancy, 3);
    assert.equal(
      spentBridgeIsWall(state),
      false,
      "must not seal the only exit",
    );
    assert.equal(state.pipsLeft, 0);
    const collapse = legalizeSpentBridgeCollapse(
      state,
      dest,
      player,
      occupancy,
    );
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "would-seal");
    }
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-spent-bridge-collapse-leftover-stays: third leave on a crumb drops the wall-off", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    assert.equal(isOnSpentBridgeBattleGraph(dest, player, occupancy), false);
    const state = collapseAfterLeaves(dest, player, occupancy, 3);
    assert.equal(spentBridgeIsWall(state), false);
    const collapse = legalizeSpentBridgeCollapse(
      state,
      dest,
      player,
      occupancy,
    );
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "off-graph");
    }
    assert.equal(tiles[0][4], F, "leftover crumb stays a floor island");
  });

  it("seed-spent-bridge-collapse-onto-portal: drop the wall-off rather than hop the choke", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const state = collapseAfterLeaves(portal, player, occupancy, 3);
    assert.equal(spentBridgeIsWall(state), false);
    const collapse = legalizeSpentBridgeCollapse(
      state,
      portal,
      player,
      occupancy,
    );
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "off-graph");
    }
  });

  it("seed-spent-bridge-collapse-onto-void: drop the wall-off on a generation void", () => {
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
    const state = collapseAfterLeaves(dest, player, occupancy, 3);
    assert.equal(spentBridgeIsWall(state), false);
    const collapse = legalizeSpentBridgeCollapse(
      state,
      dest,
      player,
      occupancy,
    );
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "off-graph");
    }
  });

  it("seed-spent-bridge-not-on-bridge: leaving a different cell does not burn a pip", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const state = resolveSpentBridgeAfterLeave(
      initialSpentBridgeState(dest),
      { x: 3, y: 1 },
      player,
      occupancy,
    );
    assert.equal(state.pipsLeft, SPENT_BRIDGE_CROSSINGS);
    assert.equal(spentBridgeIsWall(state), false);
  });
});

function assertSpentBridgeOnWorld(
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
  const snapped = resolveSpentBridge(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodSpentBridgeBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} bridge placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodSpentBridgeBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Spent Bridge shrunk the walk flood at plant`;
  }
  for (const cell of snapped) {
    if (spentBridgeUnreachable(player, [cell], occupancy)) {
      return `${label} Spent Bridge unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnSpentBridgeBattleGraph(cell, player, occupancy)) {
      return `${label} bridge misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (isSpentBridgeSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (
      occKey(cell.x, cell.y) !== occKey(player.x, player.y) &&
      spentBridgeSealsProgression(player, [cell], occupancy)
    ) {
      return `${label} dest ${occKey(cell.x, cell.y)} would seal after collapse`;
    }
    const vacated = occupancyVacating(occupancy, cell);
    const start = neighborAfterLeave(cell, player, vacated);
    const collapsed = collapseAfterLeaves(cell, player, occupancy, 3);
    if (
      spentBridgeIsWall(collapsed) &&
      spentBridgeSealsProgression(start, [cell], vacated)
    ) {
      return `${label} collapsed dest sealed every exit at ${occKey(cell.x, cell.y)}`;
    }
    if (
      occKey(cell.x, cell.y) !== occKey(player.x, player.y) &&
      !spentBridgeIsWall(collapsed)
    ) {
      return `${label} legal dual-path dest refused to collapse at ${occKey(cell.x, cell.y)}`;
    }
  }
  if (spentBridgeSealsProgression(player, snapped, occupancy)) {
    return `${label} bridges jointly sealed every exit`;
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two bridges on one cell`;
  }
  return null;
}

describe("occupancySpentBridgeUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Spent Bridge stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSpentBridgeOnWorld(
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

  it("corridorMaze wander Spent Bridge stays on the fight graph", () => {
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
      const miss = assertSpentBridgeOnWorld(
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

  it("chessboard destack Spent Bridge stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSpentBridgeOnWorld(
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

  it("Boss Rush destack Spent Bridge stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSpentBridgeOnWorld(
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

  it("rest-exit destack Spent Bridge stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertSpentBridgeOnWorld(
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
    const snapped = resolveSpentBridge(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= SPENT_BRIDGE_GENERATE_MAX);
  });
});
