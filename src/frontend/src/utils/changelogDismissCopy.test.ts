import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CHANGELOG_DISMISS_LABEL,
  CHANGELOG_LEAD,
  CHANGELOG_TITLE,
} from "./changelogDismissCopy.ts";

const appSource = readFileSync(
  fileURLToPath(new URL("../App.tsx", import.meta.url)),
  "utf8",
);

describe("changelogDismissCopy", () => {
  it("dismiss CTA does not promise play yet", () => {
    assert.equal(CHANGELOG_DISMISS_LABEL, "Got it — continue");
    assert.equal(/let me play/i.test(CHANGELOG_DISMISS_LABEL), false);
    assert.match(CHANGELOG_LEAD, /continue/i);
    assert.match(CHANGELOG_TITLE("v163"), /v163/);
  });

  it("is not wired — What's New still says let me play", () => {
    assert.match(appSource, /Got it — let me play!/);
    assert.equal(appSource.includes("changelogDismissCopy"), false);
  });
});
