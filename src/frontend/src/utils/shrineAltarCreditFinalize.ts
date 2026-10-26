/**
 * Shrine altar finalize vs one-shot settle.
 *
 * Live WorldExploration claims `shrineRewardClaimedRef`, enqueues
 * `persistDokaCreditResult(…, 300)`, then **immediately** (same movement
 * step, outside the settle callback) grants covenant on a pure path,
 * increments `shrineAchievementRef` / localStorage, `setShrineCompleted`,
 * and clears `isShrineRoomRef`.
 *
 * On explicit `applyRewards` `#err`, settle is `release` and `releaseFlag`
 * runs — but the room is already closed, so the altar cannot be stepped
 * again. The 300 Doka for that shrine visit is permanently lost while
 * shrine_count / covenant still advanced. `releaseFlag` is dead code for
 * the production path.
 *
 * Expected: finalize the visit (close room, achievement, covenant) only
 * after settle `commit` or `keep`. On `release`, leave the shrine room
 * open so the released flag can allow a retry.
 *
 * Transport-keep (`keep`) still finalizes: the canister may have the
 * credit and remount honour (#800 / #1145) covers the wallet; reminting
 * by leaving the room open would double-pay.
 *
 * Distinct from ground Doka (marks `collected` only on commit; release
 * can retry the coin), dungeon-chain complete (chain refs already reset
 * before settle returns — same class of dead `releaseFlag`), one-shot
 * remount wipe sidecars (#800/#1145 family), and session transport-keep
 * on main (`settleOneShotPersistLock` / 144bfc3). WorldExploration is
 * left unwired so older open WX PRs stay merge-clean; restack the altar
 * step onto `shouldFinalizeShrineAltarVisit` after those land.
 */

export type ShrineAltarSettleKind = "commit" | "release" | "keep";

export type ShrineAltarSettle =
  | ShrineAltarSettleKind
  | { kind: ShrineAltarSettleKind };

function settleKind(settle: ShrineAltarSettle): ShrineAltarSettleKind {
  return typeof settle === "string" ? settle : settle.kind;
}

/**
 * True when the shrine visit may close the room and grant
 * covenant / shrine_count. False on explicit reject so releaseFlag can
 * retry the altar.
 */
export function shouldFinalizeShrineAltarVisit(
  settle: ShrineAltarSettle,
): boolean {
  const kind = settleKind(settle);
  return kind === "commit" || kind === "keep";
}

/**
 * Live WX always finalizes on the altar step, before settle returns.
 * Keep as the divergence proof — do not call from production after the
 * restack wires `shouldFinalizeShrineAltarVisit`.
 */
export function liveWxFinalizesShrineAltarBeforeSettle(): boolean {
  return true;
}

/**
 * Same dead-release class for dungeon-chain completion: live resets the
 * chain and attaches the white portal before settle, so `releaseFlag` on
 * `#err` cannot re-pay that run's bonus.
 */
export function shouldRetryDungeonChainBonusAfterSettle(
  settle: ShrineAltarSettle,
): boolean {
  return settleKind(settle) === "release";
}

/**
 * Live dungeon-complete path cannot retry after release (chain already
 * zeroed). Divergence proof only.
 */
export function liveWxCanRetryDungeonChainBonusAfterRelease(): boolean {
  return false;
}
