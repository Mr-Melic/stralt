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
  BOARD_CLAIM_ZONE_SIZE,
  boardClaimCells,
  boardClaimOverlapsBattleGraph,
  boardClaimRawOriginSpan,
  boardClaimUnreachable,
  floodBoardClaimBattleGraph,
  inBoardClaimZone,
  isOnBoardClaimBattleGraph,
  legalizeBoardClaimOrigin,
  pickBoardClaimOrigin,
  rawBoardClaimOrigins,
  resolveBoardClaimZone,
} from "./occupancyBoardClaimUnseal.ts";

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

describe("occupancyBoardClaimUnseal regressions", () => {
  it("seed-board-claim-no-alltiles: raw origins include wall top-lefts", () => {
    const tiles = [
      [W, W, F, F, P],
      [W, W, F, F, F],
    ];
    const player = { x: 2, y: 0 };
    const portal = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawBoardClaimOrigins(5, 2);
    assert.equal(
      raw.some((c) => c.x === 0 && c.y === 0),
      true,
      "production has no allTiles filter, so a wall 2×2 origin is legal raw",
    );
    assert.equal(
      boardClaimUnreachable(player, { x: 0, y: 0 }, occupancy),
      true,
      "a wall-only 2×2 must not tax the fight graph",
    );
    const landed = legalizeBoardClaimOrigin({ x: 0, y: 0 }, player, occupancy);
    assert.ok(landed, "snap must find a 2×2 that overlaps the fight graph");
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][0], W, "must not punch the wall 2×2 into floor");
    assert.equal(tiles[0][1], W);
  });

  it("seed-board-claim-onto-portal: 2×2 can sit entirely off the fight graph", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 1, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    const dest = { x: 3, y: 0 };
    const keys = new Set(boardClaimCells(dest).map((c) => occKey(c.x, c.y)));
    assert.equal(keys.has(occKey(portal.x, portal.y)), true);
    assert.equal(keys.has("4,0"), true, "2×2 also covers the far crumb");
    assert.equal(
      boardClaimUnreachable(player, dest, occupancy),
      true,
      "portal + far crumb + walls must start unsteppable",
    );
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.ok(landed, "snap must find a fight-graph 2×2");
    assert.equal(
      boardClaimOverlapsBattleGraph(landed, player, occupancy),
      true,
    );
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
    assert.equal(
      boardClaimCells(landed).some((c) =>
        isOnBoardClaimBattleGraph(c, player, occupancy),
      ),
      true,
    );
  });

  it("seed-board-claim-on-unique-bridge: walkable AP tax may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 5, y: 1 };
    const dest = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      boardClaimOverlapsBattleGraph(dest, player, occupancy),
      true,
      "2×2 covering the unique corridor already taxes the fight graph",
    );
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES, a unique-corridor claim stays — it is a walkable AP tax",
    );
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][2], F, "must not punch or wall the unique corridor");
    assert.equal(tiles[1][3], F);
  });

  it("seed-board-claim-through-portal-far-side: 2×2 hops the gate onto a crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnBoardClaimBattleGraph({ x: 4, y: 0 }, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(boardClaimUnreachable(player, dest, occupancy), true);
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      boardClaimOverlapsBattleGraph(landed, player, occupancy),
      true,
    );
    assert.equal(
      boardClaimCells(landed).some((c) =>
        isOnBoardClaimBattleGraph(c, player, occupancy),
      ),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
  });

  it("seed-board-claim-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeBoardClaimOrigin({ x: 4, y: 0 }, player, occupancy);
    assert.ok(landed);
    assert.equal(
      boardClaimOverlapsBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
  });

  it("seed-board-claim-onto-void: a generation void is not a steppable tax", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 4, y: 0 };
    const dest = { x: 2, y: 0 };
    const occupancy = ctxFrom(
      tiles,
      [portal],
      [player],
      player,
      new Set(["2,0", "3,0", "2,1", "3,1"]),
    );
    assert.equal(boardClaimUnreachable(player, dest, occupancy), true);
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      boardClaimOverlapsBattleGraph(landed, player, occupancy),
      true,
    );
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
  });

  it("seed-open-field-claim-noop: already-legal dests are unchanged", () => {
    const tiles = [
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, F],
      [F, F, F, F, P],
    ];
    const player = { x: 0, y: 0 };
    const dest = { x: 2, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 4 }], [player], player);
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
  });

  it("seed-board-claim-covers-player: claim-time AP tax on the player stays", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
      [F, F, F, F, F],
    ];
    const player = { x: 1, y: 1 };
    const dest = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player], player);
    assert.equal(inBoardClaimZone(player, dest), true);
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering the player is the intended −2 AP tax",
    );
    assert.equal(inBoardClaimZone(player, landed), true);
  });

  it("seed-board-claim-no-join-island: does not punch a leftover CA crumb", () => {
    const tiles = [
      [F, F, F, P, W, F],
      [F, W, W, W, W, W],
      [F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    assert.equal(
      isOnBoardClaimBattleGraph({ x: 5, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(boardClaimUnreachable(player, dest, occupancy), true);
    const landed = legalizeBoardClaimOrigin(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      boardClaimOverlapsBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(boardClaimUnreachable(player, landed, occupancy), false);
  });

  it("seed-board-claim-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveBoardClaimZone(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodBoardClaimBattleGraph(player, occupancy).size, 0);
    assert.equal(boardClaimUnreachable(player, snapped, occupancy), true);
  });

  it("seed-board-claim-span-14: production * 14 never picks origin 14 on 16×16", () => {
    assert.equal(BOARD_CLAIM_ZONE_SIZE, 2);
    assert.equal(boardClaimRawOriginSpan(WORLD_GRID_SIZE), 14);
    const seenX = new Set<number>();
    const seenY = new Set<number>();
    for (let seed = 0; seed < 64; seed++) {
      const rng = createSeededRng(seed + 23);
      const picked = pickBoardClaimOrigin(
        rng,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
      assert.ok(picked);
      assert.ok(picked.x >= 0 && picked.x < 14);
      assert.ok(picked.y >= 0 && picked.y < 14);
      seenX.add(picked.x);
      seenY.add(picked.y);
    }
    assert.equal(seenX.has(14), false, "cell 15 is never a raw origin x");
    assert.equal(seenY.has(14), false, "cell 15 is never a raw origin y");
    const raw = rawBoardClaimOrigins(WORLD_GRID_SIZE, WORLD_GRID_SIZE);
    assert.equal(raw.length, 14 * 14);
    assert.equal(
      raw.some((c) => c.x === 14 || c.y === 14),
      false,
    );
  });
});

function assertBoardClaimOnWorld(
  label: string,
  tiles: string[][],
  voidTiles: Set<string>,
  portals: OccCell[],
  player: OccCell,
  units: OccCell[],
  rng: () => number,
): string | null {
  const occupancy = ctxFrom(
    tiles,
    portals,
    [player, ...units],
    player,
    voidTiles,
  );
  const snapped = resolveBoardClaimZone(player, occupancy, rng);
  const battle = floodBoardClaimBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped !== null) {
      return `${label} claim placed on an empty fight graph`;
    }
    return null;
  }
  if (!snapped) {
    return `${label} dropped a claim even though the fight graph is nonempty`;
  }
  if (boardClaimUnreachable(player, snapped, occupancy)) {
    return `${label} board claim unreachable`;
  }
  if (!boardClaimOverlapsBattleGraph(snapped, player, occupancy)) {
    return `${label} 2×2 misses the fight graph`;
  }
  const { w, h } = {
    h: occupancy.tiles.length,
    w: occupancy.tiles[0]?.length ?? 0,
  };
  if (
    snapped.x < 0 ||
    snapped.y < 0 ||
    snapped.x > w - BOARD_CLAIM_ZONE_SIZE ||
    snapped.y > h - BOARD_CLAIM_ZONE_SIZE
  ) {
    return `${label} origin ${occKey(snapped.x, snapped.y)} out of 2×2 range`;
  }
  return null;
}

describe("occupancyBoardClaimUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack board claim stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertBoardClaimOnWorld(
        `destack ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 7),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("corridorMaze wander board claim stays on the fight graph", () => {
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
      const miss = assertBoardClaimOnWorld(
        `wander ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        world.playerSpawn,
        after.spawns,
        createSeededRng(seed + 11),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("chessboard destack board claim stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertBoardClaimOnWorld(
        `chess ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 13),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("Boss Rush destack board claim stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertBoardClaimOnWorld(
        `bossRush ${seed}`,
        world.tiles,
        world.voidTiles,
        world.portals,
        after.playerSpawn,
        after.spawns,
        createSeededRng(seed + 17),
      );
      if (miss) failures.push(miss);
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("rest-exit destack board claim stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertBoardClaimOnWorld(
          `rest-${restExitType} ${seed}`,
          world.tiles,
          world.voidTiles,
          world.portals,
          after.playerSpawn,
          after.spawns,
          createSeededRng(seed + 19),
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
    const snapped = resolveBoardClaimZone(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    assert.ok(snapped.x >= 0 && snapped.x < WORLD_GRID_SIZE);
    assert.ok(snapped.y >= 0 && snapped.y < WORLD_GRID_SIZE);
    for (const cell of boardClaimCells(snapped)) {
      assert.ok(cell.x >= 0 && cell.x < WORLD_GRID_SIZE);
      assert.ok(cell.y >= 0 && cell.y < WORLD_GRID_SIZE);
    }
  });
});
