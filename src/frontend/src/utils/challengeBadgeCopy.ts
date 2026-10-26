/**
 * Challenge “badge” reward chrome. Display only — not wired into
 * ChallengePanel.tsx (older UX / combat PRs own that host).
 *
 * UX-CHALLENGE-BADGE-VOID: legendary offers print `Badge: Untouchable`
 * with no inventory, recap chip, or Board column. Rewards persist Doka/XP
 * only (`challengeRewards.ts`). Distinct from UX-FEATS-VS-ACHIEVEMENTS
 * and UX-CHALLENGE-FAIL-COPY.
 */

export function challengeBadgeRewardLine(badge: string): string {
  const name = String(badge ?? "").trim();
  if (!name) return "";
  return `Title: ${name} — a name only, not an item`;
}
