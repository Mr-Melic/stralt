import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldFocusChatComposer,
  shouldRefreshClickTraceMirror,
} from "./chatPanelActivity.ts";

describe("chatPanelActivity", () => {
  it("focuses the composer only while chat is unfolded", () => {
    assert.equal(shouldFocusChatComposer(false), true);
    assert.equal(shouldFocusChatComposer(true), false);
  });

  it("refreshes click traces only on the Debug Clicks sub-view", () => {
    assert.equal(shouldRefreshClickTraceMirror("debug", "clicks"), true);
    assert.equal(shouldRefreshClickTraceMirror("debug", "log"), false);
    assert.equal(shouldRefreshClickTraceMirror("general", "clicks"), false);
  });
});
