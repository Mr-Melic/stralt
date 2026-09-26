/**
 * Leaderboard is a derived persist view, not a separate map.
 *
 * `getLeaderboard` (`main.mo` 3390–3433) walks `characterSlots` and counts
 * `achievementProgress` rows where `claimed` is true — not `unlocked`.
 * Official UI never calls `saveKillCount`, so `killCount` stays 0 except
 * for raw clients. Frontend `useLeaderboardQueries` then `Number()`s Nat
 * fields (level / killCount / achievementsCompleted), which saturates at
 * `MAX_SAFE_INTEGER`.
 *
 * Distinct from unused `useSaveKillCount` (MTD-005) and from SDEG-008
 * (claim pays current `dokaReward`). A six-month player with many unlocks
 * who has not claimed (#437 freeze) ranks as 0 feats.
 *
 * No schema. Ranking semantics + display bigint are HUMAN.
 */

export type LeaderboardAchievementCount = "claimed" | "unlocked";

export function leaderboardAchievementCountUses(): LeaderboardAchievementCount {
  return "claimed";
}

export function leaderboardCountsUnlockedProgress(): boolean {
  return leaderboardAchievementCountUses() === "unlocked";
}

export function officialUiWritesKillCount(): boolean {
  return false;
}

export function leaderboardHydrateUsesJsNumber(): boolean {
  return true;
}

export function leaderboardNatWouldSaturateJsNumber(value: bigint): boolean {
  return value > BigInt(Number.MAX_SAFE_INTEGER);
}
