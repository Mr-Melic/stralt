/**
 * Owner-tool confirm copy. Live canister writes must not look like drafts.
 * Keep strings stable — AdminDashboard ConfirmDialog bodies import these.
 */

/** Load Defaults writes the shipped 90-name pool immediately. */
export function adminNamePoolInitConfirmBody(): string {
  return "This writes the shipped 90-name pool to the live canister immediately. Existing names stay. This button cannot undo the write.";
}

/** Boss Rush Publish writes opaque JSON live — not a browser draft. */
export function adminBossRushPublishConfirmBody(): string {
  return "This publishes the entire Boss Rush JSON to the canister immediately. Room enable/reward toggles become live. This is not a browser draft.";
}

/** Visuals Reset is editor + local cache only until Save Palette. */
export function adminPaletteResetConfirmBody(): string {
  return "This clears the editor and local palette cache only. The canister palette stays unchanged until you click Save Palette.";
}

export function adminAdSaveFailedCopy(): string {
  return "Failed to save ad box";
}

export function adminAdClearFailedCopy(): string {
  return "Failed to clear ad box";
}
