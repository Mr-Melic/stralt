/**
 * Shop Grant paints `Grant ${shopDokaAmount} Doka?` then the confirm
 * handler reads live `shopDokaAmount` / `shopGrantPrincipalId`.
 * GameKey Approve stores `confirm.amount` in the dialog object and
 * ignores it — `approve(rec)` re-parses `dokaDraft[rec.id]`.
 *
 * Background fields stay in the tab order (no inert / focus trap), so
 * a keyboard operator can change the amount after the title is shown
 * and still confirm the old title.
 *
 * Unique 2026-10-26 file — do not merge into adminOwnerUx.confirmDismiss.ts
 * (#945 unmount-then-write), adminOwnerUx.principalGate.ts (#1066 parse
 * before open), or adminOwnerUx.shopBusy.ts (#631 in-flight lock).
 * Not wired (stack).
 */

export function ownerConfirmWriteAmount(dialogAmount: number): number {
  return dialogAmount;
}

export function ownerConfirmWritePrincipal(dialogPrincipal: string): string {
  return dialogPrincipal.trim();
}

export function shouldBlockOwnerConfirmIfSnapshotDrift(args: {
  dialogAmount?: number;
  liveAmount?: number;
  dialogPrincipal?: string;
  livePrincipal?: string;
}): boolean {
  if (
    args.dialogAmount != null &&
    args.liveAmount != null &&
    args.dialogAmount !== args.liveAmount
  ) {
    return true;
  }
  if (
    args.dialogPrincipal != null &&
    args.livePrincipal != null &&
    args.dialogPrincipal.trim() !== args.livePrincipal.trim()
  ) {
    return true;
  }
  return false;
}

export function ownerShopGrantResamplesLiveAmountOnMain(): true {
  return true;
}

export function ownerGameKeyApproveIgnoresStoredAmountOnMain(): true {
  return true;
}
