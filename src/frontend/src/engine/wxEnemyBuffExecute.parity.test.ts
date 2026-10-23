/**
 * Combat action parity: WX pack-enemy 0-damage buff matches advertised
 * RES / DMG / MP. A decided legal (in-range, living hostile) Iron Skin
 * dest is executable with advertised buffStat on the caster; an illegal
 * dest cannot execute; live pack apply writes no row.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { getStatModifier } from "./statusEffects.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyBuffCast,
  executeWxEnemyBuffCast,
  isWxEnemyBuffExecuteSpell,
  shouldDecideWxEnemyBuffCast,
  wxEnemyBuffAdvertisedKinds,
  wxEnemyBuffApplyCell,
  wxEnemyBuffEffectFields,
  wxEnemyBuffExecuteRange,
  wxEnemyBuffFallsThroughToMelee,
  wxEnemyBuffHighlightedTargetIsExecutable,
  wxEnemyBuffInRange,
  wxEnemyBuffLegacyApplyFields,
  wxEnemyBuffLiveKinds,
  wxEnemyLiveDamagePickerWouldSelect,
} from "./wxEnemyBuffExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

describe("WX enemy advertised 0-damage buff vs missing pack buff arm", () => {
  const iron = mustSpell("spell-iron-skin");
  const shield = mustSpell("starter-shield");
  const haste = mustSpell("spell-haste");
  const enrage = mustSpell("spell-enrage");
  const origin = { x: 4, y: 4 };
  const casterId = "rook-1";

  it("treats catalog Iron Skin as a 0-damage buff execute spell", () => {
    assert.equal(iron.spellType, "damage");
    assert.equal(Number(iron.damage), 0);
    assert.equal(Number(iron.healAmount ?? 0), 0);
    assert.equal(iron.buffStat, "res");
    assert.equal(Number(iron.buffModifier), 1.3);
    assert.equal(Number(iron.buffDuration), 3);
    assert.equal(Number(iron.range), 3);
    assert.equal(iron.targetType, "ally");
    assert.equal(isWxEnemyBuffExecuteSpell(iron), true);
    assert.equal(wxEnemyBuffExecuteRange(iron), enemySpellRange(iron));
    assert.equal(isWxEnemyBuffExecuteSpell(shield), true);
    assert.equal(isWxEnemyBuffExecuteSpell(haste), true);
    assert.equal(isWxEnemyBuffExecuteSpell(enrage), true);
  });

  it("rook z>=1 kit carries Iron Skin next to Strike", () => {
    assert.deepEqual(buildEnemyKit("rook", 1), [
      "physical_attack",
      "spell-iron-skin",
    ]);
    assert.equal(buildEnemyKit("rook", 0).includes("spell-iron-skin"), false);
    assert.equal(buildEnemyKit("pawn", 1).includes("spell-iron-skin"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyBuffExecuteSpell({
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
      isWxEnemyBuffExecuteSpell({
        spellType: "damage",
        damage: 0,
        effectType: "buff",
        buffDuration: 3,
        range: 3,
        targetType: "ally",
      }),
      false,
      "buff flag without advertised buffStat is not this gate",
    );
  });

  it("does not steal Strike, Slow, Blood Mend, Drain, Poison, Inferno, or Frost", () => {
    assert.equal(isWxEnemyBuffExecuteSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("starter-heal")),
      false,
      "#757/#924 own range-0 heal+CHC",
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("spell-rallying-cry")),
      false,
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("starter-poison")),
      false,
      "#947 owns pack DoT ticks",
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("spell-venom-strike")),
      false,
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("spell-inferno")),
      false,
      "#947/#799 own Inferno ticks / bomber splash",
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(isWxEnemyBuffExecuteSpell(mustSpell("starter-frost")), false);
    assert.equal(
      isWxEnemyBuffExecuteSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxEnemyBuffExecuteSpell(mustSpell("spell-expose")), false);
    assert.equal(isWxEnemyBuffExecuteSpell(mustSpell("spell-mirror")), false);
    assert.equal(isWxEnemyBuffExecuteSpell(mustSpell("spell-swap")), false);
  });

  it("live WX apply kinds miss advertised buff and fall through to melee", () => {
    assert.deepEqual(wxEnemyBuffLiveKinds(iron), []);
    assert.deepEqual(wxEnemyBuffAdvertisedKinds(iron), ["buff"]);
    assert.deepEqual(wxEnemyBuffLiveKinds(shield), []);
    assert.deepEqual(wxEnemyBuffAdvertisedKinds(shield), ["buff"]);
    assert.equal(wxEnemyBuffFallsThroughToMelee(iron), true);
    assert.equal(wxEnemyBuffFallsThroughToMelee(enrage), true);
    assert.deepEqual(wxEnemyBuffLiveKinds(physicalAttackSpell), ["damage"]);
    assert.deepEqual(wxEnemyBuffLiveKinds(mustSpell("spell-slow")), ["debuff"]);
    assert.deepEqual(wxEnemyBuffLiveKinds(mustSpell("starter-heal")), ["heal"]);
    assert.equal(wxEnemyBuffLegacyApplyFields(iron), null);
    assert.equal(wxEnemyLiveDamagePickerWouldSelect(iron), false);
    assert.equal(wxEnemyLiveDamagePickerWouldSelect(shield), false);
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
    assert.equal(
      wx.includes(".buffStat"),
      false,
      "live WX never reads advertised buffStat (boss uses debuffStat ?? atk)",
    );
    const healStart = wx.indexOf(
      '} else if (inRange && spellType === "heal" && spellRange === 0)',
    );
    assert.ok(healStart > 0, "WX enemy heal arm is present");
    const dmgGate = wx.lastIndexOf("spellDmg > 0", healStart);
    assert.ok(dmgGate > 0, "WX enemy damage arm is present");
    const meleeStart = wx.indexOf(
      'if (action.kind === "melee" || !didAct)',
      healStart,
    );
    assert.ok(meleeStart > healStart);
    const afterDamage = wx.slice(healStart, meleeStart);
    assert.equal(
      afterDamage.includes(".buffStat"),
      false,
      "live WX has no standalone 0-damage buff arm after the damage gate",
    );
  });

  it("executes in-range Iron Skin advertised RES 1.3 on the caster", () => {
    const dest = { x: 6, y: 5 };
    const occupant = playerAt("player", 6, 5);
    assert.equal(wxEnemyBuffInRange(origin, dest, iron), true);
    const decided = shouldDecideWxEnemyBuffCast({
      spell: iron,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyBuffCast({
      spell: iron,
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyBuffHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(wxEnemyBuffApplyCell(origin, dest), origin);
    assert.deepEqual(
      executeWxEnemyBuffCast({
        spell: iron,
        origin,
        targetCell: dest,
        occupant,
        casterSide: "enemy",
        casterId,
      }),
      {
        tile: { x: 4, y: 4 },
        type: "buff",
        targetId: casterId,
        stat: "res",
        modifier: 1.3,
        duration: 3,
      },
    );
    assert.deepEqual(wxEnemyBuffEffectFields(iron, casterId), {
      type: "buff",
      targetId: casterId,
      stat: "res",
      modifier: 1.3,
      duration: 3,
    });
  });

  it("applies advertised RES through getStatModifier; live pack apply cannot", () => {
    const advertised = wxEnemyBuffEffectFields(iron, casterId);
    assert.ok(advertised);
    assert.equal(
      getStatModifier(casterId, "res", [
        {
          targetId: advertised.targetId,
          type: advertised.type,
          stat: advertised.stat,
          modifier: advertised.modifier,
        },
      ]),
      1.3,
    );
    assert.equal(wxEnemyBuffLegacyApplyFields(iron), null);
    assert.equal(
      getStatModifier(casterId, "res", []),
      1,
      "live WX writes no buff row when damage is 0",
    );
  });

  it("executes Shield / Haste / Enrage advertised fields on the caster", () => {
    const dest = { x: 6, y: 4 };
    const occupant = playerAt("player", 6, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
      casterId,
    };
    assert.deepEqual(executeWxEnemyBuffCast({ ...base, spell: shield }), {
      tile: { x: 4, y: 4 },
      type: "buff",
      targetId: casterId,
      stat: "res",
      modifier: 1.3,
      duration: 3,
    });
    assert.deepEqual(executeWxEnemyBuffCast({ ...base, spell: haste }), {
      tile: { x: 4, y: 4 },
      type: "buff",
      targetId: casterId,
      stat: "mp",
      modifier: 2,
      duration: 1,
    });
    assert.deepEqual(executeWxEnemyBuffCast({ ...base, spell: enrage }), {
      tile: { x: 4, y: 4 },
      type: "buff",
      targetId: casterId,
      stat: "dmg",
      modifier: 1.4,
      duration: 2,
    });
  });

  it("cannot execute Iron Skin beyond Chebyshev 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, iron), false);
    assert.equal(wxEnemyBuffInRange(origin, tooFar, iron), false);
    assert.equal(
      canExecuteWxEnemyBuffCast({
        spell: iron,
        origin,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
      }),
      false,
    );
    assert.equal(
      executeWxEnemyBuffCast({
        spell: iron,
        origin,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        casterSide: "enemy",
        casterId,
      }),
      null,
    );
    const dest = { x: 6, y: 4 };
    const base = {
      spell: iron,
      origin,
      targetCell: dest,
      casterSide: "enemy" as const,
    };
    assert.equal(wxEnemyBuffInRange(origin, dest, iron), true);
    assert.equal(
      canExecuteWxEnemyBuffCast({
        ...base,
        occupant: playerAt("player", 6, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyBuffCast({
        ...base,
        occupant: { id: "rook-2", x: 6, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyBuffCast({
        ...base,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyBuffHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot execute Strike, Slow, Blood Mend, or Drain as a 0-damage buff", () => {
    const dest = { x: 5, y: 4 };
    const occupant = playerAt("player", 5, 4);
    const base = {
      origin,
      targetCell: dest,
      occupant,
      casterSide: "enemy" as const,
      casterId,
    };
    assert.equal(
      canExecuteWxEnemyBuffCast({ ...base, spell: physicalAttackSpell }),
      false,
    );
    assert.equal(
      executeWxEnemyBuffCast({
        ...base,
        spell: mustSpell("spell-slow"),
      }),
      null,
    );
    assert.equal(
      executeWxEnemyBuffCast({
        ...base,
        spell: mustSpell("starter-heal"),
      }),
      null,
    );
    assert.equal(
      executeWxEnemyBuffCast({
        ...base,
        spell: mustSpell("starter-drain"),
      }),
      null,
    );
    assert.equal(
      executeWxEnemyBuffCast({
        ...base,
        spell: mustSpell("spell-inferno"),
      }),
      null,
    );
  });

  it("still executes a wall-blocked in-range Iron Skin (WX skips LoS)", () => {
    const throughWall = { x: 7, y: 4 };
    assert.equal(
      canExecuteWxEnemyBuffCast({
        spell: iron,
        origin,
        targetCell: throughWall,
        occupant: playerAt("player", 7, 4),
        casterSide: "enemy",
      }),
      true,
      "catalog Iron Skin has no lineOfSight; WX inRange is Chebyshev only",
    );
  });

  it("does not debit AP on pack-enemy buff execute (WX never spends enemy AP)", () => {
    const dest = { x: 6, y: 5 };
    assert.equal(Number(iron.apCost), 3);
    assert.equal(Number(shield.apCost), 2);
    assert.equal(
      canExecuteWxEnemyBuffCast({
        spell: iron,
        origin,
        targetCell: dest,
        occupant: playerAt("player", 6, 5),
        casterSide: "enemy",
      }),
      true,
      "do not merge summon applyCast AP (#865) onto pack WX",
    );
  });
});
