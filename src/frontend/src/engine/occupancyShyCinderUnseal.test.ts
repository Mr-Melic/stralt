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
  SHY_CINDER_COUNT,
  SHY_CINDER_FEATURE_ID,
  SHY_CINDER_FLEE,
  SHY_CINDER_HP_TAX_PCT,
  SHY_CINDER_SPAWN_CLEAR,
  floodShyCinderBattleGraph,
  isOnShyCinderBattleGraph,
  isShyCinderSpawnClear,
  legalizeShyCinderAdvance,
  legalizeShyCinderPlacement,
  pickNearestLiving,
  pickShyCinderCount,
  pickShyCinderDest,
  rawShyCinderDests,
  rawShyCinderFleeDest,
  resolveShyCinder,
  resolveShyCinderAdvance,
  resolveShyCinderAfterRoundStart,
  shyCinderChebyshev,
  shyCinderUnreachable,
} from "./occupancyShyCinderUnseal.ts";

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

describe("occupancyShyCinderUnseal regressions", () => {
  it("seed-shy-cinder-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawShyCinderDests(occupancy, player);
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
    assert.equal(SHY_CINDER_COUNT, 1);
    assert.equal(pickShyCinderCount(), 1);
    assert.equal(SHY_CINDER_FEATURE_ID, "WF-HAZ-SHY_CINDER");
    assert.equal(SHY_CINDER_HP_TAX_PCT, 0.05);
    assert.equal(SHY_CINDER_FLEE, 1);
  });

  it("seed-shy-cinder-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawShyCinderDests(occupancy, spawn);
    assert.equal(isShyCinderSpawnClear(0, 0, spawn), true);
    assert.equal(isShyCinderSpawnClear(3, 0, spawn), true);
    assert.equal(isShyCinderSpawnClear(4, 0, spawn), false);
    assert.equal(SHY_CINDER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isShyCinderSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-shy-cinder-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawShyCinderDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isShyCinderSpawnClear(cx, cy, spawn),
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

  it("seed-shy-cinder-through-portal-far-side: one floor hop parks the tax on a crumb", () => {
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
      isOnShyCinderBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(shyCinderUnreachable(player, dest, occupancy), true);
    const landed = legalizeShyCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnShyCinderBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
    assert.equal(isShyCinderSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-shy-cinder-on-unique-bridge: walkable tax may sit on the corridor", () => {
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
      isOnShyCinderBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    assert.equal(isShyCinderSpawnClear(5, 1, player), false);
    const landed = legalizeShyCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor cinder stays — it is a walkable tax",
    );
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-shy-cinder-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeShyCinderPlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(isOnShyCinderBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-shy-cinder-onto-void: a generation void is not a steppable tax", () => {
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
      rawShyCinderDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(shyCinderUnreachable(player, dest, occupancy), true);
    const landed = legalizeShyCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnShyCinderBattleGraph(landed, player, occupancy), true);
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-open-field-shy-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeShyCinderPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-shy-cinder-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isShyCinderSpawnClear(5, 0, spawn), false);
    const landed = legalizeShyCinderPlacement(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-shy-cinder-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeShyCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(isOnShyCinderBattleGraph(landed, player, occupancy), true);
  });

  it("seed-shy-cinder-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnShyCinderBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(shyCinderUnreachable(player, dest, occupancy), true);
    const landed = legalizeShyCinderPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnShyCinderBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(shyCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-shy-cinder-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveShyCinder(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodShyCinderBattleGraph(player, occupancy).size, 0);
    assert.equal(shyCinderUnreachable(player, snapped, occupancy), true);
    assert.equal(rawShyCinderDests(occupancy, player).length, 0);
  });

  it("seed-shy-cinder-count-one: catalog pick is a single independent dest", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawShyCinderDests(occupancy, player);
    assert.ok(raw.length > 1, "raster must offer more than one hostable cell");
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickShyCinderCount();
      assert.equal(count, 1);
      const picked = pickShyCinderDest(raw, rng);
      assert.ok(picked);
      assert.equal(occupancy.portals.has(occKey(picked.x, picked.y)), false);
      assert.equal(isShyCinderSpawnClear(picked.x, picked.y, player), false);
    }
  });

  it("seed-shy-cinder-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawShyCinderDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawShyCinderDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-shy-cinder-flee-increases-chebyshev: one cardinal away, not toward", () => {
    const origin = { x: 4, y: 2 };
    assert.deepEqual(rawShyCinderFleeDest(origin, { x: 7, y: 2 }), {
      x: 3,
      y: 2,
    });
    assert.deepEqual(rawShyCinderFleeDest(origin, { x: 4, y: 0 }), {
      x: 4,
      y: 3,
    });
    assert.equal(shyCinderChebyshev(origin, { x: 7, y: 2 }), 3);
    assert.equal(
      shyCinderChebyshev(rawShyCinderFleeDest(origin, { x: 7, y: 2 }), {
        x: 7,
        y: 2,
      }),
      4,
    );
    assert.deepEqual(
      rawShyCinderFleeDest(origin, null),
      origin,
      "no living unit this round stays",
    );
  });

  it("seed-shy-cinder-flee-colocated-east: D=0 still steps, Hunting Lantern would stay", () => {
    const origin = { x: 4, y: 2 };
    const raw = rawShyCinderFleeDest(origin, origin);
    assert.deepEqual(
      raw,
      { x: 5, y: 2 },
      "co-located flees first-in-ORTH (east); Hunting Lantern chase stays",
    );
    assert.equal(shyCinderChebyshev(raw, origin), 1);
  });

  it("seed-shy-cinder-not-hunt-lantern-toward: unique-corridor flees east while chase would go west", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const origin = { x: 5, y: 1 };
    const raw = rawShyCinderFleeDest(origin, player);
    assert.deepEqual(
      raw,
      { x: 6, y: 1 },
      "away from a west player is east; Hunting Lantern toward would be (4,1)",
    );
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(next, { x: 6, y: 1 });
    assert.equal(tiles[1][6], F);
    assert.equal(isOnShyCinderBattleGraph(next, player, occupancy), true);
  });

  it("seed-shy-cinder-not-orbiting-cinder: flee is not a 4-cycle square", () => {
    const origin = { x: 4, y: 4 };
    const nearest = { x: 4, y: 2 };
    const first = rawShyCinderFleeDest(origin, nearest);
    assert.deepEqual(first, { x: 4, y: 5 });
    const second = rawShyCinderFleeDest(first, nearest);
    assert.deepEqual(second, { x: 4, y: 6 });
    assert.notEqual(
      occKey(second.x, second.y),
      occKey(origin.x, origin.y),
      "Orbiting Cinder would close a 4-cycle; shy keeps running south",
    );
  });

  it("seed-shy-cinder-not-rim-cinder: flee is not a painted outer rim wrap", () => {
    const origin = { x: 2, y: 2 };
    const nearest = { x: 2, y: 5 };
    const first = rawShyCinderFleeDest(origin, nearest);
    assert.deepEqual(first, { x: 2, y: 1 });
    const second = rawShyCinderFleeDest(first, nearest);
    assert.deepEqual(second, { x: 2, y: 0 });
    assert.equal(
      shyCinderChebyshev(second, nearest),
      5,
      "Rim Cinder wraps a ≥ 8-cell ring; shy just keeps increasing Chebyshev",
    );
  });

  it("seed-shy-cinder-nearest-of-two: closer body wins over a far MP spender", () => {
    const origin = { x: 5, y: 2 };
    const near = { x: 6, y: 2 };
    const far = { x: 0, y: 0 };
    const picked = pickNearestLiving(origin, [far, near]);
    assert.deepEqual(picked, near);
    const raw = rawShyCinderFleeDest(origin, picked);
    assert.deepEqual(
      raw,
      { x: 4, y: 2 },
      "Hunting Lantern would chase the last MP spender even when farther",
    );
  });

  it("seed-shy-cinder-flee-onto-portal: round-start step stays off the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = { x: 7, y: 0 };
    const raw = rawShyCinderFleeDest(origin, player);
    assert.equal(occKey(raw.x, raw.y), "8,0");
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(occupancy.portals.has(occKey(next.x, next.y)), false);
  });

  it("seed-shy-cinder-flee-through-portal-far-side: drop the hop, do not park on the crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = { x: 7, y: 0 };
    const raw = rawShyCinderFleeDest(origin, player);
    assert.equal(occKey(raw.x, raw.y), "8,0");
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(
      next.x >= 9,
      false,
      "flee must not hop the portal onto the leftover crumb",
    );
    assert.equal(tiles[0][9], F);
  });

  it("seed-shy-cinder-flee-on-unique-bridge: walkable tax does step along the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const origin = { x: 5, y: 1 };
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(next, { x: 6, y: 1 });
    assert.equal(tiles[1][6], F);
    assert.equal(isOnShyCinderBattleGraph(next, player, occupancy), true);
  });

  it("seed-shy-cinder-flee-no-body-stays: missing nearest does not invent a heading", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const origin = { x: 5, y: 0 };
    const next = resolveShyCinderAdvance(origin, null, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(pickNearestLiving(origin, []), null);
  });

  it("seed-shy-cinder-flee-onto-void: drop the step rather than snap sideways", () => {
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
      new Set(["6,0"]),
    );
    const origin = { x: 5, y: 0 };
    const raw = rawShyCinderFleeDest(origin, player);
    assert.equal(occKey(raw.x, raw.y), "6,0");
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(tiles[1][5], F, "must not relocate onto a different origin");
  });

  it("seed-shy-cinder-flee-occupied-lands: landing tax, not a wall", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const origin = { x: 5, y: 0 };
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(
      next,
      { x: 6, y: 0 },
      "occupied fight-graph dest still flees — the orb taxes the body",
    );
    assert.equal(occupancy.isOccupied(next), true);
  });

  it("seed-shy-cinder-blocked-steps-stay: no increasing cardinal keeps the cell", () => {
    const origin = { x: 2, y: 2 };
    const nearest = { x: 2, y: 2 };
    const trapped = rawShyCinderFleeDest(origin, nearest);
    assert.deepEqual(trapped, { x: 3, y: 2 });
    const tiles = [
      [W, W, W, W, W],
      [W, W, W, W, W],
      [W, W, F, W, P],
      [W, W, W, W, W],
    ];
    const player = { x: 2, y: 2 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 2 }], [player], player);
    const next = legalizeShyCinderAdvance(origin, player, player, occupancy);
    assert.deepEqual(
      next,
      origin,
      "east is a wall; the only increasing cardinal is blocked so stay",
    );
  });

  it("seed-shy-cinder-after-round-start: nearest-of-roster then one legal hop", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 7, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const origin = { x: 5, y: 0 };
    assert.deepEqual(
      pickNearestLiving(origin, [player, boss]),
      boss,
      "boss at (7,1) is Chebyshev 2 vs player Chebyshev 5 — not last-MP-spender",
    );
    const next = resolveShyCinderAfterRoundStart(
      origin,
      [player, boss],
      player,
      occupancy,
    );
    assert.deepEqual(
      next,
      { x: 4, y: 0 },
      "flee west away from the closer boss; Hunting Lantern would ignore that body",
    );
    assert.equal(isOnShyCinderBattleGraph(next, player, occupancy), true);
  });
});

function assertShyCinderOnWorld(
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
  const raw = rawShyCinderDests(occupancy, spawn);
  const snapped = resolveShyCinder(player, occupancy, rng, undefined, spawn);
  const battle = floodShyCinderBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} cinder placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = [...battle].some((k) => {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    return (
      !occupancy.portals.has(k) &&
      !isShyCinderSpawnClear(x, y, spawn) &&
      !occupancy.voidTiles.has(k)
    );
  });
  if (raw.length > 0 && hostable && !snapped) {
    return `${label} dropped the cinder even though the fight graph is nonempty`;
  }
  if (!snapped) return null;
  if (shyCinderUnreachable(player, snapped, occupancy)) {
    return `${label} Shy Cinder unreachable at ${occKey(snapped.x, snapped.y)}`;
  }
  if (!isOnShyCinderBattleGraph(snapped, player, occupancy)) {
    return `${label} cinder misses the fight graph at ${occKey(snapped.x, snapped.y)}`;
  }
  if (isShyCinderSpawnClear(snapped.x, snapped.y, spawn)) {
    return `${label} dest ${occKey(snapped.x, snapped.y)} sat in spawn±3`;
  }
  const h = occupancy.tiles.length;
  const w = occupancy.tiles[0]?.length ?? 0;
  if (snapped.x < 0 || snapped.y < 0 || snapped.x >= w || snapped.y >= h) {
    return `${label} dest ${occKey(snapped.x, snapped.y)} out of bounds`;
  }
  if (occupancy.portals.has(occKey(snapped.x, snapped.y))) {
    return `${label} dest ${occKey(snapped.x, snapped.y)} sat on a portal`;
  }
  const bodies = [player, ...units];
  const advanced = resolveShyCinderAfterRoundStart(
    snapped,
    bodies,
    player,
    occupancy,
    spawn,
  );
  if (occupancy.portals.has(occKey(advanced.x, advanced.y))) {
    return `${label} flee sat on a portal at ${occKey(advanced.x, advanced.y)}`;
  }
  if (isShyCinderSpawnClear(advanced.x, advanced.y, spawn)) {
    return `${label} flee sat in spawn±3 at ${occKey(advanced.x, advanced.y)}`;
  }
  if (!isOnShyCinderBattleGraph(advanced, player, occupancy)) {
    return `${label} flee left the fight graph at ${occKey(advanced.x, advanced.y)}`;
  }
  return null;
}

describe("occupancyShyCinderUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Shy Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShyCinderOnWorld(
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

  it("corridorMaze wander Shy Cinder stays on the fight graph", () => {
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
      const miss = assertShyCinderOnWorld(
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

  it("chessboard destack Shy Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShyCinderOnWorld(
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

  it("Boss Rush destack Shy Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertShyCinderOnWorld(
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

  it("rest-exit destack Shy Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertShyCinderOnWorld(
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
    const snapped = resolveShyCinder(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    assert.ok(snapped.x >= 0 && snapped.x < WORLD_GRID_SIZE);
    assert.ok(snapped.y >= 0 && snapped.y < WORLD_GRID_SIZE);
  });
});
