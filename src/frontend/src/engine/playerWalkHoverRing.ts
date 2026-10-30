/**
 * RAF champion walk hover still labels dests outside the painted MP ring.
 *
 * Live WorldExploration hover (~8513–8553):
 *   dist = |hovered.x - playerPositionRef.x| + |hovered.y - playerPositionRef.y|
 *   mpCost = dist * applyMpCost(1)
 *   show when dist > 0 and dest is floor — no `getMpReachableTiles`,
 *   no `mpTiles.has`, no dest-in-ring check
 *
 * RAF already paints the green ring from `getMpReachableTiles` (origin =
 * `getActiveCasterPos`, which is the player tile when no summon is
 * controlled; budget = leftover `currentBattleMp`). Canvas execute
 * already refuses dests that fail `reachable.has` then
 * `classifyWalkReject`.
 *
 * `#1334` is summon-control label membership. `#1324` is hover origin +
 * wallet during control. `#417` is BFS dest cost vs Manhattan around the
 * same origin. `#701` is occupied dest. `#1322` is Walk button enable.
 * `#1330` is reject canvas float. This leftover is champion (player-turn)
 * label membership: leftover 3 MP still labels a path-4 dest that cannot
 * execute.
 *
 * Unique fire: player at (8,8), leftover MP 3, dest (12,8) path 4. Live
 * leftover still shows a cost label (floor + Manhattan > 0). Dest is not
 * in the 3-MP ring and cannot execute. Inverse: empty neighbour (9,8) is
 * in the ring, keeps the label, and executes at 1 player MP.
 *
 * `PLAYER_BASE_MP` is 4. Unique fire uses leftover 3 (WX `useState(3)` /
 * after a 1-tile walk of a 4-MP champion). A 4-tile walk cannot. Do not
 * rebalance `PLAYER_BASE_MP`.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / battleWalkMp /
 * `#417` / `#701` / `#1322` / `#1324` / `#1330` / `#1334`. Restack hover
 * onto `playerWalkHoverRingShowsLabel` after older combat PRs land.
 */

import { canAffordBattleWalk } from "./battleWalkMp.ts";

export type PlayerWalkHoverRingCell = { x: number; y: number };

/** Cardinal Manhattan the live hover still measures from the player. */
export function playerWalkHoverRingManhattan(
  origin: PlayerWalkHoverRingCell,
  dest: PlayerWalkHoverRingCell,
): number {
  return Math.abs(dest.x - origin.x) + Math.abs(dest.y - origin.y);
}

/**
 * Live leftover: dest-is-floor and Manhattan from the player > 0. Ignores
 * whether RAF painted the dest in the MP ring.
 */
export function livePlayerWalkHoverRingShowsLabel(args: {
  destIsFloor: boolean;
  origin: PlayerWalkHoverRingCell;
  dest: PlayerWalkHoverRingCell;
}): boolean {
  if (args.destIsFloor !== true) return false;
  return playerWalkHoverRingManhattan(args.origin, args.dest) > 0;
}

/**
 * Intended: dest must also be in the painted MP ring. Origin/wallet stay
 * the player leftover (`#1324` is summon-control). The number on the
 * label stays Manhattan (`#417` dest-cost).
 */
export function playerWalkHoverRingShowsLabel(args: {
  destIsFloor: boolean;
  destInMpRing: boolean;
  origin: PlayerWalkHoverRingCell;
  dest: PlayerWalkHoverRingCell;
}): boolean {
  if (args.destInMpRing !== true) return false;
  return livePlayerWalkHoverRingShowsLabel(args);
}

export type PlayerWalkHoverRingDestArgs = {
  inBattle: boolean;
  isSummonControlled: boolean;
  destIsFloor: boolean;
  destInMpRing: boolean;
  origin: PlayerWalkHoverRingCell;
  dest: PlayerWalkHoverRingCell;
  playerMp: number;
  pathLength: number;
  costPerTile?: number;
};

/**
 * Highlight membership for this leftover: dest is in the player MP ring
 * RAF already BFS-es. Occupancy stays `#701`. Summon-control ring stays
 * `#1334`.
 */
export function shouldHighlightPlayerWalkHoverRingDest(
  args: Pick<
    PlayerWalkHoverRingDestArgs,
    | "inBattle"
    | "isSummonControlled"
    | "destInMpRing"
    | "playerMp"
    | "pathLength"
    | "costPerTile"
  >,
): boolean {
  if (args.inBattle !== true) return false;
  if (args.isSummonControlled === true) return false;
  if (args.destInMpRing !== true) return false;
  return canAffordBattleWalk(
    args.playerMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

/**
 * Execute the highlighted MP dest as a champion walk. Dest outside the
 * ring / 0 leftover MP / summon-control cannot. Same `reachable.has`
 * gate as canvas.
 */
export function canExecutePlayerWalkHoverRingDest(
  args: PlayerWalkHoverRingDestArgs,
): boolean {
  if (!shouldHighlightPlayerWalkHoverRingDest(args)) return false;
  return canAffordBattleWalk(
    args.playerMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

export function playerWalkHoverRingHighlightedIsExecutable(args: {
  highlighted: boolean;
  executable: boolean;
}): boolean {
  return args.highlighted === true && args.executable === true;
}

export type PlayerWalkHoverRingPaint = {
  show: boolean;
  mpCost: number;
};

function hoverRingMpCost(args: {
  origin: PlayerWalkHoverRingCell;
  dest: PlayerWalkHoverRingCell;
  pathLength?: number;
  costPerTile?: number;
}): number {
  const per = Math.max(1, Math.floor(Number(args.costPerTile) || 1));
  const tiles =
    args.pathLength !== undefined
      ? Math.max(0, Math.floor(Number(args.pathLength) || 0))
      : playerWalkHoverRingManhattan(args.origin, args.dest);
  return tiles * per;
}

/** Live leftover paint: floor + Manhattan > 0, even outside the ring. */
export function livePlayerWalkHoverRingPaint(args: {
  destIsFloor: boolean;
  origin: PlayerWalkHoverRingCell;
  dest: PlayerWalkHoverRingCell;
  pathLength?: number;
  costPerTile?: number;
}): PlayerWalkHoverRingPaint {
  return {
    show: livePlayerWalkHoverRingShowsLabel(args),
    mpCost: hoverRingMpCost(args),
  };
}

/** Intended paint: hide dests RAF did not paint in the MP ring. */
export function playerWalkHoverRingPaint(
  args: PlayerWalkHoverRingDestArgs,
): PlayerWalkHoverRingPaint {
  return {
    show: playerWalkHoverRingShowsLabel(args),
    mpCost: hoverRingMpCost(args),
  };
}
