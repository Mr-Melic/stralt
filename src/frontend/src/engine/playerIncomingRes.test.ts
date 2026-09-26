import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  effectiveResistancePercent,
  incomingDamageAfterResistance,
} from "./playerIncomingRes.ts";
import type { StatModifiableEffect } from "./statusEffects.ts";

const shield: StatModifiableEffect = {
  targetId: "player",
  type: "buff",
  stat: "res",
  modifier: 1.3,
};

describe("effectiveResistancePercent", () => {
  it("returns the raw persisted RES when no Shield row is present", () => {
    assert.equal(effectiveResistancePercent(10, "player", []), 10);
  });

  it("multiplies starter Shield (+30% RES) onto the player", () => {
    assert.equal(effectiveResistancePercent(10, "player", [shield]), 13);
  });

  it("ignores a Shield on another combatant", () => {
    assert.equal(
      effectiveResistancePercent(10, "player", [
        { ...shield, targetId: "wolf-1" },
      ]),
      10,
    );
  });

  it("treats non-finite base RES as 0", () => {
    assert.equal(effectiveResistancePercent(Number.NaN, "player", [shield]), 0);
  });
});

describe("incomingDamageAfterResistance", () => {
  it("reduces fallback Crush 12 through Shield when base RES is 10", () => {
    const raw = 12;
    const unbuffed = incomingDamageAfterResistance(
      raw,
      effectiveResistancePercent(10, "player", []),
    );
    const shielded = incomingDamageAfterResistance(
      raw,
      effectiveResistancePercent(10, "player", [shield]),
    );
    assert.equal(unbuffed, 11);
    assert.equal(shielded, 10);
    assert.ok(shielded < unbuffed);
  });
});
