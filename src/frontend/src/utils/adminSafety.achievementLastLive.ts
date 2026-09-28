/**
 * Client mirror of AdminGuard.achievementLastLiveRejected.
 * Do not add this to adminSafety.ts — queued PRs already own that file.
 * Do not recopy #437 live-reward or #460 condition-taken.
 * Backend enforcement is authoritative.
 *
 * Failure: official Admin sets active=false or deletes the last remaining
 * live catalog row. markAchievementUnlocked then #err "Achievement is
 * retired" / "Unknown achievement", so first-win and wallet feats never
 * grant. Already-inactive rows and inactive drafts may still be written.
 */

export function achievementLastLiveRejected(args: {
  id: string;
  nextActive: boolean;
  existing: ReadonlyArray<{
    id: string;
    active: boolean;
  }>;
}): string | null {
  if (!args.id) return "Achievement id cannot be empty";
  if (args.id.length > 64) {
    return "Achievement id exceeds maximum length";
  }
  if (args.nextActive) return null;
  const row = args.existing.find((c) => c.id === args.id);
  if (!row || row.active === false) return null;
  const otherLive = args.existing.filter(
    (c) => c.id !== args.id && c.active,
  ).length;
  if (otherLive === 0) {
    return "Cannot empty the live achievement catalog";
  }
  return null;
}
