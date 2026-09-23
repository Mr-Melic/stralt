/**
 * World feat-unlock toast chrome. Display only.
 * Recap / Feats dialog titles live on those surfaces.
 */

export const FEAT_UNLOCKED_TOAST_HEADING = "Feat Unlocked!";

export function featUnlockedToastAriaLabel(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0
    ? `${FEAT_UNLOCKED_TOAST_HEADING} ${trimmed}`
    : FEAT_UNLOCKED_TOAST_HEADING;
}
