/**
 * GameKey reveal overlay has Close but no Escape / backdrop dismiss.
 * Distinct from PurchaseConfirm Escape (AUX-PURCHASE-CONFIRM-NO-ESCAPE,
 * queued #492) and ConfirmDialog Escape (AUX-CONFIRM-NO-ESCAPE, queued
 * #539). Those are confirm dialogs; this is the plaintext-key overlay.
 *
 * Unique 2026-10-23 file — do not restack AdminGameKeyPurchases (#492 /
 * #664). Not wired (stack).
 */

export function shouldCloseOwnerOverlayOnKey(key: string): boolean {
  return key === "Escape";
}

export function ownerOverlayIgnoresKey(key: string): boolean {
  return !shouldCloseOwnerOverlayOnKey(key);
}

export function ownerOverlayClosesOnBackdrop(args: {
  targetIsBackdrop: boolean;
}): boolean {
  return args.targetIsBackdrop === true;
}
