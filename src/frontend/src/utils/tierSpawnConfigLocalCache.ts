/**
 * WorldExploration writes getTierSpawnConfig() into pbv_tier_spawn_config.
 * Bindgen TierSpawnConfig.tierSize is bigint. JSON.stringify throws
 * TypeError on bigint, the write is swallowed (`use localStorage fallback`),
 * and versionGate KEPT the previous blob. combatMath.loadTierConfig then
 * drives encounter levels from that stale schema.
 *
 * Do not edit WorldExploration / combatMath / versionGate while older
 * persist and admin PRs queue. Call serializeTierSpawnConfigForLocalCache
 * before setItem after those land.
 */

export const TIER_SPAWN_CACHE_SCHEMA_VERSION = 1;

export type TierSpawnCacheFields = {
  tierSize: number | bigint;
  sameTierPercent: number;
  adjacentTierPercent: number;
  twoAwayPercent: number;
  threeOrMorePercent: number;
  levelVarianceChance?: number;
};

export function tierSpawnConfigHasBigint(
  cfg: Readonly<Record<string, unknown>>,
): boolean {
  return Object.values(cfg).some((value) => typeof value === "bigint");
}

export function jsonStringifyThrowsOnBigint(value: unknown): boolean {
  try {
    JSON.stringify(value);
    return false;
  } catch {
    return true;
  }
}

function asFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value === "bigint") return Number(value);
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Number-only cache shape. Safe for JSON.stringify and loadTierConfig merge. */
export function toTierSpawnCacheNumbers(
  cfg: TierSpawnCacheFields,
): Record<string, number> {
  const out: Record<string, number> = {
    schemaVersion: TIER_SPAWN_CACHE_SCHEMA_VERSION,
    tierSize: asFiniteNumber(cfg.tierSize, 10),
    sameTierPercent: asFiniteNumber(cfg.sameTierPercent, 60),
    adjacentTierPercent: asFiniteNumber(cfg.adjacentTierPercent, 20),
    twoAwayPercent: asFiniteNumber(cfg.twoAwayPercent, 10),
    threeOrMorePercent: asFiniteNumber(cfg.threeOrMorePercent, 5),
  };
  if (cfg.levelVarianceChance != null) {
    out.levelVarianceChance = asFiniteNumber(cfg.levelVarianceChance, 15);
  }
  return out;
}

export function serializeTierSpawnConfigForLocalCache(
  cfg: TierSpawnCacheFields,
): string {
  return JSON.stringify(toTierSpawnCacheNumbers(cfg));
}

/**
 * True when a version-gate keep of pbv_tier_spawn_config would keep driving
 * combat because the canister fetch cannot be stringified.
 */
export function staleKeptTierSpawnCacheWouldRemainAuthoritative(args: {
  canisterConfigHasBigint: boolean;
  versionGateKeepsKey: boolean;
}): boolean {
  return args.canisterConfigHasBigint && args.versionGateKeepsKey;
}
