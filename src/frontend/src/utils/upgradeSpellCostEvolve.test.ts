import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  spellUpgradeCostWouldOverflowNat,
  upgradeSpellCostDoublesInNat,
  upgradeSpellCostHasOverflowGuard,
} from "./upgradeSpellCostEvolve.ts";

describe("upgradeSpellCostEvolve", () => {
  it("documents unguarded Nat doubling and flags extreme levels", () => {
    assert.equal(upgradeSpellCostDoublesInNat(), true);
    assert.equal(upgradeSpellCostHasOverflowGuard(), false);
    assert.equal(spellUpgradeCostWouldOverflowNat(3, 10), false);
    assert.equal(spellUpgradeCostWouldOverflowNat(130, 10), true);
  });
});
