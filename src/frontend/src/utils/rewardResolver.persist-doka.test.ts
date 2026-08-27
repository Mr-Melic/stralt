import { type DokaCreditActor, persistDokaCredit } from "./dokaPersist";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

export async function runPersistDokaCreditTests(): Promise<void> {
  const calls: Array<{ slot: bigint; doka: bigint; xp: bigint }> = [];
  const actor: DokaCreditActor = {
    applyRewards: async (slot, doka, xp) => {
      calls.push({ slot, doka, xp });
      return { ok: { newDoka: 140n, newXp: 0n, newLevel: 1n } };
    },
  };

  const newDoka = await persistDokaCredit(actor, 2, 40);
  assert(newDoka === 140, `expected 140, got ${newDoka}`);
  assert(calls.length === 1, "applyRewards should be called once");
  assert(calls[0].slot === 2n, "slot forwarded");
  assert(calls[0].doka === 40n, "doka credit forwarded");
  assert(calls[0].xp === 0n, "xp delta must stay 0 for world credits");

  const failing: DokaCreditActor = {
    applyRewards: async () => ({ err: "Account banned" }),
  };
  const failed = await persistDokaCredit(failing, 1, 10);
  assert(failed === 0, "backend err must return 0 instead of throwing");
}
