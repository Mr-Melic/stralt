/**
 * Portal whirlpool renderer.
 *
 * WorldExploration still decides when and where to draw a portal (RAF
 * occupancy, rest-portal override, dungeon-chain labels). This module owns
 * the swirl / rest-ring / boss-star / dungeon-spike paint so that visual
 * palette changes do not sit inside the orchestrator.
 *
 * Inject `nowMs` in tests. The live caller omits it and uses Date.now(),
 * matching the previous inline callback. Rest portals keep their own 0.5×
 * time scale; do not reuse the outer `time` for that branch.
 *
 * Boss and dungeon overlays are additive `if`s, not else-if: both still
 * draw the three spiral layers afterwards. Rest returns after the rings.
 */

export type PortalWhirlpoolColor =
  | "blue"
  | "red"
  | "green"
  | "purple"
  | "gold"
  | "black"
  | "rest"
  | "boss"
  | "dungeon"
  | "bossRush"
  | "white"
  | "progression";

/** Per-layer stroke colors. Unknown ids fall back to blue. */
export const PORTAL_WHIRLPOOL_COLORS: Record<PortalWhirlpoolColor, string[]> = {
  black: ["#000000", "#333333", "#666666"],
  blue: ["#001133", "#003366", "#0066cc"],
  red: ["#330011", "#660033", "#cc0066"],
  green: ["#003311", "#006633", "#00cc66"],
  purple: ["#220033", "#550066", "#9900cc"],
  gold: ["#332200", "#665500", "#cc9900"],
  dungeon: ["#4a0000", "#8b0000", "#cc0000"],
  boss: ["#1a0033", "#5b1fa0", "#9333ea"],
  bossRush: ["#1a0040", "#9900cc", "#ff66ff"],
  progression: ["#2a1a00", "#665500", "#ffcc00"],
  rest: ["#d0d0d0", "#e8e8e8", "#f8f8f8"],
  white: ["#f5f5f5", "#ffffff", "#e8e8e8"],
};

export const PORTAL_WHIRLPOOL_RADIUS = 25;
export const PORTAL_WHIRLPOOL_TIME_SCALE = 0.005;
export const REST_PORTAL_TIME_SCALE = 0.5;

export function portalWhirlpoolPalette(color: string): string[] {
  return (
    PORTAL_WHIRLPOOL_COLORS[color as PortalWhirlpoolColor] ??
    PORTAL_WHIRLPOOL_COLORS.blue
  );
}

export function portalWhirlpoolTime(
  nowMs: number,
  animationOffset: number,
): number {
  return nowMs * PORTAL_WHIRLPOOL_TIME_SCALE + animationOffset;
}

export function restPortalWhirlpoolTime(
  nowMs: number,
  animationOffset: number,
): number {
  return (
    nowMs * PORTAL_WHIRLPOOL_TIME_SCALE * REST_PORTAL_TIME_SCALE +
    animationOffset
  );
}

/**
 * Draw an animated portal whirlpool at the iso screen anchor.
 * `nowMs` defaults to Date.now() so the WorldExploration call site stays
 * `(ctx, x, y, color, animationOffset)`.
 */
export function drawPortalWhirlpool(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  animationOffset: number,
  nowMs: number = Date.now(),
): void {
  const time = portalWhirlpoolTime(nowMs, animationOffset);
  const radius = PORTAL_WHIRLPOOL_RADIUS;
  const colors = portalWhirlpoolPalette(color);

  // Draw swirling whirlpool effect
  ctx.save();
  ctx.translate(x, y - 10);

  // REST PORTALS: soft concentric silver-white rings, slow gentle rotation
  if (color === "rest") {
    const slowTime = restPortalWhirlpoolTime(nowMs, animationOffset);
    // Soft white glow at center
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.ellipse(0, 0, radius + 8, (radius + 8) * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Draw 3 concentric rings: outer, middle, inner
    const ringDefs = [
      { r: radius + 4, color: "#d0d0d0", lw: 2.5, alpha: 0.55 },
      { r: radius - 5, color: "#e8e8e8", lw: 2.0, alpha: 0.7 },
      { r: radius - 13, color: "#f8f8f8", lw: 1.5, alpha: 0.85 },
    ];
    for (const ring of ringDefs) {
      if (ring.r <= 0) continue;
      ctx.globalAlpha = ring.alpha * (0.85 + 0.15 * Math.sin(slowTime * 1.2));
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.lw;
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.r, ring.r * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Slowly rotating sparkle dots
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(slowTime * 0.8);
    ctx.fillStyle = "#ffffff";
    for (let s = 0; s < 6; s++) {
      const angle = (s / 6) * Math.PI * 2 + slowTime * 0.4;
      const sx = Math.cos(angle) * (radius - 2);
      const sy = Math.sin(angle) * (radius - 2) * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }
  // BOSS PORTALS: star burst ring in deep purple, visually unmistakable
  if (color === "boss") {
    ctx.globalAlpha = 0.75 + 0.25 * Math.sin(time * 1.5);
    const spikeCount = 6;
    const outerR = radius + 12;
    const innerR = radius + 4;
    ctx.fillStyle = "#9333ea";
    ctx.beginPath();
    for (let s = 0; s < spikeCount; s++) {
      const baseAngle = (s / spikeCount) * Math.PI * 2 + time * 0.5;
      const tipAngle = baseAngle + Math.PI / spikeCount;
      const bx = Math.cos(baseAngle) * innerR;
      const by = Math.sin(baseAngle) * innerR * 0.5;
      const tx = Math.cos(tipAngle) * outerR;
      const ty = Math.sin(tipAngle) * outerR * 0.5;
      const b2x = Math.cos(baseAngle + (2 * Math.PI) / spikeCount) * innerR;
      const b2y =
        Math.sin(baseAngle + (2 * Math.PI) / spikeCount) * innerR * 0.5;
      if (s === 0) ctx.moveTo(bx, by);
      else ctx.lineTo(bx, by);
      ctx.lineTo(tx, ty);
      ctx.lineTo(b2x, b2y);
    }
    ctx.closePath();
    ctx.fill();
    // Star glyph in center
    ctx.globalAlpha = 0.9 + 0.1 * Math.sin(time * 2);
    ctx.fillStyle = "#e2aeff";
    ctx.font = "bold 14px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", 0, 0);
    ctx.globalAlpha = 1;
  }
  // DUNGEON PORTALS: outer diamond-spike ring as unmistakable visual distinguisher
  if (color === "dungeon") {
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(time * 1.2);
    const spikeCount = 8;
    const outerR = radius + 10;
    const innerR = radius + 3;
    ctx.fillStyle = "#cc0000";
    ctx.beginPath();
    for (let s = 0; s < spikeCount; s++) {
      const baseAngle = (s / spikeCount) * Math.PI * 2 + time * 0.3;
      const tipAngle = baseAngle + Math.PI / spikeCount;
      const bx = Math.cos(baseAngle) * innerR;
      const by = Math.sin(baseAngle) * innerR * 0.5;
      const tx = Math.cos(tipAngle) * outerR;
      const ty = Math.sin(tipAngle) * outerR * 0.5;
      const b2x = Math.cos(baseAngle + (2 * Math.PI) / spikeCount) * innerR;
      const b2y =
        Math.sin(baseAngle + (2 * Math.PI) / spikeCount) * innerR * 0.5;
      if (s === 0) ctx.moveTo(bx, by);
      else ctx.lineTo(bx, by);
      ctx.lineTo(tx, ty);
      ctx.lineTo(b2x, b2y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Draw multiple spiral layers
  for (let layer = 0; layer < 3; layer++) {
    const layerRadius = radius - layer * 8;
    const spiralCount = 6 - layer;

    ctx.strokeStyle = colors[layer];
    ctx.lineWidth = 3 - layer;
    ctx.globalAlpha = 0.8 - layer * 0.2;

    for (let i = 0; i < spiralCount; i++) {
      const angle = (time + i * ((Math.PI * 2) / spiralCount)) % (Math.PI * 2);
      const spiralRadius =
        layerRadius * (0.3 + 0.7 * Math.sin(time * 0.5 + layer));

      ctx.beginPath();
      for (let t = 0; t < Math.PI * 2; t += 0.1) {
        const r = spiralRadius * (1 - t / (Math.PI * 2));
        const spiralX = Math.cos(angle + t) * r;
        const spiralY = Math.sin(angle + t) * r * 0.5; // Flatten for isometric view

        if (t === 0) {
          ctx.moveTo(spiralX, spiralY);
        } else {
          ctx.lineTo(spiralX, spiralY);
        }
      }
      ctx.stroke();
    }
  }

  ctx.restore();
}
