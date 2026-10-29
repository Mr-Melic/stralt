/**
 * Champion Walk still only clears `selectedSpellIdRef` while a kit spell
 * stays selected.
 *
 * Player Walk (`onSetWalk`) clears `selectedSpellIdRef` so the next canvas
 * click walks. Kit slots live on `selectedSummonSpellId` with no Walk
 * analog: `SummonControlPanel` has no walk button, and WorldExploration
 * routes summon-control clicks with `if (selectedSummonSpellId) { cast }
 * else { walk }`. RAF paints MP tiles when `battleActionMode === "walk"`,
 * but the kit id still intercepts execute. BattleUIPanel Walk does not
 * check `isSummonControlled`. Live `onSetWalk` never writes
 * `setSelectedSummonSpellId`.
 *
 * `#1274` is Escape cancel (inspect-first). This sidecar is Walk cancel.
 * Digit / Numpad kit select is `#1270`. Champion pointer skip is `#1267`.
 * Kit Attack Nearest dest is `#1238`. Player Digit is `#743`.
 *
 * Unique fire: controlling wisp, Blood Mend selected, Walk, an empty
 * neighbour in the MP ring. Helper clears the kit id so that highlighted
 * dest executes as walk. With the kit still armed the same dest cannot.
 * Player turn / empty kit / 0 MP / Escape / Digit 1 / S / Strike / Frost
 * / Inferno / Venom / Poison / Slow / bomber cannot as this leftover.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / `#1270` / `#1274`.
 * Restack Walk `onSetWalk` onto `decideSummonControlWalkCancel` after
 * older combat PRs land.
 */

import { canAffordBattleWalk } from "./battleWalkMp.ts";

export type SummonControlWalkCancelDecision =
  | { action: "none"; reason: string }
  | { action: "cancel-kit"; previousSpellId: string };

/**
 * Live canvas gate: a non-null kit id takes the cast arm; null walks.
 * Matches WorldExploration mouse (~10050) and touch (~10749). Distinct
 * from `#1274` `summonControlClickUsesKitCast` (Escape sidecar).
 */
export function summonControlWalkClickUsesKitCast(
  selectedSummonSpellId: string | null | undefined,
): boolean {
  return Boolean(selectedSummonSpellId);
}

/**
 * Spell id `setSelectedSummonSpellId` should keep after Walk. Null after
 * cancel-kit so the next click walks. Ignore keeps the previous id.
 */
export function nextSummonSpellIdAfterWalk(
  decision: SummonControlWalkCancelDecision,
  currentId: string | null,
): string | null {
  if (decision.action === "cancel-kit") return null;
  return currentId;
}

/**
 * Champion Walk may clear the kit only while a summon is controlled, in
 * battle, and a kit id is armed. Player-turn Walk stays the champion
 * `selectedSpellIdRef` clear (`#743` analog). Empty kit is already walk.
 */
export function decideSummonControlWalkCancel(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  selectedSummonSpellId: string | null;
}): SummonControlWalkCancelDecision {
  if (args.inBattle !== true) {
    return { action: "none", reason: "out_of_battle" };
  }
  if (args.isSummonControlled !== true) {
    return { action: "none", reason: "player_turn" };
  }
  const id = args.selectedSummonSpellId;
  if (typeof id !== "string" || id.length === 0) {
    return { action: "none", reason: "no_kit" };
  }
  return { action: "cancel-kit", previousSpellId: id };
}

export type SummonControlWalkDestArgs = {
  inBattle: boolean;
  isSummonControlled: boolean;
  selectedSummonSpellId: string | null;
  destInMpRing: boolean;
  currentMp: number;
  pathLength: number;
  costPerTile?: number;
};

/**
 * Walk highlight. RAF already paints MP tiles in walk mode from the
 * summon tile (`getMpReachableTiles` + `battleWalkMpBudget`). This
 * leftover only asks whether that dest is still a walk dest after Walk
 * cancel — kit intercept is execute, not paint.
 */
export function shouldHighlightSummonControlWalkDest(
  args: Pick<
    SummonControlWalkDestArgs,
    | "inBattle"
    | "isSummonControlled"
    | "destInMpRing"
    | "currentMp"
    | "pathLength"
    | "costPerTile"
  >,
): boolean {
  if (args.inBattle !== true) return false;
  if (args.isSummonControlled !== true) return false;
  if (args.destInMpRing !== true) return false;
  return canAffordBattleWalk(
    args.currentMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

/**
 * Execute the highlighted MP dest as a walk. Kit still armed → canvas
 * takes the cast arm and this dest cannot walk (Blood Mend is self;
 * an empty neighbour is not a kit dest). After Walk cancel the kit id
 * is null and the dest executes.
 */
export function canExecuteSummonControlWalkDest(
  args: SummonControlWalkDestArgs,
): boolean {
  if (!shouldHighlightSummonControlWalkDest(args)) return false;
  if (summonControlWalkClickUsesKitCast(args.selectedSummonSpellId)) {
    return false;
  }
  return true;
}

export function summonControlWalkHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

/**
 * Commit Walk cancel then ask whether `dest` executes. Remaining kit
 * intercept / short MP / player-turn / empty ring return null.
 */
export function executeSummonControlWalkDest(
  args: SummonControlWalkDestArgs,
): { dest: "walk" } | null {
  const decision = decideSummonControlWalkCancel(args);
  const kitId = nextSummonSpellIdAfterWalk(
    decision,
    args.selectedSummonSpellId,
  );
  if (
    !canExecuteSummonControlWalkDest({
      ...args,
      selectedSummonSpellId: kitId,
    })
  ) {
    return null;
  }
  return { dest: "walk" };
}
