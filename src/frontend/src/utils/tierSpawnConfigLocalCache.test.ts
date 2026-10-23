import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  jsonStringifyThrowsOnBigint,
  serializeTierSpawnConfigForLocalCache,
  staleKeptTierSpawnCacheWouldRemainAuthoritative,
  tierSpawnConfigHasBigint,
  toTierSpawnCacheNumbers,
} from "./tierSpawnConfigLocalCache.ts";

const sample = {
  tierSize: 10n,
  sameTierPercent: 60,
  adjacentTierPercent: 20,
  twoAwayPercent: 10,
  threeOrMorePercent: 5,
};

describe("tierSpawnConfigLocalCache", () => {
  it("raw bindgen shape cannot be JSON.stringified", () => {
    assert.equal(tierSpawnConfigHasBigint(sample), true);
    assert.equal(jsonStringifyThrowsOnBigint(sample), true);
    assert.equal(
      staleKeptTierSpawnCacheWouldRemainAuthoritative({
        canisterConfigHasBigint: true,
        versionGateKeepsKey: true,
      }),
      true,
    );
  });

  it("serializer is bigint-safe and round-trips numbers", () => {
    const json = serializeTierSpawnConfigForLocalCache(sample);
    const parsed = JSON.parse(json) as Record<string, number>;
    assert.equal(parsed.tierSize, 10);
    assert.equal(parsed.sameTierPercent, 60);
    assert.equal(parsed.schemaVersion, 1);
    assert.equal(
      jsonStringifyThrowsOnBigint(toTierSpawnCacheNumbers(sample)),
      false,
    );
  });
});
