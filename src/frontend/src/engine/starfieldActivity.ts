/**
 * Pause the root starfield RAF while the world canvas is mounted.
 * The game canvas fills opaque `#0a0c18`, so the starfield is invisible
 * during play but still burned a full 2D RAF + shadowBlur pass.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let paused = false;

export function setStarfieldPaused(next: boolean): void {
  if (paused === next) return;
  paused = next;
  for (const listener of listeners) listener();
}

export function isStarfieldPaused(): boolean {
  return paused;
}

export function subscribeStarfieldPaused(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * What the root starfield should do this frame / on a visibility or pause flip.
 * `pause_release_gpu`: world canvas covers the starfield — drop the backing
 * store and star list so a mobile rotate during play does not allocate ~250
 * stars or a second full-size 2D buffer (PERF-2026-09-02-049).
 * `pause_keep_buffer`: tab is hidden on landing/select — stop RAF but keep
 * the star list so resume is a single frame, not a createStars hitch.
 */
export type StarfieldLoopPlan =
  | "run"
  | "pause_keep_buffer"
  | "pause_release_gpu";

export function planStarfieldLoop(input: {
  worldPaused: boolean;
  documentHidden: boolean;
}): StarfieldLoopPlan {
  if (input.worldPaused) return "pause_release_gpu";
  if (input.documentHidden) return "pause_keep_buffer";
  return "run";
}

/** Floor CSS pixels before comparing to canvas backing-store integers. */
export function starfieldBackingSize(
  nextWidth: number,
  nextHeight: number,
): { width: number; height: number } {
  return {
    width: Math.max(0, Math.floor(Number(nextWidth) || 0)),
    height: Math.max(0, Math.floor(Number(nextHeight) || 0)),
  };
}

/**
 * Assigning `canvas.width`/`height` clears the 2D buffer. Duplicate
 * window.resize + ResizeObserver callbacks on landing/select must not
 * wipe a just-drawn frame when the integer size did not change.
 */
export function shouldAssignStarfieldBacking(
  canvasWidth: number,
  canvasHeight: number,
  nextWidth: number,
  nextHeight: number,
): boolean {
  const next = starfieldBackingSize(nextWidth, nextHeight);
  return canvasWidth !== next.width || canvasHeight !== next.height;
}

/**
 * Landing / character-select used to `createStars()` (~250+ objects plus
 * milky-way clusters) on every window resize. Mobile URL-bar chrome fires
 * that often while Starfield + BloodParticles already run. After PERF-049
 * GPU release the list is empty / backing is 1×1 — those still rebuild.
 * A real size change rescales existing star positions instead.
 */
export function shouldRebuildStarfieldStars(input: {
  prevWidth: number;
  prevHeight: number;
  nextWidth: number;
  nextHeight: number;
  starCount: number;
}): boolean {
  if (input.starCount <= 0) return true;
  if (input.prevWidth <= 1 || input.prevHeight <= 1) return true;
  const next = starfieldBackingSize(input.nextWidth, input.nextHeight);
  if (next.width <= 1 || next.height <= 1) return true;
  return false;
}

export function starfieldPositionScale(
  prevWidth: number,
  prevHeight: number,
  nextWidth: number,
  nextHeight: number,
): { sx: number; sy: number } {
  const pw = prevWidth > 0 ? prevWidth : 1;
  const ph = prevHeight > 0 ? prevHeight : 1;
  const next = starfieldBackingSize(nextWidth, nextHeight);
  const nw = next.width > 0 ? next.width : 1;
  const nh = next.height > 0 ? next.height : 1;
  return { sx: nw / pw, sy: nh / ph };
}
