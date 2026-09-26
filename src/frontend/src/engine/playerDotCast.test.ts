import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  playerDotDamagePerTurn,
  playerDotEarlyReturnApplies,
  playerDotShouldEarlyReturn,
} from "./playerDotCast.ts";

const soulRend = {
  id: "soul_rend",
  name: "Soul Rend",
  effectType: "dot",
  spellType: "damage",
  damage: 25,
  healAmount: 0,
  isPhysical: false,
} as const;

const poisonArrow = {
  id: "starter-poison",
  name: "Poison Arrow",
  effectType: "dot",
  spellType: "damage",
  damage: 0,
  isDotSpell: true,
  dotDamage: 4,
  dotDamagePerTurn: 4,
  dotDuration: 3,
  isPhysical: false,
} as const;

describe("playerDotEarlyReturnApplies", () => {
  it("refuses Soul Rend so damage 25 can still land", () => {
    assert.equal(playerDotDamagePerTurn(soulRend), 0);
    assert.equal(playerDotEarlyReturnApplies(soulRend), false);
    assert.equal(playerDotShouldEarlyReturn(soulRend, true), false);
  });

  it("keeps Poison Arrow on the DoT early return", () => {
    assert.equal(playerDotDamagePerTurn(poisonArrow), 4);
    assert.equal(playerDotEarlyReturnApplies(poisonArrow), true);
    assert.equal(playerDotShouldEarlyReturn(poisonArrow, true), true);
  });

  it("does not apply DoT without an enemy occupant", () => {
    assert.equal(playerDotShouldEarlyReturn(poisonArrow, false), false);
  });
});

/**
 * Same branch order as resolvePlayerCast: real DoT early-return, else the
 * damage loop. Soul Rend must not take the empty-DoT return.
 */
function playerDotOrDamageBranch(
  spell: {
    isDotSpell?: boolean;
    effectType?: string;
    dotDamagePerTurn?: unknown;
    dotDamage?: unknown;
    damage?: unknown;
  },
  hasEnemyTarget: boolean,
): "dot" | "damage" | "none" {
  if (playerDotShouldEarlyReturn(spell, hasEnemyTarget)) return "dot";
  if (Number(spell.damage) > 0) return "damage";
  return "none";
}

describe("player Soul Rend vs Poison Arrow branch", () => {
  it("routes Soul Rend to damage and Poison Arrow to DoT", () => {
    assert.equal(playerDotOrDamageBranch(soulRend, true), "damage");
    assert.equal(playerDotOrDamageBranch(poisonArrow, true), "dot");
  });
});
