import assert from "node:assert/strict";
import {
  committedDokaAfterAchievementCredit,
  creditAchievementRewardThroughPersist,
  readClaimAchievementReward,
  shouldInvalidateCallerDokaAfterClaim,
} from "./achievementReward.ts";
import {
  applyShopCreditDeltaToUi,
  applySpendToCommitted,
  createProgressPersist,
  spendFromUiBalance,
} from "./progressPersist.ts";

assert.deepEqual(readClaimAchievementReward({ __kind__: "ok", ok: 500n }), {
  ok: 500,
});
assert.deepEqual(readClaimAchievementReward({ ok: 250 }), { ok: 250 });
assert.deepEqual(
  readClaimAchievementReward({ __kind__: "err", err: "already claimed" }),
  { err: "already claimed" },
);
assert.equal(readClaimAchievementReward(undefined).err != null, true);

assert.equal(committedDokaAfterAchievementCredit(200, 500), 700);
assert.equal(committedDokaAfterAchievementCredit(0, 100), 100);

void (async () => {
  // Victory applyRewards is in flight. Player claims a feat, then heals.
  // Without the lock the heal writes the pre-claim snapshot and wipes 500.
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

  let claimed = 0;
  const claim = creditAchievementRewardThroughPersist(
    {
      claimAchievementReward: async () => {
        claimed += 1;
        backendDoka += 500;
        return { __kind__: "ok", ok: 500n };
      },
    },
    lock,
    "first_blood",
  );

  const spend = spendFromUiBalance(750, 720);
  let wroteDoka = 0;
  const heal = lock.enqueue(async () => {
    wroteDoka = applySpendToCommitted(lock.snapshot().doka, spend);
    backendDoka = wroteDoka;
    lock.commit({ doka: wroteDoka });
  });

  releaseReward();
  assert.deepEqual(await claim, { ok: 500 });
  await Promise.all([reward, heal]);

  assert.equal(claimed, 1);
  assert.equal(wroteDoka, 720);
  assert.equal(backendDoka, 720);
  assert.equal(lock.snapshot().doka, 720);

  // Heal already queued; claim must still land before the absolute write.
  backendDoka = 200;
  const lock2 = createProgressPersist({ doka: 200, xp: 50, level: 4 });
  const spend2 = spendFromUiBalance(200, 170);
  let wrote2 = 0;
  const healFirst = lock2.enqueue(async () => {
    wrote2 = applySpendToCommitted(lock2.snapshot().doka, spend2);
    backendDoka = wrote2;
    lock2.commit({ doka: wrote2 });
  });
  const claimAfter = creditAchievementRewardThroughPersist(
    {
      claimAchievementReward: async () => {
        backendDoka += 500;
        return { ok: 500 };
      },
    },
    lock2,
    "first_blood",
  );
  await Promise.all([healFirst, claimAfter]);
  assert.equal(wrote2, 170);
  assert.equal(backendDoka, 670);
  assert.equal(lock2.snapshot().doka, 670);

  const rejected = await creditAchievementRewardThroughPersist(
    {
      claimAchievementReward: async () => ({
        __kind__: "err",
        err: "already claimed",
      }),
    },
    createProgressPersist({ doka: 200 }),
    "first_blood",
  );
  assert.deepEqual(rejected, { err: "already claimed" });

  // UI already deducted a heal while the claim waited on the lock.
  assert.equal(applyShopCreditDeltaToUi(170, 500), 670);

  // persistClaim already committed the grant. An absolute callerDokaBalance
  // refetch (the post-claim invalidate) returns the pre-heal backend and
  // hydrateWhenIdle copies that refund into committed.
  assert.equal(shouldInvalidateCallerDokaAfterClaim(true), false);
  assert.equal(shouldInvalidateCallerDokaAfterClaim(false), true);
  const afterClaimAndHeal = createProgressPersist({
    doka: 720,
    xp: 50,
    level: 4,
  });
  const refetchBeforeHealLanded = 750;
  const uiAfterDelta = applyShopCreditDeltaToUi(170, 500);
  assert.equal(uiAfterDelta, 670);
  afterClaimAndHeal.hydrateWhenIdle({
    doka: refetchBeforeHealLanded,
    xp: 50,
    level: 4,
  });
  assert.equal(afterClaimAndHeal.snapshot().doka, 750);

  console.log("achievementReward.test: ok");
})();
