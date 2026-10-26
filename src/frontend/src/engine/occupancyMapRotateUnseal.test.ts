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
  MAP_ROTATE_BOARD_N,
  MAP_ROTATE_BOSS_CENTER,
  floodMapRotateBattleGraph,
  isOnMapRotateBattleGraph,
  legalizeMapRotateLanding,
  legalizeMapRotateLandings,
  mapRotateBoardN,
  mapRotateBossCenter,
  mapRotateOffFightGraph,
  mirrorInvertCell,
  rawMapRotateBodies,
  rawMapRotateDest,
  rawMirrorInvertDest,
  resolveMapRotate,
  resolveMapRotateLanding,
  resolveMirrorInvert,
  rotateClockwiseCell,
} from "./occupancyMapRotateUnseal.ts";

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

function manhattan(a: OccCell, b: OccCell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/** `#755` Twin Flank: point-reflect across the player. Local so this PR does not restack occupancyTwinFlankUnseal. */
function rawTwinFlankDest(unit: OccCell, player: OccCell): OccCell {
  return { x: 2 * player.x - unit.x, y: 2 * player.y - unit.y };
}

function portalChokeRow(n: number): string[][] {
  const row0: string[] = [];
  for (let x = 0; x < n; x++) row0.push(x === Math.floor(n / 2) ? P : F);
  const wall: string[] = Array.from({ length: n }, () => W);
  wall[0] = F;
  const open: string[] = Array.from({ length: n }, () => F);
  const tiles: string[][] = [row0, wall];
  for (let y = 2; y < n; y++) tiles.push(open.slice());
  return tiles;
}

describe("occupancyMapRotateUnseal regressions", () => {
  it("seed-rotate-formula-clockwise: production newX=N-1-y, newY=x", () => {
    assert.deepEqual(rotateClockwiseCell({ x: 1, y: 2 }, 16), { x: 13, y: 1 });
    assert.deepEqual(rawMapRotateDest({ x: 7, y: 7 }, 16), { x: 8, y: 7 });
    assert.equal(MAP_ROTATE_BOARD_N, WORLD_GRID_SIZE);
  });

  it("seed-mirror-formula-horizontal: production newX=N-1-x, newY=y", () => {
    assert.deepEqual(mirrorInvertCell({ x: 1, y: 2 }, 16), { x: 14, y: 2 });
    assert.deepEqual(rawMirrorInvertDest({ x: 0, y: 8 }, 16), { x: 15, y: 8 });
  });

  it("seed-rotate-boss-center-is-7-7: production teleports the boss, it does not rotate", () => {
    assert.deepEqual(mapRotateBossCenter(16), MAP_ROTATE_BOSS_CENTER);
    assert.deepEqual(MAP_ROTATE_BOSS_CENTER, { x: 7, y: 7 });
    const bodies = rawMapRotateBodies(
      {
        player: { x: 0, y: 0 },
        boss: { x: 3, y: 4 },
        others: [{ x: 1, y: 0 }],
      },
      16,
    );
    assert.deepEqual(bodies.boss, { x: 7, y: 7 });
    assert.notDeepEqual(bodies.boss, rotateClockwiseCell({ x: 3, y: 4 }, 16));
  });

  it("seed-rotate-through-portal-far-side: clockwise hop parks the player on a leftover crumb", () => {
    const tiles = portalChokeRow(7);
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawMapRotateDest(player, 7);
    assert.deepEqual(raw, farCrumb, "n=7 clockwise must send (0,0) onto (6,0)");
    assert.equal(
      isOnMapRotateBattleGraph(farCrumb, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(mapRotateOffFightGraph(player, [raw], occupancy), true);
    const landed = resolveMapRotateLanding(raw, player, player, occupancy);
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(farCrumb.x, farCrumb.y));
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(mapRotateOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-mirror-through-portal-far-side: horizontal flip parks the player on the same leftover", () => {
    const tiles = portalChokeRow(7);
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawMirrorInvertDest(player, 7);
    assert.deepEqual(raw, farCrumb);
    assert.equal(isOnMapRotateBattleGraph(raw, player, occupancy), false);
    const snapped = legalizeMapRotateLandings([raw], player, occupancy);
    assert.ok(snapped.length >= 1);
    for (const cell of snapped) {
      assert.equal(isOnMapRotateBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
  });

  it("seed-rotate-onto-portal: clockwise dest is the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, F, F, P, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const unit = { x: 1, y: 2 };
    const portal = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const raw = rawMapRotateDest(unit, 7);
    assert.deepEqual(raw, portal, "(1,2) clockwise on n=7 must sit on (4,1)");
    const landed = resolveMapRotateLanding(raw, unit, player, occupancy);
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-mirror-onto-portal: flip dest is the gate", () => {
    const tiles = [
      [F, F, F, F, F, F, P],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 6, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const flipPlayer = rawMirrorInvertDest(player, 7);
    assert.deepEqual(flipPlayer, portal, "(0,0) flip on n=7 must sit on (6,0)");
    const landed = resolveMapRotateLanding(
      flipPlayer,
      player,
      player,
      occupancy,
    );
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-rotate-on-unique-bridge: a corridor landing stays — the unit is walkable occupancy", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const unit = { x: 1, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const raw = rawMapRotateDest(unit, 6);
    assert.deepEqual(raw, { x: 4, y: 1 });
    assert.equal(isOnMapRotateBattleGraph(raw, player, occupancy), true);
    const landed = resolveMapRotateLanding(raw, unit, player, occupancy);
    assert.deepEqual(landed, raw);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-mirror-on-unique-bridge: a corridor landing stays", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const unit = { x: 2, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const raw = rawMirrorInvertDest(unit, 6);
    assert.deepEqual(raw, { x: 3, y: 1 });
    const landed = resolveMapRotateLanding(raw, unit, player, occupancy);
    assert.deepEqual(landed, raw);
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
  });

  it("seed-rotate-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const snapped = legalizeMapRotateLandings(
      [{ x: 4, y: 0 }],
      player,
      occupancy,
    );
    for (const cell of snapped) {
      assert.equal(isOnMapRotateBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), "3,0");
      assert.notEqual(occKey(cell.x, cell.y), "4,0");
    }
    assert.equal(mapRotateOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-open-field-rotate-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dests = [
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ];
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    const snapped = legalizeMapRotateLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(mapRotateOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-rotate-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnMapRotateBattleGraph(island, player, occupancy), false);
    const snapped = legalizeMapRotateLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnMapRotateBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(mapRotateOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-rotate-dual-seals: two far dests both snap onto the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landings = [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ];
    assert.equal(
      mapRotateOffFightGraph(player, landings, occupancy),
      true,
      "both far crumbs must start off the fight graph",
    );
    const snapped = legalizeMapRotateLandings(landings, player, occupancy);
    assert.ok(snapped.length >= 1, "at least one hop should still place");
    assert.equal(mapRotateOffFightGraph(player, snapped, occupancy), false);
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length, "landings must not stack");
    for (const cell of snapped) {
      assert.equal(isOnMapRotateBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-rotate-only-portal: drop every dest when the fight graph is empty", () => {
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
    assert.equal(floodMapRotateBattleGraph(player, occupancy).size, 0);
    const snapped = legalizeMapRotateLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.equal(snapped.length, 0);
    assert.equal(mapRotateOffFightGraph(player, snapped, occupancy), true);
  });

  it("seed-rotate-stay-when-blocked: a wall dest snaps back onto the fight graph", () => {
    const tiles = [
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const unit = { x: 1, y: 0 };
    const portal = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, unit], player);
    const raw = rawMapRotateDest(unit, 6);
    assert.deepEqual(raw, { x: 5, y: 1 });
    assert.equal(tiles[raw.y]?.[raw.x], W);
    const landed = resolveMapRotateLanding(raw, unit, player, occupancy);
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
    assert.equal(tiles[1][5], W, "must not punch the wall dest");
  });

  it("seed-rotate-onto-void: a void dest snaps off rather than tax an isolated cell", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const voidCell = { x: 2, y: 2 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set([occKey(voidCell.x, voidCell.y)]),
    );
    const snapped = legalizeMapRotateLanding(voidCell, player, occupancy);
    assert.ok(snapped);
    assert.notEqual(
      occKey(snapped.x, snapped.y),
      occKey(voidCell.x, voidCell.y),
    );
    assert.equal(isOnMapRotateBattleGraph(snapped, player, occupancy), true);
  });

  it("seed-rotate-boss-center-onto-portal: center teleport snaps off the gate", () => {
    const tiles = portalChokeRow(7);
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const center = mapRotateBossCenter(7);
    assert.deepEqual(center, { x: 3, y: 3 });
    const occupancy = ctxFrom(tiles, [portal, center], [player], player);
    occupancy.portals.add(occKey(center.x, center.y));
    const landed = legalizeMapRotateLanding(center, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(center.x, center.y));
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
  });

  it("seed-rotate-boss-center-onto-void: center teleport snaps off a generation void", () => {
    const tiles = portalChokeRow(7);
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const center = mapRotateBossCenter(7);
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set([occKey(center.x, center.y)]),
    );
    const landed = legalizeMapRotateLanding(center, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(center.x, center.y));
    assert.equal(isOnMapRotateBattleGraph(landed, player, occupancy), true);
  });

  it("seed-rotate-stacked-dests: two bodies that share a dest destack", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    const snapped = legalizeMapRotateLandings(
      [
        { x: 2, y: 2 },
        { x: 2, y: 2 },
      ],
      player,
      occupancy,
    );
    const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
    assert.equal(keys.size, snapped.length);
    assert.ok(snapped.length >= 1);
    for (const cell of snapped) {
      assert.equal(isOnMapRotateBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-rotate-covers-player: a minion dest on the player destacks", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    const resolved = resolveMapRotate(
      {
        player,
        boss: { x: 1, y: 0 },
        others: [{ x: 0, y: 1 }],
      },
      occupancy,
    );
    const keys = [
      occKey(resolved.player.x, resolved.player.y),
      occKey(resolved.boss.x, resolved.boss.y),
      ...resolved.others.map((c) => occKey(c.x, c.y)),
    ];
    assert.equal(new Set(keys).size, keys.length, "bodies must not stack");
    for (const cell of [resolved.player, resolved.boss, ...resolved.others]) {
      assert.equal(isOnMapRotateBattleGraph(cell, player, occupancy), true);
    }
  });

  it("seed-rotate-not-twin-flank: clockwise is not point-reflect across the player", () => {
    const unit = { x: 2, y: 1 };
    const player = { x: 4, y: 1 };
    const flank = rawTwinFlankDest(unit, player);
    const rotated = rawMapRotateDest(unit, 7);
    assert.deepEqual(flank, { x: 6, y: 1 });
    assert.deepEqual(rotated, { x: 5, y: 2 });
    assert.notDeepEqual(rotated, flank);
  });

  it("seed-rotate-not-one-step: clockwise is not greedy moveToward", () => {
    const unit = { x: 2, y: 1 };
    const rotated = rawMapRotateDest(unit, 7);
    assert.deepEqual(rotated, { x: 5, y: 2 });
    assert.ok(manhattan(unit, rotated) > 1, "board-wide rewrite, not one hop");
  });

  it("seed-rotate-n-matches-grid: fixture width, not a hardcoded 16, drives the analog", () => {
    const tiles = portalChokeRow(7);
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [{ x: 0, y: 0 }], {
      x: 0,
      y: 0,
    });
    assert.equal(mapRotateBoardN(occupancy), 7);
    assert.deepEqual(mapRotateBossCenter(7), { x: 3, y: 3 });
  });

  it("seed-open-field-boss-center-stays: center on an open 16×16 field is already legal", () => {
    const tiles = Array.from({ length: 16 }, () =>
      Array.from({ length: 16 }, () => F),
    );
    tiles[15][15] = P;
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 15, y: 15 }], [player], player);
    const center = mapRotateBossCenter(16);
    const landed = legalizeMapRotateLanding(center, player, occupancy);
    assert.deepEqual(landed, center);
    assert.equal(isOnMapRotateBattleGraph(center, player, occupancy), true);
  });
});

function assertRotateOnWorld(
  label: string,
  tiles: string[][],
  voidTiles: Set<string>,
  portals: Array<{ x: number; y: number }>,
  player: OccCell,
  spawns: OccCell[],
): string | null {
  const occupancy = ctxFrom(
    tiles,
    portals,
    [player, ...spawns],
    player,
    voidTiles,
  );
  const boss = spawns[0] ?? player;
  const others = spawns.slice(1);
  const origin = { player, boss, others };
  const snapshot = tiles.map((row) => row.slice());
  const rotated = resolveMapRotate(origin, occupancy);
  const mirrored = resolveMirrorInvert(origin, occupancy);
  for (const [kind, resolved] of [
    ["rotate", rotated],
    ["mirror", mirrored],
  ] as const) {
    const landed = [resolved.player, resolved.boss, ...resolved.others];
    const keys = landed.map((c) => occKey(c.x, c.y));
    if (new Set(keys).size !== keys.length) {
      return `${label} ${kind} stacked bodies at ${keys.join(" ")}`;
    }
    for (const cell of landed) {
      if (occupancy.portals.has(occKey(cell.x, cell.y))) {
        return `${label} ${kind} sat on a portal at ${occKey(cell.x, cell.y)}`;
      }
      if (!isOnMapRotateBattleGraph(cell, player, occupancy)) {
        return `${label} ${kind} left the fight graph at ${occKey(cell.x, cell.y)}`;
      }
    }
  }
  for (let y = 0; y < snapshot.length; y++) {
    for (let x = 0; x < (snapshot[y]?.length ?? 0); x++) {
      if (tiles[y]?.[x] !== snapshot[y]?.[x]) {
        return `${label} punched tiles at ${x},${y}`;
      }
    }
  }
  return null;
}

describe("occupancyMapRotateUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack MAP_ROTATE stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRotateOnWorld(
        `destack ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander MAP_ROTATE stay on the fight graph", () => {
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
      const miss = assertRotateOnWorld(
        `wander ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        world.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("chessboard destack MAP_ROTATE stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRotateOnWorld(
        `chess ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack MAP_ROTATE stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertRotateOnWorld(
        `bossRush ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack MAP_ROTATE stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertRotateOnWorld(
          `rest-${restExitType} ${seed}`,
          world.tiles,
          world.voidTiles,
          world.portals,
          after.playerSpawn,
          after.spawns,
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
    const resolved = resolveMapRotate(
      {
        player: world.playerSpawn,
        boss: world.spawns[0] ?? world.playerSpawn,
        others: world.spawns.slice(1),
      },
      occupancy,
    );
    for (const landed of [resolved.player, resolved.boss, ...resolved.others]) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
