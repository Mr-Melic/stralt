/**
 * Owner ConfirmDialog / PurchaseConfirm close the overlay, then fire the
 * actor write. Shop grant/ban/unban, GameKey approve/reject/emailed, ad
 * Clear, and catalog deletes all do this on main. A failed write leaves
 * only a toast; a second click can race the in-flight call.
 *
 * Unique 2026-10-23 file — do not merge into adminOwnerUx.spriteSaveClose.ts
 * (#883 editor close), adminOwnerUx.confirmOnce.ts (#664 latch),
 * adminOwnerUx.shopBusy.ts (#631 grant lock), or adminOwnerUx.gameKeyBusy.ts
 * (#664). Not wired into AdminDashboard / AdminGameKeyPurchases (stack).
 */

export type OwnerConfirmWritePhase = "idle" | "pending" | "ok" | "err";

export function shouldDismissOwnerConfirm(
  phase: OwnerConfirmWritePhase,
): boolean {
  return phase === "ok";
}

export function shouldKeepOwnerConfirmOpen(
  phase: OwnerConfirmWritePhase,
): boolean {
  return !shouldDismissOwnerConfirm(phase);
}

export function ownerConfirmButtonDisabled(
  phase: OwnerConfirmWritePhase,
): boolean {
  return phase === "pending";
}

export function ownerConfirmDismissedBeforeSettle(args: {
  dialogClosed: boolean;
  phase: OwnerConfirmWritePhase;
}): boolean {
  return args.dialogClosed === true && args.phase !== "ok";
}
