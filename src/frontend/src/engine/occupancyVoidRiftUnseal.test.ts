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
  VOID_RIFT_COUNT,
  floodVoidRiftBattleGraph,
  isOnVoidRiftBattleGraph,
  legalizeVoidRiftPlacement,
  pickVoidRiftDest,
  rawVoidRiftDests,
  resolveVoidRiftTile,
  voidRiftUnreachable,
} from "./occupancyVoidRiftUnseal.ts";

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

describe("occupancyVoidRiftUnseal regressions", () => {
  it("seed-void-rift-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawVoidRiftDests(occupancy);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(portal.x, portal.y)),
      false,
      "WX tiles === floor skips portal; INK_VEIL allTiles would include it",
    );
    assert.equal(
      raw.some((c) => c.x === 4 && c.y === 0),
      true,
      "a leftover floor crumb is a legal raw dest",
    );
    assert.equal(VOID_RIFT_COUNT, 1);
  });

  it("seed-void-rift-through-portal-far-side: one floor hop parks the tax on a crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const portal = { x: 3, y: 0 };
    const dest = { x: 4, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnVoidRiftBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(voidRiftUnreachable(player, dest, occupancy), true);
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnVoidRiftBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-void-rift-on-unique-bridge: walkable HP tax may sit on the corridor", () => {
    const tiles = [
      [W, W, W, W, W, W],
      [F, F, F, F, F, P],
      [W, W, W, W, W, W],
    ];
    const player = { x: 0, y: 1 };
    const boss = { x: 1, y: 1 };
    const portal = { x: 5, y: 1 };
    const dest = { x: 3, y: 1 };
    const occupancy = ctxFrom(tiles, [portal], [player, boss], player);
    assert.equal(
      isOnVoidRiftBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES, a unique-corridor rift stays — it is a walkable tax",
    );
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-void-rift-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeVoidRiftPlacement({ x: 4, y: 0 }, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnVoidRiftBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
  });

  it("seed-void-rift-onto-void: a generation void is not a steppable tax", () => {
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
      new Set(["2,0"]),
    );
    assert.equal(
      rawVoidRiftDests(occupancy).some((c) => occKey(c.x, c.y) === "2,0"),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(voidRiftUnreachable(player, dest, occupancy), true);
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(isOnVoidRiftBattleGraph(landed, player, occupancy), true);
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
  });

  it("seed-open-field-rift-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
  });

  it("seed-void-rift-covers-player: walk dest tax on the player cell stays", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
      [F, F, F, F, F],
    ];
    const player = { x: 1, y: 1 };
    const dest = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player], player);
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering the player is a legal Void Rift dest",
    );
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
  });

  it("seed-void-rift-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const dest = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player, boss], player);
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(isOnVoidRiftBattleGraph(landed, player, occupancy), true);
  });

  it("seed-void-rift-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnVoidRiftBattleGraph({ x: 5, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(voidRiftUnreachable(player, dest, occupancy), true);
    const landed = legalizeVoidRiftPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(isOnVoidRiftBattleGraph(landed, player, occupancy), true);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(voidRiftUnreachable(player, landed, occupancy), false);
  });

  it("seed-void-rift-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveVoidRiftTile(player, occupancy);
    assert.equal(snapped, null);
    assert.equal(floodVoidRiftBattleGraph(player, occupancy).size, 0);
    assert.equal(voidRiftUnreachable(player, snapped, occupancy), true);
    assert.equal(rawVoidRiftDests(occupancy).length, 0);
  });

  it("seed-void-rift-count-one: pick is a single floor cell", () => {
    const tiles = [
      [F, F, F, P],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const raw = rawVoidRiftDests(occupancy);
    const seen = new Set<string>();
    for (let seed = 0; seed < 32; seed++) {
      const picked = pickVoidRiftDest(raw, createSeededRng(seed + 41));
      assert.ok(picked);
      seen.add(occKey(picked.x, picked.y));
      assert.equal(occupancy.portals.has(occKey(picked.x, picked.y)), false);
    }
    assert.ok(seen.size >= 2, "rng must visit more than one raw dest");
  });
});

function assertVoidRiftOnWorld(
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
  const snapped = resolveVoidRiftTile(player, occupancy, rng);
  const battle = floodVoidRiftBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped !== null) {
      return `${label} rift placed on an empty fight graph`;
    }
    return null;
  }
  if (!snapped) {
    return `${label} dropped a rift even though the fight graph is nonempty`;
  }
  if (voidRiftUnreachable(player, snapped, occupancy)) {
    return `${label} void rift unreachable`;
  }
  if (!isOnVoidRiftBattleGraph(snapped, player, occupancy)) {
    return `${label} rift misses the fight graph`;
  }
  const { w, h } = {
    h: occupancy.tiles.length,
    w: occupancy.tiles[0]?.length ?? 0,
  };
  if (snapped.x < 0 || snapped.y < 0 || snapped.x >= w || snapped.y >= h) {
    return `${label} dest ${occKey(snapped.x, snapped.y)} out of bounds`;
  }
  return null;
}

describe("occupancyVoidRiftUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack void rift stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertVoidRiftOnWorld(
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

  it("corridorMaze wander void rift stays on the fight graph", () => {
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
      const miss = assertVoidRiftOnWorld(
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

  it("chessboard destack void rift stays on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertVoidRiftOnWorld(
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

  it("Boss Rush destack void rift stays on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertVoidRiftOnWorld(
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

  it("rest-exit destack void rift stays on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertVoidRiftOnWorld(
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
    const snapped = resolveVoidRiftTile(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    if (!snapped) return;
    assert.ok(snapped.x >= 0 && snapped.x < WORLD_GRID_SIZE);
    assert.ok(snapped.y >= 0 && snapped.y < WORLD_GRID_SIZE);
  });
});
