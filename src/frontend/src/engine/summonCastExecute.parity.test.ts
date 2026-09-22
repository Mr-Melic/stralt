import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SpellConfig } from "../types/gameTypes.ts";
import type { OccupancyContext } from "./occupancy.ts";
import type { SpellContext } from "./spellEngine.ts";
import {
  resolveSummonExecuteTarget,
  summonAoEVictimAllowed,
  summonExecuteCastAllowed,
  summonExecuteCastProceeds,
  summonExecuteMeleeAllowed,
  summonExecuteMeleeProceeds,
} from "./summonCastExecute.ts";
import { executeSummonAction } from "./summonExecutor.ts";
import { enemyCastRangeOk, spellHighlightRangeBase } from "./targeting.ts";

function dummyCtx(hits: string[] = []): SpellContext {
  return {
    rng: () => 0,
    getEffectiveStat: () => 0,
    dealDamage: (id) => {
      hits.push(id);
      return 0;
    },
    heal: () => {},
    applyEffect: () => {},
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: () => {},
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

function emptyOcc(): OccupancyContext {
  return {
    tiles: [
      [true, true, true, true, true, true],
      [true, true, true, true, true, true],
      [true, true, true, true, true, true],
      [true, true, true, true, true, true],
      [true, true, true, true, true, true],
      [true, true, true, true, true, true],
    ],
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: () => false,
  };
}

function strike(range = 2): SpellConfig {
  return {
    id: "physical_attack",
    name: "Strike",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 10n,
    range: BigInt(range),
    effectType: "damage",
    targetType: "enemy",
    isPhysical: true,
  } as SpellConfig;
}

describe("summon execute range vs decide (enemyCastRangeOk)", () => {
  const origin = { x: 2, y: 2 };
  const legal = { x: 4, y: 2 };
  const illegal = { x: 5, y: 2 };
  const spell = { range: 2 };

  it("a decided in-range tile is executable and a farther tile cannot execute", () => {
    assert.equal(enemyCastRangeOk(origin, legal, spell), true);
    assert.equal(summonExecuteCastAllowed(origin, legal, spell), true);
    assert.equal(
      summonExecuteCastProceeds({ origin, target: legal, spell }),
      true,
    );
    assert.equal(enemyCastRangeOk(origin, illegal, spell), false);
    assert.equal(summonExecuteCastAllowed(origin, illegal, spell), false);
    assert.equal(
      summonExecuteCastProceeds({ origin, target: illegal, spell }),
      false,
    );
  });

  it("melee execute matches adjacent decide and refuses Chebyshev 2", () => {
    assert.equal(summonExecuteMeleeAllowed(origin, { x: 3, y: 2 }), true);
    assert.equal(summonExecuteMeleeAllowed(origin, { x: 3, y: 3 }), true);
    assert.equal(summonExecuteMeleeAllowed(origin, { x: 4, y: 2 }), false);
    assert.equal(
      summonExecuteMeleeProceeds({ origin, target: { x: 4, y: 2 } }),
      false,
    );
  });

  it("resolves decide's player id to the wired player cell", () => {
    assert.deepEqual(
      resolveSummonExecuteTarget({
        targetId: "player",
        found: undefined,
        playerTarget: { x: 8, y: 8 },
      }),
      { x: 8, y: 8 },
    );
    assert.deepEqual(
      resolveSummonExecuteTarget({
        targetId: "player",
        found: undefined,
        getTargetPos: (id) =>
          id === "player" ? { x: 9, y: 8 } : undefined,
      }),
      { x: 9, y: 8 },
    );
    assert.equal(
      resolveSummonExecuteTarget({
        targetId: "player",
        found: undefined,
      }),
      null,
    );
  });
});

describe("summon AoE liveness vs kill detection", () => {
  it("a living opposite-side occupant is executable splash; a corpse is not", () => {
    assert.equal(
      summonAoEVictimAllowed(
        { id: "rat", hp: 8, side: "enemy" },
        "player",
        "primary",
      ),
      true,
    );
    assert.equal(
      summonAoEVictimAllowed(
        { id: "corpse", hp: 0, side: "enemy" },
        "player",
        "primary",
      ),
      false,
    );
    assert.equal(
      summonAoEVictimAllowed(
        { id: "wolf", hp: 8, side: "player" },
        "player",
        "primary",
      ),
      false,
    );
  });
});

describe("spell slot range caption vs live/highlight base", () => {
  it("uses maxRange when set so the tooltip matches execute range", () => {
    const grown = {
      range: 2n,
      maxRange: 5,
    };
    assert.equal(spellHighlightRangeBase(grown), 5);
    assert.equal(Number(grown.range), 2);
  });

  it("floors a 0-range self spell at 1 like spellRangeBase / the live gate", () => {
    assert.equal(
      spellHighlightRangeBase({ range: 0n, maxRange: undefined }),
      1,
    );
  });
});

describe("executeSummonAction range gate", () => {
  it("executes a decided in-range hostile and refuses an illegal one", () => {
    const rat = {
      id: "rat",
      x: 4,
      y: 2,
      hp: 12,
      maxHp: 12,
      side: "enemy" as const,
    };
    const hits: string[] = [];
    const legal = executeSummonAction(
      {
        archetype: "generic",
        kind: "cast",
        destination: { x: 2, y: 2 },
        spell: strike(2),
        targetId: "rat",
        intent: "arrow",
        intentColor: "#ef4444",
        retreating: false,
      },
      {
        id: "archer",
        x: 2,
        y: 2,
        hp: 10,
        maxHp: 10,
        currentAp: 4,
        currentMp: 2,
        maxAp: 4,
        maxMp: 2,
        level: 1,
        pieceType: "pawn",
        summonAI: "archer",
        side: "player",
      } as any,
      dummyCtx(hits),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx: emptyOcc(),
        worldGridSize: 6,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: (id) => (id === "rat" ? (rat as any) : undefined),
        getAoEVictims: () => [],
      },
    );
    assert.equal(legal.currentAp, 2);
    assert.deepEqual(hits, ["rat"]);

    const farHits: string[] = [];
    const farRat = { ...rat, x: 5, y: 2 };
    const illegal = executeSummonAction(
      {
        archetype: "generic",
        kind: "cast",
        destination: { x: 2, y: 2 },
        spell: strike(2),
        targetId: "rat",
        intent: "arrow",
        intentColor: "#ef4444",
        retreating: false,
      },
      {
        id: "archer",
        x: 2,
        y: 2,
        hp: 10,
        maxHp: 10,
        currentAp: 4,
        currentMp: 2,
        maxAp: 4,
        maxMp: 2,
        level: 1,
        pieceType: "pawn",
        summonAI: "archer",
        side: "player",
      } as any,
      dummyCtx(farHits),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx: emptyOcc(),
        worldGridSize: 6,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: (id) => (id === "rat" ? (farRat as any) : undefined),
        getAoEVictims: () => [],
      },
    );
    assert.equal(illegal.currentAp, 4, "out-of-range cast must not spend AP");
    assert.deepEqual(farHits, []);
  });

  it("does not splash a corpse the live player AoE path would skip", () => {
    const rat = {
      id: "rat",
      x: 3,
      y: 2,
      hp: 12,
      maxHp: 12,
      side: "enemy" as const,
    };
    const corpse = {
      id: "corpse",
      x: 3,
      y: 3,
      hp: 0,
      maxHp: 12,
      side: "enemy" as const,
    };
    const hits: string[] = [];
    const nova = {
      ...strike(2),
      id: "spell-frost-nova",
      areaRadius: 2,
      hitsMultiple: true,
    } as SpellConfig;
    executeSummonAction(
      {
        archetype: "generic",
        kind: "cast",
        destination: { x: 2, y: 2 },
        spell: nova,
        targetId: "rat",
        intent: "blast",
        intentColor: "#ef4444",
        retreating: false,
      },
      {
        id: "mage",
        x: 2,
        y: 2,
        hp: 10,
        maxHp: 10,
        currentAp: 4,
        currentMp: 2,
        maxAp: 4,
        maxMp: 2,
        level: 1,
        pieceType: "bishop",
        summonAI: "archer",
        side: "player",
      } as any,
      dummyCtx(hits),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx: emptyOcc(),
        worldGridSize: 6,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: (id) => (id === "rat" ? (rat as any) : undefined),
        getAoEVictims: () => [corpse as any, rat as any],
      },
    );
    assert.deepEqual(hits, ["rat"]);
  });
});
