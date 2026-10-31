import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("canvas mouse/touch sprite and tile decision contracts", () => {
  it("shares summon-control, sprite/tile decide tables, wait-for-turn, and MP rejects on both pointer paths", () => {
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
      "shouldRouteCanvasToSummonControl",
      "decideSpriteCastClick",
      "decideTileCastClick",
      "WAIT_FOR_TURN_COPY",
      "SELECT_SPELL_COPY",
      "playerFacingRejectReason",
      "playerFacingCastResult",
      "executeCastAttempt(",
      '"Can\'t reach"',
      '"Not enough MP"',
      "shouldRejectCastForMissingAp",
      "shouldClearSpellAfterApSpend",
      "classifyWalkReject",
      "applyBattleWalkHazards",
      "shouldAllowPlayerCastEntry",
      "probeLiveCast",
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
    assert.equal(
      click.includes("hitTestSprite(_canvasX, _canvasY, 10)"),
      true,
      "mouse sprite pad stays 10px",
    );
    assert.equal(
      touch.includes("hitTestSprite(_canvasX, _canvasY, 14)"),
      true,
      "touch sprite pad stays 14px",
    );
    assert.equal(
      click.includes("hitTestSprite(_canvasX, _canvasY, 14)"),
      false,
      "mouse must not use the 14px touch pad",
    );
    assert.equal(
      touch.includes("hitTestSprite(_canvasX, _canvasY, 10)"),
      false,
      "touch must not use the 10px mouse pad",
    );
  });
});
