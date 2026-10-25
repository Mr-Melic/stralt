/**
 * GameKey reveal overlay paints the full 120-char plaintext in a
 * textarea. Email/principal column redact (#838 adminOwnerUx.piiRedact.ts)
 * does not cover this overlay. Screenshare of Purchases leaks a live
 * redeemable key. Empty code is a valid default (no reveal) and must
 * not appear as an error.
 *
 * Unique 2026-10-25 file — do not merge into piiRedact or overlayKey
 * (#945 Escape). Not wired into AdminGameKeyPurchases (stack; #492/#664).
 */

export function maskOwnerGameKey(code: string, revealed: boolean): string {
  const raw = code.trim();
  if (!raw) return "";
  if (revealed) return raw;
  if (raw.length <= 8) return "••••";
  return `${"•".repeat(Math.min(24, raw.length - 4))}${raw.slice(-4)}`;
}

export function ownerGameKeyLooksFullyVisible(
  display: string,
  code: string,
): boolean {
  const raw = code.trim();
  if (!raw) return false;
  return display === raw;
}

export function ownerGameKeyRevealShowsPlaintextOnMain(): true {
  return true;
}

export function ownerGameKeyEmptyIsValidDefault(code: string): boolean {
  return code.trim().length === 0;
}
