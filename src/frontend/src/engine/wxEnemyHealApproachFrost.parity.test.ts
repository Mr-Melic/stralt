/**
 * Combat action parity: pack-enemy `decideHealer` approach-ally vs
 * advertised in-range Frost. A decided legal Frost dest (living hostile
 * in Chebyshev range, wounded ally out of range-0 Blood Mend) is
 * executable; an illegal dest cannot execute; live still approaches.
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
  canExecuteWxEnemyHealApproachFrostCast,
  isWxEnemyHealApproachBlockedBuffSpell,
  isWxEnemyHealApproachBlockedDotSpell,
  isWxEnemyHealApproachFrostSpell,
  isWxEnemyHealApproachTriggerSpell,
  isWxEnemyHealApproachWoundedAlly,
  pickWxEnemyHealApproachFrostSpell,
  pickWxEnemyHealApproachTriggerSpell,
  shouldDecideWxEnemyHealApproachFrostCast,
  wxEnemyHealApproachFrostHighlightedTargetIsExecutable,
  wxEnemyHealApproachFrostInRange,
  wxEnemyHealApproachFrostRange,
  wxEnemyHealApproachLivePickBestDamageSpell,
  wxEnemyHealApproachTriggerRequiresZeroRange,
  wxEnemyHealLiveWouldApproachWoundedAlly,
} from "./wxEnemyHealApproachFrost.ts";

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

describe("WX enemy decideHealer approach vs advertised Frost", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const frostDest = { x: 7, y: 4 };
  const wounded = allyAt("pawn-1", 6, 4, 20, 100);

  it("treats catalog Blood Mend as range-0 heal trigger and Frost Bolt as fallback", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(Number(mend.damage), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.range), 0);
    assert.equal(mend.targetType, "self");
    assert.equal(isWxEnemyHealApproachTriggerSpell(mend), true);
    assert.equal(wxEnemyHealApproachTriggerRequiresZeroRange(mend), true);
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(frost.debuffStat, "mp");
    assert.equal(Number(frost.range), 4);
    assert.equal(isWxEnemyHealApproachFrostSpell(frost), true);
    assert.equal(wxEnemyHealApproachFrostRange(frost), enemySpellRange(frost));
    assert.equal(isWxEnemyHealApproachTriggerSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("queen z>=1 kit carries Frost + Blood Mend; king Rallying Cry is not usableByEnemy", () => {
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
    assert.equal(buildEnemyKit("king", 1).includes("starter-frost"), true);
    assert.equal(buildEnemyKit("rook", 1).includes("starter-heal"), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyHealApproachTriggerSpell({
        spellType: "heal",
        damage: 0,
        healAmount: 12,
        range: 0,
        targetType: "self",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell({
        spellType: "damage",
        damage: 20,
        debuffStat: "mp",
        debuffDuration: 1,
        range: 4,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell({
        spellType: "damage",
        damage: 20,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Strike-shaped damage without advertised MP is #762, not this leftover",
    );
    assert.equal(ENEMY_HEAL_ALLY_THRESHOLD_PCT, 0.5);
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Poison, Inferno, Nova, or heal", () => {
    assert.equal(isWxEnemyHealApproachFrostSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyHealApproachFrostSpell(mend), false);
    assert.equal(
      isWxEnemyHealApproachFrostSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyHealApproachFrostSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyHealApproachBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyHealApproachBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
    assert.equal(isWxEnemyHealApproachTriggerSpell(frost), false);
    assert.equal(
      isWxEnemyHealApproachTriggerSpell(mustSpell("starter-drain")),
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
    const available = [frost, mend];
    assert.equal(
      wxEnemyHealLiveWouldApproachWoundedAlly({
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
      wxEnemyHealApproachLivePickBestDamageSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
      })?.id,
      "starter-frost",
      "Frost at Chebyshev 3 is the live damage pick if decideCaster ran",
    );
  });

  it("picks in-range Frost when Blood Mend cannot reach a wounded ally", () => {
    const occupant = playerAt("player", 7, 4);
    const available = [frost, mend];
    assert.equal(
      wxEnemyHealApproachFrostInRange(origin, frostDest, frost),
      true,
    );
    assert.equal(
      pickWxEnemyHealApproachTriggerSpell(available)?.id,
      "starter-heal",
    );
    assert.equal(
      isWxEnemyHealApproachWoundedAlly({
        ally: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      })?.id,
      "starter-frost",
    );
    const decided = shouldDecideWxEnemyHealApproachFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      woundedAlly: wounded,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    const executable = canExecuteWxEnemyHealApproachFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      woundedAlly: wounded,
      casterSide: "enemy",
      casterId: "queen-1",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyHealApproachFrostHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("cannot execute Frost beyond range 4, on a corpse, ally, or empty tile", () => {
    const available = [frost, mend];
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, frost), false);
    assert.equal(wxEnemyHealApproachFrostInRange(origin, tooFar, frost), false);
    const base = {
      spell: frost,
      availableSpells: available,
      origin,
      woundedAlly: wounded,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: { id: "queen-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyHealApproachFrostHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when there is no wounded ally (live already falls through)", () => {
    const available = [frost, mend];
    const healthy = allyAt("pawn-1", 6, 4, 60, 100);
    assert.equal(
      isWxEnemyHealApproachWoundedAlly({
        ally: healthy,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        woundedAlly: healthy,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "#985 owns self-heal / caster fallback when no wounded ally",
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        woundedAlly: null,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
    );
  });

  it("does not steal a wounded ally already in Blood Mend range", () => {
    const overlapAlly = allyAt("pawn-1", 4, 4, 20, 100);
    const available = [frost, mend];
    assert.equal(enemyCastRangeOk(origin, overlapAlly, mend), true);
    assert.equal(
      wxEnemyHealLiveWouldApproachWoundedAlly({
        availableSpells: available,
        origin,
        woundedAlly: overlapAlly,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      false,
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        woundedAlly: overlapAlly,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "live heal branch owns in-range wounded allies",
    );
  });

  it("does not steal queen Inferno+heal or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    const dest = { x: 7, y: 4 };
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: [inferno, mend],
        origin,
        targetCell: dest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "queen z>=2 Inferno stays #967",
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: [frost, inferno, mend],
        origin,
        targetCell: dest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      null,
      "in-range Inferno leftover is not this Frost fill",
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
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

  it("king Rallying Cry filtered from availableSpells does not invent approach", () => {
    const available = [frost];
    assert.equal(pickWxEnemyHealApproachTriggerSpell(available), null);
    assert.equal(
      wxEnemyHealLiveWouldApproachWoundedAlly({
        availableSpells: available,
        origin,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "king-1",
      }),
      false,
      "usableByEnemy false drops Rallying Cry; live already falls through to Frost",
    );
    assert.equal(
      pickWxEnemyHealApproachFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "king-1",
      }),
      null,
    );
  });

  it("still decides wall-blocked Frost (picker skips LoS) and does not debit AP", () => {
    const available = [frost, mend];
    assert.equal(Number(frost.apCost), 3);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        spell: frost,
        availableSpells: available,
        origin,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4),
        woundedAlly: wounded,
        casterSide: "enemy",
        casterId: "queen-1",
      }),
      true,
      "catalog Frost has no lineOfSight flag; healer / WX skip LoS",
    );
  });

  it("cannot decide Strike, Slow, Iron Skin, Drain, or Inferno as this Frost leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: frostDest,
      occupant,
      woundedAlly: wounded,
      casterSide: "enemy" as const,
      casterId: "queen-1",
    };
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell, mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow"), mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        availableSpells: [mustSpell("spell-inferno"), mend],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyHealApproachFrostCast({
        ...base,
        spell: mend,
        availableSpells: [frost, mend],
      }),
      false,
      "#989 owns the empty-damage heal picker; do not remap dest onto the caster",
    );
  });
});
