/**
 * Combat action parity: Swift Winds advertised +2 MP must commit
 * through `updateCombatant({ currentMp })` after the per-turn restore.
 * Live WX only mutates the turn-order copy inside `applyTurnStart`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_SWIFT_WINDS_MP_BONUS } from "../data/gameConstants.ts";
import { summonTurnBudget } from "../utils/summonControlCast.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";
import {
  SWIFT_WINDS_MODIFIER_ID,
  canExecuteSwiftWindsStoreMp,
  executeSwiftWindsStoreMp,
  isSwiftWindsModifier,
  liveWxSwiftWindsAddsStoreMp,
  shouldDecideSwiftWindsStoreMp,
  swiftWindsHighlightedBonusIsExecutable,
  swiftWindsMpBonus,
  wxEnemySummonTurnStartCommitsSwiftWindsStoreMp,
  wxEnemyTurnStartCommitsSwiftWindsStoreMp,
  wxPlayerSummonTurnStartCommitsSwiftWindsStoreMp,
} from "./swiftWindsStoreMp.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

describe("Swift Winds advertised +2 MP vs turn-order-only applyTurnStart", () => {
  it("catalog bonus is +2 and the registry hook mutates the passed row.mp", () => {
    assert.equal(MAP_MODIFIER_SWIFT_WINDS_MP_BONUS, 2);
    assert.equal(swiftWindsMpBonus(), 2);
    assert.equal(isSwiftWindsModifier(SWIFT_WINDS_MODIFIER_ID), true);
    assert.equal(isSwiftWindsModifier("mending_mist"), false);
    assert.equal(isSwiftWindsModifier("void_rift"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === SWIFT_WINDS_MODIFIER_ID);
    assert.ok(def);
    assert.equal(def?.announceText, "Swift Winds: +2 MP each turn.");
    const row = { hp: 20, maxHp: 40, mp: 3, assignedName: "wolf" };
    mapModifierRegistry.applyTurnStart(
      row,
      new Set([SWIFT_WINDS_MODIFIER_ID]),
      { log: () => {}, rng: () => 0 },
    );
    assert.equal(row.mp, 5, "hook must add +2 onto the row.mp copy");
    assert.equal(
      "currentMp" in row,
      false,
      "registry still writes .mp, not store currentMp",
    );
  });

  it("live enemy / summon turn start skips the store write that plague and Void Rift use", () => {
    assert.equal(wxEnemyTurnStartCommitsSwiftWindsStoreMp(), false);
    assert.equal(wxEnemySummonTurnStartCommitsSwiftWindsStoreMp(), false);
    assert.equal(wxPlayerSummonTurnStartCommitsSwiftWindsStoreMp(), false);
    assert.equal(liveWxSwiftWindsAddsStoreMp(), false);

    const wx = wxSource();
    assert.ok(wx.includes("mapModifierRegistry.applyTurnStart("));
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isSwiftWinds"),
      false,
      "WX still has no isSwiftWinds flag next to plague / void rift",
    );
    assert.equal(
      wx.includes("swift_winds"),
      false,
      "WX still never mentions swift_winds",
    );
    assert.equal(
      wx.includes("SWIFT_WINDS"),
      false,
      "WX still never imports the Swift Winds bonus constant",
    );
    assert.equal(
      wx.includes("executeSwiftWindsStoreMp"),
      false,
      "this sidecar is still unwired",
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
  });

  it("control-mode restore still overwrites currentMp from maxMp after applyTurnStart", () => {
    const wx = wxSource();
    const applyIdx = wx.indexOf("mapModifierRegistry.applyTurnStart(");
    assert.ok(applyIdx >= 0);
    const budgetIdx = wx.indexOf("const budget = summonTurnBudget(_summon);");
    assert.ok(budgetIdx > applyIdx, "restore still runs after applyTurnStart");
    const budget = summonTurnBudget({ maxAp: 2, maxMp: 3 });
    assert.equal(budget.currentMp, 3);
    assert.notEqual(budget.currentMp, 5);
    const live = executeSwiftWindsStoreMp({
      modifierActive: true,
      restoredMp: budget.currentMp,
    });
    assert.deepEqual(live, { bonus: 2, mpAfter: 5 });
  });

  it("handleSummonTurn still resets currentMp to maxMp with no +2", () => {
    const wx = wxSource();
    assert.ok(wx.includes("summonEnemy.currentMp = summonEnemy.maxMp ?? 0;"));
    const reset = wx.indexOf("summonEnemy.currentMp = summonEnemy.maxMp ?? 0;");
    assert.ok(reset >= 0);
    const nearby = wx.slice(reset, reset + 120);
    assert.equal(nearby.includes("SWIFT_WINDS"), false);
    assert.equal(nearby.includes("+ 2"), false);
  });

  it("executes restored 3 as store 5 so two extra walk tiles fit", () => {
    const decided = shouldDecideSwiftWindsStoreMp({
      modifierActive: true,
      restoredMp: 3,
    });
    const executable = canExecuteSwiftWindsStoreMp({
      modifierActive: true,
      restoredMp: 3,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      swiftWindsHighlightedBonusIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeSwiftWindsStoreMp({
        modifierActive: true,
        restoredMp: 3,
      }),
      { bonus: 2, mpAfter: 5 },
      "3-MP Wolf must gain advertised +2 on the store pool",
    );
    assert.deepEqual(
      executeSwiftWindsStoreMp({
        modifierActive: true,
        restoredMp: 0,
      }),
      { bonus: 2, mpAfter: 2 },
      "0-restore still grants the advertised bonus (not a missing tick)",
    );
  });

  it("cannot execute player vitals, Haste, Mist HP, or a missing modifier as this bonus", () => {
    assert.equal(
      canExecuteSwiftWindsStoreMp({
        modifierActive: false,
        restoredMp: 3,
      }),
      false,
    );
    assert.equal(
      executeSwiftWindsStoreMp({
        modifierActive: true,
        restoredMp: Number.NaN,
      }),
      null,
      "non-finite restore must not mint MP",
    );
    assert.equal(
      executeSwiftWindsStoreMp({
        modifierActive: true,
        restoredMp: Number.NEGATIVE_INFINITY,
      }),
      null,
    );
    const hit = executeSwiftWindsStoreMp({
      modifierActive: true,
      restoredMp: 3,
    });
    assert.equal(
      hit != null && "hp" in hit,
      false,
      "#1199 owns Mending Mist store HP",
    );
    assert.equal(
      hit != null && "healUsed" in hit,
      false,
      "#443 owns player-turn Mist healUsed",
    );
    assert.equal(
      hit != null && "haste" in hit,
      false,
      "#596 owns Haste on the player pool",
    );
    assert.equal(
      swiftWindsHighlightedBonusIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isSwiftWindsModifier("Swift Winds"), false);
    assert.equal(isSwiftWindsModifier("mending_mist"), false);
    assert.equal(
      shouldDecideSwiftWindsStoreMp({
        modifierActive: true,
        restoredMp: 3,
      }),
      canExecuteSwiftWindsStoreMp({
        modifierActive: true,
        restoredMp: 3,
      }),
    );
  });
});
