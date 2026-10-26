/**
 * Challenge offer chrome. Display only — not wired into ChallengePanel.tsx
 * or challengeCompletion.ts (older combat / UX PRs own those hosts).
 *
 * UX-CHALLENGE-CHEBYSHEV: legendary_3 / Striker advertises
 * “Chebyshev distance ≤ 2”. Fail copy already says “beyond 2 tiles”.
 * Distinct from UX-CHALLENGE-FAIL-COPY, UX-CHALLENGE-ACCEPT-WINDOW,
 * and UX-CHALLENGE-ZINDEX.
 */

import type { Challenge } from "./challengeCompletion.ts";

/** Striker offer line — same 2-tile rule, no engineer distance name. */
export const STRIKER_PLAYER_DESCRIPTION =
  "Win using only spells cast on targets within 2 tiles (including diagonals)";

/** Player-facing objective on the challenge offer. */
export function challengePlayerDescription(challenge: Challenge): string {
  if (challenge.condition === "direct_hit") return STRIKER_PLAYER_DESCRIPTION;
  return challenge.description;
}
