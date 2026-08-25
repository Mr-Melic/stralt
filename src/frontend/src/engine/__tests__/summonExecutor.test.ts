import { describe, expect, it } from "vitest";
import { WORLD_GRID_SIZE } from "../../data/gameConstants";
import type { Enemy } from "../../types/gameTypes";
import type { EnemyAction } from "../enemyAI";
import { type OccupancyContext, occKey } from "../occupancy";
import type { SpellContext } from "../spellEngine";
import { executeSummonAction } from "../summonExecutor";
import { makeEnemy, makeSpell } from "./fixtures";

function makeOccupancy(
  occupied: Array<{ x: number; y: number }> = [],
): OccupancyContext {
  const keys = new Set(occupied.map((c) => occKey(c.x, c.y)));
  return {
    tiles: Array.from({ length: WORLD_GRID_SIZE }, () =>
      Array.from({ length: WORLD_GRID_SIZE }, () => true),
    ),
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: (cell) => keys.has(occKey(cell.x, cell.y)),
  };
}

function makeSpellCtx(opts?: {
  onDamage?: (id: string, amount: number) => void;
  onHeal?: (id: string, amount: number) => void;
}): SpellContext {
  return {
    rng: () => 0.5,
    getEffectiveStat: () => 0,
    dealDamage: (id, amount) => {
      opts?.onDamage?.(id, amount);
      return amount;
    },
    heal: (id, amount) => {
      opts?.onHeal?.(id, amount);
    },
    applyEffect: () => undefined,
    placeBarrier: () => undefined,
    spawnUnit: () => undefined,
    log: () => undefined,
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

function makeAction(overrides: Partial<EnemyAction>): EnemyAction {
  return {
    archetype: "generic",
    destination: { x: 0, y: 0 },
    spell: null,
    targetId: null,
    kind: "skip",
    intent: "hold",
    intentColor: "#fff",
    retreating: false,
    ...overrides,
  };
}

function makeHelpers(
  occupancyCtx: OccupancyContext,
  extras?: {
    getEnemyById?: (id: string) => Enemy | undefined;
    getAoEVictims?: () => Enemy[];
    reevaluate?: (
      postMoveSummon: Enemy,
      currentAp: number,
      currentMp: number,
    ) => EnemyAction | null;
  },
) {
  return {
    calcScaledDamage: (base: number) => base,
    occupancyCtx,
    worldGridSize: WORLD_GRID_SIZE,
    mpCostPerTile: 1,
    meleeApCost: 1,
    getEnemyById: extras?.getEnemyById ?? (() => undefined),
    getAoEVictims: extras?.getAoEVictims ?? (() => []),
    reevaluate: extras?.reevaluate,
  };
}

describe("executeSummonAction", () => {
  it("refuses to move onto an occupied tile and spends no MP", () => {
    const summon = makeEnemy({
      id: "wolf",
      x: 3,
      y: 3,
      currentAp: 2,
      currentMp: 2,
      maxAp: 2,
      maxMp: 2,
      isSummon: true,
      summonAI: "hunter",
    });
    const result = executeSummonAction(
      makeAction({
        kind: "move",
        intent: "advance",
        destination: { x: 4, y: 3 },
      }),
      summon,
      makeSpellCtx(),
      makeHelpers(makeOccupancy([{ x: 4, y: 3 }])),
    );
    expect(result.newPosition).toEqual({ x: 3, y: 3 });
    expect(result.currentMp).toBe(2);
    expect(result.logLines.some((l) => l.includes("blocked (occupied)"))).toBe(
      true,
    );
  });

  it("moves onto a free tile and spends Chebyshev MP", () => {
    const summon = makeEnemy({
      id: "wolf",
      x: 3,
      y: 3,
      currentAp: 2,
      currentMp: 2,
      maxAp: 2,
      maxMp: 2,
      isSummon: true,
      summonAI: "hunter",
    });
    const result = executeSummonAction(
      makeAction({
        kind: "move",
        intent: "advance",
        destination: { x: 4, y: 4 },
      }),
      summon,
      makeSpellCtx(),
      makeHelpers(makeOccupancy()),
    );
    expect(result.newPosition).toEqual({ x: 4, y: 4 });
    expect(result.currentMp).toBe(1);
  });

  it("applies a follow-up melee after a successful move when AP remains", () => {
    const hits: Array<{ id: string; amount: number }> = [];
    const summon = makeEnemy({
      id: "wolf",
      x: 3,
      y: 3,
      currentAp: 2,
      currentMp: 2,
      maxAp: 2,
      maxMp: 2,
      atk: 7,
      level: 1,
      isSummon: true,
      summonAI: "hunter",
    });
    const result = executeSummonAction(
      makeAction({
        kind: "move",
        intent: "advance",
        destination: { x: 4, y: 3 },
      }),
      summon,
      makeSpellCtx({ onDamage: (id, amount) => hits.push({ id, amount }) }),
      makeHelpers(makeOccupancy(), {
        reevaluate: () =>
          makeAction({
            kind: "melee",
            targetId: "goblin",
            intent: "physical-attack",
          }),
      }),
    );
    expect(result.newPosition).toEqual({ x: 4, y: 3 });
    expect(result.currentAp).toBe(1);
    expect(hits).toEqual([{ id: "goblin", amount: 7 }]);
  });

  it("zeros bomber HP after a damaging detonation", () => {
    const inferno = makeSpell({
      id: "spell-inferno",
      name: "Inferno",
      damage: 20n,
      range: 3n,
      effectType: "damage",
      spellType: "damage",
    });
    const target = makeEnemy({ id: "goblin", x: 5, y: 4 });
    const summon = makeEnemy({
      id: "bomb",
      x: 4,
      y: 4,
      hp: 40,
      currentAp: 2,
      currentMp: 2,
      maxAp: 2,
      maxMp: 2,
      isSummon: true,
      summonAI: "bomber",
    });
    const result = executeSummonAction(
      makeAction({
        kind: "cast",
        spell: inferno,
        targetId: "goblin",
        intent: "detonate",
      }),
      summon,
      makeSpellCtx(),
      makeHelpers(makeOccupancy(), {
        getEnemyById: (id) => (id === "goblin" ? target : undefined),
      }),
    );
    expect(result.hp).toBe(0);
    expect(result.currentAp).toBe(1);
    expect(result.logLines.some((l) => l.includes("detonated"))).toBe(true);
  });

  it("treats a cast with no spell/target as a skip instead of hanging", () => {
    const summon = makeEnemy({
      id: "wolf",
      x: 3,
      y: 3,
      currentAp: 2,
      currentMp: 2,
      isSummon: true,
      summonAI: "hunter",
    });
    const result = executeSummonAction(
      makeAction({ kind: "cast", spell: null, targetId: null, intent: "cast" }),
      summon,
      makeSpellCtx(),
      makeHelpers(makeOccupancy()),
    );
    expect(result.currentAp).toBe(2);
    expect(result.newPosition).toEqual({ x: 3, y: 3 });
    expect(result.hp).toBe(50);
    expect(result.logLines.some((l) => l.startsWith("[skip]"))).toBe(true);
  });
});
