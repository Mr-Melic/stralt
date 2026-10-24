import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEGACY_ACTIVE_SPELLS_KEY,
  activeSpellsCacheToIds,
  headCopiesLegacyOverNamespacedWheneverPresent,
  legacyActiveSpellsWouldOverwriteNamespaced,
  namespacedActiveSpellsKey,
  shouldCopyLegacyActiveSpells,
} from "./legacyActiveSpellsMigrate.ts";

describe("legacyActiveSpellsMigrate", () => {
  it("copies the global bar only when the namespaced key is empty", () => {
    assert.equal(LEGACY_ACTIVE_SPELLS_KEY, "pbv_active_spells");
    assert.equal(
      namespacedActiveSpellsKey("alice", 1),
      "alice_slot1_pbv_active_spells",
    );
    assert.equal(headCopiesLegacyOverNamespacedWheneverPresent(), true);
    assert.equal(
      shouldCopyLegacyActiveSpells({
        namespacedExisting: null,
        legacyGlobal: '["shadow_strike"]',
      }),
      true,
    );
    assert.equal(
      shouldCopyLegacyActiveSpells({
        namespacedExisting: '["spell-inferno"]',
        legacyGlobal: '["fireball"]',
      }),
      false,
    );
    assert.equal(
      legacyActiveSpellsWouldOverwriteNamespaced({
        namespacedExisting: '["spell-inferno"]',
        legacyGlobal: '["fireball"]',
      }),
      true,
    );
    assert.equal(
      shouldCopyLegacyActiveSpells({
        namespacedExisting: '["spell-inferno"]',
        legacyGlobal: null,
      }),
      false,
    );
  });

  it("reads id strings and legacy SpellConfig objects; drops junk", () => {
    assert.deepEqual(
      activeSpellsCacheToIds('["shadow_strike","spell-inferno"]'),
      ["shadow_strike", "spell-inferno"],
    );
    assert.deepEqual(
      activeSpellsCacheToIds('[{"id":"fireball","name":"Fireball"}]'),
      ["fireball"],
    );
    assert.deepEqual(activeSpellsCacheToIds("[1,null,{}]"), []);
    assert.deepEqual(activeSpellsCacheToIds("not-json"), []);
  });
});
