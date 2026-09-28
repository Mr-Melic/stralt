/**
 * Character.experience is leftover XP in the current level under
 * 100 * 2^(N-1) (applyRewards + xpCurve.ts). It is not lifetime total.
 *
 * Changing that formula without converting leftover restacks every account:
 * a cheaper next-level threshold can consume stored leftover and skip levels.
 * Motoko Nat has no max level. HUD saturates display only (xpForNextLevel).
 *
 * Distinct from SDEG-2026-09-21-004 (pow2 instruction cost), 09-27-003
 * (Number hydrate cut), and 09-01-004 (per-call applyRewards ceilings).
 * Do not change the curve in a deploy without a one-shot conversion.
 */

import { xpThresholdBigInt } from "./xpCurve.ts";

export const LEFTOVER_XP_CURVE_ID = "100 * 2^(N-1)";

export function leftoverExperienceIsRemainderInCurrentLevel(): boolean {
  return true;
}

export function leftoverXpCurveMatchesApplyRewards(): boolean {
  return (
    xpThresholdBigInt(1) === 100n &&
    xpThresholdBigInt(2) === 200n &&
    xpThresholdBigInt(3) === 400n &&
    xpThresholdBigInt(10) === 51200n
  );
}

/**
 * True when stored leftover would extra-level on the next applyRewards if the
 * live threshold is swapped without converting the remainder.
 */
export function leftoverWouldExtraLevelUnderNewThreshold(
  leftover: bigint,
  newThreshold: bigint,
): boolean {
  const xp = leftover < 0n ? 0n : leftover;
  const need = newThreshold < 1n ? 1n : newThreshold;
  return xp >= need;
}
