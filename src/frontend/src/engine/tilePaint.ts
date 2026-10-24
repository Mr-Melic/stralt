/**
 * engine/tilePaint.ts
 *
 * Pure isometric floor / wall / portal tile paint used by WorldExploration.
 * WorldExploration still owns:
 *   - hover / click flags from refs
 *   - screen anchor (`gridToScreen`)
 *   - map `colorFamily` / `wallPalette`
 *   - an empty-deps `useCallback` forwarding to `drawIsometricTile`
 *
 * Do **not** fold this into `barrierRender.ts` (purple barrier towers, 6
 * stacked layers). Do **not** fold hazard overlays or the in-battle portal
 * cube (`drawPortalPixels`) into this module — those stay in WX.
 *
 * Wall block height is 28 — `barrierRender` `BARRIER_LAYER_HEIGHT` must match.
 * Inject `nowMs` in tests; the live caller omits it (`Date.now()`).
 *
 * React-free. No gameplay / occupancy / LoS changes.
 */

import { TILE_HEIGHT, TILE_WIDTH } from "../data/gameConstants.ts";
import { seededRng } from "./combatMath.ts";

export type IsoTileKind = "floor" | "wall" | "portal";

export type IsoFloorColorFamily = {
  r1: number;
  g1: number;
  b1: number;
  r2: number;
  g2: number;
  b2: number;
};

export type IsoRgb = { r: number; g: number; b: number };

/** Wall cube height in screen pixels. Must match barrierRender layer height. */
export const ISO_WALL_HEIGHT = 28;

export const ISO_FLOOR_DEFAULT_RGB: IsoRgb = { r: 176, g: 190, b: 197 };

export function isoWallSeed(gridX: number, gridY: number): number {
  return Math.abs(gridX * 397 + gridY * 521 + (gridX + 1) * (gridY + 1) * 7);
}

export function isoFloorColorSeed(gridX: number, gridY: number): number {
  return Math.abs(gridX * 31 + gridY * 17);
}

export function isoFloorTextureSeed(gridX: number, gridY: number): number {
  return Math.abs(gridX * 7919 + gridY * 6151);
}

/**
 * First `#` only, same as live `replace("#", "")`. Invalid hex yields NaN
 * channels — do not "fix" that during a paint extraction.
 */
export function isoWallBaseRgb(
  rng: () => number,
  wallPalette?: readonly string[],
): IsoRgb {
  if (wallPalette && wallPalette.length > 0) {
    const paletteIdx = Math.floor(rng() * wallPalette.length);
    const hexColor = wallPalette[paletteIdx].replace("#", "");
    return {
      r: Number.parseInt(hexColor.substring(0, 2), 16),
      g: Number.parseInt(hexColor.substring(2, 4), 16),
      b: Number.parseInt(hexColor.substring(4, 6), 16),
    };
  }
  const baseGrey = Math.floor(rng() * 16) + 42;
  return { r: baseGrey, g: baseGrey, b: baseGrey };
}

export function isoWallFaceRgb(base: IsoRgb): {
  topFace: IsoRgb;
  right: IsoRgb;
  left: IsoRgb;
  bottom: IsoRgb;
  bottomLeft: IsoRgb;
} {
  return {
    topFace: {
      r: Math.min(255, base.r + 20),
      g: Math.min(255, base.g + 20),
      b: Math.min(255, base.b + 20),
    },
    right: {
      r: Math.floor(base.r * 0.77),
      g: Math.floor(base.g * 0.77),
      b: Math.floor(base.b * 0.77),
    },
    left: {
      r: Math.floor(base.r * 0.72),
      g: Math.floor(base.g * 0.72),
      b: Math.floor(base.b * 0.72),
    },
    bottom: {
      r: Math.floor(base.r * 0.68),
      g: Math.floor(base.g * 0.68),
      b: Math.floor(base.b * 0.68),
    },
    bottomLeft: {
      r: Math.floor(base.r * 0.62),
      g: Math.floor(base.g * 0.62),
      b: Math.floor(base.b * 0.62),
    },
  };
}

export function isoFloorFamilyRgb(
  family: IsoFloorColorFamily,
  t: number,
): IsoRgb {
  return {
    r: Math.round(family.r1 + t * (family.r2 - family.r1)),
    g: Math.round(family.g1 + t * (family.g2 - family.g1)),
    b: Math.round(family.b1 + t * (family.b2 - family.b1)),
  };
}

/** Portal ellipse pulse. Live uses `Date.now() * 0.003`. */
export function isoPortalPulseAlpha(nowMs: number): number {
  return 0.35 + 0.15 * Math.sin(nowMs * 0.003);
}

/** Bottom-face grain: `floor(rng * 12) + 18` → 18–29. */
export function isoWallBottomPixelCount(rng: () => number): number {
  return Math.floor(rng() * 12) + 18;
}

/** Side-face grain: `floor(rng * 25) + 40` → 40–64. */
export function isoWallSidePixelCount(rng: () => number): number {
  return Math.floor(rng() * 25) + 40;
}

/** Floor primary grain: `floor(rng * 16) + 40` → 40–55. */
export function isoFloorGrainPixelCount(rng: () => number): number {
  return Math.floor(rng() * 16) + 40;
}

/** Floor depth grain: `floor(rng * 5) + 8` → 8–12. */
export function isoFloorDepthPixelCount(rng: () => number): number {
  return Math.floor(rng() * 5) + 8;
}

/**
 * Nested ternary — may consume one or two rng draws. Do not rewrite as a
 * single call.
 */
export function isoFloorGrainPixelSize(rng: () => number): number {
  return rng() < 0.33 ? 1 : rng() < 0.66 ? 2 : 3;
}

/**
 * DOFUS-style isometric tile — stone slab floors, 3D cube walls, portal
 * diamond + pulse ellipse. Signature matches the live WX callback so the
 * wrapper can forward positional args unchanged.
 */
export function drawIsometricTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tileType: IsoTileKind,
  gridX: number,
  gridY: number,
  isHovered = false,
  isClicked = false,
  tw = TILE_WIDTH,
  th = TILE_HEIGHT,
  mapColorFamily?: IsoFloorColorFamily,
  wallPalette?: readonly string[],
  nowMs: number = Date.now(),
): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + tw / 2, y + th / 2);
  ctx.lineTo(x, y + th);
  ctx.lineTo(x - tw / 2, y + th / 2);
  ctx.closePath();

  if (tileType === "wall") {
    const wallHeight = ISO_WALL_HEIGHT;
    const seed = isoWallSeed(gridX, gridY);
    const rng = seededRng(seed);

    const { r: topR, g: topG, b: topB } = isoWallBaseRgb(rng, wallPalette);
    const faces = isoWallFaceRgb({ r: topR, g: topG, b: topB });

    const topFaceColor = `rgb(${faces.topFace.r},${faces.topFace.g},${faces.topFace.b})`;
    const rightFaceColor = `rgb(${faces.right.r},${faces.right.g},${faces.right.b})`;
    const leftFaceColor = `rgb(${faces.left.r},${faces.left.g},${faces.left.b})`;
    const baseColor = `rgb(${topR},${topG},${topB})`;

    ctx.fillStyle = isHovered ? "rgba(239,68,68,0.4)" : baseColor;
    if (isClicked) ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Right face — fully opaque
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(x + tw / 2, y + th / 2);
    ctx.lineTo(x + tw / 2, y + th / 2 - wallHeight);
    ctx.lineTo(x, y - wallHeight);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = isHovered ? "#555555" : rightFaceColor;
    ctx.fill();
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + tw / 2, y + th / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();

    // Left face — fully opaque
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(x - tw / 2, y + th / 2);
    ctx.lineTo(x - tw / 2, y + th / 2 - wallHeight);
    ctx.lineTo(x, y - wallHeight);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = isHovered ? "#333333" : leftFaceColor;
    ctx.fill();
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - tw / 2, y + th / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();

    const bottomFaceR = faces.bottom.r;
    const bottomFaceG = faces.bottom.g;
    const bottomFaceB = faces.bottom.b;
    const bottomLeftR = faces.bottomLeft.r;
    const bottomLeftG = faces.bottomLeft.g;
    const bottomLeftB = faces.bottomLeft.b;

    // Front-right sub-face: (x, y) → (x+tw/2, y+th/2) → (x, y+th)
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + tw / 2, y + th / 2);
    ctx.lineTo(x, y + th);
    ctx.closePath();
    ctx.fillStyle = isHovered
      ? "#2a2a2a"
      : `rgb(${bottomFaceR},${bottomFaceG},${bottomFaceB})`;
    ctx.fill();
    if (!isHovered && !isClicked) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + tw / 2, y + th / 2);
      ctx.lineTo(x, y + th);
      ctx.closePath();
      ctx.clip();
      const rngBR = seededRng(seed + 6);
      const pxCountBR = isoWallBottomPixelCount(rngBR);
      for (let pi = 0; pi < pxCountBR; pi++) {
        const u = rngBR();
        const v = rngBR();
        const bfx = x + u * (tw / 2);
        const bfy = y + u * (th / 2) + v * ((th / 2) * (1 - u) + (th / 2) * u);
        const bps = rngBR() < 0.5 ? 2 : 3;
        const shv = Math.floor(rngBR() * 30) - 12;
        ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, bottomFaceR + shv))},${Math.max(0, Math.min(255, bottomFaceG + shv))},${Math.max(0, Math.min(255, bottomFaceB + shv))})`;
        ctx.fillRect(Math.round(bfx), Math.round(bfy), bps, bps);
      }
      ctx.restore();
    }
    ctx.restore();

    // Front-left sub-face: (x-tw/2, y+th/2) → (x, y) → (x, y+th)
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(x - tw / 2, y + th / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + th);
    ctx.closePath();
    ctx.fillStyle = isHovered
      ? "#1a1a1a"
      : `rgb(${bottomLeftR},${bottomLeftG},${bottomLeftB})`;
    ctx.fill();
    if (!isHovered && !isClicked) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x - tw / 2, y + th / 2);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + th);
      ctx.closePath();
      ctx.clip();
      const rngBL = seededRng(seed + 7);
      const pxCountBL = isoWallBottomPixelCount(rngBL);
      for (let pi = 0; pi < pxCountBL; pi++) {
        const u = rngBL();
        const v = rngBL();
        const bfx2 = x - u * (tw / 2);
        const bfy2 = y + u * (th / 2) + v * ((th / 2) * (1 - u) + (th / 2) * u);
        const bps2 = rngBL() < 0.5 ? 2 : 3;
        const shv2 = Math.floor(rngBL() * 30) - 12;
        ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, bottomLeftR + shv2))},${Math.max(0, Math.min(255, bottomLeftG + shv2))},${Math.max(0, Math.min(255, bottomLeftB + shv2))})`;
        ctx.fillRect(Math.round(bfx2), Math.round(bfy2), bps2, bps2);
      }
      ctx.restore();
    }
    ctx.restore();

    // Vertical black seam line — front center edge of the cube base
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + th);
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - tw / 2, y + th / 2);
    ctx.lineTo(x, y + th);
    ctx.moveTo(x + tw / 2, y + th / 2);
    ctx.lineTo(x, y + th);
    ctx.stroke();
    ctx.restore();

    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y - wallHeight);
    ctx.lineTo(x + tw / 2, y + th / 2 - wallHeight);
    ctx.lineTo(x, y + th - wallHeight);
    ctx.lineTo(x - tw / 2, y + th / 2 - wallHeight);
    ctx.closePath();
    ctx.fillStyle = isHovered ? "#777777" : topFaceColor;
    ctx.fill();
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if (!isHovered && !isClicked) {
      const rng3 = seededRng(seed + 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + tw / 2, y + th / 2 - wallHeight);
      ctx.lineTo(x + tw / 2, y + th / 2);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - wallHeight);
      ctx.closePath();
      ctx.clip();
      const pixelCountR = isoWallSidePixelCount(rng3);
      for (let pi = 0; pi < pixelCountR; pi++) {
        const u = rng3();
        const v = rng3();
        const faceTopY = y - wallHeight + u * (th / 2);
        const faceBotY = y + u * (th / 2);
        const ipx2 = x + u * (tw / 2);
        const ipy2 = faceTopY + v * (faceBotY - faceTopY);
        const ips2 = rng3() < 0.5 ? 2 : 3;
        const shVar2 = Math.floor(rng3() * 35) - 10;
        const shR2 = Math.max(0, Math.min(255, faces.right.r + shVar2));
        const shG2 = Math.max(0, Math.min(255, faces.right.g + shVar2));
        const shB2 = Math.max(0, Math.min(255, faces.right.b + shVar2));
        ctx.fillStyle = `rgb(${shR2},${shG2},${shB2})`;
        ctx.fillRect(Math.round(ipx2), Math.round(ipy2), ips2, ips2);
      }
      ctx.restore();

      const rng4 = seededRng(seed + 3);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x - tw / 2, y + th / 2 - wallHeight);
      ctx.lineTo(x - tw / 2, y + th / 2);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - wallHeight);
      ctx.closePath();
      ctx.clip();
      const pixelCountL = isoWallSidePixelCount(rng4);
      for (let pi = 0; pi < pixelCountL; pi++) {
        const u = rng4();
        const v = rng4();
        const faceTopY = y - wallHeight + u * (th / 2);
        const faceBotY = y + u * (th / 2);
        const ipx3 = x - u * (tw / 2);
        const ipy3 = faceTopY + v * (faceBotY - faceTopY);
        const ips3 = rng4() < 0.5 ? 2 : 3;
        const shVar3 = Math.floor(rng4() * 35) - 10;
        const shR3 = Math.max(0, Math.min(255, faces.left.r + shVar3));
        const shG3 = Math.max(0, Math.min(255, faces.left.g + shVar3));
        const shB3 = Math.max(0, Math.min(255, faces.left.b + shVar3));
        ctx.fillStyle = `rgb(${shR3},${shG3},${shB3})`;
        ctx.fillRect(Math.round(ipx3), Math.round(ipy3), ips3, ips3);
      }
      ctx.restore();
    }
  } else if (tileType === "portal") {
    ctx.fillStyle = isHovered ? "#4a4060" : "#1e1a2e";
    if (isClicked) ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.strokeStyle = "#6b21a8";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.save();
    ctx.globalAlpha = isoPortalPulseAlpha(nowMs);
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y + th / 2, tw / 3, th / 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    let flR: number;
    let flG: number;
    let flB: number;
    if (mapColorFamily && !isClicked) {
      const tileSeed = isoFloorColorSeed(gridX, gridY);
      const srng = seededRng(tileSeed);
      const tf = srng();
      const floor = isoFloorFamilyRgb(mapColorFamily, tf);
      flR = floor.r;
      flG = floor.g;
      flB = floor.b;
    } else {
      flR = ISO_FLOOR_DEFAULT_RGB.r;
      flG = ISO_FLOOR_DEFAULT_RGB.g;
      flB = ISO_FLOOR_DEFAULT_RGB.b;
    }
    const baseColor2 = isClicked ? "#ffd700" : `rgb(${flR},${flG},${flB})`;
    ctx.fillStyle = baseColor2;
    ctx.fill();

    if (!isClicked && mapColorFamily) {
      const txSeed = isoFloorTextureSeed(gridX, gridY);
      const trng = seededRng(txSeed);
      const pixelCount = isoFloorGrainPixelCount(trng);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + tw / 2, y + th / 2);
      ctx.lineTo(x, y + th);
      ctx.lineTo(x - tw / 2, y + th / 2);
      ctx.closePath();
      ctx.clip();
      ctx.globalAlpha = 0.22;
      for (let pi = 0; pi < pixelCount; pi++) {
        const ipx = x - tw / 2 + trng() * tw;
        const ipy = y + trng() * th;
        const ips = isoFloorGrainPixelSize(trng);
        const shift = Math.floor(trng() * 55) - 25;
        const pr = Math.max(0, Math.min(255, flR + shift));
        const pg = Math.max(0, Math.min(255, flG + shift));
        const pb = Math.max(0, Math.min(255, flB + shift));
        ctx.fillStyle = `rgb(${pr},${pg},${pb})`;
        ctx.fillRect(Math.round(ipx), Math.round(ipy), ips, ips);
      }
      ctx.globalAlpha = 0.12;
      const depthCount = isoFloorDepthPixelCount(trng);
      for (let pi = 0; pi < depthCount; pi++) {
        const ipx2 = x - tw / 2 + trng() * tw;
        const ipy2 = y + trng() * th;
        const ips2 = trng() < 0.5 ? 3 : 4;
        const shift2 = Math.floor(trng() * 40) - 15;
        const pr2 = Math.max(0, Math.min(255, flR + shift2));
        const pg2 = Math.max(0, Math.min(255, flG + shift2));
        const pb2 = Math.max(0, Math.min(255, flB + shift2));
        ctx.fillStyle = `rgb(${pr2},${pg2},${pb2})`;
        ctx.fillRect(Math.round(ipx2), Math.round(ipy2), ips2, ips2);
      }
      ctx.restore();
    }

    if (isHovered) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + tw / 2, y + th / 2);
      ctx.lineTo(x, y + th);
      ctx.lineTo(x - tw / 2, y + th / 2);
      ctx.closePath();
      ctx.fillStyle = "rgba(74,222,128,0.22)";
      ctx.fill();
    }
  }
}
