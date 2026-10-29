import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerGameConfigCatchLooksLiveOnMain,
  ownerSwallowedHydrateCopy,
  ownerSwallowedHydrateKind,
  shouldDisableOwnerSwallowedPublish,
} from "./adminOwnerUx.swallowedHydrate.ts";

describe("ownerSwallowedHydrateKind", () => {
  it("does not treat a swallowed actor failure as live GameConfig", () => {
    assert.equal(ownerSwallowedHydrateKind({ fetchOk: false }), "load-failed");
    assert.equal(ownerSwallowedHydrateKind({ fetchOk: true }), "live");
  });
});

describe("ownerSwallowedHydrateCopy", () => {
  it("blocks Save copy when the numbers are a hardcoded or LS fallback", () => {
    const failed = ownerSwallowedHydrateCopy("load-failed", "GameConfig");
    assert.match(failed, /Failed to load live GameConfig/i);
    assert.match(failed, /not canister-live/i);
    assert.match(failed, /Do not Save/i);
    assert.equal(/valid default/i.test(failed), false);
    assert.equal(shouldDisableOwnerSwallowedPublish("load-failed"), true);
    assert.equal(shouldDisableOwnerSwallowedPublish("live"), false);
    assert.match(
      ownerSwallowedHydrateCopy("live", "GameConfig"),
      /Live canister GameConfig/,
    );
    assert.equal(ownerGameConfigCatchLooksLiveOnMain(), true);
  });
});
