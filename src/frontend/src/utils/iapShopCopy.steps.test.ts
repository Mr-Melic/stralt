import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { IAP_SHOP_HOW_TO_HEADING, IAP_SHOP_STEPS } from "./iapShopCopy.ts";

describe("iapShopCopy how-to steps", () => {
  it("lists buy steps in request → pay → wait → redeem order", () => {
    assert.equal(IAP_SHOP_HOW_TO_HEADING, "How to buy");
    assert.equal(IAP_SHOP_STEPS.length, 4);
    assert.match(IAP_SHOP_STEPS[0], /email/i);
    assert.match(IAP_SHOP_STEPS[1], /Mollie/i);
    assert.match(IAP_SHOP_STEPS[2], /Approved/i);
    assert.match(IAP_SHOP_STEPS[3], /120-character GameKey/i);
  });
});
