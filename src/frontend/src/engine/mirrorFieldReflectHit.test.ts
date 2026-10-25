import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isChallengeCompleted,
  recordChallengeDamageTaken,
} from "../utils/challengeCompletion.ts";
import {
  liveWxRawMirrorFieldHit,
  planMirrorFieldReflectedHit,
  shouldMirrorFieldReflect,
} from "./mirrorFieldReflectHit.ts";

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

describe("shouldMirrorFieldReflect", () => {
  it("matches the live 20% resolvePlayerCast roll", () => {
    assert.equal(shouldMirrorFieldReflect(19.9), true);
    assert.equal(shouldMirrorFieldReflect(20), false);
    assert.equal(shouldMirrorFieldReflect(0), true);
    assert.equal(shouldMirrorFieldReflect(Number.NaN), false);
  });
});

describe("planMirrorFieldReflectedHit vs live WX raw subtract", () => {
  it("lets Shield Charm soak a melee-range last-enemy Bolt the way playerTakesDamage does", () => {
    // Sequence: Shield Charm 20, Untouchable, last pawn, Fire Bolt 40,
    // Mirror Field 20% reflect. Live WX subtracted 40 and recorded 40,
    // so the shield sat unused and the 500 Doka / 1000 XP objective failed
    // even though the enemy spell path would have soaked the packet.
    const raw = liveWxRawMirrorFieldHit(50, 40);
    assert.equal(raw.newHp, 10);
    assert.equal(raw.challengeDamage, 40);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planMirrorFieldReflectedHit({
      incoming: 40,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.damageAfterRes, 40);
    assert.equal(soaked.shieldAbsorb, 20);
    assert.equal(soaked.remainingShield, 0);
    assert.equal(soaked.hpLost, 20);
    assert.equal(soaked.newHp, 30);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 20);
    assert.notEqual(raw.challengeDamage, soaked.challengeDamage);
  });

  it("keeps Untouchable when Shield Charm absorbs the whole reflect", () => {
    const soaked = planMirrorFieldReflectedHit({
      incoming: 15,
      hp: 80,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.remainingShield, 5);
    assert.equal(soaked.newHp, 80);
    assert.equal(soaked.challengeDamage, 0);
    const total = recordChallengeDamageTaken(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);

    const raw = liveWxRawMirrorFieldHit(80, 15);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );
  });

  it("applies RES before the shield, matching playerTakesDamage", () => {
    // 40 incoming, RES 50 → 20 after RES, shield 10 → 10 HP lost.
    const hit = planMirrorFieldReflectedHit({
      incoming: 40,
      hp: 30,
      res: 50,
      resModifier: 1,
      shieldHp: 10,
    });
    assert.equal(hit.damageAfterRes, 20);
    assert.equal(hit.shieldAbsorb, 10);
    assert.equal(hit.hpLost, 10);
    assert.equal(hit.newHp, 20);
    assert.equal(hit.lethal, false);

    const raw = liveWxRawMirrorFieldHit(30, 40);
    assert.equal(raw.newHp, 0);
    assert.equal(raw.challengeDamage, 40);
  });

  it("marks a lethal reflect from live HP after soak", () => {
    const hit = planMirrorFieldReflectedHit({
      incoming: 40,
      hp: 8,
      res: 0,
      resModifier: 1,
      shieldHp: 0,
    });
    assert.equal(hit.newHp, 0);
    assert.equal(hit.lethal, true);
    assert.equal(hit.challengeDamage, 40);
  });

  it("does not mint a 1 HP Mark reflect from the playerTakesDamage floor", () => {
    const hit = planMirrorFieldReflectedHit({
      incoming: 0,
      hp: 12,
      res: 0,
      resModifier: 1,
      shieldHp: 8,
    });
    assert.equal(hit.hpLost, 0);
    assert.equal(hit.newHp, 12);
    assert.equal(hit.remainingShield, 8);
    assert.equal(hit.challengeDamage, 0);
    assert.equal(hit.lethal, false);
  });
});
