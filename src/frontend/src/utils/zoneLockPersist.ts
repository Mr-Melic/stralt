/**
 * Zone-lock persist (SDEG-2026-10-27-003).
 *
 * Official WX stores the lock in the browser-global key
 * `aestralto_zone_locked`. It is not principal- or slot-scoped.
 * `shouldPreserveVersionGateKey` keeps only `pbv_tier_spawn_config`,
 * `pbv_levelup_config`, and `*_inventory`, so `App.tsx` APP_VERSION
 * `localStorage.clear()` drops the lock.
 *
 * A player who locked their farming zone yesterday loses it on the next
 * version bump (next portal can advance tier). Two principals on one
 * browser share one flag. Slot reuse inherits it.
 *
 * Distinct from 10-26-002 (boss / rush config keep-list) and 09-25-001
 * (unpaid-death / feat / shrine / covenant keep). Union into versionGate
 * on the #508 vehicle — do not edit versionGate.ts or WX this stack.
 */

export const HEAD_ZONE_LOCK_KEY = "aestralto_zone_locked";
export const ZONE_LOCK_KEY_PREFIX = "pbv_zone_lock_";

export function zoneLockStorageKey(principal: string, slot: number): string {
  const owner = (principal ?? "").trim() || "guest";
  const n = Number.isFinite(slot) ? Math.max(1, Math.floor(slot)) : 1;
  return `${ZONE_LOCK_KEY_PREFIX}${owner}_slot${n}`;
}

/** HEAD key is a single browser flag, not an account/slot tuple. */
export function headZoneLockIsPrincipalScoped(): boolean {
  return false;
}

export function shouldInheritZoneLockOnSlotReuse(): boolean {
  return false;
}

export function shouldPreserveZoneLockVersionGateKey(key: string): boolean {
  return key === HEAD_ZONE_LOCK_KEY || key.startsWith(ZONE_LOCK_KEY_PREFIX);
}

export function readZoneLockEnabled(raw: string | null | undefined): boolean {
  return raw === "true";
}
