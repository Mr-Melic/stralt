/**
 * RAF champion walk hover still pulses dests outside the painted MP ring.
 *
 * Live WorldExploration glow (~7616–7657):
 *   if (isHovered && tileType === "floor") {
 *     isMpHover = inBattle && battleActionMode === "walk"
 *     // green walk-MP pulse — no `getMpReachableTiles`, no `mpTiles.has`
 *   }
 *
 * RAF already paints the green ring from `getMpReachableTiles` (origin =
 * `getActiveCasterPos`, which is the player tile when no summon is
 * controlled; budget = leftover `currentBattleMp`). Canvas execute
 * already refuses dests that fail `reachable.has` then
 * `classifyWalkReject`. `#1344` is the champion walk **label** on the
 * same dests (hover cost at ~8513–8553 still keys off floor + Manhattan
 * > 0). This leftover is the walk-mode **glow color** on those dests.
 *
 * `#1334` is summon-control label membership. `#1324` is hover origin +
 * wallet during control. `#417` is BFS dest cost vs Manhattan around the
 * same origin. `#701` is occupied dest. `#1322` is Walk button enable.
 * `#1330` is reject canvas float. `#1340` is kit-cast reject float.
 *
 * Unique fire: player at (8,8), leftover MP 3, dest (12,8) path 4. Live
 * leftover still pulses the walk-MP glow (hovered floor + walk mode).
 * Dest is not in the 3-MP ring and cannot execute. Inverse: empty
 * neighbour (9,8) is in the ring, keeps the glow, and executes at 1
 * player MP.
 *
 * `PLAYER_BASE_MP` is 4. Unique fire uses leftover 3 (WX `useState(3)` /
 * after a 1-tile walk of a 4-MP champion). A 4-tile walk cannot. Do not
 * rebalance `PLAYER_BASE_MP`.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / targeting / spellEngine / battleWalkMp /
 * `#417` / `#701` / `#1322` / `#1324` / `#1330` / `#1334` / `#1340` /
 * `#1344`. Restack glow onto `playerWalkHoverGlowShows` after older
 * combat PRs land (`isMpHover && mpTiles.has`).
 */

import { canAffordBattleWalk } from "./battleWalkMp.ts";

export type PlayerWalkHoverGlowCell = { x: number; y: number };

/** Cardinal Manhattan the live hover label still measures from the player. */
export function playerWalkHoverGlowManhattan(
  origin: PlayerWalkHoverGlowCell,
  dest: PlayerWalkHoverGlowCell,
): number {
  return Math.abs(dest.x - origin.x) + Math.abs(dest.y - origin.y);
}

/**
 * Live leftover: dest-is-floor while Walk is selected in battle. Ignores
 * whether RAF painted the dest in the MP ring. Own tile still pulses.
 */
export function livePlayerWalkHoverGlowShows(args: {
  inBattle: boolean;
  battleActionMode: string;
  destIsFloor: boolean;
}): boolean {
  if (args.inBattle !== true) return false;
  if (args.battleActionMode !== "walk") return false;
  return args.destIsFloor === true;
}

/**
 * Intended: dest must also be in the painted MP ring. Origin/wallet stay
 * the player leftover (`#1324` is summon-control). Spell-hover purple
 * and overworld generic glow stay other leftovers.
 */
export function playerWalkHoverGlowShows(args: {
  inBattle: boolean;
  battleActionMode: string;
  destIsFloor: boolean;
  destInMpRing: boolean;
}): boolean {
  if (args.destInMpRing !== true) return false;
  return livePlayerWalkHoverGlowShows(args);
}

export type PlayerWalkHoverGlowDestArgs = {
  inBattle: boolean;
  battleActionMode: string;
  isSummonControlled: boolean;
  destIsFloor: boolean;
  destInMpRing: boolean;
  origin: PlayerWalkHoverGlowCell;
  dest: PlayerWalkHoverGlowCell;
  playerMp: number;
  pathLength: number;
  costPerTile?: number;
};

/**
 * Champion walk-MP glow membership for this leftover. Dest is in the
 * player MP ring RAF already BFS-es. Occupancy stays `#701`. Summon-
 * control ring stays `#1334`. Label membership stays `#1344`.
 */
export function shouldApplyPlayerWalkHoverGlow(
  args: Pick<
    PlayerWalkHoverGlowDestArgs,
    | "inBattle"
    | "battleActionMode"
    | "isSummonControlled"
    | "destIsFloor"
    | "destInMpRing"
    | "playerMp"
    | "pathLength"
    | "costPerTile"
  >,
): boolean {
  if (args.isSummonControlled === true) return false;
  if (!playerWalkHoverGlowShows(args)) return false;
  return canAffordBattleWalk(
    args.playerMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

/**
 * Execute the glowing MP dest as a champion walk. Dest outside the ring
 * / 0 leftover MP / summon-control cannot. Same `reachable.has` gate as
 * canvas.
 */
export function canExecutePlayerWalkHoverGlowDest(
  args: PlayerWalkHoverGlowDestArgs,
): boolean {
  if (!shouldApplyPlayerWalkHoverGlow(args)) return false;
  return canAffordBattleWalk(
    args.playerMp,
    args.pathLength,
    args.costPerTile ?? 1,
  );
}

export function playerWalkHoverGlowHighlightedIsExecutable(args: {
  glowing: boolean;
  executable: boolean;
}): boolean {
  return args.glowing === true && args.executable === true;
}

/** Live leftover walk-MP pulse RGB (WX `isMpHover` branch). */
export const LIVE_PLAYER_WALK_HOVER_GLOW_RGB = {
  r: 0,
  g: 255,
  b: 100,
} as const;
