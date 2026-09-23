import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GROUND_DOKA_PICKUPS_PROGRESS_BASE,
  MAPS_VISITED_PROGRESS_BASE,
  characterProgressStorageKey,
  inventoryStorageKey,
  readMigratingCharacterProgress,
  readMigratingInventoryJson,
  resolveProgressStorageOwner,
  writeCharacterProgress,
  writeInventoryJson,
} from "./progressStorageKey.ts";

function memStorage(): {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
} {
  const storage = new Map<string, string>();
  return {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => {
      storage.set(k, v);
    },
    removeItem: (k) => {
      storage.delete(k);
    },
  };
}

describe("progressStorageKey", () => {
  it("scopes owner to the II principal and keeps display name as legacy only", () => {
    const named = resolveProgressStorageOwner("aaaaa-aa", "Bob");
    assert.equal(named.owner, "aaaaa-aa");
    assert.equal(named.legacyOwner, "Bob");
    const same = resolveProgressStorageOwner("aaaaa-aa", "aaaaa-aa");
    assert.equal(same.legacyOwner, undefined);
    assert.equal(resolveProgressStorageOwner("", "Bob").owner, "Bob");
    assert.equal(resolveProgressStorageOwner(null, null).owner, "guest");
    assert.equal(inventoryStorageKey("aaaaa-aa"), "aaaaa-aa_inventory");
    assert.equal(
      characterProgressStorageKey("aaaaa-aa", 1, MAPS_VISITED_PROGRESS_BASE),
      "aaaaa-aa_slot1_pbv_maps_visited_count",
    );
  });

  it("migrates name-keyed potions onto the first principal and isolates the next Bob", () => {
    const store = memStorage();
    store.setItem("Bob_inventory", '{"health_potion":3}');
    const p1 = "aaaaa-aa";
    const p2 = "2vxsx-fae";
    const migrated = readMigratingInventoryJson(store, p1, "Bob");
    assert.equal(migrated, '{"health_potion":3}');
    assert.equal(store.getItem("aaaaa-aa_inventory"), '{"health_potion":3}');
    assert.equal(
      store.getItem("Bob_inventory"),
      null,
      "legacy display-name inventory must be deleted after migrate",
    );
    assert.equal(
      readMigratingInventoryJson(store, p2, "Bob"),
      null,
      "second principal named Bob must not inherit unpaid potions",
    );
    writeInventoryJson(store, p2, "Bob", '{"health_potion":1}');
    assert.equal(store.getItem("2vxsx-fae_inventory"), '{"health_potion":1}');
    assert.equal(
      store.getItem("aaaaa-aa_inventory"),
      '{"health_potion":3}',
      "P1 potions stay on P1's principal key",
    );
    assert.equal(store.getItem("Bob_inventory"), null);
  });

  it("does not let a second same-name principal inherit loot/explore feat counters", () => {
    const store = memStorage();
    store.setItem("Bob_slot1_pbv_maps_visited_count", "25");
    store.setItem("Bob_slot1_pbv_ground_doka_pickups", "10");
    const p1 = "aaaaa-aa";
    const p2 = "2vxsx-fae";
    assert.equal(
      readMigratingCharacterProgress(
        store,
        p1,
        "Bob",
        1,
        MAPS_VISITED_PROGRESS_BASE,
      ),
      "25",
    );
    assert.equal(
      readMigratingCharacterProgress(
        store,
        p1,
        "Bob",
        1,
        GROUND_DOKA_PICKUPS_PROGRESS_BASE,
      ),
      "10",
    );
    assert.equal(
      store.getItem("Bob_slot1_pbv_maps_visited_count"),
      null,
      "legacy maps-visited name key must be deleted after migrate",
    );
    assert.equal(
      readMigratingCharacterProgress(
        store,
        p2,
        "Bob",
        1,
        MAPS_VISITED_PROGRESS_BASE,
      ),
      null,
      "second principal named Bob must start maps-visited at 0",
    );
    assert.equal(
      readMigratingCharacterProgress(
        store,
        p2,
        "Bob",
        1,
        GROUND_DOKA_PICKUPS_PROGRESS_BASE,
      ),
      null,
      "second principal named Bob must start ground-Doka pickups at 0",
    );
    writeCharacterProgress(
      store,
      p2,
      "Bob",
      1,
      MAPS_VISITED_PROGRESS_BASE,
      "1",
    );
    assert.equal(store.getItem("2vxsx-fae_slot1_pbv_maps_visited_count"), "1");
    assert.equal(store.getItem("aaaaa-aa_slot1_pbv_maps_visited_count"), "25");
    assert.equal(store.getItem("Bob_slot1_pbv_maps_visited_count"), null);
  });
});
