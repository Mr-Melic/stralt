import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUMMON_UPGRADE_COST_NOTE,
  canAffordSummonUpgradeUi,
  summonUpgradeCostHint,
} from "./summonUpgradeCostCopy.ts";

describe("summonUpgradeCostCopy", () => {
  it("explains 10× list vs the usual wallet debit", () => {
    assert.match(SUMMON_UPGRADE_COST_NOTE, /10×/);
    assert.match(SUMMON_UPGRADE_COST_NOTE, /usual price/i);
    assert.equal(/canister/i.test(SUMMON_UPGRADE_COST_NOTE), false);
    assert.match(summonUpgradeCostHint(100), /Listed 100/);
    assert.match(summonUpgradeCostHint(100), /wallet pays 10/);
  });

  it("gates affordability on the wallet debit, not the 10× list", () => {
    assert.equal(canAffordSummonUpgradeUi(50, 100), true);
    assert.equal(canAffordSummonUpgradeUi(9, 100), false);
    assert.equal(canAffordSummonUpgradeUi(10, 10), true);
  });
});
