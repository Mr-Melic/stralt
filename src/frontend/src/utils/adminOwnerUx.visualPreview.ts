/**
 * Catalog visual thumbnail. Empty / unsafe URLs must not render <img>
 * and must never be treated as an error — Default Pixel Visual is valid.
 */

export const STORED_URL_PREVIEW_CAPTION =
  "Stored URL preview — not rendered in world";

export function catalogVisualPreviewSrc(
  storedUrl: string | undefined | null,
  isUnsafeUrl: (url: string) => boolean,
): string | null {
  if (typeof storedUrl !== "string") return null;
  const trimmed = storedUrl.trim();
  if (!trimmed) return null;
  if (isUnsafeUrl(trimmed)) return null;
  return trimmed;
}
