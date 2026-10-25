/**
 * Initiative-strip chrome. Display only — not wired into InitiativeStrip.tsx
 * (forbidden while older a11y / combat PRs own that file).
 *
 * UX-INIT-STRIP-LITERAL-ESCAPE: JSX text nodes do not decode `\uXXXX` escapes,
 * so the leader crown, enraged flame, initiative bolt, spell-count chip, and
 * hover “LEADER” line currently render the characters "\uD83D\uDC51" literally.
 * Distinct from UX-SELECT-SLOT-LITERAL-ESCAPE (CharacterSelection slot cards).
 */

/** Crown on the leader portrait and hover card. */
export const LEADER_CROWN = "👑";

/** Flame on an enraged portrait. */
export const ENRAGED_FLAME = "🔥";

/** Bolt prefix on initiative and spell-count chips. */
export const INITIATIVE_BOLT = "⚡";

/** Hover / inspect line for the pack leader. */
export const LEADER_HOVER_NOTE = `${LEADER_CROWN} LEADER — gains +stats on ally death`;

/** Initiative value under a portrait. */
export function initiativeValueLabel(initiative: number): string {
  return `${INITIATIVE_BOLT}${initiative}`;
}

/** Spell-count chip on the hover card. */
export function spellsCountLabel(count: number): string {
  return `${INITIATIVE_BOLT} ${count} spells`;
}
