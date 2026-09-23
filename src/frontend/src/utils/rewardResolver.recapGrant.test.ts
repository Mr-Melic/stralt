import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampApplyRewardsDeltas } from "./applyRewardsResult.ts";
import { liveBattleChallengePersistEntries } from "./challengeRewards.ts";
import {
  PREAPPLIED_REWARD_MULTIPLIER,
  buildImmediateVictoryRecapGrant,
  computeRewardDeltas,
} from "./rewardResolver.ts";

describe("buildImmediateVictoryRecapGrant", () => {
  it("includes accepted challenge Doka on the immediate recap, matching persist", () => {
    const legendary = liveBattleChallengePersistEntries(
      true,
      { rewards: { doka: 500, xp: 1000 } },
      true,
    );
    const killDoka = 42;
    const killXp = 80;

    // handleBattleEnd used to clamp kill Doka with kill XP + challenge XP.
    // Persist still added dokaReward, so the overlay under-showed 500 Doka.
    const oldRecap = clampApplyRewardsDeltas(
      killDoka,
      killXp + (legendary[0]?.xpReward ?? 0),
    );
    assert.equal(oldRecap.dokaDelta, 42);
    assert.equal(oldRecap.xpDelta, 1080);

    const persist = computeRewardDeltas({
      victory: true,
      enemiesDefeated: [{ name: "rat", level: 4 }],
      completedChallenges: legendary,
      dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
      baseDoka: killDoka,
      baseXp: killXp,
    });
    assert.equal(persist.dokaDelta, 542);
    assert.equal(persist.xpDelta, 1080);
    assert.equal(persist.dokaFromChallenges, 500);

    const recap = buildImmediateVictoryRecapGrant({
      killDoka,
      killXp,
      challenges: legendary,
    });
    assert.equal(recap.dokaDelta, persist.dokaDelta);
    assert.equal(recap.xpDelta, persist.xpDelta);
    assert.equal(recap.dokaFromChallenges, persist.dokaFromChallenges);
    assert.equal(recap.dokaFromVictory, killDoka);
  });

  it("does not invent challenge Doka when the offer was declined", () => {
    const declined = liveBattleChallengePersistEntries(
      false,
      { rewards: { doka: 500, xp: 1000 } },
      true,
    );
    const recap = buildImmediateVictoryRecapGrant({
      killDoka: 42,
      killXp: 80,
      challenges: declined,
    });
    assert.equal(recap.dokaDelta, 42);
    assert.equal(recap.xpDelta, 80);
    assert.equal(recap.dokaFromChallenges, 0);
    assert.equal(recap.dokaFromVictory, 42);
  });

  it("keeps a Doka-only easy challenge on the headline grant", () => {
    const easy = liveBattleChallengePersistEntries(
      true,
      { rewards: { doka: 50 } },
      true,
    );
    const recap = buildImmediateVictoryRecapGrant({
      killDoka: 12,
      killXp: 40,
      challenges: easy,
    });
    assert.equal(recap.dokaDelta, 62);
    assert.equal(recap.xpDelta, 40);
    assert.equal(recap.dokaFromChallenges, 50);
  });
});
