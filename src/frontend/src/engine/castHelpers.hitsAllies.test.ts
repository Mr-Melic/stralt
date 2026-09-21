import assert from "node:assert/strict";
import { describe, it } from "node:test";
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

describe("applyDamageToEnemy hitsAllies → challenge damage", () => {
  it("records the self-AoE HP loss so Untouchable cannot persist after a last-hostile kill", () => {
    let total = 0;
    let playerHp = 50;
    applyDamageToEnemy({
      hitTarget: {
        id: "__player__",
        pieceType: "Hero",
        x: 3,
        y: 4,
        level: 1,
        res: 0,
        sp: 0,
        chc: 0,
        isPlayer: true,
        hp: 50,
        maxHp: 50,
      },
      isFirstTarget: false,
      deps: stubDeps({
        spell: { id: "nova", name: "Frost Nova", hitsAllies: true },
        preCritDmgBM: 12,
        characterStats: { hp: 50 },
        setCharacterStats: (updater) => {
          playerHp = updater({ hp: playerHp } as never).hp;
        },
        onPlayerReflectedDamage: (amount) => {
          total = recordChallengeDamageTaken(total, amount);
        },
      }),
    });
    assert.equal(playerHp, 38);
    assert.equal(total, 12);
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

  it("records only HP actually lost when hitsAllies would overkill", () => {
    let total = 0;
    applyDamageToEnemy({
      hitTarget: {
        id: "__player__",
        pieceType: "Hero",
        x: 3,
        y: 4,
        level: 1,
        res: 0,
        sp: 0,
        chc: 0,
        isPlayer: true,
        hp: 5,
        maxHp: 50,
      },
      isFirstTarget: false,
      deps: stubDeps({
        spell: { id: "nova", name: "Frost Nova", hitsAllies: true },
        preCritDmgBM: 20,
        characterStats: { hp: 5 },
        onPlayerReflectedDamage: (amount) => {
          total = recordChallengeDamageTaken(total, amount);
        },
      }),
    });
    assert.equal(total, 5);
  });
});
