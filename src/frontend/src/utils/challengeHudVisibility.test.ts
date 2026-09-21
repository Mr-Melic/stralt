import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  challengeHudCapturesMapPointer,
  shouldShowChallengeHud,
} from "./challengeHudVisibility.ts";

describe("shouldShowChallengeHud", () => {
  it("shows the offer while the accept window is open", () => {
    assert.equal(
      shouldShowChallengeHud({
        offerVisible: true,
        accepted: false,
        hasChallenge: true,
      }),
      true,
    );
  });

  it("keeps the HUD after accept when WorldExploration hides the offer", () => {
    assert.equal(
      shouldShowChallengeHud({
        offerVisible: false,
        accepted: true,
        hasChallenge: true,
      }),
      true,
    );
  });

  it("hides an unaccepted offer after the first action", () => {
    assert.equal(
      shouldShowChallengeHud({
        offerVisible: false,
        accepted: false,
        hasChallenge: true,
      }),
      false,
    );
  });

  it("hides when the contract is gone (decline, ignore, or battle cleanup)", () => {
    assert.equal(
      shouldShowChallengeHud({
        offerVisible: false,
        accepted: true,
        hasChallenge: false,
      }),
      false,
    );
    assert.equal(
      shouldShowChallengeHud({
        offerVisible: true,
        accepted: false,
        hasChallenge: false,
      }),
      false,
    );
  });
});

describe("challengeHudCapturesMapPointer", () => {
  it("lets Accept/Decline capture during the offer window", () => {
    assert.equal(challengeHudCapturesMapPointer({ accepted: false }), true);
  });

  it("does not steal canvas clicks after the contract is accepted", () => {
    // Sequence: accept → first AP/MP (offerVisible false, HUD stays) →
    // click a hostile under the default right-side panel. Wrapper
    // preventDefault used to eat that click for the rest of the fight.
    assert.equal(challengeHudCapturesMapPointer({ accepted: true }), false);
  });
});
