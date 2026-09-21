import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PORTAL_TRANSITION_XP,
  persistIncrementalRewards,
  persistIncrementalXpThroughLock,
  readApplyRewardsOk,
} from "./applyRewardsResult.ts";
import { liveBattleChallengePersistEntries } from "./challengeRewards.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedXpForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  PREAPPLIED_REWARD_MULTIPLIER,
  buildBossRushPersistInput,
  computeRewardDeltas,
  computeVictoryExp,
  persistBattleRewardsOnLock,
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
    assert.deepEqual(input.completedChallenges, []);
  });

  it("credits accepted hard/legendary panel rewards through applyRewards", () => {
    const defeatedEnemies = [{ name: "larva", level: 4 }];
    const legendary = liveBattleChallengePersistEntries(
      true,
      { rewards: { doka: 500, xp: 1000 } },
      true,
    );
    const input = buildBossRushPersistInput({
      defeatedEnemies,
      characterLevel: 5,
      baseDoka: 42,
      completedChallenges: legendary,
    });
    const deltas = computeRewardDeltas(input);
    // Victory gate skips handleBattleEnd on a run. Empty completedChallenges
    // used to drop the 400–1000 XP / 150–500 Doka the panel advertised.
    assert.equal(deltas.dokaDelta, 542);
    assert.equal(deltas.xpDelta, 1080);
    assert.equal(deltas.dokaFromChallenges, 500);
  });

  it("does not pay the panel when the offer was declined", () => {
    const input = buildBossRushPersistInput({
      defeatedEnemies: [{ name: "larva", level: 4 }],
      characterLevel: 5,
      baseDoka: 42,
      completedChallenges: liveBattleChallengePersistEntries(
        false,
        { rewards: { doka: 500, xp: 1000 } },
        true,
      ),
    });
    const deltas = computeRewardDeltas(input);
    assert.equal(deltas.dokaDelta, 42);
    assert.equal(deltas.xpDelta, 80);
    assert.equal(deltas.dokaFromChallenges, 0);
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

  it("does not copy optimistic portal XP over committed when persist fails", async () => {
    assert.equal(PORTAL_TRANSITION_XP, 10);
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let uiXp = 80;
    await assert.rejects(
      lock.enqueue(async () => {
        await persistIncrementalRewards(
          {
            applyRewards: async () => ({ err: "Account banned" }),
          },
          1,
          0,
          PORTAL_TRANSITION_XP,
        );
      }),
      /Account banned/,
    );
    // HUD stays at the pre-portal leftover until applyRewards commits.
    assert.equal(uiXp, 80);
    assert.equal(lock.hydrateWhenIdle({ doka: 200, xp: uiXp, level: 4 }), true);
    assert.equal(lock.snapshot().xp, 80);
  });

  it("notes unconfirmed XP when portal applyRewards adds then throws", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterXp = 80;
    let applyCalls = 0;
    const persisted = await persistIncrementalXpThroughLock(
      {
        applyRewards: async (_slot: bigint, _doka: bigint, xp: bigint) => {
          applyCalls += 1;
          canisterXp += Number(xp);
          throw new Error("replica reject after add");
        },
      },
      1,
      PORTAL_TRANSITION_XP,
      lock,
      {
        readCharacter: async () => ({
          experience: canisterXp,
          level: 4,
        }),
      },
    );
    assert.equal(applyCalls, 1);
    assert.equal(canisterXp, 90);
    assert.equal(persisted?.newXp, 90);
    assert.equal(lock.snapshot().xp, 90);
    assert.equal(lock.hasUnconfirmedXpCredit(), false);
  });

  it("skips the next saveBattleStats leftover write when confirm is stale", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterXp = 80;
    const kept = await persistIncrementalXpThroughLock(
      {
        applyRewards: async (_slot: bigint, _doka: bigint, xp: bigint) => {
          canisterXp += Number(xp);
          throw new Error("replica reject after add");
        },
      },
      1,
      PORTAL_TRANSITION_XP,
      lock,
      {
        readCharacter: async () => ({ experience: 80, level: 4 }),
      },
    );
    assert.equal(kept, null);
    assert.equal(canisterXp, 90);
    assert.equal(lock.hasUnconfirmedXpCredit(), true);
    assert.equal(lock.snapshot().xp, 80);

    await assert.rejects(
      () =>
        resolveCommittedXpForAbsoluteWrite(lock, async () => ({
          experience: 80,
          level: 4,
        })),
      /unconfirmed xp credit/,
    );
    const caughtUp = await resolveCommittedXpForAbsoluteWrite(
      lock,
      async () => ({ experience: canisterXp, level: 4 }),
    );
    assert.equal(caughtUp?.xp, 90);
    assert.equal(applySpendToCommitted(lock.snapshot().doka, 10), 190);
    assert.equal(lock.snapshot().xp, 90);
  });

  it("does not remint portal XP after a transport keep", async () => {
    let applyCalls = 0;
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    await persistIncrementalXpThroughLock(
      {
        applyRewards: async () => {
          applyCalls += 1;
          throw new Error("replica reject after add");
        },
      },
      1,
      PORTAL_TRANSITION_XP,
      lock,
      { readCharacter: async () => ({ experience: 80, level: 4 }) },
    );
    assert.equal(applyCalls, 1);
    assert.equal(lock.hasUnconfirmedXpCredit(), true);
  });
});

describe("persistBattleRewardsOnLock throw-after-add", () => {
  it("notes unconfirmed XP and Doka when victory applyRewards adds then throws", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterDoka = 200;
    let canisterXp = 80;
    await assert.rejects(
      persistBattleRewardsOnLock(
        {
          applyRewards: async (_slot: bigint, doka: bigint, xp: bigint) => {
            canisterDoka += Number(doka);
            canisterXp += Number(xp);
            throw new Error("replica reject after add");
          },
        },
        1,
        {
          victory: true,
          enemiesDefeated: [{ name: "rat", level: 2 }],
          completedChallenges: [],
          dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
          baseDoka: 50,
          baseXp: 40,
        },
        lock,
        {
          readCharacter: async () => ({ experience: 80, level: 4 }),
          readWallet: async () => 200,
        },
      ),
      /transport keep/,
    );
    assert.equal(canisterDoka, 250);
    assert.equal(canisterXp, 120);
    assert.equal(lock.hasUnconfirmedXpCredit(), true);
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    assert.equal(lock.snapshot().xp, 80);
    assert.equal(lock.snapshot().doka, 200);
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

  it("drops player-side summons so allied deaths cannot inflate applyRewards", () => {
    assert.deepEqual(
      selectDefeatedEnemiesForRewards(
        [],
        [
          { pieceType: "rat", level: 3, side: "enemy" },
          { pieceType: "wolf", level: 5, isSummon: true, side: "player" },
          { pieceType: "larva", level: 2, isSummon: true, side: "enemy" },
        ],
      ),
      [
        { name: "rat", level: 3 },
        { name: "larva", level: 2 },
      ],
    );
  });

  it("persists kill XP for hostiles only, not leftover wolf level * 20", () => {
    const defeated = selectDefeatedEnemiesForRewards(
      [],
      [
        { pieceType: "rat", level: 3, side: "enemy" },
        { pieceType: "wolf", level: 5, isSummon: true, side: "player" },
      ],
    );
    const baseXp = computeVictoryExp({
      defeatedEnemies: defeated,
      characterLevel: 4,
    });
    assert.equal(baseXp, 60, "rat 3*20; wolf 5*20 must not be added");
    const deltas = computeRewardDeltas({
      victory: true,
      enemiesDefeated: defeated,
      completedChallenges: [],
      dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
      baseDoka: defeated.length * 6,
      baseXp,
    });
    assert.equal(deltas.xpDelta, 60);
    assert.equal(deltas.dokaDelta, 6);
    assert.notEqual(
      computeVictoryExp({
        defeatedEnemies: [
          { name: "rat", level: 3 },
          { name: "wolf", level: 5 },
        ],
        characterLevel: 4,
      }),
      60,
      "unfiltered leftover roster used to persist 160 XP",
    );
  });
});
