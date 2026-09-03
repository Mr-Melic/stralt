/**
 * Challenge HUD visibility.
 *
 * WorldExploration still passes `visible` as the *accept window*:
 * `inBattle && !!currentChallenge && !firstActionTaken`.
 * `markFirstAction` already drops an unaccepted offer (`currentChallenge = null`)
 * and keeps an accepted contract. The panel used that same `visible` flag, so
 * an accepted challenge disappeared after the first AP/MP spend — including
 * the turns / damage / Striker tracker.
 *
 * Do not treat `visible === false` as decline. Persist still uses
 * `currentChallengeRef` / `challengeAcceptedRef`, not this HUD.
 */

export function shouldShowChallengeHud(args: {
  offerVisible: boolean;
  accepted: boolean;
  hasChallenge: boolean;
}): boolean {
  if (!args.hasChallenge) return false;
  if (args.offerVisible) return true;
  return args.accepted;
}
