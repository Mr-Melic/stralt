/**
 * The App-root recap overlay is pointer-events: none so HUD heal / shop /
 * feats stay clickable while applyRewards is in flight. Canvas walk and
 * hazard tiles sit under that overlay and used to receive those clicks.
 *
 * Gate world input (mouse + touch) when the recap is showing. Do not use
 * this to block HUD buttons — those must keep pointer-events: auto.
 */

export function shouldIgnoreWorldInputDuringRecap(
  recapVisible: boolean,
  victoryPersistPending = false,
): boolean {
  return recapVisible === true || victoryPersistPending === true;
}

/**
 * Recap overlay is pointer-events: none. Dismissing it used to leave
 * canvas walk live while applyRewards was still on the persist lock, so
 * a portal step / new encounter could run cleanupMap during that credit.
 */
export function shouldBlockPortalDuringVictoryPersist(
  victoryPersistPending: boolean,
): boolean {
  return victoryPersistPending === true;
}

/**
 * #211 gated new canvas walks, not the leftover movement RAF. An in-battle
 * MP walk that is still animating when the last hostile dies keeps stepping
 * after cleanupBattle / recap, so lava/spikes can fire exploration death
 * and replace the victory recap while applyRewards is queued.
 */
export function shouldHaltInFlightMoveDuringRecap(
  recapVisible: boolean,
  victoryPersistPending = false,
): boolean {
  return shouldIgnoreWorldInputDuringRecap(recapVisible, victoryPersistPending);
}

/**
 * Last-hostile death is observed in `recheckVictory` before the
 * `[inBattle, enemies]` victory useEffect runs handleBattleEnd /
 * cleanupBattle. A leftover MP walk that is already past the recap
 * gate can still step lava/spikes in that window, set deathTriggered,
 * and make shouldAwardVictory refuse — persistDeathPenalty instead of
 * applyRewards.
 *
 * Halt as soon as the live roster is empty while the fight is still
 * open. After setInBattle(false) the player can walk to the portal.
 *
 * Union with #546 — keep one implementation; do not concatenate a second
 * copy of this helper.
 */
export function shouldHaltInFlightMoveOnLastHostile(opts: {
  inBattle: boolean;
  hostilesRemaining: number;
}): boolean {
  return opts.inBattle === true && opts.hostilesRemaining === 0;
}

/**
 * In-flight rAF closures survive `setIsMoving(false)`. Bump a generation
 * (or honor an abort flag) so the leftover loop cannot apply another
 * hazard / loot / shrine step.
 *
 * Optional `inBattle` / `hostilesRemaining` are #546's last-hostile halt.
 * They do not abort leftover *overworld* walks when a fight starts
 * (hostilesRemaining > 0) — `checkBattleTrigger` must still bump gen.
 */
export function shouldAbortMovementRaf(opts: {
  recapVisible: boolean;
  victoryPersistPending: boolean;
  movementGen: number;
  loopGen: number;
  inBattle?: boolean;
  hostilesRemaining?: number;
}): boolean {
  if (opts.movementGen !== opts.loopGen) return true;
  if (
    shouldHaltInFlightMoveOnLastHostile({
      inBattle: opts.inBattle === true,
      hostilesRemaining:
        opts.hostilesRemaining == null ? -1 : opts.hostilesRemaining,
    })
  ) {
    return true;
  }
  return shouldHaltInFlightMoveDuringRecap(
    opts.recapVisible,
    opts.victoryPersistPending,
  );
}

/**
 * Overworld leftover rAF does not read `inBattle` as a start-of-fight abort
 * (in-battle MP walks stay live while hostiles remain). `checkBattleTrigger`
 * must bump this counter before battle-start teleport, or remaining
 * world-path steps yank the player off the spaced cell onto lava /
 * occupants. Same contract as cleanupBattle / room-clear.
 */
export function nextMovementGenOnBattleStart(movementGen: number): number {
  return movementGen + 1;
}
