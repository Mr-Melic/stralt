/**
 * Empty spellbook catalog copy. Display only.
 *
 * SpellbookModal still says “The admin has not added any spells yet” when
 * allSpells.length === 0. Players should not be told about an admin.
 *
 * This helper is locked, not wired — SpellbookModal is owned by older open
 * PRs (#372 / #425). Do not change catalog fetch or usableByPlayer when wiring.
 */

export const SPELLBOOK_EMPTY_TITLE = "No spells available";

export const SPELLBOOK_EMPTY_BODY = "No spells in the catalog yet.";
