/**
 * Combat action parity: pack-enemy `decideCaster` LoS-reposition vs
 * advertised in-range Frost. A decided legal Frost dest (living hostile
 * in Chebyshev range, LoS blocked so live would sidestep) is executable;
 * an illegal dest cannot execute; live still repositions.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AI_LOS_REPOSITION_ENABLED,
  ENEMY_RETREAT_HP_PCT,
} from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import {
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";
import {
  canExecuteWxEnemyCasterLosFrostCast,
  isWxEnemyCasterLosFrostBlockedBuffSpell,
  isWxEnemyCasterLosFrostBlockedDotSpell,
  isWxEnemyCasterLosFrostHealKitSpell,
  isWxEnemyCasterLosFrostSpell,
  pickWxEnemyCasterLosFrostSpell,
  shouldDecideWxEnemyCasterLosFrostCast,
  wxEnemyCasterLiveWouldRepositionLosForFrost,
  wxEnemyCasterLosFrostCasterWouldRetreat,
  wxEnemyCasterLosFrostHighlightedTargetIsExecutable,
  wxEnemyCasterLosFrostInRange,
  wxEnemyCasterLosFrostKitIsHealer,
  wxEnemyCasterLosFrostLivePickBestDamageSpell,
  wxEnemyCasterLosFrostRange,
  wxEnemyCasterLosFrostSpellRequiresLos,
} from "./wxEnemyCasterLosFrost.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function casterAt(id: string, x: number, y: number, hp: number, maxHp: number) {
  return { id, x, y, hp, maxHp, side: "enemy" as const };
}

describe("WX enemy decideCaster LoS-reposition vs advertised Frost", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const frostDest = { x: 7, y: 4 };
  const woundedBishop = casterAt("bishop-1", 4, 4, 20, 100);
  const healthyBishop = casterAt("bishop-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];

  it("treats catalog Frost Bolt as the LoS-reposition fallback", () => {
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(frost.debuffStat, "mp");
    assert.equal(Number(frost.range), 4);
    assert.equal(frost.lineOfSight, undefined);
    assert.equal(isWxEnemyCasterLosFrostSpell(frost), true);
    assert.equal(wxEnemyCasterLosFrostRange(frost), enemySpellRange(frost));
    assert.equal(wxEnemyCasterLosFrostSpellRequiresLos(frost), true);
    assert.equal(enemySpellRequiresLos(frost), true);
    assert.equal(isWxEnemyCasterLosFrostHealKitSpell(frost), false);
    assert.equal(isWxEnemyCasterLosFrostHealKitSpell(mend), true);
    assert.equal(isWxEnemyCasterLosFrostHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(ENEMY_RETREAT_HP_PCT, 0.3);
    assert.equal(AI_LOS_REPOSITION_ENABLED, true);
  });

  it("queen z=0 / bishop kits are Frost casters; heal kits start at z>=1", () => {
    assert.deepEqual(buildEnemyKit("queen", 0), ["starter-frost"]);
    assert.deepEqual(buildEnemyKit("bishop", 0), ["starter-frost"]);
    assert.deepEqual(buildEnemyKit("bishop", 1), [
      "starter-frost",
      "starter-poison",
    ]);
    assert.deepEqual(buildEnemyKit("queen", 1), [
      "starter-frost",
      "starter-heal",
    ]);
    assert.equal(buildEnemyKit("king", 1).includes("spell-rallying-cry"), true);
    assert.equal(buildEnemyKit("king", 1).includes("starter-frost"), true);
    assert.equal(wxEnemyCasterLosFrostKitIsHealer([frost]), false);
    assert.equal(wxEnemyCasterLosFrostKitIsHealer([frost, mend]), true);
    assert.equal(wxEnemyCasterLosFrostKitIsHealer([frost, rally]), true);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyCasterLosFrostSpell({
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
      isWxEnemyCasterLosFrostSpell({
        spellType: "damage",
        damage: 20,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Strike-shaped damage without advertised MP is #762, not this leftover",
    );
  });

  it("does not steal Strike, Slow, Iron Skin, Drain, Poison, Inferno, Nova, or heal", () => {
    assert.equal(isWxEnemyCasterLosFrostSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyCasterLosFrostSpell(mend), false);
    assert.equal(
      isWxEnemyCasterLosFrostSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyCasterLosFrostSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyCasterLosFrostSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyCasterLosFrostSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyCasterLosFrostSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyCasterLosFrostSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyCasterLosFrostBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyCasterLosFrostBlockedDotSpell(mustSpell("starter-poison")),
      true,
    );
    assert.equal(
      isWxEnemyCasterLosFrostBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
  });

  it("live decideCaster still sidesteps in-range LoS-blocked Frost after pickBestDamageSpell", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideCaster");
    assert.ok(start >= 0, "live decideCaster is present");
    const body = ai.slice(start, start + 4200);
    const retreatAt = body.indexOf("ENEMY_RETREAT_HP_PCT");
    const pickAt = body.indexOf("pickBestDamageSpell");
    const losAt = body.indexOf("enemySpellRequiresLos");
    const sidestepAt = body.indexOf("sidesteps for a shot");
    const intentAt = body.indexOf('intent: "reposition-los"');
    assert.ok(retreatAt >= 0, "decideCaster still gates on retreat HP");
    assert.ok(pickAt >= 0, "decideCaster still calls pickBestDamageSpell");
    assert.ok(losAt >= 0, "decideCaster still gates LoS-blocked Frost");
    assert.ok(sidestepAt >= 0, "decideCaster still logs sidestep");
    assert.ok(intentAt >= 0, "decideCaster still returns reposition-los");
    assert.ok(
      retreatAt < pickAt,
      "retreat still returns before the Frost pick",
    );
    assert.ok(pickAt < losAt, "LoS-reposition still runs after the Frost pick");
    assert.ok(
      losAt < sidestepAt,
      "sidestep still follows the LoS-required arm",
    );
    assert.equal(wxEnemyCasterLosFrostCasterWouldRetreat(woundedBishop), true);
    assert.equal(wxEnemyCasterLosFrostCasterWouldRetreat(healthyBishop), false);
    assert.equal(
      wxEnemyCasterLosFrostLivePickBestDamageSpell({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
      })?.id,
      "starter-frost",
      "Frost at Chebyshev 3 is the live damage pick if LoS did not block",
    );
  });

  it("picks in-range Frost when live would sidestep a healthy caster", () => {
    const occupant = playerAt("player", 7, 4);
    const available = [frost];
    assert.equal(wxEnemyCasterLosFrostInRange(origin, frostDest, frost), true);
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
        hasLoS: false,
      })?.id,
      "starter-frost",
    );
    const decided = shouldDecideWxEnemyCasterLosFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: healthyBishop,
      casterSide: "enemy",
      hasLoS: false,
    });
    const executable = canExecuteWxEnemyCasterLosFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: healthyBishop,
      casterSide: "enemy",
      hasLoS: false,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyCasterLosFrostHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("cannot execute Frost beyond range 4, on a corpse, ally, or empty tile", () => {
    const available = [frost];
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, frost), false);
    assert.equal(wxEnemyCasterLosFrostInRange(origin, tooFar, frost), false);
    const base = {
      spell: frost,
      availableSpells: available,
      origin,
      opponents,
      caster: healthyBishop,
      casterSide: "enemy" as const,
      hasLoS: false,
    };
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: { id: "bishop-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyCasterLosFrostHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when LoS is already clear (live already casts)", () => {
    assert.equal(
      wxEnemyCasterLiveWouldRepositionLosForFrost({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        caster: healthyBishop,
        opponents,
        hasLoS: true,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
        hasLoS: true,
      }),
      null,
      "clear LoS already reaches pickBestDamageSpell (#762)",
    );
  });

  it("does not steal wounded-retreat Frost (#1054)", () => {
    assert.equal(
      wxEnemyCasterLiveWouldRepositionLosForFrost({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        caster: woundedBishop,
        opponents,
        hasLoS: false,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedBishop,
        hasLoS: false,
      }),
      null,
      "#1054 owns wounded-retreat Frost",
    );
  });

  it("does not steal healer self-heal (#985), guard (#1034), or approach (#1026)", () => {
    const healthyQueen = casterAt("queen-1", 4, 4, 80, 100);
    assert.equal(
      wxEnemyCasterLiveWouldRepositionLosForFrost({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        origin,
        targetCell: frostDest,
        caster: healthyQueen,
        opponents,
        hasLoS: false,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyQueen,
        hasLoS: false,
      }),
      null,
      "#985 / #1034 own queen z>=1 heal leftovers",
    );
  });

  it("does not steal queen Inferno+heal or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    const healthyQueen = casterAt("queen-1", 4, 4, 80, 100);
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        assignedSpells: [inferno, mend],
        availableSpells: [inferno, mend],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyQueen,
        hasLoS: false,
      }),
      null,
      "queen z>=2 Inferno stays #967 / #1039",
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [inferno],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
        hasLoS: false,
      }),
      null,
      "Inferno-only is #967 — live damage>0 pick is empty",
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [iron],
        origin,
        targetCell: origin,
        opponents,
        caster: healthyBishop,
        hasLoS: false,
      }),
      null,
      "Iron Skin stays #978",
    );
  });

  it("king assigned Rallying Cry still infers healer and yields", () => {
    const king = casterAt("king-1", 4, 4, 80, 100);
    assert.equal(
      wxEnemyCasterLiveWouldRepositionLosForFrost({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        caster: king,
        opponents,
        hasLoS: false,
      }),
      false,
      "assigned Rallying Cry infers healer even when usableByEnemy drops it",
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: king,
        hasLoS: false,
      }),
      null,
    );
  });

  it("bishop Poison+Frost still picks Frost, not the DoT leftover", () => {
    const poison = mustSpell("starter-poison");
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [frost, poison],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
        hasLoS: false,
      })?.id,
      "starter-frost",
    );
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [poison],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
        hasLoS: false,
      }),
      null,
      "#967 owns Poison when Frost is absent",
    );
  });

  it("yields when the spell opts out of LoS (live already casts)", () => {
    const noLosFrost = { ...frost, lineOfSight: false };
    assert.equal(wxEnemyCasterLosFrostSpellRequiresLos(noLosFrost), false);
    assert.equal(
      pickWxEnemyCasterLosFrostSpell({
        availableSpells: [noLosFrost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
        hasLoS: false,
      }),
      null,
      "lineOfSight false skips the reposition-los arm",
    );
  });

  it("still decides wall-blocked Frost (WX skips LoS) and does not debit AP", () => {
    assert.equal(Number(frost.apCost), 3);
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        spell: frost,
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4),
        opponents,
        caster: healthyBishop,
        casterSide: "enemy",
        hasLoS: false,
      }),
      true,
      "catalog Frost has no lineOfSight flag; WX pack execute skips LoS",
    );
  });

  it("cannot decide Strike, Slow, Iron Skin, Drain, Inferno, or heal as this Frost leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: healthyBishop,
      casterSide: "enemy" as const,
      hasLoS: false,
    };
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        availableSpells: [mustSpell("spell-inferno")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterLosFrostCast({
        ...base,
        spell: mend,
        availableSpells: [frost, mend],
        assignedSpells: [frost, mend],
        caster: casterAt("queen-1", 4, 4, 80, 100),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
