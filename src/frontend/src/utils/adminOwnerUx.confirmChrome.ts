/**
 * ConfirmDialog / PurchaseConfirm on main have Cancel + Confirm only.
 * No disabled, no pending label, no in-dialog error. #945
 * shouldDismissOwnerConfirm cannot show Failed in-dialog until this
 * chrome exists.
 *
 * Unique 2026-10-24 file — do not merge into adminOwnerUx.confirmDismiss.ts
 * (#945 phase machine), adminOwnerUx.confirmOnce.ts (#664 latch), or
 * adminOwnerUx.overlayKey.ts (#945 Escape). Not wired (stack).
 */

export type OwnerConfirmChromePhase = "idle" | "pending" | "ok" | "err";

export type OwnerConfirmChrome = {
  confirmDisabled: boolean;
  confirmLabel: string;
  showError: boolean;
  errorText: string | null;
};

export function ownerConfirmChrome(
  phase: OwnerConfirmChromePhase,
  idleLabel: string,
): OwnerConfirmChrome {
  if (phase === "pending") {
    return {
      confirmDisabled: true,
      confirmLabel: "Working…",
      showError: false,
      errorText: null,
    };
  }
  if (phase === "err") {
    return {
      confirmDisabled: false,
      confirmLabel: idleLabel,
      showError: true,
      errorText:
        "Write failed — retry or Cancel. The live catalog was not changed.",
    };
  }
  return {
    confirmDisabled: false,
    confirmLabel: idleLabel,
    showError: false,
    errorText: null,
  };
}

export function ownerConfirmDialogHasPendingSlotOnMain(): false {
  return false;
}

export function ownerConfirmDialogHasErrorSlotOnMain(): false {
  return false;
}

export function ownerPurchaseConfirmHasPendingSlotOnMain(): false {
  return false;
}
