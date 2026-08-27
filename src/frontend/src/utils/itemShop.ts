/**
 * Item shop host contract.
 *
 * BuffShop is a full-screen modal that returns null unless isOpen === true.
 * Hosting it from GameFlow with a local-only deduct (and a no-op onUseItem)
 * refunds the spend on the next getCallerDokaBalance refetch and makes
 * purchased items unusable. The modal must be hosted in WorldExploration so
 * buys persist through saveBattleStats and uses reach handleUseItem.
 */

export function isBuffShopOpen(isOpen: boolean | undefined): boolean {
  return isOpen === true;
}

export function nextDokaAfterShopSpend(
  currentDoka: number,
  amount: number,
): number {
  return Math.max(0, currentDoka - amount);
}
