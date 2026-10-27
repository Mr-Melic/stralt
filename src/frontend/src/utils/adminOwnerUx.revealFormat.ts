/**
 * Approve / Show code paint `reveal.code` into a textarea and Copy writes
 * it to the clipboard with no `validateGameKeyFormat` check. A truncated
 * or alphabet-invalid actor payload would be emailed as a live GameKey.
 *
 * Unique 2026-10-27 file — do not merge into adminOwnerUx.revealMask.ts
 * (#1066 on-screen mask), adminOwnerUx.mailtoSecret.ts (#1115 mailto
 * body), or dokaGameKey.ts (Purchases overlap #492 / #664). Not wired
 * (stack).
 */

import { validateGameKeyFormat } from "./dokaGameKey.ts";

export function ownerGameKeyRevealBlockedReason(code: string): string | null {
  return validateGameKeyFormat(code);
}

export function shouldShowOwnerGameKeyReveal(code: string): boolean {
  return ownerGameKeyRevealBlockedReason(code) == null;
}

export function shouldCopyOwnerGameKey(code: string): boolean {
  return shouldShowOwnerGameKeyReveal(code);
}

export function ownerRevealAcceptsAnyStringOnMain(): true {
  return true;
}

export function ownerCopySkipsFormatCheckOnMain(): true {
  return true;
}
