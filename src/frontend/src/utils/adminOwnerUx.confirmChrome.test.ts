import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerConfirmChrome,
  ownerConfirmDialogHasErrorSlotOnMain,
  ownerConfirmDialogHasPendingSlotOnMain,
  ownerPurchaseConfirmHasPendingSlotOnMain,
} from "./adminOwnerUx.confirmChrome.ts";

describe("owner confirm dialog chrome", () => {
  it("disables confirm and swaps the label while the write is in flight", () => {
    const chrome = ownerConfirmChrome("pending", "Grant Doka");
    assert.equal(chrome.confirmDisabled, true);
    assert.equal(chrome.confirmLabel, "Working…");
    assert.equal(chrome.showError, false);
    assert.equal(chrome.errorText, null);
  });

  it("keeps confirm enabled on #err and shows an in-dialog failure", () => {
    const chrome = ownerConfirmChrome("err", "Grant Doka");
    assert.equal(chrome.confirmDisabled, false);
    assert.equal(chrome.confirmLabel, "Grant Doka");
    assert.equal(chrome.showError, true);
    assert.match(String(chrome.errorText), /Write failed/);
    assert.match(String(chrome.errorText), /not changed/);
  });

  it("leaves idle / ok chrome as the idle label with no error", () => {
    for (const phase of ["idle", "ok"] as const) {
      const chrome = ownerConfirmChrome(phase, "Ban player");
      assert.equal(chrome.confirmDisabled, false);
      assert.equal(chrome.confirmLabel, "Ban player");
      assert.equal(chrome.showError, false);
      assert.equal(chrome.errorText, null);
    }
  });

  it("documents that main ConfirmDialog / PurchaseConfirm have no slots", () => {
    assert.equal(ownerConfirmDialogHasPendingSlotOnMain(), false);
    assert.equal(ownerConfirmDialogHasErrorSlotOnMain(), false);
    assert.equal(ownerPurchaseConfirmHasPendingSlotOnMain(), false);
  });
});
