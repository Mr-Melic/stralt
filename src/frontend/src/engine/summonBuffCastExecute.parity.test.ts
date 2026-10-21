/**
 * Combat action parity: summon kit buff-only decide matches applyCast.
 * A decided legal advertised Shield is executable with advertised RES;
 * Iron Skin on a 2-AP golem cannot execute; live applyEffect writes no
 * RES row.
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
  canAffordSummonBuffCast,
  canExecuteSummonBuffCast,
  executeSummonBuffCast,
  isSummonBuffExecuteSpell,
  shouldDecideSummonBuffCast,
  summonBuffApplyCastKinds,
  summonBuffApplyCell,
  summonBuffCastApCost,
  summonBuffEffectFields,
  summonBuffHighlightedTargetIsExecutable,
  summonBuffInRange,
  summonBuffLegacyApplyCastFields,
} from "./summonBuffCastExecute.ts";
import { enemyCastRangeOk } from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function guardianKitIds(src: string): string[] {
  const match = src.match(/guardian:\s*\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/);
  return match ? [match[1], match[2]] : [];
}

describe("summon kit advertised buff vs applyCast", () => {
  it("treats catalog Shield and Iron Skin as buff-only execute spells", () => {
    const shield = mustSpell("starter-shield");
    assert.equal(shield.spellType, "damage");
    assert.equal(Number(shield.damage), 0);
    assert.equal(Number(shield.healAmount ?? 0), 0);
    assert.equal(shield.buffStat, "res");
    assert.equal(Number(shield.buffModifier), 1.3);
    assert.equal(Number(shield.buffDuration), 3);
    assert.equal(Number(shield.range), 3);
    assert.equal(shield.targetType, "ally");
    assert.equal(isSummonBuffExecuteSpell(shield), true);
    assert.equal(isSummonBuffExecuteSpell(mustSpell("spell-iron-skin")), true);
  });

  it("guardian kit first ids are Shield then Iron Skin", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(guardianKitIds(src), [
      "starter-shield",
      "spell-iron-skin",
    ]);
    assert.equal(SUMMON_AP.guardian, 2);
  });

  it("does not steal Strike, Slow, Rallying Cry, Blood Mend, Poison, or Inferno", () => {
    assert.equal(isSummonBuffExecuteSpell(physicalAttackSpell), false);
    assert.equal(isSummonBuffExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isSummonBuffExecuteSpell(mustSpell("spell-rallying-cry")),
      false,
      "#862 owns heal+buff Rallying Cry CHC",
    );
    assert.equal(
      isSummonBuffExecuteSpell(mustSpell("starter-heal")),
      false,
      "#862 owns Blood Mend heal+buff",
    );
    assert.equal(
      isSummonBuffExecuteSpell(mustSpell("starter-poison")),
      false,
      "#856 owns Poison ticks",
    );
    assert.equal(
      isSummonBuffExecuteSpell(mustSpell("spell-inferno")),
      false,
      "#799 owns bomber Inferno",
    );
    assert.equal(isSummonBuffExecuteSpell(mustSpell("spell-swap")), false);
    assert.equal(isSummonBuffExecuteSpell(mustSpell("spell-mark")), false);
    assert.equal(isSummonBuffExecuteSpell(mustSpell("spell-mirror")), false);
  });

  it("live applyCast kinds effect Shield but miss advertised RES", () => {
    const shield = mustSpell("starter-shield");
    assert.deepEqual(summonBuffApplyCastKinds(shield, true), ["effect"]);
    assert.equal(
      summonBuffApplyCastKinds(shield, true).includes("heal"),
      false,
      "0 healAmount never takes the #862 heal return",
    );
    assert.deepEqual(summonBuffLegacyApplyCastFields(shield), {
      type: "buff",
      duration: 3,
    });
    assert.equal(
      "stat" in summonBuffLegacyApplyCastFields(shield),
      false,
      "live applyEffect omits buffStat",
    );
    assert.deepEqual(
      summonBuffApplyCastKinds(mustSpell("starter-heal"), true),
      ["heal"],
    );
    assert.deepEqual(summonBuffApplyCastKinds(physicalAttackSpell, true), [
      "damage",
    ]);
  });

  it("executes Shield on the ward tile, not the golem", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 4, y: 4 };
    const ward = { x: 6, y: 5 };
    assert.equal(
      enemyCastRangeOk(origin, ward, shield),
      true,
      "Chebyshev 2 <= Shield range 3",
    );
    assert.deepEqual(summonBuffApplyCell(shield, origin, ward), ward);
    const decided = shouldDecideSummonBuffCast({
      currentAp: 2,
      spell: shield,
      origin,
      targetCell: ward,
    });
    const executable = canExecuteSummonBuffCast({
      currentAp: 2,
      spell: shield,
      origin,
      targetCell: ward,
    });
    assert.equal(summonBuffInRange(origin, ward, shield), true);
    assert.equal(summonBuffCastApCost(shield), 2);
    assert.equal(canAffordSummonBuffCast(2, shield), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonBuffHighlightedTargetIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeSummonBuffCast({
        currentAp: 2,
        spell: shield,
        origin,
        targetCell: ward,
      }),
      {
        tile: { x: 6, y: 5 },
        buff: { stat: "res", modifier: 1.3, duration: 3 },
      },
    );
    assert.deepEqual(summonBuffEffectFields(shield), {
      stat: "res",
      modifier: 1.3,
      duration: 3,
    });
  });

  it("applies advertised RES through getStatModifier; live applyEffect cannot", () => {
    const shield = mustSpell("starter-shield");
    const advertised = executeSummonBuffCast({
      currentAp: 2,
      spell: shield,
      origin: { x: 2, y: 2 },
      targetCell: { x: 4, y: 2 },
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("player", "res", [
        {
          targetId: "player",
          type: "buff",
          stat: advertised.buff.stat,
          modifier: advertised.buff.modifier,
        },
      ]),
      1.3,
    );
    const legacy = summonBuffLegacyApplyCastFields(shield);
    assert.equal(
      getStatModifier("player", "res", [
        {
          targetId: "player",
          type: legacy.type,
          duration: legacy.duration,
        },
      ]),
      1,
      "applyEffect without buffStat is a no-op RES write",
    );
  });

  it("cannot execute Shield out of range or at 1 AP", () => {
    const shield = mustSpell("starter-shield");
    const origin = { x: 4, y: 4 };
    assert.equal(
      canExecuteSummonBuffCast({
        currentAp: 2,
        spell: shield,
        origin,
        targetCell: { x: 8, y: 4 },
      }),
      false,
      "Chebyshev 4 > Shield range 3",
    );
    assert.equal(
      canExecuteSummonBuffCast({
        currentAp: 1,
        spell: shield,
        origin,
        targetCell: { x: 5, y: 4 },
      }),
      false,
    );
    assert.equal(
      executeSummonBuffCast({
        currentAp: 1,
        spell: shield,
        origin,
        targetCell: { x: 5, y: 4 },
      }),
      null,
    );
  });

  it("executes Iron Skin advertised RES on self when AP is 3", () => {
    const skin = mustSpell("spell-iron-skin");
    const origin = { x: 3, y: 5 };
    assert.equal(summonBuffCastApCost(skin), 3);
    assert.equal(skin.buffStat, "res");
    assert.equal(Number(skin.buffModifier), 1.3);
    assert.deepEqual(
      executeSummonBuffCast({
        currentAp: 3,
        spell: skin,
        origin,
        targetCell: origin,
      }),
      {
        tile: { x: 3, y: 5 },
        buff: { stat: "res", modifier: 1.3, duration: 3 },
      },
    );
    assert.equal(
      executeSummonBuffCast({
        currentAp: 3,
        spell: mustSpell("starter-heal"),
        origin,
        targetCell: origin,
      }),
      null,
    );
  });

  it("cannot execute Iron Skin on a 2-AP golem", () => {
    const origin = { x: 4, y: 4 };
    assert.equal(
      canAffordSummonBuffCast(SUMMON_AP.guardian, mustSpell("spell-iron-skin")),
      false,
    );
    assert.equal(
      canExecuteSummonBuffCast({
        currentAp: SUMMON_AP.guardian,
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: origin,
      }),
      false,
      "golem maxAp 2 cannot spend Iron Skin 3 — decide must not pick it",
    );
    assert.equal(
      executeSummonBuffCast({
        currentAp: 2,
        spell: mustSpell("spell-iron-skin"),
        origin,
        targetCell: origin,
      }),
      null,
    );
    assert.equal(
      canAffordSummonBuffCast(SUMMON_AP.guardian, mustSpell("starter-shield")),
      true,
      "Shield 2 AP is the live guardian buff that still drops RES",
    );
  });

  it("cannot execute Strike or Rallying Cry as a kit buff even when in range", () => {
    const origin = { x: 4, y: 4 };
    assert.equal(
      canExecuteSummonBuffCast({
        currentAp: 4,
        spell: physicalAttackSpell,
        origin,
        targetCell: origin,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonBuffCast({
        currentAp: 4,
        spell: mustSpell("spell-rallying-cry"),
        origin,
        targetCell: origin,
      }),
      false,
    );
    assert.equal(
      executeSummonBuffCast({
        currentAp: 4,
        spell: mustSpell("spell-slow"),
        origin,
        targetCell: origin,
      }),
      null,
    );
    assert.equal(
      summonBuffHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });
});
