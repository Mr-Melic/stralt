import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { creditAchievementRewardThroughPersist } from "./achievementReward.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
} from "./progressPersist.ts";
import { redeemGameKeyThroughPersist } from "./shopPurchase.ts";
import {
  ABSOLUTE_WRITE_UNSEEDED_REDEEM_KEEP,
  assertUnseededRedeemKeepAbsoluteWriteAllowed,
  clearUnseededRedeemKeepWriteSkip,
  hasUnseededRedeemKeepWriteSkip,
  noteUnseededRedeemKeepWriteSkip,
  persistClaimThroughLock,
  persistRedeemThroughLock,
  shouldNoteUnseededRedeemTransportKeep,
  shouldSkipUnseededRedeemKeepAbsoluteWrite,
} from "./unseededRedeemKeepWriteSkip.ts";

describe("unseeded GameKey / feat keep vs stale absolute-write fetch", () => {
  it("notes transport-keep and not explicit redeem / claim #err", () => {
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(
        new Error("replica reject after add"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(
        new Error("redeemGameKey transport keep"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(
        new Error("redeemGameKey missing Doka amount"),
      ),
      true,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(
        new Error("redeemGameKey failed: Account banned"),
      ),
      false,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(new Error("GameKey already used")),
      false,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(new Error("Invalid GameKey")),
      false,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(
        new Error("GameKey is not yet approved"),
      ),
      false,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(
        new Error("claimAchievementReward failed: already claimed"),
      ),
      false,
    );
    assert.equal(
      shouldNoteUnseededRedeemTransportKeep(new Error("applyRewards failed")),
      false,
    );
  });

  it("refuses every fetch while an unseeded redeem keep is outstanding", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(shouldSkipUnseededRedeemKeepAbsoluteWrite(lock), false);
    noteUnseededRedeemKeepWriteSkip(
      lock,
      new Error("replica reject after add"),
    );
    assert.equal(hasUnseededRedeemKeepWriteSkip(lock), true);
    assert.equal(shouldSkipUnseededRedeemKeepAbsoluteWrite(lock), true);
    assert.throws(
      () => assertUnseededRedeemKeepAbsoluteWriteAllowed(lock),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_REDEEM_KEEP),
    );
  });

  it("does not saveBattleStats-wipe GameKey via a stale pre-credit 200", async () => {
    // Chronology:
    // 1. World mounts. Lock doka=0 unseeded. Canister 200.
    // 2. redeemGameKey adds 1000 (canister 1200) then throws. #ok never
    //    parsed. Commit never runs. noteUnconfirmedCredit only blocks
    //    idle hydrate.
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
    noteUnseededRedeemKeepWriteSkip(
      guarded,
      new Error("replica reject after add"),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededRedeemKeepWriteSkip(guarded), true);

    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 200,
    );
    assert.equal(skipped, null, "wrap throws; resolve swallows as null");
    assert.throws(
      () => assertUnseededRedeemKeepAbsoluteWriteAllowed(guarded),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_REDEEM_KEEP),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);

    guarded.commit({ doka: 1200 });
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(shouldSkipUnseededRedeemKeepAbsoluteWrite(guarded), false);
    const wrote = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 1190);
    assert.equal(wrote > 190, true, "GameKey grant survived the recap heal");
  });

  it("does not note a skip on a seeded lock (existing unconfirmed path owns that)", () => {
    const seeded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteUnseededRedeemKeepWriteSkip(
      seeded,
      new Error("replica reject after add"),
    );
    assert.equal(seeded.hasUnconfirmedWalletCredit(), false);
    assert.equal(hasUnseededRedeemKeepWriteSkip(seeded), false);
    assert.equal(shouldSkipUnseededRedeemKeepAbsoluteWrite(seeded), false);
    clearUnseededRedeemKeepWriteSkip(seeded);
    assert.equal(hasUnseededRedeemKeepWriteSkip(seeded), false);
  });

  it("does not note a skip after an explicit redeem #err", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededRedeemKeepWriteSkip(lock, new Error("GameKey already used"));
    assert.equal(hasUnseededRedeemKeepWriteSkip(lock), false);
    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(fetched, 200);
    assert.equal(lock.isWalletSeeded(), true);
  });

  it("notes skip from persistRedeemThroughLock after redeem throw-after-add", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    await assert.rejects(
      persistRedeemThroughLock(lock, async () => {
        throw new Error("replica reject after add");
      }),
      /replica reject after add/,
    );
    assert.equal(lock.isWalletSeeded(), false);
    assert.equal(hasUnseededRedeemKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.snapshot().doka, 0);
  });

  it("notes skip from the shop persist catch after enqueue rejects", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    try {
      await lock.enqueue(async () => {
        throw new Error("replica reject after add");
      });
    } catch (persistErr) {
      noteUnseededRedeemKeepWriteSkip(lock, persistErr);
    }
    assert.equal(hasUnseededRedeemKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.isWalletSeeded(), false);
  });

  it("notes skip from redeemGameKeyThroughPersist throw inside persistRedeemThroughLock", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    let canisterDoka = 200;
    await assert.rejects(
      persistRedeemThroughLock(lock, () =>
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
    assert.equal(lock.isWalletSeeded(), false);
    assert.equal(hasUnseededRedeemKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.snapshot().doka, 0, "lock leftover stays pre-redeem");
  });

  it("notes skip from creditAchievementRewardThroughPersist throw inside persistClaimThroughLock", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    let canisterDoka = 200;
    await assert.rejects(
      persistClaimThroughLock(lock, () =>
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
    assert.equal(hasUnseededRedeemKeepWriteSkip(lock), true);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      lock,
      async () => 200,
    );
    assert.equal(skipped, null);
    assert.equal(lock.snapshot().doka, 0);
  });
});
