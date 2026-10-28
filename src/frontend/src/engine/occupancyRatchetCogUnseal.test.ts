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
  RATCHET_COG_COUNT,
  RATCHET_COG_FEATURE_ID,
  RATCHET_COG_HP_TAX_PCT,
  RATCHET_COG_PAIR_LENGTH,
  RATCHET_COG_SPAWN_CLEAR,
  cloneRatchetCogPair,
  floodRatchetCogBattleGraph,
  isOnRatchetCogBattleGraph,
  isRatchetCogSpawnClear,
  legalizeRatchetCogPlacement,
  legalizeRatchetCogSwap,
  pickRatchetCogCount,
  pickRatchetCogPairs,
  ratchetCogCellsOrthogonal,
  ratchetCogOrb,
  ratchetCogPairKey,
  ratchetCogPairUnreachable,
  ratchetCogUnreachable,
  rawRatchetCogPairs,
  rawRatchetCogSwap,
  resolveRatchetCog,
  resolveRatchetCogAfterRoundStart,
} from "./occupancyRatchetCogUnseal.ts";
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

describe("occupancyRatchetCogUnseal regressions", () => {
  it("seed-ratchet-cog-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawRatchetCogPairs(occupancy, player);
    assert.equal(
      raw.some(
        (p) =>
          occKey(p.cog.x, p.cog.y) === occKey(portal.x, portal.y) ||
          occKey(p.rest.x, p.rest.y) === occKey(portal.x, portal.y),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.cog.x === 4 && p.cog.y === 0) ||
          (p.rest.x === 4 && p.rest.y === 0),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(RATCHET_COG_COUNT, 1);
    assert.equal(RATCHET_COG_PAIR_LENGTH, 2);
    assert.equal(RATCHET_COG_HP_TAX_PCT, 0.05);
    assert.equal(RATCHET_COG_FEATURE_ID, "WF-HAZ-RATCHET_COG");
  });

  it("seed-ratchet-cog-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 2 }], [spawn], spawn);
    const raw = rawRatchetCogPairs(occupancy, spawn);
    assert.equal(isRatchetCogSpawnClear(0, 0, spawn), true);
    assert.equal(isRatchetCogSpawnClear(3, 0, spawn), true);
    assert.equal(isRatchetCogSpawnClear(4, 0, spawn), false);
    assert.equal(RATCHET_COG_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some(
        (p) =>
          isRatchetCogSpawnClear(p.cog.x, p.cog.y, spawn) ||
          isRatchetCogSpawnClear(p.rest.x, p.rest.y, spawn),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.cog.x === 4 && p.cog.y === 0) ||
          (p.rest.x === 4 && p.rest.y === 0),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-ratchet-cog-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawRatchetCogPairs(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isRatchetCogSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.cog.x === cx && p.cog.y === cy) ||
          (p.rest.x === cx && p.rest.y === cy),
      ),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some(
        (p) =>
          (p.cog.x === 0 && p.cog.y === 0) ||
          (p.rest.x === 0 && p.rest.y === 0),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-ratchet-cog-extraHazardRoll-one: catalog min=max=1 plants one cog", () => {
    const stub = {
      extraHazardCount: { min: 1, max: 1 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      1,
      "unlike Raise Slab omitted band, Ratchet Cog rides extraHazardRoll = 1",
    );
    assert.equal(pickRatchetCogCount(), RATCHET_COG_COUNT);
  });

  it("seed-ratchet-cog-through-portal-far-side: leftover pair snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 5, y: 0 } };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnRatchetCogBattleGraph(dest.cog, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(ratchetCogPairUnreachable(player, dest, occupancy), true);
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnRatchetCogBattleGraph(landed.cog, player, occupancy),
      true,
    );
    assert.equal(
      isOnRatchetCogBattleGraph(landed.rest, player, occupancy),
      true,
    );
    assert.notEqual(
      occKey(landed.cog.x, landed.cog.y),
      occKey(dest.cog.x, dest.cog.y),
    );
    assert.equal(ratchetCogUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-ratchet-cog-on-unique-bridge: walkable pair stays on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, F, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { cog: { x: 6, y: 1 }, rest: { x: 7, y: 1 } };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnRatchetCogBattleGraph(dest.cog, player, occupancy),
      true,
      "unique corridor already sits on the fight graph",
    );
    const walkBefore = floodRatchetCogBattleGraph(player, occupancy).size;
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed, "walkable unique-corridor pair must stay");
    assert.equal(
      occKey(landed.cog.x, landed.cog.y),
      occKey(dest.cog.x, dest.cog.y),
      "unlike Shift Slab / Raise Slab, a unique-corridor Ratchet Cog stays",
    );
    assert.equal(
      occKey(landed.rest.x, landed.rest.y),
      occKey(dest.rest.x, dest.rest.y),
    );
    assert.equal(
      floodRatchetCogBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const swapped = resolveRatchetCogAfterRoundStart(landed, player, occupancy);
    assert.equal(
      occKey(swapped.cog.x, swapped.cog.y),
      occKey(dest.rest.x, dest.rest.y),
      "first-round swap still fires on the unique corridor",
    );
    assert.equal(
      floodRatchetCogBattleGraph(player, occupancy).size,
      walkBefore,
      "swap is not a wall — Shift Slab would cut the corridor",
    );
  });

  it("seed-ratchet-cog-on-unique-bridge-no-dump: 1-wide with no alcove still stays", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { cog: { x: 5, y: 1 }, rest: { x: 6, y: 1 } };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.cog.x, landed.cog.y),
      occKey(dest.cog.x, dest.cog.y),
    );
    assert.equal(tiles[1][5], F, "must not punch the unique corridor");
  });

  it("seed-ratchet-cog-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRatchetCogPlacement(
      { cog: { x: 4, y: 0 }, rest: { x: 5, y: 0 } },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnRatchetCogBattleGraph(landed.cog, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.cog.x, landed.cog.y), "4,0");
  });

  it("seed-ratchet-cog-onto-void: a generation void is not a legal painted cell", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 6, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 5, y: 0 } };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["5,0"]),
    );
    assert.equal(
      rawRatchetCogPairs(occupancy, player).some(
        (p) =>
          occKey(p.cog.x, p.cog.y) === "5,0" ||
          occKey(p.rest.x, p.rest.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.rest.x, landed.rest.y), "5,0");
    assert.equal(
      isOnRatchetCogBattleGraph(landed.cog, player, occupancy),
      true,
    );
    assert.equal(
      isOnRatchetCogBattleGraph(landed.rest, player, occupancy),
      true,
    );
  });

  it("seed-open-field-cog-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = { cog: { x: 4, y: 2 }, rest: { x: 4, y: 3 } };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    assert.equal(isRatchetCogSpawnClear(dest.cog.x, dest.cog.y, player), false);
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-ratchet-cog-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
      [F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 4, y: 1 };
    const dest = { cog: { x: 4, y: 1 }, rest: { x: 4, y: 2 } };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const landed = legalizeRatchetCogPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      occKey(landed.cog.x, landed.cog.y),
      occKey(dest.cog.x, dest.cog.y),
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-ratchet-cog-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 4, y: 1 } };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    assert.equal(isRatchetCogSpawnClear(dest.cog.x, dest.cog.y, player), false);
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.cog.x, landed.cog.y),
      occKey(dest.cog.x, dest.cog.y),
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(landed.cog), true);
  });

  it("seed-ratchet-cog-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { cog: { x: 5, y: 0 }, rest: { x: 6, y: 0 } };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnRatchetCogBattleGraph(landed.cog, player, occupancy),
      true,
    );
    assert.notEqual(
      occKey(landed.cog.x, landed.cog.y),
      occKey(dest.cog.x, dest.cog.y),
    );
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(tiles[0][6], F, "second leftover crumb stays a floor island");
  });

  it("seed-ratchet-cog-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveRatchetCog(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodRatchetCogBattleGraph(player, occupancy).size, 0);
    assert.equal(rawRatchetCogPairs(occupancy, player).length, 0);
  });

  it("seed-ratchet-cog-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const dest = { cog: { x: 4, y: 2 }, rest: { x: 5, y: 2 } };
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(isRatchetCogSpawnClear(dest.cog.x, dest.cog.y, player), false);
  });

  it("seed-ratchet-cog-skips-existing: a second hazard roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawRatchetCogPairs(occupancy, player, existing);
    assert.equal(
      raw.some(
        (p) =>
          occKey(p.cog.x, p.cog.y) === "4,1" ||
          occKey(p.rest.x, p.rest.y) === "4,1",
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-ratchet-cog-count-one: catalog pick is one 2-cell pair, not Pendulum 5", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawRatchetCogPairs(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickRatchetCogCount();
      assert.equal(count, RATCHET_COG_COUNT);
      const picked = pickRatchetCogPairs(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const pair of picked) {
        assert.equal(ratchetCogCellsOrthogonal(pair.cog, pair.rest), true);
        assert.equal(
          occupancy.portals.has(occKey(pair.cog.x, pair.cog.y)),
          false,
        );
        assert.equal(
          isRatchetCogSpawnClear(pair.cog.x, pair.cog.y, player),
          false,
        );
        assert.notEqual(
          occKey(pair.cog.x, pair.cog.y),
          occKey(pair.rest.x, pair.rest.y),
        );
      }
    }
  });

  it("seed-ratchet-cog-not-shift-slab-wall: swap leaves both cells floor", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 4, y: 1 } };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const walkBefore = floodRatchetCogBattleGraph(player, occupancy).size;
    const swapped = resolveRatchetCogAfterRoundStart(dest, player, occupancy);
    assert.equal(
      occKey(swapped.cog.x, swapped.cog.y),
      occKey(dest.rest.x, dest.rest.y),
    );
    assert.equal(
      floodRatchetCogBattleGraph(player, occupancy).size,
      walkBefore,
      "Shift Slab would wall the open slab; Ratchet Cog stays floor",
    );
    assert.equal(tiles[0][4], F);
    assert.equal(tiles[1][4], F);
  });

  it("seed-ratchet-cog-not-pendulum-five: painted run is two cells, not a 5-tile nave", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 0 }], [player], player);
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 5, y: 0 } };
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    const cells = [landed.cog, landed.rest];
    assert.equal(cells.length, RATCHET_COG_PAIR_LENGTH);
    assert.equal(ratchetCogCellsOrthogonal(landed.cog, landed.rest), true);
  });

  it("seed-ratchet-cog-not-twin-sparks: one cog on adjacent cells, not opposite of 4", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 0 }], [player], player);
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 5, y: 0 } };
    const landed = legalizeRatchetCogPlacement(dest, player, occupancy);
    assert.ok(landed);
    const manhattan =
      Math.abs(landed.cog.x - landed.rest.x) +
      Math.abs(landed.cog.y - landed.rest.y);
    assert.equal(
      manhattan,
      1,
      "Twin Sparks opposite of a 4-tile line is dist 3",
    );
  });

  it("seed-ratchet-cog-first-round-swap: round start swaps onto the rest cell", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 4, y: 1 } };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player], player);
    const raw = rawRatchetCogSwap(dest);
    assert.equal(
      occKey(raw.cog.x, raw.cog.y),
      occKey(dest.rest.x, dest.rest.y),
    );
    const swapped = resolveRatchetCogAfterRoundStart(dest, player, occupancy);
    assert.equal(
      occKey(swapped.cog.x, swapped.cog.y),
      occKey(dest.rest.x, dest.rest.y),
    );
    assert.equal(
      occKey(ratchetCogOrb(swapped).x, ratchetCogOrb(swapped).y),
      "4,1",
    );
  });

  it("seed-ratchet-cog-swap-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, P, F],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 4, y: 0 };
    const dest = { cog: { x: 3, y: 0 }, rest: { x: 4, y: 0 } };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const action = legalizeRatchetCogSwap(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const swapped = resolveRatchetCogAfterRoundStart(dest, player, occupancy);
    assert.equal(
      occKey(swapped.cog.x, swapped.cog.y),
      occKey(dest.cog.x, dest.cog.y),
    );
  });

  it("seed-ratchet-cog-swap-through-portal-far-side: leftover rest stays painted", () => {
    const tiles = [
      [F, F, F, P, F, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 5, y: 0 } };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnRatchetCogBattleGraph(dest.rest, player, occupancy),
      false,
    );
    const action = legalizeRatchetCogSwap(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[0][4], F, "must not punch the leftover crumb");
  });

  it("seed-ratchet-cog-swap-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 4, y: 1 } };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 5, y: 0 }],
      [player],
      player,
      new Set(["4,1"]),
    );
    const action = legalizeRatchetCogSwap(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-ratchet-cog-swap-on-unique-bridge: walkable swap still fires", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = { cog: { x: 4, y: 1 }, rest: { x: 5, y: 1 } };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 1 }], [player], player);
    const action = legalizeRatchetCogSwap(dest, player, occupancy);
    assert.equal(action.kind, "swap");
    if (action.kind === "swap") {
      assert.equal(occKey(action.pair.cog.x, action.pair.cog.y), "5,1");
    }
  });

  it("seed-ratchet-cog-occupied-swap-lands: occupied rest still swaps (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 4, y: 1 };
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 4, y: 1 } };
    const occupancy = ctxFrom(tiles, [{ x: 5, y: 0 }], [player, boss], player);
    const action = legalizeRatchetCogSwap(dest, player, occupancy);
    assert.equal(
      action.kind,
      "swap",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "swap") {
      assert.equal(occKey(action.pair.cog.x, action.pair.cog.y), "4,1");
    }
  });

  it("seed-ratchet-cog-clone-keeps-orientation: stay copies do not alias", () => {
    const dest = { cog: { x: 4, y: 0 }, rest: { x: 4, y: 1 } };
    const copy = cloneRatchetCogPair(dest);
    copy.cog.x = 9;
    assert.equal(dest.cog.x, 4);
  });
});

function assertRatchetCogOnWorld(
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
  const snapped = resolveRatchetCog(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodRatchetCogBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} cog placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodRatchetCogBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Ratchet Cog shrunk the walk flood at plant`;
  }
  for (const pair of snapped) {
    if (ratchetCogUnreachable(player, pair, occupancy)) {
      return `${label} Ratchet Cog unreachable at ${occKey(pair.cog.x, pair.cog.y)}`;
    }
    if (!isOnRatchetCogBattleGraph(pair.cog, player, occupancy)) {
      return `${label} cog misses the fight graph at ${occKey(pair.cog.x, pair.cog.y)}`;
    }
    if (!isOnRatchetCogBattleGraph(pair.rest, player, occupancy)) {
      return `${label} rest misses the fight graph at ${occKey(pair.rest.x, pair.rest.y)}`;
    }
    if (!ratchetCogCellsOrthogonal(pair.cog, pair.rest)) {
      return `${label} pair is not orthogonal`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (
      pair.cog.x < 0 ||
      pair.cog.y < 0 ||
      pair.cog.x >= w ||
      pair.cog.y >= h
    ) {
      return `${label} dest ${occKey(pair.cog.x, pair.cog.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(pair.cog.x, pair.cog.y))) {
      return `${label} dest ${occKey(pair.cog.x, pair.cog.y)} sat on a portal`;
    }
    if (occupancy.portals.has(occKey(pair.rest.x, pair.rest.y))) {
      return `${label} rest ${occKey(pair.rest.x, pair.rest.y)} sat on a portal`;
    }
    if (isRatchetCogSpawnClear(pair.cog.x, pair.cog.y, spawn)) {
      return `${label} dest ${occKey(pair.cog.x, pair.cog.y)} sat in spawn±3`;
    }
    if (isRatchetCogSpawnClear(pair.rest.x, pair.rest.y, spawn)) {
      return `${label} rest ${occKey(pair.rest.x, pair.rest.y)} sat in spawn±3`;
    }
    const swapped = resolveRatchetCogAfterRoundStart(
      pair,
      player,
      occupancy,
      spawn,
    );
    if (!isOnRatchetCogBattleGraph(swapped.cog, player, occupancy)) {
      return `${label} swap left the fight graph at ${occKey(swapped.cog.x, swapped.cog.y)}`;
    }
    if (floodRatchetCogBattleGraph(player, occupancy).size !== walkBefore) {
      return `${label} swap shrunk the walk flood`;
    }
  }
  const keys = new Set(snapped.map((p) => ratchetCogPairKey(p)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two cogs on one pair`;
  }
  return null;
}

describe("occupancyRatchetCogUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Ratchet Cog stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRatchetCogOnWorld(
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

  it("corridorMaze wander Ratchet Cog stays on the fight graph", () => {
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
      const miss = assertRatchetCogOnWorld(
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

  it("chessboard destack Ratchet Cog stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRatchetCogOnWorld(
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

  it("Boss Rush destack Ratchet Cog stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRatchetCogOnWorld(
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

  it("rest-exit destack Ratchet Cog stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertRatchetCogOnWorld(
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
    const snapped = resolveRatchetCog(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const pair of snapped) {
      assert.ok(pair.cog.x >= 0 && pair.cog.x < WORLD_GRID_SIZE);
      assert.ok(pair.cog.y >= 0 && pair.cog.y < WORLD_GRID_SIZE);
      assert.ok(pair.rest.x >= 0 && pair.rest.x < WORLD_GRID_SIZE);
      assert.ok(pair.rest.y >= 0 && pair.rest.y < WORLD_GRID_SIZE);
    }
    assert.ok(snapped.length <= RATCHET_COG_COUNT);
  });
});
