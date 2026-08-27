import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PREAPPLIED_REWARD_MULTIPLIER,
  buildBossRushPersistInput,
  computeRewardDeltas,
  computeVictoryExp,
} from "./rewardResolver.ts";

describe("boss-rush persist input", () => {
  it("persists the room totals exactly (no extra dungeon multiplier)", () => {
    const defeatedEnemies = [
      { name: "larva", level: 4 },
      { name: "queen", level: 8 },
    ];
    const input = buildBossRushPersistInput({
      defeatedEnemies,
      characterLevel: 5,
      baseDoka: 42,
    });

    assert.equal(input.dungeonMultiplier, PREAPPLIED_REWARD_MULTIPLIER);
    assert.equal(input.victory, true);
    assert.equal(
      input.baseXp,
      computeVictoryExp({ defeatedEnemies, characterLevel: 5 }),
    );

    const deltas = computeRewardDeltas(input);
    assert.equal(deltas.dokaDelta, 42);
    assert.equal(deltas.xpDelta, 240);
  });
});

describe("pre-applied dungeon multiplier", () => {
  it("does not square a chain multiplier already baked into the bases", () => {
    const chainMult = 2;
    const rawDoka = 100;
    const recapDoka = rawDoka * chainMult;
    const recapXp = 80;

    const wrong = computeRewardDeltas({
      victory: true,
      enemiesDefeated: [],
      completedChallenges: [],
      dungeonMultiplier: chainMult,
      baseDoka: recapDoka,
      baseXp: recapXp,
    });
    assert.equal(wrong.dokaDelta, 400);
    assert.equal(wrong.xpDelta, 160);

    const correct = computeRewardDeltas({
      victory: true,
      enemiesDefeated: [],
      completedChallenges: [],
      dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
      baseDoka: recapDoka,
      baseXp: recapXp,
    });
    assert.equal(correct.dokaDelta, recapDoka);
    assert.equal(correct.xpDelta, recapXp);
  });
});
