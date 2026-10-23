/**
 * Ads have "Clear to default". Enemy and player-sprite editors have no
 * Revert control — emptying the URL is implicit. Empty after revert is
 * a valid Default Pixel Visual, never an error.
 *
 * Unique 2026-10-23 file — do not merge into adminOwnerUx.visualPool.ts
 * (#724 status/pool copy) or adminOwnerUx.visualPreview.ts (#631
 * thumbnails). Not wired into AdminDashboard (stack).
 */

import { DEFAULT_PIXEL_VISUAL_STATUS } from "./adminVisualStatus.ts";

export function ownerVisualRevertLabel(): string {
  return "Revert to Default Pixel Visual";
}

export function shouldOfferOwnerVisualRevert(
  hasCustomOverride: boolean,
): boolean {
  return hasCustomOverride === true;
}

export function ownerVisualRevertLeavesValidEmpty(
  emptyAfterRevert: boolean,
): boolean {
  return emptyAfterRevert === true;
}

export function ownerVisualRevertStatusAfterClear(): string {
  return DEFAULT_PIXEL_VISUAL_STATUS;
}

export function ownerVisualRevertIsError(): false {
  return false;
}

export function ownerVisualRevertConfirmBody(
  kind: "enemy" | "sprite" | "ad",
): string {
  if (kind === "ad") {
    return "This hides the landing-page slot immediately (valid default). The custom image and link are removed. Cancel does not write.";
  }
  if (kind === "sprite") {
    return "This clears stored facing URLs. The piece keeps the Default Pixel Visual. Empty is valid — not an error. World combat still uses chess-piece pixels. Cancel does not write.";
  }
  return "This clears the stored sprite URL. The spawn template keeps the Default Pixel Visual. Empty is valid — not an error. The URL was catalog storage only. Cancel does not write.";
}
