/**
 * Version-bump localStorage wipe. APP_VERSION changes force a re-login, but
 * BuffShop inventory lives only in `${principal}_inventory` — a blanket
 * clear() drops paid potions while the canister Doka spend stays.
 *
 * Unpaid death 20/40 is also browser-only (`pbv_pending_death_penalty_*`).
 * The canister never stores that marker. A version bump that drops those
 * keys lets a six-month-old row skip the pending cut after a failed
 * saveBattleStats (SDEG-2026-09-24-001). Keep both the slot-only form on
 * main and the II-scoped form (`…_${principal}_slotN`).
 */

export const PENDING_DEATH_PENALTY_STORAGE_PREFIX = "pbv_pending_death_penalty";

export function shouldPreserveVersionGateKey(key: string): boolean {
  return (
    key === "pbv_tier_spawn_config" ||
    key === "pbv_levelup_config" ||
    key.endsWith("_inventory") ||
    key.startsWith(PENDING_DEATH_PENALTY_STORAGE_PREFIX)
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
