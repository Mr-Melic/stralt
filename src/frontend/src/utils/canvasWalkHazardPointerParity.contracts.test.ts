import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("canvas mouse/touch walk, hazard, and portal contracts", () => {
  it("shares occupancy, walk-block, hazard debit, portal, and leftover-AP helpers on both pointer paths", () => {
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
      "isAliveCombatant(e)",
      "isBattleWalkTileBlocked(",
      "classifyWalkReject(",
      "applyBattleWalkHazards(",
      "shouldBlockWorldMoveOntoPortal(",
      "shouldFloatWorldUnreachable(",
      "shouldClearSpellAfterApSpend(",
      "challengeHealUsedRef.current = true",
      "SELECT_SPELL_COPY",
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

  it("keeps the intentional 10px mouse vs 14px touch sprite hit pad", () => {
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
    assert.match(click, /hitTestSprite\([^)]*,\s*10\s*\)/);
    assert.match(touch, /hitTestSprite\([^)]*,\s*14\s*\)/);
    assert.doesNotMatch(click, /hitTestSprite\([^)]*,\s*14\s*\)/);
    assert.doesNotMatch(touch, /hitTestSprite\([^)]*,\s*10\s*\)/);
  });
});
