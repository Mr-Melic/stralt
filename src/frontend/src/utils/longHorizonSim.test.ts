import assert from "node:assert/strict";
import {
  APPLY_REWARDS_MAX_DOKA_DELTA,
  APPLY_REWARDS_MAX_XP_DELTA,
} from "./applyRewardsResult.ts";
import {
  BATTLE_GRID_CELL_COUNT,
  BATTLE_START_PLAYER_IN_COMBATANTS_REF,
  BETRAYAL_ENRAGE_MULT,
  BLOOD_MEND_CRIT_HEAL,
  BLOOD_MEND_HEAL,
  BOSS_RUSH_ROOM0_CATALOG_DOKA,
  BOSS_RUSH_ROOM9_CATALOG_DOKA,
  CATALOG_BOSS_HP_SAMPLE,
  CHAOS_INITIATIVE_DISPATCHES_BEFORE_SHUFFLE,
  CHAOS_INITIATIVE_SHUFFLES_WHEN_INDEX_WRAPS_TO_ZERO,
  CRUSH_MELEE_SKIPS_PLAYER_TAKES_DAMAGE,
  CRUSH_MELEE_USES_GET_STAT_MODIFIER,
  DOKA_HEAL_HP_PER_DOKA,
  ENEMY_SUMMON_CAP_SIM,
  FALLBACK_CRUSH_RANGE,
  FALLBACK_FIREBOLT_RANGE,
  GLASS_REALM_DMG_MULT,
  HAZARD_LAVA_MAX,
  HEALTH_POTION_COST,
  INITIATIVE_OVERLAY_ENEMY_CHC,
  INITIATIVE_OVERLAY_ENEMY_RES,
  KIT_FROST_DAMAGE,
  KIT_INFERNO_DIRECT_DAMAGE,
  KIT_STRIKE_DAMAGE,
  LIFE_DRAIN_HEAL,
  MAX_ENEMIES_SIM,
  MIRROR_FIELD_CANCELS_HIT,
  MIRROR_FIELD_REFLECT_CHANCE,
  MIRROR_FIELD_SKIPS_PLAYER_TAKES_DAMAGE,
  OVERWORLD_SPAWN_SETS_SIDE,
  PAPER_WINDSTORM_ADVERTISED_RANGE_REDUCTION,
  PAPER_WINDSTORM_PLAYER_MISS_CHANCE,
  PAPER_WINDSTORM_RANGE_REDUCTION_APPLIED,
  PLAYER_CREATE_EVASION,
  PLAYER_CREATE_INIT,
  PLAYER_CREATE_RESILIENCE,
  PLAYER_CREATE_SR,
  PLAYER_DAMAGE_DEALT_ATTACKER_IS_LIVE_STATS,
  PLAYER_SUMMON_CAP_LIVE,
  PLAYER_TURN_START_COMMITS_MENDING_MIST,
  SHIELD_CHARM_ABSORB,
  SUMMON_ARCHER_HP_SCALE,
  SUMMON_BOMBER_HP_SCALE,
  SUMMON_GUARDIAN_HP_SCALE,
  SUMMON_HUNTER_HP_SCALE,
  SUMMON_SPAWN_SETS_ATK,
  TIDE_SHADE_MP_DEBUFF,
  TIME_WARP_TIMER_SECONDS,
  TITANS_VIGOR_DMG_MAX,
  VOID_MIRROR_HIT_STILL_LANDS,
  VOID_MIRROR_REFLECT_FRACTION,
  WORLD_BOSS_LEVEL_OFFSET,
  WORLD_BOSS_SPAWN_RES_CLAMP,
  arcaneSurgeApCost,
  bossRushCombatHp,
  bossRushEnemyLevel,
  bossRushRoomDoka,
  bossRushRoomXp,
  catalogSummonMaxHp,
  chaosInitiativePlayerFirstChance,
  crushMeleeResIfShieldApplied,
  crushOverKitRatio,
  damageAfterPlayerResPasses,
  damageAfterResThenMapMods,
  deathDokaLost,
  dokaFeverAppliesHpBonus,
  dokaFeverHpBonus,
  dokaHealCostToFillFrom,
  dungeonMaxEnemyLevel,
  effectiveSpellRange,
  fallbackCrushRaw,
  fallbackCrushRawEnraged,
  familyCatalogRes,
  familyCatalogSpRes,
  familySpawnHp,
  fightsToNextLevel,
  firstEnemyLevelCrushExceedsCritKit,
  firstEnemyLevelCrushExceedsKit,
  firstEnemyLevelCrushExceedsShield,
  firstEnemyLevelCrushOneShotsSummonHp,
  firstEnemyLevelEnragedCrushOneShots,
  firstEnemyLevelFrostTurnsAtLeast,
  firstEnemyLevelGroundDokaExceedsShrine,
  firstEnemyLevelOverlayApExceedsPlayerFormulaAp,
  firstEnemyLevelXpClampHits,
  firstHudSaturationLevel,
  firstLevelArcaneSurgeFrostCastsAtLeast,
  firstLevelChcCanHit100,
  firstLevelFormulaApExceedsPersistCap,
  firstLevelFormulaFrostCastsAtLeast,
  firstLevelFormulaMpAtLeast,
  firstLevelFormulaMpCoversGridWalk,
  firstLevelFormulaSummonCastsAtLeast,
  firstLevelFrostDumpSelfDamageExceeds,
  firstLevelFrostDumpWithMultExceeds,
  firstLevelHazardMaxBelowHpPercent,
  firstLevelIronCursedResCanHit100,
  firstLevelLinearHpNotSafeInteger,
  firstLevelResCanHit100,
  firstLevelSpellFailHitsZero,
  firstLevelSpellRangeHitsCap,
  firstLevelStackedArcaneFrostCastsAtLeast,
  firstLevelTideShadeDebuffBelowMpPercent,
  firstLevelTimestepFrostCastsAtLeast,
  firstPlayerLevelBossRushCrushOneShots,
  firstPlayerLevelBossRushHpExceedsCatalog,
  firstPlayerLevelBossRushRoomDokaExceedsCatalog,
  firstPlayerLevelBossRushRoomDokaHitsClamp,
  firstPlayerLevelBossRushRoomXpHitsClamp,
  firstPlayerLevelDokaHealFromOneExceeds,
  firstPlayerLevelMistRegenExceeds,
  firstPlayerLevelPotionBeatsFlatDokaHeal,
  firstPlayerLevelSacrificeRawExceeds,
  firstPlayerLevelSummonMaxInitExceedsCreate,
  firstPlayerLevelSummonMeleeExceeds,
  firstPlayerLevelSummonResCanHit100,
  firstPlayerLevelSurvivesCrushRecv,
  firstPlayerLevelWorldBossStatCanHit100,
  firstSpellLevelCostExceeds,
  firstStressLevelFullyUnderDungeonCap,
  formulaAp,
  formulaMp,
  frostCastsPerTimerSecond,
  frostCastsWithTimestepRefill,
  frostDumpMirrorFieldExpectedSelfDamage,
  frostDumpPaperWindstormExpectedHits,
  frostDumpPaperWindstormExpectedMisses,
  frostDumpVoidMirrorSelfDamage,
  frostPreCritDmgBm,
  glassChip1,
  gridWalkMpCost,
  groundDokaMean,
  healthPotionDokaPerHp,
  healthPotionHpRestored,
  ironCursedRes,
  jackpotPersistIfHit,
  jackpotUnclampedMean,
  kitCastRaw,
  kitForPieceName,
  kitForZoneInput,
  linearEnemyMaxHp,
  linearPlayerMaxHp,
  mendingMistRegenAtPlayerLevel,
  mirrorFieldReflect,
  officialStackedXp,
  overlayEnemyAp,
  overlayEnemyAtk,
  overlayEnemyMp,
  overworldPickMaxLevel,
  paperWindstormEnemyMissChance,
  passiveRegenSecondsToFull,
  playerCombatantsRefHasPlayerEntry,
  playerFrostCastsPerTurn,
  playerFrostCastsPerTurnWithArcaneSurge,
  playerFrostCastsPerTurnWithStackedArcane,
  playerFrostRaw,
  playerFrostTurnsToKill,
  playerFrostTurnsToKillHp,
  playerSummonCastsPerTurn,
  playerSummonStatBounds,
  runLongHorizonSim,
  sacrificeDamageAfterEnemyRes,
  sacrificeRawAtFullHp,
  spawnPlaceholderDamage,
  spawnPlaceholderHp,
  spellFailChance,
  spellUpgradeCostBigInt,
  stackedArcaneDiscountApCost,
  starterDireWolfApCost,
  starterDireWolfCooldownTurns,
  starterFrostCooldownTurns,
  starterSacrificeApCost,
  starterSacrificeCooldownTurns,
  starterShieldResMultiplier,
  starterTimestepApCost,
  starterTimestepCooldownTurns,
  starterTimestepIsOncePerBattle,
  summonMeleeRaw,
  summonerChance,
  tideShadeMpDebuffOverFormulaMp,
  titansGlassMaxChip1,
  titansMaxChip1,
  titansVigorHp,
  vampiricHeal,
  victoryHpFloor,
  voidMirrorFamilyChance,
  voidMirrorReflect,
  walkCostPerTile,
  worldBossChip1FrostTurns,
  worldBossEnemyLevel,
  xpNeedExactAsNumber,
} from "./longHorizonSim.ts";
import { applyXpDelta, xpForNextLevel } from "./xpCurve.ts";

const report = runLongHorizonSim();

assert.equal(xpForNextLevel(1), 100);
assert.equal(xpForNextLevel(10), 51200);
assert.equal(xpForNextLevel(25), 1_677_721_600);
assert.equal(Number.isFinite(xpForNextLevel(1018)), true);
assert.equal(
  Number.isFinite(xpForNextLevel(1019)),
  true,
  "HUD saturates at MAX_SAFE_INTEGER — Infinity used to freeze leftover bars",
);
assert.equal(xpForNextLevel(1019), Number.MAX_SAFE_INTEGER);
assert.equal(firstHudSaturationLevel(), 48);
assert.equal(xpForNextLevel(47) < Number.MAX_SAFE_INTEGER, true);
assert.equal(xpForNextLevel(48), Number.MAX_SAFE_INTEGER);
assert.equal(Number.isFinite(xpNeedExactAsNumber(1018)), true);
assert.equal(Number.isFinite(xpNeedExactAsNumber(1019)), false);
assert.deepEqual(applyXpDelta(0, 48, 1), { newXp: 1, newLevel: 48 });
assert.deepEqual(applyXpDelta(0, 1018, 1), { newXp: 1, newLevel: 1018 });

assert.equal(victoryHpFloor(10) > linearPlayerMaxHp(10), true);
assert.equal(formulaAp(325) > 20, true);
assert.equal(spellFailChance(201), 0);
assert.ok(summonerChance(44) >= 1);
assert.equal(spawnPlaceholderDamage(14) > 30, true);
assert.equal(spawnPlaceholderDamage(24) > 50, true);
assert.equal(firstLevelResCanHit100("rook"), 78);

assert.deepEqual(kitForZoneInput("queen", 2), [
  "spell-inferno",
  "starter-heal",
]);
assert.deepEqual(kitForZoneInput("queen", { name: "Tier 25 Zone" }), [
  "starter-frost",
]);

assert.ok((report.xpRows.find((r) => r.level === 25)?.fightsToNext ?? 0) > 1e6);
assert.ok((report.xpRows.find((r) => r.level === 1)?.enemyLevelMax ?? 0) >= 70);
assert.equal(report.catalog.starterSpellCount, 32);
assert.equal(report.telemetry.available, false);
assert.equal(report.persistContract.hudSaturationLevel, 48);
assert.equal(report.saveBattleStatsLevelUnconstrained, false);

assert.ok(fightsToNextLevel(15, 15) > 100);

assert.ok(jackpotUnclampedMean(1) > APPLY_REWARDS_MAX_DOKA_DELTA);
assert.equal(jackpotPersistIfHit(1), APPLY_REWARDS_MAX_DOKA_DELTA);
assert.equal(firstEnemyLevelXpClampHits(3, 6, true), 926);
assert.ok(officialStackedXp(1020, 3, 6, true) > APPLY_REWARDS_MAX_XP_DELTA);
assert.equal(
  report.xpRows.find((r) => r.level === 1000)?.stackedXpTruncated,
  true,
);
assert.equal(
  report.xpRows.some((r) => r.level === 10_000),
  true,
);
assert.equal(report.xpRows.find((r) => r.level === 10_000)?.pBelowTier, 1);
assert.equal(report.xpRows.find((r) => r.level === 50_000)?.pBelowTier, 1);
assert.equal(
  report.xpRows.some((r) => r.level === 100_000),
  true,
);
assert.equal(report.xpRows.find((r) => r.level === 100_000)?.pBelowTier, 1);
assert.equal(report.persistContract.saveBattleStatsCannotLowerLevel, true);
assert.equal(report.persistContract.maxDokaGrant, 10_000_000);
assert.equal(report.persistContract.gameKeyBypassesApplyRewardsCeiling, true);
assert.equal(spellUpgradeCostBigInt(0), 10n);
assert.equal(spellUpgradeCostBigInt(14), 163_840n);
assert.equal(firstSpellLevelCostExceeds(100_000), 14);
assert.equal(firstSpellLevelCostExceeds(10_000_000), 20);
assert.equal(report.persistContract.firstSpellLevelCombatDokaCannotBuy, 14);
assert.equal(report.persistContract.firstSpellLevelGameKeyCannotBuy, 20);
assert.equal(PLAYER_CREATE_INIT, 10);
assert.equal(report.persistContract.playerCreateInit, 10);
assert.equal(report.persistContract.saveBattleStatsCannotRaiseInit, true);
assert.equal(report.persistContract.maxPersistedAp, 20);
assert.equal(firstLevelFormulaApExceedsPersistCap(), 325);
assert.equal(report.persistContract.firstLevelFormulaApExceedsPersistCap, 325);
assert.equal(firstLevelChcCanHit100("bishop"), 115);
assert.equal(firstLevelChcCanHit100("king"), 138);
assert.ok(
  (report.xpRows.find((r) => r.level === 25)?.pPlayerWinsInitiative3 ?? 1) <
    0.15,
);
assert.ok(
  (report.xpRows.find((r) => r.level === 100)?.pPlayerWinsInitiative3 ?? 1) <
    0.05,
);
assert.equal(report.chcBreakpoints.bishop, 115);
assert.equal(report.chcBreakpoints.king, 138);

assert.equal(firstLevelHazardMaxBelowHpPercent(HAZARD_LAVA_MAX, 0.05), 42);
assert.equal(firstLevelHazardMaxBelowHpPercent(HAZARD_LAVA_MAX, 0.01), 282);
assert.equal(report.flatHazards.firstLevelLavaMaxBelow5PctHp, 42);
assert.equal(report.flatHazards.firstLevelLavaMaxBelow1PctHp, 282);
assert.ok((report.flatHazards.lavaMaxOverHpAt100000 ?? 1) < 0.0001);

assert.equal(effectiveSpellRange(1, 1), 1);
assert.equal(effectiveSpellRange(4, 10), 5);
assert.equal(effectiveSpellRange(3, 20), 5);
assert.equal(effectiveSpellRange(1, 40), 5);
assert.equal(
  effectiveSpellRange(0, 1),
  1,
  "spellRangeBase lifts stored 0 to 1",
);
assert.equal(firstLevelSpellRangeHitsCap(4), 10);
assert.equal(firstLevelSpellRangeHitsCap(3), 20);
assert.equal(firstLevelSpellRangeHitsCap(1), 40);
assert.equal(report.spellRangeCap.firstLevelRange4HitsCap, 10);
assert.equal(report.spellRangeCap.allStarterRangesAtCapBy, 40);
assert.equal(report.xpRows.find((r) => r.level === 50)?.spellRangeStrike, 5);

assert.equal(BLOOD_MEND_HEAL, 12);
assert.equal(BLOOD_MEND_CRIT_HEAL, 24);
assert.equal(LIFE_DRAIN_HEAL, 5);
assert.equal(firstLevelHazardMaxBelowHpPercent(BLOOD_MEND_HEAL, 0.05), 30);
assert.equal(firstLevelHazardMaxBelowHpPercent(BLOOD_MEND_HEAL, 0.01), 222);
assert.equal(firstLevelHazardMaxBelowHpPercent(BLOOD_MEND_CRIT_HEAL, 0.05), 78);
assert.equal(firstLevelHazardMaxBelowHpPercent(LIFE_DRAIN_HEAL, 0.05), 2);
assert.equal(report.flatHeals.firstLevelBloodMendBelow5PctHp, 30);
assert.equal(report.flatHeals.firstLevelBloodMendBelow1PctHp, 222);
assert.equal(report.flatHeals.shopPotionScalesWithMaxHp, true);
assert.ok((report.flatHeals.bloodMendOverHpAt100000 ?? 1) < 0.0001);

assert.equal(firstLevelSpellFailHitsZero(), 201);
assert.equal(spellFailChance(15) > 18, true);
assert.equal(spellFailChance(101), 10);
assert.equal(report.spellFail.firstLevelHitsZero, 201);
assert.equal(report.spellFail.chanceAt201, 0);
assert.equal(report.spellFail.physicalBypassesFail, true);

assert.equal(BETRAYAL_ENRAGE_MULT, 6);
assert.equal(firstEnemyLevelEnragedCrushOneShots(1), 9);
assert.equal(SHIELD_CHARM_ABSORB, 20);
assert.equal(firstEnemyLevelCrushExceedsShield(), 11);
assert.equal(HEALTH_POTION_COST, 50);
assert.equal(healthPotionHpRestored(1), 30);
assert.ok(healthPotionDokaPerHp(1000) < healthPotionDokaPerHp(1));
assert.equal(deathDokaLost(10_000_000), 4_000_000);
assert.equal(report.betrayalEnrage.mult, 6);
assert.equal(report.buffShop.firstEnemyLevelCrushExceedsShield, 11);
assert.equal(report.buffShop.deathDokaLostOnMaxGameKey, 4_000_000);
assert.equal(
  report.persistContract.firstPlayerLevelSurvivesEnragedCrushAt1020,
  firstPlayerLevelSurvivesCrushRecv(
    damageAfterPlayerResPasses(fallbackCrushRawEnraged(1020)),
  ),
);

assert.equal(kitCastRaw(KIT_STRIKE_DAMAGE), 10);
assert.equal(kitCastRaw(KIT_FROST_DAMAGE), 20);
assert.equal(KIT_INFERNO_DIRECT_DAMAGE, 0);
assert.equal(firstEnemyLevelCrushExceedsKit(KIT_FROST_DAMAGE), 9);
assert.equal(firstEnemyLevelCrushExceedsKit(KIT_STRIKE_DAMAGE), 1);
assert.equal(fallbackCrushRaw(9), 22);
assert.ok(crushOverKitRatio(80, KIT_FROST_DAMAGE) > 9);
assert.ok(crushOverKitRatio(1020, KIT_FROST_DAMAGE) > 120);
assert.equal(report.kitVsCrush.firstEnemyLevelCrushExceedsFrost, 9);
assert.equal(report.kitVsCrush.calcScaledDamageIgnoresCasterLevel, true);
assert.equal(passiveRegenSecondsToFull(1), 1000);
assert.equal(passiveRegenSecondsToFull(10), 1450);
assert.ok(passiveRegenSecondsToFull(1000) > 50_000);
assert.equal(report.passiveRegen.secondsToFullAt1, 1000);
assert.equal(report.passiveRegen.intervalMs, 10_000);

assert.equal(playerFrostRaw(0), 21);
assert.equal(playerFrostRaw(14), 32);
assert.equal(playerFrostCastsPerTurn(formulaAp(1)), 2);
assert.equal(playerFrostCastsPerTurn(formulaAp(1000)), 16);
assert.equal(playerFrostTurnsToKill(1020, 1), 62);
assert.equal(playerFrostTurnsToKill(1020, 1000), 8);
assert.equal(playerFrostTurnsToKill(1020, 10_000), 1);
assert.equal(firstEnemyLevelFrostTurnsAtLeast(10, 1, 0, formulaAp(1)), 133);
assert.equal(report.playerFrostTtk.frostRaw, 21);
assert.equal(report.playerFrostTtk.turnsVs1020At1, 62);
assert.equal(report.playerFrostTtk.turnsVs1020At10000, 1);
assert.equal(report.playerFrostTtk.turnsVs1020At1000Persist20, 21);

assert.equal(catalogSummonMaxHp("hunter", SUMMON_HUNTER_HP_SCALE), 80);
assert.equal(catalogSummonMaxHp("archer", SUMMON_ARCHER_HP_SCALE), 42);
assert.equal(catalogSummonMaxHp("bomber", SUMMON_BOMBER_HP_SCALE), 25);
assert.equal(catalogSummonMaxHp("guardian", SUMMON_GUARDIAN_HP_SCALE), 180);
assert.equal(firstEnemyLevelCrushOneShotsSummonHp(80), 34);
assert.equal(firstEnemyLevelCrushOneShotsSummonHp(42), 18);
assert.equal(firstEnemyLevelCrushOneShotsSummonHp(25), 11);
assert.equal(firstEnemyLevelCrushOneShotsSummonHp(180), 75);
assert.equal(report.summonVsCrush.firstEnemyLevelHunter, 34);
assert.equal(report.summonVsCrush.summonerChanceAt44, 1);

assert.equal(groundDokaMean(1), 7);
assert.equal(groundDokaMean(148), 301);
assert.equal(groundDokaMean(1020), 2045);
assert.equal(firstEnemyLevelGroundDokaExceedsShrine(), 148);
assert.equal(report.secondaryDoka.firstEnemyLevelGroundExceedsShrine, 148);

assert.equal(bossRushEnemyLevel(1), 3);
assert.equal(bossRushCombatHp(1), 55);
assert.equal(bossRushCombatHp(120), 352);
assert.equal(firstPlayerLevelBossRushHpExceedsCatalog(), 120);
assert.equal(firstPlayerLevelBossRushCrushOneShots(1), null);
assert.equal(firstPlayerLevelBossRushCrushOneShots(BETRAYAL_ENRAGE_MULT), 11);
assert.deepEqual(kitForPieceName("Pale Archbishop", 0), ["physical_attack"]);
assert.deepEqual(kitForZoneInput("pawn", 0), ["physical_attack"]);
assert.equal(playerFrostTurnsToKill(bossRushEnemyLevel(10_000), 10_000), 9);
assert.equal(playerFrostTurnsToKill(bossRushEnemyLevel(100_000), 100_000), 9);
assert.equal(bossRushRoomDoka(1), 10);
assert.equal(bossRushRoomDoka(167), BOSS_RUSH_ROOM0_CATALOG_DOKA);
assert.equal(firstPlayerLevelBossRushRoomDokaExceedsCatalog(500), 168);
assert.equal(
  firstPlayerLevelBossRushRoomDokaExceedsCatalog(BOSS_RUSH_ROOM9_CATALOG_DOKA),
  1668,
);
assert.equal(firstPlayerLevelBossRushRoomDokaHitsClamp(), 33334);
assert.equal(firstPlayerLevelBossRushRoomXpHitsClamp(), 12499);
assert.ok(bossRushRoomXp(100_000) > APPLY_REWARDS_MAX_XP_DELTA);
assert.equal(CATALOG_BOSS_HP_SAMPLE, 350);
assert.equal(report.bossRushUncapped.firstPlayerLevelEnragedOneShot, 11);
assert.equal(report.bossRushUncapped.hpAt100000, 250052);
assert.equal(
  report.bossRushUncapped.completeBossRushRoomIgnoresClientRewards,
  true,
);

assert.equal(formulaMp(1), 4);
assert.equal(formulaMp(300), 16);
assert.equal(firstLevelFormulaMpAtLeast(16), 300);
assert.equal(firstLevelFormulaMpAtLeast(30), 650);
assert.equal(report.battleMpVsGrid.gridSize, 16);
assert.equal(report.battleMpVsGrid.firstLevelCoversCenterToCorner, 300);
assert.equal(report.battleMpVsGrid.mpAt100000, 4004);

assert.equal(WORLD_BOSS_LEVEL_OFFSET, 5);
assert.equal(WORLD_BOSS_SPAWN_RES_CLAMP, 50);
assert.equal(worldBossEnemyLevel(1), 6);
assert.equal(worldBossEnemyLevel(73), 78);
assert.equal(firstPlayerLevelWorldBossStatCanHit100("rook", "res"), 73);
assert.equal(firstPlayerLevelWorldBossStatCanHit100("bishop", "chc"), 110);
assert.equal(firstLevelResCanHit100("rook"), 78);
assert.equal(playerFrostTurnsToKillHp(CATALOG_BOSS_HP_SAMPLE, 1), 9);
assert.equal(worldBossChip1FrostTurns(73), 117);
assert.equal(worldBossChip1FrostTurns(100_000), 1);
assert.equal(report.catalogWorldBossStatsScale.firstPlayerLevelRookRes100, 73);
assert.equal(
  report.catalogWorldBossStatsScale.battleStartOverwritesCatalogRes,
  true,
);

assert.equal(DOKA_HEAL_HP_PER_DOKA, 3);
assert.equal(dokaHealCostToFillFrom(1, 1), 33);
assert.equal(firstPlayerLevelPotionBeatsFlatDokaHeal(), 82);
assert.equal(
  firstPlayerLevelDokaHealFromOneExceeds(APPLY_REWARDS_MAX_DOKA_DELTA),
  59982,
);
assert.equal(
  report.dokaHealVsLinearHp.firstPlayerLevelPotionBeatsFlat50Doka,
  82,
);
assert.equal(
  report.dokaHealVsLinearHp.firstPlayerLevelFromOneExceedsCombatClamp,
  59982,
);

assert.equal(overlayEnemyAp(1), 1);
assert.equal(overlayEnemyAp(9), 9);
assert.equal(overlayEnemyAp(1020), 1020);
assert.equal(overlayEnemyMp(1020), 510);
assert.equal(overlayEnemyAtk(1020), 2040);
assert.equal(overlayEnemyAp(worldBossEnemyLevel(100_000)), 100_005);
assert.equal(firstEnemyLevelOverlayApExceedsPlayerFormulaAp(1), 9);
assert.equal(INITIATIVE_OVERLAY_ENEMY_RES, 0);
assert.equal(INITIATIVE_OVERLAY_ENEMY_CHC, 2);
assert.equal(firstEnemyLevelCrushExceedsCritKit(KIT_FROST_DAMAGE), 17);
assert.equal(kitCastRaw(KIT_FROST_DAMAGE) * 2, 40);
assert.equal(fallbackCrushRaw(17), 41);
assert.equal(PLAYER_CREATE_EVASION, 5);
assert.equal(PLAYER_CREATE_RESILIENCE, 8);
assert.equal(PLAYER_CREATE_SR, 5);
assert.equal(firstLevelLinearHpNotSafeInteger(), 1_801_439_850_948_180);
assert.equal(report.initiativeOverlayLevelAsAp.apAt1020, 1020);
assert.equal(report.initiativeOverlayLevelAsAp.hardcodedRes, 0);
assert.equal(report.initiativeOverlayLevelAsAp.hardcodedChc, 2);
assert.equal(report.initiativeOverlayLevelAsAp.hidesBattleStartResChc, true);
assert.equal(report.initiativeOverlayLevelAsAp.aiStillOneActionPerTurn, true);
assert.equal(report.initiativeOverlayLevelAsAp.crushExceedsCritFrostAt, 17);
assert.equal(report.unusedCreateDefenses.evasion, 5);
assert.equal(report.unusedCreateDefenses.combatReadsEvasion, false);
assert.equal(report.unusedCreateDefenses.combatReadsPlayerSr, false);
assert.equal(
  report.unusedCreateDefenses.incomingEnemySpellUsesPlayerSpAsSr,
  true,
);
assert.equal(report.persistContract.overlayEnemyApAt1020, 1020);
assert.equal(report.persistContract.playerCreateEvasion, 5);

assert.equal(familyCatalogRes("iron_golem"), 0.75);
assert.equal(familyCatalogRes("plague_rat"), 0.05);
assert.equal(familyCatalogSpRes("iron_golem"), 0.6);
assert.equal(spawnPlaceholderHp(1020), 8180);
assert.equal(familySpawnHp(1020, "iron_golem"), 20_450);
assert.equal(familySpawnHp(1020, "plague_rat"), 3272);
assert.ok(
  familySpawnHp(1020, "iron_golem") >
    report.familyCombatIdentity.combatHpAt1020,
);
assert.equal(report.familyCombatIdentity.variantChance, 0.3);
assert.equal(report.familyCombatIdentity.catalogResIsFractionNotPercent, true);
assert.equal(report.familyCombatIdentity.battleStartOverwritesHpToLinear, true);
assert.equal(report.familyCombatIdentity.combatReadsFamilyRes, false);
assert.equal(report.familyCombatIdentity.combatReadsFamilyHpMult, false);

assert.equal(overworldPickMaxLevel(), 1000);
assert.equal(dungeonMaxEnemyLevel(), 1030);
assert.equal(firstStressLevelFullyUnderDungeonCap(), 2500);
assert.equal(report.dungeonPostCapBoost.overworldPickMaxLevel, 1000);
assert.equal(report.dungeonPostCapBoost.dungeonMaxEnemyLevel, 1030);
assert.equal(
  report.dungeonPostCapBoost.firstStressLevelFullyUnderDungeonCap,
  2500,
);
assert.equal(
  report.dungeonPostCapBoost.player1000CanStillRollDungeonAbove,
  true,
);

assert.equal(starterFrostCooldownTurns(), 0);
assert.equal(playerFrostCastsPerTurn(formulaAp(325)), 7);
assert.equal(playerFrostCastsPerTurn(formulaAp(100_000)), 1336);
assert.equal(firstLevelFormulaFrostCastsAtLeast(7), 325);
assert.equal(firstLevelFormulaFrostCastsAtLeast(100), 7300);
assert.equal(report.battleApFrostDump.starterFrostCooldownTurns, 0);
assert.equal(report.battleApFrostDump.formulaCastsAt325, 7);
assert.equal(report.battleApFrostDump.formulaCastsAt100000, 1336);
assert.equal(report.battleApFrostDump.formulaApAt100000, 4008);
assert.equal(report.battleApFrostDump.firstLevelFormulaCastsExceedPersist, 325);
assert.equal(report.battleApFrostDump.firstLevel100FormulaCasts, 7300);
assert.equal(report.battleApFrostDump.aiStillOneActionPerTurn, true);

assert.equal(starterTimestepCooldownTurns(), 0);
assert.equal(starterTimestepApCost(), 0);
assert.equal(starterTimestepIsOncePerBattle(), true);
assert.equal(frostCastsWithTimestepRefill(formulaAp(325)), 14);
assert.equal(frostCastsWithTimestepRefill(formulaAp(100_000)), 2672);
assert.equal(firstLevelTimestepFrostCastsAtLeast(100), 3550);
assert.equal(report.battleApFrostDump.starterTimestepApCost, 0);
assert.equal(report.battleApFrostDump.frostCastsWithTimestepAt100000, 2672);
assert.equal(report.battleApFrostDump.timestepRestoresFormulaAp, true);

assert.equal(starterDireWolfCooldownTurns(), 0);
assert.equal(starterDireWolfApCost(), 3);
assert.equal(PLAYER_SUMMON_CAP_LIVE, null);
assert.equal(ENEMY_SUMMON_CAP_SIM, 2);
assert.equal(MAX_ENEMIES_SIM, 20);
assert.equal(BATTLE_GRID_CELL_COUNT, 256);
assert.equal(playerSummonCastsPerTurn(formulaAp(1)), 2);
assert.equal(playerSummonCastsPerTurn(formulaAp(325)), 7);
assert.equal(playerSummonCastsPerTurn(formulaAp(100_000)), 1336);
assert.equal(firstLevelFormulaSummonCastsAtLeast(3), 25);
assert.equal(firstLevelFormulaSummonCastsAtLeast(7), 325);
assert.equal(firstLevelFormulaSummonCastsAtLeast(21), 1375);
assert.equal(firstLevelFormulaSummonCastsAtLeast(256), 19_000);
assert.equal(firstPlayerLevelSummonMaxInitExceedsCreate(), 4);
assert.equal(firstPlayerLevelSummonResCanHit100(), 107);
assert.equal(playerSummonStatBounds(1000).init.max, 1206);
assert.equal(playerSummonStatBounds(2500).init.max, 3006);
assert.equal(playerSummonStatBounds(107).res.max, 100);
assert.equal(report.playerSummonDump.playerSummonCap, null);
assert.equal(report.playerSummonDump.enemySummonCap, 2);
assert.equal(report.playerSummonDump.castsAt100000, 1336);
assert.equal(report.playerSummonDump.firstLevelCastsExceedEnemyCap, 25);
assert.equal(report.playerSummonDump.firstLevelCastsExceedMaxEnemies, 1375);
assert.equal(report.playerSummonDump.firstLevelCastsFillGrid, 19_000);
assert.equal(report.playerSummonDump.hpUsesSpellLevelNotCharacterLevel, true);
assert.equal(
  report.playerSummonDump.spawnUsesCharacterLevelForComputeEnemyStats,
  true,
);

assert.equal(PLAYER_TURN_START_COMMITS_MENDING_MIST, false);
assert.equal(playerCombatantsRefHasPlayerEntry([{ id: "rat-1" }]), false);
assert.equal(playerCombatantsRefHasPlayerEntry([{ id: "player" }]), true);
assert.equal(mendingMistRegenAtPlayerLevel(1), 5);
assert.equal(mendingMistRegenAtPlayerLevel(100_000), 25_004);
assert.equal(
  firstPlayerLevelMistRegenExceeds(
    damageAfterPlayerResPasses(fallbackCrushRaw(1020)),
  ),
  7917,
);
assert.equal(report.mendingMistDeadHook.playerTurnStartCommitsHp, false);
assert.equal(report.mendingMistDeadHook.regenAt100000, 25_004);

assert.equal(starterSacrificeApCost(), 3);
assert.equal(starterSacrificeCooldownTurns(), 0);
assert.equal(sacrificeRawAtFullHp(1), 60);
assert.ok(sacrificeRawAtFullHp(1) > playerFrostRaw(0));
assert.equal(sacrificeDamageAfterEnemyRes(sacrificeRawAtFullHp(855), 100), 1);
assert.equal(
  firstPlayerLevelSacrificeRawExceeds(linearEnemyMaxHp(dungeonMaxEnemyLevel())),
  855,
);
assert.equal(firstLevelResCanHit100("rook"), 78);
assert.equal(report.sacrificeHpScaling.rawAt1, 60);
assert.equal(report.sacrificeHpScaling.chip1AtRes100, 1);

assert.equal(arcaneSurgeApCost(3), 2);
assert.equal(arcaneSurgeApCost(0), 1);
assert.equal(playerFrostCastsPerTurnWithArcaneSurge(formulaAp(325)), 10);
assert.equal(playerFrostCastsPerTurnWithArcaneSurge(formulaAp(100_000)), 2004);
assert.equal(firstLevelArcaneSurgeFrostCastsAtLeast(100), 4800);
assert.equal(report.arcaneSurgeFrostDump.frostCostAfterSurge, 2);
assert.equal(report.arcaneSurgeFrostDump.formulaCastsAt100000, 2004);
assert.equal(report.arcaneSurgeFrostDump.firstLevel100TimestepCasts, 2300);

assert.equal(stackedArcaneDiscountApCost(3), 1);
assert.equal(stackedArcaneDiscountApCost(0), 1);
assert.equal(playerFrostCastsPerTurnWithStackedArcane(formulaAp(325)), 21);
assert.equal(
  playerFrostCastsPerTurnWithStackedArcane(formulaAp(100_000)),
  4008,
);
assert.equal(firstLevelStackedArcaneFrostCastsAtLeast(100), 2300);
assert.equal(firstLevelStackedArcaneFrostCastsAtLeast(50), 1050);
assert.equal(report.stackedArcaneFrostDump.frostCostAfterStack, 1);
assert.equal(report.stackedArcaneFrostDump.formulaCastsAt100000, 4008);
assert.equal(report.stackedArcaneFrostDump.firstLevel100TimestepCasts, 1050);

assert.equal(BATTLE_START_PLAYER_IN_COMBATANTS_REF, false);
assert.equal(titansVigorHp(linearEnemyMaxHp(1)), 1050);
assert.equal(titansVigorHp(linearEnemyMaxHp(dungeonMaxEnemyLevel())), 3622);
assert.equal(titansMaxChip1(), 5);
assert.equal(glassChip1(), 2);
assert.equal(titansGlassMaxChip1(), 10);
assert.equal(damageAfterResThenMapMods(21, 100, 1), 1);
assert.equal(
  firstLevelFrostDumpWithMultExceeds(
    linearEnemyMaxHp(dungeonMaxEnemyLevel()),
    TITANS_VIGOR_DMG_MAX,
  ),
  39175,
);
assert.equal(
  firstLevelFrostDumpWithMultExceeds(
    linearEnemyMaxHp(dungeonMaxEnemyLevel()),
    GLASS_REALM_DMG_MULT,
  ),
  98125,
);
assert.equal(
  firstLevelFrostDumpWithMultExceeds(
    linearEnemyMaxHp(dungeonMaxEnemyLevel()),
    TITANS_VIGOR_DMG_MAX * GLASS_REALM_DMG_MULT,
  ),
  19525,
);
assert.equal(report.titansVigorAsymmetric.enemyHpAt1WithTitans, 1050);
assert.equal(report.titansVigorAsymmetric.chip1TitansGlassMax, 10);
assert.equal(
  report.titansVigorAsymmetric.playerInBattleStartCombatantsRef,
  false,
);

assert.equal(OVERWORLD_SPAWN_SETS_SIDE, false);
assert.equal(dokaFeverAppliesHpBonus({}), false);
assert.equal(dokaFeverAppliesHpBonus({ side: "enemy" }), true);
assert.equal(dokaFeverAppliesHpBonus({ isEnemy: true }), true);
assert.equal(dokaFeverHpBonus(linearEnemyMaxHp(1)), 12);
assert.equal(dokaFeverHpBonus(linearEnemyMaxHp(dungeonMaxEnemyLevel())), 655);
assert.equal(report.dokaFeverHpNoOp.appliesOnMissingSide, false);
assert.equal(report.dokaFeverHpNoOp.rewardHookStillDoubles, true);

assert.equal(firstLevelResCanHit100("rook"), 78);
assert.equal(firstLevelIronCursedResCanHit100("rook"), 59);
assert.equal(firstLevelIronCursedResCanHit100("king"), 81);
assert.equal(ironCursedRes(100), 130);
assert.equal(report.ironCurseEarlierChip1.rookRes100Cursed, 59);
assert.equal(report.ironCurseEarlierChip1.chip1AfterRes100, 1);

assert.equal(SUMMON_SPAWN_SETS_ATK, false);
assert.equal(summonMeleeRaw(1), 1);
assert.equal(summonMeleeRaw(44), 44);
assert.equal(summonMeleeRaw(100_000), 100_000);
assert.equal(fallbackCrushRaw(1020), 2448);
assert.equal(firstPlayerLevelSummonMeleeExceeds(fallbackCrushRaw(1020)), 2448);
assert.equal(
  firstPlayerLevelSummonMeleeExceeds(linearEnemyMaxHp(dungeonMaxEnemyLevel())),
  2622,
);
assert.equal(report.summonMeleePlayerLevel.meleeAt100000, 100_000);
assert.equal(
  report.summonMeleePlayerLevel.firstPlayerLevelMeleeExceedsCapCrush,
  2448,
);
assert.equal(linearPlayerMaxHp(2448), 12335);

assert.equal(PLAYER_DAMAGE_DEALT_ATTACKER_IS_LIVE_STATS, false);
assert.equal(vampiricHeal(playerFrostRaw(0)), 3);
assert.equal(vampiricHeal(1), 0);
assert.equal(vampiricHeal(titansMaxChip1()), 0);
assert.equal(vampiricHeal(glassChip1()), 0);
assert.equal(vampiricHeal(titansGlassMaxChip1()), 1);
assert.equal(vampiricHeal(7), 1);
assert.equal(report.vampiricThrowawayAttacker.healFromChip1, 0);
assert.equal(report.vampiricThrowawayAttacker.healFromTitansGlassMaxChip1, 1);

assert.equal(frostPreCritDmgBm(), 20);
assert.equal(playerFrostRaw(0), 21);
assert.equal(MIRROR_FIELD_REFLECT_CHANCE, 0.2);
assert.equal(MIRROR_FIELD_CANCELS_HIT, true);
assert.equal(MIRROR_FIELD_SKIPS_PLAYER_TAKES_DAMAGE, true);
assert.equal(mirrorFieldReflect(frostPreCritDmgBm()), 20);
assert.equal(mirrorFieldReflect(frostPreCritDmgBm({ bloodMoon: true })), 25);
assert.equal(
  mirrorFieldReflect(frostPreCritDmgBm({ bloodMoon: true, fury: true })),
  31,
);
assert.equal(mirrorFieldReflect(frostPreCritDmgBm({ crit: true })), 40);
assert.equal(
  frostDumpMirrorFieldExpectedSelfDamage(formulaAp(325)),
  0.2 * 20 * 7,
);
assert.equal(
  frostDumpMirrorFieldExpectedSelfDamage(formulaAp(100_000)),
  0.2 * 20 * 1336,
);
assert.equal(report.mirrorFieldPreResReflect.reflectAt0, 20);
assert.equal(report.mirrorFieldPreResReflect.outgoingChip1AfterRes100, 1);
assert.equal(report.mirrorFieldPreResReflect.sacrificeUsesThisPath, false);

assert.equal(VOID_MIRROR_REFLECT_FRACTION, 0.25);
assert.equal(VOID_MIRROR_HIT_STILL_LANDS, true);
assert.equal(voidMirrorReflect(frostPreCritDmgBm()), 5);
assert.equal(voidMirrorReflect(1), 0);
assert.equal(voidMirrorFamilyChance(), 0.3 / 7);
assert.equal(frostDumpVoidMirrorSelfDamage(formulaAp(1)), 10);
assert.equal(frostDumpVoidMirrorSelfDamage(formulaAp(325)), 35);
assert.equal(frostDumpVoidMirrorSelfDamage(formulaAp(100_000)), 6680);
assert.equal(firstLevelFrostDumpSelfDamageExceeds(5, 30), 325);
assert.equal(TIDE_SHADE_MP_DEBUFF, -1);
assert.equal(tideShadeMpDebuffOverFormulaMp(1), 0.25);
assert.equal(firstLevelTideShadeDebuffBelowMpPercent(0.05), 425);
assert.equal(report.voidMirrorFamilyReflect.reflectAt0, 5);
assert.equal(report.voidMirrorFamilyReflect.dumpAt325, 35);
assert.equal(
  report.voidMirrorFamilyReflect.familyStringSurvivesBattleStartOverwrite,
  true,
);

assert.equal(TIME_WARP_TIMER_SECONDS, 15);
assert.equal(frostCastsPerTimerSecond(formulaAp(325), 15), 7 / 15);
assert.equal(frostCastsPerTimerSecond(formulaAp(7300), 15), 100 / 15);
assert.equal(frostCastsPerTimerSecond(formulaAp(100_000), 15), 1336 / 15);
assert.equal(report.timeWarpVsFrostDump.warpSeconds, 15);
assert.equal(report.timeWarpVsFrostDump.castsAt100000, 1336);
assert.equal(report.timeWarpVsFrostDump.firstLevel100FormulaCasts, 7300);

assert.equal(PAPER_WINDSTORM_PLAYER_MISS_CHANCE, 0.3);
assert.equal(PAPER_WINDSTORM_ADVERTISED_RANGE_REDUCTION, 0.5);
assert.equal(PAPER_WINDSTORM_RANGE_REDUCTION_APPLIED, false);
assert.equal(paperWindstormEnemyMissChance(FALLBACK_CRUSH_RANGE), 0);
assert.equal(paperWindstormEnemyMissChance(FALLBACK_FIREBOLT_RANGE), 0.5);
assert.equal(frostDumpPaperWindstormExpectedHits(formulaAp(325)), 7 * 0.7);
assert.equal(frostDumpPaperWindstormExpectedMisses(formulaAp(325)), 7 * 0.3);
assert.equal(
  frostDumpPaperWindstormExpectedHits(formulaAp(100_000)),
  1336 * 0.7,
);
assert.equal(
  frostDumpPaperWindstormExpectedMisses(formulaAp(100_000)),
  1336 * 0.3,
);
assert.equal(report.paperWindstormMissAsymmetry.crushMissChance, 0);
assert.equal(report.paperWindstormMissAsymmetry.fireboltMissChance, 0.5);
assert.equal(report.paperWindstormMissAsymmetry.rangeReductionApplied, false);
assert.equal(
  report.paperWindstormMissAsymmetry.expectedHitsAt100000,
  1336 * 0.7,
);

assert.equal(CHAOS_INITIATIVE_SHUFFLES_WHEN_INDEX_WRAPS_TO_ZERO, true);
assert.equal(CHAOS_INITIATIVE_DISPATCHES_BEFORE_SHUFFLE, true);
assert.equal(chaosInitiativePlayerFirstChance(4), 0.25);
assert.equal(chaosInitiativePlayerFirstChance(9), 1 / 9);
assert.equal(report.chaosInitiativeVsInitFreeze.pPlayerFirst3Pack, 0.25);
assert.ok(report.chaosInitiativeVsInitFreeze.pInitFirstAt1 > 0.05);
assert.ok(report.chaosInitiativeVsInitFreeze.pInitFirstAt250 < 0.02);

assert.equal(starterShieldResMultiplier(), 1.3);
assert.equal(crushMeleeResIfShieldApplied(), 13);
assert.equal(CRUSH_MELEE_SKIPS_PLAYER_TAKES_DAMAGE, true);
assert.equal(CRUSH_MELEE_USES_GET_STAT_MODIFIER, false);
assert.equal(report.starterShieldSkippedOnCrush.resIfShieldApplied, 13);
assert.equal(
  report.starterShieldSkippedOnCrush.crushUsesGetStatModifier,
  false,
);

assert.equal(walkCostPerTile({}), 1);
assert.equal(walkCostPerTile({ slimeFlood: true }), 2);
assert.equal(walkCostPerTile({ frozenTerrain: true }), 2);
assert.equal(walkCostPerTile({ slimeFlood: true, frozenTerrain: true }), 4);
assert.equal(gridWalkMpCost({}), 16);
assert.equal(gridWalkMpCost({ slimeFlood: true }), 32);
assert.equal(gridWalkMpCost({ slimeFlood: true, frozenTerrain: true }), 64);
assert.equal(firstLevelFormulaMpAtLeast(16), 300);
assert.equal(firstLevelFormulaMpCoversGridWalk({}), 300);
assert.equal(firstLevelFormulaMpCoversGridWalk({ slimeFlood: true }), 700);
assert.equal(
  firstLevelFormulaMpCoversGridWalk({
    slimeFlood: true,
    frozenTerrain: true,
  }),
  1500,
);
assert.equal(formulaMp(1500), 64);
assert.equal(report.slimeFrozenWalkMpVsGrid.costStacked, 4);
assert.equal(report.slimeFrozenWalkMpVsGrid.firstLevelCoversStacked, 1500);
assert.equal(report.slimeFrozenWalkMpVsGrid.firstLevelCoversPlain, 300);

console.log("longHorizonSim.test: ok");
