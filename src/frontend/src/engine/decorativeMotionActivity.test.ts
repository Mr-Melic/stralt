import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyDecorativeCssPlayState,
  decorativeCssPlayState,
} from "./decorativeMotionActivity.ts";

describe("decorativeCssPlayState", () => {
  it("runs while the tab is visible", () => {
    assert.equal(decorativeCssPlayState(false), "running");
  });

  it("pauses while the tab is hidden", () => {
    assert.equal(decorativeCssPlayState(true), "paused");
  });
});

describe("applyDecorativeCssPlayState", () => {
  it("is a no-op when the element is missing", () => {
    applyDecorativeCssPlayState(null, true);
  });

  it("writes inherited animation-play-state onto the layer", () => {
    const el = { style: { animationPlayState: "running" } };
    applyDecorativeCssPlayState(el, true);
    assert.equal(el.style.animationPlayState, "paused");
    applyDecorativeCssPlayState(el, false);
    assert.equal(el.style.animationPlayState, "running");
  });
});
