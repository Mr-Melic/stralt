/**
 * Victory / Boss Rush applyRewards returns an absolute wallet (`newDoka`).
 * The persist lock commits that snapshot. The HUD used to add only the
 * recap delta onto the live ref.
 *
 * Unseeded placeholder 0 + delta under-counts a returning wallet, then
 * GameFlow's later query cannot overwrite the diverged live ref
 * (`syncLiveDokaFromProp` keeps live when it no longer matches the last
 * prop). Shop / rename / heal then treat the short HUD as authoritative.
 *
 * Chronology:
 * 1. World mounts before getCallerDokaBalance. Lock doka=0, unseeded. HUD 0.
 * 2. Victory / room-clear applyRewards: canister 200→280 (`dokaEarned` 80).
 * 3. persist.lock commit({ doka: 280 }) seeds the lock.
 * 4. creditLiveDoka(0, 80) left HUD 80.
 * 5. Query lands at 200. Live 80 !== last prop 0, so the 200 is dropped.
 * 6. A 100 Doka shop item stays unaffordable despite 280 on the lock.
 *
 * One-shot shrine/ground/dungeon-complete HUD is #431 (`oneShotCreditHud`).
 * This helper is the leftover on the battle-reward path that #431 left
 * because persistBattleRewardsOnLock (#356) owns the lock commit.
 *
 * Seeded credits must still add the delta: an in-flight recap heal already
 * deducted live, and replacing with absolute newDoka refunds that spend.
 *
 * Capture isWalletSeeded() *before* the persist job commits — after commit
 * the lock is always seeded and the unseeded adopt never runs.
 *
 * File name sorts after `victoryAchievements` so WorldExploration's import
 * does not share #431's `oneShotCreditHud` insert after itemShop.
 */

function toNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function nextLiveDokaAfterLockCredit(args: {
  walletSeededBeforeCredit: boolean;
  liveDoka: number;
  creditDelta: number;
  committedDoka: number;
}): number {
  const live = toNat(args.liveDoka);
  const delta = toNat(args.creditDelta);
  const committed = toNat(args.committedDoka);
  if (args.walletSeededBeforeCredit !== true) {
    return committed;
  }
  return live + delta;
}
