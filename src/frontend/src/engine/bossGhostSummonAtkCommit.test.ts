/**
 * Combat action parity: Final Pawn ghost-summon atk 5 is discarded
 * (WX atk 0 / damage 7) and pack fallback melee Crush-scales by level.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GHOST_SUMMON_ATK,
  GHOST_SUMMON_ATK_AP_LEFTOVER,
  GHOST_SUMMON_ATK_BOSS_ID,
  GHOST_SUMMON_ATK_BOSS_INIT,
  GHOST_SUMMON_ATK_CRUSH_DAMAGE,
  GHOST_SUMMON_ATK_CRUSH_ID,
  GHOST_SUMMON_ATK_FIRE_BOLT_DAMAGE,
  GHOST_SUMMON_ATK_ID_PREFIX,
  GHOST_SUMMON_ATK_PIECE,
  canExecuteGhostSummonAtk,
  executeGhostSummonAtk,
  ghostSummonAdvertisedAtkSoak,
  ghostSummonAtkHighlightedIsExecutable,
  isGhostSummonAtkMinionId,
  liveWxGhostSummonMappedAtk,
  liveWxGhostSummonMappedDamage,
  liveWxGhostSummonMappedLevel,
  liveWxGhostSummonMeleeFallback,
  resolveGhostSummonCommittedAtk,
  shouldDecideGhostSummonAtk,
} from "./bossGhostSummonAtkCommit.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossSystemSource(): string {
  return readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
}

function wxSpawnCommitBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("// Spawn minions");
  assert.ok(start >= 0, "live spawn commit arm is present");
  const end = wx.indexOf("// ISSUE 4 — endsTurn flag", start);
  assert.ok(end > start, "endsTurn arm still follows spawn commit");
  return wx.slice(start, end);
}

function wxPackMeleeBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// ── Fallback melee or skip ────────────────────────────────────────",
  );
  assert.ok(start >= 0, "live pack fallback melee arm is present");
  const end = wx.indexOf('if (enemy?.family === "ember_knight")', start);
  assert.ok(end > start, "ember burn still follows pack melee");
  return wx.slice(start, end);
}

function applyGhostSummonBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function applyGhostSummon(");
  assert.ok(start >= 0, "applyGhostSummon is present");
  const end = src.indexOf("function applyResonanceShockwave(", start);
  assert.ok(end > start, "Resonance still follows Ghost Summon");
  return src.slice(start, end);
}

function finalPawnDefaultsBlock(): string {
  const src = readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
  const start = src.indexOf('id: "final_pawn"');
  assert.ok(start >= 0, "Final Pawn default config is present");
  const end = src.indexOf('id: "alabaster_fortress"', start);
  assert.ok(end > start, "Alabaster still follows Final Pawn");
  return src.slice(start, end);
}

function ghostReady() {
  return {
    minionId: `${GHOST_SUMMON_ATK_ID_PREFIX}pale_archbishop_1`,
    advertisedAtk: GHOST_SUMMON_ATK,
    currentHp: 100,
    playerRes: 0,
    targetIsPlayer: true,
    adjacent: true,
  };
}

describe("Final Pawn ghost-summon atk 5", () => {
  it("catalog Final Pawn init 4 and advertised atk 5 stay distinct from formula 7 / Crush 12", () => {
    const pawn = finalPawnDefaultsBlock();
    assert.ok(pawn.includes(`id: "${GHOST_SUMMON_ATK_BOSS_ID}"`));
    assert.ok(pawn.includes("init: 4"));
    assert.ok(pawn.includes("atk: 15"));
    assert.ok(pawn.includes("BossAbility.GHOST_SUMMON"));
    assert.equal(GHOST_SUMMON_ATK_BOSS_INIT, 4);
    assert.notEqual(GHOST_SUMMON_ATK, 15);

    const level = liveWxGhostSummonMappedLevel(GHOST_SUMMON_ATK_BOSS_INIT);
    assert.equal(level, 2);
    assert.equal(liveWxGhostSummonMappedDamage(GHOST_SUMMON_ATK_BOSS_INIT), 7);
    assert.equal(liveWxGhostSummonMappedAtk(), 0);
    assert.equal(
      liveWxGhostSummonMeleeFallback(GHOST_SUMMON_ATK_CRUSH_DAMAGE, level),
      12,
    );
    assert.equal(
      liveWxGhostSummonMeleeFallback(GHOST_SUMMON_ATK_FIRE_BOLT_DAMAGE, level),
      8,
    );
    assert.equal(ghostSummonAdvertisedAtkSoak(GHOST_SUMMON_ATK, 0), 5);
    assert.notEqual(GHOST_SUMMON_ATK, 7);
    assert.notEqual(GHOST_SUMMON_ATK, 12);
    assert.notEqual(GHOST_SUMMON_ATK, 8);
  });

  it("live spawn writes atk 0 / formula damage; melee Crush never reads enemy.atk", () => {
    const spawn = applyGhostSummonBlock();
    assert.ok(spawn.includes("`ghost_${ghostId}_"));
    assert.ok(spawn.includes("atk: 5"));
    assert.ok(spawn.includes("ap: 2"));
    assert.ok(spawn.includes('pieceType: "king"'));
    assert.ok(spawn.includes("hp: 1"));
    assert.equal(GHOST_SUMMON_ATK_PIECE, "king");
    assert.equal(GHOST_SUMMON_ATK_AP_LEFTOVER, 2);

    const commit = wxSpawnCommitBlock();
    assert.ok(commit.includes("atk: 0"));
    assert.ok(commit.includes("ap: 0"));
    assert.ok(
      commit.includes(
        "Math.max(1, currentBossConfig.baseStats.init - 2) * 2 + 3",
      ),
    );
    assert.equal(
      commit.includes("s.atk"),
      false,
      "spawn commit still never reads advertised s.atk",
    );
    assert.equal(
      commit.includes("s.hp"),
      false,
      "spawn commit still never reads advertised s.hp — leftover of #1220",
    );
    assert.ok(commit.includes("n[m.id] = 20"));

    const melee = wxPackMeleeBlock();
    assert.ok(melee.includes(GHOST_SUMMON_ATK_CRUSH_ID));
    assert.ok(melee.includes("damage: 12"));
    assert.ok(melee.includes("fb.damage * Math.max(1, enemy.level / 5)"));
    assert.equal(melee.includes("enemy.atk"), false);
    assert.equal(melee.includes("enemy.damage"), false);
    assert.equal(wxSource().includes("executeGhostSummonAtk"), false);
    assert.equal(wxSource().includes("resolveGhostSummonCommittedAtk"), false);
  });

  it("executes atk 5 at RES 0 as HP 95; live Crush leaves 88", () => {
    const ready = ghostReady();
    const decided = shouldDecideGhostSummonAtk(ready);
    const executable = canExecuteGhostSummonAtk(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      ghostSummonAtkHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeGhostSummonAtk(ready);
    assert.deepEqual(next, { damage: 5, hpAfter: 95, playerDied: false });
    assert.equal(
      resolveGhostSummonCommittedAtk({
        minionId: ready.minionId,
        advertisedAtk: GHOST_SUMMON_ATK,
      }),
      5,
    );

    const liveCrush = liveWxGhostSummonMeleeFallback(
      GHOST_SUMMON_ATK_CRUSH_DAMAGE,
      liveWxGhostSummonMappedLevel(GHOST_SUMMON_ATK_BOSS_INIT),
    );
    assert.equal(liveCrush, 12);
    assert.equal(100 - liveCrush, 88);
    assert.notEqual(next?.damage, liveCrush);

    assert.deepEqual(
      executeGhostSummonAtk({
        ...ready,
        currentHp: 5,
      }),
      { damage: 5, hpAfter: 0, playerDied: true },
    );

    assert.equal(ghostSummonAdvertisedAtkSoak(5, 50), 3);
    assert.deepEqual(
      executeGhostSummonAtk({
        ...ready,
        playerRes: 50,
      }),
      { damage: 3, hpAfter: 97, playerDied: false },
    );
  });

  it("cannot stamp summon-target, non-adjacent, phantom/scroll/split, or sibling leftover payloads", () => {
    const ready = ghostReady();
    assert.equal(
      executeGhostSummonAtk({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target melee uses enemyTakesDamage — leftover of #1252 skip",
    );
    assert.equal(
      executeGhostSummonAtk({
        ...ready,
        adjacent: false,
      }),
      null,
      "occupancy blocks walking onto the king; the hit is adjacent melee",
    );
    assert.equal(
      executeGhostSummonAtk({
        ...ready,
        minionId: "void_phantom_abc123",
      }),
      null,
      "phantom pawn contact atk 5 leftover of #1259",
    );
    assert.equal(
      resolveGhostSummonCommittedAtk({
        minionId: "void_phantom_abc123",
        advertisedAtk: 5,
      }),
      null,
    );
    assert.equal(
      resolveGhostSummonCommittedAtk({
        minionId: "scroll_pale_archivist_1",
        advertisedAtk: 8,
      }),
      null,
      "scroll bishop leftover of #1113",
    );
    assert.equal(
      resolveGhostSummonCommittedAtk({
        minionId: "split_rook_0_1",
        advertisedAtk: 28,
      }),
      null,
      "split-rook leftover of #1231",
    );
    assert.equal(isGhostSummonAtkMinionId("minion_countess_0"), false);
    assert.equal(
      executeGhostSummonAtk({
        ...ready,
        advertisedAtk: 0,
      }),
      null,
    );

    const crit = executeGhostSummonAtk(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1220 owns ghost HP stamp");
    assert.equal("ap" in crit, false, "ghost ap 2 leftover stays unrestored");
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
    assert.equal("venom" in crit, false, "#1217 owns larva explode DoT");
    assert.equal(
      "decide" in crit,
      false,
      "#1247 owns kit-first Strike vs Ghost",
    );
    assert.equal(
      ghostSummonAtkHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off ghost_ id prefix and atk metadata, not announce copy", () => {
    assert.equal(GHOST_SUMMON_ATK_ID_PREFIX, "ghost_");
    assert.equal(GHOST_SUMMON_ATK, 5);
    assert.equal(
      shouldDecideGhostSummonAtk(ghostReady()),
      canExecuteGhostSummonAtk(ghostReady()),
    );
    assert.equal(
      isGhostSummonAtkMinionId(
        `${GHOST_SUMMON_ATK_ID_PREFIX}pale_archbishop_1`,
      ),
      true,
    );
    assert.equal(isGhostSummonAtkMinionId("Minion"), false);
    assert.equal(isGhostSummonAtkMinionId("void_phantom_x"), false);
  });
});
