/**
 * Combat action parity: WX enemy heal matches advertised CHC.
 * A decided legal range-0 Blood Mend / Rallying Cry on the caster tile
 * is executable with advertised heal + CHC 0.15 / 2; an illegal dest
 * cannot execute; live heal-return writes no CHC.
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
  canExecuteWxEnemyHealBuffCast,
  executeWxEnemyHealBuffCast,
  isWxEnemyHealBuffExecuteSpell,
  shouldDecideWxEnemyHealBuffCast,
  wxEnemyHealBuffAdvertisedKinds,
  wxEnemyHealBuffEffectFields,
  wxEnemyHealBuffExecuteRange,
  wxEnemyHealBuffHighlightedTargetIsExecutable,
  wxEnemyHealBuffInRange,
  wxEnemyHealBuffLegacyHealFields,
  wxEnemyHealBuffLiveKinds,
  wxEnemyHealBuffRequiresZeroRange,
} from "./wxEnemyHealBuffExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("WX enemy advertised heal+buff vs heal-return execute", () => {
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const origin = { x: 4, y: 4 };

  it("treats catalog Blood Mend and Rallying Cry as heal+buff execute spells", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(mend.buffStat, "chc");
    assert.equal(Number(mend.buffModifier), 0.15);
    assert.equal(Number(mend.buffDuration), 2);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(isWxEnemyHealBuffExecuteSpell(mend), true);
    assert.equal(cry.spellType, "heal");
    assert.equal(Number(cry.healAmount), 20);
    assert.equal(cry.buffStat, "chc");
    assert.equal(Number(cry.apCost), 4);
    assert.equal(isWxEnemyHealBuffExecuteSpell(cry), true);
    assert.equal(wxEnemyHealBuffExecuteRange(mend), 0);
    assert.equal(wxEnemyHealBuffRequiresZeroRange(cry), true);
    assert.equal(wxEnemyHealBuffExecuteRange(cry), enemySpellRange(cry));
  });

  it("queen and king mid-zone kits carry Blood Mend / Rallying Cry", () => {
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("king", 1), [
      "starter-frost",
      "spell-rallying-cry",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("king", 2), [
      "spell-inferno",
      "spell-rallying-cry",
    ]);
    assert.equal(buildEnemyKit("queen", 0).includes("starter-heal"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealBuffExecuteSpell({
        spellType: "heal",
        healAmount: 9,
        buffStat: "chc",
        buffModifier: 0.15,
        buffDuration: 2,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell({
        spellType: "heal",
        healAmount: 12,
        range: 0,
        targetType: "self",
      }),
      false,
      "heal-only without buffStat stays #757",
    );
  });

  it("does not steal Strike, Slow, Iron Skin, Inferno, Drain, Frost, Nova, Expose, or Mirror", () => {
    assert.equal(isWxEnemyHealBuffExecuteSpell(physicalAttackSpell), false);
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-iron-skin")),
      false,
      "#843/#865 own buff-only Iron Skin",
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-enrage")),
      false,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-haste")),
      false,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-inferno")),
      false,
      "#799/#856 own Inferno ticks",
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-drain-courage")),
      false,
      "#922 owns Drain Courage AP",
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("starter-frost")),
      false,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-expose")),
      false,
    );
    assert.equal(
      isWxEnemyHealBuffExecuteSpell(mustSpell("spell-mirror")),
      false,
    );
    assert.equal(isWxEnemyHealBuffExecuteSpell(mustSpell("spell-swap")), false);
  });

  it("live WX apply kinds heal Rallying Cry but miss advertised CHC", () => {
    assert.deepEqual(wxEnemyHealBuffLiveKinds(cry), ["heal"]);
    assert.deepEqual(wxEnemyHealBuffAdvertisedKinds(cry), ["heal", "buff"]);
    assert.deepEqual(wxEnemyHealBuffLiveKinds(mend), ["heal"]);
    assert.deepEqual(wxEnemyHealBuffAdvertisedKinds(mend), ["heal", "buff"]);
    assert.deepEqual(wxEnemyHealBuffLiveKinds(physicalAttackSpell), ["damage"]);
    assert.deepEqual(wxEnemyHealBuffLiveKinds(mustSpell("spell-slow")), [
      "debuff",
    ]);
    assert.deepEqual(
      wxEnemyHealBuffLiveKinds(mustSpell("spell-iron-skin")),
      [],
    );
    assert.deepEqual(wxEnemyHealBuffLegacyHealFields(cry), { heal: 20 });
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
    const healArm = wx.slice(
      healStart,
      wx.indexOf("chosenSpell.debuffStat &&", healStart + 1),
    );
    assert.ok(healArm.includes("hpAfterHeal"));
    assert.equal(
      healArm.includes("buffStat"),
      false,
      "live WX heal arm never copies advertised CHC",
    );
  });

  it("executes Rallying Cry advertised heal 20 + CHC on the caster tile", () => {
    const dest = { x: 4, y: 4 };
    assert.equal(wxEnemyHealBuffInRange(origin, dest, cry), true);
    const decided = shouldDecideWxEnemyHealBuffCast({
      spell: cry,
      origin,
      targetCell: dest,
    });
    const executable = canExecuteWxEnemyHealBuffCast({
      spell: cry,
      origin,
      targetCell: dest,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealBuffHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeWxEnemyHealBuffCast({
        spell: cry,
        origin,
        targetCell: dest,
      }),
      {
        tile: { x: 4, y: 4 },
        heal: 20,
        buff: { stat: "chc", modifier: 0.15, duration: 2 },
      },
    );
    assert.deepEqual(wxEnemyHealBuffEffectFields(cry), {
      heal: 20,
      buff: { stat: "chc", modifier: 0.15, duration: 2 },
    });
  });

  it("executes Blood Mend advertised heal 12 + CHC without stealing Iron Skin", () => {
    const dest = { x: 4, y: 4 };
    assert.deepEqual(
      executeWxEnemyHealBuffCast({
        spell: mend,
        origin,
        targetCell: dest,
      }),
      {
        tile: { x: 4, y: 4 },
        heal: 12,
        buff: { stat: "chc", modifier: 0.15, duration: 2 },
      },
    );
    assert.equal(
      executeWxEnemyHealBuffCast({
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: dest,
      }),
      null,
    );
  });

  it("applies advertised CHC through getStatModifier; live heal-return cannot", () => {
    const advertised = executeWxEnemyHealBuffCast({
      spell: cry,
      origin,
      targetCell: origin,
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("queen-1", "chc", [
        {
          targetId: "queen-1",
          type: "buff",
          stat: advertised.buff.stat,
          modifier: advertised.buff.modifier,
        },
      ]),
      0.15,
    );
    assert.equal(
      getStatModifier("queen-1", "chc", [
        {
          targetId: "queen-1",
          type: "buff",
        } as Parameters<typeof getStatModifier>[2][number],
      ]),
      1,
      "heal-return applyEffect without buffStat is a no-op CHC write",
    );
  });

  it("cannot execute a distant ally or player dest (live WX range-0 inRange)", () => {
    const ally = { x: 8, y: 8 };
    assert.equal(
      enemyCastRangeOk(origin, ally, cry),
      false,
      "raw player dest vs range 0 must not be the execute gate",
    );
    assert.equal(wxEnemyHealBuffInRange(origin, ally, cry), false);
    assert.equal(
      canExecuteWxEnemyHealBuffCast({
        spell: cry,
        origin,
        targetCell: ally,
      }),
      false,
    );
    assert.equal(
      executeWxEnemyHealBuffCast({
        spell: mend,
        origin,
        targetCell: ally,
      }),
      null,
    );
    assert.equal(
      wxEnemyHealBuffHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot execute Strike, Iron Skin, Drain, or Inferno as a heal+buff", () => {
    const dest = { x: 4, y: 4 };
    assert.equal(
      canExecuteWxEnemyHealBuffCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealBuffCast({
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      executeWxEnemyHealBuffCast({
        spell: mustSpell("starter-drain"),
        origin,
        targetCell: dest,
      }),
      null,
    );
    assert.equal(
      executeWxEnemyHealBuffCast({
        spell: mustSpell("spell-inferno"),
        origin,
        targetCell: dest,
      }),
      null,
    );
  });

  it("still executes a wall-blocked caster-tile Rallying Cry (healer LoS is off)", () => {
    assert.equal(
      canExecuteWxEnemyHealBuffCast({
        spell: cry,
        origin,
        targetCell: origin,
      }),
      true,
      "catalog Rallying Cry has no lineOfSight; WX heal skips LoS",
    );
  });

  it("does not let a ranged heal steal the range-0 execute gate", () => {
    const ranged = {
      spellType: "heal" as const,
      healAmount: 12,
      buffStat: "chc",
      buffModifier: 0.15,
      buffDuration: 2,
      range: 3,
      targetType: "ally" as const,
    };
    assert.equal(isWxEnemyHealBuffExecuteSpell(ranged), true);
    assert.equal(wxEnemyHealBuffRequiresZeroRange(ranged), false);
    assert.equal(
      canExecuteWxEnemyHealBuffCast({
        spell: ranged,
        origin,
        targetCell: origin,
      }),
      false,
      "#757: ally-range heals never enter the WX heal arm",
    );
  });
});
