import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerSpriteFacingUrlIsStored,
  ownerSpriteListChipMissingOnMain,
  ownerSpriteListVisualChip,
} from "./adminOwnerUx.spriteListChip.ts";
import {
  DEFAULT_PIXEL_VISUAL_CHIP,
  DEFAULT_PIXEL_VISUAL_STATUS,
  STORED_URL_NOT_RENDERED_CHIP,
} from "./adminVisualStatus.ts";

describe("ownerSpriteListVisualChip", () => {
  it("treats empty facing URLs as Default Pixel Visual, never an error", () => {
    const copy = ownerSpriteListVisualChip([], [], [], []);
    assert.equal(copy.chip, DEFAULT_PIXEL_VISUAL_CHIP);
    assert.equal(copy.status, DEFAULT_PIXEL_VISUAL_STATUS);
    assert.equal(copy.storedNotRendered, false);
    assert.equal(/error/i.test(copy.chip), false);
    assert.equal(/error/i.test(copy.status), false);
    assert.equal(/missing/i.test(copy.chip), false);
    assert.equal(ownerSpriteListChipMissingOnMain(), true);
  });

  it("treats a stored facing URL as catalog data, not a live custom visual", () => {
    const copy = ownerSpriteListVisualChip(["https://x/front.png"], [], [], []);
    assert.equal(copy.chip, STORED_URL_NOT_RENDERED_CHIP);
    assert.equal(copy.storedNotRendered, true);
    assert.equal(/custom visual/i.test(copy.chip), false);
    assert.equal(/override/i.test(copy.status), false);
  });

  it("counts any facing URL as stored, not only frontUrl", () => {
    assert.equal(ownerSpriteFacingUrlIsStored([], ["https://x/r.png"]), true);
    assert.equal(
      ownerSpriteFacingUrlIsStored([], [], ["https://x/l.png"]),
      true,
    );
    assert.equal(
      ownerSpriteFacingUrlIsStored([], [], [], ["https://x/b.png"]),
      true,
    );
    assert.equal(ownerSpriteFacingUrlIsStored([""], [""], [""], [""]), false);
  });
});
