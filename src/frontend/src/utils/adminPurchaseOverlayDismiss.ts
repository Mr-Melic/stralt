/**
 * Admin Purchases confirm / GameKey-reveal overlays use <dialog open>, not
 * showModal(), so native Escape does nothing. Window Escape and backdrop
 * click must cancel (never Approve / Reject / Mark emailed). When a confirm
 * is stacked on the reveal sheet, Escape closes only the confirm so the
 * plaintext code stays.
 */

import {
  shouldDismissShopDialogOnBackdrop,
  shouldDismissShopDialogOnKey,
} from "./shopDialogDismiss.ts";

export type GameKeyAdminEscapeTarget = "confirm" | "reveal";

export function gameKeyAdminEscapeCloses(
  key: string,
  confirmOpen: boolean,
  revealOpen: boolean,
): GameKeyAdminEscapeTarget | null {
  if (!shouldDismissShopDialogOnKey(key)) return null;
  if (confirmOpen) return "confirm";
  if (revealOpen) return "reveal";
  return null;
}

export function shouldCancelGameKeyAdminOverlayOnBackdrop(
  eventTarget: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  return shouldDismissShopDialogOnBackdrop(eventTarget, currentTarget);
}

/** Keyboard stand-in for dimmer click: Enter/Space on the overlay, not inner controls. */
export function shouldActivateGameKeyAdminOverlayDismiss(
  key: string,
  eventTarget: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  if (key !== "Enter" && key !== " ") return false;
  return shouldDismissShopDialogOnBackdrop(eventTarget, currentTarget);
}
