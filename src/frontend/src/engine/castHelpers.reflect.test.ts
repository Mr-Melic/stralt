import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy } from "../types/gameTypes.ts";
import {
  isChallengeCompleted,
  recordChallengeDamageTaken,
} from "../utils/challengeCompletion.ts";
import {
  type ApplyDamageToEnemyDeps,
  applyDamageToEnemy,
} from "./castHelpers.ts";

const UNTOUCHABLE = {
  id: "legendary_1",
  tier: "legendary" as const,
  description: "Win without taking any damage at all",
  condition: "no_damage_taken" as const,
  rewards: { doka: 500, xp: 1000, badge: "Untouchable" },
};

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

describe("applyDamageToEnemy reflect → challenge damage", () => {
  it("records Void Mirror reflect so Untouchable cannot persist after a spell hit", () => {
    let total = 0;
    const deps = stubDeps({
      preCritDmgBM: 20,
      onPlayerReflectedDamage: (amount) => {
        total = recordChallengeDamageTaken(total, amount);
      },
    });
    applyDamageToEnemy({
      hitTarget: enemy({ family: "void_mirror" }),
      isFirstTarget: true,
      deps,
    });
    assert.equal(total, 5);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, {
        turnCount: 1,
        totalDamage: total,
        healUsed: false,
        directHit: true,
        maxApUsedInTurn: 4,
      }),
      false,
    );
  });

  it("records Reflect Shield so a phase-2 boss hit fails under-damage challenges", () => {
    let total = 0;
    const target = enemy({ id: "boss-1", family: "default" });
    const deps = stubDeps({
      preCritDmgBM: 20,
      turnOrderRef: {
        current: [
          {
            id: "boss-1",
            type: "enemy",
            initiative: 20,
            name: "Boss",
            pieceIcon: "K",
            hp: 200,
            maxHp: 200,
            level: 10,
            isBoss: true,
          },
        ],
      },
      bossStateRef: { current: { reflectShieldActive: true } },
      enemyHpMap: { "boss-1": 200 },
      onPlayerReflectedDamage: (amount) => {
        total = recordChallengeDamageTaken(total, amount);
      },
    });
    applyDamageToEnemy({
      hitTarget: target,
      isFirstTarget: true,
      deps,
    });
    assert.equal(total, 6);
    assert.equal(
      isChallengeCompleted(
        {
          id: "easy_3",
          tier: "easy",
          description: "Take less than 50 damage total",
          condition: "under_50_damage",
          rewards: { doka: 60 },
        },
        {
          turnCount: 1,
          totalDamage: total,
          healUsed: false,
          directHit: true,
          maxApUsedInTurn: 4,
        },
      ),
      true,
    );
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, {
        turnCount: 1,
        totalDamage: total,
        healUsed: false,
        directHit: true,
        maxApUsedInTurn: 4,
      }),
      false,
    );
  });

  it("does not record reflect when the target has no reflect path", () => {
    let total = 0;
    const deps = stubDeps({
      onPlayerReflectedDamage: (amount) => {
        total = recordChallengeDamageTaken(total, amount);
      },
    });
    applyDamageToEnemy({
      hitTarget: enemy(),
      isFirstTarget: true,
      deps,
    });
    assert.equal(total, 0);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, {
        turnCount: 1,
        totalDamage: 0,
        healUsed: false,
        directHit: true,
        maxApUsedInTurn: 4,
      }),
      true,
    );
  });
});
