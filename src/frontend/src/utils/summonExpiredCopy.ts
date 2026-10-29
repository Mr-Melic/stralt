/**
 * Controlled-summon fade chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-SUMMON-EXPIRED-PIECETYPE (reported 2026-10-28, helper locked this run):
 * when turnsRemaining ≤ 0 the log is `${nextCombatant.pieceType ?? "Summon"}
 * expired`. “Expired” is the same lie as buff ticks (UX-EFFECT-EXPIRED-FALSE);
 * the name is chess pieceType (UX-SUMMON-NAME-PIECETYPE is the control bar).
 * Distinct from both and from UX-SUMMON-AI-LOG-DUMP (AI tags).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "Summon";
}

/** Prefer a unit name. Never pieceType, summonAI, or an intern id. */
export function summonExpiredActorLabel(summon: {
  name?: string;
  assignedName?: string;
}): string {
  const named = String(summon.name ?? "").trim();
  if (named) return named;
  const assigned = String(summon.assignedName ?? "").trim();
  if (assigned) return assigned;
  return "Summon";
}

export function summonExpiredLog(unitName: string): string {
  return `${displayName(unitName)} fades from the field.`;
}
