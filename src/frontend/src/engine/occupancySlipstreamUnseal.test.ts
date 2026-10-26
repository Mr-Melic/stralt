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
  SLIPSTREAM_FEATURE_ID,
  SLIPSTREAM_MP_COST,
  SLIPSTREAM_PAD_COUNT,
  SLIPSTREAM_SPAWN_CLEAR,
  floodSlipstreamBattleGraph,
  isOnSlipstreamBattleGraph,
  isOnSlipstreamEntry,
  isSlipstreamPairComplete,
  isSlipstreamSpawnClear,
  legalizeSlipstreamPlacement,
  legalizeSlipstreamPlacements,
  legalizeSlipstreamTravel,
  pickSlipstreamCount,
  pickSlipstreamDests,
  rawSlipstreamDests,
  rawSlipstreamTravel,
  resolveSlipstream,
  resolveSlipstreamTravel,
  slipstreamPadIndexAt,
  slipstreamTravelCostsMp,
  slipstreamUnreachable,
} from "./occupancySlipstreamUnseal.ts";
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

describe("occupancySlipstreamUnseal regressions", () => {
  it("seed-slipstream-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawSlipstreamDests(occupancy, player);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((c) => c.x === 6 && c.y === 0),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(SLIPSTREAM_PAD_COUNT, 2);
    assert.equal(pickSlipstreamCount(), 2);
    assert.equal(SLIPSTREAM_MP_COST, 1);
    assert.equal(SLIPSTREAM_FEATURE_ID, "WF-TEL-SLIPSTREAM");
  });

  it("seed-slipstream-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawSlipstreamDests(occupancy, spawn);
    assert.equal(isSlipstreamSpawnClear(0, 0, spawn), true);
    assert.equal(isSlipstreamSpawnClear(3, 0, spawn), true);
    assert.equal(isSlipstreamSpawnClear(4, 0, spawn), false);
    assert.equal(SLIPSTREAM_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isSlipstreamSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-slipstream-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawSlipstreamDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isSlipstreamSpawnClear(cx, cy, spawn),
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

  it("seed-slipstream-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const feature = getWorldFeature(SLIPSTREAM_FEATURE_ID);
    assert.ok(feature);
    assert.equal(feature.extraHazardCount, undefined);
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(feature, rng),
      0,
      "unlike Gutter Steam min=max=2, Slipstream must not ride extraHazardRoll",
    );
    assert.equal(pickSlipstreamCount(), SLIPSTREAM_PAD_COUNT);
  });

  it("seed-slipstream-through-portal-far-side: leftover pad snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 5, y: 0 };
    const dest = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnSlipstreamBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(slipstreamUnreachable(player, [dest], occupancy), true);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnSlipstreamBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(slipstreamUnreachable(player, [landed], occupancy), false);
    assert.equal(isSlipstreamSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-slipstream-on-unique-bridge: walkable pads may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const before = floodSlipstreamBattleGraph(player, occupancy);
    assert.equal(
      isOnSlipstreamBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already hosts the fight graph",
    );
    assert.equal(isSlipstreamSpawnClear(5, 1, player), false);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor Slipstream pad stays — it is walkable floor",
    );
    assert.equal(slipstreamUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
    const after = floodSlipstreamBattleGraph(player, occupancy);
    assert.equal(
      after.size,
      before.size,
      "a pad must not shrink the walk flood the way a walk-blocker would",
    );
  });

  it("seed-slipstream-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeSlipstreamPlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnSlipstreamBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(slipstreamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-slipstream-onto-void: a generation void is not a steppable pad", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 7, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["5,0"]),
    );
    assert.equal(
      rawSlipstreamDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(slipstreamUnreachable(player, [dest], occupancy), true);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnSlipstreamBattleGraph(landed, player, occupancy), true);
    assert.equal(slipstreamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-slipstream-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 5, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 4 }], [player], player);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(slipstreamUnreachable(player, [landed!], occupancy), false);
  });

  it("seed-slipstream-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isSlipstreamSpawnClear(5, 0, spawn), false);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(slipstreamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-slipstream-snaps-off-spawn-diamond: catalog never plants spawn±3", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const dest = { x: 1, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [spawn], spawn);
    assert.equal(isSlipstreamSpawnClear(1, 0, spawn), true);
    const landed = legalizeSlipstreamPlacement(dest, spawn, occupancy, spawn);
    assert.ok(landed);
    assert.equal(isSlipstreamSpawnClear(landed.x, landed.y, spawn), false);
    assert.equal(isOnSlipstreamBattleGraph(landed, spawn, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
  });

  it("seed-slipstream-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays — swap is intended",
    );
    assert.equal(isOnSlipstreamBattleGraph(landed, player, occupancy), true);
  });

  it("seed-slipstream-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, F, F, P, W, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const dest = { x: 7, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnSlipstreamBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(slipstreamUnreachable(player, [dest], occupancy), true);
    const landed = legalizeSlipstreamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnSlipstreamBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(slipstreamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-slipstream-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = legalizeSlipstreamPlacements(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      player,
      occupancy,
    );
    assert.equal(snapped.length, 0);
    assert.equal(floodSlipstreamBattleGraph(player, occupancy).size, 0);
    assert.equal(slipstreamUnreachable(player, snapped, occupancy), true);
    assert.equal(rawSlipstreamDests(occupancy, player).length, 0);
  });

  it("seed-slipstream-incomplete-drop: one hostable cell drops the whole pair", () => {
    const tiles = [[F, F, F, F, F, P, F]];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isSlipstreamSpawnClear(3, 0, player), true);
    assert.equal(isSlipstreamSpawnClear(4, 0, player), false);
    assert.equal(
      isOnSlipstreamBattleGraph({ x: 4, y: 0 }, player, occupancy),
      true,
    );
    assert.equal(
      isOnSlipstreamBattleGraph({ x: 6, y: 0 }, player, occupancy),
      false,
    );
    const dests = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    const landed = legalizeSlipstreamPlacements(dests, player, occupancy);
    assert.equal(
      landed.length,
      0,
      "unlike Gutter Steam keeping 1 of 2 vents, an incomplete A→B pair must drop every pad",
    );
    assert.equal(isSlipstreamPairComplete(landed), false);
    assert.equal(tiles[0][6], F, "must not punch the leftover crumb");
    assert.equal(tiles[0][5], P);
  });

  it("seed-slipstream-one-dest-is-not-a-pair: fewer than two dests plant nothing", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const landed = legalizeSlipstreamPlacements(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    assert.equal(landed.length, 0);
    assert.equal(isSlipstreamPairComplete(landed), false);
  });

  it("seed-slipstream-double-far: two leftover dests snap without stacking", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dests = [
      { x: 6, y: 0 },
      { x: 8, y: 0 },
    ];
    const landed = legalizeSlipstreamPlacements(dests, player, occupancy);
    assert.equal(landed.length, 2);
    assert.equal(isSlipstreamPairComplete(landed), true);
    const keys = new Set(landed.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, 2);
    for (const cell of landed) {
      assert.equal(isOnSlipstreamBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "6,0");
      assert.notEqual(occKey(cell.x, cell.y), "8,0");
    }
    assert.equal(tiles[0][6], F);
    assert.equal(tiles[0][8], F);
  });

  it("seed-slipstream-independent-dests: picks are not a contiguous 2×2 or 3-tile lane", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dests = [
      { x: 4, y: 0 },
      { x: 7, y: 2 },
    ];
    const landed = legalizeSlipstreamPlacements(dests, player, occupancy);
    assert.equal(landed.length, 2);
    const dx = Math.abs(landed[0]!.x - landed[1]!.x);
    const dy = Math.abs(landed[0]!.y - landed[1]!.y);
    assert.equal(
      dx + dy > 1 || (dx === 1 && dy === 1),
      true,
      "A and B must be allowed to sit on independent cells, unlike Creeping Ash's 3-tile lane",
    );
  });

  it("seed-slipstream-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const existing = new Set(["4,0", "5,0"]);
    const raw = rawSlipstreamDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => existing.has(occKey(c.x, c.y))),
      false,
    );
    assert.equal(
      raw.some((c) => c.x === 6 && c.y === 0),
      true,
    );
  });

  it("seed-slipstream-count-two: catalog pick is exactly two independent cells", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawSlipstreamDests(occupancy, player);
    const picked = pickSlipstreamDests(raw, createSeededRng(3));
    assert.equal(picked.length, SLIPSTREAM_PAD_COUNT);
    assert.equal(new Set(picked.map((c) => occKey(c.x, c.y))).size, 2);
  });

  it("seed-slipstream-b-does-not-return: standing on B is a free stay", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    assert.equal(slipstreamPadIndexAt(pads, pads[1]!), 1);
    assert.equal(isOnSlipstreamEntry(pads, pads[1]!), false);
    const travel = legalizeSlipstreamTravel(pads[1]!, pads, player, occupancy);
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "not-on-entry");
    }
    assert.equal(slipstreamTravelCostsMp(travel), false);
  });

  it("seed-slipstream-a-to-b: entering A exits at B", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    assert.equal(isOnSlipstreamEntry(pads, pads[0]!), true);
    const travel = legalizeSlipstreamTravel(pads[0]!, pads, player, occupancy);
    assert.equal(travel.kind, "move");
    if (travel.kind === "move") {
      assert.equal(occKey(travel.to.x, travel.to.y), occKey(6, 0));
    }
    assert.equal(slipstreamTravelCostsMp(travel), true);
  });

  it("seed-slipstream-travel-through-portal-far-side: leftover dest drops the teleport", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    assert.equal(isOnSlipstreamBattleGraph(pads[0]!, player, occupancy), true);
    assert.equal(isOnSlipstreamBattleGraph(pads[1]!, player, occupancy), false);
    const raw = rawSlipstreamTravel(pads[0]!, pads, occupancy);
    assert.equal(raw.kind, "move");
    if (raw.kind === "move") {
      assert.equal(
        occKey(raw.to.x, raw.to.y),
        occKey(6, 0),
        "occupancy-blind A→B still names the crumb",
      );
    }
    const travel = legalizeSlipstreamTravel(pads[0]!, pads, player, occupancy);
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "dest-off-graph");
    }
    assert.equal(slipstreamTravelCostsMp(travel), false);
    assert.equal(
      tiles[0][6],
      F,
      "must not punch or relocate the leftover crumb",
    );
    assert.equal(tiles[0][5], P);
    const resolved = resolveSlipstreamTravel(pads[0]!, pads, player, occupancy);
    assert.equal(resolved.kind, "stay");
  });

  it("seed-slipstream-swap-fight-graph: occupied B swaps on the island", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 0 };
    const boss = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    const travel = legalizeSlipstreamTravel(
      player,
      pads,
      player,
      occupancy,
      spawn,
    );
    assert.equal(travel.kind, "swap");
    if (travel.kind === "swap") {
      assert.equal(occKey(travel.from.x, travel.from.y), occKey(4, 0));
      assert.equal(occKey(travel.to.x, travel.to.y), occKey(6, 0));
    }
    assert.equal(slipstreamTravelCostsMp(travel), true);
    assert.equal(isOnSlipstreamBattleGraph(boss, player, occupancy), true);
  });

  it("seed-slipstream-swap-leftover-occupant: leftover swap stays so the traveler is not isolated", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 0 };
    const isolated = { x: 6, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 5, y: 0 }],
      [player, isolated],
      player,
    );
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    const raw = rawSlipstreamTravel(player, pads, occupancy);
    assert.equal(
      raw.kind,
      "swap",
      "occupancy-blind swap still names the leftover occupant",
    );
    const travel = legalizeSlipstreamTravel(
      player,
      pads,
      player,
      occupancy,
      spawn,
    );
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "dest-off-graph");
    }
    assert.equal(slipstreamTravelCostsMp(travel), false);
    assert.equal(
      isOnSlipstreamBattleGraph(player, player, occupancy),
      true,
      "the traveler must remain on the fight graph",
    );
    assert.equal(tiles[0][6], F);
  });

  it("seed-slipstream-not-on-pad: standing off the pair is a free stay", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    const travel = legalizeSlipstreamTravel(player, pads, player, occupancy);
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "not-on-entry");
    }
    assert.equal(slipstreamTravelCostsMp(travel), false);
  });

  it("seed-slipstream-no-mp: a 0-MP enter stays on A", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    const travel = legalizeSlipstreamTravel(
      player,
      pads,
      player,
      occupancy,
      spawn,
      0,
    );
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "no-mp");
    }
    assert.equal(slipstreamTravelCostsMp(travel), false);
  });

  it("seed-slipstream-resolve-open-field: two fight-graph dests stay painted", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dests = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    const landed = legalizeSlipstreamPlacements(dests, player, occupancy);
    assert.equal(landed.length, 2);
    const resolved = resolveSlipstream(
      player,
      occupancy,
      createSeededRng(11),
      dests,
    );
    assert.equal(resolved.length, 2);
    assert.equal(isSlipstreamPairComplete(resolved), true);
  });
});

function hostableSlipstreamCount(
  player: OccCell,
  occupancy: OccupancyContext,
  spawn: OccCell,
): number {
  const battle = floodSlipstreamBattleGraph(player, occupancy);
  let n = 0;
  for (const k of battle) {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    if (occupancy.portals.has(k)) continue;
    if (isSlipstreamSpawnClear(x, y, spawn)) continue;
    if (occupancy.voidTiles.has(k) || occupancy.barriers.has(k)) continue;
    n += 1;
  }
  return n;
}

function assertSlipstreamOnWorld(
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
  const raw = rawSlipstreamDests(occupancy, spawn);
  const snapped = resolveSlipstream(player, occupancy, rng, undefined, spawn);
  const battle = floodSlipstreamBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} pads placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = hostableSlipstreamCount(player, occupancy, spawn);
  if (raw.length >= SLIPSTREAM_PAD_COUNT && hostable >= SLIPSTREAM_PAD_COUNT) {
    if (snapped.length === 0) {
      return `${label} dropped the pair even though the fight graph can host two pads`;
    }
  }
  if (snapped.length !== 0 && snapped.length !== SLIPSTREAM_PAD_COUNT) {
    return `${label} planted ${snapped.length} pads; catalog cap is 2 all-or-nothing`;
  }
  if (
    snapped.length === SLIPSTREAM_PAD_COUNT &&
    !isSlipstreamPairComplete(snapped)
  ) {
    return `${label} stacked two pads on one cell`;
  }
  const walkBefore = battle.size;
  const walkAfter = floodSlipstreamBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Slipstream shrunk the walk flood`;
  }
  for (const cell of snapped) {
    if (slipstreamUnreachable(player, [cell], occupancy)) {
      return `${label} Slipstream pad unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnSlipstreamBattleGraph(cell, player, occupancy)) {
      return `${label} pad misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isSlipstreamSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
  }
  if (snapped.length === SLIPSTREAM_PAD_COUNT) {
    const from = snapped[0]!;
    const travel = resolveSlipstreamTravel(
      from,
      snapped,
      player,
      occupancy,
      spawn,
    );
    if (travel.kind === "stay" && travel.reason === "dest-off-graph") {
      return `${label} legal pair still teleports off the fight graph`;
    }
    if (slipstreamTravelCostsMp(travel)) {
      const dest = travel.kind === "stay" ? from : travel.to;
      if (!isOnSlipstreamBattleGraph(dest, player, occupancy)) {
        return `${label} A→B exit left the fight graph`;
      }
    }
    const reverse = resolveSlipstreamTravel(
      snapped[1]!,
      snapped,
      player,
      occupancy,
      spawn,
    );
    if (reverse.kind !== "stay" || reverse.reason !== "not-on-entry") {
      return `${label} B sent a traveler back toward A`;
    }
  }
  return null;
}

describe("occupancySlipstreamUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Slipstream stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSlipstreamOnWorld(
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

  it("corridorMaze wander Slipstream stay on the fight graph", () => {
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
      const miss = assertSlipstreamOnWorld(
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

  it("chessboard destack Slipstream stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSlipstreamOnWorld(
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

  it("Boss Rush destack Slipstream stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertSlipstreamOnWorld(
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

  it("rest-exit destack Slipstream stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertSlipstreamOnWorld(
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
    const snapped = resolveSlipstream(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length === 0 || snapped.length === SLIPSTREAM_PAD_COUNT);
  });
});
