/**
 * Achievement condition authority vs persisted player data.
 *
 * AdminGuard.achievementUnlockRejected (main.mo markAchievementUnlocked
 * 2491; adminGuard.mo 677–694) only rejects level_10 / doka_1000 /
 * doka_10000 / spell_level_5 against canister Character + dokaBalances.
 * Every other known condition — including explore_25_maps and loot_10_doka
 * whose official counters live in localStorage (WorldExploration 2193–2200)
 * — returns null. There is no maps-visited or ground-doka pickup field on
 * Character or a principal map.
 *
 * Distinct from SDEG-2026-09-25-001 (same-browser APP_VERSION wipe). A
 * six-month player on a new device, or a raw client, has no canister
 * counter to replay. Do not add those required fields until a later
 * migration file after 20260901.
 */

import {
  KNOWN_ACHIEVEMENT_CONDITIONS,
  achievementUnlockRejected,
} from "./adminSafety.ts";

export const SERVER_CHECKED_ACHIEVEMENT_CONDITIONS = [
  "level_10",
  "doka_1000",
  "doka_10000",
  "spell_level_5",
] as const;

export const CLIENT_TRUSTED_PROGRESS_CONDITIONS = [
  "explore_25_maps",
  "loot_10_doka",
] as const;

export function achievementConditionIsServerChecked(
  condition: string,
): boolean {
  return (SERVER_CHECKED_ACHIEVEMENT_CONDITIONS as readonly string[]).includes(
    condition,
  );
}

/** Canister-observable today but not in achievementUnlockRejected. */
export function spellMasterEightIsServerChecked(): boolean {
  return achievementConditionIsServerChecked("spell_master_8");
}

export function featCounterHasCanisterField(): boolean {
  return false;
}

export function exploreMapsVisitedPersistedOnCanister(): boolean {
  return featCounterHasCanisterField();
}

export function groundDokaPickupsPersistedOnCanister(): boolean {
  return featCounterHasCanisterField();
}

/**
 * Empty-world / new-device snapshot: level 1, 0 Doka, no paid spell ranks.
 * Server-checked feats reject; explore/loot/combat/spell_master_8 do not.
 */
export function clientTrustedConditionUnlocksWithoutCanisterProgress(
  condition: string,
): boolean {
  if (
    !(KNOWN_ACHIEVEMENT_CONDITIONS as readonly string[]).includes(condition)
  ) {
    return false;
  }
  return achievementUnlockRejected(condition, 1, 0, 0) === null;
}
