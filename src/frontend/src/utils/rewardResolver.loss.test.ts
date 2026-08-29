import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { persistIncrementalRewards } from "./applyRewardsResult.ts";
import { computeRewardDeltas } from "./rewardResolver.ts";

describe("computeRewardDeltas loss path", () => {
  it("does not persist base Doka/XP when victory is false", () => {
    const deltas = computeRewardDeltas({
      victory: false,
      enemiesDefeated: [
        { name: "wraith", level: 4 },
        { name: "golem", level: 6 },
      ],
      completedChallenges: [],
      dungeonMultiplier: 2,
      baseDoka: 200,
      baseXp: 160,
    });
    assert.equal(deltas.dokaDelta, 0);
    assert.equal(deltas.xpDelta, 0);
    assert.equal(deltas.dokaFromChallenges, 0);
  });

  it("still credits accepted challenge Doka/XP on a loss", () => {
    const deltas = computeRewardDeltas({
      victory: false,
      enemiesDefeated: [],
      completedChallenges: [
        { name: "no_healing", dokaReward: 25, xpReward: 80 },
      ],
      dungeonMultiplier: 1,
      baseDoka: 200,
      baseXp: 80,
    });
    assert.equal(deltas.dokaDelta, 25);
    assert.equal(deltas.xpDelta, 80);
    assert.equal(deltas.dokaFromChallenges, 25);
  });
});

describe("persistIncrementalRewards clamping", () => {
  it("floors fractional deltas and never sends a negative applyRewards Nat", async () => {
    const calls: Array<[bigint, bigint, bigint]> = [];
    const actor = {
      applyRewards: async (slot: bigint, doka: bigint, xp: bigint) => {
        calls.push([slot, doka, xp]);
        return { ok: { newDoka: 10, newXp: 5, newLevel: 1 } };
      },
    };
    const persisted = await persistIncrementalRewards(actor, 1, -5.9, 3.7);
    assert.deepEqual(calls, [[1n, 0n, 3n]]);
    assert.deepEqual(persisted, { newDoka: 10, newXp: 5, newLevel: 1 });
  });
});
