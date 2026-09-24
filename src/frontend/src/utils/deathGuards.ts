/**
 * One-shot death guards. Every death path sets these so Game Over / Death
 * Realm cannot fire twice for the same death. They must be cleared again
 * once that death has finished (Death Realm loaded or Respawn clicked).
 *
 * The in-battle HP-watch and handleRespawn used to leave them set. After
 * escaping Death Realm, a later exploration death (lava / spikes) then
 * skipped the handler — 0 HP with no penalty, no Game Over, no Death Realm.
 */

export type DeathGuardRefs = {
  deathTriggered: { current: boolean };
  deathPenaltyApplied: { current: boolean };
};

/** True when a new death event is allowed to run. */
export function deathGuardsAreArmed(refs: DeathGuardRefs): boolean {
  return !refs.deathTriggered.current && !refs.deathPenaltyApplied.current;
}

/** Re-arm both guards after Death Realm entry or Respawn. */
export function armDeathGuards(refs: DeathGuardRefs): void {
  refs.deathTriggered.current = false;
  refs.deathPenaltyApplied.current = false;
}

/**
 * True while an exploration (or in-battle) death has armed the Death Realm
 * timer and that timer has not fired yet.
 *
 * persistDeathPenalty restores HP in the same death tick, so an hp<=0 check
 * is already false by the time the player can walk. World actions that
 * cancel the timer (portal → cleanupMap) or reset the death guards
 * (battle start) must stay blocked until the realm loads.
 */
export function isDeathRealmTransitionPending(
  deathTriggered: boolean,
  deathRealmTimerPending: boolean,
): boolean {
  return deathTriggered && deathRealmTimerPending;
}

/**
 * Block portal entry while a Death Realm timer is pending.
 *
 * persistDeathPenalty restores HP in the same death tick, so an hp<=0 check
 * is already false by the time the player can step on a portal. cleanupMap
 * then cancels deathRealmTimerRef while deathTriggered stays set — the HP
 * watch never re-runs, and the next lava/spike death strands the player.
 */
export function shouldBlockPortalDuringPendingDeathRealm(
  deathTriggered: boolean,
  deathRealmTimerPending: boolean,
): boolean {
  return isDeathRealmTransitionPending(deathTriggered, deathRealmTimerPending);
}

/**
 * Canvas walk / cast while Death Realm is pending.
 *
 * persistDeathPenalty restores HP in the same death tick, and both the
 * exploration HP-watch and in-battle lava path set inBattle false before
 * the timer fires. Click/touch used to require
 * `inBattle && (deathTriggered || hp<=0)`, so after the defeat recap is
 * dismissed a new walk could step lava / shrine / ground Doka during the
 * wait. Portals and encounters already use isDeathRealmTransitionPending.
 *
 * Keep the original in-battle gate (Game Over / mid-fight death) and also
 * block while the Death Realm timer is pending after HP restore.
 */
export function shouldIgnoreCanvasWalkDuringDeath(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  hp: number;
  deathRealmTimerPending: boolean;
}): boolean {
  if (opts.inBattle && (opts.deathTriggered || opts.hp <= 0)) return true;
  return isDeathRealmTransitionPending(
    opts.deathTriggered,
    opts.deathRealmTimerPending,
  );
}

/**
 * Leftover movement rAF captured loopGen before exploration death.
 * Clearing the React path without bumping this counter lets the next
 * rAF step land lava / loot / shrine during the Death Realm wait
 * (cleanupBattle already bumps on the in-battle path).
 */
export function nextMovementGenOnDeathRealmPending(
  movementGen: number,
): number {
  return movementGen + 1;
}
