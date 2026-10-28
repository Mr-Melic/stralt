/**
 * `GameKeyRequestView.emailConsent` is mapped from the actor and never
 * shown. Open mailto is always enabled on the reveal overlay. Mailing a
 * player who did not consent is an owner-tool PII write, not a player HUD
 * concern.
 *
 * Unique 2026-10-28 file — do not merge into dokaGameKey.ts
 * (`gameKeyMailtoHref` still embeds the key; #1115 mailtoSecret) or
 * adminOwnerUx.piiRedact.ts (#838). Not wired (stack).
 */

import { validateGameKeyEmail } from "./dokaGameKey.ts";

export function ownerConsentStatusCopy(emailConsent: boolean): {
  label: string;
  tone: "ok" | "warn";
} {
  if (emailConsent) {
    return { label: "Email consent given", tone: "ok" };
  }
  return { label: "No email consent — do not mail", tone: "warn" };
}

export function shouldEnableOwnerMailto(args: {
  emailConsent: boolean;
  email: string;
}): { ok: true } | { err: string } {
  if (!args.emailConsent) {
    return { err: "Player did not consent to email" };
  }
  const emailErr = validateGameKeyEmail(args.email);
  if (emailErr) return { err: emailErr };
  return { ok: true };
}

export function ownerMailtoHrefWhenConsentMissing(): "#" {
  return "#";
}

export function ownerConsentHiddenOnMain(): true {
  return true;
}
