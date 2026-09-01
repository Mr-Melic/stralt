import assert from "node:assert/strict";
import {
  achievementUnlockRejected,
  clampDungeonDepth,
  isBanReasonKey,
  isBuiltInSpellId,
  maxPersistedHp,
  safeExternalHref,
  shouldCountBossRushRun,
  shouldDeferAchievementUnlockUntilRewardsPersist,
  shouldIncludeBackendSpellInLibrary,
  shouldRejectInactiveAchievementUnlock,
  shouldRejectRetiredSpellUpgrade,
  shouldWipeAchievementsOnBan,
  thresholdAchievementConditionsFromPersist,
  unsafeUrl,
  validateAdBox,
  validateAssignRole,
  validateChangelog,
  validateDokaGrant,
  validateEnemyName,
  validateGameConfig,
  validateJsonBlob,
  validateLevelUpConfig,
  validateOptionalUrl,
  validateSpellConfig,
  validateTierSpawnConfig,
  validateWalkFrameUrls,
  wouldSelfDemote,
} from "./adminSafety.ts";

const validLevelUp = {
  statGrowthPercent: 5,
  apMpLevelThreshold: 25,
  spellLevelingBaseCost: 10,
  spellLevelingCostMultiplier: 2,
  spellDmgGrowthPercent: 3,
  maxSpellRange: 5,
  spellRangeGrowthLevels: 10,
  spellFailBaseChance: 20,
  spellFailReductionPerLevel: 0.1,
};

// Failure: statGrowthPercent=0 is the seed sentinel and would look uninitialized.
assert.equal(
  validateLevelUpConfig({ ...validLevelUp, statGrowthPercent: 0 }),
  "statGrowthPercent must be between 1 and 50",
);
// Failure: apMpLevelThreshold=0 is used as a divisor on clients.
assert.equal(
  validateLevelUpConfig({ ...validLevelUp, apMpLevelThreshold: 0 }),
  "apMpLevelThreshold must be between 1 and 100",
);
// Failure: base cost 0 makes every spell upgrade free.
assert.equal(
  validateLevelUpConfig({ ...validLevelUp, spellLevelingBaseCost: 0 }),
  "spellLevelingBaseCost must be between 1 and 1000000",
);
assert.equal(validateLevelUpConfig(validLevelUp), null);

// Failure: NaN / negative spawn weights invert or break tier rolls.
assert.ok(
  validateTierSpawnConfig({
    tierSize: 0,
    sameTierPercent: 60,
    adjacentTierPercent: 20,
    twoAwayPercent: 10,
    threeOrMorePercent: 5,
  }),
);
assert.ok(
  validateTierSpawnConfig({
    tierSize: 10,
    sameTierPercent: -1,
    adjacentTierPercent: 20,
    twoAwayPercent: 10,
    threeOrMorePercent: 5,
  }),
);
assert.equal(
  validateTierSpawnConfig({
    tierSize: 10,
    sameTierPercent: 60,
    adjacentTierPercent: 20,
    twoAwayPercent: 10,
    threeOrMorePercent: 5,
  }),
  null,
);

assert.ok(
  validateGameConfig({
    dokaSpawnChance: 40,
    leaderBoostPercent: 250,
    dokaSpawnBaseValue: 5,
  }),
);
assert.equal(
  validateGameConfig({
    dokaSpawnChance: 0,
    leaderBoostPercent: 10,
    dokaSpawnBaseValue: 5,
  }),
  null,
);

// Failure: minRange > maxRange is a stale targeting payload.
assert.equal(
  validateSpellConfig({
    id: "void_bolt",
    name: "Void Bolt",
    apCost: 3,
    minRange: 5,
    maxRange: 2,
    spellType: "damage",
    effectType: "damage",
    effectCategory: "damage",
  }),
  "minRange cannot exceed maxRange",
);
assert.ok(
  validateSpellConfig({
    id: "void_bolt",
    name: "Void Bolt",
    apCost: 3,
    minRange: 1,
    maxRange: 3,
    spellType: "explode",
    effectType: "damage",
    effectCategory: "damage",
  }),
);

assert.equal(validateDokaGrant(0), "Grant amount must be greater than 0");
assert.ok(validateDokaGrant(10_000_001));
assert.equal(validateDokaGrant(100), null);

assert.equal(validateAssignRole("admn"), 'role must be "admin" or "user"');
assert.equal(validateAssignRole("guest"), 'role must be "admin" or "user"');
assert.equal(validateAssignRole("admin"), null);
assert.equal(wouldSelfDemote("aaaa", "aaaa", "user"), true);
assert.equal(wouldSelfDemote("aaaa", "bbbb", "user"), false);

assert.equal(shouldWipeAchievementsOnBan(), false);

assert.equal(unsafeUrl("javascript:alert(1)"), true);
assert.equal(unsafeUrl("JavaScript:alert(1)"), true);
assert.equal(unsafeUrl(" javascript:alert(1)"), true);
assert.equal(unsafeUrl("  DATA:text/html,x"), true);
assert.ok(validateOptionalUrl("linkUrl", "javascript:alert(1)"));
assert.ok(validateOptionalUrl("linkUrl", "JavaScript:alert(1)"));
assert.ok(validateOptionalUrl("linkUrl", "  DATA:text/html,x"));
assert.equal(validateOptionalUrl("linkUrl", "https://example.com"), null);
assert.equal(
  safeExternalHref("https://example.com/ad"),
  "https://example.com/ad",
);
assert.equal(safeExternalHref("https://example.com"), "https://example.com");
assert.equal(safeExternalHref("javascript:alert(1)"), "#");
assert.equal(safeExternalHref("  JavaScript:alert(1)"), "#");
assert.ok(validateWalkFrameUrls(["javascript:alert(1)"]));
assert.equal(validateWalkFrameUrls(["https://cdn.example/f.png"]), null);
assert.ok(validateAdBox(0, "javascript:x", "https://ok.example"));
assert.equal(
  validateAdBox(0, "https://cdn.example/a.png", "https://ok.example"),
  null,
);

// Failure: banPlayer wrote reasons to public getChangelog("ban#<principal>").
assert.equal(isBanReasonKey("ban#aaaaa-aa"), true);
assert.equal(isBanReasonKey("v163"), false);
assert.ok(validateChangelog("ban#aaaaa-aa", "non-payment"));
assert.equal(validateChangelog("v164", "notes"), null);

assert.ok(validateEnemyName(""));
assert.ok(validateEnemyName("x".repeat(101)));
assert.equal(validateEnemyName("Malachar"), null);

// Failure: upgradeSpell appended a retired catalog id the player never owned.
assert.equal(
  shouldRejectRetiredSpellUpgrade({
    usableByPlayer: false,
    alreadyOwned: false,
  }),
  true,
);
assert.equal(
  shouldRejectRetiredSpellUpgrade({
    usableByPlayer: false,
    alreadyOwned: true,
  }),
  false,
);

// Failure: markAchievementUnlocked ignored active=false, so a retired
// achievement could still be unlocked and then claimed.
assert.equal(shouldRejectInactiveAchievementUnlock(false), true);
assert.equal(shouldRejectInactiveAchievementUnlock(true), false);

assert.equal(clampDungeonDepth(100), 16);
assert.equal(clampDungeonDepth(4), 4);

// Failure: saveBattleStats used level*200+100 (300 HP at level 1).
assert.equal(maxPersistedHp(1, 5), 100);
assert.equal(maxPersistedHp(10, 5), 145);
assert.equal(maxPersistedHp(20, 50), 1050);

// Failure: markAchievementUnlocked trusted client for wallet/level/spell feats.
assert.equal(achievementUnlockRejected("level_10", 9, 0, 0), "Level below 10");
assert.equal(achievementUnlockRejected("level_10", 10, 0, 0), null);
assert.equal(
  achievementUnlockRejected("doka_1000", 1, 999, 0),
  "Doka balance below 1000",
);
assert.equal(achievementUnlockRejected("doka_1000", 1, 1000, 0), null);
assert.equal(
  achievementUnlockRejected("doka_10000", 1, 9999, 0),
  "Doka balance below 10000",
);
assert.equal(
  achievementUnlockRejected("spell_level_5", 20, 0, 4),
  "No spell at level 5",
);
assert.equal(achievementUnlockRejected("spell_level_5", 20, 0, 5), null);
assert.equal(achievementUnlockRejected("first_battle_win", 1, 0, 0), null);

// Failure: victory fired doka_1000 / level_10 from projected recap totals
// (900 + 150, level 9 + XP) before applyRewards. Canister still had the
// pre-credit snapshot, so markAchievementUnlocked #err'd and the shown-set
// blocked the overworld retry after the credit landed.
assert.equal(
  shouldDeferAchievementUnlockUntilRewardsPersist("doka_1000"),
  true,
);
assert.equal(
  shouldDeferAchievementUnlockUntilRewardsPersist("doka_10000"),
  true,
);
assert.equal(shouldDeferAchievementUnlockUntilRewardsPersist("level_10"), true);
assert.equal(
  shouldDeferAchievementUnlockUntilRewardsPersist("first_battle_win"),
  false,
);
assert.equal(
  shouldDeferAchievementUnlockUntilRewardsPersist("spell_level_5"),
  false,
);
assert.deepEqual(
  thresholdAchievementConditionsFromPersist({ level: 9, doka: 900 }),
  [],
);
assert.deepEqual(
  thresholdAchievementConditionsFromPersist({ level: 9, doka: 1050 }),
  ["doka_1000"],
);
assert.deepEqual(
  thresholdAchievementConditionsFromPersist({ level: 10, doka: 1050 }),
  ["level_10", "doka_1000"],
);
assert.deepEqual(
  thresholdAchievementConditionsFromPersist({ level: 10, doka: 10000 }),
  ["level_10", "doka_1000", "doka_10000"],
);
assert.equal(
  achievementUnlockRejected("doka_1000", 1, 900, 0),
  "Doka balance below 1000",
);
assert.equal(achievementUnlockRejected("doka_1000", 1, 1050, 0), null);
assert.equal(
  achievementUnlockRejected("level_10", 9, 1050, 0),
  "Level below 10",
);
assert.equal(achievementUnlockRejected("level_10", 10, 1050, 0), null);

// Failure: completeBossRushRoom(9) while currentRoom stayed 9 incremented runs.
assert.equal(shouldCountBossRushRun(9, 9), true);
assert.equal(shouldCountBossRushRun(0, 9), false);
assert.equal(shouldCountBossRushRun(9, 8), false);
assert.ok(validateJsonBlob("bossRushConfig", "not-json"));
assert.equal(
  validateJsonBlob("bossRushConfig", '{"rewardMultiplier":1}'),
  null,
);
assert.equal(validateJsonBlob("colorPalette", ""), null);

assert.equal(isBuiltInSpellId("void_collapse"), true);
assert.equal(isBuiltInSpellId("custom_bolt"), false);

const owned = new Set(["void_collapse"]);
assert.equal(
  shouldIncludeBackendSpellInLibrary({
    usableByPlayer: false,
    spellId: "void_collapse",
    ownedSpellIds: owned,
  }),
  true,
);
assert.equal(
  shouldIncludeBackendSpellInLibrary({
    usableByPlayer: false,
    spellId: "new_bolt",
    ownedSpellIds: owned,
  }),
  false,
);
assert.equal(
  shouldIncludeBackendSpellInLibrary({
    usableByPlayer: true,
    spellId: "new_bolt",
    ownedSpellIds: owned,
  }),
  true,
);
