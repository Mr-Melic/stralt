/**
 * Dual spell-loadout schema.
 *
 * Character.spellBarOrder : ?[Text] is the official bar (WX
 * setSpellBarOrder). Character.activeSpells : ?[Nat] is a latent catalog-
 * index loadout. saveActiveSpells still exists; official UI does not call
 * it. Wiring it would treat Nat as a spell id. Catalog reorder / rename
 * would remap yesterday's bar.
 *
 * setSpellBarOrder filters to spellLevelKeys. Empty keys (createCharacter
 * _starterCharacter, never-upgraded) persist [] even when the UI bar shows
 * catalog starters. Cross-device then re-derives from the live catalog, not
 * the player's last arrangement. Do not add ownedSpellIds until a later
 * chain file after 20260901 (SDEG-004).
 *
 * No WorldExploration / main.mo edits while older persist PRs queue.
 */

export const OFFICIAL_SPELL_BAR_FIELD = "spellBarOrder";
export const LATENT_NAT_LOADOUT_FIELD = "activeSpells";

export function officialCallsSaveActiveSpells(): boolean {
  return false;
}

export function isTextSpellIdLoadout(
  ids: readonly (string | number | bigint)[],
): boolean {
  return ids.length > 0 && ids.every((id) => typeof id === "string");
}

export function isNatCatalogIndexLoadout(
  ids: readonly (string | number | bigint)[],
): boolean {
  return (
    ids.length > 0 &&
    ids.every(
      (id) =>
        typeof id === "bigint" ||
        (typeof id === "number" && Number.isInteger(id)),
    )
  );
}

/**
 * Catalog-index loadouts break when the seeded catalog order changes
 * (admin insert, OLD_SPELL_IDS purge, rename). Text ids survive reorder.
 */
export function natIndexLoadoutBreaksOnCatalogReorder(args: {
  stored: readonly (number | bigint)[];
  catalogOrderChanged: boolean;
}): boolean {
  return args.stored.length > 0 && args.catalogOrderChanged;
}

/** Matches setSpellBarOrder: drop ids not in spellLevelKeys. */
export function filterSpellBarToOwnedKeys(
  spellIds: readonly string[],
  spellLevelKeys: readonly string[],
): string[] {
  return spellIds.filter((id) => spellLevelKeys.includes(id));
}

export function emptyKeysDropOfficialSpellBar(
  spellIds: readonly string[],
  spellLevelKeys: readonly string[],
): boolean {
  return (
    spellIds.length > 0 &&
    spellLevelKeys.length === 0 &&
    filterSpellBarToOwnedKeys(spellIds, spellLevelKeys).length === 0
  );
}
