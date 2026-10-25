/**
 * Combat action parity: summon-archer `decideSummonArcher` LoS-reposition vs
 * advertised in-range Slow. A decided legal Slow dest (living hostile in
 * Chebyshev range, Poison absent so Slow is preferred, LoS blocked so live
 * would sidestep, 2-AP wallet can pay) is executable; an illegal dest cannot
 * execute; live still repositions.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { AI_LOS_REPOSITION_ENABLED } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  canAffordCastAp,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";
import {
  canExecuteWxSummonArcherLosSlowCast,
  isWxSummonArcherLosSlowBlockedBuffSpell,
  isWxSummonArcherLosSlowBlockedDotSpell,
  isWxSummonArcherLosSlowBlockedFrostSpell,
  isWxSummonArcherLosSlowBlockedPoisonSpell,
  isWxSummonArcherLosSlowHealKitSpell,
  isWxSummonArcherLosSlowSpell,
  pickWxSummonArcherLosSlowSpell,
  shouldDecideWxSummonArcherLosSlowCast,
  wxSummonArcherLiveWouldRepositionLosForSlow,
  wxSummonArcherLosSlowApCost,
  wxSummonArcherLosSlowHighlightedTargetIsExecutable,
  wxSummonArcherLosSlowInRange,
  wxSummonArcherLosSlowIsArcherUnit,
  wxSummonArcherLosSlowKitIsArcher,
  wxSummonArcherLosSlowKitIsHealer,
  wxSummonArcherLosSlowLivePreferredSpell,
  wxSummonArcherLosSlowRange,
  wxSummonArcherLosSlowSpellRequiresLos,
} from "./wxSummonArcherLosSlow.ts";

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
  side: "player" | "enemy" = "enemy",
) {
  return {
    id,
    x,
    y,
    hp,
    maxHp,
    side,
    isSummon: true,
    summonAI,
    pieceType: "archer",
  };
}

describe("summon decideSummonArcher LoS-reposition vs advertised Slow", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const iron = mustSpell("spell-iron-skin");
  const weaken = mustSpell("spell-weaken");
  const origin = { x: 4, y: 4 };
  const slowDest = { x: 7, y: 4 };
  const healthyArcher = archerAt("archer-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 7, 4)];
  const assignedKit = [poison, slow];
  const availableSlowOnly = [slow];

  it("treats catalog Slow as the Poison-empty LoS-reposition leftover", () => {
    assert.equal(slow.spellType, "damage");
    assert.equal(Number(slow.damage), 0);
    assert.equal(slow.debuffStat, "mp");
    assert.equal(Number(slow.debuffDuration), 2);
    assert.equal(Number(slow.debuffModifier), -2);
    assert.equal(Number(slow.range), 3);
    assert.equal(Number(slow.apCost), 2);
    assert.equal(slow.lineOfSight, undefined);
    assert.equal(isWxSummonArcherLosSlowSpell(slow), true);
    assert.equal(wxSummonArcherLosSlowRange(slow), enemySpellRange(slow));
    assert.equal(wxSummonArcherLosSlowSpellRequiresLos(slow), true);
    assert.equal(enemySpellRequiresLos(slow), true);
    assert.equal(wxSummonArcherLosSlowApCost(slow), 2);
    assert.equal(isWxSummonArcherLosSlowHealKitSpell(slow), false);
    assert.equal(isWxSummonArcherLosSlowHealKitSpell(mend), true);
    assert.equal(isWxSummonArcherLosSlowHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
    assert.equal(AI_LOS_REPOSITION_ENABLED, true);
  });

  it("keys off Slow metadata, not the display name", () => {
    assert.equal(
      isWxSummonArcherLosSlowSpell({
        spellType: "damage",
        damage: 0,
        debuffStat: "mp",
        debuffDuration: 2,
        range: 3,
        apCost: 2,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxSummonArcherLosSlowSpell({
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
    assert.equal(
      isWxSummonArcherLosSlowSpell({
        spellType: "damage",
        damage: 0,
        debuffStat: "dmg",
        debuffDuration: 2,
        range: 3,
        targetType: "enemy",
      }),
      false,
      "Weaken is dmg, not this MP leftover",
    );
  });

  it("does not steal Strike, Poison, Frost, Iron Skin, Drain, Venom, Inferno, Nova, Weaken, or heal", () => {
    assert.equal(isWxSummonArcherLosSlowSpell(physicalAttackSpell), false);
    assert.equal(
      isWxSummonArcherLosSlowSpell(poison),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(isWxSummonArcherLosSlowBlockedPoisonSpell(poison), true);
    assert.equal(isWxSummonArcherLosSlowSpell(frost), false);
    assert.equal(isWxSummonArcherLosSlowBlockedFrostSpell(frost), true);
    assert.equal(isWxSummonArcherLosSlowSpell(mend), false);
    assert.equal(
      isWxSummonArcherLosSlowSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxSummonArcherLosSlowSpell(venom),
      false,
      "hunter Venom range 2 stays #856",
    );
    assert.equal(
      isWxSummonArcherLosSlowSpell(inferno),
      false,
      "bomber Inferno range 3 stays #799 / #967",
    );
    assert.equal(
      isWxSummonArcherLosSlowSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isWxSummonArcherLosSlowSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxSummonArcherLosSlowSpell(weaken), false);
    assert.equal(isWxSummonArcherLosSlowBlockedDotSpell(poison), true);
    assert.equal(isWxSummonArcherLosSlowBlockedDotSpell(venom), true);
    assert.equal(isWxSummonArcherLosSlowBlockedDotSpell(inferno), true);
    assert.equal(isWxSummonArcherLosSlowBlockedBuffSpell(iron), true);
  });

  it("Summon Archer kit is Poison then Slow; wolf/bomber kits are not", () => {
    const archerSpell = mustSpell("summon-archer");
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
    assert.equal(archerSpell.summonAI, "archer");
    assert.equal(archerSpell.summonUnitDef?.ap, 2);
    const wolf = mustSpell("summon-dire-wolf");
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    const bomber = mustSpell("summon-bomber");
    assert.deepEqual(bomber.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(wxSummonArcherLosSlowKitIsArcher(assignedKit), true);
    assert.equal(wxSummonArcherLosSlowKitIsArcher(availableSlowOnly), true);
    assert.equal(wxSummonArcherLosSlowKitIsArcher([poison]), false);
    assert.equal(
      wxSummonArcherLosSlowKitIsArcher([physicalAttackSpell, venom]),
      false,
      "hunter Strike+Venom is #856, not this leftover",
    );
    assert.equal(wxSummonArcherLosSlowKitIsArcher([inferno]), false);
    assert.equal(wxSummonArcherLosSlowKitIsArcher([frost, poison]), false);
    assert.equal(wxSummonArcherLosSlowKitIsHealer([frost, mend]), true);
    assert.equal(wxSummonArcherLosSlowKitIsHealer(assignedKit), false);
    assert.equal(wxSummonArcherLosSlowIsArcherUnit(healthyArcher), true);
    assert.equal(
      wxSummonArcherLosSlowIsArcherUnit({ summonAI: "kiter" }),
      true,
    );
    assert.equal(
      wxSummonArcherLosSlowIsArcherUnit({ summonAI: "hunter" }),
      false,
    );
    assert.equal(
      wxSummonArcherLosSlowIsArcherUnit({ summonAI: "bomber" }),
      false,
    );
  });

  it("live decideSummonArcher still prefers Poison then sidesteps LoS-blocked Slow", () => {
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
    const inferStart = ai.indexOf("function inferSummonArchetype");
    const inferBody = ai.slice(inferStart, inferStart + 900);
    assert.ok(inferBody.includes('raw === "kiter"'));
    assert.ok(inferBody.includes('return "archer"'));
    const exec = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "summonExecutor.ts"),
      "utf8",
    );
    const applyCastAt = exec.indexOf("const applyCast = ");
    assert.ok(applyCastAt >= 0, "live applyCast is present");
    const applyCast = exec.slice(applyCastAt, applyCastAt + 1800);
    assert.equal(applyCast.includes("hasLineOfSight"), false);
    assert.equal(applyCast.includes("enemySpellRequiresLos"), false);
    assert.match(applyCast, /currentAp < apCost/);
    assert.equal(
      wxSummonArcherLosSlowLivePreferredSpell(availableSlowOnly)?.id,
      "spell-slow",
    );
    assert.equal(
      wxSummonArcherLosSlowLivePreferredSpell(assignedKit),
      null,
      "Poison-present preferred Poison stays #1095/#1096",
    );
  });

  it("picks in-range Slow when live would sidestep a Poison-empty archer", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(wxSummonArcherLosSlowInRange(origin, slowDest, slow), true);
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        opponents,
        archer: healthyArcher,
        hasLoS: false,
        currentAp: 2,
      })?.id,
      "spell-slow",
    );
    const decided = shouldDecideWxSummonArcherLosSlowCast({
      spell: slow,
      assignedSpells: assignedKit,
      availableSpells: availableSlowOnly,
      origin,
      targetCell: slowDest,
      occupant,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy",
      hasLoS: false,
      currentAp: 2,
    });
    const executable = canExecuteWxSummonArcherLosSlowCast({
      spell: slow,
      assignedSpells: assignedKit,
      availableSpells: availableSlowOnly,
      origin,
      targetCell: slowDest,
      occupant,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy",
      hasLoS: false,
      currentAp: 2,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(decided, executable);
    assert.equal(
      wxSummonArcherLosSlowHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.equal(
      wxSummonArcherLosSlowInRange(origin, slowDest, slow),
      enemyCastRangeOk(origin, slowDest, slow),
    );
    assert.equal(canAffordCastAp(2, Number(slow.apCost)), true);
  });

  it("player auto-summon and kiter alias still pick Slow", () => {
    const autoArcher = archerAt("archer-p", 4, 4, 80, 100, "archer", "player");
    const foe = { id: "enemy-1", x: 7, y: 4, hp: 40, side: "enemy" as const };
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        opponents: [foe],
        archer: autoArcher,
        hasLoS: false,
        currentAp: 2,
      })?.id,
      "spell-slow",
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        spell: slow,
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        occupant: foe,
        opponents: [foe],
        archer: autoArcher,
        archerSide: "player",
        hasLoS: false,
        currentAp: 2,
      }),
      true,
    );
    const kiter = archerAt("kiter-1", 4, 4, 80, 100, "kiter");
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        opponents,
        archer: kiter,
        hasLoS: false,
        currentAp: 2,
      })?.id,
      "spell-slow",
    );
  });

  it("cannot execute Slow beyond range 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, slow), false);
    assert.equal(wxSummonArcherLosSlowInRange(origin, tooFar, slow), false);
    const base = {
      spell: slow,
      assignedSpells: assignedKit,
      availableSpells: availableSlowOnly,
      origin,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy" as const,
      hasLoS: false,
      currentAp: 2,
    };
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        targetCell: slowDest,
        occupant: playerAt("player", 7, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        targetCell: slowDest,
        occupant: { id: "archer-2", x: 7, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        targetCell: slowDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxSummonArcherLosSlowHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when LoS is already clear (live already casts, #878)", () => {
    assert.equal(
      wxSummonArcherLiveWouldRepositionLosForSlow({
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        archer: healthyArcher,
        opponents,
        hasLoS: true,
        currentAp: 2,
      }),
      false,
    );
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        opponents,
        archer: healthyArcher,
        hasLoS: true,
        currentAp: 2,
      }),
      null,
      "clear LoS already reaches decideSummonArcher Slow cast — #878 execute",
    );
  });

  it("does not steal Poison LoS when Poison is still preferred (#1095/#1096)", () => {
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: assignedKit,
        availableSpells: assignedKit,
        origin,
        targetCell: { x: 8, y: 4 },
        opponents: [playerAt("player", 8, 4)],
        archer: healthyArcher,
        hasLoS: false,
        currentAp: 2,
      }),
      null,
      "Poison-present preferred Poison stays #1095/#1096",
    );
    assert.equal(wxSummonArcherLosSlowLivePreferredSpell(assignedKit), null);
  });

  it("1 AP cannot pay applyCast; 2 AP can", () => {
    const args = {
      spell: slow,
      assignedSpells: assignedKit,
      availableSpells: availableSlowOnly,
      origin,
      targetCell: slowDest,
      occupant: playerAt("player", 7, 4),
      opponents,
      archer: healthyArcher,
      archerSide: "enemy" as const,
      hasLoS: false,
    };
    assert.equal(
      shouldDecideWxSummonArcherLosSlowCast({ ...args, currentAp: 1 }),
      false,
    );
    assert.equal(
      shouldDecideWxSummonArcherLosSlowCast({ ...args, currentAp: 2 }),
      true,
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
      pickWxSummonArcherLosSlowSpell({
        availableSpells: [frost, slow],
        origin,
        targetCell: slowDest,
        opponents,
        archer: bishop,
        hasLoS: false,
        currentAp: 2,
      }),
      null,
      "#1081 owns bishop Frost leftovers",
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
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: [frost, rally],
        availableSpells: [slow],
        origin,
        targetCell: slowDest,
        opponents,
        archer: king,
        hasLoS: false,
        currentAp: 2,
      }),
      null,
      "#1090 owns king healer Frost LoS",
    );
  });

  it("does not steal hunter Venom (#856) or bomber Inferno (#799 / #967)", () => {
    const hunter = archerAt("wolf-1", 4, 4, 80, 100, "hunter");
    hunter.pieceType = "wolf";
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: [physicalAttackSpell, venom],
        availableSpells: [physicalAttackSpell, venom],
        origin,
        targetCell: { x: 6, y: 4 },
        opponents: [playerAt("player", 6, 4)],
        archer: hunter,
        hasLoS: false,
        currentAp: 3,
      }),
      null,
    );
    const bomber = archerAt("bomber-1", 4, 4, 80, 100, "bomber");
    bomber.pieceType = "bomber";
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: [inferno],
        availableSpells: [inferno],
        origin,
        targetCell: slowDest,
        opponents,
        archer: bomber,
        hasLoS: false,
        currentAp: 2,
      }),
      null,
    );
  });

  it("yields when the spell opts out of LoS (live already casts)", () => {
    const noLosSlow = { ...slow, lineOfSight: false };
    assert.equal(wxSummonArcherLosSlowSpellRequiresLos(noLosSlow), false);
    assert.equal(
      pickWxSummonArcherLosSlowSpell({
        assignedSpells: [poison, noLosSlow],
        availableSpells: [noLosSlow],
        origin,
        targetCell: slowDest,
        opponents,
        archer: healthyArcher,
        hasLoS: false,
        currentAp: 2,
      }),
      null,
      "lineOfSight false skips the reposition-los arm",
    );
  });

  it("still decides wall-blocked Slow (execute skips LoS)", () => {
    assert.equal(Number(slow.apCost), 2);
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        spell: slow,
        assignedSpells: assignedKit,
        availableSpells: availableSlowOnly,
        origin,
        targetCell: slowDest,
        occupant: playerAt("player", 7, 4),
        opponents,
        archer: healthyArcher,
        archerSide: "enemy",
        hasLoS: false,
        currentAp: 2,
      }),
      true,
      "catalog Slow has no lineOfSight flag; applyCast skips LoS",
    );
  });

  it("cannot decide Strike, Poison, Frost, Venom, Inferno, or heal as this Slow leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: slowDest,
      occupant,
      opponents,
      archer: healthyArcher,
      archerSide: "enemy" as const,
      hasLoS: false,
      currentAp: 2,
    };
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        spell: poison,
        assignedSpells: assignedKit,
        availableSpells: assignedKit,
      }),
      false,
      "#1095/#1096 own Poison-present LoS",
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        spell: frost,
        availableSpells: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        spell: inferno,
        availableSpells: [inferno],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonArcherLosSlowCast({
        ...base,
        spell: mend,
        assignedSpells: [slow, mend],
        availableSpells: [slow, mend],
        archer: archerAt("wisp-1", 4, 4, 80, 100, "healer"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
