/**
 * Shop Grant / Ban / Unban and Settings Transfer only check a non-empty
 * string, then call Principal.fromText after ConfirmDialog dismisses.
 * Garbage IDs still open the live-write confirm; the throw is toast-only
 * after the operator already confirmed.
 *
 * Unique 2026-10-25 file — do not merge into adminOwnerUx.grantLink.ts
 * (#1001 purchaseId null), adminOwnerUx.shopBusy.ts (#631 in-flight lock),
 * or adminOwnerUx.roleGrant.ts (#1001 TRANSFER token). Not wired (stack).
 */

import { Principal } from "@dfinity/principal";

export function ownerPrincipalParseError(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return "Enter a principal ID";
  try {
    Principal.fromText(trimmed);
    return null;
  } catch {
    return "Principal ID is not valid";
  }
}

export function shouldOpenOwnerPrincipalConfirm(text: string): boolean {
  return ownerPrincipalParseError(text) === null;
}

export function ownerPrincipalConfirmOpensOnNonEmptyOnlyOnMain(args: {
  trimmedLength: number;
  parsedOk: boolean;
}): boolean {
  return args.trimmedLength > 0 && args.parsedOk !== true;
}

export function ownerPrincipalParsedAfterConfirmOnMain(): true {
  return true;
}
