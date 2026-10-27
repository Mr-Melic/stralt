/**
 * Non-DoT duration tick chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-EFFECT-EXPIRED-FALSE: processActiveEffects logs
 * `{name} expired (… ended)` for every decremented non-DoT, including rows
 * that still have turns left (tickNonDotEffects.decremented is pre-tick
 * duration; remaining keeps duration-1). Distinct from UX-STATUS-TURNS-SUFFIX
 * (HUD `{n}t` pills) and UX-DOT-LOG-ENGINEER (DoT dump).
 */

function floorTurns(n: number): number {
  return Math.floor(Number(n) || 0);
}

function displayName(raw: string): string {
  const name = String(raw ?? "").trim();
  return name || "Effect";
}

/**
 * Battle-log line after a non-DoT duration tick.
 * `turnsAfterTick` is duration-1 (0 or less means the row dropped).
 */
export function statusDurationLog(
  effectName: string,
  turnsAfterTick: number,
  signedMag: string,
  stat: string,
): string {
  const name = displayName(effectName);
  const mag = String(signedMag ?? "").trim();
  const st = String(stat ?? "")
    .trim()
    .toUpperCase();
  const magBit = mag && st ? ` (${mag} ${st})` : "";
  const n = floorTurns(turnsAfterTick);
  if (n <= 0) return `${name} ended${magBit}.`;
  const turnBit = n === 1 ? "1 turn left" : `${n} turns left`;
  return `${name}: ${turnBit}${magBit}.`;
}
