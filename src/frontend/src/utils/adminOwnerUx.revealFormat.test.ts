import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerCopySkipsFormatCheckOnMain,
  ownerGameKeyRevealBlockedReason,
  ownerRevealAcceptsAnyStringOnMain,
  shouldCopyOwnerGameKey,
  shouldShowOwnerGameKeyReveal,
} from "./adminOwnerUx.revealFormat.ts";
import { GAME_KEY_LENGTH } from "./dokaGameKey.ts";

describe("owner GameKey reveal format gate", () => {
  it("allows a 120-char alphabet key and blocks truncated or empty", () => {
    const ok = "A".repeat(GAME_KEY_LENGTH);
    assert.equal(shouldShowOwnerGameKeyReveal(ok), true);
    assert.equal(shouldCopyOwnerGameKey(ok), true);
    assert.equal(ownerGameKeyRevealBlockedReason(ok), null);
    assert.equal(shouldShowOwnerGameKeyReveal(""), false);
    assert.equal(shouldCopyOwnerGameKey("A".repeat(119)), false);
    assert.match(
      ownerGameKeyRevealBlockedReason("A".repeat(119)) ?? "",
      /too short/i,
    );
  });

  it("documents that main reveal/copy skip the format check", () => {
    assert.equal(ownerRevealAcceptsAnyStringOnMain(), true);
    assert.equal(ownerCopySkipsFormatCheckOnMain(), true);
  });
});
