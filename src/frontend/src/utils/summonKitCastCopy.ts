/**
 * Player-controlled summon kit-cast chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-SUMMON-KIT-CAST-PIECETYPE: castControlledSummonSpell logs
 * `${summon.pieceType} casts ${plan.spell.name ?? plan.spell.id}`. Distinct
 * from UX-SUMMON-NAME-PIECETYPE (control bar), UX-SUMMON-EXPIRED-PIECETYPE
 * (fade), and UX-SUMMON-AI-LOG-DUMP (AI `[cast]` tags).
 */

function displayName(raw: string, fallback: string): string {
  const name = String(raw ?? "").trim();
  return name || fallback;
}

export function summonKitActorLabel(summon: {
  name?: string;
  assignedName?: string;
}): string {
  const named = String(summon.name ?? "").trim();
  if (named) return named;
  const assigned = String(summon.assignedName ?? "").trim();
  if (assigned) return assigned;
  return "Summon";
}

export function summonKitCastLog(unitName: string, spellName: string): string {
  return `${displayName(unitName, "Summon")} casts ${displayName(spellName, "a spell")}.`;
}
