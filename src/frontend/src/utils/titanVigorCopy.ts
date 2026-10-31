/**
 * Titan's Vigor roll chrome. Display only — not wired into
 * mapModifiers.ts (older PRs may restack that registry).
 *
 * UX-TITAN-ROLL-XN: onDamageDealt logs `Titan's Vigor rolls x${roll} damage.`
 * so the battle log reads `Titan's Vigor rolls x3 damage.` Distinct from
 * UX-NO-MODIFIER-LOG (empty maps) and UX-HAZARD-COUNT-DETECTED (tile kinds).
 * Do not change the 1–5 roll or the HP bonus.
 */

const ROLL_WORDS: Record<number, string> = {
  1: "Titan's Vigor leaves the blow unchanged.",
  2: "Titan's Vigor doubles the blow.",
  3: "Titan's Vigor triples the blow.",
  4: "Titan's Vigor makes this blow four times as strong.",
  5: "Titan's Vigor makes this blow five times as strong.",
};

function clampRoll(n: number): number {
  const raw = Math.floor(Number(n) || 0);
  if (raw < 1) return 1;
  if (raw > 5) return 5;
  return raw;
}

export function titanVigorLog(roll: number): string {
  return ROLL_WORDS[clampRoll(roll)];
}
