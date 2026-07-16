/**
 * Summon integration helpers — minimal bridge between WorldExploration.tsx
 * and the pure summon engine modules (summonAI.ts, summonSpawn.ts, spellEngine.ts).
 *
 * All functions are side-effect-free except where explicitly noted.
 */

import { logDebugInfo } from "../utils/debugLogger";
import { type SpellContextDeps, createSpellContext } from "./spellContext";
import type { SpellContext } from "./spellEngine";

/**
 * Decrement lifespan for all summons, kill those at 0, and return both the
 * filtered enemy list and the IDs of summons that expired this tick.
 *
 * This function NO LONGER mutates the turn queue itself. The previous
 * implementation called removeCombatantFromTurnQueue inside the loop, which
 * raced the turn-advance index computation in WorldExploration.tsx (the
 * setEnemies callback ran AFTER currentTurnIndexRef was already advanced
 * against the stale turnOrder, leaving ghost turn entries).
 *
 * The new contract is synchronous and ordered:
 *   1. Decrement turnsRemaining for every summon.
 *   2. For any summon that hits 0: set hp=0 and log "fades away" (isSummon=true
 *      routes the line to the Summons chat channel — preserved verbatim).
 *   3. Collect the expired summon IDs into expiredIds.
 *   4. Return { enemies, expiredIds }.
 *
 * The caller is responsible for syncing the turn queue with expiredIds BEFORE
 * it computes the next turn index, so the index is always computed against a
 * turnOrder that no longer contains the faded summons. This closes the ghost-
 * entry race: there is no window where currentTurnIndexRef points at a removed
 * combatant.
 */
export function decrementSummonLifespan(
  enemies: any[],
  log: (msg: string, color?: string, isSummon?: boolean) => void,
): { enemies: any[]; expiredIds: string[] } {
  const expiredIds: string[] = [];
  for (const e of enemies) {
    if (e.isSummon) {
      e.turnsRemaining = (e.turnsRemaining || 1) - 1;
      if (e.turnsRemaining <= 0) {
        e.hp = 0;
        log(`${e.name} fades away...`, "#a78bfa", true);
        expiredIds.push(e.id);
      }
    }
  }
  return { enemies: enemies.filter((e: any) => e.hp > 0), expiredIds };
}

/**
 * Build a real SpellContext from explicit deps captured by the caller
 * (WorldExploration.tsx). Delegates 1:1 to createSpellContext — no inline logic,
 * no no-op stubs. The caller passes the same callback implementations used by
 * the playerSpellContext factory so player casts and summon-AI casts share the
 * same underlying damage/heal/effect/spawn paths.
 */
export function buildSpellContext(deps: SpellContextDeps): SpellContext {
  return createSpellContext(deps);
}

export function getPlayerSideTargets(enemies: any[]): any[] {
  return enemies.filter((e: any) => e.side === "player" || e.isPlayer);
}

/**
 * Resolve the AP/MP to display for a turn-order combatant. Player-side summons
 * carry their own currentAp/currentMp budget (seeded in spawnSummonUnit and
 * refreshed each turn in handleSummonTurn); regular enemies derive AP/MP from
 * their level. Falls back to the combatant's existing level when the enemy
 * record is missing.
 */
export function resolveEnemyApMp(
  enemy: any | undefined,
  fallbackLevel: number,
): { ap: number; mp: number } {
  if (!enemy) return { ap: fallbackLevel, mp: 1 };
  if (enemy.isSummon) {
    return {
      ap: enemy.currentAp ?? enemy.level ?? fallbackLevel,
      mp: enemy.currentMp ?? Math.max(1, Math.floor((enemy.level ?? 1) / 2)),
    };
  }
  return {
    ap: enemy.level ?? fallbackLevel,
    mp: Math.max(1, Math.floor(enemy.level / 2)),
  };
}
