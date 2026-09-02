// walkRejectCopy.ts — Player-facing labels for battle-walk rejects.
// Cast rejects already float via rejectCopy.ts. Walk no-MP / wall / out-of-
// reach / over-budget clicks returned with no canvas reason.

export type WalkRejectReason =
  | "no_mp"
  | "blocked"
  | "unreachable"
  | "not_enough_mp";

export function playerFacingWalkReject(reason: WalkRejectReason): string {
  switch (reason) {
    case "no_mp":
      return "No MP";
    case "not_enough_mp":
      return "Not enough MP";
    case "blocked":
    case "unreachable":
      return "Can't reach";
    default:
      return "Can't reach";
  }
}

/**
 * World-mode click: empty `findPath` only auto-steps Chebyshev-adjacent
 * floor. Distant empty paths used to gold-tint with no reason. Self-tile
 * stays quiet (gold is enough). Does not change pathfinding.
 */
export function shouldFloatWorldUnreachable(
  pathLength: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
): boolean {
  if (pathLength > 0) return false;
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dx + dy === 0) return false;
  return !(dx <= 1 && dy <= 1);
}

export function classifyWalkReject(input: {
  currentMp: number;
  isBlocked: boolean;
  reachable: boolean;
  pathLength: number;
}): WalkRejectReason | null {
  const mp = Math.max(0, Math.floor(Number(input.currentMp) || 0));
  const pathLength = Math.max(0, Math.floor(Number(input.pathLength) || 0));
  if (mp <= 0) return "no_mp";
  if (input.isBlocked) return "blocked";
  if (!input.reachable || pathLength === 0) return "unreachable";
  if (pathLength > mp) return "not_enough_mp";
  return null;
}

export interface WalkRejectFloatSink {
  spawnFloatText(x: number, y: number, text: string, color?: string): void;
}

/** Float walk-reject copy at a screen point. No-ops if effects are missing. */
export function spawnWalkRejectFloat(
  em: WalkRejectFloatSink | null | undefined,
  screen: { x: number; y: number },
  kind: WalkRejectReason,
): void {
  if (!em) return;
  em.spawnFloatText(screen.x, screen.y, playerFacingWalkReject(kind));
}
