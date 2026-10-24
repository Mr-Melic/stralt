/**
 * Combat action parity: pack-enemy `decideHealer` approach-ally vs
 * advertised in-range Inferno. A decided legal Inferno dest (living
 * hostile in Chebyshev range, wounded ally out of range-0 Blood Mend)
 * is executable; an illegal dest cannot execute; live still approaches.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ENEMY_HEAL_ALLY_THRESHOLD_PCT } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyHealApproachDotCast,
  isWxEnemyHealApproachDotBlockedFrostSpell,
  isWxEnemyHealApproachDotSpell,
  isWxEnemyHealApproachDotTriggerSpell,
  isWxEnemyHealApproachDotWoundedAlly,
  pickWxEnemyHealApproachDotSpell,
  pickWxEnemyHealApproachDotTriggerSpell,
  shouldDecideWxEnemyHealApproachDotCast,
  wxEnemyHealApproachDotHighlightedTargetIsExecutable,
  wxEnemyHealApproachDotInRange,
  wxEnemyHealApproachDotLivePickBestDamageSpell,
  wxEnemyHealApproachDotPerTurn,
  wxEnemyHealApproachDotRange,
  wxEnemyHealApproachDotTriggerRequiresZeroRange,
  wxEnemyHealLiveWouldApproachWoundedAllyForDot,
} from "./wxEnemyHealApproachDot.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function allyAt(id: string, x: number, y: number, hp: number, maxHp: number) {
  return { id, x, y, hp, maxHp, side: "enemy" as const };
}

describe("WX enemy decideHealer approach vs advertised Inferno", () => {
  const mend = mustSpell("starter-heal");
  const frost = mustSpell("starter-frost");
  const inferno = mustSpell("spell-inferno");
  const origin = { x: 4, y: 4 };
  const infernoDest = { x: 7, y: 4 };
  const wounded = allyAt("pawn-1", 6, 4, 20, 100);

  it("treats catalog Blood Mend as range-0 heal trigger and Inferno as DoT fallback", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.damage), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(isWxEnemyHealApproachDotTriggerSpell(mend), true);
    assert.equal(wxEnemyHealApproachDotTriggerRequiresZeroRange(mend), true);
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.effectType, "dot");
    assert.equal(inferno.isDotSpell, true);
    assert.equal(wxEnemyHealApproachDotPerTurn(inferno), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(isWxEnemyHealApproachDotSpell(inferno), true);
    assert.equal(
      wxEnemyHealApproachDotRange(inferno),
      enemySpellRange(inferno),
    );
    assert.equal(isWxEnemyHealApproachDotBlockedFrostSpell(frost), true);
    assert.equal(isWxEnemyHealApproachDotSpell(frost), false);
  });

  it("queen z>=2 kit carries Inferno + Blood Mend; z=1 stays Frost", () => {
    assert.deepEqual(buildEnemyKit("queen", 2), [
      "spell-inferno",
      "starter-heal",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.equal(buildEnemyKit("bishop", 1).includes("starter-heal"), false);
    assert.equal(buildEnemyKit("bishop", 1).includes("starter-poison"), true);
    assert.equal(buildEnemyKit("rook", 1).includes("starter-heal"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealApproachDotTriggerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealApproachDotSpell({
        spellType: "damage",
        damage: 0,
        effectType: "dot",
        isDotSpell: true,
        dotDamagePerTurn: 8,
        dotDuration: 3,
        range: 3,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealApproachDotSpell({
        spellType: "damage",
        damage: 20,
        debuffStat: "mp",
        debuffDuration: 1,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Frost-shaped damage+MP is #1026, not this leftover",
    );
    assert.equal(ENEMY_HEAL_ALLY_THRESHOLD_PCT, 0.5);
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Frost, Nova, or heal", () => {
    assert.equal(isWxEnemyHealApproachDotSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyHealApproachDotSpell(mend), false);
    assert.equal(isWxEnemyHealApproachDotSpell(frost), false);
    assert.equal(
      isWxEnemyHealApproachDotSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealApproachDotSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyHealApproachDotSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealApproachDotSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(isWxEnemyHealApproachDotTriggerSpell(inferno), false);
    assert.equal(
      isWxEnemyHealApproachDotTriggerSpell(mustSpell("starter-drain")),
      false,
    );
  });

  it("live decideHealer still approaches an out-of-range wounded ally", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideHealer");
    assert.ok(start >= 0, "live decideHealer is present");
    const body = ai.slice(start, start + 4500);
    assert.ok(body.includes("Move toward the wounded ally"));
    assert.ok(body.includes("approach-ally"));
    assert.ok(body.includes("wounded-out-of-range"));
    assert.ok(body.includes("decideCaster"));
    const available = [inferno, mend];
    assert.equal(
      wxEnemyHealLiveWouldApproachWoundedAllyForDot({
        availableSpells: available,
        origin,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
    );
    assert.equal(enemyCastRangeOk(origin, wounded, mend), false);
    assert.equal(
      wxEnemyHealApproachDotLivePickBestDamageSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
      }),
      null,
      "Inferno damage 0 is skipped by live pickBestDamageSpell; that hole is #967 once decideCaster runs",
    );
  });

  it("picks in-range Inferno when Blood Mend cannot reach a wounded ally", () => {
    const occupant = playerAt("player", 7, 4);
    const available = [inferno, mend];
    assert.equal(
      wxEnemyHealApproachDotInRange(origin, infernoDest, inferno),
      true,
    );
    assert.equal(
      pickWxEnemyHealApproachDotTriggerSpell(available)?.id,
      "starter-heal",
    );
    assert.equal(
      isWxEnemyHealApproachDotWoundedAlly({
        ally: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      })?.id,
      "spell-inferno",
    );
    const decided = shouldDecideWxEnemyHealApproachDotCast({
      spell: inferno,
      availableSpells: available,
      origin,
      targetCell: infernoDest,
      occupant,
      woundedAlly: wounded,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    const executable = canExecuteWxEnemyHealApproachDotCast({
      spell: inferno,
      availableSpells: available,
      origin,
      targetCell: infernoDest,
      occupant,
      woundedAlly: wounded,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealApproachDotHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("cannot execute Inferno beyond range 3, on a corpse, ally, or empty tile", () => {
    const available = [inferno, mend];
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, inferno), false);
    assert.equal(wxEnemyHealApproachDotInRange(origin, tooFar, inferno), false);
    const base = {
      spell: inferno,
      availableSpells: available,
      origin,
      woundedAlly: wounded,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        targetCell: infernoDest,
        occupant: { id: "queen-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        targetCell: infernoDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealApproachDotHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when there is no wounded ally (live already falls through to #967)", () => {
    const available = [inferno, mend];
    const healthy = allyAt("pawn-1", 6, 4, 60, 100);
    assert.equal(
      isWxEnemyHealApproachDotWoundedAlly({
        ally: healthy,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        woundedAlly: healthy,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "#967 owns DoT decide once decideCaster runs; #985 owns self-heal when no wounded ally",
    );
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        woundedAlly: null,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
    );
  });

  it("does not steal a wounded ally already in Blood Mend range", () => {
    const overlapAlly = allyAt("pawn-1", 4, 4, 20, 100);
    const available = [inferno, mend];
    assert.equal(enemyCastRangeOk(origin, overlapAlly, mend), true);
    assert.equal(
      wxEnemyHealLiveWouldApproachWoundedAllyForDot({
        availableSpells: available,
        origin,
        woundedAlly: overlapAlly,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        woundedAlly: overlapAlly,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "live heal branch owns in-range wounded allies",
    );
  });

  it("does not steal queen z=1 Frost+heal; yields to #1026", () => {
    const dest = { x: 7, y: 4 };
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: [frost, mend],
        origin,
        targetCell: dest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "queen z=1 Frost stays #1026",
    );
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: [inferno, frost, mend],
        origin,
        targetCell: dest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      })?.id,
      "spell-inferno",
      "when both nukes are present, this leftover is the 0-damage DoT; Frost helper yields",
    );
  });

  it("does not steal rook Iron Skin leftovers", () => {
    const iron = mustSpell("spell-iron-skin");
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: [iron, mend],
        origin,
        targetCell: origin,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "Iron Skin stays #978",
    );
  });

  it("bishop poison without Blood Mend does not invent healer approach", () => {
    const poison = mustSpell("starter-poison");
    const available = [frost, poison];
    assert.equal(isWxEnemyHealApproachDotSpell(poison), true);
    assert.equal(pickWxEnemyHealApproachDotTriggerSpell(available), null);
    assert.equal(
      wxEnemyHealLiveWouldApproachWoundedAllyForDot({
        availableSpells: available,
        origin,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "bishop-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealApproachDotSpell({
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "bishop-1",
      }),
      null,
    );
  });

  it("still decides wall-blocked Inferno (picker skips LoS) and does not debit AP", () => {
    const available = [inferno, mend];
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(Number(inferno.cooldown), 3, "#972 owns advertised CD 3");
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        spell: inferno,
        availableSpells: available,
        origin,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4),
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
      "catalog Inferno has no lineOfSight flag; healer / WX skip LoS",
    );
  });

  it("cannot decide Strike, Slow, Iron Skin, Drain, Frost, or heal as this DoT leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: infernoDest,
      occupant,
      woundedAlly: wounded,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell, mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow"), mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        spell: frost,
        availableSpells: [frost, mend],
      }),
      false,
      "#1026 owns the Frost approach fill",
    );
    assert.equal(
      canExecuteWxEnemyHealApproachDotCast({
        ...base,
        spell: mend,
        availableSpells: [inferno, mend],
      }),
      false,
      "#989 owns the empty-damage heal picker; do not remap dest onto the caster",
    );
  });
});
