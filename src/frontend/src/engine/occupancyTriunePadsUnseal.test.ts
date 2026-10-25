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
  TRIUNE_PAD_COUNT,
  TRIUNE_PAD_FEATURE_ID,
  TRIUNE_PAD_MP_COST,
  TRIUNE_PAD_SPAWN_CLEAR,
  floodTriunePadsBattleGraph,
  isOnTriunePadsBattleGraph,
  isTriunePadTrioComplete,
  isTriunePadsSpawnClear,
  legalizeTriunePadPlacement,
  legalizeTriunePadPlacements,
  legalizeTriunePadTravel,
  nextTriunePadIndex,
  pickTriunePadCount,
  pickTriunePadDests,
  rawTriunePadTravel,
  rawTriunePadsDests,
  resolveTriunePadTravel,
  resolveTriunePads,
  triunePadIndexAt,
  triunePadTravelCostsMp,
  triunePadsUnreachable,
} from "./occupancyTriunePadsUnseal.ts";
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

describe("occupancyTriunePadsUnseal regressions", () => {
  it("seed-triune-pads-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawTriunePadsDests(occupancy, player);
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
    assert.equal(TRIUNE_PAD_COUNT, 3);
    assert.equal(pickTriunePadCount(), 3);
    assert.equal(TRIUNE_PAD_MP_COST, 1);
    assert.equal(TRIUNE_PAD_FEATURE_ID, "WF-TEL-TRIUNE_PADS");
  });

  it("seed-triune-pads-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawTriunePadsDests(occupancy, spawn);
    assert.equal(isTriunePadsSpawnClear(0, 0, spawn), true);
    assert.equal(isTriunePadsSpawnClear(3, 0, spawn), true);
    assert.equal(isTriunePadsSpawnClear(4, 0, spawn), false);
    assert.equal(TRIUNE_PAD_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isTriunePadsSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-triune-pads-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawTriunePadsDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isTriunePadsSpawnClear(cx, cy, spawn),
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

  it("seed-triune-pads-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const feature = getWorldFeature(TRIUNE_PAD_FEATURE_ID);
    assert.ok(feature);
    assert.equal(feature.extraHazardCount, undefined);
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(feature, rng),
      0,
      "unlike Gutter Steam min=max=2, Triune Pads must not ride extraHazardRoll",
    );
    assert.equal(pickTriunePadCount(), TRIUNE_PAD_COUNT);
  });

  it("seed-triune-pads-through-portal-far-side: leftover pad snaps onto the fight graph", () => {
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
      isOnTriunePadsBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(triunePadsUnreachable(player, [dest], occupancy), true);
    const landed = legalizeTriunePadPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnTriunePadsBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(triunePadsUnreachable(player, [landed], occupancy), false);
    assert.equal(isTriunePadsSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-triune-pads-on-unique-bridge: walkable pads may sit on the corridor", () => {
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
    const before = floodTriunePadsBattleGraph(player, occupancy);
    assert.equal(
      isOnTriunePadsBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already hosts the fight graph",
    );
    assert.equal(isTriunePadsSpawnClear(5, 1, player), false);
    const landed = legalizeTriunePadPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor Triune Pad stays — it is walkable floor",
    );
    assert.equal(triunePadsUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
    const after = floodTriunePadsBattleGraph(player, occupancy);
    assert.equal(
      after.size,
      before.size,
      "a pad must not shrink the walk flood the way a walk-blocker would",
    );
  });

  it("seed-triune-pads-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTriunePadPlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnTriunePadsBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(triunePadsUnreachable(player, [landed], occupancy), false);
  });

  it("seed-triune-pads-onto-void: a generation void is not a steppable pad", () => {
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
      rawTriunePadsDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(triunePadsUnreachable(player, [dest], occupancy), true);
    const landed = legalizeTriunePadPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnTriunePadsBattleGraph(landed, player, occupancy), true);
    assert.equal(triunePadsUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-triune-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeTriunePadPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(triunePadsUnreachable(player, [landed!], occupancy), false);
  });

  it("seed-triune-pads-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isTriunePadsSpawnClear(5, 0, spawn), false);
    const landed = legalizeTriunePadPlacement(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(triunePadsUnreachable(player, [landed], occupancy), false);
  });

  it("seed-triune-pads-snaps-off-spawn-diamond: catalog never plants spawn±3", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const dest = { x: 1, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [spawn], spawn);
    assert.equal(isTriunePadsSpawnClear(1, 0, spawn), true);
    const landed = legalizeTriunePadPlacement(dest, spawn, occupancy, spawn);
    assert.ok(landed);
    assert.equal(isTriunePadsSpawnClear(landed.x, landed.y, spawn), false);
    assert.equal(isOnTriunePadsBattleGraph(landed, spawn, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
  });

  it("seed-triune-pads-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeTriunePadPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays — swap is intended",
    );
    assert.equal(isOnTriunePadsBattleGraph(landed, player, occupancy), true);
  });

  it("seed-triune-pads-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnTriunePadsBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(triunePadsUnreachable(player, [dest], occupancy), true);
    const landed = legalizeTriunePadPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnTriunePadsBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(triunePadsUnreachable(player, [landed], occupancy), false);
  });

  it("seed-triune-pads-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = legalizeTriunePadPlacements(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.equal(snapped.length, 0);
    assert.equal(floodTriunePadsBattleGraph(player, occupancy).size, 0);
    assert.equal(triunePadsUnreachable(player, snapped, occupancy), true);
    assert.equal(rawTriunePadsDests(occupancy, player).length, 0);
  });

  it("seed-triune-pads-incomplete-drop: two hostable cells drop the whole trio", () => {
    const tiles = [[F, F, F, F, F, F, P, F]];
    const player = { x: 0, y: 0 };
    const portal = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isTriunePadsSpawnClear(3, 0, player), true);
    assert.equal(isTriunePadsSpawnClear(4, 0, player), false);
    assert.equal(
      isOnTriunePadsBattleGraph({ x: 4, y: 0 }, player, occupancy),
      true,
    );
    assert.equal(
      isOnTriunePadsBattleGraph({ x: 5, y: 0 }, player, occupancy),
      true,
    );
    assert.equal(
      isOnTriunePadsBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    const dests = [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 7, y: 0 },
    ];
    const landed = legalizeTriunePadPlacements(dests, player, occupancy);
    assert.equal(
      landed.length,
      0,
      "unlike Gutter Steam keeping 1 of 2 vents, an incomplete 1→2→3 trio must drop every pad",
    );
    assert.equal(isTriunePadTrioComplete(landed), false);
    assert.equal(tiles[0][7], F, "must not punch the leftover crumb");
    assert.equal(tiles[0][6], P);
  });

  it("seed-triune-pads-two-dests-are-not-a-carousel: fewer than three dests plant nothing", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const landed = legalizeTriunePadPlacements(
      [
        { x: 4, y: 0 },
        { x: 7, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.equal(
      landed.length,
      0,
      "unlike Mirror Step / Gutter Steam, two pads are not a clockwise trio",
    );
  });

  it("seed-triune-pads-triple-far: three leftover dests snap without stacking", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const dests = [
      { x: 9, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
    ];
    const landed = legalizeTriunePadPlacements(dests, player, occupancy);
    assert.equal(landed.length, TRIUNE_PAD_COUNT);
    assert.equal(isTriunePadTrioComplete(landed), true);
    const keys = new Set(landed.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, 3, "snapped pads must not collapse onto one cell");
    for (const cell of landed) {
      assert.equal(isOnTriunePadsBattleGraph(cell, player, occupancy), true);
      assert.equal(isTriunePadsSpawnClear(cell.x, cell.y, player), false);
    }
    assert.equal(triunePadsUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][9], F);
  });

  it("seed-triune-pads-independent-dests: picks are not a contiguous 2×2 or 3-tile lane", () => {
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
      { x: 5, y: 1 },
    ];
    const landed = legalizeTriunePadPlacements(dests, player, occupancy);
    assert.equal(landed.length, 3);
    assert.equal(
      occKey(landed[0]!.x, landed[0]!.y),
      "4,0",
      "painted index 1 stays first — not geometric clockwise on a 2×2",
    );
    const manhattan01 =
      Math.abs(landed[0]!.x - landed[1]!.x) +
      Math.abs(landed[0]!.y - landed[1]!.y);
    assert.ok(
      manhattan01 > 1,
      "unlike Creeping Ash / Tide Spikes, Triune Pads dests need not form one orthogonal run",
    );
  });

  it("seed-triune-pads-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawTriunePadsDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawTriunePadsDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-triune-pads-count-three: catalog pick is exactly three independent cells", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawTriunePadsDests(occupancy, player);
    const seenCounts = new Set<number>();
    for (let seed = 0; seed < 64; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickTriunePadCount();
      assert.equal(count, TRIUNE_PAD_COUNT);
      seenCounts.add(count);
      const picked = pickTriunePadDests(raw, rng, count);
      assert.ok(picked.length >= 1);
      assert.ok(picked.length <= count);
      const keys = new Set(picked.map((c) => occKey(c.x, c.y)));
      assert.equal(keys.size, picked.length);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isTriunePadsSpawnClear(cell.x, cell.y, player), false);
      }
    }
    assert.equal(seenCounts.has(TRIUNE_PAD_COUNT), true);
    assert.equal(
      seenCounts.size,
      1,
      "unlike Ember Vein 3–6, Triune Pads never rolls another count",
    );
  });

  it("seed-triune-pads-clockwise-wrap: pad 3 exits at pad 1", () => {
    assert.equal(nextTriunePadIndex(0), 1);
    assert.equal(nextTriunePadIndex(1), 2);
    assert.equal(nextTriunePadIndex(2), 0);
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 1 },
    ];
    assert.equal(triunePadIndexAt(pads, pads[2]!), 2);
    const travel = legalizeTriunePadTravel(pads[2]!, pads, player, occupancy);
    assert.equal(travel.kind, "move");
    if (travel.kind === "move") {
      assert.equal(occKey(travel.to.x, travel.to.y), occKey(4, 0));
    }
    assert.equal(triunePadTravelCostsMp(travel), true);
  });

  it("seed-triune-pads-travel-through-portal-far-side: leftover dest drops the teleport", () => {
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
      { x: 2, y: 0 },
    ];
    assert.equal(isOnTriunePadsBattleGraph(pads[0]!, player, occupancy), true);
    assert.equal(isOnTriunePadsBattleGraph(pads[1]!, player, occupancy), false);
    const raw = rawTriunePadTravel(pads[0]!, pads, occupancy);
    assert.equal(raw.kind, "move");
    if (raw.kind === "move") {
      assert.equal(
        occKey(raw.to.x, raw.to.y),
        occKey(6, 0),
        "occupancy-blind clockwise still names the crumb",
      );
    }
    const travel = legalizeTriunePadTravel(pads[0]!, pads, player, occupancy);
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "dest-off-graph");
    }
    assert.equal(triunePadTravelCostsMp(travel), false);
    assert.equal(
      tiles[0][6],
      F,
      "must not punch or relocate the leftover crumb",
    );
    assert.equal(tiles[0][5], P);
    const resolved = resolveTriunePadTravel(pads[0]!, pads, player, occupancy);
    assert.equal(resolved.kind, "stay");
  });

  it("seed-triune-pads-swap-fight-graph: occupied next pad swaps on the island", () => {
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
      { x: 7, y: 1 },
    ];
    const travel = legalizeTriunePadTravel(
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
    assert.equal(triunePadTravelCostsMp(travel), true);
    assert.equal(isOnTriunePadsBattleGraph(boss, player, occupancy), true);
  });

  it("seed-triune-pads-swap-leftover-occupant: leftover swap stays so the traveler is not isolated", () => {
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
      { x: 2, y: 0 },
    ];
    const raw = rawTriunePadTravel(player, pads, occupancy);
    assert.equal(
      raw.kind,
      "swap",
      "occupancy-blind swap still names the leftover occupant",
    );
    const travel = legalizeTriunePadTravel(
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
    assert.equal(triunePadTravelCostsMp(travel), false);
    assert.equal(
      isOnTriunePadsBattleGraph(player, player, occupancy),
      true,
      "the traveler must remain on the fight graph",
    );
    assert.equal(tiles[0][6], F);
  });

  it("seed-triune-pads-not-on-pad: standing off the trio is a free stay", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const pads = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 1 },
    ];
    const travel = legalizeTriunePadTravel(player, pads, player, occupancy);
    assert.equal(travel.kind, "stay");
    if (travel.kind === "stay") {
      assert.equal(travel.reason, "not-on-pad");
    }
    assert.equal(triunePadTravelCostsMp(travel), false);
  });

  it("seed-triune-pads-no-mp: a 0-MP enter stays on the pad", () => {
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
      { x: 7, y: 1 },
    ];
    const travel = legalizeTriunePadTravel(
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
    assert.equal(triunePadTravelCostsMp(travel), false);
  });

  it("seed-triune-pads-resolve-open-field: three fight-graph dests stay painted", () => {
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
      { x: 7, y: 1 },
    ];
    const landed = legalizeTriunePadPlacements(dests, player, occupancy);
    assert.equal(landed.length, 3);
    const resolved = resolveTriunePads(
      player,
      occupancy,
      createSeededRng(11),
      dests,
    );
    assert.equal(resolved.length, 3);
    assert.equal(isTriunePadTrioComplete(resolved), true);
  });
});

function hostableTriunePadCount(
  player: OccCell,
  occupancy: OccupancyContext,
  spawn: OccCell,
): number {
  const battle = floodTriunePadsBattleGraph(player, occupancy);
  let n = 0;
  for (const k of battle) {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    if (occupancy.portals.has(k)) continue;
    if (isTriunePadsSpawnClear(x, y, spawn)) continue;
    if (occupancy.voidTiles.has(k) || occupancy.barriers.has(k)) continue;
    n += 1;
  }
  return n;
}

function assertTriunePadsOnWorld(
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
  const raw = rawTriunePadsDests(occupancy, spawn);
  const snapped = resolveTriunePads(player, occupancy, rng, undefined, spawn);
  const battle = floodTriunePadsBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} pads placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = hostableTriunePadCount(player, occupancy, spawn);
  if (raw.length >= TRIUNE_PAD_COUNT && hostable >= TRIUNE_PAD_COUNT) {
    if (snapped.length === 0) {
      return `${label} dropped the trio even though the fight graph can host three pads`;
    }
  }
  if (snapped.length !== 0 && snapped.length !== TRIUNE_PAD_COUNT) {
    return `${label} planted ${snapped.length} pads; catalog cap is 3 all-or-nothing`;
  }
  if (
    snapped.length === TRIUNE_PAD_COUNT &&
    !isTriunePadTrioComplete(snapped)
  ) {
    return `${label} stacked two pads on one cell`;
  }
  const walkBefore = battle.size;
  const walkAfter = floodTriunePadsBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Triune Pads shrunk the walk flood`;
  }
  for (const cell of snapped) {
    if (triunePadsUnreachable(player, [cell], occupancy)) {
      return `${label} Triune Pad unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnTriunePadsBattleGraph(cell, player, occupancy)) {
      return `${label} pad misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isTriunePadsSpawnClear(cell.x, cell.y, spawn)) {
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
  if (snapped.length === TRIUNE_PAD_COUNT) {
    const from = snapped[0]!;
    const travel = resolveTriunePadTravel(
      from,
      snapped,
      player,
      occupancy,
      spawn,
    );
    if (travel.kind === "stay" && travel.reason === "dest-off-graph") {
      return `${label} legal trio still teleports off the fight graph`;
    }
    if (triunePadTravelCostsMp(travel)) {
      const dest = travel.kind === "stay" ? from : travel.to;
      if (!isOnTriunePadsBattleGraph(dest, player, occupancy)) {
        return `${label} clockwise exit left the fight graph`;
      }
    }
  }
  return null;
}

describe("occupancyTriunePadsUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Triune Pads stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTriunePadsOnWorld(
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

  it("corridorMaze wander Triune Pads stay on the fight graph", () => {
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
      const miss = assertTriunePadsOnWorld(
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

  it("chessboard destack Triune Pads stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTriunePadsOnWorld(
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

  it("Boss Rush destack Triune Pads stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTriunePadsOnWorld(
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

  it("rest-exit destack Triune Pads stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertTriunePadsOnWorld(
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
    const snapped = resolveTriunePads(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length === 0 || snapped.length === TRIUNE_PAD_COUNT);
  });
});
