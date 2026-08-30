/**
 * battleSetup.ts — Single source of truth for combatant liveness.
 *
 * Pure engine module (no React, no DOM, no WX imports). All victory checks,
 * draw-skip decisions, and targeting filters that depend on "is this enemy
 * still relevant to the fight" MUST route through the predicates exported
 * here. WX passes its `Enemy` type structurally — see `Combatant` below.
 *
 * Liveness rules:
 *   - `isActiveHostile(e)`: a living NON-summon on the enemy side. These are
 *     the combatants that must be defeated for victory. Player-side summons
 *     are never hostile even if hp > 0.
 *   - `isAliveCombatant(e)`: any living combatant (hp > 0), including
 *     player-side summons. Used for draw/targeting filters where a living
 *     summon still occupies a tile and can be targeted or block LoS.
 *
 * Side semantics:
 *   - `side === 'enemy'` (or absent side with `isSummon === false`) → hostile
 *     when alive.
 *   - `side === 'player'` → never hostile (covers player summons).
 *   - Absent `side` defaults to enemy-side for non-summons, so legacy
 *     combatants without an explicit `side` field keep working.
 */

/**
 * Minimal structural combatant shape. WX's `Enemy` type satisfies this
 * structurally without a hard import dependency, keeping the engine module
 * decoupled from the WX type graph.
 */
export interface Combatant {
  hp: number;
  isSummon?: boolean;
  side?: "player" | "enemy";
  id?: string;
  x?: number;
  y?: number;
  isMoving?: boolean;
  assignedName?: string;
  pieceType?: string;
  level?: number;
  turnsRemaining?: number;
  isWandering?: boolean;
  spawnTime?: number;
  maxHp?: number;
  currentView?: string;
}

/**
 * Returns true when `e` is a living non-summon enemy that must be defeated
 * for victory.
 *
 * - hp must be > 0.
 * - `isSummon` must be falsy (summons are never hostile).
 * - `side === 'player'` is never hostile.
 * - `side === 'enemy'` (or absent side, defaulted to enemy for non-summons)
 *   is hostile when alive.
 */
export function isActiveHostile(e: Combatant): boolean {
  if (e.hp <= 0) return false;
  if (e.isSummon && e.side !== "enemy") return false;
  // Absent side on a non-summon defaults to enemy-side (legacy combatants).
  const side = e.side ?? "enemy";
  return side === "enemy";
}

/**
 * Returns true when `e` is any living combatant (hp > 0), including
 * player-side summons. Used for draw/targeting filters where a living
 * summon still occupies a tile and can be targeted or block LoS.
 */
export function isAliveCombatant(e: Combatant): boolean {
  return e.hp > 0;
}

/**
 * Returns the count of living hostile enemies remaining in `enemies`.
 * Victory fires when this reaches 0 — NOT when `enemies.length === 0`,
 * because living player-side summons may still be in the array.
 */
export function activeHostilesRemaining(enemies: Combatant[]): number {
  return enemies.filter(isActiveHostile).length;
}

/**
 * Victory persist may run only for a fight the player is still in and did
 * not already lose. `_handlePlayerDeath` used to leave `inBattle` true, so a
 * later last-hostile death (DoT tick, leftover AI turn) could still enter
 * handleBattleEnd / applyRewards and race the death-penalty save.
 */
export function shouldAwardVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  /** Must be the battle-open snapshot size, not the living roster. */
  battleStartIdsSize: number;
  hostilesRemaining: number;
}): boolean {
  return (
    opts.inBattle &&
    !opts.deathTriggered &&
    opts.battleStartIdsSize > 0 &&
    opts.hostilesRemaining === 0
  );
}

/**
 * World / next-room encounters may start only when React `inBattle` AND the
 * sync `inBattleRef` are both false. `cleanupBattle()` only clears the ref;
 * `handleBattleEnd` / `handleBossRushRoomClear` / death must also
 * `setInBattle(false)` or `checkBattleTrigger` stays blocked — Boss Rush
 * room 2 never starts after a room-clear, and later overworld fights stay dead.
 */
export function shouldAllowBattleTrigger(opts: {
  inBattle: boolean;
  inBattleRef: boolean;
  transitionInProgress: boolean;
  /**
   * Exploration lava/spike death arms a 1.5s Death Realm timer and restores
   * HP immediately. Mid-path movement can still land on an enemy cell.
   * Starting that fight resets the death guards without clearing the timer,
   * so the leftover callback aborts the battle (and a second persistDeathPenalty
   * can fire if the player also dies in it).
   */
  deathRealmPending?: boolean;
}): boolean {
  return (
    !opts.inBattle &&
    !opts.inBattleRef &&
    !opts.transitionInProgress &&
    !opts.deathRealmPending
  );
}

/**
 * Returns `enemies` with all summons removed (living or dead). Used on
 * victory to despawn player-side summons cleanly so the post-battle state
 * contains only the original non-summon combatants.
 */
export function despawnSummons<T extends Combatant>(enemies: T[]): T[] {
  return enemies.filter((e) => !e.isSummon);
}

/**
 * Lava / spike damage after an enemy lands on a hazard.
 *
 * Callers must then write `newHp` through `updateCombatant` and, when
 * `lethal`, `processCombatantDeath` — the same contract as player Mirror.
 * React-only `enemyHpMap` / `turnOrder` writes leave store hp > 0, so
 * `isActiveHostile` still counts the unit: last-enemy lava delays
 * applyRewards, and the "dead" unit takes another full turn (including a
 * lethal attack that can persist a death penalty instead of victory).
 */
export function enemyHpAfterHazardDamage(
  currentHp: number,
  damage: number,
): { newHp: number; lethal: boolean } {
  const hp = Number.isFinite(currentHp) ? currentHp : 0;
  const dmg = Number.isFinite(damage) ? Math.max(0, damage) : 0;
  const newHp = Math.max(0, hp - dmg);
  return { newHp, lethal: newHp === 0 };
}

/**
 * After an enemy apply-layer finally (lava/spike, Mirror bounce, thisHp
 * check), do not `advanceTurn` when the fight is already over.
 *
 * `advanceTurn` is `flushSync` and runs before the `[inBattle, enemies]`
 * victory useEffect. Dispatching the player's next turn lets DoT / plague
 * call `_handlePlayerDeath` first, set `deathTriggered`, and make
 * `shouldAwardVictory` refuse — `persistDeathPenalty` instead of
 * `applyRewards`.
 */
export function shouldAdvanceAfterEnemyTurn(opts: {
  deathTriggered: boolean;
  hostilesRemaining: number;
}): boolean {
  return !opts.deathTriggered && opts.hostilesRemaining > 0;
}
