/**
 * Lava / spike step damage shared by the player movement loop and the
 * enemy landing branch.
 *
 * Both paths inlined `8 + floor(rng * 8)` (lava 8–15) and
 * `5 + floor(rng * 6)` (spikes 5–10). A later edit to one side would
 * make environmental resolution disagree between the player and AI.
 * Numbers are unchanged — this only has one roll helper.
 */

export const LAVA_STEP_DAMAGE_MIN = 8;
export const LAVA_STEP_DAMAGE_SPAN = 8;
export const SPIKE_STEP_DAMAGE_MIN = 5;
export const SPIKE_STEP_DAMAGE_SPAN = 6;

export const LAVA_BURN_DURATION = 3;
export const LAVA_BURN_DOT_PER_TURN = 3;
export const ICE_SLOW_DURATION = 2;
export const ICE_SLOW_MP_MODIFIER = -2;

function rollSpan(min: number, span: number, rng: () => number): number {
  const u = Number(rng());
  // Same as the inlined `min + floor(rng * span)`: Math.random is [0, 1),
  // so lava stays 8–15 and spikes stay 5–10. Do not clamp 1 inclusive —
  // that would yield min+span (16 / 11).
  const unit = Number.isFinite(u) ? u : 0;
  return min + Math.floor(unit * span);
}

/** Lava step: 8–15 inclusive. Player RAF and enemy landing must share this. */
export function rollLavaStepDamage(rng: () => number = Math.random): number {
  return rollSpan(LAVA_STEP_DAMAGE_MIN, LAVA_STEP_DAMAGE_SPAN, rng);
}

/** Spike step: 5–10 inclusive. Player RAF and enemy landing must share this. */
export function rollSpikeStepDamage(rng: () => number = Math.random): number {
  return rollSpan(SPIKE_STEP_DAMAGE_MIN, SPIKE_STEP_DAMAGE_SPAN, rng);
}
