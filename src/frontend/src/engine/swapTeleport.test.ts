import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAbortMovementRaf } from "../utils/recapWorldInput.ts";
import {
  abortInFlightWalkAfterSwap,
  leftoverWalkOverridesSwap,
  resolveSwapTeleport,
  sameSwapTile,
} from "./swapTeleport.ts";

describe("resolveSwapTeleport", () => {
  it("sends the enemy to the live caster tile, not the walk-start snapshot", () => {
    const walkStart = { x: 4, y: 8 };
    const liveAfterFirstStep = { x: 5, y: 8 };
    const enemy = { x: 7, y: 8 };
    const live = resolveSwapTeleport({
      livePlayerPos: liveAfterFirstStep,
      targetPos: enemy,
    });
    const stale = resolveSwapTeleport({
      livePlayerPos: walkStart,
      targetPos: enemy,
    });
    assert.deepEqual(live.playerDest, enemy);
    assert.deepEqual(live.enemyDest, liveAfterFirstStep);
    assert.equal(sameSwapTile(stale.enemyDest, walkStart), true);
    assert.equal(sameSwapTile(live.enemyDest, stale.enemyDest), false);
  });

  it("is a no-op teleport when the live tile already matches the target", () => {
    const tile = { x: 3, y: 3 };
    const swapped = resolveSwapTeleport({
      livePlayerPos: tile,
      targetPos: tile,
    });
    assert.deepEqual(swapped.playerDest, tile);
    assert.deepEqual(swapped.enemyDest, tile);
  });
});

describe("leftoverWalkOverridesSwap", () => {
  it("proves the MP-walk path dest overwrites the swapped player tile", () => {
    const swapped = resolveSwapTeleport({
      livePlayerPos: { x: 5, y: 8 },
      targetPos: { x: 7, y: 8 },
    });
    const leftoverPathDest = { x: 6, y: 8 };
    assert.equal(
      leftoverWalkOverridesSwap(swapped.playerDest, leftoverPathDest),
      true,
    );
    assert.equal(
      leftoverWalkOverridesSwap(swapped.playerDest, swapped.playerDest),
      false,
    );
  });
});

describe("abortInFlightWalkAfterSwap", () => {
  it("always bumps movementGen so leftover rAF hits shouldAbortMovementRaf", () => {
    const abort = abortInFlightWalkAfterSwap(4);
    assert.equal(abort.nextMovementGen, 5);
    assert.equal(abort.isMoving, false);
    assert.deepEqual(abort.movementPath, []);
    assert.equal(abort.currentStepIndex, 0);
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: false,
        movementGen: abort.nextMovementGen,
        loopGen: 4,
      }),
      true,
    );
  });

  it("still bumps when the player is already stationary (gen 0)", () => {
    const abort = abortInFlightWalkAfterSwap(0);
    assert.equal(abort.nextMovementGen, 1);
    assert.equal(abort.isMoving, false);
  });
});
