/**
 * Summon-control kit-cast rejects still log only.
 *
 * Live WorldExploration `castControlledSummonSpell` (~9843–9845):
 *   planSummonControlCast → if (!plan.ok)
 *     logBattleEntry(summonControlCastFailMessage(plan.reason))
 *     return
 *   no spawnFloatText / playerFacingRejectReason / playerFacingCastResult
 *
 * Mouse (~10075) and touch (~10774) only reach that callback when
 * pickSummonControlClickTarget already found a hostile (or self/ally)
 * occupant. Empty dests stay silent — that miss is kit dest occupancy
 * (`#1280` / `#1263`), not this leftover.
 *
 * Champion sprite-first (~10169–10175, touch ~10866) already
 * spawnFloatText(playerFacingRejectReason) on reject_live. Champion
 * no-AP uses playerFacingCastResult("no_ap") = "Not enough AP", the
 * same copy as summonControlCastFailMessage("no_ap").
 *
 * `#1330` is walk Can't reach / Not enough MP (kitSpellSelected false).
 * `#1334` is walk hover ring labels. `#1324` is hover origin/wallet.
 * `#1322` is Walk button enable. `#1301` is Walk cancel. `#1315` is
 * Attack toggle. `#1280` is kit dest occupancy. This leftover is canvas
 * IMPACT on a kit dest that already resolved an occupant — same copy as
 * the battle log, at tileCenter.
 *
 * Unique fire: controlling archer at (8,8) catalog AP 2, Poison Arrow
 * selected (range 4, cost 2), hostile occupant at (13,8) Chebyshev 5.
 * Live logs "Out of range" and paints nothing. Champion sprite reject
 * of the same dest floats "Out of range". Inverse: AP 1 vs cost 2 at
 * in-range (10,8) logs "Not enough AP", still no float. Legal AP 2 /
 * Chebyshev 2 still executes. Walk dests (no kit) stay `#1330`.
 *
 * Do not restack WorldExploration / BattleUIPanel / SummonControlPanel /
 * summonControlCast / rejectCopy / `#1330` / `#1334` / `#1324` / `#1280`.
 * Restack kit-cast rejects onto
 * `intendedSummonControlCastRejectFeedback` after older combat PRs land.
 */

import {
  type SummonControlCastFail,
  summonControlCastFailMessage,
} from "../utils/summonControlCast.ts";

export type CastCell = { x: number; y: number };

export type SummonControlCastRejectArgs = {
  inBattle: boolean;
  isSummonControlled: boolean;
  kitSpellSelected: boolean;
  hasResolvedTarget: boolean;
  failReason: SummonControlCastFail | null;
};

export type CastRejectFeedback =
  | { channel: "none" }
  | { channel: "log"; text: string }
  | { channel: "float"; text: string };

export interface CastRejectFloatSink {
  spawnFloatText(x: number, y: number, text: string, color?: string): void;
}

function isSummonControlKitCastClick(args: {
  inBattle: boolean;
  isSummonControlled: boolean;
  kitSpellSelected: boolean;
}): boolean {
  return (
    args.inBattle === true &&
    args.isSummonControlled === true &&
    args.kitSpellSelected === true
  );
}

/**
 * Live leftover: log-only when the router already resolved a target and
 * planSummonControlCast failed. Empty dests never enter the callback.
 */
export function liveSummonControlCastRejectFeedback(
  args: SummonControlCastRejectArgs,
): CastRejectFeedback {
  if (!isSummonControlKitCastClick(args)) return { channel: "none" };
  if (args.hasResolvedTarget !== true) return { channel: "none" };
  if (args.failReason == null) return { channel: "none" };
  return {
    channel: "log",
    text: summonControlCastFailMessage(args.failReason),
  };
}

export function classifySummonControlCastReject(
  args: SummonControlCastRejectArgs,
): SummonControlCastFail | null {
  if (!isSummonControlKitCastClick(args)) return null;
  if (args.hasResolvedTarget !== true) return null;
  return args.failReason;
}

/**
 * Intended: same canvas float as champion sprite reject, copy = live log.
 */
export function intendedSummonControlCastRejectFeedback(
  args: SummonControlCastRejectArgs,
): CastRejectFeedback {
  const reason = classifySummonControlCastReject(args);
  if (!reason) return { channel: "none" };
  return { channel: "float", text: summonControlCastFailMessage(reason) };
}

export function shouldSpawnSummonControlCastRejectFloat(
  args: SummonControlCastRejectArgs,
): boolean {
  return intendedSummonControlCastRejectFeedback(args).channel === "float";
}

export function liveSummonControlCastRejectIsCanvasSilent(
  args: SummonControlCastRejectArgs,
): boolean {
  return liveSummonControlCastRejectFeedback(args).channel !== "float";
}

export function spawnSummonControlCastRejectFloat(
  em: CastRejectFloatSink | null | undefined,
  screen: CastCell,
  args: SummonControlCastRejectArgs,
): void {
  const intended = intendedSummonControlCastRejectFeedback(args);
  if (intended.channel !== "float" || !em) return;
  em.spawnFloatText(screen.x, screen.y, intended.text);
}
