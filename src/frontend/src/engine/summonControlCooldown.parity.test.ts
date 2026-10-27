/**
 * Combat action parity: player-controlled summon kit highlight vs
 * execute CD. A highlighted legal Inferno dest (living hostile at
 * Chebyshev 3, remaining 0, 5-AP wallet can pay) is executable;
 * remaining 3 / Chebyshev 4 / corpse / ally / empty / 1 AP / Strike /
 * Frost / Drain / Venom / Poison / Slow / Blood Mend / hunter / archer /
 * queen cannot. Live `planSummonControlCast` still ignores remaining.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy } from "../types/gameTypes.ts";
import { isSpellOnCooldown } from "../utils/challengeCompletion.ts";
import { planSummonControlCast } from "../utils/summonControlCast.ts";
import {
  canAffordSummonControlCooldownCast,
  canExecuteSummonControlCooldownCast,
  computeSummonControlCooldownTargetableTiles,
  isSummonControlCooldownBlockedBuffSpell,
  isSummonControlCooldownBlockedDotSpell,
  isSummonControlCooldownBlockedFrostSpell,
  isSummonControlCooldownBlockedPoisonSpell,
  isSummonControlCooldownBlockedSlowSpell,
  isSummonControlCooldownBlockedVenomSpell,
  isSummonControlCooldownHealKitSpell,
  isSummonControlCooldownSpell,
  pickSummonControlCooldownSpell,
  shouldHighlightSummonControlCooldownCast,
  summonControlCooldownAdvertisedTurns,
  summonControlCooldownApCost,
  summonControlCooldownHighlightedTargetIsExecutable,
  summonControlCooldownInRange,
  summonControlCooldownIsBomberUnit,
  summonControlCooldownIsReady,
  summonControlCooldownKitIsBomber,
  summonControlCooldownKitIsHealer,
  summonControlCooldownRange,
  summonControlCooldownRemaining,
  summonControlLivePlanIgnoresCooldown,
  summonControlLiveWouldCastThroughCooldown,
} from "./summonControlCooldown.ts";
import {
  canAffordCastAp,
  chebyshevOnBoard,
  playerSpellRequiresLos,
} from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function hostileAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "enemy" as const };
}

function bomberAt(
  id: string,
  x: number,
  y: number,
  hp = 80,
  maxHp = 100,
  summonAI = "bomber",
) {
  return {
    id,
    x,
    y,
    hp,
    maxHp,
    side: "player" as const,
    isSummon: true,
    summonAI,
    pieceType: "bomber",
  };
}

describe("player-controlled summon kit highlight vs execute CD", () => {
  const mend = mustSpell("starter-heal");
  const rally = mustSpell("spell-rallying-cry");
  const frost = mustSpell("starter-frost");
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const iron = mustSpell("spell-iron-skin");
  const tiles = floorGrid(10);
  const origin = { x: 4, y: 4 };
  const infernoDest = { x: 7, y: 4 };
  const bomber = bomberAt("bomber-1", 4, 4);
  const foe = hostileAt("rat", 7, 4);
  const assignedKit = [inferno];
  const combatants = [bomber, foe];

  const legalArgs = {
    spell: inferno,
    pieceType: "bomber",
    selectedSummonSpellId: "spell-inferno",
    catalog: assignedKit,
    remainingTurns: 0,
    currentAp: 5,
    caster: bomber,
    tile: infernoDest,
    combatants,
    tiles,
    controllingSummon: true,
  };

  it("treats catalog Inferno as the summon-control CD leftover", () => {
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
    assert.equal(isSummonControlCooldownSpell(inferno), true);
    assert.equal(summonControlCooldownRange(inferno), 3);
    assert.equal(summonControlCooldownAdvertisedTurns(inferno), 3);
    assert.equal(summonControlCooldownApCost(inferno), 5);
    assert.equal(isSummonControlCooldownHealKitSpell(inferno), false);
    assert.equal(isSummonControlCooldownHealKitSpell(mend), true);
    assert.equal(isSummonControlCooldownHealKitSpell(rally), true);
    assert.equal(rally.usableByEnemy, false);
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isSummonControlCooldownSpell({
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
      isSummonControlCooldownSpell({
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
      isSummonControlCooldownSpell({
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
      isSummonControlCooldownSpell({
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
    assert.equal(isSummonControlCooldownSpell(physicalAttackSpell), false);
    assert.equal(
      isSummonControlCooldownSpell(poison),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(isSummonControlCooldownBlockedPoisonSpell(poison), true);
    assert.equal(isSummonControlCooldownSpell(venom), false);
    assert.equal(isSummonControlCooldownBlockedVenomSpell(venom), true);
    assert.equal(isSummonControlCooldownSpell(frost), false);
    assert.equal(isSummonControlCooldownBlockedFrostSpell(frost), true);
    assert.equal(isSummonControlCooldownSpell(mend), false);
    assert.equal(
      isSummonControlCooldownSpell(iron),
      false,
      "#978 owns pack buff decide",
    );
    assert.equal(
      isSummonControlCooldownSpell(slow),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(isSummonControlCooldownBlockedSlowSpell(slow), true);
    assert.equal(
      isSummonControlCooldownSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isSummonControlCooldownSpell(mustSpell("spell-frost-nova")),
      false,
    );
    assert.equal(isSummonControlCooldownBlockedDotSpell(poison), true);
    assert.equal(isSummonControlCooldownBlockedDotSpell(venom), true);
    assert.equal(isSummonControlCooldownBlockedDotSpell(inferno), true);
    assert.equal(isSummonControlCooldownBlockedBuffSpell(iron), true);
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
    assert.equal(summonControlCooldownKitIsBomber(assignedKit), true);
    assert.equal(
      summonControlCooldownKitIsBomber([physicalAttackSpell]),
      false,
    );
    assert.equal(
      summonControlCooldownKitIsBomber([poison, slow]),
      false,
      "archer Poison+Slow is #1095/#1096/#1098, not this leftover",
    );
    assert.equal(
      summonControlCooldownKitIsBomber([physicalAttackSpell, venom]),
      false,
      "hunter Strike+Venom is #856/#1123, not this leftover",
    );
    assert.equal(
      summonControlCooldownKitIsBomber([inferno, mend]),
      false,
      "queen Inferno+heal is #967/#972, not this leftover",
    );
    assert.equal(summonControlCooldownKitIsBomber([frost, poison]), false);
    assert.equal(summonControlCooldownKitIsHealer([frost, mend]), true);
    assert.equal(summonControlCooldownKitIsHealer(assignedKit), false);
    assert.equal(summonControlCooldownIsBomberUnit(bomber), true);
    assert.equal(
      summonControlCooldownIsBomberUnit({ summonAI: "kamikaze" }),
      true,
    );
    assert.equal(
      summonControlCooldownIsBomberUnit({ pieceType: "bomber" }),
      true,
    );
    assert.equal(
      summonControlCooldownIsBomberUnit({ summonAI: "hunter" }),
      false,
    );
    assert.equal(
      summonControlCooldownIsBomberUnit({ summonAI: "archer" }),
      false,
    );
    assert.equal(
      summonControlCooldownIsBomberUnit({ pieceType: "queen" }),
      false,
      "pack queen Inferno+heal is not player-controlled bomber",
    );
  });

  it("live planSummonControlCast, WX click, and kit panel never consult remaining", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const planSrc = readFileSync(
      join(here, "../utils/summonControlCast.ts"),
      "utf8",
    );
    const planAt = planSrc.indexOf("export function planSummonControlCast");
    assert.ok(planAt >= 0, "live planSummonControlCast is present");
    const nextExport = planSrc.indexOf("\nexport function ", planAt + 1);
    const planBody = planSrc.slice(
      planAt,
      nextExport > planAt ? nextExport : planAt + 4000,
    );
    assert.equal(
      planBody.includes("cooldown"),
      false,
      "planSummonControlCast still has no cooldown gate",
    );
    assert.equal(planBody.includes("isSpellOnCooldown"), false);
    assert.equal(planBody.includes("remainingTurns"), false);
    const wx = readFileSync(
      join(here, "../components/WorldExploration.tsx"),
      "utf8",
    );
    const castAt = wx.indexOf("const castControlledSummonSpell = useCallback(");
    assert.ok(
      castAt >= 0,
      "WX still routes kit clicks through the control plan",
    );
    const castEnd = wx.indexOf("const applyBattleWalkHazards", castAt);
    const castBody = wx.slice(
      castAt,
      castEnd > castAt ? castEnd : castAt + 8000,
    );
    assert.ok(castBody.includes("planSummonControlCast("));
    assert.equal(
      castBody.includes("isSpellOnCooldown"),
      false,
      "WX kit execute still never consults remaining",
    );
    assert.equal(castBody.includes("cooldownTurnsRemaining"), false);
    const panel = readFileSync(
      join(here, "../components/SummonControlPanel.tsx"),
      "utf8",
    );
    assert.equal(
      panel.includes("cooldown"),
      false,
      "SummonControlPanel kit slots still have no CD field",
    );
    const live = planSummonControlCast({
      pieceType: "bomber",
      spellId: "spell-inferno",
      catalog: starterSpells,
      currentAp: 5,
      caster: origin,
      target: infernoDest,
      liveGate: {
        tiles,
        combatants: combatants as Enemy[],
      },
    });
    assert.equal(
      live.ok,
      true,
      "live plan still succeeds with no remaining arg",
    );
    assert.equal(summonControlLivePlanIgnoresCooldown(), true);
    assert.equal(isSpellOnCooldown(3), true);
    assert.equal(isSpellOnCooldown(0), false);
  });

  it("highlighted in-range remaining-0 Inferno dest executes", () => {
    assert.equal(
      summonControlCooldownInRange(origin, infernoDest, inferno),
      true,
    );
    assert.equal(chebyshevOnBoard(origin, infernoDest), 3);
    assert.equal(summonControlCooldownIsReady(0), true);
    assert.equal(summonControlCooldownRemaining(0), 0);
    assert.equal(
      pickSummonControlCooldownSpell({
        assignedSpells: assignedKit,
        remainingTurns: 0,
        pieceType: "bomber",
        selectedSummonSpellId: "spell-inferno",
        catalog: assignedKit,
      })?.id,
      "spell-inferno",
    );
    const highlighted = shouldHighlightSummonControlCooldownCast(legalArgs);
    const executable = canExecuteSummonControlCooldownCast(legalArgs);
    assert.equal(highlighted, true);
    assert.equal(executable, true);
    assert.equal(highlighted, executable);
    assert.equal(
      summonControlCooldownHighlightedTargetIsExecutable({
        highlighted,
        executable,
      }),
      true,
    );
    const painted = computeSummonControlCooldownTargetableTiles({
      pieceType: "bomber",
      selectedSummonSpellId: "spell-inferno",
      catalog: assignedKit,
      remainingTurns: 0,
      currentAp: 5,
      caster: bomber,
      combatants,
      tiles,
      controllingSummon: true,
    });
    assert.equal(painted.has("7,4"), true);
    assert.equal(painted.has("6,4"), false, "empty ring cells cannot execute");
    assert.equal(
      summonControlLiveWouldCastThroughCooldown(legalArgs),
      false,
      "remaining 0 is not the live hole",
    );
    assert.equal(canAffordCastAp(5, Number(inferno.apCost)), true);
    assert.equal(playerSpellRequiresLos(inferno), false);
  });

  it("cannot execute remaining-3 Inferno even though live plan still would", () => {
    const spent = { ...legalArgs, remainingTurns: 3 };
    assert.equal(summonControlCooldownRemaining(3), 3);
    assert.equal(summonControlCooldownIsReady(3), false);
    assert.equal(isSpellOnCooldown(3), true);
    assert.equal(
      pickSummonControlCooldownSpell({
        assignedSpells: assignedKit,
        remainingTurns: 3,
        pieceType: "bomber",
        selectedSummonSpellId: "spell-inferno",
        catalog: assignedKit,
      }),
      null,
    );
    assert.equal(shouldHighlightSummonControlCooldownCast(spent), false);
    assert.equal(canExecuteSummonControlCooldownCast(spent), false);
    assert.equal(
      summonControlLiveWouldCastThroughCooldown(spent),
      true,
      "live planSummonControlCast still ignores remaining 3",
    );
    const painted = computeSummonControlCooldownTargetableTiles({
      pieceType: "bomber",
      selectedSummonSpellId: "spell-inferno",
      catalog: assignedKit,
      remainingTurns: 3,
      currentAp: 5,
      caster: bomber,
      combatants,
      tiles,
      controllingSummon: true,
    });
    assert.equal(painted.size, 0, "CD empties the kit ring");
    const live = planSummonControlCast({
      pieceType: "bomber",
      spellId: "spell-inferno",
      catalog: starterSpells,
      currentAp: 5,
      caster: origin,
      target: infernoDest,
      liveGate: {
        tiles,
        combatants: combatants as Enemy[],
      },
    });
    assert.equal(live.ok, true);
  });

  it("cannot execute Inferno beyond range 3, on a corpse, ally, or empty tile", () => {
    const tooFar = { x: 8, y: 4 };
    assert.equal(summonControlCooldownInRange(origin, tooFar, inferno), false);
    const farFoe = hostileAt("rat-far", 8, 4);
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        tile: tooFar,
        combatants: [bomber, farFoe],
      }),
      false,
    );
    assert.equal(
      shouldHighlightSummonControlCooldownCast({
        ...legalArgs,
        tile: tooFar,
        combatants: [bomber, farFoe],
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        combatants: [bomber, hostileAt("rat", 7, 4, 0)],
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        combatants: [
          bomber,
          {
            id: "wisp-1",
            x: 7,
            y: 4,
            hp: 12,
            side: "player",
            isSummon: true,
          },
        ],
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        combatants: [bomber],
      }),
      false,
    );
    assert.equal(
      summonControlCooldownHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });

  it("catalog bomber 1 AP cannot pay; 5 AP can", () => {
    assert.equal(canAffordSummonControlCooldownCast(1, inferno), false);
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        currentAp: 1,
      }),
      false,
      "catalog bomber ap 1 cannot pay Inferno 5 — #762; do not rebalance",
    );
    assert.equal(
      shouldHighlightSummonControlCooldownCast({
        ...legalArgs,
        currentAp: 1,
      }),
      false,
    );
    const painted = computeSummonControlCooldownTargetableTiles({
      pieceType: "bomber",
      selectedSummonSpellId: "spell-inferno",
      catalog: assignedKit,
      remainingTurns: 0,
      currentAp: 1,
      caster: bomber,
      combatants,
      tiles,
      controllingSummon: true,
    });
    assert.equal(painted.size, 0);
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        currentAp: 5,
      }),
      true,
    );
  });

  it("a lone living hostile at Chebyshev 3 executes (not auto-AI cluster)", () => {
    assert.equal(combatants.filter((c) => c.side === "enemy").length, 1);
    assert.equal(canExecuteSummonControlCooldownCast(legalArgs), true);
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        controllingSummon: false,
      }),
      false,
      "auto-AI applyCast arm is #1166, not this click gate",
    );
    const enemyBomber = { ...bomber, side: "enemy" as const };
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        caster: enemyBomber,
        combatants: [enemyBomber, foe],
      }),
      false,
      "enemy-side bomber is pack/auto-AI, not SummonControlPanel",
    );
  });

  it("does not steal hunter Venom (#1123) or archer Poison/Slow (#1095/#1096/#1098)", () => {
    const hunter = bomberAt("wolf-1", 4, 4, 80, 100, "hunter");
    hunter.pieceType = "wolf";
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        spell: venom,
        pieceType: "wolf",
        selectedSummonSpellId: "spell-venom-strike",
        catalog: [physicalAttackSpell, venom],
        caster: hunter,
        tile: { x: 6, y: 4 },
        combatants: [hunter, hostileAt("rat", 6, 4)],
        currentAp: 5,
      }),
      false,
    );
    const archer = bomberAt("archer-1", 4, 4, 80, 100, "archer");
    archer.pieceType = "archer";
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        spell: poison,
        pieceType: "archer",
        selectedSummonSpellId: "starter-poison",
        catalog: [poison, slow],
        caster: archer,
        tile: { x: 8, y: 4 },
        combatants: [archer, hostileAt("rat", 8, 4)],
        currentAp: 5,
      }),
      false,
    );
  });

  it("does not drop Rallying Cry via usableByEnemy (player-side wisp kit)", () => {
    assert.equal(rally.usableByEnemy, false);
    assert.equal(isSummonControlCooldownSpell(rally), false);
    const wisp = bomberAt("wisp-1", 4, 4, 80, 100, "healer");
    wisp.pieceType = "wisp";
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        spell: rally,
        pieceType: "wisp",
        selectedSummonSpellId: "spell-rallying-cry",
        catalog: [mend, rally],
        caster: wisp,
        tile: origin,
        combatants: [wisp, foe],
        currentAp: 5,
      }),
      false,
      "#757 owns Wisp self-heal highlight; do not remap dest onto the caster",
    );
  });

  it("still executes wall-blocked ready Inferno (player LoS off)", () => {
    const blocked = floorGrid(10);
    blocked[4][5] = "wall";
    assert.equal(playerSpellRequiresLos(inferno), false);
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        tiles: blocked,
      }),
      true,
      "catalog Inferno has no lineOfSight flag; player LoS is !!spell.lineOfSight",
    );
    assert.equal(
      shouldHighlightSummonControlCooldownCast({
        ...legalArgs,
        tiles: blocked,
      }),
      true,
    );
  });

  it("cannot decide Strike, Poison, Frost, Slow, Venom, or heal as this Inferno leftover", () => {
    const base = { ...legalArgs };
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...base,
        spell: physicalAttackSpell,
        selectedSummonSpellId: "physical_attack",
        catalog: [physicalAttackSpell],
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...base,
        spell: poison,
        selectedSummonSpellId: "starter-poison",
        catalog: assignedKit,
      }),
      false,
      "#1095/#1096 own Poison LoS",
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...base,
        spell: frost,
        selectedSummonSpellId: "starter-frost",
        catalog: [frost],
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...base,
        spell: slow,
        selectedSummonSpellId: "spell-slow",
        catalog: [slow],
      }),
      false,
      "#1098 owns archer Slow LoS-reposition",
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...base,
        spell: venom,
        selectedSummonSpellId: "spell-venom-strike",
        catalog: [venom],
      }),
      false,
      "#856/#1123 own Venom ticks / LoS-blocked stalk",
    );
    const healer = bomberAt("wisp-1", 4, 4, 80, 100, "healer");
    healer.pieceType = "wisp";
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...base,
        spell: mend,
        selectedSummonSpellId: "starter-heal",
        catalog: [inferno, mend],
        caster: healer,
      }),
      false,
      "#757 owns range-0 heal highlight; do not remap dest onto the caster",
    );
  });

  it("does not steal pack Inferno CD nested under damage>0 (#972)", () => {
    const queen = {
      id: "queen-1",
      x: 4,
      y: 4,
      hp: 80,
      maxHp: 100,
      side: "player" as const,
      isSummon: true,
      pieceType: "queen",
    };
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        pieceType: "queen",
        catalog: [inferno, mend],
        caster: queen,
        combatants: [queen, foe],
      }),
      false,
      "#972 owns pack Inferno CD nested under damage>0",
    );
    assert.equal(
      canExecuteSummonControlCooldownCast({
        ...legalArgs,
        spell: { ...poison, cooldown: 2 },
        selectedSummonSpellId: "starter-poison",
        catalog: [{ ...poison, cooldown: 2 }],
      }),
      false,
      "Poison that gains a catalog CD is still #1095/#1096, not this gate",
    );
  });
});
