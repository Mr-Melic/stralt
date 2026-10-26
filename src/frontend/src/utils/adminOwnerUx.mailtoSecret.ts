/**
 * gameKeyMailtoHref(email, code) puts the 120-character redeemable
 * GameKey in the mailto body. Browser history, mail-client drafts, and
 * device sync then hold a live single-use secret. Distinct from on-screen
 * mask (#1066 adminOwnerUx.revealMask.ts) and table email redact
 * (#838 adminOwnerUx.piiRedact.ts). Do not patch dokaGameKey.ts (Purchases
 * overlap #492 / #664). Not wired (stack).
 */

import { validateGameKeyEmail } from "./dokaGameKey.ts";

export const OWNER_MAILTO_COPY_INSTRUCTION =
  "Your GameKey is ready. Open Admin → Purchases, copy the code from the reveal overlay, then paste it into this message before sending. Do not store the code in this mailto URL.";

export function ownerGameKeyMailtoHref(email: string): string {
  if (validateGameKeyEmail(email) != null) return "#";
  const subject = encodeURIComponent("Your Doka GameKey");
  const body = encodeURIComponent(OWNER_MAILTO_COPY_INSTRUCTION);
  return `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}

export function ownerMailtoBodyContainsCode(
  href: string,
  code: string,
): boolean {
  if (!code) return false;
  try {
    return decodeURIComponent(href).includes(code);
  } catch {
    return href.includes(code);
  }
}

export function shouldEmbedGameKeyInMailto(): false {
  return false;
}

export function ownerMailtoEmbedsPlaintextKeyOnMain(): true {
  return true;
}
