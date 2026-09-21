import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy } from "../types/gameTypes.ts";
import {
  type ApplyDamageToEnemyDeps,
  applyDamageToEnemy,
} from "./castHelpers.ts";

function enemy(overrides: Partial<Enemy> = {}): Enemy {
  return {
    id: "e1",
    x: 4,
    y: 4,
    level: 3,
    hp: 40,
    maxHp: 40,
    res: 0,
    sp: 0,
    chc: 0,
    init: 10,
    pieceType: "pawn",
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "plague_rat",
    ...overrides,
  };
}

function stubDeps(
  overrides: Partial<ApplyDamageToEnemyDeps> = {},
): ApplyDamageToEnemyDeps {
  return {
    spell: { id: "bolt", name: "Bolt" },
    gridPos: { x: 4, y: 4 },
    isPhysical: false,
    isCrit: false,
    rawDmg: 20,
    preCritDmg: 20,
    preCritDmgBM: 20,
    isDrainSpell: false,
    maxHp: 50,
    characterStats: { hp: 50 },
    targetsToHit: [],
    activeEffectsRef: { current: [] },
    turnOrderRef: { current: [] },
    currentTurnIndexRef: { current: 0 },
    bossStateRef: { current: null },
    enemyHpMap: { e1: 40 },
    leaderEnemyIdRef: { current: null },
    battleHitsRef: { current: 0 },
    battleCritHitsRef: { current: 0 },
    battleLeaderSlainRef: { current: false },
    leaderDiedRef: { current: false },
    leaderBoostPercent: 0,
    calculatePlayerDamage: (baseDamage) => ({
      finalDamage: baseDamage,
      breakdown: "",
    }),
    logBattleEntry: () => {},
    calcEnemyMaxHp: (level) => level * 10,
    setEnemyHpMap: () => {},
    setTurnOrder: (updater) => {
      updater([]);
    },
    enemies: [],
    enemyTakesDamage: () => {},
    playSound: () => {},
    setEnemies: () => {},
    triggerLeaderDeathAnimation: () => {},
    setLeaderBoostMultiplier: () => {},
    setCharacterStats: () => {},
    processCombatantDeath: () => false,
    onPlayerReflectedDamage: () => {},
    ...overrides,
  };
}

describe("applyDamageToEnemy Shell Armor death return", () => {
  it("returns false when Shell Armor leaves the boss alive (pre-armor dmg was lethal)", () => {
    let storeHp = 50;
    let died = false;
    const result = applyDamageToEnemy({
      hitTarget: enemy({ id: "brood", hp: 50, pieceType: "rook" }),
      isFirstTarget: true,
      deps: stubDeps({
        preCritDmgBM: 60,
        enemyHpMap: { brood: 50 },
        turnOrderRef: {
          current: [{ id: "brood", isBoss: true } as any],
        },
        bossStateRef: {
          current: { shellArmorActive: true, larvae: [{}] },
        },
        calculatePlayerDamage: () => ({
          finalDamage: 60,
          breakdown: "",
        }),
        commitEnemyHp: (_id, hp) => {
          storeHp = hp;
        },
        processCombatantDeath: () => {
          died = true;
          return true;
        },
      }),
    });
    // Shell halves 60 → 30; 50 - 30 = 20 left.
    assert.equal(storeHp, 20);
    assert.equal(result, false, "post-armor HP > 0 must not report death");
    assert.equal(
      died,
      false,
      "processCombatantDeath must not run when Shell Armor saves the boss",
    );
  });

  it("returns true only after post-mitigation lethal HP", () => {
    const result = applyDamageToEnemy({
      hitTarget: enemy({ hp: 10 }),
      isFirstTarget: true,
      deps: stubDeps({
        preCritDmgBM: 10,
        calculatePlayerDamage: () => ({
          finalDamage: 10,
          breakdown: "",
        }),
        processCombatantDeath: () => true,
      }),
    });
    assert.equal(result, true);
  });
});
});
