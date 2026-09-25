import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  motokoNatDoublingWraps,
  spellUpgradeCostWouldOverflowNat,
  upgradeSpellCostDoublesInNat,
  upgradeSpellCostHasOverflowGuard,
} from "./upgradeSpellCostEvolve.ts";

describe("upgradeSpellCostEvolve", () => {
  it("documents unguarded Nat doubling without claiming a wrap", () => {
    assert.equal(upgradeSpellCostDoublesInNat(), true);
    assert.equal(upgradeSpellCostHasOverflowGuard(), false);
    assert.equal(motokoNatDoublingWraps(), false);
    assert.equal(spellUpgradeCostWouldOverflowNat(3, 10), false);
    assert.equal(spellUpgradeCostWouldOverflowNat(130, 10), true);
  });
});
