import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addChallengeRewardDeltas,
  battleChallengePersistEntries,
  challengeXpFromEntries,
} from "./challengeRewards.ts";

describe("battle challenge XP persist", () => {
  it("credits advertised hard/legendary XP through applyRewards", () => {
    const legendary = {
      rewards: { doka: 500, xp: 1000, badge: "Untouchable" },
    };
    const entries = battleChallengePersistEntries(true, legendary);
    assert.equal(challengeXpFromEntries(entries), 1000);
    assert.equal(entries[0]?.dokaReward, 500);

    const deltas = addChallengeRewardDeltas(12, 80, entries);
    assert.equal(deltas.dokaDelta, 512);
    assert.equal(deltas.xpDelta, 1080);
    assert.equal(deltas.dokaFromChallenges, 500);
  });

  it("does not invent XP when the challenge failed or only pays Doka", () => {
    assert.deepEqual(
      battleChallengePersistEntries(false, { rewards: { xp: 1000 } }),
      [],
    );
    const easy = battleChallengePersistEntries(true, { rewards: { doka: 50 } });
    assert.equal(challengeXpFromEntries(easy), 0);
    const deltas = addChallengeRewardDeltas(10, 20, easy);
    assert.equal(deltas.xpDelta, 20);
    assert.equal(deltas.dokaDelta, 60);
  });
});
