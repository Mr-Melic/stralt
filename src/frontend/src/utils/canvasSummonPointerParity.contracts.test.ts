import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("canvas mouse/touch summon-control contracts", () => {
  it("routes summon walks and kit casts through the same helpers on both pointer paths", () => {
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
    const touch = src.slice(src.indexOf("const handleCanvasTouch"));
    assert.ok(click.length > 100, "mouse handler slice");
    assert.ok(touch.length > 100, "touch handler slice");
    for (const helper of [
      "shouldRouteCanvasToSummonControl(",
      "pickSummonControlClickTarget(",
      "castControlledSummonSpell(",
      "canAffordBattleWalk(",
      "applyControlledSummonWalk(",
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
});
