/**
 * Combat action parity: summon kit DoT decide matches applyCast.
 * A decided legal (in-range, affordable, living hostile) Poison / Venom
 * target is executable with advertised dpt; an illegal target cannot
 * execute.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { tickDotStacks } from "./dotStacks.ts";
import {
  canAffordSummonDotCast,
  canExecuteSummonDotCast,
  executeSummonDotCast,
  isSummonDotExecuteSpell,
  shouldDecideSummonDotCast,
  summonDotCastApCost,
  summonDotCastRangeOk,
  summonDotEffectFields,
  summonDotHighlightedTargetIsExecutable,
  summonDotLegacyApplyCastFields,
} from "./summonDotCastExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function hostile(id: string, x: number, y: number, hp = 20) {
  return { id, x, y, hp, side: "enemy" as const };
}

describe("summon kit advertised DoT vs applyCast execute", () => {
  it("treats Poison Arrow and Venom Strike as DoT execute spells", () => {
    assert.equal(isSummonDotExecuteSpell(mustSpell("starter-poison")), true);
    assert.equal(
      isSummonDotExecuteSpell(mustSpell("spell-venom-strike")),
      true,
    );
    assert.equal(
      isSummonDotExecuteSpell(physicalAttackSpell),
      false,
      "Strike damage must stay on the damage branch",
    );
  });

  it("does not steal Slow, Shield, Blood Mend, or Inferno onto the DoT branch", () => {
    assert.equal(isSummonDotExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(isSummonDotExecuteSpell(mustSpell("starter-shield")), false);
    assert.equal(isSummonDotExecuteSpell(mustSpell("starter-heal")), false);
    assert.equal(
      isSummonDotExecuteSpell(mustSpell("spell-inferno")),
      false,
      "bomber Inferno splash/suicide stays in bomberKamikazeBlast",
    );
  });

  it("executes in-range Poison Arrow with advertised 4 dpt, not a 0-tick row", () => {
    const poison = mustSpell("starter-poison");
    const origin = { x: 4, y: 4 };
    const tile = { x: 6, y: 5 };
    const occupant = hostile("rat-1", 6, 5);
    const args = {
      currentAp: 2,
      origin,
      target: tile,
      spell: poison,
      occupant,
      casterSide: "player" as const,
    };
    assert.equal(Number(poison.range), 4);
    assert.equal(Number(poison.damage), 0);
    assert.equal(poison.isDotSpell, true);
    assert.equal(summonDotCastApCost(poison), 2);
    assert.equal(summonDotCastRangeOk(origin, tile, poison), true);
    assert.equal(canAffordSummonDotCast(2, poison), true);
    const decided = shouldDecideSummonDotCast(args);
    const executable = canExecuteSummonDotCast(args);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonDotHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(executeSummonDotCast(args), {
      type: "dot",
      targetId: "rat-1",
      dotDamagePerTurn: 4,
      duration: 3,
    });
    assert.deepEqual(summonDotEffectFields(poison, "rat-1"), {
      type: "dot",
      targetId: "rat-1",
      dotDamagePerTurn: 4,
      duration: 3,
    });
    assert.deepEqual(
      summonDotLegacyApplyCastFields(poison, "rat-1"),
      { type: "dot", targetId: "rat-1", duration: 3 },
      "live applyCast copies duration but omits dotDamagePerTurn",
    );
  });

  it("ticks advertised Poison and ignores the live applyCast payload", () => {
    const poison = mustSpell("starter-poison");
    const advertised = summonDotEffectFields(poison, "rat-1");
    assert.ok(advertised);
    const advertisedTick = tickDotStacks(
      [
        {
          id: "adv",
          effectName: "Poison Arrow DoT",
          type: advertised.type,
          targetId: advertised.targetId,
          duration: advertised.duration,
          iconEmoji: "☠️",
          description: "4 dmg/turn",
          dotDamagePerTurn: advertised.dotDamagePerTurn,
        },
      ],
      "rat-1",
    );
    assert.equal(advertisedTick.damage, 4);
    assert.equal(advertisedTick.stackCount, 1);

    const legacy = summonDotLegacyApplyCastFields(poison, "rat-1");
    const legacyTick = tickDotStacks(
      [
        {
          id: "legacy",
          effectName: "Poison Arrow",
          type: legacy.type,
          targetId: legacy.targetId,
          duration: legacy.duration,
          iconEmoji: "✨",
          description: "",
        },
      ],
      "rat-1",
    );
    assert.equal(
      legacyTick.damage,
      0,
      "applyCast rows without dpt never enter tickDotStacks",
    );
    assert.equal(legacyTick.stackCount, 0);
  });

  it("cannot execute Poison Arrow beyond Chebyshev 4", () => {
    const poison = mustSpell("starter-poison");
    const origin = { x: 2, y: 2 };
    const tooFar = { x: 7, y: 2 };
    const occupant = hostile("rat-1", 7, 2);
    assert.equal(summonDotCastRangeOk(origin, tooFar, poison), false);
    const decided = shouldDecideSummonDotCast({
      currentAp: 2,
      origin,
      target: tooFar,
      spell: poison,
      occupant,
      casterSide: "player",
    });
    const executable = canExecuteSummonDotCast({
      currentAp: 2,
      origin,
      target: tooFar,
      spell: poison,
      occupant,
      casterSide: "player",
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      executeSummonDotCast({
        currentAp: 2,
        origin,
        target: tooFar,
        spell: poison,
        occupant,
        casterSide: "player",
      }),
      null,
    );
    assert.equal(
      summonDotHighlightedTargetIsExecutable({ decided, executable }),
      false,
    );
  });

  it("cannot execute Poison on a corpse, ally, empty tile, or short AP", () => {
    const poison = mustSpell("starter-poison");
    const origin = { x: 4, y: 4 };
    const tile = { x: 5, y: 4 };
    const base = {
      origin,
      target: tile,
      spell: poison,
      casterSide: "player" as const,
    };
    assert.equal(summonDotCastRangeOk(origin, tile, poison), true);
    assert.equal(
      canExecuteSummonDotCast({
        ...base,
        currentAp: 2,
        occupant: hostile("dead", 5, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDotCast({
        ...base,
        currentAp: 2,
        occupant: { id: "wolf", x: 5, y: 4, hp: 10, side: "player" },
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDotCast({
        ...base,
        currentAp: 2,
        occupant: null,
      }),
      false,
    );
    assert.equal(canAffordSummonDotCast(1, poison), false);
    assert.equal(
      canExecuteSummonDotCast({
        ...base,
        currentAp: 1,
        occupant: hostile("rat-1", 5, 4),
      }),
      false,
    );
  });

  it("executes Venom at 3 AP in Chebyshev 2 and refuses 2 AP / Chebyshev 3", () => {
    const venom = mustSpell("spell-venom-strike");
    const origin = { x: 3, y: 3 };
    const inRange = { x: 5, y: 3 };
    const occupant = hostile("pawn-1", 5, 3);
    assert.equal(summonDotCastApCost(venom), 3);
    assert.equal(Number(venom.range), 2);
    assert.equal(
      canExecuteSummonDotCast({
        currentAp: 3,
        origin,
        target: inRange,
        spell: venom,
        occupant,
        casterSide: "player",
      }),
      true,
    );
    assert.deepEqual(
      executeSummonDotCast({
        currentAp: 3,
        origin,
        target: inRange,
        spell: venom,
        occupant,
        casterSide: "player",
      }),
      {
        type: "dot",
        targetId: "pawn-1",
        dotDamagePerTurn: 4,
        duration: 3,
      },
    );
    assert.equal(
      canExecuteSummonDotCast({
        currentAp: 2,
        origin,
        target: inRange,
        spell: venom,
        occupant,
        casterSide: "player",
      }),
      false,
      "wolf maxAp 2 cannot spend Venom 3 — decide must not pick it",
    );
    assert.equal(
      canExecuteSummonDotCast({
        currentAp: 3,
        origin,
        target: { x: 6, y: 3 },
        spell: venom,
        occupant: hostile("pawn-1", 6, 3),
        casterSide: "player",
      }),
      false,
    );
  });

  it("still executes a wall-blocked in-range Poison (applyCast skips LoS)", () => {
    const poison = mustSpell("starter-poison");
    const origin = { x: 2, y: 2 };
    const throughWall = { x: 5, y: 2 };
    assert.equal(
      canExecuteSummonDotCast({
        currentAp: 2,
        origin,
        target: throughWall,
        spell: poison,
        occupant: hostile("rat-1", 5, 2),
        casterSide: "player",
      }),
      true,
      "applyCast has no LoS re-check; do not merge player !!lineOfSight",
    );
  });

  it("cannot execute Strike or Slow as a summon DoT even when in range", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 5, y: 4 };
    const occupant = hostile("rat-1", 5, 4);
    assert.equal(
      canExecuteSummonDotCast({
        currentAp: 4,
        origin,
        target: dest,
        spell: physicalAttackSpell,
        occupant,
        casterSide: "player",
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDotCast({
        currentAp: 4,
        origin,
        target: dest,
        spell: mustSpell("spell-slow"),
        occupant,
        casterSide: "player",
      }),
      false,
    );
    assert.equal(
      summonDotHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });
});
