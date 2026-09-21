import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  settleOneShotPersistLock,
  shouldCountGroundDokaPickup,
} from "./dokaPersist.ts";
import { createProgressPersist } from "./progressPersist.ts";

describe("shouldCountGroundDokaPickup", () => {
  it("counts only a committed credit toward loot_10_doka", () => {
    assert.equal(
      shouldCountGroundDokaPickup({ kind: "commit", doka: 25 }),
      true,
    );
    assert.equal(shouldCountGroundDokaPickup({ kind: "keep" }), false);
    assert.equal(
      shouldCountGroundDokaPickup({ kind: "release" }),
      false,
      "transport reject/keep must not count toward loot_10_doka",
    );

    const lock = createProgressPersist({ doka: 500, xp: 0, level: 1 });
    let pickups = 0;
    const keep = { kind: "keep" as const };
    settleOneShotPersistLock(lock, keep);
    if (shouldCountGroundDokaPickup(keep)) pickups += 1;
    assert.equal(pickups, 0);
    const commit = { kind: "commit" as const, doka: 525 };
    settleOneShotPersistLock(lock, commit);
    if (shouldCountGroundDokaPickup(commit)) pickups += 1;
    assert.equal(pickups, 1);
  });
});
