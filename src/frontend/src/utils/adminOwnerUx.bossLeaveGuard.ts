/**
 * `hasOpenEditor` (`AdminDashboard.tsx` ~5479–5485) covers enemy / region /
 * spell / modifier / achievement / sprite editors. BossesTab keeps in-memory
 * `drafts` plus `expandedId` and is omitted, so Leave dashboard discards an
 * expanded boss form with no warning.
 *
 * Unique 2026-10-31 file — do not merge into adminOwnerUx.dirty.ts (#838)
 * or restack the leave-guard (~5499). Not wired (stack).
 */

export function ownerLeaveGuardNeedsBossDraft(
  expandedId: string | null | undefined,
  unsavedDraftIds: readonly string[],
): boolean {
  if (typeof expandedId === "string" && expandedId.length > 0) return true;
  return unsavedDraftIds.length > 0;
}

export function ownerHasOpenEditorOmitsBossesOnMain(): true {
  return true;
}
