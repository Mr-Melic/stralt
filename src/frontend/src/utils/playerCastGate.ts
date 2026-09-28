/**
 * Tile clicks and End Turn already require the current turn-order entry
 * to be the player. Sprite-first hits and Attack Nearest / S used to skip
 * that gate, so a leftover selected spell could spend AP during an enemy
 * turn or on an overworld wanderer.
 *
 * Leftover battle-walk rAF still owns `movementPath` while `isMoving`.
 * Casts used to resolve against an intermediate tile; Swap then let the
 * leftover stepper snap the player back onto the original path and tax
 * leftover lava / ground loot. Player End Turn already waits on
 * leftover walk; sprite / tile / Attack Nearest / S must wait too.
 */

export type TurnOrderEntryLike =
  | {
      type?: string;
    }
  | null
  | undefined;

export function isPlayerTurnEntry(entry: TurnOrderEntryLike): boolean {
  return entry?.type === "player";
}

/**
 * False while a battle-walk animation is still stepping. Overworld walks
 * are out of scope — `shouldAllowPlayerCastEntry` already rejects
 * `inBattle !== true` before this runs.
 */
export function shouldAllowPlayerCastDuringBattleWalk(
  isMoving: boolean | undefined,
): boolean {
  return isMoving !== true;
}

/**
 * True only for a live player turn. Overworld (no fight) and non-player
 * initiative entries must not reach executeCastAttempt. A leftover
 * battle walk must not reach Swap / Strike / Attack Nearest either.
 */
export function shouldAllowPlayerCastEntry(opts: {
  inBattle: boolean;
  turnEntry: TurnOrderEntryLike;
  deathTriggered?: boolean;
  hp?: number;
  isMoving?: boolean;
}): boolean {
  if (opts.inBattle !== true) return false;
  if (opts.deathTriggered === true) return false;
  if (opts.hp !== undefined && opts.hp <= 0) return false;
  if (!shouldAllowPlayerCastDuringBattleWalk(opts.isMoving)) return false;
  return isPlayerTurnEntry(opts.turnEntry);
}
