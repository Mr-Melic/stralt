import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { creditAchievementRewardThroughPersist } from "./achievementReward.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import {
  noteSeededCreditKeepWriteSkip,
  persistSeededClaimThroughLock,
  persistSeededRedeemThroughLock,
  shouldNoteSeededCreditTransportKeep,
} from "./seededCreditKeepWriteSkip.ts";
import { redeemGameKeyThroughPersist } from "./shopPurchase.ts";

describe("seeded GameKey / feat keep vs leftover absolute-write snapshot", () => {
  it("notes transport-keep and not explicit redeem / claim #err", () => {
    assert.equal(
      shouldNoteSeededCreditTransportKeep(
        new Error("replica reject after add"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(
        new Error("redeemGameKey transport keep"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(
        new Error("redeemGameKey missing Doka amount"),
      ),
      true,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(
        new Error("redeemGameKey failed: Account banned"),
      ),
      false,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(new Error("GameKey already used")),
      false,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(new Error("Invalid GameKey")),
      false,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(
        new Error("GameKey is not yet approved"),
      ),
      false,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(
        new Error("claimAchievementReward failed: already claimed"),
      ),
      false,
    );
    assert.equal(
      shouldNoteSeededCreditTransportKeep(new Error("applyRewards failed")),
      false,
    );
  });

  it("does not note on an unseeded lock (older persist PR owns that wrap)", () => {
    const unseeded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteSeededCreditKeepWriteSkip(
      unseeded,
      new Error("replica reject after add"),
    );
    assert.equal(unseeded.isWalletSeeded(), false);
    assert.equal(unseeded.hasUnconfirmedWalletCredit(), false);
  });

  it("leftover seeded redeem throw-after-add saveBattleStats-wipes at 190", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. redeemGameKey adds 1000 (canister 1200) then throws. #ok never
    //    parsed. Commit never runs. unconfirmedWalletCredit stays false.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka returns 200
    //    immediately (seeded && !unconfirmed) and wrote 190.
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    assert.equal(leftover.isWalletSeeded(), true);
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

  it("does not saveBattleStats-wipe GameKey via the pre-credit 200 snapshot", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededCreditKeepWriteSkip(
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
      async () => 1200,
    );
    assert.equal(fetched, 1200);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 1190);
    assert.equal(wrote > 190, true, "GameKey grant survived the recap heal");
  });

  it("does not note after an explicit redeem #err so a later heal can persist", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteSeededCreditKeepWriteSkip(lock, new Error("GameKey already used"));
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => {
        throw new Error("must not refetch");
      },
    );
    assert.equal(fetched, 200);
  });

  it("notes unconfirmed from persistSeededRedeemThroughLock after throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    await assert.rejects(
      persistSeededRedeemThroughLock(lock, async () => {
        throw new Error("replica reject after add");
      }),
      /replica reject after add/,
    );
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    assert.equal(lock.snapshot().doka, 200);
  });

  it("notes unconfirmed from the shop persist catch after enqueue rejects", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    try {
      await lock.enqueue(async () => {
        throw new Error("replica reject after add");
      });
    } catch (persistErr) {
      noteSeededCreditKeepWriteSkip(lock, persistErr);
    }
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
  });

  it("notes unconfirmed from redeemGameKeyThroughPersist throw inside persistSeededRedeemThroughLock", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterDoka = 200;
    await assert.rejects(
      persistSeededRedeemThroughLock(lock, () =>
        redeemGameKeyThroughPersist(
          {
            redeemGameKey: async () => {
              canisterDoka += 1000;
              throw new Error("replica reject after add");
            },
          },
          lock,
          "A".repeat(120),
        ),
      ),
      /replica reject after add/,
    );
    assert.equal(canisterDoka, 1200);
    assert.equal(lock.isWalletSeeded(), true);
    assert.equal(lock.snapshot().doka, 200, "lock leftover stays pre-redeem");
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 1200,
    );
    assert.equal(fetched, 1200);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 1190);
  });

  it("notes unconfirmed from creditAchievementRewardThroughPersist throw inside persistSeededClaimThroughLock", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    let canisterDoka = 200;
    await assert.rejects(
      persistSeededClaimThroughLock(lock, () =>
        creditAchievementRewardThroughPersist(
          {
            claimAchievementReward: async () => {
              canisterDoka += 100;
              throw new Error("replica reject after add");
            },
          },
          lock,
          "doka_1000",
        ),
      ),
      /replica reject after add/,
    );
    assert.equal(canisterDoka, 300);
    assert.equal(lock.snapshot().doka, 200);
    assert.equal(lock.hasUnconfirmedWalletCredit(), true);
    await assert.rejects(
      () => resolveCommittedDokaForAbsoluteWrite(lock, async () => 200),
      new RegExp(ABSOLUTE_WRITE_UNCONFIRMED_CREDIT),
    );
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 300,
    );
    assert.equal(fetched, 300);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    lock.commit({ doka: wrote });
    assert.equal(wrote, 290, "feat grant survived the recap heal");
  });
});
