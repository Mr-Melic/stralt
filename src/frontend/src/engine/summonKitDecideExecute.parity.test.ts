/**
 * Combat action parity: summon kit decide matches applyCast.
 * A decided legal target is executable; an illegal target cannot execute.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import {
  canAffordSummonKitCast,
  canExecuteSummonKitCast,
  shouldDecideSummonKitCast,
  summonKitCastApCost,
  summonKitCastRangeOk,
  summonKitHighlightedTargetIsExecutable,
} from "./summonKitDecideExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("summon kit decide vs execute AP+range", () => {
  it("executes an in-range Shield the golem can afford", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 4, y: 4 };
    const ward = { x: 6, y: 5 };
    assert.equal(summonKitCastApCost(shield), 2);
    assert.equal(summonKitCastRangeOk(origin, ward, shield), true);
    assert.equal(canAffordSummonKitCast(2, shield), true);
    const decided = shouldDecideSummonKitCast({
      currentAp: 2,
      origin,
      target: ward,
      spell: shield,
    });
    const executable = canExecuteSummonKitCast({
      currentAp: 2,
      origin,
      target: ward,
      spell: shield,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonKitHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
  });

  it("cannot execute an in-range Shield when AP is short", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 4, y: 4 };
    const ward = { x: 5, y: 4 };
    assert.equal(summonKitCastRangeOk(origin, ward, shield), true);
    assert.equal(canAffordSummonKitCast(1, shield), false);
    const decided = shouldDecideSummonKitCast({
      currentAp: 1,
      origin,
      target: ward,
      spell: shield,
    });
    const executable = canExecuteSummonKitCast({
      currentAp: 1,
      origin,
      target: ward,
      spell: shield,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      summonKitHighlightedTargetIsExecutable({ decided, executable }),
      false,
    );
  });

  it("cannot execute a Shield beyond Chebyshev range 3", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 2, y: 2 };
    const ward = { x: 6, y: 2 };
    assert.equal(summonKitCastRangeOk(origin, ward, shield), false);
    assert.equal(canAffordSummonKitCast(2, shield), true);
    assert.equal(
      canExecuteSummonKitCast({
        currentAp: 2,
        origin,
        target: ward,
        spell: shield,
      }),
      false,
    );
    assert.equal(
      shouldDecideSummonKitCast({
        currentAp: 2,
        origin,
        target: ward,
        spell: shield,
      }),
      false,
    );
  });

  it("executes Iron Skin on the caster tile at 3 AP and refuses 2 AP", () => {
    const iron = mustSpell("spell-iron-skin");
    const origin = { x: 3, y: 3 };
    assert.equal(summonKitCastApCost(iron), 3);
    assert.equal(
      canExecuteSummonKitCast({
        currentAp: 3,
        origin,
        target: origin,
        spell: iron,
      }),
      true,
    );
    assert.equal(
      shouldDecideSummonKitCast({
        currentAp: 3,
        origin,
        target: origin,
        spell: iron,
      }),
      true,
    );
    assert.equal(
      canExecuteSummonKitCast({
        currentAp: 2,
        origin,
        target: origin,
        spell: iron,
      }),
      false,
      "golem maxAp 2 cannot spend Iron Skin 3 — decide must not pick it",
    );
    assert.equal(
      summonKitHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keeps guardian skip-LoS: a wall between golem and ward still executes", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 2, y: 2 };
    const ward = { x: 5, y: 2 };
    assert.equal(
      canExecuteSummonKitCast({
        currentAp: 2,
        origin,
        target: ward,
        spell: shield,
      }),
      true,
      "guardian decide never calls aiCanCast; execute must not add LoS",
    );
  });
});
