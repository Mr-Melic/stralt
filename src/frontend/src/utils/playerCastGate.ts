/**
 * Tile clicks and End Turn already require the current turn-order entry
 * to be the player. Sprite-first hits and Attack Nearest / S used to skip
 * that gate, so a leftover selected spell could spend AP during an enemy
 * turn or on an overworld wanderer.
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
 * True only for a live player turn. Overworld (no fight) and non-player
 * initiative entries must not reach executeCastAttempt.
 */
export function shouldAllowPlayerCastEntry(opts: {
  inBattle: boolean;
  turnEntry: TurnOrderEntryLike;
  deathTriggered?: boolean;
  hp?: number;
}): boolean {
  if (opts.inBattle !== true) return false;
  if (opts.deathTriggered === true) return false;
  if (opts.hp !== undefined && opts.hp <= 0) return false;
  return isPlayerTurnEntry(opts.turnEntry);
}

/**
 * Attack Nearest / S used to call `markFirstAction` before the cooldown,
 * AP, spell, and legal-target gates. An unaccepted offer then dropped
 * with no spend. `executeCastAttempt` already marks on a real AP debit.
 */
export function shouldRecordFirstActionForAttackNearest(opts: {
  hasSpell: boolean;
  resourcesOk: boolean;
  hasLegalTarget: boolean;
  spentAp: boolean;
}): boolean {
  return (
    opts.hasSpell === true &&
    opts.resourcesOk === true &&
    opts.hasLegalTarget === true &&
    opts.spentAp === true
  );
}
