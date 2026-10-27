/**
 * Barrier fade chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-BARRIER-COORD-LOG: expired barrier tiles log `Barrier at ${bKey} has
 * faded` where bKey is the `"x,y"` map key. Distinct from
 * UX-TILE-COORD-HUD (side-panel pin) and UX-CAST-FAIL-FEEDBACK (walk/cast).
 */

export const BARRIER_FADED_LOG = "A barrier faded from the field.";
