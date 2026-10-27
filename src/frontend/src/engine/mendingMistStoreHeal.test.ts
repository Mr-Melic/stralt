/**
 * Combat action parity: Mending Mist advertised 5% max-HP regen must
 * commit through `updateCombatant`. Live WX only mutates the turn-order
 * copy inside `applyTurnStart`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_MENDING_MIST_REGEN_PERCENT } from "../data/gameConstants.ts";
import { hpAfterHeal } from "./battleSetup.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";
import {
  MENDING_MIST_MODIFIER_ID,
  canExecuteMendingMistStoreHeal,
  executeMendingMistStoreHeal,
  isMendingMistModifier,
  liveWxMendingMistHealsStoreHp,
  mendingMistHighlightedHealIsExecutable,
  mendingMistRegenAmount,
  shouldDecideMendingMistStoreHeal,
  wxEnemySummonTurnStartCommitsMendingMistStoreHp,
  wxEnemyTurnStartCommitsMendingMistStoreHp,
  wxPlayerSummonTurnStartCommitsMendingMistStoreHp,
} from "./mendingMistStoreHeal.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function battleSetupHealComment(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "./battleSetup.ts"),
    "utf8",
  );
}

describe("Mending Mist advertised regen vs turn-order-only applyTurnStart", () => {
  it("catalog percent is 5% and the registry hook heals the passed row", () => {
    assert.equal(MAP_MODIFIER_MENDING_MIST_REGEN_PERCENT, 0.05);
    assert.equal(isMendingMistModifier(MENDING_MIST_MODIFIER_ID), true);
    assert.equal(isMendingMistModifier("void_rift"), false);
    assert.equal(isMendingMistModifier("plague_zone"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === MENDING_MIST_MODIFIER_ID);
    assert.ok(def);
    assert.equal(def?.announceText, "Mending Mist: 5% max HP regen each turn.");
    const row = { hp: 20, maxHp: 40, assignedName: "pawn" };
    mapModifierRegistry.applyTurnStart(
      row,
      new Set([MENDING_MIST_MODIFIER_ID]),
      { log: () => {}, rng: () => 0 },
    );
    assert.equal(row.hp, 22, "hook must add floor(40 * 0.05) onto the row");
    assert.equal(mendingMistRegenAmount(40), 2);
    assert.equal(mendingMistRegenAmount(100), 5);
    assert.equal(mendingMistRegenAmount(15), 0, "floor(15 * 0.05) is 0");
    assert.equal(mendingMistRegenAmount(0), 0);
    assert.equal(mendingMistRegenAmount(-8), 0);
    assert.equal(mendingMistRegenAmount(Number.NaN), 0);
  });

  it("live enemy / summon turn start skips the store write that plague and Void Rift use", () => {
    assert.equal(wxEnemyTurnStartCommitsMendingMistStoreHp(), false);
    assert.equal(wxEnemySummonTurnStartCommitsMendingMistStoreHp(), false);
    assert.equal(wxPlayerSummonTurnStartCommitsMendingMistStoreHp(), false);
    assert.equal(liveWxMendingMistHealsStoreHp(), false);

    const wx = wxSource();
    assert.ok(wx.includes("mapModifierRegistry.applyTurnStart("));
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isMendingMist"),
      false,
      "WX still has no isMendingMist flag next to plague / void rift",
    );
    assert.equal(
      wx.includes("mending_mist"),
      false,
      "WX still never mentions mending_mist",
    );
    assert.equal(
      wx.includes("MAP_MODIFIER_MENDING_MIST"),
      false,
      "WX still never imports the mist regen constant",
    );

    const plagueWrites = wx.split("if (isPlagueZone)").length - 1;
    const riftWrites = wx.split("if (isVoidRift)").length - 1;
    assert.ok(
      plagueWrites >= 3,
      "player-summon / enemy-summon / enemy-ai still have dedicated plague store commits",
    );
    assert.ok(
      riftWrites >= 3,
      "player-summon / enemy-summon / enemy-ai still have dedicated Void Rift store commits",
    );

    const setup = battleSetupHealComment();
    assert.ok(
      setup.includes("Callers must write this through `updateCombatant`"),
      "hpAfterHeal still documents that turn-order-only heals miss the store",
    );
  });

  it("executes 40 max-HP at 20 as store 22 and caps a 39 HP pawn at 40", () => {
    const decided = shouldDecideMendingMistStoreHeal({
      modifierActive: true,
      maxHp: 40,
    });
    const executable = canExecuteMendingMistStoreHeal({
      modifierActive: true,
      maxHp: 40,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      mendingMistHighlightedHealIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeMendingMistStoreHeal({
        modifierActive: true,
        hp: 20,
        maxHp: 40,
      }),
      { heal: 2, hpAfter: 22 },
      "wounded pawn must gain floor(40 * 0.05) on the store",
    );
    assert.deepEqual(
      executeMendingMistStoreHeal({
        modifierActive: true,
        hp: 39,
        maxHp: 40,
      }),
      { heal: 2, hpAfter: 40 },
      "regen must cap at maxHp so the next Strike cannot over-heal",
    );
    assert.deepEqual(
      executeMendingMistStoreHeal({
        modifierActive: true,
        hp: 40,
        maxHp: 40,
      }),
      { heal: 2, hpAfter: 40 },
    );
    assert.equal(hpAfterHeal(20, 40, 2), 22);
  });

  it("cannot execute player vitals, Swift Winds MP, or a 0-regen tick as this heal", () => {
    assert.equal(
      canExecuteMendingMistStoreHeal({
        modifierActive: false,
        maxHp: 40,
      }),
      false,
    );
    assert.equal(
      executeMendingMistStoreHeal({
        modifierActive: true,
        hp: 10,
        maxHp: 15,
      }),
      null,
      "floor(15 * 0.05) is 0 — do not mint HP",
    );
    assert.equal(
      executeMendingMistStoreHeal({
        modifierActive: true,
        hp: 20,
        maxHp: 0,
      }),
      null,
    );
    const hit = executeMendingMistStoreHeal({
      modifierActive: true,
      hp: 20,
      maxHp: 40,
    });
    assert.equal(
      hit != null && "mp" in hit,
      false,
      "Swift Winds +2 MP on the same turn-order copy is a sibling leftover",
    );
    assert.equal(
      hit != null && "healUsed" in hit,
      false,
      "#443 owns player-turn Mist healUsed",
    );
    assert.equal(
      hit != null && "res" in hit,
      false,
      "player Iron Curse RES ×1.3 is a sibling of applyBattleStart",
    );
    assert.equal(
      hit != null && "lifesteal" in hit,
      false,
      "#1148 owns Vampiric Ground attacker HP",
    );
    assert.equal(
      mendingMistHighlightedHealIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isMendingMistModifier("Mending Mist"), false);
    assert.equal(isMendingMistModifier("swift_winds"), false);
    assert.equal(
      shouldDecideMendingMistStoreHeal({
        modifierActive: true,
        maxHp: 40,
      }),
      canExecuteMendingMistStoreHeal({
        modifierActive: true,
        maxHp: 40,
      }),
    );
  });
});
