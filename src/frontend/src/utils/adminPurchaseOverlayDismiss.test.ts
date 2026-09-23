import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  gameKeyAdminEscapeCloses,
  shouldActivateGameKeyAdminOverlayDismiss,
  shouldCancelGameKeyAdminOverlayOnBackdrop,
} from "./adminPurchaseOverlayDismiss.ts";

describe("gameKeyAdminEscapeCloses", () => {
  it("cancels the stacked confirm before closing the reveal sheet", () => {
    assert.equal(gameKeyAdminEscapeCloses("Escape", true, true), "confirm");
    assert.equal(gameKeyAdminEscapeCloses("Escape", false, true), "reveal");
    assert.equal(gameKeyAdminEscapeCloses("Escape", true, false), "confirm");
    assert.equal(gameKeyAdminEscapeCloses("Escape", false, false), null);
  });

  it("ignores keys that would confirm a spend", () => {
    assert.equal(gameKeyAdminEscapeCloses("Enter", true, true), null);
    assert.equal(gameKeyAdminEscapeCloses(" ", true, false), null);
    assert.equal(gameKeyAdminEscapeCloses("Tab", false, true), null);
    assert.equal(gameKeyAdminEscapeCloses("", true, true), null);
  });
});

describe("shouldCancelGameKeyAdminOverlayOnBackdrop", () => {
  it("cancels only when the click lands on the dimmer, not the panel", () => {
    const overlay = { id: "overlay" };
    const panel = { id: "panel" };
    assert.equal(
      shouldCancelGameKeyAdminOverlayOnBackdrop(overlay, overlay),
      true,
    );
    assert.equal(
      shouldCancelGameKeyAdminOverlayOnBackdrop(panel, overlay),
      false,
    );
    assert.equal(
      shouldCancelGameKeyAdminOverlayOnBackdrop(null, overlay),
      false,
    );
  });
});

describe("shouldActivateGameKeyAdminOverlayDismiss", () => {
  it("cancels Enter/Space on the dimmer and ignores inner controls", () => {
    const overlay = { id: "overlay" };
    const panel = { id: "panel" };
    assert.equal(
      shouldActivateGameKeyAdminOverlayDismiss("Enter", overlay, overlay),
      true,
    );
    assert.equal(
      shouldActivateGameKeyAdminOverlayDismiss(" ", overlay, overlay),
      true,
    );
    assert.equal(
      shouldActivateGameKeyAdminOverlayDismiss("Enter", panel, overlay),
      false,
    );
    assert.equal(
      shouldActivateGameKeyAdminOverlayDismiss("Escape", overlay, overlay),
      false,
    );
  });
});
