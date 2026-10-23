/**
 * Combat action parity: WX pack-enemy 0-damage DoT matches advertised ticks.
 * A decided legal (in-range, living hostile) Poison / Venom / Inferno dest
 * is executable with advertised dpt; an illegal dest cannot execute; live
 * nested-under-damage apply writes no row.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { AI_KAMIKAZE_BLAST_RADIUS } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { tickDotStacks } from "./dotStacks.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyDotCast,
  executeWxEnemyDotCast,
  isWxEnemyDotExecuteSpell,
  shouldDecideWxEnemyDotCast,
  wxEnemyDotAdvertisedKinds,
  wxEnemyDotEffectFields,
  wxEnemyDotExecuteRange,
  wxEnemyDotExecuteSplashRadius,
  wxEnemyDotFallsThroughToMelee,
  wxEnemyDotHighlightedTargetIsExecutable,
  wxEnemyDotInRange,
  wxEnemyDotLegacyApplyFields,
  wxEnemyDotLiveKinds,
  wxEnemyLiveDamagePickerWouldSelect,
} from "./wxEnemyDotExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

describe("WX enemy advertised 0-damage DoT vs damage-return execute", () => {
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const origin = { x: 4, y: 4 };

  it("treats catalog Poison, Venom, and Inferno as 0-damage DoT execute spells", () => {
    assert.equal(poison.spellType, "damage");
    assert.equal(Number(poison.damage), 0);
    assert.equal(poison.isDotSpell, true);
    assert.equal(Number(poison.dotDamagePerTurn), 4);
    assert.equal(Number(poison.dotDuration), 3);
    assert.equal(Number(poison.range), 4);
    assert.equal(isWxEnemyDotExecuteSpell(poison), true);
    assert.equal(Number(venom.damage), 0);
    assert.equal(Number(venom.dotDamagePerTurn), 4);
    assert.equal(Number(venom.range), 2);
    assert.equal(isWxEnemyDotExecuteSpell(venom), true);
    assert.equal(Number(inferno.damage), 0);
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.areaRadius ?? 0), 0);
    assert.equal(isWxEnemyDotExecuteSpell(inferno), true);
    assert.equal(wxEnemyDotExecuteRange(poison), enemySpellRange(poison));
    assert.equal(wxEnemyDotExecuteSplashRadius(inferno), 0);
    assert.notEqual(
      wxEnemyDotExecuteSplashRadius(inferno),
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
      isWxEnemyDotExecuteSpell({
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
      isWxEnemyDotExecuteSpell({
        spellType: "damage",
        damage: 0,
        effectType: "dot",
        dotDuration: 3,
        range: 3,
      }),
      false,
      "DoT flag without advertised dpt is not this gate",
    );
  });

  it("does not steal Strike, Slow, Blood Mend, Iron Skin, Drain, Frost, Nova, or bomber splash", () => {
    assert.equal(isWxEnemyDotExecuteSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("starter-heal")),
      false,
      "#757/#924 own range-0 heal",
    );
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("spell-rallying-cry")),
      false,
    );
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("spell-iron-skin")),
      false,
      "#843/#865 own buff-only Iron Skin",
    );
    assert.equal(isWxEnemyDotExecuteSpell(mustSpell("starter-shield")), false);
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("spell-drain-courage")),
      false,
      "#922 owns Drain Courage AP",
    );
    assert.equal(isWxEnemyDotExecuteSpell(mustSpell("starter-frost")), false);
    assert.equal(
      isWxEnemyDotExecuteSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxEnemyDotExecuteSpell(mustSpell("spell-expose")), false);
    assert.equal(isWxEnemyDotExecuteSpell(mustSpell("spell-mirror")), false);
    assert.equal(isWxEnemyDotExecuteSpell(mustSpell("spell-swap")), false);
  });

  it("live WX apply kinds miss advertised ticks and fall through to melee", () => {
    assert.deepEqual(wxEnemyDotLiveKinds(poison), []);
    assert.deepEqual(wxEnemyDotAdvertisedKinds(poison), ["dot"]);
    assert.deepEqual(wxEnemyDotLiveKinds(venom), []);
    assert.deepEqual(wxEnemyDotAdvertisedKinds(venom), ["dot"]);
    assert.deepEqual(wxEnemyDotLiveKinds(inferno), []);
    assert.deepEqual(wxEnemyDotAdvertisedKinds(inferno), ["dot"]);
    assert.equal(wxEnemyDotFallsThroughToMelee(poison), true);
    assert.equal(wxEnemyDotFallsThroughToMelee(inferno), true);
    assert.deepEqual(wxEnemyDotLiveKinds(physicalAttackSpell), ["damage"]);
    assert.deepEqual(wxEnemyDotLiveKinds(mustSpell("spell-slow")), ["debuff"]);
    assert.deepEqual(wxEnemyDotLiveKinds(mustSpell("starter-heal")), ["heal"]);
    assert.equal(wxEnemyDotLegacyApplyFields(poison), null);
    assert.equal(wxEnemyLiveDamagePickerWouldSelect(poison), false);
    assert.equal(wxEnemyLiveDamagePickerWouldSelect(venom), false);
    assert.equal(wxEnemyLiveDamagePickerWouldSelect(inferno), false);
    assert.equal(wxEnemyLiveDamagePickerWouldSelect(physicalAttackSpell), true);
    assert.equal(
      wxEnemyLiveDamagePickerWouldSelect(mustSpell("starter-frost")),
      true,
    );
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const healStart = wx.indexOf(
      '} else if (inRange && spellType === "heal" && spellRange === 0)',
    );
    assert.ok(healStart > 0, "WX enemy heal arm is present");
    const dmgGate = wx.lastIndexOf("spellDmg > 0", healStart);
    assert.ok(dmgGate > 0, "WX enemy damage arm is present");
    const damageArm = wx.slice(dmgGate, healStart);
    assert.ok(damageArm.includes("dotDamagePerTurn"));
    const meleeStart = wx.indexOf(
      'if (action.kind === "melee" || !didAct)',
      healStart,
    );
    assert.ok(meleeStart > healStart);
    const afterDamage = wx.slice(healStart, meleeStart);
    assert.equal(
      afterDamage.includes("dotDamagePerTurn"),
      false,
      "live WX has no standalone 0-damage DoT arm after the damage gate",
    );
  });

  it("executes in-range Poison Arrow advertised 4 dpt / 3 on a living player", () => {
    const dest = { x: 8, y: 4 };
    const occupant = playerAt("player", 8, 4);
    assert.equal(wxEnemyDotInRange(origin, dest, poison), true);
    const decided = shouldDecideWxEnemyDotCast({
      spell: poison,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyDotCast({
      spell: poison,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyDotHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeWxEnemyDotCast({
        spell: poison,
        origin,
        targetCell: dest,
        occupant,
        casterSide: "enemy",
      }),
      {
        tile: { x: 8, y: 4 },
        type: "dot",
        targetId: "player",
        dotDamagePerTurn: 4,
        duration: 3,
      },
    );
    assert.deepEqual(wxEnemyDotEffectFields(poison, "player"), {
      type: "dot",
      targetId: "player",
      dotDamagePerTurn: 4,
      duration: 3,
    });
  });

  it("ticks advertised Poison and ignores the live nested-under-damage miss", () => {
    const advertised = wxEnemyDotEffectFields(poison, "player");
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
      "player",
    );
    assert.equal(advertisedTick.damage, 4);
    assert.equal(advertisedTick.stackCount, 1);

    const legacyTick = tickDotStacks([], "player");
    assert.equal(
      legacyTick.damage,
      0,
      "live WX writes no DoT row when damage is 0",
    );
    assert.equal(legacyTick.stackCount, 0);
  });

  it("executes Venom at Chebyshev 2 and Inferno at Chebyshev 3 with advertised ticks", () => {
    const venomDest = { x: 6, y: 4 };
    const infernoDest = { x: 7, y: 4 };
    assert.equal(Number(venom.apCost), 3);
    assert.deepEqual(
      executeWxEnemyDotCast({
        spell: venom,
        origin,
        targetCell: venomDest,
        occupant: playerAt("player", 6, 4),
        casterSide: "enemy",
      }),
      {
        tile: { x: 6, y: 4 },
        type: "dot",
        targetId: "player",
        dotDamagePerTurn: 4,
        duration: 3,
      },
    );
    assert.equal(
      canExecuteWxEnemyDotCast({
        spell: venom,
        origin,
        targetCell: { x: 7, y: 4 },
        occupant: playerAt("player", 7, 4),
        casterSide: "enemy",
      }),
      false,
      "Venom Chebyshev 3 is out of Number(range) 2",
    );
    assert.deepEqual(
      executeWxEnemyDotCast({
        spell: inferno,
        origin,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4),
        casterSide: "enemy",
      }),
      {
        tile: { x: 7, y: 4 },
        type: "dot",
        targetId: "player",
        dotDamagePerTurn: 8,
        duration: 3,
      },
    );
    assert.equal(
      canExecuteWxEnemyDotCast({
        spell: inferno,
        origin,
        targetCell: { x: 8, y: 4 },
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
      }),
      false,
    );
  });

  it("cannot execute Poison beyond Chebyshev 4, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, poison), false);
    assert.equal(wxEnemyDotInRange(origin, tooFar, poison), false);
    assert.equal(
      canExecuteWxEnemyDotCast({
        spell: poison,
        origin,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
        casterSide: "enemy",
      }),
      false,
    );
    assert.equal(
      executeWxEnemyDotCast({
        spell: poison,
        origin,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
        casterSide: "enemy",
      }),
      null,
    );
    const dest = { x: 5, y: 4 };
    const base = {
      spell: poison,
      origin,
      targetCell: dest,
      casterSide: "enemy" as const,
    };
    assert.equal(wxEnemyDotInRange(origin, dest, poison), true);
    assert.equal(
      canExecuteWxEnemyDotCast({
        ...base,
        occupant: playerAt("player", 5, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyDotCast({
        ...base,
        occupant: { id: "bishop-2", x: 5, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyDotCast({
        ...base,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyDotHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot execute Strike, Slow, Blood Mend, or Drain as a 0-damage DoT", () => {
    const dest = { x: 5, y: 4 };
    const occupant = playerAt("player", 5, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyDotCast({ ...base, spell: physicalAttackSpell }),
      false,
    );
    assert.equal(
      executeWxEnemyDotCast({
        ...base,
        spell: mustSpell("spell-slow"),
      }),
      null,
    );
    assert.equal(
      executeWxEnemyDotCast({
        ...base,
        spell: mustSpell("starter-heal"),
      }),
      null,
    );
    assert.equal(
      executeWxEnemyDotCast({
        ...base,
        spell: mustSpell("starter-drain"),
      }),
      null,
    );
  });

  it("still executes a wall-blocked in-range Poison (WX skips LoS)", () => {
    const throughWall = { x: 8, y: 4 };
    assert.equal(
      canExecuteWxEnemyDotCast({
        spell: poison,
        origin,
        targetCell: throughWall,
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
      }),
      true,
      "catalog Poison has no lineOfSight; WX inRange is Chebyshev only",
    );
  });

  it("does not debit AP on pack-enemy DoT execute (WX never spends enemy AP)", () => {
    const dest = { x: 6, y: 5 };
    assert.equal(Number(poison.apCost), 2);
    assert.equal(
      canExecuteWxEnemyDotCast({
        spell: poison,
        origin,
        targetCell: dest,
        occupant: playerAt("player", 6, 5),
        casterSide: "enemy",
      }),
      true,
      "do not merge summon applyCast AP (#856) onto pack WX",
    );
  });
});
