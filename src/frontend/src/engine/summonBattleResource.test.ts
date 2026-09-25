import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { getStatModifier } from "./statusEffects.ts";
import {
  clearSummonDuration1ResourceCarry,
  consumeSummonDuration1Resource,
  isPlayerSummonCombatant,
  nextSummonTurnBudget,
  recordSummonDuration1Resource,
} from "./summonBattleResource.ts";

afterEach(() => {
  clearSummonDuration1ResourceCarry();
});

describe("isPlayerSummonCombatant", () => {
  it("accepts only player-side summons", () => {
    assert.equal(
      isPlayerSummonCombatant({ isSummon: true, side: "player" }),
      true,
    );
    assert.equal(
      isPlayerSummonCombatant({ isSummon: true, side: "enemy" }),
      false,
    );
    assert.equal(
      isPlayerSummonCombatant({ isSummon: false, side: "player" }),
      false,
    );
    assert.equal(isPlayerSummonCombatant(null), false);
  });
});

describe("nextSummonTurnBudget", () => {
  it("matches the max-only refresh when modifiers are absent", () => {
    assert.deepEqual(nextSummonTurnBudget({ maxAp: 2, maxMp: 3 }), {
      currentAp: 2,
      currentMp: 3,
    });
  });

  it("applies remaining Slow after the turn-start tick (duration 2 → 1)", () => {
    // Enemy Slow lands on the wolf during another unit's turn (duration 2).
    // Wolf turn: tickNonDotEffects leaves duration 1, getStatModifier === -2.
    const remaining = [
      {
        targetId: "summon-wolf",
        type: "debuff" as const,
        stat: "mp",
        modifier: -2,
      },
    ];
    const mpMod = getStatModifier("summon-wolf", "mp", remaining);
    assert.equal(mpMod, -2);
    assert.deepEqual(
      nextSummonTurnBudget({ maxAp: 2, maxMp: 4 }, { ap: 0, mp: mpMod }),
      { currentAp: 2, currentMp: 2 },
    );
  });

  it("floors a Slow'd 2-MP budget at 0", () => {
    assert.deepEqual(nextSummonTurnBudget({ maxAp: 2, maxMp: 2 }, { mp: -2 }), {
      currentAp: 2,
      currentMp: 0,
    });
  });

  it("floors missing max the same way as summonTurnBudget", () => {
    assert.deepEqual(nextSummonTurnBudget({}), { currentAp: 0, currentMp: 0 });
    assert.deepEqual(nextSummonTurnBudget({ maxAp: -1, maxMp: Number.NaN }), {
      currentAp: 0,
      currentMp: 0,
    });
  });
});

describe("duration-1 summon AP/MP carry", () => {
  it("lets ally Haste raise the wolf's MP after the tick expires the row", () => {
    recordSummonDuration1Resource(
      {
        effectName: "Haste Shield",
        targetId: "summon-wolf",
        type: "buff",
        stat: "mp",
        modifier: 2,
        duration: 1,
      },
      true,
    );
    // Tick dropped the row; remaining getStatModifier is 0.
    const remainingMp = getStatModifier("summon-wolf", "mp", []);
    const carry = consumeSummonDuration1Resource("summon-wolf");
    assert.equal(remainingMp, 0);
    assert.deepEqual(carry, { ap: 0, mp: 2 });
    assert.deepEqual(
      nextSummonTurnBudget(
        { maxAp: 2, maxMp: 2 },
        { ap: remainingMp + carry.ap, mp: remainingMp + carry.mp },
      ),
      { currentAp: 2, currentMp: 4 },
    );
    assert.deepEqual(consumeSummonDuration1Resource("summon-wolf"), {
      ap: 0,
      mp: 0,
    });
  });

  it("does not record duration-2 Slow (remaining modifiers own that turn)", () => {
    recordSummonDuration1Resource(
      {
        effectName: "Slow",
        targetId: "summon-wolf",
        type: "debuff",
        stat: "mp",
        modifier: -2,
        duration: 2,
      },
      true,
    );
    assert.deepEqual(consumeSummonDuration1Resource("summon-wolf"), {
      ap: 0,
      mp: 0,
    });
  });

  it("ignores player-pool and enemy-summon targets", () => {
    recordSummonDuration1Resource(
      {
        effectName: "Haste Shield",
        targetId: "player",
        type: "buff",
        stat: "mp",
        modifier: 2,
        duration: 1,
      },
      false,
    );
    recordSummonDuration1Resource(
      {
        effectName: "Haste Shield",
        targetId: "enemy-wolf",
        type: "buff",
        stat: "mp",
        modifier: 2,
        duration: 1,
      },
      false,
    );
    assert.deepEqual(consumeSummonDuration1Resource("player"), {
      ap: 0,
      mp: 0,
    });
    assert.deepEqual(consumeSummonDuration1Resource("enemy-wolf"), {
      ap: 0,
      mp: 0,
    });
  });

  it("replace-or-refresh does not stack the same duration-1 Haste twice", () => {
    const haste = {
      effectName: "Haste Shield",
      targetId: "summon-wolf",
      type: "buff" as const,
      stat: "mp",
      modifier: 2,
      duration: 1,
    };
    recordSummonDuration1Resource(haste, true);
    recordSummonDuration1Resource(haste, true);
    assert.deepEqual(consumeSummonDuration1Resource("summon-wolf"), {
      ap: 0,
      mp: 2,
    });
  });
});
