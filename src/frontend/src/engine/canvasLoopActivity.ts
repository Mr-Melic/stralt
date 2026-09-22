/**
 * Decorative canvas loops (landing logo, character-select blood drips)
 * must not keep paying 2D work while the tab is hidden. Distinct from
 * the world game RAF, which has its own watchdog and must not change
 * combat timing.
 */

export function shouldRunDecorativeCanvasLoop(
  documentHidden: boolean,
): boolean {
  return !documentHidden;
}

/** Backing-store size while a decorative canvas is hidden (PERF-2026-09-22-074). */
export const DECORATIVE_GPU_RELEASE_SIZE = { width: 1, height: 1 } as const;

const VISIBLE_PARENT_FALLBACK_PX = 100;

/**
 * Character-select BloodParticles can mount one drip canvas per filled slot
 * under the root Starfield. Stopping RAF (PERF-059) still left those full
 * GPU buffers allocated. Shrink to 1×1 while hidden; restore parent size
 * on visible. Distinct from Starfield's world-cover release (PERF-049).
 */
export function decorativeCanvasBackingSize(
  documentHidden: boolean,
  parentWidth: number,
  parentHeight: number,
): { width: number; height: number } {
  if (documentHidden) {
    return {
      width: DECORATIVE_GPU_RELEASE_SIZE.width,
      height: DECORATIVE_GPU_RELEASE_SIZE.height,
    };
  }
  const width = Math.floor(Number(parentWidth) || 0);
  const height = Math.floor(Number(parentHeight) || 0);
  return {
    width: width > 0 ? width : VISIBLE_PARENT_FALLBACK_PX,
    height: height > 0 ? height : VISIBLE_PARENT_FALLBACK_PX,
  };
}
