import { afterEach, describe, expect, it, vi } from "vitest";
import {
  computeAITier,
  loadTierConfig,
  pickEnemyLevelFromTiers,
  seededRng,
} from "../combatMath";

function stubRandom(...values: number[]): void {
  let i = 0;
  vi.spyOn(Math, "random").mockImplementation(() => {
    const value = values[Math.min(i, values.length - 1)] ?? 0;
    i += 1;
    return value;
  });
}

function installLocalStorage(): Map<string, string> {
  const mem = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
  });
  return mem;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("seededRng", () => {
  it("returns a deterministic sequence in [0, 1) for a given seed", () => {
    const a = seededRng(42);
    const b = seededRng(42);
    const first = [a(), a(), a()];
    expect(first).toEqual([b(), b(), b()]);
    expect(first.every((n) => n >= 0 && n < 1)).toBe(true);
  });

  it("diverges when the seed changes", () => {
    expect(seededRng(1)()).not.toBe(seededRng(2)());
  });
});

describe("loadTierConfig", () => {
  it("returns the safe defaults when localStorage is empty or invalid", () => {
    const mem = installLocalStorage();
    expect(loadTierConfig()).toEqual({
      tierSize: 10,
      sameTierPercent: 60,
      adjacentTierPercent: 20,
      twoAwayPercent: 10,
      threeOrMorePercent: 5,
    });

    mem.set("pbv_tier_spawn_config", "{not-json");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(loadTierConfig().tierSize).toBe(10);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("merges an admin override over the defaults", () => {
    const mem = installLocalStorage();
    mem.set(
      "pbv_tier_spawn_config",
      JSON.stringify({ tierSize: 8, sameTierPercent: 100 }),
    );
    expect(loadTierConfig()).toMatchObject({
      tierSize: 8,
      sameTierPercent: 100,
      adjacentTierPercent: 20,
    });
  });
});

describe("computeAITier", () => {
  it("maps level bands when the 30% variance roll misses", () => {
    stubRandom(1);
    expect(computeAITier(1)).toBe(1);
    expect(computeAITier(10)).toBe(1);
    expect(computeAITier(11)).toBe(2);
    expect(computeAITier(30)).toBe(2);
    expect(computeAITier(31)).toBe(3);
    expect(computeAITier(100)).toBe(4);
    expect(computeAITier(101)).toBe(5);
    expect(computeAITier(151)).toBe(6);
    expect(computeAITier(251)).toBe(7);
    expect(computeAITier(401)).toBe(8);
    expect(computeAITier(601)).toBe(9);
    expect(computeAITier(901)).toBe(10);
  });
});

describe("pickEnemyLevelFromTiers", () => {
  it("draws the 70% band within ±2 of the player-centered level", () => {
    stubRandom(0, 0);
    expect(pickEnemyLevelFromTiers(10)).toBe(8);
  });

  it("draws the 25% band in +3..+5 above the center", () => {
    stubRandom(0.8, 0);
    expect(pickEnemyLevelFromTiers(10)).toBe(13);
  });

  it("folds the 5% outlier into +3..+5 unless allowOutlier is set", () => {
    stubRandom(0.96, 0);
    expect(pickEnemyLevelFromTiers(10, 0, false)).toBe(13);

    stubRandom(0.96, 0);
    expect(pickEnemyLevelFromTiers(10, 0, true)).toBe(16);
  });

  it("caps zoneShift at +2 and ignores a negative shift", () => {
    stubRandom(0, 0);
    expect(pickEnemyLevelFromTiers(10, 9)).toBe(10);

    stubRandom(0, 0);
    expect(pickEnemyLevelFromTiers(10, -4)).toBe(8);
  });

  it("floors a sub-1 player level at 1", () => {
    stubRandom(0, 0);
    expect(pickEnemyLevelFromTiers(0)).toBe(1);
    stubRandom(0, 0);
    expect(pickEnemyLevelFromTiers(-3)).toBe(1);
  });

  it("honors an admin localStorage override with the legacy same-tier band", () => {
    const mem = installLocalStorage();
    mem.set(
      "pbv_tier_spawn_config",
      JSON.stringify({
        tierSize: 10,
        sameTierPercent: 100,
        adjacentTierPercent: 0,
        twoAwayPercent: 0,
        threeOrMorePercent: 0,
        levelVarianceChance: 0,
      }),
    );
    // player 15 → tier 1 → levels 11..20. First roll is unused variance,
    // second picks the same-tier bucket, third picks the low end of the band.
    stubRandom(0, 0, 0);
    expect(pickEnemyLevelFromTiers(15)).toBe(11);
    stubRandom(0, 0, 0.99);
    expect(pickEnemyLevelFromTiers(15)).toBe(20);
  });
});
