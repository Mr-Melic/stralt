import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  emptyUiLayoutIsCreateDefault,
  saveCallerUserProfileMergesUiLayout,
  saveUserUiLayoutMergesExistingName,
  staleProfileSaveWouldWipeLayout,
} from "./userProfileReplacePersist.ts";

describe("userProfileReplacePersist", () => {
  it("treats empty uiLayout on saveCallerUserProfile as a wipe, not a merge", () => {
    assert.equal(saveCallerUserProfileMergesUiLayout(), false);
    assert.equal(saveUserUiLayoutMergesExistingName(), true);
    assert.equal(emptyUiLayoutIsCreateDefault(), true);
    assert.equal(
      staleProfileSaveWouldWipeLayout({
        storedLayout: '{"top":{"x":1}}',
        incomingLayout: "",
      }),
      true,
    );
    assert.equal(
      staleProfileSaveWouldWipeLayout({
        storedLayout: "",
        incomingLayout: "",
      }),
      false,
    );
    assert.equal(
      staleProfileSaveWouldWipeLayout({
        storedLayout: '{"top":{"x":1}}',
        incomingLayout: '{"top":{"x":1}}',
      }),
      false,
    );
  });
});
