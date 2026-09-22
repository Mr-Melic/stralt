/**
 * engine/spriteHitTest.ts
 *
 * Pure sprite-first hit testing extracted from WorldExploration. The canvas
 * click and touch handlers share this picker so mouse and touch cannot fork
 * ranking; they only differ by padding (10px mouse, 14px finger).
 *
 * WorldExploration still owns spriteRectsRef: it clears and rebuilds the map
 * every render pass, then calls hitTestSprite with this-frame rects.
 *
 * Do not unify mouse and touch padding. Click-trace / geometry overlay uses
 * padding 0 on the raw rect (no finger slop).
 *
 * React-free. Callers own the per-frame map and CHARACTER_Y_OFFSET.
 */

/** Bounding box recorded per living combatant this frame. */
export interface SpriteHitRect {
  x: number;
  y: number;
  w: number;
  h: number;
  drawOrder: number;
  id: string;
  kind: string;
  logicalX: number;
  logicalY: number;
  isAlive: boolean;
  drawAnchor: { x: number; y: number };
  drawSize: { w: number; h: number };
}

/** Fields hitTestSprite actually ranks. Extra caller fields are preserved. */
export type SpriteHitTestFields = Pick<
  SpriteHitRect,
  "x" | "y" | "w" | "h" | "drawOrder" | "isAlive"
>;

/**
 * Visible-body box is taller than the isometric tile. Matches the WX
 * drawCombatant / drawPixelPattern recording sites (tileH × 1.5).
 */
export const SPRITE_HIT_BOX_HEIGHT_MULT = 1.5;

/** Player is drawn last in the depth-sorted pass; always wins overlap. */
export const PLAYER_SPRITE_DRAW_ORDER = 99999;

/** Mouse sprite-first padding (WX handleCanvasClick). */
export const SPRITE_HIT_PADDING_MOUSE = 10;

/** Touch sprite-first padding (WX handleCanvasTouch). Finger slop. */
export const SPRITE_HIT_PADDING_TOUCH = 14;

/**
 * Inclusive point-in-expanded-rect. padding 0 is the raw box (geometry
 * overlay). Mouse uses 10, touch uses 14. Inclusive edges match the WX
 * skip test (`< left` / `> right`).
 */
export function pointHitsSpriteRect(
  rect: Pick<SpriteHitRect, "x" | "y" | "w" | "h">,
  canvasX: number,
  canvasY: number,
  padding: number,
): boolean {
  return (
    canvasX >= rect.x - padding &&
    canvasX <= rect.x + rect.w + padding &&
    canvasY >= rect.y - padding &&
    canvasY <= rect.y + rect.h + padding
  );
}

/**
 * Screen-space hit box for a combatant sprite drawn at (screenX, screenY)
 * with CHARACTER_Y_OFFSET. Identical formula for player and enemy/summon.
 */
export function makeSpriteHitRect(args: {
  screenX: number;
  screenY: number;
  tileW: number;
  tileH: number;
  characterYOffset: number;
  drawOrder: number;
  id: string;
  kind: string;
  logicalX: number;
  logicalY: number;
  isAlive: boolean;
}): SpriteHitRect {
  const srW = args.tileW;
  const srH = args.tileH * SPRITE_HIT_BOX_HEIGHT_MULT;
  return {
    x: args.screenX - srW / 2,
    y: args.screenY - args.characterYOffset - srH / 2,
    w: srW,
    h: args.tileH / 2 + args.characterYOffset + srH / 2,
    drawOrder: args.drawOrder,
    id: args.id,
    kind: args.kind,
    logicalX: args.logicalX,
    logicalY: args.logicalY,
    isAlive: args.isAlive,
    drawAnchor: {
      x: args.screenX,
      y: args.screenY - args.characterYOffset,
    },
    drawSize: { w: args.tileW, h: args.tileH * SPRITE_HIT_BOX_HEIGHT_MULT },
  };
}

/**
 * Front-most living sprite whose padded rect contains (canvasX, canvasY).
 * Ranking: highest drawOrder, then lowest y (topmost on screen). Equal
 * drawOrder and y keep the first iterated entry (Map insertion order).
 * Dead rects are skipped. Empty input → null (caller falls through to
 * clientToGrid).
 */
export function hitTestSprite<T extends SpriteHitTestFields>(
  rects: Iterable<T>,
  canvasX: number,
  canvasY: number,
  padding: number,
): T | null {
  let best: T | null = null;
  for (const entry of rects) {
    if (!entry.isAlive) continue;
    if (!pointHitsSpriteRect(entry, canvasX, canvasY, padding)) continue;
    if (
      !best ||
      entry.drawOrder > best.drawOrder ||
      (entry.drawOrder === best.drawOrder && entry.y < best.y)
    ) {
      best = entry;
    }
  }
  return best;
}
