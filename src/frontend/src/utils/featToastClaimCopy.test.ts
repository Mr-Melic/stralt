import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FEAT_TOAST_CLAIM_HINT,
  featToastRewardLabel,
} from "./featToastClaimCopy.ts";

describe("featToastClaimCopy", () => {
  it("does not print a credited plus-amount", () => {
    assert.equal(FEAT_TOAST_CLAIM_HINT, "Claim in Feats");
    assert.equal(featToastRewardLabel(50), "Claim in Feats · 50 Doka");
    assert.match(featToastRewardLabel(1000n) ?? "", /Claim in Feats · .+ Doka/);
    assert.equal(featToastRewardLabel(0), null);
    assert.equal(featToastRewardLabel(-1), null);
    assert.equal(featToastRewardLabel(undefined), null);
    assert.equal(/\+/.test(featToastRewardLabel(50) ?? ""), false);
  });
});
