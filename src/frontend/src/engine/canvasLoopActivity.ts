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

/**
 * Hidden decorative canvases drop the backing store (BloodParticles
 * PERF-2026-09-22-074). Distinct from Starfield's tab-hidden
 * pause_keep_buffer — drips are cheap to respawn, and CharacterSelection
 * can mount one instance per filled slot.
 */
export function shouldReleaseDecorativeCanvasBuffer(
  documentHidden: boolean,
): boolean {
  return documentHidden;
}
