/**
 * engine/shadeFloorOcclusion.ts
 *
 * Per-tile ambient-occlusion **gradient paint** used by WorldExploration's
 * RAF floor pass. Complementary to `ambientOcclusion.ts` (mask *build*).
 *
 * Do **not** fold this into `tilePaint` (base slabs), `mapHazardPaint`
 * (lava/ice/spikes), `combatTileOverlay` (hover / MP / spell range),
 * `barrierRender`, or the AO bitmask builder. Those are different owners.
 *
 * WorldExploration still owns:
 *   - `aoMaskRef` / `aoMapIdRef` (rebuild when map id changes)
 *   - dust-mote seeding that shares that map-id gate
 *   - mask index `y * WORLD_GRID_SIZE + x`
 *   - iso screen anchor (`gridToScreen`)
 *   - the floor vs wall / void skip
 *
 * Live draw only shades bits 4 (grid-right wall) and 8 (grid-left wall).
 * Bits 1 and 2 are still *written* by the mask builder — do not start
 * shading them here. Reach is **8px along X**, Y stays at mid-diamond
 * (`screenY + th/2`); do not isometric-tilt the gradient.
 *
 * Inner stop `rgba(0,0,0,0.22)` / outer `rgba(0,0,0,0)` are the live
 * values — do not "improve" them. Right and left are independent `if`s
 * (both can paint on the same tile).
 *
 * React-free. No gameplay / occupancy / LoS / MP-budget changes.
 */

export const SHADE_AO_BIT_TOP_RIGHT = 1;
export const SHADE_AO_BIT_TOP_LEFT = 2;
/** Grid-right wall. Same value the mask builder writes (`bits |= 4`). */
export const SHADE_AO_BIT_RIGHT = 4;
/** Grid-left wall. Same value the mask builder writes (`bits |= 8`). */
export const SHADE_AO_BIT_LEFT = 8;

export const AO_SHADE_INNER = "rgba(0,0,0,0.22)";
export const AO_SHADE_OUTER = "rgba(0,0,0,0)";
export const AO_SHADE_REACH_PX = 8;

export type AoLinearGradient = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

/** Live `if (bits & 4)`. Bits 1/2 must stay false. */
export function shouldShadeAoRight(bits: number): boolean {
  return (bits & SHADE_AO_BIT_RIGHT) !== 0;
}

/** Live `if (bits & 8)`. Bits 1/2 must stay false. */
export function shouldShadeAoLeft(bits: number): boolean {
  return (bits & SHADE_AO_BIT_LEFT) !== 0;
}

/**
 * Right-edge fade: from `(x + tw/2, midY)` inward by 8px.
 * Y is mid-diamond (`y + th/2`), not `y + tw/2`.
 */
export function aoRightGradient(
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): AoLinearGradient {
  const midY = screenY + th / 2;
  const edgeX = screenX + tw / 2;
  return {
    x0: edgeX,
    y0: midY,
    x1: edgeX - AO_SHADE_REACH_PX,
    y1: midY,
  };
}

/**
 * Left-edge fade: from `(x - tw/2, midY)` inward by 8px.
 */
export function aoLeftGradient(
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): AoLinearGradient {
  const midY = screenY + th / 2;
  const edgeX = screenX - tw / 2;
  return {
    x0: edgeX,
    y0: midY,
    x1: edgeX + AO_SHADE_REACH_PX,
    y1: midY,
  };
}

function traceFloorDiamond(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): void {
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(screenX + tw / 2, screenY + th / 2);
  ctx.lineTo(screenX, screenY + th);
  ctx.lineTo(screenX - tw / 2, screenY + th / 2);
  ctx.closePath();
}

function paintAoGradient(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
  grad: AoLinearGradient,
): void {
  ctx.save();
  const g = ctx.createLinearGradient(grad.x0, grad.y0, grad.x1, grad.y1);
  g.addColorStop(0, AO_SHADE_INNER);
  g.addColorStop(1, AO_SHADE_OUTER);
  traceFloorDiamond(ctx, screenX, screenY, tw, th);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

/**
 * Shade a floor diamond from neighboring walls. Caller already decided
 * the cell is a non-void floor and looked up `aoMask[y * size + x]`.
 * No-ops when bits are 0 or only unused 1/2.
 */
export function drawFloorOcclusionShade(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
  bits: number,
): void {
  if (shouldShadeAoRight(bits)) {
    paintAoGradient(
      ctx,
      screenX,
      screenY,
      tw,
      th,
      aoRightGradient(screenX, screenY, tw, th),
    );
  }
  if (shouldShadeAoLeft(bits)) {
    paintAoGradient(
      ctx,
      screenX,
      screenY,
      tw,
      th,
      aoLeftGradient(screenX, screenY, tw, th),
    );
  }
}
