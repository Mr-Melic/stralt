/**
 * Enemy heal / skip / intent / uses chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-ENEMY-TURN-PIECETYPE (reported 2026-10-28, helper locked this run):
 * `${enemy.pieceType} heals N HP`, `uses ${spell}!`, `ends turn`,
 * `skipped (out of range) (${intent})`, `${intent ?? "moves"}`. Skip
 * parentheticals leak intern tokens (`cooldown`, `no-spell`, `cap`).
 * Distinct from UX-HIT-LOG-PIECETYPE (damage / cast-on-you) and
 * UX-LEADER-DIED-BRACKET (erratic after the leader falls).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "An enemy";
}

function floorNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

const INTERN_INTENTS = new Set(["hold", "wait", "no-spell", "cap", "cooldown"]);

export function enemyHealsLog(unitName: string, hp: number): string {
  return `${displayName(unitName)} heals ${floorNat(hp)} HP.`;
}

export function enemyUsesLog(unitName: string, spellName: string): string {
  return `${displayName(unitName)} uses ${displayName(spellName)}!`;
}

export function enemyEndsTurnLog(unitName: string): string {
  return `${displayName(unitName)} ends their turn.`;
}

export function enemySkipLog(unitName: string, intent?: string): string {
  const who = displayName(unitName);
  const raw = String(intent ?? "").trim();
  if (!raw || INTERN_INTENTS.has(raw)) return `${who} holds.`;
  return `${who} cannot reach you.`;
}

export function enemyMovesLog(unitName: string): string {
  return `${displayName(unitName)} moves.`;
}
