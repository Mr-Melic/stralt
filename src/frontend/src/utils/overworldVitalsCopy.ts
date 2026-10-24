/**
 * Overworld Stats-panel vitals chrome. Display only — not wired into
 * WorldExploration.tsx.
 *
 * UX-HEAL-RATIO-CRYPTIC: visible label still ends with "(1:3)" on main.
 * Open PR #588 `healHudCopy.ts` already aligns hover with the partial heal
 * but keeps "(1:3)" on the button — union that helper when wiring (pass the
 * affordable slice, never the full missing-HP price).
 * UX-OVERWORLD-AP-MP-IDLE: AP/MP orbs show full battle budgets out of combat
 * with no "battle only" cue, so walking looks like it might spend them.
 * UX-HEAL-JACKPOT-UNNAMED: 0.5% full-HP / 1 Doka roll is never named on the
 * control; the hit banner is casino 🎰 chrome.
 */

export const HEAL_WITH_DOKA_LABEL = (
  healHp: number,
  dokaCost: number,
): string => `♥ Heal ${healHp} HP for ${dokaCost} Doka (3 HP per 1 Doka)`;

export const HEAL_NEED_DOKA_LABEL = "♥ Heal (Need Doka)";

/** Hover — same affordable slice as the label (union #588 UX-HEAL-TITLE-MISMATCH). */
export const HEAL_AFFORD_TITLE = (healHp: number, dokaCost: number): string =>
  `Heal ${healHp} HP for ${dokaCost} Doka (3 HP per 1 Doka)`;

export const HEAL_BROKE_TITLE = "Not enough Doka to heal";

/** Rare overworld heal blessing — never casino chrome. */
export const HEAL_JACKPOT_HINT =
  "Rare blessing: a Doka exchange can restore all HP for 1 Doka.";

/** Orb title outside battle — clarifies AP/MP are fight budgets. */
export const OVERWORLD_ORB_TITLE = (
  label: "HP" | "AP" | "MP",
  value: number,
  max: number,
): string => {
  if (label === "HP") return `HP ${value} / ${max}`;
  return `${label} ${value} / ${max} — battle budget (not spent while exploring)`;
};
