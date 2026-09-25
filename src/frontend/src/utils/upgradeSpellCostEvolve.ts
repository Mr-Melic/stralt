/**
 * upgradeSpell cost doubling is Motoko Nat multiply with no instruction
 * short-circuit (`main.mo` 1018–1023). Motoko `Nat` is unbounded — `cost *
 * 2` does **not** wrap to a cheap upgrade the way Nat64 / JS Number would.
 * Distinct from applyRewards pow2 (SDEG-2026-09-21-004) and the GameKey
 * serial wrap (SDEG-2026-09-02-005), which *does* reuse gk_1.
 *
 * Extreme spell levels still burn IC instructions on the while-loop and
 * produce a huge candid debit. Frontend preflight refuses past a conservative
 * bit-width so official UI never invokes that update.
 */

export function upgradeSpellCostDoublesInNat(): boolean {
  return true;
}

export function upgradeSpellCostHasOverflowGuard(): boolean {
  return false;
}

/** Motoko Nat is arbitrary-precision; doubling cannot wrap to a small cost. */
export function motokoNatDoublingWraps(): boolean {
  return false;
}

/** Frontend preflight: refuse to invoke upgradeSpell past a safe exponent. */
export function spellUpgradeCostWouldOverflowNat(
  currentLevel: number,
  baseCost = 10,
  natBitWidth = 128,
): boolean {
  const level = Math.max(0, Math.floor(Number(currentLevel) || 0));
  const base = Math.max(1, Math.floor(Number(baseCost) || 1));
  // cost = base * 2^level. Compare log2(base) + level to bit width.
  const log2Base = Math.log2(base);
  if (!Number.isFinite(log2Base)) return true;
  return log2Base + level >= natBitWidth;
}
