/**
 * Combat action parity: a highlighted legal summon-control Digit / Numpad
 * kit dest is executable, and an illegal dest cannot execute. Live WX
 * keydown still only binds Attack Nearest S; kit slots have no numbered
 * hotkeys.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import { planSummonControlCast } from "../utils/summonControlCast.ts";
import {
  SUMMON_CONTROL_KIT_HOTKEY_SLOT_COUNT,
  canHotkeySelectSummonControlKit,
  decideSummonControlKitHotkey,
  executeSummonControlKitHotkeyCast,
  isSummonControlKitSlotHotkey,
  resolveSummonControlKitHotkeySelect,
  resolveSummonControlKitHotkeySlots,
  summonControlKitHotkeyHighlightedIsExecutable,
  summonControlKitHotkeySlotDisabled,
  summonControlKitSlotIndexFromKey,
} from "./summonControlHotkeys.ts";
import { type TileType, computeTargetableTiles } from "./targeting.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function mustSpell(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function readSrc(rel: string): string {
  return readFileSync(join(here(), rel), "utf8");
}

function wxSource(): string {
  return readSrc("../components/WorldExploration.tsx");
}

function wxKeydownBlock(): string {
  const wx = wxSource();
  const needle = "if (!isAttackNearestHotkey(e)) return;";
  const start = wx.indexOf(needle);
  assert.ok(start >= 0, "live WX keydown still gates on Attack Nearest S");
  const end = wx.indexOf("}, [attackNearestEnemy]);", start);
  assert.ok(
    end > start,
    "live WX keydown effect still depends on Attack Nearest",
  );
  return wx.slice(start, end);
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

const digit1 = { key: "1", code: "Digit1" };
const numpad1 = { key: "1", code: "Numpad1" };
const digit2 = { key: "2", code: "Digit2" };
const digit3 = { key: "3", code: "Digit3" };
const digit9 = { key: "9", code: "Digit9" };

describe("player-controlled summon kit Digit/Numpad select vs execute", () => {
  const mend = mustSpell("starter-heal");
  const cry = mustSpell("spell-rallying-cry");
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const wispSpell = mustSpell("summon-wisp");
  const bomberSpell = mustSpell("summon-bomber");
  const tiles = floorGrid(12);
  const summon = unit("wisp", 5, 5, {
    side: "player",
    isSummon: true,
    pieceType: "wisp",
  });
  const kit = resolveSummonControlKitHotkeySlots("wisp", starterSpells);

  const readyCast = {
    event: digit1,
    controllingSummon: true,
    inBattle: true,
    currentAp: 3,
    pieceType: "wisp",
    catalog: starterSpells,
    caster: summon,
    tile: { x: 5, y: 5 },
    combatants: [summon],
    tiles,
  };

  it("treats catalog Blood Mend as Digit 1 of the wisp kit", () => {
    assert.equal(mend.spellType, "heal");
    assert.equal(mend.targetType, "self");
    assert.equal(Number(mend.range), 0);
    assert.equal(Number(mend.healAmount), 12);
    assert.equal(Number(mend.apCost), 3);
    assert.equal(cry.targetType, "self");
    assert.equal(Number(cry.apCost), 4);
    assert.deepEqual(wispSpell.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.equal(wispSpell.summonUnitDef?.ap, 2);
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    assert.deepEqual(
      kit.map((s) => s.id),
      ["starter-heal", "spell-rallying-cry"],
    );
    assert.equal(SUMMON_CONTROL_KIT_HOTKEY_SLOT_COUNT, 8);
    assert.equal(summonControlKitSlotIndexFromKey(digit1), 0);
    assert.equal(summonControlKitSlotIndexFromKey(numpad1), 0);
    assert.equal(summonControlKitSlotIndexFromKey(digit2), 1);
    assert.equal(summonControlKitSlotIndexFromKey(digit9), null);
    assert.equal(isSummonControlKitSlotHotkey(digit1), true);
    assert.equal(
      isSummonControlKitSlotHotkey({ ...digit1, ctrlKey: true }),
      false,
    );
  });

  it("Digit 1 Blood Mend dest is highlighted and executable at 3 AP", () => {
    const decision = decideSummonControlKitHotkey({
      event: digit1,
      controllingSummon: true,
      inBattle: true,
      currentAp: 3,
      kitSpells: kit,
    });
    assert.deepEqual(decision, {
      action: "select",
      slotIndex: 0,
      spellId: "starter-heal",
    });
    assert.equal(resolveSummonControlKitHotkeySelect(decision), "starter-heal");
    const numpad = decideSummonControlKitHotkey({
      event: numpad1,
      controllingSummon: true,
      inBattle: true,
      currentAp: 3,
      kitSpells: kit,
    });
    assert.equal(resolveSummonControlKitHotkeySelect(numpad), "starter-heal");
    const result = executeSummonControlKitHotkeyCast(readyCast);
    assert.equal(result?.spellId, "starter-heal");
    assert.equal(result?.target.id, "wisp");
    assert.equal(result?.remainingAp, 0);
    const highlightedTiles = computeTargetableTiles(mend, summon, {
      tiles,
      enemies: [summon],
      worldGridSize: 12,
      effectiveRange: 1,
    });
    assert.equal(highlightedTiles.has("5,5"), true);
    assert.equal(highlightedTiles.has("5,4"), false);
    assert.equal(
      summonControlKitHotkeyHighlightedIsExecutable({
        highlighted: highlightedTiles.has("5,5"),
        executable: result != null,
      }),
      true,
    );
    assert.equal(
      planSummonControlCast({
        pieceType: "wisp",
        spellId: "starter-heal",
        catalog: starterSpells,
        currentAp: 3,
        caster: summon,
        target: { x: 5, y: 5 },
        liveGate: { tiles, combatants: [summon] },
      }).ok,
      true,
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({ ...readyCast, currentAp: 2 }),
      null,
      "catalog wisp AP 2 cannot pay Blood Mend 3 — do not rebalance",
    );
    assert.equal(
      summonControlKitHotkeySlotDisabled({ currentAp: 2, apCost: mend.apCost }),
      true,
    );
  });

  it("Digit 2 Rallying Cry executes at 4 AP; empty Digit 3 cannot", () => {
    const cryCast = executeSummonControlKitHotkeyCast({
      ...readyCast,
      event: digit2,
      currentAp: 4,
    });
    assert.equal(cryCast?.spellId, "spell-rallying-cry");
    assert.equal(cryCast?.target.id, "wisp");
    const highlightedTiles = computeTargetableTiles(cry, summon, {
      tiles,
      enemies: [summon],
      worldGridSize: 12,
      effectiveRange: 1,
    });
    assert.equal(highlightedTiles.has("5,5"), true);
    assert.equal(
      summonControlKitHotkeyHighlightedIsExecutable({
        highlighted: true,
        executable: cryCast != null,
      }),
      true,
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({
        ...readyCast,
        event: digit2,
        currentAp: 3,
      }),
      null,
      "Rallying Cry costs 4",
    );
    assert.equal(
      decideSummonControlKitHotkey({
        event: digit3,
        controllingSummon: true,
        inBattle: true,
        currentAp: 4,
        kitSpells: kit,
      }).action,
      "ignore",
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({ ...readyCast, event: digit3 }),
      null,
    );
  });

  it("cannot select on player turn, modifiers, Digit 9, or out of battle", () => {
    assert.equal(
      decideSummonControlKitHotkey({
        event: digit1,
        controllingSummon: false,
        inBattle: true,
        currentAp: 3,
        kitSpells: kit,
      }).reason,
      "player_turn",
    );
    assert.equal(
      canHotkeySelectSummonControlKit({
        controllingSummon: false,
        inBattle: true,
        currentAp: 3,
        spell: mend,
      }),
      false,
      "player Digit 1 is #743 champion bar, not the kit",
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({
        ...readyCast,
        controllingSummon: false,
      }),
      null,
    );
    assert.equal(
      decideSummonControlKitHotkey({
        event: { ...digit1, ctrlKey: true },
        controllingSummon: true,
        inBattle: true,
        currentAp: 3,
        kitSpells: kit,
      }).reason,
      "unbound",
    );
    assert.equal(
      decideSummonControlKitHotkey({
        event: digit9,
        controllingSummon: true,
        inBattle: true,
        currentAp: 3,
        kitSpells: kit,
      }).reason,
      "unbound",
    );
    assert.equal(
      decideSummonControlKitHotkey({
        event: { key: "s", code: "KeyS" },
        controllingSummon: true,
        inBattle: true,
        currentAp: 3,
        kitSpells: kit,
      }).reason,
      "unbound",
      "S is #1238 Attack Nearest, not kit select",
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({ ...readyCast, inBattle: false }),
      null,
    );
  });

  it("cannot execute enemy dest, empty neighbour, or Chebyshev 4", () => {
    const rat = unit("rat", 8, 5, { side: "enemy" });
    assert.equal(
      executeSummonControlKitHotkeyCast({
        ...readyCast,
        tile: { x: 8, y: 5 },
        combatants: [summon, rat],
      }),
      null,
      "Blood Mend is self — enemy dest stays #1260",
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({
        ...readyCast,
        tile: { x: 5, y: 4 },
      }),
      null,
      "empty neighbour is not the caster tile",
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({
        ...readyCast,
        tile: { x: 9, y: 5 },
        combatants: [summon, unit("far", 9, 5, { side: "enemy" })],
      }),
      null,
    );
    const highlightedTiles = computeTargetableTiles(mend, summon, {
      tiles,
      enemies: [summon, rat],
      worldGridSize: 12,
      effectiveRange: 1,
    });
    assert.equal(highlightedTiles.has("8,5"), false);
    assert.equal(highlightedTiles.has("5,4"), false);
    assert.equal(
      summonControlKitHotkeyHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot execute Strike / Frost / Inferno / Venom / Poison / Slow / bomber as this leftover", () => {
    for (const spell of [
      physicalAttackSpell,
      frost,
      inferno,
      venom,
      poison,
      slow,
    ]) {
      const result = executeSummonControlKitHotkeyCast({
        ...readyCast,
        event: digit1,
        currentAp: 5,
      });
      assert.equal(
        result?.spellId === spell.id,
        false,
        `${spell.id} is not Digit 1 of the wisp kit`,
      );
    }
    const bomberKit = resolveSummonControlKitHotkeySlots(
      "bomber",
      starterSpells,
    );
    assert.equal(
      resolveSummonControlKitHotkeySelect(
        decideSummonControlKitHotkey({
          event: digit1,
          controllingSummon: true,
          inBattle: true,
          currentAp: 5,
          kitSpells: bomberKit,
        }),
      ),
      "spell-inferno",
      "Digit still maps slot 0; bomber dest leftovers stay #1205 / #1238",
    );
    assert.equal(
      executeSummonControlKitHotkeyCast({
        ...readyCast,
        pieceType: "bomber",
        currentAp: 5,
        caster: summon,
        tile: { x: 5, y: 5 },
      }),
      null,
      "bomber Inferno cannot land on the wisp caster tile",
    );
    assert.equal(
      resolveSummonControlKitHotkeySlots("bomber", starterSpells)[0]?.id,
      "spell-inferno",
    );
  });

  it("live WX keydown is Attack Nearest only; kit slots have no Digit listeners", () => {
    const keydown = wxKeydownBlock();
    assert.ok(keydown.includes("isAttackNearestHotkey"));
    assert.ok(keydown.includes("attackNearestEnemy"));
    assert.equal(keydown.includes("Digit"), false);
    assert.equal(keydown.includes("Numpad"), false);
    assert.equal(keydown.includes("decideSummonControlKitHotkey"), false);
    assert.equal(keydown.includes("selectedSummonSpellId"), false);
    assert.equal(keydown.includes('e.key === "1"'), false);

    const wx = wxSource();
    assert.ok(wx.includes("setSelectedSummonSpellId"));
    assert.ok(wx.includes("selectedSpellIdRef"));
    assert.equal(wx.includes("decideSummonControlKitHotkey"), false);
    assert.equal(wx.includes("summonControlKitSlotIndexFromKey"), false);

    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("addEventListener"), false);
    assert.equal(panel.includes("Digit"), false);
    assert.equal(panel.includes("Numpad"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.ok(panel.includes("onSelect={onSpellSelect}"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    assert.ok(
      battle.includes('if (e.key === "Escape") setSelectedCombatantId(null)'),
    );
    assert.equal(battle.includes("Digit"), false);
    assert.equal(battle.includes("Numpad"), false);
    assert.ok(battle.includes("{slotIndex + 1}"));
    assert.ok(battle.includes("onSelectSpell(spell.id)"));
  });

  it("does not restore champion-bar Digit, kit remaining, or Attack Nearest dest", () => {
    const result = executeSummonControlKitHotkeyCast(readyCast);
    assert.ok(result);
    assert.equal(result.spellId, "starter-heal");
    assert.equal(result.target.id, "wisp");
    assert.equal(
      "dest" in result.target,
      false,
      "#1238 owns Attack Nearest dest pick",
    );
    assert.equal(
      resolveSummonControlKitHotkeySelect({
        action: "ignore",
        reason: "player_turn",
      }),
      null,
      "#743 still owns player-turn Digit 1",
    );
    assert.equal(
      canHotkeySelectSummonControlKit({
        controllingSummon: true,
        inBattle: true,
        currentAp: 5,
        spell: inferno,
      }),
      true,
      "remaining CD is #1211 pointer select, not this leftover",
    );
    assert.equal(
      summonControlKitHotkeyHighlightedIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
