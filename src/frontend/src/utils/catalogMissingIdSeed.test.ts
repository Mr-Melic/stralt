import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EMPTY_ONLY_SEEDED_CATALOGS,
  catalogUpsertMustNotOverwriteExisting,
  emptyOnlySeedMissesLaterDefaultIds,
  missingDefaultCatalogIds,
  shouldSeedEntireCatalogOnlyWhenEmpty,
  upsertMissingDefaultCatalogRecords,
} from "./catalogMissingIdSeed.ts";

describe("catalogMissingIdSeed", () => {
  it("HEAD empty-only seed skips a populated canister when defaults grow", () => {
    assert.ok(EMPTY_ONLY_SEEDED_CATALOGS.includes("achievementConfigs"));
    assert.ok(EMPTY_ONLY_SEEDED_CATALOGS.includes("spellConfigs"));
    assert.equal(shouldSeedEntireCatalogOnlyWhenEmpty(0), true);
    assert.equal(shouldSeedEntireCatalogOnlyWhenEmpty(15), false);
    assert.equal(emptyOnlySeedMissesLaterDefaultIds(), true);
  });

  it("lists only default ids the live map does not already hold", () => {
    assert.deepEqual(
      missingDefaultCatalogIds(
        ["first_blood", "survivor"],
        ["first_blood", "explorer_v2", "survivor", "explorer_v2"],
      ),
      ["explorer_v2"],
    );
    assert.deepEqual(
      missingDefaultCatalogIds(
        ["first_blood", "survivor", "explorer_v2"],
        ["first_blood", "explorer_v2", "survivor"],
      ),
      [],
    );
  });

  it("upserts missing defaults without overwriting admin edits or dropping extras", () => {
    assert.equal(catalogUpsertMustNotOverwriteExisting(), true);
    const existing = [
      { id: "first_blood", dokaReward: 999, name: "admin edit" },
      { id: "custom_feat", dokaReward: 1, name: "live extra" },
    ];
    const defaults = [
      { id: "first_blood", dokaReward: 50, name: "First Blood" },
      { id: "explorer_v2", dokaReward: 150, name: "Cartographer" },
    ];
    const once = upsertMissingDefaultCatalogRecords(existing, defaults);
    const twice = upsertMissingDefaultCatalogRecords(once, defaults);
    assert.deepEqual(once, twice);
    assert.deepEqual(
      once.find((row) => row.id === "first_blood"),
      { id: "first_blood", dokaReward: 999, name: "admin edit" },
    );
    assert.deepEqual(
      once.find((row) => row.id === "explorer_v2"),
      { id: "explorer_v2", dokaReward: 150, name: "Cartographer" },
    );
    assert.ok(once.some((row) => row.id === "custom_feat"));
  });
});
