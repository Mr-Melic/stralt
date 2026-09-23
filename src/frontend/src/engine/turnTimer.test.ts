import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAdvanceAfterEnemyTurn } from "./battleSetup.ts";
import {
  beginTurnAdvance,
  bumpTurnTimerGeneration,
  endTurnAdvance,
  shouldDispatchDeferredTurnAdvance,
  shouldDispatchTurnTimerExpiry,
  shouldHonorTurnTimerTick,
  shouldStartTurnAdvance,
} from "./turnTimer.ts";

describe("shouldHonorTurnTimerTick", () => {
  it("drops a queued updater after End Turn already bumped generation", () => {
    const intervalGeneration = 4;
    const afterEndTurn = bumpTurnTimerGeneration(intervalGeneration);
    assert.equal(afterEndTurn, 5);
    assert.equal(
      shouldHonorTurnTimerTick(intervalGeneration, afterEndTurn),
      false,
    );
    assert.equal(shouldHonorTurnTimerTick(afterEndTurn, afterEndTurn), true);
  });

  it("rejects non-finite generations", () => {
    assert.equal(shouldHonorTurnTimerTick(Number.NaN, 1), false);
    assert.equal(shouldHonorTurnTimerTick(1, Number.POSITIVE_INFINITY), false);
  });
});

describe("shouldDispatchTurnTimerExpiry", () => {
  const live = {
    callbackGeneration: 2,
    liveGeneration: 2,
    inBattle: true,
    deathTriggered: false,
    battleEnded: false,
    hostilesRemaining: 1,
  };

  it("dispatches only for a live fight whose timer generation still matches", () => {
    assert.equal(shouldDispatchTurnTimerExpiry(live), true);
  });

  it("does not skip the enemy after End Turn already advanced this turn", () => {
    assert.equal(
      shouldDispatchTurnTimerExpiry({
        ...live,
        liveGeneration: bumpTurnTimerGeneration(live.callbackGeneration),
      }),
      false,
      "queued setTurnTimeLeft updater must not call advanceTurn again",
    );
  });

  it("does not tick leftover summon lifespan after a last-hostile kill", () => {
    assert.equal(
      shouldDispatchTurnTimerExpiry({ ...live, hostilesRemaining: 0 }),
      false,
    );
    assert.equal(
      shouldAdvanceAfterEnemyTurn({
        deathTriggered: false,
        hostilesRemaining: 0,
      }),
      false,
    );
  });

  it("does not dispatch after cleanupBattle / death already ended the fight", () => {
    assert.equal(
      shouldDispatchTurnTimerExpiry({ ...live, inBattle: false }),
      false,
    );
    assert.equal(
      shouldDispatchTurnTimerExpiry({ ...live, deathTriggered: true }),
      false,
    );
    assert.equal(
      shouldDispatchTurnTimerExpiry({ ...live, battleEnded: true }),
      false,
    );
  });
});

describe("shouldDispatchDeferredTurnAdvance", () => {
  it("blocks the 500ms summon auto-end after the last hostile dies", () => {
    assert.equal(
      shouldDispatchDeferredTurnAdvance({
        inBattle: true,
        hostilesRemaining: 0,
      }),
      false,
    );
    assert.equal(
      shouldDispatchDeferredTurnAdvance({
        inBattle: true,
        hostilesRemaining: 2,
      }),
      true,
    );
  });
});

describe("beginTurnAdvance", () => {
  it("rejects a nested End Turn + timer call on the same stack", () => {
    const inFlight = { current: false };
    assert.equal(shouldStartTurnAdvance(false), true);
    assert.equal(beginTurnAdvance(inFlight), true);
    assert.equal(inFlight.current, true);
    assert.equal(beginTurnAdvance(inFlight), false);
    assert.equal(shouldStartTurnAdvance(true), false);
    endTurnAdvance(inFlight);
    assert.equal(inFlight.current, false);
    assert.equal(beginTurnAdvance(inFlight), true);
  });
});
