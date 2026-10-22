import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldDeferAchievementUnlockUntilRewardsPersist,
  thresholdAchievementConditionsFromPersist,
} from "./adminSafety.ts";
import { attachRecapUnlocks } from "./recapUnlocks.ts";
import {
  bossRushRoomClearPersistSuccessSteps,
  clientTrustedVictoryAchievementConditions,
  firePersistedThresholdUnlocks,
  recapUnlocksAfterBossRushPersist,
  shouldRefreshRecapAfterPersistedThresholdUnlocks,
} from "./victoryAchievements.ts";

const clean = {
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
  bossId: null,
};

describe("clientTrustedVictoryAchievementConditions", () => {
  it("always includes first_battle_win and never wallet/level persist feats", () => {
    const conditions = clientTrustedVictoryAchievementConditions(clean);
    assert.deepEqual(conditions, ["first_battle_win"]);
    for (const condition of conditions) {
      assert.equal(
        shouldDeferAchievementUnlockUntilRewardsPersist(condition),
        false,
      );
    }
  });

  it("Boss Rush room-clear with a leader kill and pacifist win lists those feats", () => {
    const conditions = clientTrustedVictoryAchievementConditions({
      ...clean,
      hp: 1,
      critHits: 5,
      pacifist: true,
      leaderSlain: true,
      bossId: "starved_pawn",
    });
    assert.ok(conditions.includes("first_battle_win"));
    assert.ok(conditions.includes("survive_1hp"));
    assert.ok(conditions.includes("critical_5_in_battle"));
    assert.ok(conditions.includes("pacifist_run"));
    assert.ok(conditions.includes("leader_slayer"));
    assert.ok(conditions.includes("boss_defeated_starved_pawn"));
    assert.equal(conditions.includes("doka_1000"), false);
    assert.equal(conditions.includes("level_10"), false);
  });

  it("omits combat feats when the room-clear snapshot is clean", () => {
    const conditions = clientTrustedVictoryAchievementConditions({
      ...clean,
      mapsVisited: 25,
      groundDokaPickups: 10,
      spellBarCount: 8,
      hasSpellAtLeast5: true,
    });
    assert.deepEqual(conditions, [
      "first_battle_win",
      "explore_25_maps",
      "loot_10_doka",
      "spell_master_8",
      "spell_level_5",
    ]);
    assert.equal(conditions.includes("pacifist_run"), false);
    assert.equal(conditions.includes("leader_slayer"), false);
  });
});

describe("firePersistedThresholdUnlocks", () => {
  it("fires wallet/level feats with inBattle=true after applyRewards", () => {
    const fired: Array<{ condition: string; inBattle: boolean }> = [];
    const conditions = firePersistedThresholdUnlocks({
      level: 10,
      doka: 10000,
      fire: (condition, inBattle) => {
        fired.push({ condition, inBattle });
      },
    });
    assert.deepEqual(conditions, ["level_10", "doka_1000", "doka_10000"]);
    assert.deepEqual(
      fired,
      conditions.map((condition) => ({ condition, inBattle: true })),
    );
    assert.equal(
      shouldRefreshRecapAfterPersistedThresholdUnlocks(conditions),
      true,
    );
  });

  it("does not fire below the wallet/level thresholds", () => {
    const fired: string[] = [];
    const conditions = firePersistedThresholdUnlocks({
      level: 9,
      doka: 900,
      fire: (condition) => {
        fired.push(condition);
      },
    });
    assert.deepEqual(conditions, []);
    assert.deepEqual(fired, []);
    assert.equal(
      shouldRefreshRecapAfterPersistedThresholdUnlocks(conditions),
      false,
    );
  });
});

describe("bossRushRoomClearPersistSuccessSteps", () => {
  it("fires recap unlocks before live hydrate when doka_1000 crossed", () => {
    const thresholdConditions = thresholdAchievementConditionsFromPersist({
      level: 9,
      doka: 1050,
    });
    assert.deepEqual(thresholdConditions, ["doka_1000"]);
    assert.deepEqual(
      bossRushRoomClearPersistSuccessSteps({
        thresholdConditions,
        hydrateLive: true,
      }),
      ["fire-threshold-in-battle", "refresh-recap", "hydrate-live"],
    );
  });

  it("still attaches recap unlocks when a death skipped live hydrate", () => {
    assert.deepEqual(
      bossRushRoomClearPersistSuccessSteps({
        thresholdConditions: ["level_10"],
        hydrateLive: false,
      }),
      ["fire-threshold-in-battle", "refresh-recap"],
    );
  });

  it("only hydrates when the credit did not cross a wallet/level feat", () => {
    assert.deepEqual(
      bossRushRoomClearPersistSuccessSteps({
        thresholdConditions: [],
        hydrateLive: true,
      }),
      ["hydrate-live"],
    );
  });
});

describe("recapUnlocksAfterBossRushPersist", () => {
  it("proves hydrate-first + cleanupBattle toasts instead of recap", () => {
    // Actual room-clear .then: cleanupBattle already set inBattle=false,
    // persist success hydrates doka, idle effect toasts, recap stays empty.
    assert.deepEqual(
      recapUnlocksAfterBossRushPersist({
        persistedLevel: 10,
        persistedDoka: 1050,
        fireBeforeHydrate: false,
        inBattleAfterCleanup: false,
      }),
      {
        recapConditions: [],
        toastConditions: ["level_10", "doka_1000"],
      },
    );
  });

  it("attaches wallet/level feats to recap when fired before hydrate", () => {
    const split = recapUnlocksAfterBossRushPersist({
      persistedLevel: 10,
      persistedDoka: 1050,
      fireBeforeHydrate: true,
      inBattleAfterCleanup: false,
    });
    assert.deepEqual(split, {
      recapConditions: ["level_10", "doka_1000"],
      toastConditions: [],
    });
    const recap = attachRecapUnlocks(
      { mapTitle: "Boss Rush - Room 1", dokaEarned: 150 },
      split.recapConditions.map((id) => ({
        id,
        name: id,
        description: "",
        dokaReward: 0,
        condition: id,
        active: true,
      })),
    );
    assert.deepEqual(
      recap.newlyUnlockedAchievements.map((a) => a.condition),
      ["level_10", "doka_1000"],
    );
  });
});
