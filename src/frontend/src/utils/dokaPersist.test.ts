import assert from "node:assert/strict";
import {
  persistDokaCredit,
  persistDokaCreditAmount,
  persistDokaCreditResult,
  releaseFlag,
  releasePickupId,
  settleOneShotAfterCredit,
  shouldReleaseOneShotAfterPersist,
  shouldReleaseOneShotDokaCredit,
  tryClaimDungeonChainBonus,
  tryClaimFlag,
  tryClaimPickupId,
} from "./dokaPersist.ts";

{
  const claimed = new Set<string>();
  assert.equal(tryClaimPickupId(claimed, "doka-1-2"), true);
  assert.equal(tryClaimPickupId(claimed, "doka-1-2"), false);
  assert.equal(tryClaimPickupId(claimed, ""), false);
  releasePickupId(claimed, "doka-1-2");
  assert.equal(tryClaimPickupId(claimed, "doka-1-2"), true);
}

{
  const flag = { current: false };
  assert.equal(tryClaimFlag(flag), true);
  assert.equal(tryClaimFlag(flag), false);
  releaseFlag(flag);
  assert.equal(tryClaimFlag(flag), true);
}

{
  const claimed = { current: false };
  assert.equal(tryClaimDungeonChainBonus(claimed), true);
  assert.equal(
    tryClaimDungeonChainBonus(claimed),
    false,
    "same portal must not pay the chain bonus twice",
  );
}

{
  let calls = 0;
  const actor = {
    applyRewards: async () => {
      calls += 1;
      return { ok: { newDoka: 130n, newXp: 0n, newLevel: 1n } };
    },
  };
  const claimed = new Set<string>();
  assert.equal(tryClaimPickupId(claimed, "coin"), true);
  const first = persistDokaCredit(actor, 1, 30);
  assert.equal(tryClaimPickupId(claimed, "coin"), false);
  await first;
  assert.equal(calls, 1);
}

assert.equal(shouldReleaseOneShotAfterPersist(false), true);
assert.equal(shouldReleaseOneShotAfterPersist(true), false);

{
  const rejected = await persistDokaCreditResult(
    {
      applyRewards: async () => {
        throw new Error("applyRewards failed: Account banned");
      },
    },
    1,
    30,
  );
  assert.equal(shouldReleaseOneShotDokaCredit(rejected), true);
  assert.equal(settleOneShotAfterCredit(rejected), "release");
  assert.equal(persistDokaCreditAmount(rejected), 0);

  const transport = await persistDokaCreditResult(
    {
      applyRewards: async () => {
        throw new Error("replica reject after add");
      },
    },
    1,
    30,
  );
  assert.equal(shouldReleaseOneShotDokaCredit(transport), false);
  assert.equal(settleOneShotAfterCredit(transport), "keep");
  assert.equal(persistDokaCreditAmount(transport), 0);
}

console.log("dokaPersist.test: ok");
