/**
 * Owner writers mix toast.success, a hex saveStatus pill, and inline
 * "Saved!" / "Live save committed". One vocabulary:
 * Published (live) | Draft saved (this browser) | Failed.
 *
 * Unique 2026-10-22 file — do not merge into adminOwnerUx.lifecycle.ts
 * (#724) or adminOwnerUx.catalogPublish.ts (#564).
 */

export type OwnerSaveFeedbackKind = "published" | "draft_saved" | "failed";

export function ownerSaveFeedbackCopy(
  kind: OwnerSaveFeedbackKind,
  detail?: string,
): { toast: string; inline: string } {
  const extra = typeof detail === "string" ? detail.trim() : "";
  if (kind === "published") {
    const toast = extra ? `Published — ${extra}` : "Published (live)";
    return { toast, inline: toast };
  }
  if (kind === "draft_saved") {
    const toast = extra
      ? `Draft saved — ${extra}`
      : "Draft saved (this browser only)";
    return { toast, inline: toast };
  }
  const toast = extra ? `Failed — ${extra}` : "Save failed";
  return { toast, inline: toast };
}

export function shouldShowOwnerHexSavePill(args: {
  toastAlreadyShown: boolean;
}): boolean {
  return args.toastAlreadyShown !== true;
}

export function ownerSaveFeedbackIsSplit(args: {
  toastShown: boolean;
  hexPillShown: boolean;
  inlineShown: boolean;
}): boolean {
  const n = [args.toastShown, args.hexPillShown, args.inlineShown].filter(
    Boolean,
  ).length;
  return n > 1;
}
