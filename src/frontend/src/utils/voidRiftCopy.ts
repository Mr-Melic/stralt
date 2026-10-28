/**
 * Void Rift warp chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-VOID-RIFT-COORD: each player turn logs
 * `Void Rift warps tile (${pick.x},${pick.y})! Avoid it!`. Distinct from
 * UX-BARRIER-COORD-LOG (fade of a `"x,y"` key) and UX-TILE-COORD-HUD
 * (side-panel pin). Do not change the random walkable pick.
 */

export const VOID_RIFT_WARP_LOG =
  "Void Rift shifts — a new tile is unsafe. Stay off the dark square.";
