import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  leaderboardAchievementCountUses,
  leaderboardCountsUnlockedProgress,
  leaderboardHydrateUsesJsNumber,
  leaderboardNatWouldSaturateJsNumber,
  officialUiWritesKillCount,
} from "./leaderboardPersistEvolve.ts";

describe("leaderboardPersistEvolve", () => {
  it("documents claimed-not-unlocked ranking, unused killCount, and Number hydrate", () => {
    assert.equal(leaderboardAchievementCountUses(), "claimed");
    assert.equal(leaderboardCountsUnlockedProgress(), false);
    assert.equal(officialUiWritesKillCount(), false);
    assert.equal(leaderboardHydrateUsesJsNumber(), true);
    assert.equal(leaderboardNatWouldSaturateJsNumber(10n), false);
    assert.equal(
      leaderboardNatWouldSaturateJsNumber(BigInt(Number.MAX_SAFE_INTEGER) + 1n),
      true,
    );
  });
});
