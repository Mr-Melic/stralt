import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import {
  WANDER_TARGET_ATTEMPTS,
  pickRandomWanderTarget,
  shouldTickEnemyWander,
} from "./enemyWander.ts";
import { MAP_SPAWN_CELL } from "./spawnPolicy.ts";

const W = "wall";
const F = "floor";
const P = "portal";

function seqRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i];
    i += 1;
    if (v === undefined) throw new Error(`rng exhausted at call ${i}`);
    return v;
  };
}

/** Mid-bucket rng values that yield independent axis deltas in [-range, range]. */
function rngForDeltas(
  range: number,
  pairs: readonly (readonly [number, number])[],
): number[] {
  const span = range * 2 + 1;
  const values: number[] = [];
  for (const [dx, dy] of pairs) {
    values.push((dx + range + 0.5) / span);
    values.push((dy + range + 0.5) / span);
  }
  return values;
}

function countingRng(values: number[]): {
  rng: () => number;
  calls: () => number;
} {
  let i = 0;
  return {
    rng: () => {
      const v = values[i];
      i += 1;
      if (v === undefined) throw new Error(`rng exhausted at call ${i}`);
      return v;
    },
    calls: () => i,
  };
}

/** 7×3 corridor split by a portal — same shape as mapGen seed-wander-across-portal. */
function portalChokeTiles(): string[][] {
  return [
    [W, W, W, W, W, W, W],
    [W, F, F, P, F, F, W],
    [W, W, W, W, W, W, W],
  ];
}

function openFloor(): string[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => F),
  );
}

describe("shouldTickEnemyWander", () => {
  it("skips the update when every enemy is idle and not due", () => {
    assert.equal(
      shouldTickEnemyWander(
        [
          { isMoving: false, isWandering: true, nextMoveTime: 2_000 },
          { isMoving: false, isWandering: true, nextMoveTime: 3_000 },
        ],
        1_000,
      ),
      false,
    );
  });

  it("ticks when at least one enemy is mid-path", () => {
    assert.equal(
      shouldTickEnemyWander(
        [
          { isMoving: false, isWandering: true, nextMoveTime: 2_000 },
          { isMoving: true, isWandering: true, nextMoveTime: 5_000 },
        ],
        1_000,
      ),
      true,
    );
  });

  it("ticks when a wandering enemy reaches nextMoveTime", () => {
    assert.equal(
      shouldTickEnemyWander(
        [{ isMoving: false, isWandering: true, nextMoveTime: 1_000 }],
        1_000,
      ),
      true,
    );
  });

  it("does not treat a missing nextMoveTime as due", () => {
    assert.equal(
      shouldTickEnemyWander([{ isMoving: false, isWandering: true }], 9_999),
      false,
    );
  });
});

describe("pickRandomWanderTarget", () => {
  it("accepts a same-side floor next to a portal (not spawn keep-clear)", () => {
    const picked = pickRandomWanderTarget(portalChokeTiles(), 1, 1, 2, {
      portals: [{ x: 3, y: 1 }],
      gridWidth: 7,
      gridHeight: 3,
      rng: seqRng(rngForDeltas(2, [[1, 0]])),
    });
    assert.deepEqual(picked, { x: 2, y: 1 });
  });

  it("rejects a Chebyshev pick beyond a portal choke", () => {
    const picked = pickRandomWanderTarget(portalChokeTiles(), 1, 1, 4, {
      portals: [{ x: 3, y: 1 }],
      gridWidth: 7,
      gridHeight: 3,
      attempts: 1,
      rng: seqRng(rngForDeltas(4, [[4, 0]])),
    });
    assert.equal(picked, null);
  });

  it("skips the origin then takes the next legal cell", () => {
    const { rng, calls } = countingRng(
      rngForDeltas(1, [
        [0, 0],
        [1, 0],
      ]),
    );
    const picked = pickRandomWanderTarget(portalChokeTiles(), 1, 1, 1, {
      portals: [{ x: 3, y: 1 }],
      gridWidth: 7,
      gridHeight: 3,
      rng,
    });
    assert.deepEqual(picked, { x: 2, y: 1 });
    assert.equal(calls(), 4);
  });

  it("rejects walls", () => {
    const picked = pickRandomWanderTarget(portalChokeTiles(), 1, 1, 1, {
      portals: [{ x: 3, y: 1 }],
      gridWidth: 7,
      gridHeight: 3,
      attempts: 1,
      rng: seqRng(rngForDeltas(1, [[0, -1]])),
    });
    assert.equal(picked, null);
  });

  it("rejects out-of-bounds deltas without throwing", () => {
    const picked = pickRandomWanderTarget(portalChokeTiles(), 1, 1, 2, {
      portals: [{ x: 3, y: 1 }],
      gridWidth: 7,
      gridHeight: 3,
      attempts: 1,
      rng: seqRng(rngForDeltas(2, [[-2, 0]])),
    });
    assert.equal(picked, null);
  });

  it("rejects void tiles before fight-graph lookup", () => {
    const picked = pickRandomWanderTarget(portalChokeTiles(), 1, 1, 1, {
      portals: [{ x: 3, y: 1 }],
      voidTiles: new Set(["2,1"]),
      gridWidth: 7,
      gridHeight: 3,
      attempts: 1,
      rng: seqRng(rngForDeltas(1, [[1, 0]])),
    });
    assert.equal(picked, null);
  });

  it("does not apply map-spawn keep-clear to wander targets", () => {
    const origin = { x: MAP_SPAWN_CELL.x, y: MAP_SPAWN_CELL.y - 2 };
    const picked = pickRandomWanderTarget(openFloor(), origin.x, origin.y, 3, {
      rng: seqRng(rngForDeltas(3, [[0, MAP_SPAWN_CELL.y - origin.y]])),
    });
    assert.deepEqual(picked, { x: MAP_SPAWN_CELL.x, y: MAP_SPAWN_CELL.y });
  });

  it("returns null after WANDER_TARGET_ATTEMPTS origin-only draws", () => {
    const values = rngForDeltas(
      1,
      Array.from({ length: WANDER_TARGET_ATTEMPTS }, () => [0, 0] as const),
    );
    const { rng, calls } = countingRng(values);
    const picked = pickRandomWanderTarget(openFloor(), 8, 8, 1, { rng });
    assert.equal(picked, null);
    assert.equal(calls(), WANDER_TARGET_ATTEMPTS * 2);
  });
});
