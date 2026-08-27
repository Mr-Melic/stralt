import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { persistDokaCredit } from "./dokaPersist.ts";

describe("persistDokaCredit", () => {
  it("credits world Doka through applyRewards with a zero XP delta", async () => {
    const calls: Array<{ slot: bigint; doka: bigint; xp: bigint }> = [];
    const newDoka = await persistDokaCredit(
      {
        applyRewards: async (slot, doka, xp) => {
          calls.push({ slot, doka, xp });
          return { ok: { newDoka: 140n, newXp: 0n, newLevel: 1n } };
        },
      },
      2,
      40,
    );
    assert.equal(newDoka, 140);
    assert.deepEqual(calls, [{ slot: 2n, doka: 40n, xp: 0n }]);
  });

  it("returns 0 instead of throwing when applyRewards rejects", async () => {
    const prevError = console.error;
    console.error = () => {};
    try {
      const failed = await persistDokaCredit(
        {
          applyRewards: async () => ({ err: "Account banned" }),
        },
        1,
        10,
      );
      assert.equal(failed, 0);
    } finally {
      console.error = prevError;
    }
  });
});
