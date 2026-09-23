/**
 * Viewport breakpoint helpers for layout hooks.
 * WorldExploration and leftover shadcn sidebar both call useIsMobile.
 * Resize (including mobile URL-bar chrome) must not setState when the
 * boolean is unchanged — that re-rendered the ~19k-line world tree.
 */

export const DEFAULT_MOBILE_BREAKPOINT_PX = 768;

export function isMobileViewport(
  width: number,
  breakpoint: number = DEFAULT_MOBILE_BREAKPOINT_PX,
): boolean {
  return width < breakpoint;
}

/** True when the next width would change the stored mobile flag. */
export function shouldCommitIsMobile(
  prev: boolean,
  width: number,
  breakpoint: number = DEFAULT_MOBILE_BREAKPOINT_PX,
): boolean {
  return prev !== isMobileViewport(width, breakpoint);
}
