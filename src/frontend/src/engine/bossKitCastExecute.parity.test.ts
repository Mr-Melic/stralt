/**
 * Combat action parity: boss kit buff decide matches execute.
 * A decided legal (in-range) advertised buff is executable; an illegal
 * target cannot execute.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  bossKitBuffEffectFields,
  bossKitBuffLegacyDebuffFallback,
  bossKitHighlightedBuffIsExecutable,
  bossKitInRange,
  canExecuteBossKitBuffCast,
  isBossKitBuffExecuteSpell,
  shouldDecideBossKitBuffCast,
} from "./bossKitCastExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("boss kit advertised buff vs WX execute", () => {
  it("treats Iron Skin / Shield / Haste / Enrage as buff execute spells", () => {
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("spell-iron-skin")), true);
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("starter-shield")), true);
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("spell-haste")), true);
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("spell-enrage")), true);
    assert.equal(
      isBossKitBuffExecuteSpell(physicalAttackSpell),
      false,
      "Strike damage must stay on the damage branch",
    );
  });

  it("does not steal Slow, Blood Mend, or Inferno onto the buff branch", () => {
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("starter-heal")), false);
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("spell-inferno")), false);
    assert.equal(isBossKitBuffExecuteSpell(mustSpell("starter-poison")), false);
  });

  it("executes in-range Iron Skin with advertised RES 1.3, not atk×1", () => {
    const iron = mustSpell("spell-iron-skin");
    const origin = { x: 4, y: 4 };
    const inRange = { x: 6, y: 5 };
    const decided = shouldDecideBossKitBuffCast({
      spell: iron,
      origin,
      targetCell: inRange,
    });
    const executable = canExecuteBossKitBuffCast({
      spell: iron,
      origin,
      targetCell: inRange,
    });
    assert.equal(Number(iron.range), 3);
    assert.equal(Number(iron.damage), 0);
    assert.equal(iron.spellType, "damage");
    assert.equal(bossKitInRange(origin, inRange, iron), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitHighlightedBuffIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(bossKitBuffEffectFields(iron), {
      stat: "res",
      modifier: 1.3,
      duration: 3,
    });
    assert.deepEqual(
      bossKitBuffLegacyDebuffFallback(iron),
      { stat: "atk", modifier: 1, duration: 3 },
      "live WX boss-buff branch reads debuffStat ?? atk",
    );
  });

  it("cannot execute Iron Skin beyond Chebyshev 3", () => {
    const iron = mustSpell("spell-iron-skin");
    const origin = { x: 2, y: 2 };
    const tooFar = { x: 6, y: 2 };
    assert.equal(bossKitInRange(origin, tooFar, iron), false);
    const decided = shouldDecideBossKitBuffCast({
      spell: iron,
      origin,
      targetCell: tooFar,
    });
    const executable = canExecuteBossKitBuffCast({
      spell: iron,
      origin,
      targetCell: tooFar,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      bossKitHighlightedBuffIsExecutable({ decided, executable }),
      false,
    );
  });

  it("executes in-range Shield / Enrage / Haste advertised fields", () => {
    const origin = { x: 3, y: 3 };
    const dest = { x: 5, y: 3 };
    const shield = mustSpell("starter-shield");
    const enrage = mustSpell("spell-enrage");
    const haste = mustSpell("spell-haste");
    assert.equal(
      canExecuteBossKitBuffCast({ spell: shield, origin, targetCell: dest }),
      true,
    );
    assert.deepEqual(bossKitBuffEffectFields(shield), {
      stat: "res",
      modifier: 1.3,
      duration: 3,
    });
    assert.equal(
      canExecuteBossKitBuffCast({ spell: enrage, origin, targetCell: dest }),
      true,
    );
    assert.deepEqual(bossKitBuffEffectFields(enrage), {
      stat: "dmg",
      modifier: 1.4,
      duration: 2,
    });
    assert.equal(
      canExecuteBossKitBuffCast({ spell: haste, origin, targetCell: dest }),
      true,
    );
    assert.deepEqual(bossKitBuffEffectFields(haste), {
      stat: "mp",
      modifier: 2,
      duration: 1,
    });
  });

  it("still executes a wall-blocked in-range Shield (WX skips LoS)", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 2, y: 2 };
    const throughWall = { x: 4, y: 2 };
    assert.equal(
      canExecuteBossKitBuffCast({
        spell: shield,
        origin,
        targetCell: throughWall,
      }),
      true,
      "boss kit inRange is Chebyshev only; do not merge player LoS",
    );
  });

  it("cannot execute Strike or Slow as a kit buff even when in range", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 5, y: 4 };
    assert.equal(
      canExecuteBossKitBuffCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitBuffCast({
        spell: mustSpell("spell-slow"),
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      bossKitHighlightedBuffIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });
});
