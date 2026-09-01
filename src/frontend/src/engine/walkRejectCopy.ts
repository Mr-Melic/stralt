// walkRejectCopy.ts — Player-facing labels for silent battle-walk rejects.
// Presentation only. Does not change findPath, MP math, or MOVEMENT_DURATION.

export type WalkRejectKind =
  | "no_mp"
  | "blocked"
  | "cant_reach"
  | "not_enough_mp";

const WALK_REJECT_COPY: Record<WalkRejectKind, string> = {
  no_mp: "No MP",
  blocked: "Can't walk there",
  cant_reach: "Can't reach",
  not_enough_mp: "Not enough MP",
};

export function playerFacingWalkReject(kind: WalkRejectKind): string {
  return WALK_REJECT_COPY[kind];
}

export interface WalkRejectFloatSink {
  spawnFloatText(x: number, y: number, text: string, color?: string): void;
}

/** Float walk-reject copy at a screen point. No-ops if effects are missing. */
export function spawnWalkRejectFloat(
  em: WalkRejectFloatSink | null | undefined,
  screen: { x: number; y: number },
  kind: WalkRejectKind,
): void {
  if (!em) return;
  em.spawnFloatText(screen.x, screen.y, playerFacingWalkReject(kind));
}
