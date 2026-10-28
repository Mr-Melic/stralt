/**
 * Combat action parity: Pale Archivist scroll-summon atk 8 is discarded
 * (WX atk 0 / damage 19) and pack fallback melee Crush-scales by level.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SCROLL_SUMMON_ATK_AP_LEFTOVER,
  SCROLL_SUMMON_ATK_BOSS_ID,
  SCROLL_SUMMON_ATK_BOSS_INIT,
  SCROLL_SUMMON_ATK_CRUSH_DAMAGE,
  SCROLL_SUMMON_ATK_CRUSH_ID,
  SCROLL_SUMMON_ATK_FIRE_BOLT_DAMAGE,
  SCROLL_SUMMON_ATK_ID_PREFIX,
  SCROLL_SUMMON_ATK_PACKET,
  SCROLL_SUMMON_ATK_PIECE,
  canExecuteScrollSummonAtk,
  executeScrollSummonAtk,
  isScrollSummonAtkMinionId,
  liveWxScrollSummonMappedAtk,
  liveWxScrollSummonMappedDamage,
  liveWxScrollSummonMappedLevel,
  liveWxScrollSummonMeleeFallback,
  resolveScrollSummonCommittedAtk,
  scrollSummonAdvertisedAtkSoak,
  scrollSummonAtkHighlightedIsExecutable,
  shouldDecideScrollSummonAtk,
} from "./bossScrollSummonAtkCommit.ts";

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

function applyScrollSummonBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function applyScrollSummon(");
  assert.ok(start >= 0, "applyScrollSummon is present");
  const end = src.indexOf("function applyGlyphTrap(", start);
  assert.ok(end > start, "Glyph Trap still follows Scroll Summon");
  return src.slice(start, end);
}

function paleArchivistDefaultsBlock(): string {
  const src = readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
  const start = src.indexOf('id: "pale_archivist"');
  assert.ok(start >= 0, "Pale Archivist default config is present");
  const end = src.indexOf('id: "twin_monarchs"', start);
  assert.ok(end > start, "Twin Monarchs still follows Pale Archivist");
  return src.slice(start, end);
}

function scrollReady() {
  return {
    minionId: `${SCROLL_SUMMON_ATK_ID_PREFIX}pale_archivist_1`,
    advertisedAtk: SCROLL_SUMMON_ATK_PACKET,
    currentHp: 100,
    playerRes: 0,
    targetIsPlayer: true,
    adjacent: true,
  };
}

describe("Pale Archivist scroll-summon atk 8", () => {
  it("catalog Pale Archivist init 10 and advertised atk 8 stay distinct from formula 19 / Crush 19", () => {
    const archivist = paleArchivistDefaultsBlock();
    assert.ok(archivist.includes(`id: "${SCROLL_SUMMON_ATK_BOSS_ID}"`));
    assert.ok(archivist.includes("init: 10"));
    assert.ok(archivist.includes("atk: 18"));
    assert.ok(archivist.includes("BossAbility.SCROLL_SUMMON"));
    assert.equal(SCROLL_SUMMON_ATK_BOSS_INIT, 10);
    assert.notEqual(SCROLL_SUMMON_ATK_PACKET, 18);

    const level = liveWxScrollSummonMappedLevel(SCROLL_SUMMON_ATK_BOSS_INIT);
    assert.equal(level, 8);
    assert.equal(
      liveWxScrollSummonMappedDamage(SCROLL_SUMMON_ATK_BOSS_INIT),
      19,
    );
    assert.equal(liveWxScrollSummonMappedAtk(), 0);
    assert.equal(
      liveWxScrollSummonMeleeFallback(SCROLL_SUMMON_ATK_CRUSH_DAMAGE, level),
      19,
    );
    assert.equal(
      liveWxScrollSummonMeleeFallback(
        SCROLL_SUMMON_ATK_FIRE_BOLT_DAMAGE,
        level,
      ),
      13,
    );
    assert.equal(scrollSummonAdvertisedAtkSoak(SCROLL_SUMMON_ATK_PACKET, 0), 8);
    assert.notEqual(SCROLL_SUMMON_ATK_PACKET, 19);
    assert.notEqual(SCROLL_SUMMON_ATK_PACKET, 13);
  });

  it("live spawn writes atk 0 / formula damage; melee Crush never reads enemy.atk", () => {
    const spawn = applyScrollSummonBlock();
    assert.ok(spawn.includes("`scroll_${params.bossEntry.id}_"));
    assert.ok(spawn.includes("atk: 8"));
    assert.ok(spawn.includes("ap: 3"));
    assert.ok(spawn.includes('pieceType: "bishop"'));
    assert.ok(spawn.includes("hp: 30"));
    assert.equal(SCROLL_SUMMON_ATK_PIECE, "bishop");
    assert.equal(SCROLL_SUMMON_ATK_AP_LEFTOVER, 3);

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
      "spawn commit still never reads advertised s.hp — leftover of #1113",
    );
    assert.ok(commit.includes("n[m.id] = 20"));

    const melee = wxPackMeleeBlock();
    assert.ok(melee.includes(SCROLL_SUMMON_ATK_CRUSH_ID));
    assert.ok(melee.includes("damage: 12"));
    assert.ok(melee.includes("fb.damage * Math.max(1, enemy.level / 5)"));
    assert.equal(melee.includes("enemy.atk"), false);
    assert.equal(melee.includes("enemy.damage"), false);
    assert.equal(wxSource().includes("executeScrollSummonAtk"), false);
    assert.equal(wxSource().includes("resolveScrollSummonCommittedAtk"), false);
  });

  it("executes atk 8 at RES 0 as HP 92; live Crush leaves 81", () => {
    const ready = scrollReady();
    const decided = shouldDecideScrollSummonAtk(ready);
    const executable = canExecuteScrollSummonAtk(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      scrollSummonAtkHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeScrollSummonAtk(ready);
    assert.deepEqual(next, { damage: 8, hpAfter: 92, playerDied: false });
    assert.equal(
      resolveScrollSummonCommittedAtk({
        minionId: ready.minionId,
        advertisedAtk: SCROLL_SUMMON_ATK_PACKET,
      }),
      8,
    );

    const liveCrush = liveWxScrollSummonMeleeFallback(
      SCROLL_SUMMON_ATK_CRUSH_DAMAGE,
      liveWxScrollSummonMappedLevel(SCROLL_SUMMON_ATK_BOSS_INIT),
    );
    assert.equal(liveCrush, 19);
    assert.equal(100 - liveCrush, 81);
    assert.notEqual(next?.damage, liveCrush);

    assert.deepEqual(
      executeScrollSummonAtk({
        ...ready,
        currentHp: 19,
      }),
      { damage: 8, hpAfter: 11, playerDied: false },
    );
    assert.equal(19 - liveCrush, 0, "live Crush 19 kills a 19 HP player");

    assert.equal(scrollSummonAdvertisedAtkSoak(8, 50), 4);
    assert.deepEqual(
      executeScrollSummonAtk({
        ...ready,
        playerRes: 50,
      }),
      { damage: 4, hpAfter: 96, playerDied: false },
    );
  });

  it("cannot stamp summon-target, non-adjacent, ghost/phantom/split, or sibling leftover payloads", () => {
    const ready = scrollReady();
    assert.equal(
      executeScrollSummonAtk({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target melee uses enemyTakesDamage — leftover of #1252 skip",
    );
    assert.equal(
      executeScrollSummonAtk({
        ...ready,
        adjacent: false,
      }),
      null,
      "occupancy blocks walking onto the bishop; the hit is adjacent melee",
    );
    assert.equal(
      executeScrollSummonAtk({
        ...ready,
        minionId: "ghost_final_pawn_1",
      }),
      null,
      "ghost king atk 5 leftover of #1264",
    );
    assert.equal(
      resolveScrollSummonCommittedAtk({
        minionId: "ghost_final_pawn_1",
        advertisedAtk: 5,
      }),
      null,
    );
    assert.equal(
      resolveScrollSummonCommittedAtk({
        minionId: "void_phantom_abc123",
        advertisedAtk: 5,
      }),
      null,
      "phantom pawn contact atk 5 leftover of #1259",
    );
    assert.equal(
      resolveScrollSummonCommittedAtk({
        minionId: "split_rook_0_1",
        advertisedAtk: 25,
      }),
      null,
      "split-rook leftover of #1271 / #1231",
    );
    assert.equal(isScrollSummonAtkMinionId("minion_pale_archbishop_0"), false);
    assert.equal(
      executeScrollSummonAtk({
        ...ready,
        advertisedAtk: 0,
      }),
      null,
    );

    const crit = executeScrollSummonAtk(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1113 owns scroll HP stamp");
    assert.equal("ap" in crit, false, "scroll ap 3 leftover stays unrestored");
    assert.equal("chc" in crit, false, "#1107 / #1104 own CHC rolls");
    assert.equal("heal" in crit, false, "#1148 owns Vampiric Ground heal");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5×");
    assert.equal(
      "glass" in crit,
      false,
      "#1160 / #1252 own Glass Realm packets",
    );
    assert.equal("glyph" in crit, false, "#1216 owns Glyph Trap 15");
    assert.equal("venom" in crit, false, "#1217 owns larva explode DoT");
    assert.equal(
      "decide" in crit,
      false,
      "#1102 owns kit-first Cursed Wound vs Scroll",
    );
    assert.equal(
      scrollSummonAtkHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off scroll_ id prefix and atk metadata, not announce copy", () => {
    assert.equal(SCROLL_SUMMON_ATK_ID_PREFIX, "scroll_");
    assert.equal(SCROLL_SUMMON_ATK_PACKET, 8);
    assert.equal(
      shouldDecideScrollSummonAtk(scrollReady()),
      canExecuteScrollSummonAtk(scrollReady()),
    );
    assert.equal(
      isScrollSummonAtkMinionId(
        `${SCROLL_SUMMON_ATK_ID_PREFIX}pale_archivist_1`,
      ),
      true,
    );
    assert.equal(isScrollSummonAtkMinionId("Minion"), false);
    assert.equal(isScrollSummonAtkMinionId("ghost_x"), false);

    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("// ── 18. Pale Archivist");
    const end = src.indexOf("// ── 19. Twin Monarchs");
    assert.ok(start >= 0 && end > start, "Pale Archivist decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const scrollIdx = body.indexOf("BossAbility.SCROLL_SUMMON");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(scrollIdx >= 0, "SCROLL_SUMMON is present");
    assert.ok(kitIdx < scrollIdx, "kit still wins the odd Scroll turn");
    assert.equal(body.includes("resolveScrollSummonCommittedAtk"), false);
    assert.equal(body.includes("executeScrollSummonAtk"), false);
  });
});
