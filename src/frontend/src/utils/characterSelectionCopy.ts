/**
 * Character-selection chrome. Display only — not wired into CharacterSelection.tsx
 * (forbidden while older open PRs own that file).
 *
 * UX-SELECT-SLOT-LITERAL-ESCAPE: JSX text nodes do not decode `\uXXXX` escapes,
 * so slot headers currently render the characters "\u2694" literally.
 * UX-SELECT-PAPER-BABY-HEADLINE: landing brands ÆSTRALTØ; this screen still says
 * Paper Baby Vampire.
 */

/** Slot card header — real crossed-swords glyph, not a raw escape sequence. */
export const SLOT_HEADER = (slotNumber: number): string =>
  `⚔ Slot ${slotNumber}`;

/** Loading line while character slots fetch. */
export const LOADING_SLOTS = "Loading character slots…";

/** Page headline after account name is set. */
export const SELECTION_HEADLINE = "Choose your champion";

/** Subcopy under the headline. Welcome name is interpolated by the host. */
export const SELECTION_SUBCOPY =
  "Select a champion slot or forge a new one. The name on each card is what the realm HUD and Board use.";
