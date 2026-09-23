import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type OccupancyContext,
  resolveControlledSummonMoveDest,
} from "./occupancy.ts";
import {
  canExecuteSummonWalkDest,
  summonWalkDestinationOccupied,
} from "./summonControlWalk.ts";

function occupant(
  id: string,
  x: number,
  y: number,
  hp: number,
): { id: string; x: number; y: number; hp: number } {
  return { id, x, y, hp };
}

describe("summon-control walk occupancy vs player Occupied", () => {
  const playerPos = { x: 8, y: 8 };
  const living = occupant("rat", 3, 4, 20);
  const corpse = occupant("dead", 5, 5, 0);
  const wolf = occupant("wolf", 1, 1, 12);
  const occupants = [living, corpse, wolf];

  it("refuses a living dest the player walk would float Occupied", () => {
    assert.equal(
      occupants.some(
        (e) => e.x === living.x && e.y === living.y && isAliveCombatant(e),
      ),
      true,
    );
    assert.equal(
      summonWalkDestinationOccupied({
        occupants,
        tile: living,
        playerPos,
      }),
      true,
    );
    assert.equal(
      canExecuteSummonWalkDest({ occupants, tile: living, playerPos }),
      false,
      "a highlighted living dest must not execute",
    );
  });

  it("allows a corpse dest the player walk already treats as free", () => {
    assert.equal(
      occupants.some(
        (e) => e.x === corpse.x && e.y === corpse.y && isAliveCombatant(e),
      ),
      false,
    );
    assert.equal(
      summonWalkDestinationOccupied({
        occupants,
        tile: corpse,
        playerPos,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonWalkDest({ occupants, tile: corpse, playerPos }),
      true,
      "a highlighted corpse dest must be executable",
    );
  });

  it("refuses the player tile even when the player is missing from occupants", () => {
    assert.equal(
      summonWalkDestinationOccupied({
        occupants: [living],
        tile: playerPos,
        playerPos,
      }),
      true,
    );
    assert.equal(
      canExecuteSummonWalkDest({
        occupants: [living],
        tile: playerPos,
        playerPos,
      }),
      false,
    );
  });

  it("every non-occupied floor dest is executable and every occupied dest cannot execute", () => {
    const tiles = [{ x: 0, y: 0 }, living, corpse, playerPos, { x: 2, y: 3 }];
    for (const tile of tiles) {
      const occupied = summonWalkDestinationOccupied({
        occupants,
        tile,
        playerPos,
      });
      const executable = canExecuteSummonWalkDest({
        occupants,
        tile,
        playerPos,
      });
      assert.equal(
        executable,
        !occupied,
        `${tile.x},${tile.y} highlight/execute occupancy must agree`,
      );
    }
  });
});

describe("resolveControlledSummonMoveDest uses living occupancy", () => {
  const playerPos = { x: 8, y: 8 };
  const living = occupant("rat", 3, 4, 20);
  const corpse = occupant("dead", 5, 5, 0);
  const wolf = occupant("wolf", 1, 1, 12);
  const occupants = [living, corpse, wolf];
  const from = { x: 0, y: 0 };

  function ctx(): OccupancyContext {
    const tiles = Array.from({ length: 10 }, () => Array(10).fill(true));
    return {
      tiles,
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(),
      isOccupied: (c) =>
        summonWalkDestinationOccupied({
          occupants,
          tile: c,
          playerPos,
        }),
    };
  }

  it("executes a highlighted corpse dest", () => {
    assert.equal(
      canExecuteSummonWalkDest({ occupants, tile: corpse, playerPos }),
      true,
    );
    const landed = resolveControlledSummonMoveDest(from, corpse, ctx());
    assert.ok(landed, "a highlighted corpse dest must be executable");
    assert.equal(landed.x, corpse.x);
    assert.equal(landed.y, corpse.y);
  });

  it("does not execute a living dest the player walk would float Occupied", () => {
    assert.equal(
      canExecuteSummonWalkDest({ occupants, tile: living, playerPos }),
      false,
    );
    assert.equal(
      resolveControlledSummonMoveDest(from, living, ctx()),
      null,
      "an illegal living dest must not execute",
    );
  });

  it("does not execute onto the player tile", () => {
    assert.equal(
      canExecuteSummonWalkDest({ occupants, tile: playerPos, playerPos }),
      false,
    );
    assert.equal(resolveControlledSummonMoveDest(from, playerPos, ctx()), null);
  });
});
