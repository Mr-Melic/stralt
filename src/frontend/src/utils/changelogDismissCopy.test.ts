import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHANGELOG_DISMISS_LABEL,
  CHANGELOG_LEAD,
  CHANGELOG_TITLE,
} from "./changelogDismissCopy.ts";

describe("changelogDismissCopy", () => {
  it("dismiss CTA does not promise play yet", () => {
    assert.equal(CHANGELOG_DISMISS_LABEL, "Got it — continue");
    assert.equal(/let me play/i.test(CHANGELOG_DISMISS_LABEL), false);
    assert.match(CHANGELOG_LEAD, /continue/i);
    assert.match(CHANGELOG_TITLE("v163"), /v163/);
  });
});
