/**
 * Copy code toasts “GameKey copied” and returns. The overlay still holds
 * the plaintext key until Mark emailed. Operators close the overlay after
 * copy and leave a redeemable secret on the canister (and in the
 * clipboard) with no wipe reminder.
 *
 * Unique 2026-10-27 file — do not merge into adminOwnerUx.revealMask.ts
 * (#1066 mask), adminOwnerUx.mailtoSecret.ts (#1115 mailto), or
 * AdminGameKeyPurchases.tsx (#492 / #664). Not wired (stack).
 */

export const OWNER_GAMEKEY_COPIED_TOAST =
  "GameKey copied. Send it, then Mark emailed so the reveal is wiped.";

export function ownerGameKeyCopiedToast(): string {
  return OWNER_GAMEKEY_COPIED_TOAST;
}

export function shouldRemindMarkEmailedAfterCopy(): true {
  return true;
}

export function ownerGameKeyCopiedToastOnMain(): "GameKey copied" {
  return "GameKey copied";
}
