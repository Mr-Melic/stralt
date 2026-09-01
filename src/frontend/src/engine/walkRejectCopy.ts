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
