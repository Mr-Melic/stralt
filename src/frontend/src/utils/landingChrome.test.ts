import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("landing Sign In chrome", () => {
  it("meets DESIGN.md 44px and names the decorative title", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../components/LandingPage.tsx", import.meta.url)),
      "utf8",
    );
    assert.match(src, /className="sr-only">ÆSTRALTØ/);
    assert.match(
      src,
      /className="flex justify-center mb-8" aria-hidden="true"/,
    );
    assert.match(src, /data-ocid="landing.login_button"/);
    assert.match(src, /className="stone-touch-target"/);
    assert.match(src, /minHeight: 44,/);
    assert.match(src, /env\(safe-area-inset-top, 0px\)/);
    assert.match(src, /env\(safe-area-inset-bottom, 0px\)/);
  });
});

describe("starfield decorative canvas", () => {
  it("hides the canvas from AT on a non-focusable wrapper, not the canvas", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/StarfieldBackground.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.match(src, /aria-hidden="true"/);
    assert.match(src, /className="fixed inset-0 pointer-events-none"/);
    assert.equal(/<canvas[\s\S]*aria-hidden/.test(src), false);
  });
});

describe("dialog chrome", () => {
  it("keeps DialogContent inside horizontal safe-area insets", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../components/ui/dialog.tsx", import.meta.url)),
      "utf8",
    );
    assert.match(src, /safe-area-inset-left/);
    assert.match(src, /safe-area-inset-right/);
  });
});
