/**
 * Summon-AI battle-log chrome. Display only — not wired into
 * summonExecutor.ts (combat-parity / AI PRs own that file).
 *
 * UX-SUMMON-AI-LOG-DUMP: executeSummonAction pushes `[decide]` / `[cast]` /
 * `[move]` / `[melee]` / `[skip]` / `[end]` lines through SpellContext.log
 * into the player battle log. Labels prefer summonAI / pieceType / id, and
 * moves print `(x,y)` plus intern MP. Distinct from UX-SUMMON-NAME-PIECETYPE
 * (control bar) and UX-HIT-LOG-PIECETYPE (enemy damage / cast-on-you).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "Summon";
}

/** Prefer a unit name. Never summonAI, pieceType, or an intern id. */
export function summonActorLabel(summon: {
  name?: string;
  assignedName?: string;
}): string {
  const named = String(summon.name ?? "").trim();
  if (named) return named;
  const assigned = String(summon.assignedName ?? "").trim();
  if (assigned) return assigned;
  return "Summon";
}

export function summonMoveLog(actor: string): string {
  return `${displayName(actor)} moves.`;
}

export function summonCastLog(actor: string, spellName: string): string {
  return `${displayName(actor)} casts ${displayName(spellName)}.`;
}

export function summonMeleeLog(actor: string): string {
  return `${displayName(actor)} strikes.`;
}

export function summonTurnDoneLog(actor: string): string {
  return `${displayName(actor)} ends its turn.`;
}

export function summonCannotMoveLog(actor: string): string {
  return `${displayName(actor)} cannot step there.`;
}
