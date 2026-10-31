/**
 * Paper Windstorm enemy-miss chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-WINDSTORM-MISS-PIECETYPE: enemy ranged casts log
 * `Paper Windstorm! ${enemy.pieceType}'s ${spell} missed!`. The player's
 * own miss already says “Paper Windstorm blows your spell off course!”.
 * Distinct from UX-HIT-LOG-PIECETYPE (hits) and UX-MIRROR-PIECETYPE
 * (reflect, reported this run).
 */

function displayName(raw: string, fallback: string): string {
  const name = String(raw ?? "").trim();
  return name || fallback;
}

export function windstormMissLog(unitName: string, spellName: string): string {
  const who = displayName(unitName, "An enemy");
  const spell = displayName(spellName, "a spell");
  return `Paper Windstorm blows ${who}'s ${spell} off course!`;
}
