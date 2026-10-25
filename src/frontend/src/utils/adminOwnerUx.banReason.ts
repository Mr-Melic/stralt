/**
 * Shop Ban calls adminBanAccount(principal) with no operator reason.
 * The audit row is before=active after=banned. banPlayer(principal, reason)
 * exists and records truncateSummary(reason) (max 200). Shop has no
 * reason field, so Health/audit cannot tell why the ban happened.
 *
 * Unique 2026-10-25 file — do not merge into adminOwnerUx.auditView.ts
 * (#838 reader) or switch Shop to banPlayer without approval (audit
 * action name would change). Not wired (stack).
 */

export const OWNER_BAN_REASON_MAX = 200;
export const OWNER_SHOP_BAN_METHOD_ON_MAIN = "adminBanAccount" as const;
export const OWNER_BAN_REASON_WRITER = "banPlayer" as const;

export function ownerBanReasonError(reason: string): string | null {
  const trimmed = reason.trim();
  if (!trimmed) return "Ban reason is required for the audit log";
  if (trimmed.length > OWNER_BAN_REASON_MAX) {
    return "Ban reason exceeds 200 characters";
  }
  return null;
}

export function shouldSubmitOwnerBan(args: {
  principalOk: boolean;
  reason: string;
  dialogConfirmed: boolean;
  pending: boolean;
}): boolean {
  if (args.pending === true) return false;
  if (args.principalOk !== true) return false;
  if (args.dialogConfirmed !== true) return false;
  return ownerBanReasonError(args.reason) === null;
}

export function ownerShopBanCollectsReasonOnMain(): false {
  return false;
}

export function ownerShopBanMethodOnMain(): typeof OWNER_SHOP_BAN_METHOD_ON_MAIN {
  return OWNER_SHOP_BAN_METHOD_ON_MAIN;
}

export function ownerBanReasonConfirmBody(reason: string): string {
  const trimmed = reason.trim();
  return `Banned principals fail purchases, buffs, achievement claims, boss rush, and Doka awards. Existing achievement progress is kept so claimed rewards cannot be claimed again after unban. Audit reason: ${trimmed}. Cancel does not write.`;
}
