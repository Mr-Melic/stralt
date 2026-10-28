import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerAdHydrateKind,
  ownerAdStatusCopy,
  shouldDisableOwnerAdWrite,
} from "./adminOwnerUx.adHydrate.ts";

describe("ownerAdHydrateKind", () => {
  it("does not treat a failed load as the hidden-default valid empty", () => {
    assert.equal(
      ownerAdHydrateKind({ loaded: false, imageUrl: "", linkUrl: "" }),
      "load-failed",
    );
    assert.equal(
      ownerAdHydrateKind({ loaded: true, imageUrl: "", linkUrl: "" }),
      "hidden-default",
    );
    assert.equal(
      ownerAdHydrateKind({
        loaded: true,
        imageUrl: "https://cdn.example/ad.png",
        linkUrl: "https://example.com",
      }),
      "live-custom",
    );
  });
});

describe("ownerAdStatusCopy", () => {
  it("keeps empty-after-load as a valid default, never an error", () => {
    assert.match(ownerAdStatusCopy("hidden-default"), /valid default/i);
    assert.equal(/error/i.test(ownerAdStatusCopy("hidden-default")), false);
  });

  it("labels a failed hydrate so operators do not Clear live slots", () => {
    const copy = ownerAdStatusCopy("load-failed");
    assert.match(copy, /Failed to load/i);
    assert.match(copy, /not the canister/i);
    assert.equal(shouldDisableOwnerAdWrite("load-failed"), true);
    assert.equal(shouldDisableOwnerAdWrite("hidden-default"), false);
    assert.equal(shouldDisableOwnerAdWrite("live-custom"), false);
  });
});
