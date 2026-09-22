/**
 * BuffShop Use gating.
 *
 * BattleUIPanel / executeCastAttempt already require the live turn-order
 * row `type === "player"`. BuffShop used `battlePhase === "player"` instead.
 * Player-side summon control never calls `setBattlePhase("enemy")` (that
 * would hand the wolf to the AI executor), so the phase stays "player"
 * for the whole summon turn.
 *
 * Sequence: End Turn → Summon's Turn banner → Use Battle Elixir / Swift
 * Boots. Inventory is consumed and the bonus is written onto the player's
 * AP/MP pools. The next player-turn start restores base AP/MP from
 * getPlayerBaseStats, so the stack is gone.
 *
 * Health potions during that window also flip no-heal challenges even
 * though the HUD says it is not the player's turn.
 */

import {
  type TurnOrderEntryLike,
  isPlayerTurnEntry,
  shouldAllowPlayerCastEntry,
} from "./playerCastGate.ts";

/**
 * The stale BuffShop prop. Kept so tests can prove it still returns true
 * on a summon-control row — do not wire this to Use.
 */
export function buffItemUseAllowedByBattlePhase(opts: {
  inBattle: boolean;
  battlePhase: string;
}): boolean {
  return opts.inBattle === true && opts.battlePhase === "player";
}

export function shouldAllowBuffItemUse(opts: {
  inBattle: boolean;
  turnEntry: TurnOrderEntryLike;
  deathTriggered?: boolean;
  hp?: number;
}): boolean {
  return shouldAllowPlayerCastEntry(opts);
}

/**
 * Player-turn start restores AP/MP from base + modifiers and ignores
 * leftover elixir / boots. Prove a summon-turn Use cannot carry.
 */
export function playerTurnStartBattleAp(baseAp: number, apMod: number): number {
  return Math.max(0, Math.floor(Number(baseAp) || 0) + (Number(apMod) || 0));
}

export function playerTurnStartBattleMp(baseMp: number, mpMod: number): number {
  return Math.max(0, Math.floor(Number(baseMp) || 0) + (Number(mpMod) || 0));
}

/** Summon-control rows must not count as the player's Use window. */
export function isSummonControlTurnEntry(entry: TurnOrderEntryLike): boolean {
  return entry?.type === "summon" && isPlayerTurnEntry(entry) === false;
}
