/**
 * Combat action parity: summon applyCast never arms advertised Inferno
 * cooldown. A decided legal Inferno dest (living hostile cluster at
 * Chebyshev 3, remaining 0, 5-AP wallet can pay) is executable and
 * advertised-arms CD 3; live applyCast leaves remaining 0 so the next
 * turn recasts. Chebyshev 4 / corpse / ally / empty / already-armed
 * remaining 3 / 1 AP / Strike / Frost / Drain / Venom / Poison / Slow
 * / Blood Mend / hunter / archer / queen cannot execute or arm.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AI_KAMIKAZE_BLAST_RADIUS,
  AI_KAMIKAZE_LOW_HP_PCT,
  AI_KAMIKAZE_MIN_TARGETS,
} from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  canAffordCastAp,
  chebyshevOnBoard,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";
import {
  armWxSummonCooldown,
  canAffordWxSummonCooldownArmCast,
  canExecuteWxSummonCooldownArmCast,
  isWxSummonCooldownArmBlockedBuffSpell,
  isWxSummonCooldownArmBlockedDotSpell,
  isWxSummonCooldownArmBlockedFrostSpell,
  isWxSummonCooldownArmBlockedPoisonSpell,
  isWxSummonCooldownArmBlockedSlowSpell,
  isWxSummonCooldownArmBlockedVenomSpell,
  isWxSummonCooldownArmHealKitSpell,
  isWxSummonCooldownArmSpell,
  nextWxSummonCooldownMap,
  pickWxSummonCooldownArmSpell,
  shouldDecideWxSummonCooldownArmCast,
  wxSummonAdvertisedWouldArmCooldown,
  wxSummonCooldownArmAdvertisedTurns,
  wxSummonCooldownArmApCost,
  wxSummonCooldownArmClusterCount,
  wxSummonCooldownArmDetonateEligible,
  wxSummonCooldownArmHighlightedTargetIsExecutable,
  wxSummonCooldownArmHpFrac,
  wxSummonCooldownArmInRange,
  wxSummonCooldownArmIsBomberUnit,
  wxSummonCooldownArmIsReady,
  wxSummonCooldownArmKitIsBomber,
  wxSummonCooldownArmKitIsHealer,
  wxSummonCooldownArmRange,
  wxSummonCooldownArmReadySpell,
  wxSummonCooldownArmRemaining,
  wxSummonLiveApplyCastCooldownEntry,
  wxSummonLiveApplyCastWouldArmCooldown,
  wxSummonLiveWouldRecastBecauseApplyCastSkippedArm,
} from "./wxSummonCooldownArm.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function playerAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "player" as const };
}

function bomberAt(
  id: string,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
  summonAI = "bomber",
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
    pieceType: "bomber",
  };
}

describe("summon applyCast never arms advertised Inferno cooldown", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const iron = mustSpell("spell-iron-skin");
  const origin = { x: 4, y: 4 };
  const infernoDest = { x: 7, y: 4 };
  const healthyBomber = bomberAt("bomber-1", 4, 4, 80, 100);
  const cluster = [playerAt("player", 7, 4), playerAt("player-2", 6, 4)];
  const assignedKit = [inferno];
  const readyRemaining = new Map<string, number>();
  const spentRemaining = new Map<string, number>([["spell-inferno", 3]]);

  const legalArgs = {
    spell: inferno,
    assignedSpells: assignedKit,
    remainingBySpellId: readyRemaining,
    origin,
    targetCell: infernoDest,
    occupant: playerAt("player", 7, 4),
    opponents: cluster,
    bomber: healthyBomber,
    bomberSide: "enemy" as const,
    currentAp: 5,
  };

  it("treats catalog Inferno as the summon applyCast CD-arm leftover", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(Number(inferno.areaRadius ?? 0), 0);
    assert.equal(inferno.usableByEnemy, true);
    assert.equal(isWxSummonCooldownArmSpell(inferno), true);
    assert.equal(wxSummonCooldownArmRange(inferno), enemySpellRange(inferno));
    assert.equal(wxSummonCooldownArmAdvertisedTurns(inferno), 3);
    assert.equal(wxSummonCooldownArmApCost(inferno), 5);
    assert.equal(wxSummonAdvertisedWouldArmCooldown(inferno), true);
    assert.equal(isWxSummonCooldownArmHealKitSpell(inferno), false);
    assert.equal(isWxSummonCooldownArmHealKitSpell(mend), true);
    assert.equal(isWxSummonCooldownArmHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isWxSummonCooldownArmSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 8,
        dotDuration: 3,
        range: 3,
        apCost: 5,
        cooldown: 3,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isWxSummonCooldownArmSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 4,
        apCost: 2,
        cooldown: 3,
        targetType: "enemy",
      }),
      false,
      "Poison-shaped range-4 DoT is #1095/#1096, not this leftover",
    );
    assert.equal(
      isWxSummonCooldownArmSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 2,
        apCost: 3,
        cooldown: 3,
        targetType: "enemy",
      }),
      false,
      "Venom-shaped range-2 DoT is #856/#1123, not this leftover",
    );
    assert.equal(
      isWxSummonCooldownArmSpell({
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
      "range-3 DoT without advertised cooldown is not this leftover",
    );
  });

  it("does not steal Strike, Poison, Frost, Slow, Iron Skin, Drain, Venom, Nova, or heal", () => {
    assert.equal(isWxSummonCooldownArmSpell(physicalAttackSpell), false);
    assert.equal(
      isWxSummonCooldownArmSpell(poison),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(isWxSummonCooldownArmBlockedPoisonSpell(poison), true);
    assert.equal(isWxSummonCooldownArmSpell(venom), false);
    assert.equal(isWxSummonCooldownArmBlockedVenomSpell(venom), true);
    assert.equal(isWxSummonCooldownArmSpell(frost), false);
    assert.equal(isWxSummonCooldownArmBlockedFrostSpell(frost), true);
    assert.equal(isWxSummonCooldownArmSpell(mend), false);
    assert.equal(
      isWxSummonCooldownArmSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxSummonCooldownArmSpell(slow),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(isWxSummonCooldownArmBlockedSlowSpell(slow), true);
    assert.equal(isWxSummonCooldownArmSpell(mustSpell("starter-drain")), false);
    assert.equal(
      isWxSummonCooldownArmSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxSummonCooldownArmBlockedDotSpell(poison), true);
    assert.equal(isWxSummonCooldownArmBlockedDotSpell(venom), true);
    assert.equal(isWxSummonCooldownArmBlockedDotSpell(inferno), true);
    assert.equal(isWxSummonCooldownArmBlockedBuffSpell(iron), true);
    assert.equal(Number(poison.cooldown ?? 0), 0);
    assert.equal(Number(venom.cooldown ?? 0), 0);
    assert.equal(Number(slow.cooldown ?? 0), 0);
    assert.equal(Number(mend.cooldown ?? 0), 0);
    assert.equal(Number(iron.cooldown ?? 0), 0);
  });

  it("Summon Bomber kit is Inferno-only; hunter/archer/heal kits are not", () => {
    const bomberSpell = mustSpell("summon-bomber");
    assert.deepEqual(bomberSpell.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(bomberSpell.summonAI, "bomber");
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    const wolf = mustSpell("summon-dire-wolf");
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    const archerSpell = mustSpell("summon-archer");
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
    assert.equal(wxSummonCooldownArmKitIsBomber(assignedKit), true);
    assert.equal(wxSummonCooldownArmKitIsBomber([physicalAttackSpell]), false);
    assert.equal(
      wxSummonCooldownArmKitIsBomber([poison, slow]),
      false,
      "archer Poison+Slow is #1095/#1096/#1098, not this leftover",
    );
    assert.equal(
      wxSummonCooldownArmKitIsBomber([physicalAttackSpell, venom]),
      false,
      "hunter Strike+Venom is #856/#1123, not this leftover",
    );
    assert.equal(
      wxSummonCooldownArmKitIsBomber([inferno, mend]),
      false,
      "queen Inferno+heal is #967/#972, not this leftover",
    );
    assert.equal(wxSummonCooldownArmKitIsBomber([frost, poison]), false);
    assert.equal(wxSummonCooldownArmKitIsHealer([frost, mend]), true);
    assert.equal(wxSummonCooldownArmKitIsHealer(assignedKit), false);
    assert.equal(wxSummonCooldownArmIsBomberUnit(healthyBomber), true);
    assert.equal(
      wxSummonCooldownArmIsBomberUnit({ summonAI: "kamikaze" }),
      true,
    );
    assert.equal(
      wxSummonCooldownArmIsBomberUnit({ pieceType: "bomber" }),
      true,
    );
    assert.equal(
      wxSummonCooldownArmIsBomberUnit({ summonAI: "hunter" }),
      false,
    );
    assert.equal(
      wxSummonCooldownArmIsBomberUnit({ summonAI: "archer" }),
      false,
    );
    assert.equal(
      wxSummonCooldownArmIsBomberUnit({ pieceType: "queen" }),
      false,
      "pack queen Inferno+heal is not decideSummonBomber",
    );
  });

  it("live applyCast and WX-after-execute never write summon cooldown", () => {
    const exec = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "summonExecutor.ts"),
      "utf8",
    );
    assert.equal(
      exec.includes("cooldown"),
      false,
      "summonExecutor still has no cooldown write",
    );
    const applyCastAt = exec.indexOf("const applyCast = ");
    assert.ok(applyCastAt >= 0, "live applyCast is present");
    const applyMeleeAt = exec.indexOf("const applyMelee = ", applyCastAt);
    assert.ok(applyMeleeAt > applyCastAt, "applyMelee follows applyCast");
    const applyCast = exec.slice(applyCastAt, applyMeleeAt);
    assert.equal(
      applyCast.includes("cooldown"),
      false,
      "summon applyCast still never arms CD",
    );
    assert.match(applyCast, /currentAp < apCost/);
    const resultAt = exec.indexOf("export interface SummonExecutorResult");
    assert.ok(resultAt >= 0, "SummonExecutorResult is present");
    const resultNext = exec.indexOf("export interface ", resultAt + 1);
    const resultBlock = exec.slice(
      resultAt,
      resultNext > resultAt ? resultNext : resultAt + 500,
    );
    assert.equal(
      resultBlock.includes("cooldown"),
      false,
      "SummonExecutorResult still has no CD field for WX to persist",
    );
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    const execCall = wx.indexOf("const execResult = executeSummonAction(");
    assert.ok(
      execCall >= 0,
      "WX summon branch still calls executeSummonAction",
    );
    const afterExecReturn = wx.indexOf("return;", execCall);
    assert.ok(afterExecReturn > execCall);
    const summonApply = wx.slice(execCall, afterExecReturn);
    assert.equal(
      summonApply.includes("enemyCooldownsRef.current.set"),
      false,
      "WX after executeSummonAction still does not persist summon CD",
    );
    assert.ok(
      summonApply.includes("execResult.currentAp"),
      "WX still copies AP/MP/HP from the executor result",
    );
    const packSet = wx.indexOf("enemyCooldownsRef.current.set");
    assert.ok(
      packSet > afterExecReturn,
      "pack/boss CD writes stay after summon",
    );
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideSummonBomber");
    assert.ok(start >= 0, "live decideSummonBomber is present");
    const nextFn = ai.indexOf("\nfunction ", start + 1);
    const body = ai.slice(start, nextFn > start ? nextFn : start + 2500);
    assert.ok(body.includes("findKitSpell"));
    assert.equal(
      body.includes("aiCanCast"),
      false,
      "bomber still skips LoS (guardian/healer/bomber decide skip aiCanCast)",
    );
    assert.equal(wxSummonLiveApplyCastWouldArmCooldown(inferno), false);
    assert.equal(wxSummonLiveApplyCastCooldownEntry(inferno), null);
    assert.equal(wxSummonAdvertisedWouldArmCooldown(inferno), true);
  });

  it("highlighted in-range Inferno dest executes and advertised-arms CD 3", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(
      wxSummonCooldownArmInRange(origin, infernoDest, inferno),
      true,
    );
    assert.equal(chebyshevOnBoard(origin, infernoDest), 3);
    assert.equal(wxSummonCooldownArmClusterCount(infernoDest, cluster), 2);
    assert.equal(AI_KAMIKAZE_MIN_TARGETS, 2);
    assert.equal(AI_KAMIKAZE_BLAST_RADIUS, 2);
    assert.equal(wxSummonCooldownArmIsReady(inferno, readyRemaining), true);
    assert.equal(
      wxSummonCooldownArmRemaining("spell-inferno", readyRemaining),
      0,
    );
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    const decided = shouldDecideWxSummonCooldownArmCast(legalArgs);
    const executable = canExecuteWxSummonCooldownArmCast(legalArgs);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(decided, executable);
    assert.equal(
      wxSummonCooldownArmHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.deepEqual(armWxSummonCooldown(legalArgs), {
      spellId: "spell-inferno",
      turns: 3,
    });
    assert.equal(wxSummonLiveApplyCastCooldownEntry(inferno), null);
    const advertisedNext = nextWxSummonCooldownMap(
      new Map(),
      armWxSummonCooldown(legalArgs),
    );
    assert.equal(advertisedNext.get("spell-inferno"), 3);
    const liveNext = nextWxSummonCooldownMap(
      new Map(),
      wxSummonLiveApplyCastCooldownEntry(inferno),
    );
    assert.equal(liveNext.get("spell-inferno"), undefined);
    assert.equal(
      wxSummonLiveWouldRecastBecauseApplyCastSkippedArm(legalArgs),
      true,
      "live remaining stays 0 after a legal dest, so the next decide recasts",
    );
    assert.equal(
      wxSummonCooldownArmInRange(origin, infernoDest, inferno),
      enemyCastRangeOk(origin, infernoDest, inferno),
    );
    assert.equal(canAffordCastAp(5, Number(inferno.apCost)), true);
    assert.equal(occupant.x, infernoDest.x);
  });

  it("player auto-summon bomber still advertised-arms ready Inferno", () => {
    const autoBomber = bomberAt("bomber-p", 4, 4, 80, 100, "bomber", "player");
    const foes = [
      { id: "enemy-1", x: 7, y: 4, hp: 40, side: "enemy" as const },
      { id: "enemy-2", x: 6, y: 4, hp: 40, side: "enemy" as const },
    ];
    const args = {
      spell: inferno,
      assignedSpells: assignedKit,
      remainingBySpellId: readyRemaining,
      origin,
      targetCell: infernoDest,
      occupant: foes[0],
      opponents: foes,
      bomber: autoBomber,
      bomberSide: "player" as const,
      currentAp: 5,
    };
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: infernoDest,
        opponents: foes,
        bomber: autoBomber,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    assert.equal(canExecuteWxSummonCooldownArmCast(args), true);
    assert.deepEqual(armWxSummonCooldown(args), {
      spellId: "spell-inferno",
      turns: 3,
    });
  });

  it("cannot execute or arm Inferno beyond range 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, inferno), false);
    assert.equal(wxSummonCooldownArmInRange(origin, tooFar, inferno), false);
    const farCluster = [playerAt("player", 8, 4), playerAt("player-2", 7, 4)];
    const base = {
      spell: inferno,
      assignedSpells: assignedKit,
      remainingBySpellId: readyRemaining,
      origin,
      bomber: healthyBomber,
      bomberSide: "enemy" as const,
      currentAp: 5,
    };
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        opponents: farCluster,
      }),
      false,
    );
    assert.equal(
      armWxSummonCooldown({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        opponents: farCluster,
      }),
      null,
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4, 0),
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        targetCell: infernoDest,
        occupant: { id: "bomber-2", x: 7, y: 4, hp: 12, side: "enemy" },
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        targetCell: infernoDest,
        occupant: null,
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      wxSummonCooldownArmHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot re-arm Inferno whose advertised remaining is already 3", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(
      wxSummonCooldownArmRemaining("spell-inferno", spentRemaining),
      3,
    );
    assert.equal(wxSummonCooldownArmIsReady(inferno, spentRemaining), false);
    assert.equal(
      wxSummonCooldownArmReadySpell({
        assignedSpells: assignedKit,
        remainingBySpellId: spentRemaining,
      }),
      null,
    );
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: spentRemaining,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      }),
      null,
      "already-armed remaining 3 cannot recast; #1158 owns unfiltered available",
    );
    const spentArgs = {
      ...legalArgs,
      remainingBySpellId: spentRemaining,
      occupant,
    };
    assert.equal(shouldDecideWxSummonCooldownArmCast(spentArgs), false);
    assert.equal(canExecuteWxSummonCooldownArmCast(spentArgs), false);
    assert.equal(armWxSummonCooldown(spentArgs), null);
  });

  it("catalog bomber 1 AP cannot pay applyCast; 5 AP can", () => {
    const args = {
      spell: inferno,
      assignedSpells: assignedKit,
      remainingBySpellId: readyRemaining,
      origin,
      targetCell: infernoDest,
      occupant: playerAt("player", 7, 4),
      opponents: cluster,
      bomber: healthyBomber,
      bomberSide: "enemy" as const,
    };
    assert.equal(canAffordWxSummonCooldownArmCast(1, inferno), false);
    assert.equal(
      shouldDecideWxSummonCooldownArmCast({
        ...args,
        currentAp: 1,
      }),
      false,
      "catalog bomber ap 1 cannot pay Inferno 5 — #762; do not rebalance",
    );
    assert.equal(
      armWxSummonCooldown({
        ...args,
        currentAp: 1,
      }),
      null,
    );
    assert.equal(
      shouldDecideWxSummonCooldownArmCast({
        ...args,
        currentAp: 5,
      }),
      true,
    );
  });

  it("does not steal a lone healthy foe (await-cluster) or pack Inferno CD (#972)", () => {
    const lone = [playerAt("player", 7, 4)];
    assert.equal(wxSummonCooldownArmClusterCount(infernoDest, lone), 1);
    assert.equal(
      wxSummonCooldownArmDetonateEligible({
        clusterCount: 1,
        hpFrac: 1,
      }),
      false,
    );
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: healthyBomber,
        currentAp: 5,
      }),
      null,
      "lone healthy foe is await-cluster; #799 owns cluster radius",
    );
    assert.equal(
      armWxSummonCooldown({
        ...legalArgs,
        opponents: lone,
        occupant: playerAt("player", 7, 4),
      }),
      null,
    );
    const lowHp = bomberAt("bomber-low", 4, 4, 20, 100);
    assert.ok(wxSummonCooldownArmHpFrac(lowHp) < AI_KAMIKAZE_LOW_HP_PCT);
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: lowHp,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    assert.deepEqual(
      armWxSummonCooldown({
        ...legalArgs,
        opponents: lone,
        occupant: playerAt("player", 7, 4),
        bomber: lowHp,
      }),
      { spellId: "spell-inferno", turns: 3 },
    );
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: spentRemaining,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: lowHp,
        currentAp: 5,
      }),
      null,
      "low-HP already-armed Inferno still cannot recast",
    );
    const queen = {
      id: "queen-1",
      x: 4,
      y: 4,
      hp: 80,
      maxHp: 100,
      side: "enemy" as const,
      pieceType: "queen",
    };
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: [inferno, mend],
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: queen,
        currentAp: 5,
      }),
      null,
      "#972 owns pack Inferno CD nested under damage>0",
    );
    assert.equal(
      armWxSummonCooldown({
        ...legalArgs,
        assignedSpells: [inferno, mend],
        bomber: queen,
      }),
      null,
    );
    assert.equal(
      armWxSummonCooldown({
        ...legalArgs,
        spell: { ...poison, cooldown: 2 },
        assignedSpells: [{ ...poison, cooldown: 2 }],
      }),
      null,
      "Poison that gains a catalog CD is still #1095/#1096, not this arm",
    );
  });

  it("does not steal hunter Venom (#1123) or archer Poison/Slow (#1095/#1096/#1098)", () => {
    const hunter = bomberAt("wolf-1", 4, 4, 80, 100, "hunter");
    hunter.pieceType = "wolf";
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: [physicalAttackSpell, venom],
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: { x: 6, y: 4 },
        opponents: [playerAt("player", 6, 4), playerAt("player-2", 5, 4)],
        bomber: hunter,
        currentAp: 5,
      }),
      null,
    );
    const archer = bomberAt("archer-1", 4, 4, 80, 100, "archer");
    archer.pieceType = "archer";
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: [poison, slow],
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: { x: 8, y: 4 },
        opponents: [playerAt("player", 8, 4), playerAt("player-2", 7, 4)],
        bomber: archer,
        currentAp: 5,
      }),
      null,
    );
  });

  it("does not drop Rallying Cry via usableByEnemy (player-side wisp kit)", () => {
    assert.equal(rally.usableByEnemy, false);
    assert.equal(isWxSummonCooldownArmSpell(rally), false);
    assert.equal(
      pickWxSummonCooldownArmSpell({
        assignedSpells: [mend, rally],
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: origin,
        opponents: cluster,
        bomber: bomberAt("wisp-1", 4, 4, 80, 100, "healer"),
        currentAp: 5,
      }),
      null,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });

  it("still decides wall-blocked ready Inferno (bomber skips LoS)", () => {
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(
      canExecuteWxSummonCooldownArmCast(legalArgs),
      true,
      "catalog Inferno has no lineOfSight flag; decideSummonBomber skips aiCanCast",
    );
    assert.deepEqual(armWxSummonCooldown(legalArgs), {
      spellId: "spell-inferno",
      turns: 3,
    });
  });

  it("cannot decide Strike, Poison, Frost, Slow, Venom, or heal as this Inferno leftover", () => {
    const occupant = playerAt("player", 7, 4);
    const base = {
      origin,
      targetCell: infernoDest,
      occupant,
      opponents: cluster,
      bomber: healthyBomber,
      bomberSide: "enemy" as const,
      currentAp: 5,
      remainingBySpellId: readyRemaining,
    };
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        spell: physicalAttackSpell,
        assignedSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        spell: poison,
        assignedSpells: assignedKit,
      }),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        spell: frost,
        assignedSpells: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        spell: slow,
        assignedSpells: [slow],
      }),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        spell: venom,
        assignedSpells: [venom],
      }),
      false,
      "#856/#1123 own Venom ticks / LoS-blocked stalk",
    );
    assert.equal(
      canExecuteWxSummonCooldownArmCast({
        ...base,
        spell: mend,
        assignedSpells: [inferno, mend],
        bomber: bomberAt("wisp-1", 4, 4, 80, 100, "healer"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
    assert.equal(
      armWxSummonCooldown({
        ...base,
        spell: physicalAttackSpell,
        assignedSpells: [physicalAttackSpell],
      }),
      null,
    );
  });
});
