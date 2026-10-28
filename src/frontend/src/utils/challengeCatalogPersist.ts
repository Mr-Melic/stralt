/**
 * Battle-challenge catalog persist (SDEG-2026-10-28-002).
 *
 * `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109) is the live
 * catalog: ids `easy_1`…`legendary_3`, conditions, advertised Doka/XP,
 * and legendary badge copy. There is no canister challenge map, no
 * `Character` challenge-id field (`main.mo` 122–145), and no completion
 * / discovery history. Victory persist uses the anonymous name
 * "Battle Challenge" plus applyRewards deltas (`challengeRewards.ts`).
 *
 * A player created yesterday, six months ago, or before challenges
 * existed has nothing to migrate. Renaming `easy_1` cannot preserve
 * ownership because none is stored. Retired ids cannot corrupt saves
 * because they never entered Character / achievementProgress.
 *
 * Distinct from 10-24-012 (legendary badges never enter persist) and
 * from SDEG-004 (spell ownership is catalog ∪ keys). Do not add a
 * required Character.challengeIds field until a later chain file after
 * 20260901 with empty-array default, alias table, and idempotent replay.
 */

export const FRONTEND_ONLY_CHALLENGE_IDS = [
  "easy_1",
  "easy_2",
  "easy_3",
  "hard_1",
  "hard_2",
  "hard_3",
  "legendary_1",
  "legendary_2",
  "legendary_3",
] as const;

export function challengeCatalogIsFrontendOnly(): boolean {
  return true;
}

export function characterRecordStoresChallengeIds(): boolean {
  return false;
}

export function renamingChallengeIdPreservesCompletionHistory(): boolean {
  return false;
}

export function challengeRewardsPersistWithoutChallengeId(): boolean {
  return true;
}

/** Required Character.challengeIds would unload yesterday / pre-feature cohorts. */
export function shouldAddRequiredCharacterChallengeIds(): boolean {
  return false;
}

export function aliasTableRequiredBeforePersistingChallengeIds(): boolean {
  return true;
}

export function retiredChallengeIdCorruptsCharacterSave(): boolean {
  return false;
}
