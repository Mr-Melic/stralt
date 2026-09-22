import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldDismissShopDialogOnBackdrop,
  shouldDismissShopDialogOnKey,
  subscribeEscapeToDismiss,
} from "./shopDialogDismiss.ts";

describe("shouldDismissShopDialogOnBackdrop", () => {
  it("closes only when the click lands on the overlay, not the panel", () => {
    const overlay = { id: "overlay" };
    const panel = { id: "panel" };
    assert.equal(shouldDismissShopDialogOnBackdrop(overlay, overlay), true);
    assert.equal(shouldDismissShopDialogOnBackdrop(panel, overlay), false);
    assert.equal(shouldDismissShopDialogOnBackdrop(null, overlay), false);
    assert.equal(shouldDismissShopDialogOnBackdrop(overlay, null), false);
  });
});

describe("shouldDismissShopDialogOnKey", () => {
  it("closes on Escape and ignores other keys", () => {
    assert.equal(shouldDismissShopDialogOnKey("Escape"), true);
    assert.equal(shouldDismissShopDialogOnKey("Enter"), false);
    assert.equal(shouldDismissShopDialogOnKey("Tab"), false);
    assert.equal(shouldDismissShopDialogOnKey(""), false);
  });
});

describe("subscribeEscapeToDismiss", () => {
  it("invokes onClose only for Escape and unsubscribes", () => {
    const target = new EventTarget();
    let closes = 0;
    const unsubscribe = subscribeEscapeToDismiss(() => {
      closes += 1;
    }, target);
    const keydown = (key: string) => {
      const event = new Event("keydown");
      Object.defineProperty(event, "key", { value: key });
      return event;
    };
    target.dispatchEvent(keydown("Tab"));
    target.dispatchEvent(keydown("Escape"));
    assert.equal(closes, 1);
    unsubscribe();
    target.dispatchEvent(keydown("Escape"));
    assert.equal(closes, 1);
  });
});
