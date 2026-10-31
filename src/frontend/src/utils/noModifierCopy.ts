/**
 * Empty-map modifier announce chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-NO-MODIFIER-LOG (reported 2026-10-29, helper locked this run):
 * every map with `triggered.size === 0` logs `No map modifier this area.`
 * Distinct from UX-MAP-MODIFIERS-EMPTY (overlay panel that opens empty)
 * and UX-HAZARD-COUNT-DETECTED (named hazard kinds).
 */

/** Default: stay silent when nothing rolled. */
export const NO_MODIFIER_LOG = "";

/** Optional carved line if a later wire wants an explicit clear beat. */
export const CLEAR_AREA_LOG = "This area is clear of map effects.";

export function noModifierLog(): string {
  return NO_MODIFIER_LOG;
}
