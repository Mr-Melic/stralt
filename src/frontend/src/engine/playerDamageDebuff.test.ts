import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyPlayerDamageHitDebuff,
  playerDamageHitAppliesDebuff,
  playerDamageHitDebuffEffect,
} from "./playerDamageDebuff.ts";
import { getStatModifier } from "./statusEffects.ts";

const frostBolt = {
  id: "starter-frost",
  name: "Frost Bolt",
  iconEmoji: "❄️",
  damage: BigInt(20),
  debuffStat: "mp",
  debuffModifier: -1,
  debuffDuration: 1,
};

const frostNova = {
  id: "spell-frost-nova",
  name: "Frost Nova",
  damage: BigInt(15),
  debuffStat: "mp",
  debuffModifier: -1,
  debuffDuration: 1,
};

const cursedWound = {
  id: "spell-cursed-wound",
  name: "Cursed Wound",
  damage: BigInt(22),
  debuffStat: "healRecv",
  debuffModifier: 0.5,
  debuffDuration: 2,
};

const lifeDrain = {
  id: "starter-drain",
  name: "Life Drain",
  damage: BigInt(10),
  debuffStat: "sp",
  debuffModifier: 0.8,
  debuffDuration: 2,
};

const weaken = {
  id: "spell-weaken",
  name: "Weaken",
  damage: BigInt(0),
  debuffStat: "dmg",
  debuffModifier: 0.7,
  debuffDuration: 2,
};

const strike = {
  id: "physical_attack",
  name: "Strike",
  damage: BigInt(10),
};

describe("playerDamageHitAppliesDebuff", () => {
  it("is true for Frost Bolt / Nova / Cursed Wound / Life Drain on a hostile", () => {
    assert.equal(playerDamageHitAppliesDebuff(frostBolt, "e1"), true);
    assert.equal(playerDamageHitAppliesDebuff(frostNova, "e2"), true);
    assert.equal(playerDamageHitAppliesDebuff(cursedWound, "e1"), true);
    assert.equal(playerDamageHitAppliesDebuff(lifeDrain, "e1"), true);
  });

  it("is false for 0-damage Weaken (owned by the debuff-only path)", () => {
    assert.equal(playerDamageHitAppliesDebuff(weaken, "e1"), false);
  });

  it("is false without debuffStat, and never on the player sentinel", () => {
    assert.equal(playerDamageHitAppliesDebuff(strike, "e1"), false);
    assert.equal(playerDamageHitAppliesDebuff(frostBolt, "__player__"), false);
    assert.equal(playerDamageHitAppliesDebuff(frostBolt, "player"), false);
    assert.equal(playerDamageHitAppliesDebuff(frostBolt, undefined), false);
  });
});

describe("playerDamageHitDebuffEffect", () => {
  it("writes Frost Bolt MP −1 for 1 turn onto the hit hostile", () => {
    const effect = playerDamageHitDebuffEffect(frostBolt, "wraith-1");
    assert.ok(effect);
    assert.equal(effect.type, "debuff");
    assert.equal(effect.targetId, "wraith-1");
    assert.equal(effect.stat, "mp");
    assert.equal(effect.modifier, -1);
    assert.equal(effect.duration, 1);
    assert.equal(effect.effectName, "Frost Bolt");
    assert.equal(getStatModifier("wraith-1", "mp", [effect]), -1);
  });

  it("writes Cursed Wound healRecv 0.5 onto the hit hostile", () => {
    const effect = playerDamageHitDebuffEffect(cursedWound, "bishop-1");
    assert.ok(effect);
    assert.equal(effect.stat, "healRecv");
    assert.equal(effect.modifier, 0.5);
    assert.equal(effect.duration, 2);
    assert.equal(getStatModifier("bishop-1", "healRecv", [effect]), 0.5);
  });

  it("returns null for Weaken and for Strike", () => {
    assert.equal(playerDamageHitDebuffEffect(weaken, "e1"), null);
    assert.equal(playerDamageHitDebuffEffect(strike, "e1"), null);
  });

  it("calls applyEffect for Frost Bolt and skips Weaken", () => {
    const applied: Array<{ stat?: string; targetId: string }> = [];
    const apply = (effect: { stat?: string; targetId: string }) => {
      applied.push(effect);
    };
    assert.equal(
      applyPlayerDamageHitDebuff(frostBolt, "wraith-1", apply),
      true,
    );
    assert.equal(applyPlayerDamageHitDebuff(weaken, "wraith-1", apply), false);
    assert.equal(applied.length, 1);
    assert.equal(applied[0]?.stat, "mp");
    assert.equal(applied[0]?.targetId, "wraith-1");
  });
});
