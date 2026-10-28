/**
 * Combat action parity: Enthroned Void phantom contact atk 5 is discarded
 * (WX atk 0 / damage 35) and pack fallback melee Crush-scales by level.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PHANTOM_CONTACT_ATK,
  PHANTOM_CONTACT_BOSS_ID,
  PHANTOM_CONTACT_BOSS_INIT,
  PHANTOM_CONTACT_CRUSH_DAMAGE,
  PHANTOM_CONTACT_CRUSH_ID,
  PHANTOM_CONTACT_FIRE_BOLT_DAMAGE,
  PHANTOM_SPAWN_ID_PREFIX,
  canExecutePhantomContactAtk,
  executePhantomContactAtk,
  isVoidPhantomMinionId,
  liveWxPhantomMeleeFallback,
  liveWxPhantomSpawnMappedAtk,
  liveWxPhantomSpawnMappedDamage,
  liveWxPhantomSpawnMappedLevel,
  phantomContactAdvertisedSoak,
  phantomContactHighlightedIsExecutable,
  resolvePhantomContactCommittedAtk,
  shouldDecidePhantomContactAtk,
} from "./bossPhantomContactAtk.ts";

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

function applyPhantomSpawnBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("/** PHANTOM_SPAWN — Enthroned Void");
  assert.ok(start >= 0, "applyPhantomSpawn is present");
  const end = src.indexOf("function applyApDrainPassive(", start);
  assert.ok(end > start, "AP Drain still follows Phantom Spawn");
  return src.slice(start, end);
}

function enthronedVoidDefaultsBlock(): string {
  const src = readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
  const start = src.indexOf('id: "enthroned_void"');
  assert.ok(start >= 0, "Enthroned Void default config is present");
  const end = src.indexOf("];", start);
  assert.ok(end > start, "boss defaults array still closes after Void");
  return src.slice(start, end);
}

function phantomReady() {
  return {
    minionId: `${PHANTOM_SPAWN_ID_PREFIX}abc123`,
    advertisedAtk: PHANTOM_CONTACT_ATK,
    currentHp: 100,
    playerRes: 0,
    targetIsPlayer: true,
    adjacent: true,
  };
}

describe("Enthroned Void phantom contact atk 5", () => {
  it("catalog Enthroned Void init 18 and advertised atk 5 stay distinct from formula 35 / Crush 38", () => {
    const voidBoss = enthronedVoidDefaultsBlock();
    assert.ok(voidBoss.includes(`id: "${PHANTOM_CONTACT_BOSS_ID}"`));
    assert.ok(voidBoss.includes("init: 18"));
    assert.ok(voidBoss.includes("atk: 35"));
    assert.equal(PHANTOM_CONTACT_BOSS_INIT, 18);

    const level = liveWxPhantomSpawnMappedLevel(PHANTOM_CONTACT_BOSS_INIT);
    assert.equal(level, 16);
    assert.equal(liveWxPhantomSpawnMappedDamage(PHANTOM_CONTACT_BOSS_INIT), 35);
    assert.equal(liveWxPhantomSpawnMappedAtk(), 0);
    assert.equal(
      liveWxPhantomMeleeFallback(PHANTOM_CONTACT_CRUSH_DAMAGE, level),
      38,
    );
    assert.equal(
      liveWxPhantomMeleeFallback(PHANTOM_CONTACT_FIRE_BOLT_DAMAGE, level),
      26,
    );
    assert.equal(phantomContactAdvertisedSoak(PHANTOM_CONTACT_ATK, 0), 5);
    assert.notEqual(PHANTOM_CONTACT_ATK, 35);
    assert.notEqual(PHANTOM_CONTACT_ATK, 38);
  });

  it("live spawn writes atk 0 / formula damage; melee Crush never reads enemy.atk", () => {
    const spawn = applyPhantomSpawnBlock();
    assert.ok(spawn.includes("`void_phantom_"));
    assert.ok(spawn.includes("deal 5 damage on contact"));
    assert.ok(spawn.includes("atk: 5"));
    assert.ok(spawn.includes("ap: 2"));
    assert.ok(spawn.includes('pieceType: "pawn"'));

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
      "spawn commit still never reads advertised s.hp — leftover of #1152",
    );
    assert.ok(commit.includes("n[m.id] = 20"));

    const melee = wxPackMeleeBlock();
    assert.ok(melee.includes(PHANTOM_CONTACT_CRUSH_ID));
    assert.ok(melee.includes("damage: 12"));
    assert.ok(melee.includes("fb.damage * Math.max(1, enemy.level / 5)"));
    assert.equal(melee.includes("enemy.atk"), false);
    assert.equal(melee.includes("enemy.damage"), false);
    assert.equal(wxSource().includes("void_phantom_"), false);
    assert.equal(wxSource().includes("executePhantomContactAtk"), false);
    assert.equal(
      wxSource().includes("resolvePhantomContactCommittedAtk"),
      false,
    );
  });

  it("executes contact 5 at RES 0 as HP 95; live Crush leaves 62", () => {
    const ready = phantomReady();
    const decided = shouldDecidePhantomContactAtk(ready);
    const executable = canExecutePhantomContactAtk(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      phantomContactHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executePhantomContactAtk(ready);
    assert.deepEqual(next, { damage: 5, hpAfter: 95, playerDied: false });
    assert.equal(
      resolvePhantomContactCommittedAtk({
        minionId: ready.minionId,
        advertisedAtk: PHANTOM_CONTACT_ATK,
      }),
      5,
    );

    const liveCrush = liveWxPhantomMeleeFallback(
      PHANTOM_CONTACT_CRUSH_DAMAGE,
      liveWxPhantomSpawnMappedLevel(PHANTOM_CONTACT_BOSS_INIT),
    );
    assert.equal(liveCrush, 38);
    assert.equal(100 - liveCrush, 62);
    assert.notEqual(next?.damage, liveCrush);

    assert.deepEqual(
      executePhantomContactAtk({
        ...ready,
        currentHp: 5,
      }),
      { damage: 5, hpAfter: 0, playerDied: true },
    );

    assert.equal(phantomContactAdvertisedSoak(5, 50), 3);
    assert.deepEqual(
      executePhantomContactAtk({
        ...ready,
        playerRes: 50,
      }),
      { damage: 3, hpAfter: 97, playerDied: false },
    );
  });

  it("cannot stamp summon-target, non-adjacent, ghost/scroll/split, or sibling leftover payloads", () => {
    const ready = phantomReady();
    assert.equal(
      executePhantomContactAtk({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target melee uses enemyTakesDamage — leftover of #1252 skip",
    );
    assert.equal(
      executePhantomContactAtk({
        ...ready,
        adjacent: false,
      }),
      null,
      "occupancy blocks walking onto the pawn; contact is adjacent melee",
    );
    assert.equal(
      executePhantomContactAtk({
        ...ready,
        minionId: "ghost_pale_archbishop_1",
      }),
      null,
      "ghost king atk 5 leftover of #1220",
    );
    assert.equal(
      resolvePhantomContactCommittedAtk({
        minionId: "ghost_pale_archbishop_1",
        advertisedAtk: 5,
      }),
      null,
    );
    assert.equal(
      resolvePhantomContactCommittedAtk({
        minionId: "scroll_summon_1",
        advertisedAtk: 8,
      }),
      null,
      "scroll bishop leftover of #1113",
    );
    assert.equal(
      resolvePhantomContactCommittedAtk({
        minionId: "split_rook_0_1",
        advertisedAtk: 28,
      }),
      null,
      "split-rook leftover of #1231",
    );
    assert.equal(isVoidPhantomMinionId("larva_abc"), false);
    assert.equal(
      executePhantomContactAtk({
        ...ready,
        advertisedAtk: 0,
      }),
      null,
    );

    const crit = executePhantomContactAtk(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1152 owns phantom HP stamp");
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
      phantomContactHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off void_phantom_ id prefix and atk metadata, not announce copy", () => {
    assert.equal(PHANTOM_SPAWN_ID_PREFIX, "void_phantom_");
    assert.equal(PHANTOM_CONTACT_ATK, 5);
    assert.equal(
      shouldDecidePhantomContactAtk(phantomReady()),
      canExecutePhantomContactAtk(phantomReady()),
    );
    assert.equal(isVoidPhantomMinionId(`${PHANTOM_SPAWN_ID_PREFIX}x`), true);
    assert.equal(isVoidPhantomMinionId("Minion"), false);
  });
});
