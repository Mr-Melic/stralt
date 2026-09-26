import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampInspectPopupPosition } from "./inspectPopupPosition.ts";

describe("clampInspectPopupPosition", () => {
  it("centers when there is no chip anchor (sprite inspect)", () => {
    const pos = clampInspectPopupPosition({
      anchorRect: null,
      popupWidth: 248,
      popupHeight: 320,
      viewportWidth: 390,
      viewportHeight: 844,
      margin: 12,
    });
    assert.equal(pos.left, (390 - 248) / 2);
    assert.equal(pos.top, (844 - 320) / 2);
  });

  it("does not sit at 0,0 on a phone when the chip rect is missing", () => {
    const pos = clampInspectPopupPosition({
      anchorRect: undefined,
      popupWidth: 248,
      popupHeight: 320,
      viewportWidth: 390,
      viewportHeight: 844,
      margin: 12,
      safeTop: 47,
      safeLeft: 0,
      safeRight: 0,
      safeBottom: 34,
    });
    assert.ok(pos.left > 0);
    assert.ok(pos.top >= 47);
    assert.ok(pos.top + 320 <= 844 - 34);
  });

  it("keeps an anchored card inside the padded viewport", () => {
    const pos = clampInspectPopupPosition({
      anchorRect: { left: 8, top: 800, width: 46, height: 46 },
      popupWidth: 248,
      popupHeight: 320,
      viewportWidth: 390,
      viewportHeight: 844,
      margin: 12,
      safeBottom: 34,
    });
    assert.ok(pos.left >= 12);
    assert.ok(pos.left + 248 <= 390 - 12);
    assert.ok(pos.top >= 12);
    assert.ok(pos.top + 320 <= 844 - 34);
  });
});
