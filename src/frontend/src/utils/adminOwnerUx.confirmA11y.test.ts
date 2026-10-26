import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_CONFIRM_ROLE,
  ownerConfirmA11yProps,
  ownerConfirmBackgroundShouldBeInert,
  ownerConfirmHasAlertdialogRoleOnMain,
  ownerConfirmInitialFocus,
  ownerConfirmTrapsFocusOnMain,
  ownerPurchaseConfirmHasAlertdialogRoleOnMain,
} from "./adminOwnerUx.confirmA11y.ts";

describe("owner confirm dialog a11y", () => {
  it("exposes alertdialog + modal labelling", () => {
    const props = ownerConfirmA11yProps({
      titleId: "admin.shop.grant.title",
      bodyId: "admin.shop.grant.body",
    });
    assert.equal(props.role, OWNER_CONFIRM_ROLE);
    assert.equal(props["aria-modal"], true);
    assert.equal(props["aria-labelledby"], "admin.shop.grant.title");
    assert.equal(props["aria-describedby"], "admin.shop.grant.body");
    assert.equal(ownerConfirmInitialFocus(), "cancel");
    assert.equal(ownerConfirmBackgroundShouldBeInert(), true);
  });

  it("documents that main overlays have no alertdialog or focus trap", () => {
    assert.equal(ownerConfirmHasAlertdialogRoleOnMain(), false);
    assert.equal(ownerPurchaseConfirmHasAlertdialogRoleOnMain(), false);
    assert.equal(ownerConfirmTrapsFocusOnMain(), false);
  });
});
