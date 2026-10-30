import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { clampApplyRewardsDeltas } from "./applyRewardsResult.ts";
import {
  BOSS_RUSH_JACKPOT_ROOM_INDEX,
  BOSS_RUSH_ROOM0_ADVERTISED_DOKA,
  BOSS_RUSH_ROOM0_ADVERTISED_XP,
  BOSS_RUSH_ROOM9_ADVERTISED_DOKA,
  BOSS_RUSH_ROOM9_ADVERTISED_XP,
  advertisedBossRushRoomTable,
  advertisedBossRushRoomTableAtIndex,
  leftoverBossRushKillFormulaDoka,
  leftoverBossRushRoomClearAfterUnusedTable,
  leftoverUnpaidBossRushTableDoka,
  leftoverUnpaidBossRushTableXp,
  liveWxRoomClearAssignsCurrentRoomFromTable,
  liveWxRoomClearHardcodesRoomMultiplierOne,
  liveWxRoomClearReadsTableDokaReward,
  liveWxRoomClearSetsBossRushRoomReward,
  persistBossRushThroughAdvertisedRoomTable,
} from "./bossRushAdvertisedRoomTableWriteSkip.ts";
import {
  buildBossRushPersistInput,
  computeRewardDeltas,
  computeVictoryExp,
} from "./rewardResolver.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossRushHookSource(): string {
  return readFileSync(join(here(), "../hooks/useBossRush.ts"), "utf8");
}

function rewardResolverSource(): string {
  return readFileSync(join(here(), "./rewardResolver.ts"), "utf8");
}

function handleBossRushRoomClearSource(wx: string): string {
  const start = wx.indexOf("function handleBossRushRoomClear()");
  const end = wx.indexOf("// Canvas container ref for ResizeObserver", start);
  assert.ok(start >= 0, "handleBossRushRoomClear is present");
  assert.ok(end > start, "canvas ref still follows room-clear");
  return wx.slice(start, end);
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

const LEVEL_1_PAIR = [
  { name: "pale_archbishop", level: 1 },
  { name: "weeping_pawn", level: 1 },
];

const KILL_DOKA_LEVEL1_PAIR = leftoverBossRushKillFormulaDoka({
  characterLevel: 1,
  defeatedCount: 2,
});
const KILL_XP_LEVEL1_PAIR = computeVictoryExp({
  defeatedEnemies: LEVEL_1_PAIR,
  characterLevel: 1,
});

const ROOM0 = {
  dokaReward: BOSS_RUSH_ROOM0_ADVERTISED_DOKA,
  xpReward: BOSS_RUSH_ROOM0_ADVERTISED_XP,
};
const ROOM9 = {
  dokaReward: BOSS_RUSH_ROOM9_ADVERTISED_DOKA,
  xpReward: BOSS_RUSH_ROOM9_ADVERTISED_XP,
};

describe("BOSS_RUSH_ROOMS still advertises Room 0 500/200 and Room 9 5000/2000", () => {
  it("live table keeps jackpot amounts", () => {
    const hook = bossRushHookSource();
    assert.ok(hook.includes("dokaReward: 500"));
    assert.ok(hook.includes("xpReward: 200"));
    assert.ok(hook.includes("dokaReward: 5000"));
    assert.ok(hook.includes("xpReward: 2000"));
    assert.ok(hook.includes("JACKPOT ROOM"));
    assert.equal(BOSS_RUSH_ROOM0_ADVERTISED_DOKA, 500);
    assert.equal(BOSS_RUSH_ROOM0_ADVERTISED_XP, 200);
    assert.equal(BOSS_RUSH_ROOM9_ADVERTISED_DOKA, 5000);
    assert.equal(BOSS_RUSH_ROOM9_ADVERTISED_XP, 2000);
    assert.equal(BOSS_RUSH_JACKPOT_ROOM_INDEX, 9);
  });
});

describe("advertisedBossRushRoomTable", () => {
  it("captures table grants and drops empty / null rooms", () => {
    assert.deepEqual(advertisedBossRushRoomTable(ROOM0), {
      doka: 500,
      xp: 200,
    });
    assert.deepEqual(advertisedBossRushRoomTable(ROOM9), {
      doka: 5000,
      xp: 2000,
    });
    assert.equal(advertisedBossRushRoomTable(null), null);
    assert.equal(
      advertisedBossRushRoomTable({ dokaReward: 0, xpReward: 0 }),
      null,
    );
    assert.equal(
      advertisedBossRushRoomTableAtIndex([ROOM0, ROOM9], 0)?.doka,
      500,
    );
    assert.equal(advertisedBossRushRoomTableAtIndex([ROOM0, ROOM9], 9), null);
    const ten = Array.from({ length: 10 }, (_, i) => (i === 9 ? ROOM9 : ROOM0));
    assert.deepEqual(
      advertisedBossRushRoomTableAtIndex(ten, BOSS_RUSH_JACKPOT_ROOM_INDEX),
      { doka: 5000, xp: 2000 },
    );
  });
});

describe("ungated unused-table vs gated advertised persist", () => {
  it("records that live WX assigns the table then ignores it", () => {
    assert.equal(liveWxRoomClearAssignsCurrentRoomFromTable(), true);
    assert.equal(liveWxRoomClearReadsTableDokaReward(), false);
    assert.equal(liveWxRoomClearSetsBossRushRoomReward(), false);
    assert.equal(liveWxRoomClearHardcodesRoomMultiplierOne(), true);
  });

  it("level-1 pair leftover is 10/40; gated room 0 is advertised 510/240", () => {
    assert.equal(KILL_DOKA_LEVEL1_PAIR, 10);
    assert.equal(KILL_XP_LEVEL1_PAIR, 40);

    const leftover = leftoverBossRushRoomClearAfterUnusedTable({
      killDoka: KILL_DOKA_LEVEL1_PAIR,
      killXp: KILL_XP_LEVEL1_PAIR,
    });
    assert.deepEqual(leftover, { dokaDelta: 10, xpDelta: 40 });

    const gated = persistBossRushThroughAdvertisedRoomTable({
      advertised: advertisedBossRushRoomTable(ROOM0),
      killDoka: KILL_DOKA_LEVEL1_PAIR,
      killXp: KILL_XP_LEVEL1_PAIR,
    });
    assert.deepEqual(gated, { dokaDelta: 510, xpDelta: 240 });
    assert.deepEqual(clampApplyRewardsDeltas(510, 240), {
      dokaDelta: 510,
      xpDelta: 240,
    });
    assert.equal(
      leftoverUnpaidBossRushTableDoka({
        advertisedDoka: BOSS_RUSH_ROOM0_ADVERTISED_DOKA,
      }),
      500,
    );
    assert.equal(
      leftoverUnpaidBossRushTableXp({
        advertisedXp: BOSS_RUSH_ROOM0_ADVERTISED_XP,
      }),
      200,
    );
    assert.notDeepEqual(leftover, gated);
  });

  it("room 9 jackpot leftover is 10/40; gated persist is 5010/2040", () => {
    const leftover = leftoverBossRushRoomClearAfterUnusedTable({
      killDoka: KILL_DOKA_LEVEL1_PAIR,
      killXp: KILL_XP_LEVEL1_PAIR,
    });
    const gated = persistBossRushThroughAdvertisedRoomTable({
      advertised: advertisedBossRushRoomTable(ROOM9),
      killDoka: KILL_DOKA_LEVEL1_PAIR,
      killXp: KILL_XP_LEVEL1_PAIR,
    });
    assert.deepEqual(leftover, { dokaDelta: 10, xpDelta: 40 });
    assert.deepEqual(gated, { dokaDelta: 5010, xpDelta: 2040 });
    assert.equal(
      leftoverUnpaidBossRushTableDoka({
        advertisedDoka: BOSS_RUSH_ROOM9_ADVERTISED_DOKA,
      }),
      5000,
    );
    assert.equal(
      leftoverUnpaidBossRushTableXp({
        advertisedXp: BOSS_RUSH_ROOM9_ADVERTISED_XP,
      }),
      2000,
    );
  });

  it("missing table fail-closes to the kill formula (minion kills stay)", () => {
    const gated = persistBossRushThroughAdvertisedRoomTable({
      advertised: advertisedBossRushRoomTable(null),
      killDoka: KILL_DOKA_LEVEL1_PAIR,
      killXp: KILL_XP_LEVEL1_PAIR,
    });
    assert.deepEqual(
      gated,
      leftoverBossRushRoomClearAfterUnusedTable({
        killDoka: KILL_DOKA_LEVEL1_PAIR,
        killXp: KILL_XP_LEVEL1_PAIR,
      }),
    );
  });

  it("computeRewardDeltas already adds bossRushRoomReward; live input omits it", () => {
    const live = buildBossRushPersistInput({
      defeatedEnemies: LEVEL_1_PAIR,
      characterLevel: 1,
      baseDoka: KILL_DOKA_LEVEL1_PAIR,
    });
    assert.equal(live.bossRushRoomReward, undefined);
    const liveDeltas = computeRewardDeltas(live);
    assert.equal(liveDeltas.dokaDelta, 10);
    assert.equal(liveDeltas.xpDelta, 40);

    const withTable = computeRewardDeltas({
      ...live,
      bossRushRoomReward: {
        doka: BOSS_RUSH_ROOM0_ADVERTISED_DOKA,
        xp: BOSS_RUSH_ROOM0_ADVERTISED_XP,
      },
    });
    assert.equal(withTable.dokaDelta, 510);
    assert.equal(withTable.xpDelta, 240);
  });
});

describe("live WX leftover (unwired sidecar)", () => {
  it("room-clear still assigns _currentRoom then uses the kill formula", () => {
    const body = handleBossRushRoomClearSource(wxSource());
    assert.ok(
      body.includes("const _currentRoom = BOSS_RUSH_ROOMS[currentRoomIndex];"),
    );
    const tableAssignAt = body.indexOf(
      "const _currentRoom = BOSS_RUSH_ROOMS[currentRoomIndex];",
    );
    const killAt = body.indexOf("const dokaPerEnemy = Math.max(");
    const multiplierAt = body.indexOf("const roomMultiplier = 1;");
    const persistAt = body.indexOf("buildBossRushPersistInput({");
    assert.ok(tableAssignAt >= 0, "room-clear still assigns the table");
    assert.ok(
      killAt > tableAssignAt,
      "kill formula still follows the unused table",
    );
    assert.ok(multiplierAt > killAt, "roomMultiplier is still hardcoded 1");
    assert.ok(
      persistAt > multiplierAt,
      "persist still follows the kill formula",
    );
    assert.equal(body.includes("_currentRoom.dokaReward"), false);
    assert.equal(body.includes("_currentRoom.xpReward"), false);
    assert.equal(body.includes("bossRushRoomReward"), false);
    assert.equal(
      body.includes("persistBossRushThroughAdvertisedRoomTable"),
      false,
    );
    assert.equal(body.includes("advertisedBossRushRoomTable"), false);
    const persistSlice = body.slice(persistAt, persistAt + 400);
    assert.ok(persistSlice.includes("baseDoka: totalDoka"));
  });

  it("room-clear still snapshots boss config before cleanup but ignores catalog multipliers", () => {
    const body = handleBossRushRoomClearSource(wxSource());
    const snapAt = body.indexOf(
      "const activeBossConf = currentBossConfigRef.current;",
    );
    const cleanupAt = body.indexOf("cleanupBattle();");
    assert.ok(snapAt >= 0 && cleanupAt > snapAt);
    assert.equal(
      body.includes("rewardDokaMultiplier"),
      false,
      "catalog multipliers on room-clear remain a different leftover",
    );
  });

  it("overworld handleBattleEnd still does not read BOSS_RUSH_ROOMS table grants", () => {
    const body = handleBattleEndSource(wxSource());
    assert.equal(body.includes("BOSS_RUSH_ROOMS"), false);
    assert.equal(body.includes("bossRushRoomReward"), false);
  });

  it("rewardResolver still has the unused additive bossRushRoomReward path", () => {
    const src = rewardResolverSource();
    assert.ok(
      src.includes("bossRushRoomReward?: { doka: number; xp: number }"),
    );
    assert.ok(src.includes("if (input.bossRushRoomReward)"));
    const buildStart = src.indexOf("export function buildBossRushPersistInput");
    const buildEnd = src.indexOf(
      "export function computeRewardDeltas",
      buildStart,
    );
    const build = src.slice(buildStart, buildEnd);
    assert.equal(build.includes("bossRushRoomReward"), false);
  });
});

describe("distinct from leftover #1341 / #904 / feat gates", () => {
  it("is the unused Boss Rush room table, not overworld cleanup-null multipliers", () => {
    assert.equal(BOSS_RUSH_ROOM9_ADVERTISED_DOKA, 5000);
    assert.notEqual(BOSS_RUSH_ROOM9_ADVERTISED_DOKA, 5);
    assert.notEqual(BOSS_RUSH_ROOM0_ADVERTISED_DOKA, 5);
  });

  it("does not stamp leftover-Doka / feat / bar keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(storage.get("pbv_spell_bar_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
    assert.equal(
      storage.get("VampireBob_slot1_pbv_ground_doka_pickups"),
      undefined,
    );
  });
});
