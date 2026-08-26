export interface ApplyRewardsActor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyRewards: (
    slot: bigint,
    dokaDelta: bigint,
    xpDelta: bigint,
  ) => Promise<any>;
}

/** Clamp a world Doka credit to a non-negative integer. */
export function normalizeDokaCredit(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.max(0, Math.floor(amount));
}

/**
 * Persist a Doka-only credit through the atomic applyRewards funnel.
 * Used for world pickups, shrine completion, and dungeon-chain bonuses so
 * GameFlow's getCallerDokaBalance hydration cannot wipe unpersisted grants.
 */
export async function persistDokaCredit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any,
  slot: number,
  dokaDelta: number,
): Promise<number> {
  const credit = normalizeDokaCredit(dokaDelta);
  if (credit === 0) {
    throw new Error("persistDokaCredit requires a positive doka delta");
  }
  const result = await actor.applyRewards(
    BigInt(slot),
    BigInt(credit),
    BigInt(0),
  );
  if (result && typeof result === "object" && "err" in result && result.err) {
    throw new Error(`applyRewards failed: ${result.err}`);
  }
  const payload =
    result && typeof result === "object" && "ok" in result ? result.ok : null;
  const newDoka = payload?.newDoka;
  if (newDoka === undefined || newDoka === null) {
    throw new Error("applyRewards returned no newDoka");
  }
  return Number(newDoka);
}
