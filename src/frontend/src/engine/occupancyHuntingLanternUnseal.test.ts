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
  HUNTING_LANTERN_COUNT,
  HUNTING_LANTERN_SPAWN_CLEAR,
  floodHuntingLanternBattleGraph,
  huntingLanternUnreachable,
  isHuntingLanternSpawnClear,
  isOnHuntingLanternBattleGraph,
  legalizeHuntingLanternAdvance,
  legalizeHuntingLanternPlacement,
  pickHuntingLanternCount,
  pickHuntingLanternDest,
  rawHuntingLanternChaseDest,
  rawHuntingLanternDests,
  resolveHuntingLantern,
  resolveHuntingLanternAdvance,
} from "./occupancyHuntingLanternUnseal.ts";

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

describe("occupancyHuntingLanternUnseal regressions", () => {
  it("seed-hunt-lantern-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, F, F, P, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawHuntingLanternDests(occupancy, player);
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
    assert.equal(HUNTING_LANTERN_COUNT, 1);
    assert.equal(pickHuntingLanternCount(), 1);
  });

  it("seed-hunt-lantern-raw-skips-spawn: Chebyshev ≤ 3 from legalized spawn is skipped", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, P],
    ];
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 2 }], [spawn], spawn);
    const raw = rawHuntingLanternDests(occupancy, spawn);
    assert.equal(isHuntingLanternSpawnClear(0, 0, spawn), true);
    assert.equal(isHuntingLanternSpawnClear(3, 0, spawn), true);
    assert.equal(isHuntingLanternSpawnClear(4, 0, spawn), false);
    assert.equal(HUNTING_LANTERN_SPAWN_CLEAR, 3);
    assert.equal(
      raw.some((c) => isHuntingLanternSpawnClear(c.x, c.y, spawn)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a floor outside spawn±3 is a legal raw dest",
    );
  });

  it("seed-hunt-lantern-raw-includes-center-when-spawn-is-corner: skip is spawn-relative, not grid center", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const spawn = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [spawn], spawn);
    const raw = rawHuntingLanternDests(occupancy, spawn);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(
      isHuntingLanternSpawnClear(cx, cy, spawn),
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

  it("seed-hunt-lantern-through-portal-far-side: one floor hop parks the tax on a crumb", () => {
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
      isOnHuntingLanternBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(huntingLanternUnreachable(player, dest, occupancy), true);
    const landed = legalizeHuntingLanternPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnHuntingLanternBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
    assert.equal(isHuntingLanternSpawnClear(landed.x, landed.y, player), false);
    assert.equal(tiles[0][6], F, "must not punch or wall the leftover crumb");
  });

  it("seed-hunt-lantern-on-unique-bridge: walkable tax may sit on the corridor", () => {
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
      isOnHuntingLanternBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    assert.equal(isHuntingLanternSpawnClear(5, 1, player), false);
    const landed = legalizeHuntingLanternPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES / walk-blockers, a unique-corridor lantern stays — it is a walkable tax",
    );
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][5], F, "must not punch or wall the unique corridor");
  });

  it("seed-hunt-lantern-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 8, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeHuntingLanternPlacement(
      { x: 9, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnHuntingLanternBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), "9,0");
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
  });

  it("seed-hunt-lantern-onto-void: a generation void is not a steppable tax", () => {
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
      rawHuntingLanternDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "5,0",
      ),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(huntingLanternUnreachable(player, dest, occupancy), true);
    const landed = legalizeHuntingLanternPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      isOnHuntingLanternBattleGraph(landed, player, occupancy),
      true,
    );
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
  });

  it("seed-open-field-lantern-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeHuntingLanternPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
  });

  it("seed-hunt-lantern-covers-player: destacked player outside spawn±3 stays", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F],
    ];
    const spawn = { x: 0, y: 0 };
    const player = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    assert.equal(isHuntingLanternSpawnClear(5, 0, spawn), false);
    const landed = legalizeHuntingLanternPlacement(
      dest,
      player,
      occupancy,
      spawn,
    );
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering a destacked player outside spawn±3 is legal",
    );
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
  });

  it("seed-hunt-lantern-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 5, y: 0 };
    const dest = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player, boss], player);
    const landed = legalizeHuntingLanternPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(
      isOnHuntingLanternBattleGraph(landed, player, occupancy),
      true,
    );
  });

  it("seed-hunt-lantern-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnHuntingLanternBattleGraph({ x: 7, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(huntingLanternUnreachable(player, dest, occupancy), true);
    const landed = legalizeHuntingLanternPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnHuntingLanternBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][6],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][7], F, "leftover crumb stays a floor island");
    assert.equal(huntingLanternUnreachable(player, landed, occupancy), false);
  });

  it("seed-hunt-lantern-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveHuntingLantern(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodHuntingLanternBattleGraph(player, occupancy).size, 0);
    assert.equal(huntingLanternUnreachable(player, snapped, occupancy), true);
    assert.equal(rawHuntingLanternDests(occupancy, player).length, 0);
  });

  it("seed-hunt-lantern-count-one: catalog pick is a single independent dest", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const raw = rawHuntingLanternDests(occupancy, player);
    assert.ok(raw.length > 1, "raster must offer more than one hostable cell");
    for (let seed = 0; seed < 32; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickHuntingLanternCount();
      assert.equal(count, 1);
      const picked = pickHuntingLanternDest(raw, rng);
      assert.ok(picked);
      assert.equal(occupancy.portals.has(occKey(picked.x, picked.y)), false);
      assert.equal(
        isHuntingLanternSpawnClear(picked.x, picked.y, player),
        false,
      );
    }
  });

  it("seed-hunt-lantern-skips-existing: does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const existing = new Set(["4,1"]);
    const raw = rawHuntingLanternDests(occupancy, player, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "4,1"),
      false,
      "catalog extraHazard skips already-budgeted hazard keys",
    );
    assert.equal(
      rawHuntingLanternDests(occupancy, player).some(
        (c) => occKey(c.x, c.y) === "4,1",
      ),
      true,
      "first pass still sees that floor",
    );
  });

  it("seed-hunt-lantern-chase-dominant-axis: one orthogonal hop, not a painted lane", () => {
    const origin = { x: 4, y: 2 };
    assert.deepEqual(rawHuntingLanternChaseDest(origin, { x: 7, y: 4 }), {
      x: 5,
      y: 2,
    });
    assert.deepEqual(rawHuntingLanternChaseDest(origin, { x: 4, y: 0 }), {
      x: 4,
      y: 1,
    });
    assert.deepEqual(
      rawHuntingLanternChaseDest(origin, origin),
      origin,
      "already-on-target stays",
    );
    assert.deepEqual(
      rawHuntingLanternChaseDest(origin, null),
      origin,
      "no MP spender this round stays",
    );
  });

  it("seed-hunt-lantern-chase-onto-portal: round-start step stays off the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = { x: 7, y: 0 };
    const target = { x: 8, y: 0 };
    const raw = rawHuntingLanternChaseDest(origin, target);
    assert.equal(occKey(raw.x, raw.y), "8,0");
    const next = legalizeHuntingLanternAdvance(
      origin,
      target,
      player,
      occupancy,
    );
    assert.deepEqual(next, origin);
    assert.equal(occupancy.portals.has(occKey(next.x, next.y)), false);
  });

  it("seed-hunt-lantern-chase-through-portal-far-side: drop the hop, do not park on the crumb", () => {
    const tiles = [
      [F, F, F, F, F, F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 8, y: 0 }], [player], player);
    const origin = { x: 7, y: 0 };
    const target = { x: 10, y: 0 };
    const raw = rawHuntingLanternChaseDest(origin, target);
    assert.equal(occKey(raw.x, raw.y), "8,0");
    const next = legalizeHuntingLanternAdvance(
      origin,
      target,
      player,
      occupancy,
    );
    assert.deepEqual(next, origin);
    assert.equal(
      next.x >= 9,
      false,
      "chase must not hop the portal onto the leftover crumb",
    );
    assert.equal(tiles[0][9], F);
  });

  it("seed-hunt-lantern-chase-on-unique-bridge: walkable tax does step along the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F, F, F, F, P],
      [W, W, W, W, W, W, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 11, y: 1 }], [player], player);
    const origin = { x: 5, y: 1 };
    const next = legalizeHuntingLanternAdvance(
      origin,
      player,
      player,
      occupancy,
    );
    assert.deepEqual(next, { x: 4, y: 1 });
    assert.equal(tiles[1][4], F);
    assert.equal(isOnHuntingLanternBattleGraph(next, player, occupancy), true);
  });

  it("seed-hunt-lantern-chase-no-mp-stays: missing spender does not invent a heading", () => {
    const tiles = [
      [F, F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 7, y: 0 }], [player], player);
    const origin = { x: 5, y: 0 };
    const next = resolveHuntingLanternAdvance(origin, null, player, occupancy);
    assert.deepEqual(next, origin);
  });

  it("seed-hunt-lantern-chase-onto-void: drop the step rather than snap sideways", () => {
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
    const raw = rawHuntingLanternChaseDest(origin, { x: 7, y: 0 });
    assert.equal(occKey(raw.x, raw.y), "6,0");
    const next = legalizeHuntingLanternAdvance(
      origin,
      { x: 7, y: 0 },
      player,
      occupancy,
    );
    assert.deepEqual(next, origin);
    assert.equal(tiles[1][5], F, "must not relocate onto a different origin");
  });
});

function assertHuntingLanternOnWorld(
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
  const raw = rawHuntingLanternDests(occupancy, spawn);
  const snapped = resolveHuntingLantern(
    player,
    occupancy,
    rng,
    undefined,
    spawn,
  );
  const battle = floodHuntingLanternBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped) {
      return `${label} lantern placed on an empty fight graph`;
    }
    return null;
  }
  const hostable = [...battle].some((k) => {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    return (
      !occupancy.portals.has(k) &&
      !isHuntingLanternSpawnClear(x, y, spawn) &&
      !occupancy.voidTiles.has(k)
    );
  });
  if (raw.length > 0 && hostable && !snapped) {
    return `${label} dropped the lantern even though the fight graph is nonempty`;
  }
  if (!snapped) return null;
  if (huntingLanternUnreachable(player, snapped, occupancy)) {
    return `${label} Hunting Lantern unreachable at ${occKey(snapped.x, snapped.y)}`;
  }
  if (!isOnHuntingLanternBattleGraph(snapped, player, occupancy)) {
    return `${label} lantern misses the fight graph at ${occKey(snapped.x, snapped.y)}`;
  }
  if (isHuntingLanternSpawnClear(snapped.x, snapped.y, spawn)) {
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
  const chaseTarget = units[0] ?? player;
  const advanced = resolveHuntingLanternAdvance(
    snapped,
    chaseTarget,
    player,
    occupancy,
    spawn,
  );
  if (occupancy.portals.has(occKey(advanced.x, advanced.y))) {
    return `${label} chase sat on a portal at ${occKey(advanced.x, advanced.y)}`;
  }
  if (isHuntingLanternSpawnClear(advanced.x, advanced.y, spawn)) {
    return `${label} chase sat in spawn±3 at ${occKey(advanced.x, advanced.y)}`;
  }
  if (!isOnHuntingLanternBattleGraph(advanced, player, occupancy)) {
    return `${label} chase left the fight graph at ${occKey(advanced.x, advanced.y)}`;
  }
  return null;
}

describe("occupancyHuntingLanternUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack Hunting Lantern stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertHuntingLanternOnWorld(
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

  it("corridorMaze wander Hunting Lantern stays on the fight graph", () => {
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
      const miss = assertHuntingLanternOnWorld(
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

  it("chessboard destack Hunting Lantern stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertHuntingLanternOnWorld(
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

  it("Boss Rush destack Hunting Lantern stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertHuntingLanternOnWorld(
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

  it("rest-exit destack Hunting Lantern stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertHuntingLanternOnWorld(
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
    const snapped = resolveHuntingLantern(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    assert.ok(snapped.x >= 0 && snapped.x < WORLD_GRID_SIZE);
    assert.ok(snapped.y >= 0 && snapped.y < WORLD_GRID_SIZE);
  });
});
