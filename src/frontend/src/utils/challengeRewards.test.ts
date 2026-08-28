import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addChallengeRewardDeltas,
  battleChallengePersistEntries,
  challengeDokaFromEntries,
  challengeXpFromEntries,
  liveBattleChallengePersistEntries,
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

  it("uses the live accept flag, not a stale handleBattleEnd closure", () => {
    const legendary = { rewards: { doka: 500, xp: 1000 } };
    // Accept click never recreates handleBattleEnd. A closure snapshot stays
    // at accepted=false and would drop the advertised XP.
    assert.deepEqual(
      liveBattleChallengePersistEntries(false, legendary, true),
      [],
    );
    const live = liveBattleChallengePersistEntries(true, legendary, true);
    assert.equal(live[0]?.xpReward, 1000);
    assert.equal(live[0]?.dokaReward, 500);

    // Next fight must start unaccepted even if the previous offer was taken.
    assert.deepEqual(
      liveBattleChallengePersistEntries(false, { rewards: { xp: 400 } }, true),
      [],
    );
  });

  it("credits accepted hard/legendary rewards on the Boss Rush room-clear path", () => {
    // handleBossRushRoomClear used to hardcode challengeDokaReward = 0 and
    // completedChallenges: []. Accept + complete still dropped the panel XP.
    const legendary = { rewards: { doka: 500, xp: 1000 } };
    const dropped = liveBattleChallengePersistEntries(false, legendary, true);
    assert.equal(challengeXpFromEntries(dropped), 0);
    assert.equal(challengeDokaFromEntries(dropped), 0);

    const live = liveBattleChallengePersistEntries(true, legendary, true);
    assert.equal(challengeXpFromEntries(live), 1000);
    assert.equal(challengeDokaFromEntries(live), 500);

    // Room-clear persist used to pass baseDoka only and drop entries, so
    // applyRewards never saw the advertised 400–1000 XP.
    const roomDoka = 40;
    const roomXp = 160;
    const deltas = addChallengeRewardDeltas(roomDoka, roomXp, live);
    assert.equal(deltas.dokaDelta, 540);
    assert.equal(deltas.xpDelta, 1160);
    assert.equal(deltas.dokaFromChallenges, 500);
  });
});
