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
  TURNSTILE_EMBER_COUNT,
  TURNSTILE_EMBER_FEATURE_ID,
  TURNSTILE_EMBER_HP_TAX_PCT,
  TURNSTILE_EMBER_PLUS_SIZE,
  TURNSTILE_EMBER_SPAWN_CLEAR,
  cloneTurnstileEmber,
  floodTurnstileEmberBattleGraph,
  isOnTurnstileEmberBattleGraph,
  isTurnstileEmberSpawnClear,
  legalizeTurnstileEmberAdvance,
  legalizeTurnstileEmberPlacement,
  pickTurnstileEmberCount,
  pickTurnstileEmberPluses,
  rawTurnstileEmberAdvance,
  rawTurnstileEmberPluses,
  resolveTurnstileEmber,
  resolveTurnstileEmberAfterRoundStart,
  turnstileEmberAdjacentArmsManhattan,
  turnstileEmberCells,
  turnstileEmberIsPlusNotSquare,
  turnstileEmberOrb,
  turnstileEmberPlusKey,
  turnstileEmberPlusUnreachable,
  turnstileEmberUnreachable,
} from "./occupancyTurnstileEmberUnseal.ts";
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

describe("occupancyTurnstileEmberUnseal regressions", () => {
  it("seed-turnstile-ember-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawTurnstileEmberPluses(occupancy, player);
    assert.equal(
      raw.some((plus) =>
        turnstileEmberCells(plus.center).some(
          (arm) => occKey(arm.x, arm.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some(
        (plus) =>
          (plus.center.x === 5 && plus.center.y === 1) ||
          turnstileEmberCells(plus.center).some(
            (arm) => arm.x === 6 && arm.y === 1,
          ),
      ),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(TURNSTILE_EMBER_COUNT, 1);
    assert.equal(TURNSTILE_EMBER_PLUS_SIZE, 4);
    assert.equal(TURNSTILE_EMBER_HP_TAX_PCT, 0.05);
    assert.equal(TURNSTILE_EMBER_FEATURE_ID, "WF-HAZ-TURNSTILE_EMBER");
  });

  it("seed-turnstile-ember-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 3 }], [spawn], spawn);
    const raw = rawTurnstileEmberPluses(occupancy, spawn);
    assert.equal(isTurnstileEmberSpawnClear(0, 0, spawn), true);
    assert.equal(isTurnstileEmberSpawnClear(3, 0, spawn), true);
    assert.equal(isTurnstileEmberSpawnClear(4, 0, spawn), false);
    assert.equal(TURNSTILE_EMBER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((plus) =>
        turnstileEmberCells(plus.center).some((arm) =>
          isTurnstileEmberSpawnClear(arm.x, arm.y, spawn),
        ),
      ),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((plus) =>
        turnstileEmberCells(plus.center).some(
          (arm) => arm.x === 5 && arm.y === 1,
        ),
      ),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-turnstile-ember-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawTurnstileEmberPluses(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isTurnstileEmberSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((plus) => plus.center.x === cx && plus.center.y === cy),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((plus) =>
        turnstileEmberCells(plus.center).some(
          (arm) => arm.x === 0 && arm.y === 0,
        ),
      ),
      false,
      "the legalized spawn cell itself is skipped",
    );
  });

  it("seed-turnstile-ember-extraHazardRoll-one: catalog min=max=1 plants one ember", () => {
    const stub = {
      extraHazardCount: { min: 1, max: 1 },
    } as WorldFeature;
    const rng = createSeededRng(19);
    assert.equal(
      extraHazardRoll(stub, rng),
      1,
      "unlike Raise Slab omitted band, Turnstile Ember rides extraHazardRoll = 1",
    );
    assert.equal(pickTurnstileEmberCount(), TURNSTILE_EMBER_COUNT);
  });

  it("seed-turnstile-ember-through-portal-far-side: leftover plus snaps onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { center: { x: 6, y: 1 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnTurnstileEmberBattleGraph(dest.center, player, occupancy),
      false,
      "far crumb hollow must start battle-isolated",
    );
    assert.equal(turnstileEmberPlusUnreachable(player, dest, occupancy), true);
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    for (const arm of turnstileEmberCells(landed.center)) {
      assert.equal(isOnTurnstileEmberBattleGraph(arm, player, occupancy), true);
    }
    assert.notEqual(
      occKey(landed.center.x, landed.center.y),
      occKey(dest.center.x, dest.center.y),
    );
    assert.equal(turnstileEmberUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-turnstile-ember-on-unique-bridge: walkable plus stays on the alcove cross", () => {
    const tiles = [
      [W, W, W, W, W, F, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, F, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 9, y: 1 };
    const dest = { center: { x: 5, y: 1 }, emberIndex: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnTurnstileEmberBattleGraph(
        { x: dest.center.x, y: dest.center.y - 1 },
        player,
        occupancy,
      ),
      true,
      "alcove north arm already sits on the fight graph",
    );
    const walkBefore = floodTurnstileEmberBattleGraph(player, occupancy).size;
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed, "walkable unique-corridor plus must stay");
    assert.equal(
      occKey(landed.center.x, landed.center.y),
      occKey(dest.center.x, dest.center.y),
      "unlike Shift Slab / Raise Slab, a unique-corridor Turnstile Ember stays",
    );
    assert.equal(
      floodTurnstileEmberBattleGraph(player, occupancy).size,
      walkBefore,
      "plant stays walkable — Shift Slab would shrink the flood",
    );
    const rotated = resolveTurnstileEmberAfterRoundStart(
      landed,
      player,
      occupancy,
    );
    const next = rawTurnstileEmberAdvance(landed);
    const nextOrb = turnstileEmberOrb(next);
    const rotatedOrb = turnstileEmberOrb(rotated);
    assert.equal(
      occKey(rotatedOrb.x, rotatedOrb.y),
      occKey(nextOrb.x, nextOrb.y),
      "first-round clockwise hop still fires on the unique-corridor plus",
    );
    assert.equal(
      floodTurnstileEmberBattleGraph(player, occupancy).size,
      walkBefore,
      "rotate is not a wall — Shift Slab would cut the corridor",
    );
  });

  it("seed-turnstile-ember-on-unique-bridge-no-dump: 1-wide with no alcove drops", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const portal = { x: 7, y: 1 };
    const dest = { center: { x: 4, y: 1 }, emberIndex: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.equal(
      landed,
      null,
      "a plus needs N/S arms; Ratchet Cog would stay on the 1-wide pair",
    );
    assert.equal(tiles[1][4], F, "must not punch the unique corridor");
    assert.equal(tiles[0][4], W, "must not punch a north alcove");
  });

  it("seed-turnstile-ember-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, W, W, W, F, F, F, F, F],
      [F, W, W, W, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTurnstileEmberPlacement(
      { center: { x: 6, y: 1 }, emberIndex: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnTurnstileEmberBattleGraph(
        turnstileEmberOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(occKey(landed.center.x, landed.center.y), "6,1");
  });

  it("seed-turnstile-ember-onto-void: a generation void is not a legal painted arm", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = { center: { x: 6, y: 2 }, emberIndex: 1 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["7,2"]),
    );
    assert.equal(
      rawTurnstileEmberPluses(occupancy, player).some((plus) =>
        turnstileEmberCells(plus.center).some(
          (arm) => occKey(arm.x, arm.y) === "7,2",
        ),
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      turnstileEmberCells(landed.center).some(
        (arm) => occKey(arm.x, arm.y) === "7,2",
      ),
      false,
    );
    for (const arm of turnstileEmberCells(landed.center)) {
      assert.equal(isOnTurnstileEmberBattleGraph(arm, player, occupancy), true);
    }
  });

  it("seed-open-field-ember-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = { center: { x: 5, y: 3 }, emberIndex: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 6 }], [player], player);
    assert.equal(
      isTurnstileEmberSpawnClear(dest.center.x, dest.center.y, player),
      false,
    );
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
  });

  it("seed-turnstile-ember-covers-player: walkable plant stays on a destacked player", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 2 };
    const dest = { center: { x: 5, y: 3 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const landed = legalizeTurnstileEmberPlacement(
      dest,
      player,
      occupancy,
      new Set(),
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      occKey(turnstileEmberOrb(landed).x, turnstileEmberOrb(landed).y),
      occKey(player.x, player.y),
      "covering a destacked player stays — the cell is still floor",
    );
  });

  it("seed-turnstile-ember-occupied-stays: occupancy-blind dest stays on a dual-path unit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 1 };
    const dest = { center: { x: 5, y: 2 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    assert.equal(
      isTurnstileEmberSpawnClear(dest.center.x, dest.center.y, player),
      false,
    );
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(turnstileEmberOrb(landed).x, turnstileEmberOrb(landed).y),
      occKey(dest.center.x, dest.center.y - 1),
      "an occupied fight-graph cell stays — landing tax, not a wall",
    );
    assert.equal(occupancy.isOccupied(turnstileEmberOrb(landed)), true);
  });

  it("seed-turnstile-ember-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, F, F, W, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { center: { x: 6, y: 1 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnTurnstileEmberBattleGraph(
        turnstileEmberOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(
      occKey(landed.center.x, landed.center.y),
      occKey(dest.center.x, dest.center.y),
    );
    assert.equal(
      tiles[3][5],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[1][6], F, "leftover crumb stays a floor island");
  });

  it("seed-turnstile-ember-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveTurnstileEmber(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodTurnstileEmberBattleGraph(player, occupancy).size, 0);
    assert.equal(rawTurnstileEmberPluses(occupancy, player).length, 0);
  });

  it("seed-turnstile-ember-dual-path: one corridor dest cannot cut every exit", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest = { center: { x: 5, y: 1 }, emberIndex: 2 };
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      isTurnstileEmberSpawnClear(dest.center.x, dest.center.y, player),
      false,
    );
  });

  it("seed-turnstile-ember-skips-existing: a second hazard roll does not restamp", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["5,1"]);
    const raw = rawTurnstileEmberPluses(occupancy, player, existing);
    assert.equal(
      raw.some((plus) =>
        turnstileEmberCells(plus.center).some(
          (arm) => occKey(arm.x, arm.y) === "5,1",
        ),
      ),
      false,
      "catalog must not stack two extraHazard dests on one cell",
    );
  });

  it("seed-turnstile-ember-count-one: catalog pick is one 4-arm plus, not Pendulum 5", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const raw = rawTurnstileEmberPluses(occupancy, player);
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickTurnstileEmberCount();
      assert.equal(count, TURNSTILE_EMBER_COUNT);
      const picked = pickTurnstileEmberPluses(raw, rng, count);
      assert.ok(picked.length <= 1);
      for (const plus of picked) {
        assert.equal(turnstileEmberIsPlusNotSquare(plus.center), true);
        assert.equal(turnstileEmberCells(plus.center).length, 4);
        for (const arm of turnstileEmberCells(plus.center)) {
          assert.equal(occupancy.portals.has(occKey(arm.x, arm.y)), false);
          assert.equal(isTurnstileEmberSpawnClear(arm.x, arm.y, player), false);
        }
      }
    }
  });

  it("seed-turnstile-ember-not-orbiting-cinder-square: consecutive arms are Manhattan 2", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { center: { x: 5, y: 2 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    const arms = turnstileEmberCells(landed.center);
    const a = arms[0];
    const b = arms[1];
    assert.ok(a && b);
    assert.equal(
      turnstileEmberAdjacentArmsManhattan(a, b),
      2,
      "Orbiting Cinder consecutive square corners are Manhattan 1",
    );
    assert.equal(turnstileEmberIsPlusNotSquare(landed.center), true);
    const filled = [
      occKey(landed.center.x, landed.center.y),
      occKey(landed.center.x + 1, landed.center.y),
      occKey(landed.center.x + 1, landed.center.y + 1),
      occKey(landed.center.x, landed.center.y + 1),
    ];
    const painted = new Set(arms.map((arm) => occKey(arm.x, arm.y)));
    assert.equal(
      filled.every((k) => painted.has(k)),
      false,
      "painted arms are not a filled 2×2 NW origin",
    );
  });

  it("seed-turnstile-ember-not-ratchet-cog-pair: painted run is four arms, not two cells", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest = { center: { x: 5, y: 1 }, emberIndex: 0 };
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      turnstileEmberCells(landed.center).length,
      TURNSTILE_EMBER_PLUS_SIZE,
    );
  });

  it("seed-turnstile-ember-not-pendulum-five: plus is not a 5-tile nave", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const dest = { center: { x: 5, y: 1 }, emberIndex: 0 };
    const landed = legalizeTurnstileEmberPlacement(dest, player, occupancy);
    assert.ok(landed);
    const xs = new Set(turnstileEmberCells(landed.center).map((arm) => arm.x));
    const ys = new Set(turnstileEmberCells(landed.center).map((arm) => arm.y));
    assert.equal(
      xs.size > 1 && ys.size > 1,
      true,
      "Pendulum Censer is a collinear 5-tile nave",
    );
  });

  it("seed-turnstile-ember-first-round-clockwise: round start hops N onto E", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { center: { x: 5, y: 2 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const raw = rawTurnstileEmberAdvance(dest);
    assert.equal(raw.emberIndex, 1);
    assert.equal(
      occKey(turnstileEmberOrb(raw).x, turnstileEmberOrb(raw).y),
      "6,2",
    );
    const rotated = resolveTurnstileEmberAfterRoundStart(
      dest,
      player,
      occupancy,
    );
    assert.equal(
      occKey(turnstileEmberOrb(rotated).x, turnstileEmberOrb(rotated).y),
      "6,2",
    );
  });

  it("seed-turnstile-ember-advance-onto-portal: drop the hop rather than stamp the gate", () => {
    const tiles = [
      [F, F, F, F, P, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 4, y: 0 };
    const dest = { center: { x: 4, y: 1 }, emberIndex: 3 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const action = legalizeTurnstileEmberAdvance(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    const rotated = resolveTurnstileEmberAfterRoundStart(
      dest,
      player,
      occupancy,
    );
    assert.equal(
      occKey(turnstileEmberOrb(rotated).x, turnstileEmberOrb(rotated).y),
      occKey(turnstileEmberOrb(dest).x, turnstileEmberOrb(dest).y),
    );
  });

  it("seed-turnstile-ember-advance-through-portal-far-side: leftover next arm stays painted", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { center: { x: 5, y: 0 }, emberIndex: 3 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnTurnstileEmberBattleGraph(turnstileEmberOrb(dest), player, occupancy),
      false,
    );
    const action = legalizeTurnstileEmberAdvance(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
    assert.equal(tiles[0][4], F, "must not punch the leftover crumb");
  });

  it("seed-turnstile-ember-advance-onto-void: drop the hop rather than tax a void", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const dest = { center: { x: 4, y: 1 }, emberIndex: 3 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 6, y: 0 }],
      [player],
      player,
      new Set(["4,0"]),
    );
    const action = legalizeTurnstileEmberAdvance(dest, player, occupancy);
    assert.equal(action.kind, "stay");
    if (action.kind === "stay") {
      assert.equal(action.reason, "off-graph");
    }
  });

  it("seed-turnstile-ember-advance-on-unique-bridge: walkable hop still fires", () => {
    const tiles = [
      [W, W, W, W, W, F, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, F, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const dest = { center: { x: 5, y: 1 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 1 }], [player], player);
    const action = legalizeTurnstileEmberAdvance(dest, player, occupancy);
    assert.equal(action.kind, "rotate");
    if (action.kind === "rotate") {
      assert.equal(
        occKey(
          turnstileEmberOrb(action.plus).x,
          turnstileEmberOrb(action.plus).y,
        ),
        "6,1",
      );
    }
  });

  it("seed-turnstile-ember-occupied-rotate-lands: occupied next arm still rotates (landing tax)", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 6, y: 2 };
    const dest = { center: { x: 5, y: 2 }, emberIndex: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const action = legalizeTurnstileEmberAdvance(dest, player, occupancy);
    assert.equal(
      action.kind,
      "rotate",
      "unlike Shift Slab occupied-shut, landing tax still fires",
    );
    if (action.kind === "rotate") {
      assert.equal(
        occKey(
          turnstileEmberOrb(action.plus).x,
          turnstileEmberOrb(action.plus).y,
        ),
        "6,2",
      );
    }
  });

  it("seed-turnstile-ember-clone-keeps-orientation: stay copies do not alias", () => {
    const dest = { center: { x: 4, y: 2 }, emberIndex: 0 };
    const copy = cloneTurnstileEmber(dest);
    copy.center.x = 9;
    copy.emberIndex = 3;
    assert.equal(dest.center.x, 4);
    assert.equal(dest.emberIndex, 0);
  });

  it("seed-turnstile-ember-plus-key-is-hollow: two ember indices share one plus", () => {
    const a = { center: { x: 5, y: 2 }, emberIndex: 0 };
    const b = { center: { x: 5, y: 2 }, emberIndex: 2 };
    assert.equal(turnstileEmberPlusKey(a), turnstileEmberPlusKey(b));
  });
});

function assertTurnstileEmberOnWorld(
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
  const snapped = resolveTurnstileEmber(
    player,
    occupancy,
    rng,
    undefined,
    undefined,
    spawn,
  );
  const battle = floodTurnstileEmberBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} ember placed on an empty fight graph`;
    }
    return null;
  }
  const walkBefore = battle.size;
  const walkAfter = floodTurnstileEmberBattleGraph(player, occupancy).size;
  if (walkAfter !== walkBefore) {
    return `${label} Turnstile Ember shrunk the walk flood at plant`;
  }
  for (const plus of snapped) {
    if (turnstileEmberUnreachable(player, plus, occupancy)) {
      return `${label} Turnstile Ember unreachable at ${occKey(plus.center.x, plus.center.y)}`;
    }
    if (!turnstileEmberIsPlusNotSquare(plus.center)) {
      return `${label} dest is not a plus`;
    }
    for (const arm of turnstileEmberCells(plus.center)) {
      if (!isOnTurnstileEmberBattleGraph(arm, player, occupancy)) {
        return `${label} arm misses the fight graph at ${occKey(arm.x, arm.y)}`;
      }
      const h = occupancy.tiles.length;
      const w = occupancy.tiles[0]?.length ?? 0;
      if (arm.x < 0 || arm.y < 0 || arm.x >= w || arm.y >= h) {
        return `${label} dest ${occKey(arm.x, arm.y)} out of bounds`;
      }
      if (occupancy.portals.has(occKey(arm.x, arm.y))) {
        return `${label} dest ${occKey(arm.x, arm.y)} sat on a portal`;
      }
      if (isTurnstileEmberSpawnClear(arm.x, arm.y, spawn)) {
        return `${label} dest ${occKey(arm.x, arm.y)} sat in spawn±3`;
      }
    }
    const rotated = resolveTurnstileEmberAfterRoundStart(
      plus,
      player,
      occupancy,
      spawn,
    );
    if (
      !isOnTurnstileEmberBattleGraph(
        turnstileEmberOrb(rotated),
        player,
        occupancy,
      )
    ) {
      return `${label} rotate left the fight graph at ${occKey(turnstileEmberOrb(rotated).x, turnstileEmberOrb(rotated).y)}`;
    }
    if (floodTurnstileEmberBattleGraph(player, occupancy).size !== walkBefore) {
      return `${label} rotate shrunk the walk flood`;
    }
  }
  const keys = new Set(snapped.map((p) => turnstileEmberPlusKey(p)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two embers on one plus`;
  }
  return null;
}

describe("occupancyTurnstileEmberUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Turnstile Ember stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTurnstileEmberOnWorld(
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

  it("corridorMaze wander Turnstile Ember stays on the fight graph", () => {
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
      const miss = assertTurnstileEmberOnWorld(
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

  it("chessboard destack Turnstile Ember stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTurnstileEmberOnWorld(
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

  it("Boss Rush destack Turnstile Ember stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertTurnstileEmberOnWorld(
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

  it("rest-exit destack Turnstile Ember stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertTurnstileEmberOnWorld(
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
    const snapped = resolveTurnstileEmber(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const plus of snapped) {
      for (const arm of turnstileEmberCells(plus.center)) {
        assert.ok(arm.x >= 0 && arm.x < WORLD_GRID_SIZE);
        assert.ok(arm.y >= 0 && arm.y < WORLD_GRID_SIZE);
      }
    }
    assert.ok(snapped.length <= TURNSTILE_EMBER_COUNT);
  });
});
