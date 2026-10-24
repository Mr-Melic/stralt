import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEGENDARY_CHALLENGE_BADGES,
  challengeBadgeDroppedOnPersist,
  challengeBadgePersistsToCanister,
  challengeRewardFieldsPersisted,
} from "./challengeBadgePersist.ts";

describe("challengeBadgePersist", () => {
  it("does not persist legendary badge strings to the canister funnel", () => {
    assert.equal(challengeBadgePersistsToCanister(), false);
    assert.equal(
      challengeBadgeDroppedOnPersist({
        doka: 500,
        xp: 1000,
        badge: "Untouchable",
      }),
      true,
    );
    assert.deepEqual(
      challengeRewardFieldsPersisted({
        doka: 500,
        xp: 1000,
        badge: "Untouchable",
      }),
      { dokaReward: 500, xpReward: 1000 },
    );
    assert.deepEqual(
      [...LEGENDARY_CHALLENGE_BADGES],
      ["Untouchable", "Blitz", "Striker"],
    );
  });
});
