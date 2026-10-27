/**
 * Combat action parity: Doka Fever advertised +25% enemy HP commits
 * on the battle pool. Live applyBattleStart skips untagged overworld
 * rats and then overwrites HUD from pre-bonus calcEnemyMaxHp.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_DOKA_FEVER_ENEMY_HP_BONUS } from "../data/gameConstants.ts";
import {
  countsTowardKillRewards,
  hpAfterIncomingDamage,
} from "./battleSetup.ts";
import {
  DOKA_FEVER_MODIFIER_ID,
  advertisedDokaFeverHpTarget,
  canExecuteDokaFeverEnemyHp,
  dokaFeverBonusFraction,
  dokaFeverBonusHp,
  dokaFeverHighlightedHpIsExecutable,
  dokaFeverStampedHp,
  executeDokaFeverEnemyHp,
  isDokaFeverModifier,
  liveRegistryDokaFeverHpGate,
  liveWxDokaFeverBattleHp,
  liveWxDokaFeverStampsEnemyHp,
  shouldDecideDokaFeverEnemyHp,
  wxBattleStartHpMapUsesCalcEnemyMaxHp,
  wxGenerateEnemiesWritesSide,
  wxHasDokaFeverFlag,
  wxMentionsDokaFever,
} from "./dokaFeverEnemyHp.ts";
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

function wxHpMapBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const hpMap: Record<string, number> = {};");
  assert.ok(start >= 0, "live battle-start hpMap is present");
  const end = wx.indexOf("aiGenerationRef.current += 1;", start);
  assert.ok(end > start, "aiGeneration bump still follows hpMap");
  return wx.slice(start, end);
}

function wxGenerateEnemiesPushBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("enemies.push({");
  assert.ok(start >= 0, "live generateEnemies push is present");
  const end = wx.indexOf("return true;", start);
  assert.ok(end > start, "tryPlaceEnemy still returns after the push");
  return wx.slice(start, end);
}

function wxSetEnemyHpMapAfterBattleStart(): boolean {
  const wx = wxSource();
  const apply = wx.indexOf("mapModifierRegistry.applyBattleStart(");
  const hpMapWrite = wx.indexOf("setEnemyHpMap(hpMap);", apply);
  return apply >= 0 && hpMapWrite > apply;
}

describe("Doka Fever advertised enemy +25% HP vs applyBattleStart skip", () => {
  it("catalog bonus is 0.25 and the registry hook skips untagged overworld rats", () => {
    assert.equal(MAP_MODIFIER_DOKA_FEVER_ENEMY_HP_BONUS, 0.25);
    assert.equal(isDokaFeverModifier(DOKA_FEVER_MODIFIER_ID), true);
    assert.equal(isDokaFeverModifier("titans_vigor"), false);
    assert.equal(isDokaFeverModifier("iron_curse"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === DOKA_FEVER_MODIFIER_ID);
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Doka Fever: enemies +25% HP, Doka rewards doubled.",
    );
    assert.equal(dokaFeverBonusFraction(), 0.25);
    assert.equal(dokaFeverBonusHp(50, 50), 12);
    assert.deepEqual(dokaFeverStampedHp(50, 50), { hp: 62, maxHp: 62 });
    assert.deepEqual(dokaFeverStampedHp(0, 0), { hp: 0, maxHp: 0 });
    assert.deepEqual(dokaFeverStampedHp(Number.NaN, Number.NaN), {
      hp: 0,
      maxHp: 0,
    });

    const untagged = { hp: 28, maxHp: 28, id: "enemy-0-1" };
    const tagged = {
      hp: 40,
      maxHp: 40,
      id: "larva-1",
      side: "enemy" as const,
    };
    const playerWolf = {
      hp: 20,
      maxHp: 20,
      id: "wolf-1",
      isSummon: true,
      side: "player" as const,
    };
    mapModifierRegistry.applyBattleStart(
      [untagged, tagged, playerWolf],
      new Set([DOKA_FEVER_MODIFIER_ID]),
    );
    assert.equal(
      untagged.hp,
      28,
      "live gate skips generateEnemies rats with neither isEnemy nor side",
    );
    assert.equal(untagged.maxHp, 28);
    assert.equal(tagged.hp, 50, "tagged side:enemy still receives the hook");
    assert.equal(tagged.maxHp, 50);
    assert.equal(playerWolf.hp, 20, "player-side summons must stay unstamped");
    assert.equal(liveRegistryDokaFeverHpGate(untagged), false);
    assert.equal(liveRegistryDokaFeverHpGate(tagged), true);
    assert.equal(liveRegistryDokaFeverHpGate(playerWolf), false);
    assert.equal(advertisedDokaFeverHpTarget(untagged), true);
    assert.equal(advertisedDokaFeverHpTarget(tagged), true);
    assert.equal(advertisedDokaFeverHpTarget(playerWolf), false);
    assert.equal(countsTowardKillRewards(untagged), true);
  });

  it("live applyBattleStart + hpMap leave overworld rats on the unstamped pool", () => {
    assert.equal(wxGenerateEnemiesWritesSide(), false);
    assert.equal(wxBattleStartHpMapUsesCalcEnemyMaxHp(), true);
    assert.equal(wxHasDokaFeverFlag(), false);
    assert.equal(wxMentionsDokaFever(), false);
    assert.equal(liveWxDokaFeverStampsEnemyHp(), false);

    const spawn = wxGenerateEnemiesPushBlock();
    assert.ok(spawn.includes("Placeholder stats"));
    assert.equal(
      spawn.includes("side:"),
      false,
      "generateEnemies still does not tag overworld rats with side",
    );
    assert.equal(spawn.includes("isEnemy"), false);

    const battleStart = wxApplyBattleStartBlock();
    assert.ok(battleStart.includes("combatantsRef.current"));
    assert.equal(battleStart.includes("setEnemyHpMap"), false);
    assert.equal(battleStart.includes("doka_fever"), false);
    assert.equal(battleStart.includes("isDokaFever"), false);

    const hpMap = wxHpMapBlock();
    assert.ok(hpMap.includes("calcEnemyMaxHp(e.level)"));
    assert.equal(hpMap.includes("doka_fever"), false);
    assert.equal(hpMap.includes("1.25"), false);
    assert.equal(hpMap.includes("0.25"), false);

    assert.equal(
      wxSetEnemyHpMapAfterBattleStart(),
      true,
      "setEnemyHpMap(hpMap) still runs after applyBattleStart, so HUD cannot take the hook result",
    );

    const wx = wxSource();
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isDokaFever"),
      false,
      "WX still has no isDokaFever flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("doka_fever"),
      false,
      "WX still never mentions doka_fever; reward ×2 is generic applyRewardMultiplier",
    );
    assert.ok(
      wx.includes("mapModifierRegistry.applyRewardMultiplier("),
      "Doka Fever reward ×2 must stay on the victory path — do not refile it",
    );
  });

  it("executes level-1 battle pool 50 as store 62, not a 50-damage kill", () => {
    const live = liveWxDokaFeverBattleHp({
      spawnHp: 28,
      calcEnemyMaxHp: 50,
    });
    assert.deepEqual(live, { storeHp: 28, hudHp: 50 });

    const taggedHudMiss = liveWxDokaFeverBattleHp({
      spawnHp: 28,
      calcEnemyMaxHp: 50,
      side: "enemy",
    });
    assert.deepEqual(
      taggedHudMiss,
      { storeHp: 35, hudHp: 50 },
      "even a tagged unit keeps HUD on pre-bonus calcEnemyMaxHp",
    );

    const decided = shouldDecideDokaFeverEnemyHp({
      modifierActive: true,
    });
    const executable = canExecuteDokaFeverEnemyHp({
      modifierActive: true,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      dokaFeverHighlightedHpIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeDokaFeverEnemyHp({
        modifierActive: true,
        baseHp: 50,
        baseMaxHp: 50,
      }),
      { hp: 62, maxHp: 62 },
      "battle-start stamp must raise both pools before any packet",
    );
    assert.deepEqual(
      hpAfterIncomingDamage(50, 50),
      { newHp: 0, lethal: true },
      "live unstamped HUD 50 dies to a 50 packet",
    );
    assert.equal(hpAfterIncomingDamage(62, 50).lethal, false);
    assert.deepEqual(hpAfterIncomingDamage(62, 50), {
      newHp: 12,
      lethal: false,
    });
  });

  it("cannot execute player summons, rewards, Titan HP, or a missing modifier as this stamp", () => {
    assert.equal(
      canExecuteDokaFeverEnemyHp({
        modifierActive: false,
      }),
      false,
    );
    assert.equal(
      executeDokaFeverEnemyHp({
        modifierActive: false,
        baseHp: 50,
        baseMaxHp: 50,
      }),
      null,
      "inactive modifier must not mint +25% HP",
    );
    assert.equal(
      executeDokaFeverEnemyHp({
        modifierActive: true,
        baseHp: 20,
        baseMaxHp: 20,
        isSummon: true,
        side: "player",
      }),
      null,
      "player-side summons must not take enemy +25% HP",
    );
    const crit = executeDokaFeverEnemyHp({
      modifierActive: true,
      baseHp: 50,
      baseMaxHp: 50,
    });
    assert.equal(
      crit != null && "doka" in crit,
      false,
      "Doka Fever reward ×2 is already applyRewardMultiplier — do not refile",
    );
    assert.equal(
      crit != null && "res" in crit,
      false,
      "#1200 owns Iron Curse player RES ×1.3",
    );
    assert.equal(
      crit != null && crit.hp === 1100,
      false,
      "#1203 owns Titan's Vigor player +1000 HP",
    );
    assert.equal(
      crit != null && "mp" in crit,
      false,
      "#1202 owns Swift Winds store currentMp",
    );
    assert.equal(
      crit != null && "roll" in crit,
      false,
      "Titan 1–5× is a leftover of #1160 Strike / incoming",
    );
    assert.equal(
      dokaFeverHighlightedHpIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isDokaFeverModifier("Doka Fever"), false);
    assert.equal(isDokaFeverModifier("titans_vigor"), false);
    assert.equal(
      shouldDecideDokaFeverEnemyHp({
        modifierActive: true,
      }),
      canExecuteDokaFeverEnemyHp({
        modifierActive: true,
      }),
    );
    assert.deepEqual(
      executeDokaFeverEnemyHp({
        modifierActive: true,
        baseHp: 40,
        baseMaxHp: 40,
        isSummon: true,
        side: "enemy",
      }),
      { hp: 50, maxHp: 50 },
      "enemy-side summons are advertised enemies",
    );
  });
});
