import { describe, expect, it } from "vitest";
import { deepNormalizeBigInts } from "../normalizeBigInts";

describe("deepNormalizeBigInts", () => {
  it("converts nested BigInts so backend payloads can be used as numbers", () => {
    const input = {
      stats: {
        hp: 12n,
        killCount: 0n,
        nested: [1n, { ap: 4n }],
      },
      name: "Hero",
      flag: true,
      empty: null,
    };
    const out = deepNormalizeBigInts(input);
    expect(out).toEqual({
      stats: {
        hp: 12,
        killCount: 0,
        nested: [1, { ap: 4 }],
      },
      name: "Hero",
      flag: true,
      empty: null,
    });
    expect(typeof out.stats.hp).toBe("number");
    expect(typeof input.stats.hp).toBe("bigint");
  });

  it("passes through null, undefined, and non-bigint primitives", () => {
    expect(deepNormalizeBigInts(null)).toBeNull();
    expect(deepNormalizeBigInts(undefined)).toBeUndefined();
    expect(deepNormalizeBigInts("ok")).toBe("ok");
    expect(deepNormalizeBigInts(7)).toBe(7);
  });
});
