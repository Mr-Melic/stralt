import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerActorErrorToast,
  ownerSpellDeleteBlockedReason,
  ownerSpellDeleteConfirmBody,
  ownerSpellDeleteSuccessCopy,
  shouldOpenOwnerSpellDeleteConfirm,
} from "./adminOwnerUx.spellDeleteCopy.ts";

describe("ownerSpellDeleteBlockedReason", () => {
  it("blocks built-in ids and allows a custom catalog row", () => {
    assert.match(
      ownerSpellDeleteBlockedReason("void_collapse") ?? "",
      /usableByPlayer/i,
    );
    assert.equal(shouldOpenOwnerSpellDeleteConfirm("void_collapse"), false);
    assert.equal(ownerSpellDeleteBlockedReason("custom_bolt"), null);
    assert.equal(shouldOpenOwnerSpellDeleteConfirm("custom_bolt"), true);
  });
});

describe("ownerSpellDeleteConfirmBody", () => {
  it("does not claim every confirm removes the live row", () => {
    const body = ownerSpellDeleteConfirmBody();
    assert.match(body, /retire/i);
    assert.equal(/removes the live spell immediately/i.test(body), false);
    assert.match(body, /Built-in/i);
  });
});

describe("ownerSpellDeleteSuccessCopy", () => {
  it("does not toast deleted when the row is still in the catalog", () => {
    const retired = ownerSpellDeleteSuccessCopy(true);
    assert.match(retired, /retired/i);
    assert.equal(/^Spell deleted$/i.test(retired), false);
    assert.match(ownerSpellDeleteSuccessCopy(false), /removed/i);
  });
});

describe("ownerActorErrorToast", () => {
  it("surfaces the canister message instead of a generic Failed to delete", () => {
    assert.match(
      ownerActorErrorToast(
        new Error(
          "Cannot delete a built-in spell; set usableByPlayer=false to retire it",
        ),
        "Failed to delete spell",
      ),
      /built-in/i,
    );
    assert.equal(
      ownerActorErrorToast({}, "Failed to delete spell"),
      "Failed to delete spell",
    );
  });
});
