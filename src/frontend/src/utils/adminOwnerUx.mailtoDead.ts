/**
 * `gameKeyMailtoHref` returns "#" for an invalid address
 * (`dokaGameKey.ts` ~134–140). The reveal overlay still paints a blue
 * "Open mailto" `<a href="#">` (`AdminGameKeyPurchases.tsx` ~783–800),
 * so a dead hash looks like a live compose action.
 *
 * Unique 2026-10-29 file — do not merge into adminOwnerUx.consentGate.ts
 * (#1223, consent gate still stubs href to "#") or
 * adminOwnerUx.mailtoSecret.ts (#1115). Not wired (stack).
 */

export function ownerMailtoHrefLooksLive(href: string): boolean {
  const t = href.trim().toLowerCase();
  return t.startsWith("mailto:") && t.length > "mailto:".length;
}

export function ownerMailtoDeadCopy(): {
  label: string;
  hint: string;
  enabled: boolean;
} {
  return {
    label: "Mailto unavailable",
    hint: "This control is not a mail compose. Copy the GameKey instead.",
    enabled: false,
  };
}

export function ownerMailtoHashLooksLiveOnMain(): true {
  return true;
}
