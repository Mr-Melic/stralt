import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import { sumDotTicks } from "./dotStacks.ts";
import type { OccupancyContext } from "./occupancy.ts";
import type { SpellContext } from "./spellEngine.ts";
import { getStatModifier } from "./statusEffects.ts";
import { executeSummonAction } from "./summonExecutor.ts";
import {
  kitCastEffectType,
  kitCastStatusEffect,
} from "./summonKitStatusEffect.ts";

function byId(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("kitCastStatusEffect", () => {
  it("writes Shield RES so getStatModifier is +30%, not identity", () => {
    const shield = byId("starter-shield");
    const omitted = {
      targetId: "player",
      type: "buff" as const,
      effectName: shield.name,
    };
    assert.equal(getStatModifier("player", "res", [omitted]), 1);
    const row = kitCastStatusEffect(shield, "player");
    assert.equal(row.stat, "res");
    assert.equal(row.modifier, 1.3);
    assert.equal(getStatModifier("player", "res", [row]), 1.3);
  });

  it("writes Iron Skin RES on the casting summon, not the player", () => {
    const iron = byId("spell-iron-skin");
    const row = kitCastStatusEffect(iron, "golem-1");
    assert.equal(kitCastEffectType(iron), "buff");
    assert.equal(row.targetId, "golem-1");
    assert.equal(row.stat, "res");
    assert.equal(row.modifier, 1.3);
    assert.equal(getStatModifier("golem-1", "res", [row]), 1.3);
    assert.equal(getStatModifier("player", "res", [row]), 1);
  });

  it("writes Slow MP as a flat −2 additive row", () => {
    const slow = byId("spell-slow");
    const omitted = {
      targetId: "rat-1",
      type: "debuff" as const,
      effectName: slow.name,
    };
    assert.equal(getStatModifier("rat-1", "mp", [omitted]), 0);
    const row = kitCastStatusEffect(slow, "rat-1");
    assert.equal(row.stat, "mp");
    assert.equal(row.modifier, -2);
    assert.equal(getStatModifier("rat-1", "mp", [row]), -2);
  });

  it("writes Poison Arrow dmg/turn so sumDotTicks is 4, not 0", () => {
    const poison = byId("starter-poison");
    const omitted = {
      id: "bare-dot",
      targetId: "rat-1",
      type: "dot" as const,
      effectName: poison.name,
      duration: 3,
      iconEmoji: "☠",
      description: "",
    };
    assert.equal(sumDotTicks([omitted], "rat-1"), 0);
    const row = kitCastStatusEffect(poison, "rat-1");
    assert.equal(row.type, "dot");
    assert.equal(row.dotDamagePerTurn, 4);
    assert.equal(
      sumDotTicks(
        [
          {
            id: String(row.id),
            effectName: row.effectName,
            type: "dot",
            targetId: row.targetId,
            duration: row.duration,
            iconEmoji: row.iconEmoji,
            description: row.description,
            dotDamagePerTurn: row.dotDamagePerTurn,
          },
        ],
        "rat-1",
      ),
      4,
    );
  });
});

function emptyOccupancy(): OccupancyContext {
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

function capturingCtx(sink: unknown[]): SpellContext {
  return {
    rng: () => 0,
    getEffectiveStat: () => 0,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: (effect) => {
      sink.push(effect);
    },
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: () => {},
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

describe("executeSummonAction kit status metadata", () => {
  it("applies Golem Shield with RES 1.3 on the ward, not a nameless buff", () => {
    const applied: unknown[] = [];
    const shield = byId("starter-shield");
    executeSummonAction(
      {
        archetype: "generic",
        kind: "cast",
        destination: { x: 1, y: 0 },
        spell: shield,
        targetId: "player",
        intent: "starter-shield",
        intentColor: "#86efac",
        retreating: false,
      },
      {
        id: "golem-1",
        x: 1,
        y: 0,
        hp: 20,
        maxHp: 20,
        currentAp: 4,
        currentMp: 2,
        maxAp: 4,
        maxMp: 2,
        level: 1,
        pieceType: "pawn",
        summonAI: "guardian",
      } as any,
      capturingCtx(applied),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx: emptyOccupancy(),
        worldGridSize: 4,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: () => undefined,
        getAoEVictims: () => [],
      },
    );
    assert.equal(applied.length, 1);
    const row = applied[0] as {
      stat?: string;
      modifier?: number;
      targetId?: string;
    };
    assert.equal(row.targetId, "player");
    assert.equal(row.stat, "res");
    assert.equal(row.modifier, 1.3);
  });
});
