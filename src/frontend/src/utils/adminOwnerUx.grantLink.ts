/**
 * Shop Grant calls adminAddDokaToUser(principal, amount, null).
 * The third arg is always null on main — the credit is not linked to a
 * GameKey request. Purchases Approve still mints a redeemable key for
 * the same player. Confirm copy does not warn about that double path.
 *
 * Unique 2026-10-24 file — do not merge into dokaGameKey.ts Approve
 * bodies, adminOwnerUx.shopBusy.ts (#631), or restack Shop / Purchases
 * (#492 / #664). Not wired (stack).
 */

export function ownerShopGrantPurchaseIdOnMain(): null {
  return null;
}

export function ownerShopGrantIsPurchaseFulfillment(
  purchaseId: string | null | undefined,
): boolean {
  return typeof purchaseId === "string" && purchaseId.trim().length > 0;
}

export function ownerShopGrantConfirmBody(args: {
  amount: number;
  principal: string;
}): string {
  return `This credits ${args.amount} Doka to ${args.principal} immediately. There is no undo. This is not a GameKey fulfillment — the Purchases row stays pending and a later Approve can still mint a redeemable key. Cancel does not write.`;
}

export function ownerShopGrantCanDoubleCreditWithApprove(args: {
  grantedUnlinked: boolean;
  laterApprovedSamePrincipal: boolean;
}): boolean {
  return (
    args.grantedUnlinked === true && args.laterApprovedSamePrincipal === true
  );
}

export function ownerShopGrantLooksLikePurchaseFulfillment(
  copy: string,
): boolean {
  return /fulfill this purchase|approve the gamekey|mark emailed|approve request/i.test(
    copy,
  );
}
