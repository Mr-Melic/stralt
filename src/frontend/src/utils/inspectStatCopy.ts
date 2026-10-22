/**
 * Inspect / Statistics acronym titles. Display only.
 *
 * Side-panel Statistics and StatPopup print SP / SR / RES / CHC / INIT / FAIL
 * with no expansion. Players cannot answer “what does this number do?”
 * Inspect FAIL is also often 0 (CharacterStats.fail is hardcoded) while the
 * HUD Statistics row uses live spellFailChance — that mismatch is
 * UX-FAIL-INSPECT-ZERO and is not fixed here.
 *
 * This helper is locked, not wired — StatPopup and WorldExploration are
 * owned by older open PRs. Do not change combat math when wiring.
 */

export type InspectStatKey = "SP" | "SR" | "RES" | "CHC" | "INIT" | "FAIL";

export const INSPECT_STAT_TITLE: Record<InspectStatKey, string> = {
  SP: "Spell Power — +% spell damage and heals",
  SR: "Spell Resist — −% incoming spell damage (not physical, not DoT)",
  RES: "Resistance — −% all incoming damage",
  CHC: "Crit Chance — % chance a hit deals double",
  INIT: "Initiative — turn order",
  FAIL: "Fail — % chance a spell fizzles (still spends AP, no cooldown)",
};

export function inspectStatTitle(key: string): string {
  const token = String(key ?? "")
    .trim()
    .toUpperCase();
  return INSPECT_STAT_TITLE[token as InspectStatKey] ?? token;
}
