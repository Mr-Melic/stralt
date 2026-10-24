import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUMMON_UPGRADE_COST_NOTE,
  canAffordSummonUpgradeUi,
  summonUpgradeCostHint,
} from "./summonUpgradeCostCopy.ts";

describe("summonUpgradeCostCopy", () => {
  it("explains 10× list vs canister charge", () => {
    assert.match(SUMMON_UPGRADE_COST_NOTE, /10×/);
    assert.match(SUMMON_UPGRADE_COST_NOTE, /canister/i);
    assert.match(summonUpgradeCostHint(100), /Listed 100/);
    assert.match(summonUpgradeCostHint(100), /charged 10/);
  });

  it("gates affordability on canister spend, not the 10× list", () => {
    assert.equal(canAffordSummonUpgradeUi(50, 100), true);
    assert.equal(canAffordSummonUpgradeUi(9, 100), false);
    assert.equal(canAffordSummonUpgradeUi(10, 10), true);
  });
});
