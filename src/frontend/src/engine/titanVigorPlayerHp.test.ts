/**
 * Combat action parity: Titan's Vigor advertised +1000 HP commits on
 * player vitals. Live applyBattleStart only mutates combatantsRef.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_TITANS_VIGOR_HP_BONUS } from "../data/gameConstants.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import { hpAfterIncomingDamage } from "./battleSetup.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";
import {
  TITANS_VIGOR_MODIFIER_ID,
  canExecuteTitanVigorPlayerHp,
  executeTitanVigorPlayerHp,
  isTitansVigorModifier,
  liveWxTitansVigorStampsPlayerHp,
  shouldDecideTitanVigorPlayerHp,
  titanVigorBonusHp,
  titanVigorHighlightedHpIsExecutable,
  titanVigorStampedHp,
  titanVigorStampedMaxHp,
  wxApplyBattleStartReceivesPlayer,
  wxBattleStartWritesCharacterStatsHp,
  wxHasTitansVigorFlag,
  wxPlayerMaxHpIsLevelFormula,
} from "./titanVigorPlayerHp.ts";

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

function wxMaxHpBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const maxHp = useMemo(() => {");
  assert.ok(start >= 0, "live maxHp useMemo is present");
  const end = wx.indexOf("const sidePanelVitalsCaps = useMemo(", start);
  assert.ok(end > start, "sidePanelVitalsCaps still follows maxHp");
  return wx.slice(start, end);
}

describe("Titan's Vigor advertised player +1000 HP vs applyBattleStart skip", () => {
  it("catalog bonus is 1000 and the registry hook mutates handed combatants", () => {
    assert.equal(MAP_MODIFIER_TITANS_VIGOR_HP_BONUS, 1000);
    assert.equal(isTitansVigorModifier(TITANS_VIGOR_MODIFIER_ID), true);
    assert.equal(isTitansVigorModifier("iron_curse"), false);
    assert.equal(isTitansVigorModifier("mending_mist"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === TITANS_VIGOR_MODIFIER_ID);
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Titan's Vigor: +1000 HP, damage rolls 1-5x.",
    );
    const rat = { hp: 40, maxHp: 40, id: "rat-1", side: "enemy" as const };
    const player = { hp: 100, maxHp: 100, id: "player" };
    mapModifierRegistry.applyBattleStart(
      [rat],
      new Set([TITANS_VIGOR_MODIFIER_ID]),
    );
    assert.equal(rat.hp, 1040, "hook must add 1000 onto handed enemy HP");
    assert.equal(rat.maxHp, 1040, "hook must add 1000 onto handed enemy maxHp");
    assert.equal(
      player.hp,
      100,
      "combatants omitted from the call stay unstamped — live WX omits player",
    );
    assert.equal(player.maxHp, 100);
    assert.equal(titanVigorBonusHp(), 1000);
    assert.equal(titanVigorStampedHp(100), 1100);
    assert.equal(titanVigorStampedMaxHp(100, 100), 1100);
    assert.equal(titanVigorStampedHp(0), 1000);
    assert.equal(titanVigorStampedHp(Number.NaN), 1000);
  });

  it("live applyBattleStart skips the player; incoming soaks the unstamped pool", () => {
    assert.equal(wxApplyBattleStartReceivesPlayer(), false);
    assert.equal(wxBattleStartWritesCharacterStatsHp(), false);
    assert.equal(wxPlayerMaxHpIsLevelFormula(), true);
    assert.equal(wxHasTitansVigorFlag(), false);
    assert.equal(liveWxTitansVigorStampsPlayerHp(), false);

    const battleStart = wxApplyBattleStartBlock();
    assert.ok(battleStart.includes("combatantsRef.current"));
    assert.equal(
      battleStart.includes("characterStats"),
      false,
      "applyBattleStart still is not handed the player vitals object",
    );
    assert.equal(battleStart.includes("setCharacterStats"), false);

    const maxHp = wxMaxHpBlock();
    assert.ok(maxHp.includes("100 * (1 + ((characterStats?.level ?? 1) - 1)"));
    assert.equal(maxHp.includes("titans_vigor"), false);
    assert.equal(maxHp.includes("TITANS_VIGOR"), false);
    assert.equal(maxHp.includes("1000"), false);

    const player = wxPlayerTakesDamageBlock();
    assert.ok(player.includes("hpAfterIncomingDamage(prev.hp, dmg)"));
    assert.equal(
      player.includes("applyDamageDealt"),
      false,
      "incoming playerTakesDamage still skips the damage hook (#1160)",
    );
    assert.equal(player.includes("titans_vigor"), false);
    assert.equal(player.includes("TITANS_VIGOR"), false);
    assert.equal(player.includes("1000"), false);

    const wx = wxSource();
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isTitansVigor"),
      false,
      "WX still has no isTitansVigor flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("titans_vigor"),
      false,
      "WX still never mentions titans_vigor",
    );
    assert.ok(
      wx.includes("Player is not in combatantsRef"),
      "player-outside-combatantsRef plague fix must stay",
    );
  });

  it("executes starting 100 HP + incoming 100 as store 1000, not death", () => {
    assert.equal(Number(startingChampionStats().hp), 100);
    const decided = shouldDecideTitanVigorPlayerHp({
      modifierActive: true,
    });
    const executable = canExecuteTitanVigorPlayerHp({
      modifierActive: true,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      titanVigorHighlightedHpIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeTitanVigorPlayerHp({
        modifierActive: true,
        baseHp: 100,
        baseMaxHp: 100,
      }),
      { hp: 1100, maxHp: 1100, damage: 0, hpAfter: 1100 },
      "battle-start stamp must raise both pools before any packet",
    );
    assert.deepEqual(
      executeTitanVigorPlayerHp({
        modifierActive: true,
        baseHp: 100,
        baseMaxHp: 100,
        incomingDamage: 100,
      }),
      { hp: 1100, maxHp: 1100, damage: 100, hpAfter: 1000 },
      "post-RES 100 must leave 1000 on the advertised pool",
    );
    assert.deepEqual(
      hpAfterIncomingDamage(100, 100),
      { newHp: 0, lethal: true },
      "live unstamped 100 HP dies to the same packet",
    );
    assert.equal(hpAfterIncomingDamage(1100, 100).lethal, false);
  });

  it("cannot execute RES, heal, Titan 1–5×, or a missing modifier as this stamp", () => {
    assert.equal(
      canExecuteTitanVigorPlayerHp({
        modifierActive: false,
      }),
      false,
    );
    assert.equal(
      executeTitanVigorPlayerHp({
        modifierActive: false,
        baseHp: 100,
        baseMaxHp: 100,
        incomingDamage: 100,
      }),
      null,
      "inactive modifier must not mint +1000 HP",
    );
    const crit = executeTitanVigorPlayerHp({
      modifierActive: true,
      baseHp: 100,
      baseMaxHp: 100,
      incomingDamage: 100,
    });
    assert.equal(
      crit != null && "res" in crit,
      false,
      "#1200 owns Iron Curse player RES ×1.3",
    );
    assert.equal(
      crit != null && "heal" in crit,
      false,
      "#1155 owns Iron Curse heal ×0.5",
    );
    assert.equal(
      crit != null && "roll" in crit,
      false,
      "Titan 1–5× is a leftover of #1160 Strike / incoming",
    );
    assert.equal(
      crit != null && "mp" in crit,
      false,
      "#1202 owns Swift Winds store currentMp",
    );
    assert.equal(
      crit != null && crit.hpAfter === 22,
      false,
      "#1199 owns Mending Mist store HP",
    );
    assert.equal(
      titanVigorHighlightedHpIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isTitansVigorModifier("Titan's Vigor"), false);
    assert.equal(isTitansVigorModifier("iron_curse"), false);
    assert.equal(
      shouldDecideTitanVigorPlayerHp({
        modifierActive: true,
      }),
      canExecuteTitanVigorPlayerHp({
        modifierActive: true,
      }),
    );
  });
});
