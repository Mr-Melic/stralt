/**
 * Combat action parity: Vampiric Ground 15% attacker heal commits.
 * The registry hook mutates a throwaway stub; characterStats never rises.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_VAMPIRIC_GROUND_LIFESTEAL_PERCENT } from "../data/gameConstants.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";
import {
  VAMPIRIC_GROUND_MODIFIER_ID,
  canExecuteVampiricGroundLifesteal,
  executeVampiricGroundLifesteal,
  isVampiricGroundModifier,
  liveWxVampiricHealCommits,
  shouldDecideVampiricGroundLifesteal,
  vampiricGroundHealAmount,
  vampiricGroundHighlightedLifestealIsExecutable,
  wxIncomingHitAppliesDamageDealt,
  wxPrimaryStrikeAppliesDamageDealt,
  wxVampiricPlayerAttackerIsThrowaway,
} from "./vampiricGroundLifesteal.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
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

function applyDamageToEnemySource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "./castHelpers.ts"),
    "utf8",
  );
}

describe("Vampiric Ground advertised lifesteal vs WX attacker stub", () => {
  it("catalog fraction is 15% and the registry hook mutates attacker.hp", () => {
    assert.equal(MAP_MODIFIER_VAMPIRIC_GROUND_LIFESTEAL_PERCENT, 0.15);
    assert.equal(isVampiricGroundModifier(VAMPIRIC_GROUND_MODIFIER_ID), true);
    assert.equal(isVampiricGroundModifier("glass_realm"), false);
    assert.equal(isVampiricGroundModifier("doka_fever"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === VAMPIRIC_GROUND_MODIFIER_ID);
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Vampiric Ground: attackers heal for 15% of damage dealt.",
    );
    const attacker = { hp: 80, assignedName: "player" };
    const out = mapModifierRegistry.applyDamageDealt(
      attacker,
      { hp: 40 },
      20,
      new Set([VAMPIRIC_GROUND_MODIFIER_ID]),
      { log: () => {}, rng: () => 0 },
    );
    assert.equal(out, 20, "hook must not rewrite the damage packet");
    assert.equal(attacker.hp, 83, "floor(20 * 0.15) = 3 onto a live attacker");
    assert.equal(vampiricGroundHealAmount(20), 3);
    assert.equal(vampiricGroundHealAmount(6), 0, "floor(6 * 0.15) = 0");
    assert.equal(vampiricGroundHealAmount(0), 0);
    assert.equal(vampiricGroundHealAmount(-8), 0);
    assert.equal(vampiricGroundHealAmount(Number.NaN), 0);
  });

  it("live WX player-attacker object is a throwaway stub; Strike and incoming skip the hook", () => {
    assert.equal(wxVampiricPlayerAttackerIsThrowaway(), true);
    assert.equal(wxPrimaryStrikeAppliesDamageDealt(), false);
    assert.equal(wxIncomingHitAppliesDamageDealt(), false);
    assert.equal(liveWxVampiricHealCommits(), false);
    const enemy = wxEnemyTakesDamageBlock();
    assert.ok(enemy.includes("mapModifierRegistry.applyDamageDealt("));
    assert.ok(enemy.includes('casterId === "player"'));
    assert.ok(enemy.includes("hp: characterStats.hp"));
    assert.ok(enemy.includes("maxHp: characterStats.hp"));
    assert.ok(enemy.includes('id: "player"'));
    assert.equal(
      enemy.includes("setCharacterStats"),
      false,
      "enemyTakesDamage still does not write player HP after the stub heal",
    );
    assert.equal(
      enemy.includes("characterStatsRef.current.hp"),
      false,
      "stub still snapshots closure characterStats.hp, not the live ref",
    );
    const player = wxPlayerTakesDamageBlock();
    assert.equal(
      player.includes("applyDamageDealt"),
      false,
      "incoming playerTakesDamage still skips the registry hook",
    );
    const strike = applyDamageToEnemySource();
    const bodyStart = strike.indexOf("export function applyDamageToEnemy");
    const bounce = strike.indexOf("enemyTakesDamage(", bodyStart);
    const primary = strike.slice(bodyStart, bounce);
    assert.equal(
      primary.includes("applyDamageDealt"),
      false,
      "primary Strike still writes HP without applyDamageDealt",
    );
    assert.ok(
      bounce > bodyStart,
      "bounce leftover still uses enemyTakesDamage (#868)",
    );
  });

  it("executes a 20-damage Sacrifice 80→83 and caps at maxHp", () => {
    const decided = shouldDecideVampiricGroundLifesteal({
      modifierActive: true,
      damage: 20,
    });
    const executable = canExecuteVampiricGroundLifesteal({
      modifierActive: true,
      damage: 20,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      vampiricGroundHighlightedLifestealIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeVampiricGroundLifesteal({
        modifierActive: true,
        damage: 20,
        attackerHp: 80,
        maxHp: 100,
      }),
      { heal: 3, hpAfter: 83 },
    );
    assert.deepEqual(
      executeVampiricGroundLifesteal({
        modifierActive: true,
        damage: 40,
        attackerHp: 97,
        maxHp: 100,
      }),
      { heal: 6, hpAfter: 100 },
    );
  });

  it("cannot execute Glass Realm, drain healAmount, or a missing packet as this heal", () => {
    assert.equal(
      canExecuteVampiricGroundLifesteal({
        modifierActive: false,
        damage: 20,
      }),
      false,
    );
    assert.equal(
      executeVampiricGroundLifesteal({
        modifierActive: true,
        damage: 6,
        attackerHp: 80,
        maxHp: 100,
      }),
      null,
      "floor(6 * 0.15) = 0 must not mint HP",
    );
    assert.equal(
      executeVampiricGroundLifesteal({
        modifierActive: true,
        damage: 0,
        attackerHp: 80,
        maxHp: 100,
      }),
      null,
    );
    const crit = executeVampiricGroundLifesteal({
      modifierActive: true,
      damage: 20,
      attackerHp: 80,
      maxHp: 100,
    });
    assert.equal(
      crit != null && "healAmount" in crit,
      false,
      "#644 / #921 own drain healAmount",
    );
    assert.equal(
      crit != null && "healUsed" in crit,
      false,
      "challenge healUsed stays on #380",
    );
    assert.equal(
      crit != null && "res" in crit,
      false,
      "RES soak stays on the incoming packet, not this heal",
    );
    assert.equal(
      vampiricGroundHighlightedLifestealIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isVampiricGroundModifier("Vampiric Ground"), false);
    assert.equal(isVampiricGroundModifier("blood_moon"), false);
    assert.equal(
      shouldDecideVampiricGroundLifesteal({
        modifierActive: true,
        damage: 20,
      }),
      canExecuteVampiricGroundLifesteal({
        modifierActive: true,
        damage: 20,
      }),
    );
  });
});
