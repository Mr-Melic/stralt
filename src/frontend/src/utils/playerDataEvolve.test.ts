import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEGACY_BLOOD_BALANCE_DEFAULT,
  SAVE_KILL_COUNT_PER_CALL_MAX,
  battleInitHpExceedsPersistCap,
  compoundingBattleInitHp,
  hydrateBloodBalance,
  linearPersistedHp,
  nextKillCountAfterSave,
  saveKillCountDeltaRejected,
} from "./playerDataEvolve.ts";

describe("saveKillCount is additive and per-call bounded", () => {
  it("adds the delta so a retry of the same battle mints a second +N", () => {
    assert.equal(SAVE_KILL_COUNT_PER_CALL_MAX, 64);
    assert.deepEqual(nextKillCountAfterSave(0, 3), { next: 3 });
    assert.deepEqual(nextKillCountAfterSave(3, 3), { next: 6 });
    assert.equal(saveKillCountDeltaRejected(64), null);
    assert.deepEqual(nextKillCountAfterSave(10, 65), {
      err: "kills exceed single-battle bound",
    });
  });
});

describe("legacy bloodBalance default", () => {
  it("hydrates null as 50, not 0", () => {
    assert.equal(LEGACY_BLOOD_BALANCE_DEFAULT, 50);
    assert.equal(hydrateBloodBalance(null), 50);
    assert.equal(hydrateBloodBalance(undefined), 50);
    assert.equal(hydrateBloodBalance(0), 0);
    assert.equal(hydrateBloodBalance(80), 80);
  });
});

describe("compounding battle HP vs linear persist cap", () => {
  it("clips the first L10 write of battle-init HP onto a create-time 100 row", () => {
    assert.equal(linearPersistedHp(1, 5), 100);
    assert.equal(compoundingBattleInitHp(1, 5), 100);
    assert.equal(battleInitHpExceedsPersistCap(3, 5), false);
    assert.equal(battleInitHpExceedsPersistCap(4, 5), true);
    assert.equal(linearPersistedHp(10, 5), 145);
    assert.equal(compoundingBattleInitHp(10, 5), 155);
    assert.equal(battleInitHpExceedsPersistCap(10, 5), true);
  });
});
