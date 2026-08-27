/**
 * Canonical XP curve shared by the frontend HUD and backend applyRewards.
 *
 * Level N→N+1 requires 100 * 2^(N-1):
 *   1→2 = 100, 2→3 = 200, 3→4 = 400, …
 *
 * applyRewards must use the same threshold. Using 100 * 2^N (off by one)
 * silently blocks intended level-ups and reverts portal/victory local math.
 */
export function xpForNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  return 100 * 2 ** (safeLevel - 1);
}

/**
 * Mirrors backend applyRewards XP leveling: add the delta to leftover XP
 * in the current level, then consume thresholds until leftover is below
 * the next level's requirement.
 */
export function applyXpDelta(
  currentXp: number,
  currentLevel: number,
  xpDelta: number,
): { newXp: number; newLevel: number } {
  let newXp =
    Math.max(0, Math.floor(Number(currentXp) || 0)) +
    Math.max(0, Math.floor(Number(xpDelta) || 0));
  let newLevel = Math.max(1, Math.floor(Number(currentLevel) || 1));
  while (newXp >= xpForNextLevel(newLevel)) {
    newXp -= xpForNextLevel(newLevel);
    newLevel += 1;
  }
  return { newXp, newLevel };
}
