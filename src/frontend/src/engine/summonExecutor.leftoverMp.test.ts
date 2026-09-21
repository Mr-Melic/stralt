import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OccupancyContext } from "./occupancy.ts";
import type { SpellContext } from "./spellEngine.ts";
import { executeSummonAction } from "./summonExecutor.ts";

function dummyCtx(): SpellContext {
  return {
    rng: () => 0,
    getEffectiveStat: () => 0,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: () => {},
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: () => {},
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

function openOccupancy(): OccupancyContext {
  const occupied = new Set<string>();
  return {
    tiles: [
      [true, true, true, true],
      [true, true, true, true],
    ],
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: (c) => occupied.has(`${c.x},${c.y}`),
  };
}

function moveAction(x: number, y: number) {
  return {
    archetype: "hunter" as const,
    kind: "move" as const,
    destination: { x, y },
    spell: null,
    targetId: null,
    intent: "closes in",
    intentColor: "#a78bfa",
    retreating: false,
  };
}

describe("executeSummonAction leftover Frozen/Slime MP", () => {
  it("a leftover 1-MP slice cannot walk one more Frozen/Slime tile", () => {
    // #318 charged Frozen/Slime on summon-AI walks (mpCostPerTile 2). The
    // shipped test left 1 MP after a 1-tile stride but never tried the next
    // step. Player leftover 1-MP is locked in battleWalkMp; without this
    // second execute, mpCostPerTile: 1 still walks the leftover tile.
    const occupancyCtx = openOccupancy();
    const helpers = {
      calcScaledDamage: (n: number) => n,
      occupancyCtx,
      worldGridSize: 4,
      mpCostPerTile: 2,
      meleeApCost: 1,
      getEnemyById: () => undefined,
      getAoEVictims: () => [],
    };
    const first = executeSummonAction(
      moveAction(2, 0),
      {
        id: "wolf",
        x: 1,
        y: 0,
        hp: 10,
        maxHp: 10,
        currentAp: 2,
        currentMp: 3,
        maxAp: 2,
        maxMp: 3,
        level: 1,
        pieceType: "pawn",
        summonAI: "hunter",
      } as any,
      dummyCtx(),
      helpers,
    );
    assert.equal(first.newPosition.x, 2);
    assert.equal(first.currentMp, 1);

    const second = executeSummonAction(
      moveAction(3, 0),
      {
        id: "wolf",
        x: first.newPosition.x,
        y: first.newPosition.y,
        hp: 10,
        maxHp: 10,
        currentAp: 2,
        currentMp: first.currentMp,
        maxAp: 2,
        maxMp: 3,
        level: 1,
        pieceType: "pawn",
        summonAI: "hunter",
      } as any,
      dummyCtx(),
      helpers,
    );
    assert.equal(
      second.newPosition.x,
      2,
      "leftover 1 MP must not pay a 2-MP Frozen tile",
    );
    assert.equal(second.currentMp, 1);
  });
});
