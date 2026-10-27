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
  PENDULUM_CENSER_COUNT,
  PENDULUM_CENSER_HEADINGS,
  PENDULUM_CENSER_NAVE_LENGTH,
  PENDULUM_CENSER_SPAWN_CLEAR,
  type PendulumCenser,
  clampPendulumCenserDir,
  clampPendulumCenserIndex,
  floodPendulumCenserBattleGraph,
  isOnPendulumCenserBattleGraph,
  isPendulumCenserSpawnClear,
  legalizePendulumCenserAdvance,
  legalizePendulumCenserNave,
  pendulumCenserCells,
  pendulumCenserOrb,
  pendulumCenserUnreachable,
  pickPendulumCenserCount,
  pickPendulumCenserNave,
  rawPendulumCenserAdvance,
  rawPendulumCenserNaves,
  resolvePendulumCenser,
  resolvePendulumCenserAdvance,
} from "./occupancyPendulumCenserUnseal.ts";

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

function naveAt(
  x: number,
  y: number,
  heading: { dx: number; dy: number } = { dx: 1, dy: 0 },
  index = 0,
  dir: 1 | -1 = 1,
): PendulumCenser {
  return { origin: { x, y }, heading, index, dir };
}

describe("occupancyPendulumCenserUnseal regressions", () => {
  it("seed-pendulum-censer-reverses-not-wrap: 5-cell nave turns around at the ends", () => {
    assert.deepEqual(PENDULUM_CENSER_HEADINGS, [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
    ]);
    assert.equal(PENDULUM_CENSER_NAVE_LENGTH, 5);
    assert.equal(clampPendulumCenserIndex(-1), 0);
    assert.equal(clampPendulumCenserIndex(9), 4);
    assert.equal(clampPendulumCenserDir(-3), -1);
    const cells = pendulumCenserCells({ x: 2, y: 1 }, { dx: 1, dy: 0 });
    assert.deepEqual(cells, [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ]);
    const origin = naveAt(2, 1, { dx: 1, dy: 0 }, 0, 1);
    assert.deepEqual(pendulumCenserOrb(origin), { x: 2, y: 1 });
    assert.deepEqual(
      rawPendulumCenserAdvance(origin),
      naveAt(2, 1, { dx: 1, dy: 0 }, 1, 1),
    );
    const atEnd = naveAt(2, 1, { dx: 1, dy: 0 }, 4, 1);
    assert.deepEqual(
      rawPendulumCenserAdvance(atEnd),
      naveAt(2, 1, { dx: 1, dy: 0 }, 3, -1),
      "unlike Orbiting Cinder wrap 4→0, the nave reverses 4→3",
    );
    const atStartBack = naveAt(2, 1, { dx: 1, dy: 0 }, 0, -1);
    assert.deepEqual(
      rawPendulumCenserAdvance(atStartBack),
      naveAt(2, 1, { dx: 1, dy: 0 }, 1, 1),
    );
    const stepped = [0, 1, 2, 3, 4].map((i) =>
      occKey(
        pendulumCenserOrb(naveAt(2, 1, { dx: 1, dy: 0 }, i)).x,
        pendulumCenserOrb(naveAt(2, 1, { dx: 1, dy: 0 }, i)).y,
      ),
    );
    assert.deepEqual(stepped, ["2,1", "3,1", "4,1", "5,1", "6,1"]);
  });

  it("seed-pendulum-censer-raw-skips-portal: production floor raster never paints the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawPendulumCenserNaves(occupancy, player);
    assert.equal(
      raw.some((n) =>
        pendulumCenserCells(n.origin, n.heading).some(
          (c) => occKey(c.x, c.y) === occKey(portal.x, portal.y),
        ),
      ),
      false,
      "catalog tiles === floor skips any 5-run that includes the portal",
    );
    assert.equal(
      raw.some(
        (n) => n.origin.x === 6 && n.origin.y === 0 && n.heading.dx === 1,
      ),
      true,
      "a leftover 5-tile crumb is a legal raw dest",
    );
    assert.equal(PENDULUM_CENSER_COUNT, 1);
    assert.equal(pickPendulumCenserCount(), 1);
  });

  it("seed-pendulum-censer-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 2 }], [spawn], spawn);
    const raw = rawPendulumCenserNaves(occupancy, spawn);
    assert.equal(isPendulumCenserSpawnClear(0, 0, spawn), true);
    assert.equal(isPendulumCenserSpawnClear(3, 0, spawn), true);
    assert.equal(isPendulumCenserSpawnClear(4, 0, spawn), false);
    assert.equal(PENDULUM_CENSER_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((n) =>
        pendulumCenserCells(n.origin, n.heading).some((c) =>
          isPendulumCenserSpawnClear(c.x, c.y, spawn),
        ),
      ),
      false,
      "raw naves must not overlap the spawn-clear diamond",
    );
    assert.equal(
      raw.some(
        (n) => n.origin.x === 4 && n.origin.y === 0 && n.heading.dx === 1,
      ),
      true,
      "a 5-run outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-pendulum-censer-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawPendulumCenserNaves(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isPendulumCenserSpawnClear(cx, cy, spawn),
      false,
      "grid center is outside spawn±3 when spawn legalize left a corner",
    );
    assert.equal(
      raw.some((n) => n.origin.x === cx && n.origin.y === cy),
      true,
      "unlike eligibleHazard center 7×7, a corner spawn still plants at grid center",
    );
    assert.equal(
      raw.some((n) => n.origin.x === 0 && n.origin.y === 0),
      false,
      "the legalized spawn cell itself is skipped",
    );
    assert.equal(
      raw.some((n) =>
        pendulumCenserCells(n.origin, n.heading).some(
          (c) => occKey(c.x, c.y) === occKey(size - 1, 0),
        ),
      ),
      false,
      "the corner portal is still skipped",
    );
  });

  it("seed-pendulum-censer-through-portal-far-side: a leftover 5-run never taxes the fight graph", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, F, F, P, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, F, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 12, y: 0 };
    const dest = naveAt(13, 0);
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnPendulumCenserBattleGraph({ x: 13, y: 0 }, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(pendulumCenserUnreachable(player, dest, occupancy), true);
    const landed = legalizePendulumCenserNave(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnPendulumCenserBattleGraph(
        pendulumCenserOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "13,0");
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][13], F, "must not punch or wall the leftover crumb");
  });

  it("seed-pendulum-censer-on-unique-bridge: walkable tax may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 12, y: 1 };
    const dest = naveAt(5, 1);
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnPendulumCenserBattleGraph({ x: 5, y: 1 }, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    assert.equal(isPendulumCenserSpawnClear(5, 1, player), false);
    const landed = legalizePendulumCenserNave(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor nave stays — it is a walkable tax",
    );
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-pendulum-censer-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizePendulumCenserNave(naveAt(9, 0), player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnPendulumCenserBattleGraph(
        pendulumCenserOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "9,0");
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
  });

  it("seed-pendulum-censer-onto-void: a generation void is not a steppable tax", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 9, y: 0 };
    const dest = naveAt(4, 0);
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["4,0"]),
    );
    assert.equal(
      rawPendulumCenserNaves(occupancy, player).some(
        (n) => n.origin.x === 4 && n.origin.y === 0 && n.heading.dx === 1,
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(pendulumCenserUnreachable(player, dest, occupancy), true);
    const landed = legalizePendulumCenserNave(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "4,0");
    for (const cell of pendulumCenserCells(landed.origin, landed.heading)) {
      assert.equal(
        isOnPendulumCenserBattleGraph(cell, player, occupancy),
        true,
      );
    }
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
  });

  it("seed-open-field-pendulum-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = naveAt(4, 2);
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 4 }], [player], player);
    const landed = legalizePendulumCenserNave(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
  });

  it("seed-pendulum-censer-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = naveAt(5, 0);
    const occupancy = ctxFrom(tiles, [{ x: 10, y: 0 }], [player], player);
    assert.equal(isPendulumCenserSpawnClear(5, 0, spawn), false);
    const landed = legalizePendulumCenserNave(dest, player, occupancy, spawn);
    assert.ok(landed);
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
  });

  it("seed-pendulum-censer-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = naveAt(5, 0);
    const occupancy = ctxFrom(tiles, [{ x: 10, y: 0 }], [player, boss], player);
    const landed = legalizePendulumCenserNave(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.origin.x, landed.origin.y),
      occKey(dest.origin.x, dest.origin.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(
      isOnPendulumCenserBattleGraph(
        pendulumCenserOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
  });

  it("seed-pendulum-censer-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, F, F, P, W, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, F, W, W, F, F, F, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 12, y: 0 };
    const dest = naveAt(14, 0);
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnPendulumCenserBattleGraph({ x: 14, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(pendulumCenserUnreachable(player, dest, occupancy), true);
    const landed = legalizePendulumCenserNave(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnPendulumCenserBattleGraph(
        pendulumCenserOrb(landed),
        player,
        occupancy,
      ),
      true,
    );
    assert.notEqual(occKey(landed.origin.x, landed.origin.y), "14,0");
    assert.equal(
      tiles[0][13],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][14], F, "leftover crumb stays a floor island");
    assert.equal(pendulumCenserUnreachable(player, landed, occupancy), false);
  });

  it("seed-pendulum-censer-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolvePendulumCenser(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodPendulumCenserBattleGraph(player, occupancy).size, 0);
    assert.equal(pendulumCenserUnreachable(player, snapped, occupancy), true);
    assert.equal(rawPendulumCenserNaves(occupancy, player).length, 0);
  });

  it("seed-pendulum-censer-count-one: catalog pick is a single 5-cell nave", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 10, y: 0 }], [player], player);
    const raw = rawPendulumCenserNaves(occupancy, player);
    assert.ok(raw.length > 1, "raster must offer more than one hostable 5-run");
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickPendulumCenserCount();
      assert.equal(count, 1);
      const picked = pickPendulumCenserNave(raw, rng);
      assert.ok(picked);
      assert.equal(
        pendulumCenserCells(picked.origin, picked.heading).some((c) =>
          occupancy.portals.has(occKey(c.x, c.y)),
        ),
        false,
      );
      assert.equal(
        pendulumCenserCells(picked.origin, picked.heading).some((c) =>
          isPendulumCenserSpawnClear(c.x, c.y, player),
        ),
        false,
      );
      assert.ok(picked.index >= 0 && picked.index < 5);
      assert.ok(picked.dir === 1 || picked.dir === -1);
    }
  });

  it("seed-pendulum-censer-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 9, y: 0 }], [player], player);
    const existing = new Set(["6,1"]);
    const raw = rawPendulumCenserNaves(occupancy, player, existing);
    assert.equal(
      raw.some((n) =>
        pendulumCenserCells(n.origin, n.heading).some(
          (c) => occKey(c.x, c.y) === "6,1",
        ),
      ),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawPendulumCenserNaves(occupancy, player).some((n) =>
        pendulumCenserCells(n.origin, n.heading).some(
          (c) => occKey(c.x, c.y) === "6,1",
        ),
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-pendulum-censer-advance-ignores-mp: reverse on the nave, not a lantern chase", () => {
    const origin = naveAt(4, 2, { dx: 1, dy: 0 }, 0, 1);
    assert.deepEqual(
      rawPendulumCenserAdvance(origin),
      naveAt(4, 2, { dx: 1, dy: 0 }, 1, 1),
    );
    const wrapWouldBe = pendulumCenserOrb(naveAt(4, 2, { dx: 1, dy: 0 }, 0, 1));
    const reversed = pendulumCenserOrb(
      rawPendulumCenserAdvance(naveAt(4, 2, { dx: 1, dy: 0 }, 4, 1)),
    );
    assert.notDeepEqual(
      reversed,
      wrapWouldBe,
      "must not wrap like Orbiting Cinder",
    );
    assert.deepEqual(reversed, { x: 7, y: 2 });
  });

  it("seed-pendulum-censer-advance-onto-portal: round-start step stays off the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = naveAt(4, 0, { dx: 1, dy: 0 }, 3, 1);
    const raw = rawPendulumCenserAdvance(origin);
    assert.equal(
      occKey(pendulumCenserOrb(raw).x, pendulumCenserOrb(raw).y),
      "8,0",
    );
    const next = legalizePendulumCenserAdvance(origin, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(
      occupancy.portals.has(
        occKey(pendulumCenserOrb(next).x, pendulumCenserOrb(next).y),
      ),
      false,
    );
  });

  it("seed-pendulum-censer-advance-through-portal-far-side: drop the hop, do not park on the crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, W, F, F, F, F, F],
      [W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = naveAt(4, 0, { dx: 1, dy: 0 }, 3, 1);
    const raw = rawPendulumCenserAdvance(origin);
    assert.equal(
      occKey(pendulumCenserOrb(raw).x, pendulumCenserOrb(raw).y),
      "8,0",
    );
    const next = legalizePendulumCenserAdvance(origin, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(
      pendulumCenserOrb(next).x >= 9,
      false,
      "reverse-step must not hop the portal onto the leftover nave",
    );
    assert.equal(tiles[0][9], F);
  });

  it("seed-pendulum-censer-advance-on-unique-bridge: walkable tax does step along the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 12, y: 1 }], [player], player);
    const origin = naveAt(4, 1, { dx: 1, dy: 0 }, 0, 1);
    const next = legalizePendulumCenserAdvance(origin, player, occupancy);
    assert.deepEqual(next, naveAt(4, 1, { dx: 1, dy: 0 }, 1, 1));
    assert.deepEqual(pendulumCenserOrb(next), { x: 5, y: 1 });
    assert.equal(tiles[1][5], F);
    assert.equal(
      isOnPendulumCenserBattleGraph(pendulumCenserOrb(next), player, occupancy),
      true,
    );
  });

  it("seed-pendulum-censer-advance-onto-void: drop the step rather than snap the nave", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 9, y: 0 }],
      [player],
      player,
      new Set(["5,0"]),
    );
    const origin = naveAt(4, 0, { dx: 1, dy: 0 }, 0, 1);
    const raw = rawPendulumCenserAdvance(origin);
    assert.equal(
      occKey(pendulumCenserOrb(raw).x, pendulumCenserOrb(raw).y),
      "5,0",
    );
    const next = legalizePendulumCenserAdvance(origin, player, occupancy);
    assert.deepEqual(next, origin);
    assert.equal(tiles[1][4], F, "must not relocate onto a different origin");
  });
});

function assertPendulumCenserOnWorld(
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
  const raw = rawPendulumCenserNaves(occupancy, spawn);
  const snapped = resolvePendulumCenser(
    player,
    occupancy,
    rng,
    undefined,
    spawn,
  );
  const battle = floodPendulumCenserBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} censer placed on an empty fight graph`;
    }
    return null;
  }
  const hostable =
    legalizePendulumCenserNave(naveAt(0, 0), player, occupancy, spawn) !== null;
  if (raw.length > 0 && hostable && !snapped) {
    return `${label} dropped the censer even though the fight graph can host a 5-run`;
  }
  if (!snapped) return null;
  if (pendulumCenserUnreachable(player, snapped, occupancy)) {
    return `${label} Pendulum Censer unreachable at ${occKey(pendulumCenserOrb(snapped).x, pendulumCenserOrb(snapped).y)}`;
  }
  for (const cell of pendulumCenserCells(snapped.origin, snapped.heading)) {
    if (!isOnPendulumCenserBattleGraph(cell, player, occupancy)) {
      return `${label} nave misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    if (isPendulumCenserSpawnClear(cell.x, cell.y, spawn)) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat in spawn±3`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
  }
  const h = occupancy.tiles.length;
  const w = occupancy.tiles[0]?.length ?? 0;
  const orb = pendulumCenserOrb(snapped);
  if (orb.x < 0 || orb.y < 0 || orb.x >= w || orb.y >= h) {
    return `${label} dest ${occKey(orb.x, orb.y)} out of bounds`;
  }
  const advanced = resolvePendulumCenserAdvance(
    snapped,
    player,
    occupancy,
    spawn,
  );
  const advancedOrb = pendulumCenserOrb(advanced);
  if (occupancy.portals.has(occKey(advancedOrb.x, advancedOrb.y))) {
    return `${label} reverse-step sat on a portal at ${occKey(advancedOrb.x, advancedOrb.y)}`;
  }
  if (isPendulumCenserSpawnClear(advancedOrb.x, advancedOrb.y, spawn)) {
    return `${label} reverse-step sat in spawn±3 at ${occKey(advancedOrb.x, advancedOrb.y)}`;
  }
  if (!isOnPendulumCenserBattleGraph(advancedOrb, player, occupancy)) {
    return `${label} reverse-step left the fight graph at ${occKey(advancedOrb.x, advancedOrb.y)}`;
  }
  return null;
}

describe("occupancyPendulumCenserUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Pendulum Censer stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertPendulumCenserOnWorld(
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

  it("corridorMaze wander Pendulum Censer stays on the fight graph", () => {
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
      const miss = assertPendulumCenserOnWorld(
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

  it("chessboard destack Pendulum Censer stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertPendulumCenserOnWorld(
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

  it("Boss Rush destack Pendulum Censer stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertPendulumCenserOnWorld(
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

  it("rest-exit destack Pendulum Censer stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertPendulumCenserOnWorld(
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
    const snapped = resolvePendulumCenser(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    const orb = pendulumCenserOrb(snapped);
    assert.ok(orb.x >= 0 && orb.x < WORLD_GRID_SIZE);
    assert.ok(orb.y >= 0 && orb.y < WORLD_GRID_SIZE);
    for (const cell of pendulumCenserCells(snapped.origin, snapped.heading)) {
      assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
      assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
    }
  });
});
