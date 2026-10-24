import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerShopGrantCanDoubleCreditWithApprove,
  ownerShopGrantConfirmBody,
  ownerShopGrantIsPurchaseFulfillment,
  ownerShopGrantLooksLikePurchaseFulfillment,
  ownerShopGrantPurchaseIdOnMain,
} from "./adminOwnerUx.grantLink.ts";

describe("owner shop grant purchase link", () => {
  it("documents that main always passes a null purchaseId", () => {
    assert.equal(ownerShopGrantPurchaseIdOnMain(), null);
    assert.equal(
      ownerShopGrantIsPurchaseFulfillment(ownerShopGrantPurchaseIdOnMain()),
      false,
    );
    assert.equal(ownerShopGrantIsPurchaseFulfillment("req_1"), true);
    assert.equal(ownerShopGrantIsPurchaseFulfillment("  "), false);
    assert.equal(ownerShopGrantIsPurchaseFulfillment(undefined), false);
  });

  it("warns that Grant is not a GameKey fulfillment and can double-credit", () => {
    const body = ownerShopGrantConfirmBody({
      amount: 1000,
      principal: "aaaaa-aa",
    });
    assert.match(body, /1000/);
    assert.match(body, /aaaaa-aa/);
    assert.match(body, /not a GameKey fulfillment/);
    assert.match(body, /Purchases row stays pending/);
    assert.match(body, /Cancel does not write/);
    assert.equal(ownerShopGrantLooksLikePurchaseFulfillment(body), false);
    assert.equal(
      ownerShopGrantCanDoubleCreditWithApprove({
        grantedUnlinked: true,
        laterApprovedSamePrincipal: true,
      }),
      true,
    );
    assert.equal(
      ownerShopGrantCanDoubleCreditWithApprove({
        grantedUnlinked: true,
        laterApprovedSamePrincipal: false,
      }),
      false,
    );
  });

  it("flags copy that would make Grant look like Purchases Approve", () => {
    assert.equal(
      ownerShopGrantLooksLikePurchaseFulfillment(
        "This will approve the GameKey request.",
      ),
      true,
    );
  });
});
