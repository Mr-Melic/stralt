import {
  type ApplyRewardsActor,
  normalizeDokaCredit,
  persistDokaCredit,
} from "./dokaPersist";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

export async function runPersistDokaCreditTests(): Promise<void> {
  assert(normalizeDokaCredit(25.9) === 25, "floor positive credits");
  assert(normalizeDokaCredit(-10) === 0, "reject negative credits");
  assert(normalizeDokaCredit(Number.NaN) === 0, "reject NaN credits");

  const calls: Array<{ slot: bigint; doka: bigint; xp: bigint }> = [];
  const actor: ApplyRewardsActor = {
    applyRewards: async (slot, doka, xp) => {
      calls.push({ slot, doka, xp });
      return { __kind__: "ok", ok: { newDoka: 140 } };
    },
  };

  const newDoka = await persistDokaCredit(actor, 2, 40);
  assert(newDoka === 140, `expected 140, got ${newDoka}`);
  assert(calls.length === 1, "applyRewards should be called once");
  assert(calls[0].slot === 2n, "slot forwarded");
  assert(calls[0].doka === 40n, "doka credit forwarded");
  assert(calls[0].xp === 0n, "xp delta must stay 0 for world credits");

  const failing: ApplyRewardsActor = {
    applyRewards: async () => ({ __kind__: "err", err: "Account banned" }),
  };
  let threw = false;
  try {
    await persistDokaCredit(failing, 1, 10);
  } catch (err) {
    threw = String(err).includes("Account banned");
  }
  assert(threw, "backend err must surface");
}
