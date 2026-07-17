/**
 * Summon action executor — applies a decided EnemyAction (from
 * decideSummonAction) through the real engine paths.
 *
 * This module is React-free and DOM-free. WorldExploration.tsx builds the
 * SpellContext (summonCtx) and the OccupancyContext, calls decideSummonAction
 * to get an EnemyAction, then calls executeSummonAction to apply it. The
 * executor returns the updated summon state (position, AP, MP, HP) so WX can
 * mutate enemiesRef + setEnemies via the same direct-position-mutation pattern
 * the enemy branch uses (prevEnemies.map, clamp to [0, WORLD_GRID_SIZE-1]).
 *
 * Responsibilities:
 *  - MOVE:   update summon grid position to action.destination, spend MP at
 *            per-tile cost (Chebyshev distance), occupancy-checked via isCellFree.
 *  - CAST:   resolve the summon's kit spell through the SpellContext
 *            (dealDamage / heal / applyEffect), AP deducted. Preserves the
 *            damage / AoE / heal / effect branch logic from the inline WX path.
 *  - MELEE:  dealDamage with summon's atk, AP deducted.
 *  - HOLD:   log only.
 *
 * Bomber kamikaze: after a cast, if the summon is a bomber, HP is dropped to 0
 * (detonation kills the summon). This mirrors the inline WX behavior.
 */

import type { Enemy, SpellConfig } from "../types/gameTypes";
import type { EnemyAction } from "./enemyAI";
import { type OccupancyContext, isCellFree } from "./occupancy";
import type { SpellContext } from "./spellEngine";

export interface SummonExecutorResult {
  /** New grid position after movement (clamped to grid bounds). */
  newPosition: { x: number; y: number };
  /** Remaining AP after the action. */
  currentAp: number;
  /** Remaining MP after movement. */
  currentMp: number;
  /** Updated HP (bomber kamikaze drops this to 0). */
  hp: number;
  /** Log lines emitted (also pushed through summonCtx.log). */
  logLines: string[];
}

export interface SummonExecutorHelpers {
  /** calcScaledDamage(base, level, upgrade) — same helper used by the enemy branch. */
  calcScaledDamage: (base: number, level: number, upgrade: number) => number;
  /** Occupancy context used for movement validation (same one passed to spawnSummonUnit). */
  occupancyCtx: OccupancyContext;
  /** World grid size for clamping. */
  worldGridSize: number;
  /** MP cost per tile of Chebyshev movement. */
  mpCostPerTile: number;
  /** AP cost for a melee action. */
  meleeApCost: number;
  /**
   * Look up an enemy/summon by id from the live enemiesRef snapshot. Used to
   * resolve cast/melee targets (the SpellContext.getCombatantAt only returns
   * {id, side}, not the full combatant needed for AoE blast math).
   */
  getEnemyById: (id: string) => Enemy | undefined;
  /**
   * Resolve AoE blast victims: every enemy within Chebyshev distance
   * blastRadius of the primary target (excluding the primary target and
   * same-side combatants). Caller reads enemiesRef.current and filters by
   * side. Returns the list of secondary victim ids to apply blast damage to.
   */
  getAoEVictims: (primaryTargetId: string, blastRadius: number) => Enemy[];
}

/**
 * Apply a decided summon action through the real engine paths.
 * Returns updated summon state so WX can mutate enemiesRef + setEnemies.
 */
export function executeSummonAction(
  action: EnemyAction,
  summon: Enemy,
  summonCtx: SpellContext,
  helpers: SummonExecutorHelpers,
): SummonExecutorResult {
  const maxAp = summon.maxAp ?? 2;
  const maxMp = summon.maxMp ?? 2;
  let x = summon.x;
  let y = summon.y;
  let currentAp = summon.currentAp ?? maxAp;
  let currentMp = summon.currentMp ?? maxMp;
  let hp = summon.hp;
  const logLines: string[] = [];
  const summonLabel = summon.summonAI ?? summon.pieceType ?? summon.id;

  // ── MOVE ──────────────────────────────────────────────────────────────
  // Apply action.destination if it differs from the current cell, is free,
  // and MP allows. Chebyshev distance × per-tile cost.
  if (
    action.destination &&
    (action.destination.x !== x || action.destination.y !== y)
  ) {
    const dest = {
      x: Math.max(0, Math.min(helpers.worldGridSize - 1, action.destination.x)),
      y: Math.max(0, Math.min(helpers.worldGridSize - 1, action.destination.y)),
    };
    if (isCellFree(dest, helpers.occupancyCtx)) {
      const dist = Math.max(Math.abs(dest.x - x), Math.abs(dest.y - y));
      const mpCost = dist * helpers.mpCostPerTile;
      if (currentMp >= mpCost) {
        x = dest.x;
        y = dest.y;
        currentMp -= mpCost;
        logLines.push(
          `[SUMMON-MOVE] ${summonLabel} (${summon.id}) moved to (${x},${y}) -${mpCost}MP`,
        );
      } else {
        logLines.push(
          `[SUMMON-MOVE] ${summonLabel} (${summon.id}) could not move (need ${mpCost}MP, have ${currentMp}MP)`,
        );
      }
    } else {
      logLines.push(
        `[SUMMON-MOVE] ${summonLabel} (${summon.id}) destination (${dest.x},${dest.y}) occupied`,
      );
    }
  }

  // ── ACTION: cast / melee / skip ───────────────────────────────────────
  if (action.kind === "cast" && action.spell && action.targetId) {
    const spell: SpellConfig = action.spell;
    const apCost = Number(spell.apCost ?? 0);
    if (currentAp >= apCost) {
      const target = helpers.getEnemyById(action.targetId);
      const damage = Number(spell.damage ?? 0);
      const healAmount = Number(spell.healAmount ?? 0);

      if (damage > 0 && target) {
        // Primary target damage.
        const baseDmg = helpers.calcScaledDamage(damage, summon.level, 0);
        summonCtx.dealDamage(action.targetId, baseDmg);
        // AoE: when the spell has an area radius, apply the same damage to
        // every enemy within Chebyshev distance areaRadius of the primary
        // target (excluding the primary target, already damaged above, and
        // same-side combatants). Victim resolution is delegated to the
        // caller-provided getAoEVictims helper so this module stays React-free.
        const blastR = Number(spell.areaRadius ?? 0);
        if (blastR > 0) {
          for (const victim of helpers.getAoEVictims(action.targetId, blastR)) {
            summonCtx.dealDamage(victim.id, baseDmg);
          }
        }
        currentAp -= apCost;
        logLines.push(
          `[SUMMON-CAST] ${summonLabel} (${summon.id}) cast ${spell.name} on ${action.targetId} -${apCost}AP`,
        );
        // Bomber kamikaze: detonation kills the summon.
        if (summon.summonAI === "bomber") {
          hp = 0;
          logLines.push(`[SUMMON-BOMBER] ${summon.id} detonated (hp=0)`);
        }
      } else if (healAmount > 0) {
        summonCtx.heal(action.targetId, healAmount);
        currentAp -= apCost;
        logLines.push(
          `[SUMMON-CAST] ${summonLabel} (${summon.id}) healed ${action.targetId} for ${healAmount} -${apCost}AP`,
        );
      } else {
        // Buff / debuff / dot effect.
        summonCtx.applyEffect({
          effectName: spell.name ?? spell.effectType,
          type: (spell.effectType === "buff"
            ? "buff"
            : spell.effectType === "debuff"
              ? "debuff"
              : "dot") as "buff" | "debuff" | "dot",
          targetId: action.targetId,
          duration:
            spell.buffDuration ??
            spell.debuffDuration ??
            spell.dotDuration ??
            1,
          iconEmoji: spell.iconEmoji ?? "✨",
          description: spell.description ?? "",
        });
        currentAp -= apCost;
        logLines.push(
          `[SUMMON-CAST] ${summonLabel} (${summon.id}) applied ${spell.name} to ${action.targetId} -${apCost}AP`,
        );
      }
    } else {
      logLines.push(
        `[SUMMON-CAST] ${summonLabel} (${summon.id}) insufficient AP (need ${apCost}, have ${currentAp})`,
      );
    }
  } else if (action.kind === "melee" && action.targetId) {
    const apCost = helpers.meleeApCost;
    if (currentAp >= apCost) {
      const dmg = helpers.calcScaledDamage(
        summon.atk ?? summon.level,
        summon.level,
        0,
      );
      summonCtx.dealDamage(action.targetId, dmg);
      currentAp -= apCost;
      logLines.push(
        `[SUMMON-MELEE] ${summonLabel} (${summon.id}) hit ${action.targetId} for ${dmg} -${apCost}AP`,
      );
    } else {
      logLines.push(
        `[SUMMON-MELEE] ${summonLabel} (${summon.id}) insufficient AP (need ${apCost}, have ${currentAp})`,
      );
    }
  } else {
    // skip / hold
    logLines.push(
      `[SUMMON-HOLD] ${summonLabel} (${summon.id}) ${action.intent ?? "holds"}`,
    );
  }

  // ── Emit logs through the real SpellContext log channel ───────────────
  for (const line of logLines) {
    summonCtx.log(line, action.intentColor ?? "#a78bfa", true);
  }

  return { newPosition: { x, y }, currentAp, currentMp, hp, logLines };
}
