import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  attachWhitePortalAfterLegalize,
  evaluateSolvability,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

describe("white sanctuary gateway after legalize", () => {
  it("seed-white-portal-cut: relocates a rat past the new sanctuary gate", () => {
    // 1-wide east-west corridor. Colocating the white gateway on spawn
    // used to split the fight graph and leave (12,8) isolated — melee
    // cannot walk a portal, so the leftover hostile never unlocked.
    const tiles = Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => W),
    );
    for (let x = 4; x <= 12; x++) tiles[8][x] = F;
    const map = {
      tiles,
      portals: [{ x: 4, y: 8, color: "black" as const }],
    };
    tiles[8][4] = "portal";
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
    assert.equal(after.isolatedEnemies, 0, after.failures.join(","));
    assert.equal(after.clearingUnlocks, true, after.failures.join(","));
  });
});
