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
  ELIGIBLE_HAZARD_CENTER_CLEAR,
  ELIGIBLE_HAZARD_GENERATE_MAX,
  ELIGIBLE_HAZARD_GENERATE_MIN,
  ELIGIBLE_HAZARD_MOD_MAX,
  ELIGIBLE_HAZARD_MOD_MIN,
  ELIGIBLE_HAZARD_TYPES,
  eligibleHazardUnreachable,
  floodEligibleHazardBattleGraph,
  isEligibleHazardCenterClear,
  isOnEligibleHazardBattleGraph,
  legalizeEligibleHazardPlacement,
  legalizeEligibleHazardPlacements,
  pickEligibleHazardDests,
  pickEligibleHazardType,
  pickGenerateHazardCount,
  pickModHazardCount,
  rawEligibleHazardDests,
  resolveEligibleHazards,
  resolveModHazards,
} from "./occupancyEligibleHazardUnseal.ts";

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

describe("occupancyEligibleHazardUnseal regressions", () => {
  it("seed-eligible-hazard-raw-skips-portal: production floor raster never picks the gate", () => {
    const tiles = [
      [F, F, F, P, F],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const raw = rawEligibleHazardDests(occupancy);
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
    assert.equal(ELIGIBLE_HAZARD_GENERATE_MIN, 1);
    assert.equal(ELIGIBLE_HAZARD_GENERATE_MAX, 3);
  });

  it("seed-eligible-hazard-raw-skips-center: Chebyshev ≤ 3 from grid center is skipped", () => {
    const size = WORLD_GRID_SIZE;
    const tiles = Array.from({ length: size }, () => Array(size).fill(F));
    tiles[0][size - 1] = P;
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: size - 1, y: 0 }], [player], player);
    const raw = rawEligibleHazardDests(occupancy);
    const cx = Math.floor(WORLD_GRID_SIZE / 2);
    const cy = Math.floor(WORLD_GRID_SIZE / 2);
    assert.equal(isEligibleHazardCenterClear(cx, cy), true);
    assert.equal(isEligibleHazardCenterClear(cx + 3, cy), true);
    assert.equal(isEligibleHazardCenterClear(cx + 4, cy), false);
    assert.equal(ELIGIBLE_HAZARD_CENTER_CLEAR, 3);
    assert.equal(
      raw.some((c) => isEligibleHazardCenterClear(c.x, c.y)),
      false,
      "raw dests must not include the spawn-clear diamond",
    );
    assert.equal(
      raw.some((c) => c.x === 0 && c.y === 0),
      true,
      "a corner floor outside the diamond is a legal raw dest",
    );
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === occKey(size - 1, 0)),
      false,
      "the corner portal is still skipped",
    );
  });

  it("seed-eligible-hazard-through-portal-far-side: one floor hop parks the tax on a crumb", () => {
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
      isOnEligibleHazardBattleGraph(dest, player, occupancy),
      false,
      "far crumb must start battle-isolated",
    );
    assert.equal(eligibleHazardUnreachable(player, [dest], occupancy), true);
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnEligibleHazardBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(eligibleHazardUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[0][4], F, "must not punch or wall the leftover crumb");
  });

  it("seed-eligible-hazard-on-unique-bridge: walkable tax may sit on the corridor", () => {
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
      isOnEligibleHazardBattleGraph(dest, player, occupancy),
      true,
      "unique corridor already taxes the fight graph",
    );
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike VOID_TILES, a unique-corridor lava/ice/spikes stays — it is a walkable tax",
    );
    assert.equal(eligibleHazardUnreachable(player, [landed], occupancy), false);
    assert.equal(tiles[1][3], F, "must not punch or wall the unique corridor");
  });

  it("seed-eligible-hazard-corridor-8: 1-wide gate still snaps off the far crumb", () => {
    const tiles = [
      [F, F, F, P, F, F, F, F],
      [F, W, W, W, W, W, W, W],
      [F, F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const landed = legalizeEligibleHazardPlacement(
      { x: 4, y: 0 },
      player,
      occupancy,
    );
    assert.ok(landed);
    assert.equal(
      isOnEligibleHazardBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), "4,0");
    assert.equal(eligibleHazardUnreachable(player, [landed], occupancy), false);
  });

  it("seed-eligible-hazard-onto-void: a generation void is not a steppable tax", () => {
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
      rawEligibleHazardDests(occupancy).some((c) => occKey(c.x, c.y) === "2,0"),
      true,
      "production floor raster includes floor-under-void",
    );
    assert.equal(eligibleHazardUnreachable(player, [dest], occupancy), true);
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      isOnEligibleHazardBattleGraph(landed, player, occupancy),
      true,
    );
    assert.equal(eligibleHazardUnreachable(player, [landed], occupancy), false);
  });

  it("seed-open-field-hazard-noop: already-legal dests are unchanged", () => {
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
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.deepEqual(landed, dest);
    assert.equal(
      eligibleHazardUnreachable(player, [landed!], occupancy),
      false,
    );
  });

  it("seed-eligible-hazard-covers-player: walk dest tax on the player cell stays", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
      [F, F, F, F, F],
    ];
    const player = { x: 1, y: 1 };
    const dest = { x: 1, y: 1 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player], player);
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, covering the player is a legal eligible-hazard dest",
    );
    assert.equal(eligibleHazardUnreachable(player, [landed], occupancy), false);
  });

  it("seed-eligible-hazard-occupied-stays: production has no occupancy filter", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const boss = { x: 2, y: 0 };
    const dest = { x: 2, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player, boss], player);
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      occKey(landed.x, landed.y),
      occKey(dest.x, dest.y),
      "unlike INK_VEIL, an occupied fight-graph cell stays",
    );
    assert.equal(
      isOnEligibleHazardBattleGraph(landed, player, occupancy),
      true,
    );
  });

  it("seed-eligible-hazard-no-join-island: does not punch a leftover CA crumb", () => {
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
      isOnEligibleHazardBattleGraph({ x: 5, y: 0 }, player, occupancy),
      false,
    );
    assert.equal(eligibleHazardUnreachable(player, [dest], occupancy), true);
    const landed = legalizeEligibleHazardPlacement(dest, player, occupancy);
    assert.ok(landed);
    assert.equal(
      isOnEligibleHazardBattleGraph(landed, player, occupancy),
      true,
    );
    assert.notEqual(occKey(landed.x, landed.y), occKey(dest.x, dest.y));
    assert.equal(
      tiles[0][4],
      W,
      "must not punch the wall that isolates the crumb",
    );
    assert.equal(tiles[0][5], F, "leftover crumb stays a floor island");
    assert.equal(eligibleHazardUnreachable(player, [landed], occupancy), false);
  });

  it("seed-eligible-hazard-only-portal: drop the dest when the fight graph is empty", () => {
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
    const snapped = resolveEligibleHazards(player, occupancy);
    assert.equal(snapped.length, 0);
    assert.equal(floodEligibleHazardBattleGraph(player, occupancy).size, 0);
    assert.equal(eligibleHazardUnreachable(player, snapped, occupancy), true);
    assert.equal(rawEligibleHazardDests(occupancy).length, 0);
  });

  it("seed-eligible-hazard-triple-far: three leftover dests snap without stacking", () => {
    const tiles = [
      [F, F, F, P, F, F, F],
      [F, W, W, W, W, W, W],
      [F, F, F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const portal = { x: 3, y: 0 };
    const occupancy = ctxFrom(tiles, [portal], [player], player);
    const dests = [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
    ];
    const landed = legalizeEligibleHazardPlacements(dests, player, occupancy);
    assert.equal(landed.length, 3);
    const keys = new Set(landed.map((c) => occKey(c.x, c.y)));
    assert.equal(
      keys.size,
      3,
      "snapped hazards must not collapse onto one cell",
    );
    for (const cell of landed) {
      assert.equal(
        isOnEligibleHazardBattleGraph(cell, player, occupancy),
        true,
      );
    }
    assert.equal(eligibleHazardUnreachable(player, landed, occupancy), false);
    assert.equal(tiles[0][4], F);
  });

  it("seed-eligible-hazard-skips-existing: eligMod does not restamp a live hazard", () => {
    const tiles = [
      [F, F, F, F, P],
      [F, F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 4, y: 0 }], [player], player);
    const existing = new Set(["0,1"]);
    const raw = rawEligibleHazardDests(occupancy, existing);
    assert.equal(
      raw.some((c) => occKey(c.x, c.y) === "0,1"),
      false,
      "portal-transition eligMod skips hazardMap.has cells",
    );
    assert.equal(
      rawEligibleHazardDests(occupancy).some((c) => occKey(c.x, c.y) === "0,1"),
      true,
      "generate-time first pass still sees that floor",
    );
  });

  it("seed-eligible-hazard-count-one-to-three: generate pick is 1–3 floor cells", () => {
    const tiles = [
      [F, F, F, P],
      [F, F, F, F],
    ];
    const player = { x: 0, y: 0 };
    const occupancy = ctxFrom(tiles, [{ x: 3, y: 0 }], [player], player);
    const raw = rawEligibleHazardDests(occupancy);
    const seenCounts = new Set<number>();
    const seenTypes = new Set<string>();
    for (let seed = 0; seed < 48; seed++) {
      const rng = createSeededRng(seed + 41);
      const count = pickGenerateHazardCount(rng);
      assert.ok(count >= ELIGIBLE_HAZARD_GENERATE_MIN);
      assert.ok(count <= ELIGIBLE_HAZARD_GENERATE_MAX);
      seenCounts.add(count);
      const picked = pickEligibleHazardDests(raw, rng, count);
      assert.ok(picked.length >= 1);
      assert.ok(picked.length <= count);
      for (const cell of picked) {
        assert.equal(occupancy.portals.has(occKey(cell.x, cell.y)), false);
        assert.equal(isEligibleHazardCenterClear(cell.x, cell.y), false);
      }
      seenTypes.add(pickEligibleHazardType(createSeededRng(seed + 7)));
    }
    assert.ok(
      seenCounts.size >= 2,
      "rng must visit more than one generate count",
    );
    assert.equal(seenTypes.size, ELIGIBLE_HAZARD_TYPES.length);
  });

  it("seed-eligible-hazard-mod-count-three-to-eight: modifier pick is 3–8", () => {
    const seen = new Set<number>();
    for (let seed = 0; seed < 96; seed++) {
      const count = pickModHazardCount(createSeededRng(seed + 90));
      assert.ok(count >= ELIGIBLE_HAZARD_MOD_MIN);
      assert.ok(count <= ELIGIBLE_HAZARD_MOD_MAX);
      seen.add(count);
    }
    assert.equal(seen.has(ELIGIBLE_HAZARD_MOD_MIN), true);
    assert.equal(seen.has(ELIGIBLE_HAZARD_MOD_MAX), true);
  });
});

function assertEligibleHazardOnWorld(
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
  const raw = rawEligibleHazardDests(occupancy);
  const snapped = resolveEligibleHazards(player, occupancy, rng);
  const battle = floodEligibleHazardBattleGraph(player, occupancy);
  if (battle.size === 0) {
    if (snapped.length > 0) {
      return `${label} hazard placed on an empty fight graph`;
    }
    return null;
  }
  if (raw.length > 0 && snapped.length === 0) {
    return `${label} dropped every hazard even though the fight graph is nonempty`;
  }
  for (const cell of snapped) {
    if (eligibleHazardUnreachable(player, [cell], occupancy)) {
      return `${label} eligible hazard unreachable at ${occKey(cell.x, cell.y)}`;
    }
    if (!isOnEligibleHazardBattleGraph(cell, player, occupancy)) {
      return `${label} hazard misses the fight graph at ${occKey(cell.x, cell.y)}`;
    }
    const h = occupancy.tiles.length;
    const w = occupancy.tiles[0]?.length ?? 0;
    if (cell.x < 0 || cell.y < 0 || cell.x >= w || cell.y >= h) {
      return `${label} dest ${occKey(cell.x, cell.y)} out of bounds`;
    }
    if (occupancy.portals.has(occKey(cell.x, cell.y))) {
      return `${label} dest ${occKey(cell.x, cell.y)} sat on a portal`;
    }
  }
  const keys = new Set(snapped.map((c) => occKey(c.x, c.y)));
  if (keys.size !== snapped.length) {
    return `${label} stacked two hazards on one cell`;
  }
  return null;
}

describe("occupancyEligibleHazardUnseal seeded suites", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("corridorMaze destack eligible hazards stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertEligibleHazardOnWorld(
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

  it("corridorMaze wander eligible hazards stay on the fight graph", () => {
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
      const miss = assertEligibleHazardOnWorld(
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

  it("chessboard destack eligible hazards stay on the fight graph", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "chessboard",
      });
      const after = simulateBattleStartOnWorld(world);
      const miss = assertEligibleHazardOnWorld(
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

  it("Boss Rush destack eligible hazards stay on the fight graph", () => {
    const failures: string[] = [];
    const rushSeeds = Array.from({ length: 64 }, (_, i) => 9000 + i * 13);
    for (const seed of rushSeeds) {
      const world = generateSeededBossRushRoom(seed);
      const after = simulateBattleStartOnWorld(world);
      const miss = assertEligibleHazardOnWorld(
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

  it("rest-exit destack eligible hazards stay on the fight graph", () => {
    const failures: string[] = [];
    const restSeeds = Array.from({ length: 64 }, (_, i) => 4000 + i * 19);
    for (const restExitType of ["dungeon", "normal", "boss"] as const) {
      for (const seed of restSeeds) {
        const world = simulateRestExitEncounter(seed, restExitType);
        const after = simulateBattleStartOnWorld(world);
        const miss = assertEligibleHazardOnWorld(
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

  it("modifier 3–8 dests stay on the fight graph and skip existing", () => {
    const failures: string[] = [];
    for (const seed of seeds.slice(0, 64)) {
      const world = generateSeededWorld({ seed, runMode: "dungeon" });
      const occupancy = ctxFrom(
        world.tiles,
        world.portals,
        [world.playerSpawn, ...world.spawns],
        world.playerSpawn,
        world.voidTiles,
      );
      const existing = new Set(
        resolveEligibleHazards(
          world.playerSpawn,
          occupancy,
          createSeededRng(seed + 3),
        ).map((c) => occKey(c.x, c.y)),
      );
      const snapped = resolveModHazards(
        world.playerSpawn,
        occupancy,
        createSeededRng(seed + 5),
        undefined,
        existing,
      );
      const battle = floodEligibleHazardBattleGraph(
        world.playerSpawn,
        occupancy,
      );
      for (const cell of snapped) {
        const k = occKey(cell.x, cell.y);
        if (existing.has(k)) {
          failures.push(`seed ${seed} restamped ${k}`);
          break;
        }
        if (battle.size > 0 && !battle.has(k)) {
          failures.push(`seed ${seed} mod hazard off graph at ${k}`);
          break;
        }
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
    const snapped = resolveEligibleHazards(
      world.playerSpawn,
      occupancy,
      createSeededRng(4242),
    );
    for (const landed of snapped) {
      assert.ok(landed.x >= 0 && landed.x < WORLD_GRID_SIZE);
      assert.ok(landed.y >= 0 && landed.y < WORLD_GRID_SIZE);
    }
  });
});
