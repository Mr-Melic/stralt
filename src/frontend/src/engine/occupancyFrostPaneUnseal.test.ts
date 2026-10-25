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
  FROST_PANE_COUNT,
  FROST_PANE_SMASH_AP,
  FROST_PANE_SPAWN_CLEAR,
  canSmashFrostPane,
  floodFrostPaneBattleGraph,
  frostPaneCutsFightGraphLos,
  frostPaneUnreachable,
  hasFrostPaneLos,
  isFrostPaneSpawnClear,
  isOnFrostPaneBattleGraph,
  legalizeFrostPanePlacement,
  legalizeFrostPanePlacements,
  pickFrostPaneCount,
  pickFrostPaneDests,
  rawFrostPaneDests,
  resolveFrostPane,
  smashFrostPane,
} from "./occupancyFrostPaneUnseal.ts";

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

describe("occupancyFrostPaneUnseal regressions", () => {
  it("seed-frost-pane-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawFrostPaneDests(occupancy, player);
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
    assert.equal(FROST_PANE_COUNT, 1);
    assert.equal(pickFrostPaneCount(), 1);
    assert.equal(FROST_PANE_SMASH_AP, 1);
  });

  it("seed-frost-pane-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawFrostPaneDests(occupancy, spawn);
    assert.equal(isFrostPaneSpawnClear(0, 0, spawn), true);
    assert.equal(isFrostPaneSpawnClear(3, 0, spawn), true);
    assert.equal(isFrostPaneSpawnClear(4, 0, spawn), false);
    assert.equal(FROST_PANE_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isFrostPaneSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-frost-pane-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawFrostPaneDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isFrostPaneSpawnClear(cx, cy, spawn),
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

  it("seed-frost-pane-through-portal-far-side: leftover pane never cuts fight-graph LoS", () => {
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
      isOnFrostPaneBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(frostPaneUnreachable(player, [dest], occupancy), true);
    assert.equal(
      frostPaneCutsFightGraphLos(player, boss, occupancy, [dest]),
      false,
      "a leftover pane cannot isolate required linear engagement on the player island",
    );
    assert.equal(hasFrostPaneLos(player, boss, occupancy, [dest]), true);
    const landed = legalizeFrostPanePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnFrostPaneBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(frostPaneUnreachable(player, [landed], occupancy), false);
    assert.equal(isFrostPaneSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-frost-pane-on-unique-bridge: walkable LoS wall may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 8, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const before = floodFrostPaneBattleGraph(player, occupancy);
    assert.equal(
      isOnFrostPaneBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already hosts the fight graph",
    );
    assert.equal(isFrostPaneSpawnClear(5, 1, player), false);
    const landed = legalizeFrostPanePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor Frost Pane stays — it is a walkable LoS wall",
    );
    assert.equal(frostPaneUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
    const after = floodFrostPaneBattleGraph(player, occupancy);
    assert.equal(
      after.size,
      before.size,
      "a pane must not shrink the walk flood the way a walk-blocker would",
    );
    assert.equal(hasFrostPaneLos(player, boss, occupancy, []), true);
    assert.equal(hasFrostPaneLos(player, boss, occupancy, [landed]), false);
    assert.equal(
      frostPaneCutsFightGraphLos(player, boss, occupancy, [landed]),
      true,
      "the pane taxes fight-graph LoS; smash stays optional because walk is open",
    );
    assert.equal(isOnFrostPaneBattleGraph(boss, player, occupancy), true);
  });

  it("seed-frost-pane-smash-optional: adjacent 1 AP clears LoS; diagonal cannot smash", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 4, y: 1 };
    const pane = { x: 5, y: 1 };
    const boss = { x: 8, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 1 }], [player, boss], player);
    assert.equal(canSmashFrostPane(player, pane), true);
    assert.equal(canSmashFrostPane({ x: 4, y: 0 }, pane), false);
    assert.equal(hasFrostPaneLos(player, boss, occupancy, [pane]), false);
    const smashed = smashFrostPane([pane], pane);
    assert.equal(smashed.length, 0);
    assert.equal(hasFrostPaneLos(player, boss, occupancy, smashed), true);
    assert.equal(FROST_PANE_SMASH_AP, 1);
    assert.equal(
      isOnFrostPaneBattleGraph(boss, player, occupancy),
      true,
      "smash is optional — the map was already walk-solvable with the pane intact",
    );
  });

  it("seed-frost-pane-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeFrostPanePlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnFrostPaneBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(frostPaneUnreachable(player, [landed], occupancy), false);
  });

  it("seed-frost-pane-onto-void: a generation void is not a steppable LoS wall", () => {
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
      rawFrostPaneDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(frostPaneUnreachable(player, [dest], occupancy), true);
    const landed = legalizeFrostPanePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnFrostPaneBattleGraph(landed, player, occupancy), true);
    assert.equal(frostPaneUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-frost-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeFrostPanePlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(frostPaneUnreachable(player, [landed!], occupancy), false);
  });

  it("seed-frost-pane-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isFrostPaneSpawnClear(5, 0, spawn), false);
    const landed = legalizeFrostPanePlacement(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(frostPaneUnreachable(player, [landed], occupancy), false);
  });

  it("seed-frost-pane-snaps-off-spawn-diamond: catalog never plants spawn±3", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const dest = { x: 1, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [spawn], spawn);
    assert.equal(isFrostPaneSpawnClear(1, 0, spawn), true);
    const landed = legalizeFrostPanePlacement(dest, spawn, occupancy, spawn);
    assert.ok(landed);
    assert.equal(isFrostPaneSpawnClear(landed.x, landed.y, spawn), false);
    assert.equal(isOnFrostPaneBattleGraph(landed, spawn, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
  });

  it("seed-frost-pane-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeFrostPanePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(isOnFrostPaneBattleGraph(landed, player, occupancy), true);
  });

  it("seed-frost-pane-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnFrostPaneBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(frostPaneUnreachable(player, [dest], occupancy), true);
    const landed = legalizeFrostPanePlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnFrostPaneBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(frostPaneUnreachable(player, [landed], occupancy), false);
  });

  it("seed-frost-pane-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveFrostPane(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodFrostPaneBattleGraph(player, occupancy).size, 0);
    assert.equal(frostPaneUnreachable(player, snapped, occupancy), true);
    assert.equal(rawFrostPaneDests(occupancy, player).length, 0);
  });

  it("seed-frost-pane-dual-far: leftover dests snap without stacking", () => {
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
    const landed = legalizeFrostPanePlacements(dests, player, occupancy);
    assert.equal(landed.length, 2);
    const keys = new Set(landed.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, 2, "snapped panes must not collapse onto one cell");
    for (const cell of landed) {
      assert.equal(isOnFrostPaneBattleGraph(cell, player, occupancy), true);
      assert.equal(isFrostPaneSpawnClear(cell.x, cell.y, player), false);
    }
    assert.equal(frostPaneUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][6], F);
    const resolved = resolveFrostPane(player, occupancy, undefined, dests);
    assert.equal(
      resolved.length,
      FROST_PANE_COUNT,
      "catalog resolve keeps one sheet; placements helper still snaps both leftovers",
    );
  });

  it("seed-frost-pane-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawFrostPaneDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawFrostPaneDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-frost-pane-count-one: catalog pick is exactly one sheet", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawFrostPaneDests(occupancy, player);
    const seenCounts = new Set<number>();
    for (let seed = 0; seed < 64; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickFrostPaneCount();
      assert.equal(count, FROST_PANE_COUNT);
      seenCounts.add(count);
      const picked = pickFrostPaneDests(raw, rng, count);
      assert.ok(picked.length >= 1);
      assert.ok(picked.length <= count);
      const keys = new Set(picked.map((c) => occKey(c.x, c.y)));
      assert.equal(keys.size, picked.length);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isFrostPaneSpawnClear(cell.x, cell.y, player), false);
      }
    }
    assert.equal(seenCounts.has(FROST_PANE_COUNT), true);
    assert.equal(
      seenCounts.size,
      1,
      "unlike Ember Vein 3–6 or Gutter Steam 2, Frost Pane never rolls another count",
    );
    const resolved = resolveFrostPane(player, occupancy, createSeededRng(7));
    assert.ok(resolved.length <= FROST_PANE_COUNT);
  });

  it("seed-frost-pane-not-a-2x2-or-lane: one cell, not BOARD_CLAIM / Ash / Gutter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dests = [{ x: 4, y: 0 }];
    const landed = legalizeFrostPanePlacements(dests, player, occupancy);
    assert.equal(landed.length, 1);
    assert.equal(occKey(landed[0]!.x, landed[0]!.y), "4,0");
    const resolved = resolveFrostPane(
      player,
      occupancy,
      createSeededRng(11),
      dests,
    );
    assert.equal(resolved.length, 1);
  });
});

function assertFrostPaneOnWorld(
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
  const raw = rawFrostPaneDests(occupancy, spawn);
  const snapped = resolveFrostPane(player, occupancy, rng, undefined, spawn);
  const battle = floodFrostPaneBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} pane placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = [...battle].some((k) => {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    return (
      !occupancy.portals.has(k) &&
      !isFrostPaneSpawnClear(x, y, spawn) &&
      !occupancy.voidTiles.has(k)
    );
  });
  if (raw.length > 0 && hostable && snapped.length === 0) {
    return `${label} dropped every pane even though the fight graph is nonempty`;
  }
  if (snapped.length > FROST_PANE_COUNT) {
    return `${label} planted ${snapped.length} panes; catalog cap is 1`;
  }
  const walkBefore = battle.size;
  const walkAfter = floodFrostPaneBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Frost Pane shrunk the walk flood`;
  }
  for (const cell of snapped) {
    if (frostPaneUnreachable(player, [cell], occupancy)) {
      return `${label} Frost Pane unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnFrostPaneBattleGraph(cell, player, occupancy)) {
      return `${label} pane misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isFrostPaneSpawnClear(cell.x, cell.y, spawn)) {
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
    return `${label} stacked two panes on one cell`;
  }
  return null;
}

describe("occupancyFrostPaneUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Frost Pane stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertFrostPaneOnWorld(
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

  it("corridorMaze wander Frost Pane stays on the fight graph", () => {
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
      const miss = assertFrostPaneOnWorld(
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

  it("chessboard destack Frost Pane stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertFrostPaneOnWorld(
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

  it("Boss Rush destack Frost Pane stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertFrostPaneOnWorld(
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

  it("rest-exit destack Frost Pane stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertFrostPaneOnWorld(
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
    const snapped = resolveFrostPane(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= FROST_PANE_COUNT);
  });
});
