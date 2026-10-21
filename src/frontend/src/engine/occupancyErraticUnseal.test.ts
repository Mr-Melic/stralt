import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { type OccCell, type OccupancyContext, occKey } from "./occupancy.ts";
import {
  erraticOffFightGraph,
  floodErraticBattleGraph,
  isOnErraticBattleGraph,
  legalizeErraticLanding,
  legalizeErraticLandings,
  pickRawErraticDest,
  rawErraticAdjacentDests,
  resolveErraticLanding,
  tilesForErraticOccupancy,
  wxErraticCommitWithoutUnseal,
  wxErraticTileWalkable,
} from "./occupancyErraticUnseal.ts";

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
    tiles: tilesForErraticOccupancy(tiles),
    barriers: new Set(),
    voidTiles,
    portals: new Set(portals.map((p) => occKey(p.x, p.y))),
    progressStart: player,
    isOccupied: (c) => occ.has(occKey(c.x, c.y)),
  };
}

/** `#859` greedy: N→S→W→E closest-to-player on floor||portal, skip occupied. */
function rawGreedyMoveTowardDest(
  boss: OccCell,
  player: OccCell,
  tiles: string[][],
  occupied: readonly OccCell[],
): OccCell | null {
  const dirs: ReadonlyArray<readonly [number, number]> = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  const blocked = new Set(
    occupied
      .filter((o) => !(o.x === boss.x && o.y === boss.y))
      .map((o) => occKey(o.x, o.y)),
  );
  blocked.add(occKey(player.x, player.y));
  const moves: OccCell[] = [];
  for (const [dx, dy] of dirs) {
    const x = boss.x + dx;
    const y = boss.y + dy;
    const t = tiles[y]?.[x];
    if (t !== F && t !== P) continue;
    if (blocked.has(occKey(x, y))) continue;
    moves.push({ x, y });
  }
  if (moves.length === 0) return null;
  return moves.reduce((a, b) => {
    const da = Math.abs(a.x - player.x) + Math.abs(a.y - player.y);
    const db = Math.abs(b.x - player.x) + Math.abs(b.y - player.y);
    return da < db ? a : b;
  });
}

describe("wxErraticTileWalkable", () => {
  it("treats missing cells as walkable the way undefined !== wall does", () => {
    const tiles = [[F]];
    assert.equal(wxErraticTileWalkable(tiles, 0, 0), true);
    assert.equal(
      wxErraticTileWalkable(tiles, 1, 0),
      true,
      "WX erratic hops onto a missing column",
    );
    assert.equal(wxErraticTileWalkable(tiles, 0, 0, 1), true);
    assert.equal(wxErraticTileWalkable(tiles, 1, 0, 1), false);
    assert.equal(wxErraticTileWalkable([[W]], 0, 0), false);
    assert.equal(wxErraticTileWalkable([[P]], 0, 0), true);
  });
});

describe("occupancyErraticUnseal vs greedy moveToward (#859)", () => {
  it("seed-erratic-west-portal: rng=0 takes the west gate; greedy still picks east floor", () => {
    const tiles = [
      [F, F, F, F, F, F, F],
      [F, F, P, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 1 };
    const hostile = { x: 3, y: 1 };
    const portal = { x: 2, y: 1 };
    const east = { x: 4, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, hostile], player);
    const greedy = rawGreedyMoveTowardDest(hostile, player, tiles, [
      hostile,
      player,
    ]);
    assert.deepEqual(
      greedy,
      east,
      "greedy closest-to-player must keep the east floor — #859 never sees the west gate",
    );
    const raw = rawErraticAdjacentDests(
      hostile,
      tiles,
      [hostile, player],
      player,
    );
    assert.deepEqual(raw[0], portal, "WX dir order is W→E→N→S");
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(east.x, east.y)),
      true,
    );
    const miss = wxErraticCommitWithoutUnseal({
      origin: hostile,
      tiles,
      occupied: [hostile, player],
      player,
      rand: () => 0,
    });
    assert.deepEqual(miss, portal);
    assert.equal(erraticOffFightGraph(player, [miss], occupancy), true);
    const landed = resolveErraticLanding(
      hostile,
      player,
      tiles,
      occupancy,
      [hostile, player],
      () => 0,
    );
    assert.equal(isOnErraticBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
    assert.equal(erraticOffFightGraph(player, [landed], occupancy), false);
  });

  it("seed-erratic-side-portal: occupied toward-axis does not change W-first pick", () => {
    const tiles = [
      [F, F, P, F, F, F, F],
      [F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 6, y: 0 };
    const hostile = { x: 2, y: 1 };
    const minion = { x: 3, y: 1 };
    const portal = { x: 2, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player, hostile, minion],
      player,
    );
    const greedy = rawGreedyMoveTowardDest(hostile, player, tiles, [
      hostile,
      minion,
      player,
    ]);
    assert.deepEqual(
      greedy,
      portal,
      "greedy still collapses to the north gate",
    );
    const raw = rawErraticAdjacentDests(
      hostile,
      tiles,
      [hostile, minion, player],
      player,
    );
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      true,
    );
    assert.equal(
      raw.some((c) => c.x === 1 && c.y === 1),
      true,
      "west floor stays in the erratic pool; greedy never considers it once north is closer",
    );
    const miss = pickRawErraticDest(
      raw.filter((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      () => 0,
    );
    assert.deepEqual(miss, portal);
    const landed = legalizeErraticLanding(portal, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnErraticBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });
});

describe("occupancyErraticUnseal regressions", () => {
  it("seed-erratic-onto-portal: the only neighbor is the west gate", () => {
    const tiles = [
      [W, W, W, W, W],
      [W, P, F, F, W],
      [W, W, W, W, W],
    ];
    const player = { x: 3, y: 1 };
    const hostile = { x: 2, y: 1 };
    const portal = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, hostile], player);
    const miss = wxErraticCommitWithoutUnseal({
      origin: hostile,
      tiles,
      occupied: [hostile, player],
      player,
      rand: () => 0,
    });
    assert.deepEqual(miss, portal);
    assert.equal(isOnErraticBattleGraph(miss, player, occupancy), false);
    const landed = resolveErraticLanding(
      hostile,
      player,
      tiles,
      occupancy,
      [hostile, player],
      () => 0,
    );
    assert.equal(isOnErraticBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(portal.x, portal.y));
  });

  it("seed-erratic-on-unique-bridge: a corridor landing stays", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const hostile = { x: 2, y: 1 };
    const portal = { x: 5, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, hostile], player);
    const miss = wxErraticCommitWithoutUnseal({
      origin: hostile,
      tiles,
      occupied: [hostile, player],
      player,
      rand: () => 0.99,
    });
    assert.equal(isOnErraticBattleGraph(miss, player, occupancy), true);
    const landed = resolveErraticLanding(
      hostile,
      player,
      tiles,
      occupancy,
      [hostile, player],
      () => 0.99,
    );
    assert.deepEqual(landed, miss);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-erratic-through-portal-far-side: a gate landing then hops the leftover crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const farCrumb = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, farCrumb], player);
    assert.equal(isOnErraticBattleGraph(farCrumb, player, occupancy), false);
    const snapped = legalizeErraticLandings([farCrumb], player, occupancy);
    assert.ok(snapped.length >= 1);
    for (const cell of snapped) {
      assert.equal(isOnErraticBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(farCrumb.x, farCrumb.y));
      assert.notEqual(occKey(cell.x, cell.y), occKey(portal.x, portal.y));
    }
    assert.equal(erraticOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-erratic-missing-column: undefined !== wall hops off the painted pocket", () => {
    const tiles = [
      [F, F, F],
      [F, F, F],
      [F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const hostile = { x: 2, y: 1 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: 0, y: 2 }],
      [player, hostile],
      player,
    );
    assert.equal(wxErraticTileWalkable(tiles, 3, 1), true);
    const raw = rawErraticAdjacentDests(
      hostile,
      tiles,
      [hostile, player],
      player,
    );
    assert.equal(
      raw.some((c) => c.x === 3 && c.y === 1),
      true,
      "east missing column must be in the WX pool",
    );
    const miss = pickRawErraticDest(raw, () => 0.34);
    assert.deepEqual(miss, { x: 3, y: 1 });
    assert.equal(isOnErraticBattleGraph(miss, player, occupancy), false);
    const eastMiss = { x: 3, y: 1 };
    const landed = legalizeErraticLanding(eastMiss, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnErraticBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "3,1");
  });

  it("seed-open-field-erratic-noop: already-legal dests are unchanged", () => {
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
    const snapped = legalizeErraticLandings(dests, player, occupancy);
    assert.deepEqual(
      snapped.map((c) => occKey(c.x, c.y)).sort(),
      dests.map((c) => occKey(c.x, c.y)).sort(),
    );
    assert.equal(erraticOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-erratic-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const island = { x: 5, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(isOnErraticBattleGraph(island, player, occupancy), false);
    const snapped = legalizeErraticLandings([island], player, occupancy);
    for (const cell of snapped) {
      assert.equal(isOnErraticBattleGraph(cell, player, occupancy), true);
      assert.notEqual(occKey(cell.x, cell.y), occKey(island.x, island.y));
    }
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(erraticOffFightGraph(player, snapped, occupancy), false);
  });

  it("seed-erratic-only-portal: drop every dest when the fight graph is empty", () => {
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
    const snapped = legalizeErraticLandings(
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      player,
      occupancy,
    );
    assert.deepEqual(snapped, []);
    assert.equal(floodErraticBattleGraph(player, occupancy).size, 0);
    assert.equal(erraticOffFightGraph(player, snapped, occupancy), true);
  });

  it("seed-erratic-stay-when-blocked: missing raw step keeps the origin", () => {
    const tiles = [
      [W, W, W],
      [W, F, W],
      [W, W, P],
    ];
    const player = { x: 2, y: 2 };
    const hostile = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [player], [player, hostile], player);
    const raw = rawErraticAdjacentDests(
      hostile,
      tiles,
      [hostile, player],
      player,
    );
    assert.deepEqual(raw, []);
    const landed = resolveErraticLanding(
      hostile,
      player,
      tiles,
      occupancy,
      [hostile, player],
      () => 0,
    );
    assert.deepEqual(landed, hostile);
  });

  it("legalizeErraticLanding snaps a void dest onto dump", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 4, y: 0 };
    const voidCell = { x: 2, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set([occKey(voidCell.x, voidCell.y)]),
    );
    assert.equal(wxErraticTileWalkable(tiles, voidCell.x, voidCell.y), true);
    assert.equal(isOnErraticBattleGraph(voidCell, player, occupancy), false);
    const landed = legalizeErraticLanding(voidCell, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(voidCell.x, voidCell.y));
    assert.equal(isOnErraticBattleGraph(landed, player, occupancy), true);
  });

  it("keeps landings inside WORLD_GRID_SIZE", () => {
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => F),
    );
    tiles[0][WORLD_GRID_SIZE - 1] = P;
    const player = { x: 0, y: 0 };
    const hostile = { x: 8, y: 8 };
    const occupancy = ctxFrom(
      tiles,
      [{ x: WORLD_GRID_SIZE - 1, y: 0 }],
      [player, hostile],
      player,
    );
    const landed = resolveErraticLanding(
      hostile,
      player,
      tiles,
      occupancy,
      [hostile, player],
      () => 0,
    );
    assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
    assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
  });
});
