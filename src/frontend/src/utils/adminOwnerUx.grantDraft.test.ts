import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerShopGrantAmountCoercesEmptyToZeroOnMain,
  ownerShopGrantAmountParseIntHasNoRadixOnMain,
  parseOwnerGrantAmountDraft,
  shouldKeepOwnerGrantAmountAsString,
} from "./adminOwnerUx.grantDraft.ts";

describe("owner Shop Grant amount draft", () => {
  it("parses a whole positive amount and keeps empty as an error, not 0", () => {
    assert.deepEqual(parseOwnerGrantAmountDraft("1000"), { ok: 1000 });
    assert.equal("err" in parseOwnerGrantAmountDraft(""), true);
    assert.equal("err" in parseOwnerGrantAmountDraft("  "), true);
    assert.equal("err" in parseOwnerGrantAmountDraft("0"), true);
    assert.equal("err" in parseOwnerGrantAmountDraft("0x10"), true);
    assert.equal("err" in parseOwnerGrantAmountDraft("10.5"), true);
    assert.equal("err" in parseOwnerGrantAmountDraft("10000001"), true);
    assert.equal(shouldKeepOwnerGrantAmountAsString(), true);
  });

  it("documents that main coerces empty to 0 without a radix", () => {
    assert.equal(ownerShopGrantAmountCoercesEmptyToZeroOnMain(), true);
    assert.equal(ownerShopGrantAmountParseIntHasNoRadixOnMain(), true);
  });
});
