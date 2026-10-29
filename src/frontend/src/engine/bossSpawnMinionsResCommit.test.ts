/**
 * Combat action parity: Pale Archbishop skeleton-minion advertised RES 2
 * is discarded (WX res 0) so Life Drain SR×RES soaks nothing extra.
 * Strike 10 still rounds to 10 — leftover of #1316's Strike-only check.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import { startingChampionStats } from "../utils/startingChampionStats.ts";
import {
  SPAWN_MINIONS_RES_AP_LEFTOVER,
  SPAWN_MINIONS_RES_ATK_LEFTOVER,
  SPAWN_MINIONS_RES_BOSS_ID,
  SPAWN_MINIONS_RES_CHAMPION_SP,
  SPAWN_MINIONS_RES_DRAIN_DAMAGE,
  SPAWN_MINIONS_RES_DRAIN_ID,
  SPAWN_MINIONS_RES_ID_PREFIX,
  SPAWN_MINIONS_RES_KIT_FIRST_SPELL,
  SPAWN_MINIONS_RES_PACKET,
  SPAWN_MINIONS_RES_PIECE,
  SPAWN_MINIONS_RES_STRIKE_DAMAGE,
  SPAWN_MINIONS_RES_WX_HP_STAMP,
  SPAWN_MINIONS_RES_WX_SR,
  advertisedSpawnMinionsRes,
  canExecuteSpawnMinionsResSoak,
  executeSpawnMinionsResSoak,
  isSpawnMinionsResMinionId,
  liveWxSpawnMinionsMappedRes,
  resolveSpawnMinionsCommittedRes,
  shouldDecideSpawnMinionsResSoak,
  spawnMinionsAdvertisedResSoak,
  spawnMinionsResHighlightedIsExecutable,
  spawnMinionsResPreSoakAfterSp,
  spawnMinionsStrikeResSoak,
} from "./bossSpawnMinionsResCommit.ts";

const drain = starterSpells.find((s) => s.id === SPAWN_MINIONS_RES_DRAIN_ID);
assert.ok(drain, "starter-drain");
assert.equal(Number(drain.damage), SPAWN_MINIONS_RES_DRAIN_DAMAGE);
assert.equal(drain.isPhysical ?? false, false);

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
assert.equal(Number(strike.damage), SPAWN_MINIONS_RES_STRIKE_DAMAGE);
assert.equal(strike.isPhysical, true);

assert.equal(Number(startingChampionStats().sp), SPAWN_MINIONS_RES_CHAMPION_SP);

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

function wxComputeDamageBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const computeDamage = useCallback(");
  assert.ok(start >= 0, "live computeDamage is present");
  const end = wx.indexOf("const calculatePlayerDamage = useCallback(", start);
  assert.ok(end > start, "calculatePlayerDamage still follows computeDamage");
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
    minionId: `${SPAWN_MINIONS_RES_ID_PREFIX}pale_archbishop_1`,
    advertisedRes: SPAWN_MINIONS_RES_PACKET,
    drainDamage: SPAWN_MINIONS_RES_DRAIN_DAMAGE,
    currentHp: SPAWN_MINIONS_RES_WX_HP_STAMP,
    isPhysical: false,
    targetIsSkeleton: true,
    sr: SPAWN_MINIONS_RES_WX_SR,
  };
}

describe("Pale Archbishop skeleton-minion advertised RES 2", () => {
  it("catalog res 2 stays distinct from WX stamp 0; Strike 10 still no-ops", () => {
    const archbishop = paleArchbishopDefaultsBlock();
    assert.ok(archbishop.includes(`id: "${SPAWN_MINIONS_RES_BOSS_ID}"`));
    assert.ok(archbishop.includes("BossAbility.SPAWN_MINIONS"));
    assert.ok(archbishop.includes("init: 8"));
    assert.notEqual(SPAWN_MINIONS_RES_PACKET, 12);

    assert.equal(advertisedSpawnMinionsRes(SPAWN_MINIONS_RES_PACKET), 2);
    assert.equal(liveWxSpawnMinionsMappedRes(), 0);
    assert.notEqual(SPAWN_MINIONS_RES_PACKET, liveWxSpawnMinionsMappedRes());

    assert.equal(
      spawnMinionsResPreSoakAfterSp(
        SPAWN_MINIONS_RES_DRAIN_DAMAGE,
        SPAWN_MINIONS_RES_CHAMPION_SP,
      ),
      10,
      "starter SP 8 does not raise Life Drain 10 before SR×RES",
    );
    assert.equal(
      spawnMinionsStrikeResSoak(
        SPAWN_MINIONS_RES_STRIKE_DAMAGE,
        SPAWN_MINIONS_RES_PACKET,
      ),
      10,
      "skeleton res 2 still rounds Strike 10 to 10",
    );
    assert.equal(
      spawnMinionsStrikeResSoak(
        SPAWN_MINIONS_RES_STRIKE_DAMAGE,
        liveWxSpawnMinionsMappedRes(),
      ),
      10,
    );
    assert.equal(
      spawnMinionsAdvertisedResSoak(
        SPAWN_MINIONS_RES_DRAIN_DAMAGE,
        SPAWN_MINIONS_RES_PACKET,
        SPAWN_MINIONS_RES_WX_SR,
      ),
      9,
    );
    assert.equal(
      spawnMinionsAdvertisedResSoak(
        SPAWN_MINIONS_RES_DRAIN_DAMAGE,
        liveWxSpawnMinionsMappedRes(),
        SPAWN_MINIONS_RES_WX_SR,
      ),
      10,
    );
  });

  it("live spawn writes res 0 and never reads advertised s.res", () => {
    const spawn = makeMinionSpawnBlock();
    assert.ok(spawn.includes("`minion_${parentBossId}_"));
    assert.ok(spawn.includes("res: 2"));
    assert.ok(spawn.includes("atk: 8"));
    assert.ok(spawn.includes("ap: 3"));
    assert.ok(spawn.includes('pieceType: "pawn"'));
    assert.ok(spawn.includes("hp: 20"));
    assert.equal(SPAWN_MINIONS_RES_PIECE, "pawn");
    assert.equal(SPAWN_MINIONS_RES_AP_LEFTOVER, 3);
    assert.equal(SPAWN_MINIONS_RES_ATK_LEFTOVER, 8);

    const apply = applySpawnMinionsBlock();
    assert.ok(apply.includes("makeMinionSpawn("));
    assert.ok(apply.includes("skeleton minion"));

    const commit = wxSpawnCommitBlock();
    assert.ok(commit.includes("res: 0"));
    assert.ok(commit.includes("sr: 5"));
    assert.ok(commit.includes("atk: 0"));
    assert.ok(commit.includes("ap: 0"));
    assert.ok(commit.includes("n[m.id] = 20"));
    assert.equal(
      commit.includes("s.res"),
      false,
      "spawn commit still never reads advertised s.res",
    );
    assert.equal(
      commit.includes("s.atk"),
      false,
      "spawn commit still never reads advertised s.atk — leftover of #1278",
    );
    assert.equal(
      commit.includes("s.hp"),
      false,
      "spawn commit still never reads advertised s.hp — skeleton-20 stamp",
    );

    const dmg = wxComputeDamageBlock();
    assert.ok(dmg.includes("targetEnemy.res * resMod"));
    assert.ok(dmg.includes("Math.round(dmg * srFactor * resFactor)"));
    assert.equal(wxSource().includes("executeSpawnMinionsResSoak"), false);
    assert.equal(wxSource().includes("resolveSpawnMinionsCommittedRes"), false);
  });

  it("executes Life Drain 10 at res 2 as skeleton HP 11; live res 0 leaves 10", () => {
    const ready = skeletonReady();
    const decided = shouldDecideSpawnMinionsResSoak(ready);
    const executable = canExecuteSpawnMinionsResSoak(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      spawnMinionsResHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeSpawnMinionsResSoak(ready);
    assert.deepEqual(next, { damage: 9, hpAfter: 11, skeletonDied: false });
    assert.equal(
      resolveSpawnMinionsCommittedRes({
        minionId: ready.minionId,
        advertisedRes: SPAWN_MINIONS_RES_PACKET,
      }),
      2,
    );

    const liveDmg = spawnMinionsAdvertisedResSoak(
      SPAWN_MINIONS_RES_DRAIN_DAMAGE,
      liveWxSpawnMinionsMappedRes(),
      SPAWN_MINIONS_RES_WX_SR,
    );
    assert.equal(liveDmg, 10);
    assert.equal(SPAWN_MINIONS_RES_WX_HP_STAMP - liveDmg, 10);
    assert.notEqual(next?.damage, liveDmg);

    const afterTwoAdvertised = executeSpawnMinionsResSoak({
      ...ready,
      currentHp: 11,
    });
    assert.deepEqual(afterTwoAdvertised, {
      damage: 9,
      hpAfter: 2,
      skeletonDied: false,
    });
    assert.equal(
      SPAWN_MINIONS_RES_WX_HP_STAMP - liveDmg - liveDmg,
      0,
      "live two Life Drain 10 kill the stamp-20 skeleton",
    );

    assert.deepEqual(
      executeSpawnMinionsResSoak({
        ...ready,
        currentHp: 10,
      }),
      { damage: 9, hpAfter: 1, skeletonDied: false },
      "advertised res 2 leaves a 10 HP skeleton at 1; live Life Drain 10 kills",
    );
    assert.equal(Math.max(0, 10 - liveDmg), 0);
  });

  it("cannot stamp Strike, non-skeleton, ghost/phantom/scroll/split, or sibling leftover payloads", () => {
    const ready = skeletonReady();
    assert.equal(
      executeSpawnMinionsResSoak({
        ...ready,
        isPhysical: true,
      }),
      null,
      "Strike / Attack Nearest RES is #1316's physical leftover",
    );
    assert.equal(
      executeSpawnMinionsResSoak({
        ...ready,
        targetIsSkeleton: false,
      }),
      null,
      "player-target pack melee is #1278 outgoing atk, not incoming RES",
    );
    assert.equal(
      executeSpawnMinionsResSoak({
        ...ready,
        minionId: "ghost_final_pawn_1",
      }),
      null,
      "ghost king advertised res 0 leftover of #1264 / #1220",
    );
    assert.equal(
      resolveSpawnMinionsCommittedRes({
        minionId: "ghost_final_pawn_1",
        advertisedRes: 0,
      }),
      null,
    );
    assert.equal(
      resolveSpawnMinionsCommittedRes({
        minionId: "void_phantom_abc123",
        advertisedRes: 0,
      }),
      null,
      "phantom pawn advertised res 0 leftover of #1259 / #1152",
    );
    assert.equal(
      resolveSpawnMinionsCommittedRes({
        minionId: "scroll_pale_archivist_1",
        advertisedRes: 0,
      }),
      null,
      "scroll bishop advertised res 0 leftover of #1273 / #1113",
    );
    assert.equal(
      resolveSpawnMinionsCommittedRes({
        minionId: "split_rook_0_1",
        advertisedRes: 18,
      }),
      null,
      "split-rook leftover of #1316 / #1271 / #1231",
    );
    assert.equal(isSpawnMinionsResMinionId("scroll_pale_archivist_0"), false);
    assert.equal(
      executeSpawnMinionsResSoak({
        ...ready,
        advertisedRes: 0,
        drainDamage: 0,
      }),
      null,
    );

    const crit = executeSpawnMinionsResSoak(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "skeleton-20 stamp owns HP 20");
    assert.equal("atk" in crit, false, "#1278 owns skeleton atk 8");
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
    assert.equal("sr" in crit, false, "#1257 / #1262 own player SR soak");
    assert.equal(
      "decide" in crit,
      false,
      "#1102 class owns kit-first Cursed Wound vs SPAWN_MINIONS",
    );
    assert.equal(
      spawnMinionsResHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off minion_ id prefix and RES metadata, not announce copy", () => {
    assert.equal(SPAWN_MINIONS_RES_ID_PREFIX, "minion_");
    assert.equal(SPAWN_MINIONS_RES_PACKET, 2);
    assert.equal(SPAWN_MINIONS_RES_KIT_FIRST_SPELL, "spell-cursed-wound");
    assert.equal(
      shouldDecideSpawnMinionsResSoak(skeletonReady()),
      canExecuteSpawnMinionsResSoak(skeletonReady()),
    );
    assert.equal(
      isSpawnMinionsResMinionId(
        `${SPAWN_MINIONS_RES_ID_PREFIX}pale_archbishop_1`,
      ),
      true,
    );
    assert.equal(isSpawnMinionsResMinionId("Minion"), false);
    assert.equal(isSpawnMinionsResMinionId("ghost_x"), false);
    assert.equal(isSpawnMinionsResMinionId("scroll_x"), false);
    assert.equal(isSpawnMinionsResMinionId("split_rook_x"), false);

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
    assert.equal(body.includes("resolveSpawnMinionsCommittedRes"), false);
    assert.equal(body.includes("executeSpawnMinionsResSoak"), false);
  });
});
