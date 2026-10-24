import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bossRushStateAfterFullSlotClear,
  bossRushStateAfterResetOnly,
  nextRoomAfterSetBossRushProgress,
  rawClientCanWalkBossRushToMasterWithoutCombat,
  resetBossRushClearsHighestAndRuns,
} from "./bossRushSlotClear.ts";

describe("bossRushSlotClear", () => {
  it("full slot clear zeros highest and run count", () => {
    assert.deepEqual(bossRushStateAfterFullSlotClear(), {
      currentRoom: 0,
      highestRoomCompleted: 0,
      totalBossRushRuns: 0,
    });
  });

  it("resetBossRush alone keeps highest and runs (helper mismatch)", () => {
    assert.equal(resetBossRushClearsHighestAndRuns(), false);
    assert.deepEqual(
      bossRushStateAfterResetOnly({
        currentRoom: 7,
        highestRoomCompleted: 10,
        totalBossRushRuns: 2,
      }),
      {
        currentRoom: 0,
        highestRoomCompleted: 10,
        totalBossRushRuns: 2,
      },
    );
  });

  it("allows a raw +1 walk from 0 to 9 then master path", () => {
    assert.equal(rawClientCanWalkBossRushToMasterWithoutCombat(), true);
    let room = 0;
    for (let target = 1; target <= 9; target++) {
      const step = nextRoomAfterSetBossRushProgress(room, target);
      assert.equal(step.ok, true);
      if (step.ok) room = step.currentRoom;
    }
    assert.equal(room, 9);
    assert.deepEqual(nextRoomAfterSetBossRushProgress(9, 11), {
      ok: false,
      reason: "currentRoom must be 0-9",
    });
    assert.deepEqual(nextRoomAfterSetBossRushProgress(3, 5), {
      ok: false,
      reason: "currentRoom can only advance by 1",
    });
  });
});
