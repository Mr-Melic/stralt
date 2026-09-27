/**
 * Resource-cost vs highlight vs execute for player combat actions.
 *
 * Geometry highlight (`computeTargetableTiles` / `isTileCastableLive`) is
 * the live-ok set. AP + cooldown live in `planPlayerCastResources` and run
 * first inside `planPlayerCastAttempt` / `executeCastAttempt`. The blue
 * ring used to keep painting — and Attack Nearest used to call
 * `markFirstAction` — even when that resource gate would refuse the
 * click (Inferno leftover AP + CD, 0-AP Strike).
 *
 * Mouse tile, sprite, touch, and keyboard S share this predicate: a
 * painted tile is executable only when live geometry AND the wallet
 * agree. Illegal (LoS / range / CD / missing AP) cannot execute.
 *
 * Unique vs queued #340 (picker / 0-AP *selection*), #389 (Timestep spent
 * on the live gate), #701 (walk dest occupancy). WorldExploration /
 * targeting.ts / playerCastPlan.ts left untouched so those PRs stay
 * merge-clean. Do not change AP costs, CD lengths, or damage math.
 */

import type { PlayerCastResourceDecision } from "./playerCastPlan.ts";
import { planPlayerCastResources } from "./playerCastPlan.ts";
import {
  type TileCastClickDecision,
  type TileCastableResult,
  shouldExecuteLiveCast,
} from "./targeting.ts";

export type PlayerCastHighlightKey = string;

export function playerCastHighlightResourcesOk(
  resources: PlayerCastResourceDecision,
): boolean {
  return resources.ok === true;
}

/**
 * Blue-ring membership after the same AP + cooldown gate execute uses.
 * On cooldown / missing AP the executable set is empty so a leftover
 * selection cannot look legal.
 */
export function filterExecutableHighlightKeys(
  highlighted: ReadonlySet<PlayerCastHighlightKey>,
  resources: PlayerCastResourceDecision,
): Set<PlayerCastHighlightKey> {
  if (!playerCastHighlightResourcesOk(resources)) return new Set();
  return new Set(highlighted);
}

export function shouldPaintSpellRangeHighlight(
  resources: PlayerCastResourceDecision,
): boolean {
  return playerCastHighlightResourcesOk(resources);
}

/**
 * Highlighted + live-ok + affordable. The three layers the auditor
 * compares: UI preview, execution validation, resource cost.
 */
export function highlightedCastIsExecutable(args: {
  highlighted: boolean;
  live: TileCastableResult;
  resources: PlayerCastResourceDecision;
}): boolean {
  return (
    args.highlighted &&
    shouldExecuteLiveCast(args.live) &&
    playerCastHighlightResourcesOk(args.resources)
  );
}

/**
 * Tile/sprite/touch used to return `execute` from geometry alone.
 * Overlay the wallet so a CD / no-AP click cannot proceed.
 */
export function decideTileCastClickWithResources(args: {
  click: TileCastClickDecision;
  resources: PlayerCastResourceDecision;
}): TileCastClickDecision {
  if (args.click.action !== "execute") return args.click;
  if (args.resources.ok) return args.click;
  return { action: "reject", reason: args.resources.reason };
}

export type AttackNearestFirstActionArgs = {
  resourceOk: boolean;
  hasTarget: boolean;
  spentAp: boolean;
};

/**
 * `executeCastAttempt` marks first action only after AP is spent.
 * Attack Nearest / keyboard S used to mark on entry, so a CD or
 * no-target click dismissed an unaccepted challenge without a cast.
 */
export function attackNearestMarksFirstAction(
  args: AttackNearestFirstActionArgs,
): boolean {
  return (
    args.resourceOk === true && args.hasTarget === true && args.spentAp === true
  );
}

export function planHighlightResources(args: {
  currentAp: number;
  baseApCost: number;
  cooldownTurnsRemaining: unknown;
  applyApCost?: (base: number) => number;
}): PlayerCastResourceDecision {
  return planPlayerCastResources(args);
}
