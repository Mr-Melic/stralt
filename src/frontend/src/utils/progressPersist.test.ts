import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applySpendToCommitted,
  createProgressPersist,
  spendFromUiBalance,
} from "./progressPersist.ts";

describe("spend math", () => {
  it("treats a UI heal/shop deduct as a non-negative spend", () => {
    assert.equal(spendFromUiBalance(200, 170), 30);
    assert.equal(spendFromUiBalance(0, 0), 0);
    assert.equal(spendFromUiBalance(10, 50), 0);
  });

  it("applies the spend to the last committed wallet", () => {
    assert.equal(applySpendToCommitted(250, 30), 220);
    assert.equal(applySpendToCommitted(10, 30), 0);
  });
});

describe("progress persist lock", () => {
  it("does not hydrate while a write is in flight", () => {
    const lock = createProgressPersist({ doka: 200, xp: 50, level: 4 });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const pending = lock.enqueue(async () => {
      await gate;
    });

    assert.equal(lock.pendingCount(), 1);
    assert.equal(lock.hydrateWhenIdle({ doka: 1, xp: 1, level: 1 }), false);
    assert.deepEqual(lock.snapshot(), { doka: 200, xp: 50, level: 4 });

    release();
    return pending.then(() => {
      assert.equal(lock.pendingCount(), 0);
      assert.equal(lock.hydrateWhenIdle({ doka: 500, xp: 80, level: 5 }), true);
      assert.deepEqual(lock.snapshot(), { doka: 500, xp: 80, level: 5 });
    });
  });

  it("lets a post-victory heal persist against rewarded Doka/XP, not the click-time snapshot", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 50, level: 4 });
    let backendDoka = 200;
    let backendXp = 50;
    let backendLevel = 4;

    let releaseReward!: () => void;
    const rewardGate = new Promise<void>((resolve) => {
      releaseReward = resolve;
    });

    const reward = lock.enqueue(async () => {
      await rewardGate;
      backendDoka += 50;
      backendXp += 80;
      backendLevel = 5;
      lock.commit({ doka: backendDoka, xp: backendXp, level: backendLevel });
    });

    // Player heals during the recap: local UI still shows 200, spend is 30.
    const spend = spendFromUiBalance(200, 170);
    let wroteDoka = 0;
    let wroteXp = 0;
    let wroteLevel = 0;
    const heal = lock.enqueue(async () => {
      const committed = lock.snapshot();
      wroteDoka = applySpendToCommitted(committed.doka, spend);
      wroteXp = committed.xp;
      wroteLevel = committed.level;
      backendDoka = wroteDoka;
      backendXp = wroteXp;
      backendLevel = wroteLevel;
      lock.commit({ doka: wroteDoka });
    });

    releaseReward();
    await Promise.all([reward, heal]);

    assert.equal(wroteDoka, 220);
    assert.equal(wroteXp, 130);
    assert.equal(wroteLevel, 5);
    assert.equal(backendDoka, 220);
    assert.equal(backendXp, 130);
    assert.equal(backendLevel, 5);
  });

  it("keeps a shop credit that lands through the lock ahead of a queued heal", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 50, level: 4 });
    let backendDoka = 200;

    const credit = lock.enqueue(async () => {
      backendDoka += 500;
      lock.commit({ doka: backendDoka });
    });

    const spend = spendFromUiBalance(200, 170);
    let wroteDoka = 0;
    const heal = lock.enqueue(async () => {
      wroteDoka = applySpendToCommitted(lock.snapshot().doka, spend);
      backendDoka = wroteDoka;
      lock.commit({ doka: wroteDoka });
    });

    await Promise.all([credit, heal]);

    assert.equal(wroteDoka, 670);
    assert.equal(backendDoka, 670);
    assert.deepEqual(lock.snapshot(), { doka: 670, xp: 50, level: 4 });
  });

  it("keeps a shop credit that lands while applyRewards is in flight", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 50, level: 4 });
    let backendDoka = 200;

    let releaseReward!: () => void;
    const rewardGate = new Promise<void>((resolve) => {
      releaseReward = resolve;
    });

    const reward = lock.enqueue(async () => {
      await rewardGate;
      backendDoka += 50;
      lock.commit({ doka: backendDoka });
    });

    // processPendingPurchases is additive on the canister. Serialized on the
    // same lock it sees the rewarded wallet; a later heal then spends from
    // that total instead of persisting the pre-purchase snapshot.
    const credit = lock.enqueue(async () => {
      backendDoka += 500;
      lock.commit({ doka: backendDoka });
    });

    let wroteDoka = 0;
    const heal = lock.enqueue(async () => {
      const committed = lock.snapshot().doka;
      wroteDoka = applySpendToCommitted(committed, 1);
      backendDoka = wroteDoka;
      lock.commit({ doka: wroteDoka });
    });

    releaseReward();
    await Promise.all([reward, credit, heal]);

    assert.equal(wroteDoka, 749);
    assert.equal(lock.snapshot().doka, 749);
    assert.equal(backendDoka, 749);
  });
});
