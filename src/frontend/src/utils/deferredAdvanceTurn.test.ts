import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldDispatchDeferredAdvanceTurn } from "./deferredAdvanceTurn.ts";

describe("shouldDispatchDeferredAdvanceTurn", () => {
  it("allows a live mid-fight handoff", () => {
    assert.equal(
      shouldDispatchDeferredAdvanceTurn({
        inBattle: true,
        cleanupRan: false,
        deathTriggered: false,
        hostilesRemaining: 2,
        scheduledGeneration: 3,
        currentGeneration: 3,
      }),
      true,
    );
  });

  it("refuses after victory cleanup left the battle", () => {
    assert.equal(
      shouldDispatchDeferredAdvanceTurn({
        inBattle: false,
        cleanupRan: true,
        deathTriggered: false,
        hostilesRemaining: 0,
        scheduledGeneration: 1,
        currentGeneration: 1,
      }),
      false,
      "untracked 600ms summon timer must not advance after handleBattleEnd",
    );
  });

  it("refuses when the last hostile already died (persist race)", () => {
    assert.equal(
      shouldDispatchDeferredAdvanceTurn({
        inBattle: true,
        cleanupRan: false,
        deathTriggered: false,
        hostilesRemaining: 0,
        scheduledGeneration: 4,
        currentGeneration: 4,
      }),
      false,
      "last-hostile summon fade must not dispatch the next player DoT/plague",
    );
  });

  it("refuses a stale AI generation after cleanup bumps the counter", () => {
    assert.equal(
      shouldDispatchDeferredAdvanceTurn({
        inBattle: true,
        cleanupRan: false,
        deathTriggered: false,
        hostilesRemaining: 1,
        scheduledGeneration: 2,
        currentGeneration: 3,
      }),
      false,
    );
  });

  it("refuses after deathTriggered so a leftover timer cannot skip the penalty", () => {
    assert.equal(
      shouldDispatchDeferredAdvanceTurn({
        inBattle: true,
        cleanupRan: false,
        deathTriggered: true,
        hostilesRemaining: 1,
        scheduledGeneration: 1,
        currentGeneration: 1,
      }),
      false,
    );
  });

  it("refuses when cleanupRan even if inBattle state lags", () => {
    assert.equal(
      shouldDispatchDeferredAdvanceTurn({
        inBattle: true,
        cleanupRan: true,
        deathTriggered: false,
        hostilesRemaining: 3,
        scheduledGeneration: 1,
        currentGeneration: 1,
      }),
      false,
    );
  });
});
