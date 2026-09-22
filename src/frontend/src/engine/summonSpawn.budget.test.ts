import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CombatantEntry } from "../components/InitiativeStrip";
import { SUMMON_AP, SUMMON_MP } from "../data/gameConstants.ts";
import type { Enemy } from "../types/gameTypes";
import { summonTurnBudget } from "../utils/summonControlCast.ts";
import {
  addCombatant,
  getLiveCombatants,
  initCombatantStore,
} from "./combatantStore.ts";
import { getSummonBaseStats } from "./progression.ts";
import { spawnEnemySummonUnit, spawnSummonUnit } from "./summonSpawn.ts";

function enemyLevelApMp(level: number): { ap: number; mp: number } {
  return { ap: level, mp: Math.max(1, Math.floor(level / 2)) };
}

function spawnArcher(ownerLevel: number) {
  return spawnSummonUnit(
    { x: 3, y: 3 },
    {
      id: "summon-poison-archer",
      name: "Summon Archer",
      summonAI: "archer",
      summonUnitDef: { pieceType: "pawn", level: 1 },
    },
    "player",
    ownerLevel,
    () => {},
    () => ({ init: 8, atk: 4, res: 0 }),
  );
}

describe("spawnSummonUnit kit AP/MP vs enemy-level formula", () => {
  it("seeds leftover currentAp/currentMp from the archer kit, not the owner's level", () => {
    // Initiative strip / control panel used the enemy-level formula
    // (level / floor(level/2)). A level-5 caster's 2-AP Archer then looked
    // like it still had 5 AP after Poison Arrow, and leftover 0-AP turns
    // never auto-ended. spawnSummonUnit must copy getSummonBaseStats onto
    // currentAp/currentMp so HUD and spend share the kit budget.
    const ownerLevel = 5;
    const { summon } = spawnArcher(ownerLevel);
    const kit = getSummonBaseStats(
      0,
      { pieceType: "pawn", level: 1 },
      "archer",
    );
    const enemyFormula = enemyLevelApMp(ownerLevel);

    assert.equal(kit.maxAp, SUMMON_AP.archer);
    assert.equal(kit.maxMp, SUMMON_MP.archer);
    assert.equal(summon.currentAp, kit.maxAp);
    assert.equal(summon.maxAp, kit.maxAp);
    assert.equal(summon.currentMp, kit.maxMp);
    assert.equal(summon.maxMp, kit.maxMp);
    assert.equal(summon.currentAp, 2);
    assert.equal(summon.currentMp, 3);
    assert.notEqual(
      summon.currentAp,
      enemyFormula.ap,
      "must not substitute owner-level AP for the archer kit",
    );
    assert.notEqual(
      summon.currentMp,
      enemyFormula.mp,
      "must not substitute floor(level/2) MP for the archer kit",
    );
  });

  it("keeps leftover 0 AP after a 2-AP Poison Arrow, not the owner's level", () => {
    const { summon } = spawnArcher(5);
    assert.equal(summon.currentAp, 2);
    summon.currentAp -= 2;
    summon.currentMp -= 1;
    assert.equal(summon.currentAp, 0);
    assert.equal(summon.currentMp, 2);
    assert.notEqual(summon.currentAp, 5);
    assert.deepEqual(summonTurnBudget(summon), {
      currentAp: 2,
      currentMp: 3,
    });
  });

  it("stores the kit leftover on the live combatant row the HUD reads", () => {
    const { summon } = spawnArcher(5);
    summon.currentAp = 0;
    summon.currentMp = 1;
    const combatantsRef = { current: [] as Enemy[] };
    const ctx = initCombatantStore(
      combatantsRef,
      { current: [] as Enemy[] },
      { current: [] as Enemy[] },
      { current: [] as CombatantEntry[] },
      { current: 0 },
      () => {},
      () => {},
      () => {},
    );
    addCombatant(ctx, summon as unknown as Enemy, {
      battleParticipant: true,
    });
    const live = getLiveCombatants(ctx)[0];
    assert.equal(live.currentAp, 0);
    assert.equal(live.currentMp, 1);
    assert.equal(live.maxAp, 2);
    assert.notEqual(live.currentAp, live.level);
  });
});

describe("spawnEnemySummonUnit kit budget", () => {
  it("seeds hostile minion AP/MP from the unit def, not summoner level", () => {
    const spawned = spawnEnemySummonUnit(
      { x: 4, y: 4 },
      {
        id: "summon-dire-wolf",
        summonUnitDef: { pieceType: "pawn", level: 1 },
      },
      [],
      6,
      () => {},
      () => ({ init: 5 }),
    );
    assert.ok(spawned);
    const kit = getSummonBaseStats(0, { pieceType: "pawn", level: 1 }, "pawn");
    assert.equal(spawned.summon.currentAp, kit.maxAp);
    assert.equal(spawned.summon.currentMp, kit.maxMp);
    assert.notEqual(
      spawned.summon.currentAp,
      6,
      "enemy-side spawn must not use summoner level as AP",
    );
  });
});
