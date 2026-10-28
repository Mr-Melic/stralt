/**
 * Screen-shake sample used by the world canvas translate.
 *
 * PERF-2026-10-28-192: EffectsManager.getShakeOffset() allocated a fresh
 * `{x,y}` and called Math.random() twice every RAF even while intensity
 * was 0 (idle overworld / idle battle). Distinct from PERF-183 (idle
 * *tick* skip — the draw path still queries shake after tick returns).
 *
 * Intensity uses the same 0.01 floor as EffectsManager.tick() so residual
 * decay does not keep sampling RNG for sub-pixel jitter. Live shake still
 * uses the existing (random - 0.5) * intensity * 2 formula.
 * EffectsManager.getShakeOffset inlines the same idle/live split (no import)
 * so this helper stays merge-clean with PR #1122's tick-skip import on
 * effects.ts.
 */

export const ZERO_SHAKE_OFFSET: { readonly x: 0; readonly y: 0 } = {
  x: 0,
  y: 0,
};

/** Match EffectsManager.tick() residual clamp. */
export const SHAKE_INTENSITY_EPSILON = 0.01;

export function computeShakeOffset(input: {
  enabled: boolean;
  intensity: number;
  random?: () => number;
}): { x: number; y: number } {
  if (!input.enabled || input.intensity < SHAKE_INTENSITY_EPSILON) {
    return ZERO_SHAKE_OFFSET;
  }
  const rand = input.random ?? Math.random;
  const span = input.intensity * 2;
  return {
    x: (rand() - 0.5) * span,
    y: (rand() - 0.5) * span,
  };
}
