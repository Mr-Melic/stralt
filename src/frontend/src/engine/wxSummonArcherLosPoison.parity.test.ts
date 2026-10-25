/**
 * Combat action parity: summon-archer `decideSummonArcher` LoS-reposition vs
 * advertised in-range Poison Arrow. A decided legal Poison dest (living
 * hostile in Chebyshev range, LoS blocked so live would sidestep) is
 * executable; an illegal dest cannot execute; live still repositions.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { AI_LOS_REPOSITION_ENABLED } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { enemyCastRangeOk, enemySpellRange } from "./targeting.ts";
import {
  canExecuteWxSummonArcherLosPoisonCast,
  isWxSummonArcherLosPoisonBlockedBuffSpell,
  isWxSummonArcherLosPoisonBlockedFrostSpell,
  isWxSummonArcherLosPoisonBlockedOtherDotSpell,
  isWxSummonArcherLosPoisonBlockedSlowSpell,
  isWxSummonArcherLosPoisonHealKitSpell,
  isWxSummonArcherLosPoisonSpell,
  pickWxSummonArcherLosPoisonSpell,
  shouldDecideWxSummonArcherLosPoisonCast,
  wxSummonArcherLiveWouldRepositionLosForPoison,
  wxSummonArcherLosPoisonHighlightedTargetIsExecutable,
  wxSummonArcherLosPoisonInRange,
  wxSummonArcherLosPoisonIsArcherUnit,
  wxSummonArcherLosPoisonKitIsArcher,
  wxSummonArcherLosPoisonKitIsHealer,
  wxSummonArcherLosPoisonLivePreferredSpell,
  wxSummonArcherLosPoisonRange,
  wxSummonArcherLosPoisonSpellRequiresLos,
} from "./wxSummonArcherLosPoison.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function archerAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  summonAI = "archer",
) {
  return {
    id,
    x,
    y,
    hp,
    maxHp,
    side: "enemy" as const,
    isSummon: true,
    summonAI,
    pieceType: "archer",
  };
}

describe("summon decideSummonArcher LoS-reposition vs advertised Poison", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const iron = mustSpell("spell-iron-skin");
  const origin = { x: 4, y: 4 };
  const poisonDest = { x: 7, y: 4 };
  const healthyArcher = archerAt("archer-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];
  const archerKit = [poison, slow];

  it("treats catalog Poison Arrow as the LoS-reposition fallback", () => {
    assert.equal(poison.spellType, "damage");
    assert.equal(Number(poison.damage), 0);
    assert.equal(poison.isDotSpell, true);
    assert.equal(poison.effectType, "dot");
    assert.equal(Number(poison.dotDamagePerTurn), 4);
    assert.equal(Number(poison.dotDuration), 3);
    assert.equal(Number(poison.range), 4);
    assert.equal(poison.lineOfSight, undefined);
    assert.equal(isWxSummonArcherLosPoisonSpell(poison), true);
    assert.equal(wxSummonArcherLosPoisonRange(poison), enemySpellRange(poison));
    assert.equal(wxSummonArcherLosPoisonSpellRequiresLos(poison), true);
    assert.equal(isWxSummonArcherLosPoisonHealKitSpell(poison), false);
    assert.equal(isWxSummonArcherLosPoisonHealKitSpell(mend), true);
    assert.equal(isWxSummonArcherLosPoisonHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(AI_LOS_REPOSITION_ENABLED, true);
  });

  it("archer kits are Poison+Slow; hunter/bomber/healer are not", () => {
    assert.equal(wxSummonArcherLosPoisonKitIsArcher(archerKit), true);
    assert.equal(wxSummonArcherLosPoisonKitIsArcher([poison]), false);
    assert.equal(wxSummonArcherLosPoisonKitIsArcher([slow]), false);
    assert.equal(
      wxSummonArcherLosPoisonKitIsArcher([physicalAttackSpell, venom]),
      false,
      "hunter Strike+Venom is #856, not this leftover",
    );
    assert.equal(wxSummonArcherLosPoisonKitIsArcher([inferno]), false);
    assert.equal(wxSummonArcherLosPoisonKitIsArcher([frost, poison]), false);
    assert.equal(wxSummonArcherLosPoisonKitIsArcher([frost, mend]), false);
    assert.equal(wxSummonArcherLosPoisonKitIsHealer([frost, mend]), true);
    assert.equal(wxSummonArcherLosPoisonKitIsHealer(archerKit), false);
    assert.equal(wxSummonArcherLosPoisonIsArcherUnit(healthyArcher), true);
    assert.equal(
      wxSummonArcherLosPoisonIsArcherUnit({ summonAI: "kiter" }),
      true,
    );
    assert.equal(
      wxSummonArcherLosPoisonIsArcherUnit({ summonAI: "hunter" }),
      false,
    );
    assert.equal(
      wxSummonArcherLosPoisonIsArcherUnit({ summonAI: "bomber" }),
      false,
    );
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isWxSummonArcherLosPoisonSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 4,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxSummonArcherLosPoisonSpell({
        spellType: "damage",
        damage: 20,
        debuffStat: "mp",
        debuffDuration: 1,
        range: 4,
        targetType: "enemy",
      }),
      false,
      "Frost-shaped damage with advertised MP is #1081, not this leftover",
    );
  });

  it("does not steal Strike, Slow, Frost, Iron Skin, Drain, Venom, Inferno, Nova, or heal", () => {
    assert.equal(isWxSummonArcherLosPoisonSpell(physicalAttackSpell), false);
    assert.equal(isWxSummonArcherLosPoisonSpell(slow), false);
    assert.equal(isWxSummonArcherLosPoisonSpell(frost), false);
    assert.equal(isWxSummonArcherLosPoisonSpell(mend), false);
    assert.equal(
      isWxSummonArcherLosPoisonSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxSummonArcherLosPoisonSpell(venom),
      false,
      "hunter Venom range 2 stays #856",
    );
    assert.equal(
      isWxSummonArcherLosPoisonSpell(inferno),
      false,
      "bomber Inferno range 3 stays #799 / #967",
    );
    assert.equal(
      isWxSummonArcherLosPoisonSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isWxSummonArcherLosPoisonSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxSummonArcherLosPoisonBlockedSlowSpell(slow), true);
    assert.equal(isWxSummonArcherLosPoisonBlockedFrostSpell(frost), true);
    assert.equal(isWxSummonArcherLosPoisonBlockedOtherDotSpell(venom), true);
    assert.equal(isWxSummonArcherLosPoisonBlockedOtherDotSpell(inferno), true);
    assert.equal(isWxSummonArcherLosPoisonBlockedBuffSpell(iron), true);
  });

  it("live decideSummonArcher still sidesteps in-range LoS-blocked Poison", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideSummonArcher");
    assert.ok(start >= 0, "live decideSummonArcher is present");
    const body = ai.slice(start, start + 4500);
    const poisonAt = body.indexOf("kit[0]");
    const slowAt = body.indexOf("kit[1]");
    const preferredAt = body.indexOf("poison ?? slow");
    const canCastAt = body.indexOf("aiCanCast");
    const losAt = body.indexOf("repositionForLOS");
    const sidestepAt = body.indexOf("sidesteps for a shot");
    const intentAt = body.indexOf('intent: "reposition-los"');
    assert.ok(poisonAt >= 0, "decideSummonArcher still looks up kit Poison");
    assert.ok(slowAt >= 0, "decideSummonArcher still looks up kit Slow");
    assert.ok(preferredAt >= 0, "decideSummonArcher still prefers Poison");
    assert.ok(canCastAt >= 0, "decideSummonArcher still gates on aiCanCast");
    assert.ok(losAt >= 0, "decideSummonArcher still repositions for LoS");
    assert.ok(sidestepAt >= 0, "decideSummonArcher still logs sidestep");
    assert.ok(intentAt >= 0, "decideSummonArcher still returns reposition-los");
    assert.ok(poisonAt < preferredAt, "Poison lookup still precedes preferred");
    assert.ok(preferredAt < canCastAt, "preferred still precedes aiCanCast");
    assert.ok(
      canCastAt < losAt,
      "LoS-reposition still runs after a failed cast",
    );
    assert.ok(losAt < sidestepAt, "sidestep still follows repositionForLOS");
    const inferStart = ai.indexOf("function inferSummonArchetype");
    const inferBody = ai.slice(inferStart, inferStart + 900);
    assert.ok(inferBody.includes('raw === "kiter"'));
    assert.ok(inferBody.includes('return "archer"'));
    assert.equal(
      wxSummonArcherLosPoisonLivePreferredSpell(archerKit)?.id,
      "starter-poison",
    );
  });

  it("picks in-range Poison when live would sidestep a healthy archer", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(
      wxSummonArcherLosPoisonInRange(origin, poisonDest, poison),
      true,
    );
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: archerKit,
        availableSpells: archerKit,
        origin,
        targetCell: poisonDest,
        opponents,
        archer: healthyArcher,
        hasLoS: false,
      })?.id,
      "starter-poison",
    );
    const decided = shouldDecideWxSummonArcherLosPoisonCast({
      spell: poison,
      assignedSpells: archerKit,
      availableSpells: archerKit,
      origin,
      targetCell: poisonDest,
      occupant,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy",
      hasLoS: false,
    });
    const executable = canExecuteWxSummonArcherLosPoisonCast({
      spell: poison,
      assignedSpells: archerKit,
      availableSpells: archerKit,
      origin,
      targetCell: poisonDest,
      occupant,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy",
      hasLoS: false,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      wxSummonArcherLosPoisonHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
  });

  it("kiter alias still infers archer and picks Poison", () => {
    const kiter = archerAt("kiter-1", 4, 4, 80, 100, "kiter");
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: archerKit,
        availableSpells: archerKit,
        origin,
        targetCell: poisonDest,
        opponents,
        archer: kiter,
        hasLoS: false,
      })?.id,
      "starter-poison",
    );
  });

  it("cannot execute Poison beyond range 4, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 9, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, poison), false);
    assert.equal(wxSummonArcherLosPoisonInRange(origin, tooFar, poison), false);
    const base = {
      spell: poison,
      assignedSpells: archerKit,
      availableSpells: archerKit,
      origin,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy" as const,
      hasLoS: false,
    };
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 9, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        targetCell: poisonDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        targetCell: poisonDest,
        occupant: { id: "archer-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        targetCell: poisonDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxSummonArcherLosPoisonHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when LoS is already clear (live already casts, #856)", () => {
    assert.equal(
      wxSummonArcherLiveWouldRepositionLosForPoison({
        assignedSpells: archerKit,
        availableSpells: archerKit,
        origin,
        targetCell: poisonDest,
        archer: healthyArcher,
        opponents,
        hasLoS: true,
      }),
      false,
    );
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: archerKit,
        availableSpells: archerKit,
        origin,
        targetCell: poisonDest,
        opponents,
        archer: healthyArcher,
        hasLoS: true,
      }),
      null,
      "clear LoS already reaches decideSummonArcher cast — #856 execute",
    );
  });

  it("does not steal pack caster Frost LoS (#1081) or healer Frost LoS (#1090)", () => {
    const bishop = {
      id: "bishop-1",
      x: 4,
      y: 4,
      hp: 80,
      maxHp: 100,
      side: "enemy" as const,
      pieceType: "bishop",
    };
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        availableSpells: [frost, poison],
        origin,
        targetCell: poisonDest,
        opponents,
        archer: bishop,
        hasLoS: false,
      }),
      null,
      "#1081 owns bishop Frost+Poison LoS",
    );
    const king = {
      id: "king-1",
      x: 4,
      y: 4,
      hp: 80,
      maxHp: 100,
      side: "enemy" as const,
      pieceType: "king",
    };
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: [frost, rally],
        availableSpells: [frost],
        origin,
        targetCell: poisonDest,
        opponents,
        archer: king,
        hasLoS: false,
      }),
      null,
      "#1090 owns king healer Frost LoS",
    );
  });

  it("does not steal hunter Venom (#856) or bomber Inferno (#799 / #967)", () => {
    const hunter = archerAt("wolf-1", 4, 4, 80, 100, "hunter");
    hunter.pieceType = "wolf";
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: [physicalAttackSpell, venom],
        availableSpells: [physicalAttackSpell, venom],
        origin,
        targetCell: { x: 6, y: 4 },
        opponents: [playerAt("player", 6, 4)],
        archer: hunter,
        hasLoS: false,
      }),
      null,
    );
    const bomber = archerAt("bomber-1", 4, 4, 80, 100, "bomber");
    bomber.pieceType = "bomber";
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: [inferno],
        availableSpells: [inferno],
        origin,
        targetCell: poisonDest,
        opponents,
        archer: bomber,
        hasLoS: false,
      }),
      null,
    );
  });

  it("does not steal Slow (#878) when Poison is absent", () => {
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: archerKit,
        availableSpells: [slow],
        origin,
        targetCell: { x: 6, y: 4 },
        opponents: [playerAt("player", 6, 4)],
        archer: healthyArcher,
        hasLoS: false,
      }),
      null,
      "Poison-empty preferred Slow stays #878",
    );
  });

  it("yields when the spell opts out of LoS (live already casts)", () => {
    const noLosPoison = { ...poison, lineOfSight: false };
    assert.equal(wxSummonArcherLosPoisonSpellRequiresLos(noLosPoison), false);
    assert.equal(
      pickWxSummonArcherLosPoisonSpell({
        assignedSpells: [noLosPoison, slow],
        availableSpells: [noLosPoison, slow],
        origin,
        targetCell: poisonDest,
        opponents,
        archer: healthyArcher,
        hasLoS: false,
      }),
      null,
      "lineOfSight false skips the reposition-los arm",
    );
  });

  it("still decides wall-blocked Poison (execute skips LoS) and does not debit AP", () => {
    assert.equal(Number(poison.apCost), 2);
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        spell: poison,
        assignedSpells: archerKit,
        availableSpells: archerKit,
        origin,
        targetCell: poisonDest,
        occupant: playerAt("player", 7, 4),
        opponents,
        archer: healthyArcher,
        archerSide: "enemy",
        hasLoS: false,
      }),
      true,
      "catalog Poison has no lineOfSight flag; applyCast skips LoS",
    );
  });

  it("cannot decide Strike, Slow, Frost, Venom, Inferno, or heal as this Poison leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: poisonDest,
      occupant,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy" as const,
      hasLoS: false,
    };
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        spell: slow,
        assignedSpells: archerKit,
        availableSpells: [slow],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        spell: frost,
        availableSpells: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        spell: inferno,
        availableSpells: [inferno],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosPoisonCast({
        ...base,
        spell: mend,
        assignedSpells: [poison, mend],
        availableSpells: [poison, mend],
        archer: archerAt("wisp-1", 4, 4, 80, 100, "healer"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
