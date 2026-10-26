/**
 * Live gameplay localStorage catalogs vs APP_VERSION wipe (SDEG-2026-10-26-002).
 *
 * Official play loads bosses from `pbv_boss_configs` (canister getAllBossConfigs
 * is unused; Motoko BossConfig shape does not match the frontend record).
 * Admin Boss Rush drafts live at `bossRushConfig`; WX also writes
 * `pbv_boss_rush_config`. HEAD `shouldPreserveVersionGateKey` keeps only
 * `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`.
 *
 * A version bump therefore resets owner-configured bosses / rush tables to
 * code defaults. Distinct from unpaid-death keep (#508) and from palette
 * not being a mandatory gameplay dep (SDEG-2026-10-24-019).
 *
 * Do not edit versionGate.ts while #508 is queued — OR these keys into the
 * keep-list on that vehicle (union, do not overwrite the death prefix).
 */

export const LIVE_GAMEPLAY_LOCAL_CONFIG_KEYS = [
  "pbv_boss_configs",
  "bossRushConfig",
  "pbv_boss_rush_config",
] as const;

export type LiveGameplayLocalConfigKey =
  (typeof LIVE_GAMEPLAY_LOCAL_CONFIG_KEYS)[number];

export function isLiveGameplayLocalConfigKey(
  key: string,
): key is LiveGameplayLocalConfigKey {
  return (LIVE_GAMEPLAY_LOCAL_CONFIG_KEYS as readonly string[]).includes(key);
}

/** HEAD keep-list does not include live boss / rush catalogs. */
export function versionGateOnMainDropsLiveGameplayLocalConfig(
  key: string,
): boolean {
  return isLiveGameplayLocalConfigKey(key);
}

/**
 * Intended keep predicate for a later versionGate union. Palette blobs stay
 * out — they are not a mandatory persist gameplay dependency.
 */
export function shouldPreserveLiveGameplayLocalConfigKey(key: string): boolean {
  return isLiveGameplayLocalConfigKey(key);
}

export function colorPaletteIsMandatoryGameplayPersistDep(): boolean {
  return false;
}
