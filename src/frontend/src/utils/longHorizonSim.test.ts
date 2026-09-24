import assert from "node:assert/strict";
import {
  APPLY_REWARDS_MAX_DOKA_DELTA,
  APPLY_REWARDS_MAX_XP_DELTA,
} from "./applyRewardsResult.ts";
import {
  BLOOD_MEND_CRIT_HEAL,
  BLOOD_MEND_HEAL,
  HAZARD_LAVA_MAX,
  LIFE_DRAIN_HEAL,
  PLAYER_CREATE_INIT,
  effectiveSpellRange,
  fightsToNextLevel,
  firstEnemyLevelXpClampHits,
  firstHudSaturationLevel,
  firstLevelChcCanHit100,
  firstLevelFormulaApExceedsPersistCap,
  firstLevelHazardMaxBelowHpPercent,
  firstLevelResCanHit100,
  firstLevelSpellFailHitsZero,
  firstLevelSpellRangeHitsCap,
  firstSpellLevelCostExceeds,
  formulaAp,
  jackpotPersistIfHit,
  jackpotUnclampedMean,
  kitForZoneInput,
  linearPlayerMaxHp,
  officialStackedXp,
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

console.log("longHorizonSim.test: ok");
