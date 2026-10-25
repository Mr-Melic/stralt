/**
 * Summon side-ID outline. Green = player, red = enemy.
 *
 * Side identity is the stroke color. Do not set canvas `shadowBlur` here —
 * a GPU blur of this rect ran every RAF for every living summon
 * (PERF-2026-10-25-178).
 */
export function strokeOwnerTint(
  ctx: CanvasRenderingContext2D,
  pattern: number[][],
  x: number,
  y: number,
  tint: string,
  scale: { x: number; y: number },
): void {
  const pixelSize = 3;
  const patternWidth = pattern[0].length * pixelSize * scale.x;
  const patternHeight = pattern.length * pixelSize * scale.y;
  const startX = Math.round(x - patternWidth / 2);
  const startY = Math.round(y - patternHeight / 2);
  ctx.save();
  ctx.strokeStyle = tint;
  ctx.lineWidth = 2;
  ctx.strokeRect(startX - 1, startY - 1, patternWidth + 2, patternHeight + 2);
  ctx.restore();
}
