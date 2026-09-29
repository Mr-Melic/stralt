/**
 * `markFirstAction` dismisses an unaccepted challenge offer.
 *
 * Attack Nearest / S used to call it before the cooldown and no-target
 * gates, so a wasted keystroke closed the offer without spending AP.
 * Tile clicks only mark inside `executeCastAttempt` after a real spend.
 *
 * True only when this attempt committed an AP spend.
 */
export function shouldMarkFirstActionForAttackNearest(opts: {
  spentAp: boolean;
}): boolean {
  return opts.spentAp === true;
}
