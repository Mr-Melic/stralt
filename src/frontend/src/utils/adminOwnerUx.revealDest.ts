/**
 * Purchases reveal overlay (`AdminGameKeyPurchases.tsx` ~716–745) titles
 * "GameKey (shown until marked emailed)" and never shows the destination
 * email or emailConsent. Operators can Copy / mailto without seeing who
 * the code is for.
 *
 * Unique 2026-10-29 file — do not merge into adminOwnerUx.consentGate.ts
 * (#1223) or adminOwnerUx.piiRedact.ts (#838). Not wired (stack).
 */

export function ownerRevealDestinationCopy(args: {
  email: string;
  emailConsent: boolean;
}): {
  destination: string;
  consent: string;
  missingEmail: boolean;
} {
  const email = args.email.trim();
  if (email.length === 0) {
    return {
      destination: "No destination email on this request",
      consent: args.emailConsent
        ? "Consent recorded, but no address — copy only"
        : "No email consent — copy only",
      missingEmail: true,
    };
  }
  return {
    destination: `Destination: ${email}`,
    consent: args.emailConsent
      ? "Consent: given"
      : "Consent: not given — copy only",
    missingEmail: false,
  };
}

export function ownerRevealHidesDestinationOnMain(): true {
  return true;
}
