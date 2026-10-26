import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EXPLORE_25_MAPS_CONDITION,
  explore25ConditionMet,
  explore25ProgressIsUniqueMapIdSet,
  mapsVisitedStorageKey,
  readMapsVisitedCount,
  shouldCountPortalTransitionTowardExplore25,
  uniqueMapIdsCannotBeRecoveredFromVisitCounter,
} from "./mapsVisitedFeatPersist.ts";

describe("mapsVisitedFeatPersist", () => {
  it("keys the explorer counter by display-name userId and slot", () => {
    assert.equal(
      mapsVisitedStorageKey("VampireBob", 1),
      "VampireBob_slot1_pbv_maps_visited_count",
    );
    assert.equal(
      mapsVisitedStorageKey("  ", 2),
      "guest_slot2_pbv_maps_visited_count",
    );
  });

  it("locks scalar-counter persist — unique map ids cannot be recovered", () => {
    assert.equal(explore25ProgressIsUniqueMapIdSet(), false);
    assert.equal(uniqueMapIdsCannotBeRecoveredFromVisitCounter(), true);
    assert.equal(EXPLORE_25_MAPS_CONDITION, "explore_25_maps");
  });

  it("does not count Death Realm or Rest Area toward Explorer", () => {
    assert.equal(
      shouldCountPortalTransitionTowardExplore25({
        isDeathRealm: false,
        isRestArea: false,
      }),
      true,
    );
    assert.equal(
      shouldCountPortalTransitionTowardExplore25({
        isDeathRealm: true,
        isRestArea: false,
      }),
      false,
    );
    assert.equal(
      shouldCountPortalTransitionTowardExplore25({
        isDeathRealm: false,
        isRestArea: true,
      }),
      false,
    );
  });

  it("reads the counter and gates the feat at 25", () => {
    assert.equal(readMapsVisitedCount(null), 0);
    assert.equal(readMapsVisitedCount("-3"), 0);
    assert.equal(readMapsVisitedCount("24"), 24);
    assert.equal(explore25ConditionMet(24), false);
    assert.equal(explore25ConditionMet(25), true);
  });
});
