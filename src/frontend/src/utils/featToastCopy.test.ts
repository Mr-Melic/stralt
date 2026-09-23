import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  FEAT_UNLOCKED_TOAST_HEADING,
  featUnlockedToastAriaLabel,
} from "./featToastCopy.ts";

const toastSource = readFileSync(
  fileURLToPath(new URL("../components/AchievementToast.tsx", import.meta.url)),
  "utf8",
);

describe("featToastCopy", () => {
  it("uses Feat, not Achievement, on the world toast heading", () => {
    assert.equal(FEAT_UNLOCKED_TOAST_HEADING, "Feat Unlocked!");
    assert.equal(/achievement/i.test(FEAT_UNLOCKED_TOAST_HEADING), false);
  });

  it("names the unlocked feat for assistive tech", () => {
    assert.equal(
      featUnlockedToastAriaLabel("First Blood"),
      "Feat Unlocked! First Blood",
    );
    assert.equal(featUnlockedToastAriaLabel("   "), "Feat Unlocked!");
  });

  it("AchievementToast renders the shared heading instead of Achievement Unlocked", () => {
    assert.match(toastSource, /FEAT_UNLOCKED_TOAST_HEADING/);
    assert.match(toastSource, /featUnlockedToastAriaLabel/);
    assert.equal(toastSource.includes("Achievement Unlocked!"), false);
  });
});
