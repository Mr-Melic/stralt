/**
 * Skip juice simulation when the world RAF has nothing to move.
 *
 * PERF-2026-10-26-183: EffectsManager.tick() always built a `survivors`
 * array and `filter()`ed four typed mirrors, even in idle overworld with
 * zero live floaters / shake / hit-flash / hit-stop. That is ~5 allocations
 * per frame under the isometric pass. Distinct from PERF-132 (in-place
 * compact of *live* juice — still REPORT_ONLY; do not change TTL or motion).
 *
 * Hit-stop (`timeScale === 0`) and residual shake / hit-flash must still
 * run so restore timing is unchanged. Live arrays still use the existing
 * tick body.
 */

export function shouldSkipEffectsSimulation(input: {
  shakeIntensity: number;
  hitFlashCount: number;
  hitStopActive: boolean;
  activeCount: number;
  damageCount: number;
  deathCount: number;
  dokaCount: number;
  floatCount: number;
}): boolean {
  if (input.shakeIntensity >= 0.01) return false;
  if (input.hitFlashCount > 0) return false;
  if (input.hitStopActive) return false;
  return (
    input.activeCount === 0 &&
    input.damageCount === 0 &&
    input.deathCount === 0 &&
    input.dokaCount === 0 &&
    input.floatCount === 0
  );
}
