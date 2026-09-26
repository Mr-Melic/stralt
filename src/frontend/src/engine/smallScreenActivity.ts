/**
 * App.tsx keeps its own <768 guard (Continue warning), separate from
 * WorldExploration's useIsMobile (PERF-094) and isDesktop >1024 (PERF-092).
 * Mobile URL-bar chrome fires resize often; committing the same boolean
 * still ran the updater on the root tree that hosts GameFlow.
 * PERF-2026-09-26-115.
 */

export const SMALL_SCREEN_BREAKPOINT_PX = 768;

export function isSmallScreenViewport(
  width: number,
  breakpoint: number = SMALL_SCREEN_BREAKPOINT_PX,
): boolean {
  return width < breakpoint;
}

/** True when the next width would change the stored small-screen flag. */
export function shouldCommitIsSmallScreen(
  prev: boolean,
  width: number,
  breakpoint: number = SMALL_SCREEN_BREAKPOINT_PX,
): boolean {
  return prev !== isSmallScreenViewport(width, breakpoint);
}
