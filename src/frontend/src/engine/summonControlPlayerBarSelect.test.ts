/**
 * Combat / UX leftover: the champion spell bar still selects during a
 * controlled summon turn. Digit/Numpad are not live on main; pointer
 * select is.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  playerSpellBarSelectOpacity,
  resolvePlayerSpellBarSelect,
  shouldAllowPlayerSpellBarSelect,
} from "./summonControlPlayerBarSelect.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function battleUiSource(): string {
  return readFileSync(join(here(), "../components/BattleUIPanel.tsx"), "utf8");
}

function summonPanelSource(): string {
  return readFileSync(
    join(here(), "../components/SummonControlPanel.tsx"),
    "utf8",
  );
}

function spellSlotOnClickBlock(src: string): string {
  const marker = "data-ocid={`battle_ui.spell.${slotIndex + 1}`}";
  const start = src.indexOf(marker);
  assert.ok(start >= 0, "live champion spell slot ocid is present");
  const end = src.indexOf('data-ocid="battle_ui.attack_nearest_button"', start);
  assert.ok(end > start, "Attack Nearest still follows the spell row");
  return src.slice(start, end);
}

function endTurnBlock(src: string): string {
  const marker = 'data-ocid="battle_ui.end_turn_button"';
  const start = src.indexOf(marker);
  assert.ok(start >= 0, "live END TURN ocid is present");
  const end = src.indexOf("SECTION 2e", start);
  assert.ok(end > start, "Summon's Turn label still follows END TURN");
  return src.slice(start, end);
}

function onSelectSpellBlock(src: string): string {
  const start = src.indexOf("onSelectSpell={(id) => {");
  assert.ok(start >= 0, "live WX onSelectSpell is present");
  const end = src.indexOf("onOpenSpellbook=", start);
  assert.ok(end > start, "Spellbook open still follows onSelectSpell");
  return src.slice(start, end);
}

describe("champion spell bar select vs summon control", () => {
  const inferno = starterSpells.find((s) => s.id === "spell-inferno");
  const mend = starterSpells.find((s) => s.id === "starter-heal");

  it("treats catalog Inferno as a champion-bar spell, not a wisp kit id", () => {
    assert.ok(inferno);
    assert.equal(inferno.id, "spell-inferno");
    assert.equal(Number(inferno.apCost), 5);
    assert.ok(mend);
    const wisp = starterSpells.find((s) => s.id === "summon-wisp");
    assert.ok(wisp);
    assert.deepEqual(wisp.summonUnitDef?.summonKit, [
      "starter-heal",
      "spell-rallying-cry",
    ]);
    assert.equal(
      wisp.summonUnitDef?.summonKit?.includes("spell-inferno"),
      false,
    );
  });

  it("blocks champion-bar select while a summon is controlled", () => {
    assert.equal(
      shouldAllowPlayerSpellBarSelect({ isSummonControlled: true }),
      false,
    );
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: true,
        spellId: "spell-inferno",
      }),
      null,
    );
    assert.equal(
      playerSpellBarSelectOpacity({
        isSummonControlled: true,
        isOnCooldown: false,
        inBattle: true,
      }),
      0.4,
    );
  });

  it("keeps player-turn select, cooldown dim, and empty id", () => {
    assert.equal(
      shouldAllowPlayerSpellBarSelect({ isSummonControlled: false }),
      true,
    );
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: false,
        spellId: "spell-inferno",
      }),
      "spell-inferno",
    );
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: false,
        spellId: "",
      }),
      null,
    );
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: false,
        spellId: null,
      }),
      null,
    );
    assert.equal(
      playerSpellBarSelectOpacity({
        isSummonControlled: false,
        isOnCooldown: false,
        inBattle: true,
      }),
      1,
    );
    assert.equal(
      playerSpellBarSelectOpacity({
        isSummonControlled: false,
        isOnCooldown: true,
        inBattle: true,
      }),
      0.5,
    );
    assert.equal(
      playerSpellBarSelectOpacity({
        isSummonControlled: false,
        isOnCooldown: false,
        inBattle: false,
      }),
      0.5,
    );
  });

  it("live END TURN honors isSummonControlled; champion slots do not", () => {
    const ui = battleUiSource();
    assert.ok(
      ui.includes(
        "The player's own spell-slot row and END TURN button are dimmed",
      ),
    );
    const endTurn = endTurnBlock(ui);
    assert.ok(endTurn.includes("isSummonControlled"));
    const slots = spellSlotOnClickBlock(ui);
    assert.ok(slots.includes("onSelectSpell(spell.id)"));
    assert.ok(
      slots.includes("disabled={isEmpty || isOnCooldown || !inBattle}"),
    );
    assert.equal(slots.includes("isSummonControlled"), false);
    assert.ok(slots.includes("opacity: isOnCooldown || !inBattle ? 0.5 : 1"));
    assert.equal(slots.includes("shouldAllowPlayerSpellBarSelect"), false);
    assert.equal(slots.includes("resolvePlayerSpellBarSelect"), false);
  });

  it("live WX onSelectSpell writes the champion id during summon control", () => {
    const select = onSelectSpellBlock(wxSource());
    assert.ok(select.includes("selectedSpellIdRef.current = id"));
    assert.ok(select.includes('setBattleActionMode("attack")'));
    assert.equal(select.includes("activeControlledSummonId"), false);
    assert.equal(select.includes("isSummonControlled"), false);
    assert.equal(select.includes("shouldAllowPlayerSpellBarSelect"), false);
    assert.equal(select.includes("resolvePlayerSpellBarSelect"), false);
  });

  it("Digit/Numpad are not live; this leftover is pointer select", () => {
    const ui = battleUiSource();
    const wx = wxSource();
    for (const src of [ui, wx]) {
      assert.equal(src.includes("Digit"), false);
      assert.equal(src.includes("Numpad"), false);
      assert.equal(src.includes('e.key === "1"'), false);
      assert.equal(src.includes("summonControlHotkeys"), false);
    }
    assert.ok(ui.includes('e.key === "Escape"'));
    assert.ok(wx.includes("isAttackNearestHotkey"));
  });

  it("does not restore kit dest leftovers or kit-panel select", () => {
    const kit = summonPanelSource();
    assert.ok(kit.includes("onSelect(spell.id)"));
    assert.ok(kit.includes("summon_panel.spell_slot"));
    assert.equal(kit.includes("shouldAllowPlayerSpellBarSelect"), false);
    const wx = wxSource();
    assert.equal(wx.includes("pickSummonControlSelfSpriteClickTile"), false);
    assert.equal(wx.includes("pickSummonControlSpriteClickTile"), false);
    assert.ok(wx.includes("shouldAllowPlayerCastEntry"));
  });

  it("player-turn Inferno still resolves; summon-turn Inferno cannot", () => {
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: false,
        spellId: "spell-inferno",
      }),
      "spell-inferno",
    );
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: true,
        spellId: "spell-inferno",
      }),
      null,
      "unique fire: controlling wisp, champion slot still clickable live",
    );
    assert.equal(
      resolvePlayerSpellBarSelect({
        isSummonControlled: true,
        spellId: "starter-heal",
      }),
      null,
      "Blood Mend on the champion bar is still a player-bar select",
    );
  });
});
