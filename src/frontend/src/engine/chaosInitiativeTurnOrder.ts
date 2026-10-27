/**
 * Chaos Initiative vs advertised per-round turn-order reshuffle.
 *
 * Registry (`mapModifiers.ts` `chaos_initiative`) announces
 *   "Chaos Initiative: turn order reshuffles each round."
 * `onTurnOrderSort` Fisher-Yates shuffles non-summon entries and keeps
 * summons immediately after their owner.
 *
 * Live WorldExploration `advanceTurn` does call `applyTurnOrderSort` when
 * the wheel wraps to index 0, but two later authorities discard it:
 * 1. The shuffle runs *after* `setCurrentTurnIndex` has already dispatched
 *    `prevOrder[0]` (the unshuffled first actor of the new round).
 * 2. The shuffled array is only the `setTurnOrder` return value (React
 *    InitiativeStrip). `turnOrderRef` is never written. The next End Turn
 *    prefers the live ref via `liveTurnOrder` (the remove-from-queue fix:
 *    stale React order after `removeCombatantFromTurnQueue`).
 *
 * Sequence: Chaos Initiative map → start order [Player, Rat, Crow] →
 * round 1 plays P→Rat→Crow → wrap to index 0 dispatches Player from the
 * unshuffled ref → React strip may show a shuffle → End Turn
 * `liveTurnOrder(reactShuffled, turnOrderRef)` returns the original
 * [Player, Rat, Crow] → Rat acts. Advertised reshuffle never reaches AI
 * / End Turn.
 *
 * Unique vs **#617** (docs-only MIMA discard note), **#390** (live-store
 * summon fade / the `liveTurnOrder` fix that exposed this), **#443**
 * (player turn-start Void Rift / Mist / Swift Winds), **#1160** (Glass
 * Realm Strike ×2), **#1148** (Vampiric attacker stub), Titan 1–5× /
 * player Iron Curse RES ×1.3, turn-start standing lava/spikes. Do not
 * add `heal` / `res` / `hp` / `damage`.
 *
 * Do not restack WorldExploration / turnQueue / mapModifiers. Restack
 * `advanceTurn` onto `executeChaosInitiativeTurnOrder` after older
 * combat PRs land: shuffle *before* index-0 dispatch, then write
 * `turnOrderRef.current = order` so `liveTurnOrder` cannot discard it.
 * Leave `liveTurnOrder`'s ref preference alone (that is the valid
 * remove-from-queue fix).
 */

import type { CombatantEntry } from "../components/InitiativeStrip";
import { mapModifierRegistry } from "./mapModifiers.ts";
import { liveTurnOrder } from "./turnQueue.ts";

export const CHAOS_INITIATIVE_MODIFIER_ID = "chaos_initiative";

export type ChaosInitiativeTurnOrderExecute = {
  order: CombatantEntry[];
  writeLiveRef: boolean;
};

export function isChaosInitiativeModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === CHAOS_INITIATIVE_MODIFIER_ID;
}

/**
 * Live WX returns the shuffle from `setTurnOrder` only. It never assigns
 * `turnOrderRef.current` in that block.
 */
export function wxChaosInitiativeWritesTurnOrderRef(): boolean {
  return false;
}

/**
 * Live WX shuffles after `setCurrentTurnIndex` has already dispatched
 * `prevOrder[nextIdx]` from the unshuffled queue.
 */
export function wxChaosInitiativeShufflesBeforeDispatch(): boolean {
  return false;
}

/** Live WX never commits the shuffle onto the End Turn / AI queue. */
export function liveWxChaosInitiativeReshuffleCommits(): boolean {
  return false;
}

/**
 * `liveTurnOrder` prefers a non-empty ref. A React-only shuffle is
 * discarded on the next `advanceTurn`.
 */
export function liveTurnOrderDiscardsReactShuffle<T>(
  reactShuffled: T[],
  liveRef: T[],
): boolean {
  if (liveRef.length === 0) return false;
  return liveTurnOrder(reactShuffled, liveRef) === liveRef;
}

export function canExecuteChaosInitiativeTurnOrder(args: {
  modifierActive: boolean;
  wrappedToIndexZero: boolean;
  orderLength: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  if (args.wrappedToIndexZero !== true) return false;
  return args.orderLength > 0;
}

/** Alias so decide and the advanceTurn restack cannot fork. */
export function shouldDecideChaosInitiativeTurnOrder(
  args: Parameters<typeof canExecuteChaosInitiativeTurnOrder>[0],
): boolean {
  return canExecuteChaosInitiativeTurnOrder(args);
}

export function chaosInitiativeHighlightedReshuffleIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised per-round reshuffle. `writeLiveRef` is always true
 * so a later wire cannot leave the shuffle on React state alone.
 * Titan / Vampiric / Glass / RES are not in this payload.
 */
export function executeChaosInitiativeTurnOrder(args: {
  modifierActive: boolean;
  wrappedToIndexZero: boolean;
  prevOrder: CombatantEntry[];
}): ChaosInitiativeTurnOrderExecute | null {
  if (
    !canExecuteChaosInitiativeTurnOrder({
      modifierActive: args.modifierActive,
      wrappedToIndexZero: args.wrappedToIndexZero,
      orderLength: args.prevOrder.length,
    })
  ) {
    return null;
  }
  const order = mapModifierRegistry.applyTurnOrderSort(
    args.prevOrder,
    new Set([CHAOS_INITIATIVE_MODIFIER_ID]),
  );
  return { order, writeLiveRef: true };
}
