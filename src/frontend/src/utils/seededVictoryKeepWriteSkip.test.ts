import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { persistBossRushRewardsThroughLock } from "../hooks/bossRushProgress.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  PREAPPLIED_REWARD_MULTIPLIER,
  resolveBattleRewards,
} from "./rewardResolver.ts";
import {
  noteSeededVictoryKeepWriteSkip,
  persistSeededBossRushRewardsThroughLock,
  persistSeededHandleBattleEndRewardsThroughLock,
  shouldNoteSeededVictoryTransportKeep,
} from "./seededVictoryKeepWriteSkip.ts";

describe("seeded victory / Boss Rush keep vs leftover absolute-write snapshot", () => {
  it("notes transport-keep and not explicit applyRewards #err", () => {
    assert.equal(
      shouldNoteSeededVictoryTransportKeep(
        new Error("replica reject after add"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededVictoryTransportKeep(
        new Error("applyRewards transport keep"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededVictoryTransportKeep(
        new Error("applyRewards missing ok payload"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededVictoryTransportKeep(
        new Error("applyRewards failed: Account banned"),
      ),
      false,
    );
    assert.equal(
      shouldNoteSeededVictoryTransportKeep(new Error("applyRewards failed")),
      false,
    );
  });

  it("does not note on an unseeded lock (older persist PR owns that wrap)", () => {
    const unseeded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteSeededVictoryKeepWriteSkip(
      unseeded,
      new Error("replica reject after add"),
    );
    assert.equal(unseeded.isWalletSeeded(), false);
    assert.equal(unseeded.hasUnconfirmedWalletCredit(), false);
  });

  it("leftover seeded room-clear throw-after-add saveBattleStats-wipes at 190", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Room-clear applyRewards adds 80 (canister 280) then throws.
    //    Commit never runs. unconfirmedWalletCredit stays false.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka returns 200
    //    immediately (seeded && !unconfirmed) and wrote 190.
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    assert.equal(leftover.isWalletSeeded(), true);
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    await assert.rejects(
      persistBossRushRewardsThroughLock(
        leftover,
        async () => undefined,
        async () => {
          throw new Error("replica reject after add");
        },
      ),
      /replica reject after add/,
    );
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);
    const stale = await resolveCommittedDokaForAbsoluteWrite(
      leftover,
      async () => {
        throw new Error("must not refetch a seeded confirmed lock");
      },
    );
    assert.equal(stale, 200);
    leftover.commit({ doka: applySpendToCommitted(stale ?? 0, 10) });
    assert.equal(leftover.snapshot().doka, 190);
  });

  it("does not saveBattleStats-wipe victory Doka via the pre-credit 200 snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededVictoryKeepWriteSkip(
      guarded,
      new Error("replica reject after add"),
    );
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);

    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(guarded, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(guarded.snapshot().doka, 200);
    assert.equal(guarded.isWalletSeeded(), true);

    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 280,
    );
    assert.equal(fetched, 280);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 270);
    assert.equal(wrote > 190, true, "victory grant survived the recap heal");
  });

  it("does not note after an explicit applyRewards #err so a later heal can persist", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededVictoryKeepWriteSkip(
      lock,
      new Error("applyRewards failed: Account banned"),
    );
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => {
        throw new Error("must not refetch");
      },
    );
    assert.equal(fetched, 200);
  });

  it("notes unconfirmed from persistSeededBossRushRewardsThroughLock after throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    await assert.rejects(
      persistSeededBossRushRewardsThroughLock(
        lock,
        async () => undefined,
        async () => {
          throw new Error("replica reject after add");
        },
      ),
      /replica reject after add/,
    );
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(lock.snapshot().doka, 200);
  });

  it("does not note when persistRoomClear throws before applyRewards", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    await assert.rejects(
      persistSeededBossRushRewardsThroughLock(
        lock,
        async () => {
          throw new Error("replica timeout");
        },
        async () => {
          throw new Error("replica reject after add");
        },
      ),
      /replica timeout/,
    );
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => {
        throw new Error("must not refetch");
      },
    );
    assert.equal(fetched, 200);
  });

  it("notes unconfirmed from the WorldExploration persist catch after enqueue rejects", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    try {
      await lock.enqueue(async () => {
        throw new Error("replica reject after add");
      });
    } catch (persistErr) {
      noteSeededVictoryKeepWriteSkip(lock, persistErr);
    }
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });

  it("notes unconfirmed from resolveBattleRewards throw inside persistSeededBossRushRewardsThroughLock", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterDoka = 200;
    await assert.rejects(
      persistSeededBossRushRewardsThroughLock(
        lock,
        async () => undefined,
        () =>
          resolveBattleRewards(
            {
              applyRewards: async () => {
                canisterDoka += 80;
                throw new Error("replica reject after add");
              },
            },
            1,
            {
              victory: true,
              enemiesDefeated: [{ name: "rat", level: 2 }],
              completedChallenges: [],
              dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
              baseDoka: 80,
              baseXp: 40,
            },
          ),
      ),
      /replica reject after add/,
    );
    assert.equal(canisterDoka, 280);
    assert.equal(lock.isWalletSeeded(), true);
    assert.equal(lock.snapshot().doka, 200, "lock leftover stays pre-credit");
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 280,
    );
    assert.equal(fetched, 280);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 270);
  });

  it("notes unconfirmed from persistSeededHandleBattleEndRewardsThroughLock after throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterDoka = 200;
    await assert.rejects(
      persistSeededHandleBattleEndRewardsThroughLock(lock, () =>
        resolveBattleRewards(
          {
            applyRewards: async () => {
              canisterDoka += 80;
              throw new Error("replica reject after add");
            },
          },
          1,
          {
            victory: true,
            enemiesDefeated: [{ name: "rat", level: 2 }],
            completedChallenges: [],
            dungeonMultiplier: PREAPPLIED_REWARD_MULTIPLIER,
            baseDoka: 80,
            baseXp: 40,
          },
        ),
      ),
      /replica reject after add/,
    );
    assert.equal(canisterDoka, 280);
    assert.equal(lock.snapshot().doka, 200);
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 280,
    );
    assert.equal(fetched, 280);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 270, "handleBattleEnd grant survived the recap heal");
  });
});
