/**
 * Owner Purchases screenshare redact helpers.
 *
 * GameKey table shows email + principal. Optional column redact must not
 * treat a missing email/principal as an error — empty is a valid default.
 * Not wired into AdminGameKeyPurchases (stack; overlap #492/#664).
 */

export function redactOwnerPrincipal(
  value: string | undefined | null,
  redacted: boolean,
): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (!redacted) return raw;
  if (raw.length <= 10) return "••••";
  return `${raw.slice(0, 5)}…${raw.slice(-5)}`;
}

export function redactOwnerEmail(
  value: string | undefined | null,
  redacted: boolean,
): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (!redacted) return raw;
  const at = raw.indexOf("@");
  if (at <= 0 || at === raw.length - 1) return "••••";
  const local = raw.slice(0, at);
  const domain = raw.slice(at + 1);
  const keep = local.slice(0, 1);
  return `${keep}•••@${domain}`;
}

export function ownerPiiColumnsHiddenCopy(redacted: boolean): string {
  return redacted
    ? "Email and principal are redacted for screenshare."
    : "Email and principal are visible to the operator.";
}
