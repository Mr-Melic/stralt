/**
 * Combat action parity: Pale Archbishop skeleton-minion atk 8 is discarded
 * (WX atk 0 / damage 15) and pack fallback melee Crush-scales by level.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SPAWN_MINIONS_ATK_AP_LEFTOVER,
  SPAWN_MINIONS_ATK_BOSS_ID,
  SPAWN_MINIONS_ATK_BOSS_INIT,
  SPAWN_MINIONS_ATK_CRUSH_DAMAGE,
  SPAWN_MINIONS_ATK_CRUSH_ID,
  SPAWN_MINIONS_ATK_FIRE_BOLT_DAMAGE,
  SPAWN_MINIONS_ATK_ID_PREFIX,
  SPAWN_MINIONS_ATK_KIT_FIRST_SPELL,
  SPAWN_MINIONS_ATK_PACKET,
  SPAWN_MINIONS_ATK_PIECE,
  canExecuteSpawnMinionsAtk,
  executeSpawnMinionsAtk,
  isSpawnMinionsAtkMinionId,
  liveWxSpawnMinionsMappedAtk,
  liveWxSpawnMinionsMappedDamage,
  liveWxSpawnMinionsMappedLevel,
  liveWxSpawnMinionsMeleeFallback,
  resolveSpawnMinionsCommittedAtk,
  shouldDecideSpawnMinionsAtk,
  spawnMinionsAdvertisedAtkSoak,
  spawnMinionsAtkHighlightedIsExecutable,
} from "./bossSpawnMinionsAtkCommit.ts";

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

function makeMinionSpawnBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function makeMinionSpawn(");
  assert.ok(start >= 0, "makeMinionSpawn is present");
  const end = src.indexOf("// ── initBossState", start);
  assert.ok(end > start, "initBossState still follows makeMinionSpawn");
  return src.slice(start, end);
}

function applySpawnMinionsBlock(): string {
  const src = bossSystemSource();
  const start = src.indexOf("function applySpawnMinions(");
  assert.ok(start >= 0, "applySpawnMinions is present");
  const end = src.indexOf("function applyLavaTrail(", start);
  assert.ok(end > start, "Lava Trail still follows Spawn Minions");
  return src.slice(start, end);
}

function paleArchbishopDefaultsBlock(): string {
  const src = readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
  const start = src.indexOf('id: "pale_archbishop"');
  assert.ok(start >= 0, "Pale Archbishop default config is present");
  const end = src.indexOf('id: "crimson_countess"', start);
  assert.ok(end > start, "Crimson Countess still follows Pale Archbishop");
  return src.slice(start, end);
}

function skeletonReady() {
  return {
    minionId: `${SPAWN_MINIONS_ATK_ID_PREFIX}pale_archbishop_1`,
    advertisedAtk: SPAWN_MINIONS_ATK_PACKET,
    currentHp: 100,
    playerRes: 0,
    targetIsPlayer: true,
    adjacent: true,
  };
}

describe("Pale Archbishop skeleton-minion atk 8", () => {
  it("catalog Pale Archbishop init 8 and advertised atk 8 stay distinct from formula 15 / Crush 14", () => {
    const archbishop = paleArchbishopDefaultsBlock();
    assert.ok(archbishop.includes(`id: "${SPAWN_MINIONS_ATK_BOSS_ID}"`));
    assert.ok(archbishop.includes("init: 8"));
    assert.ok(archbishop.includes("atk: 35"));
    assert.ok(archbishop.includes("BossAbility.SPAWN_MINIONS"));
    assert.equal(SPAWN_MINIONS_ATK_BOSS_INIT, 8);
    assert.notEqual(SPAWN_MINIONS_ATK_PACKET, 35);

    const level = liveWxSpawnMinionsMappedLevel(SPAWN_MINIONS_ATK_BOSS_INIT);
    assert.equal(level, 6);
    assert.equal(
      liveWxSpawnMinionsMappedDamage(SPAWN_MINIONS_ATK_BOSS_INIT),
      15,
    );
    assert.equal(liveWxSpawnMinionsMappedAtk(), 0);
    assert.equal(
      liveWxSpawnMinionsMeleeFallback(SPAWN_MINIONS_ATK_CRUSH_DAMAGE, level),
      14,
    );
    assert.equal(
      liveWxSpawnMinionsMeleeFallback(
        SPAWN_MINIONS_ATK_FIRE_BOLT_DAMAGE,
        level,
      ),
      10,
    );
    assert.equal(spawnMinionsAdvertisedAtkSoak(SPAWN_MINIONS_ATK_PACKET, 0), 8);
    assert.notEqual(SPAWN_MINIONS_ATK_PACKET, 15);
    assert.notEqual(SPAWN_MINIONS_ATK_PACKET, 14);
    assert.notEqual(SPAWN_MINIONS_ATK_PACKET, 10);
  });

  it("live spawn writes atk 0 / formula damage; melee Crush never reads enemy.atk", () => {
    const spawn = makeMinionSpawnBlock();
    assert.ok(spawn.includes("`minion_${parentBossId}_"));
    assert.ok(spawn.includes("atk: 8"));
    assert.ok(spawn.includes("ap: 3"));
    assert.ok(spawn.includes('pieceType: "pawn"'));
    assert.ok(spawn.includes("hp: 20"));
    assert.equal(SPAWN_MINIONS_ATK_PIECE, "pawn");
    assert.equal(SPAWN_MINIONS_ATK_AP_LEFTOVER, 3);

    const apply = applySpawnMinionsBlock();
    assert.ok(apply.includes("makeMinionSpawn("));
    assert.ok(apply.includes("skeleton minion"));

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
      "spawn commit still never reads advertised s.hp — skeleton-20 stamp",
    );
    assert.ok(commit.includes("n[m.id] = 20"));

    const melee = wxPackMeleeBlock();
    assert.ok(melee.includes(SPAWN_MINIONS_ATK_CRUSH_ID));
    assert.ok(melee.includes("damage: 12"));
    assert.ok(melee.includes("fb.damage * Math.max(1, enemy.level / 5)"));
    assert.equal(melee.includes("enemy.atk"), false);
    assert.equal(melee.includes("enemy.damage"), false);
    assert.equal(wxSource().includes("executeSpawnMinionsAtk"), false);
    assert.equal(wxSource().includes("resolveSpawnMinionsCommittedAtk"), false);
  });

  it("executes atk 8 at RES 0 as HP 92; live Crush leaves 86", () => {
    const ready = skeletonReady();
    const decided = shouldDecideSpawnMinionsAtk(ready);
    const executable = canExecuteSpawnMinionsAtk(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      spawnMinionsAtkHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeSpawnMinionsAtk(ready);
    assert.deepEqual(next, { damage: 8, hpAfter: 92, playerDied: false });
    assert.equal(
      resolveSpawnMinionsCommittedAtk({
        minionId: ready.minionId,
        advertisedAtk: SPAWN_MINIONS_ATK_PACKET,
      }),
      8,
    );

    const liveCrush = liveWxSpawnMinionsMeleeFallback(
      SPAWN_MINIONS_ATK_CRUSH_DAMAGE,
      liveWxSpawnMinionsMappedLevel(SPAWN_MINIONS_ATK_BOSS_INIT),
    );
    assert.equal(liveCrush, 14);
    assert.equal(100 - liveCrush, 86);
    assert.notEqual(next?.damage, liveCrush);

    assert.deepEqual(
      executeSpawnMinionsAtk({
        ...ready,
        currentHp: 14,
      }),
      { damage: 8, hpAfter: 6, playerDied: false },
    );
    assert.equal(14 - liveCrush, 0, "live Crush 14 kills a 14 HP player");

    assert.equal(spawnMinionsAdvertisedAtkSoak(8, 50), 4);
    assert.deepEqual(
      executeSpawnMinionsAtk({
        ...ready,
        playerRes: 50,
      }),
      { damage: 4, hpAfter: 96, playerDied: false },
    );
  });

  it("cannot stamp summon-target, non-adjacent, ghost/phantom/scroll/split, or sibling leftover payloads", () => {
    const ready = skeletonReady();
    assert.equal(
      executeSpawnMinionsAtk({
        ...ready,
        targetIsPlayer: false,
      }),
      null,
      "summon-target melee uses enemyTakesDamage — leftover of #1252 skip",
    );
    assert.equal(
      executeSpawnMinionsAtk({
        ...ready,
        adjacent: false,
      }),
      null,
      "occupancy blocks walking onto the pawn; the hit is adjacent melee",
    );
    assert.equal(
      executeSpawnMinionsAtk({
        ...ready,
        minionId: "ghost_final_pawn_1",
      }),
      null,
      "ghost king atk 5 leftover of #1264",
    );
    assert.equal(
      resolveSpawnMinionsCommittedAtk({
        minionId: "ghost_final_pawn_1",
        advertisedAtk: 5,
      }),
      null,
    );
    assert.equal(
      resolveSpawnMinionsCommittedAtk({
        minionId: "void_phantom_abc123",
        advertisedAtk: 5,
      }),
      null,
      "phantom pawn contact atk 5 leftover of #1259",
    );
    assert.equal(
      resolveSpawnMinionsCommittedAtk({
        minionId: "scroll_pale_archivist_1",
        advertisedAtk: 8,
      }),
      null,
      "scroll bishop leftover of #1273 / #1113",
    );
    assert.equal(
      resolveSpawnMinionsCommittedAtk({
        minionId: "split_rook_0_1",
        advertisedAtk: 25,
      }),
      null,
      "split-rook leftover of #1271 / #1231",
    );
    assert.equal(isSpawnMinionsAtkMinionId("scroll_pale_archivist_0"), false);
    assert.equal(
      executeSpawnMinionsAtk({
        ...ready,
        advertisedAtk: 0,
      }),
      null,
    );

    const crit = executeSpawnMinionsAtk(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "skeleton-20 stamp owns HP 20");
    assert.equal(
      "ap" in crit,
      false,
      "skeleton ap 3 leftover stays unrestored",
    );
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
      "#1102 class owns kit-first Cursed Wound vs SPAWN_MINIONS",
    );
    assert.equal(
      spawnMinionsAtkHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off minion_ id prefix and atk metadata, not announce copy", () => {
    assert.equal(SPAWN_MINIONS_ATK_ID_PREFIX, "minion_");
    assert.equal(SPAWN_MINIONS_ATK_PACKET, 8);
    assert.equal(SPAWN_MINIONS_ATK_KIT_FIRST_SPELL, "spell-cursed-wound");
    assert.equal(
      shouldDecideSpawnMinionsAtk(skeletonReady()),
      canExecuteSpawnMinionsAtk(skeletonReady()),
    );
    assert.equal(
      isSpawnMinionsAtkMinionId(
        `${SPAWN_MINIONS_ATK_ID_PREFIX}pale_archbishop_1`,
      ),
      true,
    );
    assert.equal(isSpawnMinionsAtkMinionId("Minion"), false);
    assert.equal(isSpawnMinionsAtkMinionId("ghost_x"), false);
    assert.equal(isSpawnMinionsAtkMinionId("scroll_x"), false);

    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("// ── 1. Pale Archbishop");
    const end = src.indexOf("// ── 2. Crimson Countess");
    assert.ok(start >= 0 && end > start, "Pale Archbishop decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const spawnIdx = body.indexOf("BossAbility.SPAWN_MINIONS");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(spawnIdx >= 0, "SPAWN_MINIONS is present");
    assert.ok(kitIdx < spawnIdx, "kit still wins the phase-2 spawn turn");
    assert.equal(body.includes("resolveSpawnMinionsCommittedAtk"), false);
    assert.equal(body.includes("executeSpawnMinionsAtk"), false);
  });
});
