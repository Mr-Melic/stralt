/**
 * Official WorldExploration never calls getLevelUpConfig. HUD max HP, spell
 * fail, and spell range hydrate from pbv_levelup_config (kept across
 * APP_VERSION) or DEFAULT_LEVELUP_CONFIG. Canister LevelUpConfig is what
 * saveBattleStats persistHpWriteCap / persistApWriteCap / upgradeSpell cost
 * actually use.
 *
 * Frontend gameTypes.LevelUpConfig names the AP cadence
 * `apMpGrowthEveryNLevels`. Motoko / bindgen use `apMpLevelThreshold`.
 * AdminDashboard aliases on write (`toBackendLevelUpConfig`); WX
 * `{ ...DEFAULT, ...JSON.parse(raw) }` does not, so battle AP/MP
 * (`getPlayerBaseStats`) keeps the DEFAULT 25 even after admin sets
 * threshold 1 on the canister.
 *
 * Persist HP is linear: 100 + (level-1)*growthPercent (adminGuard
 * maxPersistedHp). getPlayerBaseStats HP is compounding
 * 100*(1+growth/100)^(level-1) and must not become the persist writer.
 *
 * No schema. Do not add required Character fields. Do not edit
 * WorldExploration / versionGate / AdminDashboard while older persist PRs
 * queue.
 */

export const CANISTER_AP_MP_FIELD = "apMpLevelThreshold";
export const FRONTEND_AP_MP_FIELD = "apMpGrowthEveryNLevels";

export function officialWxCallsGetLevelUpConfig(): boolean {
  return false;
}

export function levelUpConfigLocalStorageIsKeptAcrossVersionGate(): boolean {
  return true;
}

/** True when WX would keep the frontend AP cadence name at DEFAULT. */
export function wxSpreadKeepsFrontendApMpAlias(args: {
  defaults: Readonly<Record<string, unknown>>;
  blob: Readonly<Record<string, unknown>>;
}): boolean {
  const merged = { ...args.defaults, ...args.blob };
  const frontendCadence = merged[FRONTEND_AP_MP_FIELD];
  const canisterCadence = merged[CANISTER_AP_MP_FIELD];
  return (
    canisterCadence !== undefined &&
    frontendCadence === args.defaults[FRONTEND_AP_MP_FIELD] &&
    frontendCadence !== canisterCadence
  );
}

export function linearPersistHp(level: number, growthPercent: number): number {
  const lvl = Math.max(1, Math.floor(level));
  const growth = Math.max(1, Math.floor(growthPercent));
  return 100 + (lvl - 1) * growth;
}

export function compoundingProgressionHp(
  level: number,
  growthPercent: number,
): number {
  const lvl = Math.max(1, Math.floor(level));
  const growth = Math.max(0, growthPercent);
  return Math.round(100 * (1 + growth / 100) ** (lvl - 1));
}

/**
 * True when compounding battle HP would exceed the linear persist cap, so
 * saveBattleStats would clip a write of getPlayerBaseStats().hp.
 */
export function compoundingHpWouldClipOnPersist(args: {
  level: number;
  growthPercent: number;
}): boolean {
  return (
    compoundingProgressionHp(args.level, args.growthPercent) >
    linearPersistHp(args.level, args.growthPercent)
  );
}

/**
 * Official combat AP/MP read getPlayerBaseStats(level, wxLevelUpConfig).
 * Persist caps use canister apMpLevelThreshold. A stale kept blob + empty
 * WX hydrate means HUD growth can disagree with persistHpWriteCap after
 * admin changes statGrowthPercent.
 */
export function wxLevelUpBlobCanDivergeFromCanister(args: {
  blobGrowthPercent: number;
  canisterGrowthPercent: number;
}): boolean {
  return (
    !officialWxCallsGetLevelUpConfig() &&
    args.blobGrowthPercent !== args.canisterGrowthPercent
  );
}
