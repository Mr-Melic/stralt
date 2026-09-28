/**
 * Owner visual-asset status. Distinct from catalog URL thumbnails
 * (`adminOwnerUx.visualPreview` on #631). Empty custom visual is valid
 * and must never surface as an error.
 */

import {
  DEFAULT_PIXEL_VISUAL_STATUS,
  STORED_URL_NOT_RENDERED_STATUS,
} from "./adminVisualStatus.ts";

export function customVisualPoolCopy(activeVariantCount: number): string {
  const n =
    typeof activeVariantCount === "number" &&
    Number.isFinite(activeVariantCount)
      ? Math.max(0, Math.floor(activeVariantCount))
      : 0;
  const noun = n === 1 ? "variant" : "variants";
  return `Custom Visual Pool — ${n} active ${noun}`;
}

export function visualAssetStatusLines(args: {
  storedCustomUrl?: boolean;
  activeVariantCount?: number;
}): {
  lines: string[];
  isError: false;
  emptyCustomIsValid: true;
} {
  const stored = args.storedCustomUrl === true;
  const poolCount =
    typeof args.activeVariantCount === "number" &&
    Number.isFinite(args.activeVariantCount)
      ? Math.max(0, Math.floor(args.activeVariantCount))
      : 0;

  const fallback =
    stored && poolCount === 0
      ? STORED_URL_NOT_RENDERED_STATUS
      : DEFAULT_PIXEL_VISUAL_STATUS;

  return {
    lines: [fallback, customVisualPoolCopy(poolCount)],
    isError: false,
    emptyCustomIsValid: true,
  };
}

export function visualUploadRequirementsBeforeSelect(
  kind: "enemy" | "sprite" | "ad",
): string {
  if (kind === "ad") {
    return "Hosted PNG/WebP, https only. Image + link together, or leave both empty to keep the slot hidden.";
  }
  if (kind === "sprite") {
    return "Four facing hosted PNG/WebP URLs, https only. Empty faces keep the Default Pixel Visual. Stored URLs are not rendered in world combat.";
  }
  return "Optional hosted PNG/WebP URL, https only. Leave blank to keep the Default Pixel Visual. A pasted URL is catalog storage only — not rendered in the world.";
}
