import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SYNTHETIC_CLICK_SUPPRESS_MS } from "./pointerGesture.ts";
import { SYNTHETIC_CLICK_GUARD_MS } from "./pointerParity.ts";

describe("canvas mouse/touch combat contracts", () => {
  it("keeps the 400ms ghost-click window on one constant", () => {
    assert.equal(SYNTHETIC_CLICK_GUARD_MS, SYNTHETIC_CLICK_SUPPRESS_MS);
    assert.equal(SYNTHETIC_CLICK_SUPPRESS_MS, 400);
  });

  it("shares live sprite/tile decide tables on both pointer paths", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/WorldExploration.tsx", import.meta.url),
      ),
      "utf8",
    );
    assert.equal(
      (src.match(/decideSpriteCastClick\(/g) ?? []).length,
      2,
      "mouse and touch sprite hits must both call decideSpriteCastClick",
    );
    assert.equal(
      (src.match(/decideTileCastClick\(/g) ?? []).length,
      2,
      "mouse and touch tile hits must both call decideTileCastClick",
    );
    assert.match(src, /hitTestSprite\(_canvasX, _canvasY, 10\)/);
    assert.match(src, /hitTestSprite\(_canvasX, _canvasY, 14\)/);
    assert.match(src, /shouldIgnoreSyntheticClickAfterTouch/);
    assert.match(src, /shouldIgnoreClickAfterTouch/);
    assert.match(src, /if \(event\.cancelable\) event\.preventDefault\(\);/);
  });
});
