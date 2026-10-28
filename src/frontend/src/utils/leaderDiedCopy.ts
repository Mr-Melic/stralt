/**
 * Pack-leader fallen chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-LEADER-DIED-BRACKET: AI-tier ≥ 5 logs `[Leader died] Enemies acting
 * erratically!` then `[Leader died] ${enemy.pieceType} acts erratically!`
 * and `${enemy.pieceType} wildly casts ${spell}!`. Distinct from
 * UX-HIT-LOG-PIECETYPE (damage / cast-on-you) and UX-ENEMY-TURN-PIECETYPE
 * (heal / ends turn / uses).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "An enemy";
}

export const PACK_ERRATIC_LOG = "The pack scatters — their leader fell.";

export function unitErraticLog(unitName: string): string {
  return `${displayName(unitName)} acts wildly.`;
}

export function wildCastLog(unitName: string, spellName: string): string {
  const who = displayName(unitName);
  const spell = String(spellName ?? "").trim() || "a spell";
  return `${who} wildly casts ${spell}!`;
}
