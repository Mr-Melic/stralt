import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nextGroundDokaPickupCount,
  readGroundDokaPickupCount,
  shouldCountGroundDokaPickupForFeat,
  shouldRecheckLoot10DokaFeat,
} from "./groundDokaFeatCounter.ts";

describe("groundDokaFeatCounter", () => {
  it("counts feat progress only on commit settle", () => {
    assert.equal(shouldCountGroundDokaPickupForFeat("commit"), true);
    assert.equal(shouldCountGroundDokaPickupForFeat("release"), false);
    assert.equal(shouldCountGroundDokaPickupForFeat("keep"), false);
  });

  it("rechecks loot_10 when pickups change, not only mapsVisited", () => {
    assert.equal(
      shouldRecheckLoot10DokaFeat({
        mapsVisitedChanged: false,
        groundDokaPickupsChanged: true,
        groundDokaPickups: 10,
      }),
      true,
    );
    assert.equal(
      shouldRecheckLoot10DokaFeat({
        mapsVisitedChanged: true,
        groundDokaPickupsChanged: false,
        groundDokaPickups: 10,
      }),
      true,
    );
    assert.equal(
      shouldRecheckLoot10DokaFeat({
        mapsVisitedChanged: false,
        groundDokaPickupsChanged: true,
        groundDokaPickups: 9,
      }),
      false,
    );
    assert.equal(
      shouldRecheckLoot10DokaFeat({
        mapsVisitedChanged: false,
        groundDokaPickupsChanged: false,
        groundDokaPickups: 10,
      }),
      false,
    );
  });

  it("reads and advances counters safely", () => {
    assert.equal(readGroundDokaPickupCount(null), 0);
    assert.equal(readGroundDokaPickupCount("12"), 12);
    assert.equal(readGroundDokaPickupCount("-3"), 0);
    assert.equal(readGroundDokaPickupCount("nope"), 0);
    assert.equal(nextGroundDokaPickupCount(9), 10);
    assert.equal(nextGroundDokaPickupCount(Number.NaN), 1);
  });
});
