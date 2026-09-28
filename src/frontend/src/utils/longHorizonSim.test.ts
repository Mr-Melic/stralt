import assert from "node:assert/strict";
import {
  APPLY_REWARDS_MAX_DOKA_DELTA,
  APPLY_REWARDS_MAX_XP_DELTA,
} from "./applyRewardsResult.ts";
import {
  BETRAYAL_ENRAGE_MULT,
  BLOOD_MEND_CRIT_HEAL,
  BLOOD_MEND_HEAL,
  BOSS_RUSH_ROOM0_CATALOG_DOKA,
  BOSS_RUSH_ROOM9_CATALOG_DOKA,
  CATALOG_BOSS_HP_SAMPLE,
  HAZARD_LAVA_MAX,
  HEALTH_POTION_COST,
  KIT_FROST_DAMAGE,
  KIT_INFERNO_DIRECT_DAMAGE,
  KIT_STRIKE_DAMAGE,
  LIFE_DRAIN_HEAL,
  PLAYER_CREATE_INIT,
  SHIELD_CHARM_ABSORB,
  SUMMON_ARCHER_HP_SCALE,
  SUMMON_BOMBER_HP_SCALE,
  SUMMON_GUARDIAN_HP_SCALE,
  SUMMON_HUNTER_HP_SCALE,
  bossRushCombatHp,
  bossRushEnemyLevel,
  bossRushRoomDoka,
  bossRushRoomXp,
  catalogSummonMaxHp,
  crushOverKitRatio,
  damageAfterPlayerResPasses,
  deathDokaLost,
  effectiveSpellRange,
  fallbackCrushRaw,
  fallbackCrushRawEnraged,
  fightsToNextLevel,
  firstEnemyLevelCrushExceedsKit,
  firstEnemyLevelCrushExceedsShield,
  firstEnemyLevelCrushOneShotsSummonHp,
  firstEnemyLevelEnragedCrushOneShots,
  firstEnemyLevelFrostTurnsAtLeast,
  firstEnemyLevelGroundDokaExceedsShrine,
  firstEnemyLevelXpClampHits,
  firstHudSaturationLevel,
  firstLevelChcCanHit100,
  firstLevelFormulaApExceedsPersistCap,
  firstLevelFormulaMpAtLeast,
  firstLevelHazardMaxBelowHpPercent,
  firstLevelResCanHit100,
  firstLevelSpellFailHitsZero,
  firstLevelSpellRangeHitsCap,
  firstPlayerLevelBossRushCrushOneShots,
  firstPlayerLevelBossRushHpExceedsCatalog,
  firstPlayerLevelBossRushRoomDokaExceedsCatalog,
  firstPlayerLevelBossRushRoomDokaHitsClamp,
  firstPlayerLevelBossRushRoomXpHitsClamp,
  firstPlayerLevelSurvivesCrushRecv,
  firstSpellLevelCostExceeds,
  formulaAp,
  formulaMp,
  groundDokaMean,
  healthPotionDokaPerHp,
  healthPotionHpRestored,
  jackpotPersistIfHit,
  jackpotUnclampedMean,
  kitCastRaw,
  kitForPieceName,
  kitForZoneInput,
  linearPlayerMaxHp,
  officialStackedXp,
  passiveRegenSecondsToFull,
  playerFrostCastsPerTurn,
  playerFrostRaw,
  playerFrostTurnsToKill,
  runLongHorizonSim,
  spawnPlaceholderDamage,
  spellFailChance,
  spellUpgradeCostBigInt,
  summonerChance,
  victoryHpFloor,
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

console.log("longHorizonSim.test: ok");
