/**
 * World feat-unlock toast reward chrome. Display only.
 *
 * markAchievementUnlocked does not mint Doka. Players collect the grant with
 * claimAchievementReward on the Feats panel. The toast still prints "+N Doka"
 * on origin/main as if the wallet already moved.
 *
 * This helper is locked, not wired — same pattern as leaveRealmCopy (#642).
 * AchievementToast stays on main so open #485 (featToastCopy heading/aria)
 * can land first. Wire featToastRewardLabel after that PR.
 */

export const FEAT_TOAST_CLAIM_HINT = "Claim in Feats";

export function featToastRewardLabel(
  dokaReward: number | bigint | undefined,
): string | null {
  if (dokaReward == null) return null;
  const n = typeof dokaReward === "bigint" ? Number(dokaReward) : dokaReward;
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${FEAT_TOAST_CLAIM_HINT} · ${n.toLocaleString()} Doka`;
}
