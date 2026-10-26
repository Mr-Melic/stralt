/**
 * Persist race: shrine altar room-close-before-settle vs release retry.
 *
 * Sequence: dungeon-chain shrine room → walk onto altar → applyRewards(300)
 * returns `#err` (banned / empty slot / unauthorized). Live closes the room
 * before settle; releaseFlag cannot reopen the altar. Visit count still
 * fires on first contact (#1083) and must not double on a Doka retry.
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
  liveWxClosesShrineRoomBeforeSettle,
  liveWxFinalizesShrineAltarBeforeSettle,
  planShrineAltarAfterSettle,
  planShrineAltarContact,
  shouldCloseShrineAltarAfterSettle,
  shouldCountShrineVisitOnAltarContact,
  shouldFinalizeShrineAltarVisit,
  shouldRetryShrineAltarCredit,
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

describe("shrine altar room-close vs one-shot settle", () => {
  it("closes the room on commit and keep, not on release", () => {
    assert.equal(shouldCloseShrineAltarAfterSettle("commit"), true);
    assert.equal(shouldCloseShrineAltarAfterSettle("keep"), true);
    assert.equal(shouldCloseShrineAltarAfterSettle("release"), false);
    assert.equal(shouldRetryShrineAltarCredit("release"), true);
    assert.equal(shouldRetryShrineAltarCredit("keep"), false);
    assert.equal(shouldCloseShrineAltarAfterSettle({ kind: "commit" }), true);
    assert.equal(shouldCloseShrineAltarAfterSettle({ kind: "release" }), false);
    assert.equal(
      shouldFinalizeShrineAltarVisit("release"),
      false,
      "deprecated alias tracks close-room, not visit-count",
    );
  });

  it("maps explicit applyRewards #err to release (retry-safe)", () => {
    assert.equal(settleOneShotAfterCredit({ err: "rejected" }), "release");
    assert.equal(
      shouldCloseShrineAltarAfterSettle(
        settleOneShotAfterCredit({ err: "rejected" }),
      ),
      false,
    );
    assert.equal(
      shouldCloseShrineAltarAfterSettle(
        settleOneShotAfterCredit({ err: "transport" }),
      ),
      true,
      "transport-keep must still close the room (no remint)",
    );
    assert.equal(
      shouldCloseShrineAltarAfterSettle(settleOneShotAfterCredit({ ok: 300 })),
      true,
    );
  });

  it("live WX closes the shrine room before settle returns", () => {
    assert.equal(liveWxClosesShrineRoomBeforeSettle(), true);
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
    assert.equal(block.includes("planShrineAltarAfterSettle"), false);
    assert.equal(block.includes("shouldCloseShrineAltarAfterSettle"), false);
    const enqueueClose = block.indexOf(
      'return settle.kind === "commit" ? settle.doka : 0;',
    );
    assert.ok(enqueueClose > 0, "enqueue settle return is present");
    const afterEnqueue = block.slice(enqueueClose);
    assert.match(afterEnqueue, /isShrineRoomRef\.current = false/);
    assert.match(afterEnqueue, /setShrineCompleted\(true\)/);
  });

  it("releaseFlag only retries when the shrine room stays open", () => {
    const claimed = { current: false };
    const shrineRoomOpen = { current: true };
    assert.equal(tryClaimFlag(claimed), true);
    assert.equal(liveWxClosesShrineRoomBeforeSettle(), true);
    shrineRoomOpen.current = false;
    const settle = settleOneShotAfterCredit({ err: "rejected" });
    assert.equal(settle, "release");
    if (planShrineAltarAfterSettle(settle).releaseCreditClaim) {
      releaseFlag(claimed);
    }
    assert.equal(claimed.current, false, "flag released for retry");
    assert.equal(
      shrineRoomOpen.current,
      false,
      "live already closed the room — release cannot reopen it",
    );
    const canRetryAltar = shrineRoomOpen.current && tryClaimFlag(claimed);
    assert.equal(
      canRetryAltar,
      false,
      "closed room makes releaseFlag a no-op for the 300 Doka",
    );
  });

  it("correct settle keeps the room open on release so retry works", () => {
    const claimed = { current: false };
    let shrineRoomOpen = true;
    const contact = planShrineAltarContact({
      shrineRoomOpen,
      creditAlreadyClaimed: claimed.current,
      visitAlreadyCounted: false,
    });
    assert.equal(contact.claimCredit, true);
    assert.equal(contact.closeRoomNow, false);
    assert.equal(tryClaimFlag(claimed), true);
    const settle = settleOneShotAfterCredit({ err: "rejected" });
    const after = planShrineAltarAfterSettle(settle);
    if (after.closeRoom) shrineRoomOpen = false;
    if (after.releaseCreditClaim) releaseFlag(claimed);
    assert.equal(shrineRoomOpen, true);
    assert.equal(claimed.current, false);
    const retry = planShrineAltarContact({
      shrineRoomOpen,
      creditAlreadyClaimed: claimed.current,
      visitAlreadyCounted: true,
    });
    assert.equal(retry.claimCredit, true);
    assert.equal(retry.countVisit, false, "visit already counted this room");
    assert.equal(retry.closeRoomNow, false);
    assert.equal(tryClaimFlag(claimed), true);
  });

  it("visit count fires once on contact even when Doka later releases", () => {
    assert.equal(shouldCountShrineVisitOnAltarContact(false), true);
    assert.equal(shouldCountShrineVisitOnAltarContact(true), false);
    const first = planShrineAltarContact({
      shrineRoomOpen: true,
      creditAlreadyClaimed: false,
      visitAlreadyCounted: false,
    });
    assert.equal(first.countVisit, true);
    assert.equal(first.closeRoomNow, false);
    const settle = planShrineAltarAfterSettle(
      settleOneShotAfterCredit({ err: "rejected" }),
    );
    assert.equal(settle.closeRoom, false);
    const retry = planShrineAltarContact({
      shrineRoomOpen: true,
      creditAlreadyClaimed: false,
      visitAlreadyCounted: true,
    });
    assert.equal(
      retry.countVisit,
      false,
      "#1083 visit-on-contact must not double when loot retries",
    );
  });

  it("closed or already-claimed contact is a no-op for credit", () => {
    assert.deepEqual(
      planShrineAltarContact({
        shrineRoomOpen: false,
        creditAlreadyClaimed: false,
        visitAlreadyCounted: false,
      }),
      { claimCredit: false, countVisit: false, closeRoomNow: false },
    );
    assert.deepEqual(
      planShrineAltarContact({
        shrineRoomOpen: true,
        creditAlreadyClaimed: true,
        visitAlreadyCounted: true,
      }),
      { claimCredit: false, countVisit: false, closeRoomNow: false },
    );
  });
});
