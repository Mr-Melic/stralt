/**
 * Combat action parity: Glass Realm advertised damage ×2 never commits
 * on pack fallback melee against the player.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER } from "../data/gameConstants.ts";
import { physicalAttackSpell } from "../data/spellData.ts";
import {
  GLASS_REALM_MELEE_ANNOUNCE_NEEDLE,
  GLASS_REALM_MELEE_TAKEN_MODIFIER_ID,
  PACK_FALLBACK_CRUSH_DAMAGE,
  PACK_FALLBACK_CRUSH_ID,
  PACK_FALLBACK_CRUSH_RANGE,
  PACK_FALLBACK_FIREBOLT_DAMAGE,
  PACK_FALLBACK_FIREBOLT_ID,
  PACK_FALLBACK_FIREBOLT_RANGE,
  canExecuteGlassRealmEnemyMeleeTaken,
  executeGlassRealmEnemyMeleeTaken,
  glassRealmEnemyMeleeHighlightedIsExecutable,
  glassRealmEnemyMeleeTakenAmount,
  isGlassRealmMeleeTakenModifier,
  liveWxPackFallbackMeleeAppliesGlassRealm,
  liveWxSummonTargetMeleeAppliesGlassRealm,
  shouldDecideGlassRealmEnemyMeleeTaken,
} from "./glassRealmEnemyMeleeTaken.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function wxEnemyTakesDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "const _dmgAfterMods = mapModifierRegistry.applyDamageDealt(",
  );
  assert.ok(start >= 0, "live applyDamageDealt call is present");
  const end = wx.indexOf(
    "const newHp = Math.max(0, enemy.hp - _dmgAfterMods);",
    start,
  );
  assert.ok(end > start, "target HP still uses the returned packet");
  return wx.slice(start, end);
}

function wxPackFallbackMeleeBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("Fallback melee or skip");
  assert.ok(start >= 0, "live pack fallback melee is present");
  const crush = wx.indexOf(
    '{ id: "e-crush", name: "Crush", range: 1, damage: 12 }',
    start,
  );
  assert.ok(crush > start, "Crush fallback still sits in the melee pool");
  const death = wx.indexOf(
    "// Melee does NOT use playerTakesDamage — it directly mutates HP via",
    crush,
  );
  assert.ok(death > crush, "death-bisect comment still follows melee HP write");
  const ember = wx.indexOf("ember_knight", death);
  assert.ok(ember > death, "ember burn still follows melee HP write");
  return wx.slice(start, ember);
}

function playerCrushReady() {
  return {
    modifierActive: true,
    meleePacket: PACK_FALLBACK_CRUSH_DAMAGE,
    currentHp: 20,
    targetIsPlayer: true,
  };
}

describe("Glass Realm pack fallback melee ×2 leftover of #1160", () => {
  it("catalog multiplier is 2 and Crush 12 is the unique fire packet", () => {
    assert.equal(MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER, 2);
    assert.equal(
      isGlassRealmMeleeTakenModifier(GLASS_REALM_MELEE_TAKEN_MODIFIER_ID),
      true,
    );
    assert.equal(isGlassRealmMeleeTakenModifier("vampiric_ground"), false);
    assert.equal(isGlassRealmMeleeTakenModifier("titans_vigor"), false);
    assert.equal(isGlassRealmMeleeTakenModifier("Glass Realm"), false);

    const def = MAP_MODIFIERS.find(
      (m) => m.id === GLASS_REALM_MELEE_TAKEN_MODIFIER_ID,
    );
    assert.ok(def);
    assert.equal(def?.announceText, GLASS_REALM_MELEE_ANNOUNCE_NEEDLE);

    const out = mapModifierRegistry.applyDamageDealt(
      { hp: 80 },
      { hp: 40 },
      PACK_FALLBACK_CRUSH_DAMAGE,
      new Set([GLASS_REALM_MELEE_TAKEN_MODIFIER_ID]),
      { log: () => {}, rng: () => 0 },
    );
    assert.equal(out, 24, "hook must rewrite Crush 12 to ×2");
    assert.equal(glassRealmEnemyMeleeTakenAmount(12), 24);
    assert.equal(glassRealmEnemyMeleeTakenAmount(8), 16);
    assert.equal(glassRealmEnemyMeleeTakenAmount(0), 0);
    assert.equal(glassRealmEnemyMeleeTakenAmount(-8), 0);
    assert.equal(glassRealmEnemyMeleeTakenAmount(Number.NaN), 0);

    assert.equal(PACK_FALLBACK_CRUSH_ID, "e-crush");
    assert.equal(PACK_FALLBACK_CRUSH_DAMAGE, 12);
    assert.equal(PACK_FALLBACK_CRUSH_RANGE, 1);
    assert.equal(PACK_FALLBACK_FIREBOLT_ID, "e-firebolt");
    assert.equal(PACK_FALLBACK_FIREBOLT_DAMAGE, 8);
    assert.equal(PACK_FALLBACK_FIREBOLT_RANGE, 3);
    assert.notEqual(PACK_FALLBACK_CRUSH_DAMAGE, PACK_FALLBACK_FIREBOLT_DAMAGE);
    assert.notEqual(
      PACK_FALLBACK_CRUSH_DAMAGE,
      Number(physicalAttackSpell.damage),
      "Crush 12 is not Strike 10 — #1160 owns Strike",
    );
  });

  it("live player melee skips the hook; summon-target leftover still doubles", () => {
    assert.equal(liveWxPackFallbackMeleeAppliesGlassRealm(), false);
    assert.equal(liveWxSummonTargetMeleeAppliesGlassRealm(), true);

    const wx = wxSource();
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isGlassRealm"),
      false,
      "WX still has no isGlassRealm flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("glass_realm"),
      false,
      "WX still never mentions glass_realm",
    );
    assert.equal(wx.includes("executeGlassRealmEnemyMeleeTaken"), false);
    assert.equal(wx.includes("executeGlassRealmDamage"), false);

    const enemy = wxEnemyTakesDamageBlock();
    assert.ok(enemy.includes("mapModifierRegistry.applyDamageDealt("));
    assert.equal(
      enemy.includes("setCharacterStats"),
      false,
      "enemyTakesDamage leftover still only writes enemy HP from _dmgAfterMods",
    );

    const melee = wxPackFallbackMeleeBlock();
    assert.ok(
      melee.includes('{ id: "e-crush", name: "Crush", range: 1, damage: 12 }'),
    );
    assert.ok(
      melee.includes(
        '{ id: "e-firebolt", name: "Fire Bolt", range: 3, damage: 8 }',
      ),
    );
    assert.ok(melee.includes("setCharacterStats((prev) => ({"));
    assert.ok(melee.includes("hp: Math.max(0, prev.hp - meleeDmg)"));
    assert.equal(
      melee.includes("applyDamageDealt"),
      false,
      "player-target melee still skips the registry hook",
    );
    assert.equal(melee.includes("playerTakesDamage"), true);
    assert.ok(
      melee.includes("Melee does NOT use playerTakesDamage"),
      "death-bisect still documents the raw HP write",
    );
    assert.ok(
      melee.includes("enemyTakesDamage("),
      "summon-target melee still routes through enemyTakesDamage",
    );
    assert.equal(melee.includes("glass_realm"), false);
    assert.equal(melee.includes("GLASS_REALM"), false);
  });

  it("executes Crush 12 at 20 HP as lethal 0; live raw write would leave 8", () => {
    const ready = playerCrushReady();
    const decided = shouldDecideGlassRealmEnemyMeleeTaken(ready);
    const executable = canExecuteGlassRealmEnemyMeleeTaken(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      glassRealmEnemyMeleeHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeGlassRealmEnemyMeleeTaken(ready);
    assert.deepEqual(next, { damage: 24, hpAfter: 0, playerDied: true });
    assert.equal(
      Math.max(0, ready.currentHp - ready.meleePacket),
      8,
      "live raw melee write leaves 8 — advertised 24 is lethal",
    );
    assert.notEqual(next?.hpAfter, 8);

    assert.deepEqual(
      executeGlassRealmEnemyMeleeTaken({
        ...ready,
        currentHp: 40,
      }),
      { damage: 24, hpAfter: 16, playerDied: false },
    );
    assert.deepEqual(
      executeGlassRealmEnemyMeleeTaken({
        ...ready,
        meleePacket: PACK_FALLBACK_FIREBOLT_DAMAGE,
        currentHp: 20,
      }),
      { damage: 16, hpAfter: 4, playerDied: false },
      "Fire Bolt 8 still ×2 when it lands — miss leftover is #1042",
    );
  });

  it("cannot stamp summon-target, a missing packet, or sibling leftover payloads", () => {
    const ready = playerCrushReady();
    assert.equal(
      executeGlassRealmEnemyMeleeTaken({
        ...ready,
        modifierActive: false,
      }),
      null,
    );
    assert.equal(
      executeGlassRealmEnemyMeleeTaken({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target melee already doubles via enemyTakesDamage — do not ×4",
    );
    assert.equal(
      executeGlassRealmEnemyMeleeTaken({
        ...ready,
        meleePacket: 0,
      }),
      null,
      "missing packet must not mint 1 HP",
    );
    assert.equal(
      executeGlassRealmEnemyMeleeTaken({
        ...ready,
        meleePacket: -8,
      }),
      null,
    );

    const crit = executeGlassRealmEnemyMeleeTaken(ready);
    assert.ok(crit);
    assert.equal(
      "heal" in crit,
      false,
      "#1148 owns Vampiric Ground attacker HP",
    );
    assert.equal(
      "healAmount" in crit,
      false,
      "#644 / #921 own drain healAmount",
    );
    assert.equal(
      "res" in crit,
      false,
      "#659 owns Shield RES on fallback melee",
    );
    assert.equal("chc" in crit, false, "#1107 owns Crush/Fire Bolt CHC");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(
      "apDrainLastTurn" in crit,
      false,
      "#1234 owns Enthroned Void last-turn AP stamp",
    );
    assert.equal(
      glassRealmEnemyMeleeHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy or Strike name", () => {
    assert.equal(isGlassRealmMeleeTakenModifier("Glass Realm"), false);
    assert.equal(physicalAttackSpell.name, "Strike");
    assert.equal(
      shouldDecideGlassRealmEnemyMeleeTaken(playerCrushReady()),
      canExecuteGlassRealmEnemyMeleeTaken(playerCrushReady()),
    );
    const crit = executeGlassRealmEnemyMeleeTaken(playerCrushReady());
    assert.equal(crit?.damage, 24);
    assert.notEqual(crit?.damage, Number(physicalAttackSpell.damage) * 2);
  });
});
