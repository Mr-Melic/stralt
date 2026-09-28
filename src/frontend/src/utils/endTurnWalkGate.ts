/**
 * End Turn vs leftover battle walk.
 *
 * Spending MP queues an async rAF stepper (`isMoving` + `movementPath`).
 * BattleUIPanel End Turn / the 30s timer call `advanceTurn` without bumping
 * `movementGenRef` or waiting for the path — so lava/spike steps can still
 * land during the enemy phase (#546 only aborts when hostiles hit 0; #547
 * aborts when a new fight starts).
 *
 * Gate End Turn (and prefer aborting the walk on advance) while a battle
 * walk is in flight. Does not change MP cost or hazard formulas.
 */

/**
 * False while a battle walk animation is still stepping.
 * Overworld walks are out of scope — pass `inBattle`.
 */
export function shouldAllowEndTurnDuringBattleWalk(opts: {
  inBattle: boolean;
  isMoving: boolean;
}): boolean {
  if (opts.inBattle !== true) return true;
  return opts.isMoving !== true;
}

/**
 * True when turn advance must bump `movementGenRef` / clear the path so a
 * leftover rAF cannot hazard-step into the next combatant's turn.
 */
export function shouldAbortBattleWalkOnTurnAdvance(opts: {
  inBattle: boolean;
  isMoving: boolean;
}): boolean {
  return opts.inBattle === true && opts.isMoving === true;
}
