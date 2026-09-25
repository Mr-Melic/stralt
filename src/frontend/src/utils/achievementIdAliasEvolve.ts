/**
 * Achievement progress is keyed `principalText#achievementId` (main.mo
 * 2495 / 2528). There is no oldId → newId alias table.
 *
 * adminDeleteAchievementConfig soft-retires when any progress row exists
 * (2389–2405) — the id stays. adminSetAchievementConfig with a *new* id
 * inserts a second catalog row and leaves `principal#oldId` orphaned.
 * getAchievementConfigs then no longer lists the old id, so the Feats
 * panel cannot claim a six-month unlock after a rename-by-recreate.
 *
 * Same class as spell-id purge (SDEG-003) without the every-upgrade delete.
 * Renames must keep the id. Do not add a required alias map until a later
 * chain file after 20260901.
 */

export function achievementProgressKey(
  principalText: string,
  achievementId: string,
): string {
  return `${principalText}#${achievementId}`;
}

export function achievementIdHasAliasTable(): boolean {
  return false;
}

export function adminSetNewIdPreservesOldProgress(): boolean {
  return achievementIdHasAliasTable();
}

/** Soft-retire keeps the id; a new catalog row does not remap progress. */
export function achievementRenameShouldKeepId(): boolean {
  return true;
}
