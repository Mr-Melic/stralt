/**
 * Combat action parity: WX summon `availableSpells` unfiltered vs pack
 * CD filter. A decided legal Inferno dest (living hostile cluster at
 * Chebyshev 3, remaining 0, 5-AP wallet can pay) is executable; a spent
 * Inferno (remaining 3, still in unfiltered available) cannot execute;
 * live still detonates because WX never CD-filters summon available.
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
  canAffordWxSummonAvailableCooldownCast,
  canExecuteWxSummonAvailableCooldownCast,
  isWxSummonAvailableCooldownBlockedBuffSpell,
  isWxSummonAvailableCooldownBlockedDotSpell,
  isWxSummonAvailableCooldownBlockedFrostSpell,
  isWxSummonAvailableCooldownBlockedPoisonSpell,
  isWxSummonAvailableCooldownBlockedSlowSpell,
  isWxSummonAvailableCooldownBlockedVenomSpell,
  isWxSummonAvailableCooldownHealKitSpell,
  isWxSummonAvailableCooldownSpell,
  pickWxSummonAvailableCooldownSpell,
  shouldDecideWxSummonAvailableCooldownCast,
  wxSummonAvailableCooldownAdvertisedTurns,
  wxSummonAvailableCooldownApCost,
  wxSummonAvailableCooldownClusterCount,
  wxSummonAvailableCooldownDetonateEligible,
  wxSummonAvailableCooldownHighlightedTargetIsExecutable,
  wxSummonAvailableCooldownHpFrac,
  wxSummonAvailableCooldownInRange,
  wxSummonAvailableCooldownIsBomberUnit,
  wxSummonAvailableCooldownKitIsBomber,
  wxSummonAvailableCooldownKitIsHealer,
  wxSummonAvailableCooldownRange,
  wxSummonAvailableCooldownReadySpell,
  wxSummonAvailableCooldownRemaining,
  wxSummonAvailableSpellsFromAssigned,
  wxSummonLiveAvailableSpells,
  wxSummonLiveWouldKeepSpentInAvailable,
  wxSummonSpellIsCooldownReady,
} from "./wxSummonAvailableCooldown.ts";

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

describe("WX summon availableSpells unfiltered vs pack CD filter", () => {
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

  it("treats catalog Inferno as the CD-filtered summon leftover", () => {
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
    assert.equal(isWxSummonAvailableCooldownSpell(inferno), true);
    assert.equal(
      wxSummonAvailableCooldownRange(inferno),
      enemySpellRange(inferno),
    );
    assert.equal(wxSummonAvailableCooldownAdvertisedTurns(inferno), 3);
    assert.equal(wxSummonAvailableCooldownApCost(inferno), 5);
    assert.equal(isWxSummonAvailableCooldownHealKitSpell(inferno), false);
    assert.equal(isWxSummonAvailableCooldownHealKitSpell(mend), true);
    assert.equal(isWxSummonAvailableCooldownHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isWxSummonAvailableCooldownSpell({
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
      isWxSummonAvailableCooldownSpell({
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
      isWxSummonAvailableCooldownSpell({
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
      isWxSummonAvailableCooldownSpell({
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
    assert.equal(isWxSummonAvailableCooldownSpell(physicalAttackSpell), false);
    assert.equal(
      isWxSummonAvailableCooldownSpell(poison),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(isWxSummonAvailableCooldownBlockedPoisonSpell(poison), true);
    assert.equal(isWxSummonAvailableCooldownSpell(venom), false);
    assert.equal(isWxSummonAvailableCooldownBlockedVenomSpell(venom), true);
    assert.equal(isWxSummonAvailableCooldownSpell(frost), false);
    assert.equal(isWxSummonAvailableCooldownBlockedFrostSpell(frost), true);
    assert.equal(isWxSummonAvailableCooldownSpell(mend), false);
    assert.equal(
      isWxSummonAvailableCooldownSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isWxSummonAvailableCooldownSpell(slow),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(isWxSummonAvailableCooldownBlockedSlowSpell(slow), true);
    assert.equal(
      isWxSummonAvailableCooldownSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isWxSummonAvailableCooldownSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isWxSummonAvailableCooldownBlockedDotSpell(poison), true);
    assert.equal(isWxSummonAvailableCooldownBlockedDotSpell(venom), true);
    assert.equal(isWxSummonAvailableCooldownBlockedDotSpell(inferno), true);
    assert.equal(isWxSummonAvailableCooldownBlockedBuffSpell(iron), true);
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
    assert.equal(wxSummonAvailableCooldownKitIsBomber(assignedKit), true);
    assert.equal(
      wxSummonAvailableCooldownKitIsBomber([physicalAttackSpell]),
      false,
    );
    assert.equal(
      wxSummonAvailableCooldownKitIsBomber([poison, slow]),
      false,
      "archer Poison+Slow is #1095/#1096/#1098, not this leftover",
    );
    assert.equal(
      wxSummonAvailableCooldownKitIsBomber([physicalAttackSpell, venom]),
      false,
      "hunter Strike+Venom is #856/#1123, not this leftover",
    );
    assert.equal(
      wxSummonAvailableCooldownKitIsBomber([inferno, mend]),
      false,
      "queen Inferno+heal is #967/#972, not this leftover",
    );
    assert.equal(wxSummonAvailableCooldownKitIsBomber([frost, poison]), false);
    assert.equal(wxSummonAvailableCooldownKitIsHealer([frost, mend]), true);
    assert.equal(wxSummonAvailableCooldownKitIsHealer(assignedKit), false);
    assert.equal(wxSummonAvailableCooldownIsBomberUnit(healthyBomber), true);
    assert.equal(
      wxSummonAvailableCooldownIsBomberUnit({ summonAI: "kamikaze" }),
      true,
    );
    assert.equal(
      wxSummonAvailableCooldownIsBomberUnit({ pieceType: "bomber" }),
      true,
    );
    assert.equal(
      wxSummonAvailableCooldownIsBomberUnit({ summonAI: "hunter" }),
      false,
    );
    assert.equal(
      wxSummonAvailableCooldownIsBomberUnit({ summonAI: "archer" }),
      false,
    );
    assert.equal(
      wxSummonAvailableCooldownIsBomberUnit({ pieceType: "queen" }),
      false,
      "pack queen Inferno+heal is not decideSummonBomber",
    );
  });

  it("live WX summon available is still the unfiltered assigned list", () => {
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
    const packFilter = wx.indexOf(
      "const availableSpells = assignedSpells.filter(",
    );
    assert.ok(packFilter >= 0, "pack enemy ctx still CD-filters available");
    const packSlice = wx.slice(packFilter, packFilter + 280);
    assert.ok(packSlice.includes("enemyCooldownMap.get(s.id)"));
    assert.ok(packSlice.includes("usableByEnemy !== false"));
    const summonAvailAt = wx.indexOf(
      "availableSpells: summonEnemy.spells ?? []",
    );
    assert.ok(
      summonAvailAt < packFilter,
      "summon ctx is built before the pack filter",
    );
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const findStart = ai.indexOf("function findKitSpell");
    assert.ok(findStart >= 0, "live findKitSpell is present");
    const findNext = ai.indexOf("\nfunction ", findStart + 1);
    const findBody = ai.slice(
      findStart,
      findNext > findStart ? findNext : findStart + 400,
    );
    assert.ok(findBody.includes("fromAvailable"));
    assert.ok(findBody.includes("fromAssigned"));
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
    const exec = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "summonExecutor.ts"),
      "utf8",
    );
    const applyCastAt = exec.indexOf("const applyCast = ");
    assert.ok(applyCastAt >= 0, "live applyCast is present");
    const applyCast = exec.slice(applyCastAt, applyCastAt + 1800);
    assert.equal(
      applyCast.includes("cooldown"),
      false,
      "summon applyCast still never arms CD — next leftover, not this filter",
    );
    assert.match(applyCast, /currentAp < apCost/);
    const liveAvailable = wxSummonLiveAvailableSpells(assignedKit);
    assert.equal(liveAvailable.length, 1);
    assert.equal(liveAvailable[0]?.id, "spell-inferno");
    assert.equal(
      wxSummonAvailableSpellsFromAssigned(assignedKit, spentRemaining).length,
      0,
    );
    assert.equal(
      wxSummonLiveWouldKeepSpentInAvailable({
        assignedSpells: assignedKit,
        remainingBySpellId: spentRemaining,
      }),
      true,
    );
    assert.equal(
      wxSummonLiveWouldKeepSpentInAvailable({
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
      }),
      false,
    );
  });

  it("picks in-range Inferno when pack-style remaining is 0 and the cluster is dense", () => {
    const occupant = playerAt("player", 7, 4);
    assert.equal(
      wxSummonAvailableCooldownInRange(origin, infernoDest, inferno),
      true,
    );
    assert.equal(chebyshevOnBoard(origin, infernoDest), 3);
    assert.equal(
      wxSummonAvailableCooldownClusterCount(infernoDest, cluster),
      2,
    );
    assert.equal(AI_KAMIKAZE_MIN_TARGETS, 2);
    assert.equal(AI_KAMIKAZE_BLAST_RADIUS, 2);
    assert.equal(wxSummonSpellIsCooldownReady(inferno, readyRemaining), true);
    assert.equal(
      wxSummonAvailableCooldownRemaining("spell-inferno", readyRemaining),
      0,
    );
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: wxSummonLiveAvailableSpells(assignedKit),
        remainingBySpellId: readyRemaining,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      })?.id,
      "spell-inferno",
    );
    const decided = shouldDecideWxSummonAvailableCooldownCast({
      spell: inferno,
      assignedSpells: assignedKit,
      availableSpells: wxSummonLiveAvailableSpells(assignedKit),
      remainingBySpellId: readyRemaining,
      origin,
      targetCell: infernoDest,
      occupant,
      opponents: cluster,
      bomber: healthyBomber,
      bomberSide: "enemy",
      currentAp: 5,
    });
    const executable = canExecuteWxSummonAvailableCooldownCast({
      spell: inferno,
      assignedSpells: assignedKit,
      availableSpells: wxSummonLiveAvailableSpells(assignedKit),
      remainingBySpellId: readyRemaining,
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
      wxSummonAvailableCooldownHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.equal(
      wxSummonAvailableCooldownInRange(origin, infernoDest, inferno),
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
      pickWxSummonAvailableCooldownSpell({
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
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
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
      wxSummonAvailableCooldownInRange(origin, tooFar, inferno),
      false,
    );
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
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        targetCell: tooFar,
        occupant: playerAt("player", 8, 4),
        opponents: farCluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        targetCell: infernoDest,
        occupant: playerAt("player", 7, 4, 0),
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        targetCell: infernoDest,
        occupant: { id: "bomber-2", x: 7, y: 4, hp: 12, side: "enemy" },
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        targetCell: infernoDest,
        occupant: null,
        opponents: cluster,
      }),
      false,
    );
    assert.equal(
      wxSummonAvailableCooldownHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot execute spent Inferno that live unfiltered available still holds", () => {
    const occupant = playerAt("player", 7, 4);
    const liveAvailable = wxSummonLiveAvailableSpells(assignedKit);
    assert.equal(liveAvailable[0]?.id, "spell-inferno");
    assert.equal(
      wxSummonAvailableCooldownRemaining("spell-inferno", spentRemaining),
      3,
    );
    assert.equal(wxSummonSpellIsCooldownReady(inferno, spentRemaining), false);
    assert.equal(
      wxSummonAvailableCooldownReadySpell({
        assignedSpells: assignedKit,
        availableSpells: liveAvailable,
        remainingBySpellId: spentRemaining,
      }),
      null,
    );
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: liveAvailable,
        remainingBySpellId: spentRemaining,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      }),
      null,
      "pack-style remaining 3 drops Inferno even though live available still has it",
    );
    assert.equal(
      shouldDecideWxSummonAvailableCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        availableSpells: liveAvailable,
        remainingBySpellId: spentRemaining,
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
      canExecuteWxSummonAvailableCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        availableSpells: liveAvailable,
        remainingBySpellId: spentRemaining,
        origin,
        targetCell: infernoDest,
        occupant,
        opponents: cluster,
        bomber: healthyBomber,
        bomberSide: "enemy",
        currentAp: 5,
      }),
      false,
      "a CD-remaining dest is not highlighted and cannot execute",
    );
  });

  it("does not steal #1150 assigned-fallback spent (available already empty)", () => {
    const occupant = playerAt("player", 7, 4);
    const spentAvailable: typeof assignedKit = [];
    assert.equal(
      wxSummonLiveWouldKeepSpentInAvailable({
        assignedSpells: assignedKit,
        remainingBySpellId: spentRemaining,
      }),
      true,
      "this leftover is remaining>0 with Inferno still in assigned/available",
    );
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
        assignedSpells: assignedKit,
        availableSpells: spentAvailable,
        origin,
        targetCell: infernoDest,
        opponents: cluster,
        bomber: healthyBomber,
        currentAp: 5,
      }),
      null,
      "#1150 owns available-miss / assigned-hit; this sidecar still refuses",
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
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
    assert.equal(canAffordWxSummonAvailableCooldownCast(1, inferno), false);
    assert.equal(
      shouldDecideWxSummonAvailableCooldownCast({
        ...args,
        currentAp: 1,
      }),
      false,
      "catalog bomber ap 1 cannot pay Inferno 5 — #762; do not rebalance",
    );
    assert.equal(
      shouldDecideWxSummonAvailableCooldownCast({
        ...args,
        currentAp: 5,
      }),
      true,
    );
  });

  it("does not steal a lone healthy foe (await-cluster) or pack Inferno CD (#972)", () => {
    const lone = [playerAt("player", 7, 4)];
    assert.equal(wxSummonAvailableCooldownClusterCount(infernoDest, lone), 1);
    assert.equal(
      wxSummonAvailableCooldownDetonateEligible({
        clusterCount: 1,
        hpFrac: 1,
      }),
      false,
    );
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
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
    const lowHp = bomberAt("bomber-low", 4, 4, 20, 100);
    assert.ok(wxSummonAvailableCooldownHpFrac(lowHp) < AI_KAMIKAZE_LOW_HP_PCT);
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
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
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
        assignedSpells: assignedKit,
        remainingBySpellId: spentRemaining,
        origin,
        targetCell: infernoDest,
        opponents: lone,
        bomber: lowHp,
        currentAp: 5,
      }),
      null,
      "low-HP spent Inferno still cannot execute through unfiltered available",
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
      pickWxSummonAvailableCooldownSpell({
        assignedSpells: [inferno, mend],
        remainingBySpellId: spentRemaining,
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
      pickWxSummonAvailableCooldownSpell({
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
      pickWxSummonAvailableCooldownSpell({
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
    assert.equal(wxSummonSpellIsCooldownReady(rally, readyRemaining), true);
    assert.deepEqual(
      wxSummonAvailableSpellsFromAssigned([rally, mend], readyRemaining).map(
        (s) => s.id,
      ),
      ["spell-rallying-cry", "starter-heal"],
    );
    assert.equal(isWxSummonAvailableCooldownSpell(rally), false);
    assert.equal(
      pickWxSummonAvailableCooldownSpell({
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
      canExecuteWxSummonAvailableCooldownCast({
        spell: inferno,
        assignedSpells: assignedKit,
        remainingBySpellId: readyRemaining,
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
      remainingBySpellId: readyRemaining,
    };
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        spell: physicalAttackSpell,
        availableSpells: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        spell: poison,
        assignedSpells: assignedKit,
        availableSpells: [poison],
      }),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        spell: frost,
        availableSpells: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        spell: slow,
        availableSpells: [slow],
      }),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
        ...base,
        spell: venom,
        availableSpells: [venom],
      }),
      false,
      "#856/#1123 own Venom ticks / LoS-blocked stalk",
    );
    assert.equal(
      canExecuteWxSummonAvailableCooldownCast({
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
