/**
 * Combat action parity: pack enemy cast soak uses SP instead of
 * advertised SR, then playerTakesDamage re-applies RES.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  PACK_ENEMY_SPELL_SP_STAT_LIVE,
  PACK_ENEMY_SPELL_SR_FIRE_DAMAGE,
  PACK_ENEMY_SPELL_SR_FIRE_SPELL_ID,
  PACK_ENEMY_SPELL_SR_STAT,
  canExecutePackEnemySpellSrSoak,
  executePackEnemySpellSrSoak,
  liveWxPackEnemySpellDoubleAppliesRes,
  liveWxPackEnemySpellSoak,
  liveWxPackEnemySpellUsesSpNotSr,
  packEnemySpellAdvertisedSoak,
  packEnemySpellSrSoakHighlightedIsExecutable,
  shouldDecidePackEnemySpellSrSoak,
} from "./packEnemySpellSrSoak.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
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

function chainLightningReady() {
  return {
    rawDamage: PACK_ENEMY_SPELL_SR_FIRE_DAMAGE,
    playerSr: 50,
    playerRes: 0,
    playerSp: 0,
    currentHp: 100,
    targetIsPlayer: true,
    isSpell: true,
  };
}

describe("pack enemy cast SR soak (SP misread + double RES)", () => {
  it("catalog Chain Lightning 20 and starting champion keep SR ≠ SP", () => {
    const blast = starterSpells.find(
      (s) => s.id === PACK_ENEMY_SPELL_SR_FIRE_SPELL_ID,
    );
    assert.ok(blast);
    assert.equal(Number(blast?.damage), PACK_ENEMY_SPELL_SR_FIRE_DAMAGE);
    assert.equal(PACK_ENEMY_SPELL_SR_STAT, "sr");
    assert.equal(PACK_ENEMY_SPELL_SP_STAT_LIVE, "sp");
    assert.notEqual(PACK_ENEMY_SPELL_SR_STAT, PACK_ENEMY_SPELL_SP_STAT_LIVE);

    const start = startingChampionStats();
    assert.equal(Number(start.sp), 8);
    assert.equal(Number(start.sr), 5);
    assert.notEqual(Number(start.sp), Number(start.sr));

    assert.equal(
      packEnemySpellAdvertisedSoak(20, 50, 0, true),
      10,
      "advertised SR 50 halves Chain Lightning 20",
    );
    assert.equal(
      liveWxPackEnemySpellSoak(20, 0, 0),
      20,
      "live SP 0 / RES 0 leaves the full packet",
    );
    assert.equal(liveWxPackEnemySpellUsesSpNotSr(), true);
    assert.equal(liveWxPackEnemySpellDoubleAppliesRes(), true);
  });

  it("live pack cast reads characterStats.sp; boss kit SR skip stays #1104 leftover", () => {
    const pack = wxPackCastSoakBlock();
    assert.ok(pack.includes("characterStats.sp"));
    assert.ok(
      pack.includes(
        'getStatModifier(\n                    "player",\n                    "sp"',
      ),
    );
    assert.ok(pack.includes("characterStats.res"));
    assert.equal(
      pack.includes("characterStats.sr"),
      false,
      "pack cast arm still never reads characterStats.sr",
    );
    assert.ok(pack.includes("playerTakesDamage("));
    assert.ok(
      pack.includes("dmgAC * (1 - plSpEff / 100) * (1 - plResEff / 100)"),
    );

    const boss = wxBossKitDamageBlock();
    assert.ok(boss.includes("playerTakesDamage("));
    assert.equal(
      boss.includes("characterStats.sr"),
      false,
      "boss kit damage still skips SR — leftover of #1104",
    );
    assert.equal(
      boss.includes("plSpEff"),
      false,
      "boss kit damage does not share the pack SP soak arm",
    );

    const wx = wxSource();
    assert.equal(wx.includes("executePackEnemySpellSrSoak"), false);
    assert.equal(wx.includes("packEnemySpellAdvertisedSoak"), false);
  });

  it("executes Chain Lightning 20 at SR 50 as 10; live SP misread leaves 20", () => {
    const ready = chainLightningReady();
    const decided = shouldDecidePackEnemySpellSrSoak(ready);
    const executable = canExecutePackEnemySpellSrSoak(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      packEnemySpellSrSoakHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executePackEnemySpellSrSoak(ready);
    assert.deepEqual(next, { damage: 10, hpAfter: 90, playerDied: false });
    assert.equal(
      liveWxPackEnemySpellSoak(
        ready.rawDamage,
        ready.playerSp,
        ready.playerRes,
      ),
      20,
      "live SP 0 soak leaves 20 — advertised SR 50 is 10",
    );
    assert.notEqual(next?.damage, 20);

    assert.deepEqual(
      executePackEnemySpellSrSoak({
        ...ready,
        currentHp: 10,
      }),
      { damage: 10, hpAfter: 0, playerDied: true },
    );

    // Starting champion SP 8 / SR 5 / RES 10 vs raw 20:
    // advertised SR×RES once = 20 * 0.95 * 0.9 = 17.1 → 17
    // live SP×RES then RES again = round(20*0.92*0.9)=17 then round(17*0.9)=15
    assert.equal(packEnemySpellAdvertisedSoak(20, 5, 10, true), 17);
    assert.equal(liveWxPackEnemySpellSoak(20, 8, 10), 15);
  });

  it("cannot stamp summon-target, physical packets, or sibling leftover payloads", () => {
    const ready = chainLightningReady();
    assert.equal(
      executePackEnemySpellSrSoak({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target cast uses enemyTakesDamage RES only",
    );
    assert.equal(
      executePackEnemySpellSrSoak({
        ...ready,
        isSpell: false,
      }),
      null,
      "physical / melee soak is RES-only — pack fallback melee left alone",
    );
    assert.equal(
      executePackEnemySpellSrSoak({
        ...ready,
        rawDamage: 0,
      }),
      null,
    );
    assert.equal(
      executePackEnemySpellSrSoak({
        ...ready,
        rawDamage: -8,
      }),
      null,
    );

    const crit = executePackEnemySpellSrSoak(ready);
    assert.ok(crit);
    assert.equal("chc" in crit, false, "#1107 / #1104 own CHC rolls");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(
      "glass" in crit,
      false,
      "#1160 / #1252 own Glass Realm packets",
    );
    assert.equal(
      "apDrainLastTurn" in crit,
      false,
      "#1234 owns Enthroned Void last-turn AP stamp",
    );
    assert.equal(
      packEnemySpellSrSoakHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off sr metadata, not announce copy or Strike physical soak", () => {
    assert.equal(PACK_ENEMY_SPELL_SR_STAT, "sr");
    assert.equal(
      shouldDecidePackEnemySpellSrSoak(chainLightningReady()),
      canExecutePackEnemySpellSrSoak(chainLightningReady()),
    );
    // Physical packet with RES 50 only — not this spell soak.
    assert.equal(packEnemySpellAdvertisedSoak(20, 50, 50, false), 10);
    assert.equal(
      packEnemySpellAdvertisedSoak(20, 50, 50, true),
      5,
      "spell soak multiplies SR and RES once",
    );
  });
});
