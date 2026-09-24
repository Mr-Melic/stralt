import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { generateSeededWorld, reportWorld } from "./mapGen.simulate.ts";
import {
  applyFinalizedLayout,
  applySanctuaryLayout,
  attachWhitePortalAfterLegalize,
  evaluateSolvability,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

function eastWestCorridor(): string[][] {
  const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => W),
  );
  for (let x = 4; x <= 12; x++) tiles[8][x] = F;
  tiles[8][4] = "portal";
  return tiles;
}

function colocateWhiteOnly<P extends { x: number; y: number }>(
  map: { tiles: string[][]; portals: P[] },
  spawn: { x: number; y: number },
  whitePortal: P,
): void {
  const placed: P = { ...whitePortal, x: spawn.x, y: spawn.y };
  map.portals.push(placed);
  if (map.tiles[spawn.y]) map.tiles[spawn.y][spawn.x] = "portal";
}

describe("white gateway split after dungeon-complete attach", () => {
  it("seed-white-split-small-side: relocates a rat on the smaller fight island", () => {
    // 1-wide corridor, black exit at (4,8), spawn at (8,8). Left of spawn
    // is 3 floors; right is 4. #444's (12,8) rat already sits on the
    // larger island so evaluateSolvability passes without re-legalize.
    // A rat at (5,8) is battle-isolated once the white gateway stamps
    // spawn — melee cannot walk a portal.
    const tiles = eastWestCorridor();
    const beforeMap = {
      tiles: tiles.map((row) => row.slice()),
      portals: [{ x: 4, y: 8, color: "black" as const }],
    };
    const first = applyFinalizedLayout(
      beforeMap,
      [{ x: 5, y: 8, id: "rat" }],
      { x: 8, y: 8 },
      WORLD_GRID_SIZE,
    );
    colocateWhiteOnly(beforeMap, first.spawn, {
      x: 0,
      y: 0,
      color: "white" as const,
      isWhitePortal: true,
    });
    const before = evaluateSolvability(
      beforeMap.tiles,
      new Set(),
      first.spawn,
      beforeMap.portals,
      first.roster,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
      { allowSpawnOnPortal: true },
    );
    assert.equal(
      before.enemiesReachable,
      false,
      "fixture must start battle-isolated on the smaller side",
    );
    assert.equal(before.clearingUnlocks, false);

    const map = {
      tiles: eastWestCorridor(),
      portals: [{ x: 4, y: 8, color: "black" as const }],
    };
    const applied = attachWhitePortalAfterLegalize(
      map,
      [{ x: 5, y: 8, id: "rat" }],
      { x: 8, y: 8 },
      WORLD_GRID_SIZE,
      { x: 0, y: 0, color: "white" as const, isWhitePortal: true },
    );
    const white = map.portals.find((p) => p.isWhitePortal);
    assert.ok(white);
    assert.equal(white?.x, applied.spawn.x);
    assert.equal(white?.y, applied.spawn.y);
    const after = evaluateSolvability(
      map.tiles,
      new Set(),
      applied.spawn,
      map.portals,
      applied.roster,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
      { allowSpawnOnPortal: true },
    );
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(
      applied.roster[0].x > applied.spawn.x,
      true,
      "hostile must sit on the larger fight island, not past the gateway",
    );
  });

  it("seed-white-split-two-sides: destacks opposite-side rats onto one fight graph", () => {
    const tiles = eastWestCorridor();
    const beforeMap = {
      tiles: tiles.map((row) => row.slice()),
      portals: [{ x: 4, y: 8, color: "black" as const }],
    };
    const first = applyFinalizedLayout(
      beforeMap,
      [
        { x: 5, y: 8, id: "a" },
        { x: 12, y: 8, id: "b" },
      ],
      { x: 8, y: 8 },
      WORLD_GRID_SIZE,
    );
    colocateWhiteOnly(beforeMap, first.spawn, {
      x: 0,
      y: 0,
      color: "white" as const,
      isWhitePortal: true,
    });
    const before = evaluateSolvability(
      beforeMap.tiles,
      new Set(),
      first.spawn,
      beforeMap.portals,
      first.roster,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
      { allowSpawnOnPortal: true },
    );
    assert.ok(
      before.isolatedEnemies >= 1,
      "one rat must start cut off by the gateway",
    );

    const map = {
      tiles: eastWestCorridor(),
      portals: [{ x: 4, y: 8, color: "black" as const }],
    };
    const applied = attachWhitePortalAfterLegalize(
      map,
      [
        { x: 5, y: 8, id: "a" },
        { x: 12, y: 8, id: "b" },
      ],
      { x: 8, y: 8 },
      WORLD_GRID_SIZE,
      { x: 0, y: 0, color: "white" as const, isWhitePortal: true },
    );
    const after = evaluateSolvability(
      map.tiles,
      new Set(),
      applied.spawn,
      map.portals,
      applied.roster,
      WORLD_GRID_SIZE,
      WORLD_GRID_SIZE,
      { allowSpawnOnPortal: true },
    );
    assert.equal(after.ok, true, after.failures.join(","));
    assert.equal(after.stackedEnemies, 0);
    const keys = applied.roster.map((s) => `${s.x},${s.y}`);
    assert.equal(new Set(keys).size, 2);
    assert.equal(
      applied.roster.every((s) => s.x > applied.spawn.x),
      true,
      "both hostiles must share the larger fight island",
    );
  });
});

describe("dungeon-complete white attach across seeds", () => {
  const seeds = Array.from({ length: 256 }, (_, i) => 1000 + i * 17);

  it("keeps hostiles engageable after unfinalized generate + white gateway", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
      const raw = generateSeededWorld({
        seed,
        runMode: "none",
        finalize: false,
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
      const report = evaluateSolvability(
        map.tiles,
        raw.voidTiles,
        applied.spawn,
        map.portals,
        applied.roster,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
        { allowSpawnOnPortal: true },
      );
      if (!report.ok || report.stackedEnemies > 0) {
        failures.push(
          `seed ${seed} ${raw.archetype}: ${report.failures.join(",")}`,
        );
      }
      const white = map.portals.find((p) => p.isWhitePortal);
      if (
        !white ||
        white.x !== applied.spawn.x ||
        white.y !== applied.spawn.y
      ) {
        failures.push(`seed ${seed} white not on legalized spawn`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });

  it("sanctuary empty-roster maps stay a legal route", () => {
    const failures: string[] = [];
    for (const seed of seeds) {
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
      const report = reportWorld(
        {
          ...world,
          tiles: map.tiles,
          portals: map.portals,
          playerSpawn: applied.spawn,
          spawns: [],
        },
        { allowSpawnOnPortal: true },
      );
      if (!report.ok) {
        failures.push(`seed ${seed}: ${report.failures.join(",")}`);
      }
      const white = map.portals.find((p) => p.isWhitePortal);
      if (
        !white ||
        white.x !== applied.spawn.x ||
        white.y !== applied.spawn.y
      ) {
        failures.push(`seed ${seed} sanctuary white not on legalized spawn`);
      }
    }
    assert.equal(failures.length, 0, failures.slice(0, 8).join(" | "));
  });
});
