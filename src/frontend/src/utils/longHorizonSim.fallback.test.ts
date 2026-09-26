import assert from "node:assert/strict";
import {
  BETRAYAL_ENRAGE_MULT,
  PLAYER_CREATE_RES,
  SHIELD_CHARM_ABSORB,
  damageAfterPlayerResPasses,
  fallbackCrushRaw,
  fallbackCrushRawEnraged,
  firstEnemyLevelCrushExceedsShield,
  firstEnemyLevelEnragedCrushOneShots,
  firstEnemyLevelFallbackCrushOneShots,
  firstPlayerLevelSurvivesCrushRecv,
  linearPlayerMaxHp,
  runLongHorizonSim,
} from "./longHorizonSim.ts";

const report = runLongHorizonSim();

assert.equal(PLAYER_CREATE_RES, 10);
assert.equal(fallbackCrushRaw(5), 12);
assert.equal(fallbackCrushRaw(80), 192);
assert.equal(firstEnemyLevelFallbackCrushOneShots(1), 52);
assert.equal(firstEnemyLevelFallbackCrushOneShots(10), 75);
assert.ok(
  damageAfterPlayerResPasses(fallbackCrushRaw(80)) >= linearPlayerMaxHp(1),
);
assert.equal(report.fallbackMelee.playerCreateRes, 10);
assert.equal(report.fallbackMelee.firstEnemyLevelCrushOneShotsPlayer1, 52);
assert.equal(report.fallbackMelee.firstEnemyLevelCrushOneShotsPlayer10, 75);
assert.equal(report.fallbackMelee.crushRawAt80, 192);
assert.equal(report.fallbackMelee.player1MaxEnemyOneShots, true);
assert.ok(report.fallbackMelee.crushRecvAt1020 < linearPlayerMaxHp(1000));
assert.equal(report.fallbackMelee.firstLevelExponentialHpNotJsonSafe, 14500);

assert.equal(BETRAYAL_ENRAGE_MULT, 6);
assert.equal(fallbackCrushRawEnraged(80), 192 * 6);
assert.equal(fallbackCrushRawEnraged(1020), 2448 * 6);
assert.ok(
  firstEnemyLevelEnragedCrushOneShots(1) !== null &&
    (firstEnemyLevelEnragedCrushOneShots(1) ?? 99) <
      (firstEnemyLevelFallbackCrushOneShots(1) ?? 0),
);
assert.equal(SHIELD_CHARM_ABSORB, 20);
assert.equal(firstEnemyLevelCrushExceedsShield(), 11);
assert.ok(
  (firstPlayerLevelSurvivesCrushRecv(
    damageAfterPlayerResPasses(fallbackCrushRawEnraged(1020)),
  ) ?? 0) > 2000,
);
assert.equal(report.betrayalEnrage.crushRawAt80, 1152);
assert.ok(
  (report.betrayalEnrage.crushRecvAt1020 ?? 0) >
    (report.fallbackMelee.crushRecvAt1020 ?? 0),
);

console.log("longHorizonSim.fallback.test: ok");
