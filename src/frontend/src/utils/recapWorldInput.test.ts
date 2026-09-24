import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldAbortMovementRaf,
  shouldBlockPortalDuringVictoryPersist,
  shouldHaltInFlightMoveDuringRecap,
  shouldHaltInFlightMoveOnLastHostile,
  shouldIgnoreWorldInputDuringRecap,
} from "./recapWorldInput.ts";

describe("shouldIgnoreWorldInputDuringRecap", () => {
  it("allows canvas input when no recap is up and no victory credit is queued", () => {
    assert.equal(shouldIgnoreWorldInputDuringRecap(false), false);
    assert.equal(shouldIgnoreWorldInputDuringRecap(false, false), false);
  });

  it("blocks canvas walk / hazard clicks while the recap is visible", () => {
    assert.equal(shouldIgnoreWorldInputDuringRecap(true), true);
    assert.equal(shouldIgnoreWorldInputDuringRecap(true, false), true);
  });

  it("blocks canvas input while a victory credit is still on the persist lock", () => {
    assert.equal(shouldIgnoreWorldInputDuringRecap(false, true), true);
    assert.equal(shouldIgnoreWorldInputDuringRecap(true, true), true);
  });

  it("does not treat a missing pending flag as a block", () => {
    assert.equal(shouldIgnoreWorldInputDuringRecap(false, undefined), false);
  });
});

describe("shouldBlockPortalDuringVictoryPersist", () => {
  it("blocks dungeon/Boss Rush portal entry while applyRewards is queued", () => {
    assert.equal(shouldBlockPortalDuringVictoryPersist(true), true);
    assert.equal(shouldBlockPortalDuringVictoryPersist(false), false);
  });

  it("still ignores canvas walk after recap dismiss when the credit is pending", () => {
    assert.equal(shouldIgnoreWorldInputDuringRecap(false, true), true);
    assert.equal(shouldBlockPortalDuringVictoryPersist(true), true);
  });
});

describe("shouldHaltInFlightMoveDuringRecap", () => {
  it("lets a live walk continue when no recap or victory credit is pending", () => {
    assert.equal(shouldHaltInFlightMoveDuringRecap(false), false);
    assert.equal(shouldHaltInFlightMoveDuringRecap(false, false), false);
  });

  it("halts a leftover MP walk once the victory recap is up", () => {
    assert.equal(shouldHaltInFlightMoveDuringRecap(true), true);
    assert.equal(shouldHaltInFlightMoveDuringRecap(true, false), true);
  });

  it("halts a leftover walk after recap dismiss while applyRewards is queued", () => {
    assert.equal(shouldHaltInFlightMoveDuringRecap(false, true), true);
  });
});

describe("shouldAbortMovementRaf", () => {
  it("kills a stale rAF generation after cleanupBattle bumps the counter", () => {
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: false,
        movementGen: 2,
        loopGen: 1,
      }),
      true,
    );
  });

  it("kills the current loop when victory persist is pending even if gens match", () => {
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: true,
        movementGen: 1,
        loopGen: 1,
      }),
      true,
    );
  });

  it("lets the matching generation keep stepping outside recap/persist", () => {
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: false,
        movementGen: 1,
        loopGen: 1,
      }),
      false,
    );
  });

  it("halts a leftover MP walk as soon as the last hostile is gone, before recap", () => {
    // Kill last hostile while a walk is mid-path. Recap / victoryPersistPending
    // are still false until the victory useEffect; lava on the next tile
    // would set deathTriggered and skip applyRewards.
    assert.equal(
      shouldHaltInFlightMoveOnLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
      }),
      true,
    );
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: false,
        movementGen: 1,
        loopGen: 1,
        inBattle: true,
        hostilesRemaining: 0,
      }),
      true,
    );
  });

  it("does not halt an in-combat walk while a hostile is still alive", () => {
    assert.equal(
      shouldHaltInFlightMoveOnLastHostile({
        inBattle: true,
        hostilesRemaining: 1,
      }),
      false,
    );
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: false,
        movementGen: 1,
        loopGen: 1,
        inBattle: true,
        hostilesRemaining: 1,
      }),
      false,
    );
  });

  it("lets post-victory overworld walks continue once inBattle is false", () => {
    assert.equal(
      shouldHaltInFlightMoveOnLastHostile({
        inBattle: false,
        hostilesRemaining: 0,
      }),
      false,
    );
    assert.equal(
      shouldAbortMovementRaf({
        recapVisible: false,
        victoryPersistPending: false,
        movementGen: 1,
        loopGen: 1,
        inBattle: false,
        hostilesRemaining: 0,
      }),
      false,
    );
  });
});
