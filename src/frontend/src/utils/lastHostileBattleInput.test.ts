import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
  recordChallengeItemHealUsed,
  recordInBattleChallengeDamage,
} from "./challengeCompletion.ts";
import { shouldIgnoreBattleInputAfterLastHostile } from "./lastHostileBattleInput.ts";

const noHeal = DEFAULT_CHALLENGES.find((c) => c.id === "easy_1");
const untouchable = DEFAULT_CHALLENGES.find((c) => c.id === "legendary_1");
assert.ok(noHeal);
assert.ok(untouchable);

const clean = {
  turnCount: 3,
  totalDamage: 0,
  healUsed: false,
  directHit: true,
  maxApUsedInTurn: 4,
};

describe("shouldIgnoreBattleInputAfterLastHostile", () => {
  it("blocks new canvas / Use / Attack Nearest after the last hostile dies, before recap", () => {
    // Kill last hostile. Recap and victoryPersistPending are still false
    // until the [inBattle, enemies] victory useEffect. A new lava step or
    // potion Use in that gap used to mutate death / challenge refs.
    assert.equal(
      shouldIgnoreBattleInputAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
      }),
      true,
    );
  });

  it("lets the player keep acting while a hostile is still alive", () => {
    assert.equal(
      shouldIgnoreBattleInputAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 1,
      }),
      false,
    );
  });

  it("lets post-victory overworld walks continue once inBattle is false", () => {
    assert.equal(
      shouldIgnoreBattleInputAfterLastHostile({
        inBattle: false,
        hostilesRemaining: 0,
      }),
      false,
    );
  });
});

describe("last-hostile window must not rewrite a completed challenge", () => {
  it("a recap-window health potion would fail a completed no-heal contract", () => {
    assert.equal(isChallengeCompleted(noHeal, clean), true);
    // BuffShop Use requires inBattle && isPlayerTurn — both still true
    // until handleBattleEnd. handleUseItem then flips healUsed.
    const afterPotion = recordChallengeItemHealUsed(true, clean.healUsed);
    assert.equal(afterPotion, true);
    assert.equal(
      isChallengeCompleted(noHeal, { ...clean, healUsed: afterPotion }),
      false,
      "Use after the last kill used to drop easy_1 (50 Doka) at recap",
    );
    assert.equal(
      shouldIgnoreBattleInputAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
      }),
      true,
      "the live fight with an empty roster must refuse that Use",
    );
  });

  it("a recap-window lava click would fail Untouchable and can skip applyRewards", () => {
    assert.equal(isChallengeCompleted(untouchable, clean), true);
    const afterLava = recordInBattleChallengeDamage(true, clean.totalDamage, 8);
    assert.equal(afterLava, 8);
    assert.equal(
      isChallengeCompleted(untouchable, { ...clean, totalDamage: afterLava }),
      false,
    );
    assert.equal(
      shouldIgnoreBattleInputAfterLastHostile({
        inBattle: true,
        hostilesRemaining: 0,
      }),
      true,
      "a new canvas walk onto lava after the last kill must not land",
    );
  });
});
