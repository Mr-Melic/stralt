/**
 * RAF walk hover still labels dests outside the painted MP ring.
 *
 * Live WorldExploration hover (~8513–8553):
 *   dist = |hovered.x - playerPositionRef.x| + |hovered.y - playerPositionRef.y|
 *   mpCost = dist * applyMpCost(1)
 *   show when dist > 0 and dest is floor — no `getMpReachableTiles`,
 *   no `mpTiles.has`, no dest-in-ring check
 *
 * RAF already paints the green ring from `getMpReachableTiles` (origin =
 * `getActiveCasterPos`, budget = `battleWalkMpBudget`). Canvas execute
 * already refuses dests that fail `reachable.has`.
 *
 * `#1324` is hover origin + wallet. `#417` is BFS dest cost vs Manhattan
 * around the same origin. `#1322` is Walk button enable. `#1301` is Walk
 * cancel kit. `#1330` is reject canvas float. `#701` is occupied dest.
 * This leftover is label membership: a dest outside the painted ring still
 * gets a cost label.
 *
 * Unique fire: controlling wisp at (3,3) catalog MP 2, dest (6,3) path 3.
 * Live leftover still shows a cost label (floor + Manhattan > 0). Dest is
 * not in the 2-MP ring and cannot execute. Inverse: empty neighbour (4,3)
 * is in the ring, keeps the label, and executes at 1 summon MP.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / battleWalkMp /
 * `#417` / `#701` / `#1301` / `#1322` / `#1324` / `#1330`. Restack hover
 * onto `summonControlWalkHoverRingShowsLabel` after older combat PRs land.
 */

import { canAffordBattleWalk } from "./battleWalkMp.ts";

export type WalkHoverRingCell = { x: number; y: number };

/** Cardinal Manhattan the live hover still measures. */
export function walkHoverRingManhattan(
  origin: WalkHoverRingCell,
  dest: WalkHoverRingCell,
): number {
  return Math.abs(dest.x - origin.x) + Math.abs(dest.y - origin.y);
}

/**
 * Live leftover: dest-is-floor and Manhattan from origin > 0. Ignores
 * whether RAF painted the dest in the MP ring.
 */
export function liveWalkHoverRingShowsLabel(args: {
  destIsFloor: boolean;
  origin: WalkHoverRingCell;
  dest: WalkHoverRingCell;
}): boolean {
  if (args.destIsFloor !== true) return false;
  return walkHoverRingManhattan(args.origin, args.dest) > 0;
}

/**
 * Intended: dest must also be in the painted MP ring. Origin/wallet stay
 * `#1324`. The number on the label stays Manhattan (`#417` dest-cost).
 */
export function summonControlWalkHoverRingShowsLabel(args: {
  destIsFloor: boolean;
  destInMpRing: boolean;
  origin: WalkHoverRingCell;
  dest: WalkHoverRingCell;
}): boolean {
  if (args.destInMpRing !== true) return false;
  return liveWalkHoverRingShowsLabel(args);
}

export type SummonControlWalkHoverRingDestArgs = {
  inBattle: boolean;
  isSummonControlled: boolean;
  destIsFloor: boolean;
  destInMpRing: boolean;
  origin: WalkHoverRingCell;
  dest: WalkHoverRingCell;
  summonMp: number;
  pathLength: number;
  costPerTile?: number;
};

/**
 * Highlight membership for this leftover: dest is in the summon MP ring
 * RAF already BFS-es. Occupancy stays `#701`. Origin/wallet stay `#1324`.
 */
export function shouldHighlightSummonControlWalkHoverRingDest(
  args: Pick<
    SummonControlWalkHoverRingDestArgs,
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
 * Execute the highlighted MP dest as a summon walk. Dest outside the ring
 * / 0 summon MP / player turn cannot. Same `reachable.has` gate as canvas.
 */
export function canExecuteSummonControlWalkHoverRingDest(
  args: SummonControlWalkHoverRingDestArgs,
): boolean {
  if (!shouldHighlightSummonControlWalkHoverRingDest(args)) return false;
  return canAffordBattleWalk(
    args.summonMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

export function summonControlWalkHoverRingHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

export type WalkHoverRingPaint = {
  show: boolean;
  mpCost: number;
};

function hoverRingMpCost(args: {
  origin: WalkHoverRingCell;
  dest: WalkHoverRingCell;
  pathLength?: number;
  costPerTile?: number;
}): number {
  const per = Math.max(1, Math.floor(Number(args.costPerTile) || 1));
  const tiles =
    args.pathLength !== undefined
      ? Math.max(0, Math.floor(Number(args.pathLength) || 0))
      : walkHoverRingManhattan(args.origin, args.dest);
  return tiles * per;
}

/** Live leftover paint: floor + Manhattan > 0, even outside the ring. */
export function liveWalkHoverRingPaint(args: {
  destIsFloor: boolean;
  origin: WalkHoverRingCell;
  dest: WalkHoverRingCell;
  pathLength?: number;
  costPerTile?: number;
}): WalkHoverRingPaint {
  return {
    show: liveWalkHoverRingShowsLabel(args),
    mpCost: hoverRingMpCost(args),
  };
}

/** Intended paint: hide dests RAF did not paint in the MP ring. */
export function summonControlWalkHoverRingPaint(
  args: SummonControlWalkHoverRingDestArgs,
): WalkHoverRingPaint {
  return {
    show: summonControlWalkHoverRingShowsLabel(args),
    mpCost: hoverRingMpCost(args),
  };
}
