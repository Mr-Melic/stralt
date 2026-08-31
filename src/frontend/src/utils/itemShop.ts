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

/** Jackpot heal spends 1 Doka from the live wallet, not the render snapshot. */
export const JACKPOT_HEAL_DOKA_COST = 1;

export function nextDokaAfterJackpotHeal(liveDoka: number): number {
  return nextDokaAfterShopSpend(liveDoka, JACKPOT_HEAL_DOKA_COST);
}

/**
 * Overworld Doka heal must read the live ref, not the render snapshot.
 * A same-tick shop/heal debit leaves `dokaBalance` stale-high; a second
 * click then "heals" again for 0 spend after the first click emptied the
 * wallet, and persistAbsoluteProgress writes the extra HP for free.
 */
export function shouldStartDokaHeal(args: {
  currentHp: number;
  maxHp: number;
  liveDoka: number;
}): boolean {
  const hp = Math.max(0, Math.floor(Number(args.currentHp) || 0));
  const max = Math.max(0, Math.floor(Number(args.maxHp) || 0));
  const doka = Math.max(0, Math.floor(Number(args.liveDoka) || 0));
  return doka >= 1 && hp < max;
}

/** 1 Doka : 3 HP, floored by remaining missing HP and the live wallet. */
export function dokaHealAmounts(
  currentHp: number,
  maxHp: number,
  liveDoka: number,
): { hpToAdd: number; dokaCost: number } {
  const hp = Math.max(0, Math.floor(Number(currentHp) || 0));
  const max = Math.max(0, Math.floor(Number(maxHp) || 0));
  const doka = Math.max(0, Math.floor(Number(liveDoka) || 0));
  const hpNeeded = Math.max(0, max - hp);
  const hpToAdd = Math.min(hpNeeded, doka * 3);
  const dokaCost = hpToAdd > 0 ? Math.ceil(hpToAdd / 3) : 0;
  return { hpToAdd, dokaCost };
}

/**
 * Persist the HP the player just paid for.
 *
 * setCharacterStats writes characterStatsRef inside React's eager updater.
 * Reading `ref.hp + hpToAdd` after that call persists the heal twice, so a
 * reload hydrates more HP than the Doka spend bought.
 */
export function nextHpAfterDokaHeal(
  currentHp: number,
  maxHp: number,
  hpToAdd: number,
): number {
  const hp = Math.max(0, Math.floor(Number(currentHp) || 0));
  const max = Math.max(1, Math.floor(Number(maxHp) || 0));
  const add = Math.max(0, Math.floor(Number(hpToAdd) || 0));
  return Math.min(max, hp + add);
}

/** Buff shop must gate on the live wallet, not a stale-high render snapshot. */
export function shouldAllowShopSpend(
  liveDoka: number,
  amount: number,
): boolean {
  const doka = Math.max(0, Math.floor(Number(liveDoka) || 0));
  const cost = Math.max(0, Math.floor(Number(amount) || 0));
  return cost > 0 && doka >= cost;
}
