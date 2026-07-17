/**
 * Summon spawn helper — creates a summoned unit from a spell definition and
 * returns it together with its turn-order entry. The caller is responsible for
 * inserting both into the real React state paths (enemies, battleEnemies,
 * turnOrder). Pure function: no React / DOM dependencies, no mutation of
 * caller-owned arrays.
 */

import type { CombatantEntry } from "../components/InitiativeStrip";
import {
  SUMMON_AP,
  SUMMON_AP_PER_LEVELS,
  SUMMON_BASE_HP,
  SUMMON_BASE_HP_DEFAULT,
  SUMMON_HP_PER_LEVEL_PCT,
  SUMMON_MP,
  SUMMON_MP_PER_LEVELS,
} from "../data/gameConstants";
import type { Enemy } from "../types/gameTypes";
import { logDebugInfo } from "../utils/debugLogger";
import {
  type OccupancyContext,
  findNearestFreeCell,
  isCellFree as sharedIsCellFree,
} from "./occupancy";

export interface SummonUnitDef {
  pieceType: string;
  level: number;
  hpScale?: number;
  damageScale?: number;
  /** Spell ids (from data/spellData.ts) the summon can cast via its AI kit. */
  summonKit?: string[];
  /** Per-turn Action Point budget. Falls back to SUMMON_AP[summonAI]. */
  ap?: number;
  /** Per-turn Mana Point budget. Falls back to SUMMON_MP[summonAI]. */
  mp?: number;
}

export interface SpawnedSummon {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  side: "player" | "enemy";
  isSummon: true;
  summonAI: string;
  ownerId: string;
  turnsRemaining: number;
  level: number;
  pieceType: string;
  effects: any[];
  statusEffects: any[];
  [k: string]: any;
}

export interface TurnOrderEntry {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  isPlayer: boolean;
  /**
   * Combatant type used by the turn-advance gate in WorldExploration.tsx
   * (currentCombatant.type !== "enemy" rejects entries without type: "enemy").
   * Player-side summons are tagged "enemy" so they receive turns — their
   * side: "player" field still routes their AI through handleSummonTurn.
   */
  type: "player" | "enemy";
  isSummon?: boolean;
  summonAI?: string;
  ownerId?: string;
  turnsRemaining?: number;
  side: "player" | "enemy";
  pieceType: string;
  level: number;
  stats: any;
}

/** Chess-piece unicode glyph for a summon's pieceIcon (mirrors InitiativeStrip PIECE_SYMBOLS). */
const SUMMON_PIECE_ICONS: Record<string, string> = {
  king: "\u265A",
  queen: "\u265B",
  rook: "\u265C",
  bishop: "\u265D",
  knight: "\u265E",
  pawn: "\u265F",
};

export interface SpawnSummonResult {
  summon: SpawnedSummon;
  turnOrderEntry: CombatantEntry;
}

export function spawnSummonUnit(
  cell: { x: number; y: number },
  spell: any,
  ownerId: string,
  level: number,
  log: (msg: string, color?: string, isSummon?: boolean) => void,
  computeEnemyStats: (level: number, pieceType: string, seedKey: string) => any,
  spellLevel = 0,
  occupancyCtx?: OccupancyContext,
): SpawnSummonResult {
  const unitDef: SummonUnitDef | undefined = spell.summonUnitDef;
  if (!unitDef) {
    // Caller guards against missing unitDef before invoking; return an empty
    // result shape so the call site's destructure does not throw.
    throw new Error("spawnSummonUnit: spell.summonUnitDef is required");
  }

  // Spawn placement: if an occupancy context is provided and the requested
  // cell is not free (occupied / impassable / barrier / void / portal), fall
  // back to the nearest free cell within a 3-tile radius. Backward-compatible —
  // callers that omit occupancyCtx keep the original behavior.
  let spawnCell = cell;
  if (occupancyCtx && !sharedIsCellFree(cell, occupancyCtx)) {
    const fallback = findNearestFreeCell(cell, occupancyCtx, 3);
    if (fallback) spawnCell = fallback;
  }

  const stats = computeEnemyStats(level, unitDef.pieceType, spell.id);
  const summonAI = spell.summonAI || "hunter";
  // Base HP comes from the SUMMON_BASE_HP map keyed by summonAI archetype.
  // `computeEnemyStats` does NOT return an `hp` field, so deriving maxHp from
  // `stats.hp` produced NaN. Use the archetype base HP, scaled by the spell's
  // hpScale, then by the spell-level HP bonus (+10% per level).
  const baseHp = SUMMON_BASE_HP[summonAI] ?? SUMMON_BASE_HP_DEFAULT;
  const hpScale = unitDef.hpScale || 1;
  const hpLevelMul = 1 + (spellLevel * SUMMON_HP_PER_LEVEL_PCT) / 100;
  const maxHp = Math.round(baseHp * hpScale * hpLevelMul);
  const summonId = `summon-${Math.random().toString(36).slice(2)}`;
  // Per-archetype AP/MP budget. The spell's summonUnitDef may override; otherwise
  // fall back to the SUMMON_AP / SUMMON_MP constant maps keyed by summonAI.
  // Spell leveling: +1 AP every SUMMON_AP_PER_LEVELS levels, +1 MP every
  // SUMMON_MP_PER_LEVELS levels.
  const maxAp =
    (unitDef.ap ?? SUMMON_AP[summonAI] ?? 2) +
    Math.floor(spellLevel / SUMMON_AP_PER_LEVELS);
  const maxMp =
    (unitDef.mp ?? SUMMON_MP[summonAI] ?? 2) +
    Math.floor(spellLevel / SUMMON_MP_PER_LEVELS);

  const summon: SpawnedSummon = {
    id: summonId,
    name: spell.name.replace("Summon ", ""),
    x: spawnCell.x,
    y: spawnCell.y,
    hp: maxHp,
    maxHp,
    side: "player",
    isSummon: true,
    summonAI,
    ownerId,
    turnsRemaining: spell.summonLifespan || 3,
    level,
    pieceType: unitDef.pieceType,
    // Enemy type requires currentView; summons always face front on spawn.
    currentView: "front",
    // AP/MP budgets — reset to max at the start of each of the summon's turns
    // (see handleSummonTurn in summonIntegration.ts).
    currentAp: maxAp,
    maxAp,
    currentMp: maxMp,
    maxMp,
    ...stats,
    effects: [],
    statusEffects: [],
  };

  const turnOrderEntry: CombatantEntry = {
    id: summonId,
    name: summon.name,
    initiative: stats.init,
    hp: summon.hp,
    maxHp: summon.maxHp,
    level,
    pieceIcon: SUMMON_PIECE_ICONS[unitDef.pieceType] ?? "\u265F",
    // Tag as "enemy" so the turn-advance gate (currentCombatant.type !== "enemy")
    // grants the summon a turn. side: "player" still routes its AI through
    // handleSummonTurn (player-side summon AI), not the enemy AI branch.
    type: "enemy",
    isSummon: true,
    summonAI: summon.summonAI,
    ownerId,
    turnsRemaining: summon.turnsRemaining,
    side: "player",
    pieceType: summon.pieceType,
  };

  log(`${summon.name} appears!`, "#5cf08a", true);

  // [SUMMON] link (d): spawnSummonUnit returned a summon.
  logDebugInfo("SUMMON", "spawnSummonUnit returned", {
    summonId,
    name: summon.name,
    pieceType: summon.pieceType,
    hp: summon.hp,
    maxHp: summon.maxHp,
    level: summon.level,
    spellLevel,
    maxAp: summon.maxAp,
    maxMp: summon.maxMp,
    turnsRemaining: summon.turnsRemaining,
    cell: { x: summon.x, y: summon.y },
  });

  return { summon, turnOrderEntry };
}

/**
 * Pure helper that computes the new `enemies` and `turnOrder` arrays after a
 * summon has been spawned. Centralizes the `SpawnedSummon -> Enemy` cast (the
 * summon carries the runtime fields the renderer/AI need; the Enemy interface
 * is wider but the missing fields are optional or unused for summons) and the
 * summoner-adjacent turn-order placement (immediately after the summoner's
 * entry, or appended at the end if the summoner is not found).
 *
 * The caller is responsible for forwarding the returned arrays to its React
 * state setters (setEnemies / setBattleEnemies / setTurnOrder) and for keeping
 * any refs (battleEnemiesRef, turnOrderRef) in sync.
 */
export interface ApplySummonResult {
  enemies: Enemy[];
  turnOrder: CombatantEntry[];
}

export function applySummonResult(
  summon: SpawnedSummon,
  turnOrderEntry: CombatantEntry,
  summonerId: string,
  currentEnemies: Enemy[],
  currentTurnOrder: CombatantEntry[],
): ApplySummonResult {
  // [SUMMON] link (e): entry state for applySummonResult.
  logDebugInfo("SUMMON", "applySummonResult entered", {
    summonId: summon.id,
    summonerId,
    currentEnemiesLength: currentEnemies.length,
    currentTurnOrderLength: currentTurnOrder.length,
  });
  const enemies: Enemy[] = [...currentEnemies, summon as unknown as Enemy];
  const i = currentTurnOrder.findIndex(
    (e) => e.id === summonerId || e.ownerId === summonerId,
  );
  const turnOrder = [...currentTurnOrder];
  turnOrder.splice(
    i === -1 ? currentTurnOrder.length : i + 1,
    0,
    turnOrderEntry,
  );
  // [SUMMON] link (e): returned arrays before exit.
  logDebugInfo("SUMMON", "applySummonResult returning", {
    enemiesLength: enemies.length,
    turnOrderLength: turnOrder.length,
  });
  return { enemies, turnOrder };
}
