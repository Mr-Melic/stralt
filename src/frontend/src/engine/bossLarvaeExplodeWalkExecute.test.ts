/**
 * Combat action parity: Broodmother LARVAE_EXPLODE advertised 5×3 venom
 * never commits on player walk / leftover-walk dest.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  BROODMOTHER_ROOK_ID,
  ENTHRONED_VOID_ANCHOR_STEP_DAMAGE,
  GLYPH_TRAP_ABILITY,
  GLYPH_TRAP_DAMAGE,
  LARVAE_EXPLODE_ABILITY,
  LARVAE_EXPLODE_LOG_NEEDLE,
  LARVAE_SPAWN_ABILITY,
  LARVA_VENOM_DAMAGE_PER_TURN,
  LARVA_VENOM_DURATION,
  LARVA_VENOM_EFFECT_NAME,
  SHELL_ARMOR_ABILITY,
  STARTER_POISON_DAMAGE_PER_TURN,
  advertisedLarvaVenomDot,
  canExecuteLarvaeExplodeWalk,
  executeLarvaeExplodeWalk,
  isLarvaContactTile,
  isLarvaeExplodeAbility,
  liveWxLarvaeExplodeWalkDots,
  shouldDecideLarvaeExplodeWalk,
} from "./bossLarvaeExplodeWalkExecute.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function bossAiSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossAI.ts"),
    "utf8",
  );
}

function bossSystemSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../hooks/useBossSystem.ts"),
    "utf8",
  );
}

function castHelpersSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "./castHelpers.ts"),
    "utf8",
  );
}

function battleSetupSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "./battleSetup.ts"),
    "utf8",
  );
}

const larvaAt55 = [{ id: "larva_1", x: 5, y: 5, hp: 1, poisoned: false }];
const poisonArrow = starterSpells.find((s) => s.id === "starter-poison");

describe("LARVAE_EXPLODE catalog / ability identity", () => {
  it("advertises 5×3 venom and is distinct from glyph 15 / Void 20 / Poison Arrow 4", () => {
    assert.equal(LARVA_VENOM_DAMAGE_PER_TURN, 5);
    assert.equal(LARVA_VENOM_DURATION, 3);
    assert.equal(LARVA_VENOM_EFFECT_NAME, "Larva Venom");
    assert.equal(GLYPH_TRAP_DAMAGE, 15);
    assert.equal(ENTHRONED_VOID_ANCHOR_STEP_DAMAGE, 20);
    assert.equal(STARTER_POISON_DAMAGE_PER_TURN, 4);
    assert.notEqual(LARVA_VENOM_DAMAGE_PER_TURN, GLYPH_TRAP_DAMAGE);
    assert.notEqual(
      LARVA_VENOM_DAMAGE_PER_TURN,
      ENTHRONED_VOID_ANCHOR_STEP_DAMAGE,
    );
    assert.notEqual(
      LARVA_VENOM_DAMAGE_PER_TURN,
      STARTER_POISON_DAMAGE_PER_TURN,
    );
    assert.equal(isLarvaeExplodeAbility(LARVAE_EXPLODE_ABILITY), true);
    assert.equal(isLarvaeExplodeAbility(LARVAE_SPAWN_ABILITY), false);
    assert.equal(isLarvaeExplodeAbility(SHELL_ARMOR_ABILITY), false);
    assert.equal(isLarvaeExplodeAbility(GLYPH_TRAP_ABILITY), false);
    assert.equal(BROODMOTHER_ROOK_ID, "broodmother_rook");
    assert.ok(
      LARVAE_EXPLODE_LOG_NEEDLE.includes("A larva explodes on contact"),
    );
    assert.ok(LARVAE_EXPLODE_LOG_NEEDLE.includes("5 damage/turn for 3 turns"));

    assert.ok(poisonArrow);
    assert.equal(poisonArrow?.dotDamagePerTurn, 4);
    assert.equal(poisonArrow?.dotDuration, 3);

    const types = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossTypes.ts"),
      "utf8",
    );
    assert.ok(types.includes('LARVAE_EXPLODE = "LARVAE_EXPLODE"'));
    assert.ok(types.includes('LARVAE_SPAWN = "LARVAE_SPAWN"'));
    assert.ok(types.includes('SHELL_ARMOR = "SHELL_ARMOR"'));
    assert.ok(
      types.includes("If true, this larva explodes for poison DoT on contact."),
    );
  });
});

describe("live wiring leftover", () => {
  it("applyLarvaeExplode still returns 5×3 but nothing decides or walks it", () => {
    const system = bossSystemSource();
    assert.ok(system.includes("function applyLarvaeExplode("));
    assert.ok(system.includes('effectName: "Larva Venom"'));
    assert.ok(system.includes("damage: 5"));
    assert.ok(system.includes("duration: 3"));
    assert.ok(system.includes(LARVAE_EXPLODE_LOG_NEEDLE));
    assert.ok(system.includes("case BossAbility.LARVAE_EXPLODE:"));
    assert.ok(
      system.includes("Called when the player steps on a larva tile"),
      "production apply still documents the walk-contact caller",
    );

    const ai = bossAiSource();
    assert.ok(
      ai.includes("BossAbility.LARVAE_SPAWN"),
      "spawn path still exists (occupancy leftover of #920)",
    );
    assert.ok(
      ai.includes("BossAbility.SHELL_ARMOR"),
      "shell-armor status read stays — do not undo it",
    );
    assert.equal(
      ai.includes("BossAbility.LARVAE_EXPLODE"),
      false,
      "useBossAI never decides LARVAE_EXPLODE",
    );
    assert.equal(ai.includes("applyLarvaeExplode"), false);
    assert.ok(
      ai.includes("handled on player movement side"),
      "decide still defers explode to the missing WX walk path",
    );

    const wx = wxSource();
    assert.equal(
      wx.includes("larvae"),
      false,
      "WX never reads bossState.larvae on walk / leftover-walk",
    );
    assert.equal(wx.includes("LARVAE_EXPLODE"), false);
    assert.equal(wx.includes("applyLarvaeExplode"), false);
    assert.equal(wx.includes("Larva Venom"), false);
    assert.equal(wx.includes("executeLarvaeExplodeWalk"), false);
    assert.ok(
      wx.includes("if (res?.dotApplied)"),
      "boss-turn dotApplied writer stays — do not undo it",
    );
    assert.ok(
      wx.includes("const applyBattleWalkHazards = useCallback("),
      "walk-hazard helper still exists (thorn / rift only)",
    );

    const hazards = wx.slice(
      wx.indexOf("const applyBattleWalkHazards = useCallback("),
      wx.indexOf("const applyControlledSummonWalk = useCallback("),
    );
    assert.ok(hazards.includes("isThornedGround"));
    assert.ok(hazards.includes("isVoidRift"));
    assert.equal(hazards.includes("larva"), false);
    assert.equal(hazards.includes("LARVAE"), false);

    const cast = castHelpersSource();
    assert.ok(
      cast.includes("shellArmorActive"),
      "Shell Armor larvae.length halve stays — not this explode DoT",
    );
    assert.equal(cast.includes("Larva Venom"), false);
    assert.equal(cast.includes("LARVAE_EXPLODE"), false);

    const setup = battleSetupSource();
    assert.ok(setup.includes("battleWalkHazardDamages"));
    assert.equal(setup.includes("Larva Venom"), false);
    assert.equal(setup.includes("LARVAE_EXPLODE"), false);
  });
});

describe("advertised tile match vs live DoT", () => {
  it("decides and executes 5×3 on a matched larva; live walk applies none", () => {
    assert.equal(isLarvaContactTile(larvaAt55, 5, 5), true);
    assert.equal(isLarvaContactTile(larvaAt55, 4, 5), false);
    assert.deepEqual(
      advertisedLarvaVenomDot({
        larvae: larvaAt55,
        destX: 5,
        destY: 5,
      }),
      {
        damage: 5,
        duration: 3,
        type: "poison",
        effectName: "Larva Venom",
        iconEmoji: "💚",
      },
    );
    assert.equal(
      advertisedLarvaVenomDot({
        larvae: larvaAt55,
        destX: 4,
        destY: 5,
      }),
      null,
    );

    const decided = shouldDecideLarvaeExplodeWalk({
      larvae: larvaAt55,
      destX: 5,
      destY: 5,
    });
    const executable = canExecuteLarvaeExplodeWalk({
      larvae: larvaAt55,
      destX: 5,
      destY: 5,
      playerHp: 100,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);

    const liveDots = liveWxLarvaeExplodeWalkDots();
    assert.deepEqual(liveDots, []);

    const next = executeLarvaeExplodeWalk({
      larvae: larvaAt55,
      destX: 5,
      destY: 5,
      playerHp: 100,
    });
    assert.deepEqual(next, {
      triggered: true,
      dotApplied: [
        {
          damage: 5,
          duration: 3,
          type: "poison",
          effectName: "Larva Venom",
          iconEmoji: "💚",
        },
      ],
      newPlayerHp: 100,
      remainingLarvae: [],
    });
    assert.notEqual(
      next.dotApplied.length,
      liveDots.length,
      "advertised Larva Venom vs live empty walk DoT",
    );
    assert.equal(
      next.newPlayerHp,
      100,
      "contact is a DoT, not Glyph Trap 15 / Void 20 instant HP",
    );
  });

  it("misses non-larva tiles, phase-1 unarmed, and stays off glyph 15 / Poison Arrow 4", () => {
    assert.deepEqual(
      executeLarvaeExplodeWalk({
        larvae: larvaAt55,
        destX: 1,
        destY: 1,
        playerHp: 100,
      }),
      {
        triggered: false,
        dotApplied: [],
        newPlayerHp: 100,
        remainingLarvae: larvaAt55,
      },
    );

    assert.equal(
      shouldDecideLarvaeExplodeWalk({
        larvae: larvaAt55,
        destX: 5,
        destY: 5,
        explodeArmed: false,
      }),
      false,
      "phase-1 spawn + shell must not mint this explode",
    );
    assert.deepEqual(
      executeLarvaeExplodeWalk({
        larvae: larvaAt55,
        destX: 5,
        destY: 5,
        playerHp: 100,
        explodeArmed: false,
      }),
      {
        triggered: false,
        dotApplied: [],
        newPlayerHp: 100,
        remainingLarvae: larvaAt55,
      },
    );

    assert.equal(
      canExecuteLarvaeExplodeWalk({
        larvae: larvaAt55,
        destX: 5,
        destY: 5,
        playerHp: 0,
      }),
      false,
    );
    assert.notEqual(LARVA_VENOM_DAMAGE_PER_TURN, GLYPH_TRAP_DAMAGE);
    assert.notEqual(
      LARVA_VENOM_DAMAGE_PER_TURN,
      STARTER_POISON_DAMAGE_PER_TURN,
    );
    const crit = executeLarvaeExplodeWalk({
      larvae: larvaAt55,
      destX: 5,
      destY: 5,
      playerHp: 100,
    });
    assert.equal(crit.dotApplied[0]?.damage, 5);
    assert.equal("damageToPlayer" in crit, false, "#1216 owns glyph Strike 15");
    assert.equal("remaining" in crit, false, "#1206 owns Inferno remaining");
    assert.equal(
      "failChance" in crit,
      false,
      "#1210 owns Arcane Overflow FAIL",
    );
  });
});
