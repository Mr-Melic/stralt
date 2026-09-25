import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldRejectUpgradeForMisalignedArrays,
  spellLevelArraysAligned,
  spellLevelForId,
} from "./spellLevelArrayEvolve.ts";

describe("spellLevelArrayEvolve", () => {
  it("rejects upgrades when keys outrun values", () => {
    assert.equal(spellLevelArraysAligned(["a", "b"], [1]), false);
    assert.equal(shouldRejectUpgradeForMisalignedArrays(["a", "b"], [1]), true);
    assert.equal(spellLevelForId(["a", "b"], [1], "a"), null);
  });

  it("reads aligned levels and treats missing ids as level 0", () => {
    assert.equal(spellLevelArraysAligned(["a", "b"], [1, 3]), true);
    assert.equal(spellLevelForId(["a", "b"], [1, 3], "b"), 3);
    assert.equal(spellLevelForId(["a", "b"], [1, 3], "c"), 0);
  });
});
