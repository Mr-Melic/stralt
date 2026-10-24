import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  characterRecordStoresConfigCatalogId,
  configCatalogHardDeletesOnAdminRemove,
  persistingCatalogIdWouldBreakOldPlayers,
  spellDeleteRetiresWhenReferenced,
} from "./configCatalogHardDelete.ts";

describe("configCatalogHardDelete", () => {
  it("hard-deletes enemy/region/modifier ids that Character does not store", () => {
    assert.equal(configCatalogHardDeletesOnAdminRemove("enemy"), true);
    assert.equal(configCatalogHardDeletesOnAdminRemove("region"), true);
    assert.equal(configCatalogHardDeletesOnAdminRemove("mapModifier"), true);
    assert.equal(configCatalogHardDeletesOnAdminRemove("spell"), false);
    assert.equal(spellDeleteRetiresWhenReferenced(), true);
    assert.equal(characterRecordStoresConfigCatalogId("enemy"), false);
    assert.equal(characterRecordStoresConfigCatalogId("region"), false);
    assert.equal(characterRecordStoresConfigCatalogId("mapModifier"), false);
    assert.equal(characterRecordStoresConfigCatalogId("spell"), true);
    assert.equal(persistingCatalogIdWouldBreakOldPlayers("enemy"), true);
    assert.equal(persistingCatalogIdWouldBreakOldPlayers("region"), true);
    assert.equal(persistingCatalogIdWouldBreakOldPlayers("mapModifier"), true);
    assert.equal(persistingCatalogIdWouldBreakOldPlayers("spell"), false);
  });
});
