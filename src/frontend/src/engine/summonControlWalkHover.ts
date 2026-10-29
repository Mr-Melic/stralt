/**
 * RAF walk hover still uses Manhattan from the player tile and colors
 * against leftover player MP.
 *
 * Live WorldExploration hover (~8513–8553):
 *   dist = |hovered.x - playerPositionRef.x| + |hovered.y - playerPositionRef.y|
 *   mpCost = dist * applyMpCost(1)
 *   fill = mpCost <= currentBattleMpRef ? "#4ade80" : "#f87171"
 *   show when dist > 0 and dest is floor — no summon origin, no summon MP,
 *   no `battleWalkMpBudget`, no `getActiveCasterPos`
 *
 * RAF highlight already origins at the controlled summon via
 * `getActiveCasterPos` + `battleWalkMpBudget` (summon MP). Canvas execute
 * already `findPath`s from the summon tile and charges
 * `canAffordBattleWalk(summon.currentMp)`.
 *
 * `#417` is hover BFS dest cost vs Manhattan around the *same* (player)
 * origin. `#701` is occupied dest omitted from the ring. `#1322` is Walk
 * button enable from summon MP. `#1301` is Walk cancel kit. This leftover
 * is origin (player tile vs summon tile) plus wallet (player MP vs summon
 * MP).
 *
 * Unique fire: controlling wisp at (3,3) catalog MP 2, player at (8,8)
 * leftover MP 3, empty neighbour (4,3) in the summon MP ring. Live hover
 * Manhattan from the player is 9, red vs leftover 3. Dest is highlighted
 * and executes at 1 summon MP. Inverse: player leftover 3 / summon 0 on a
 * player-adjacent floor looks green live and cannot execute.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / battleWalkMp /
 * `#417` / `#701` / `#1301` / `#1322`. Restack hover onto
 * `summonControlWalkHoverOrigin` + `summonControlWalkHoverBudget` after
 * older combat PRs land.
 */

import {
  battleWalkMpBudget,
  battleWalkMpCost,
  canAffordBattleWalk,
} from "./battleWalkMp.ts";

export type WalkHoverCell = { x: number; y: number };

/** Live leftover fills. Do not restyle — only swap origin + wallet. */
export const WALK_HOVER_AFFORDABLE_FILL = "#4ade80";
export const WALK_HOVER_UNAFFORDABLE_FILL = "#f87171";

export function walkHoverFillStyle(affordable: boolean): string {
  return affordable === true
    ? WALK_HOVER_AFFORDABLE_FILL
    : WALK_HOVER_UNAFFORDABLE_FILL;
}

/** Cardinal Manhattan the live hover still measures from the player tile. */
export function liveWalkHoverManhattan(
  origin: WalkHoverCell,
  dest: WalkHoverCell,
): number {
  return Math.abs(dest.x - origin.x) + Math.abs(dest.y - origin.y);
}

/**
 * Live leftover origin is always `playerPositionRef`, even while a summon
 * is the active caster for the MP ring.
 */
export function liveWalkHoverOrigin(playerPos: WalkHoverCell): WalkHoverCell {
  return { x: playerPos.x, y: playerPos.y };
}

/** Live leftover wallet is leftover `currentBattleMpRef`, never summon MP. */
export function liveWalkHoverWallet(playerMp: number): number {
  return Math.max(0, Math.floor(Number(playerMp) || 0));
}

export function liveWalkHoverMpCost(args: {
  playerPos: WalkHoverCell;
  dest: WalkHoverCell;
  costPerTile?: number;
}): number {
  const per = Math.max(1, Math.floor(Number(args.costPerTile) || 1));
  return (
    liveWalkHoverManhattan(liveWalkHoverOrigin(args.playerPos), args.dest) * per
  );
}

/** Live leftover shows any floor tile with Manhattan > 0 from the player. */
export function liveWalkHoverShowsLabel(args: {
  destIsFloor: boolean;
  playerPos: WalkHoverCell;
  dest: WalkHoverCell;
}): boolean {
  if (args.destIsFloor !== true) return false;
  return liveWalkHoverManhattan(args.playerPos, args.dest) > 0;
}

export function liveWalkHoverLooksAffordable(args: {
  playerPos: WalkHoverCell;
  dest: WalkHoverCell;
  playerMp: number;
  costPerTile?: number;
}): boolean {
  const cost = liveWalkHoverMpCost(args);
  return cost > 0 && cost <= liveWalkHoverWallet(args.playerMp);
}

/**
 * Intended origin: the same tile highlight BFS already uses
 * (`getActiveCasterPos`). Player turn stays the player tile.
 */
export function summonControlWalkHoverOrigin(args: {
  isSummonControlled: boolean;
  playerPos: WalkHoverCell;
  summonPos?: WalkHoverCell | null;
}): WalkHoverCell {
  if (args.isSummonControlled === true && args.summonPos) {
    return { x: args.summonPos.x, y: args.summonPos.y };
  }
  return { x: args.playerPos.x, y: args.playerPos.y };
}

/**
 * Same budget as RAF `getMpReachableTiles` / Walk button. Distinct from
 * `#417` dest-cost lookup — this only switches the wallet.
 */
export function summonControlWalkHoverBudget(args: {
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
 * Hover MP from the intended origin. Empty-grid unique fire uses
 * Manhattan from that origin (cardinal neighbour = execute `findPath`
 * length). Do not look up a BFS dest-cost map (`#417` / `#701`).
 */
export function summonControlWalkHoverMpCost(args: {
  origin: WalkHoverCell;
  dest: WalkHoverCell;
  costPerTile?: number;
  pathLength?: number;
}): number {
  const per = Math.max(1, Math.floor(Number(args.costPerTile) || 1));
  const tiles =
    args.pathLength !== undefined
      ? Math.max(0, Math.floor(Number(args.pathLength) || 0))
      : liveWalkHoverManhattan(args.origin, args.dest);
  return battleWalkMpCost(tiles, per);
}

export function summonControlWalkHoverShowsLabel(args: {
  destIsFloor: boolean;
  origin: WalkHoverCell;
  dest: WalkHoverCell;
}): boolean {
  if (args.destIsFloor !== true) return false;
  return liveWalkHoverManhattan(args.origin, args.dest) > 0;
}

export function summonControlWalkHoverLooksAffordable(args: {
  isSummonControlled: boolean;
  playerPos: WalkHoverCell;
  summonPos?: WalkHoverCell | null;
  dest: WalkHoverCell;
  playerMp: number;
  summonMp?: number | null;
  costPerTile?: number;
  pathLength?: number;
}): boolean {
  const origin = summonControlWalkHoverOrigin(args);
  const cost = summonControlWalkHoverMpCost({
    origin,
    dest: args.dest,
    costPerTile: args.costPerTile,
    pathLength: args.pathLength,
  });
  const wallet = summonControlWalkHoverBudget(args);
  return cost > 0 && cost <= wallet;
}

export type SummonControlWalkHoverDestArgs = {
  inBattle: boolean;
  isSummonControlled: boolean;
  destIsFloor: boolean;
  destInMpRing: boolean;
  playerPos: WalkHoverCell;
  summonPos: WalkHoverCell;
  dest: WalkHoverCell;
  playerMp: number;
  summonMp: number;
  pathLength: number;
  costPerTile?: number;
};

/**
 * Highlight membership for this leftover: dest is in the summon MP ring
 * (RAF already BFS-es from the summon). Hover origin/wallet are this
 * sidecar; ring occupancy stays `#701`.
 */
export function shouldHighlightSummonControlWalkHoverDest(
  args: Pick<
    SummonControlWalkHoverDestArgs,
    | "inBattle"
    | "isSummonControlled"
    | "destInMpRing"
    | "summonMp"
    | "pathLength"
    | "costPerTile"
  >,
): boolean {
  if (args.inBattle !== true) return false;
  if (args.isSummonControlled !== true) return false;
  if (args.destInMpRing !== true) return false;
  return canAffordBattleWalk(
    args.summonMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

/**
 * Execute the highlighted MP dest as a summon walk. Same wallet as hover
 * and RAF. Dest outside the ring / 0 summon MP / player turn cannot.
 */
export function canExecuteSummonControlWalkHoverDest(
  args: SummonControlWalkHoverDestArgs,
): boolean {
  if (!shouldHighlightSummonControlWalkHoverDest(args)) return false;
  const budget = summonControlWalkHoverBudget(args);
  return canAffordBattleWalk(budget, args.pathLength, args.costPerTile ?? 1);
}

export function summonControlWalkHoverHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

export type WalkHoverPaint = {
  show: boolean;
  mpCost: number;
  fill: string;
};

/** Live leftover paint: player origin + player leftover MP. */
export function liveWalkHoverPaint(args: {
  destIsFloor: boolean;
  playerPos: WalkHoverCell;
  dest: WalkHoverCell;
  playerMp: number;
  costPerTile?: number;
}): WalkHoverPaint {
  const mpCost = liveWalkHoverMpCost(args);
  const show = liveWalkHoverShowsLabel(args);
  return {
    show,
    mpCost,
    fill: walkHoverFillStyle(liveWalkHoverLooksAffordable(args)),
  };
}

/** Intended paint: active-caster origin + `battleWalkMpBudget` wallet. */
export function summonControlWalkHoverPaint(
  args: SummonControlWalkHoverDestArgs,
): WalkHoverPaint {
  const origin = summonControlWalkHoverOrigin(args);
  const mpCost = summonControlWalkHoverMpCost({
    origin,
    dest: args.dest,
    costPerTile: args.costPerTile,
    pathLength: args.pathLength,
  });
  const show = summonControlWalkHoverShowsLabel({
    destIsFloor: args.destIsFloor,
    origin,
    dest: args.dest,
  });
  return {
    show,
    mpCost,
    fill: walkHoverFillStyle(summonControlWalkHoverLooksAffordable(args)),
  };
}
