import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerSpellListLifecycleChip,
  ownerSpellListMissingLifecycleChipOnMain,
} from "./adminOwnerUx.spellLifecycleChip.ts";
import { isBuiltInSpellId } from "./adminSafety.ts";

describe("ownerSpellListLifecycleChip", () => {
  it("does not paint a retired built-in as live", () => {
    const copy = ownerSpellListLifecycleChip({
      usableByPlayer: false,
      isBuiltIn: true,
    });
    assert.equal(copy.kind, "retired");
    assert.match(copy.chip, /RETIRED/);
    assert.equal(/ACTIVE/i.test(copy.chip), false);
    assert.equal(ownerSpellListMissingLifecycleChipOnMain(), true);
  });

  it("labels a player-usable catalog row ACTIVE, never DRAFT", () => {
    const copy = ownerSpellListLifecycleChip({
      usableByPlayer: true,
      isBuiltIn: isBuiltInSpellId("shadow_strike"),
    });
    assert.equal(copy.kind, "active");
    assert.match(copy.chip, /ACTIVE/);
    assert.equal(/DRAFT/i.test(copy.chip), false);
  });

  it("labels a non-built-in unused row INACTIVE, not deleted", () => {
    const copy = ownerSpellListLifecycleChip({
      usableByPlayer: false,
      isBuiltIn: false,
    });
    assert.equal(copy.kind, "inactive");
    assert.match(copy.chip, /INACTIVE/);
    assert.equal(/deleted/i.test(copy.chip), false);
  });
});
