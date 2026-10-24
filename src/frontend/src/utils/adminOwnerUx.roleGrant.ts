/**
 * Settings Transfer Admin requires typing TRANSFER, then one click
 * assignUserRole. The red button is only disabled while isPending —
 * empty token still clicks and toasts. Unlike Shop Grant/Ban there is
 * no ConfirmDialog.
 *
 * Unique 2026-10-24 file — do not merge into adminOwnerUx.entitySaveConfirm.ts
 * (#883 catalog Save) or restack SettingsTab (#334 / #539). Not wired
 * (stack). Copy already honest that the caller's admin is unchanged
 * (AUX-TRANSFER-COPY-MISLEAD).
 */

export const OWNER_ROLE_GRANT_TOKEN = "TRANSFER";

export function ownerRoleGrantTokenMatches(text: string): boolean {
  return text === OWNER_ROLE_GRANT_TOKEN;
}

export function shouldEnableOwnerRoleGrantButton(args: {
  token: string;
  principal: string;
  pending: boolean;
}): boolean {
  return (
    args.pending !== true &&
    args.principal.trim().length > 0 &&
    ownerRoleGrantTokenMatches(args.token)
  );
}

export function shouldAssignOwnerRole(args: {
  token: string;
  principal: string;
  pending: boolean;
  dialogConfirmed: boolean;
}): boolean {
  return (
    shouldEnableOwnerRoleGrantButton(args) && args.dialogConfirmed === true
  );
}

export function ownerRoleGrantButtonUnlockedOnMain(args: {
  tokenMatches: boolean;
  pending: boolean;
}): boolean {
  return args.pending !== true && args.tokenMatches !== true;
}

export function ownerRoleGrantConfirmTitle(principal: string): string {
  const p = principal.trim();
  if (!p) return "Grant admin role?";
  return `Grant admin to ${p}?`;
}

export function ownerRoleGrantConfirmBody(): string {
  return "This grants another Internet Identity full admin control immediately. Your own admin access is unchanged — this is not a transfer of the only admin. Cancel does not write.";
}
