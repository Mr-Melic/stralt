/**
 * Combat action parity: Iron Curse advertised +30% RES commits on
 * player incoming. Live applyBattleStart only mutates combatantsRef.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_IRON_CURSE_RES_BONUS } from "../data/gameConstants.ts";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  IRON_CURSE_RES_MODIFIER_ID,
  canExecuteIronCursePlayerRes,
  executeIronCursePlayerRes,
  incomingAfterPlayerRes,
  ironCurseHighlightedResIsExecutable,
  ironCurseScaledRes,
  isIronCurseResModifier,
  liveWxIronCurseScalesPlayerRes,
  shouldDecideIronCursePlayerRes,
  wxApplyBattleStartReceivesPlayer,
  wxBattleStartWritesCharacterStatsRes,
  wxHasIronCurseResFlag,
  wxPlayerTakesDamageSoaksCharacterStatsRes,
} from "./ironCursePlayerRes.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function wxApplyBattleStartBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("mapModifierRegistry.applyBattleStart(");
  assert.ok(start >= 0, "live applyBattleStart call is present");
  const end = wx.indexOf("setEnragedEnemies(new Set());", start);
  assert.ok(end > start, "setEnragedEnemies still follows applyBattleStart");
  return wx.slice(start, end);
}

function wxPlayerTakesDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const playerTakesDamage = useCallback(");
  assert.ok(start >= 0, "live playerTakesDamage is present");
  const end = wx.indexOf("const enemyTakesDamage = useCallback(", start);
  assert.ok(end > start, "enemyTakesDamage still follows playerTakesDamage");
  return wx.slice(start, end);
}

function wxBossKitDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Damage / drain → playerTakesDamage (mirror WX 13520-13646).",
  );
  assert.ok(start >= 0, "live boss kit damage branch is present");
  const end = wx.indexOf(
    "// Heal → updateCombatant on boss (store + strip).",
    start,
  );
  assert.ok(end > start, "boss heal still follows kit playerTakesDamage");
  return wx.slice(start, end);
}

describe("Iron Curse advertised player RES ×1.3 vs applyBattleStart skip", () => {
  it("catalog bonus is 0.3 and the registry hook mutates handed combatants", () => {
    assert.equal(MAP_MODIFIER_IRON_CURSE_RES_BONUS, 0.3);
    assert.equal(isIronCurseResModifier(IRON_CURSE_RES_MODIFIER_ID), true);
    assert.equal(isIronCurseResModifier("vampiric_ground"), false);
    assert.equal(isIronCurseResModifier("titans_vigor"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === IRON_CURSE_RES_MODIFIER_ID);
    assert.ok(def);
    assert.equal(def?.announceText, "Iron Curse: +30% RES, healing halved.");
    const rat = { hp: 40, res: 10, id: "rat-1", side: "enemy" as const };
    const player = { hp: 100, res: 10, id: "player" };
    mapModifierRegistry.applyBattleStart(
      [rat],
      new Set([IRON_CURSE_RES_MODIFIER_ID]),
    );
    assert.equal(rat.res, 13, "hook must rewrite handed enemy RES to ×1.3");
    assert.equal(
      player.res,
      10,
      "combatants omitted from the call stay unscaled — live WX omits player",
    );
    assert.equal(ironCurseScaledRes(10), 13);
    assert.equal(ironCurseScaledRes(7), 9, "floor(7 * 1.3) = 9");
    assert.equal(ironCurseScaledRes(0), 0);
    assert.equal(ironCurseScaledRes(Number.NaN), 0);
    assert.equal(incomingAfterPlayerRes(20, 10), 18);
    assert.equal(incomingAfterPlayerRes(20, 13), 17);
    assert.equal(incomingAfterPlayerRes(10, 10), 9);
    assert.equal(
      incomingAfterPlayerRes(10, 13),
      9,
      "Strike 10 at RES 10 vs 13 both round to 9 — use Frost Bolt 20",
    );
  });

  it("live applyBattleStart skips the player; playerTakesDamage soaks unscaled RES", () => {
    assert.equal(wxApplyBattleStartReceivesPlayer(), false);
    assert.equal(wxBattleStartWritesCharacterStatsRes(), false);
    assert.equal(wxPlayerTakesDamageSoaksCharacterStatsRes(), true);
    assert.equal(wxHasIronCurseResFlag(), false);
    assert.equal(liveWxIronCurseScalesPlayerRes(), false);

    const battleStart = wxApplyBattleStartBlock();
    assert.ok(battleStart.includes("combatantsRef.current"));
    assert.equal(
      battleStart.includes("characterStats"),
      false,
      "applyBattleStart still is not handed the player vitals object",
    );
    assert.equal(battleStart.includes("setCharacterStats"), false);

    const player = wxPlayerTakesDamageBlock();
    assert.ok(player.includes("characterStatsRef.current.res"));
    assert.ok(player.includes("hpAfterIncomingDamage(prev.hp, dmg)"));
    assert.equal(
      player.includes("applyDamageDealt"),
      false,
      "incoming playerTakesDamage still skips the damage hook (#1160)",
    );
    assert.equal(player.includes("iron_curse"), false);
    assert.equal(player.includes("IRON_CURSE"), false);
    assert.equal(player.includes("1.3"), false);

    const bossKit = wxBossKitDamageBlock();
    assert.ok(bossKit.includes("playerTakesDamage("));
    assert.equal(
      bossKit.includes("plResEff"),
      false,
      "boss kit still has no pack-enemy pre-soak — one RES read",
    );

    const wx = wxSource();
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isIronCurse"),
      false,
      "WX still has no isIronCurse flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("iron_curse"),
      false,
      "WX still never mentions iron_curse",
    );
    assert.ok(
      wx.includes("Player is not in combatantsRef"),
      "player-outside-combatantsRef plague fix must stay",
    );
  });

  it("executes Frost Bolt 20 at RES 10 / 100 HP as 17 dmg → 83", () => {
    assert.equal(Number(startingChampionStats().res), 10);
    const frostBolt = starterSpells.find((s) => s.id === "starter-frost");
    assert.ok(frostBolt);
    assert.equal(frostBolt?.name, "Frost Bolt");
    assert.equal(Number(frostBolt?.damage), 20);

    const decided = shouldDecideIronCursePlayerRes({
      modifierActive: true,
      incomingDamage: 20,
    });
    const executable = canExecuteIronCursePlayerRes({
      modifierActive: true,
      incomingDamage: 20,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      ironCurseHighlightedResIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeIronCursePlayerRes({
        modifierActive: true,
        baseRes: 10,
        incomingDamage: 20,
        currentHp: 100,
      }),
      { res: 13, damage: 17, hpAfter: 83 },
      "boss kit Frost Bolt 20 vs RES 10 must soak as 13 RES → 83 HP",
    );
    assert.equal(
      incomingAfterPlayerRes(20, 10),
      18,
      "live unscaled soak leaves 82 HP",
    );
    assert.deepEqual(
      executeIronCursePlayerRes({
        modifierActive: true,
        baseRes: 10,
        incomingDamage: 20,
        currentHp: 18,
      }),
      { res: 13, damage: 17, hpAfter: 1 },
      "18 HP survives advertised 17 and dies to unscaled 18",
    );
  });

  it("cannot execute heal, Titan HP, Glass ×2, or a missing packet as this stamp", () => {
    assert.equal(
      canExecuteIronCursePlayerRes({
        modifierActive: false,
        incomingDamage: 20,
      }),
      false,
    );
    assert.equal(
      executeIronCursePlayerRes({
        modifierActive: true,
        baseRes: 10,
        incomingDamage: 0,
        currentHp: 100,
      }),
      null,
      "missing packet must not mint 1 HP",
    );
    assert.equal(
      executeIronCursePlayerRes({
        modifierActive: true,
        baseRes: 10,
        incomingDamage: -8,
        currentHp: 100,
      }),
      null,
    );
    const crit = executeIronCursePlayerRes({
      modifierActive: true,
      baseRes: 10,
      incomingDamage: 20,
      currentHp: 100,
    });
    assert.equal(
      crit != null && "heal" in crit,
      false,
      "#1155 owns Iron Curse heal ×0.5",
    );
    assert.equal(
      crit != null && "healAmount" in crit,
      false,
      "#644 / #921 own drain healAmount",
    );
    assert.equal(
      crit != null && "roll" in crit,
      false,
      "Titan 1–5× is a sibling skip of Strike / incoming",
    );
    assert.equal(
      crit != null && "maxHp" in crit,
      false,
      "Titan +1000 HP is a sibling of applyBattleStart",
    );
    assert.equal(
      crit != null && crit.damage === 40,
      false,
      "#1160 owns Glass Realm ×2",
    );
    assert.equal(
      crit != null && "chc" in crit,
      false,
      "#1104 owns boss kit damage CHC",
    );
    assert.equal(
      ironCurseHighlightedResIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isIronCurseResModifier("Iron Curse"), false);
    assert.equal(isIronCurseResModifier("glass_realm"), false);
    assert.equal(
      shouldDecideIronCursePlayerRes({
        modifierActive: true,
        incomingDamage: 20,
      }),
      canExecuteIronCursePlayerRes({
        modifierActive: true,
        incomingDamage: 20,
      }),
    );
  });
});
