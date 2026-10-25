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
  ORBITING_CINDER_CLOCKWISE,
  ORBITING_CINDER_COUNT,
  ORBITING_CINDER_SPAWN_CLEAR,
  ORBITING_CINDER_SQUARE_SIZE,
  type OrbitingCinder,
  clampOrbitingCinderIndex,
  floodOrbitingCinderBattleGraph,
  isOnOrbitingCinderBattleGraph,
  isOrbitingCinderSpawnClear,
  legalizeOrbitingCinderAdvance,
  legalizeOrbitingCinderSquare,
  orbitingCinderCells,
  orbitingCinderOrb,
  orbitingCinderUnreachable,
  pickOrbitingCinderCount,
  pickOrbitingCinderSquare,
  rawOrbitingCinderAdvance,
  rawOrbitingCinderSquares,
  resolveOrbitingCinder,
  resolveOrbitingCinderAdvance,
} from "./occupancyOrbitingCinderUnseal.ts";

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

function squareAt(x: number, y: number, orbIndex = 0): OrbitingCinder {
  return { origin: { x, y }, orbIndex };
}

describe("occupancyOrbitingCinderUnseal regressions", () => {
  it("seed-orbit-cinder-clockwise-not-row-major: 4-cycle is NW→NE→SE→SW", () => {
    assert.deepEqual(ORBITING_CINDER_CLOCKWISE, [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]);
    assert.notDeepEqual(
      ORBITING_CINDER_CLOCKWISE,
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      "BOARD_CLAIM row-major is NW, NE, SW, SE — cinder is a clockwise orbit",
    );
    const cells = orbitingCinderCells({ x: 4, y: 2 });
    assert.deepEqual(cells, [
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 5, y: 3 },
      { x: 4, y: 3 },
    ]);
    assert.equal(ORBITING_CINDER_SQUARE_SIZE, 4);
    assert.equal(clampOrbitingCinderIndex(-1), 3);
    const orb = orbitingCinderOrb(squareAt(4, 2, 2));
    assert.deepEqual(orb, { x: 5, y: 3 });
  });

  it("seed-orbit-cinder-raw-skips-portal: production floor raster never paints the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawOrbitingCinderSquares(occupancy, player);
    assert.equal(
      raw.some((s) =>
        orbitingCinderCells(s.origin).some(
          (c) => occKey(c.x, c.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips any 2×2 that includes the portal",
    );
    assert.equal(
      raw.some((s) => s.origin.x === 6 && s.origin.y === 0),
      true,
      "a leftover 2×2 crumb is a legal raw dest",
    );
    assert.equal(ORBITING_CINDER_COUNT, 1);
    assert.equal(pickOrbitingCinderCount(), 1);
  });

  it("seed-orbit-cinder-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawOrbitingCinderSquares(occupancy, spawn);
    assert.equal(isOrbitingCinderSpawnClear(0, 0, spawn), true);
    assert.equal(isOrbitingCinderSpawnClear(3, 0, spawn), true);
    assert.equal(isOrbitingCinderSpawnClear(4, 0, spawn), false);
    assert.equal(ORBITING_CINDER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((s) =>
        orbitingCinderCells(s.origin).some((c) =>
          isOrbitingCinderSpawnClear(c.x, c.y, spawn),
        ),
      ),
      false,
      "raw squares must not overlap the spawn-clear diamond",
    );
    assert.equal(
      raw.some((s) => s.origin.x === 4 && s.origin.y === 0),
      true,
      "a 2×2 outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-orbit-cinder-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawOrbitingCinderSquares(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isOrbitingCinderSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((s) => s.origin.x === cx && s.origin.y === cy),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((s) => s.origin.x === 0 && s.origin.y === 0),
      false,
      "the legalized spawn cell itself is skipped",
    );
    assert.equal(
      raw.some((s) =>
        orbitingCinderCells(s.origin).some(
          (c) => occKey(c.x, c.y) === occKey(size - 1, 0),
        ),
      ),
      false,
      "the corner portal is still skipped",
    );
  });

  it("seed-orbit-cinder-through-portal-far-side: a leftover 2×2 never taxes the fight graph", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F],
      [F, F, F, F, F, F, F, F, W, F, F],
      [W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = squareAt(9, 0);
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnOrbitingCinderBattleGraph({ x: 9, y: 0 }, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(orbitingCinderUnreachable(player, dest, occupancy), true);
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.ok(landed);
    for (const cell of orbitingCinderCells(landed.origin)) {
      assert.equal(
        isOnOrbitingCinderBattleGraph(cell, player, occupancy),
        true,
        `corner ${occKey(cell.x, cell.y)} must sit on the fight graph`,
      );
    }
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "9,0");
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
    assert.equal(
      isOrbitingCinderSpawnClear(landed.origin.x, landed.origin.y, player),
      false,
    );
    assert.equal(tiles[0][9], F, "must not punch or wall the leftover crumb");
  });

  it("seed-orbit-cinder-on-unique-bridge: walkable tax may sit on a 2-wide alcove", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, F, F, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 11, y: 1 };
    const dest = squareAt(4, 1);
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnOrbitingCinderBattleGraph({ x: 5, y: 1 }, player, occupancy),
      true,
      "unique-corridor alcove already taxes the fight graph",
    );
    assert.equal(isOrbitingCinderSpawnClear(4, 1, player), false);
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor cinder stays — it is a walkable tax",
    );
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-orbit-cinder-corridor-8: 1-wide gate still snaps off the far 2×2 crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, F, F, F, F, F, F, F, W, F, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeOrbitingCinderSquare(
      squareAt(9, 0),
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnOrbitingCinderBattleGraph(
        orbitingCinderOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "9,0");
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-orbit-cinder-onto-void: a generation void is not a steppable tax", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = squareAt(5, 0);
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["6,1"]),
    );
    assert.equal(
      rawOrbitingCinderSquares(occupancy, player).some(
        (s) => s.origin.x === 5 && s.origin.y === 0,
      ),
      true,
      "production floor raster includes a 2×2 with floor-under-void",
    );
    assert.equal(
      orbitingCinderUnreachable(player, squareAt(5, 0, 2), occupancy),
      true,
      "orb on the void corner is unreachable",
    );
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "5,0");
    for (const cell of orbitingCinderCells(landed.origin)) {
      assert.equal(
        occupancy.voidTiles.has(occKey(cell.x, cell.y)),
        false,
        "legalized square must not keep a void corner",
      );
      assert.equal(
        isOnOrbitingCinderBattleGraph(cell, player, occupancy),
        true,
      );
    }
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-orbit-cinder-requires-full-square: one steppable corner is not BOARD_CLAIM enough", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, W, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const dest = squareAt(4, 0);
    assert.equal(
      rawOrbitingCinderSquares(occupancy, player).some(
        (s) => s.origin.x === 4 && s.origin.y === 0,
      ),
      false,
      "raw raster already skips a 2×2 that includes a wall",
    );
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(
      occKey(landed.origin.x, landed.origin.y),
      "4,0",
      "unlike BOARD_CLAIM at-least-one, a wall corner must relocate the square",
    );
    for (const cell of orbitingCinderCells(landed.origin)) {
      assert.equal(tiles[cell.y]?.[cell.x], F);
      assert.equal(
        isOnOrbitingCinderBattleGraph(cell, player, occupancy),
        true,
      );
    }
  });

  it("seed-open-field-cinder-noop: already-legal squares are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = squareAt(4, 2, 1);
    const occupancy = ctxFrom(tiles, [{ x: 6, y: 4 }], [player], player);
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-orbit-cinder-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = squareAt(4, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isOrbitingCinderSpawnClear(4, 0, spawn), false);
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-orbit-cinder-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = squareAt(4, 0);
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player, boss], player);
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(
      isOnOrbitingCinderBattleGraph(
        orbitingCinderOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
  });

  it("seed-orbit-cinder-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, W, F, F],
      [F, F, F, F, F, F, F, F, W, W, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const dest = squareAt(10, 0);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnOrbitingCinderBattleGraph({ x: 10, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(orbitingCinderUnreachable(player, dest, occupancy), true);
    const landed = legalizeOrbitingCinderSquare(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnOrbitingCinderBattleGraph(
        orbitingCinderOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "10,0");
    assert.equal(
      tiles[0][9],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][10], F, "leftover crumb stays a floor island");
    assert.equal(orbitingCinderUnreachable(player, landed, occupancy), false);
  });

  it("seed-orbit-cinder-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveOrbitingCinder(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodOrbitingCinderBattleGraph(player, occupancy).size, 0);
    assert.equal(orbitingCinderUnreachable(player, snapped, occupancy), true);
    assert.equal(rawOrbitingCinderSquares(occupancy, player).length, 0);
  });

  it("seed-orbit-cinder-count-one: catalog pick is a single 2×2 square", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawOrbitingCinderSquares(occupancy, player);
    assert.ok(raw.length > 1, "raster must offer more than one hostable 2×2");
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickOrbitingCinderCount();
      assert.equal(count, 1);
      const picked = pickOrbitingCinderSquare(raw, rng);
      assert.ok(picked);
      assert.equal(
        orbitingCinderCells(picked.origin).some((c) =>
          occupancy.portals.has(occKey(c.x, c.y)),
        ),
        false,
      );
      assert.equal(
        orbitingCinderCells(picked.origin).some((c) =>
          isOrbitingCinderSpawnClear(c.x, c.y, player),
        ),
        false,
      );
      assert.ok(picked.orbIndex >= 0 && picked.orbIndex < 4);
    }
  });

  it("seed-orbit-cinder-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const existing = new Set(["5,1"]);
    const raw = rawOrbitingCinderSquares(occupancy, player, existing);
    assert.equal(
      raw.some((s) =>
        orbitingCinderCells(s.origin).some((c) => occKey(c.x, c.y) === "5,1"),
      ),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawOrbitingCinderSquares(occupancy, player).some((s) =>
        orbitingCinderCells(s.origin).some((c) => occKey(c.x, c.y) === "5,1"),
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-orbit-cinder-clockwise-ignores-mp: closed 4-cycle, not a lantern chase", () => {
    const origin = squareAt(4, 2, 0);
    assert.deepEqual(rawOrbitingCinderAdvance(origin), squareAt(4, 2, 1));
    assert.deepEqual(
      rawOrbitingCinderAdvance(squareAt(4, 2, 3)),
      squareAt(4, 2, 0),
    );
    const stepped = [0, 1, 2, 3].map((i) =>
      occKey(
        orbitingCinderOrb(squareAt(4, 2, i)).x,
        orbitingCinderOrb(squareAt(4, 2, i)).y,
      ),
    );
    assert.deepEqual(stepped, ["4,2", "5,2", "5,3", "4,3"]);
  });

  it("seed-orbit-cinder-advance-onto-portal: round-start step stays off the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = squareAt(7, 0, 0);
    const raw = rawOrbitingCinderAdvance(origin);
    assert.equal(
      occKey(orbitingCinderOrb(raw).x, orbitingCinderOrb(raw).y),
      "8,0",
    );
    const next = legalizeOrbitingCinderAdvance(origin, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(
      occupancy.portals.has(
        occKey(orbitingCinderOrb(next).x, orbitingCinderOrb(next).y),
      ),
      false,
    );
  });

  it("seed-orbit-cinder-advance-through-portal-far-side: drop the hop, do not park on the crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F],
      [F, F, F, F, F, F, F, F, W, F, F],
      [W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = squareAt(7, 0, 0);
    const raw = rawOrbitingCinderAdvance(origin);
    assert.equal(
      occKey(orbitingCinderOrb(raw).x, orbitingCinderOrb(raw).y),
      "8,0",
    );
    const next = legalizeOrbitingCinderAdvance(origin, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(
      next.origin.x >= 9,
      false,
      "clockwise must not hop the portal onto the leftover 2×2",
    );
    assert.equal(tiles[0][9], F);
  });

  it("seed-orbit-cinder-advance-on-unique-bridge: walkable tax does step around the alcove", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, F, F, W, W, W, W, W, W],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const origin = squareAt(4, 1, 0);
    const next = legalizeOrbitingCinderAdvance(origin, player, occupancy);
    assert.deepEqual(next, squareAt(4, 1, 1));
    assert.deepEqual(orbitingCinderOrb(next), { x: 5, y: 1 });
    assert.equal(tiles[1][5], F);
    assert.equal(
      isOnOrbitingCinderBattleGraph(orbitingCinderOrb(next), player, occupancy),
      true,
    );
  });

  it("seed-orbit-cinder-advance-onto-void: drop the step rather than snap the square", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 8, y: 0 }],
      [player],
      player,
      new Set(["5,0"]),
    );
    const origin = squareAt(4, 0, 0);
    const raw = rawOrbitingCinderAdvance(origin);
    assert.equal(
      occKey(orbitingCinderOrb(raw).x, orbitingCinderOrb(raw).y),
      "5,0",
    );
    const next = legalizeOrbitingCinderAdvance(origin, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(tiles[1][4], F, "must not relocate onto a different origin");
  });
});

function assertOrbitingCinderOnWorld(
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
  const raw = rawOrbitingCinderSquares(occupancy, spawn);
  const snapped = resolveOrbitingCinder(
    player,
    occupancy,
    rng,
    undefined,
    spawn,
  );
  const battle = floodOrbitingCinderBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} cinder placed on an empty fight graph`;
    }
    return null;
  }
  const hostable =
    legalizeOrbitingCinderSquare(squareAt(0, 0), player, occupancy, spawn) !==
    null;
  if (raw.length > 0 && hostable && !snapped) {
    return `${label} dropped the cinder even though the fight graph can host a 2×2`;
  }
  if (!snapped) return null;
  if (orbitingCinderUnreachable(player, snapped, occupancy)) {
    return `${label} Orbiting Cinder unreachable at ${occKey(orbitingCinderOrb(snapped).x, orbitingCinderOrb(snapped).y)}`;
  }
  for (const cell of orbitingCinderCells(snapped.origin)) {
    if (!isOnOrbitingCinderBattleGraph(cell, player, occupancy)) {
      return `${label} square misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isOrbitingCinderSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
  }
  const h = occupancy.tiles.length;
  const w = occupancy.tiles[0]?.length ?? 0;
  const orb = orbitingCinderOrb(snapped);
  if (orb.x < 0 || orb.y < 0 || orb.x >= w || orb.y >= h) {
    return `${label} dest ${occKey(orb.x, orb.y)} out of bounds`;
  }
  const advanced = resolveOrbitingCinderAdvance(
    snapped,
    player,
    occupancy,
    spawn,
  );
  const advancedOrb = orbitingCinderOrb(advanced);
  if (occupancy.portals.has(occKey(advancedOrb.x, advancedOrb.y))) {
    return `${label} clockwise sat on a portal at ${occKey(advancedOrb.x, advancedOrb.y)}`;
  }
  if (isOrbitingCinderSpawnClear(advancedOrb.x, advancedOrb.y, spawn)) {
    return `${label} clockwise sat in spawn±3 at ${occKey(advancedOrb.x, advancedOrb.y)}`;
  }
  if (!isOnOrbitingCinderBattleGraph(advancedOrb, player, occupancy)) {
    return `${label} clockwise left the fight graph at ${occKey(advancedOrb.x, advancedOrb.y)}`;
  }
  return null;
}

describe("occupancyOrbitingCinderUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Orbiting Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertOrbitingCinderOnWorld(
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

  it("corridorMaze wander Orbiting Cinder stays on the fight graph", () => {
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
      const miss = assertOrbitingCinderOnWorld(
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

  it("chessboard destack Orbiting Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertOrbitingCinderOnWorld(
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

  it("Boss Rush destack Orbiting Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertOrbitingCinderOnWorld(
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

  it("rest-exit destack Orbiting Cinder stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertOrbitingCinderOnWorld(
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
    const snapped = resolveOrbitingCinder(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    const orb = orbitingCinderOrb(snapped);
    assert.ok(orb.x >= 0 && orb.x < WORLD_GRID_SIZE);
    assert.ok(orb.y >= 0 && orb.y < WORLD_GRID_SIZE);
    for (const cell of orbitingCinderCells(snapped.origin)) {
      assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
      assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
    }
  });
});
