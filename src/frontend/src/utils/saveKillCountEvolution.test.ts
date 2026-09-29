import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SAVE_KILL_COUNT_MAX_PER_CALL,
  leaderboardKillCountFollowsHighestLevelSlot,
  leaderboardPicksFirstSlotOnTiedLevel,
  officialClientWritesKillCount,
  saveKillCountAddsIncomingKills,
  saveKillCountRetryWouldMint,
  zeroKillCountIsValidHistoricalData,
} from "./saveKillCountEvolution.ts";

describe("saveKillCountEvolution", () => {
  it("treats stored 0 as valid and additive retries as mint", () => {
    assert.equal(officialClientWritesKillCount(), false);
    assert.equal(saveKillCountAddsIncomingKills(), true);
    assert.equal(zeroKillCountIsValidHistoricalData(), true);
    assert.equal(leaderboardKillCountFollowsHighestLevelSlot(), true);
    assert.equal(leaderboardPicksFirstSlotOnTiedLevel(), true);
    assert.equal(SAVE_KILL_COUNT_MAX_PER_CALL, 64);
    assert.equal(saveKillCountRetryWouldMint(0, 5), true);
    assert.equal(saveKillCountRetryWouldMint(12, 0), false);
    assert.equal(saveKillCountRetryWouldMint(0, 80), true);
  });
});
