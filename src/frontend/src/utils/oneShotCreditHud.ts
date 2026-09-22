/**
 * One-shot applyRewards returns an absolute wallet (`newDoka`). The persist
 * lock commits that snapshot. The HUD used to add only the pickup delta.
 *
 * Unseeded placeholder 0 + delta under-counts a returning wallet, then
 * GameFlow's later query cannot overwrite the diverged live ref
 * (`syncLiveDokaFromProp` keeps live when it no longer matches the last
 * prop). Shop / rename / heal then treat the short HUD as authoritative.
 *
 * Chronology:
 * 1. World mounts before getCallerDokaBalance. Lock doka=0, unseeded. HUD 0.
 * 2. Ground / shrine / dungeon-complete applyRewards: canister 200→250.
 * 3. settleOneShotPersistLock commits 250 (now seeded).
 * 4. creditLiveDoka(0, 50) leaves HUD 50.
 * 5. Query lands at 200. Live 50 !== last prop 0, so the 200 is dropped.
 * 6. A 100 Doka shop item stays unaffordable despite 250 on the lock.
 *
 * Seeded credits must still add the delta: an in-flight recap heal already
 * deducted live, and replacing with absolute newDoka refunds that spend.
 */

function toNat(n: number): number {
  return Math.max(0, Math.floor(Number(n) || 0));
}

export function nextLiveDokaAfterOneShotCommit(args: {
  walletSeededBeforeCommit: boolean;
  liveDoka: number;
  pickupDelta: number;
  committedDoka: number;
}): number {
  const committed = toNat(args.committedDoka);
  const live = toNat(args.liveDoka);
  const delta = toNat(args.pickupDelta);
  if (!args.walletSeededBeforeCommit) {
    return committed;
  }
  return live + delta;
}
