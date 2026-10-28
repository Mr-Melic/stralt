import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("canvas mouse/touch recap, death, and execute contracts", () => {
  it("shares recap ignore, death guard, summon route, live-cast entry, and execute on both pointer paths", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/WorldExploration.tsx", import.meta.url),
      ),
      "utf8",
    );
    const click = src.slice(
      src.indexOf("const handleCanvasClick"),
      src.indexOf("const handleCanvasTouch"),
    );
    const touch = src.slice(
      src.indexOf("const handleCanvasTouch"),
      src.indexOf("// FIXED: Player movement animation"),
    );
    assert.ok(click.length > 100, "mouse handler slice");
    assert.ok(touch.length > 100, "touch handler slice");
    for (const helper of [
      "shouldIgnoreWorldInputDuringRecap(",
      "deathTriggeredRef.current",
      "characterStatsRef.current.hp <= 0",
      "shouldRouteCanvasToSummonControl(",
      "shouldAllowPlayerCastEntry(",
      "executeCastAttempt(",
      "playerFacingRejectReason(",
      "WAIT_FOR_TURN_COPY",
    ]) {
      assert.equal(
        click.includes(helper),
        true,
        `mouse handler must call ${helper}`,
      );
      assert.equal(
        touch.includes(helper),
        true,
        `touch handler must call ${helper}`,
      );
    }
  });

  it("stamps both ghost-click refs on touchend and reads both on click", () => {
    const src = readFileSync(
      fileURLToPath(
        new URL("../components/WorldExploration.tsx", import.meta.url),
      ),
      "utf8",
    );
    const click = src.slice(
      src.indexOf("const handleCanvasClick"),
      src.indexOf("const handleCanvasTouch"),
    );
    const touch = src.slice(
      src.indexOf("const handleCanvasTouch"),
      src.indexOf("// FIXED: Player movement animation"),
    );
    assert.match(touch, /lastCanvasTouchEndAtRef\.current = touchEndedAt/);
    assert.match(
      touch,
      /lastCanvasTouchEndRef\.current = rememberTouchEnd\(touchEndedAt\)/,
    );
    assert.match(click, /shouldIgnoreSyntheticClickAfterTouch\(/);
    assert.match(click, /shouldIgnoreClickAfterTouch\(/);
    assert.match(touch, /if \(event\.cancelable\) event\.preventDefault\(\);/);
  });
});
