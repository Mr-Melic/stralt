/**
 * Combat action parity: Fetid Rook split-rook atk 25 is discarded
 * (WX atk 0 / damage 13) and pack fallback melee Crush-scales by level.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SPLIT_ROOK_ATK,
  SPLIT_ROOK_ATK_AP_LEFTOVER,
  SPLIT_ROOK_ATK_BOSS_ATK,
  SPLIT_ROOK_ATK_BOSS_ID,
  SPLIT_ROOK_ATK_BOSS_INIT,
  SPLIT_ROOK_ATK_CRUSH_DAMAGE,
  SPLIT_ROOK_ATK_CRUSH_ID,
  SPLIT_ROOK_ATK_FIRE_BOLT_DAMAGE,
  SPLIT_ROOK_ATK_ID_PREFIX,
  SPLIT_ROOK_ATK_KIT_FIRST_SPELL,
  SPLIT_ROOK_ATK_PIECE,
  SPLIT_ROOK_ATK_SCALE,
  canExecuteSplitRookAtk,
  executeSplitRookAtk,
  isSplitRookAtkMinionId,
  liveWxSplitRookMappedAtk,
  liveWxSplitRookMappedDamage,
  liveWxSplitRookMappedLevel,
  liveWxSplitRookMeleeFallback,
  resolveSplitRookCommittedAtk,
  shouldDecideSplitRookAtk,
  splitRookAdvertisedAtkSoak,
  splitRookAtkHighlightedIsExecutable,
} from "./bossSplitRooksAtkCommit.ts";

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

function applySplitRooksBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function applySplitRooks(");
  assert.ok(start >= 0, "applySplitRooks is present");
  const end = src.indexOf("function applyAdvancePerTurn(", start);
  assert.ok(end > start, "Advance still follows Split Rooks");
  return src.slice(start, end);
}

function fetidRookDefaultsBlock(): string {
  const src = readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
  const start = src.indexOf('id: "fetid_rook"');
  assert.ok(start >= 0, "Fetid Rook default config is present");
  const end = src.indexOf('id: "eternal_pawn_king"', start);
  assert.ok(end > start, "Eternal Pawn still follows Fetid Rook");
  return src.slice(start, end);
}

function splitReady() {
  return {
    minionId: `${SPLIT_ROOK_ATK_ID_PREFIX}0_1`,
    advertisedAtk: SPLIT_ROOK_ATK,
    currentHp: 100,
    playerRes: 0,
    targetIsPlayer: true,
    adjacent: true,
  };
}

describe("Fetid Rook split-rook atk 25", () => {
  it("catalog Fetid Rook init 7 / atk 32 stay distinct from formula 13 / Crush 12", () => {
    const fetid = fetidRookDefaultsBlock();
    assert.ok(fetid.includes(`id: "${SPLIT_ROOK_ATK_BOSS_ID}"`));
    assert.ok(fetid.includes("init: 7"));
    assert.ok(fetid.includes("atk: 32"));
    assert.ok(fetid.includes("ap: 5"));
    assert.ok(fetid.includes("BossAbility.SPLIT_ROOKS"));
    assert.equal(SPLIT_ROOK_ATK_BOSS_INIT, 7);
    assert.equal(SPLIT_ROOK_ATK_BOSS_ATK, 32);
    assert.equal(
      Math.floor(SPLIT_ROOK_ATK_BOSS_ATK * SPLIT_ROOK_ATK_SCALE),
      25,
    );
    assert.equal(SPLIT_ROOK_ATK, 25);
    assert.notEqual(SPLIT_ROOK_ATK, 32);

    const level = liveWxSplitRookMappedLevel(SPLIT_ROOK_ATK_BOSS_INIT);
    assert.equal(level, 5);
    assert.equal(liveWxSplitRookMappedDamage(SPLIT_ROOK_ATK_BOSS_INIT), 13);
    assert.equal(liveWxSplitRookMappedAtk(), 0);
    assert.equal(
      liveWxSplitRookMeleeFallback(SPLIT_ROOK_ATK_CRUSH_DAMAGE, level),
      12,
    );
    assert.equal(
      liveWxSplitRookMeleeFallback(SPLIT_ROOK_ATK_FIRE_BOLT_DAMAGE, level),
      8,
    );
    assert.equal(splitRookAdvertisedAtkSoak(SPLIT_ROOK_ATK, 0), 25);
    assert.notEqual(SPLIT_ROOK_ATK, 13);
    assert.notEqual(SPLIT_ROOK_ATK, 12);
    assert.notEqual(SPLIT_ROOK_ATK, 8);
    assert.notEqual(SPLIT_ROOK_ATK, 5);
  });

  it("live spawn writes atk 0 / formula damage; melee Crush never reads enemy.atk", () => {
    const spawn = applySplitRooksBlock();
    assert.ok(spawn.includes("`split_rook_${i}_"));
    assert.ok(spawn.includes("atk: Math.floor(params.bossEntry.atk * 0.8)"));
    assert.ok(spawn.includes("ap: params.bossEntry.ap"));
    assert.ok(spawn.includes('pieceType: "rook"'));
    assert.ok(spawn.includes("Math.ceil(params.bossEntry.hp / 2)"));
    assert.equal(SPLIT_ROOK_ATK_PIECE, "rook");
    assert.equal(SPLIT_ROOK_ATK_AP_LEFTOVER, 5);

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
      "spawn commit still never reads advertised s.hp — leftover of #1231",
    );
    assert.ok(commit.includes("n[m.id] = 20"));

    const melee = wxPackMeleeBlock();
    assert.ok(melee.includes(SPLIT_ROOK_ATK_CRUSH_ID));
    assert.ok(melee.includes("damage: 12"));
    assert.ok(melee.includes("fb.damage * Math.max(1, enemy.level / 5)"));
    assert.equal(melee.includes("enemy.atk"), false);
    assert.equal(melee.includes("enemy.damage"), false);
    assert.equal(wxSource().includes("executeSplitRookAtk"), false);
    assert.equal(wxSource().includes("resolveSplitRookCommittedAtk"), false);
  });

  it("executes atk 25 at RES 0 as HP 75; live Crush leaves 88", () => {
    const ready = splitReady();
    const decided = shouldDecideSplitRookAtk(ready);
    const executable = canExecuteSplitRookAtk(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      splitRookAtkHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeSplitRookAtk(ready);
    assert.deepEqual(next, { damage: 25, hpAfter: 75, playerDied: false });
    assert.equal(
      resolveSplitRookCommittedAtk({
        minionId: ready.minionId,
        advertisedAtk: SPLIT_ROOK_ATK,
      }),
      25,
    );

    const liveCrush = liveWxSplitRookMeleeFallback(
      SPLIT_ROOK_ATK_CRUSH_DAMAGE,
      liveWxSplitRookMappedLevel(SPLIT_ROOK_ATK_BOSS_INIT),
    );
    assert.equal(liveCrush, 12);
    assert.equal(100 - liveCrush, 88);
    assert.notEqual(next?.damage, liveCrush);

    const liveBolt = liveWxSplitRookMeleeFallback(
      SPLIT_ROOK_ATK_FIRE_BOLT_DAMAGE,
      liveWxSplitRookMappedLevel(SPLIT_ROOK_ATK_BOSS_INIT),
    );
    assert.equal(liveBolt, 8);
    assert.notEqual(next?.damage, liveBolt);

    assert.deepEqual(
      executeSplitRookAtk({
        ...ready,
        currentHp: 20,
      }),
      { damage: 25, hpAfter: 0, playerDied: true },
      "advertised 25 kills a 20 HP player; live Crush 12 would leave 8",
    );

    assert.equal(splitRookAdvertisedAtkSoak(25, 50), 13);
    assert.deepEqual(
      executeSplitRookAtk({
        ...ready,
        playerRes: 50,
      }),
      { damage: 13, hpAfter: 87, playerDied: false },
    );
  });

  it("cannot stamp summon-target, non-adjacent, ghost/phantom/scroll, or sibling leftover payloads", () => {
    const ready = splitReady();
    assert.equal(
      executeSplitRookAtk({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target melee uses enemyTakesDamage — leftover of #1252 skip",
    );
    assert.equal(
      executeSplitRookAtk({
        ...ready,
        adjacent: false,
      }),
      null,
      "occupancy blocks walking onto the rook; the hit is adjacent melee",
    );
    assert.equal(
      executeSplitRookAtk({
        ...ready,
        minionId: "ghost_pale_archbishop_1",
      }),
      null,
      "ghost king contact atk 5 leftover of #1264",
    );
    assert.equal(
      resolveSplitRookCommittedAtk({
        minionId: "ghost_pale_archbishop_1",
        advertisedAtk: 5,
      }),
      null,
    );
    assert.equal(
      resolveSplitRookCommittedAtk({
        minionId: "void_phantom_abc123",
        advertisedAtk: 5,
      }),
      null,
      "phantom pawn contact atk 5 leftover of #1259",
    );
    assert.equal(
      resolveSplitRookCommittedAtk({
        minionId: "scroll_pale_archivist_1",
        advertisedAtk: 8,
      }),
      null,
      "scroll bishop leftover of #1113",
    );
    assert.equal(isSplitRookAtkMinionId("minion_countess_0"), false);
    assert.equal(
      executeSplitRookAtk({
        ...ready,
        advertisedAtk: 0,
      }),
      null,
    );

    const crit = executeSplitRookAtk(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1231 owns split HP stamp");
    assert.equal("ap" in crit, false, "split ap 5 leftover stays unrestored");
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
      "#1261 owns kit-first Venom vs Split",
    );
    assert.equal(
      splitRookAtkHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off split_rook_ id prefix and atk metadata, not announce copy", () => {
    assert.equal(SPLIT_ROOK_ATK_ID_PREFIX, "split_rook_");
    assert.equal(SPLIT_ROOK_ATK, 25);
    assert.equal(SPLIT_ROOK_ATK_KIT_FIRST_SPELL, "spell-venom-strike");
    assert.equal(
      shouldDecideSplitRookAtk(splitReady()),
      canExecuteSplitRookAtk(splitReady()),
    );
    assert.equal(
      isSplitRookAtkMinionId(`${SPLIT_ROOK_ATK_ID_PREFIX}0_1`),
      true,
    );
    assert.equal(isSplitRookAtkMinionId("Minion"), false);
    assert.equal(isSplitRookAtkMinionId("ghost_x"), false);
    assert.equal(isSplitRookAtkMinionId("void_phantom_x"), false);
  });
});
