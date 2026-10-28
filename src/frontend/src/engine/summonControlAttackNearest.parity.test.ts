/**
 * Combat action parity: a highlighted legal summon-control Attack Nearest
 * dest is executable, and an illegal dest cannot execute. Live WX Attack
 * Nearest / S stay on the player-turn player-spell path.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { isSpellOnCooldown } from "../utils/challengeCompletion.ts";
import {
  canExecuteSummonControlAttackNearest,
  executeSummonControlAttackNearest,
  isSummonControlAttackNearestSpell,
  liveWxAttackNearestReadsKitSpell,
  liveWxAttackNearestRequiresPlayerTurn,
  liveWxAttackNearestUsesSummonOrigin,
  pickSummonControlAttackNearestDest,
  shouldHighlightSummonControlAttackNearest,
  summonControlAttackNearestCooldownTurns,
  summonControlAttackNearestHighlightedIsExecutable,
  summonControlAttackNearestIsReady,
  summonControlAttackNearestRange,
  summonControlAttackNearestResourcesOk,
} from "./summonControlAttackNearest.ts";
import {
  type TileType,
  computeTargetableTiles,
  pickAttackNearestTile,
} from "./targeting.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function mustSpell(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function attackNearestExecuteBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const attackNearestEnemy = useCallback(() => {");
  assert.ok(start >= 0, "live attackNearestEnemy is present");
  const end = wx.indexOf("useEffect(() => {", start);
  assert.ok(end > start, "hotkey effect still follows Attack Nearest");
  return wx.slice(start, end);
}

function attackNearestEnableBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("onAttackNearest={attackNearestEnemy}");
  assert.ok(start >= 0, "live Attack Nearest button wiring is present");
  const end = wx.indexOf("isMobile={isMobile}", start);
  assert.ok(end > start, "isMobile still follows canAttackNearest");
  return wx.slice(start, end);
}

function attackNearestHotkeyBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("if (!isAttackNearestHotkey(e)) return;");
  assert.ok(start >= 0, "live S hotkey is present");
  return wx.slice(start, start + 80);
}

function floorGrid(size: number): TileType[][] {
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
    ...extras,
  } as Enemy;
}

describe("player-controlled summon kit Attack Nearest vs execute", () => {
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const mend = mustSpell("starter-heal");
  const drain = mustSpell("starter-drain");
  const bomberSpell = mustSpell("summon-bomber");
  const wolf = mustSpell("summon-dire-wolf");
  const archerSpell = mustSpell("summon-archer");
  const tiles = floorGrid(12);
  const summon = { x: 5, y: 5 };
  const inRange = unit("rat", 8, 5, { side: "enemy" });

  const readyWorld = {
    caster: summon,
    combatants: [inRange],
    tiles,
  };

  const ready = {
    controllingSummon: true,
    remaining: 0,
    currentAp: 5,
    spell: inferno,
    world: readyWorld,
  };

  it("treats catalog Inferno as the kit Attack Nearest leftover", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(isSummonControlAttackNearestSpell(inferno), true);
    assert.equal(summonControlAttackNearestCooldownTurns(inferno), 3);
    assert.equal(summonControlAttackNearestRange(inferno), 3);
    assert.equal(summonControlAttackNearestIsReady(0), true);
    assert.equal(summonControlAttackNearestIsReady(3), false);
    assert.equal(isSpellOnCooldown(3), true);
    assert.deepEqual(
      starterSpells.filter((s) => Number(s.cooldown) > 0).map((s) => s.id),
      ["spell-inferno"],
      "Inferno is the only starter row with advertised CD",
    );
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isSummonControlAttackNearestSpell({
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
      isSummonControlAttackNearestSpell({
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
      isSummonControlAttackNearestSpell({
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
    assert.equal(isSummonControlAttackNearestSpell(physicalAttackSpell), false);
    assert.equal(isSummonControlAttackNearestSpell(poison), false);
    assert.equal(isSummonControlAttackNearestSpell(venom), false);
    assert.equal(isSummonControlAttackNearestSpell(frost), false);
    assert.equal(isSummonControlAttackNearestSpell(slow), false);
    assert.equal(isSummonControlAttackNearestSpell(mend), false);
    assert.equal(isSummonControlAttackNearestSpell(drain), false);
    assert.equal(
      isSummonControlAttackNearestSpell({}),
      false,
      "empty metadata is not Inferno — do not key off the display name",
    );
  });

  it("Summon Bomber kit is Inferno-only; catalog ap 1 cannot pay Inferno 5", () => {
    assert.deepEqual(bomberSpell.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(bomberSpell.summonAI, "bomber");
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
  });

  it("highlighted Chebyshev-3 living hostile is executable from the summon tile", () => {
    const dest = pickSummonControlAttackNearestDest(inferno, readyWorld);
    assert.deepEqual(dest, { x: 8, y: 5 });
    assert.deepEqual(
      pickAttackNearestTile(inferno, summon, [inRange], tiles, 3),
      dest,
      "kit Attack Nearest dest is pickAttackNearestTile from the summon tile",
    );
    const highlightedTiles = computeTargetableTiles(inferno, summon, {
      tiles,
      enemies: [inRange],
      worldGridSize: 12,
      effectiveRange: 3,
    });
    assert.equal(highlightedTiles.has("8,5"), true);
    const highlighted = shouldHighlightSummonControlAttackNearest(ready);
    const executable = canExecuteSummonControlAttackNearest({
      ...ready,
      dest: { x: 8, y: 5 },
    });
    assert.equal(highlighted, true);
    assert.equal(executable, true);
    assert.equal(
      summonControlAttackNearestHighlightedIsExecutable({
        highlighted,
        executable,
      }),
      true,
    );
    assert.deepEqual(
      executeSummonControlAttackNearest({
        ...ready,
        dest: { x: 8, y: 5 },
      }),
      { dest: { x: 8, y: 5 } },
    );
  });

  it("picks the nearest of two live hostiles; farther dest is click-only", () => {
    const nearer = unit("near", 7, 5, { side: "enemy" });
    const farther = unit("far", 8, 5, { side: "enemy" });
    const world = {
      caster: summon,
      combatants: [farther, nearer],
      tiles,
    };
    const args = { ...ready, world };
    assert.deepEqual(pickSummonControlAttackNearestDest(inferno, world), {
      x: 7,
      y: 5,
    });
    assert.equal(shouldHighlightSummonControlAttackNearest(args), true);
    assert.equal(
      canExecuteSummonControlAttackNearest({
        ...args,
        dest: { x: 7, y: 5 },
      }),
      true,
    );
    assert.equal(
      canExecuteSummonControlAttackNearest({
        ...args,
        dest: { x: 8, y: 5 },
      }),
      false,
      "Chebyshev 3 is a legal click dest (#1205) and cannot execute as Attack Nearest when a nearer live hostile exists",
    );
    assert.equal(
      executeSummonControlAttackNearest({
        ...args,
        dest: { x: 8, y: 5 },
      }),
      null,
    );
  });

  it("cannot execute Chebyshev 4, corpse, ally, or empty", () => {
    const out = unit("out", 9, 5, { side: "enemy" });
    const corpse = unit("dead", 8, 5, { side: "enemy", hp: 0 });
    const ally = unit("wolf", 8, 5, {
      side: "player",
      isSummon: true,
    });
    assert.equal(
      pickSummonControlAttackNearestDest(inferno, {
        caster: summon,
        combatants: [out],
        tiles,
      }),
      null,
    );
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        world: { caster: summon, combatants: [out], tiles },
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlAttackNearest({
        ...ready,
        world: { caster: summon, combatants: [out], tiles },
        dest: { x: 9, y: 5 },
      }),
      false,
    );
    assert.equal(
      pickSummonControlAttackNearestDest(inferno, {
        caster: summon,
        combatants: [corpse],
        tiles,
      }),
      null,
    );
    assert.equal(
      pickSummonControlAttackNearestDest(inferno, {
        caster: summon,
        combatants: [ally],
        tiles,
      }),
      null,
    );
    assert.equal(
      pickSummonControlAttackNearestDest(inferno, {
        caster: summon,
        combatants: [],
        tiles,
      }),
      null,
    );
    assert.equal(
      executeSummonControlAttackNearest({
        ...ready,
        world: { caster: summon, combatants: [], tiles },
        dest: { x: 8, y: 5 },
      }),
      null,
    );
  });

  it("cannot execute remaining 3 or 1 AP; remaining 0 / 5 AP can", () => {
    assert.equal(
      summonControlAttackNearestResourcesOk({
        ...ready,
        remaining: 3,
      }),
      false,
    );
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        remaining: 3,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlAttackNearest({
        ...ready,
        remaining: 3,
        dest: { x: 8, y: 5 },
      }),
      false,
    );
    assert.deepEqual(
      pickSummonControlAttackNearestDest(inferno, readyWorld),
      { x: 8, y: 5 },
      "remaining is a resource gate — geometry still sees the dest",
    );
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        currentAp: 1,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonControlAttackNearest({
        ...ready,
        currentAp: 1,
        dest: { x: 8, y: 5 },
      }),
      false,
    );
    assert.equal(shouldHighlightSummonControlAttackNearest(ready), true);
  });

  it("live Attack Nearest stays on the player-turn player-spell player-tile path", () => {
    assert.equal(liveWxAttackNearestRequiresPlayerTurn(), true);
    assert.equal(liveWxAttackNearestReadsKitSpell(), false);
    assert.equal(liveWxAttackNearestUsesSummonOrigin(), false);

    const execute = attackNearestExecuteBlock();
    assert.ok(execute.includes("shouldAllowPlayerCastEntry"));
    assert.ok(execute.includes("attackNearestLiveCasterPos"));
    assert.ok(execute.includes("selectedSpellIdRef.current"));
    assert.ok(execute.includes("pickNearestAttackableHostile"));
    assert.equal(execute.includes("selectedSummonSpellId"), false);
    assert.equal(execute.includes("pickSummonControlAttackNearestDest"), false);
    assert.equal(execute.includes("activeControlledSummonId"), false);

    const enable = attackNearestEnableBlock();
    assert.ok(enable.includes("shouldAllowPlayerCastEntry"));
    assert.ok(enable.includes("selectedSpellIdRef.current"));
    assert.ok(enable.includes("canAttackNearestAgainstLive"));
    assert.ok(enable.includes("attackNearestLiveCasterPos"));
    assert.equal(enable.includes("selectedSummonSpellId"), false);

    const hotkey = attackNearestHotkeyBlock();
    assert.ok(hotkey.includes("attackNearestEnemy()"));
    assert.equal(hotkey.includes("selectedSummonSpellId"), false);
  });

  it("wall-blocked still executes (player LoS is off for Inferno)", () => {
    const blocked = tiles.map((row) => row.slice());
    blocked[5][6] = "wall";
    blocked[5][7] = "wall";
    const world = {
      caster: summon,
      combatants: [inRange],
      tiles: blocked,
    };
    const args = { ...ready, world };
    assert.equal(inferno.lineOfSight, undefined);
    assert.deepEqual(pickSummonControlAttackNearestDest(inferno, world), {
      x: 8,
      y: 5,
    });
    assert.equal(shouldHighlightSummonControlAttackNearest(args), true);
    assert.equal(
      canExecuteSummonControlAttackNearest({
        ...args,
        dest: { x: 8, y: 5 },
      }),
      true,
    );
  });

  it("cannot execute player-turn, Strike, Poison, Frost, Slow, Venom, Drain, or heal", () => {
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        controllingSummon: false,
      }),
      false,
      "player-turn Attack Nearest is #340, not this leftover",
    );
    assert.equal(
      executeSummonControlAttackNearest({
        ...ready,
        controllingSummon: false,
        dest: { x: 8, y: 5 },
      }),
      null,
    );
    for (const spell of [
      physicalAttackSpell,
      poison,
      frost,
      slow,
      venom,
      drain,
      mend,
    ]) {
      assert.equal(
        shouldHighlightSummonControlAttackNearest({
          ...ready,
          spell,
        }),
        false,
        spell.id,
      );
    }
    assert.equal(
      summonControlAttackNearestHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });

  it("hunter, archer, and queen kits cannot fire this leftover", () => {
    assert.equal(wolf.summonAI, "hunter");
    assert.equal(archerSpell.summonAI, "archer");
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        spell: venom,
      }),
      false,
      "hunter Venom is #1123",
    );
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        spell: poison,
      }),
      false,
      "archer Poison is #1095/#1096",
    );
    assert.equal(
      shouldHighlightSummonControlAttackNearest({
        ...ready,
        spell: frost,
      }),
      false,
      "queen Frost is pack leftover, not kit Attack Nearest",
    );
  });
});
