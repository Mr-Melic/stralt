import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogDeleteRetiresWhenReferenced,
  enemyConfigHardDeletesWithoutReferenceCheck,
  ghostSpellKeyRemainsOwnedAfterCatalogPurge,
  purchaseBuffRequiresOccupiedCharacterSlot,
  spellLevelKeysPurgedWhenCatalogEntryRemoved,
} from "./catalogDeletePolicy.ts";

describe("catalogDeletePolicy", () => {
  it("retires spells/achievements but hard-deletes enemies", () => {
    assert.equal(catalogDeleteRetiresWhenReferenced("spell"), true);
    assert.equal(catalogDeleteRetiresWhenReferenced("achievement"), true);
    assert.equal(catalogDeleteRetiresWhenReferenced("enemy"), false);
    assert.equal(enemyConfigHardDeletesWithoutReferenceCheck(), true);
  });

  it("leaves ghost spellLevelKeys after catalog purge", () => {
    assert.equal(spellLevelKeysPurgedWhenCatalogEntryRemoved(), false);
    assert.equal(
      ghostSpellKeyRemainsOwnedAfterCatalogPurge(
        ["shadow_strike", "physical_attack"],
        "physical_attack",
        false,
      ),
      true,
    );
    assert.equal(
      ghostSpellKeyRemainsOwnedAfterCatalogPurge(
        ["shadow_strike"],
        "physical_attack",
        false,
      ),
      false,
    );
  });

  it("allows purchaseBuff into an empty character slot", () => {
    assert.equal(purchaseBuffRequiresOccupiedCharacterSlot(), false);
  });
});
