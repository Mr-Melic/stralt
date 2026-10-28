/**
 * Combat action parity: boss kit damage/drain soak skips advertised SR.
 * Live WX kit apply uses playerTakesDamage (RES only).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  BOSS_KIT_SPELL_SR_FIRE_DAMAGE,
  BOSS_KIT_SPELL_SR_FIRE_RANGE,
  BOSS_KIT_SPELL_SR_FIRE_SPELL_ID,
  BOSS_KIT_SPELL_SR_STAT,
  bossKitSpellAdvertisedSoak,
  bossKitSpellSrSoakHighlightedIsExecutable,
  canExecuteBossKitSpellSrSoak,
  executeBossKitSpellSrSoak,
  liveWxBossKitSpellReadsSr,
  liveWxBossKitSpellSoak,
  liveWxBossKitSpellUsesPackSpSoak,
  shouldDecideBossKitSpellSrSoak,
} from "./bossKitSpellSrSoak.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function useBossAiSource(): string {
  return readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
}

function bossKitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function wxBossKitDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Damage / drain → playerTakesDamage (mirror WX 13520-13646).",
  );
  assert.ok(start >= 0, "live boss kit damage arm is present");
  const end = wx.indexOf(
    "// Heal → updateCombatant on boss (store + strip).",
    start,
  );
  assert.ok(end > start, "heal arm still follows boss kit damage");
  return wx.slice(start, end);
}

function wxPackCastSoakBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const spellRange = Number(chosenSpell.range);");
  assert.ok(start >= 0, "live pack cast arm is present");
  const plSp = wx.indexOf("const plSpEff = isSummonTarget", start);
  assert.ok(plSp > start, "live pack cast still builds plSpEff");
  const playerHit = wx.indexOf("actualDmg = playerTakesDamage(", plSp);
  assert.ok(playerHit > plSp, "player cast still ends in playerTakesDamage");
  const cooldown = wx.indexOf(
    "if (chosenSpell.cooldown && chosenSpell.cooldown > 0)",
    playerHit,
  );
  assert.ok(cooldown > playerHit, "cooldown arm still follows the soak");
  return wx.slice(plSp, cooldown);
}

function chainLightningReady() {
  return {
    rawDamage: BOSS_KIT_SPELL_SR_FIRE_DAMAGE,
    playerSr: 50,
    playerRes: 0,
    currentHp: 100,
    targetIsPlayer: true,
    isSpell: true,
    chebyshev: 3,
    range: BOSS_KIT_SPELL_SR_FIRE_RANGE,
  };
}

describe("boss kit cast SR soak (RES-only playerTakesDamage)", () => {
  it("catalog Chain Lightning 20 and starting champion keep SR ≠ SP", () => {
    const blast = starterSpells.find(
      (s) => s.id === BOSS_KIT_SPELL_SR_FIRE_SPELL_ID,
    );
    assert.ok(blast);
    assert.equal(Number(blast?.damage), BOSS_KIT_SPELL_SR_FIRE_DAMAGE);
    assert.equal(Number(blast?.range), BOSS_KIT_SPELL_SR_FIRE_RANGE);
    assert.equal(blast?.hitsMultiple, true);
    assert.equal(blast?.bounces, 2);
    assert.equal(BOSS_KIT_SPELL_SR_STAT, "sr");

    const start = startingChampionStats();
    assert.equal(Number(start.sp), 8);
    assert.equal(Number(start.sr), 5);
    assert.equal(Number(start.res), 10);
    assert.notEqual(Number(start.sp), Number(start.sr));

    assert.equal(
      bossKitSpellAdvertisedSoak(20, 50, 0, true),
      10,
      "advertised SR 50 halves Chain Lightning 20",
    );
    assert.equal(
      liveWxBossKitSpellSoak(20, 0),
      20,
      "live RES 0 leaves the full packet",
    );
    assert.equal(liveWxBossKitSpellReadsSr(), false);
    assert.equal(liveWxBossKitSpellUsesPackSpSoak(), false);

    const kits = bossKitsSource();
    for (const bossId of [
      "void_grandmaster",
      "starborn_queen",
      "lord_of_static",
      "mirror_sovereign",
    ]) {
      const heading = kits.indexOf(`${bossId}: {`);
      assert.ok(heading >= 0, `${bossId} kit is present`);
      const phase1 = kits.indexOf("phase1SpellIds:", heading);
      assert.ok(phase1 > heading, `${bossId} has phase1SpellIds`);
      const firstIdLine = kits.slice(phase1, phase1 + 80);
      assert.ok(
        firstIdLine.includes(`"${BOSS_KIT_SPELL_SR_FIRE_SPELL_ID}"`),
        `${bossId} phase 1 first-id is Chain Lightning`,
      );
    }
  });

  it("live kit damage reads raw Number(damage); pack SP soak stays #1257 leftover", () => {
    const kit = wxBossKitDamageBlock();
    assert.ok(kit.includes("playerTakesDamage("));
    assert.ok(
      kit.includes("const bRawDmg = Math.max(1, Math.round(bSpellDmg))"),
    );
    assert.ok(
      kit.includes("playerTakesDamage(\n                      bRawDmg,"),
    );
    assert.equal(
      kit.includes("characterStats.sr"),
      false,
      "kit damage arm still never reads characterStats.sr",
    );
    assert.equal(
      kit.includes("plSpEff"),
      false,
      "kit damage does not share the pack SP soak arm",
    );
    assert.equal(kit.includes("getStatModifier"), false);

    const pack = wxPackCastSoakBlock();
    assert.ok(pack.includes("characterStats.sp"));
    assert.ok(pack.includes("characterStats.res"));
    assert.equal(
      pack.includes("characterStats.sr"),
      false,
      "pack cast arm still never reads characterStats.sr — leftover of #1257",
    );

    const wx = wxSource();
    assert.equal(wx.includes("executeBossKitSpellSrSoak"), false);
    assert.equal(wx.includes("bossKitSpellAdvertisedSoak"), false);

    const ai = useBossAiSource();
    assert.ok(ai.includes("new Map<string, number>()"));
    assert.equal(
      ai.includes("enemyCooldownsRef"),
      false,
      "pickBossKitSpell still receives an empty cooldown Map",
    );
  });

  it("executes Chain Lightning 20 at SR 50 as 10; live RES-only leaves 20", () => {
    const ready = chainLightningReady();
    const decided = shouldDecideBossKitSpellSrSoak(ready);
    const executable = canExecuteBossKitSpellSrSoak(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitSpellSrSoakHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeBossKitSpellSrSoak(ready);
    assert.deepEqual(next, { damage: 10, hpAfter: 90, playerDied: false });
    assert.equal(
      liveWxBossKitSpellSoak(ready.rawDamage, ready.playerRes),
      20,
      "live RES 0 soak leaves 20 — advertised SR 50 is 10",
    );
    assert.notEqual(next?.damage, 20);

    assert.deepEqual(
      executeBossKitSpellSrSoak({
        ...ready,
        currentHp: 10,
      }),
      { damage: 10, hpAfter: 0, playerDied: true },
    );

    // Starting champion SR 5 / RES 10 vs raw 20:
    // advertised SR×RES once = 20 * 0.95 * 0.9 = 17.1 → 17
    // kit live RES only = round(20 * 0.9) = 18
    // pack live SP 8 × RES then RES = 15 (#1257 — not this leftover)
    assert.equal(bossKitSpellAdvertisedSoak(20, 5, 10, true), 17);
    assert.equal(liveWxBossKitSpellSoak(20, 10), 18);
  });

  it("cannot stamp out-of-range, physical, summon-target, or sibling leftover payloads", () => {
    const ready = chainLightningReady();
    assert.equal(
      executeBossKitSpellSrSoak({
        ...ready,
        chebyshev: 5,
      }),
      null,
      "Chebyshev 5 is #888 kit range skip, not this SR soak",
    );
    assert.equal(
      executeBossKitSpellSrSoak({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "kit summon short-circuit never reaches the damage arm",
    );
    assert.equal(
      executeBossKitSpellSrSoak({
        ...ready,
        isSpell: false,
      }),
      null,
      "physical_attack first-id RES-only soak is correct — leave",
    );
    assert.equal(
      executeBossKitSpellSrSoak({
        ...ready,
        rawDamage: 0,
      }),
      null,
      "Inferno damage 0 never enters the kit damage arm",
    );
    assert.equal(
      executeBossKitSpellSrSoak({
        ...ready,
        rawDamage: -8,
      }),
      null,
    );

    const crit = executeBossKitSpellSrSoak(ready);
    assert.ok(crit);
    assert.equal("chc" in crit, false, "#1104 owns kit CHC");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(
      "glass" in crit,
      false,
      "#1160 / #1252 own Glass Realm packets",
    );
    assert.equal("bounces" in crit, false, "#868 owns kit bounce");
    assert.equal(
      "apDrainLastTurn" in crit,
      false,
      "#1234 owns Enthroned Void last-turn AP stamp",
    );
    assert.equal(
      bossKitSpellSrSoakHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off sr metadata, not announce copy or Strike physical soak", () => {
    assert.equal(BOSS_KIT_SPELL_SR_STAT, "sr");
    assert.equal(
      shouldDecideBossKitSpellSrSoak(chainLightningReady()),
      canExecuteBossKitSpellSrSoak(chainLightningReady()),
    );
    assert.equal(bossKitSpellAdvertisedSoak(20, 50, 50, false), 10);
    assert.equal(
      bossKitSpellAdvertisedSoak(20, 50, 50, true),
      5,
      "spell soak multiplies SR and RES once",
    );
  });
});
