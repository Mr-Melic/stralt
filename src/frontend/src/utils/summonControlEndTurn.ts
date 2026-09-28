/**
 * SummonControlPanel End Turn gate.
 *
 * BattleUIPanel player End Turn checks the live turn-order row
 * (`_entry?.type !== "player"`) before `advanceTurn`. Summon control only
 * clears `activeControlledSummonId` and advances — no live-row check and no
 * same-tick commit flag.
 *
 * On mobile the panel is `onClick` only (no canvas ghost-click guard). A
 * touchend + synthetic click can fire End Turn twice before React unmounts
 * the panel, skipping the next enemy (or player) slot.
 */

export type SummonControlEndTurnEntry = {
  id?: string;
  type?: string;
  isSummon?: boolean;
  side?: string;
};

/**
 * True when the live turn-order entry is the controlled player-side summon.
 * After the first advance, the entry is no longer that summon — a trailing
 * synthetic click must no-op. The 30s timer can also advance first; a late
 * tap must not skip the next row.
 */
export function shouldAllowSummonControlEndTurn(opts: {
  inBattle: boolean;
  controlledSummonId: string | null | undefined;
  turnEntry: SummonControlEndTurnEntry | null | undefined;
  /** Same-tick commit after the first End Turn press. */
  alreadyCommitted?: boolean;
}): boolean {
  if (opts.inBattle !== true) return false;
  if (opts.alreadyCommitted === true) return false;
  const id = opts.controlledSummonId;
  if (typeof id !== "string" || id.length === 0) return false;
  const entry = opts.turnEntry;
  if (!entry || entry.id !== id) return false;
  if (entry.isSummon !== true) return false;
  // Enemy-side minions must never take the player control End Turn path.
  if (entry.side === "enemy") return false;
  return true;
}

/**
 * Panel-local same-tick lock. setState unmount is async, so a double-click
 * (or touch + synthetic click) can invoke onEndTurn twice while the live
 * row is still this summon. Mark before calling the parent.
 */
export function beginSummonControlEndTurn(lock: {
  current: boolean;
}): boolean {
  if (lock.current) return false;
  lock.current = true;
  return true;
}
