import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isMobileViewport, shouldCommitIsMobile } from "./viewportActivity.ts";

describe("viewportActivity", () => {
  it("treats widths below 768 as mobile", () => {
    assert.equal(isMobileViewport(767), true);
    assert.equal(isMobileViewport(768), false);
    assert.equal(isMobileViewport(1024), false);
  });

  it("skips React commits when resize stays on the same side of the breakpoint", () => {
    assert.equal(shouldCommitIsMobile(true, 390), false);
    assert.equal(shouldCommitIsMobile(true, 767), false);
    assert.equal(shouldCommitIsMobile(false, 1024), false);
    assert.equal(shouldCommitIsMobile(false, 768), false);
  });

  it("commits when resize crosses the breakpoint", () => {
    assert.equal(shouldCommitIsMobile(true, 800), true);
    assert.equal(shouldCommitIsMobile(false, 500), true);
  });
});
