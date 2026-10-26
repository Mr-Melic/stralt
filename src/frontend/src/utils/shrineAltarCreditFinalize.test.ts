/**
 * Persist race: shrine altar finalize-before-settle vs release retry.
 *
 * Sequence: dungeon-chain shrine room → pure-path walk onto altar →
 * applyRewards(300) returns `#err` (banned / empty slot / unauthorized).
 * Live closes the room and advances shrine_count / covenant before settle;
 * releaseFlag cannot reopen the altar.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  releaseFlag,
  settleOneShotAfterCredit,
  tryClaimFlag,
} from "./dokaPersist.ts";
import {
  liveWxCanRetryDungeonChainBonusAfterRelease,
  liveWxFinalizesShrineAltarBeforeSettle,
  shouldFinalizeShrineAltarVisit,
  shouldRetryDungeonChainBonusAfterSettle,
} from "./shrineAltarCreditFinalize.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

describe("shrine altar finalize vs one-shot settle", () => {
  it("finalizes on commit and keep, not on release", () => {
    assert.equal(shouldFinalizeShrineAltarVisit("commit"), true);
    assert.equal(shouldFinalizeShrineAltarVisit("keep"), true);
    assert.equal(shouldFinalizeShrineAltarVisit("release"), false);
    assert.equal(shouldFinalizeShrineAltarVisit({ kind: "commit" }), true);
    assert.equal(shouldFinalizeShrineAltarVisit({ kind: "release" }), false);
  });

  it("maps explicit applyRewards #err to release (retry-safe)", () => {
    assert.equal(settleOneShotAfterCredit({ err: "rejected" }), "release");
    assert.equal(
      shouldFinalizeShrineAltarVisit(
        settleOneShotAfterCredit({ err: "rejected" }),
      ),
      false,
    );
    assert.equal(
      shouldFinalizeShrineAltarVisit(
        settleOneShotAfterCredit({ err: "transport" }),
      ),
      true,
      "transport-keep must still close the room (no remint)",
    );
    assert.equal(
      shouldFinalizeShrineAltarVisit(settleOneShotAfterCredit({ ok: 300 })),
      true,
    );
  });

  it("live WX finalizes the shrine visit before settle returns", () => {
    assert.equal(liveWxFinalizesShrineAltarBeforeSettle(), true);
    const wx = wxSource();
    const altar = wx.indexOf("if (tryClaimFlag(shrineRewardClaimedRef))");
    assert.ok(altar >= 0, "altar claim + enqueue is present");
    const block = wx.slice(altar, altar + 2400);
    assert.match(block, /persistDokaCreditResult/);
    assert.match(block, /resolveOneShotCreditSettle/);
    assert.match(block, /releaseFlag\(shrineRewardClaimedRef\)/);
    assert.match(block, /shrineAchievementRef\.current \+= 1/);
    assert.match(block, /isShrineRoomRef\.current = false/);
    assert.match(block, /setShrineCompleted\(true\)/);
    // Finalize is NOT gated on shouldFinalizeShrineAltarVisit yet.
    assert.equal(block.includes("shouldFinalizeShrineAltarVisit"), false);
    // Covenant / achievement / room-close sit outside the enqueue callback.
    const enqueueClose = block.indexOf(
      'return settle.kind === "commit" ? settle.doka : 0;',
    );
    assert.ok(enqueueClose > 0, "enqueue settle return is present");
    const afterEnqueue = block.slice(enqueueClose);
    assert.match(afterEnqueue, /shrineAchievementRef\.current \+= 1/);
    assert.match(afterEnqueue, /isShrineRoomRef\.current = false/);
  });

  it("releaseFlag only retries when the shrine room stays open", () => {
    // Sequence: altar step → #err release → live already closed the room.
    const claimed = { current: false };
    const shrineRoomOpen = { current: true };
    assert.equal(tryClaimFlag(claimed), true);
    // Live finalizes immediately (before settle).
    assert.equal(liveWxFinalizesShrineAltarBeforeSettle(), true);
    shrineRoomOpen.current = false;
    const settle = settleOneShotAfterCredit({ err: "rejected" });
    assert.equal(settle, "release");
    if (!shouldFinalizeShrineAltarVisit(settle)) {
      releaseFlag(claimed);
    }
    assert.equal(claimed.current, false, "flag released for retry");
    assert.equal(
      shrineRoomOpen.current,
      false,
      "live already closed the room — release cannot reopen it",
    );
    // Stepping the altar again is gated on isShrineRoomRef in WX.
    const canRetryAltar = shrineRoomOpen.current && tryClaimFlag(claimed);
    assert.equal(
      canRetryAltar,
      false,
      "closed room makes releaseFlag a no-op for the 300 Doka",
    );
  });

  it("correct finalize keeps the room open on release so retry works", () => {
    const claimed = { current: false };
    const shrineRoomOpen = { current: true };
    assert.equal(tryClaimFlag(claimed), true);
    const settle = settleOneShotAfterCredit({ err: "rejected" });
    if (shouldFinalizeShrineAltarVisit(settle)) {
      shrineRoomOpen.current = false;
    } else {
      releaseFlag(claimed);
    }
    assert.equal(shrineRoomOpen.current, true);
    assert.equal(claimed.current, false);
    assert.equal(
      shrineRoomOpen.current && tryClaimFlag(claimed),
      true,
      "open room + released flag must allow a second altar credit",
    );
  });

  it("dungeon-chain complete release cannot re-pay that run (live)", () => {
    assert.equal(liveWxCanRetryDungeonChainBonusAfterRelease(), false);
    assert.equal(shouldRetryDungeonChainBonusAfterSettle("release"), true);
    assert.equal(shouldRetryDungeonChainBonusAfterSettle("keep"), false);
    const wx = wxSource();
    const complete = wx.indexOf(
      "tryClaimDungeonChainBonus(dungeonCompletionSavedRef)",
    );
    assert.ok(complete >= 0, "dungeon complete claim call is present");
    const block = wx.slice(complete, complete + 1600);
    assert.match(block, /releaseFlag\(dungeonCompletionSavedRef\)/);
    assert.match(block, /dungeonChainActiveRef\.current = false/);
    // Chain zero runs in the same portal step as the enqueue, not after settle.
    assert.equal(
      block.includes("shouldRetryDungeonChainBonusAfterSettle"),
      false,
    );
  });
});
