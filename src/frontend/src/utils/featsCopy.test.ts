import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FEATS_CHROME_LABEL,
  FEATS_CLOSE_ARIA_LABEL,
  FEATS_DIALOG_ARIA_LABEL,
  FEATS_UNLOCKED_RECAP_TITLE,
} from "./featsCopy.ts";

describe("featsCopy", () => {
  it("uses Feats on HUD, dialog, and recap chrome", () => {
    assert.equal(FEATS_CHROME_LABEL, "Feats");
    assert.equal(FEATS_DIALOG_ARIA_LABEL, "Feats");
    assert.equal(FEATS_CLOSE_ARIA_LABEL, "Close feats");
    assert.equal(FEATS_UNLOCKED_RECAP_TITLE, "Feats Unlocked");
    for (const label of [
      FEATS_CHROME_LABEL,
      FEATS_DIALOG_ARIA_LABEL,
      FEATS_CLOSE_ARIA_LABEL,
      FEATS_UNLOCKED_RECAP_TITLE,
    ]) {
      assert.equal(/achievement/i.test(label), false);
    }
  });
});
