import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerSaveFeedbackCopy,
  ownerSaveFeedbackIsSplit,
  shouldShowOwnerHexSavePill,
} from "./adminOwnerUx.saveFeedback.ts";

describe("owner save feedback", () => {
  it("uses Published for live canister writes, not Saved", () => {
    const copy = ownerSaveFeedbackCopy("published", "Enemy shadow");
    assert.equal(copy.toast, "Published — Enemy shadow");
    assert.equal(copy.inline, copy.toast);
    assert.equal(/draft/i.test(copy.toast), false);
    assert.equal(/^saved/i.test(copy.toast), false);
  });

  it("uses Draft saved only for browser-local writes", () => {
    const copy = ownerSaveFeedbackCopy("draft_saved");
    assert.match(copy.toast, /Draft saved/);
    assert.match(copy.toast, /this browser only/);
    assert.equal(/published/i.test(copy.toast), false);
  });

  it("uses Failed without a success pill", () => {
    const copy = ownerSaveFeedbackCopy("failed", "unauthorized");
    assert.equal(copy.toast, "Failed — unauthorized");
  });

  it("drops the hex pill when a toast already reported the write", () => {
    assert.equal(
      shouldShowOwnerHexSavePill({ toastAlreadyShown: true }),
      false,
    );
    assert.equal(
      shouldShowOwnerHexSavePill({ toastAlreadyShown: false }),
      true,
    );
  });

  it("flags Shop grant toast + hex Saved as split feedback", () => {
    assert.equal(
      ownerSaveFeedbackIsSplit({
        toastShown: true,
        hexPillShown: true,
        inlineShown: false,
      }),
      true,
    );
    assert.equal(
      ownerSaveFeedbackIsSplit({
        toastShown: true,
        hexPillShown: false,
        inlineShown: false,
      }),
      false,
    );
  });
});
