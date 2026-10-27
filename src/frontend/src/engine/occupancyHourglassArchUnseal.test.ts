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
  HOURGLASS_ARCH_FEATURE_ID,
  HOURGLASS_ARCH_GENERATE_MAX,
  HOURGLASS_ARCH_GENERATE_MIN,
  HOURGLASS_ARCH_ROUNDS,
  HOURGLASS_ARCH_SPAWN_CLEAR,
  floodHourglassArchBattleGraph,
  hourglassArchIsWall,
  hourglassArchSealsProgression,
  hourglassArchUnreachable,
  initialHourglassArchState,
  isHourglassArchSpawnClear,
  isOnHourglassArchBattleGraph,
  legalizeHourglassArchCollapse,
  legalizeHourglassArchPlacement,
  pickHourglassArchCount,
  pickHourglassArchDests,
  rawHourglassArchCollapse,
  rawHourglassArchDests,
  resolveHourglassArch,
  resolveHourglassArchAfterRoundStart,
} from "./occupancyHourglassArchUnseal.ts";
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

function collapseAfterRounds(
  cell: OccCell,
  player: OccCell,
  occupancy: OccupancyContext,
  rounds: number,
) {
  let state = initialHourglassArchState(cell);
  for (let i = 0; i < rounds; i++) {
    state = resolveHourglassArchAfterRoundStart(state, player, occupancy);
  }
  return state;
}

describe("occupancyHourglassArchUnseal regressions", () => {
  it("seed-hourglass-arch-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawHourglassArchDests(occupancy, player);
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
    assert.equal(HOURGLASS_ARCH_GENERATE_MIN, 1);
    assert.equal(HOURGLASS_ARCH_GENERATE_MAX, 1);
    assert.equal(HOURGLASS_ARCH_ROUNDS, 3);
    assert.equal(HOURGLASS_ARCH_FEATURE_ID, "WF-OBS-HOURGLASS_ARCH");
  });

  it("seed-hourglass-arch-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawHourglassArchDests(occupancy, spawn);
    assert.equal(isHourglassArchSpawnClear(0, 0, spawn), true);
    assert.equal(isHourglassArchSpawnClear(3, 0, spawn), true);
    assert.equal(isHourglassArchSpawnClear(4, 0, spawn), false);
    assert.equal(HOURGLASS_ARCH_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isHourglassArchSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-hourglass-arch-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawHourglassArchDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isHourglassArchSpawnClear(cx, cy, spawn),
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

  it("seed-hourglass-arch-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const stub = {
      extraHazardCount: undefined,
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      0,
      "unlike Gutter Steam min=max=2, Hourglass Arch must not ride extraHazardRoll",
    );
    assert.equal(pickHourglassArchCount(), HOURGLASS_ARCH_GENERATE_MIN);
  });

  it("seed-hourglass-arch-through-portal-far-side: leftover dest snaps onto the fight graph", () => {
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
      isOnHourglassArchBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(hourglassArchUnreachable(player, [dest], occupancy), true);
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnHourglassArchBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(hourglassArchUnreachable(player, [landed], occupancy), false);
    assert.equal(
      hourglassArchSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-hourglass-arch-on-unique-bridge: delayed wall must not plant on the corridor", () => {
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
      isOnHourglassArchBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      hourglassArchSealsProgression(player, [dest], occupancy),
      true,
      "walling the unique corridor after three rounds must seal the exit",
    );
    const walkBefore = floodHourglassArchBattleGraph(player, occupancy).size;
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike Ember Vein, a unique-corridor Hourglass Arch must snap off",
    );
    assert.equal(isOnHourglassArchBattleGraph(landed, player, occupancy), true);
    assert.equal(
      hourglassArchSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dump.x, dump.y),
      "dump alcove outside spawn±3 is the legal plant",
    );
    assert.equal(tiles[1][6], F, "must not punch or wall the unique corridor");
    assert.equal(
      floodHourglassArchBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — unlike walk-blockers the flood does not shrink yet",
    );
  });

  it("seed-hourglass-arch-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      hourglassArchSealsProgression(player, [dest], occupancy),
      true,
    );
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-hourglass-arch-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeHourglassArchPlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnHourglassArchBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(
      hourglassArchSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-hourglass-arch-onto-void: a generation void is not a legal delayed wall", () => {
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
      rawHourglassArchDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnHourglassArchBattleGraph(landed, player, occupancy), true);
  });

  it("seed-open-field-arch-noop: already-legal dests are unchanged", () => {
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
    assert.equal(isHourglassArchSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      hourglassArchSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-hourglass-arch-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeHourglassArchPlacement(
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
      hourglassArchSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-hourglass-arch-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isHourglassArchSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike walk-blockers, an occupied fight-graph cell stays — collapse waits for the timer",
    );
    assert.equal(occupancy.isOccupied(landed), true);
    assert.equal(
      hourglassArchSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-hourglass-arch-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnHourglassArchBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
  });

  it("seed-hourglass-arch-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveHourglassArch(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodHourglassArchBattleGraph(player, occupancy).size, 0);
    assert.equal(rawHourglassArchDests(occupancy, player).length, 0);
  });

  it("seed-hourglass-arch-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dest = { x: 4, y: 2 };
    const landed = legalizeHourglassArchPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      hourglassArchSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-hourglass-arch-skips-existing: a second blocksWalk roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawHourglassArchDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog must not stack two blocksWalk features on one cell",
    );
  });

  it("seed-hourglass-arch-count-one: catalog pick is one cell", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawHourglassArchDests(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickHourglassArchCount(rng);
      assert.equal(count, HOURGLASS_ARCH_GENERATE_MIN);
      const picked = pickHourglassArchDests(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isHourglassArchSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-hourglass-arch-two-rounds-still-floor: collapse waits for the third round start", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const afterTwo = collapseAfterRounds(dest, player, occupancy, 2);
    assert.equal(afterTwo.pipsLeft, 1);
    assert.equal(hourglassArchIsWall(afterTwo), false);
    const raw = rawHourglassArchCollapse(afterTwo);
    assert.equal(raw.kind, "stay");
    if (raw.kind === "stay") {
      assert.equal(raw.reason, "pips-remain");
    }
    assert.equal(tiles[1][4], F);
  });

  it("seed-hourglass-arch-three-rounds-no-leave: dual-path third round start becomes a wall without anyone leaving", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    assert.equal(
      occKey(player.x, player.y) === occKey(dest.x, dest.y),
      false,
      "nobody occupies the arch — Spent Bridge would still be floor",
    );
    const afterThree = collapseAfterRounds(dest, player, occupancy, 3);
    assert.equal(afterThree.pipsLeft, 0);
    assert.equal(hourglassArchIsWall(afterThree), true);
    assert.equal(
      hourglassArchSealsProgression(player, [dest], occupancy),
      false,
    );
  });

  it("seed-hourglass-arch-not-spent-bridge-leave: leaving the cell does not burn a pip", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    let state = initialHourglassArchState(dest);
    state = resolveHourglassArchAfterRoundStart(state, player, occupancy);
    assert.equal(state.pipsLeft, HOURGLASS_ARCH_ROUNDS - 1);
    const afterIdle = initialHourglassArchState(dest);
    assert.equal(
      afterIdle.pipsLeft,
      HOURGLASS_ARCH_ROUNDS,
      "a leave is not a round start — Spent Bridge would burn a pip here",
    );
    assert.equal(hourglassArchIsWall(afterIdle), false);
  });

  it("seed-hourglass-arch-collapse-on-unique-bridge-drops: occupancy-blind third round stays floor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 1 }], [player], player);
    assert.equal(
      hourglassArchSealsProgression(player, [dest], occupancy),
      true,
    );
    const state = collapseAfterRounds(dest, player, occupancy, 3);
    assert.equal(
      hourglassArchIsWall(state),
      false,
      "must not seal the only exit",
    );
    assert.equal(state.pipsLeft, 0);
    const collapse = legalizeHourglassArchCollapse(state, player, occupancy);
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "would-seal");
    }
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-hourglass-arch-collapse-leftover-stays: third round on a crumb drops the wall-off", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    assert.equal(isOnHourglassArchBattleGraph(dest, player, occupancy), false);
    const state = collapseAfterRounds(dest, player, occupancy, 3);
    assert.equal(hourglassArchIsWall(state), false);
    const collapse = legalizeHourglassArchCollapse(state, player, occupancy);
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "off-graph");
    }
    assert.equal(tiles[0][4], F, "leftover crumb stays a floor island");
  });

  it("seed-hourglass-arch-collapse-onto-portal: drop the wall-off rather than hop the choke", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const state = collapseAfterRounds(portal, player, occupancy, 3);
    assert.equal(hourglassArchIsWall(state), false);
    const collapse = legalizeHourglassArchCollapse(state, player, occupancy);
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "off-graph");
    }
  });

  it("seed-hourglass-arch-collapse-onto-void: drop the wall-off on a generation void", () => {
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
    const state = collapseAfterRounds(dest, player, occupancy, 3);
    assert.equal(hourglassArchIsWall(state), false);
    const collapse = legalizeHourglassArchCollapse(state, player, occupancy);
    assert.equal(collapse.kind, "stay");
    if (collapse.kind === "stay") {
      assert.equal(collapse.reason, "off-graph");
    }
  });
});

function assertHourglassArchOnWorld(
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
  const snapped = resolveHourglassArch(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodHourglassArchBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} arch placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodHourglassArchBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Hourglass Arch shrunk the walk flood at plant`;
  }
  for (const cell of snapped) {
    if (hourglassArchUnreachable(player, [cell], occupancy)) {
      return `${label} Hourglass Arch unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnHourglassArchBattleGraph(cell, player, occupancy)) {
      return `${label} arch misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (isHourglassArchSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (
      occKey(cell.x, cell.y) !== occKey(player.x, player.y) &&
      hourglassArchSealsProgression(player, [cell], occupancy)
    ) {
      return `${label} dest ${occKey(cell.x, cell.y)} would seal after collapse`;
    }
    const collapsed = collapseAfterRounds(cell, player, occupancy, 3);
    if (
      hourglassArchIsWall(collapsed) &&
      hourglassArchSealsProgression(player, [cell], occupancy)
    ) {
      return `${label} collapsed dest sealed every exit at ${occKey(cell.x, cell.y)}`;
    }
    if (
      occKey(cell.x, cell.y) !== occKey(player.x, player.y) &&
      !hourglassArchIsWall(collapsed)
    ) {
      return `${label} legal dual-path dest refused to collapse at ${occKey(cell.x, cell.y)}`;
    }
  }
  if (hourglassArchSealsProgression(player, snapped, occupancy)) {
    return `${label} arches jointly sealed every exit`;
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two arches on one cell`;
  }
  return null;
}

describe("occupancyHourglassArchUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Hourglass Arch stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertHourglassArchOnWorld(
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

  it("corridorMaze wander Hourglass Arch stays on the fight graph", () => {
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
      const miss = assertHourglassArchOnWorld(
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

  it("chessboard destack Hourglass Arch stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertHourglassArchOnWorld(
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

  it("Boss Rush destack Hourglass Arch stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertHourglassArchOnWorld(
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

  it("rest-exit destack Hourglass Arch stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertHourglassArchOnWorld(
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
    const snapped = resolveHourglassArch(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= HOURGLASS_ARCH_GENERATE_MAX);
  });
});
