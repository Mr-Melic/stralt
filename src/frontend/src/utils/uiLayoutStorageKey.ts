/**
 * HUD / challenge panel localStorage keying (SDEG-2026-10-25-003).
 *
 * GameFlow still passes the profile display name as `userId`. Candid UserProfile
 * has no id, so two Internet Identities that chose the same name share
 * `pbv_panel_layout_${name}` on one browser. DraggablePanel then uploads that
 * cache via saveUserUiLayout to the caller principal when getUserUiLayout is
 * empty or fails — cross-account HUD poison.
 *
 * Prefer II principal text for the cache key. Copy-if-missing from the legacy
 * display-name key once; never overwrite a newer principal cache.
 */

export function isPrincipalTextForUiLayout(value: string): boolean {
  if (typeof value !== "string" || value.length < 7) return false;
  if (value !== value.toLowerCase()) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(value);
}

export function resolveUiLayoutStorageUserId(args: {
  principalText?: string | null;
  passedUserId?: string | null;
}): string {
  const principal = (args.principalText ?? "").trim();
  if (principal && isPrincipalTextForUiLayout(principal)) return principal;
  const passed = (args.passedUserId ?? "").trim();
  if (passed) return passed;
  return "guest";
}

export type UiLayoutStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

/**
 * Read the principal-keyed blob. If missing, copy once from the legacy
 * display-name key (when it differs), then delete the name key so the next
 * same-name occupant cannot inherit it.
 */
export function readUiLayoutCache(args: {
  storagePrefix: string;
  storageUserId: string;
  legacyUserId?: string | null;
  storage: UiLayoutStorage;
}): string | null {
  const primaryKey = args.storagePrefix + args.storageUserId;
  try {
    const primary = args.storage.getItem(primaryKey);
    if (primary) return primary;
    const legacyId = (args.legacyUserId ?? "").trim();
    if (!legacyId || legacyId === args.storageUserId) return null;
    const legacyKey = args.storagePrefix + legacyId;
    const legacy = args.storage.getItem(legacyKey);
    if (!legacy) return null;
    args.storage.setItem(primaryKey, legacy);
    args.storage.removeItem(legacyKey);
    return legacy;
  } catch {
    return null;
  }
}

/**
 * After a failed/empty getUserUiLayout, do not treat a name-keyed cache as
 * authoritative for saveUserUiLayout — that is the poison path.
 */
export function shouldSaveLocalUiLayoutToBackend(args: {
  backendBlobReconciled: boolean;
  storageUserIdIsPrincipal: boolean;
}): boolean {
  if (!args.backendBlobReconciled) return false;
  return args.storageUserIdIsPrincipal === true;
}
