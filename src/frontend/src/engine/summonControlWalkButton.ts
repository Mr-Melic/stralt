/**
 * Champion Walk still greys on leftover player MP.
 *
 * Live BattleUIPanel Walk (~478–496):
 *   title / opacity from `currentBattleMp <= 0`
 *   onClick={onSetWalk} is never `disabled`
 *
 * Live WorldExploration `onSetWalk` (~18905):
 *   always `setBattleActionMode("walk")` — no MP, no `isSummonControlled`
 *
 * RAF highlight already uses `battleWalkMpBudget` (summon MP while
 * controlling). Canvas execute uses `canAffordBattleWalk(summon.currentMp)`.
 * A greyed Walk still enters walk mode, so leftover player MP 0 hides a
 * legal summon dest and leftover player MP 3 advertises a dest the
 * summon cannot pay.
 *
 * `#1301` is Walk cancel kit. `#1315` is Attack toggle. `#1274` is Escape.
 * `#1270` is Digit / Numpad. `#1238` is Attack Nearest dest.
 *
 * Unique fire: controlling wisp, catalog MP 2, player leftover MP 0,
 * empty neighbour in the MP ring. Live button greys ("No Movement Points")
 * while the dest is highlighted and executes. Inverse: player leftover MP 3,
 * summon MP 0 — live button looks enabled, dest cannot execute.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / `#1301` / `#1315` /
 * `#1274` / `#1270` / `#1238`. Restack Walk enable onto
 * `shouldEnableSummonControlWalkButton` after older combat PRs land.
 */

import { battleWalkMpBudget } from "./battleWalkMp.ts";

export type BattleActionMode = "walk" | "attack";

/**
 * Live leftover: Walk looks enabled whenever leftover player MP remains.
 * Summon control and summon MP are ignored.
 */
export function liveWalkButtonLooksEnabled(playerMp: number): boolean {
  return Math.max(0, Math.floor(Number(playerMp) || 0)) > 0;
}

/**
 * Same budget as RAF `getMpReachableTiles`. Origin is already the
 * controlled summon tile; leftover player MP must not paint or enable.
 */
export function summonControlWalkButtonBudget(args: {
  playerMp: number;
  isSummonControlled: boolean;
  summonMp?: number | null;
}): number {
  return battleWalkMpBudget({
    playerMp: args.playerMp,
    controllingSummon: args.isSummonControlled === true,
    summonMp: args.summonMp,
  });
}

/**
 * Walk may look enabled only when the painted MP ring has a budget.
 * Player turn stays leftover player MP. Summon control stays summon MP.
 */
export function shouldEnableSummonControlWalkButton(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  playerMp: number;
  summonMp?: number | null;
}): boolean {
  if (args.inBattle !== true) return false;
  return summonControlWalkButtonBudget(args) > 0;
}

/**
 * Title copy the Walk button should show. Live leftover still keys the
 * "No Movement Points" string off player `currentBattleMp`.
 */
export function summonControlWalkButtonTitle(enabled: boolean): string {
  if (enabled !== true) return "No Movement Points left this turn";
  return "Walk — spend MP to move onto a highlighted tile";
}

/**
 * Live canvas debit wallet. Summon-control walks charge `summon.currentMp`;
 * player walks charge `currentBattleMp`. Distinct from the Walk *button*,
 * which never reads summon MP.
 */
export function liveWalkExecuteMp(args: {
  isSummonControlled: boolean;
  playerMp: number;
  summonMp: number;
}): number {
  if (args.isSummonControlled === true) {
    return Math.max(0, Math.floor(Number(args.summonMp) || 0));
  }
  return Math.max(0, Math.floor(Number(args.playerMp) || 0));
}

/**
 * Live leftover: Walk click always writes walk. Enable greying is
 * visual-only (`cursor-not-allowed`, never `disabled=`).
 */
export function liveOnSetWalkWouldEnterWalk(): boolean {
  return true;
}

/**
 * Intended Walk click. Same budget as the painted ring — a 0-MP summon
 * must not look ready just because leftover player MP remains.
 */
export function shouldEnterWalkModeFromWalkButton(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  playerMp: number;
  summonMp?: number | null;
}): boolean {
  return shouldEnableSummonControlWalkButton(args);
}

export function nextBattleActionModeAfterWalkToggle(
  enterWalk: boolean,
  currentMode: BattleActionMode,
): BattleActionMode {
  if (enterWalk === true) return "walk";
  return currentMode;
}
