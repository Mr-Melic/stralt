/**
 * Pixel-pattern paint used by WorldExploration's player sprite and as
 * drawCombatant's `drawPattern` callback.
 *
 * WorldExploration still chooses the pattern, screen anchor, and color
 * triple. This module owns 3px-cell centering and the fillRect loop so
 * that paint math is not trapped inside the orchestrator.
 *
 * MUST call `ctx.restore()` at the end with no matching `save()`. Live
 * RAF callers rely on that pop. `pieceArt.drawPatternInline` is a
 * separate fill-only fallback used when no callback is injected — do
 * not unify the two (inline does not restore).
 */

export const PIXEL_PATTERN_CELL_SIZE = 3;

/** Color triple passed to {@link drawPixelPattern}. Matches pieceArt.PatternColors. */
export type PixelPatternColors = {
  primary: string;
  secondary: string;
  accent: string;
  extra?: string;
};

export type PixelPatternScale = {
  x: number;
  y: number;
};

export type PixelPatternOrigin = {
  startX: number;
  startY: number;
  pixelSize: number;
  patternWidth: number;
  patternHeight: number;
};

/**
 * Top-left origin of a centered pattern. `Math.round` on the start, same
 * as the previous WorldExploration callback. Empty `pattern[0]` throws —
 * that is current behaviour.
 */
export function pixelPatternOrigin(
  pattern: number[][],
  x: number,
  y: number,
  scale: PixelPatternScale = { x: 1, y: 1 },
): PixelPatternOrigin {
  const pixelSize = PIXEL_PATTERN_CELL_SIZE;
  const patternWidth = pattern[0].length * pixelSize * scale.x;
  const patternHeight = pattern.length * pixelSize * scale.y;
  return {
    startX: Math.round(x - patternWidth / 2),
    startY: Math.round(y - patternHeight / 2),
    pixelSize,
    patternWidth,
    patternHeight,
  };
}

/**
 * Cell value → fill color. 0 is transparent (caller skips). 1/2 map to
 * secondary/accent. 3 uses `extra` when present, otherwise primary.
 * Any other non-zero value is primary.
 */
export function pixelPatternCellColor(
  pixelValue: number,
  colors: PixelPatternColors,
): string | null {
  if (pixelValue === 0) return null;
  if (pixelValue === 1) return colors.secondary;
  if (pixelValue === 2) return colors.accent;
  if (pixelValue === 3 && colors.extra) return colors.extra;
  return colors.primary;
}

/**
 * Paint a pattern grid onto `ctx`, then `restore()` (no `save()`).
 * Default scale is `{ x: 1, y: 1 }` so the player call site can omit it.
 */
export function drawPixelPattern(
  ctx: CanvasRenderingContext2D,
  pattern: number[][],
  x: number,
  y: number,
  colors: PixelPatternColors,
  scale: PixelPatternScale = { x: 1, y: 1 },
): void {
  const { startX, startY, pixelSize } = pixelPatternOrigin(
    pattern,
    x,
    y,
    scale,
  );

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      const color = pixelPatternCellColor(pattern[row][col], colors);
      if (color === null) continue;

      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(startX + col * pixelSize * scale.x),
        Math.round(startY + row * pixelSize * scale.y),
        Math.ceil(pixelSize * scale.x),
        Math.ceil(pixelSize * scale.y),
      );
    }
  }

  ctx.restore();
}
