/**
 * Combat action parity: Titan's Vigor advertised damage rolls 1–5×
 * commit on Strike and incoming hits. Live WX only rolls the
 * enemyTakesDamage leftover packet.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MAP_MODIFIER_TITANS_VIGOR_MAX_MULTIPLIER,
  MAP_MODIFIER_TITANS_VIGOR_MIN_MULTIPLIER,
} from "../data/gameConstants.ts";
import { physicalAttackSpell } from "../data/spellData.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";
import {
  TITANS_VIGOR_DAMAGE_MODIFIER_ID,
  canExecuteTitanVigorDamageRoll,
  executeTitanVigorDamageRoll,
  isTitansVigorDamageModifier,
  liveWxTitansVigorRollsIncoming,
  liveWxTitansVigorRollsStrike,
  shouldDecideTitanVigorDamageRoll,
  titanVigorDamageRoll,
  titanVigorHighlightedRollIsExecutable,
  titanVigorRolledDamage,
  wxEnemyMeleeAppliesTitanVigorRoll,
  wxEnemyTakesDamageAppliesTitanVigorRoll,
  wxIncomingHitAppliesTitanVigorRoll,
  wxPrimaryStrikeAppliesTitanVigorRoll,
} from "./titanVigorDamageRoll.ts";

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

/** rng 0.8 → floor(0.8 * 5) + 1 = 5, matching the live registry hook. */
const rngRoll5 = () => 0.8;
/** rng 0 → floor(0 * 5) + 1 = 1. */
const rngRoll1 = () => 0;

describe("Titan's Vigor advertised 1–5× vs Strike / incoming skip", () => {
  it("catalog span is 1–5 and the registry hook multiplies the packet", () => {
    assert.equal(MAP_MODIFIER_TITANS_VIGOR_MIN_MULTIPLIER, 1);
    assert.equal(MAP_MODIFIER_TITANS_VIGOR_MAX_MULTIPLIER, 5);
    assert.equal(
      isTitansVigorDamageModifier(TITANS_VIGOR_DAMAGE_MODIFIER_ID),
      true,
    );
    assert.equal(isTitansVigorDamageModifier("glass_realm"), false);
    assert.equal(isTitansVigorDamageModifier("vampiric_ground"), false);
    const def = MAP_MODIFIERS.find(
      (m) => m.id === TITANS_VIGOR_DAMAGE_MODIFIER_ID,
    );
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Titan's Vigor: +1000 HP, damage rolls 1-5x.",
    );
    const out5 = mapModifierRegistry.applyDamageDealt(
      { hp: 80 },
      { hp: 40 },
      10,
      new Set([TITANS_VIGOR_DAMAGE_MODIFIER_ID]),
      { log: () => {}, rng: rngRoll5 },
    );
    assert.equal(out5, 50, "hook must rewrite the damage packet to ×5");
    const out1 = mapModifierRegistry.applyDamageDealt(
      { hp: 80 },
      { hp: 40 },
      10,
      new Set([TITANS_VIGOR_DAMAGE_MODIFIER_ID]),
      { log: () => {}, rng: rngRoll1 },
    );
    assert.equal(out1, 10, "roll 1 must leave the packet unchanged");
    assert.equal(titanVigorDamageRoll(rngRoll5), 5);
    assert.equal(titanVigorDamageRoll(rngRoll1), 1);
    assert.deepEqual(titanVigorRolledDamage(10, rngRoll5), {
      damage: 50,
      roll: 5,
    });
    assert.deepEqual(titanVigorRolledDamage(10, rngRoll1), {
      damage: 10,
      roll: 1,
    });
    assert.deepEqual(titanVigorRolledDamage(0, rngRoll5), {
      damage: 0,
      roll: 0,
    });
    assert.deepEqual(titanVigorRolledDamage(-8, rngRoll5), {
      damage: 0,
      roll: 0,
    });
    assert.deepEqual(titanVigorRolledDamage(Number.NaN, rngRoll5), {
      damage: 0,
      roll: 0,
    });
  });

  it("live Strike and incoming skip the hook; enemyTakesDamage leftover still rolls", () => {
    assert.equal(wxPrimaryStrikeAppliesTitanVigorRoll(), false);
    assert.equal(wxIncomingHitAppliesTitanVigorRoll(), false);
    assert.equal(wxEnemyMeleeAppliesTitanVigorRoll(), false);
    assert.equal(wxEnemyTakesDamageAppliesTitanVigorRoll(), true);
    assert.equal(liveWxTitansVigorRollsStrike(), false);
    assert.equal(liveWxTitansVigorRollsIncoming(), false);

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
    assert.equal(player.includes("titans_vigor"), false);
    assert.equal(player.includes("TITANS_VIGOR"), false);

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
    assert.equal(primary.includes("titans_vigor"), false);
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

  it("executes Strike 10 at 15 HP as lethal 0 on roll 5, not live 5 remaining", () => {
    assert.equal(physicalAttackSpell.id, "physical_attack");
    assert.equal(physicalAttackSpell.name, "Strike");
    assert.equal(Number(physicalAttackSpell.damage), 10);

    const decided = shouldDecideTitanVigorDamageRoll({
      modifierActive: true,
      damage: 10,
    });
    const executable = canExecuteTitanVigorDamageRoll({
      modifierActive: true,
      damage: 10,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      titanVigorHighlightedRollIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeTitanVigorDamageRoll({
        modifierActive: true,
        damage: 10,
        currentHp: 15,
        rng: rngRoll5,
      }),
      { damage: 50, roll: 5, hpAfter: 0 },
      "Strike 10 vs 15 HP at roll 5 must go lethal so victory can fire",
    );
    assert.deepEqual(
      executeTitanVigorDamageRoll({
        modifierActive: true,
        damage: 10,
        currentHp: 40,
        rng: rngRoll5,
      }),
      { damage: 50, roll: 5, hpAfter: 0 },
      "Strike 10 vs 40 HP at roll 5 is lethal; Glass ×2 would leave 20",
    );
    assert.deepEqual(
      executeTitanVigorDamageRoll({
        modifierActive: true,
        damage: 10,
        currentHp: 15,
        rng: rngRoll1,
      }),
      { damage: 10, roll: 1, hpAfter: 5 },
      "roll 1 matches the live unrolled packet and must not mint extra",
    );
    assert.deepEqual(
      executeTitanVigorDamageRoll({
        modifierActive: true,
        damage: 10,
        currentHp: 100,
        rng: rngRoll5,
      }),
      { damage: 50, roll: 5, hpAfter: 50 },
      "incoming kit 10 vs 100 HP 0 RES at roll 5 must debit 50, not Glass 20",
    );
  });

  it("cannot execute Glass ×2, Vampiric heal, Titan HP stamp, or a missing packet as this roll", () => {
    assert.equal(
      canExecuteTitanVigorDamageRoll({
        modifierActive: false,
        damage: 10,
      }),
      false,
    );
    assert.equal(
      executeTitanVigorDamageRoll({
        modifierActive: true,
        damage: 0,
        currentHp: 40,
        rng: rngRoll5,
      }),
      null,
      "missing packet must not mint 1 HP",
    );
    assert.equal(
      executeTitanVigorDamageRoll({
        modifierActive: true,
        damage: -8,
        currentHp: 40,
        rng: rngRoll5,
      }),
      null,
    );
    const crit = executeTitanVigorDamageRoll({
      modifierActive: true,
      damage: 10,
      currentHp: 40,
      rng: rngRoll5,
    });
    assert.ok(crit);
    assert.equal(crit.roll, 5, "this execute's unique payload is the 1–5 roll");
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
    assert.equal("res" in crit, false, "#1200 owns Iron Curse player RES ×1.3");
    assert.equal("chc" in crit, false, "#1104 owns boss kit damage CHC");
    assert.equal("hp" in crit, false, "#1203 owns Titan player +1000 HP stamp");
    assert.equal("maxHp" in crit, false, "#1203 owns the maxHp stamp");
    assert.equal(
      crit.damage === 20 && crit.hpAfter === 20,
      false,
      "#1160 owns Glass Realm Strike / incoming ×2 (10→20 vs 40 HP)",
    );
    assert.equal(
      titanVigorHighlightedRollIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isTitansVigorDamageModifier("Titan's Vigor"), false);
    assert.equal(isTitansVigorDamageModifier("glass_realm"), false);
    assert.equal(
      shouldDecideTitanVigorDamageRoll({
        modifierActive: true,
        damage: 10,
      }),
      canExecuteTitanVigorDamageRoll({
        modifierActive: true,
        damage: 10,
      }),
    );
  });
});
