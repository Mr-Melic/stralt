/**
 * Summon spawn helper — creates a summoned unit from a spell definition,
 * pushes it into the enemy/combatant list and the turn order, and logs its appearance.
 * Pure function: no React / DOM dependencies.
 */

export interface SummonUnitDef {
  pieceType: string;
  level: number;
  hpScale?: number;
  damageScale?: number;
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
  isSummon?: boolean;
  summonAI?: string;
  ownerId?: string;
  turnsRemaining?: number;
  side: "player" | "enemy";
  pieceType: string;
  level: number;
  stats: any;
}

export function spawnSummonUnit(
  cell: { x: number; y: number },
  spell: any,
  ownerId: string,
  level: number,
  enemies: any[],
  turnOrder: any[],
  log: (msg: string, color?: string) => void,
  computeEnemyStats: (level: number, pieceType: string, seedKey: string) => any,
): void {
  const unitDef: SummonUnitDef | undefined = spell.summonUnitDef;
  if (!unitDef) return;

  const stats = computeEnemyStats(level, unitDef.pieceType, spell.id);
  const maxHp = Math.round(stats.hp * (unitDef.hpScale || 1));
  const summonId = `summon-${Math.random().toString(36).slice(2)}`;

  const summon: SpawnedSummon = {
    id: summonId,
    name: spell.name.replace("Summon ", ""),
    x: cell.x,
    y: cell.y,
    hp: maxHp,
    maxHp,
    side: "player",
    isSummon: true,
    summonAI: spell.summonAI || "hunter",
    ownerId,
    turnsRemaining: spell.summonLifespan || 3,
    level,
    pieceType: unitDef.pieceType,
    ...stats,
    effects: [],
    statusEffects: [],
  };

  enemies.push(summon);

  const entry: TurnOrderEntry = {
    id: summonId,
    name: summon.name,
    initiative: stats.init,
    hp: summon.hp,
    maxHp: summon.maxHp,
    isPlayer: false,
    isSummon: true,
    summonAI: summon.summonAI,
    ownerId,
    turnsRemaining: summon.turnsRemaining,
    side: "player",
    pieceType: summon.pieceType,
    level,
    stats,
  };

  turnOrder.push(entry);
  turnOrder.sort((a, b) => b.initiative - a.initiative);

  log(`${summon.name} appears!`, "#5cf08a");
}
