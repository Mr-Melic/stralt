/**
 * Pause infinite class-based CSS animations while the tab is hidden.
 *
 * Distinct from:
 * - PERF-121 (landing chessDrift inline styles)
 * - PERF-097 / PERF-122 (those change visible combat chrome)
 * - canvasLoopActivity / starfieldActivity (2D RAF, not CSS)
 *
 * One-shot banners (popIn, fadeOut, boss/jackpot) are not listed here so they
 * can finish while the player is away instead of resuming mid-flight on return.
 */

export function shouldPauseHiddenTabCss(documentHidden: boolean): boolean {
  return documentHidden;
}

export const HIDDEN_TAB_CSS_ATTR = "pbvHidden";

export function applyHiddenTabCssPause(
  hidden: boolean,
  root: HTMLElement,
): void {
  if (shouldPauseHiddenTabCss(hidden)) {
    root.dataset[HIDDEN_TAB_CSS_ATTR] = "1";
    return;
  }
  delete root.dataset[HIDDEN_TAB_CSS_ATTR];
}

export function wireHiddenTabCssPause(doc: Document): () => void {
  const sync = (): void => {
    applyHiddenTabCssPause(doc.hidden, doc.documentElement);
  };
  sync();
  doc.addEventListener("visibilitychange", sync);
  return () => {
    doc.removeEventListener("visibilitychange", sync);
  };
}
