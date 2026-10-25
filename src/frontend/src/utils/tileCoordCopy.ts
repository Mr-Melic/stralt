/**
 * Side-panel tile coordinate chrome. Display only — not wired into
 * WorldExploration.tsx (forbidden while older open PRs own that file).
 *
 * UX-TILE-COORD-HUD: the stats panel prints raw `(x, y)` with a pin emoji
 * and no word “Tile”, so it reads as engineer debug rather than a map
 * position the player can act on.
 */

/** Side-panel coordinate line. */
export function tileCoordLabel(x: number, y: number): string {
  return `Tile (${x}, ${y})`;
}
