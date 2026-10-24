import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PORTAL_TRANSITION_CHIP,
  PORTAL_TRANSITION_CHIP_TO,
} from "./portalTransitionCopy.ts";

describe("portalTransitionCopy", () => {
  it("chip says crossing, not a bare Portal ellipsis", () => {
    assert.equal(PORTAL_TRANSITION_CHIP, "Crossing portal…");
    assert.equal(/^Portal\.\.\.$/.test(PORTAL_TRANSITION_CHIP), false);
    assert.equal(
      PORTAL_TRANSITION_CHIP_TO("Death Realm"),
      "Crossing to Death Realm…",
    );
  });
});
