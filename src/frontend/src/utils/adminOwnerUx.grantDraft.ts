/**
 * Shop Grant amount is `useState<number>(0)` and the Field onChange is
 * `Number.parseInt(v) || 0` (no radix). Clearing the input snaps to 0;
 * `0x10` parses as 16; the confirm title can then show 0 / 16. Purchases
 * already keeps a string `dokaDraft`.
 *
 * Unique 2026-10-27 file — do not merge into adminOwnerUx.confirmSnapshot.ts
 * (#1115 titled amount vs live resample) or adminSafety.ts. Not wired
 * (stack).
 */

import { validateDokaGrant } from "./adminSafety.ts";

export function parseOwnerGrantAmountDraft(
  raw: string,
): { ok: number } | { err: string } {
  const t = raw.trim();
  if (t.length === 0) {
    return { err: "Grant amount must be greater than 0" };
  }
  if (!/^\d+$/.test(t)) {
    return { err: "Grant amount must be a whole number" };
  }
  const n = Number.parseInt(t, 10);
  const grantErr = validateDokaGrant(n);
  if (grantErr) return { err: grantErr };
  return { ok: n };
}

export function shouldKeepOwnerGrantAmountAsString(): true {
  return true;
}

export function ownerShopGrantAmountCoercesEmptyToZeroOnMain(): true {
  return true;
}

export function ownerShopGrantAmountParseIntHasNoRadixOnMain(): true {
  return true;
}
