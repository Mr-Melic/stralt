/**
 * Version-bump localStorage wipe. APP_VERSION changes force a re-login, but
 * BuffShop inventory lives only in `${principal}_inventory` — a blanket
 * clear() drops paid potions while the canister Doka spend stays.
 *
 * Unpaid death 20/40 is also browser-only (`pbv_pending_death_penalty_*`).
 * The canister never stores that marker. A version bump that drops those
 * keys lets a six-month-old row skip the pending cut after a failed
 * saveBattleStats (SDEG-2026-09-24-001 / #508). Keep both the slot-only
 * form on main and the II-scoped form (`…_${principal}_slotN`).
 *
 * Client-trusted feat counters (`*_pbv_maps_visited_count`,
 * `*_pbv_ground_doka_pickups`) and shrine/covenant session caches are also
 * browser-only. They gate `explore_25_maps` / `loot_10_doka` /
 * shrine-count feats before `markAchievementUnlocked` writes the canister.
 * Wiping them on APP_VERSION resets progress for anyone who has not yet
 * unlocked (SDEG-2026-09-25-001).
 */

export const PENDING_DEATH_PENALTY_STORAGE_PREFIX = "pbv_pending_death_penalty";

/** Slot-scoped shrine/covenant caches written by WorldExploration. */
export const COVENANT_BUFF_STORAGE_PREFIX = "pbv_covenant_buff_";
export const SHRINE_COUNT_STORAGE_PREFIX = "pbv_shrine_count_";

/** Feat-counter base names (prefixed by `${owner}_slotN_`). */
export const MAPS_VISITED_PROGRESS_BASE = "pbv_maps_visited_count";
export const GROUND_DOKA_PICKUPS_PROGRESS_BASE = "pbv_ground_doka_pickups";

export function shouldPreserveVersionGateKey(key: string): boolean {
  return (
    key === "pbv_tier_spawn_config" ||
    key === "pbv_levelup_config" ||
    key.endsWith("_inventory") ||
    key.startsWith(PENDING_DEATH_PENALTY_STORAGE_PREFIX) ||
    key.startsWith(COVENANT_BUFF_STORAGE_PREFIX) ||
    key.startsWith(SHRINE_COUNT_STORAGE_PREFIX) ||
    key.endsWith(`_${MAPS_VISITED_PROGRESS_BASE}`) ||
    key === MAPS_VISITED_PROGRESS_BASE ||
    key.endsWith(`_${GROUND_DOKA_PICKUPS_PROGRESS_BASE}`) ||
    key === GROUND_DOKA_PICKUPS_PROGRESS_BASE
  );
}

export function collectPreservedLocalStorage(
  keys: readonly string[],
  getItem: (key: string) => string | null,
): Record<string, string> {
  const saved: Record<string, string> = {};
  for (const key of keys) {
    if (!shouldPreserveVersionGateKey(key)) continue;
    const value = getItem(key);
    if (value !== null) saved[key] = value;
  }
  return saved;
}
