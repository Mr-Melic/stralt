/**
 * Admin delete policies for catalog rows that players may still reference.
 *
 * Spells and achievements retire (usableByPlayer=false / active=false) when
 * referenced. Enemy configs hard-remove. Spell catalog OLD_SPELL_IDS purge
 * removes spellConfigs entries but never strips Character.spellLevelKeys.
 */

export type CatalogDeleteKind = "spell" | "achievement" | "enemy";

export function catalogDeleteRetiresWhenReferenced(
  kind: CatalogDeleteKind,
): boolean {
  return kind === "spell" || kind === "achievement";
}

export function enemyConfigHardDeletesWithoutReferenceCheck(): boolean {
  return true;
}

/**
 * After OLD_SPELL_IDS / admin remove from spellConfigs, character keys that
 * still list the id remain "owned" for setSpellBarOrder filtering.
 */
export function spellLevelKeysPurgedWhenCatalogEntryRemoved(): boolean {
  return false;
}

export function ghostSpellKeyRemainsOwnedAfterCatalogPurge(
  spellLevelKeys: readonly string[],
  purgedId: string,
  catalogHasId: boolean,
): boolean {
  if (catalogHasId) return false;
  return spellLevelKeys.includes(purgedId);
}

export function purchaseBuffRequiresOccupiedCharacterSlot(): boolean {
  return false;
}
