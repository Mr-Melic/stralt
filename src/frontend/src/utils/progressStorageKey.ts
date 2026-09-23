/**
 * Paid inventory and client-trusted feat counters must be keyed by the
 * Internet Identity principal, not the profile display name.
 *
 * GameFlow's `userId` is `userProfile.id ?? name` and UserProfile has no
 * Candid `id`, so BuffShop / maps-visited / ground-Doka pickups used to
 * share `${"Bob"}_inventory` across two principals who picked the same
 * name. The second principal could drink unpaid potions (HP via
 * saveBattleStats) and markAchievementUnlocked loot_10_doka /
 * explore_25_maps from the first principal's localStorage, then
 * claimAchievementReward mint Doka. Names are not unique on
 * saveCallerUserProfile.
 *
 * Dual-read: principal key first; if missing, copy the legacy display-name
 * key onto the principal and delete the name key so the next occupant
 * cannot inherit it.
 */

export type ProgressStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

export const MAPS_VISITED_PROGRESS_BASE = "pbv_maps_visited_count";
export const GROUND_DOKA_PICKUPS_PROGRESS_BASE = "pbv_ground_doka_pickups";

export function resolveProgressStorageOwner(
  principalText?: string | null,
  displayName?: string | null,
): { owner: string; legacyOwner?: string } {
  const principal =
    typeof principalText === "string" ? principalText.trim() : "";
  const name = typeof displayName === "string" ? displayName.trim() : "";
  if (principal) {
    return {
      owner: principal,
      legacyOwner: name && name !== principal ? name : undefined,
    };
  }
  return { owner: name || "guest" };
}

export function inventoryStorageKey(owner: string): string {
  return `${owner}_inventory`;
}

export function characterProgressStorageKey(
  owner: string,
  slot: number | undefined,
  base: string,
): string {
  if (!owner) return base;
  const slotNum = Math.max(0, Math.floor(Number(slot) || 0));
  return `${owner}_slot${slotNum}_${base}`;
}

export function readMigratingLocalStorage(
  storage: ProgressStorage,
  canonicalKey: string,
  legacyKey: string | undefined,
): string | null {
  try {
    const canonical = storage.getItem(canonicalKey);
    if (canonical != null) return canonical;
    if (!legacyKey || legacyKey === canonicalKey) return null;
    const legacy = storage.getItem(legacyKey);
    if (legacy == null) return null;
    storage.setItem(canonicalKey, legacy);
    storage.removeItem(legacyKey);
    return legacy;
  } catch {
    return null;
  }
}

export function readMigratingCharacterProgress(
  storage: ProgressStorage,
  principalText: string | null | undefined,
  displayName: string | null | undefined,
  slot: number | undefined,
  base: string,
): string | null {
  const { owner, legacyOwner } = resolveProgressStorageOwner(
    principalText,
    displayName,
  );
  const canonical = characterProgressStorageKey(owner, slot, base);
  const legacy = legacyOwner
    ? characterProgressStorageKey(legacyOwner, slot, base)
    : undefined;
  return readMigratingLocalStorage(storage, canonical, legacy);
}

export function writeCharacterProgress(
  storage: ProgressStorage,
  principalText: string | null | undefined,
  displayName: string | null | undefined,
  slot: number | undefined,
  base: string,
  value: string,
): void {
  const { owner, legacyOwner } = resolveProgressStorageOwner(
    principalText,
    displayName,
  );
  const canonical = characterProgressStorageKey(owner, slot, base);
  try {
    storage.setItem(canonical, value);
    if (legacyOwner) {
      const legacy = characterProgressStorageKey(legacyOwner, slot, base);
      if (legacy !== canonical) storage.removeItem(legacy);
    }
  } catch {
    // localStorage unavailable
  }
}

export function readMigratingInventoryJson(
  storage: ProgressStorage,
  principalText: string | null | undefined,
  displayName: string | null | undefined,
): string | null {
  const { owner, legacyOwner } = resolveProgressStorageOwner(
    principalText,
    displayName,
  );
  return readMigratingLocalStorage(
    storage,
    inventoryStorageKey(owner),
    legacyOwner ? inventoryStorageKey(legacyOwner) : undefined,
  );
}

export function writeInventoryJson(
  storage: ProgressStorage,
  principalText: string | null | undefined,
  displayName: string | null | undefined,
  json: string,
): void {
  const { owner, legacyOwner } = resolveProgressStorageOwner(
    principalText,
    displayName,
  );
  try {
    storage.setItem(inventoryStorageKey(owner), json);
    if (legacyOwner) {
      const legacy = inventoryStorageKey(legacyOwner);
      if (legacy !== inventoryStorageKey(owner)) storage.removeItem(legacy);
    }
  } catch {
    // localStorage unavailable
  }
}
