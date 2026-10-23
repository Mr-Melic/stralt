/**
 * Spellbook Cancel vs Upgrade copy. Display only.
 *
 * Upgrade calls persistSpellUpgrade immediately. Save Spells only writes the
 * eight battle-bar slots. Cancel is onClose — it looks like an undo but does
 * not refund Doka or drop purchased ranks.
 *
 * This helper is locked, not wired — SpellbookModal is owned by older open
 * PRs (#372 / #425). Do not defer upgradeSpell to Save when wiring; that is a
 * product call (UX-SPELLBOOK-CANCEL-KEEPS-UPGRADES).
 */

export const SPELLBOOK_CANCEL_LABEL = "Close";

export const SPELLBOOK_CANCEL_TITLE =
  "Close without changing equipped slots. Spell upgrades already spent stay spent.";

export const SPELLBOOK_SAVE_HINT =
  "Save Spells writes the eight battle-bar slots. Upgrade spends Doka immediately.";
