import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  TOAST_ACTION_TARGET_CLASS,
  TOAST_BELOW_HUD_CLASS,
  TOAST_OVERSCROLL_CLASS,
} from "./toastViewport.ts";

function readRelative(path: string): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("toast viewport", () => {
  it("exports a HUD-aware top inset and 44px action floors", () => {
    assert.match(TOAST_BELOW_HUD_CLASS, /--app-top-hud-height/);
    assert.equal(TOAST_ACTION_TARGET_CLASS.includes("min-h-[44px]"), true);
    assert.equal(TOAST_ACTION_TARGET_CLASS.includes("min-w-[44px]"), true);
    assert.match(TOAST_OVERSCROLL_CLASS, /overscroll-contain/);
    assert.match(TOAST_OVERSCROLL_CLASS, /touch-manipulation/);
  });

  it("wires those classes on the live Toaster primitive", () => {
    const src = readRelative("../components/ui/sonner.tsx");
    assert.match(src, /TOAST_BELOW_HUD_CLASS/);
    assert.match(src, /TOAST_ACTION_TARGET_CLASS/);
    assert.match(src, /TOAST_OVERSCROLL_CLASS/);
  });

  it("keeps Toaster mounted in the game tree", () => {
    const src = readRelative("../App.tsx");
    assert.match(src, /<Toaster\b/);
  });
});

describe("chart tooltip overlay scroll contain", () => {
  it("caps ChartTooltipContent at 100dvh and contains overscroll", () => {
    const src = readRelative("../components/ui/chart.tsx");
    const content = src.slice(src.indexOf("function ChartTooltipContent"));
    assert.match(content, /max-h-\[min\(80vh,100dvh\)\]/);
    assert.match(content, /overflow-y-auto/);
    assert.match(content, /overscroll-contain/);
  });
});
