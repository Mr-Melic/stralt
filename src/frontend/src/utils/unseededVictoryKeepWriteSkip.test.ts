import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { persistBossRushRewardsThroughLock } from "../hooks/bossRushProgress.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  PREAPPLIED_REWARD_MULTIPLIER,
  resolveBattleRewards,
} from "./rewardResolver.ts";
import {
  ABSOLUTE_WRITE_UNSEEDED_VICTORY_KEEP,
  assertUnseededVictoryKeepAbsoluteWriteAllowed,
  clearUnseededVictoryKeepWriteSkip,
  hasUnseededVictoryKeepWriteSkip,
  noteUnseededVictoryKeepWriteSkip,
  shouldNoteUnseededVictoryTransportKeep,
  shouldSkipUnseededVictoryKeepAbsoluteWrite,
} from "./unseededVictoryKeepWriteSkip.ts";

describe("unseeded victory / Boss Rush keep vs stale absolute-write fetch", () => {
  it("notes transport-keep and not explicit applyRewards #err", () => {
    assert.equal(
      shouldNoteUnseededVictoryTransportKeep(
        new Error("replica reject after add"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededVictoryTransportKeep(
        new Error("applyRewards transport keep"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededVictoryTransportKeep(
        new Error("applyRewards missing ok payload"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededVictoryTransportKeep(
        new Error("applyRewards failed: Account banned"),
      ),
      false,
    );
    assert.equal(
      shouldNoteUnseededVictoryTransportKeep(new Error("applyRewards failed")),
      false,
    );
  });

  it("refuses every fetch while an unseeded victory keep is outstanding", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(shouldSkipUnseededVictoryKeepAbsoluteWrite(lock), false);
    noteUnseededVictoryKeepWriteSkip(
      lock,
      new Error("replica reject after add"),
    );
    assert.equal(hasUnseededVictoryKeepWriteSkip(lock), true);
    assert.equal(shouldSkipUnseededVictoryKeepAbsoluteWrite(lock), true);
    assert.throws(
      () => assertUnseededVictoryKeepAbsoluteWriteAllowed(lock),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_VICTORY_KEEP),
    );
  });

  it("does not saveBattleStats-wipe victory Doka via a stale pre-credit 200", async () => {
    // Chronology:
    // 1. World mounts. Lock doka=0 unseeded. Canister 200.
    // 2. Victory applyRewards adds 80 (canister 280) then throws.
    //    Commit never runs. noteUnconfirmedCredit only blocks idle hydrate.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka seeded 200
    //    (unconfirmedWalletCredit is false while unseeded) and wrote 190.
    const leftover = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    leftover.noteUnconfirmedCredit();
    leftover.seedWallet(200);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.isWalletSeeded(), true);
    assert.equal(leftover.snapshot().doka, 190);

    const guarded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededVictoryKeepWriteSkip(
      guarded,
      new Error("replica reject after add"),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededVictoryKeepWriteSkip(guarded), true);

    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 200,
    );
    assert.equal(skipped, null, "wrap throws; resolve swallows as null");
    assert.throws(
      () => assertUnseededVictoryKeepAbsoluteWriteAllowed(guarded),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_VICTORY_KEEP),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);

    guarded.commit({ doka: 280 });
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(shouldSkipUnseededVictoryKeepAbsoluteWrite(guarded), false);
    const wrote = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 270);
    assert.equal(wrote > 190, true, "victory grant survived the recap heal");
  });

  it("does not note a skip on a seeded lock (existing unconfirmed path owns that)", () => {
    const seeded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteUnseededVictoryKeepWriteSkip(
      seeded,
      new Error("replica reject after add"),
    );
    assert.equal(seeded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededVictoryKeepWriteSkip(seeded), false);
    assert.equal(shouldSkipUnseededVictoryKeepAbsoluteWrite(seeded), false);
    clearUnseededVictoryKeepWriteSkip(seeded);
    assert.equal(hasUnseededVictoryKeepWriteSkip(seeded), false);
  });

  it("does not note a skip after an explicit applyRewards #err", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededVictoryKeepWriteSkip(
      lock,
      new Error("applyRewards failed: Account banned"),
    );
    assert.equal(hasUnseededVictoryKeepWriteSkip(lock), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(fetched, 200);
    assert.equal(lock.isWalletSeeded(), true);
  });

  it("notes skip from persistBossRushRewardsThroughLock after applyRewards throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    await assert.rejects(
      persistBossRushRewardsThroughLock(
        lock,
        async () => undefined,
        async () => {
          throw new Error("replica reject after add");
        },
      ),
      /replica reject after add/,
    );
    assert.equal(lock.isWalletSeeded(), false);
    assert.equal(hasUnseededVictoryKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.snapshot().doka, 0);
  });

  it("does not note skip when persistRoomClear throws before applyRewards", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    await assert.rejects(
      persistBossRushRewardsThroughLock(
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
    assert.equal(hasUnseededVictoryKeepWriteSkip(lock), false);
  });

  it("notes skip from resolveBattleRewards throw inside persistBossRushRewardsThroughLock", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    await assert.rejects(
      persistBossRushRewardsThroughLock(
        lock,
        async () => undefined,
        () =>
          resolveBattleRewards(
            {
              applyRewards: async () => {
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
    assert.equal(hasUnseededVictoryKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
  });
});
