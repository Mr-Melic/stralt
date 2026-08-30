import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { type DokaCreditActor, persistDokaCredit } from "./dokaPersist.ts";

describe("persistDokaCredit", () => {
  it("credits world Doka through applyRewards(slot, doka, 0)", async () => {
    const calls: Array<{ slot: bigint; doka: bigint; xp: bigint }> = [];
    const actor: DokaCreditActor = {
      applyRewards: async (slot, doka, xp) => {
        calls.push({ slot, doka, xp });
        return { ok: { newDoka: 140n, newXp: 0n, newLevel: 1n } };
      },
    };

    const newDoka = await persistDokaCredit(actor, 2, 40);
    assert.equal(newDoka, 140);
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.slot, 2n);
    assert.equal(calls[0]?.doka, 40n);
    assert.equal(calls[0]?.xp, 0n);
  });

  it("returns 0 on backend err instead of throwing", async () => {
    const failing: DokaCreditActor = {
      applyRewards: async () => ({ err: "Account banned" }),
    };
    const failed = await persistDokaCredit(failing, 1, 10);
    assert.equal(failed, 0);
  });

  it("reads __kind__/ _ok applyRewards payloads so a credit is not dropped", async () => {
    const kindOk = {
      applyRewards: async () => ({
        __kind__: "ok" as const,
        ok: { newDoka: 430n, newXp: 0n, newLevel: 4n },
      }),
    };
    assert.equal(
      await persistDokaCredit(kindOk as unknown as DokaCreditActor, 1, 30),
      430,
    );

    const underscored = {
      applyRewards: async () => ({
        _ok: { newDoka: 340n, newXp: 0n, newLevel: 4n },
      }),
    };
    assert.equal(
      await persistDokaCredit(underscored as unknown as DokaCreditActor, 1, 40),
      340,
    );
  });
});
