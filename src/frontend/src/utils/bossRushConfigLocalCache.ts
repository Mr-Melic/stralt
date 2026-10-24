/**
 * Official Boss Rush reward multiplier is a canister JSON Text
 * (`getBossRushConfig` → `bossRushConfigStore`). Live play parses that Text
 * once (`useBossRush.ts`). WorldExploration also writes
 * `pbv_boss_rush_config` via `JSON.stringify(brcfg)`. Stringifying an
 * already-JSON Text double-encodes (`'"{\\"rewardMultiplier\\":1}"'`).
 *
 * Admin drafts use a different key (`bossRushConfig`). Neither key is in
 * the version-gate keep-list. Official play does not read the WX key today.
 *
 * Distinct from SDEG-2026-10-23-003 (bigint `getTierSpawnConfig` records).
 * No schema. Do not edit WorldExploration / AdminDashboard while older PRs
 * queue. Do not hydrate encounters from the WX cache.
 */

export const WX_BOSS_RUSH_CONFIG_KEY = "pbv_boss_rush_config";
export const ADMIN_BOSS_RUSH_CONFIG_KEY = "bossRushConfig";

/** Motoko `getBossRushConfig` is `async Text`, not a Candid record. */
export function getBossRushConfigReturnsJsonText(): boolean {
  return true;
}

/**
 * Store the canister Text as-is. `JSON.stringify` on a JSON string wraps it
 * in another quoted string.
 */
export function serializeBossRushConfigForLocalCache(
  canisterText: string,
): string {
  return typeof canisterText === "string" ? canisterText : "";
}

/** True when the HEAD WX write would store a JSON string-of-a-string. */
export function jsonStringifyDoubleEncodesBossRushConfigText(
  canisterText: string,
): boolean {
  if (typeof canisterText !== "string" || canisterText.length === 0) {
    return false;
  }
  try {
    const inner = JSON.parse(canisterText);
    if (inner == null || typeof inner !== "object") return false;
    const wrapped = JSON.stringify(canisterText);
    return typeof JSON.parse(wrapped) === "string";
  } catch {
    return false;
  }
}

export function wxBossRushConfigKeyMatchesAdminDraftKey(): boolean {
  const wx: string = WX_BOSS_RUSH_CONFIG_KEY;
  const admin: string = ADMIN_BOSS_RUSH_CONFIG_KEY;
  return wx === admin;
}

export function officialPlayReadsWxBossRushConfigKey(): boolean {
  return false;
}

export function officialPlayParsesCanisterBossRushConfigOnce(): boolean {
  return true;
}

/**
 * Parse a cache blob that may be raw JSON or the HEAD double-encoded form.
 * Invalid / empty → null so callers can fall back to the canister or 1.0.
 */
export function parseBossRushConfigCache(
  raw: string | null | undefined,
): Record<string, unknown> | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  try {
    let value: unknown = JSON.parse(raw);
    if (typeof value === "string") {
      value = JSON.parse(value);
    }
    if (value != null && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
