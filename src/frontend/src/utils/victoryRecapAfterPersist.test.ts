import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldPublishVictoryRecapAfterPersist,
  victoryPersistSuccessSteps,
} from "./victoryRecapAfterPersist.ts";

describe("shouldPublishVictoryRecapAfterPersist", () => {
  it("publishes when thresholds crossed and no death during persist", () => {
    assert.equal(
      shouldPublishVictoryRecapAfterPersist({
        thresholdConditions: ["doka_1000"],
        deathTriggered: false,
        deathEpochAtPersistStart: 0,
        deathEpochNow: 0,
      }),
      true,
    );
  });

  it("skips when no wallet/level thresholds crossed", () => {
    assert.equal(
      shouldPublishVictoryRecapAfterPersist({
        thresholdConditions: [],
        deathTriggered: false,
      }),
      false,
    );
  });

  it("skips when deathTriggered so defeat recap is not overwritten", () => {
    assert.equal(
      shouldPublishVictoryRecapAfterPersist({
        thresholdConditions: ["level_10", "doka_1000"],
        deathTriggered: true,
        deathEpochAtPersistStart: 0,
        deathEpochNow: 0,
      }),
      false,
    );
  });

  it("skips when deathEpoch advanced during the applyRewards await", () => {
    assert.equal(
      shouldPublishVictoryRecapAfterPersist({
        thresholdConditions: ["doka_1000"],
        deathTriggered: false,
        deathEpochAtPersistStart: 2,
        deathEpochNow: 3,
      }),
      false,
    );
  });
});

describe("victoryPersistSuccessSteps", () => {
  it("matches handleBattleEnd order when credit crossed doka_1000", () => {
    assert.deepEqual(
      victoryPersistSuccessSteps({
        thresholdConditions: ["doka_1000"],
        deathTriggered: false,
        deathEpochAtPersistStart: 0,
        deathEpochNow: 0,
      }),
      ["fire-threshold-in-battle", "refresh-recap", "hydrate-live"],
    );
  });

  it("fires and refreshes before hydrate so idle doka effects cannot toast recap feats", () => {
    const steps = victoryPersistSuccessSteps({
      thresholdConditions: ["doka_1000", "level_10"],
      deathTriggered: false,
      deathEpochAtPersistStart: 0,
      deathEpochNow: 0,
    });
    assert.ok(
      steps.indexOf("fire-threshold-in-battle") < steps.indexOf("hydrate-live"),
    );
    assert.ok(steps.indexOf("refresh-recap") < steps.indexOf("hydrate-live"));
  });

  it("Boss Rush room-clear persist .then still unlocks doka_1000 after death, without republishing victory", () => {
    const events: string[] = [];
    const steps = victoryPersistSuccessSteps({
      thresholdConditions: ["doka_1000"],
      deathTriggered: true,
      deathEpochAtPersistStart: 0,
      deathEpochNow: 1,
    });
    if (steps.includes("fire-threshold-in-battle")) events.push("fire");
    if (steps.includes("refresh-recap")) events.push("refresh");
    if (steps.includes("hydrate-live")) events.push("hydrate");
    assert.deepEqual(events, ["fire"]);
  });

  it("fires threshold feats after death but does not refresh victory recap", () => {
    // #904's bossRushRoomClearPersistSuccessSteps still refreshes here;
    // that republishes victory over the defeat overlay. Gate refresh only.
    assert.deepEqual(
      victoryPersistSuccessSteps({
        thresholdConditions: ["level_10"],
        deathTriggered: true,
        deathEpochAtPersistStart: 0,
        deathEpochNow: 1,
      }),
      ["fire-threshold-in-battle"],
    );
  });

  it("only hydrates when no threshold crossed and player still alive", () => {
    assert.deepEqual(
      victoryPersistSuccessSteps({
        thresholdConditions: [],
        deathTriggered: false,
      }),
      ["hydrate-live"],
    );
  });

  it("is empty when death skipped hydrate and no thresholds crossed", () => {
    assert.deepEqual(
      victoryPersistSuccessSteps({
        thresholdConditions: [],
        deathTriggered: true,
      }),
      [],
    );
  });
});
