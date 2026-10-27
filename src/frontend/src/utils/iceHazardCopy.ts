/**
 * Ice hazard step chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-ICE-SLOW-MISLABEL: stepping ice logs `❌❄️ You stepped on ice! Slowed!`
 * then applies Frozen (−2 MP, 2 turns). ❌ reads as a rejected action.
 * Distinct from UX-HAZARD-TILE-LEGEND (unnamed tiles before the step).
 */

export const ICE_STEP_LOG = "You stepped on ice — Frozen: -2 MP for 2 turns.";
