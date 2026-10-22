import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
  recordChallengeDamageTaken,
} from "./challengeCompletion.ts";
import {
  hitsAlliesPlayerDamageForChallenge,
  shouldDebitHitsAlliesChallengeDamage,
} from "./hitsAlliesChallengeDamage.ts";

const UNTOUCHABLE = DEFAULT_CHALLENGES.find((c) => c.id === "legendary_1");
assert.ok(UNTOUCHABLE);

function progress(totalDamage: number) {
  return {
    turnCount: 1,
    totalDamage,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 1,
  };
}

describe("hitsAlliesPlayerDamageForChallenge", () => {
  it("returns the positive floor amount that must debit Untouchable", () => {
    assert.equal(hitsAlliesPlayerDamageForChallenge(12), 12);
    assert.equal(hitsAlliesPlayerDamageForChallenge(12.9), 12);
    assert.equal(hitsAlliesPlayerDamageForChallenge(0), 0);
    assert.equal(hitsAlliesPlayerDamageForChallenge(-3), 0);
    assert.equal(hitsAlliesPlayerDamageForChallenge(Number.NaN), 0);
  });

  it("skips the onPlayerReflectedDamage call when finalDmg is 0", () => {
    assert.equal(shouldDebitHitsAlliesChallengeDamage(0), false);
    assert.equal(shouldDebitHitsAlliesChallengeDamage(1), true);
  });
});

describe("hitsAllies __player__ vs Untouchable", () => {
  it("proves the live sentinel path leaves totalDamage at 0 (current hole)", () => {
    // Mirror of applyDamageToEnemy's `__player__` branch today: HP drops,
    // onPlayerReflectedDamage is not called.
    const hpAfter = Math.max(0, 50 - 12);
    let total = 0;
    assert.equal(hpAfter, 38);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(total)),
      true,
      "live hitsAllies self-AoE still completes Untouchable",
    );

    total = recordChallengeDamageTaken(
      total,
      hitsAlliesPlayerDamageForChallenge(12),
    );
    assert.equal(total, 12);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(total)),
      false,
      "debiting the sentinel hit must fail Untouchable like Void Mirror reflect",
    );
  });

  it("fails under-50-damage only after the sentinel debit, not from HP alone", () => {
    const under50 = DEFAULT_CHALLENGES.find((c) => c.id === "easy_3");
    assert.ok(under50);
    assert.equal(isChallengeCompleted(under50, progress(0)), true);
    const total = recordChallengeDamageTaken(
      0,
      hitsAlliesPlayerDamageForChallenge(8),
    );
    assert.equal(isChallengeCompleted(under50, progress(total)), true);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), false);
  });
});
