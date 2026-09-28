import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy } from "../types/gameTypes.ts";
import {
  type ApplyDamageToEnemyDeps,
  applyDamageToEnemy,
} from "./castHelpers.ts";
import { shouldApplyChainBounceOnHit } from "./shouldApplyChainBounceOnHit.ts";

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
    spell: { id: "starter-blast", name: "Chain Lightning", bounces: 2 },
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
    enemyHpMap: {},
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

describe("shouldApplyChainBounceOnHit", () => {
  it("fires only for the occupant of the clicked tile", () => {
    assert.equal(
      shouldApplyChainBounceOnHit({
        bounceCount: 2,
        hitId: "rat",
        hitX: 4,
        hitY: 4,
        clickX: 4,
        clickY: 4,
      }),
      true,
    );
    assert.equal(
      shouldApplyChainBounceOnHit({
        bounceCount: 2,
        hitId: "near",
        hitX: 5,
        hitY: 4,
        clickX: 4,
        clickY: 4,
      }),
      false,
    );
  });

  it("skips the player sentinel and spells without hops", () => {
    assert.equal(
      shouldApplyChainBounceOnHit({
        bounceCount: 2,
        hitId: "__player__",
        hitX: 4,
        hitY: 4,
        clickX: 4,
        clickY: 4,
      }),
      false,
    );
    assert.equal(
      shouldApplyChainBounceOnHit({
        bounceCount: 0,
        hitId: "rat",
        hitX: 4,
        hitY: 4,
        clickX: 4,
        clickY: 4,
      }),
      false,
    );
  });
});

describe("applyDamageToEnemy bounce once per cast", () => {
  it("does not retrigger hops on later hitsMultiple occupants", () => {
    const primary = enemy({ id: "a", x: 4, y: 4 });
    const near = enemy({ id: "b", x: 5, y: 4 });
    const far = enemy({ id: "c", x: 6, y: 4 });
    const bounced: string[] = [];
    const deps = stubDeps({
      gridPos: { x: 4, y: 4 },
      enemies: [near, primary, far],
      enemyTakesDamage: (id) => {
        bounced.push(id);
      },
    });
    applyDamageToEnemy({
      hitTarget: near,
      isFirstTarget: true,
      deps,
    });
    applyDamageToEnemy({
      hitTarget: primary,
      isFirstTarget: false,
      deps,
    });
    applyDamageToEnemy({
      hitTarget: far,
      isFirstTarget: false,
      deps,
    });
    assert.deepEqual(
      bounced,
      ["b", "c"],
      "only the clicked primary may hop; later occupants must not stack 50%/25%",
    );
  });
});
