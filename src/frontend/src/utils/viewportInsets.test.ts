import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  overlaySafeAreaPadding,
  recapCardPaddingStyle,
  shouldDismissRecapOnKey,
} from "./viewportInsets.ts";

describe("overlaySafeAreaPadding", () => {
  it("matches the changelog / small-screen 16px + env() contract", () => {
    assert.equal(
      overlaySafeAreaPadding(),
      "max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) max(16px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px))",
    );
  });
});

describe("recapCardPaddingStyle", () => {
  it("declares paddingBottom after padding so the shorthand cannot wipe the inset", () => {
    const style = recapCardPaddingStyle();
    const keys = Object.keys(style);
    assert.ok(keys.indexOf("padding") < keys.indexOf("paddingBottom"));
    assert.equal(style.paddingBottom, "env(safe-area-inset-bottom, 0px)");
  });
});

describe("shouldDismissRecapOnKey", () => {
  it("keeps Escape and does not steal Space/Enter from overflow scroll", () => {
    assert.equal(shouldDismissRecapOnKey("Escape"), true);
    assert.equal(shouldDismissRecapOnKey(" "), false);
    assert.equal(shouldDismissRecapOnKey("Enter"), false);
    assert.equal(shouldDismissRecapOnKey("Tab"), false);
  });
});

describe("PostBattleRecap overlay wiring", () => {
  it("pads the dialog with overlaySafeAreaPadding and does not close on Space", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/PostBattleRecap.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.match(src, /overlaySafeAreaPadding\(\)/);
    assert.match(src, /recapCardPaddingStyle\(\)/);
    assert.match(src, /overscrollBehavior/);
    assert.match(src, /FEATS_UNLOCKED_RECAP_TITLE/);
    assert.match(src, /onKeyDown/);
    assert.match(src, /viewportInsets/);
    assert.equal(/e\.key !== "Enter" && e\.key !== " "/.test(src), false);
  });
});

describe("alert-dialog chrome", () => {
  it("keeps AlertDialogContent inside horizontal safe-area insets", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/ui/alert-dialog.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.match(src, /safe-area-inset-left/);
    assert.match(src, /safe-area-inset-right/);
  });
});
