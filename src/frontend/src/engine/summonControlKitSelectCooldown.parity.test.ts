/**
 * Combat action parity: player-controlled summon kit *select* must
 * consult advertised Inferno remaining the way BattleUIPanel already
 * consults player-bar CD. Live SummonControlPanel disables only on AP.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy } from "../types/gameTypes.ts";
import { isSpellOnCooldown } from "../utils/challengeCompletion.ts";
import {
  pickSummonControlClickTarget,
  planSummonControlCast,
} from "../utils/summonControlCast.ts";
import {
  canExecuteSummonControlKitSelectCooldownCast,
  isSummonControlKitSelectCooldownSpell,
  liveSummonControlKitSelectIgnoresCooldown,
  liveSummonControlKitSlotDisabled,
  liveSummonControlWouldSelectThroughCooldown,
  shouldHighlightSummonControlKitSelect,
  shouldSelectSummonControlKitCooldown,
  summonControlKitSelectCooldownTurns,
  summonControlKitSelectHighlightedTargetIsExecutable,
  summonControlKitSelectIsReady,
} from "./summonControlKitSelectCooldown.ts";
import { playerSpellRequiresLos } from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function floorGrid(size: number): Array<Array<"floor" | "wall">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    side: "enemy",
    ...extras,
  } as Enemy;
}

function destIsLegal(args: {
  tile: { x: number; y: number };
  combatants: Enemy[];
  tiles: Array<Array<"floor" | "wall">>;
}): boolean {
  const inferno = mustSpell("spell-inferno");
  const bomber = unit("bomber-1", 4, 4, {
    pieceType: "bomber",
    isSummon: true,
    side: "player",
    hp: 12,
  });
  const plan = planSummonControlCast({
    pieceType: "bomber",
    spellId: "spell-inferno",
    catalog: starterSpells,
    currentAp: 5,
    caster: { x: bomber.x, y: bomber.y },
    target: args.tile,
    liveGate: {
      tiles: args.tiles,
      combatants: args.combatants,
    },
  });
  if (!plan.ok) return false;
  const picked = pickSummonControlClickTarget({
    spell: inferno,
    caster: bomber,
    tile: args.tile,
    combatants: args.combatants,
    tiles: args.tiles,
  });
  return picked != null;
}

describe("player-controlled summon kit select vs advertised Inferno CD", () => {
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const mend = mustSpell("starter-heal");
  const iron = mustSpell("spell-iron-skin");
  const drain = mustSpell("starter-drain");
  const rally = mustSpell("spell-rallying-cry");
  const bomberSpell = mustSpell("summon-bomber");
  const wolf = mustSpell("summon-dire-wolf");
  const archerSpell = mustSpell("summon-archer");
  const wisp = mustSpell("summon-wisp");

  const readySelect = {
    controllingSummon: true,
    remaining: 0,
    currentAp: 5,
    spell: inferno,
  };

  it("treats catalog Inferno as the kit-select CD leftover", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(isSummonControlKitSelectCooldownSpell(inferno), true);
    assert.equal(summonControlKitSelectCooldownTurns(inferno), 3);
    assert.equal(summonControlKitSelectIsReady(0), true);
    assert.equal(summonControlKitSelectIsReady(3), false);
    assert.equal(isSpellOnCooldown(3), true);
    assert.deepEqual(
      starterSpells.filter((s) => Number(s.cooldown) > 0).map((s) => s.id),
      ["spell-inferno"],
      "Inferno is the only starter row with advertised CD",
    );
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isSummonControlKitSelectCooldownSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 8,
        dotDuration: 3,
        range: 3,
        apCost: 5,
        cooldown: 3,
      }),
      true,
    );
    assert.equal(
      isSummonControlKitSelectCooldownSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 4,
        apCost: 2,
        cooldown: 3,
      }),
      false,
      "Poison-shaped range-4 DoT is #1095/#1096, not this leftover",
    );
    assert.equal(
      isSummonControlKitSelectCooldownSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 2,
        apCost: 3,
        cooldown: 3,
      }),
      false,
      "Venom-shaped range-2 DoT is #856/#1123, not this leftover",
    );
    assert.equal(
      isSummonControlKitSelectCooldownSpell(physicalAttackSpell),
      false,
    );
    assert.equal(isSummonControlKitSelectCooldownSpell(poison), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(venom), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(frost), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(slow), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(mend), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(iron), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(drain), false);
    assert.equal(isSummonControlKitSelectCooldownSpell(rally), false);
    assert.equal(
      isSummonControlKitSelectCooldownSpell({}),
      false,
      "empty metadata is not Inferno — do not key off the display name",
    );
  });

  it("Summon Bomber kit is Inferno-only; catalog ap 1 cannot pay Inferno 5", () => {
    assert.deepEqual(bomberSpell.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(bomberSpell.summonAI, "bomber");
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        currentAp: 1,
      }),
      false,
      "catalog bomber ap 1 cannot pay Inferno 5 — #762; do not rebalance",
    );
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
    assert.deepEqual(wisp.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
  });

  it("live panel, kit mapping, and plan never consult remaining", () => {
    const panel = readFileSync(
      join(here(), "../components/SummonControlPanel.tsx"),
      "utf8",
    );
    assert.equal(panel.includes("cooldown"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.equal(panel.includes("isSpellOnCooldown"), false);
    assert.equal(panel.includes("spellCooldowns"), false);

    const wx = readFileSync(
      join(here(), "../components/WorldExploration.tsx"),
      "utf8",
    );
    const kitMapAt = wx.indexOf("return source.map((s: any) => ({");
    assert.ok(kitMapAt >= 0, "live kitSpells mapping is present");
    const kitMap = wx.slice(kitMapAt, kitMapAt + 220);
    assert.ok(kitMap.includes("id: s.id"));
    assert.ok(kitMap.includes("name: s.name"));
    assert.ok(kitMap.includes("apCost: Number(s.apCost)"));
    assert.equal(kitMap.includes("cooldown"), false);
    assert.equal(kitMap.includes("remaining"), false);

    const selectAt = wx.indexOf("onSpellSelect={(spellId: string) =>");
    assert.ok(selectAt >= 0, "live onSpellSelect is present");
    const selectBody = wx.slice(selectAt, selectAt + 120);
    assert.ok(selectBody.includes("setSelectedSummonSpellId(spellId)"));
    assert.equal(selectBody.includes("isSpellOnCooldown"), false);
    assert.equal(selectBody.includes("spellCooldownsRef"), false);

    const planSrc = readFileSync(
      join(here(), "../utils/summonControlCast.ts"),
      "utf8",
    );
    const planAt = planSrc.indexOf("export function planSummonControlCast");
    assert.ok(planAt >= 0, "live planSummonControlCast is present");
    const nextExport = planSrc.indexOf("\nexport function ", planAt + 1);
    const planBody = planSrc.slice(
      planAt,
      nextExport > planAt ? nextExport : planAt + 4000,
    );
    assert.equal(planBody.includes("cooldown"), false);
    assert.equal(planBody.includes("isSpellOnCooldown"), false);

    const battleUi = readFileSync(
      join(here(), "../components/BattleUIPanel.tsx"),
      "utf8",
    );
    assert.ok(
      battleUi.includes("isOnCooldown"),
      "player bar must keep consulting CD — #708",
    );
    assert.ok(
      battleUi.includes("disabled={isEmpty || isOnCooldown || !inBattle}"),
    );

    assert.equal(liveSummonControlKitSelectIgnoresCooldown(), true);
  });

  it("selects remaining 0 / 5 AP Inferno and executes a Chebyshev-3 living hostile", () => {
    const tiles = floorGrid(10);
    const bomber = unit("bomber-1", 4, 4, {
      pieceType: "bomber",
      isSummon: true,
      side: "player",
      hp: 12,
    });
    const hostile = unit("rat", 7, 4);
    const destLegal = destIsLegal({
      tile: { x: 7, y: 4 },
      combatants: [bomber, hostile],
      tiles,
    });
    assert.equal(destLegal, true);
    const selected = shouldHighlightSummonControlKitSelect(readySelect);
    const executable = canExecuteSummonControlKitSelectCooldownCast({
      ...readySelect,
      executedLegalDest: destLegal,
    });
    assert.equal(selected, true);
    assert.equal(executable, true);
    assert.equal(
      summonControlKitSelectHighlightedTargetIsExecutable({
        selected,
        executable,
      }),
      true,
    );
    assert.equal(
      liveSummonControlKitSlotDisabled({
        currentAp: 5,
        apCost: inferno.apCost,
      }),
      false,
    );
    assert.equal(playerSpellRequiresLos(inferno), false);
  });

  it("remaining 3 still enables the live kit button while this sidecar refuses select", () => {
    const remaining3 = { ...readySelect, remaining: 3 };
    assert.equal(shouldSelectSummonControlKitCooldown(remaining3), false);
    assert.equal(shouldHighlightSummonControlKitSelect(remaining3), false);
    assert.equal(
      liveSummonControlKitSlotDisabled({
        currentAp: 5,
        apCost: inferno.apCost,
      }),
      false,
      "live panel only checks AP",
    );
    assert.equal(
      liveSummonControlWouldSelectThroughCooldown({
        currentAp: 5,
        spell: inferno,
        remaining: 3,
      }),
      true,
    );
    const tiles = floorGrid(10);
    const bomber = unit("bomber-1", 4, 4, {
      pieceType: "bomber",
      isSummon: true,
      side: "player",
      hp: 12,
    });
    const hostile = unit("rat", 7, 4);
    const destLegal = destIsLegal({
      tile: { x: 7, y: 4 },
      combatants: [bomber, hostile],
      tiles,
    });
    assert.equal(destLegal, true, "live dest remaining consult is #1205");
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...remaining3,
        executedLegalDest: destLegal,
      }),
      false,
    );
    const livePlan = planSummonControlCast({
      pieceType: "bomber",
      spellId: "spell-inferno",
      catalog: starterSpells,
      currentAp: 5,
      caster: { x: 4, y: 4 },
      target: { x: 7, y: 4 },
    });
    assert.equal(
      livePlan.ok,
      true,
      "live plan still ignores remaining — tile leftover is #1205",
    );
  });

  it("cannot execute Chebyshev 4, corpse, ally, or empty dests", () => {
    const tiles = floorGrid(10);
    const bomber = unit("bomber-1", 4, 4, {
      pieceType: "bomber",
      isSummon: true,
      side: "player",
      hp: 12,
    });
    const far = unit("far", 8, 4);
    const corpse = unit("corpse", 7, 4, { hp: 0 });
    const ally = unit("wisp-1", 7, 4, {
      isSummon: true,
      side: "player",
      pieceType: "wisp",
    });
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        executedLegalDest: destIsLegal({
          tile: { x: 8, y: 4 },
          combatants: [bomber, far],
          tiles,
        }),
      }),
      false,
      "Chebyshev 4 is out of Inferno range 3",
    );
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        executedLegalDest: destIsLegal({
          tile: { x: 7, y: 4 },
          combatants: [bomber, corpse],
          tiles,
        }),
      }),
      false,
      "corpse cannot execute",
    );
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        executedLegalDest: destIsLegal({
          tile: { x: 7, y: 4 },
          combatants: [bomber, ally],
          tiles,
        }),
      }),
      false,
      "ally cannot execute Inferno",
    );
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        executedLegalDest: destIsLegal({
          tile: { x: 7, y: 4 },
          combatants: [bomber],
          tiles,
        }),
      }),
      false,
      "empty dest cannot execute",
    );
    assert.equal(
      shouldSelectSummonControlKitCooldown(readySelect),
      true,
      "kit stays selectable; dest is the illegal half",
    );
  });

  it("wall-blocked Chebyshev-3 living hostile still executes (Inferno LoS off)", () => {
    const tiles = floorGrid(10);
    tiles[4][5] = "wall";
    const bomber = unit("bomber-1", 4, 4, {
      pieceType: "bomber",
      isSummon: true,
      side: "player",
      hp: 12,
    });
    const blocked = unit("blocked", 7, 4);
    const destLegal = destIsLegal({
      tile: { x: 7, y: 4 },
      combatants: [bomber, blocked],
      tiles,
    });
    assert.equal(playerSpellRequiresLos(inferno), false);
    assert.equal(destLegal, true);
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        executedLegalDest: destLegal,
      }),
      true,
    );
  });

  it("cannot select remaining-already-3 dest leftover, auto-AI, 1 AP, or a missing modifier", () => {
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        remaining: 3,
      }),
      false,
      "remaining 3 is this select leftover; tile empty-set is #1205",
    );
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        controllingSummon: false,
      }),
      false,
      "auto-AI applyCast never writing CD is #1166",
    );
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        currentAp: 1,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        executedLegalDest: false,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlKitSelectCooldownCast({
        ...readySelect,
        spell: poison,
        executedLegalDest: true,
      }),
      false,
    );
    assert.equal(
      summonControlKitSelectHighlightedTargetIsExecutable({
        selected: false,
        executable: false,
      }),
      false,
    );
    assert.equal(
      liveSummonControlWouldSelectThroughCooldown({
        currentAp: 1,
        spell: inferno,
        remaining: 3,
      }),
      false,
      "1 AP still disables the live button",
    );
  });

  it("cannot select Strike, Poison, Frost, Slow, Venom, Drain, or heal as this leftover", () => {
    for (const spell of [
      physicalAttackSpell,
      poison,
      frost,
      slow,
      venom,
      drain,
      mend,
      iron,
      rally,
    ]) {
      assert.equal(
        shouldSelectSummonControlKitCooldown({
          ...readySelect,
          spell,
        }),
        false,
        spell.id,
      );
    }
  });

  it("hunter, archer, and queen kits cannot fire this leftover", () => {
    assert.equal(wolf.summonAI, "hunter");
    assert.equal(archerSpell.summonAI, "archer");
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        spell: venom,
      }),
      false,
      "hunter Venom is #1123",
    );
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        spell: poison,
      }),
      false,
      "archer Poison is #1095/#1096",
    );
    assert.equal(
      shouldSelectSummonControlKitCooldown({
        ...readySelect,
        spell: frost,
      }),
      false,
      "queen Frost is pack leftover, not kit-select CD",
    );
  });
});
