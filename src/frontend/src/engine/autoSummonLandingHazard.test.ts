import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyAutoSummonLandingAfterExecutor,
  autoSummonHazardKindAt,
  hpAfterAutoSummonLanding,
  planAutoSummonLanding,
  rollAutoSummonLavaDamage,
  rollAutoSummonSpikeDamage,
  shouldApplyAutoSummonLandingHazard,
} from "./autoSummonLandingHazard.ts";
import { battleWalkHazardDamages } from "./battleSetup.ts";
import type { OccupancyContext } from "./occupancy.ts";
import type { SpellContext } from "./spellEngine.ts";
import { executeSummonAction } from "./summonExecutor.ts";

function tiles(entries: Array<[string, string]>): Map<string, string> {
  return new Map(entries);
}

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

describe("auto-summon landing rolls match enemy apply", () => {
  it("lava is 8–15 inclusive", () => {
    assert.equal(
      rollAutoSummonLavaDamage(() => 0),
      8,
    );
    assert.equal(
      rollAutoSummonLavaDamage(() => 0.999),
      15,
    );
  });

  it("spikes are 5–10 inclusive", () => {
    assert.equal(
      rollAutoSummonSpikeDamage(() => 0),
      5,
    );
    assert.equal(
      rollAutoSummonSpikeDamage(() => 0.999),
      10,
    );
  });
});

describe("planAutoSummonLanding landed cell (enemy apply contract)", () => {
  it("charges lava HP + Burning so a last hostile summon can die in the store", () => {
    const landing = planAutoSummonLanding({
      origin: { x: 1, y: 0 },
      landed: { x: 2, y: 0 },
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 12,
    });
    assert.equal(landing.lavaDmg, 12);
    assert.equal(landing.burning, true);
    assert.equal(landing.hpLoss, 12);
    const hp = hpAfterAutoSummonLanding(10, landing);
    assert.equal(hp.newHp, 0);
    assert.equal(hp.lethal, true);
  });

  it("charges spikes without Burning", () => {
    const landing = planAutoSummonLanding({
      origin: { x: 0, y: 0 },
      landed: { x: 1, y: 0 },
      hazardTiles: tiles([["1,0", "spikes"]]),
      spikeDmg: 7,
    });
    assert.equal(landing.spikeDmg, 7);
    assert.equal(landing.burning, false);
    assert.equal(landing.frozen, false);
    assert.equal(hpAfterAutoSummonLanding(20, landing).newHp, 13);
  });

  it("applies Frozen on ice with 0 HP (status only, no MP debit here)", () => {
    const landing = planAutoSummonLanding({
      origin: { x: 0, y: 0 },
      landed: { x: 0, y: 1 },
      hazardTiles: tiles([["0,1", "ice"]]),
    });
    assert.equal(landing.frozen, true);
    assert.equal(landing.hpLoss, 0);
    assert.equal(hpAfterAutoSummonLanding(8, landing).lethal, false);
  });

  it("does not charge Void Rift or Thorned Ground (enemy landing never did)", () => {
    const landing = planAutoSummonLanding({
      origin: { x: 4, y: 4 },
      landed: { x: 5, y: 4 },
      hazardTiles: tiles([["5,4", "void"]]),
    });
    assert.equal(landing.hpLoss, 0);
    assert.equal(
      battleWalkHazardDamages({
        thornedActive: true,
        pathLength: 3,
        voidRiftActive: true,
        dest: { x: 5, y: 4 },
        riftTile: { x: 5, y: 4 },
      }).riftDmg,
      3,
      "player walk would charge rift — auto-summon must not",
    );
    assert.equal(
      autoSummonHazardKindAt(tiles([["5,4", "void"]]), { x: 5, y: 4 }),
      undefined,
    );
  });

  it("skips a same-tile no-op so standing on lava is not re-taxed", () => {
    const standing = { x: 3, y: 3 };
    assert.equal(
      shouldApplyAutoSummonLandingHazard({
        origin: standing,
        landed: standing,
      }),
      false,
    );
    const landing = planAutoSummonLanding({
      origin: standing,
      landed: standing,
      hazardTiles: tiles([["3,3", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(landing.hpLoss, 0);
    assert.equal(landing.burning, false);
  });

  it("taxes the landed cell after a slide, not the requested dest", () => {
    const requestedLava = { x: 2, y: 0 };
    const slidFloor = { x: 1, y: 1 };
    const hazards = tiles([
      ["2,0", "lava"],
      ["1,1", "ice"],
    ]);
    const destOnly = planAutoSummonLanding({
      origin: { x: 1, y: 0 },
      landed: requestedLava,
      hazardTiles: hazards,
      lavaDmg: 15,
    });
    const afterSlide = planAutoSummonLanding({
      origin: { x: 1, y: 0 },
      landed: slidFloor,
      hazardTiles: hazards,
      lavaDmg: 15,
    });
    assert.equal(
      destOnly.hpLoss,
      15,
      "taxing requested dest is the production miss",
    );
    assert.equal(afterSlide.hpLoss, 0);
    assert.equal(afterSlide.frozen, true);
    assert.equal(afterSlide.burning, false);
  });
});

describe("applyAutoSummonLandingAfterExecutor vs executeSummonAction", () => {
  it("drops store HP after an AI wolf walks onto lava (executor currently does not)", () => {
    const occupied = new Set<string>();
    const occupancyCtx: OccupancyContext = {
      tiles: [
        [true, true, true, true],
        [true, true, true, true],
      ],
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(),
      isOccupied: (c) => occupied.has(`${c.x},${c.y}`),
    };
    const origin = { x: 1, y: 0 };
    const result = executeSummonAction(
      {
        archetype: "hunter",
        kind: "move",
        destination: { x: 2, y: 0 },
        spell: null,
        targetId: null,
        intent: "closes in",
        intentColor: "#a78bfa",
        retreating: false,
      },
      {
        id: "wolf",
        x: origin.x,
        y: origin.y,
        hp: 10,
        maxHp: 10,
        currentAp: 2,
        currentMp: 4,
        maxAp: 2,
        maxMp: 4,
        level: 1,
        pieceType: "pawn",
        summonAI: "hunter",
      } as any,
      dummyCtx(),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx,
        worldGridSize: 4,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: () => undefined,
        getAoEVictims: () => [],
      },
    );
    assert.deepEqual(result.newPosition, { x: 2, y: 0 });
    assert.equal(
      result.hp,
      10,
      "executeSummonAction still returns pre-move HP — WX used to commit that",
    );
    const naiveWxHp = result.hp;
    const applied = applyAutoSummonLandingAfterExecutor({
      origin,
      result,
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 12,
    });
    assert.equal(naiveWxHp, 10);
    assert.equal(applied.newHp, 0);
    assert.equal(applied.lethal, true);
    assert.equal(applied.landing.burning, true);
  });

  it("does not tax lava on the requested dest when occupancy slides off it", () => {
    const tilesWalk = [
      [true, true, true, true, true, true],
      [true, true, false, false, false, false],
    ];
    const reserved = new Set(["2,0", "3,0", "4,0"]);
    const occupied = new Set<string>(["0,0"]);
    const occupancyCtx: OccupancyContext = {
      tiles: tilesWalk,
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(["5,0"]),
      reserved,
      isOccupied: (c) => occupied.has(`${c.x},${c.y}`),
    };
    const origin = { x: 1, y: 1 };
    const result = executeSummonAction(
      {
        archetype: "hunter",
        kind: "move",
        destination: { x: 2, y: 0 },
        spell: null,
        targetId: null,
        intent: "closes in",
        intentColor: "#a78bfa",
        retreating: false,
      },
      {
        id: "wolf",
        x: origin.x,
        y: origin.y,
        hp: 10,
        maxHp: 10,
        currentAp: 2,
        currentMp: 4,
        maxAp: 2,
        maxMp: 4,
        level: 1,
        pieceType: "pawn",
        summonAI: "hunter",
      } as any,
      dummyCtx(),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx,
        worldGridSize: 6,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: () => undefined,
        getAoEVictims: () => [],
      },
    );
    assert.notEqual(
      `${result.newPosition.x},${result.newPosition.y}`,
      "2,0",
      "executor must slide off the reserved lava dest",
    );
    const requested = applyAutoSummonLandingAfterExecutor({
      origin,
      result: { newPosition: { x: 2, y: 0 }, hp: result.hp },
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 15,
    });
    const landed = applyAutoSummonLandingAfterExecutor({
      origin,
      result,
      hazardTiles: tiles([["2,0", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(
      requested.lethal,
      true,
      "requested dest lava is the dest-only miss",
    );
    assert.equal(landed.landing.hpLoss, 0);
    assert.equal(landed.newHp, 10);
    assert.equal(landed.lethal, false);
  });

  it("does not tax a blocked MOVE that stays on origin lava", () => {
    const occupied = new Set<string>(["2,0"]);
    const occupancyCtx: OccupancyContext = {
      tiles: [
        [true, true, true],
        [true, true, true],
      ],
      barriers: new Set(),
      voidTiles: new Set(),
      portals: new Set(),
      isOccupied: (c) => occupied.has(`${c.x},${c.y}`),
    };
    const origin = { x: 1, y: 0 };
    const result = executeSummonAction(
      {
        archetype: "hunter",
        kind: "move",
        destination: { x: 2, y: 0 },
        spell: null,
        targetId: null,
        intent: "closes in",
        intentColor: "#a78bfa",
        retreating: false,
      },
      {
        id: "wolf",
        x: origin.x,
        y: origin.y,
        hp: 9,
        maxHp: 9,
        currentAp: 2,
        currentMp: 4,
        maxAp: 2,
        maxMp: 4,
        level: 1,
        pieceType: "pawn",
        summonAI: "hunter",
      } as any,
      dummyCtx(),
      {
        calcScaledDamage: (n) => n,
        occupancyCtx,
        worldGridSize: 3,
        mpCostPerTile: 1,
        meleeApCost: 1,
        getEnemyById: () => undefined,
        getAoEVictims: () => [],
      },
    );
    assert.deepEqual(result.newPosition, origin);
    const applied = applyAutoSummonLandingAfterExecutor({
      origin,
      result,
      hazardTiles: tiles([["1,0", "lava"]]),
      lavaDmg: 15,
    });
    assert.equal(applied.newHp, 9);
    assert.equal(applied.landing.hpLoss, 0);
  });
});
