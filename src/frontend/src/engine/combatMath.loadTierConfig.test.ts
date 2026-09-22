import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { loadTierConfig } from "./combatMath.ts";

const STORAGE_KEY = "pbv_tier_spawn_config";

function memStorage(): Storage {
  const mem = new Map<string, string>();
  return {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => {
      mem.set(k, String(v));
    },
    removeItem: (k: string) => {
      mem.delete(k);
    },
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() {
      return mem.size;
    },
  } as Storage;
}

const previousStorage = globalThis.localStorage;

afterEach(() => {
  globalThis.localStorage = previousStorage;
});

describe("loadTierConfig", () => {
  it("returns baked defaults when localStorage is missing or empty", () => {
    globalThis.localStorage = memStorage();
    assert.deepEqual(loadTierConfig(), {
      tierSize: 10,
      sameTierPercent: 60,
      adjacentTierPercent: 20,
      twoAwayPercent: 10,
      threeOrMorePercent: 5,
    });
  });

  it("merges a saved admin blob over defaults (no in-memory backend cache)", () => {
    const storage = memStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tierSize: 20,
        sameTierPercent: 40,
      }),
    );
    globalThis.localStorage = storage;
    assert.deepEqual(loadTierConfig(), {
      tierSize: 20,
      sameTierPercent: 40,
      adjacentTierPercent: 20,
      twoAwayPercent: 10,
      threeOrMorePercent: 5,
    });
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tierSize: 8,
        sameTierPercent: 50,
        adjacentTierPercent: 25,
        twoAwayPercent: 15,
        threeOrMorePercent: 10,
      }),
    );
    assert.equal(loadTierConfig().tierSize, 8);
    assert.equal(loadTierConfig().threeOrMorePercent, 10);
  });

  it("falls back to defaults when the cache blob is not JSON", () => {
    const storage = memStorage();
    storage.setItem(STORAGE_KEY, "{not-json");
    globalThis.localStorage = storage;
    assert.deepEqual(loadTierConfig(), {
      tierSize: 10,
      sameTierPercent: 60,
      adjacentTierPercent: 20,
      twoAwayPercent: 10,
      threeOrMorePercent: 5,
    });
  });
});
