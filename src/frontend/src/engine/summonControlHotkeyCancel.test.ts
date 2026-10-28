/**
 * Combat / UX leftover: Escape still only closes inspect while a
 * player-controlled summon kit spell stays selected. Kit has no Walk
 * analog; live WX keydown is Attack Nearest S only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  decideSummonControlHotkeyCancel,
  isSummonControlEscapeHotkey,
  nextSummonSpellIdAfterEscape,
  summonControlClickUsesKitCast,
  summonControlHotkeyCancelTargetIsEditable,
} from "./summonControlHotkeyCancel.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
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

function summonControlMouseBlock(): string {
  const wx = wxSource();
  const marker =
    "          if (selectedSummonSpellId) {\n            const liveCombatants = getLiveCombatants(combatantStoreCtx);";
  const start = wx.indexOf(marker);
  assert.ok(start >= 0, "live WX mouse summon-control still gates on kit id");
  const end = wx.indexOf("          return;\n        }\n      }", start);
  assert.ok(end > start, "live WX mouse summon-control still returns early");
  return wx.slice(start, end);
}

const escapeKey = { key: "Escape", code: "Escape" };
const digit1 = { key: "1", code: "Digit1" };
const sKey = { key: "s", code: "KeyS" };

describe("summon-control kit Escape cancel vs inspect", () => {
  const mend = starterSpells.find((s) => s.id === "starter-heal");
  const cry = starterSpells.find((s) => s.id === "spell-rallying-cry");
  const wisp = starterSpells.find((s) => s.id === "summon-wisp");
  const inferno = starterSpells.find((s) => s.id === "spell-inferno");

  const readyCancel = {
    event: escapeKey,
    inBattle: true,
    isSummonControlled: true,
    selectedSummonSpellId: "starter-heal",
    inspectOpen: false,
  };

  it("treats catalog Blood Mend as a selected wisp kit id, not champion Inferno", () => {
    assert.ok(mend);
    assert.equal(mend.id, "starter-heal");
    assert.equal(mend.spellType, "heal");
    assert.equal(mend.targetType, "self");
    assert.equal(Number(mend.apCost), 3);
    assert.ok(cry);
    assert.equal(Number(cry.apCost), 4);
    assert.ok(wisp);
    assert.deepEqual(wisp.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.ok(inferno);
    assert.equal(
      wisp.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
    assert.equal(isSummonControlEscapeHotkey(escapeKey), true);
    assert.equal(isSummonControlEscapeHotkey(digit1), false);
    assert.equal(isSummonControlEscapeHotkey(sKey), false);
    assert.equal(
      isSummonControlEscapeHotkey({ ...escapeKey, ctrlKey: true }),
      false,
    );
  });

  it("Escape cancels kit select when inspect is closed", () => {
    const decision = decideSummonControlHotkeyCancel(readyCancel);
    assert.deepEqual(decision, {
      action: "cancel-kit",
      previousSpellId: "starter-heal",
    });
    assert.equal(nextSummonSpellIdAfterEscape(decision, "starter-heal"), null);
    assert.equal(summonControlClickUsesKitCast("starter-heal"), true);
    assert.equal(
      summonControlClickUsesKitCast(
        nextSummonSpellIdAfterEscape(decision, "starter-heal"),
      ),
      false,
      "after cancel the next canvas click walks",
    );
  });

  it("Escape closes inspect first and keeps the kit id", () => {
    const decision = decideSummonControlHotkeyCancel({
      ...readyCancel,
      inspectOpen: true,
    });
    assert.deepEqual(decision, { action: "close-inspect" });
    assert.equal(
      nextSummonSpellIdAfterEscape(decision, "starter-heal"),
      "starter-heal",
    );
    assert.equal(summonControlClickUsesKitCast("starter-heal"), true);
  });

  it("cannot cancel on player turn, empty kit, out of battle, S, or Digit 1", () => {
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        isSummonControlled: false,
      }).reason,
      "player_turn",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        selectedSummonSpellId: null,
      }).reason,
      "no_kit",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        selectedSummonSpellId: "",
      }).reason,
      "no_kit",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        inBattle: false,
      }).reason,
      "out_of_battle",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        event: sKey,
      }).reason,
      "unbound",
      "S is Attack Nearest, not kit cancel",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        event: digit1,
      }).reason,
      "unbound",
      "Digit 1 kit select is #1270, not this leftover",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        event: { ...escapeKey, altKey: true },
      }).reason,
      "unbound",
    );
    assert.equal(
      nextSummonSpellIdAfterEscape(
        { action: "none", reason: "player_turn" },
        "starter-heal",
      ),
      "starter-heal",
    );
  });

  it("live WX keydown is Attack Nearest only; BattleUIPanel Escape only inspect", () => {
    const keydown = wxKeydownBlock();
    assert.ok(keydown.includes("isAttackNearestHotkey"));
    assert.ok(keydown.includes("attackNearestEnemy"));
    assert.equal(keydown.includes("Escape"), false);
    assert.equal(keydown.includes("decideSummonControlHotkeyCancel"), false);
    assert.equal(keydown.includes("selectedSummonSpellId"), false);

    const wx = wxSource();
    assert.equal(wx.includes("decideSummonControlHotkeyCancel"), false);
    assert.equal(wx.includes("nextSummonSpellIdAfterEscape"), false);
    assert.ok(wx.includes("isAttackNearestHotkey"));

    const battle = readSrc("../components/BattleUIPanel.tsx");
    assert.ok(
      battle.includes('if (e.key === "Escape") setSelectedCombatantId(null)'),
    );
    assert.equal(battle.includes("setSelectedSummonSpellId"), false);
    assert.equal(battle.includes("decideSummonControlHotkeyCancel"), false);
    assert.equal(battle.includes("selectedSummonSpellId"), false);
  });

  it("live kit click has no Walk analog and always writes the id", () => {
    const panel = readSrc("../components/SummonControlPanel.tsx");
    assert.equal(panel.includes("Walk"), false);
    assert.equal(panel.includes("onSetWalk"), false);
    assert.equal(panel.includes("selectedSpellId"), false);
    assert.ok(panel.includes("disabled={currentAp < spell.apCost}"));
    assert.ok(panel.includes("onSelect={onSpellSelect}"));
    assert.ok(panel.includes("onSelect(spell.id)"));
    assert.equal(panel.includes("addEventListener"), false);
    assert.equal(panel.includes("Escape"), false);

    const mouse = summonControlMouseBlock();
    assert.ok(mouse.includes("if (selectedSummonSpellId) {"));
    assert.ok(mouse.includes("castControlledSummonSpell"));
    assert.ok(mouse.includes("applyControlledSummonWalk"));
    assert.equal(mouse.includes("decideSummonControlHotkeyCancel"), false);
  });

  it("does not restore Digit kit select or champion-bar pointer skip", () => {
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        selectedSummonSpellId: "spell-inferno",
      }).action,
      "cancel-kit",
      "a selected kit id still cancels; champion Inferno select is #1267",
    );
    assert.equal(
      decideSummonControlHotkeyCancel({
        ...readyCancel,
        event: digit1,
        selectedSummonSpellId: null,
      }).action,
      "none",
    );
    const wx = wxSource();
    assert.equal(wx.includes("decideSummonControlKitHotkey"), false);
    assert.equal(wx.includes("shouldAllowPlayerSpellBarSelect"), false);
    assert.equal(summonControlHotkeyCancelTargetIsEditable(undefined), false);
  });

  it("Rallying Cry cancel also returns to walk; inspect-open keeps it", () => {
    const cryCancel = decideSummonControlHotkeyCancel({
      ...readyCancel,
      selectedSummonSpellId: "spell-rallying-cry",
    });
    assert.deepEqual(cryCancel, {
      action: "cancel-kit",
      previousSpellId: "spell-rallying-cry",
    });
    assert.equal(
      nextSummonSpellIdAfterEscape(cryCancel, "spell-rallying-cry"),
      null,
    );
    const inspectCry = decideSummonControlHotkeyCancel({
      ...readyCancel,
      selectedSummonSpellId: "spell-rallying-cry",
      inspectOpen: true,
    });
    assert.equal(inspectCry.action, "close-inspect");
    assert.equal(
      nextSummonSpellIdAfterEscape(inspectCry, "spell-rallying-cry"),
      "spell-rallying-cry",
    );
  });
});
