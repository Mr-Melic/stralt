/**
 * Combat action parity: summon-bomber `decideSummonBomber` Inferno cooldown
 * vs `findKitSpell` assigned fallback. A decided legal Inferno dest
 * (living hostile cluster at Chebyshev 3, Inferno still in available,
 * 5-AP wallet can pay) is executable; a spent Inferno (available miss,
 * assigned still has it) cannot execute; live still detonates via
 * assigned fallback.
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
  canAffordWxSummonBomberInfernoCooldownCast,
  canExecuteWxSummonBomberInfernoCooldownCast,
  isWxSummonBomberInfernoCooldownBlockedBuffSpell,
  isWxSummonBomberInfernoCooldownBlockedDotSpell,
  isWxSummonBomberInfernoCooldownBlockedFrostSpell,
  isWxSummonBomberInfernoCooldownBlockedPoisonSpell,
  isWxSummonBomberInfernoCooldownBlockedSlowSpell,
  isWxSummonBomberInfernoCooldownBlockedVenomSpell,
  isWxSummonBomberInfernoCooldownHealKitSpell,
  isWxSummonBomberInfernoCooldownSpell,
  pickWxSummonBomberInfernoCooldownSpell,
  shouldDecideWxSummonBomberInfernoCooldownCast,
  wxSummonBomberInfernoCooldownAdvertisedTurns,
  wxSummonBomberInfernoCooldownApCost,
  wxSummonBomberInfernoCooldownClusterCount,
  wxSummonBomberInfernoCooldownDetonateEligible,
  wxSummonBomberInfernoCooldownHighlightedTargetIsExecutable,
  wxSummonBomberInfernoCooldownHpFrac,
  wxSummonBomberInfernoCooldownInRange,
  wxSummonBomberInfernoCooldownIsBomberUnit,
  wxSummonBomberInfernoCooldownKitIsBomber,
  wxSummonBomberInfernoCooldownKitIsHealer,
  wxSummonBomberInfernoCooldownLiveFindKitSpell,
  wxSummonBomberInfernoCooldownRange,
  wxSummonBomberInfernoCooldownReadySpell,
  wxSummonBomberLiveWouldDetonateAssignedFallback,
} from "./wxSummonBomberInfernoCooldown.ts";

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

describe("summon decideSummonBomber Inferno cooldown vs findKitSpell assigned fallback", () => {
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
  const availableInferno = [inferno];
  const spentAvailable: typeof availableInferno = [];

  it("treats catalog Inferno as the CD-armed bomber leftover", () => {
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
    assert.equal(isWxSummonBomberInfernoCooldownSpell(inferno), true);
    assert.equal(
      wxSummonBomberInfernoCooldownRange(inferno),
      enemySpellRange(inferno),
    );
    assert.equal(wxSummonBomberInfernoCooldownAdvertisedTurns(inferno), 3);
    assert.equal(wxSummonBomberInfernoCooldownApCost(inferno), 5);
    assert.equal(isWxSummonBomberInfernoCooldownHealKitSpell(inferno), false);
    assert.equal(isWxSummonBomberInfernoCooldownHealKitSpell(mend), true);
    assert.equal(isWxSummonBomberInfernoCooldownHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell({
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
      isWxSummonBomberInfernoCooldownSpell({
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
      isWxSummonBomberInfernoCooldownSpell({
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
      isWxSummonBomberInfernoCooldownSpell({
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
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell(physicalAttackSpell),
      false,
    );
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell(poison),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(
      isWxSummonBomberInfernoCooldownBlockedPoisonSpell(poison),
      true,
    );
    assert.equal(isWxSummonBomberInfernoCooldownSpell(venom), false);
    assert.equal(isWxSummonBomberInfernoCooldownBlockedVenomSpell(venom), true);
    assert.equal(isWxSummonBomberInfernoCooldownSpell(frost), false);
    assert.equal(isWxSummonBomberInfernoCooldownBlockedFrostSpell(frost), true);
    assert.equal(isWxSummonBomberInfernoCooldownSpell(mend), false);
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell(slow),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(isWxSummonBomberInfernoCooldownBlockedSlowSpell(slow), true);
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isWxSummonBomberInfernoCooldownSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxSummonBomberInfernoCooldownBlockedDotSpell(poison), true);
    assert.equal(isWxSummonBomberInfernoCooldownBlockedDotSpell(venom), true);
    assert.equal(isWxSummonBomberInfernoCooldownBlockedDotSpell(inferno), true);
    assert.equal(isWxSummonBomberInfernoCooldownBlockedBuffSpell(iron), true);
    assert.equal(Number(poison.cooldown ?? 0), 0);
    assert.equal(Number(venom.cooldown ?? 0), 0);
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
    assert.equal(wxSummonBomberInfernoCooldownKitIsBomber(assignedKit), true);
    assert.equal(
      wxSummonBomberInfernoCooldownKitIsBomber(availableInferno),
      true,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownKitIsBomber([physicalAttackSpell]),
      false,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownKitIsBomber([poison, slow]),
      false,
      "archer Poison+Slow is #1095/#1096/#1098, not this leftover",
    );
    assert.equal(
      wxSummonBomberInfernoCooldownKitIsBomber([physicalAttackSpell, venom]),
      false,
      "hunter Strike+Venom is #856/#1123, not this leftover",
    );
    assert.equal(
      wxSummonBomberInfernoCooldownKitIsBomber([inferno, mend]),
      false,
      "queen Inferno+heal is #967/#972, not this leftover",
    );
    assert.equal(
      wxSummonBomberInfernoCooldownKitIsBomber([frost, poison]),
      false,
    );
    assert.equal(wxSummonBomberInfernoCooldownKitIsHealer([frost, mend]), true);
    assert.equal(wxSummonBomberInfernoCooldownKitIsHealer(assignedKit), false);
    assert.equal(
      wxSummonBomberInfernoCooldownIsBomberUnit(healthyBomber),
      true,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownIsBomberUnit({ summonAI: "kamikaze" }),
      true,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownIsBomberUnit({ pieceType: "bomber" }),
      true,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownIsBomberUnit({ summonAI: "hunter" }),
      false,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownIsBomberUnit({ summonAI: "archer" }),
      false,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownIsBomberUnit({ pieceType: "queen" }),
      false,
      "pack queen Inferno+heal is not decideSummonBomber",
    );
  });

  it("live findKitSpell still falls back to assigned when available misses", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const findDoc = ai.indexOf("Look up a kit spell by id");
    assert.ok(findDoc >= 0, "live findKitSpell JSDoc is present");
    const findStart = ai.indexOf("function findKitSpell");
    assert.ok(findStart >= 0, "live findKitSpell is present");
    const findNext = ai.indexOf("\nfunction ", findStart + 1);
    const findBody = ai.slice(
      findDoc,
      findNext > findStart ? findNext : findStart + 900,
    );
    assert.ok(findBody.includes("fromAvailable"));
    assert.ok(findBody.includes("fromAssigned"));
    assert.ok(
      findBody.includes("cooldowns are"),
      "JSDoc still claims available-first respects cooldowns",
    );
    assert.ok(findBody.includes("not ready"));
    const fromAvailAt = findBody.indexOf("fromAvailable");
    const fromAssignedAt = findBody.indexOf("fromAssigned");
    assert.ok(
      fromAvailAt < fromAssignedAt,
      "available still precedes assigned fallback",
    );
    const start = ai.indexOf("function decideSummonBomber");
    assert.ok(start >= 0, "live decideSummonBomber is present");
    const nextFn = ai.indexOf("\nfunction ", start + 1);
    const body = ai.slice(start, nextFn > start ? nextFn : start + 2500);
    assert.ok(
      body.includes("kit[0]"),
      "decideSummonBomber still looks up kit Inferno",
    );
    assert.ok(body.includes("findKitSpell"));
    assert.equal(
      body.includes("aiCanCast"),
      false,
      "bomber still skips LoS (guardian/healer/bomber decide skip aiCanCast)",
    );
    assert.ok(body.includes("detonate"));
    const kitBlock = ai.slice(
      ai.indexOf("const SUMMON_KIT"),
      ai.indexOf("const SUMMON_KIT") + 500,
    );
    assert.ok(kitBlock.includes('bomber: ["spell-inferno"]'));
    const wx = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/WorldExploration.tsx",
      ),
      "utf8",
    );
    assert.ok(
      wx.includes("availableSpells: summonEnemy.spells ?? []"),
      "WX summon availableSpells is still the unfiltered assigned list",
    );
    assert.ok(wx.includes("assignedSpells: summonEnemy.spells ?? []"));
    const exec = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "summonExecutor.ts"),
      "utf8",
    );
    const applyCastAt = exec.indexOf("const applyCast = ");
    assert.ok(applyCastAt >= 0, "live applyCast is present");
    const applyCast = exec.slice(applyCastAt, applyCastAt + 1800);
    assert.equal(applyCast.includes("cooldown"), false);
    assert.match(applyCast, /currentAp < apCost/);
    assert.equal(
      wxSummonBomberInfernoCooldownLiveFindKitSpell(availableInferno)?.id,
      "spell-inferno",
    );
    assert.equal(
      wxSummonBomberInfernoCooldownLiveFindKitSpell(spentAvailable, assignedKit)
        ?.id,
      "spell-inferno",
      "live assigned fallback still returns spent Inferno",
    );
    assert.equal(
      wxSummonBomberInfernoCooldownReadySpell(spentAvailable),
      null,
      "documented contract: available miss is not ready",
    );
    assert.equal(
      wxSummonBomberLiveWouldDetonateAssignedFallback({
        assignedSpells: assignedKit,
        availableSpells: spentAvailable,
      }),
      true,
    );
    assert.equal(
      wxSummonBomberLiveWouldDetonateAssignedFallback({
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
      }),
      false,
    );
  });

  it("picks in-range Inferno when available still has it and the cluster is dense", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(
      wxSummonBomberInfernoCooldownInRange(origin, infernoDest, inferno),
      true,
    );
    assert.equal(chebyshevOnBoard(origin, infernoDest), 3);
    assert.equal(
      wxSummonBomberInfernoCooldownClusterCount(infernoDest, cluster),
      2,
    );
    assert.equal(AI_KAMIKAZE_MIN_TARGETS, 2);
    assert.equal(AI_KAMIKAZE_BLAST_RADIUS, 2);
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    const decided = shouldDecideWxSummonBomberInfernoCooldownCast({
      spell: inferno,
      assignedSpells: assignedKit,
      availableSpells: availableInferno,
      origin,
      targetCell: infernoDest,
      occupant,
      opponents: cluster,
      bomber: healthyBomber,
      bomberSide: "enemy",
      currentAp: 5,
    });
    const executable = canExecuteWxSummonBomberInfernoCooldownCast({
      spell: inferno,
      assignedSpells: assignedKit,
      availableSpells: availableInferno,
      origin,
      targetCell: infernoDest,
      occupant,
      opponents: cluster,
      bomber: healthyBomber,
      bomberSide: "enemy",
      currentAp: 5,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(decided, executable);
    assert.equal(
      wxSummonBomberInfernoCooldownHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownInRange(origin, infernoDest, inferno),
      enemyCastRangeOk(origin, infernoDest, inferno),
    );
    assert.equal(canAffordCastAp(5, Number(inferno.apCost)), true);
  });

  it("player auto-summon bomber still picks ready Inferno", () => {
    const autoBomber = bomberAt("bomber-p", 4, 4, 80, 100, "bomber", "player");
    const foes = [
      { id: "enemy-1", x: 7, y: 4, hp: 40, side: "enemy" as const },
      { id: "enemy-2", x: 6, y: 4, hp: 40, side: "enemy" as const },
    ];
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
        origin,
        targetCell: infernoDest,
        opponents: foes,
        bomber: autoBomber,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
        origin,
        targetCell: infernoDest,
        occupant: foes[0],
        opponents: foes,
        bomber: autoBomber,
        bomberSide: "player",
        currentAp: 5,
      }),
      true,
    );
  });

  it("cannot execute Inferno beyond range 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(enemyCastRangeOk(origin, tooFar, inferno), false);
    assert.equal(
      wxSummonBomberInfernoCooldownInRange(origin, tooFar, inferno),
      false,
    );
    const farCluster = [playerAt("player", 8, 4), playerAt("player-2", 7, 4)];
    const base = {
      spell: inferno,
      assignedSpells: assignedKit,
      availableSpells: availableInferno,
      origin,
      bomber: healthyBomber,
      bomberSide: "enemy" as const,
      currentAp: 5,
    };
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        opponents: farCluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4, 0),
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        targetCell: infernoDest,
        occupant: { id: "bomber-2", x: 7, y: 4, hp: 12, side: "enemy" },
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        targetCell: infernoDest,
        occupant: null,
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot execute spent Inferno when available misses and assigned still has it", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(wxSummonBomberInfernoCooldownReadySpell(spentAvailable), null);
    assert.equal(
      wxSummonBomberInfernoCooldownLiveFindKitSpell(spentAvailable, assignedKit)
        ?.id,
      "spell-inferno",
    );
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: spentAvailable,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      }),
      null,
      "available-only lookup refuses the assigned fallback leftover",
    );
    assert.equal(
      shouldDecideWxSummonBomberInfernoCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        availableSpells: spentAvailable,
        origin,
        targetCell: infernoDest,
        occupant,
        opponents: cluster,
        bomber: healthyBomber,
        bomberSide: "enemy",
        currentAp: 5,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        availableSpells: spentAvailable,
        origin,
        targetCell: infernoDest,
        occupant,
        opponents: cluster,
        bomber: healthyBomber,
        bomberSide: "enemy",
        currentAp: 5,
      }),
      false,
      "a CD-filtered dest is not highlighted and cannot execute",
    );
  });

  it("catalog bomber 1 AP cannot pay applyCast; 5 AP can", () => {
    const args = {
      spell: inferno,
      assignedSpells: assignedKit,
      availableSpells: availableInferno,
      origin,
      targetCell: infernoDest,
      occupant: playerAt("player", 7, 4),
      opponents: cluster,
      bomber: healthyBomber,
      bomberSide: "enemy" as const,
    };
    assert.equal(canAffordWxSummonBomberInfernoCooldownCast(1, inferno), false);
    assert.equal(
      shouldDecideWxSummonBomberInfernoCooldownCast({
        ...args,
        currentAp: 1,
      }),
      false,
      "catalog bomber ap 1 cannot pay Inferno 5 — #762; do not rebalance",
    );
    assert.equal(
      shouldDecideWxSummonBomberInfernoCooldownCast({
        ...args,
        currentAp: 5,
      }),
      true,
    );
  });

  it("does not steal a lone healthy foe (await-cluster) or pack Inferno CD (#972)", () => {
    const lone = [playerAt("player", 7, 4)];
    assert.equal(
      wxSummonBomberInfernoCooldownClusterCount(infernoDest, lone),
      1,
    );
    assert.equal(
      wxSummonBomberInfernoCooldownDetonateEligible({
        clusterCount: 1,
        hpFrac: 1,
      }),
      false,
    );
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: healthyBomber,
        currentAp: 5,
      }),
      null,
      "lone healthy foe is await-cluster; #799 owns cluster radius",
    );
    const lowHp = bomberAt("bomber-low", 4, 4, 20, 100);
    assert.ok(
      wxSummonBomberInfernoCooldownHpFrac(lowHp) < AI_KAMIKAZE_LOW_HP_PCT,
    );
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: lowHp,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: spentAvailable,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: lowHp,
        currentAp: 5,
      }),
      null,
      "low-HP spent Inferno still cannot execute through assigned fallback",
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
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: [inferno, mend],
        availableSpells: spentAvailable,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: queen,
        currentAp: 5,
      }),
      null,
      "#972 owns pack Inferno CD nested under damage>0",
    );
  });

  it("does not steal hunter Venom (#1123) or archer Poison/Slow (#1095/#1096/#1098)", () => {
    const hunter = bomberAt("wolf-1", 4, 4, 80, 100, "hunter");
    hunter.pieceType = "wolf";
    assert.equal(
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: [physicalAttackSpell, venom],
        availableSpells: [venom],
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
      pickWxSummonBomberInfernoCooldownSpell({
        assignedSpells: [poison, slow],
        availableSpells: [poison, slow],
        origin,
        targetCell: { x: 8, y: 4 },
        opponents: [playerAt("player", 8, 4), playerAt("player-2", 7, 4)],
        bomber: archer,
        currentAp: 5,
      }),
      null,
    );
  });

  it("still decides wall-blocked ready Inferno (bomber skips LoS)", () => {
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        availableSpells: availableInferno,
        origin,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4),
        opponents: cluster,
        bomber: healthyBomber,
        bomberSide: "enemy",
        currentAp: 5,
      }),
      true,
      "catalog Inferno has no lineOfSight flag; decideSummonBomber skips aiCanCast",
    );
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
    };
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        spell: poison,
        assignedSpells: assignedKit,
        availableSpells: [poison],
      }),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        spell: frost,
        availableSpells: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        spell: slow,
        availableSpells: [slow],
      }),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        spell: venom,
        availableSpells: [venom],
      }),
      false,
      "#856/#1123 own Venom ticks / LoS-blocked stalk",
    );
    assert.equal(
      canExecuteWxSummonBomberInfernoCooldownCast({
        ...base,
        spell: mend,
        assignedSpells: [inferno, mend],
        availableSpells: [inferno, mend],
        bomber: bomberAt("wisp-1", 4, 4, 80, 100, "healer"),
      }),
      false,
      "#985 owns the range-0 heal picker; do not remap dest onto the caster",
    );
  });
});
