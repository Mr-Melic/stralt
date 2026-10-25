import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isChallengeCompleted,
  recordChallengeDamageTaken,
  recordChallengeWalkHazardDamage,
} from "../utils/challengeCompletion.ts";
import { battleWalkHazardDamages } from "./battleSetup.ts";
import {
  applySoakedBattleWalkHazards,
  liveWxRawBattleWalkHazardHit,
  planBattleWalkHazardHit,
  shouldDispatchDeathAfterBattleWalkHazard,
} from "./battleWalkHazardHit.ts";

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

describe("planBattleWalkHazardHit vs live WX raw subtract", () => {
  it("lets Shield Charm soak a 2-extra-tile Thorned walk the way playerTakesDamage does", () => {
    // Sequence: Shield Charm 20, Untouchable, path.length 3 → 10 thorn.
    // Live WX subtracted 10 and recorded 10, so the shield sat unused
    // and the 500 Doka / 1000 XP objective failed even though an enemy
    // kit hit of 10 would have been soaked.
    const damages = battleWalkHazardDamages({
      thornedActive: true,
      pathLength: 3,
      voidRiftActive: false,
      dest: { x: 4, y: 4 },
      riftTile: null,
    });
    assert.equal(damages.thornDmg, 10);

    const raw = liveWxRawBattleWalkHazardHit(50, damages.thornDmg);
    assert.equal(raw.newHp, 40);
    assert.equal(raw.challengeDamage, 10);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planBattleWalkHazardHit({
      incoming: damages.thornDmg,
      hp: 50,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.damageAfterRes, 10);
    assert.equal(soaked.shieldAbsorb, 10);
    assert.equal(soaked.remainingShield, 10);
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.notEqual(raw.challengeDamage, soaked.challengeDamage);
    const total = recordChallengeDamageTaken(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);
  });

  it("lets Shield Charm soak landing on the live Void Rift tile", () => {
    const damages = battleWalkHazardDamages({
      thornedActive: false,
      pathLength: 1,
      voidRiftActive: true,
      dest: { x: 8, y: 3 },
      riftTile: { x: 8, y: 3 },
    });
    assert.equal(damages.riftDmg, 3);

    const raw = liveWxRawBattleWalkHazardHit(80, damages.riftDmg);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(raw.challengeDamage)),
      false,
    );

    const soaked = planBattleWalkHazardHit({
      incoming: damages.riftDmg,
      hp: 80,
      res: 0,
      resModifier: 1,
      shieldHp: 20,
    });
    assert.equal(soaked.hpLost, 0);
    assert.equal(soaked.remainingShield, 17);
    assert.equal(soaked.newHp, 80);
    assert.equal(soaked.challengeDamage, 0);
    const total = recordChallengeDamageTaken(0, soaked.challengeDamage);
    assert.equal(isChallengeCompleted(UNTOUCHABLE, progress(total)), true);
  });

  it("applies RES before the shield, matching playerTakesDamage", () => {
    // 10 thorn, RES 50 → 5 after RES, shield 3 → 2 HP lost.
    const hit = planBattleWalkHazardHit({
      incoming: 10,
      hp: 30,
      res: 50,
      resModifier: 1,
      shieldHp: 3,
    });
    assert.equal(hit.damageAfterRes, 5);
    assert.equal(hit.shieldAbsorb, 3);
    assert.equal(hit.hpLost, 2);
    assert.equal(hit.newHp, 28);
    assert.equal(hit.lethal, false);

    const raw = liveWxRawBattleWalkHazardHit(30, 10);
    assert.equal(raw.newHp, 20);
    assert.equal(raw.challengeDamage, 10);
  });

  it("does not mint a 1 HP hit from a 1-tile Thorned walk", () => {
    const hit = planBattleWalkHazardHit({
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

describe("applySoakedBattleWalkHazards sequential thorn then rift", () => {
  it("lets leftover Shield Charm soak the rift after thorns", () => {
    const soaked = applySoakedBattleWalkHazards(
      { hp: 50, res: 0, resModifier: 1, shieldHp: 20 },
      { thornDmg: 10, riftDmg: 3 },
    );
    assert.equal(soaked.thorn.hpLost, 0);
    assert.equal(soaked.thorn.remainingShield, 10);
    assert.equal(soaked.rift.hpLost, 0);
    assert.equal(soaked.remainingShield, 7);
    assert.equal(soaked.newHp, 50);
    assert.equal(soaked.challengeDamage, 0);
    assert.equal(soaked.lethal, false);

    const rawThorn = liveWxRawBattleWalkHazardHit(50, 10);
    const rawRift = liveWxRawBattleWalkHazardHit(rawThorn.newHp, 3);
    const rawChallenge = recordChallengeWalkHazardDamage(0, {
      thornDmg: 10,
      riftDmg: 3,
    });
    assert.equal(rawRift.newHp, 37);
    assert.equal(rawChallenge, 13);
    assert.equal(
      isChallengeCompleted(UNTOUCHABLE, progress(rawChallenge)),
      false,
    );
  });

  it("marks a lethal Void Rift walk from live HP after soak", () => {
    const soaked = applySoakedBattleWalkHazards(
      { hp: 2, res: 0, resModifier: 1, shieldHp: 0 },
      { thornDmg: 0, riftDmg: 3 },
    );
    assert.equal(soaked.newHp, 0);
    assert.equal(soaked.lethal, true);
    assert.equal(soaked.challengeDamage, 3);
    assert.equal(shouldDispatchDeathAfterBattleWalkHazard(soaked.lethal), true);

    const raw = liveWxRawBattleWalkHazardHit(2, 3);
    assert.equal(raw.newHp, 0);
    assert.equal(
      shouldDispatchDeathAfterBattleWalkHazard(raw.newHp === 0),
      true,
    );
  });

  it("does not dispatch death when Shield Charm soaks a lethal-sized rift", () => {
    const soaked = applySoakedBattleWalkHazards(
      { hp: 2, res: 0, resModifier: 1, shieldHp: 20 },
      { thornDmg: 0, riftDmg: 3 },
    );
    assert.equal(soaked.newHp, 2);
    assert.equal(soaked.lethal, false);
    assert.equal(soaked.challengeDamage, 0);
    assert.equal(
      shouldDispatchDeathAfterBattleWalkHazard(soaked.lethal),
      false,
    );
  });
});

describe("shouldDispatchDeathAfterBattleWalkHazard", () => {
  it("is true only for a lethal soaked packet", () => {
    assert.equal(shouldDispatchDeathAfterBattleWalkHazard(true), true);
    assert.equal(shouldDispatchDeathAfterBattleWalkHazard(false), false);
  });
});
