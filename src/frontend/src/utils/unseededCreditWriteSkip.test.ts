import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { creditAchievementRewardThroughPersist } from "./achievementReward.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
  resolveCommittedDokaForAbsoluteWrite,
  spendFromUiBalance,
} from "./progressPersist.ts";
import { redeemGameKeyThroughPersist } from "./shopPurchase.ts";
import {
  committedDokaAfterSpellUpgrade,
  shouldCommitSpellUpgradeDoka,
} from "./spellUpgrade.ts";
import {
  ABSOLUTE_WRITE_UNSEEDED_CREDIT,
  assertUnseededCreditAbsoluteWriteAllowed,
  clearUnseededCreditWriteSkip,
  getUnseededCreditWriteSkipFloor,
  noteUnseededCreditWriteSkip,
  shouldCommitSpellUpgradeAfterUnseededCredit,
  shouldSkipUnseededCreditAbsoluteWrite,
} from "./unseededCreditWriteSkip.ts";

describe("unseeded small feat grant vs stale absolute-write fetch", () => {
  it("refuses every fetch while an unseeded #ok is outstanding", () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    assert.equal(shouldSkipUnseededCreditAbsoluteWrite(lock), false);
    noteUnseededCreditWriteSkip(lock, 100);
    assert.equal(getUnseededCreditWriteSkipFloor(lock), 100);
    assert.equal(shouldSkipUnseededCreditAbsoluteWrite(lock), true);
    assert.throws(
      () => assertUnseededCreditAbsoluteWriteAllowed(lock),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_CREDIT),
    );
  });

  it("does not saveBattleStats-wipe a 100 Doka feat via a stale pre-credit 200", async () => {
    // Chronology:
    // 1. World mounts. Lock doka=0 unseeded. Canister 200.
    // 2. claimAchievementReward #ok(100). Canister 300. Lock stays 0.
    // 3. Recap heal spends 10. Leftover resolveCommittedDoka seeded 200
    //    (200 >= grant 100, so #482's live < floor test accepts) and wrote 190.
    const canister = 300;
    const leftover = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    leftover.noteUnseededCredit();
    leftover.seedWallet(200);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.snapshot().doka, 190);

    const guarded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    guarded.noteUnseededCredit();
    noteUnseededCreditWriteSkip(guarded, 100);
    const skipped = await resolveCommittedDokaForAbsoluteWrite(
      guarded,
      async () => 200,
    );
    assert.equal(skipped, null, "wrap throws; resolve swallows as null");
    assert.throws(
      () => assertUnseededCreditAbsoluteWriteAllowed(guarded),
      new RegExp(ABSOLUTE_WRITE_UNSEEDED_CREDIT),
    );
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);
    assert.equal(getUnseededCreditWriteSkipFloor(guarded), 100);

    guarded.commit({ doka: canister });
    assert.equal(guarded.isWalletSeeded(), true);
    assert.equal(shouldSkipUnseededCreditAbsoluteWrite(guarded), false);
    assert.equal(getUnseededCreditWriteSkipFloor(guarded), 0);
    const wrote = applySpendToCommitted(guarded.snapshot().doka, 10);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 290);
    assert.equal(wrote > 190, true, "feat grant survived the recap heal");
  });

  it("notes a floor only while the lock is still a placeholder", () => {
    const unseeded = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    noteUnseededCreditWriteSkip(unseeded, 100);
    assert.equal(getUnseededCreditWriteSkipFloor(unseeded), 100);
    noteUnseededCreditWriteSkip(unseeded, 1000);
    assert.equal(getUnseededCreditWriteSkipFloor(unseeded), 1100);

    const seeded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    noteUnseededCreditWriteSkip(seeded, 100);
    assert.equal(getUnseededCreditWriteSkipFloor(seeded), 0);
    clearUnseededCreditWriteSkip(seeded);
    assert.equal(getUnseededCreditWriteSkipFloor(seeded), 0);
  });
});

describe("unseeded spell-upgrade commit after GameKey/feat #ok", () => {
  it("does not commit a stale pre-credit query onto the lock", () => {
    // Chronology:
    // 1. Unseeded lock 0. redeemGameKey #ok(1000). Canister 1200.
    // 2. upgradeSpell. committedBefore=0. Stale getCallerDokaBalance=200.
    // 3. committedDokaAfterSpellUpgrade(0, 200, cost) returns 200.
    // 4. Leftover commit({ doka: 200 }) seeds. Recap heal writes 190.
    const leftover = createProgressPersist({ doka: 0, xp: 0, level: 1 });
    leftover.noteUnseededCredit();
    const next = committedDokaAfterSpellUpgrade(0, 200, 10);
    assert.equal(next, 200);
    leftover.commit({ doka: next });
    assert.equal(leftover.isWalletSeeded(), true);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.snapshot().doka, 190);

    const guarded = createProgressPersist({ doka: 0, xp: 0, level: 1 });
    guarded.noteUnseededCredit();
    noteUnseededCreditWriteSkip(guarded, 1000);
    assert.equal(shouldCommitSpellUpgradeAfterUnseededCredit(guarded), false);
    assert.equal(shouldCommitSpellUpgradeDoka(0, 200, false, guarded), false);
    assert.equal(guarded.isWalletSeeded(), false);
    assert.equal(guarded.snapshot().doka, 0);

    guarded.commit({ doka: 1190 });
    assert.equal(shouldCommitSpellUpgradeAfterUnseededCredit(guarded), true);
    const spend = spendFromUiBalance(1000, 990);
    const wrote = applySpendToCommitted(guarded.snapshot().doka, spend);
    guarded.commit({ doka: wrote });
    assert.equal(wrote, 1180);
  });

  it("still allows unseeded upgrade query-seed when no prior #ok floor", () => {
    const lock = createProgressPersist({ doka: 0, xp: 0, level: 1 });
    assert.equal(shouldCommitSpellUpgradeAfterUnseededCredit(lock), true);
    assert.equal(shouldCommitSpellUpgradeDoka(0, 190, false, lock), true);
  });
});

describe("unseeded #ok helpers note the write-skip floor", () => {
  it("notes a feat grant so recap heal cannot seed 200 over a 100 credit", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    const parsed = await creditAchievementRewardThroughPersist(
      { claimAchievementReward: async () => ({ ok: 100 }) },
      lock,
      "first_blood",
    );
    assert.deepEqual(parsed, { ok: 100 });
    assert.equal(lock.isWalletSeeded(), false);
    assert.equal(getUnseededCreditWriteSkipFloor(lock), 100);
    assert.equal(shouldSkipUnseededCreditAbsoluteWrite(lock), true);
  });

  it("notes a GameKey grant so spell-upgrade cannot commit a stale 200", async () => {
    const lock = createProgressPersist({ doka: 0, xp: 80, level: 4 });
    const kept = await redeemGameKeyThroughPersist(
      { redeemGameKey: async () => ({ ok: 1000 }) },
      lock,
      "A".repeat(120),
    );
    assert.equal("ok" in kept.result, true);
    assert.equal(lock.isWalletSeeded(), false);
    assert.equal(getUnseededCreditWriteSkipFloor(lock), 1000);
    assert.equal(shouldCommitSpellUpgradeAfterUnseededCredit(lock), false);
  });
});
