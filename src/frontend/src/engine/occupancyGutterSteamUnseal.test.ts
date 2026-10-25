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
  GUTTER_STEAM_COUNT,
  GUTTER_STEAM_HP_TAX_PCT,
  GUTTER_STEAM_SPAWN_CLEAR,
  floodGutterSteamBattleGraph,
  gutterSteamOccupantPaysTax,
  gutterSteamUnreachable,
  isGutterSteamJettingRound,
  isGutterSteamSpawnClear,
  isOnGutterSteamBattleGraph,
  legalizeGutterSteamJets,
  legalizeGutterSteamPlacement,
  legalizeGutterSteamPlacements,
  pickGutterSteamCount,
  pickGutterSteamDests,
  rawGutterSteamDests,
  rawGutterSteamJets,
  resolveGutterSteam,
  resolveGutterSteamJets,
} from "./occupancyGutterSteamUnseal.ts";

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

describe("occupancyGutterSteamUnseal regressions", () => {
  it("seed-gutter-steam-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawGutterSteamDests(occupancy, player);
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
    assert.equal(GUTTER_STEAM_COUNT, 2);
    assert.equal(pickGutterSteamCount(), 2);
    assert.equal(GUTTER_STEAM_HP_TAX_PCT, 0.04);
  });

  it("seed-gutter-steam-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawGutterSteamDests(occupancy, spawn);
    assert.equal(isGutterSteamSpawnClear(0, 0, spawn), true);
    assert.equal(isGutterSteamSpawnClear(3, 0, spawn), true);
    assert.equal(isGutterSteamSpawnClear(4, 0, spawn), false);
    assert.equal(GUTTER_STEAM_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isGutterSteamSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-gutter-steam-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawGutterSteamDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isGutterSteamSpawnClear(cx, cy, spawn),
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

  it("seed-gutter-steam-through-portal-far-side: one floor hop parks the tax on a crumb", () => {
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
      isOnGutterSteamBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(gutterSteamUnreachable(player, [dest], occupancy), true);
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnGutterSteamBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(gutterSteamUnreachable(player, [landed], occupancy), false);
    assert.equal(isGutterSteamSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-gutter-steam-on-unique-bridge: walkable tax may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnGutterSteamBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    assert.equal(isGutterSteamSpawnClear(5, 1, player), false);
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor Gutter Steam stays — it is a walkable tax",
    );
    assert.equal(gutterSteamUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-gutter-steam-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeGutterSteamPlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnGutterSteamBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(gutterSteamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-gutter-steam-onto-void: a generation void is not a steppable tax", () => {
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
      rawGutterSteamDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(gutterSteamUnreachable(player, [dest], occupancy), true);
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnGutterSteamBattleGraph(landed, player, occupancy), true);
    assert.equal(gutterSteamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-gutter-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(gutterSteamUnreachable(player, [landed!], occupancy), false);
  });

  it("seed-gutter-steam-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isGutterSteamSpawnClear(5, 0, spawn), false);
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(gutterSteamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-gutter-steam-snaps-off-spawn-diamond: catalog never taxes spawn±3", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const dest = { x: 1, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [spawn], spawn);
    assert.equal(isGutterSteamSpawnClear(1, 0, spawn), true);
    const landed = legalizeGutterSteamPlacement(dest, spawn, occupancy, spawn);
    assert.ok(landed);
    assert.equal(isGutterSteamSpawnClear(landed.x, landed.y, spawn), false);
    assert.equal(isOnGutterSteamBattleGraph(landed, spawn, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
  });

  it("seed-gutter-steam-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(isOnGutterSteamBattleGraph(landed, player, occupancy), true);
  });

  it("seed-gutter-steam-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnGutterSteamBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(gutterSteamUnreachable(player, [dest], occupancy), true);
    const landed = legalizeGutterSteamPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnGutterSteamBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(gutterSteamUnreachable(player, [landed], occupancy), false);
  });

  it("seed-gutter-steam-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveGutterSteam(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodGutterSteamBattleGraph(player, occupancy).size, 0);
    assert.equal(gutterSteamUnreachable(player, snapped, occupancy), true);
    assert.equal(rawGutterSteamDests(occupancy, player).length, 0);
  });

  it("seed-gutter-steam-dual-far: two leftover dests snap without stacking", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const dests = [
      { x: 6, y: 0 },
      { x: 8, y: 0 },
    ];
    const landed = legalizeGutterSteamPlacements(dests, player, occupancy);
    assert.equal(landed.length, 2);
    const keys = new Set(landed.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, 2, "snapped vents must not collapse onto one cell");
    for (const cell of landed) {
      assert.equal(isOnGutterSteamBattleGraph(cell, player, occupancy), true);
      assert.equal(isGutterSteamSpawnClear(cell.x, cell.y, player), false);
    }
    assert.equal(gutterSteamUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][6], F);
  });

  it("seed-gutter-steam-independent-dests: picks are not a contiguous 2×2 or 3-tile lane", () => {
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
    const landed = legalizeGutterSteamPlacements(dests, player, occupancy);
    assert.equal(landed.length, 2);
    const manhattan =
      Math.abs(landed[0]!.x - landed[1]!.x) +
      Math.abs(landed[0]!.y - landed[1]!.y);
    assert.ok(
      manhattan > 1,
      "unlike Creeping Ash / Tide Spikes, Gutter Steam dests need not form one orthogonal run",
    );
    const dx = Math.abs(landed[0]!.x - landed[1]!.x);
    const dy = Math.abs(landed[0]!.y - landed[1]!.y);
    assert.equal(
      dx === 1 && dy === 1,
      false,
      "unlike BOARD_CLAIM / Orbiting Cinder, two vents are not a painted 2×2 corner pair",
    );
  });

  it("seed-gutter-steam-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawGutterSteamDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawGutterSteamDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-gutter-steam-count-two: catalog pick is exactly two independent cells", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawGutterSteamDests(occupancy, player);
    const seenCounts = new Set<number>();
    for (let seed = 0; seed < 64; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickGutterSteamCount();
      assert.equal(count, GUTTER_STEAM_COUNT);
      seenCounts.add(count);
      const picked = pickGutterSteamDests(raw, rng, count);
      assert.ok(picked.length >= 1);
      assert.ok(picked.length <= count);
      const keys = new Set(picked.map((c) => occKey(c.x, c.y)));
      assert.equal(keys.size, picked.length);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isGutterSteamSpawnClear(cell.x, cell.y, player), false);
      }
    }
    assert.equal(seenCounts.has(GUTTER_STEAM_COUNT), true);
    assert.equal(
      seenCounts.size,
      1,
      "unlike Ember Vein 3–6, Gutter Steam never rolls another count",
    );
  });

  it("seed-gutter-steam-even-jets: even rounds tax occupants on both vents", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const vents = [
      { x: 4, y: 0 },
      { x: 7, y: 1 },
    ];
    for (const round of [0, 2, 4, 6]) {
      assert.equal(isGutterSteamJettingRound(round), true);
      const rawJets = rawGutterSteamJets(vents, round);
      assert.equal(rawJets.length, 2);
      const jets = legalizeGutterSteamJets(vents, round, player, occupancy);
      assert.equal(jets.length, 2);
      assert.equal(
        gutterSteamOccupantPaysTax({ x: 4, y: 0 }, vents, round),
        true,
      );
      assert.equal(
        gutterSteamOccupantPaysTax({ x: 7, y: 1 }, vents, round),
        true,
      );
      assert.equal(
        gutterSteamOccupantPaysTax({ x: 5, y: 0 }, vents, round),
        false,
        "adjacent floor is not a vent",
      );
    }
  });

  it("seed-gutter-steam-odd-inert: odd rounds the vents are floor", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const vents = [
      { x: 4, y: 0 },
      { x: 7, y: 1 },
    ];
    for (const round of [1, 3, 5, 7]) {
      assert.equal(isGutterSteamJettingRound(round), false);
      assert.equal(rawGutterSteamJets(vents, round).length, 0);
      assert.equal(
        legalizeGutterSteamJets(vents, round, player, occupancy).length,
        0,
      );
      assert.equal(
        gutterSteamOccupantPaysTax({ x: 4, y: 0 }, vents, round),
        false,
        "odd rounds never tax, even on a painted vent",
      );
      assert.equal(
        resolveGutterSteamJets(vents, round, player, occupancy).length,
        0,
      );
    }
  });

  it("seed-gutter-steam-jet-through-portal-far-side: leftover vent drops the even tax", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const vents = [
      { x: 4, y: 0 },
      { x: 6, y: 0 },
    ];
    assert.equal(
      isOnGutterSteamBattleGraph(vents[0]!, player, occupancy),
      true,
    );
    assert.equal(
      isOnGutterSteamBattleGraph(vents[1]!, player, occupancy),
      false,
    );
    const rawJets = rawGutterSteamJets(vents, 2);
    assert.equal(
      rawJets.length,
      2,
      "occupancy-blind jet still names the crumb",
    );
    const jets = legalizeGutterSteamJets(vents, 2, player, occupancy);
    assert.equal(jets.length, 1);
    assert.equal(occKey(jets[0]!.x, jets[0]!.y), occKey(4, 0));
    assert.equal(
      tiles[0][6],
      F,
      "must not punch or relocate the leftover crumb",
    );
    assert.equal(tiles[0][5], P);
  });

  it("seed-gutter-steam-jet-onto-void: even jet on a void drops the tax", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 7, y: 0 }],
      [player],
      player,
      new Set(["5,0"]),
    );
    const vents = [
      { x: 4, y: 1 },
      { x: 5, y: 0 },
    ];
    const jets = legalizeGutterSteamJets(vents, 0, player, occupancy);
    assert.equal(jets.length, 1);
    assert.equal(occKey(jets[0]!.x, jets[0]!.y), "4,1");
  });

  it("seed-gutter-steam-jet-on-unique-bridge: even tax may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 1 }], [player], player);
    const vents = [
      { x: 5, y: 1 },
      { x: 8, y: 1 },
    ];
    const jets = legalizeGutterSteamJets(vents, 4, player, occupancy);
    assert.equal(jets.length, 2);
    assert.equal(tiles[1][5], F);
  });
});

function assertGutterSteamOnWorld(
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
  const raw = rawGutterSteamDests(occupancy, spawn);
  const snapped = resolveGutterSteam(player, occupancy, rng, undefined, spawn);
  const battle = floodGutterSteamBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} vent placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = [...battle].some((k) => {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    return (
      !occupancy.portals.has(k) &&
      !isGutterSteamSpawnClear(x, y, spawn) &&
      !occupancy.voidTiles.has(k)
    );
  });
  if (raw.length > 0 && hostable && snapped.length === 0) {
    return `${label} dropped every vent even though the fight graph is nonempty`;
  }
  if (snapped.length > GUTTER_STEAM_COUNT) {
    return `${label} planted ${snapped.length} vents; catalog cap is 2`;
  }
  for (const cell of snapped) {
    if (gutterSteamUnreachable(player, [cell], occupancy)) {
      return `${label} Gutter Steam unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnGutterSteamBattleGraph(cell, player, occupancy)) {
      return `${label} vent misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isGutterSteamSpawnClear(cell.x, cell.y, spawn)) {
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
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two vents on one cell`;
  }
  const evenJets = resolveGutterSteamJets(snapped, 2, player, occupancy, spawn);
  if (evenJets.length !== snapped.length) {
    return `${label} even-round jet dropped a fight-graph vent`;
  }
  const oddJets = resolveGutterSteamJets(snapped, 3, player, occupancy, spawn);
  if (oddJets.length !== 0) {
    return `${label} odd-round jet still taxed`;
  }
  return null;
}

describe("occupancyGutterSteamUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Gutter Steam stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertGutterSteamOnWorld(
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

  it("corridorMaze wander Gutter Steam stays on the fight graph", () => {
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
      const miss = assertGutterSteamOnWorld(
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

  it("chessboard destack Gutter Steam stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertGutterSteamOnWorld(
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

  it("Boss Rush destack Gutter Steam stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertGutterSteamOnWorld(
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

  it("rest-exit destack Gutter Steam stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertGutterSteamOnWorld(
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
    const snapped = resolveGutterSteam(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= GUTTER_STEAM_COUNT);
  });
});
