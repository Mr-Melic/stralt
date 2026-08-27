import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDungeonMultiplier } from "./useDungeonState.ts";

describe("getDungeonMultiplier", () => {
  it("uses the published depth table through depth 5", () => {
    assert.equal(getDungeonMultiplier(0), 1);
    assert.equal(getDungeonMultiplier(1), 1.5);
    assert.equal(getDungeonMultiplier(2), 2);
    assert.equal(getDungeonMultiplier(3), 2.5);
    assert.equal(getDungeonMultiplier(4), 3);
    assert.equal(getDungeonMultiplier(5), 4);
  });

  it("clamps deeper floors so a chain cannot invent a 5x+ wallet credit", () => {
    assert.equal(getDungeonMultiplier(6), 4);
    assert.equal(getDungeonMultiplier(99), 4);
  });

  it("falls back to 1x for missing/invalid depths", () => {
    assert.equal(getDungeonMultiplier(-1), 1);
    assert.equal(getDungeonMultiplier(Number.NaN), 1);
  });
});
