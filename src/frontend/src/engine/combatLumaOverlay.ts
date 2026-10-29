/**
 * engine/combatLumaOverlay.ts
 *
 * Per-row sine-wave brightness overlay used by WorldExploration's RAF
 * floor pass. Complementary to `tilePaint` (base slabs), `mapHazardPaint`
 * (lava/ice/spikes), `combatTileOverlay` (hover / MP / spell range), and
 * `shadeFloorOcclusion` (AO edge fade). Those are different owners.
 *
 * Named `combatLumaOverlay` so Biome organizeImports sits after
 * `combatJuice` / before `combatMath` — unique vs `combatTileOverlay`
 * (after `combatMath`), `rowShimmerOverlay` / `shadeFloorOcclusion`
 * (`rewardFeel` → `spawnPolicy`, occupied by #436 / #1241), and
 * `worldRowShimmer` (after `worldHelpers`, occupied by #683).
 *
 * WorldExploration still owns:
 *   - the painter's per-row loop (`y` is the iso row)
 *   - the RAF `now` clock (passed in so the overlay matches hazard lava)
 *   - floor vs wall / void skip (`tileType !== "wall"`)
 *   - iso screen anchor (`gridToScreen`)
 *
 * Live formula is `max(0, sin(now*0.0008 + y*0.3) * 0.03)`. Negative
 * half-waves stay dark — do not `Math.abs` them. Fill is white
 * `rgba(255,255,255,alpha)` with no stroke and no clip. Diamond verts
 * stay unrounded (top → right → bottom → left).
 *
 * Inject `nowMs` in tests; the live caller passes the render-loop `now`.
 *
 * React-free. No gameplay / occupancy / LoS / MP-budget changes.
 */

export const ROW_SHIMMER_RATE = 0.0008;
export const ROW_SHIMMER_ROW_PHASE = 0.3;
export const ROW_SHIMMER_AMPLITUDE = 0.03;
export const ROW_SHIMMER_RGB = "255,255,255";

/**
 * Live `Math.max(0, Math.sin(now * 0.0008 + y * 0.3) * 0.03)`.
 * Computed once per iso row; every floor tile in that row shares it.
 */
export function rowShimmerAlpha(nowMs: number, rowY: number): number {
  return Math.max(
    0,
    Math.sin(nowMs * ROW_SHIMMER_RATE + rowY * ROW_SHIMMER_ROW_PHASE) *
      ROW_SHIMMER_AMPLITUDE,
  );
}

/** Live `if (shimmerAlpha > 0)`. Zero (and the clamped negative half) skip. */
export function shouldPaintRowShimmer(alpha: number): boolean {
  return alpha > 0;
}

export function rowShimmerFillRgba(alpha: number): string {
  return `rgba(${ROW_SHIMMER_RGB},${alpha})`;
}

function traceRowShimmerDiamond(
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

/**
 * White brightness wash on a floor diamond. Caller already decided the
 * cell is a non-void, non-wall tile and computed this row's alpha.
 * No-ops when `alpha <= 0`.
 */
export function drawRowShimmerOverlay(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
  alpha: number,
): void {
  if (!shouldPaintRowShimmer(alpha)) return;
  ctx.save();
  traceRowShimmerDiamond(ctx, screenX, screenY, tw, th);
  ctx.fillStyle = rowShimmerFillRgba(alpha);
  ctx.fill();
  ctx.restore();
}
