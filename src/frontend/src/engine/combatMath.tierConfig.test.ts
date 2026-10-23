import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { clearTierConfigCacheForTests, loadTierConfig } from "./combatMath.ts";

describe("loadTierConfig cache (PERF-2026-10-23-163)", () => {
  afterEach(() => {
    clearTierConfigCacheForTests();
  });

  it("returns the same object for unchanged localStorage and refreshes after setItem", () => {
    clearTierConfigCacheForTests();
    const mem: Record<string, string> = {
      pbv_tier_spawn_config: JSON.stringify({
        tierSize: 12,
        sameTierPercent: 50,
      }),
    };
    const original = globalThis.localStorage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).localStorage = {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => {
        mem[k] = v;
      },
      removeItem: (k: string) => {
        delete mem[k];
      },
    };

    try {
      const a = loadTierConfig();
      const b = loadTierConfig();
      assert.equal(a.tierSize, 12);
      assert.equal(a.sameTierPercent, 50);
      assert.equal(a, b, "same blob must reuse the cached object");

      mem.pbv_tier_spawn_config = JSON.stringify({
        tierSize: 20,
        sameTierPercent: 40,
      });
      const d = loadTierConfig();
      assert.equal(d.tierSize, 20);
      assert.equal(d.sameTierPercent, 40);
      assert.notEqual(d, a, "changed blob must produce a new parsed object");
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).localStorage = original;
    }
  });
});
