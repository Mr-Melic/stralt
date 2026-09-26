import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSmallScreenViewport,
  shouldCommitIsSmallScreen,
} from "./smallScreenActivity.ts";

describe("smallScreenActivity", () => {
  it("treats widths below 768 as small", () => {
    assert.equal(isSmallScreenViewport(767), true);
    assert.equal(isSmallScreenViewport(768), false);
    assert.equal(isSmallScreenViewport(1024), false);
  });

  it("skips React commits when resize stays on the same side of 768", () => {
    assert.equal(shouldCommitIsSmallScreen(true, 390), false);
    assert.equal(shouldCommitIsSmallScreen(true, 767), false);
    assert.equal(shouldCommitIsSmallScreen(false, 1024), false);
    assert.equal(shouldCommitIsSmallScreen(false, 768), false);
  });

  it("commits when resize crosses 768", () => {
    assert.equal(shouldCommitIsSmallScreen(true, 800), true);
    assert.equal(shouldCommitIsSmallScreen(false, 500), true);
  });
});
