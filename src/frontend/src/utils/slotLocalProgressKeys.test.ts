import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  activeSpellsLocalKey,
  displayNameOwnerKeyIsUnsafeForPersist,
  mapsVisitedLocalKey,
  resolveSlotLocalOwnerKey,
  spellLevelsLocalKey,
} from "./slotLocalProgressKeys.ts";

describe("slotLocalProgressKeys", () => {
  it("builds slot-scoped spell and maps keys", () => {
    assert.equal(
      spellLevelsLocalKey("aaaaa-aa", 1),
      "aaaaa-aa_slot1_pbv_spell_levels",
    );
    assert.equal(
      activeSpellsLocalKey("aaaaa-aa", 2),
      "aaaaa-aa_slot2_pbv_active_spells",
    );
    assert.equal(
      mapsVisitedLocalKey("aaaaa-aa", 3),
      "aaaaa-aa_slot3_pbv_maps_visited_count",
    );
  });

  it("treats display-name owner keys as unsafe for persist", () => {
    assert.equal(displayNameOwnerKeyIsUnsafeForPersist("VampireBob"), true);
    assert.equal(displayNameOwnerKeyIsUnsafeForPersist("guest"), true);
    assert.equal(displayNameOwnerKeyIsUnsafeForPersist("aaaaa-aa"), false);
    assert.deepEqual(resolveSlotLocalOwnerKey(null, "VampireBob"), {
      key: "VampireBob",
      isPrincipal: false,
    });
    assert.deepEqual(resolveSlotLocalOwnerKey("2vxsx-fae", "VampireBob"), {
      key: "2vxsx-fae",
      isPrincipal: true,
    });
  });
});
