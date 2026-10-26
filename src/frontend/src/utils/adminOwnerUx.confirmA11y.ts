/**
 * ConfirmDialog and PurchaseConfirm are visual overlays only: no
 * role="alertdialog", no aria-modal, no inert on the dashboard behind
 * them, no focus trap, no initial focus on Cancel. Tab leaves the
 * overlay and can edit Grant amount / GameKey Doka draft while the
 * title still shows the previous value (see confirmSnapshot).
 *
 * Unique 2026-10-26 file — do not merge into adminOwnerUx.confirmEnter.ts
 * (#1066 Enter), adminOwnerUx.overlayKey.ts (#945 Escape),
 * adminOwnerUx.confirmChrome.ts (#1001 pending slots), or
 * adminOwnerUx.confirmOnce.ts (#664 double-click). Not wired (stack).
 */

export const OWNER_CONFIRM_ROLE = "alertdialog" as const;

export function ownerConfirmA11yProps(args: {
  titleId: string;
  bodyId: string;
}): {
  role: typeof OWNER_CONFIRM_ROLE;
  "aria-modal": true;
  "aria-labelledby": string;
  "aria-describedby": string;
} {
  return {
    role: OWNER_CONFIRM_ROLE,
    "aria-modal": true,
    "aria-labelledby": args.titleId,
    "aria-describedby": args.bodyId,
  };
}

export function ownerConfirmInitialFocus(): "cancel" {
  return "cancel";
}

export function ownerConfirmBackgroundShouldBeInert(): true {
  return true;
}

export function ownerConfirmHasAlertdialogRoleOnMain(): false {
  return false;
}

export function ownerPurchaseConfirmHasAlertdialogRoleOnMain(): false {
  return false;
}

export function ownerConfirmTrapsFocusOnMain(): false {
  return false;
}
