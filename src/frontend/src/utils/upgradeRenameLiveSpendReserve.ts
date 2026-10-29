/**
 * Click-time live-wallet reservation for upgradeSpell / renameCharacter.
 *
 * Production still debits dokaBalanceRef only after the canister returns
 * (WorldExploration handleUpgradeSpell / handleRenameCharacter). Escape-
 * closing the spellbook (or Cancel during rename Saving…) then heal/shop
 * still sees the full wallet, enqueues persistAbsoluteProgress, and the
 * persist lock runs the credit spend first — applySpendToCommitted floors
 * the overlapping saveBattleStats debit to 0 while HP / inventory / paid
 * level|name all land.
 *
 * Example: start 100, upgrade 10, shop 100. UI still 100 so BuffShop
 * clears. Lock: upgrade commits 90, shop applySpendToCommitted(90, 100)
 * writes 0. Canister ends at 0 with both goods (need 110). Unpaid
 * upgrade = 10. Survives reload; backend HP + spell levels / name.
 *
 * Sidecar only so WX / spellUpgrade / renameCharacter / #387 stay
 * merge-clean. Restack after those PRs:
 *   - handleUpgradeSpell: reserveSpellUpgradeLiveSpend before await;
 *     adjustReservedSpellUpgradeSpend after spent; refund on throw.
 *   - handleRenameCharacter: shouldReserveRenameDokaOnBegin after
 *     beginRename; liveDokaAfterRename immediately; refund on #err/throw.
 *   - rename Cancel: shouldDisableRenameCancelWhileSaving(isRenaming).
 */

import {
  RENAME_DOKA_COST,
  committedDokaAfterRename,
  liveDokaAfterRename,
} from "./renameCharacter.ts";
import {
  committedDokaAfterSpellUpgrade,
  spellUpgradeCanisterSpend,
} from "./spellUpgrade.ts";

export function reserveSpellUpgradeLiveSpend(advertisedCost: number): number {
  return spellUpgradeCanisterSpend(advertisedCost);
}

/** Reconcile a click-time reserve with the post-upgrade canister spend. */
export function adjustReservedSpellUpgradeSpend(
  reserved: number,
  actualSpent: number,
): number {
  const reserve = Math.max(0, Math.floor(Number(reserved) || 0));
  const actual = Math.max(0, Math.floor(Number(actualSpent) || 0));
  return actual - reserve;
}

/** Refund the click-time upgrade reserve when upgradeSpell throws. */
export function refundReservedSpellUpgradeSpend(
  liveDoka: number,
  reserved: number,
): number {
  const live = Math.max(0, Math.floor(Number(liveDoka) || 0));
  const reserve = Math.max(0, Math.floor(Number(reserved) || 0));
  return live + reserve;
}

/**
 * Debit the live wallet as soon as Confirm is accepted locally.
 * beginRename already returned true when this is called from the handler.
 */
export function shouldReserveRenameDokaOnBegin(began: boolean): boolean {
  return began === true;
}

/** Refund the click-time rename reserve when the canister rejected. */
export function refundReservedRenameDoka(liveDoka: number): number {
  return Math.max(0, Math.floor(Number(liveDoka) || 0) + RENAME_DOKA_COST);
}

export function shouldDisableRenameCancelWhileSaving(
  isRenaming: boolean,
): boolean {
  return isRenaming === true;
}

export function liveWalletAfterUpgradeReserve(
  liveDoka: number,
  advertisedCost: number,
): number {
  return Math.max(
    0,
    Math.floor(Number(liveDoka) || 0) -
      reserveSpellUpgradeLiveSpend(advertisedCost),
  );
}

export function liveWalletAfterRenameReserve(liveDoka: number): number {
  return liveDokaAfterRename(liveDoka);
}

export function lockDokaAfterUpgradeReserve(
  committedDoka: number,
  advertisedCost: number,
): number {
  return committedDokaAfterSpellUpgrade(
    committedDoka,
    committedDoka - reserveSpellUpgradeLiveSpend(advertisedCost),
    advertisedCost,
  );
}

export function lockDokaAfterRenameReserve(committedDoka: number): number {
  return committedDokaAfterRename(committedDoka);
}
