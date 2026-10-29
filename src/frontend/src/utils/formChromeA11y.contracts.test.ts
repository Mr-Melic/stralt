import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

function readUi(name: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../components/ui/${name}`, import.meta.url)),
    "utf8",
  );
}

describe("shadcn form chrome a11y", () => {
  it("keeps Textarea at or above 44px with 16px text, overscroll, and touch-manipulation", () => {
    const src = readUi("textarea.tsx");
    assert.match(src, /min-h-16/);
    assert.match(src, /text-base/);
    assert.match(src, /overscroll-contain/);
    assert.match(src, /touch-manipulation/);
    assert.doesNotMatch(src, /min-h-9\b/);
    assert.doesNotMatch(src, /min-h-8\b/);
  });

  it("caps Alert height at 100dvh and contains overscroll", () => {
    const src = readUi("alert.tsx");
    const alert = src.slice(
      src.indexOf("const alertVariants"),
      src.indexOf("function AlertTitle"),
    );
    assert.match(alert, /max-h-\[min\(80vh,100dvh\)\]/);
    assert.match(alert, /overflow-y-auto/);
    assert.match(alert, /overscroll-contain/);
    assert.match(alert, /role="alert"/);
  });

  it("freezes Skeleton pulse and Progress fill under prefers-reduced-motion", () => {
    const skeleton = readUi("skeleton.tsx");
    assert.match(skeleton, /animate-pulse/);
    assert.match(skeleton, /motion-reduce:animate-none/);
    const progress = readUi("progress.tsx");
    const indicator = progress.slice(
      progress.indexOf("ProgressPrimitive.Indicator"),
    );
    assert.match(indicator, /motion-reduce:transition-none/);
  });

  it("announces FormMessage errors with role=alert", () => {
    const src = readUi("form.tsx");
    const message = src.slice(src.indexOf("function FormMessage"));
    assert.match(message, /role=\{error \? "alert" : undefined\}/);
  });
});
