/**
 * Ground-Doka pickup chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-GROUND-DOKA-LOG-ONLY: spawn and collect only `logBattleEntry`. Collect
 * prefixes `[COLLECT]`, which reads as a debug tag. Distinct from
 * UX-HEAL-JACKPOT-UNNAMED (HUD 1-Doka full heal) and UX-SHRINE-INVISIBLE
 * (silent altar +300).
 */

function floorPos(n: number): number {
  return Math.max(1, Math.floor(Number(n) || 1));
}

/** Battle-log line when coins appear on the map. */
export function groundDokaSpottedLog(count: number): string {
  const n = floorPos(count);
  return n === 1
    ? "You notice a Doka coin on the ground."
    : `You notice ${n} Doka coins on the ground.`;
}

/** Battle-log line after a one-shot claim. No [COLLECT] tag. */
export function groundDokaCollectedLog(value: number): string {
  const n = floorPos(value);
  return `You found ${n} Doka on the ground.`;
}
