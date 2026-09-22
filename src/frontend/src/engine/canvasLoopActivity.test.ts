import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DECORATIVE_GPU_RELEASE_SIZE,
  decorativeCanvasBackingSize,
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

describe("decorativeCanvasBackingSize", () => {
  it("releases to 1×1 while the tab is hidden", () => {
    assert.deepEqual(decorativeCanvasBackingSize(true, 1920, 1080), {
      width: DECORATIVE_GPU_RELEASE_SIZE.width,
      height: DECORATIVE_GPU_RELEASE_SIZE.height,
    });
  });

  it("does not keep a full drip buffer when the parent is still large", () => {
    const hidden = decorativeCanvasBackingSize(true, 800, 600);
    assert.ok(hidden.width * hidden.height < 800 * 600);
    assert.equal(hidden.width * hidden.height, 1);
  });

  it("matches the parent while the tab is visible", () => {
    assert.deepEqual(decorativeCanvasBackingSize(false, 800, 600), {
      width: 800,
      height: 600,
    });
  });

  it("falls back when the parent has not laid out yet", () => {
    assert.deepEqual(decorativeCanvasBackingSize(false, 0, 0), {
      width: 100,
      height: 100,
    });
  });
});
