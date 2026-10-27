/**
 * engine/combatTileOverlay.ts
 *
 * Battle floor-highlight paint used by WorldExploration's RAF floor pass:
 * hover glow, green MP walk overlay, and blue spell-range overlay.
 *
 * Do **not** fold this into `tilePaint` (base slabs), `mapHazardPaint`
 * (lava/ice/spikes), `barrierRender`, `battleWalkMp` (cost math), or
 * `battleWalkReachable` (BFS). Those are different owners.
 *
 * WorldExploration still owns:
 *   - `getMpReachableTiles` / `getSpellRangeTiles`
 *   - `mpTiles` / `spellTiles` sets and hover/click flags
 *   - iso screen anchor (`gridToScreen`)
 *   - walk vs attack mode / selected-spell refs
 *   - the floor vs wall / void skip
 *
 * Colors, lineWidth 1.5, hover pulse (`0.12 + sin(now*0.003)*0.05`), and
 * hover radius `tw/2` (width, not height) are the live values — do not
 * "improve" them. Spell-hover RGB wins over MP-hover when both flags are
 * true (live ternary order).
 *
 * React-free. No gameplay / occupancy / LoS / MP-budget changes.
 */

export const WALK_TILE_FILL = "rgba(0,200,80,0.35)";
export const WALK_TILE_STROKE = "rgba(0,220,100,0.8)";
export const SPELL_RANGE_FILL = "rgba(30,100,255,0.35)";
export const SPELL_RANGE_STROKE = "rgba(60,140,255,0.85)";
export const RANGE_TILE_LINE_WIDTH = 1.5;

export const HOVER_PULSE_BASE = 0.12;
export const HOVER_PULSE_AMP = 0.05;
export const HOVER_PULSE_RATE = 0.003;
export const HOVER_GLOW_OUTER = "rgba(0,0,0,0)";

export type IsoVertex = { x: number; y: number };

export type FloorHoverRgb = { r: number; g: number; b: number };

/** Top → right → bottom → left. Live `moveTo`/`lineTo` order. */
export function isoTileDiamondVertices(
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): [IsoVertex, IsoVertex, IsoVertex, IsoVertex] {
  return [
    { x: screenX, y: screenY },
    { x: screenX + tw / 2, y: screenY + th / 2 },
    { x: screenX, y: screenY + th },
    { x: screenX - tw / 2, y: screenY + th / 2 },
  ];
}

export function traceIsoTileDiamond(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): void {
  const [top, right, bottom, left] = isoTileDiamondVertices(
    screenX,
    screenY,
    tw,
    th,
  );
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();
}

/**
 * Live `0.12 + Math.sin(now * 0.003) * 0.05`. Inject `nowMs` in tests;
 * the RAF caller passes the same `now` it already computed.
 */
export function floorHoverPulseAlpha(nowMs: number): number {
  return (
    HOVER_PULSE_BASE + Math.sin(nowMs * HOVER_PULSE_RATE) * HOVER_PULSE_AMP
  );
}

/**
 * Spell hover is checked first. Overworld / no-mode hover is the
 * cream default (`255,255,200`), not white.
 */
export function floorHoverGlowRgb(
  spellHover: boolean,
  mpHover: boolean,
): FloorHoverRgb {
  if (spellHover) return { r: 100, g: 150, b: 255 };
  if (mpHover) return { r: 0, g: 255, b: 100 };
  return { r: 255, g: 255, b: 200 };
}

export function floorHoverInnerRgba(
  rgb: FloorHoverRgb,
  pulseAlpha: number,
): string {
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${pulseAlpha})`;
}

function drawFilledStrokedDiamond(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
  fill: string,
  stroke: string,
): void {
  ctx.save();
  traceIsoTileDiamond(ctx, screenX, screenY, tw, th);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = RANGE_TILE_LINE_WIDTH;
  ctx.stroke();
  ctx.restore();
}

/** Green MP-reach overlay. Caller already decided `mpTiles.has(key)`. */
export function drawWalkTileOverlay(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): void {
  drawFilledStrokedDiamond(
    ctx,
    screenX,
    screenY,
    tw,
    th,
    WALK_TILE_FILL,
    WALK_TILE_STROKE,
  );
}

/** Blue spell-range overlay. Caller already decided `spellTiles.has(key)`. */
export function drawSpellRangeOverlay(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
): void {
  drawFilledStrokedDiamond(
    ctx,
    screenX,
    screenY,
    tw,
    th,
    SPELL_RANGE_FILL,
    SPELL_RANGE_STROKE,
  );
}

/**
 * Animated hover glow on a floor tile. Radius is `tw/2` (tile width).
 * Caller already decided `isHovered && tileType === "floor"`.
 */
export function drawFloorHoverGlow(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
  spellHover: boolean,
  mpHover: boolean,
  nowMs: number,
): void {
  const pulseAlpha = floorHoverPulseAlpha(nowMs);
  const rgb = floorHoverGlowRgb(spellHover, mpHover);
  ctx.save();
  const glowGrad = ctx.createRadialGradient(
    screenX,
    screenY + th / 2,
    0,
    screenX,
    screenY + th / 2,
    tw / 2,
  );
  glowGrad.addColorStop(0, floorHoverInnerRgba(rgb, pulseAlpha));
  glowGrad.addColorStop(1, HOVER_GLOW_OUTER);
  traceIsoTileDiamond(ctx, screenX, screenY, tw, th);
  ctx.fillStyle = glowGrad;
  ctx.fill();
  ctx.restore();
}
