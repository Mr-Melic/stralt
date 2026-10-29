/**
 * Pack-betrayal chrome. Display only — not wired into WorldExploration.tsx
 * (forbidden while older open PRs own that file).
 *
 * UX-BETRAYAL-PIECETYPE: AI-tier ≥ 10 logs
 * `${enemy.pieceType} turns on ${allyT.pieceType}! Betrayal!`,
 * `The leader ${allyT.pieceType} fell via betrayal!`, and
 * `DOUBLE BETRAYAL! ${sb.pieceType} also turns!`. Distinct from
 * UX-ENEMY-TURN-PIECETYPE (heal / skip / uses) and UX-LEADER-DIED-BRACKET
 * (erratic after the leader is already dead).
 */

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "An enemy";
}

export function betrayalLog(attackerName: string, victimName: string): string {
  return `${displayName(attackerName)} turns on ${displayName(victimName)}! Betrayal!`;
}

export function leaderBetrayalLog(victimName: string): string {
  return `The pack's leader ${displayName(victimName)} fell to betrayal.`;
}

export function doubleBetrayalLog(attackerName: string): string {
  return `Another betrayal — ${displayName(attackerName)} turns as well!`;
}
