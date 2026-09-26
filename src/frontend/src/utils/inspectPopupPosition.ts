/**
 * Inspect card placement. Sprite-hit inspect often has no chip rect, so a
 * null anchor must still land on-screen (not 0,0 under the HUD / notch).
 * Display only — does not change cast or walk legality.
 */

export type InspectPopupAnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function clampInspectPopupPosition(opts: {
  anchorRect: InspectPopupAnchorRect | null | undefined;
  popupWidth: number;
  popupHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  margin?: number;
  safeLeft?: number;
  safeTop?: number;
  safeRight?: number;
  safeBottom?: number;
}): { left: number; top: number } {
  const margin = Math.max(0, Number(opts.margin) || 0);
  const padL = Math.max(margin, Math.max(0, Number(opts.safeLeft) || 0));
  const padT = Math.max(margin, Math.max(0, Number(opts.safeTop) || 0));
  const padR = Math.max(margin, Math.max(0, Number(opts.safeRight) || 0));
  const padB = Math.max(margin, Math.max(0, Number(opts.safeBottom) || 0));
  const vw = Math.max(0, Number(opts.viewportWidth) || 0);
  const vh = Math.max(0, Number(opts.viewportHeight) || 0);
  const pw = Math.max(0, Number(opts.popupWidth) || 0);
  const ph = Math.max(0, Number(opts.popupHeight) || 0);
  const maxLeft = Math.max(padL, vw - pw - padR);
  const maxTop = Math.max(padT, vh - ph - padB);

  let left: number;
  let top: number;
  const anchor = opts.anchorRect;
  if (anchor) {
    left = anchor.left + anchor.width / 2 - pw / 2;
    top = anchor.top - ph - 10;
  } else {
    left = (vw - pw) / 2;
    top = (vh - ph) / 2;
  }
  return {
    left: Math.min(Math.max(left, padL), maxLeft),
    top: Math.min(Math.max(top, padT), maxTop),
  };
}
