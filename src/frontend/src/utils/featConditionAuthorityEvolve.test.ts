import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clientTrustedConditionUnlocksWithoutCanisterProgress,
  exploreMapsVisitedPersistedOnCanister,
  featCounterHasCanisterField,
  groundDokaPickupsPersistedOnCanister,
  spellMasterEightIsServerChecked,
} from "./featConditionAuthorityEvolve.ts";

describe("featConditionAuthorityEvolve", () => {
  it("keeps explore/loot/spell_master_8 client-trusted and has no canister counters", () => {
    assert.equal(featCounterHasCanisterField(), false);
    assert.equal(exploreMapsVisitedPersistedOnCanister(), false);
    assert.equal(groundDokaPickupsPersistedOnCanister(), false);
    assert.equal(spellMasterEightIsServerChecked(), false);
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("explore_25_maps"),
      true,
    );
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("loot_10_doka"),
      true,
    );
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("spell_master_8"),
      true,
    );
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("first_battle_win"),
      true,
    );
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("level_10"),
      false,
    );
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("doka_1000"),
      false,
    );
    assert.equal(
      clientTrustedConditionUnlocksWithoutCanisterProgress("spell_level_5"),
      false,
    );
  });
});
