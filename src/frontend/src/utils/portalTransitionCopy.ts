/**
 * Portal transition chip. Display only — not wired into WorldExploration.tsx.
 *
 * UX-PORTAL-TRANSITION-OPAQUE: HUD shows "Portal..." with no destination or
 * reason while the fade runs.
 */

export const PORTAL_TRANSITION_CHIP = "Crossing portal…";

export const PORTAL_TRANSITION_CHIP_TO = (destination: string): string =>
  `Crossing to ${destination}…`;
