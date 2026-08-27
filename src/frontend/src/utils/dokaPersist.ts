/**
 * Minimal actor surface used by persistDokaCredit. Matches the backend
 * applyRewards(slot : Nat, dokaDelta : Nat, xpDelta : Nat) signature.
 */
export interface DokaCreditActor {
  applyRewards: (
    slot: bigint,
    dokaDelta: bigint,
    xpDelta: bigint,
  ) => Promise<
    | { ok: { newDoka: bigint; newXp: bigint; newLevel: bigint } }
    | { err: string }
  >;
}

/**
 * Credits Doka to a character slot via the single atomic backend funnel
 * applyRewards(slot, doka, 0) and returns the new absolute Doka balance.
 * On backend error the failure is logged and 0 is returned so the caller can
 * fall back gracefully instead of crashing the reward flow.
 */
export async function persistDokaCredit(
  actor: DokaCreditActor,
  slot: number,
  doka: number,
): Promise<number> {
  try {
    const result = await actor.applyRewards(
      BigInt(slot),
      BigInt(doka),
      BigInt(0),
    );
    if ("err" in result) {
      throw new Error(`applyRewards failed: ${result.err}`);
    }
    return Number(result.ok.newDoka);
  } catch (error) {
    console.error("persistDokaCredit failed", error);
    return 0;
  }
}
