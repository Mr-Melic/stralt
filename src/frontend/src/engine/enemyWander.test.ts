import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ENEMY_MOVE_INTERVAL_MAX,
  ENEMY_MOVE_INTERVAL_MIN,
  WORLD_GRID_SIZE,
} from "../data/gameConstants.ts";
import {
  WANDER_TARGET_ATTEMPTS,
  type WanderStepEnemy,
  advanceEnemyWander,
  pickRandomWanderTarget,
  rollEnemyWanderDelay,
  shouldTickEnemyWander,
  wanderFacingFromStep,
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

function wanderer(
  partial: Partial<WanderStepEnemy> &
    Pick<WanderStepEnemy, "x" | "y" | "isMoving">,
): WanderStepEnemy {
  return {
    currentView: "front",
    movementPath: [],
    nextMoveTime: 0,
    isWandering: true,
    ...partial,
  };
}

const eastPath = [
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
];

describe("wanderFacingFromStep", () => {
  it("maps cardinal deltas and keeps fallback on a zero-length step", () => {
    assert.equal(
      wanderFacingFromStep({ x: 0, y: 0 }, { x: 1, y: 0 }, "front"),
      "right",
    );
    assert.equal(
      wanderFacingFromStep({ x: 2, y: 0 }, { x: 1, y: 0 }, "front"),
      "left",
    );
    assert.equal(
      wanderFacingFromStep({ x: 0, y: 0 }, { x: 0, y: 1 }, "left"),
      "front",
    );
    assert.equal(
      wanderFacingFromStep({ x: 0, y: 2 }, { x: 0, y: 1 }, "left"),
      "back",
    );
    assert.equal(
      wanderFacingFromStep({ x: 3, y: 3 }, { x: 3, y: 3 }, "back"),
      "back",
    );
  });
});

describe("rollEnemyWanderDelay", () => {
  it("uses the same min/max interval WorldExploration used inline", () => {
    assert.equal(
      rollEnemyWanderDelay(() => 0),
      ENEMY_MOVE_INTERVAL_MIN,
    );
    assert.equal(
      rollEnemyWanderDelay(() => 1),
      ENEMY_MOVE_INTERVAL_MAX,
    );
    assert.equal(
      rollEnemyWanderDelay(() => 0.5),
      3_500,
    );
  });
});

describe("advanceEnemyWander", () => {
  it("leaves a mid-step mover unchanged until elapsed crosses the next index", () => {
    const enemy = wanderer({
      x: 1,
      y: 0,
      isMoving: true,
      movementPath: eastPath,
      currentStepIndex: 0,
      movementStartTime: 1_000,
      movementSpeed: 900,
    });
    const result = advanceEnemyWander(enemy, {
      now: 1_299,
      pickTarget: () => {
        throw new Error("idle pick must not run while moving");
      },
      findPath: () => {
        throw new Error("findPath must not run while moving");
      },
      rng: () => {
        throw new Error("delay rng must not run mid-step");
      },
    });
    assert.equal(result.changed, false);
    assert.equal(result.enemy, enemy);
    assert.equal(result.enemy.x, 1);
    assert.equal(result.enemy.currentStepIndex, 0);
  });

  it("advances position and facing when elapsed crosses the next path index", () => {
    const enemy = wanderer({
      x: 1,
      y: 0,
      isMoving: true,
      currentView: "front",
      movementPath: eastPath,
      currentStepIndex: 0,
      movementStartTime: 1_000,
      movementSpeed: 900,
      assignedName: "Malachar",
    } as WanderStepEnemy & { assignedName: string });
    const result = advanceEnemyWander(enemy, {
      now: 1_300,
      pickTarget: () => null,
      findPath: () => [],
      rng: () => {
        throw new Error("delay rng must not run on a path step");
      },
    });
    assert.equal(result.changed, true);
    assert.equal(result.enemy.x, 2);
    assert.equal(result.enemy.y, 0);
    assert.equal(result.enemy.currentView, "right");
    assert.equal(result.enemy.currentStepIndex, 1);
    assert.equal(result.enemy.isMoving, true);
    assert.equal(
      (result.enemy as WanderStepEnemy & { assignedName: string }).assignedName,
      "Malachar",
    );
  });

  it("does not rewrite facing from path[0] when the first visible index is 0", () => {
    const enemy = wanderer({
      x: 0,
      y: 0,
      isMoving: true,
      currentView: "back",
      movementPath: eastPath,
      currentStepIndex: -1,
      movementStartTime: 1_000,
      movementSpeed: 900,
    });
    const result = advanceEnemyWander(enemy, {
      now: 1_000,
      pickTarget: () => null,
      findPath: () => [],
    });
    assert.equal(result.changed, true);
    assert.equal(result.enemy.currentStepIndex, 0);
    assert.equal(result.enemy.x, 1);
    assert.equal(result.enemy.currentView, "back");
  });

  it("snaps to the last cell, clears the path, and schedules the delay on complete", () => {
    const { rng, calls } = countingRng([0.5]);
    const enemy = wanderer({
      x: 2,
      y: 0,
      isMoving: true,
      movementPath: eastPath,
      currentStepIndex: 2,
      movementStartTime: 1_000,
      movementSpeed: 900,
      wanderTarget: { x: 3, y: 0 },
    });
    const result = advanceEnemyWander(enemy, {
      now: 1_900,
      pickTarget: () => {
        throw new Error("complete must not pick a new target");
      },
      findPath: () => {
        throw new Error("complete must not pathfind");
      },
      rng,
    });
    assert.equal(result.changed, true);
    assert.equal(calls(), 1);
    assert.deepEqual(result.enemy, {
      ...enemy,
      x: 3,
      y: 0,
      isMoving: false,
      movementPath: [],
      currentStepIndex: 0,
      nextMoveTime: 1_900 + 3_500,
      lastMoveTime: 1_900,
      wanderTarget: null,
    });
  });

  it("starts a move when due, a target exists, and findPath returns a path", () => {
    const target = { x: 4, y: 1 };
    const path = [
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ];
    const enemy = wanderer({
      x: 2,
      y: 1,
      isMoving: false,
      nextMoveTime: 5_000,
      movementRange: 2,
    });
    let pickCalls = 0;
    let pathCalls = 0;
    const result = advanceEnemyWander(enemy, {
      now: 5_000,
      pickTarget: (unit) => {
        pickCalls += 1;
        assert.equal(unit.x, 2);
        assert.equal(unit.y, 1);
        return target;
      },
      findPath: (from, to) => {
        pathCalls += 1;
        assert.deepEqual(from, { x: 2, y: 1 });
        assert.deepEqual(to, target);
        return path;
      },
      rng: () => {
        throw new Error("successful start-move must not consume delay rng");
      },
    });
    assert.equal(result.changed, true);
    assert.equal(pickCalls, 1);
    assert.equal(pathCalls, 1);
    assert.equal(result.enemy.isMoving, true);
    assert.deepEqual(result.enemy.movementPath, path);
    assert.equal(result.enemy.currentStepIndex, 0);
    assert.equal(result.enemy.movementStartTime, 5_000);
    assert.deepEqual(result.enemy.wanderTarget, target);
    assert.equal(result.enemy.x, 2);
    assert.equal(result.enemy.y, 1);
  });

  it("reschedules when due but pickTarget returns null", () => {
    const { rng, calls } = countingRng([0]);
    const enemy = wanderer({
      x: 2,
      y: 2,
      isMoving: false,
      nextMoveTime: 4_000,
    });
    const result = advanceEnemyWander(enemy, {
      now: 4_100,
      pickTarget: () => null,
      findPath: () => {
        throw new Error("null target must not pathfind");
      },
      rng,
    });
    assert.equal(result.changed, true);
    assert.equal(calls(), 1);
    assert.equal(result.enemy.nextMoveTime, 4_100 + ENEMY_MOVE_INTERVAL_MIN);
    assert.equal(result.enemy.isMoving, false);
  });

  it("reschedules when due but findPath returns an empty path", () => {
    const { rng, calls } = countingRng([1]);
    const enemy = wanderer({
      x: 5,
      y: 5,
      isMoving: false,
      nextMoveTime: 1,
    });
    const result = advanceEnemyWander(enemy, {
      now: 10,
      pickTarget: () => ({ x: 6, y: 5 }),
      findPath: () => [],
      rng,
    });
    assert.equal(result.changed, true);
    assert.equal(calls(), 1);
    assert.equal(result.enemy.nextMoveTime, 10 + ENEMY_MOVE_INTERVAL_MAX);
    assert.equal(result.enemy.isMoving, false);
    assert.equal(result.enemy.wanderTarget, undefined);
  });

  it("does not start a wander when idle and not yet due", () => {
    const enemy = wanderer({
      x: 8,
      y: 8,
      isMoving: false,
      isWandering: true,
      nextMoveTime: 9_000,
    });
    const result = advanceEnemyWander(enemy, {
      now: 8_999,
      pickTarget: () => {
        throw new Error("not-due idle must not pick");
      },
      findPath: () => {
        throw new Error("not-due idle must not pathfind");
      },
    });
    assert.equal(result.changed, false);
    assert.equal(result.enemy, enemy);
  });

  it("does not start a wander when isWandering is falsy even if due", () => {
    const enemy = wanderer({
      x: 1,
      y: 1,
      isMoving: false,
      isWandering: false,
      nextMoveTime: 0,
    });
    const result = advanceEnemyWander(enemy, {
      now: 50,
      pickTarget: () => {
        throw new Error("parked enemy must not pick");
      },
      findPath: () => [],
    });
    assert.equal(result.changed, false);
    assert.equal(result.enemy, enemy);
  });
});
