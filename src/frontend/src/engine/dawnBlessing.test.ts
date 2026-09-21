import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DAWN_BLESSING_AP_BURST,
  DAWN_BLESSING_AP_SMALL,
  DAWN_BLESSING_HEAL,
  dawnBlessingForRoll,
} from "./dawnBlessing.ts";

describe("dawnBlessingForRoll", () => {
  it("roll 0 grants +2 AP and says AP", () => {
    const out = dawnBlessingForRoll(0);
    assert.equal(out.playerApModifier, DAWN_BLESSING_AP_BURST);
    assert.equal(out.damageToPlayer, undefined);
    assert.equal(out.logMessages.length, 1);
    assert.match(out.logMessages[0] ?? "", /\+2 AP/);
    assert.equal(/MP/i.test(out.logMessages[0] ?? ""), false);
  });

  it("roll 1 still returns the unused negative-damage heal (WX hole)", () => {
    const out = dawnBlessingForRoll(1);
    assert.equal(out.damageToPlayer, DAWN_BLESSING_HEAL);
    assert.equal(out.playerApModifier, undefined);
    assert.match(out.logMessages[0] ?? "", /\+10 HP/);
  });

  it("roll 2 grants +1 AP and does not say MP", () => {
    const out = dawnBlessingForRoll(2);
    assert.equal(out.playerApModifier, DAWN_BLESSING_AP_SMALL);
    assert.equal(out.damageToPlayer, undefined);
    assert.equal(out.logMessages.length, 1);
    assert.match(out.logMessages[0] ?? "", /\+1 AP/);
    assert.equal(/MP/i.test(out.logMessages.join("")), false);
  });

  it("every AP-granting roll's log mentions AP and never MP", () => {
    for (const roll of [0, 2] as const) {
      const msg = dawnBlessingForRoll(roll).logMessages.join(" ");
      assert.equal(/AP/.test(msg), true);
      assert.equal(/MP/i.test(msg), false);
    }
  });
});
