/**
 * Decorative CSS animations (landing chessDrift) keep compositing after
 * canvas RAFs already stop on a hidden tab. Distinct from
 * shouldRunDecorativeCanvasLoop (logo / blood-drip RAF) and from the world
 * game loop.
 */

export type DecorativeCssPlayState = "paused" | "running";

export function decorativeCssPlayState(
  documentHidden: boolean,
): DecorativeCssPlayState {
  return documentHidden ? "paused" : "running";
}

export function applyDecorativeCssPlayState(
  el: { style: { animationPlayState: string } } | null,
  documentHidden: boolean,
): void {
  if (!el) return;
  el.style.animationPlayState = decorativeCssPlayState(documentHidden);
}
