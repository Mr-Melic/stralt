/**
 * Purchases status cells call `playerGameKeyStatusCopy`, which is the
 * player Buy Doka string ("Approved — check email for your GameKey").
 * On the owner table that copy implies the player already has mail when
 * `emailed` is still false.
 *
 * Unique 2026-10-28 file — do not merge into dokaGameKey.ts (Purchases
 * overlap #492 / #664 / #1115 / #1190) or adminOwnerUx.copyFollowup.ts.
 * Not wired (stack).
 */

export function ownerGameKeyStatusCopy(
  status: string,
  emailed: boolean,
): string {
  switch (status) {
    case "pending":
      return "Pending approval";
    case "approved":
      return emailed
        ? "Approved — marked emailed"
        : "Approved — awaiting email";
    case "redeemed":
      return "Redeemed";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

export function ownerStatusUsesPlayerCopyOnMain(): true {
  return true;
}
