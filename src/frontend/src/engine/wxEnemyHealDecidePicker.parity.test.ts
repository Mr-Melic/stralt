/**
 * Combat action parity: pack-enemy `pickBestDamageSpell` selects advertised
 * range-0 heal+CHC when no `damage > 0` kit is in range. A decided legal
 * (caster-tile dest, living hostile overlapping) Blood Mend dest is
 * executable; an illegal dest cannot execute; live `Number(s.damage) > 0`
 * still skips.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyHealDecidePickerCast,
  isWxEnemyHealDecideBlockedBuffSpell,
  isWxEnemyHealDecideBlockedDotSpell,
  isWxEnemyHealDecidePickerSpell,
  pickWxEnemyBestDamageOrHealSpell,
  pickWxEnemyHealDecideSpell,
  shouldDecideWxEnemyHealPickerCast,
  wxEnemyHealDecidePickerInRange,
  wxEnemyHealDecidePickerRange,
  wxEnemyHealDecidePickerRequiresZeroRange,
  wxEnemyHealLivePickBestDamageSpell,
  wxEnemyHealLivePickBestDamageSpellSelects,
  wxEnemyHealPickerHighlightedTargetIsExecutable,
} from "./wxEnemyHealDecidePicker.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

describe("WX enemy pickBestDamageSpell vs advertised range-0 heal+CHC", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const origin = { x: 4, y: 4 };
  const overlap = { x: 4, y: 4 };

  it("treats catalog Blood Mend / Rallying Cry as range-0 heal picker spells", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.damage), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(mend.buffStat, "chc");
    assert.equal(Number(mend.buffModifier), 0.15);
    assert.equal(Number(mend.buffDuration), 2);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(isWxEnemyHealDecidePickerSpell(mend), true);
    assert.equal(wxEnemyHealDecidePickerRange(mend), enemySpellRange(mend));
    assert.equal(wxEnemyHealDecidePickerRequiresZeroRange(mend), true);
    assert.equal(rally.spellType, "heal");
    assert.equal(Number(rally.healAmount), 20);
    assert.equal(rally.buffStat, "chc");
    assert.equal(Number(rally.range), 0);
    assert.equal(isWxEnemyHealDecidePickerSpell(rally), true);
    assert.equal(wxEnemyHealDecidePickerRequiresZeroRange(rally), true);
  });

  it("queen z>=1 kit carries Blood Mend; king carries Rallying Cry", () => {
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.equal(buildEnemyKit("queen", 0).includes("starter-heal"), false);
    assert.equal(buildEnemyKit("king", 1).includes("spell-rallying-cry"), true);
    assert.equal(buildEnemyKit("rook", 1).includes("starter-heal"), false);
    assert.equal(buildEnemyKit("bishop", 1).includes("starter-heal"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealDecidePickerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        buffStat: "chc",
        buffModifier: 0.15,
        buffDuration: 2,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        buffDuration: 2,
        range: 0,
        targetType: "self",
      }),
      false,
      "heal without advertised buffStat is #757, not this picker",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        buffStat: "chc",
        buffDuration: 2,
        range: 3,
        targetType: "ally",
      }),
      true,
      "identity allows ally-range heals; execute still requires range 0",
    );
    assert.equal(
      wxEnemyHealDecidePickerRequiresZeroRange({
        spellType: "heal",
        healAmount: 12,
        buffStat: "chc",
        buffDuration: 2,
        range: 3,
        targetType: "ally",
      }),
      false,
    );
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Poison, Inferno, or Frost", () => {
    assert.equal(isWxEnemyHealDecidePickerSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-venom-strike")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-inferno")),
      false,
      "#947/#967/#972 own Inferno ticks / decide / CD",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("starter-frost")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-expose")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecidePickerSpell(mustSpell("spell-mirror")),
      false,
    );
    assert.equal(
      isWxEnemyHealDecideBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyHealDecideBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
  });

  it("live pickBestDamageSpell still skips Blood Mend / Rallying Cry", () => {
    assert.equal(wxEnemyHealLivePickBestDamageSpellSelects(mend), false);
    assert.equal(wxEnemyHealLivePickBestDamageSpellSelects(rally), false);
    assert.equal(
      wxEnemyHealLivePickBestDamageSpellSelects(physicalAttackSpell),
      true,
    );
    assert.equal(
      wxEnemyHealLivePickBestDamageSpellSelects(mustSpell("starter-frost")),
      true,
    );
    assert.equal(
      wxEnemyHealLivePickBestDamageSpell({
        availableSpells: [mustSpell("starter-frost"), mend],
        origin,
        targetCell: overlap,
      })?.id,
      "starter-frost",
      "Frost at Chebyshev 0 stays the live damage pick",
    );
    assert.equal(
      wxEnemyHealLivePickBestDamageSpell({
        availableSpells: [mend, rally],
        origin,
        targetCell: overlap,
      }),
      null,
    );
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function pickBestDamageSpell");
    assert.ok(start >= 0, "live pickBestDamageSpell is present");
    const body = ai.slice(start, start + 700);
    assert.ok(body.includes("Number(s.damage) > 0"));
    assert.ok(body.includes("enemySpellRange(s) >= dist"));
  });

  it("picks in-range caster-tile Blood Mend when live damage>0 is empty", () => {
    const occupant = playerAt("player", 4, 4);
    const available = [mend];
    assert.equal(wxEnemyHealDecidePickerInRange(origin, overlap, mend), true);
    assert.equal(
      wxEnemyHealLivePickBestDamageSpell({
        availableSpells: available,
        origin,
        targetCell: overlap,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: available,
        origin,
        targetCell: overlap,
      })?.id,
      "starter-heal",
    );
    assert.equal(
      pickWxEnemyBestDamageOrHealSpell({
        availableSpells: available,
        origin,
        targetCell: overlap,
      })?.id,
      "starter-heal",
    );
    const decided = shouldDecideWxEnemyHealPickerCast({
      spell: mend,
      origin,
      targetCell: overlap,
      occupant,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyHealDecidePickerCast({
      spell: mend,
      origin,
      targetCell: overlap,
      occupant,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealPickerHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
  });

  it("picks Rallying Cry at caster dest and refuses Chebyshev 1", () => {
    const adjacent = { x: 5, y: 4 };
    const available = [rally];
    assert.equal(wxEnemyHealDecidePickerInRange(origin, overlap, rally), true);
    assert.equal(
      wxEnemyHealDecidePickerInRange(origin, adjacent, rally),
      false,
    );
    assert.equal(enemyCastRangeOk(origin, adjacent, rally), false);
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: available,
        origin,
        targetCell: overlap,
      })?.id,
      "spell-rallying-cry",
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: available,
        origin,
        targetCell: adjacent,
      }),
      null,
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: rally,
        origin,
        targetCell: adjacent,
        occupant: playerAt("player", 5, 4),
        casterSide: "enemy",
      }),
      false,
    );
  });

  it("does not steal an in-range Frost from the live damage picker", () => {
    const frost = mustSpell("starter-frost");
    assert.equal(wxEnemyHealDecidePickerInRange(origin, overlap, mend), true);
    assert.equal(wxEnemyHealDecidePickerInRange(origin, overlap, frost), true);
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [frost, mend],
        origin,
        targetCell: overlap,
      }),
      null,
      "Frost at Chebyshev 0 stays #762",
    );
    assert.equal(
      pickWxEnemyBestDamageOrHealSpell({
        availableSpells: [frost, mend],
        origin,
        targetCell: overlap,
      })?.id,
      "starter-frost",
    );
  });

  it("does not steal queen Inferno+heal or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [inferno, mend],
        origin,
        targetCell: overlap,
      }),
      null,
      "in-range Inferno stays #967",
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [inferno, mend],
        origin,
        targetCell: { x: 7, y: 4 },
      }),
      null,
      "Chebyshev 3 is Inferno range, not heal range 0",
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [iron, mend],
        origin,
        targetCell: overlap,
      }),
      null,
      "in-range Iron Skin stays #978",
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [mend, rally],
        origin,
        targetCell: overlap,
      })?.id,
      "starter-heal",
      "kit / availableSpells order — do not invent a heal-score",
    );
  });

  it("cannot execute Blood Mend beyond range 0, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 5, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, mend), false);
    assert.equal(wxEnemyHealDecidePickerInRange(origin, tooFar, mend), false);
    const base = {
      spell: mend,
      origin,
      targetCell: overlap,
      casterSide: "enemy" as const,
    };
    assert.equal(wxEnemyHealDecidePickerInRange(origin, overlap, mend), true);
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        ...base,
        occupant: playerAt("player", 4, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        ...base,
        occupant: { id: "queen-2", x: 4, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        ...base,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealPickerHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot decide Strike, Slow, Iron Skin, Drain, or Inferno as a heal+CHC", () => {
    const dest = { x: 4, y: 4 };
    const occupant = playerAt("player", 4, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        ...base,
        spell: physicalAttackSpell,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [mustSpell("spell-slow")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [mustSpell("spell-iron-skin")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [mustSpell("starter-drain")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [mustSpell("spell-inferno")],
        origin,
        targetCell: dest,
      }),
      null,
    );
  });

  it("still decides a caster-tile Blood Mend with a wall neighbor (picker skips LoS)", () => {
    assert.equal(
      pickWxEnemyHealDecideSpell({
        availableSpells: [mend],
        origin,
        targetCell: overlap,
      })?.id,
      "starter-heal",
    );
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mend,
        origin,
        targetCell: overlap,
        occupant: playerAt("player", 4, 4),
        casterSide: "enemy",
      }),
      true,
      "catalog Blood Mend has no lineOfSight; live pickBestDamageSpell is Chebyshev only",
    );
  });

  it("does not debit AP on pack-enemy heal decide (WX never spends enemy AP)", () => {
    assert.equal(Number(mend.apCost), 3);
    assert.equal(Number(rally.apCost), 4);
    assert.equal(
      canExecuteWxEnemyHealDecidePickerCast({
        spell: mend,
        origin,
        targetCell: overlap,
        occupant: playerAt("player", 4, 4),
        casterSide: "enemy",
      }),
      true,
      "do not merge summon applyCast AP (#862) onto pack WX decide",
    );
  });
});
