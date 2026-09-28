/**
 * Combat action parity: enemy heal decide matches WX execute.
 * A decided legal self-heal is executable; a drain or ranged ally heal
 * cannot execute as a heal.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canExecuteEnemyHealCast,
  enemyHealHighlightedTileIsExecutable,
  enemyHealInRange,
  enemyHealRecipientId,
  enemyHealRequiresZeroRange,
  isEnemyHealExecuteSpell,
  shouldDecideEnemyHealCast,
} from "./enemyHealExecute.ts";

function healSelf() {
  return { id: "starter-heal", spellType: "heal" as const, range: 0n };
}

function healAllyRanged() {
  return { id: "ally-mend", spellType: "heal" as const, range: 3n };
}

function drain() {
  return {
    id: "starter-drain",
    spellType: "drain" as const,
    range: 2n,
    healAmount: 5,
  };
}

describe("enemy heal execute gate", () => {
  it("treats only spellType heal as an execute heal", () => {
    assert.equal(isEnemyHealExecuteSpell(healSelf()), true);
    assert.equal(isEnemyHealExecuteSpell(healAllyRanged()), true);
    assert.equal(isEnemyHealExecuteSpell(drain()), false);
    assert.equal(isEnemyHealExecuteSpell({}), false);
    assert.equal(enemyHealRequiresZeroRange(healSelf()), true);
    assert.equal(enemyHealRequiresZeroRange(healAllyRanged()), false);
  });

  it("executes a decided range-0 heal on the caster tile and heals the caster", () => {
    const caster = { x: 4, y: 4 };
    const decided = shouldDecideEnemyHealCast({
      spell: healSelf(),
      caster,
      targetCell: caster,
    });
    const executable = canExecuteEnemyHealCast({
      spell: healSelf(),
      caster,
      targetCell: caster,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      enemyHealHighlightedTileIsExecutable({ decided, executable }),
      true,
    );
    assert.equal(enemyHealRecipientId("enemy-3", "wounded-ally"), "enemy-3");
  });

  it("cannot execute a range-0 heal aimed at a distant ally", () => {
    const caster = { x: 4, y: 4 };
    const ally = { x: 6, y: 4 };
    assert.equal(enemyHealInRange(caster, ally, healSelf()), false);
    const decided = shouldDecideEnemyHealCast({
      spell: healSelf(),
      caster,
      targetCell: ally,
    });
    const executable = canExecuteEnemyHealCast({
      spell: healSelf(),
      caster,
      targetCell: ally,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      enemyHealHighlightedTileIsExecutable({ decided, executable }),
      false,
    );
  });

  it("cannot execute a ranged ally heal or a drain that decideHealer could pick", () => {
    const caster = { x: 2, y: 2 };
    const ally = { x: 3, y: 2 };
    assert.equal(enemyHealInRange(caster, ally, healAllyRanged()), true);
    assert.equal(
      canExecuteEnemyHealCast({
        spell: healAllyRanged(),
        caster,
        targetCell: ally,
      }),
      false,
    );
    assert.equal(
      shouldDecideEnemyHealCast({
        spell: healAllyRanged(),
        caster,
        targetCell: ally,
      }),
      false,
    );
    assert.equal(
      canExecuteEnemyHealCast({
        spell: drain(),
        caster,
        targetCell: ally,
      }),
      false,
      "healAmount-only drain must not enter the WX heal branch",
    );
    assert.equal(
      enemyHealHighlightedTileIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });
});
