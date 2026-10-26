import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { committedDokaAfterSpellUpgrade } from "./spellUpgrade.ts";
import {
  advertisedJsSpellUpgradeCost,
  advertisedSpellUpgradeCostIsPersistSafe,
  freezeCommittedDokaWhenAdvertisedUpgradeCostUnsafe,
  spellUpgradeCanisterCostBigInt,
} from "./spellUpgradeCostNat.ts";

describe("spellUpgradeCostNat", () => {
  it("matches Motoko doubling at ordinary and high spell levels", () => {
    assert.equal(spellUpgradeCanisterCostBigInt(0), 10n);
    assert.equal(spellUpgradeCanisterCostBigInt(3), 80n);
    assert.equal(spellUpgradeCanisterCostBigInt(53), 10n * 2n ** 53n);
  });

  it("JS advertised cost leaves the safe-integer range around spell level 53", () => {
    assert.equal(advertisedJsSpellUpgradeCost(0), 10);
    assert.equal(
      advertisedSpellUpgradeCostIsPersistSafe(advertisedJsSpellUpgradeCost(10)),
      true,
    );
    assert.equal(
      advertisedSpellUpgradeCostIsPersistSafe(advertisedJsSpellUpgradeCost(53)),
      false,
    );
    assert.equal(
      advertisedSpellUpgradeCostIsPersistSafe(
        advertisedJsSpellUpgradeCost(1024),
      ),
      false,
    );
  });

  it("HEAD persist lock zeros the wallet on Infinity advertised cost", () => {
    assert.equal(
      committedDokaAfterSpellUpgrade(
        50_000,
        undefined,
        Number.POSITIVE_INFINITY,
      ),
      0,
    );
  });

  it("freezes the seeded wallet instead of writing 0 when advertised cost is unsafe", () => {
    assert.equal(
      freezeCommittedDokaWhenAdvertisedUpgradeCostUnsafe(
        50_000,
        undefined,
        Number.POSITIVE_INFINITY,
      ),
      50_000,
    );
    assert.equal(
      freezeCommittedDokaWhenAdvertisedUpgradeCostUnsafe(
        50_000,
        49_990,
        Number.POSITIVE_INFINITY,
      ),
      49_990,
    );
    assert.equal(
      freezeCommittedDokaWhenAdvertisedUpgradeCostUnsafe(50_000, undefined, 80),
      null,
    );
  });
});
