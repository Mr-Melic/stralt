/**
 * Purchases row actions use `disabled={busyId === rec.id}`. While Approve
 * for row A is in flight, row B can still open Approve / Reject and an
 * already-approved row can Show code. #664 `tryBeginGameKeyAdminOp` is a
 * same-request double-click lock, not a table-wide busy.
 *
 * Unique 2026-10-27 file — do not merge into adminOwnerUx.gameKeyBusy.ts
 * (#664 per-op lock) or adminOwnerUx.shopBusy.ts (#631 Shop Grant).
 * Not wired (stack).
 */

export function shouldDisableOwnerPurchaseRowActions(
  busyId: string | null,
): boolean {
  return busyId != null && busyId.length > 0;
}

export function shouldOpenOwnerPurchaseConfirm(busyId: string | null): boolean {
  return !shouldDisableOwnerPurchaseRowActions(busyId);
}

export function ownerPurchaseRowBusyIsPerIdOnMain(): true {
  return true;
}
