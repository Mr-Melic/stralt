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
  occupantsSealProgression,
} from "./occupancy.ts";
import {
  LATCH_GATE_ARM_AP,
  LATCH_GATE_FEATURE_ID,
  LATCH_GATE_GENERATE_MAX,
  LATCH_GATE_GENERATE_MIN,
  LATCH_GATE_SPAWN_CLEAR,
  floodLatchGateBattleGraph,
  initialLatchGateState,
  isLatchGateAdjacent,
  isLatchGateSpawnClear,
  isOnLatchGateBattleGraph,
  latchGateCountsAsExit,
  latchGateOccupancyFakeExitHidesSeal,
  latchGateSealsProgression,
  latchGateUnreachable,
  legalizeLatchGateArm,
  legalizeLatchGatePlacement,
  legalizeLatchGatePlacements,
  pickLatchGateCount,
  pickLatchGateDests,
  rawLatchGateArm,
  rawLatchGateDests,
  resolveLatchGate,
  resolveLatchGateArm,
} from "./occupancyLatchGateUnseal.ts";
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

describe("occupancyLatchGateUnseal regressions", () => {
  it("seed-latch-gate-raw-skips-portal: production floor raster never picks the stable gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawLatchGateDests(occupancy, player);
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
    assert.equal(LATCH_GATE_GENERATE_MIN, 1);
    assert.equal(LATCH_GATE_GENERATE_MAX, 1);
  });

  it("seed-latch-gate-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawLatchGateDests(occupancy, spawn);
    assert.equal(isLatchGateSpawnClear(0, 0, spawn), true);
    assert.equal(isLatchGateSpawnClear(3, 0, spawn), true);
    assert.equal(isLatchGateSpawnClear(4, 0, spawn), false);
    assert.equal(LATCH_GATE_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isLatchGateSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-latch-gate-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawLatchGateDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isLatchGateSpawnClear(cx, cy, spawn),
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

  it("seed-latch-gate-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const feature = getWorldFeature(LATCH_GATE_FEATURE_ID);
    assert.ok(feature);
    assert.equal(feature.extraHazardCount, undefined);
    assert.equal(feature.blocksWalk, false);
    assert.equal(feature.requiresBypass, true);
    assert.equal(feature.category, "unstable_portal");
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(feature, rng),
      0,
      "unlike Gutter Steam min=max=2, Latch Gate must not ride extraHazardRoll",
    );
    assert.equal(pickLatchGateCount(), LATCH_GATE_GENERATE_MIN);
  });

  it("seed-latch-gate-unarmed-is-not-an-exit: Flicker/Echo count as exits from plant; latch does not", () => {
    const dest = { x: 4, y: 0 };
    const unarmed = initialLatchGateState(dest);
    assert.equal(unarmed.armed, false);
    assert.equal(
      latchGateCountsAsExit(unarmed),
      false,
      "catalog: unarmed it is not an exit",
    );
    assert.equal(latchGateCountsAsExit({ cell: dest, armed: true }), true);
  });

  it("seed-latch-gate-fake-exit-hides-seal: occupancy portals.add treats the choke as an open exit", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, F, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { x: 6, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      latchGateSealsProgression(player, [dest], occupancy),
      true,
      "unarmed void overlay on the unique corridor must seal the stable exit",
    );
    assert.equal(
      latchGateOccupancyFakeExitHidesSeal(player, dest, occupancy),
      true,
      "naive portals.add(latch) lets occupancy flood walk the choke as an exit",
    );
    const fakePortals = new Set(occupancy.portals);
    fakePortals.add(occKey(dest.x, dest.y));
    assert.equal(
      occupantsSealProgression(
        occupancy.tiles,
        occupancy.voidTiles,
        fakePortals,
        player,
        [],
        occupancy.barriers,
      ),
      false,
      "occupancy 1+1 unseal never sees a unique-bridge cut once the latch is a portal goal",
    );
  });

  it("seed-latch-gate-through-portal-far-side: leftover plant snaps onto the fight graph", () => {
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
      isOnLatchGateBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(latchGateUnreachable(player, [dest], occupancy), true);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(latchGateUnreachable(player, [landed], occupancy), false);
    assert.equal(latchGateSealsProgression(player, [landed], occupancy), false);
    assert.equal(tiles[0][4], F, "must not punch or portal the leftover crumb");
  });

  it("seed-latch-gate-on-unique-bridge: unarmed portal plant must not stay on the corridor", () => {
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
      isOnLatchGateBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      latchGateSealsProgression(player, [dest], occupancy),
      true,
      "sealing the unique corridor must cut the stable exit",
    );
    assert.equal(isLatchGateSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, a unique-corridor latch must snap off",
    );
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.equal(latchGateSealsProgression(player, [landed], occupancy), false);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dump.x, dump.y),
      "dump alcove outside spawn±3 is the legal plant",
    );
    assert.equal(
      tiles[1][6],
      F,
      "must not punch or portal the unique corridor",
    );
    assert.equal(
      latchGateOccupancyFakeExitHidesSeal(player, dest, occupancy),
      true,
    );
  });

  it("seed-latch-gate-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(latchGateSealsProgression(player, [dest], occupancy), true);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-latch-gate-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeLatchGatePlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(latchGateUnreachable(player, [landed], occupancy), false);
    assert.equal(latchGateSealsProgression(player, [landed], occupancy), false);
  });

  it("seed-latch-gate-onto-void: a generation void is not a legal sealed-portal plant", () => {
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
      rawLatchGateDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(latchGateUnreachable(player, [dest], occupancy), true);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.equal(latchGateUnreachable(player, [landed], occupancy), false);
    assert.equal(latchGateSealsProgression(player, [landed], occupancy), false);
  });

  it("seed-open-field-latch-noop: already-legal dests are unchanged", () => {
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
    assert.equal(isLatchGateSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(latchGateUnreachable(player, [landed!], occupancy), false);
    assert.equal(
      latchGateSealsProgression(player, [landed!], occupancy),
      false,
    );
    assert.equal(
      latchGateOccupancyFakeExitHidesSeal(player, dest, occupancy),
      false,
      "a dual-path dump is not a unique-corridor fake exit",
    );
  });

  it("seed-latch-gate-covers-player: portal occupancy on the player cell snaps off", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 4, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, covering the player is illegal",
    );
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.equal(latchGateSealsProgression(player, [landed], occupancy), false);
  });

  it("seed-latch-gate-occupied: production occupancy-blind dest snaps off the unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isLatchGateSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, an occupied fight-graph cell must snap off",
    );
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.equal(occupancy.isOccupied(landed), false);
  });

  it("seed-latch-gate-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnLatchGateBattleGraph({ x: 5, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(latchGateUnreachable(player, [dest], occupancy), true);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnLatchGateBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(latchGateUnreachable(player, [landed], occupancy), false);
  });

  it("seed-latch-gate-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveLatchGate(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodLatchGateBattleGraph(player, occupancy).size, 0);
    assert.equal(latchGateUnreachable(player, snapped, occupancy), true);
    assert.equal(rawLatchGateDests(occupancy, player).length, 0);
  });

  it("seed-latch-gate-never-only-portal: drop every dest when no stable exit exists", () => {
    const tiles = [
      [F, F, F, F],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [], [player], player);
    const dest = { x: 3, y: 1 };
    assert.equal(legalizeLatchGatePlacement(dest, player, occupancy), null);
    assert.equal(resolveLatchGate(player, occupancy).length, 0);
    assert.equal(latchGateSealsProgression(player, [dest], occupancy), true);
  });

  it("seed-latch-gate-dual-path: two corridor dests cannot jointly cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landings = [
      { x: 4, y: 0 },
      { x: 3, y: 0 },
    ];
    assert.equal(
      latchGateSealsProgression(player, landings, occupancy),
      true,
      "both unique-corridor cells together must seal",
    );
    const snapped = legalizeLatchGatePlacements(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one latch should still place");
    assert.equal(latchGateSealsProgression(player, snapped, occupancy), false);
    for (const cell of snapped) {
      assert.equal(isOnLatchGateBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-latch-gate-skips-existing: a second unstable-portal roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawLatchGateDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog must not stack two extra gates on one cell",
    );
    assert.equal(
      rawLatchGateDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-latch-gate-no-restamp-snap: leftover dest must not snap onto an existing latch", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const first = legalizeLatchGatePlacement({ x: 4, y: 0 }, player, occupancy);
    assert.ok(first);
    const existing = new Set([occKey(first.x, first.y)]);
    const second = resolveLatchGate(
      player,
      occupancy,
      undefined,
      [{ x: 5, y: 0 }],
      existing,
    );
    assert.equal(
      second.some((c) => existing.has(occKey(c.x, c.y))),
      false,
      "snap must not restack a leftover dest onto the first latch",
    );
    assert.equal(
      latchGateSealsProgression(player, [first, ...second], occupancy),
      false,
    );
  });

  it("seed-latch-gate-count-one: catalog pick is one cell", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawLatchGateDests(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickLatchGateCount(rng);
      assert.equal(count, LATCH_GATE_GENERATE_MIN);
      const picked = pickLatchGateDests(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isLatchGateSpawnClear(cell.x, cell.y, player), false);
      }
    }
  });

  it("seed-latch-gate-arm-adjacent: 1 AP orthogonal neighbor flips the glyph", () => {
    const gate = { x: 4, y: 2 };
    const state = initialLatchGateState(gate);
    const from = { x: 3, y: 2 };
    assert.equal(isLatchGateAdjacent(from, gate), true);
    assert.equal(isLatchGateAdjacent({ x: 4, y: 2 }, gate), false);
    assert.equal(isLatchGateAdjacent({ x: 3, y: 1 }, gate), false);
    const raw = rawLatchGateArm(state, from, LATCH_GATE_ARM_AP);
    assert.equal(raw.kind, "armed");
    const next = resolveLatchGateArm(state, from, LATCH_GATE_ARM_AP);
    assert.ok(next);
    assert.equal(next.armed, true);
    assert.equal(latchGateCountsAsExit(next), true);
    assert.equal(
      resolveLatchGateArm(next, from, LATCH_GATE_ARM_AP)?.armed,
      true,
    );
    assert.equal(
      legalizeLatchGateArm(next, from, LATCH_GATE_ARM_AP).kind,
      "stay",
    );
  });

  it("seed-latch-gate-arm-requires-ap-and-adjacency: diagonal / empty AP stays unarmed", () => {
    const gate = { x: 4, y: 2 };
    const state = initialLatchGateState(gate);
    assert.equal(
      rawLatchGateArm(state, { x: 3, y: 1 }, LATCH_GATE_ARM_AP).kind,
      "stay",
    );
    assert.equal(rawLatchGateArm(state, { x: 3, y: 2 }, 0).kind, "stay");
    assert.equal(rawLatchGateArm(null, { x: 3, y: 2 }).kind, "stay");
    assert.equal(resolveLatchGateArm(null, { x: 3, y: 2 }), null);
    assert.equal(
      latchGateCountsAsExit(resolveLatchGateArm(state, { x: 3, y: 2 }, 0)!),
      false,
    );
  });

  it("seed-latch-gate-arm-does-not-relocate: leftover arm stays on the crumb", () => {
    const leftover = { x: 5, y: 0 };
    const state = initialLatchGateState(leftover);
    const next = resolveLatchGateArm(state, { x: 4, y: 0 }, LATCH_GATE_ARM_AP);
    assert.ok(next);
    assert.equal(
      occKey(next.cell.x, next.cell.y),
      occKey(leftover.x, leftover.y),
    );
    assert.equal(next.armed, true);
    assert.equal(
      latchGateCountsAsExit(next),
      true,
      "arming is the glyph flip; an off-graph latch still cannot replace the stable exit",
    );
  });

  it("seed-latch-gate-not-cinder-barrel-roll: plant has no cardinal hop", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeLatchGatePlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    const state = initialLatchGateState(landed!);
    assert.equal(state.armed, false);
    assert.equal(
      latchGateSealsProgression(player, [landed!], occupancy),
      false,
      "dump-cell latch is not a unique-corridor roll target",
    );
  });
});

function assertLatchGateOnWorld(
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
  const snapped = resolveLatchGate(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodLatchGateBattleGraph(player, occupancy);
  if (occupancy.portals.size === 0) {
    if (snapped.length > 0) {
      return `${label} latch placed with no stable portal`;
    }
    return null;
  }
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} latch placed on an empty fight graph`;
    }
    return null;
  }
  for (const cell of snapped) {
    if (latchGateUnreachable(player, [cell], occupancy)) {
      return `${label} latch unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnLatchGateBattleGraph(cell, player, occupancy)) {
      return `${label} latch misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
    if (occKey(cell.x, cell.y) === occKey(player.x, player.y)) {
      return `${label} dest ${occKey(cell.x, cell.y)} covered the player`;
    }
    if (isLatchGateSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (occupancy.isOccupied(cell)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on an occupant`;
    }
    if (latchGateOccupancyFakeExitHidesSeal(player, cell, occupancy)) {
      return `${label} dest ${occKey(cell.x, cell.y)} is a fake-exit unique corridor`;
    }
    const state = initialLatchGateState(cell);
    if (latchGateCountsAsExit(state)) {
      return `${label} dest ${occKey(cell.x, cell.y)} counted as an exit while unarmed`;
    }
  }
  if (latchGateSealsProgression(player, snapped, occupancy)) {
    return `${label} latches jointly sealed every stable exit`;
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two latches on one cell`;
  }
  return null;
}

describe("occupancyLatchGateUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack latch gates stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLatchGateOnWorld(
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

  it("corridorMaze wander latch gates stay on the fight graph", () => {
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
      const miss = assertLatchGateOnWorld(
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

  it("chessboard destack latch gates stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLatchGateOnWorld(
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

  it("exploration destack latch gates stay on the fight graph", () => {
    const failures: string[] = [];
    const exploreSeeds = Array.from({ length: 64 }, (_, i) => 5000 + i * 11);
    for (const seed of exploreSeeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "none",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLatchGateOnWorld(
        `explore ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 23),
        world.playerSpawn,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack latch gates stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertLatchGateOnWorld(
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

  it("rest-exit destack latch gates stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertLatchGateOnWorld(
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

  it("second roll skips existing and still does not seal", () => {
    const failures: string[] = [];
    for (const seed of seeds.slice(0, 64)) {
      const world = generateSeededWorld({ seed, runMode: "dungeon" });
      const occupancy = ctxFrom(
        world.tiles,
        world.portals,
        [world.playerSpawn, ...world.spawns],
        world.playerSpawn,
        world.voidTiles,
      );
      const existing = new Set(
        resolveLatchGate(
          world.playerSpawn,
          occupancy,
          createSeededRng(seed + 3),
        ).map((c) => occKey(c.x, c.y)),
      );
      const snapped = resolveLatchGate(
        world.playerSpawn,
        occupancy,
        createSeededRng(seed + 5),
        undefined,
        existing,
      );
      const battle = floodLatchGateBattleGraph(world.playerSpawn, occupancy);
      for (const cell of snapped) {
        const k = occKey(cell.x, cell.y);
        if (existing.has(k)) {
          failures.push(`seed ${seed} restamped ${k}`);
          break;
        }
        if (battle.size > 0 && !battle.has(k)) {
          failures.push(`seed ${seed} second latch off graph at ${k}`);
          break;
        }
      }
      const combined = [
        ...[...existing].map((k) => {
          const [x, y] = k.split(",").map(Number);
          return { x, y };
        }),
        ...snapped,
      ];
      if (latchGateSealsProgression(world.playerSpawn, combined, occupancy)) {
        failures.push(`seed ${seed} jointly sealed after second roll`);
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
    const snapped = resolveLatchGate(
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
