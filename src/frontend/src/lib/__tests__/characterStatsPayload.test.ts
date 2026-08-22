import { describe, expect, it } from "vitest";
import type { CharacterStats as BindgenStats } from "../../backend.d";
import type { CharacterStatFields } from "../../types/gameTypes";
import { deepNormalizeBigInts } from "../normalizeBigInts";

/**
 * The persisted CharacterStats Candid record is 12 required numeric fields.
 * Omitting `killCount` (or reintroducing removed wp/wr/scp) makes the
 * serializer reject character-update payloads.
 */
const REQUIRED_CHARACTER_STATS = [
  "hp",
  "ap",
  "mp",
  "sp",
  "sr",
  "atk",
  "res",
  "chc",
  "init",
  "resilience",
  "evasion",
  "killCount",
] as const;

const REMOVED_CHARACTER_STATS = ["wp", "wr", "scp"] as const;

type ExpectedStat = (typeof REQUIRED_CHARACTER_STATS)[number];
type AssertExact<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : never
  : never;
const _frontendExact: AssertExact<keyof CharacterStatFields, ExpectedStat> =
  true;
const _bindgenExact: AssertExact<keyof BindgenStats, ExpectedStat> = true;

function sampleStats(): Record<ExpectedStat, bigint> {
  return {
    hp: 40n,
    ap: 8n,
    mp: 4n,
    sp: 5n,
    sr: 3n,
    atk: 2n,
    res: 1n,
    chc: 6n,
    init: 7n,
    resilience: 3n,
    evasion: 2n,
    killCount: 0n,
  };
}

describe("CharacterStats 12-field payload", () => {
  it("normalizes every required field including killCount", () => {
    const raw = { stats: sampleStats() };
    const out = deepNormalizeBigInts(raw);
    for (const key of REQUIRED_CHARACTER_STATS) {
      expect(typeof out.stats[key]).toBe("number");
    }
    expect(out.stats.killCount).toBe(0);
    expect(Object.keys(out.stats).sort()).toEqual(
      [...REQUIRED_CHARACTER_STATS].sort(),
    );
    void _frontendExact;
    void _bindgenExact;
  });

  it("keeps a missing killCount missing so a Candid omit is observable", () => {
    const { killCount: _killCount, ...withoutKillCount } = sampleStats();
    const out = deepNormalizeBigInts({ stats: withoutKillCount });
    expect("killCount" in out.stats).toBe(false);
    expect(
      REQUIRED_CHARACTER_STATS.every(
        (key) => key === "killCount" || key in out.stats,
      ),
    ).toBe(true);
  });

  it("does not carry the removed wp/wr/scp fields on a canonical payload", () => {
    const out = deepNormalizeBigInts({ stats: sampleStats() });
    for (const key of REMOVED_CHARACTER_STATS) {
      expect(key in out.stats).toBe(false);
    }
  });
});
