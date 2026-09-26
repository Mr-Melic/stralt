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
  gateAdditiveCommitWhileUnconfirmed,
  persistClaimThroughUnconfirmedKeep,
  persistRedeemThroughUnconfirmedKeep,
  shouldCommitAdditiveCreditOnLock,
} from "./unconfirmedKeepAdditiveCommit.ts";

describe("seeded keep vs leftover additive claim/redeem commit", () => {
  it("refuses additive commit on a seeded unconfirmed lock", () => {
    assert.equal(
      shouldCommitAdditiveCreditOnLock({
        walletSeeded: true,
        unconfirmedWalletCredit: true,
      }),
      false,
    );
    assert.equal(
      shouldCommitAdditiveCreditOnLock({
        walletSeeded: true,
        unconfirmedWalletCredit: false,
      }),
      true,
    );
    assert.equal(
      shouldCommitAdditiveCreditOnLock({
        walletSeeded: false,
        unconfirmedWalletCredit: false,
      }),
      false,
    );
  });

  it("leftover feat #ok after keep saveBattleStats-wipes the 50 pickup at 290", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Ground Doka applyRewards +50 then throws. Keep.
    //    noteUnconfirmedCredit. Canister 250. Lock 200.
    // 3. Claim #ok(100). Leftover commit(200+100)=300 clears unconfirmed.
    //    Canister 350. Lock 300.
    // 4. Recap heal spends 10. Leftover resolve returns 300 with no fetch.
    // 5. saveBattleStats writes 290. Pickup gone.
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    leftover.noteUnconfirmedCredit();
    assert.equal(leftover.hasUnconfirmedWalletCredit(), true);

    const parsed = await creditAchievementRewardThroughPersist(
      {
        claimAchievementReward: async () => ({ ok: 100 }),
      },
      leftover,
      "doka_1000",
    );
    assert.deepEqual(parsed, { ok: 100 });
    assert.equal(leftover.snapshot().doka, 300);
    assert.equal(
      leftover.hasUnconfirmedWalletCredit(),
      false,
      "additive rise cleared the keep flag",
    );

    const stale = await resolveCommittedDokaForAbsoluteWrite(
      leftover,
      async () => {
        throw new Error("must not refetch a seeded confirmed lock");
      },
    );
    assert.equal(stale, 300);
    const wrote = applySpendToCommitted(stale ?? 0, 10);
    leftover.commit({ doka: wrote });
    assert.equal(wrote, 290);
  });

  it("does not saveBattleStats-wipe the kept pickup after a gated feat claim", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    guarded.noteUnconfirmedCredit();
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);

    const parsed = await persistClaimThroughUnconfirmedKeep(
      {
        claimAchievementReward: async () => ({ ok: 100 }),
      },
      guarded,
      "doka_1000",
    );
    assert.deepEqual(parsed, { ok: 100 });
    assert.equal(
      guarded.snapshot().doka,
      200,
      "additive #ok must not land on the pre-keep snapshot",
    );
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);

    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 350,
    );
    assert.equal(fetched, 350);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 340, "pickup + feat grant survived the recap heal");
    assert.equal(wrote > 290, true);
  });

  it("leftover GameKey #ok after keep saveBattleStats-wipes the pickup at 1190", async () => {
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    leftover.noteUnconfirmedCredit();

    const { result } = await redeemGameKeyThroughPersist(
      {
        redeemGameKey: async () => ({ ok: 1000 }),
      },
      leftover,
      "A".repeat(120),
    );
    assert.deepEqual(result, { ok: 1000 });
    assert.equal(leftover.snapshot().doka, 1200);
    assert.equal(leftover.hasUnconfirmedWalletCredit(), false);

    const stale = await resolveCommittedDokaForAbsoluteWrite(
      leftover,
      async () => {
        throw new Error("must not refetch a seeded confirmed lock");
      },
    );
    assert.equal(stale, 1200);
    const wrote = applySpendToCommitted(stale ?? 0, 10);
    leftover.commit({ doka: wrote });
    assert.equal(wrote, 1190);
  });

  it("does not saveBattleStats-wipe the kept pickup after a gated GameKey redeem", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    guarded.noteUnconfirmedCredit();

    const { result } = await persistRedeemThroughUnconfirmedKeep(
      {
        redeemGameKey: async () => ({ ok: 1000 }),
      },
      guarded,
      "A".repeat(120),
    );
    assert.deepEqual(result, { ok: 1000 });
    assert.equal(guarded.snapshot().doka, 200);
    assert.equal(guarded.hasUnconfirmedWalletCredit(), true);

    const fetched = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 1250,
    );
    assert.equal(fetched, 1250);
    const wrote = applySpendToCommitted(fetched ?? 0, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 1240, "pickup + GameKey grant survived the recap heal");
    assert.equal(wrote > 1190, true);
  });

  it("still commits a feat grant when the lock is confirmed", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
    const parsed = await persistClaimThroughUnconfirmedKeep(
      {
        claimAchievementReward: async () => ({ ok: 100 }),
      },
      lock,
      "doka_1000",
    );
    assert.deepEqual(parsed, { ok: 100 });
    assert.equal(lock.snapshot().doka, 300);
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
  });

  it("does not gate a raw absolute commit used by applyRewards newDoka", () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    lock.noteUnconfirmedCredit();
    const gated = gateAdditiveCommitWhileUnconfirmed(lock);
    gated.commit({ doka: 250 });
    assert.equal(lock.snapshot().doka, 200, "gated skip");
    lock.commit({ doka: 250 });
    assert.equal(lock.snapshot().doka, 250, "raw absolute newDoka still lands");
    assert.equal(lock.hasUnconfirmedWalletCredit(), false);
  });
});
