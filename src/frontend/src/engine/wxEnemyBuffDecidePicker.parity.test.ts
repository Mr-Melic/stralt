/**
 * Combat action parity: pack-enemy `pickBestDamageSpell` selects advertised
 * 0-damage buffs when no `damage > 0` kit is in range. A decided legal
 * (in-range, living hostile) Iron Skin dest is executable; an illegal
 * dest cannot execute; live `Number(s.damage) > 0` still skips.
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
  canExecuteWxEnemyBuffDecidePickerCast,
  isWxEnemyBuffDecidePickerSpell,
  pickWxEnemyBestDamageOrBuffSpell,
  pickWxEnemyBuffDecideSpell,
  shouldDecideWxEnemyBuffPickerCast,
  wxEnemyBuffDecidePickerInRange,
  wxEnemyBuffDecidePickerRange,
  wxEnemyBuffLivePickBestDamageSpell,
  wxEnemyBuffLivePickBestDamageSpellSelects,
  wxEnemyBuffPickerHighlightedTargetIsExecutable,
} from "./wxEnemyBuffDecidePicker.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

describe("WX enemy pickBestDamageSpell vs advertised 0-damage buff", () => {
  const iron = mustSpell("spell-iron-skin");
  const shield = mustSpell("starter-shield");
  const haste = mustSpell("spell-haste");
  const enrage = mustSpell("spell-enrage");
  const origin = { x: 4, y: 4 };

  it("treats catalog Iron Skin as a 0-damage buff picker spell", () => {
    assert.equal(iron.spellType, "damage");
    assert.equal(Number(iron.damage), 0);
    assert.equal(Number(iron.healAmount ?? 0), 0);
    assert.equal(iron.buffStat, "res");
    assert.equal(Number(iron.buffModifier), 1.3);
    assert.equal(Number(iron.buffDuration), 3);
    assert.equal(Number(iron.range), 3);
    assert.equal(iron.targetType, "ally");
    assert.equal(isWxEnemyBuffDecidePickerSpell(iron), true);
    assert.equal(wxEnemyBuffDecidePickerRange(iron), enemySpellRange(iron));
    assert.equal(isWxEnemyBuffDecidePickerSpell(shield), true);
    assert.equal(isWxEnemyBuffDecidePickerSpell(haste), true);
    assert.equal(isWxEnemyBuffDecidePickerSpell(enrage), true);
  });

  it("rook z>=1 kit carries Iron Skin next to Strike", () => {
    assert.deepEqual(buildEnemyKit("rook", 1), [
      "physical_attack",
      "spell-iron-skin",
    ]);
    assert.equal(buildEnemyKit("rook", 0).includes("spell-iron-skin"), false);
    assert.equal(buildEnemyKit("pawn", 1).includes("spell-iron-skin"), false);
    assert.equal(buildEnemyKit("queen", 2).includes("spell-iron-skin"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyBuffDecidePickerSpell({
        spellType: "damage",
        damage: 0,
        effectType: "buff",
        buffStat: "res",
        buffModifier: 1.2,
        buffDuration: 2,
        range: 3,
        targetType: "ally",
      }),
      true,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell({
        spellType: "damage",
        damage: 0,
        effectType: "buff",
        buffDuration: 3,
        range: 3,
        targetType: "ally",
      }),
      false,
      "buff flag without advertised buffStat is not this picker",
    );
  });

  it("does not steal Strike, Slow, Blood Mend, Drain, Poison, Inferno, or Frost", () => {
    assert.equal(isWxEnemyBuffDecidePickerSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("starter-heal")),
      false,
      "#757/#924 own range-0 heal+CHC",
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-rallying-cry")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-venom-strike")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-inferno")),
      false,
      "#947/#799/#972 own Inferno ticks / bomber splash / CD",
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("starter-frost")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-expose")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-mirror")),
      false,
    );
    assert.equal(
      isWxEnemyBuffDecidePickerSpell(mustSpell("spell-swap")),
      false,
    );
  });

  it("live pickBestDamageSpell still skips Iron Skin / Shield / Haste / Enrage", () => {
    assert.equal(wxEnemyBuffLivePickBestDamageSpellSelects(iron), false);
    assert.equal(wxEnemyBuffLivePickBestDamageSpellSelects(shield), false);
    assert.equal(wxEnemyBuffLivePickBestDamageSpellSelects(haste), false);
    assert.equal(wxEnemyBuffLivePickBestDamageSpellSelects(enrage), false);
    assert.equal(
      wxEnemyBuffLivePickBestDamageSpellSelects(physicalAttackSpell),
      true,
    );
    assert.equal(
      wxEnemyBuffLivePickBestDamageSpellSelects(mustSpell("starter-frost")),
      true,
    );
    const dest = { x: 6, y: 4 };
    assert.equal(
      wxEnemyBuffLivePickBestDamageSpell({
        availableSpells: [physicalAttackSpell, iron],
        origin,
        targetCell: dest,
      }),
      null,
      "Strike Chebyshev 2 is out of Number(range) 1; Iron Skin damage is 0",
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

  it("picks in-range rook Iron Skin when live damage>0 is empty", () => {
    const dest = { x: 6, y: 4 };
    const occupant = playerAt("player", 6, 4);
    const available = [physicalAttackSpell, iron];
    assert.equal(wxEnemyBuffDecidePickerInRange(origin, dest, iron), true);
    assert.equal(
      wxEnemyBuffDecidePickerInRange(origin, dest, physicalAttackSpell),
      false,
    );
    assert.equal(
      wxEnemyBuffLivePickBestDamageSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      })?.id,
      "spell-iron-skin",
    );
    assert.equal(
      pickWxEnemyBestDamageOrBuffSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      })?.id,
      "spell-iron-skin",
    );
    const decided = shouldDecideWxEnemyBuffPickerCast({
      spell: iron,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyBuffDecidePickerCast({
      spell: iron,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyBuffPickerHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
  });

  it("picks Iron Skin at Chebyshev 3 and refuses Chebyshev 4", () => {
    const atThree = { x: 7, y: 4 };
    const atFour = { x: 8, y: 4 };
    const available = [physicalAttackSpell, iron];
    assert.equal(wxEnemyBuffDecidePickerInRange(origin, atThree, iron), true);
    assert.equal(wxEnemyBuffDecidePickerInRange(origin, atFour, iron), false);
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: available,
        origin,
        targetCell: atThree,
      })?.id,
      "spell-iron-skin",
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: available,
        origin,
        targetCell: atFour,
      }),
      null,
    );
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        spell: iron,
        origin,
        targetCell: atFour,
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
      }),
      false,
    );
  });

  it("does not steal an in-range Strike from the live damage picker", () => {
    const adjacent = { x: 5, y: 4 };
    assert.equal(wxEnemyBuffDecidePickerInRange(origin, adjacent, iron), true);
    assert.equal(
      wxEnemyBuffDecidePickerInRange(origin, adjacent, physicalAttackSpell),
      true,
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [physicalAttackSpell, iron],
        origin,
        targetCell: adjacent,
      }),
      null,
      "Strike at Chebyshev 1 stays #762",
    );
    assert.equal(
      pickWxEnemyBestDamageOrBuffSpell({
        availableSpells: [physicalAttackSpell, iron],
        origin,
        targetCell: adjacent,
      })?.id,
      "physical_attack",
    );
  });

  it("picks Shield / Haste / Enrage when they are the only in-range leftover", () => {
    const dest = { x: 6, y: 4 };
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [shield],
        origin,
        targetCell: dest,
      })?.id,
      "starter-shield",
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [haste],
        origin,
        targetCell: dest,
      })?.id,
      "spell-haste",
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [enrage],
        origin,
        targetCell: dest,
      })?.id,
      "spell-enrage",
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [iron, haste],
        origin,
        targetCell: dest,
      })?.id,
      "spell-iron-skin",
      "kit / availableSpells order — do not invent a buff-score",
    );
  });

  it("cannot execute Iron Skin beyond Chebyshev 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, iron), false);
    assert.equal(wxEnemyBuffDecidePickerInRange(origin, tooFar, iron), false);
    const dest = { x: 6, y: 4 };
    const base = {
      spell: iron,
      origin,
      targetCell: dest,
      casterSide: "enemy" as const,
    };
    assert.equal(wxEnemyBuffDecidePickerInRange(origin, dest, iron), true);
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        ...base,
        occupant: playerAt("player", 6, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        ...base,
        occupant: { id: "rook-2", x: 6, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        ...base,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyBuffPickerHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot decide Strike, Slow, Blood Mend, Drain, or Inferno as a 0-damage buff", () => {
    const dest = { x: 5, y: 4 };
    const occupant = playerAt("player", 5, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        ...base,
        spell: physicalAttackSpell,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [mustSpell("spell-slow")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [mustSpell("starter-heal")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [mustSpell("starter-drain")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [mustSpell("spell-inferno")],
        origin,
        targetCell: dest,
      }),
      null,
    );
  });

  it("still decides a wall-blocked in-range Iron Skin (picker skips LoS)", () => {
    const throughWall = { x: 7, y: 4 };
    assert.equal(
      pickWxEnemyBuffDecideSpell({
        availableSpells: [iron],
        origin,
        targetCell: throughWall,
      })?.id,
      "spell-iron-skin",
    );
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        spell: iron,
        origin,
        targetCell: throughWall,
        occupant: playerAt("player", 7, 4),
        casterSide: "enemy",
      }),
      true,
      "catalog Iron Skin has no lineOfSight; live pickBestDamageSpell is Chebyshev only",
    );
  });

  it("does not debit AP on pack-enemy buff decide (WX never spends enemy AP)", () => {
    const dest = { x: 6, y: 5 };
    assert.equal(Number(iron.apCost), 3);
    assert.equal(Number(shield.apCost), 2);
    assert.equal(
      canExecuteWxEnemyBuffDecidePickerCast({
        spell: iron,
        origin,
        targetCell: dest,
        occupant: playerAt("player", 6, 5),
        casterSide: "enemy",
      }),
      true,
      "do not merge summon applyCast AP (#865) onto pack WX decide",
    );
  });
});
