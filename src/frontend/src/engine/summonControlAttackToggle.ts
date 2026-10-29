/**
 * Champion Attack still gates on player AP only.
 *
 * Live WorldExploration `onSetAttack` (~18911):
 *   if (currentBattleAp > 0) setBattleActionMode("attack");
 *
 * BattleUIPanel Attack does not check `isSummonControlled` (End Turn
 * does). Kit slots live on SummonControlPanel with no Attack analog.
 * RAF paints MP tiles only in walk mode; attack mode paints player
 * spell range from `getActiveCasterPos` (the summon tile). Canvas
 * clicks still route to summon control (`shouldRouteCanvasToSummonControl`).
 *
 * `#1301` is Walk cancel. `#1274` is Escape. `#1270` is Digit / Numpad.
 * `#1238` is Attack Nearest dest. S stays Attack Nearest.
 *
 * Unique fire: controlling wisp, player leftover AP 2, summon AP 0,
 * Attack. Live enters player attack mode (MP ring gone). Intended:
 * refuse so walk highlights stay. Do not spend summon AP as player AP.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / `#1301` / `#1274` /
 * `#1270` / `#1238`. Restack Attack `onSetAttack` onto
 * `decideSummonControlAttackToggle` after older combat PRs land.
 */

export type SummonControlAttackToggleDecision =
  | { action: "none"; reason: string }
  | { action: "set-attack" };

export type BattleActionMode = "walk" | "attack";

/**
 * Live leftover: Attack enters player attack mode whenever player AP
 * remains. Summon control and summon AP are ignored.
 */
export function liveOnSetAttackWouldEnterAttack(playerAp: number): boolean {
  return playerAp > 0;
}

/**
 * Champion Attack may enter player attack mode only on a live player
 * turn with leftover player AP. Summon control stays walk — kit select
 * is the panel, not this button.
 */
export function decideSummonControlAttackToggle(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  playerAp: number;
}): SummonControlAttackToggleDecision {
  if (args.inBattle !== true) {
    return { action: "none", reason: "out_of_battle" };
  }
  if (args.isSummonControlled === true) {
    return { action: "none", reason: "summon_controlled" };
  }
  if (!(args.playerAp > 0)) {
    return { action: "none", reason: "no_player_ap" };
  }
  return { action: "set-attack" };
}

export function shouldEnterPlayerAttackMode(
  decision: SummonControlAttackToggleDecision,
): boolean {
  return decision.action === "set-attack";
}

/**
 * Spell id / mode after Attack. `set-attack` writes attack; refuse keeps
 * the current mode (walk during summon control).
 */
export function nextBattleActionModeAfterAttackToggle(
  decision: SummonControlAttackToggleDecision,
  currentMode: BattleActionMode,
): BattleActionMode {
  if (decision.action === "set-attack") return "attack";
  return currentMode;
}

/**
 * RAF leftover: attack mode while a summon is controlled drops the MP
 * ring (`mpTiles` requires walk) even though canvas still walks.
 */
export function summonControlAttackHidesWalkRing(args: {
  isSummonControlled: boolean;
  battleActionMode: BattleActionMode;
}): boolean {
  return args.isSummonControlled === true && args.battleActionMode === "attack";
}

export function shouldPaintSummonControlWalkRing(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  battleActionMode: BattleActionMode;
}): boolean {
  if (args.inBattle !== true) return false;
  if (args.isSummonControlled !== true) return false;
  return args.battleActionMode === "walk";
}
