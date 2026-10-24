/**
 * Overworld Stats-panel vitals chrome. Display only — not wired into
 * WorldExploration.tsx.
 *
 * UX-HEAL-RATIO-CRYPTIC: button ends with "(1:3)" without saying which side is
 * HP vs Doka (engine is 3 HP per 1 Doka).
 * UX-OVERWORLD-AP-MP-IDLE: AP/MP orbs show full battle budgets out of combat
 * with no "battle only" cue, so walking looks like it might spend them.
 */

export const HEAL_WITH_DOKA_LABEL = (
  healHp: number,
  dokaCost: number,
): string => `♥ Heal ${healHp} HP for ${dokaCost} Doka (3 HP per 1 Doka)`;

export const HEAL_NEED_DOKA_LABEL = "♥ Heal (Need Doka)";

export const HEAL_AFFORD_TITLE = (hpNeeded: number, dokaCost: number): string =>
  `Spend ${dokaCost} Doka to restore ${hpNeeded} HP (3 HP per 1 Doka)`;

export const HEAL_BROKE_TITLE = "Not enough Doka to heal";

/** Orb title outside battle — clarifies AP/MP are fight budgets. */
export const OVERWORLD_ORB_TITLE = (
  label: "HP" | "AP" | "MP",
  value: number,
  max: number,
): string => {
  if (label === "HP") return `HP ${value} / ${max}`;
  return `${label} ${value} / ${max} — battle budget (not spent while exploring)`;
};
