/**
 * End Turn / 30s timer yield must close an unaccepted challenge offer.
 *
 * `markFirstAction` (WorldExploration) is the documented accept-window
 * closer: it drops `currentChallenge` when the offer was never accepted.
 * Walk and AP spend call it. `onEndTurn` and turn-timer expiry only call
 * `advanceTurn()`, so Accept/Decline stayed up through enemy turns —
 * scout the full enemy turn, then Accept for an easier challenge contract
 * whose Doka/XP still ride `completedChallenges` into applyRewards.
 *
 * True → call the same dismiss path as `markFirstAction` (or call
 * `markFirstAction` itself) before advancing the turn.
 *
 * Distinct from #809 (no-op Attack Nearest dismisses too early) and #364
 * (accepted HUD click-through). Do not restack WorldExploration in the
 * first PR; restack onto End Turn + timer sites after older WX PRs land.
 */

export function shouldCloseChallengeOfferOnTurnYield(args: {
  accepted: boolean;
}): boolean {
  return args.accepted !== true;
}
