import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  persistIncrementalRewards,
  readApplyRewardsOk,
} from "./applyRewardsResult.ts";
import {
  PREAPPLIED_REWARD_MULTIPLIER,
  buildBossRushPersistInput,
  computeRewardDeltas,
  computeVictoryExp,
  selectDefeatedEnemiesForRewards,
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

describe("applyRewards result parsing", () => {
  it("reads ok, _ok, and __kind__ payloads and rejects errors", () => {
    assert.deepEqual(
      readApplyRewardsOk({
        ok: { newDoka: 12, newXp: 40, newLevel: 2 },
      }),
      { newDoka: 12, newXp: 40, newLevel: 2 },
    );

    assert.deepEqual(
      readApplyRewardsOk({
        _ok: { newDoka: 1n, newXp: 9n, newLevel: 1n },
      }),
      { newDoka: 1, newXp: 9, newLevel: 1 },
    );

    assert.deepEqual(
      readApplyRewardsOk({
        __kind__: "ok",
        ok: { newDoka: 5, newXp: 15, newLevel: 1 },
      }),
      { newDoka: 5, newXp: 15, newLevel: 1 },
    );

    assert.throws(
      () => readApplyRewardsOk({ err: "Anonymous caller" }),
      /Anonymous caller/,
    );
    assert.throws(
      () => readApplyRewardsOk({ __kind__: "err", err: "Account banned" }),
      /Account banned/,
    );
    assert.throws(() => readApplyRewardsOk(null), /empty result/);
  });

  it("persists incremental XP through applyRewards", async () => {
    const calls: Array<[bigint, bigint, bigint]> = [];
    const actor = {
      applyRewards: async (slot: bigint, doka: bigint, xp: bigint) => {
        calls.push([slot, doka, xp]);
        return { ok: { newDoka: 100, newXp: 30, newLevel: 2 } };
      },
    };
    const persisted = await persistIncrementalRewards(actor, 2, 0, 10);
    assert.deepEqual(calls, [[2n, 0n, 10n]]);
    assert.deepEqual(persisted, { newDoka: 100, newXp: 30, newLevel: 2 });
  });
});

describe("selectDefeatedEnemiesForRewards", () => {
  it("prefers the attributed roster over an empty recheckVictory list", () => {
    assert.deepEqual(
      selectDefeatedEnemiesForRewards(
        [],
        [
          { pieceType: "wraith", level: 4 },
          { name: "golem", level: 6 },
        ],
      ),
      [
        { name: "wraith", level: 4 },
        { name: "golem", level: 6 },
      ],
    );
  });

  it("falls back to the caller-supplied list when nothing was attributed", () => {
    assert.deepEqual(
      selectDefeatedEnemiesForRewards([{ name: "fallback", level: 2 }], []),
      [{ name: "fallback", level: 2 }],
    );
  });
});

describe("lost-fight reward deltas", () => {
  it("does not persist victory Doka/XP when victory is false", () => {
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
  });

  it("still credits completed-challenge Doka on a loss", () => {
    const deltas = computeRewardDeltas({
      victory: false,
      enemiesDefeated: [],
      completedChallenges: [{ name: "no_healing", dokaReward: 25 }],
      dungeonMultiplier: 1,
      baseDoka: 200,
      baseXp: 80,
    });
    assert.equal(deltas.dokaDelta, 25);
    assert.equal(deltas.xpDelta, 0);
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
    await persistIncrementalRewards(actor, 1, -40, 10.9);
    assert.deepEqual(calls, [[1n, 0n, 10n]]);
  });
});
