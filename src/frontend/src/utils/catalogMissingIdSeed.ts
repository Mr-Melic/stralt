/**
 * Empty-only catalog seed (SDEG-2026-10-27-002).
 *
 * `spellConfigs`, `mapModifierConfigs`, `shopPackages`, `achievementConfigs`,
 * `bossConfigs`, and `changelogs` seed `default*()` only when `size() == 0`.
 * `initDefaultNames` already upserts missing enemy names on upgraded
 * canisters ("Does NOT use the flag guard so new names are always seeded").
 *
 * A player on a six-month-old seeded canister never sees a 16th default
 * feat / new default spell / new shop SKU added to those arrays. A fresh
 * import does. Distinct from hard-delete of a live id (10-24-014 / 10-25-005)
 * and from OLD_SPELL_IDS purge (SDEG-003).
 *
 * Policy: insert missing default ids only; never overwrite an admin-edited
 * row; never delete; replay is idempotent. Not a player-map migration and
 * not a new required Character field. Wire main.mo when that file is
 * editable; do not edit shipped 20260831 / 20260901 NewActor.
 */

export const EMPTY_ONLY_SEEDED_CATALOGS = [
  "spellConfigs",
  "mapModifierConfigs",
  "shopPackages",
  "achievementConfigs",
  "bossConfigs",
  "changelogs",
] as const;

export type CatalogRecord = { id: string; [key: string]: unknown };

/** HEAD gate: seed the whole default list only on a vacant map. */
export function shouldSeedEntireCatalogOnlyWhenEmpty(
  existingSize: number,
): boolean {
  return existingSize === 0;
}

export function missingDefaultCatalogIds(
  existingIds: readonly string[],
  defaultIds: readonly string[],
): string[] {
  const have = new Set(existingIds);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of defaultIds) {
    if (!id || have.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/**
 * Idempotent upsert: add defaults whose id is absent. Keep the stored
 * record when the id already exists (admin edits win). Never drop extras.
 */
export function upsertMissingDefaultCatalogRecords<T extends CatalogRecord>(
  existing: readonly T[],
  defaults: readonly T[],
): T[] {
  const byId = new Map<string, T>();
  for (const row of existing) {
    if (row?.id) byId.set(row.id, row);
  }
  for (const row of defaults) {
    if (!row?.id || byId.has(row.id)) continue;
    byId.set(row.id, row);
  }
  return [...byId.values()];
}

export function emptyOnlySeedMissesLaterDefaultIds(): boolean {
  return true;
}

export function catalogUpsertMustNotOverwriteExisting(): boolean {
  return true;
}
