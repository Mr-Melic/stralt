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
 * Returns `enemies` with all summons removed (living or dead). Used on
 * victory to despawn player-side summons cleanly so the post-battle state
 * contains only the original non-summon combatants.
 */
export function despawnSummons<T extends Combatant>(enemies: T[]): T[] {
  return enemies.filter((e) => !e.isSummon);
}
