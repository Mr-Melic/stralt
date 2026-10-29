/**
 * Combat action parity: Fetid Rook split-rook advertised RES 18 is
 * discarded (WX res 0) so Strike / Attack Nearest soak nothing.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  SPLIT_ROOK_RES_AP_LEFTOVER,
  SPLIT_ROOK_RES_ATK_LEFTOVER,
  SPLIT_ROOK_RES_BOSS_ID,
  SPLIT_ROOK_RES_BOSS_RES,
  SPLIT_ROOK_RES_ID_PREFIX,
  SPLIT_ROOK_RES_KIT_FIRST_SPELL,
  SPLIT_ROOK_RES_PACKET,
  SPLIT_ROOK_RES_PIECE,
  SPLIT_ROOK_RES_SKELETON_LEFTOVER,
  SPLIT_ROOK_RES_STRIKE_DAMAGE,
  SPLIT_ROOK_RES_WX_HP_STAMP,
  advertisedSplitRookRes,
  canExecuteSplitRookResSoak,
  executeSplitRookResSoak,
  isSplitRookResMinionId,
  liveWxSplitRookMappedRes,
  resolveSplitRookCommittedRes,
  shouldDecideSplitRookResSoak,
  splitRookAdvertisedResSoak,
  splitRookResHighlightedIsExecutable,
} from "./bossSplitRooksResCommit.ts";

const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(strike, "physical_attack");
assert.equal(Number(strike.damage), SPLIT_ROOK_RES_STRIKE_DAMAGE);
assert.equal(strike.isPhysical, true);

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
    minionId: `${SPLIT_ROOK_RES_ID_PREFIX}0_1`,
    advertisedRes: SPLIT_ROOK_RES_PACKET,
    strikeDamage: SPLIT_ROOK_RES_STRIKE_DAMAGE,
    currentHp: SPLIT_ROOK_RES_WX_HP_STAMP,
    isPhysical: true,
    targetIsTwin: true,
  };
}

describe("Fetid Rook split-rook advertised RES 18", () => {
  it("catalog Fetid Rook res 18 stays distinct from WX stamp 0 and skeleton 2", () => {
    const fetid = fetidRookDefaultsBlock();
    assert.ok(fetid.includes(`id: "${SPLIT_ROOK_RES_BOSS_ID}"`));
    assert.ok(fetid.includes("res: 18"));
    assert.ok(fetid.includes("atk: 32"));
    assert.ok(fetid.includes("ap: 5"));
    assert.ok(fetid.includes("BossAbility.SPLIT_ROOKS"));
    assert.equal(SPLIT_ROOK_RES_BOSS_RES, 18);
    assert.equal(advertisedSplitRookRes(SPLIT_ROOK_RES_BOSS_RES), 18);
    assert.equal(SPLIT_ROOK_RES_PACKET, 18);
    assert.equal(liveWxSplitRookMappedRes(), 0);
    assert.notEqual(SPLIT_ROOK_RES_PACKET, liveWxSplitRookMappedRes());
    assert.notEqual(SPLIT_ROOK_RES_PACKET, SPLIT_ROOK_RES_SKELETON_LEFTOVER);
    assert.equal(
      splitRookAdvertisedResSoak(
        SPLIT_ROOK_RES_STRIKE_DAMAGE,
        SPLIT_ROOK_RES_SKELETON_LEFTOVER,
      ),
      10,
      "skeleton res 2 still rounds Strike 10 to 10",
    );
    assert.equal(
      splitRookAdvertisedResSoak(
        SPLIT_ROOK_RES_STRIKE_DAMAGE,
        SPLIT_ROOK_RES_PACKET,
      ),
      8,
    );
    assert.equal(
      splitRookAdvertisedResSoak(
        SPLIT_ROOK_RES_STRIKE_DAMAGE,
        liveWxSplitRookMappedRes(),
      ),
      10,
    );
  });

  it("live spawn writes res 0 and never reads advertised s.res", () => {
    const spawn = applySplitRooksBlock();
    assert.ok(spawn.includes("`split_rook_${i}_"));
    assert.ok(spawn.includes("res: params.bossEntry.res"));
    assert.ok(spawn.includes("atk: Math.floor(params.bossEntry.atk * 0.8)"));
    assert.ok(spawn.includes("ap: params.bossEntry.ap"));
    assert.ok(spawn.includes('pieceType: "rook"'));
    assert.ok(spawn.includes("Math.ceil(params.bossEntry.hp / 2)"));
    assert.equal(SPLIT_ROOK_RES_PIECE, "rook");
    assert.equal(SPLIT_ROOK_RES_AP_LEFTOVER, 5);
    assert.equal(SPLIT_ROOK_RES_ATK_LEFTOVER, 25);

    const commit = wxSpawnCommitBlock();
    assert.ok(commit.includes("res: 0"));
    assert.ok(commit.includes("atk: 0"));
    assert.ok(commit.includes("ap: 0"));
    assert.ok(commit.includes("n[m.id] = 20"));
    assert.equal(
      commit.includes("s.res"),
      false,
      "spawn commit still never reads advertised s.res",
    );
    assert.equal(
      commit.includes("s.hp"),
      false,
      "spawn commit still never reads advertised s.hp — leftover of #1231",
    );
    assert.equal(
      commit.includes("s.atk"),
      false,
      "spawn commit still never reads advertised s.atk — leftover of #1271",
    );

    const dmg = wxComputeDamageBlock();
    assert.ok(dmg.includes("targetEnemy.res * resMod"));
    assert.ok(dmg.includes("Math.round(dmg * resFactor)"));
    assert.equal(wxSource().includes("executeSplitRookResSoak"), false);
    assert.equal(wxSource().includes("resolveSplitRookCommittedRes"), false);
  });

  it("executes Strike 10 at res 18 as twin HP 12; live res 0 leaves 10", () => {
    const ready = splitReady();
    const decided = shouldDecideSplitRookResSoak(ready);
    const executable = canExecuteSplitRookResSoak(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      splitRookResHighlightedIsExecutable({ decided, executable }),
      true,
    );

    const next = executeSplitRookResSoak(ready);
    assert.deepEqual(next, { damage: 8, hpAfter: 12, twinDied: false });
    assert.equal(
      resolveSplitRookCommittedRes({
        minionId: ready.minionId,
        advertisedRes: SPLIT_ROOK_RES_PACKET,
      }),
      18,
    );

    const liveDmg = splitRookAdvertisedResSoak(
      SPLIT_ROOK_RES_STRIKE_DAMAGE,
      liveWxSplitRookMappedRes(),
    );
    assert.equal(liveDmg, 10);
    assert.equal(SPLIT_ROOK_RES_WX_HP_STAMP - liveDmg, 10);
    assert.notEqual(next?.damage, liveDmg);

    const afterTwoAdvertised = executeSplitRookResSoak({
      ...ready,
      currentHp: 12,
    });
    assert.deepEqual(afterTwoAdvertised, {
      damage: 8,
      hpAfter: 4,
      twinDied: false,
    });
    assert.equal(
      SPLIT_ROOK_RES_WX_HP_STAMP - liveDmg - liveDmg,
      0,
      "live two Strike 10 kill the stamp-20 twin",
    );

    assert.deepEqual(
      executeSplitRookResSoak({
        ...ready,
        currentHp: 9,
      }),
      { damage: 8, hpAfter: 1, twinDied: false },
      "advertised res 18 leaves a 9 HP twin at 1; live Strike 10 kills",
    );
    assert.equal(Math.max(0, 9 - liveDmg), 0);
  });

  it("cannot stamp Frost Bolt, non-twin, ghost/phantom/scroll/skeleton, or sibling leftover payloads", () => {
    const ready = splitReady();
    assert.equal(
      executeSplitRookResSoak({
        ...ready,
        isPhysical: false,
      }),
      null,
      "Frost Bolt SR×RES stacking is not this Strike RES leftover",
    );
    assert.equal(
      executeSplitRookResSoak({
        ...ready,
        targetIsTwin: false,
      }),
      null,
      "player-target pack melee is #1271 outgoing atk, not incoming RES",
    );
    assert.equal(
      executeSplitRookResSoak({
        ...ready,
        minionId: "ghost_final_pawn_1",
      }),
      null,
      "ghost king advertised res 0 leftover of #1264 / #1220",
    );
    assert.equal(
      resolveSplitRookCommittedRes({
        minionId: "ghost_final_pawn_1",
        advertisedRes: 0,
      }),
      null,
    );
    assert.equal(
      resolveSplitRookCommittedRes({
        minionId: "void_phantom_abc123",
        advertisedRes: 0,
      }),
      null,
      "phantom pawn advertised res 0 leftover of #1259 / #1152",
    );
    assert.equal(
      resolveSplitRookCommittedRes({
        minionId: "scroll_pale_archivist_1",
        advertisedRes: 0,
      }),
      null,
      "scroll bishop advertised res 0 leftover of #1273 / #1113",
    );
    assert.equal(
      resolveSplitRookCommittedRes({
        minionId: "minion_pale_archbishop_1",
        advertisedRes: SPLIT_ROOK_RES_SKELETON_LEFTOVER,
      }),
      null,
      "skeleton pawn advertised res 2 does not change Strike 10",
    );
    assert.equal(isSplitRookResMinionId("minion_countess_0"), false);
    assert.equal(
      executeSplitRookResSoak({
        ...ready,
        advertisedRes: 0,
        strikeDamage: 0,
      }),
      null,
    );

    const crit = executeSplitRookResSoak(ready);
    assert.ok(crit);
    assert.equal("hp" in crit, false, "#1231 owns split HP stamp");
    assert.equal("atk" in crit, false, "#1271 owns split atk 25");
    assert.equal("ap" in crit, false, "split ap 5 leftover stays unrestored");
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
      "#1261 owns kit-first Venom vs Split",
    );
    assert.equal(
      splitRookResHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off split_rook_ id prefix and RES metadata, not announce copy", () => {
    assert.equal(SPLIT_ROOK_RES_ID_PREFIX, "split_rook_");
    assert.equal(SPLIT_ROOK_RES_PACKET, 18);
    assert.equal(SPLIT_ROOK_RES_KIT_FIRST_SPELL, "spell-venom-strike");
    assert.equal(
      shouldDecideSplitRookResSoak(splitReady()),
      canExecuteSplitRookResSoak(splitReady()),
    );
    assert.equal(
      isSplitRookResMinionId(`${SPLIT_ROOK_RES_ID_PREFIX}0_1`),
      true,
    );
    assert.equal(isSplitRookResMinionId("Minion"), false);
    assert.equal(isSplitRookResMinionId("ghost_x"), false);
    assert.equal(isSplitRookResMinionId("void_phantom_x"), false);
    assert.equal(isSplitRookResMinionId("minion_x"), false);

    const src = readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
    const start = src.indexOf("// ── 7. Fetid Rook");
    const end = src.indexOf("// ── 8. Eternal Pawn King");
    assert.ok(start >= 0 && end > start, "Fetid Rook decide is present");
    const body = src.slice(start, end);
    const kitIdx = body.indexOf("pickBossKitSpell");
    const splitIdx = body.indexOf("BossAbility.SPLIT_ROOKS");
    assert.ok(kitIdx >= 0, "kit pick is present");
    assert.ok(splitIdx >= 0, "SPLIT_ROOKS is present");
    assert.ok(kitIdx < splitIdx, "kit still wins the phase-2 Split turn");
    assert.equal(body.includes("resolveSplitRookCommittedRes"), false);
    assert.equal(body.includes("executeSplitRookResSoak"), false);
  });
});
