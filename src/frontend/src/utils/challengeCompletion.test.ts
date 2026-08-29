import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type Challenge,
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
  isChallengeFailed,
  recordChallengeDamageTaken,
} from "./challengeCompletion.ts";
import {
  addChallengeRewardDeltas,
  challengeXpFromEntries,
  liveBattleChallengePersistEntries,
} from "./challengeRewards.ts";

function progress(
  overrides: Partial<ChallengePanelProgress> = {},
): ChallengePanelProgress {
  return {
    turnCount: 1,
    totalDamage: 0,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    ...overrides,
  };
}

function byId(id: string): Challenge {
  const found = DEFAULT_CHALLENGES.find((c) => c.id === id);
  assert.ok(found, `missing catalog challenge ${id}`);
  return found;
}

describe("isChallengeCompleted", () => {
  it("credits no-heal and no-damage legendary only on a clean fight", () => {
    const untouchable = byId("legendary_1");
    assert.equal(isChallengeCompleted(untouchable, progress()), true);
    assert.equal(
      isChallengeCompleted(untouchable, progress({ totalDamage: 1 })),
      false,
    );
    assert.equal(
      isChallengeFailed(untouchable, progress({ totalDamage: 1 })),
      true,
    );
  });

  it("treats under_N_turns as inclusive at the advertised limit", () => {
    const under15 = byId("easy_2");
    const under10 = byId("hard_2");
    const under5 = byId("legendary_2");
    assert.equal(
      isChallengeCompleted(under15, progress({ turnCount: 15 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(under15, progress({ turnCount: 16 })),
      false,
    );
    assert.equal(
      isChallengeCompleted(under10, progress({ turnCount: 10 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(under10, progress({ turnCount: 11 })),
      false,
    );
    assert.equal(
      isChallengeCompleted(under5, progress({ turnCount: 5 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(under5, progress({ turnCount: 6 })),
      false,
    );
  });

  it("does not mark under_N_turns failed mid-battle", () => {
    // Turn count is final only on victory. A mid-fight chip must stay open
    // even after turn 16 or handleBattleEnd could treat the offer as dead.
    assert.equal(
      isChallengeFailed(byId("easy_2"), progress({ turnCount: 40 })),
      false,
    );
    assert.equal(
      isChallengeFailed(byId("hard_2"), progress({ turnCount: 40 })),
      false,
    );
    assert.equal(
      isChallengeFailed(byId("legendary_2"), progress({ turnCount: 40 })),
      false,
    );
  });

  it("fails take-damage caps at the advertised boundary, not one above", () => {
    const under50 = byId("easy_3");
    const hardCombo = byId("hard_1");
    assert.equal(
      isChallengeCompleted(under50, progress({ totalDamage: 49 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(under50, progress({ totalDamage: 50 })),
      false,
    );
    assert.equal(
      isChallengeFailed(under50, progress({ totalDamage: 50 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(hardCombo, progress({ totalDamage: 29 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(hardCombo, progress({ totalDamage: 30 })),
      false,
    );
    assert.equal(
      isChallengeCompleted(hardCombo, progress({ healUsed: true })),
      false,
    );
  });

  it("fails AP-per-turn and direct-hit as soon as the condition is broken", () => {
    const apCap = byId("hard_3");
    const striker = byId("legendary_3");
    assert.equal(
      isChallengeCompleted(apCap, progress({ maxApUsedInTurn: 8 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(apCap, progress({ maxApUsedInTurn: 9 })),
      false,
    );
    assert.equal(
      isChallengeFailed(apCap, progress({ maxApUsedInTurn: 9 })),
      true,
    );
    assert.equal(
      isChallengeCompleted(striker, progress({ directHit: false })),
      false,
    );
    assert.equal(
      isChallengeFailed(striker, progress({ directHit: false })),
      true,
    );
  });

  it("does not invent a completion for an unknown condition", () => {
    const unknown = {
      id: "typo",
      tier: "legendary",
      description: "broken",
      condition: "survive_with_50_hp",
      rewards: { xp: 1000 },
    } as unknown as Challenge;
    assert.equal(isChallengeCompleted(unknown, progress()), false);
    assert.equal(isChallengeFailed(unknown, progress()), false);
  });
});

describe("recordChallengeDamageTaken", () => {
  it("accumulates post-hit HP loss so Untouchable cannot persist after a melee", () => {
    let total = 0;
    total = recordChallengeDamageTaken(total, 12);
    total = recordChallengeDamageTaken(total, 8);
    assert.equal(total, 20);
    const untouchable = byId("legendary_1");
    const under50 = byId("easy_3");
    assert.equal(
      isChallengeCompleted(untouchable, progress({ totalDamage: total })),
      false,
    );
    assert.equal(
      isChallengeCompleted(under50, progress({ totalDamage: total })),
      true,
    );
    assert.deepEqual(
      liveBattleChallengePersistEntries(
        true,
        untouchable,
        isChallengeCompleted(untouchable, progress({ totalDamage: total })),
      ),
      [],
    );
  });

  it("ignores absorbed / invalid hits so a full-shield block stays at 0", () => {
    assert.equal(recordChallengeDamageTaken(0, 0), 0);
    assert.equal(recordChallengeDamageTaken(0, -4), 0);
    assert.equal(recordChallengeDamageTaken(0, Number.NaN), 0);
    assert.equal(
      isChallengeCompleted(
        byId("legendary_1"),
        progress({ totalDamage: recordChallengeDamageTaken(0, 0) }),
      ),
      true,
    );
  });
});

describe("challenge completion → persist XP", () => {
  it("credits advertised Untouchable XP only when the predicate passes", () => {
    const legendary = byId("legendary_1");
    const completed = isChallengeCompleted(legendary, progress());
    const entries = liveBattleChallengePersistEntries(
      true,
      legendary,
      completed,
    );
    assert.equal(challengeXpFromEntries(entries), 1000);
    const deltas = addChallengeRewardDeltas(12, 80, entries);
    assert.equal(deltas.xpDelta, 1080);
    assert.equal(deltas.dokaDelta, 512);
    assert.equal(deltas.dokaFromChallenges, 500);
  });

  it("drops advertised XP when the player took damage or never accepted", () => {
    const legendary = byId("legendary_1");
    const failed = isChallengeCompleted(
      legendary,
      progress({ totalDamage: 1 }),
    );
    assert.deepEqual(
      liveBattleChallengePersistEntries(true, legendary, failed),
      [],
    );
    assert.deepEqual(
      liveBattleChallengePersistEntries(false, legendary, true),
      [],
    );
  });
});
