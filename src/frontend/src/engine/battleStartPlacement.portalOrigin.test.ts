import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { findBattleStartCell } from "./battleStartPlacement.ts";
import {
  generateSeededSanctuary,
  generateSeededWorld,
  reportWorld,
} from "./mapGen.simulate.ts";
import {
  applySanctuaryLayout,
  attachWhitePortalAfterLegalize,
  evaluateSolvability,
} from "./mapGen.ts";
import { type OccupancyContext, occKey } from "./occupancy.ts";

function island(
  walkable: { x: number; y: number }[],
  occupied: Set<string> = new Set(),
  extras: {
    barriers?: Set<string>;
    voidTiles?: Set<string>;
    portals?: Set<string>;
  } = {},
): OccupancyContext {
  const tiles: boolean[][] = Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => false),
  );
  for (const c of walkable) tiles[c.y][c.x] = true;
  return {
    tiles,
    barriers: extras.barriers ?? new Set(),
    voidTiles: extras.voidTiles ?? new Set(),
    portals: extras.portals ?? new Set(),
    isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
  };
}

describe("findBattleStartCell from a portal-seeded origin", () => {
  it("seed-portal-origin-empty: destacks onto the larger fight island", () => {
    // 1-wide corridor. Origin sits ON the gate (white sanctuary spawn).
    // Left of the gate: 2 floors. Right: 3 floors. Flooding the portal
    // cell used to return an empty component, so destack was a no-op and
    // the player stayed on a battle wall.
    const walkable = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ];
    const ctx = island(walkable, new Set(), { portals: new Set(["3,1"]) });
    const cell = findBattleStartCell(
      { x: 3, y: 1 },
      [{ x: 3, y: 1, minDist: 1 }],
      1,
      ctx,
    );
    assert.ok(cell, "portal-seeded destack must find a fight-graph floor");
    assert.notEqual(occKey(cell.x, cell.y), "3,1");
    assert.equal(
      cell.x > 3,
      true,
      "must prefer the 3-tile right island over the 2-tile left",
    );
    assert.equal(cell.y, 1);
  });

  it("seed-portal-origin-far-crumb: a 2-tile far island cannot win destack", () => {
    // Large room (6,6)–(10,10), portal origin (3,8), 2-tile far crumb
    // (0,8)–(1,8) plus a 1-tile near step (4,8) into the room.
    const main: { x: number; y: number }[] = [];
    for (let x = 6; x <= 10; x++) {
      for (let y = 6; y <= 10; y++) main.push({ x, y });
    }
    const walkable = [
      ...main,
      { x: 4, y: 8 },
      { x: 5, y: 8 },
      { x: 3, y: 8 },
      { x: 2, y: 8 },
      { x: 1, y: 8 },
      { x: 0, y: 8 },
    ];
    const cell = findBattleStartCell(
      { x: 3, y: 8 },
      [{ x: 3, y: 8, minDist: 1 }],
      1,
      island(walkable, new Set(), { portals: new Set(["3,8"]) }),
    );
    assert.ok(cell);
    assert.notEqual(occKey(cell.x, cell.y), "0,8");
    assert.notEqual(occKey(cell.x, cell.y), "1,8");
    assert.notEqual(occKey(cell.x, cell.y), "2,8");
    assert.ok(
      cell.x >= 4 && cell.x <= 10 && cell.y >= 6 && cell.y <= 10,
      `destack landed on ${cell.x},${cell.y} (must stay on the large room)`,
    );
  });

  it("seed-portal-origin-walled: no adjacent floor still returns null", () => {
    const cell = findBattleStartCell(
      { x: 2, y: 2 },
      [{ x: 2, y: 2, minDist: 1 }],
      1,
      island([{ x: 2, y: 2 }], new Set(), { portals: new Set(["2,2"]) }),
    );
    assert.equal(cell, null);
  });
});

describe("white gateway spawn destacks onto the fight graph", () => {
  it("seed-white-split-destack: player leaves the gateway for the large island", () => {
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => "wall"),
    );
    for (let x = 4; x <= 12; x++) tiles[8][x] = "floor";
    tiles[8][4] = "portal";
    const map = {
      tiles,
      portals: [{ x: 4, y: 8, color: "black" as const }],
    };
    const applied = attachWhitePortalAfterLegalize(
      map,
      [{ x: 12, y: 8, id: "rat" }],
      { x: 8, y: 8 },
      WORLD_GRID_SIZE,
      { x: 0, y: 0, color: "white" as const, isWhitePortal: true },
    );
    const white = map.portals.find((p) => p.isWhitePortal);
    assert.ok(white);
    assert.equal(white?.x, applied.spawn.x);
    assert.equal(white?.y, applied.spawn.y);

    const occTiles = map.tiles.map((row) =>
      (row ?? []).map((t) => t !== "wall"),
    );
    const portals = new Set(map.portals.map((p) => `${p.x},${p.y}`));
    const occupied = new Set(applied.roster.map((s) => `${s.x},${s.y}`));
    const ctx: OccupancyContext = {
      tiles: occTiles,
      barriers: new Set(),
      voidTiles: new Set(),
      portals,
      isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
    };
    const destack = findBattleStartCell(
      applied.spawn,
      [
        { x: applied.spawn.x, y: applied.spawn.y, minDist: 1 },
        ...applied.roster.map((s) => ({ x: s.x, y: s.y, minDist: 2 })),
      ],
      1,
      ctx,
    );
    assert.ok(destack, "white-gateway destack must leave the portal tile");
    assert.notEqual(`${destack.x},${destack.y}`, `${white?.x},${white?.y}`);
    assert.equal(
      destack.x > applied.spawn.x,
      true,
      "player must join the larger (right) fight island",
    );
    const after = evaluateSolvability(
      map.tiles,
      new Set(),
      destack,
      map.portals,
      applied.roster,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(after.playerSpawnLegal, true);
  });
});

describe("sanctuary white-gateway destack across seeds", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("steps the player off the white tile onto a legal fight floor", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const world = generateSeededSanctuary(seed);
      const white = world.portals.find((p) => p.isWhitePortal);
      if (
        !white ||
        white.x !== world.playerSpawn.x ||
        white.y !== world.playerSpawn.y
      ) {
        failures.push(`seed ${seed} white not on spawn`);
        continue;
      }
      const occTiles = world.tiles.map((row) =>
        (row ?? []).map((t) => t !== "wall"),
      );
      const portals = new Set(world.portals.map((p) => `${p.x},${p.y}`));
      const occupied = new Set(world.spawns.map((s) => `${s.x},${s.y}`));
      const ctx: OccupancyContext = {
        tiles: occTiles,
        barriers: new Set(),
        voidTiles: world.voidTiles,
        portals,
        isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
      };
      const destack = findBattleStartCell(
        world.playerSpawn,
        [{ x: world.playerSpawn.x, y: world.playerSpawn.y, minDist: 1 }],
        1,
        ctx,
      );
      if (!destack) {
        failures.push(`seed ${seed} destack null`);
        continue;
      }
      if (destack.x === white.x && destack.y === white.y) {
        failures.push(`seed ${seed} stayed on gateway`);
        continue;
      }
      const report = reportWorld(
        {
          ...world,
          playerSpawn: destack,
          spawns: [],
        },
        { allowSpawnOnPortal: false },
      );
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("keeps dungeon-complete white+roster destack solvable across seeds", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const raw = generateSeededWorld({
        seed,
        runMode: "none",
      });
      const map = {
        tiles: raw.tiles.map((row) => row.slice()),
        portals: raw.portals.map((p) => ({ ...p })),
        voidTiles: raw.voidTiles,
      };
      const applied = attachWhitePortalAfterLegalize(
        map,
        raw.spawns.map((s) => ({ ...s })),
        raw.playerSpawn,
        WORLD_GRID_SIZE,
        {
          x: 0,
          y: 0,
          color: "white" as const,
          isWhitePortal: true,
        },
      );
      const occTiles = map.tiles.map((row) =>
        (row ?? []).map((t) => t !== "wall"),
      );
      const portals = new Set(map.portals.map((p) => `${p.x},${p.y}`));
      const occupied = new Set(applied.roster.map((s) => `${s.x},${s.y}`));
      const ctx: OccupancyContext = {
        tiles: occTiles,
        barriers: new Set(),
        voidTiles: raw.voidTiles,
        portals,
        isOccupied: (c) => occupied.has(occKey(c.x, c.y)),
      };
      const destack = findBattleStartCell(
        applied.spawn,
        [
          { x: applied.spawn.x, y: applied.spawn.y, minDist: 1 },
          ...applied.roster.map((s) => ({ x: s.x, y: s.y, minDist: 2 })),
        ],
        1,
        ctx,
      );
      if (!destack) {
        failures.push(`seed ${seed} destack null`);
        continue;
      }
      const report = evaluateSolvability(
        map.tiles,
        raw.voidTiles,
        destack,
        map.portals,
        applied.roster,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
      // Isolated hostiles on the small side of the white cut are #548.
      // This pass only requires destack to land on a legal floor.
      if (!report.playerSpawnLegal || report.outOfBounds > 0) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
      if (portals.has(`${destack.x},${destack.y}`)) {
        failures.push(`seed ${seed} destack on portal`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("empty-roster sanctuary layout destack stays in-bounds", () => {
    const failures: string[] = [];
    for (const seed of seeds.slice(0, 64)) {
      const world = generateSeededWorld({ seed, runMode: "none" });
      const map = {
        tiles: world.tiles,
        portals: world.portals,
        voidTiles: world.voidTiles,
      };
      const applied = applySanctuaryLayout(
        map,
        world.playerSpawn,
        WORLD_GRID_SIZE,
        {
          x: world.playerSpawn.x,
          y: world.playerSpawn.y,
          color: "white" as const,
          isWhitePortal: true,
        },
      );
      const occTiles = map.tiles.map((row) =>
        (row ?? []).map((t) => t !== "wall"),
      );
      const ctx: OccupancyContext = {
        tiles: occTiles,
        barriers: new Set(),
        voidTiles: world.voidTiles,
        portals: new Set(map.portals.map((p) => `${p.x},${p.y}`)),
        isOccupied: () => false,
      };
      const destack = findBattleStartCell(
        applied.spawn,
        [{ x: applied.spawn.x, y: applied.spawn.y, minDist: 1 }],
        1,
        ctx,
      );
      if (!destack) {
        failures.push(`seed ${seed} destack null`);
        continue;
      }
      if (
        destack.x < 0 ||
        destack.y < 0 ||
        destack.x >= WORLD_GRID_SIZE ||
        destack.y >= WORLD_GRID_SIZE
      ) {
        failures.push(`seed ${seed} oob`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
