/**
 * Combat action parity: pack-enemy `pickBestDamageSpell` selects advertised
 * 0-damage DoTs when no `damage > 0` kit is in range. A decided legal
 * (in-range, living hostile) Poison / Venom / Inferno dest is executable;
 * an illegal dest cannot execute; live `Number(s.damage) > 0` still skips.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { AI_KAMIKAZE_BLAST_RADIUS } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyDotDecidePickerCast,
  isWxEnemyDotDecidePickerSpell,
  pickWxEnemyBestDamageOrDotSpell,
  pickWxEnemyDotDecideSpell,
  shouldDecideWxEnemyDotPickerCast,
  wxEnemyDotDecidePickerInRange,
  wxEnemyDotDecidePickerRange,
  wxEnemyDotDecidePickerSplashRadius,
  wxEnemyDotPickerHighlightedTargetIsExecutable,
  wxEnemyLivePickBestDamageSpell,
  wxEnemyLivePickBestDamageSpellSelects,
} from "./wxEnemyDotDecidePicker.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

describe("WX enemy pickBestDamageSpell vs advertised 0-damage DoT", () => {
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const frost = mustSpell("starter-frost");
  const heal = mustSpell("starter-heal");
  const origin = { x: 4, y: 4 };

  it("treats catalog Poison, Venom, and Inferno as 0-damage DoT picker spells", () => {
    assert.equal(poison.spellType, "damage");
    assert.equal(Number(poison.damage), 0);
    assert.equal(poison.isDotSpell, true);
    assert.equal(Number(poison.dotDamagePerTurn), 4);
    assert.equal(Number(poison.dotDuration), 3);
    assert.equal(Number(poison.range), 4);
    assert.equal(isWxEnemyDotDecidePickerSpell(poison), true);
    assert.equal(Number(venom.damage), 0);
    assert.equal(Number(venom.dotDamagePerTurn), 4);
    assert.equal(Number(venom.range), 2);
    assert.equal(isWxEnemyDotDecidePickerSpell(venom), true);
    assert.equal(Number(inferno.damage), 0);
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.areaRadius ?? 0), 0);
    assert.equal(isWxEnemyDotDecidePickerSpell(inferno), true);
    assert.equal(wxEnemyDotDecidePickerRange(poison), enemySpellRange(poison));
    assert.equal(wxEnemyDotDecidePickerSplashRadius(inferno), 0);
    assert.notEqual(
      wxEnemyDotDecidePickerSplashRadius(inferno),
      AI_KAMIKAZE_BLAST_RADIUS,
      "#799 owns bomber radius-2 splash, not pack Inferno ticks",
    );
  });

  it("bishop / pawn / queen+king kits carry Poison / Venom / Inferno", () => {
    assert.deepEqual(buildEnemyKit("bishop", 1), [
      "starter-frost",
      "starter-poison",
    ]);
    assert.deepEqual(buildEnemyKit("pawn", 1), [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("king", 2), [
      "spell-inferno",
      "spell-rallying-cry",
    ]);
    assert.equal(buildEnemyKit("queen", 1).includes("spell-inferno"), false);
    assert.equal(buildEnemyKit("bishop", 0).includes("starter-poison"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyDotDecidePickerSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 5,
        dotDuration: 2,
        range: 3,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell({
        spellType: "damage",
        damage: 0,
        effectType: "dot",
        dotDuration: 3,
        range: 3,
      }),
      false,
      "DoT flag without advertised dpt is not this picker",
    );
  });

  it("does not steal Strike, Slow, Blood Mend, Iron Skin, Drain, Frost, Nova, or bomber splash", () => {
    assert.equal(isWxEnemyDotDecidePickerSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("starter-heal")),
      false,
      "#757/#924 own range-0 heal",
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-rallying-cry")),
      false,
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-iron-skin")),
      false,
      "#843/#865 own buff-only Iron Skin",
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-drain-courage")),
      false,
      "#922 owns Drain Courage AP",
    );
    assert.equal(isWxEnemyDotDecidePickerSpell(frost), false);
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-expose")),
      false,
    );
    assert.equal(
      isWxEnemyDotDecidePickerSpell(mustSpell("spell-mirror")),
      false,
    );
    assert.equal(isWxEnemyDotDecidePickerSpell(mustSpell("spell-swap")), false);
  });

  it("live pickBestDamageSpell still skips Poison / Venom / Inferno", () => {
    assert.equal(wxEnemyLivePickBestDamageSpellSelects(poison), false);
    assert.equal(wxEnemyLivePickBestDamageSpellSelects(venom), false);
    assert.equal(wxEnemyLivePickBestDamageSpellSelects(inferno), false);
    assert.equal(
      wxEnemyLivePickBestDamageSpellSelects(physicalAttackSpell),
      true,
    );
    assert.equal(wxEnemyLivePickBestDamageSpellSelects(frost), true);
    const dest = { x: 7, y: 4 };
    assert.equal(
      wxEnemyLivePickBestDamageSpell({
        availableSpells: [inferno, heal],
        origin,
        targetCell: dest,
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

  it("picks in-range queen Inferno when live damage>0 is empty, and executes advertised dest", () => {
    const dest = { x: 7, y: 4 };
    const occupant = playerAt("player", 7, 4);
    const available = [inferno, heal];
    assert.equal(
      wxEnemyLivePickBestDamageSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      }),
      null,
    );
    const picked = pickWxEnemyDotDecideSpell({
      availableSpells: available,
      origin,
      targetCell: dest,
    });
    assert.equal(picked?.id, "spell-inferno");
    assert.equal(
      pickWxEnemyBestDamageOrDotSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      })?.id,
      "spell-inferno",
    );
    const decided = shouldDecideWxEnemyDotPickerCast({
      spell: inferno,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyDotDecidePickerCast({
      spell: inferno,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyDotPickerHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
  });

  it("picks pawn Venom at Chebyshev 2 where Strike cannot reach", () => {
    const dest = { x: 6, y: 4 };
    const occupant = playerAt("player", 6, 4);
    const available = [physicalAttackSpell, venom];
    assert.equal(wxEnemyDotDecidePickerInRange(origin, dest, venom), true);
    assert.equal(
      wxEnemyDotDecidePickerInRange(origin, dest, physicalAttackSpell),
      false,
    );
    assert.equal(
      wxEnemyLivePickBestDamageSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: available,
        origin,
        targetCell: dest,
      })?.id,
      "spell-venom-strike",
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        spell: venom,
        origin,
        targetCell: dest,
        occupant,
        casterSide: "enemy",
      }),
      true,
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        spell: venom,
        origin,
        targetCell: { x: 7, y: 4 },
        occupant: playerAt("player", 7, 4),
        casterSide: "enemy",
      }),
      false,
      "Venom Chebyshev 3 is out of Number(range) 2",
    );
  });

  it("does not steal an in-range Strike or Frost from the live damage picker", () => {
    const adjacent = { x: 5, y: 4 };
    const far = { x: 8, y: 4 };
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [physicalAttackSpell, venom],
        origin,
        targetCell: adjacent,
      }),
      null,
      "Strike at Chebyshev 1 stays #762",
    );
    assert.equal(
      pickWxEnemyBestDamageOrDotSpell({
        availableSpells: [physicalAttackSpell, venom],
        origin,
        targetCell: adjacent,
      })?.id,
      "physical_attack",
    );
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [frost, poison],
        origin,
        targetCell: far,
      }),
      null,
      "Frost at Chebyshev 4 stays #762; Poison is not a higher-damage steal",
    );
    assert.equal(
      pickWxEnemyBestDamageOrDotSpell({
        availableSpells: [frost, poison],
        origin,
        targetCell: far,
      })?.id,
      "starter-frost",
    );
  });

  it("picks Poison when Frost is absent from availableSpells", () => {
    const dest = { x: 8, y: 4 };
    const occupant = playerAt("player", 8, 4);
    assert.equal(wxEnemyDotDecidePickerInRange(origin, dest, poison), true);
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [poison],
        origin,
        targetCell: dest,
      })?.id,
      "starter-poison",
    );
    const decided = shouldDecideWxEnemyDotPickerCast({
      spell: poison,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyDotDecidePickerCast({
      spell: poison,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyDotPickerHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
  });

  it("cannot execute Poison beyond Chebyshev 4, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, poison), false);
    assert.equal(wxEnemyDotDecidePickerInRange(origin, tooFar, poison), false);
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [poison],
        origin,
        targetCell: tooFar,
      }),
      null,
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        spell: poison,
        origin,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
        casterSide: "enemy",
      }),
      false,
    );
    const dest = { x: 5, y: 4 };
    const base = {
      spell: poison,
      origin,
      targetCell: dest,
      casterSide: "enemy" as const,
    };
    assert.equal(wxEnemyDotDecidePickerInRange(origin, dest, poison), true);
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        ...base,
        occupant: playerAt("player", 5, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        ...base,
        occupant: { id: "bishop-2", x: 5, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        ...base,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyDotPickerHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot decide Strike, Slow, Blood Mend, or Drain as a 0-damage DoT", () => {
    const dest = { x: 5, y: 4 };
    const occupant = playerAt("player", 5, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        ...base,
        spell: physicalAttackSpell,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [mustSpell("spell-slow")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [heal],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [mustSpell("starter-drain")],
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        ...base,
        spell: mustSpell("starter-drain"),
      }),
      false,
    );
  });

  it("still decides a wall-blocked in-range Poison (picker skips LoS)", () => {
    const throughWall = { x: 8, y: 4 };
    assert.equal(
      pickWxEnemyDotDecideSpell({
        availableSpells: [poison],
        origin,
        targetCell: throughWall,
      })?.id,
      "starter-poison",
    );
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        spell: poison,
        origin,
        targetCell: throughWall,
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
      }),
      true,
      "catalog Poison has no lineOfSight; live pickBestDamageSpell is Chebyshev only",
    );
  });

  it("does not debit AP on pack-enemy DoT decide (WX never spends enemy AP)", () => {
    const dest = { x: 6, y: 5 };
    assert.equal(Number(poison.apCost), 2);
    assert.equal(Number(venom.apCost), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(
      canExecuteWxEnemyDotDecidePickerCast({
        spell: poison,
        origin,
        targetCell: dest,
        occupant: playerAt("player", 6, 5),
        casterSide: "enemy",
      }),
      true,
      "do not merge summon applyCast AP (#856) onto pack WX decide",
    );
  });
});
