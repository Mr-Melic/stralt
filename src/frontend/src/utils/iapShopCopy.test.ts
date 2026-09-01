import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  IAP_SHOP_CLOSE_LABEL,
  IAP_SHOP_KYC_PREAMBLE,
  IAP_SHOP_PACKAGES_DETAIL,
  IAP_SHOP_PACKAGES_LEAD,
  IAP_SHOP_TITLE,
} from "./iapShopCopy.ts";

describe("iapShopCopy", () => {
  it("titles the IAP modal Buy Doka, not Doka Shop", () => {
    assert.equal(IAP_SHOP_TITLE, "Buy Doka");
    assert.equal(IAP_SHOP_TITLE.includes("Doka Shop"), false);
    assert.equal(IAP_SHOP_CLOSE_LABEL.includes("Buy Doka"), true);
  });

  it("says the packages step is real-money credit, not Items", () => {
    assert.match(IAP_SHOP_PACKAGES_LEAD, /real-money/i);
    assert.match(IAP_SHOP_PACKAGES_LEAD, /EUR/i);
    assert.match(IAP_SHOP_PACKAGES_LEAD, /Items/i);
    assert.match(IAP_SHOP_PACKAGES_DETAIL, /after the operator reviews/i);
  });

  it("explains KYC before the identity form", () => {
    assert.match(IAP_SHOP_KYC_PREAMBLE, /real-money/i);
    assert.match(IAP_SHOP_KYC_PREAMBLE, /proof-of-address/i);
    assert.match(IAP_SHOP_KYC_PREAMBLE, /operator/i);
    assert.match(IAP_SHOP_KYC_PREAMBLE, /after review/i);
  });
});
