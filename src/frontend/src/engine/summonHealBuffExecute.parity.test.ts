/**
 * Combat action parity: summon kit heal+buff decide matches applyCast.
 * A decided legal advertised Rallying Cry / Blood Mend is executable
 * with advertised CHC; an illegal target cannot execute.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SUMMON_AP } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { getStatModifier } from "./statusEffects.ts";
import {
  canAffordSummonHealBuffCast,
  canExecuteSummonHealBuffCast,
  executeSummonHealBuffCast,
  isSummonHealBuffExecuteSpell,
  shouldDecideSummonHealBuffCast,
  summonApplyCastKinds,
  summonHealBuffApplyCell,
  summonHealBuffCastApCost,
  summonHealBuffEffectFields,
  summonHealBuffHighlightedTargetIsExecutable,
  summonHealBuffInRange,
  summonHealBuffLegacyApplyCastFields,
} from "./summonHealBuffExecute.ts";
import { enemyCastRangeOk } from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function healerKitIds(src: string): string[] {
  const match = src.match(/healer:\s*\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/);
  return match ? [match[1], match[2]] : [];
}

describe("summon kit advertised heal+buff vs applyCast", () => {
  it("treats catalog Rallying Cry and Blood Mend as heal+buff execute spells", () => {
    const cry = mustSpell("spell-rallying-cry");
    assert.equal(cry.spellType, "heal");
    assert.equal(Number(cry.healAmount), 20);
    assert.equal(cry.buffStat, "chc");
    assert.equal(Number(cry.buffModifier), 0.15);
    assert.equal(Number(cry.buffDuration), 2);
    assert.equal(Number(cry.range), 0);
    assert.equal(cry.targetType, "self");
    assert.equal(isSummonHealBuffExecuteSpell(cry), true);
    assert.equal(isSummonHealBuffExecuteSpell(mustSpell("starter-heal")), true);
  });

  it("healer kit first ids are Blood Mend then Rallying Cry", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(healerKitIds(src), ["starter-heal", "spell-rallying-cry"]);
    assert.equal(SUMMON_AP.healer, 2);
  });

  it("does not steal Strike, Slow, Shield, Iron Skin, Poison, or Inferno", () => {
    assert.equal(isSummonHealBuffExecuteSpell(physicalAttackSpell), false);
    assert.equal(isSummonHealBuffExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isSummonHealBuffExecuteSpell(mustSpell("starter-shield")),
      false,
      "Shield advertised RES stays on the buff-only path",
    );
    assert.equal(
      isSummonHealBuffExecuteSpell(mustSpell("spell-iron-skin")),
      false,
      "#843 owns buff-only Iron Skin",
    );
    assert.equal(
      isSummonHealBuffExecuteSpell(mustSpell("starter-poison")),
      false,
      "#856 owns Poison ticks",
    );
    assert.equal(
      isSummonHealBuffExecuteSpell(mustSpell("spell-inferno")),
      false,
      "#799 owns bomber Inferno",
    );
    assert.equal(isSummonHealBuffExecuteSpell(mustSpell("spell-swap")), false);
    assert.equal(isSummonHealBuffExecuteSpell(mustSpell("spell-mark")), false);
    assert.equal(
      isSummonHealBuffExecuteSpell(mustSpell("spell-mirror")),
      false,
    );
  });

  it("live applyCast kinds heal Rallying Cry but miss advertised CHC", () => {
    const cry = mustSpell("spell-rallying-cry");
    assert.deepEqual(summonApplyCastKinds(cry, true), ["heal"]);
    assert.equal(
      summonApplyCastKinds(cry, true).includes("effect"),
      false,
      "heal return never reaches applyEffect",
    );
    assert.deepEqual(summonHealBuffLegacyApplyCastFields(cry), { heal: 20 });
    assert.deepEqual(summonApplyCastKinds(mustSpell("spell-iron-skin"), true), [
      "effect",
    ]);
    assert.deepEqual(summonApplyCastKinds(physicalAttackSpell, true), [
      "damage",
    ]);
  });

  it("executes self Rallying Cry on the caster tile even when decide aimed at a ward", () => {
    const cry = mustSpell("spell-rallying-cry");
    const origin = { x: 4, y: 4 };
    const ward = { x: 8, y: 8 };
    assert.equal(
      enemyCastRangeOk(origin, ward, cry),
      false,
      "raw ward dest vs range 0 must not be the execute gate",
    );
    assert.deepEqual(summonHealBuffApplyCell(cry, origin, ward), origin);
    const decided = shouldDecideSummonHealBuffCast({
      currentAp: 4,
      spell: cry,
      origin,
      targetCell: ward,
    });
    const executable = canExecuteSummonHealBuffCast({
      currentAp: 4,
      spell: cry,
      origin,
      targetCell: ward,
    });
    assert.equal(summonHealBuffInRange(origin, ward, cry), true);
    assert.equal(summonHealBuffCastApCost(cry), 4);
    assert.equal(canAffordSummonHealBuffCast(4, cry), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonHealBuffHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeSummonHealBuffCast({
        currentAp: 4,
        spell: cry,
        origin,
        targetCell: ward,
      }),
      {
        tile: { x: 4, y: 4 },
        heal: 20,
        buff: { stat: "chc", modifier: 0.15, duration: 2 },
      },
    );
    assert.deepEqual(summonHealBuffEffectFields(cry)?.buff, {
      stat: "chc",
      modifier: 0.15,
      duration: 2,
    });
  });

  it("applies advertised CHC through getStatModifier; live heal-only cannot", () => {
    const cry = mustSpell("spell-rallying-cry");
    const advertised = executeSummonHealBuffCast({
      currentAp: 4,
      spell: cry,
      origin: { x: 2, y: 2 },
      targetCell: { x: 7, y: 1 },
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("wisp-1", "chc", [
        {
          targetId: "wisp-1",
          type: "buff",
          stat: advertised.buff.stat,
          modifier: advertised.buff.modifier,
        },
      ]),
      0.15,
    );
    const legacy = summonHealBuffLegacyApplyCastFields(cry);
    assert.ok(legacy);
    assert.equal(
      getStatModifier("wisp-1", "chc", []),
      1,
      "applyCast heal return writes no CHC row",
    );
    assert.equal(legacy.heal, 20);
  });

  it("executes Blood Mend advertised heal 12 + CHC without stealing Iron Skin", () => {
    const mend = mustSpell("starter-heal");
    const origin = { x: 3, y: 5 };
    const ally = { x: 9, y: 1 };
    assert.equal(summonHealBuffCastApCost(mend), 3);
    assert.deepEqual(
      executeSummonHealBuffCast({
        currentAp: 3,
        spell: mend,
        origin,
        targetCell: ally,
      }),
      {
        tile: { x: 3, y: 5 },
        heal: 12,
        buff: { stat: "chc", modifier: 0.15, duration: 2 },
      },
    );
    assert.equal(
      executeSummonHealBuffCast({
        currentAp: 3,
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: ally,
      }),
      null,
    );
  });

  it("cannot execute Rallying Cry or Blood Mend on a 2-AP wisp", () => {
    const origin = { x: 4, y: 4 };
    assert.equal(
      canAffordSummonHealBuffCast(
        SUMMON_AP.healer,
        mustSpell("spell-rallying-cry"),
      ),
      false,
    );
    assert.equal(
      canAffordSummonHealBuffCast(SUMMON_AP.healer, mustSpell("starter-heal")),
      false,
    );
    assert.equal(
      canExecuteSummonHealBuffCast({
        currentAp: SUMMON_AP.healer,
        spell: mustSpell("spell-rallying-cry"),
        origin,
        targetCell: origin,
      }),
      false,
      "wisp maxAp 2 cannot spend Rallying Cry 4 — decide must not pick it",
    );
    assert.equal(
      canExecuteSummonHealBuffCast({
        currentAp: SUMMON_AP.healer,
        spell: mustSpell("starter-heal"),
        origin,
        targetCell: origin,
      }),
      false,
    );
    assert.equal(
      executeSummonHealBuffCast({
        currentAp: 2,
        spell: mustSpell("spell-rallying-cry"),
        origin,
        targetCell: origin,
      }),
      null,
    );
  });

  it("cannot execute Strike or Iron Skin as a kit heal+buff even when in range", () => {
    const origin = { x: 4, y: 4 };
    assert.equal(
      canExecuteSummonHealBuffCast({
        currentAp: 4,
        spell: physicalAttackSpell,
        origin,
        targetCell: origin,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonHealBuffCast({
        currentAp: 4,
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: origin,
      }),
      false,
    );
    assert.equal(
      executeSummonHealBuffCast({
        currentAp: 4,
        spell: mustSpell("starter-shield"),
        origin,
        targetCell: origin,
      }),
      null,
    );
    assert.equal(
      summonHealBuffHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });
});
