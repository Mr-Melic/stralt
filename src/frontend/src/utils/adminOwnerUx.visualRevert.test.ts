import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerVisualRevertConfirmBody,
  ownerVisualRevertIsError,
  ownerVisualRevertLabel,
  ownerVisualRevertLeavesValidEmpty,
  ownerVisualRevertStatusAfterClear,
  shouldOfferOwnerVisualRevert,
} from "./adminOwnerUx.visualRevert.ts";
import { DEFAULT_PIXEL_VISUAL_STATUS } from "./adminVisualStatus.ts";

describe("owner visual revert", () => {
  it("offers revert only when a custom override is set", () => {
    assert.equal(shouldOfferOwnerVisualRevert(true), true);
    assert.equal(shouldOfferOwnerVisualRevert(false), false);
  });

  it("labels revert as Default Pixel Visual, not an error clear", () => {
    assert.equal(ownerVisualRevertLabel(), "Revert to Default Pixel Visual");
    assert.equal(
      ownerVisualRevertStatusAfterClear(),
      DEFAULT_PIXEL_VISUAL_STATUS,
    );
    assert.equal(ownerVisualRevertIsError(), false);
    assert.equal(ownerVisualRevertLeavesValidEmpty(true), true);
  });

  it("keeps empty-after-revert copy from sounding like a validation failure", () => {
    const enemy = ownerVisualRevertConfirmBody("enemy");
    assert.match(enemy, /Default Pixel Visual/);
    assert.match(enemy, /Empty is valid/);
    assert.equal(/error/i.test(enemy.replace("not an error", "")), false);
    const sprite = ownerVisualRevertConfirmBody("sprite");
    assert.match(sprite, /Default Pixel Visual/);
    const ad = ownerVisualRevertConfirmBody("ad");
    assert.match(ad, /valid default/);
  });
});
