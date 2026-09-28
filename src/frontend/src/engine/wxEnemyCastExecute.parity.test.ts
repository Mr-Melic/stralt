/**
 * Combat action parity: WX enemy damage / standalone-debuff execute.
 * A highlighted legal target is executable; an illegal target cannot execute.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  canExecuteWxEnemyDamageCast,
  canExecuteWxEnemyDebuffCast,
  isWxEnemyDamageExecuteSpell,
  isWxEnemyDebuffExecuteSpell,
  shouldDecideWxEnemyDamageCast,
  shouldDecideWxEnemyDebuffCast,
  wxEnemyHighlightedTileIsExecutable,
  wxEnemyInRange,
  wxEnemyPrimaryExecuteBranch,
} from "./wxEnemyCastExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("WX enemy damage execute vs Chebyshev range", () => {
  it("executes an in-range Strike and refuses Chebyshev 2", () => {
    const origin = { x: 4, y: 4 };
    const adjacent = { x: 5, y: 4 };
    const tooFar = { x: 6, y: 4 };
    assert.equal(isWxEnemyDamageExecuteSpell(physicalAttackSpell), true);
    const decided = shouldDecideWxEnemyDamageCast({
      spell: physicalAttackSpell,
      origin,
      targetCell: adjacent,
    });
    const executable = canExecuteWxEnemyDamageCast({
      spell: physicalAttackSpell,
      origin,
      targetCell: adjacent,
    });
    assert.equal(wxEnemyInRange(origin, adjacent, physicalAttackSpell), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHighlightedTileIsExecutable({ decided, executable }),
      true,
    );
    assert.equal(
      wxEnemyPrimaryExecuteBranch({
        spell: physicalAttackSpell,
        origin,
        targetCell: adjacent,
      }),
      "damage",
    );
    assert.equal(
      canExecuteWxEnemyDamageCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: tooFar,
      }),
      false,
    );
    assert.equal(
      wxEnemyPrimaryExecuteBranch({
        spell: physicalAttackSpell,
        origin,
        targetCell: tooFar,
      }),
      "none",
    );
    assert.equal(
      wxEnemyHighlightedTileIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("still executes a wall-blocked Strike inside range (WX skips LoS)", () => {
    const origin = { x: 2, y: 2 };
    const throughWall = { x: 3, y: 2 };
    assert.equal(
      canExecuteWxEnemyDamageCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: throughWall,
      }),
      true,
      "WX inRange is Chebyshev only; do not merge player LoS",
    );
  });
});

describe("WX enemy standalone debuff vs 0-damage Slow", () => {
  it("does not treat Slow as a damage execute", () => {
    const slow = mustSpell("spell-slow");
    assert.equal(Number(slow.damage), 0);
    assert.equal(isWxEnemyDamageExecuteSpell(slow), false);
    assert.equal(isWxEnemyDebuffExecuteSpell(slow), true);
  });

  it("executes in-range Slow as standalone debuff and refuses out of range", () => {
    const slow = mustSpell("spell-slow");
    const origin = { x: 2, y: 2 };
    const inRange = { x: 5, y: 2 };
    const out = { x: 6, y: 2 };
    const decided = shouldDecideWxEnemyDebuffCast({
      spell: slow,
      origin,
      targetCell: inRange,
    });
    const executable = canExecuteWxEnemyDebuffCast({
      spell: slow,
      origin,
      targetCell: inRange,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyPrimaryExecuteBranch({
        spell: slow,
        origin,
        targetCell: inRange,
      }),
      "debuff",
    );
    assert.equal(
      wxEnemyHighlightedTileIsExecutable({ decided, executable }),
      true,
    );
    assert.equal(
      canExecuteWxEnemyDamageCast({
        spell: slow,
        origin,
        targetCell: inRange,
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyDebuffCast({
        spell: slow,
        origin,
        targetCell: out,
      }),
      false,
    );
    assert.equal(
      wxEnemyPrimaryExecuteBranch({
        spell: slow,
        origin,
        targetCell: out,
      }),
      "none",
    );
  });

  it("keeps Weaken on the debuff branch and does not steal a range-0 heal", () => {
    const weaken = mustSpell("spell-weaken");
    const origin = { x: 1, y: 1 };
    const target = { x: 3, y: 2 };
    assert.equal(isWxEnemyDamageExecuteSpell(weaken), false);
    assert.equal(
      canExecuteWxEnemyDebuffCast({
        spell: weaken,
        origin,
        targetCell: target,
      }),
      true,
    );
    assert.equal(
      wxEnemyPrimaryExecuteBranch({
        spell: {
          spellType: "heal",
          range: 0n,
          damage: 0n,
          debuffStat: "mp",
          debuffDuration: 2,
        },
        origin,
        targetCell: origin,
      }),
      "none",
      "heal execute is #757; Slow must not steal the self-heal branch",
    );
  });
});
