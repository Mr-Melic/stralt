/**
 * 30s turn timer vs End Turn / leftover advances.
 *
 * The interval used to call `advanceTurn` inside `setTurnTimeLeft`'s
 * updater after only checking `turnTimerGenerationRef` *before* queuing
 * that update. End Turn already bumped `currentTurnIndex` (and the
 * generation, once the effect re-ran) but the queued updater still saw
 * `prev <= 1` and advanced again — skipping the enemy that should have
 * acted, or ticking leftover summon lifespan after a last-hostile kill.
 *
 * Honor a tick only when the callback generation still matches, then
 * dispatch expiry on a later task so End Turn's flushSync can bump the
 * generation first.
 */

export function shouldHonorTurnTimerTick(
  callbackGeneration: number,
  liveGeneration: number,
): boolean {
  const callback = Number(callbackGeneration);
  const live = Number(liveGeneration);
  if (!Number.isFinite(callback) || !Number.isFinite(live)) return false;
  return callback === live;
}

export function bumpTurnTimerGeneration(current: number): number {
  const n = Math.max(0, Math.floor(Number(current) || 0));
  return n + 1;
}

/**
 * Leftover End Turn, the 30s timer, and the 500ms summon auto-end must
 * not dispatch after the fight is already over. `advanceTurn` expires
 * the next summon *before* `shouldAdvanceAfterEnemyTurn`, so a last-kill
 * timer tick faded leftover wolves on the way to the recap.
 */
export function shouldDispatchDeferredTurnAdvance(opts: {
  inBattle: boolean;
  deathTriggered?: boolean;
  battleEnded?: boolean;
  hostilesRemaining: number;
}): boolean {
  if (opts.inBattle !== true) return false;
  if (opts.deathTriggered === true) return false;
  if (opts.battleEnded === true) return false;
  return opts.hostilesRemaining > 0;
}

export function shouldDispatchTurnTimerExpiry(opts: {
  callbackGeneration: number;
  liveGeneration: number;
  inBattle: boolean;
  deathTriggered?: boolean;
  battleEnded?: boolean;
  hostilesRemaining: number;
}): boolean {
  if (!shouldHonorTurnTimerTick(opts.callbackGeneration, opts.liveGeneration)) {
    return false;
  }
  return shouldDispatchDeferredTurnAdvance(opts);
}

/**
 * End Turn click and a same-stack timer updater both reached `advanceTurn`.
 * The second call skipped the combatant the first had just dispatched.
 */
export function shouldStartTurnAdvance(inFlight: boolean): boolean {
  return inFlight !== true;
}

export function beginTurnAdvance(inFlight: { current: boolean }): boolean {
  if (!shouldStartTurnAdvance(inFlight.current)) return false;
  inFlight.current = true;
  return true;
}

export function endTurnAdvance(inFlight: { current: boolean }): void {
  inFlight.current = false;
}
