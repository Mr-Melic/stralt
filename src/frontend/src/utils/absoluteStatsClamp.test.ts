import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampSaveBattleStatsOffensiveStats,
  clampSaveBattleStatsWrite,
} from "./absoluteStatsClamp.ts";

describe("clampSaveBattleStatsWrite", () => {
  it("lets death and heals cut Doka/XP but refuses a mint or level rewrite", () => {
    const stored = { doka: 200, xp: 80, level: 4 };

    assert.deepEqual(
      clampSaveBattleStatsWrite(stored, { doka: 120, xp: 64, level: 4 }),
      { doka: 120, xp: 64, level: 4 },
    );

    assert.deepEqual(
      clampSaveBattleStatsWrite(stored, { doka: 900, xp: 400, level: 99 }),
      { doka: 200, xp: 80, level: 4 },
    );

    // Canister saveBattleStats ignores client level (#209 / #215). This
    // helper must keep stored level so a stale/custom _level=1 cannot demote
    // after applyRewards.
    assert.deepEqual(
      clampSaveBattleStatsWrite(stored, { doka: 200, xp: 80, level: 1 }),
      { doka: 200, xp: 80, level: 4 },
    );
  });

  it("keeps stored atk/res/init so a combat snapshot cannot mint growth", () => {
    assert.deepEqual(
      clampSaveBattleStatsOffensiveStats(
        { atk: 15, res: 10, init: 10 },
        { atk: 40, res: 40, init: 99 },
      ),
      { atk: 15, res: 10, init: 10 },
    );
    assert.deepEqual(
      clampSaveBattleStatsOffensiveStats(
        { atk: 15, res: 10, init: 10 },
        { atk: 12, res: 8, init: 7 },
      ),
      { atk: 12, res: 8, init: 7 },
    );
  });
});
