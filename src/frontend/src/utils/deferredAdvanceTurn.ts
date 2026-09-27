/**
 * Deferred enemy / summon turn handoffs (600ms AI delay, 5s watchdog).
 *
 * Several apply-layer branches used bare `setTimeout(() => advanceTurn())`
 * without tracking the timer or re-checking battle liveness. After the last
 * hostile dies, victory cleanup clears `pendingTimeoutsRef` — an untracked
 * timer survived, and a fast portal → new encounter could let that callback
 * run `advanceTurn` mid-fight (skip a slot / fade the wrong summon).
 *
 * Gate every deferred handoff with the same predicate before calling
 * `advanceTurn`. `advanceTurn` still has `shouldAdvanceAfterEnemyTurn` at
 * its head; this helper is the call-site guard + generation / cleanup check.
 */

export function shouldDispatchDeferredAdvanceTurn(opts: {
  inBattle: boolean;
  cleanupRan: boolean;
  deathTriggered: boolean;
  hostilesRemaining: number;
  scheduledGeneration: number;
  currentGeneration: number;
}): boolean {
  if (opts.inBattle !== true) return false;
  if (opts.cleanupRan === true) return false;
  if (opts.deathTriggered === true) return false;
  if (opts.scheduledGeneration !== opts.currentGeneration) return false;
  const hostiles = Math.max(
    0,
    Math.floor(Number(opts.hostilesRemaining) || 0),
  );
  return hostiles > 0;
}
