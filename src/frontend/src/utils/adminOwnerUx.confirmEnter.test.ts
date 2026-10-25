import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerConfirmHandlesEnterOnMain,
  ownerConfirmIgnoresEnterWhilePending,
  ownerPurchaseConfirmHandlesEnterOnMain,
  shouldSubmitOwnerConfirmOnKey,
} from "./adminOwnerUx.confirmEnter.ts";

describe("owner confirm Enter submit", () => {
  it("submits on Enter only while idle and enabled", () => {
    assert.equal(
      shouldSubmitOwnerConfirmOnKey({
        key: "Enter",
        pending: false,
        confirmDisabled: false,
      }),
      true,
    );
    assert.equal(
      shouldSubmitOwnerConfirmOnKey({
        key: "Enter",
        pending: true,
        confirmDisabled: false,
      }),
      false,
    );
    assert.equal(
      shouldSubmitOwnerConfirmOnKey({
        key: "Enter",
        pending: false,
        confirmDisabled: true,
      }),
      false,
    );
    assert.equal(
      shouldSubmitOwnerConfirmOnKey({
        key: "Escape",
        pending: false,
        confirmDisabled: false,
      }),
      false,
    );
    assert.equal(
      shouldSubmitOwnerConfirmOnKey({
        key: " ",
        pending: false,
        confirmDisabled: false,
      }),
      false,
    );
  });

  it("documents that main ConfirmDialog / PurchaseConfirm ignore Enter", () => {
    assert.equal(ownerConfirmHandlesEnterOnMain(), false);
    assert.equal(ownerPurchaseConfirmHandlesEnterOnMain(), false);
    assert.equal(
      ownerConfirmIgnoresEnterWhilePending({ key: "Enter", pending: true }),
      true,
    );
  });
});
