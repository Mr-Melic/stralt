import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { simulateCorpsesOnWorld } from "./mapGen.simulate.ts";
import {
  MAP_ARCHETYPES,
  countProgressionDumpCells,
  evaluateSolvability,
  finalizePlayableLayout,
} from "./mapGen.ts";

const W = "wall";
const F = "floor";

describe("progression alcove stays on the fight graph", () => {
  it("seed-portal-cut-far-dump: far-side floors must not skip the near alcove", () => {
    // 1-wide near corridor, portal choke, far room. Overworld dump used to
    // count (4,1)/(5,1) so ensureProgressionAlcove no-oped; a corpse on
    // the unique near bridge then teleported through the gate or sealed it.
    const tiles = [
      [W, W, W, W, W, W, W],
      [W, F, F, "portal", F, F, W],
      [W, W, W, W, W, W, W],
    ];
    const spawn = { x: 1, y: 1 };
    const portals = [{ x: 3, y: 1 }];
    const before = countProgressionDumpCells(
      tiles,
      new Set(),
      spawn,
      portals,
      7,
      3,
    );
    assert.ok(before.mandatory > 0, "near cell (2,1) is a unique bridge");
    assert.equal(
      before.dump,
      0,
      "far-side floors are not battle-reachable dump cells",
    );
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: spawn,
      portals,
      spawns: [],
      w: 7,
      h: 3,
    });
    const afterCounts = countProgressionDumpCells(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      7,
      3,
    );
    assert.ok(
      afterCounts.dump > 0,
      "must punch a near-side alcove, not treat the far room as dump",
    );
    assert.equal(
      finalized.tiles[1][4],
      F,
      "must not wall the far-side floor (aesthetics)",
    );
    assert.equal(
      finalized.tiles[1][5],
      F,
      "must not wall the far-side floor (aesthetics)",
    );
    const portalX = finalized.portals[0]?.x ?? 3;
    const nearAlcove = [
      finalized.tiles[0]?.[1],
      finalized.tiles[0]?.[2],
      finalized.tiles[2]?.[1],
      finalized.tiles[2]?.[2],
      finalized.tiles[1]?.[0],
    ].some((t) => t === F);
    assert.equal(
      nearAlcove,
      true,
      "alcove must sit on the player's side of the gate",
    );
    for (let y = 0; y < 3; y++) {
      for (let x = portalX + 1; x < 7; x++) {
        if (y === 1) continue;
        assert.equal(
          finalized.tiles[y][x],
          W,
          `must not punch a far-side alcove at ${x},${y}`,
        );
      }
    }
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      7,
      3,
    );
    assert.equal(after.ok, true, after.failures.join(","));
    const occ = simulateCorpsesOnWorld({
      tiles: finalized.tiles,
      voidTiles: new Set(),
      portals: finalized.portals.map((p) => ({
        x: p.x,
        y: p.y,
        color: "progression",
      })),
      playerSpawn: finalized.playerSpawn,
      spawns: [],
      runMode: "dungeon",
      archetype: MAP_ARCHETYPES[0].type,
      seed: 0,
    });
    assert.equal(
      occ.sealed,
      false,
      "corpses must relocate onto the near alcove",
    );
  });

  it("seed-portal-cut-parallel-punch: destack must not open a corridor around the gate", () => {
    // Near corridor with a wall that already touches the far room. Punching
    // that wall would join both sides into one fight graph and skip the lock.
    const tiles = [
      [W, W, W, F, W, W, W],
      [W, F, F, "portal", F, F, W],
      [W, W, W, W, W, W, W],
    ];
    const finalized = finalizePlayableLayout({
      tiles,
      voidTiles: new Set(),
      playerSpawn: { x: 1, y: 1 },
      portals: [{ x: 3, y: 1 }],
      spawns: [],
      w: 7,
      h: 3,
    });
    assert.equal(
      finalized.tiles[0][3],
      F,
      "pre-existing far-touching floor stays (aesthetics)",
    );
    assert.notEqual(
      finalized.tiles[0][2],
      F,
      "must not punch the wall that would join the far room around the gate",
    );
    const after = evaluateSolvability(
      finalized.tiles,
      new Set(),
      finalized.playerSpawn,
      finalized.portals,
      finalized.spawns,
      7,
      3,
    );
    assert.equal(after.ok, true, after.failures.join(","));
  });
});
