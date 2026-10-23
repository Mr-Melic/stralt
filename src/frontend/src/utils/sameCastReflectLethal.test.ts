import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAwardVictory } from "../engine/battleSetup.ts";
import {
  REFLECT_SHIELD_RATIO,
  VOID_MIRROR_REFLECT_RATIO,
  playerHpAfterReflect,
  reflectShieldAmount,
  shouldAwardVictoryAfterSameCastReflect,
  shouldRunReflectPlayerDeath,
  voidMirrorReflectAmount,
} from "./sameCastReflectLethal.ts";

const lastHostileDown = {
  inBattle: true,
  deathTriggered: false,
  battleStartIdsSize: 1,
  hostilesRemaining: 0,
};

describe("voidMirrorReflectAmount / reflectShieldAmount", () => {
  it("matches live floor ratios without changing damage math", () => {
    assert.equal(VOID_MIRROR_REFLECT_RATIO, 0.25);
    assert.equal(REFLECT_SHIELD_RATIO, 0.3);
    assert.equal(voidMirrorReflectAmount(20), 5);
    assert.equal(voidMirrorReflectAmount(1), 0);
    assert.equal(voidMirrorReflectAmount(0), 0);
    assert.equal(voidMirrorReflectAmount(-4), 0);
    assert.equal(reflectShieldAmount(20), 6);
    assert.equal(reflectShieldAmount(3), 0);
    assert.equal(reflectShieldAmount(0), 0);
  });
});

describe("playerHpAfterReflect lethal vs victory", () => {
  it("marks a killing Void Mirror reflect lethal without changing HP math", () => {
    const reflect = voidMirrorReflectAmount(20);
    assert.deepEqual(playerHpAfterReflect(5, reflect), {
      newHp: 0,
      lethal: true,
    });
    assert.deepEqual(playerHpAfterReflect(50, reflect), {
      newHp: 45,
      lethal: false,
    });
    assert.equal(shouldRunReflectPlayerDeath(true), true);
    assert.equal(shouldRunReflectPlayerDeath(false), false);
  });

  it("marks a killing Reflect Shield lethal on the last hostile", () => {
    const reflect = reflectShieldAmount(20);
    assert.deepEqual(playerHpAfterReflect(6, reflect), {
      newHp: 0,
      lethal: true,
    });
    assert.deepEqual(playerHpAfterReflect(7, reflect), {
      newHp: 1,
      lethal: false,
    });
  });

  it("proves live shouldAwardVictory still pays applyRewards after lethal Void Mirror", () => {
    const reflect = voidMirrorReflectAmount(40);
    const { lethal } = playerHpAfterReflect(8, reflect);
    assert.equal(lethal, true);
    // Live: HP-watch has not set deathTriggered yet (reflect setState only).
    assert.equal(shouldAwardVictory(lastHostileDown), true);
    assert.equal(
      shouldAwardVictoryAfterSameCastReflect({
        ...lastHostileDown,
        reflectLethal: true,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictoryAfterSameCastReflect({
        ...lastHostileDown,
        reflectLethal: false,
      }),
      true,
    );
  });

  it("proves live shouldAwardVictory still pays after lethal Reflect Shield", () => {
    const reflect = reflectShieldAmount(50);
    const { lethal } = playerHpAfterReflect(10, reflect);
    assert.equal(lethal, true);
    assert.equal(shouldAwardVictory(lastHostileDown), true);
    assert.equal(
      shouldAwardVictoryAfterSameCastReflect({
        ...lastHostileDown,
        reflectLethal: true,
      }),
      false,
    );
  });

  it("still refuses when deathTriggered is already set", () => {
    assert.equal(
      shouldAwardVictoryAfterSameCastReflect({
        inBattle: true,
        deathTriggered: true,
        reflectLethal: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      false,
    );
  });

  it("does not refuse a non-lethal reflect on the last hostile", () => {
    const reflect = voidMirrorReflectAmount(20);
    const { lethal } = playerHpAfterReflect(40, reflect);
    assert.equal(lethal, false);
    assert.equal(
      shouldAwardVictoryAfterSameCastReflect({
        ...lastHostileDown,
        reflectLethal: lethal,
      }),
      true,
    );
  });
});
