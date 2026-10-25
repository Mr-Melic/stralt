/**
 * Combat action parity: pack-enemy `decideCaster` wounded-retreat vs
 * advertised in-range Frost. A decided legal Frost dest (living hostile
 * in Chebyshev range, caster HP below 30% so live would retreat) is
 * executable; an illegal dest cannot execute; live still retreats.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ENEMY_RETREAT_HP_PCT } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxEnemyCasterRetreatFrostCast,
  isWxEnemyCasterRetreatFrostBlockedBuffSpell,
  isWxEnemyCasterRetreatFrostBlockedDotSpell,
  isWxEnemyCasterRetreatFrostHealKitSpell,
  isWxEnemyCasterRetreatFrostSpell,
  pickWxEnemyCasterRetreatFrostSpell,
  shouldDecideWxEnemyCasterRetreatFrostCast,
  wxEnemyCasterLiveWouldRetreatForFrost,
  wxEnemyCasterRetreatFrostCasterWouldRetreat,
  wxEnemyCasterRetreatFrostHighlightedTargetIsExecutable,
  wxEnemyCasterRetreatFrostInRange,
  wxEnemyCasterRetreatFrostKitIsHealer,
  wxEnemyCasterRetreatFrostLivePickBestDamageSpell,
  wxEnemyCasterRetreatFrostRange,
} from "./wxEnemyCasterRetreatFrost.ts";

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

describe("WX enemy decideCaster wounded-retreat vs advertised Frost", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const frostDest = { x: 7, y: 4 };
  const woundedBishop = casterAt("bishop-1", 4, 4, 20, 100);
  const healthyBishop = casterAt("bishop-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];

  it("treats catalog Frost Bolt as the wounded-retreat fallback", () => {
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(frost.debuffStat, "mp");
    assert.equal(Number(frost.range), 4);
    assert.equal(isWxEnemyCasterRetreatFrostSpell(frost), true);
    assert.equal(wxEnemyCasterRetreatFrostRange(frost), enemySpellRange(frost));
    assert.equal(isWxEnemyCasterRetreatFrostHealKitSpell(frost), false);
    assert.equal(isWxEnemyCasterRetreatFrostHealKitSpell(mend), true);
    assert.equal(isWxEnemyCasterRetreatFrostHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(ENEMY_RETREAT_HP_PCT, 0.3);
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
    assert.equal(wxEnemyCasterRetreatFrostKitIsHealer([frost]), false);
    assert.equal(wxEnemyCasterRetreatFrostKitIsHealer([frost, mend]), true);
    assert.equal(wxEnemyCasterRetreatFrostKitIsHealer([frost, rally]), true);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell({
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
      isWxEnemyCasterRetreatFrostSpell({
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
    assert.equal(isWxEnemyCasterRetreatFrostSpell(physicalAttackSpell), false);
    assert.equal(isWxEnemyCasterRetreatFrostSpell(mend), false);
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell(mustSpell("spell-slow")),
      false,
      "#528/#762/#878 own 0-damage Slow",
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell(mustSpell("spell-iron-skin")),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell(mustSpell("starter-poison")),
      false,
      "#967 owns pack DoT decide",
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns player Frost Nova; hitsMultiple is not this leftover",
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostBlockedDotSpell(mustSpell("spell-inferno")),
      true,
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostBlockedDotSpell(mustSpell("starter-poison")),
      true,
    );
    assert.equal(
      isWxEnemyCasterRetreatFrostBlockedBuffSpell(mustSpell("spell-iron-skin")),
      true,
    );
  });

  it("live decideCaster still retreats below 30% HP before pickBestDamageSpell", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideCaster");
    assert.ok(start >= 0, "live decideCaster is present");
    const body = ai.slice(start, start + 2800);
    const retreatAt = body.indexOf("ENEMY_RETREAT_HP_PCT");
    const pickAt = body.indexOf("pickBestDamageSpell");
    assert.ok(retreatAt >= 0, "decideCaster still gates on retreat HP");
    assert.ok(pickAt >= 0, "decideCaster still calls pickBestDamageSpell");
    assert.ok(
      retreatAt < pickAt,
      "retreat still returns before the Frost pick",
    );
    assert.ok(body.includes('intent: "retreat"'));
    assert.equal(
      wxEnemyCasterRetreatFrostCasterWouldRetreat(woundedBishop),
      true,
    );
    assert.equal(
      wxEnemyCasterRetreatFrostCasterWouldRetreat(healthyBishop),
      false,
    );
    assert.equal(
      wxEnemyCasterRetreatFrostCasterWouldRetreat(
        casterAt("bishop-1", 4, 4, 30, 100),
      ),
      false,
      "hpFrac 0.3 is not < ENEMY_RETREAT_HP_PCT",
    );
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForFrost({
        availableSpells: [frost],
        caster: woundedBishop,
        opponents,
      }),
      true,
    );
    assert.equal(
      wxEnemyCasterRetreatFrostLivePickBestDamageSpell({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
      })?.id,
      "starter-frost",
      "Frost at Chebyshev 3 is the live damage pick if retreat did not run",
    );
  });

  it("picks in-range Frost when live would retreat a wounded caster", () => {
    const occupant = playerAt("player", 7, 4);
    const available = [frost];
    assert.equal(
      wxEnemyCasterRetreatFrostInRange(origin, frostDest, frost),
      true,
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        availableSpells: available,
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedBishop,
      })?.id,
      "starter-frost",
    );
    const decided = shouldDecideWxEnemyCasterRetreatFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: woundedBishop,
      casterSide: "enemy",
    });
    const executable = canExecuteWxEnemyCasterRetreatFrostCast({
      spell: frost,
      availableSpells: available,
      origin,
      targetCell: frostDest,
      occupant,
      opponents,
      caster: woundedBishop,
      casterSide: "enemy",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxEnemyCasterRetreatFrostHighlightedTargetIsExecutable({
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
    assert.equal(
      wxEnemyCasterRetreatFrostInRange(origin, tooFar, frost),
      false,
    );
    const base = {
      spell: frost,
      availableSpells: available,
      origin,
      opponents,
      caster: woundedBishop,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: { id: "bishop-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        targetCell: frostDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxEnemyCasterRetreatFrostHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when the caster is healthy (live already casts)", () => {
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForFrost({
        availableSpells: [frost],
        caster: healthyBishop,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: healthyBishop,
      }),
      null,
      "healthy caster already reaches pickBestDamageSpell (#762)",
    );
  });

  it("does not steal healer self-heal (#985), guard (#1034), or approach (#1026)", () => {
    const woundedQueen = casterAt("queen-1", 4, 4, 20, 100);
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForFrost({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        caster: woundedQueen,
        opponents,
      }),
      false,
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        assignedSpells: [frost, mend],
        availableSpells: [frost, mend],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedQueen,
      }),
      null,
      "#985 / #1034 own queen z>=1 heal leftovers",
    );
  });

  it("does not steal queen Inferno+heal or rook Iron Skin leftovers", () => {
    const inferno = mustSpell("spell-inferno");
    const iron = mustSpell("spell-iron-skin");
    const woundedQueen = casterAt("queen-1", 4, 4, 20, 100);
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        assignedSpells: [inferno, mend],
        availableSpells: [inferno, mend],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedQueen,
      }),
      null,
      "queen z>=2 Inferno stays #967 / #1039",
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        availableSpells: [inferno],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedBishop,
      }),
      null,
      "Inferno-only is #967 — live damage>0 pick is empty",
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        availableSpells: [iron],
        origin,
        targetCell: origin,
        opponents,
        caster: woundedBishop,
      }),
      null,
      "Iron Skin stays #978",
    );
  });

  it("king assigned Rallying Cry still infers healer and yields", () => {
    const king = casterAt("king-1", 4, 4, 20, 100);
    assert.equal(
      wxEnemyCasterLiveWouldRetreatForFrost({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        caster: king,
        opponents,
      }),
      false,
      "assigned Rallying Cry infers healer even when usableByEnemy drops it",
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        opponents,
        caster: king,
      }),
      null,
    );
  });

  it("bishop Poison+Frost still picks Frost, not the DoT leftover", () => {
    const poison = mustSpell("starter-poison");
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        availableSpells: [frost, poison],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedBishop,
      })?.id,
      "starter-frost",
    );
    assert.equal(
      pickWxEnemyCasterRetreatFrostSpell({
        availableSpells: [poison],
        origin,
        targetCell: frostDest,
        opponents,
        caster: woundedBishop,
      }),
      null,
      "#967 owns Poison when Frost is absent",
    );
  });

  it("still decides wall-blocked Frost (WX skips LoS) and does not debit AP", () => {
    assert.equal(Number(frost.apCost), 3);
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        spell: frost,
        availableSpells: [frost],
        origin,
        targetCell: frostDest,
        occupant: playerAt("player", 7, 4),
        opponents,
        caster: woundedBishop,
        casterSide: "enemy",
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
      caster: woundedBishop,
      casterSide: "enemy" as const,
    };
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        spell: mustSpell("spell-slow"),
        availableSpells: [mustSpell("spell-slow")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        spell: mustSpell("spell-inferno"),
        availableSpells: [mustSpell("spell-inferno")],
      }),
      false,
    );
    assert.equal(
      canExecuteWxEnemyCasterRetreatFrostCast({
        ...base,
        spell: mend,
        availableSpells: [frost, mend],
        assignedSpells: [frost, mend],
        caster: casterAt("queen-1", 4, 4, 20, 100),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
