import type { CombatantEntry } from "../../components/InitiativeStrip";
import type { Enemy, SpellConfig } from "../../types/gameTypes";
import type { CombatantStoreCtx } from "../combatantStore";

export function makeEnemy(
  overrides: Partial<Enemy> & Pick<Enemy, "id">,
): Enemy {
  return {
    x: 0,
    y: 0,
    level: 1,
    hp: 50,
    maxHp: 50,
    res: 0,
    sp: 0,
    chc: 0,
    init: 0,
    pieceType: "pawn",
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "default",
    ...overrides,
  };
}

export function makeSpell(overrides: Partial<SpellConfig> = {}): SpellConfig {
  return {
    id: "test-spell",
    name: "Test Spell",
    description: "",
    iconEmoji: "✨",
    apCost: 1n,
    mpCost: 0n,
    damage: 10n,
    range: 3n,
    effectType: "damage",
    ...overrides,
  };
}

export function makeTurnEntry(
  overrides: Partial<CombatantEntry> & Pick<CombatantEntry, "id">,
): CombatantEntry {
  return {
    type: "enemy",
    initiative: 10,
    name: overrides.id,
    pieceIcon: "",
    hp: 50,
    maxHp: 50,
    level: 1,
    ...overrides,
  };
}

export function makeStoreCtx(
  combatants: Enemy[],
  turnOrder?: CombatantEntry[],
): CombatantStoreCtx {
  const combatantsRef = { current: [...combatants] };
  const enemiesRef = { current: [...combatants] };
  const battleEnemiesRef = { current: [...combatants] };
  const order =
    turnOrder ??
    combatants.map((c) =>
      makeTurnEntry({
        id: c.id,
        type: c.isSummon ? "summon" : c.side === "player" ? "player" : "enemy",
        hp: c.hp,
        maxHp: c.maxHp,
        side: c.side,
        isSummon: c.isSummon,
      }),
    );
  const turnOrderRef = { current: [...order] };
  const currentTurnIndexRef = { current: 0 };
  return {
    combatantsRef,
    battleStartIds: new Set(combatants.map((c) => c.id)),
    enemiesRef,
    battleEnemiesRef,
    turnOrderRef,
    currentTurnIndexRef,
    setEnemies: (updater) => {
      enemiesRef.current = updater(enemiesRef.current);
    },
    setBattleEnemies: (updater) => {
      battleEnemiesRef.current = updater(battleEnemiesRef.current);
    },
    setTurnOrder: (updater) => {
      turnOrderRef.current = updater(turnOrderRef.current);
    },
  };
}
