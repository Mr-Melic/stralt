import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerOverlayClosesOnBackdrop,
  ownerOverlayIgnoresKey,
  shouldCloseOwnerOverlayOnKey,
} from "./adminOwnerUx.overlayKey.ts";

describe("owner overlay keyboard", () => {
  it("closes the GameKey reveal overlay on Escape", () => {
    assert.equal(shouldCloseOwnerOverlayOnKey("Escape"), true);
    assert.equal(ownerOverlayIgnoresKey("Escape"), false);
  });

  it("ignores other keys so typing in the readonly code field is safe", () => {
    assert.equal(shouldCloseOwnerOverlayOnKey("Enter"), false);
    assert.equal(shouldCloseOwnerOverlayOnKey(" "), false);
    assert.equal(shouldCloseOwnerOverlayOnKey("a"), false);
    assert.equal(ownerOverlayIgnoresKey("Enter"), true);
  });

  it("closes when the dimmed backdrop is the click target", () => {
    assert.equal(
      ownerOverlayClosesOnBackdrop({ targetIsBackdrop: true }),
      true,
    );
    assert.equal(
      ownerOverlayClosesOnBackdrop({ targetIsBackdrop: false }),
      false,
    );
  });
});
