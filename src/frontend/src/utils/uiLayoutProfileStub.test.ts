import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  officialHudMountsAfterProfileSetup,
  profileSetupNewPayloadWipesUiLayout,
  saveUserUiLayoutCreatesEmptyNameWhenProfileMissing,
  shouldMergeUiLayoutWhenCreatingProfile,
} from "./uiLayoutProfileStub.ts";

describe("uiLayoutProfileStub", () => {
  it("locks empty-name stub + ProfileSetup uiLayout wipe on official order", () => {
    assert.equal(saveUserUiLayoutCreatesEmptyNameWhenProfileMissing(), true);
    assert.equal(profileSetupNewPayloadWipesUiLayout(), true);
    assert.equal(officialHudMountsAfterProfileSetup(), true);
  });

  it("keeps a stub layout when ProfileSetup still sends uiLayout empty", () => {
    assert.equal(
      shouldMergeUiLayoutWhenCreatingProfile({
        existingUiLayout: '{"stats":{"x":1,"y":2,"folded":false}}',
        incomingUiLayout: "",
      }),
      '{"stats":{"x":1,"y":2,"folded":false}}',
    );
    assert.equal(
      shouldMergeUiLayoutWhenCreatingProfile({
        existingUiLayout: "",
        incomingUiLayout: '{"stats":{"x":9,"y":9,"folded":true}}',
      }),
      '{"stats":{"x":9,"y":9,"folded":true}}',
    );
  });
});
