/**
 * Flee confirm chrome. Display only.
 *
 * BattleUIPanel Flee uses a native window.confirm (~522). WorldExploration
 * adds a second window.confirm when the fight is inside Boss Rush or a
 * Dungeon Chain (~18930). Both are OS dialogs, not carved stone.
 *
 * This helper is locked, not wired — BattleUIPanel is in #335 / #340 and
 * WorldExploration is in older open PRs. Wire after those land. Do not
 * change flee → deathGuards or skip the confirm (no one-click flee).
 */

export const FLEE_BUTTON_TITLE =
  "Flee — you die, lose 20% leftover XP and 40% Doka, then enter the Death Realm";

export const FLEE_CONFIRM_BODY =
  "Flee this fight? You will die, lose 20% leftover XP and 40% Doka, and wake in the Death Realm.";

export function fleeRunConfirmBody(runName: string): string {
  const name = runName.trim() || "this run";
  return `Fleeing ends your ${name} — you will fall, lose 20% leftover XP and 40% Doka, and wake in the Death Realm. Continue?`;
}
