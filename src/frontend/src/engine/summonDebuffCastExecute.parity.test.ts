/**
 * Combat action parity: summon kit Slow decide matches applyCast.
 * A decided legal advertised Slow is executable with advertised MP;
 * an illegal target cannot execute; live applyEffect writes no MP row.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PLAYER_BASE_MP, SUMMON_AP } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { getStatModifier } from "./statusEffects.ts";
import {
  canAffordSummonDebuffCast,
  canExecuteSummonDebuffCast,
  executeSummonDebuffCast,
  isSummonDebuffExecuteSpell,
  shouldDecideSummonDebuffCast,
  summonDebuffApplyCastKinds,
  summonDebuffApplyCell,
  summonDebuffCastApCost,
  summonDebuffCastRangeOk,
  summonDebuffEffectFields,
  summonDebuffHighlightedTargetIsExecutable,
  summonDebuffLegacyApplyCastFields,
} from "./summonDebuffCastExecute.ts";
import { enemyCastRangeOk } from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function archerKitIds(src: string): string[] {
  const match = src.match(/archer:\s*\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/);
  return match ? [match[1], match[2]] : [];
}

function hostile(id: string, x: number, y: number, hp = 20) {
  return { id, x, y, hp, side: "enemy" as const };
}

function playerAt(x: number, y: number, hp = 80) {
  return { id: "player", x, y, hp, side: "player" as const };
}

describe("summon kit advertised Slow vs applyCast", () => {
  it("treats catalog Slow as a 0-damage MP debuff execute spell", () => {
    const slow = mustSpell("spell-slow");
    assert.equal(slow.spellType, "damage");
    assert.equal(Number(slow.damage), 0);
    assert.equal(Number(slow.healAmount ?? 0), 0);
    assert.equal(slow.debuffStat, "mp");
    assert.equal(Number(slow.debuffModifier), -2);
    assert.equal(Number(slow.debuffDuration), 2);
    assert.equal(Number(slow.range), 3);
    assert.equal(Number(slow.apCost), 2);
    assert.equal(slow.targetType, "enemy");
    assert.equal(isSummonDebuffExecuteSpell(slow), true);
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("spell-weaken")),
      true,
      "same 0-damage enemy-debuff shape; not in the archer kit",
    );
  });

  it("archer kit second id is Slow", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(archerKitIds(src), ["starter-poison", "spell-slow"]);
    assert.equal(SUMMON_AP.archer, 2);
  });

  it("does not steal Strike, Shield, Rallying Cry, Blood Mend, Poison, or Inferno", () => {
    assert.equal(isSummonDebuffExecuteSpell(physicalAttackSpell), false);
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("starter-shield")),
      false,
      "#865 owns buff-only Shield RES",
    );
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("spell-iron-skin")),
      false,
    );
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("spell-rallying-cry")),
      false,
      "#862 owns heal+buff Rallying Cry CHC",
    );
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("starter-heal")),
      false,
      "#862 owns Blood Mend heal+buff",
    );
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("starter-poison")),
      false,
      "#856 owns Poison ticks",
    );
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("spell-inferno")),
      false,
      "#799 owns bomber Inferno",
    );
    assert.equal(
      isSummonDebuffExecuteSpell(mustSpell("starter-frost")),
      false,
      "Frost Bolt keeps the damage+debuff loop",
    );
    assert.equal(isSummonDebuffExecuteSpell(mustSpell("spell-swap")), false);
    assert.equal(isSummonDebuffExecuteSpell(mustSpell("spell-mark")), false);
    assert.equal(isSummonDebuffExecuteSpell(mustSpell("spell-mirror")), false);
  });

  it("live applyCast kinds effect Slow but miss advertised MP", () => {
    const slow = mustSpell("spell-slow");
    assert.deepEqual(summonDebuffApplyCastKinds(slow, true), ["effect"]);
    assert.deepEqual(summonDebuffApplyCastKinds(slow, false), ["effect"]);
    assert.equal(
      summonDebuffApplyCastKinds(slow, true).includes("heal"),
      false,
      "0 healAmount never takes the #862 heal return",
    );
    assert.deepEqual(summonDebuffLegacyApplyCastFields(slow), {
      type: "debuff",
      duration: 2,
    });
    assert.equal(
      "stat" in summonDebuffLegacyApplyCastFields(slow),
      false,
      "live applyEffect omits debuffStat",
    );
    assert.deepEqual(
      summonDebuffApplyCastKinds(mustSpell("starter-heal"), true),
      ["heal"],
    );
    assert.deepEqual(summonDebuffApplyCastKinds(physicalAttackSpell, true), [
      "damage",
    ]);
  });

  it("executes Slow on the hostile tile, not the archer", () => {
    const slow = mustSpell("spell-slow");
    const origin = { x: 4, y: 4 };
    const ratCell = { x: 6, y: 5 };
    const occupant = hostile("rat-1", 6, 5);
    assert.equal(
      enemyCastRangeOk(origin, ratCell, slow),
      true,
      "Chebyshev 2 <= Slow range 3",
    );
    assert.deepEqual(summonDebuffApplyCell(ratCell), ratCell);
    const decided = shouldDecideSummonDebuffCast({
      currentAp: 2,
      spell: slow,
      origin,
      targetCell: ratCell,
      occupant,
      casterSide: "player",
    });
    const executable = canExecuteSummonDebuffCast({
      currentAp: 2,
      spell: slow,
      origin,
      targetCell: ratCell,
      occupant,
      casterSide: "player",
    });
    assert.equal(summonDebuffCastRangeOk(origin, ratCell, slow), true);
    assert.equal(summonDebuffCastApCost(slow), 2);
    assert.equal(canAffordSummonDebuffCast(2, slow), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonDebuffHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeSummonDebuffCast({
        currentAp: 2,
        spell: slow,
        origin,
        targetCell: ratCell,
        occupant,
        casterSide: "player",
      }),
      {
        targetId: "rat-1",
        tile: { x: 6, y: 5 },
        debuff: { stat: "mp", modifier: -2, duration: 2 },
      },
    );
    assert.deepEqual(summonDebuffEffectFields(slow), {
      stat: "mp",
      modifier: -2,
      duration: 2,
    });
  });

  it("applies advertised MP through getStatModifier; live applyEffect cannot", () => {
    const slow = mustSpell("spell-slow");
    const advertised = executeSummonDebuffCast({
      currentAp: 2,
      spell: slow,
      origin: { x: 2, y: 2 },
      targetCell: { x: 4, y: 2 },
      occupant: playerAt(4, 2),
      casterSide: "enemy",
    });
    assert.ok(advertised);
    assert.equal(advertised.targetId, "player");
    assert.equal(
      getStatModifier("player", "mp", [
        {
          targetId: "player",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      -2,
    );
    assert.equal(
      PLAYER_BASE_MP +
        getStatModifier("player", "mp", [
          {
            targetId: "player",
            type: "debuff",
            stat: advertised.debuff.stat,
            modifier: advertised.debuff.modifier,
          },
        ]),
      2,
      "player restore would be 4 + (−2)",
    );
    const legacy = summonDebuffLegacyApplyCastFields(slow);
    assert.equal(
      getStatModifier("player", "mp", [
        {
          targetId: "player",
          type: legacy.type,
          duration: legacy.duration,
        },
      ]),
      0,
      "applyEffect without debuffStat is a no-op MP write",
    );
    assert.equal(
      PLAYER_BASE_MP +
        getStatModifier("player", "mp", [
          {
            targetId: "player",
            type: legacy.type,
            duration: legacy.duration,
          },
        ]),
      4,
      "live restore stays at the 4-MP floor",
    );
  });

  it("hostile Slow still executes when getEnemyById cannot resolve the player", () => {
    const slow = mustSpell("spell-slow");
    const origin = { x: 3, y: 3 };
    const playerCell = { x: 5, y: 3 };
    assert.deepEqual(
      executeSummonDebuffCast({
        currentAp: SUMMON_AP.archer,
        spell: slow,
        origin,
        targetCell: playerCell,
        occupant: playerAt(5, 3),
        casterSide: "enemy",
      }),
      {
        targetId: "player",
        tile: { x: 5, y: 3 },
        debuff: { stat: "mp", modifier: -2, duration: 2 },
      },
      "WX getEnemyById reads enemiesRef only; Slow must not require it",
    );
  });

  it("cannot execute Slow out of range or at 1 AP", () => {
    const slow = mustSpell("spell-slow");
    const origin = { x: 4, y: 4 };
    const occupant = hostile("rat-1", 8, 4);
    assert.equal(
      canExecuteSummonDebuffCast({
        currentAp: 2,
        spell: slow,
        origin,
        targetCell: { x: 8, y: 4 },
        occupant,
        casterSide: "player",
      }),
      false,
      "Chebyshev 4 > Slow range 3",
    );
    assert.equal(
      canExecuteSummonDebuffCast({
        currentAp: 1,
        spell: slow,
        origin,
        targetCell: { x: 5, y: 4 },
        occupant: hostile("rat-1", 5, 4),
        casterSide: "player",
      }),
      false,
    );
    assert.equal(canAffordSummonDebuffCast(SUMMON_AP.archer, slow), true);
    assert.equal(
      executeSummonDebuffCast({
        currentAp: 1,
        spell: slow,
        origin,
        targetCell: { x: 5, y: 4 },
        occupant: hostile("rat-1", 5, 4),
        casterSide: "player",
      }),
      null,
    );
  });

  it("cannot execute Slow on a corpse, ally, empty tile, or short AP", () => {
    const slow = mustSpell("spell-slow");
    const origin = { x: 4, y: 4 };
    const tile = { x: 5, y: 4 };
    const base = {
      origin,
      targetCell: tile,
      spell: slow,
      casterSide: "player" as const,
    };
    assert.equal(summonDebuffCastRangeOk(origin, tile, slow), true);
    assert.equal(
      canExecuteSummonDebuffCast({
        ...base,
        currentAp: 2,
        occupant: hostile("dead", 5, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDebuffCast({
        ...base,
        currentAp: 2,
        occupant: { id: "wolf", x: 5, y: 4, hp: 10, side: "player" },
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDebuffCast({
        ...base,
        currentAp: 2,
        occupant: null,
      }),
      false,
    );
    assert.equal(canAffordSummonDebuffCast(1, slow), false);
  });

  it("still executes a wall-blocked in-range Slow (applyCast skips LoS)", () => {
    const slow = mustSpell("spell-slow");
    const origin = { x: 2, y: 2 };
    const throughWall = { x: 5, y: 2 };
    assert.equal(
      canExecuteSummonDebuffCast({
        currentAp: 2,
        origin,
        targetCell: throughWall,
        spell: slow,
        occupant: hostile("rat-1", 5, 2),
        casterSide: "player",
      }),
      true,
      "applyCast has no LoS re-check; do not merge player !!lineOfSight",
    );
  });

  it("cannot execute Strike, Shield, Poison, or Rallying Cry as a kit Slow", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 5, y: 4 };
    const occupant = hostile("rat-1", 5, 4);
    const blocked = {
      currentAp: 4,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "player" as const,
    };
    assert.equal(
      canExecuteSummonDebuffCast({
        ...blocked,
        spell: physicalAttackSpell,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDebuffCast({
        ...blocked,
        spell: mustSpell("starter-shield"),
      }),
      false,
    );
    assert.equal(
      canExecuteSummonDebuffCast({
        ...blocked,
        spell: mustSpell("starter-poison"),
      }),
      false,
    );
    assert.equal(
      executeSummonDebuffCast({
        ...blocked,
        spell: mustSpell("spell-rallying-cry"),
      }),
      null,
    );
    assert.equal(
      summonDebuffHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });
});
