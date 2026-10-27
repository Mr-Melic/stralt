import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerPurchaseRowBusyIsPerIdOnMain,
  shouldDisableOwnerPurchaseRowActions,
  shouldOpenOwnerPurchaseConfirm,
} from "./adminOwnerUx.purchaseGlobalBusy.ts";

describe("owner purchase table global busy", () => {
  it("locks every row while any request is in flight", () => {
    assert.equal(shouldDisableOwnerPurchaseRowActions(null), false);
    assert.equal(shouldDisableOwnerPurchaseRowActions(""), false);
    assert.equal(shouldDisableOwnerPurchaseRowActions("req-a"), true);
    assert.equal(shouldOpenOwnerPurchaseConfirm("req-a"), false);
    assert.equal(shouldOpenOwnerPurchaseConfirm(null), true);
  });

  it("documents that main only disables the matching row id", () => {
    assert.equal(ownerPurchaseRowBusyIsPerIdOnMain(), true);
  });
});
