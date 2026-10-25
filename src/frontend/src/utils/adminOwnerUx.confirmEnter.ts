/**
 * ConfirmDialog / PurchaseConfirm have Cancel + Confirm click targets
 * only. Enter does not submit. Operators who tab to Confirm and press
 * Enter get nothing; a second mouse click is required. Distinct from
 * overlay Escape (#945 adminOwnerUx.overlayKey.ts) and pending/error
 * slots (#1001 adminOwnerUx.confirmChrome.ts).
 *
 * Unique 2026-10-25 file — do not restack ConfirmDialog Escape (#539)
 * or PurchaseConfirm Escape (#492). Not wired (stack).
 */

export function shouldSubmitOwnerConfirmOnKey(args: {
  key: string;
  pending: boolean;
  confirmDisabled: boolean;
}): boolean {
  if (args.key !== "Enter") return false;
  if (args.pending === true) return false;
  if (args.confirmDisabled === true) return false;
  return true;
}

export function ownerConfirmIgnoresEnterWhilePending(args: {
  key: string;
  pending: boolean;
}): boolean {
  return args.key === "Enter" && args.pending === true;
}

export function ownerConfirmHandlesEnterOnMain(): false {
  return false;
}

export function ownerPurchaseConfirmHandlesEnterOnMain(): false {
  return false;
}
