import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { clampApplyRewardsDeltas } from "./applyRewardsResult.ts";
import {
  OVERWORLD_BOSS_CLEANUP_ADVERTISED_DOKA_MULT,
  OVERWORLD_BOSS_CLEANUP_ADVERTISED_XP_MULT,
  OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID,
  OVERWORLD_BOSS_CLEANUP_EXAMPLE_NAME,
  leftoverBossDefeatedFeatIdAfterCleanup,
  leftoverOverworldBossVictoryAfterCleanup,
  leftoverUnmultipliedBossVictoryDoka,
  leftoverUnmultipliedBossVictoryXp,
  liveWxBossRushSnapshotsBossConfigBeforeCleanup,
  liveWxReadsBossConfigAfterCleanupBattle,
  liveWxSnapshotsBossConfigBeforeCleanupBattle,
  persistOverworldBossVictoryThroughCleanupSnapshot,
  snapshotOverworldBossConfigBeforeCleanupBattle,
} from "./overworldBossCleanupSnapshotWriteSkip.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function handleBattleEndSource(wx: string): string {
  const start = wx.indexOf("const handleBattleEnd = useCallback(");
  const end = wx.indexOf("function handleBossRushRoomClear()", start);
  assert.ok(start >= 0, "handleBattleEnd is present");
  assert.ok(
    end > start,
    "handleBossRushRoomClear still follows handleBattleEnd",
  );
  return wx.slice(start, end);
}

function handleBossRushRoomClearSource(wx: string): string {
  const start = wx.indexOf("function handleBossRushRoomClear()");
  const end = wx.indexOf("// Canvas container ref for ResizeObserver", start);
  assert.ok(start >= 0, "handleBossRushRoomClear is present");
  assert.ok(end > start, "canvas ref still follows room-clear");
  return wx.slice(start, end);
}

function cleanupBattleSource(wx: string): string {
  const start = wx.indexOf("const cleanupBattle = useCallback(");
  const end = wx.indexOf("const cleanupMap = useCallback(", start);
  assert.ok(start >= 0 && end > start, "cleanupBattle is present");
  return wx.slice(start, end);
}

const RAW_DOKA = 40;
const BASE_XP = 80;
const CHAIN_MULT = 1;

function bossDefaultsSource(): string {
  return readFileSync(join(here(), "../types/bossDefaults.ts"), "utf8");
}

const archbishop = {
  id: OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID,
  name: OVERWORLD_BOSS_CLEANUP_EXAMPLE_NAME,
  rewardDokaMultiplier: OVERWORLD_BOSS_CLEANUP_ADVERTISED_DOKA_MULT,
  rewardXpMultiplier: OVERWORLD_BOSS_CLEANUP_ADVERTISED_XP_MULT,
};

const cleanFeatSnap = {
  hp: 80,
  mapsVisited: 3,
  groundDokaPickups: 0,
  spellBarCount: 4,
  hasSpellAtLeast5: false,
  critHits: 0,
  pacifist: false,
  betrayal: false,
  doubleBetrayal: false,
  leaderSlain: false,
  bossId: null as string | null,
};

describe("catalog Pale Archbishop still advertises 5× Doka / 3× XP", () => {
  it("defaults keep pale_archbishop at 5 / 3 and every boss ≥ that", () => {
    const defaults = bossDefaultsSource();
    const heading = defaults.indexOf('id: "pale_archbishop"');
    assert.ok(heading >= 0, "pale_archbishop is in bossDefaults");
    const nextBoss = defaults.indexOf('id: "', heading + 1);
    const block = defaults.slice(
      heading,
      nextBoss > heading ? nextBoss : heading + 800,
    );
    assert.ok(block.includes(`name: "${OVERWORLD_BOSS_CLEANUP_EXAMPLE_NAME}"`));
    assert.ok(block.includes("rewardDokaMultiplier: 5"));
    assert.ok(block.includes("rewardXpMultiplier: 3"));
    assert.equal(archbishop.rewardDokaMultiplier, 5);
    assert.equal(archbishop.rewardXpMultiplier, 3);
    const dokaHits = defaults.split("rewardDokaMultiplier:").length - 1;
    assert.ok(dokaHits >= 12, "catalog still lists per-boss Doka multipliers");
    assert.equal(
      /rewardDokaMultiplier: 1,/.test(defaults),
      false,
      "no catalog boss advertises 1× Doka",
    );
  });
});

describe("snapshotOverworldBossConfigBeforeCleanupBattle", () => {
  it("captures catalog multipliers and drops empty / null configs", () => {
    const snap = snapshotOverworldBossConfigBeforeCleanupBattle(archbishop);
    assert.deepEqual(snap, {
      id: OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID,
      name: OVERWORLD_BOSS_CLEANUP_EXAMPLE_NAME,
      rewardDokaMultiplier: 5,
      rewardXpMultiplier: 3,
    });
    assert.equal(snapshotOverworldBossConfigBeforeCleanupBattle(null), null);
    assert.equal(
      snapshotOverworldBossConfigBeforeCleanupBattle({ id: "  " }),
      null,
    );
    assert.equal(
      snapshotOverworldBossConfigBeforeCleanupBattle({
        id: "x",
        rewardDokaMultiplier: 0,
        rewardXpMultiplier: Number.NaN,
      })?.rewardDokaMultiplier,
      1,
    );
  });
});

describe("ungated cleanup-then-read vs gated pre-cleanup snapshot", () => {
  it("records that live WX reads the boss config after cleanupBattle", () => {
    assert.equal(liveWxReadsBossConfigAfterCleanupBattle(), true);
    assert.equal(liveWxSnapshotsBossConfigBeforeCleanupBattle(), false);
    assert.equal(liveWxBossRushSnapshotsBossConfigBeforeCleanup(), true);
  });

  it("leftover persist is unboosted 40/80; gated persist is advertised 200/240", () => {
    const leftover = leftoverOverworldBossVictoryAfterCleanup({
      rawDoka: RAW_DOKA,
      derivedBaseXp: BASE_XP,
      chainMult: CHAIN_MULT,
    });
    assert.deepEqual(leftover, {
      dokaDelta: 40,
      xpDelta: 80,
      bossId: undefined,
      bossName: undefined,
    });

    const gated = persistOverworldBossVictoryThroughCleanupSnapshot({
      snapshot: snapshotOverworldBossConfigBeforeCleanupBattle(archbishop),
      rawDoka: RAW_DOKA,
      derivedBaseXp: BASE_XP,
      chainMult: CHAIN_MULT,
    });
    assert.deepEqual(gated, {
      dokaDelta: 200,
      xpDelta: 240,
      bossId: OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID,
      bossName: OVERWORLD_BOSS_CLEANUP_EXAMPLE_NAME,
    });
    assert.deepEqual(clampApplyRewardsDeltas(200, 240), {
      dokaDelta: 200,
      xpDelta: 240,
    });
    assert.equal(
      leftoverUnmultipliedBossVictoryDoka({
        rawDoka: RAW_DOKA,
        advertisedDokaMult: OVERWORLD_BOSS_CLEANUP_ADVERTISED_DOKA_MULT,
      }),
      160,
    );
    assert.equal(
      leftoverUnmultipliedBossVictoryXp({
        derivedBaseXp: BASE_XP,
        advertisedXpMult: OVERWORLD_BOSS_CLEANUP_ADVERTISED_XP_MULT,
      }),
      160,
    );
    assert.notDeepEqual(leftover, gated);
  });

  it("dungeon chain still multiplies both paths; leftover is the missing boss ×5", () => {
    const chain = 2;
    const leftover = leftoverOverworldBossVictoryAfterCleanup({
      rawDoka: RAW_DOKA,
      derivedBaseXp: BASE_XP,
      chainMult: chain,
    });
    const gated = persistOverworldBossVictoryThroughCleanupSnapshot({
      snapshot: snapshotOverworldBossConfigBeforeCleanupBattle(archbishop),
      rawDoka: RAW_DOKA,
      derivedBaseXp: BASE_XP,
      chainMult: chain,
    });
    // cleanupBattle does not zero dungeonChain refs — chain 2 still applies.
    assert.equal(leftover.dokaDelta, 80);
    assert.equal(gated.dokaDelta, 400);
    assert.equal(
      leftoverUnmultipliedBossVictoryDoka({
        rawDoka: RAW_DOKA,
        chainMult: chain,
        advertisedDokaMult: OVERWORLD_BOSS_CLEANUP_ADVERTISED_DOKA_MULT,
      }),
      320,
    );
    // XP is boss-only (no chain).
    assert.equal(leftover.xpDelta, 80);
    assert.equal(gated.xpDelta, 240);
  });

  it("non-boss victory has a null config before and after cleanup — no leftover", () => {
    const leftover = leftoverOverworldBossVictoryAfterCleanup({
      rawDoka: RAW_DOKA,
      derivedBaseXp: BASE_XP,
    });
    const gated = persistOverworldBossVictoryThroughCleanupSnapshot({
      snapshot: snapshotOverworldBossConfigBeforeCleanupBattle(null),
      rawDoka: RAW_DOKA,
      derivedBaseXp: BASE_XP,
    });
    assert.deepEqual(leftover, gated);
    assert.equal(leftover.bossId, undefined);
  });

  it("feat snap loses boss_defeated_* after cleanup", () => {
    const snap = snapshotOverworldBossConfigBeforeCleanupBattle(archbishop);
    assert.equal(
      leftoverBossDefeatedFeatIdAfterCleanup({
        snapshotBeforeCleanup: snap,
        readAfterCleanup: true,
      }),
      undefined,
    );
    assert.equal(
      leftoverBossDefeatedFeatIdAfterCleanup({
        snapshotBeforeCleanup: snap,
        readAfterCleanup: false,
      }),
      OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID,
    );
    const afterCleanup = clientTrustedVictoryAchievementConditions({
      ...cleanFeatSnap,
      bossId: leftoverBossDefeatedFeatIdAfterCleanup({
        snapshotBeforeCleanup: snap,
        readAfterCleanup: true,
      }),
    });
    assert.equal(
      afterCleanup.includes(
        `boss_defeated_${OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID}`,
      ),
      false,
    );
    const gated = clientTrustedVictoryAchievementConditions({
      ...cleanFeatSnap,
      bossId: leftoverBossDefeatedFeatIdAfterCleanup({
        snapshotBeforeCleanup: snap,
        readAfterCleanup: false,
      }),
    });
    assert.ok(
      gated.includes(`boss_defeated_${OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID}`),
    );
  });
});

describe("live WX leftover (unwired sidecar)", () => {
  it("cleanupBattle still nulls currentBossConfigRef", () => {
    const cleanup = cleanupBattleSource(wxSource());
    assert.ok(cleanup.includes("currentBossConfigRef.current = null"));
    assert.equal(
      cleanup.includes("snapshotOverworldBossConfigBeforeCleanupBattle"),
      false,
    );
  });

  it("handleBattleEnd still calls cleanupBattle before reading the boss config", () => {
    const body = handleBattleEndSource(wxSource());
    const cleanupAt = body.indexOf("cleanupBattle();");
    const xpReadAt = body.indexOf(
      "const activeBossConfForXP = currentBossConfigRef.current;",
    );
    const dokaReadAt = body.indexOf(
      "const activeBossConf = currentBossConfigRef.current;",
    );
    const recapAt = body.indexOf(
      "bossDefeated: currentBossConfigRef.current?.name",
    );
    const featAt = body.indexOf("bossId: activeBossConf?.id");
    assert.ok(cleanupAt >= 0, "handleBattleEnd still calls cleanupBattle");
    assert.ok(xpReadAt > cleanupAt, "XP multiplier still reads after cleanup");
    assert.ok(
      dokaReadAt > cleanupAt,
      "Doka multiplier still reads after cleanup",
    );
    assert.ok(
      recapAt > cleanupAt,
      "recap bossDefeated still reads after cleanup",
    );
    assert.ok(featAt > cleanupAt, "feat bossId still reads after cleanup");
    assert.ok(body.includes("rewardXpMultiplier"));
    assert.ok(body.includes("rewardDokaMultiplier"));
    assert.equal(
      body.includes("persistOverworldBossVictoryThroughCleanupSnapshot"),
      false,
    );
    assert.equal(
      body.includes("snapshotOverworldBossConfigBeforeCleanupBattle"),
      false,
    );
  });

  it("challenge refs are still snapshotted before cleanup; boss config is not", () => {
    const body = handleBattleEndSource(wxSource());
    const challengeSnapAt = body.indexOf(
      "const liveChallenge = currentChallengeRef.current;",
    );
    const cleanupAt = body.indexOf("cleanupBattle();");
    assert.ok(challengeSnapAt >= 0 && challengeSnapAt < cleanupAt);
    const preCleanup = body.slice(0, cleanupAt);
    assert.equal(
      preCleanup.includes("currentBossConfigRef.current"),
      false,
      "handleBattleEnd still does not snapshot the boss config before cleanup",
    );
  });

  it("Boss Rush room-clear still snapshots currentBossConfigRef before cleanup", () => {
    const body = handleBossRushRoomClearSource(wxSource());
    const snapAt = body.indexOf(
      "const activeBossConf = currentBossConfigRef.current;",
    );
    const cleanupAt = body.indexOf("cleanupBattle();");
    assert.ok(snapAt >= 0, "room-clear still reads the live boss config");
    assert.ok(cleanupAt > snapAt, "cleanup still follows the room-clear snap");
    assert.equal(
      body.includes("rewardDokaMultiplier"),
      false,
      "room-clear still ignores catalog reward multipliers (not this leftover)",
    );
  });
});

describe("distinct from leftover feat gates #1328 / #1321 / #1317 / #1308", () => {
  it("is the overworld boss cleanup-null multiplier wipe, not a feat-mint stamp", () => {
    assert.equal(OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID, "pale_archbishop");
    assert.notEqual(OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID, "survive_1hp");
    assert.notEqual(OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID, "spell_master_8");
    assert.notEqual(OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID, "jackpot_heal");
    assert.notEqual(OVERWORLD_BOSS_CLEANUP_EXAMPLE_ID, "loot_10_doka");
  });

  it("does not stamp leftover-Doka / inventory / bar keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(storage.get("pbv_spell_bar_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_inventory_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("VampireBob_slot1_pbv_ground_doka_pickups"),
      undefined,
    );
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
  });
});
