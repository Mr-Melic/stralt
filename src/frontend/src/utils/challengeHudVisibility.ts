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

/**
 * #332 kept an accepted contract on screen after the first AP/MP spend.
 * The panel is `position:fixed; z-index:1200` with wrapper onMouseDown
 * preventDefault — above the canvas and BattleUIPanel (z 200). Before
 * that fix the first action hid it; afterward the 240px overlay ate
 * targeting / Attack Nearest for the rest of the fight (on a 390px
 * viewport the default x = innerWidth-260 covers almost the field).
 *
 * Offer window still needs capture for Accept/Decline. Tracker mode
 * must let map clicks through; fold keeps pointer-events:auto.
 */
export function challengeHudCapturesMapPointer(args: {
  accepted: boolean;
}): boolean {
  return args.accepted !== true;
}
