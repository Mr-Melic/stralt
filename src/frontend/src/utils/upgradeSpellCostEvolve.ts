/**
 * upgradeSpell cost doubling is Motoko Nat multiply without a saturating
 * helper. At high spell levels `cost := cost * 2` wraps; a wrapped small
 * cost undercharges. Distinct from applyRewards pow2 (SDEG-2026-09-21-004)
 * and GameKey serial wrap (SDEG-2026-09-02-005).
 */

export function upgradeSpellCostDoublesInNat(): boolean {
  return true;
}

export function upgradeSpellCostHasOverflowGuard(): boolean {
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
