import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AchievementConfig } from "../types/gameTypes.ts";
import { shouldDeferAchievementUnlockUntilRewardsPersist } from "./adminSafety.ts";
import {
  appendRecapUnlock,
  attachRecapUnlocks,
  recapUnlocksFromData,
} from "./recapUnlocks.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

const feat = (id: string): AchievementConfig => ({
  id,
  name: id,
  description: "",
  dokaReward: 50,
  condition: id,
  active: true,
});

describe("appendRecapUnlock", () => {
  it("appends a new feat and ignores a duplicate id", () => {
    const first = feat("first_battle_win");
    const once = appendRecapUnlock([], first);
    assert.deepEqual(once, [first]);
    assert.deepEqual(appendRecapUnlock(once, first), [first]);
  });
});

describe("attachRecapUnlocks", () => {
  it("copies the snapshot onto recap data without mutating the source", () => {
    const unlocks = [feat("critical_5_in_battle")];
    const recap = { mapTitle: "room", xpEarned: 20 };
    const attached = attachRecapUnlocks(recap, unlocks);
    assert.equal(attached.mapTitle, "room");
    assert.deepEqual(attached.newlyUnlockedAchievements, unlocks);
    unlocks.push(feat("pacifist_run"));
    assert.equal(attached.newlyUnlockedAchievements.length, 1);
  });
});

describe("recapUnlocksFromData", () => {
  it("prefers an explicit prop, else the recap payload", () => {
    const fromData = [feat("level_10")];
    const fromProp = [feat("doka_1000")];
    assert.deepEqual(recapUnlocksFromData(fromData, fromProp), fromProp);
    assert.deepEqual(recapUnlocksFromData(fromData, []), fromData);
    assert.deepEqual(recapUnlocksFromData(undefined, []), []);
  });
});

describe("Boss Rush room-clear recap payload", () => {
  it("carries combat feats on the app-root recap and omits wallet/level persist feats", () => {
    // #319: victory gate routes room-clear to handleBossRushRoomClear, which
    // used to skip checkAndFireAchievement. The popup reads
    // BattleRecapData.newlyUnlockedAchievements — a WorldExploration-only
    // list never reaches App. Same funnel as handleBattleEnd: conditions →
    // skip deferred wallet/level feats → appendRecapUnlock → attachRecapUnlocks.
    let unlocks: AchievementConfig[] = [];
    for (const condition of clientTrustedVictoryAchievementConditions({
      hp: 1,
      mapsVisited: 3,
      groundDokaPickups: 0,
      spellBarCount: 4,
      hasSpellAtLeast5: false,
      critHits: 5,
      pacifist: true,
      betrayal: false,
      doubleBetrayal: false,
      leaderSlain: true,
      bossId: "starved_pawn",
    })) {
      if (shouldDeferAchievementUnlockUntilRewardsPersist(condition)) continue;
      unlocks = appendRecapUnlock(unlocks, feat(condition));
    }
    const recap = attachRecapUnlocks(
      { mapTitle: "Boss Rush 3", xpEarned: 40, isBossRush: true },
      unlocks,
    );
    const ids = recap.newlyUnlockedAchievements.map((a) => a.id);
    assert.equal(ids.includes("first_battle_win"), true);
    assert.equal(ids.includes("pacifist_run"), true);
    assert.equal(ids.includes("leader_slayer"), true);
    assert.equal(ids.includes("survive_1hp"), true);
    assert.equal(ids.includes("critical_5_in_battle"), true);
    assert.equal(ids.includes("boss_defeated_starved_pawn"), true);
    assert.equal(ids.includes("doka_1000"), false);
    assert.equal(ids.includes("doka_10000"), false);
    assert.equal(ids.includes("level_10"), false);
    assert.equal(recap.mapTitle, "Boss Rush 3");
  });
});
