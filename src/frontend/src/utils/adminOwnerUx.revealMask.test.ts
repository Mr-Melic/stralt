import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  maskOwnerGameKey,
  ownerGameKeyEmptyIsValidDefault,
  ownerGameKeyLooksFullyVisible,
  ownerGameKeyRevealShowsPlaintextOnMain,
} from "./adminOwnerUx.revealMask.ts";

describe("owner GameKey reveal mask", () => {
  it("masks all but the last four until explicitly revealed", () => {
    const code = "A".repeat(120);
    const masked = maskOwnerGameKey(code, false);
    assert.equal(masked.endsWith("AAAA"), true);
    assert.equal(masked.includes("A".repeat(20)), false);
    assert.equal(ownerGameKeyLooksFullyVisible(masked, code), false);
    assert.equal(maskOwnerGameKey(code, true), code);
    assert.equal(ownerGameKeyLooksFullyVisible(code, code), true);
  });

  it("treats an empty code as a valid default, not an error", () => {
    assert.equal(maskOwnerGameKey("", false), "");
    assert.equal(maskOwnerGameKey("   ", true), "");
    assert.equal(ownerGameKeyEmptyIsValidDefault(""), true);
    assert.equal(ownerGameKeyEmptyIsValidDefault("  "), true);
    assert.equal(ownerGameKeyEmptyIsValidDefault("abcd"), false);
    assert.equal(ownerGameKeyLooksFullyVisible("", ""), false);
  });

  it("documents that main paints the plaintext in the reveal textarea", () => {
    assert.equal(ownerGameKeyRevealShowsPlaintextOnMain(), true);
  });
});
