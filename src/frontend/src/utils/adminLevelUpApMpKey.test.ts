/**
 * AFDA-2026-10-27-045 — Admin Settings dual-writes LevelUpConfig using the
 * Candid key `apMpLevelThreshold`. WorldExploration hydrates
 * `pbv_levelup_config` into `DEFAULT_LEVELUP_CONFIG` and passes that object to
 * `getPlayerBaseStats`, which only reads `apMpGrowthEveryNLevels`.
 *
 * Same-browser admin save therefore does not change live AP/MP cadence even
 * though fail/range/statGrowth keys share names with the consumer.
 * Do not edit AdminDashboard / WorldExploration / progression / gameTypes here.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPlayerBaseStats } from "../engine/progression.ts";
import { DEFAULT_LEVELUP_CONFIG } from "../types/gameTypes.ts";

describe("AFDA-2026-10-27-045 admin apMpLevelThreshold LS key", () => {
  it("WX-style merge of admin-saved apMpLevelThreshold keeps default AP cadence", () => {
    // AdminDashboard handleSave: JSON.stringify(cfg) with Candid field name.
    const adminSaved = {
      maxSpellRange: 5,
      spellRangeGrowthLevels: 10,
      spellFailBaseChance: 20,
      spellFailReductionPerLevel: 0.1,
      statGrowthPercent: 5,
      apMpLevelThreshold: 10,
      spellLevelingBaseCost: 10,
      spellLevelingCostMultiplier: 2,
      spellDmgGrowthPercent: 3,
    };
    // WorldExploration levelUpConfig useMemo merge.
    const hydrated = {
      ...DEFAULT_LEVELUP_CONFIG,
      ...adminSaved,
    } as typeof DEFAULT_LEVELUP_CONFIG & { apMpLevelThreshold?: number };

    assert.equal(hydrated.apMpGrowthEveryNLevels, 25);
    assert.equal(hydrated.apMpLevelThreshold, 10);

    const at50 = getPlayerBaseStats(50, hydrated);
    const withDefault = getPlayerBaseStats(50, DEFAULT_LEVELUP_CONFIG);
    // floor(50/25)=2 → AP 8+2=10, MP 4+2=6. Honoring threshold 10 → AP 13 / MP 9.
    assert.deepEqual(at50, withDefault);
    assert.equal(at50.ap, 10);
    assert.equal(at50.mp, 6);
  });

  it("explicit apMpGrowthEveryNLevels still drives getPlayerBaseStats", () => {
    const wired = {
      ...DEFAULT_LEVELUP_CONFIG,
      apMpGrowthEveryNLevels: 10,
    };
    const at50 = getPlayerBaseStats(50, wired);
    assert.equal(at50.ap, 13);
    assert.equal(at50.mp, 9);
  });
});
