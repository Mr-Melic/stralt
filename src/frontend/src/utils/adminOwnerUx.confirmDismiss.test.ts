import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerConfirmButtonDisabled,
  ownerConfirmDismissedBeforeSettle,
  shouldDismissOwnerConfirm,
  shouldKeepOwnerConfirmOpen,
} from "./adminOwnerUx.confirmDismiss.ts";

describe("owner confirm dismiss", () => {
  it("dismisses the dialog only after a successful write", () => {
    assert.equal(shouldDismissOwnerConfirm("ok"), true);
    assert.equal(shouldKeepOwnerConfirmOpen("ok"), false);
  });

  it("keeps the dialog on idle, pending, and #err so the operator can retry", () => {
    for (const phase of ["idle", "pending", "err"] as const) {
      assert.equal(shouldDismissOwnerConfirm(phase), false);
      assert.equal(shouldKeepOwnerConfirmOpen(phase), true);
    }
  });

  it("disables confirm while the actor write is in flight", () => {
    assert.equal(ownerConfirmButtonDisabled("pending"), true);
    assert.equal(ownerConfirmButtonDisabled("idle"), false);
    assert.equal(ownerConfirmButtonDisabled("err"), false);
    assert.equal(ownerConfirmButtonDisabled("ok"), false);
  });

  it("flags Shop / GameKey / delete confirms that unmount before #ok", () => {
    assert.equal(
      ownerConfirmDismissedBeforeSettle({
        dialogClosed: true,
        phase: "pending",
      }),
      true,
    );
    assert.equal(
      ownerConfirmDismissedBeforeSettle({
        dialogClosed: true,
        phase: "err",
      }),
      true,
    );
    assert.equal(
      ownerConfirmDismissedBeforeSettle({
        dialogClosed: true,
        phase: "ok",
      }),
      false,
    );
    assert.equal(
      ownerConfirmDismissedBeforeSettle({
        dialogClosed: false,
        phase: "pending",
      }),
      false,
    );
  });
});
