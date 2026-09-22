// attackNearestFeel.ts — Presentation-only Attack Nearest reject copy.
// The footer button already disables / titles these cases. [S] still fires
// attackNearestEnemy and used to return with no canvas reason.

import { SELECT_SPELL_COPY } from "./rejectCopy.ts";

/** Canvas copy when [S] fires while Walk mode is active. */
export const SWITCH_TO_ATTACK_COPY = "Switch to Attack";

/**
 * Same phrase as the queued summon-control miss-click
 * (`SUMMON_NO_TARGET_COPY` on #363). Footer flash still says
 * "No target in range".
 */
export const NO_TARGET_COPY = "No target";

/**
 * Copy for Attack Nearest early returns that are not death / off-turn.
 * Overworld [S] stays quiet (`inBattle` false).
 */
export function attackNearestModeRejectCopy(input: {
  inBattle: boolean;
  battleActionMode: string;
  hasSelectedSpell: boolean;
}): string | null {
  if (!input.inBattle) return null;
  if (input.battleActionMode !== "attack") return SWITCH_TO_ATTACK_COPY;
  if (!input.hasSelectedSpell) return SELECT_SPELL_COPY;
  return null;
}

/** Heal probe fail / no legal hostile — keep the existing footer flash. */
export function shouldFloatAttackNearestNoTarget(
  foundLegalTarget: boolean,
): boolean {
  return !foundLegalTarget;
}
