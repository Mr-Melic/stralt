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
import {
  liveApplyDamageToEnemyRawReflectHit,
  planReflectShieldReflectedHit,
  planVoidMirrorReflectedHit,
  reflectShieldReflectPacket,
  voidMirrorReflectPacket,
} from "./voidMirrorReflectHit.ts";

const UNTOUCHABLE = {
  id: "legendary_1",
  tier: "legendary" as const,
  description: "Win without taking any damage at all",
  condition: "no_damage_taken" as const,
  rewards: { doka: 500, xp: 1000, badge: "Untouchable" },
};

function progress(totalDamage: number) {
  return {
    turnCount: 1,
    totalDamage,
    healUsed: false,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 1,
  };
}

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

describe("voidMirrorReflectPacket / reflectShieldReflectPacket", () => {
  it("keeps live applyDamageToEnemy 25% / 30% floors", () => {
    assert.equal(voidMirrorReflectPacket(40), 10);
    assert.equal(voidMirrorReflectPacket(20), 5);
    assert.equal(voidMirrorReflectPacket(3), 0);
    assert.equal(voidMirrorReflectPacket(0), 0);
    assert.equal(voidMirrorReflectPacket(Number.NaN), 0);
    assert.equal(reflectShieldReflectPacket(20), 6);
    assert.equal(reflectShieldReflectPacket(21), 6);
    assert.equal(reflectShieldReflectPacket(0), 0);
  });
});

describe("live applyDamageToEnemy Void Mirror skips soak", () => {
  it("subtracts the raw 25% packet and records it, with no shield/RES args", () => {
    let hp = 50;
    let recorded = 0;
    applyDamageToEnemy({
      hitTarget: enemy({ family: "void_mirror" }),
      isFirstTarget: true,
      deps: stubDeps({
        preCritDmgBM: 20,
        characterStats: { hp: 50 },
        setCharacterStats: (updater) => {
          const next = updater({ hp } as never);
          hp = next.hp;
        },
        onPlayerReflectedDamage: (amount) => {
          recorded = recordChallengeDamageTaken(recorded, amount);
        },
      }),
    });
    assert.equal(hp, 45);
    assert.equal(recorded, 5);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(recorded)), false);
  });
});

describe("planVoidMirrorReflectedHit vs live applyDamageToEnemy raw subtract", () => {
  it("lets Shield Charm soak a family-variant Void Mirror bounce the way playerTakesDamage does", () => {
    // Sequence: Shield Charm 20, Untouchable, last pawn rolled void_mirror,
    // Fire Bolt 20 → floor(20 * 0.25) = 5. Live subtracted 5 and recorded 5
    // with no shieldHp on applyDamageToEnemy, so the 500 Doka / 1000 XP
    // objective failed even though the enemy-spell path would soak it.
    const raw = liveApplyDamageToEnemyRawReflectHit(
      50,
      voidMirrorReflectPacket(20),
    );
    assert.equal(raw.newHp, 45);
    assert.equal(raw.challengeDamage, 5);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planVoidMirrorReflectedHit({
      preCritDmgBM: 20,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.packet, 5);
    assert.equal(soaked.damageAfterRes, 5);
    assert.equal(soaked.shieldAbsorb, 5);
    assert.equal(soaked.remainingShield, 15);
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.notEqual(raw.challengeDamage, soaked.challengeDamage);
  });

  it("keeps Untouchable when Shield Charm absorbs the whole Void Mirror reflect", () => {
    const soaked = planVoidMirrorReflectedHit({
      preCritDmgBM: 20,
      hp: 80,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.remainingShield, 15);
    assert.equal(soaked.newHp, 80);
    assert.equal(soaked.challengeDamage, 0);
    const total = recordChallengeDamageTaken(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);

    const raw = liveApplyDamageToEnemyRawReflectHit(
      80,
      voidMirrorReflectPacket(20),
    );
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );
  });

  it("applies RES before the shield, matching playerTakesDamage", () => {
    // 40 pre-crit → packet 10, RES 50 → 5 after RES, shield 3 → 2 HP lost.
    const hit = planVoidMirrorReflectedHit({
      preCritDmgBM: 40,
      hp: 30,
      res: 50,
      resModifier: 1,
      shieldHp: 3,
    });
    assert.equal(hit.packet, 10);
    assert.equal(hit.damageAfterRes, 5);
    assert.equal(hit.shieldAbsorb, 3);
    assert.equal(hit.hpLost, 2);
    assert.equal(hit.newHp, 28);
    assert.equal(hit.lethal, false);

    const raw = liveApplyDamageToEnemyRawReflectHit(30, 10);
    assert.equal(raw.newHp, 20);
    assert.equal(raw.challengeDamage, 10);
  });

  it("marks a lethal Void Mirror reflect from live HP after soak, and skips RES on the raw path", () => {
    const soaked = planVoidMirrorReflectedHit({
      preCritDmgBM: 40,
      hp: 4,
      res: 50,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(soaked.packet, 10);
    assert.equal(soaked.damageAfterRes, 5);
    assert.equal(soaked.hpLost, 5);
    assert.equal(soaked.newHp, 0);
    assert.equal(soaked.lethal, true);

    const raw = liveApplyDamageToEnemyRawReflectHit(4, 10);
    assert.equal(raw.newHp, 0);
    assert.equal(raw.challengeDamage, 10);

    const survived = planVoidMirrorReflectedHit({
      preCritDmgBM: 40,
      hp: 8,
      res: 50,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(survived.newHp, 3);
    assert.equal(survived.lethal, false);
    const rawLethalSkipRes = liveApplyDamageToEnemyRawReflectHit(8, 10);
    assert.equal(rawLethalSkipRes.newHp, 0);
  });

  it("does not mint a 1 HP Void Mirror reflect from the playerTakesDamage floor", () => {
    const hit = planVoidMirrorReflectedHit({
      preCritDmgBM: 3,
      hp: 12,
      res: 0,
      resModifier: 1,
      shieldHp: 8,
    });
    assert.equal(hit.packet, 0);
    assert.equal(hit.hpLost, 0);
    assert.equal(hit.newHp, 12);
    assert.equal(hit.remainingShield, 8);
    assert.equal(hit.challengeDamage, 0);
    assert.equal(hit.lethal, false);
  });
});

describe("planReflectShieldReflectedHit same soak (applyDamageToEnemy sibling)", () => {
  it("lets Shield Charm soak a 30% Reflect Shield packet", () => {
    const raw = liveApplyDamageToEnemyRawReflectHit(
      50,
      reflectShieldReflectPacket(20),
    );
    assert.equal(raw.newHp, 44);
    assert.equal(raw.challengeDamage, 6);

    const soaked = planReflectShieldReflectedHit({
      finalDmg: 20,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.packet, 6);
    assert.equal(soaked.shieldAbsorb, 6);
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.challengeDamage, 0);
  });
});
