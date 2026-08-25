import assert from "node:assert/strict";
import {
  persistIncrementalRewards,
  readApplyRewardsOk,
} from "./applyRewardsResult.ts";

function testReadApplyRewardsOk() {
  const ok = readApplyRewardsOk({
    ok: { newDoka: 12, newXp: 40, newLevel: 2 },
  });
  assert.deepEqual(ok, { newDoka: 12, newXp: 40, newLevel: 2 });

  const underscored = readApplyRewardsOk({
    _ok: { newDoka: 1n, newXp: 9n, newLevel: 1n },
  });
  assert.deepEqual(underscored, { newDoka: 1, newXp: 9, newLevel: 1 });

  const kinded = readApplyRewardsOk({
    __kind__: "ok",
    ok: { newDoka: 5, newXp: 15, newLevel: 1 },
  });
  assert.deepEqual(kinded, { newDoka: 5, newXp: 15, newLevel: 1 });

  assert.throws(
    () => readApplyRewardsOk({ err: "Anonymous caller" }),
    /Anonymous caller/,
  );
  assert.throws(
    () => readApplyRewardsOk({ __kind__: "err", err: "Account banned" }),
    /Account banned/,
  );
  assert.throws(() => readApplyRewardsOk(null), /empty result/);
}

async function testPersistIncrementalRewards() {
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
}

testReadApplyRewardsOk();
await testPersistIncrementalRewards();
console.log("rewardResolver persist tests passed");
