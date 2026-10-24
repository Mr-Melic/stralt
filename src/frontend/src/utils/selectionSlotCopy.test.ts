import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LOADING_SLOTS,
  SELECTION_HEADLINE,
  SELECTION_SUBCOPY,
  SLOT_HEADER,
} from "./selectionSlotCopy.ts";

describe("selectionSlotCopy", () => {
  it("slot header uses a real glyph, not a raw \\u escape", () => {
    assert.equal(SLOT_HEADER(1), "⚔ Slot 1");
    assert.equal(/\\u2694/.test(SLOT_HEADER(2)), false);
    assert.match(SLOT_HEADER(3), /^⚔ Slot 3$/);
  });

  it("loading uses a real ellipsis, not a raw \\u escape", () => {
    assert.equal(LOADING_SLOTS, "Loading character slots…");
    assert.equal(/\\u2026/.test(LOADING_SLOTS), false);
    assert.match(LOADING_SLOTS, /…$/);
  });

  it("headline brands champion, not Paper Baby Vampire", () => {
    assert.match(SELECTION_HEADLINE, /champion/i);
    assert.equal(/paper baby/i.test(SELECTION_HEADLINE), false);
    assert.match(SELECTION_SUBCOPY, /HUD|Board/i);
  });
});
