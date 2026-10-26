/**
 * Combat action parity: Glass Realm advertised damage ×2 commits on
 * Strike and incoming hits. Live WX only doubles the enemyTakesDamage
 * leftover packet.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER } from "../data/gameConstants.ts";
import { physicalAttackSpell } from "../data/spellData.ts";
import {
  GLASS_REALM_MODIFIER_ID,
  canExecuteGlassRealmDamage,
  executeGlassRealmDamage,
  glassRealmDamageAmount,
  glassRealmHighlightedDamageIsExecutable,
  isGlassRealmModifier,
  liveWxGlassRealmDoublesIncoming,
  liveWxGlassRealmDoublesStrike,
  shouldDecideGlassRealmDamage,
  wxEnemyMeleeAppliesGlassRealm,
  wxEnemyTakesDamageAppliesGlassRealm,
  wxIncomingHitAppliesGlassRealm,
  wxPrimaryStrikeAppliesGlassRealm,
} from "./glassRealmDamageExecute.ts";
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

function applyDamageToEnemySource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "./castHelpers.ts"),
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

function wxPlayerTakesDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const playerTakesDamage = useCallback(");
  assert.ok(start >= 0, "live playerTakesDamage is present");
  const end = wx.indexOf("const enemyTakesDamage = useCallback(", start);
  assert.ok(end > start, "enemyTakesDamage still follows playerTakesDamage");
  return wx.slice(start, end);
}

function wxEnemyMeleeBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Melee does NOT use playerTakesDamage — it directly mutates HP via",
  );
  assert.ok(start >= 0, "live enemy melee death-bisect comment is present");
  const end = wx.indexOf("ember_knight", start);
  assert.ok(end > start, "ember burn still follows melee HP write");
  return wx.slice(start, end);
}

describe("Glass Realm advertised damage ×2 vs Strike / incoming skip", () => {
  it("catalog multiplier is 2 and the registry hook doubles the packet", () => {
    assert.equal(MAP_MODIFIER_GLASS_REALM_DAMAGE_MULTIPLIER, 2);
    assert.equal(isGlassRealmModifier(GLASS_REALM_MODIFIER_ID), true);
    assert.equal(isGlassRealmModifier("vampiric_ground"), false);
    assert.equal(isGlassRealmModifier("titans_vigor"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === GLASS_REALM_MODIFIER_ID);
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Glass Realm: all damage doubled, dealt and taken.",
    );
    const out = mapModifierRegistry.applyDamageDealt(
      { hp: 80 },
      { hp: 40 },
      10,
      new Set([GLASS_REALM_MODIFIER_ID]),
      { log: () => {}, rng: () => 0 },
    );
    assert.equal(out, 20, "hook must rewrite the damage packet to ×2");
    assert.equal(glassRealmDamageAmount(10), 20);
    assert.equal(glassRealmDamageAmount(7), 14);
    assert.equal(glassRealmDamageAmount(0), 0);
    assert.equal(glassRealmDamageAmount(-8), 0);
    assert.equal(glassRealmDamageAmount(Number.NaN), 0);
  });

  it("live Strike and incoming skip the hook; enemyTakesDamage leftover still doubles", () => {
    assert.equal(wxPrimaryStrikeAppliesGlassRealm(), false);
    assert.equal(wxIncomingHitAppliesGlassRealm(), false);
    assert.equal(wxEnemyMeleeAppliesGlassRealm(), false);
    assert.equal(wxEnemyTakesDamageAppliesGlassRealm(), true);
    assert.equal(liveWxGlassRealmDoublesStrike(), false);
    assert.equal(liveWxGlassRealmDoublesIncoming(), false);

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

    const enemy = wxEnemyTakesDamageBlock();
    assert.ok(enemy.includes("mapModifierRegistry.applyDamageDealt("));
    assert.equal(
      enemy.includes("setCharacterStats"),
      false,
      "enemyTakesDamage leftover still only writes enemy HP from _dmgAfterMods",
    );

    const player = wxPlayerTakesDamageBlock();
    assert.equal(
      player.includes("applyDamageDealt"),
      false,
      "incoming playerTakesDamage still skips the registry hook",
    );
    assert.ok(player.includes("hpAfterIncomingDamage(prev.hp, dmg)"));
    assert.equal(player.includes("glass_realm"), false);
    assert.equal(player.includes("GLASS_REALM"), false);

    const strike = applyDamageToEnemySource();
    const bodyStart = strike.indexOf("export function applyDamageToEnemy");
    const bounce = strike.indexOf("enemyTakesDamage(", bodyStart);
    const primary = strike.slice(bodyStart, bounce);
    assert.equal(
      primary.includes("applyDamageDealt"),
      false,
      "primary Strike still writes HP without applyDamageDealt",
    );
    assert.ok(primary.includes("enemyPrevHp - finalDmg"));
    assert.equal(primary.includes("glass_realm"), false);
    assert.ok(
      bounce > bodyStart,
      "bounce leftover still uses enemyTakesDamage (#868)",
    );

    const melee = wxEnemyMeleeBlock();
    assert.equal(
      melee.includes("applyDamageDealt"),
      false,
      "enemy melee still skips the registry hook",
    );
  });

  it("executes Strike 10 at 15 HP as lethal 0 and incoming 10 at 100 as 80", () => {
    assert.equal(physicalAttackSpell.id, "physical_attack");
    assert.equal(physicalAttackSpell.name, "Strike");
    assert.equal(Number(physicalAttackSpell.damage), 10);

    const decided = shouldDecideGlassRealmDamage({
      modifierActive: true,
      damage: 10,
    });
    const executable = canExecuteGlassRealmDamage({
      modifierActive: true,
      damage: 10,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      glassRealmHighlightedDamageIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeGlassRealmDamage({
        modifierActive: true,
        damage: 10,
        currentHp: 15,
      }),
      { damage: 20, hpAfter: 0 },
      "Strike 10 vs 15 HP must go lethal so victory can fire",
    );
    assert.deepEqual(
      executeGlassRealmDamage({
        modifierActive: true,
        damage: 10,
        currentHp: 40,
      }),
      { damage: 20, hpAfter: 20 },
    );
    assert.deepEqual(
      executeGlassRealmDamage({
        modifierActive: true,
        damage: 10,
        currentHp: 100,
      }),
      { damage: 20, hpAfter: 80 },
      "incoming kit 10 vs 100 HP 0 RES must debit 20",
    );
  });

  it("cannot execute Vampiric Ground, Titan roll, or a missing packet as this ×2", () => {
    assert.equal(
      canExecuteGlassRealmDamage({
        modifierActive: false,
        damage: 10,
      }),
      false,
    );
    assert.equal(
      executeGlassRealmDamage({
        modifierActive: true,
        damage: 0,
        currentHp: 40,
      }),
      null,
      "missing packet must not mint 1 HP",
    );
    assert.equal(
      executeGlassRealmDamage({
        modifierActive: true,
        damage: -8,
        currentHp: 40,
      }),
      null,
    );
    const crit = executeGlassRealmDamage({
      modifierActive: true,
      damage: 10,
      currentHp: 40,
    });
    assert.equal(
      crit != null && "heal" in crit,
      false,
      "#1148 owns Vampiric Ground attacker HP",
    );
    assert.equal(
      crit != null && "healAmount" in crit,
      false,
      "#644 / #921 own drain healAmount",
    );
    assert.equal(
      crit != null && "res" in crit,
      false,
      "player Iron Curse RES ×1.3 is a sibling of applyBattleStart",
    );
    assert.equal(
      crit != null && "chc" in crit,
      false,
      "#1104 owns boss kit damage CHC",
    );
    assert.equal(
      crit != null && "roll" in crit,
      false,
      "Titan 1–5× is a sibling skip of Strike / incoming",
    );
    assert.equal(
      glassRealmHighlightedDamageIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isGlassRealmModifier("Glass Realm"), false);
    assert.equal(isGlassRealmModifier("titans_vigor"), false);
    assert.equal(
      shouldDecideGlassRealmDamage({
        modifierActive: true,
        damage: 10,
      }),
      canExecuteGlassRealmDamage({
        modifierActive: true,
        damage: 10,
      }),
    );
  });
});
