/**
 * Official boss portal / combat config load source.
 *
 * Canister `getAllBossConfigs` / `setBossConfig` exist, but live play and
 * admin drafts read/write browser-local `pbv_boss_configs`. Motoko BossConfig
 * (defeated, adminNotes) does not match the frontend record (iconEmoji,
 * loreText, chc) — see useBossQueries.ts header.
 */

export const BOSS_CONFIG_LOCAL_STORAGE_KEY = "pbv_boss_configs";

/** Live WX portal entry does not call getAllBossConfigs. */
export function isOfficialBossConfigCanisterLive(): boolean {
  return false;
}

export type BossConfigLoadSource = "localStorage" | "canister" | "defaults";

/**
 * Where official clients resolve boss rows for portal entry / admin drafts.
 * Cross-device and APP_VERSION wipes (key not in versionGate keep-list) drop
 * admin edits even when the canister map still has Motoko seeds.
 */
export function resolveOfficialBossConfigLoadSource(): BossConfigLoadSource {
  return "localStorage";
}

/** Motoko wire fields that the frontend BossConfig type does not carry. */
export const MOTOKO_BOSS_CONFIG_ONLY_FIELDS = [
  "defeated",
  "adminNotes",
] as const;

/** Frontend BossConfig fields absent from Motoko BossConfig. */
export const FRONTEND_BOSS_CONFIG_ONLY_FIELDS = [
  "iconEmoji",
  "loreText",
  "chc",
] as const;

export function bossConfigSchemasCompatibleForDirectBindgen(): boolean {
  return false;
}
