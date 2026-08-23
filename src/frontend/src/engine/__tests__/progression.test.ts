import { describe, expect, it } from "vitest";
import {
  PLAYER_BASE_AP,
  PLAYER_BASE_MP,
  SUMMON_BASE_HP,
  SUMMON_BASE_LIFESPAN,
  SUMMON_LIFESPAN_PER_HALF_LEVEL,
} from "../../data/gameConstants";
import {
  BOSS_LEVEL_DIFF_STEP,
  getBossEffectiveStats,
  getPlayerBaseStats,
  getSummonBaseStats,
} from "../progression";

describe("getPlayerBaseStats", () => {
  it("keeps AP/MP/HP at the floors when no growth config is provided", () => {
    expect(getPlayerBaseStats(1)).toEqual({
      ap: PLAYER_BASE_AP,
      mp: PLAYER_BASE_MP,
      hp: 100,
    });
    expect(getPlayerBaseStats(40)).toEqual({
      ap: PLAYER_BASE_AP,
      mp: PLAYER_BASE_MP,
      hp: 100,
    });
  });

  it("adds +1 AP and +1 MP every N levels and compounds HP from the config", () => {
    expect(
      getPlayerBaseStats(25, {
        statGrowthPercent: 5,
        apMpGrowthEveryNLevels: 25,
        maxSpellRange: 5,
        spellRangeGrowthLevels: 10,
        spellFailBaseChance: 20,
        spellFailReductionPerLevel: 0.1,
      }),
    ).toEqual({
      ap: PLAYER_BASE_AP + 1,
      mp: PLAYER_BASE_MP + 1,
      hp: Math.round(100 * 1.05 ** 24),
    });
  });

  it("floors a sub-1 level at 1", () => {
    expect(getPlayerBaseStats(0)).toEqual(getPlayerBaseStats(1));
    expect(getPlayerBaseStats(-3)).toEqual(getPlayerBaseStats(1));
  });
});

describe("getSummonBaseStats", () => {
  it("uses SUMMON_BASE_LIFESPAN + floor(level/2), not the old || 3 fallback", () => {
    const unitDef = { pieceType: "pawn", level: 1 };
    expect(getSummonBaseStats(1, unitDef, "hunter").turnsRemaining).toBe(
      SUMMON_BASE_LIFESPAN,
    );
    expect(getSummonBaseStats(2, unitDef, "hunter").turnsRemaining).toBe(
      SUMMON_BASE_LIFESPAN + Math.floor(2 / SUMMON_LIFESPAN_PER_HALF_LEVEL),
    );
    expect(getSummonBaseStats(3, unitDef, "hunter").turnsRemaining).toBe(
      SUMMON_BASE_LIFESPAN + 1,
    );
    expect(getSummonBaseStats(4, unitDef, "hunter").turnsRemaining).toBe(
      SUMMON_BASE_LIFESPAN + 2,
    );
  });

  it("scales hunter HP from the archetype base and spell-level percent", () => {
    const stats = getSummonBaseStats(
      2,
      { pieceType: "pawn", level: 1 },
      "hunter",
    );
    expect(stats.maxHp).toBe(Math.round(SUMMON_BASE_HP.hunter * 1 * 1.2));
    expect(stats.maxAp).toBe(2);
    expect(stats.maxMp).toBe(4);
  });
});

describe("getBossEffectiveStats", () => {
  const base = {
    hp: 1000,
    ap: 10,
    mp: 8,
    init: 12,
    sp: 20,
    res: 15,
    atk: 0,
    chc: 0,
  };

  it("returns base stats on an even match and compounds ±8% per level of difference", () => {
    expect(getBossEffectiveStats(base, 10, 10)).toMatchObject({
      hp: 1000,
      ap: 10,
      mp: 8,
      init: 12,
      sp: 20,
      sr: 15,
      res: 15,
    });

    const stronger = getBossEffectiveStats(base, 10, 12);
    expect(stronger.hp).toBe(Math.round(1000 * BOSS_LEVEL_DIFF_STEP ** 2));
    expect(stronger.sr).toBe(Math.round(15 * BOSS_LEVEL_DIFF_STEP ** 2));
    // RES is the unscaled reference column.
    expect(stronger.res).toBe(15);

    const weaker = getBossEffectiveStats(base, 12, 10);
    expect(weaker.hp).toBe(Math.round(1000 * BOSS_LEVEL_DIFF_STEP ** -2));
  });
});
