import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BOSS_RUSH_SANCTUARY_NEARBY,
  BOSS_RUSH_UNLOCK_LOG,
  bossRushAdvanceNearbyLabel,
  bossRushHudChip,
  bossRushSealedNearbyLabel,
} from "./bossRushPortalCopy.ts";

describe("bossRushPortalCopy", () => {
  it("names sealed vs advance nearby labels", () => {
    assert.equal(
      bossRushSealedNearbyLabel(3),
      "🔒 Clear Room 3 to open the way",
    );
    assert.equal(bossRushAdvanceNearbyLabel(4), "⚔️ Next — Room 4 / 10");
    assert.match(BOSS_RUSH_UNLOCK_LOG, /walk into the glowing portal/i);
    assert.match(BOSS_RUSH_SANCTUARY_NEARBY, /Sanctuary/i);
  });

  it("keeps HUD chip room fraction", () => {
    assert.equal(bossRushHudChip(1), "Boss Rush — Room 1 / 10");
    assert.equal(bossRushHudChip(10), "Boss Rush — Room 10 / 10");
  });
});
