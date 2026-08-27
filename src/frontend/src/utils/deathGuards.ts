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
