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
import { createSeededRng, evaluateSolvability } from "./mapGen.ts";
import {
  type OccupancyContext,
  occKey,
  occupantsSealProgression,
  unsealProgressionOccupants,
} from "./occupancy.ts";
import {
  ensureJointCutUnseal,
  unsealJointProgressionOccupants,
} from "./occupancyJointUnseal.ts";

const W = "wall";
const F = "floor";

/**
 * Dual 1-wide corridors with two player-side alcoves. Unique bridges are
 * empty (min-cut=2). Two corpses on each corridor jointly seal; greedy
 * one-at-a-time unseal cannot move any single occupant off the cut.
 */
function dualTwoPlusTwoFixture(withAlcoves = true) {
  const tiles = [
    [F, F, F, F, F, "portal"],
    [F, W, W, W, W, F],
    [F, F, F, F, F, F],
    [withAlcoves ? F : W, W, W, W, W, W],
    [withAlcoves ? F : W, W, W, W, W, W],
  ];
  return {
    tiles,
    playerSpawn: { x: 0, y: 1 },
    portals: [{ x: 5, y: 0 }],
    occupants: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    w: 6,
    h: 5,
  };
}

function leftoverIslandPunchFixture() {
  const fx = dualTwoPlusTwoFixture(false);
  // Isolated CA crumb beside the stem. Punching the wall at (1,3)
  // would join it; the helper must skip that wall.
  fx.tiles.push([W, F, W, W, W, W]);
  fx.h = 6;
  return fx;
}

function cornerTwoPlusTwoFixture() {
  const tiles = [
    [F, F, F, F, F, "portal"],
    [F, W, W, W, W, F],
    [F, F, F, F, F, F],
    [W, W, W, W, W, W],
  ];
  return {
    tiles,
    playerSpawn: { x: 0, y: 0 },
    portals: [{ x: 5, y: 0 }],
    occupants: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    w: 6,
    h: 4,
  };
}

function occCtx(
  tiles: string[][],
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupants: { x: number; y: number }[],
): {
  boolTiles: boolean[][];
  portalSet: Set<string>;
  ctx: OccupancyContext;
} {
  const boolTiles = tiles.map((row) => row.map((t) => t !== "wall"));
  const portalSet = new Set(portals.map((p) => `${p.x},${p.y}`));
  const taken = new Set<string>([
    `${spawn.x},${spawn.y}`,
    ...occupants.map((c) => occKey(c.x, c.y)),
  ]);
  const ctx: OccupancyContext = {
    tiles: boolTiles,
    barriers: new Set(),
    voidTiles: new Set(),
    portals: portalSet,
    progressStart: spawn,
    isOccupied: (c) => taken.has(occKey(c.x, c.y)),
  };
  return { boolTiles, portalSet, ctx };
}

function greedySealed(
  tiles: string[][],
  spawn: { x: number; y: number },
  portals: { x: number; y: number }[],
  occupants: { x: number; y: number }[],
): boolean {
  const { boolTiles, portalSet, ctx } = occCtx(
    tiles,
    spawn,
    portals,
    occupants,
  );
  const moved = unsealProgressionOccupants(
    occupants,
    boolTiles,
    new Set(),
    portalSet,
    spawn,
    ctx,
  );
  return occupantsSealProgression(
    boolTiles,
    new Set(),
    portalSet,
    spawn,
    moved,
  );
}

function bfsPath(
  walk: (x: number, y: number) => boolean,
  start: { x: number; y: number },
  goal: Set<string>,
  blocked: Set<string>,
): { x: number; y: number }[] | null {
  const sk = `${start.x},${start.y}`;
  if (blocked.has(sk) && !goal.has(sk)) return null;
  const prev = new Map<string, string | null>();
  prev.set(sk, null);
  const q = [start];
  let found: string | null = null;
  while (q.length > 0) {
    const cur = q.shift()!;
    const ck = `${cur.x},${cur.y}`;
    if (goal.has(ck)) {
      found = ck;
      break;
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      const nk = `${nx},${ny}`;
      if (prev.has(nk) || blocked.has(nk) || !walk(nx, ny)) continue;
      prev.set(nk, ck);
      q.push({ x: nx, y: ny });
    }
  }
  if (!found) return null;
  const path: { x: number; y: number }[] = [];
  let k: string | null = found;
  while (k) {
    const p = k.split(",");
    path.push({ x: Number(p[0]), y: Number(p[1]) });
    k = prev.get(k) ?? null;
  }
  path.reverse();
  return path;
}

/**
 * Two internally disjoint spawn→portal interiors with ≥2 cells each.
 * Returns four occupant cells (2+2) or null when the graph is min-cut 1.
 */
function placeTwoPlusTwoJointCut(world: {
  tiles: string[][];
  voidTiles: Set<string>;
  playerSpawn: { x: number; y: number };
  portals: { x: number; y: number }[];
}): { x: number; y: number }[] | null {
  const h = world.tiles.length;
  const w = world.tiles[0]?.length ?? 0;
  const spawnKey = `${world.playerSpawn.x},${world.playerSpawn.y}`;
  const portalKeys = new Set(world.portals.map((p) => `${p.x},${p.y}`));
  const walk = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    if (world.tiles[y][x] === "wall") return false;
    return !world.voidTiles.has(`${x},${y}`);
  };
  const path1 = bfsPath(walk, world.playerSpawn, portalKeys, new Set());
  if (!path1 || path1.length < 4) return null;
  const interior1 = path1.filter(
    (c) => `${c.x},${c.y}` !== spawnKey && !portalKeys.has(`${c.x},${c.y}`),
  );
  if (interior1.length < 2) return null;
  const block1 = new Set(interior1.map((c) => `${c.x},${c.y}`));
  const path2 = bfsPath(walk, world.playerSpawn, portalKeys, block1);
  if (!path2 || path2.length < 4) return null;
  const interior2 = path2.filter((c) => {
    const k = `${c.x},${c.y}`;
    return k !== spawnKey && !portalKeys.has(k) && !block1.has(k);
  });
  if (interior2.length < 2) return null;
  return [interior1[0], interior1[1], interior2[0], interior2[1]];
}

function copyTiles(tiles: string[][]): string[][] {
  return tiles.map((row) => [...row]);
}

describe("unsealJointProgressionOccupants", () => {
  it("seed-dual-2plus2-joint-cut: greedy one-at-a-time stays sealed, joint peels into alcoves", () => {
    const fx = dualTwoPlusTwoFixture(true);
    assert.equal(
      greedySealed(fx.tiles, fx.playerSpawn, fx.portals, fx.occupants),
      true,
      "2+2 dual-path cut must beat greedy one-at-a-time unseal",
    );
    const { boolTiles, portalSet, ctx } = occCtx(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      fx.occupants,
    );
    const moved = unsealJointProgressionOccupants(
      fx.occupants,
      boolTiles,
      new Set(),
      portalSet,
      fx.playerSpawn,
      ctx,
    );
    assert.equal(
      occupantsSealProgression(
        boolTiles,
        new Set(),
        portalSet,
        fx.playerSpawn,
        moved,
      ),
      false,
      "joint peel must restore a player→exit route",
    );
  });

  it("seed-dual-2plus1-greedy-already-opens: joint does not need extra peels", () => {
    const fx = dualTwoPlusTwoFixture(true);
    const occupants = [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 2 },
    ];
    assert.equal(
      greedySealed(fx.tiles, fx.playerSpawn, fx.portals, occupants),
      false,
      "2+1 is the occupancy.ts dual-path case; greedy already unseals",
    );
    const { boolTiles, portalSet, ctx } = occCtx(
      fx.tiles,
      fx.playerSpawn,
      fx.portals,
      occupants,
    );
    const moved = unsealJointProgressionOccupants(
      occupants,
      boolTiles,
      new Set(),
      portalSet,
      fx.playerSpawn,
      ctx,
    );
    assert.equal(
      occupantsSealProgression(
        boolTiles,
        new Set(),
        portalSet,
        fx.playerSpawn,
        moved,
      ),
      false,
    );
  });

  it("seed-dual-2plus2-no-alcove: safe-growth peel opens a route without joining islands", () => {
    const fx = dualTwoPlusTwoFixture(false);
    assert.equal(
      greedySealed(fx.tiles, fx.playerSpawn, fx.portals, fx.occupants),
      true,
    );
    const tiles = copyTiles(fx.tiles);
    const after = ensureJointCutUnseal(
      tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupants,
      fx.w,
      fx.h,
    );
    const boolTiles = tiles.map((row) => row.map((t) => t !== "wall"));
    const portalSet = new Set(fx.portals.map((p) => `${p.x},${p.y}`));
    assert.equal(
      occupantsSealProgression(
        boolTiles,
        new Set(),
        portalSet,
        fx.playerSpawn,
        after.occupants,
      ),
      false,
      "punch + peel must open a route when unique bridges are empty",
    );
  });

  it("seed-corner-2plus2-joint-cut: peels a spawn-pocket neck onto the far room", () => {
    const fx = cornerTwoPlusTwoFixture();
    assert.equal(
      greedySealed(fx.tiles, fx.playerSpawn, fx.portals, fx.occupants),
      true,
      "four corpses on a corner min-cut=2 must beat greedy unseal",
    );
    const tiles = copyTiles(fx.tiles);
    const after = ensureJointCutUnseal(
      tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupants,
      fx.w,
      fx.h,
    );
    const boolTiles = tiles.map((row) => row.map((t) => t !== "wall"));
    const portalSet = new Set(fx.portals.map((p) => `${p.x},${p.y}`));
    assert.equal(
      occupantsSealProgression(
        boolTiles,
        new Set(),
        portalSet,
        fx.playerSpawn,
        after.occupants,
      ),
      false,
      "safe-growth peel must open a cardinal exit from the pocket",
    );
  });

  it("seed-joint-cut-no-join-island: punch skips a leftover CA crumb", () => {
    const fx = leftoverIslandPunchFixture();
    const tiles = copyTiles(fx.tiles);
    const crumb = { x: 1, y: 5 };
    assert.equal(tiles[crumb.y][crumb.x], F);
    const after = ensureJointCutUnseal(
      tiles,
      new Set(),
      fx.playerSpawn,
      fx.portals,
      fx.occupants,
      fx.w,
      fx.h,
    );
    const boolTiles = tiles.map((row) => row.map((t) => t !== "wall"));
    const portalSet = new Set(fx.portals.map((p) => `${p.x},${p.y}`));
    const spawnFlood = new Set<string>();
    const q = [fx.playerSpawn];
    spawnFlood.add(`${fx.playerSpawn.x},${fx.playerSpawn.y}`);
    while (q.length > 0) {
      const cur = q.shift()!;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        const k = `${nx},${ny}`;
        if (spawnFlood.has(k)) continue;
        if (tiles[ny]?.[nx] === W) continue;
        if (tiles[ny]?.[nx] == null) continue;
        spawnFlood.add(k);
        q.push({ x: nx, y: ny });
      }
    }
    assert.equal(
      spawnFlood.has(`${crumb.x},${crumb.y}`),
      false,
      "leftover island must stay sealed off",
    );
    assert.equal(
      occupantsSealProgression(
        boolTiles,
        new Set(),
        portalSet,
        fx.playerSpawn,
        after.occupants,
      ),
      false,
    );
  });
});

function assertJointCutSuite(
  label: string,
  worlds: {
    tiles: string[][];
    voidTiles: Set<string>;
    playerSpawn: { x: number; y: number };
    portals: { x: number; y: number }[];
    spawns: { x: number; y: number }[];
  }[],
): void {
  const failures: string[] = [];
  let probed = 0;
  for (const world of worlds) {
    const cut = placeTwoPlusTwoJointCut(world);
    if (!cut) continue;
    probed += 1;
    const tiles = copyTiles(world.tiles);
    const after = ensureJointCutUnseal(
      tiles,
      world.voidTiles,
      world.playerSpawn,
      world.portals,
      cut,
    );
    const boolTiles = tiles.map((row) => row.map((t) => t !== "wall"));
    const portalSet = new Set(world.portals.map((p) => `${p.x},${p.y}`));
    const sealed = occupantsSealProgression(
      boolTiles,
      world.voidTiles,
      portalSet,
      world.playerSpawn,
      after.occupants,
    );
    if (sealed) {
      failures.push(
        `${label} still sealed at ${after.occupants.map((c) => `${c.x},${c.y}`).join("/")}`,
      );
    }
    const report = evaluateSolvability(
      tiles,
      world.voidTiles,
      world.playerSpawn,
      world.portals,
      world.spawns,
      tiles[0]?.length ?? WORLD_GRID_SIZE,
      tiles.length,
    );
    if (!report.ok && report.failures.some((f) => f.startsWith("isolated-"))) {
      failures.push(`${label} solvability ${report.failures.join(",")}`);
    }
  }
  assert.ok(probed >= 1, `${label}: expected at least one dual-path 2+2 map`);
  assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
}

describe("joint-cut occupancy across generated maps", () => {
  it("256-seed corridorMaze destack 2+2 corpses cannot seal the exit", () => {
    const worlds = [];
    for (let seed = 0; seed < 256; seed++) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const destack = simulateBattleStartOnWorld(world);
      worlds.push({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      });
    }
    assertJointCutSuite("destack", worlds);
  });

  it("256-seed corridorMaze wander 2+2 corpses cannot seal the exit", () => {
    const worlds = [];
    for (let seed = 0; seed < 256; seed++) {
      const world = generateSeededWorld({
        seed,
        runMode: "dungeon",
        archetype: "corridorMaze",
      });
      const wander = simulateEnemyWanderOnWorld(
        world,
        12,
        createSeededRng(seed + 99),
      );
      worlds.push({
        ...world,
        spawns: wander.spawns,
      });
    }
    assertJointCutSuite("wander", worlds);
  });

  it("64-seed Boss Rush destack 2+2 corpses cannot seal the exit", () => {
    const worlds = [];
    for (let seed = 0; seed < 64; seed++) {
      const world = generateSeededBossRushRoom(seed);
      const destack = simulateBattleStartOnWorld(world);
      worlds.push({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      });
    }
    assertJointCutSuite("bossRush", worlds);
  });

  it("64-seed rest-exit destack 2+2 corpses cannot seal the exit", () => {
    const worlds = [];
    for (let seed = 0; seed < 64; seed++) {
      const world = simulateRestExitEncounter(seed, "dungeon");
      const destack = simulateBattleStartOnWorld(world);
      worlds.push({
        ...world,
        playerSpawn: destack.playerSpawn,
        spawns: destack.spawns,
      });
    }
    assertJointCutSuite("rest-exit", worlds);
  });
});
