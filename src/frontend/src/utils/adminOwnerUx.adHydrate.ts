/**
 * AdBoxEditor `getAdBoxes().catch(() => {})` leaves image/link "".
 * Empty is a valid hidden default (AUX-AD-EMPTY-AS-ERROR). A failed
 * hydrate must not reuse that copy or Clear/Save against unknown live
 * slots.
 *
 * Unique 2026-10-28 file — do not merge into adminOwnerUx.saveFeedback.ts
 * (#883) or restack AdBoxEditor (#470 AUX-ADS-SAVE-SILENT-ERROR). Not
 * wired (stack). Distinct from save-catch toast: this is load honesty.
 */

export type OwnerAdHydrateKind =
  | "live-custom"
  | "hidden-default"
  | "load-failed";

export function ownerAdHydrateKind(args: {
  loaded: boolean;
  imageUrl: string;
  linkUrl: string;
}): OwnerAdHydrateKind {
  if (!args.loaded) return "load-failed";
  if (args.imageUrl.trim().length > 0 || args.linkUrl.trim().length > 0) {
    return "live-custom";
  }
  return "hidden-default";
}

export function ownerAdStatusCopy(kind: OwnerAdHydrateKind): string {
  switch (kind) {
    case "load-failed":
      return "Failed to load live ad — empty fields are not the canister values";
    case "live-custom":
      return "Custom Visual — override URLs set";
    case "hidden-default":
      return "No custom ad — box hidden (valid default)";
  }
}

export function shouldDisableOwnerAdWrite(kind: OwnerAdHydrateKind): boolean {
  return kind === "load-failed";
}

export function ownerAdLoadLooksLikeEmptyDefaultOnMain(): true {
  return true;
}
