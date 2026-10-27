/**
 * Combat action parity: Pale Archivist GLYPH_TRAP advertised 15 damage
 * never commits on player Strike / Attack Nearest.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  ANCHOR_TILES_ABILITY,
  ENTHRONED_VOID_ANCHOR_STEP_DAMAGE,
  GLYPH_TRAP_ABILITY,
  GLYPH_TRAP_DAMAGE,
  GLYPH_TRAP_LOG_NEEDLE,
  INK_VEIL_ABILITY,
  PALE_ARCHIVIST_ID,
  advertisedGlyphTrapDamage,
  canExecuteGlyphTrapStrikeDamage,
  executeGlyphTrapStrikeDamage,
  isGlyphTrapAbility,
  isGlyphTrapTile,
  liveWxGlyphTrapStrikeHp,
  shouldDecideGlyphTrapStrikeDamage,
} from "./bossGlyphTrapDamageExecute.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
const STRIKE_DAMAGE = Number(strike.damage);

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

const glyphAt55 = [{ x: 5, y: 5, turnsLeft: 2 }];

describe("GLYPH_TRAP catalog / ability identity", () => {
  it("advertises 15 and is distinct from Void anchor-step 20 / Ink Veil place", () => {
    assert.equal(GLYPH_TRAP_DAMAGE, 15);
    assert.equal(ENTHRONED_VOID_ANCHOR_STEP_DAMAGE, 20);
    assert.notEqual(GLYPH_TRAP_DAMAGE, ENTHRONED_VOID_ANCHOR_STEP_DAMAGE);
    assert.equal(GLYPH_TRAP_ABILITY, "GLYPH_TRAP");
    assert.equal(INK_VEIL_ABILITY, "INK_VEIL");
    assert.equal(ANCHOR_TILES_ABILITY, "ANCHOR_TILES");
    assert.equal(isGlyphTrapAbility(GLYPH_TRAP_ABILITY), true);
    assert.equal(isGlyphTrapAbility(INK_VEIL_ABILITY), false);
    assert.equal(isGlyphTrapAbility(ANCHOR_TILES_ABILITY), false);
    assert.equal(PALE_ARCHIVIST_ID, "pale_archivist");
    assert.ok(GLYPH_TRAP_LOG_NEEDLE.includes("15 damage"));

    const types = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../types/bossTypes.ts"),
      "utf8",
    );
    assert.ok(types.includes('GLYPH_TRAP = "GLYPH_TRAP"'));
    assert.ok(types.includes('INK_VEIL = "INK_VEIL"'));
    assert.ok(types.includes('ANCHOR_TILES = "ANCHOR_TILES"'));
  });
});

describe("live wiring leftover", () => {
  it("applyGlyphTrap still returns 15 but nothing decides or strikes it", () => {
    const system = bossSystemSource();
    assert.ok(system.includes("function applyGlyphTrap("));
    assert.ok(system.includes("damageToPlayer: 15"));
    assert.ok(system.includes(GLYPH_TRAP_LOG_NEEDLE));
    assert.ok(system.includes("case BossAbility.GLYPH_TRAP:"));

    const ai = bossAiSource();
    assert.ok(
      ai.includes("BossAbility.INK_VEIL"),
      "Ink Veil place path still exists (decide leftover of #1105)",
    );
    assert.equal(
      ai.includes("BossAbility.GLYPH_TRAP"),
      false,
      "useBossAI never decides GLYPH_TRAP",
    );
    assert.equal(ai.includes("applyGlyphTrap"), false);

    const wx = wxSource();
    assert.equal(
      wx.includes("glyphedTiles"),
      false,
      "WX never reads bossState.glyphedTiles on strike / walk",
    );
    assert.equal(wx.includes("GLYPH_TRAP"), false);
    assert.equal(wx.includes("applyGlyphTrap"), false);
    assert.equal(wx.includes("executeGlyphTrapStrikeDamage"), false);
    assert.ok(
      wx.includes("if (res?.damageToPlayer && res.damageToPlayer > 0)"),
      "boss-turn damageToPlayer writer stays — do not undo it",
    );

    const cast = castHelpersSource();
    assert.equal(cast.includes("glyphedTiles"), false);
    assert.equal(cast.includes("GLYPH_TRAP"), false);
  });
});

describe("advertised tile match vs live HP", () => {
  it("decides and executes 15 on a matched glyph; live HP stays put", () => {
    assert.equal(isGlyphTrapTile(glyphAt55, 5, 5), true);
    assert.equal(isGlyphTrapTile(glyphAt55, 4, 5), false);
    assert.equal(
      advertisedGlyphTrapDamage({
        glyphedTiles: glyphAt55,
        targetX: 5,
        targetY: 5,
      }),
      15,
    );
    assert.equal(
      advertisedGlyphTrapDamage({
        glyphedTiles: glyphAt55,
        targetX: 4,
        targetY: 5,
      }),
      0,
    );

    const decided = shouldDecideGlyphTrapStrikeDamage({
      glyphedTiles: glyphAt55,
      targetX: 5,
      targetY: 5,
    });
    const executable = canExecuteGlyphTrapStrikeDamage({
      glyphedTiles: glyphAt55,
      targetX: 5,
      targetY: 5,
      playerHp: 100,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);

    const liveHp = liveWxGlyphTrapStrikeHp({ playerHp: 100 });
    assert.equal(liveHp, 100);
    assert.equal(STRIKE_DAMAGE, 10);

    const next = executeGlyphTrapStrikeDamage({
      glyphedTiles: glyphAt55,
      targetX: 5,
      targetY: 5,
      playerHp: 100,
    });
    assert.deepEqual(next, {
      triggered: true,
      damageToPlayer: 15,
      absorbed: 0,
      finalDamage: 15,
      newPlayerHp: 85,
      remainingGlyphs: [],
    });
    assert.notEqual(
      next.newPlayerHp,
      liveHp,
      "advertised 85 vs live 100 after striking the glyph tile",
    );
  });

  it("misses non-glyph tiles, respects shield absorb, and stays off Void 20", () => {
    assert.deepEqual(
      executeGlyphTrapStrikeDamage({
        glyphedTiles: glyphAt55,
        targetX: 1,
        targetY: 1,
        playerHp: 100,
      }),
      {
        triggered: false,
        damageToPlayer: 0,
        absorbed: 0,
        finalDamage: 0,
        newPlayerHp: 100,
        remainingGlyphs: glyphAt55,
      },
    );

    const shielded = executeGlyphTrapStrikeDamage({
      glyphedTiles: glyphAt55,
      targetX: 5,
      targetY: 5,
      playerHp: 100,
      shieldHp: 10,
    });
    assert.equal(shielded.triggered, true);
    assert.equal(shielded.damageToPlayer, 15);
    assert.equal(shielded.absorbed, 10);
    assert.equal(shielded.finalDamage, 5);
    assert.equal(shielded.newPlayerHp, 95);

    assert.equal(
      shouldDecideGlyphTrapStrikeDamage({
        glyphedTiles: glyphAt55,
        targetX: 5,
        targetY: 5,
        trapArmed: false,
      }),
      false,
    );
    assert.equal(
      canExecuteGlyphTrapStrikeDamage({
        glyphedTiles: glyphAt55,
        targetX: 5,
        targetY: 5,
        playerHp: 0,
      }),
      false,
    );
    assert.notEqual(GLYPH_TRAP_DAMAGE, ENTHRONED_VOID_ANCHOR_STEP_DAMAGE);
  });
});
