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
  CINDER_BARREL_FEATURE_ID,
  CINDER_BARREL_GENERATE_MAX,
  CINDER_BARREL_GENERATE_MIN,
  CINDER_BARREL_HEADINGS,
  CINDER_BARREL_HIT_TAX_PCT,
  CINDER_BARREL_ROLL_AP,
  CINDER_BARREL_SMASH_AP,
  CINDER_BARREL_SPAWN_CLEAR,
  cinderBarrelRollCostsAp,
  cinderBarrelRollSealsProgression,
  cinderBarrelSealsProgression,
  cinderBarrelUnreachable,
  floodCinderBarrelBattleGraph,
  isCinderBarrelHeading,
  isCinderBarrelSpawnClear,
  isOnCinderBarrelBattleGraph,
  legalizeCinderBarrelPlacement,
  legalizeCinderBarrelPlacements,
  legalizeCinderBarrelRoll,
  pickCinderBarrelCount,
  pickCinderBarrelDests,
  rawCinderBarrelDests,
  rawCinderBarrelRoll,
  resolveCinderBarrel,
  resolveCinderBarrelRoll,
  resolveCinderBarrelSmash,
} from "./occupancyCinderBarrelUnseal.ts";
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

function withBarrels(
  ctx: OccupancyContext,
  barrels: readonly OccCell[],
): OccupancyContext {
  const voidTiles = new Set(ctx.voidTiles);
  for (const cell of barrels) voidTiles.add(occKey(cell.x, cell.y));
  return { ...ctx, voidTiles };
}

describe("occupancyCinderBarrelUnseal regressions", () => {
  it("seed-cinder-barrel-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawCinderBarrelDests(occupancy, player);
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
    assert.equal(CINDER_BARREL_GENERATE_MIN, 1);
    assert.equal(CINDER_BARREL_GENERATE_MAX, 1);
  });

  it("seed-cinder-barrel-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawCinderBarrelDests(occupancy, spawn);
    assert.equal(isCinderBarrelSpawnClear(0, 0, spawn), true);
    assert.equal(isCinderBarrelSpawnClear(3, 0, spawn), true);
    assert.equal(isCinderBarrelSpawnClear(4, 0, spawn), false);
    assert.equal(CINDER_BARREL_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isCinderBarrelSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-cinder-barrel-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawCinderBarrelDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isCinderBarrelSpawnClear(cx, cy, spawn),
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

  it("seed-cinder-barrel-extraHazardRoll-zero: catalog omits extraHazardCount so a roll plants nothing", () => {
    const feature = getWorldFeature(CINDER_BARREL_FEATURE_ID);
    assert.ok(feature);
    assert.equal(feature.extraHazardCount, undefined);
    assert.equal(feature.blocksWalk, true);
    assert.equal(feature.hpTaxPctOfMax, CINDER_BARREL_HIT_TAX_PCT);
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(feature, rng),
      0,
      "unlike Gutter Steam min=max=2, Cinder Barrel must not ride extraHazardRoll",
    );
    assert.equal(pickCinderBarrelCount(), CINDER_BARREL_GENERATE_MIN);
  });

  it("seed-cinder-barrel-through-portal-far-side: leftover plant snaps onto the fight graph", () => {
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
      isOnCinderBarrelBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(cinderBarrelUnreachable(player, [dest], occupancy), true);
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnCinderBarrelBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(cinderBarrelUnreachable(player, [landed], occupancy), false);
    assert.equal(
      cinderBarrelSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-cinder-barrel-on-unique-bridge: impassable plant must not stay on the corridor", () => {
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
      isOnCinderBarrelBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    assert.equal(
      cinderBarrelSealsProgression(player, [dest], occupancy),
      true,
      "walling the unique corridor must seal the exit",
    );
    assert.equal(isCinderBarrelSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph dump cell");
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, a unique-corridor barrel must snap off",
    );
    assert.equal(isOnCinderBarrelBattleGraph(landed, player, occupancy), true);
    assert.equal(
      cinderBarrelSealsProgression(player, [landed], occupancy),
      false,
    );
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dump.x, dump.y),
      "dump alcove outside spawn±3 is the legal plant",
    );
    assert.equal(tiles[1][6], F, "must not punch or wall the unique corridor");
  });

  it("seed-cinder-barrel-on-unique-bridge-drops-when-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(cinderBarrelSealsProgression(player, [dest], occupancy), true);
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "no dump outside spawn±3: drop rather than seal or punch",
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-cinder-barrel-covers-player: wall occupancy on the player cell snaps off", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 4, y: 1 };
    const dest = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike eligibleHazard lava, covering the player is illegal",
    );
    assert.equal(isOnCinderBarrelBattleGraph(landed, player, occupancy), true);
    assert.equal(
      cinderBarrelSealsProgression(player, [landed], occupancy),
      false,
    );
  });

  it("seed-cinder-barrel-occupied: production occupancy-blind dest snaps off the unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isCinderBarrelSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike Hunting Lantern, an occupied fight-graph cell must snap off",
    );
    assert.equal(isOnCinderBarrelBattleGraph(landed, player, occupancy), true);
    assert.equal(occupancy.isOccupied(landed), false);
  });

  it("seed-cinder-barrel-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnCinderBarrelBattleGraph({ x: 5, y: 0 }, player, occupancy),
      false,
    );
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnCinderBarrelBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
  });

  it("seed-cinder-barrel-open-field-noop: already-legal dests are unchanged", () => {
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
    assert.equal(isCinderBarrelSpawnClear(dest.x, dest.y, player), false);
    const landed = legalizeCinderBarrelPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(cinderBarrelUnreachable(player, [landed!], occupancy), false);
    assert.equal(
      cinderBarrelSealsProgression(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-cinder-barrel-roll-onto-portal: occupancy-blind hop onto the gate stays", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const barrel = { x: 2, y: 0 };
    const occupancy = withBarrels(ctxFrom(tiles, [portal], [player], player), [
      barrel,
    ]);
    const raw = rawCinderBarrelRoll(barrel, { dx: 1, dy: 0 }, occupancy);
    assert.equal(raw.kind, "move");
    if (raw.kind === "move") {
      assert.equal(occKey(raw.to.x, raw.to.y), occKey(portal.x, portal.y));
    }
    const legal = legalizeCinderBarrelRoll(
      barrel,
      { dx: 1, dy: 0 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "stay");
    if (legal.kind === "stay") {
      assert.equal(legal.reason, "off-graph");
    }
    assert.equal(cinderBarrelRollCostsAp(legal), false);
    assert.equal(tiles[0][4], F, "must not punch the leftover crumb");
  });

  it("seed-cinder-barrel-roll-onto-unique-corridor: dump barrel must not hop the only exit", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, F, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 9, y: 1 };
    const dump = { x: 8, y: 2 };
    const corridor = { x: 8, y: 1 };
    const occupancy = withBarrels(ctxFrom(tiles, [portal], [player], player), [
      dump,
    ]);
    assert.equal(
      cinderBarrelRollSealsProgression(player, dump, corridor, occupancy),
      true,
      "rolling the dump barrel onto the unique corridor must seal",
    );
    const raw = rawCinderBarrelRoll(dump, { dx: 0, dy: -1 }, occupancy);
    assert.equal(raw.kind, "move");
    const legal = legalizeCinderBarrelRoll(
      dump,
      { dx: 0, dy: -1 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "stay");
    if (legal.kind === "stay") {
      assert.equal(legal.reason, "would-seal");
    }
    assert.equal(cinderBarrelRollCostsAp(legal), false);
    assert.equal(tiles[1][8], F, "must not wall the unique corridor");
  });

  it("seed-cinder-barrel-roll-onto-leftover-crumb: hop past the gate stays", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const leftover = { x: 4, y: 0 };
    const occupancy = withBarrels(ctxFrom(tiles, [portal], [player], player), [
      leftover,
    ]);
    assert.equal(
      isOnCinderBarrelBattleGraph(leftover, player, occupancy),
      false,
    );
    const raw = rawCinderBarrelRoll(leftover, { dx: 1, dy: 0 }, occupancy);
    assert.equal(raw.kind, "move");
    if (raw.kind === "move") {
      assert.equal(occKey(raw.to.x, raw.to.y), "5,0");
    }
    const legal = legalizeCinderBarrelRoll(
      leftover,
      { dx: 1, dy: 0 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "stay");
    if (legal.kind === "stay") {
      assert.equal(legal.reason, "off-graph");
    }
    assert.equal(tiles[0][5], F, "must not punch a second leftover crumb");
  });

  it("seed-cinder-barrel-roll-open-field: dual-path hop stays a move", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const barrel = { x: 4, y: 2 };
    const occupancy = withBarrels(
      ctxFrom(tiles, [{ x: 6, y: 0 }], [player], player),
      [barrel],
    );
    const legal = legalizeCinderBarrelRoll(
      barrel,
      { dx: 1, dy: 0 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "move");
    if (legal.kind === "move") {
      assert.deepEqual(legal.to, { x: 5, y: 2 });
      assert.equal(
        isOnCinderBarrelBattleGraph(legal.to, player, occupancy),
        true,
      );
      assert.equal(
        cinderBarrelRollSealsProgression(player, barrel, legal.to, occupancy),
        false,
      );
    }
    assert.equal(cinderBarrelRollCostsAp(legal), true);
  });

  it("seed-cinder-barrel-roll-occupied-hit: barrel stays and taxes the stacked unit", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const barrel = { x: 4, y: 2 };
    const foe = { x: 5, y: 2 };
    const occupancy = withBarrels(
      ctxFrom(tiles, [{ x: 6, y: 0 }], [player, foe], player),
      [barrel],
    );
    const raw = rawCinderBarrelRoll(barrel, { dx: 1, dy: 0 }, occupancy);
    assert.equal(raw.kind, "hit");
    const legal = legalizeCinderBarrelRoll(
      barrel,
      { dx: 1, dy: 0 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "hit");
    if (legal.kind === "hit") {
      assert.deepEqual(legal.to, foe);
    }
    assert.equal(cinderBarrelRollCostsAp(legal), true);
    assert.equal(
      cinderBarrelSealsProgression(player, [barrel], occupancy),
      false,
      "a hit must leave the barrel on its origin dump",
    );
  });

  it("seed-cinder-barrel-roll-no-ap: missing AP stays without hopping", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const barrel = { x: 4, y: 1 };
    const occupancy = withBarrels(
      ctxFrom(tiles, [{ x: 6, y: 0 }], [player], player),
      [barrel],
    );
    const legal = legalizeCinderBarrelRoll(
      barrel,
      { dx: 1, dy: 0 },
      player,
      occupancy,
      player,
      0,
    );
    assert.equal(legal.kind, "stay");
    if (legal.kind === "stay") {
      assert.equal(legal.reason, "no-ap");
    }
    assert.equal(cinderBarrelRollCostsAp(legal), false);
  });

  it("seed-cinder-barrel-roll-not-cardinal: diagonal heading stays", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const barrel = { x: 3, y: 1 };
    const occupancy = withBarrels(
      ctxFrom(tiles, [{ x: 4, y: 0 }], [player], player),
      [barrel],
    );
    assert.equal(isCinderBarrelHeading({ dx: 1, dy: 1 }), false);
    const legal = legalizeCinderBarrelRoll(
      barrel,
      { dx: 1, dy: 1 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "stay");
    if (legal.kind === "stay") {
      assert.equal(legal.reason, "not-cardinal");
    }
  });

  it("seed-cinder-barrel-roll-into-wall: blocked dest stays", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, W, F],
    ];
    const player = { x: 0, y: 0 };
    const barrel = { x: 2, y: 1 };
    const occupancy = withBarrels(
      ctxFrom(tiles, [{ x: 4, y: 0 }], [player], player),
      [barrel],
    );
    const legal = legalizeCinderBarrelRoll(
      barrel,
      { dx: 1, dy: 0 },
      player,
      occupancy,
    );
    assert.equal(legal.kind, "stay");
    if (legal.kind === "stay") {
      assert.equal(legal.reason, "blocked");
    }
  });

  it("seed-cinder-barrel-smash: 2 AP floors the cell; 1 AP stays", () => {
    const cell = { x: 4, y: 2 };
    const smashed = resolveCinderBarrelSmash(cell, CINDER_BARREL_SMASH_AP);
    assert.equal(smashed.kind, "floor");
    if (smashed.kind === "floor") {
      assert.deepEqual(smashed.cell, cell);
    }
    const poor = resolveCinderBarrelSmash(cell, CINDER_BARREL_ROLL_AP);
    assert.equal(poor.kind, "stay");
    if (poor.kind === "stay") {
      assert.equal(poor.reason, "no-ap");
    }
    const missing = resolveCinderBarrelSmash(null);
    assert.equal(missing.kind, "stay");
  });

  it("seed-cinder-barrel-skips-existing: a second blocksWalk roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawCinderBarrelDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog must not stack two blocksWalk features on one cell",
    );
  });

  it("seed-cinder-barrel-count-one: catalog pick is one cell", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawCinderBarrelDests(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickCinderBarrelCount(rng);
      assert.equal(count, CINDER_BARREL_GENERATE_MIN);
      const picked = pickCinderBarrelDests(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isCinderBarrelSpawnClear(cell.x, cell.y, player), false);
      }
    }
    assert.equal(CINDER_BARREL_HEADINGS.length, 4);
  });

  it("seed-cinder-barrel-resolve-open-field: one fight-graph dest stays painted", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dests = [{ x: 6, y: 2 }];
    const landed = legalizeCinderBarrelPlacements(dests, player, occupancy);
    assert.equal(landed.length, 1);
    const resolved = resolveCinderBarrel(
      player,
      occupancy,
      createSeededRng(11),
      dests,
    );
    assert.equal(resolved.length, 1);
  });
});

function hostableCinderBarrelCount(
  player: OccCell,
  occupancy: OccupancyContext,
  spawn: OccCell,
): number {
  const battle = floodCinderBarrelBattleGraph(player, occupancy);
  let n = 0;
  for (const k of battle) {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    if (occupancy.portals.has(k)) continue;
    if (isCinderBarrelSpawnClear(x, y, spawn)) continue;
    if (occupancy.voidTiles.has(k) || occupancy.barriers.has(k)) continue;
    if (occupancy.isOccupied({ x, y })) continue;
    if (k === occKey(player.x, player.y)) continue;
    n += 1;
  }
  return n;
}

function assertCinderBarrelOnWorld(
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
  const snapped = resolveCinderBarrel(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodCinderBarrelBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} barrel placed on an empty fight graph`;
    }
    return null;
  }
  if (snapped.length > CINDER_BARREL_GENERATE_MAX) {
    return `${label} planted ${snapped.length} barrels; catalog cap is 1`;
  }
  for (const cell of snapped) {
    if (cinderBarrelUnreachable(player, [cell], occupancy)) {
      return `${label} barrel unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnCinderBarrelBattleGraph(cell, player, occupancy)) {
      return `${label} barrel misses the fight graph at ${occKey(cell.x, cell.y)}`;
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
    if (isCinderBarrelSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (occupancy.isOccupied(cell)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on an occupant`;
    }
  }
  if (cinderBarrelSealsProgression(player, snapped, occupancy)) {
    return `${label} barrel sealed every exit`;
  }
  const live = withBarrels(occupancy, snapped);
  for (const cell of snapped) {
    for (const heading of CINDER_BARREL_HEADINGS) {
      const roll = resolveCinderBarrelRoll(cell, heading, player, live, spawn);
      if (roll.kind === "move") {
        if (!isOnCinderBarrelBattleGraph(roll.to, player, live)) {
          return `${label} roll left the fight graph at ${occKey(roll.to.x, roll.to.y)}`;
        }
        if (live.portals.has(occKey(roll.to.x, roll.to.y))) {
          return `${label} roll hopped a portal at ${occKey(roll.to.x, roll.to.y)}`;
        }
        if (cinderBarrelRollSealsProgression(player, cell, roll.to, live)) {
          return `${label} roll sealed every exit at ${occKey(roll.to.x, roll.to.y)}`;
        }
        if (isCinderBarrelSpawnClear(roll.to.x, roll.to.y, spawn)) {
          return `${label} roll entered spawn±3 at ${occKey(roll.to.x, roll.to.y)}`;
        }
      }
      if (roll.kind === "hit" && !live.isOccupied(roll.to)) {
        return `${label} hit a vacant cell at ${occKey(roll.to.x, roll.to.y)}`;
      }
      if (roll.kind === "stay" && cinderBarrelRollCostsAp(roll)) {
        return `${label} stay still charged 1 AP`;
      }
    }
  }
  const hostable = hostableCinderBarrelCount(player, occupancy, spawn);
  if (hostable === 0 && snapped.length > 0) {
    return `${label} planted a barrel on a graph that cannot host a wall`;
  }
  return null;
}

describe("occupancyCinderBarrelUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Cinder Barrel stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertCinderBarrelOnWorld(
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

  it("corridorMaze wander Cinder Barrel stay on the fight graph", () => {
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
      const miss = assertCinderBarrelOnWorld(
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

  it("chessboard destack Cinder Barrel stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertCinderBarrelOnWorld(
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

  it("Boss Rush destack Cinder Barrel stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertCinderBarrelOnWorld(
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

  it("rest-exit destack Cinder Barrel stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertCinderBarrelOnWorld(
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
    const snapped = resolveCinderBarrel(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= CINDER_BARREL_GENERATE_MAX);
  });
});
