import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldCloseChallengeOfferOnTurnYield } from "./challengeOfferTurnYield.ts";

describe("shouldCloseChallengeOfferOnTurnYield", () => {
  it("closes an unaccepted offer when the player yields the turn", () => {
    assert.equal(
      shouldCloseChallengeOfferOnTurnYield({ accepted: false }),
      true,
      "End Turn / timer must dismiss the accept window",
    );
  });

  it("keeps an accepted challenge contract through End Turn", () => {
    assert.equal(
      shouldCloseChallengeOfferOnTurnYield({ accepted: true }),
      false,
      "accepted hard/legendary rewards must still persist",
    );
  });

  it("treats a missing accept flag as unaccepted (close the offer)", () => {
    assert.equal(
      shouldCloseChallengeOfferOnTurnYield({
        accepted: undefined as unknown as boolean,
      }),
      true,
    );
  });
});

/**
 * Chronology locked by this helper (WX restack later):
 * 1. Battle starts; challenge offered; accepted === false.
 * 2. Player hits End Turn or the 30s timer fires → advanceTurn only.
 * 3. Expected: shouldCloseChallengeOfferOnTurnYield → markFirstAction /
 *    drop currentChallenge (same as first AP/MP spend).
 * 4. Actual on main 0f5363f: offer stays; player scouts enemy turns then
 *    Accepts; completedChallenges can still credit through applyRewards.
 */
{
  const offerOpen = { accepted: false };
  const afterYield = shouldCloseChallengeOfferOnTurnYield(offerOpen);
  assert.equal(afterYield, true);
  // Simulate markFirstAction dismiss for an unaccepted offer.
  const challengeAfterYield = afterYield ? null : { id: "keep" };
  assert.equal(challengeAfterYield, null);

  assert.equal(shouldCloseChallengeOfferOnTurnYield({ accepted: true }), false);
}

console.log("challengeOfferTurnYield.test: ok");
