import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldReleaseDecorativeCanvasBuffer,
  shouldRunDecorativeCanvasLoop,
} from "./canvasLoopActivity.ts";

describe("shouldRunDecorativeCanvasLoop", () => {
  it("runs while the tab is visible", () => {
    assert.equal(shouldRunDecorativeCanvasLoop(false), true);
  });

  it("stops while the tab is hidden", () => {
    assert.equal(shouldRunDecorativeCanvasLoop(true), false);
  });
});

describe("shouldReleaseDecorativeCanvasBuffer", () => {
  it("releases the drip canvas backing store while the tab is hidden", () => {
    assert.equal(shouldReleaseDecorativeCanvasBuffer(true), true);
    assert.equal(shouldReleaseDecorativeCanvasBuffer(false), false);
  });
});
