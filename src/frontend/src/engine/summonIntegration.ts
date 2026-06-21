/**
 * Summon integration helpers — minimal bridge between WorldExploration.tsx
 * and the pure summon engine modules (summonAI.ts, summonSpawn.ts, spellEngine.ts).
 *
 * All functions are side-effect-free except where explicitly noted.
 */

import type { SpellContext } from "./spellEngine";

/**
 * Render a friendly teal/green aura around player-side summoned units.
 */
export function renderSummonAura(
  ctx: CanvasRenderingContext2D,
  enemy: any,
  screenX: number,
  screenY: number,
): void {
  if (enemy.isSummon && enemy.side === "player") {
    ctx.save();
    ctx.shadowColor = "#00ffaa";
    ctx.shadowBlur = 15;
    ctx.strokeStyle = "#00ffaa";
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX - 16, screenY - 16, 32, 32);
    ctx.restore();
  }
}

/**
 * If the given enemy is a player-side summon, run its AI and return true.
 * Otherwise return false so the caller can fall through to normal enemy AI.
 */
export async function handleSummonTurn(
  enemy: any,
  ctx: SpellContext,
): Promise<boolean> {
  if (enemy.isSummon && enemy.side === "player") {
    const { runSummonAI } = await import("./summonAI");
    runSummonAI(enemy, ctx);
    return true;
  }
  return false;
}

/**
 * Decrement lifespan for all summons, kill those at 0, and return the filtered list.
 * Mutates the array in place for lifespan but returns a new filtered array for removals.
 */
export function decrementSummonLifespan(
  enemies: any[],
  log: (msg: string, color?: string) => void,
): any[] {
  for (const e of enemies) {
    if (e.isSummon) {
      e.turnsRemaining = (e.turnsRemaining || 1) - 1;
      if (e.turnsRemaining <= 0) {
        e.hp = 0;
        log(`${e.name} fades away...`, "#888");
      }
    }
  }
  return enemies.filter((e: any) => e.hp > 0);
}

/**
 * Return all combatants that are on the player's side (player or player summons).
 */
export function buildSpellContext(
  log: (msg: string, color?: string) => void,
): any {
  return {
    rng: () => Math.random(),
    getEffectiveStat: () => 0,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: () => {},
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: log,
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

export function getPlayerSideTargets(enemies: any[]): any[] {
  return enemies.filter((e: any) => e.side === "player" || e.isPlayer);
}
