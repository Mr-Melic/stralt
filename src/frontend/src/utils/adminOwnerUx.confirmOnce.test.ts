import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  confirmOnceButtonLabel,
  createConfirmOnceLock,
  shouldBlockConfirmOnce,
  tryBeginConfirmOnce,
} from "./adminOwnerUx.confirmOnce.ts";

describe("confirm-once latch", () => {
  it("accepts the first click and rejects the second", () => {
    const lock = createConfirmOnceLock();
    assert.equal(shouldBlockConfirmOnce(lock), false);
    assert.equal(tryBeginConfirmOnce(lock), true);
    assert.equal(shouldBlockConfirmOnce(lock), true);
    assert.equal(tryBeginConfirmOnce(lock), false);
  });

  it("treats missing locks as not armed", () => {
    assert.equal(shouldBlockConfirmOnce(null), false);
    assert.equal(shouldBlockConfirmOnce(undefined), false);
    assert.equal(shouldBlockConfirmOnce({ taken: false }), false);
  });

  it("keeps the idle label until armed", () => {
    assert.equal(confirmOnceButtonLabel(false, "Delete"), "Delete");
    assert.equal(confirmOnceButtonLabel(true, "Delete"), "Working…");
  });
});
