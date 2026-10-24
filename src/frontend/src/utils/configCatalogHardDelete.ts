/**
 * Admin catalog rows that are not stored on Character still have stable
 * Text ids. Enemy / region / map-modifier deletes are hard removes
 * (`adminDelete*Config` → Map.remove). Spell and achievement deletes
 * retire when referenced.
 *
 * Official play does not persist enemy/region/modifier ids on the
 * Character record (maps and region effects are session / live query).
 * A later required field that stored those ids would make a rename or
 * hard-delete unloadable for yesterday / six-month / pre-feature cohorts.
 *
 * Distinct from SDEG-003 (spell OLD_SPELL_IDS purge) and 10-21-003
 * (sprite URLs). Complements `catalogDeletePolicy.ts` (enemy vs spell).
 * No schema. Do not add required Character id fields until a later chain
 * file after 20260901 with aliases.
 */

export type ConfigCatalogKind = "enemy" | "region" | "mapModifier" | "spell";

export function configCatalogHardDeletesOnAdminRemove(
  kind: ConfigCatalogKind,
): boolean {
  return kind === "enemy" || kind === "region" || kind === "mapModifier";
}

export function characterRecordStoresConfigCatalogId(
  kind: ConfigCatalogKind,
): boolean {
  return kind === "spell";
}

/**
 * True when a later persist of this catalog id as a required Character
 * field would break a cohort after a hard-delete or rename.
 */
export function persistingCatalogIdWouldBreakOldPlayers(
  kind: ConfigCatalogKind,
): boolean {
  return (
    configCatalogHardDeletesOnAdminRemove(kind) &&
    characterRecordStoresConfigCatalogId(kind) === false
  );
}

export function spellDeleteRetiresWhenReferenced(): boolean {
  return true;
}
