import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mergeUserProfileWrite,
  profileSetupWouldWipeLayout,
} from "./userProfileEvolve.ts";

describe("saveCallerUserProfile merge (keep stored uiLayout)", () => {
  it("keeps an empty layout on first create", () => {
    assert.deepEqual(
      mergeUserProfileWrite(null, { name: "Ada", uiLayout: "" }),
      { name: "Ada", uiLayout: "" },
    );
  });

  it("does not wipe a stored layout when ProfileSetup resends uiLayout empty", () => {
    const stored = { name: "Ada", uiLayout: '{"stats":{"x":1}}' };
    assert.equal(profileSetupWouldWipeLayout(stored, ""), true);
    assert.deepEqual(
      mergeUserProfileWrite(stored, { name: "Ada", uiLayout: "" }),
      {
        name: "Ada",
        uiLayout: '{"stats":{"x":1}}',
      },
    );
  });

  it("is idempotent and still accepts an explicit non-empty layout replace", () => {
    const stored = { name: "Ada", uiLayout: '{"stats":{"x":1}}' };
    const once = mergeUserProfileWrite(stored, { name: "Bob", uiLayout: "" });
    assert.deepEqual(
      mergeUserProfileWrite(once, { name: "Bob", uiLayout: "" }),
      once,
    );
    assert.deepEqual(
      mergeUserProfileWrite(stored, {
        name: "Ada",
        uiLayout: '{"chat":{"x":2}}',
      }),
      { name: "Ada", uiLayout: '{"chat":{"x":2}}' },
    );
  });
});
