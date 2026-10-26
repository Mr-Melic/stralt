/**
 * Combat action parity: summon-hunter `decideSummonHunter` LoS-blocked Venom
 * vs stalk. A decided legal Venom dest (living hostile at Chebyshev 2, LoS
 * blocked so live would stalk, 3-AP wallet can pay) is executable; an
 * illegal dest cannot execute; live still stalks.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  canAffordCastAp,
  chebyshevOnBoard,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";
import {
  canExecuteWxSummonHunterLosVenomCast,
  isWxSummonHunterLosVenomBlockedBuffSpell,
  isWxSummonHunterLosVenomBlockedDotSpell,
  isWxSummonHunterLosVenomBlockedFrostSpell,
  isWxSummonHunterLosVenomBlockedInfernoSpell,
  isWxSummonHunterLosVenomBlockedPoisonSpell,
  isWxSummonHunterLosVenomBlockedSlowSpell,
  isWxSummonHunterLosVenomHealKitSpell,
  isWxSummonHunterLosVenomSpell,
  pickWxSummonHunterLosVenomSpell,
  shouldDecideWxSummonHunterLosVenomCast,
  wxSummonHunterLiveWouldStalkLosBlockedVenom,
  wxSummonHunterLosVenomApCost,
  wxSummonHunterLosVenomHighlightedTargetIsExecutable,
  wxSummonHunterLosVenomInRange,
  wxSummonHunterLosVenomIsHunterUnit,
  wxSummonHunterLosVenomIsStalkDistance,
  wxSummonHunterLosVenomKitIsHealer,
  wxSummonHunterLosVenomKitIsHunter,
  wxSummonHunterLosVenomLivePreferredSpell,
  wxSummonHunterLosVenomRange,
  wxSummonHunterLosVenomSpellRequiresLos,
} from "./wxSummonHunterLosVenom.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function hunterAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  summonAI = "hunter",
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
    pieceType: "wolf",
  };
}

describe("summon decideSummonHunter LoS-blocked Venom vs stalk", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const iron = mustSpell("spell-iron-skin");
  const origin = { x: 4, y: 4 };
  const venomDest = { x: 6, y: 4 };
  const healthyHunter = hunterAt("wolf-1", 4, 4, 80, 100);
  const opponents = [playerAt("player", 6, 4)];
  const assignedKit = [physicalAttackSpell, venom];
  const availableVenomOnly = [venom];

  it("treats catalog Venom as the LoS-blocked stalk leftover", () => {
    assert.equal(venom.spellType, "damage");
    assert.equal(Number(venom.damage), 0);
    assert.equal(venom.isDotSpell, true);
    assert.equal(venom.effectType, "dot");
    assert.equal(Number(venom.dotDamagePerTurn), 4);
    assert.equal(Number(venom.dotDuration), 3);
    assert.equal(Number(venom.range), 2);
    assert.equal(Number(venom.apCost), 3);
    assert.equal(venom.lineOfSight, undefined);
    assert.equal(isWxSummonHunterLosVenomSpell(venom), true);
    assert.equal(wxSummonHunterLosVenomRange(venom), enemySpellRange(venom));
    assert.equal(wxSummonHunterLosVenomSpellRequiresLos(venom), true);
    assert.equal(enemySpellRequiresLos(venom), true);
    assert.equal(wxSummonHunterLosVenomApCost(venom), 3);
    assert.equal(isWxSummonHunterLosVenomHealKitSpell(venom), false);
    assert.equal(isWxSummonHunterLosVenomHealKitSpell(mend), true);
    assert.equal(isWxSummonHunterLosVenomHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("keys off Venom metadata, not the display name", () => {
    assert.equal(
      isWxSummonHunterLosVenomSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 2,
        apCost: 3,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxSummonHunterLosVenomSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 4,
        apCost: 2,
        targetType: "enemy",
      }),
      false,
      "Poison-shaped range-4 DoT is #1095/#1096, not this leftover",
    );
    assert.equal(
      isWxSummonHunterLosVenomSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 8,
        dotDuration: 3,
        range: 3,
        apCost: 5,
        targetType: "enemy",
      }),
      false,
      "Inferno-shaped range-3 DoT is #799/#967, not this leftover",
    );
  });

  it("does not steal Strike, Poison, Frost, Slow, Iron Skin, Drain, Inferno, Nova, or heal", () => {
    assert.equal(isWxSummonHunterLosVenomSpell(physicalAttackSpell), false);
    assert.equal(
      isWxSummonHunterLosVenomSpell(poison),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(isWxSummonHunterLosVenomBlockedPoisonSpell(poison), true);
    assert.equal(isWxSummonHunterLosVenomSpell(frost), false);
    assert.equal(isWxSummonHunterLosVenomBlockedFrostSpell(frost), true);
    assert.equal(isWxSummonHunterLosVenomSpell(mend), false);
    assert.equal(
      isWxSummonHunterLosVenomSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxSummonHunterLosVenomSpell(slow),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(isWxSummonHunterLosVenomBlockedSlowSpell(slow), true);
    assert.equal(
      isWxSummonHunterLosVenomSpell(inferno),
      false,
      "bomber Inferno range 3 stays #799 / #967",
    );
    assert.equal(isWxSummonHunterLosVenomBlockedInfernoSpell(inferno), true);
    assert.equal(
      isWxSummonHunterLosVenomSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isWxSummonHunterLosVenomSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxSummonHunterLosVenomBlockedDotSpell(poison), true);
    assert.equal(isWxSummonHunterLosVenomBlockedDotSpell(venom), true);
    assert.equal(isWxSummonHunterLosVenomBlockedDotSpell(inferno), true);
    assert.equal(isWxSummonHunterLosVenomBlockedBuffSpell(iron), true);
  });

  it("Summon Dire Wolf kit is Strike then Venom; archer/bomber kits are not", () => {
    const wolf = mustSpell("summon-dire-wolf");
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.equal(wolf.summonAI, "hunter");
    assert.equal(wolf.summonUnitDef?.ap, 2);
    const archerSpell = mustSpell("summon-archer");
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
    const bomber = mustSpell("summon-bomber");
    assert.deepEqual(bomber.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(wxSummonHunterLosVenomKitIsHunter(assignedKit), true);
    assert.equal(wxSummonHunterLosVenomKitIsHunter(availableVenomOnly), true);
    assert.equal(
      wxSummonHunterLosVenomKitIsHunter([physicalAttackSpell]),
      false,
    );
    assert.equal(
      wxSummonHunterLosVenomKitIsHunter([poison, slow]),
      false,
      "archer Poison+Slow is #1095/#1096/#1098, not this leftover",
    );
    assert.equal(wxSummonHunterLosVenomKitIsHunter([inferno]), false);
    assert.equal(wxSummonHunterLosVenomKitIsHunter([frost, poison]), false);
    assert.equal(wxSummonHunterLosVenomKitIsHealer([frost, mend]), true);
    assert.equal(wxSummonHunterLosVenomKitIsHealer(assignedKit), false);
    assert.equal(wxSummonHunterLosVenomIsHunterUnit(healthyHunter), true);
    assert.equal(
      wxSummonHunterLosVenomIsHunterUnit({ pieceType: "wolf" }),
      true,
    );
    assert.equal(
      wxSummonHunterLosVenomIsHunterUnit({ summonAI: "archer" }),
      false,
    );
    assert.equal(
      wxSummonHunterLosVenomIsHunterUnit({ summonAI: "bomber" }),
      false,
    );
    assert.equal(
      wxSummonHunterLosVenomIsHunterUnit({ pieceType: "pawn" }),
      false,
      "pack pawn Strike+Venom is not decideSummonHunter",
    );
  });

  it("live decideSummonHunter still gates Venom on aiCanCast then stalks", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideSummonHunter");
    assert.ok(start >= 0, "live decideSummonHunter is present");
    const nextFn = ai.indexOf("\nfunction ", start + 1);
    const body = ai.slice(start, nextFn > start ? nextFn : start + 2500);
    const kitAt = body.indexOf("kit[1]");
    const canCastAt = body.indexOf("aiCanCast");
    const meleeAt = body.indexOf("dist <= 1");
    const stalkAt = body.indexOf("stalks");
    assert.ok(kitAt >= 0, "decideSummonHunter still looks up kit Venom");
    assert.ok(canCastAt >= 0, "decideSummonHunter still gates on aiCanCast");
    assert.ok(meleeAt >= 0, "decideSummonHunter still melees when adjacent");
    assert.ok(stalkAt >= 0, "decideSummonHunter still stalks when blocked");
    assert.ok(kitAt < canCastAt, "Venom lookup still precedes aiCanCast");
    assert.ok(
      canCastAt < meleeAt,
      "melee still runs after a failed Venom cast",
    );
    assert.ok(meleeAt < stalkAt, "stalk still runs after the melee arm");
    assert.equal(
      body.includes("repositionForLOS"),
      false,
      "hunter has no LoS-reposition arm (unlike decideSummonArcher)",
    );
    assert.equal(body.includes("reposition-los"), false);
    const inferStart = ai.indexOf("function inferSummonArchetype");
    const inferBody = ai.slice(inferStart, inferStart + 900);
    assert.ok(inferBody.includes('raw === "hunter"'));
    assert.ok(inferBody.includes("wolf"));
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
      wxSummonHunterLosVenomLivePreferredSpell(availableVenomOnly)?.id,
      "spell-venom-strike",
    );
    assert.equal(
      wxSummonHunterLosVenomLivePreferredSpell(assignedKit)?.id,
      "spell-venom-strike",
    );
  });

  it("picks in-range Venom when live would stalk a LoS-blocked hunter", () => {
    const occupant = playerAt("player", 6, 4);
    assert.equal(wxSummonHunterLosVenomInRange(origin, venomDest, venom), true);
    assert.equal(
      wxSummonHunterLosVenomIsStalkDistance(origin, venomDest),
      true,
    );
    assert.equal(chebyshevOnBoard(origin, venomDest), 2);
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: venomDest,
        opponents,
        hunter: healthyHunter,
        hasLoS: false,
        currentAp: 3,
      })?.id,
      "spell-venom-strike",
    );
    const decided = shouldDecideWxSummonHunterLosVenomCast({
      spell: venom,
      assignedSpells: assignedKit,
      availableSpells: availableVenomOnly,
      origin,
      targetCell: venomDest,
      occupant,
      opponents,
      hunter: healthyHunter,
      hunterSide: "enemy",
      hasLoS: false,
      currentAp: 3,
    });
    const executable = canExecuteWxSummonHunterLosVenomCast({
      spell: venom,
      assignedSpells: assignedKit,
      availableSpells: availableVenomOnly,
      origin,
      targetCell: venomDest,
      occupant,
      opponents,
      hunter: healthyHunter,
      hunterSide: "enemy",
      hasLoS: false,
      currentAp: 3,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(decided, executable);
    assert.equal(
      wxSummonHunterLosVenomHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.equal(
      wxSummonHunterLosVenomInRange(origin, venomDest, venom),
      enemyCastRangeOk(origin, venomDest, venom),
    );
    assert.equal(canAffordCastAp(3, Number(venom.apCost)), true);
  });

  it("player auto-summon hunter still picks Venom", () => {
    const autoHunter = hunterAt("wolf-p", 4, 4, 80, 100, "hunter", "player");
    const foe = { id: "enemy-1", x: 6, y: 4, hp: 40, side: "enemy" as const };
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: venomDest,
        opponents: [foe],
        hunter: autoHunter,
        hasLoS: false,
        currentAp: 3,
      })?.id,
      "spell-venom-strike",
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        spell: venom,
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: venomDest,
        occupant: foe,
        opponents: [foe],
        hunter: autoHunter,
        hunterSide: "player",
        hasLoS: false,
        currentAp: 3,
      }),
      true,
    );
  });

  it("cannot execute Venom beyond range 2, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 7, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, venom), false);
    assert.equal(wxSummonHunterLosVenomInRange(origin, tooFar, venom), false);
    const base = {
      spell: venom,
      assignedSpells: assignedKit,
      availableSpells: availableVenomOnly,
      origin,
      opponents,
      hunter: healthyHunter,
      hunterSide: "enemy" as const,
      hasLoS: false,
      currentAp: 3,
    };
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 7, 4),
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        targetCell: venomDest,
        occupant: playerAt("player", 6, 4, 0),
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        targetCell: venomDest,
        occupant: { id: "wolf-2", x: 6, y: 4, hp: 12, side: "enemy" },
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        targetCell: venomDest,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      wxSummonHunterLosVenomHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not fire when LoS is already clear (live already casts, #856)", () => {
    assert.equal(
      wxSummonHunterLiveWouldStalkLosBlockedVenom({
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: venomDest,
        hunter: healthyHunter,
        opponents,
        hasLoS: true,
        currentAp: 3,
      }),
      false,
    );
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: venomDest,
        opponents,
        hunter: healthyHunter,
        hasLoS: true,
        currentAp: 3,
      }),
      null,
      "clear LoS already reaches decideSummonHunter Venom cast — #856 execute",
    );
  });

  it("does not steal adjacent Venom (Chebyshev 1 LoS always open, #856)", () => {
    const adjacent = { x: 5, y: 4 };
    assert.equal(chebyshevOnBoard(origin, adjacent), 1);
    assert.equal(
      wxSummonHunterLosVenomIsStalkDistance(origin, adjacent),
      false,
    );
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: adjacent,
        opponents: [playerAt("player", 5, 4)],
        hunter: healthyHunter,
        hasLoS: false,
        currentAp: 3,
      }),
      null,
      "adjacent Bresenham has no intermediate; live already casts",
    );
  });

  it("catalog wolf 2 AP cannot pay applyCast; 3 AP can", () => {
    const args = {
      spell: venom,
      assignedSpells: assignedKit,
      availableSpells: availableVenomOnly,
      origin,
      targetCell: venomDest,
      occupant: playerAt("player", 6, 4),
      opponents,
      hunter: healthyHunter,
      hunterSide: "enemy" as const,
      hasLoS: false,
    };
    assert.equal(
      shouldDecideWxSummonHunterLosVenomCast({ ...args, currentAp: 2 }),
      false,
      "catalog wolf ap 2 cannot pay Venom 3 — #762; do not rebalance",
    );
    assert.equal(
      shouldDecideWxSummonHunterLosVenomCast({ ...args, currentAp: 3 }),
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
      pickWxSummonHunterLosVenomSpell({
        availableSpells: [frost, venom],
        origin,
        targetCell: venomDest,
        opponents,
        hunter: bishop,
        hasLoS: false,
        currentAp: 3,
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
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: [frost, rally],
        availableSpells: [venom],
        origin,
        targetCell: venomDest,
        opponents,
        hunter: king,
        hasLoS: false,
        currentAp: 3,
      }),
      null,
      "#1090 owns king healer Frost LoS",
    );
  });

  it("does not steal archer Poison/Slow LoS (#1095/#1096/#1098) or bomber Inferno (#799 / #967)", () => {
    const archer = hunterAt("archer-1", 4, 4, 80, 100, "archer");
    archer.pieceType = "archer";
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: [poison, slow],
        availableSpells: [poison, slow],
        origin,
        targetCell: { x: 8, y: 4 },
        opponents: [playerAt("player", 8, 4)],
        hunter: archer,
        hasLoS: false,
        currentAp: 2,
      }),
      null,
    );
    const bomber = hunterAt("bomber-1", 4, 4, 80, 100, "bomber");
    bomber.pieceType = "bomber";
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: [inferno],
        availableSpells: [inferno],
        origin,
        targetCell: { x: 7, y: 4 },
        opponents: [playerAt("player", 7, 4)],
        hunter: bomber,
        hasLoS: false,
        currentAp: 5,
      }),
      null,
    );
  });

  it("yields when the spell opts out of LoS (live already casts)", () => {
    const noLosVenom = { ...venom, lineOfSight: false };
    assert.equal(wxSummonHunterLosVenomSpellRequiresLos(noLosVenom), false);
    assert.equal(
      pickWxSummonHunterLosVenomSpell({
        assignedSpells: [physicalAttackSpell, noLosVenom],
        availableSpells: [noLosVenom],
        origin,
        targetCell: venomDest,
        opponents,
        hunter: healthyHunter,
        hasLoS: false,
        currentAp: 3,
      }),
      null,
      "lineOfSight false already reaches decideSummonHunter Venom cast",
    );
  });

  it("still decides wall-blocked Venom (execute skips LoS)", () => {
    assert.equal(Number(venom.apCost), 3);
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        spell: venom,
        assignedSpells: assignedKit,
        availableSpells: availableVenomOnly,
        origin,
        targetCell: venomDest,
        occupant: playerAt("player", 6, 4),
        opponents,
        hunter: healthyHunter,
        hunterSide: "enemy",
        hasLoS: false,
        currentAp: 3,
      }),
      true,
      "catalog Venom has no lineOfSight flag; applyCast skips LoS",
    );
  });

  it("cannot decide Strike, Poison, Frost, Slow, Inferno, or heal as this Venom leftover", () => {
    const occupant = playerAt("player", 6, 4);
    const base = {
      origin,
      targetCell: venomDest,
      occupant,
      opponents,
      hunter: healthyHunter,
      hunterSide: "enemy" as const,
      hasLoS: false,
      currentAp: 3,
    };
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        spell: poison,
        assignedSpells: assignedKit,
        availableSpells: [poison],
      }),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        spell: frost,
        availableSpells: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        spell: slow,
        availableSpells: [slow],
      }),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        spell: inferno,
        availableSpells: [inferno],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonHunterLosVenomCast({
        ...base,
        spell: mend,
        assignedSpells: [venom, mend],
        availableSpells: [venom, mend],
        hunter: hunterAt("wisp-1", 4, 4, 80, 100, "healer"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
