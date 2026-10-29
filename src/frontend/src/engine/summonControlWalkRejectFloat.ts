/**
 * Summon-control walk rejects still log only.
 *
 * Live WorldExploration mouse (~10079–10102) and touch (~10778–10801):
 *   findPath from the summon tile
 *   path.length > 0 && dest not in getMpReachableTiles → logBattleEntry("Can't reach")
 *   dest in the ring && !canAffordBattleWalk(summon.currentMp) → logBattleEntry("Not enough MP")
 *   empty path → silent (no log, no float)
 *   no spawnFloatText / playerFacingWalkReject / spawnWalkRejectFloat
 *
 * Player battle-walk (~10535–10548, touch ~11129) already
 * classifyWalkReject + spawnFloatText(playerFacingWalkReject).
 * RAF highlight already origins at getActiveCasterPos + battleWalkMpBudget.
 * Canvas execute already charges summon.currentMp.
 *
 * `#1324` is hover origin/wallet. `#1322` is Walk button enable.
 * `#1301` is Walk cancel kit. `#417` is hover BFS dest cost.
 * `#701` is occupied dest. This leftover is canvas IMPACT on a rejected
 * summon dest — same copy as champion walk, at tileCenter.
 *
 * Unique fire: controlling wisp at (3,3) catalog MP 2, dest (8,3) with a
 * path but outside the MP ring. Live logs "Can't reach" and paints nothing.
 * Champion walk of the same reject floats "Can't reach". Inverse: dest in
 * the ring whose A* length 3 cannot pay catalog 2 MP — live logs
 * "Not enough MP", still no float. Empty far path stays live-silent;
 * intended floats "Can't reach" (not adjacent). Legal 1-tile neighbour
 * still executes.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * walkRejectCopy / battleWalkMp / `#1324` / `#1322` / `#1301` / `#417` /
 * `#701`. Restack summon walk rejects onto
 * `intendedSummonControlWalkRejectFeedback` after older combat PRs land.
 */

import { canAffordBattleWalk } from "./battleWalkMp.ts";
import {
  type WalkRejectFloatSink,
  type WalkRejectReason,
  classifyWalkReject,
  playerFacingWalkReject,
  shouldFloatWorldUnreachable,
  spawnWalkRejectFloat,
} from "./walkRejectCopy.ts";

export type WalkCell = { x: number; y: number };

export type SummonControlWalkRejectArgs = {
  inBattle: boolean;
  isSummonControlled: boolean;
  kitSpellSelected: boolean;
  summonMp: number;
  destInMpRing: boolean;
  pathLength: number;
  from: WalkCell;
  dest: WalkCell;
  costPerTile?: number;
  isBlocked?: boolean;
};

export type WalkRejectFeedback =
  | { channel: "none" }
  | { channel: "log"; text: string }
  | { channel: "float"; text: string };

const CANT_REACH = playerFacingWalkReject("unreachable");
const NOT_ENOUGH_MP = playerFacingWalkReject("not_enough_mp");

function isSummonControlWalkClick(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  kitSpellSelected: boolean;
}): boolean {
  return (
    args.inBattle === true &&
    args.isSummonControlled === true &&
    args.kitSpellSelected !== true
  );
}

/**
 * Live leftover: log-only when a path exists. Empty path is silent.
 * Player leftover MP is ignored — the branch never reads currentBattleMp.
 */
export function liveSummonControlWalkRejectFeedback(
  args: SummonControlWalkRejectArgs,
): WalkRejectFeedback {
  if (!isSummonControlWalkClick(args)) return { channel: "none" };
  const pathLength = Math.max(0, Math.floor(Number(args.pathLength) || 0));
  if (pathLength <= 0) return { channel: "none" };
  if (args.destInMpRing !== true) {
    return { channel: "log", text: CANT_REACH };
  }
  if (!canAffordBattleWalk(args.summonMp, pathLength, args.costPerTile ?? 1)) {
    return { channel: "log", text: NOT_ENOUGH_MP };
  }
  return { channel: "none" };
}

export function classifySummonControlWalkReject(
  args: SummonControlWalkRejectArgs,
): WalkRejectReason | null {
  if (!isSummonControlWalkClick(args)) return null;
  const pathLength = Math.max(0, Math.floor(Number(args.pathLength) || 0));
  if (pathLength <= 0) {
    if (shouldFloatWorldUnreachable(0, args.from, args.dest)) {
      return "unreachable";
    }
    return null;
  }
  return classifyWalkReject({
    currentMp: args.summonMp,
    isBlocked: args.isBlocked === true,
    reachable: args.destInMpRing === true,
    pathLength,
    costPerTile: args.costPerTile,
  });
}

/**
 * Intended: same canvas float as champion battle-walk, wallet = summon MP.
 * Empty far path floats "Can't reach"; self / Chebyshev-adjacent stay quiet.
 */
export function intendedSummonControlWalkRejectFeedback(
  args: SummonControlWalkRejectArgs,
): WalkRejectFeedback {
  const reason = classifySummonControlWalkReject(args);
  if (!reason) return { channel: "none" };
  return { channel: "float", text: playerFacingWalkReject(reason) };
}

export function shouldSpawnSummonControlWalkRejectFloat(
  args: SummonControlWalkRejectArgs,
): boolean {
  return intendedSummonControlWalkRejectFeedback(args).channel === "float";
}

export function liveSummonControlWalkRejectIsCanvasSilent(
  args: SummonControlWalkRejectArgs,
): boolean {
  return liveSummonControlWalkRejectFeedback(args).channel !== "float";
}

export function spawnSummonControlWalkRejectFloat(
  em: WalkRejectFloatSink | null | undefined,
  screen: WalkCell,
  args: SummonControlWalkRejectArgs,
): void {
  const reason = classifySummonControlWalkReject(args);
  if (!reason) return;
  spawnWalkRejectFloat(em, screen, reason);
}
