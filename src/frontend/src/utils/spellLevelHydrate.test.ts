import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { spellLevelsFromCharacterRecord } from "./spellLevelHydrate.ts";

describe("spellLevelsFromCharacterRecord", () => {
  it("does not treat empty canister arrays as a localStorage hydrate", () => {
    // Chronology: slot 1 Fireball is level 5 on the canister and in
    // `{userId}_slot1_pbv_spell_levels`. Player deletes the character and
    // creates a new one in the same slot. spellLevelKeys is []. The old
    // initializer treated that as "no backend levels" and JSON.parsed the
    // cache, so calcScaledDamage used 1.03^5 on a record that never paid.
    const emptyKeys = spellLevelsFromCharacterRecord({
      spellLevelKeys: [],
      spellLevelValues: [],
    });
    assert.deepEqual(emptyKeys, {});
    assert.deepEqual(spellLevelsFromCharacterRecord(null), {});
    assert.deepEqual(spellLevelsFromCharacterRecord(undefined), {});
  });

  it("maps parallel canister keys and values", () => {
    const mapped = spellLevelsFromCharacterRecord({
      spellLevelKeys: ["starter-fireball", "starter-heal"],
      spellLevelValues: [5n, 2],
    });
    assert.deepEqual(mapped, { "starter-fireball": 5, "starter-heal": 2 });
  });

  it("skips empty ids and floors non-finite values to 0", () => {
    const skipped = spellLevelsFromCharacterRecord({
      spellLevelKeys: ["starter-fireball", "", "starter-heal"],
      spellLevelValues: [3, Number.NaN],
    });
    assert.deepEqual(skipped, { "starter-fireball": 3, "starter-heal": 0 });
  });
});
