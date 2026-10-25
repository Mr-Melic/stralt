import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  covenantBuffMapsRefIsConsumedInCombat,
  shouldClearShrineCovenantKeysOnCharacterDelete,
  shouldCountShrineVisitIndependentOfDokaSettle,
  shrineCountIsWiredToAFeat,
  shrineCovenantKeysSurviveSlotReuse,
  shrineCovenantStorageKey,
} from "./shrineCovenantLocalPersist.ts";

describe("shrineCovenantLocalPersist", () => {
  it("keys shrine/covenant localStorage by display-name userId and slot", () => {
    assert.equal(
      shrineCovenantStorageKey("shrine_count", "VampireBob", 1),
      "pbv_shrine_count_VampireBob_slot1",
    );
    assert.equal(
      shrineCovenantStorageKey("covenant_buff", "VampireBob", 2),
      "pbv_covenant_buff_VampireBob_slot2",
    );
    assert.equal(
      shrineCovenantStorageKey("shrine_count", "  ", 1),
      "pbv_shrine_count_guest_slot1",
    );
  });

  it("locks dead persist + slot-reuse inherit until a later feat/combat wire", () => {
    assert.equal(shrineCovenantKeysSurviveSlotReuse(), true);
    assert.equal(shrineCountIsWiredToAFeat(), false);
    assert.equal(covenantBuffMapsRefIsConsumedInCombat(), false);
    assert.equal(shouldCountShrineVisitIndependentOfDokaSettle(), true);
    assert.equal(shouldClearShrineCovenantKeysOnCharacterDelete(), true);
  });
});
