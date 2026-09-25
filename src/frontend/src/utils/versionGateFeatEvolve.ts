/**
 * Feat / shrine / covenant keys that APP_VERSION wipe must keep.
 *
 * Official explore_25_maps / loot_10_doka / shrine-count progress is
 * localStorage-only until markAchievementUnlocked writes the canister
 * (WorldExploration 2193–2200, 1373–1403). Do not edit versionGate.ts in
 * this PR — #508 already owns that file (unpaid death). Union by ORing
 * shouldPreserveFeatSessionVersionGateKey into shouldPreserveVersionGateKey
 * after #508 lands.
 */

export const COVENANT_BUFF_STORAGE_PREFIX = "pbv_covenant_buff_";
export const SHRINE_COUNT_STORAGE_PREFIX = "pbv_shrine_count_";
export const MAPS_VISITED_PROGRESS_BASE = "pbv_maps_visited_count";
export const GROUND_DOKA_PICKUPS_PROGRESS_BASE = "pbv_ground_doka_pickups";

export function shouldPreserveFeatSessionVersionGateKey(key: string): boolean {
  return (
    key.startsWith(COVENANT_BUFF_STORAGE_PREFIX) ||
    key.startsWith(SHRINE_COUNT_STORAGE_PREFIX) ||
    key.endsWith(`_${MAPS_VISITED_PROGRESS_BASE}`) ||
    key === MAPS_VISITED_PROGRESS_BASE ||
    key.endsWith(`_${GROUND_DOKA_PICKUPS_PROGRESS_BASE}`) ||
    key === GROUND_DOKA_PICKUPS_PROGRESS_BASE
  );
}
