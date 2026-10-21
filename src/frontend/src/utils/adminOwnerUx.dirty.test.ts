import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerDirtyLeaveCopy,
  ownerFormIsDirty,
  shouldPromptOwnerLeave,
  shouldWarnOwnerBeforeUnload,
} from "./adminOwnerUx.dirty.ts";

describe("owner dirty tracking", () => {
  it("does not warn on an unchanged form, including bigint stats", () => {
    const row = { id: "shadow", hp: 50n, name: "Shadow Knight" };
    assert.equal(ownerFormIsDirty(row, { ...row }), false);
    assert.equal(
      shouldPromptOwnerLeave({ editorOpen: true, isDirty: false }),
      false,
    );
    assert.equal(shouldWarnOwnerBeforeUnload(false), false);
    assert.equal(ownerDirtyLeaveCopy(false), null);
  });

  it("warns only when the open editor actually changed", () => {
    const baseline = { id: "shadow", hp: 50n };
    const current = { id: "shadow", hp: 80n };
    assert.equal(ownerFormIsDirty(baseline, current), true);
    assert.equal(
      shouldPromptOwnerLeave({ editorOpen: true, isDirty: true }),
      true,
    );
    assert.equal(
      shouldPromptOwnerLeave({ editorOpen: false, isDirty: true }),
      false,
    );
    assert.equal(shouldWarnOwnerBeforeUnload(true), true);
    assert.match(ownerDirtyLeaveCopy(true) ?? "", /Unsaved edits/);
  });
});
