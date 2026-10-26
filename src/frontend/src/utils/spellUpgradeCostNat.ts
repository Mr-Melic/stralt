/**
 * Unbounded spell-upgrade cost (SDEG-2026-10-26-003).
 *
 * Motoko `upgradeSpell` charges `spellLevelingBaseCost * 2^currentLevel` with
 * Nat. SpellbookModal advertises `10 * 2 ** currentLevel` (summons 10× that)
 * as a JS Number. Around spell level 53 that product leaves MAX_SAFE_INTEGER;
 * at high exponents it is Infinity.
 *
 * `spellUpgradeCanisterSpend(Infinity)` returns Infinity, then
 * `committedDokaAfterSpellUpgrade` does `max(0, before - Infinity) = 0`.
 * The next saveBattleStats absolute write keeps the lower wallet and wipes
 * Doka. Distinct from leftover-XP Number() on applyRewards (10-24-001).
 *
 * Wire Spellbook / persistSpellUpgrade when those files are editable. Do not
 * add a spell-level cap on Character.
 */

const DEFAULT_BASE_COST = 10n;

function toNat(value: bigint | number | string | undefined): bigint {
  if (typeof value === "bigint") return value < 0n ? 0n : value;
  const n = Math.floor(Number(value) || 0);
  if (!Number.isFinite(n) || n < 0) return 0n;
  return BigInt(n);
}

/** Same doubling loop as Motoko `upgradeSpell` (base * 2^level). */
export function spellUpgradeCanisterCostBigInt(
  currentLevel: bigint | number,
  baseCost: bigint | number = DEFAULT_BASE_COST,
): bigint {
  const level = toNat(currentLevel);
  let cost = toNat(baseCost);
  let remaining = level;
  while (remaining > 0n) {
    cost *= 2n;
    remaining -= 1n;
  }
  return cost;
}

/** Live SpellbookModal formula — documents the silent Number overflow. */
export function advertisedJsSpellUpgradeCost(currentLevel: number): number {
  return 10 * 2 ** currentLevel;
}

export function advertisedSpellUpgradeCostIsPersistSafe(
  advertisedCost: number,
): boolean {
  return Number.isSafeInteger(advertisedCost) && advertisedCost >= 0;
}

/**
 * When the advertised debit is Infinity / non-safe, keep the seeded wallet
 * (`number`). `null` means the existing `committedDokaAfterSpellUpgrade` path
 * is safe to use. A finite backend-after that actually decreased is still
 * authoritative even when advertised cost overflowed.
 */
export function freezeCommittedDokaWhenAdvertisedUpgradeCostUnsafe(
  committedDokaBefore: number,
  backendDokaAfter: number | undefined,
  advertisedCost: number,
): number | null {
  const before = Math.max(0, Math.floor(Number(committedDokaBefore) || 0));
  if (backendDokaAfter != null) {
    const after = Math.max(0, Math.floor(Number(backendDokaAfter) || 0));
    if (Number.isSafeInteger(after) && after < before) return after;
  }
  if (!advertisedSpellUpgradeCostIsPersistSafe(advertisedCost)) {
    return before;
  }
  return null;
}
