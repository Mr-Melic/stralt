/**
 * Character slot hydrate converts every Motoko Nat to JS Number
 * (`deepNormalizeBigInts` in useCharacterQueries). saveBattleStats then
 * writes `min(incoming, stored)` for XP/Doka (main.mo 2087–2088). A rounded
 * Number that is lower than the stored Nat silently cuts leftover XP or the
 * principal wallet. HUD helpers already use bigint (`xpThresholdBigInt`);
 * the load path does not.
 *
 * First leftover-XP precision loss is level 48 (threshold 100*2^47 exceeds
 * MAX_SAFE_INTEGER). Distinct from leaderboard Number() (SDEG-2026-09-26-002)
 * and from writeGeneration (SDEG-006). No schema. Do not Number() persist
 * Nats that are not safe integers.
 */

export function jsNumberLosesIntegerPrecision(value: bigint): boolean {
  if (value < 0n) return true;
  const n = Number(value);
  if (!Number.isSafeInteger(n)) return true;
  return BigInt(n) !== value;
}

/** saveBattleStats XP/Doka: incoming below stored is kept (a cut). */
export function lossyHydrateWouldCutSaveBattleStatsNat(
  stored: bigint,
  hydratedNumber: number,
): boolean {
  const incoming = Math.max(0, Math.floor(Number(hydratedNumber) || 0));
  if (!Number.isSafeInteger(incoming)) return true;
  return BigInt(incoming) < stored;
}

export function characterSlotHydrateUsesJsNumber(): boolean {
  return true;
}

export function leftoverXpThresholdExceedsSafeIntegerAtLevel(): number {
  return 48;
}
