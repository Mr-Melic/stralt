/**
 * Shrine altar room-close vs one-shot Doka settle.
 *
 * Live WorldExploration claims `shrineRewardClaimedRef`, enqueues
 * `persistDokaCreditResult(…, 300)`, then **immediately** (same movement
 * step, outside the settle callback) sets `shrineCompleted` and clears
 * `isShrineRoomRef`. Stepping the altar is gated on that ref, so an
 * explicit `applyRewards` `#err` (`settle.kind === "release"` +
 * `releaseFlag`) cannot retry the 300 Doka. Ground Doka already waits
 * to mark `collected` until commit; shrine Doka's `releaseFlag` is dead.
 *
 * Sequence: dungeon-chain shrine room → walk onto the altar → canister
 * rejects (banned / empty slot / unauthorized). Expected: leave the
 * shrine room open so the released claim can fire again. Actual: room
 * is already closed; the visit's 300 Doka is lost.
 *
 * Visit count / covenant stay on first altar contact — older #1083
 * (`shouldCountShrineVisitIndependentOfDokaSettle`) already locked that
 * split (visit feat vs loot). Closing the room is the loot-retry gate,
 * not the visit counter. A Doka retry after release must not increment
 * `shrine_count` a second time.
 *
 * Transport-keep (`keep`) still closes: the canister may have the credit
 * and remount honour (#800 / #1145) covers the wallet; leaving the room
 * open would remint. Distinct from ground Doka collected-on-commit,
 * dungeon-chain complete (portal already left the run — not retryable
 * in-place), one-shot remount wipe sidecars, and session transport-keep
 * on main (`settleOneShotPersistLock` / 144bfc3).
 *
 * WorldExploration is left unwired so older open WX PRs stay merge-clean
 * (#1100 / #1142 pattern). Restack the altar step onto
 * `planShrineAltarContact` / `planShrineAltarAfterSettle` after those land.
 */

export type ShrineAltarSettleKind = "commit" | "release" | "keep";

export type ShrineAltarSettle =
  | ShrineAltarSettleKind
  | { kind: ShrineAltarSettleKind };

function settleKind(settle: ShrineAltarSettle): ShrineAltarSettleKind {
  return typeof settle === "string" ? settle : settle.kind;
}

export type ShrineAltarContactPlan = {
  claimCredit: boolean;
  countVisit: boolean;
  /** Live WX closes here. Correct plan waits for settle. */
  closeRoomNow: boolean;
};

export type ShrineAltarSettlePlan = {
  closeRoom: boolean;
  releaseCreditClaim: boolean;
};

/**
 * First (or retry) step onto the altar while the shrine room is open.
 *
 * Visit counts once per room on contact (#1083). Credit claims once until
 * settle releases. Never close the room on the movement step.
 */
export function planShrineAltarContact(args: {
  shrineRoomOpen: boolean;
  creditAlreadyClaimed: boolean;
  visitAlreadyCounted: boolean;
}): ShrineAltarContactPlan {
  if (args.shrineRoomOpen !== true) {
    return { claimCredit: false, countVisit: false, closeRoomNow: false };
  }
  return {
    claimCredit: args.creditAlreadyClaimed !== true,
    countVisit: args.visitAlreadyCounted !== true,
    closeRoomNow: false,
  };
}

/**
 * After one-shot settle: close on commit/keep; release the claim on
 * `#err` so a later altar step can re-enqueue while the room stays open.
 */
export function planShrineAltarAfterSettle(
  settle: ShrineAltarSettle,
): ShrineAltarSettlePlan {
  const kind = settleKind(settle);
  return {
    closeRoom: kind === "commit" || kind === "keep",
    releaseCreditClaim: kind === "release",
  };
}

/**
 * True when the shrine room may close (`isShrineRoomRef = false`,
 * `setShrineCompleted`). False on explicit reject so releaseFlag can
 * retry the altar.
 */
export function shouldCloseShrineAltarAfterSettle(
  settle: ShrineAltarSettle,
): boolean {
  return planShrineAltarAfterSettle(settle).closeRoom;
}

/** @deprecated Use {@link shouldCloseShrineAltarAfterSettle}. */
export function shouldFinalizeShrineAltarVisit(
  settle: ShrineAltarSettle,
): boolean {
  return shouldCloseShrineAltarAfterSettle(settle);
}

export function shouldRetryShrineAltarCredit(
  settle: ShrineAltarSettle,
): boolean {
  return planShrineAltarAfterSettle(settle).releaseCreditClaim;
}

/**
 * Visit-count once per shrine room, independent of Doka settle (#1083).
 * A loot retry after release must not increment shrine_count again.
 */
export function shouldCountShrineVisitOnAltarContact(
  alreadyCountedThisRoom: boolean,
): boolean {
  return alreadyCountedThisRoom !== true;
}

/**
 * Live WX always closes the shrine room on the altar step, before settle
 * returns. Keep as the divergence proof — do not call from production
 * after the restack wires `planShrineAltarAfterSettle`.
 */
export function liveWxClosesShrineRoomBeforeSettle(): boolean {
  return true;
}

/** @deprecated Use {@link liveWxClosesShrineRoomBeforeSettle}. */
export function liveWxFinalizesShrineAltarBeforeSettle(): boolean {
  return liveWxClosesShrineRoomBeforeSettle();
}
