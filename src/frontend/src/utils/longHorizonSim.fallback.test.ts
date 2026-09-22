import assert from "node:assert/strict";
import {
  PLAYER_CREATE_RES,
  damageAfterPlayerResPasses,
  fallbackCrushRaw,
  firstEnemyLevelFallbackCrushOneShots,
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

console.log("longHorizonSim.fallback.test: ok");
