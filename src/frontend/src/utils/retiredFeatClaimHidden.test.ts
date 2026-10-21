import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  claimAchievementRewardChecksConfigActive,
  markAchievementUnlockedRejectsInactive,
  officialFeatsPanelHidesInactiveConfigs,
  retiredUnclaimedFeatHiddenFromOfficialClaim,
} from "./retiredFeatClaimHidden.ts";

describe("retiredFeatClaimHidden", () => {
  it("flags unlocked unclaimed retired feats as hidden from official Claim", () => {
    assert.equal(officialFeatsPanelHidesInactiveConfigs(), true);
    assert.equal(claimAchievementRewardChecksConfigActive(), false);
    assert.equal(markAchievementUnlockedRejectsInactive(), true);
    assert.equal(
      retiredUnclaimedFeatHiddenFromOfficialClaim({
        active: false,
        unlocked: true,
        claimed: false,
      }),
      true,
    );
    assert.equal(
      retiredUnclaimedFeatHiddenFromOfficialClaim({
        active: true,
        unlocked: true,
        claimed: false,
      }),
      false,
    );
    assert.equal(
      retiredUnclaimedFeatHiddenFromOfficialClaim({
        active: false,
        unlocked: true,
        claimed: true,
      }),
      false,
    );
  });
});
