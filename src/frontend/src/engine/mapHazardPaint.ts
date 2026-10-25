/**
 * engine/mapHazardPaint.ts
 *
 * Pure lava / ice / spikes floor-tile overlay paint used by WorldExploration
 * after `drawIsometricTile` in the floor pass.
 *
 * WorldExploration still owns:
 *   - hazard lookup (`currentMap.hazardTiles`)
 *   - floor vs wall / portal gate
 *   - clicked-tile skip
 *   - screen anchor (`gridToScreen`)
 *   - map-id first char for the overlay seed
 *   - the RAF `now` clock (passed in so lava pulse matches row shimmer)
 *
 * Do **not** fold this into `tilePaint.ts` (slab / wall / portal diamond) or
 * `barrierRender.ts` (purple barrier towers). Do **not** fold the in-battle
 * portal cube (`drawPortalPixels`). Gameplay (lava/ice/spikes damage, walk
 * tax, challenge recording) stays in WorldExploration.
 *
 * Overlay only special-cases `"lava"` and `"ice"`. Every other kind — including
 * `"spikes"`, `"spike"`, `"poison"`, `"fire"`, `"void"` — uses the charcoal
 * spikes glyph. Do not split those branches.
 *
 * Lava and spikes grain consume an extra rng draw (`isHot` / `isTip`); ice
 * does not. Do not unify those loops.
 *
 * Inject `nowMs` in tests; the live caller passes the render-loop `now`
 * (`Date.now()` at the start of the painter pass).
 *
 * React-free. No gameplay / occupancy / LoS changes.
 */

import { seededRng } from "./combatMath.ts";

export type HazardOverlayKind =
  | "spike"
  | "poison"
  | "fire"
  | "ice"
  | "void"
  | "lava"
  | "spikes";

export type IsoRgb = { r: number; g: number; b: number };

/**
 * Floor-only, skip clicked tiles, require a truthy overlay kind.
 * Lookup still lives in WorldExploration.
 */
export function shouldPaintHazardOverlay(input: {
  tileType: string;
  hazardType: string | undefined | null;
  isClicked: boolean;
}): boolean {
  return Boolean(
    input.tileType === "floor" && input.hazardType && !input.isClicked,
  );
}

/** `Math.abs(x * 7331 + y * 5003 + mapId.charCodeAt(0))`. */
export function hazardOverlaySeed(
  gridX: number,
  gridY: number,
  mapIdFirstCharCode: number,
): number {
  return Math.abs(gridX * 7331 + gridY * 5003 + mapIdFirstCharCode);
}

/** Grain count: `floor(rng * 21) + 30` → 30–50. */
export function hazardOverlayGrainCount(rng: () => number): number {
  return Math.floor(rng() * 21) + 30;
}

/**
 * Base diamond tint. Non-lava / non-ice kinds share charcoal — do not give
 * `"spike"` a different tint from `"spikes"`.
 */
export function hazardBaseTintRgba(hazardType: string): string {
  if (hazardType === "lava") return "rgba(180,30,0,0.68)";
  if (hazardType === "ice") return "rgba(100,200,255,0.55)";
  return "rgba(40,40,40,0.72)";
}

/** Lava grain. Hot path skips shade. */
export function hazardLavaGrainRgb(shade: number, isHot: boolean): IsoRgb {
  return {
    r: isHot ? 255 : Math.min(255, 160 + Math.abs(shade)),
    g: isHot ? 220 : Math.max(0, 30 + shade),
    b: isHot ? 20 : 0,
  };
}

/** Ice grain. `bv = min(255, 200 + shade)`. */
export function hazardIceGrainRgb(shade: number): IsoRgb {
  const bv = Math.min(255, 200 + shade);
  return {
    r: Math.max(180, bv - 20),
    g: Math.max(220, bv),
    b: 255,
  };
}

/** Spikes (and every non-lava / non-ice kind) grain. */
export function hazardSpikeGrainRgb(shade: number, isTip: boolean): IsoRgb {
  const gv = isTip ? 170 : Math.max(30, 60 + shade);
  return { r: gv, g: gv, b: gv };
}

/** Lava glow pulse. Live uses `now * 0.004 + hSeed`. */
export function hazardLavaPulse(nowMs: number, hSeed: number): number {
  return 0.6 + 0.4 * Math.sin(nowMs * 0.004 + hSeed);
}

function rgbCss(c: IsoRgb): string {
  return `rgb(${c.r},${c.g},${c.b})`;
}

/**
 * Clip to the iso diamond, tint, grain, then the type glyph. Caller must
 * already have decided this tile should paint (`shouldPaintHazardOverlay`).
 */
export function drawHazardOverlay(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  hazardType: string,
  gridX: number,
  gridY: number,
  mapIdFirstCharCode: number,
  tw: number,
  th: number,
  nowMs: number = Date.now(),
): void {
  const hSeed = hazardOverlaySeed(gridX, gridY, mapIdFirstCharCode);
  const hrng = seededRng(hSeed);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(screenX + tw / 2, screenY + th / 2);
  ctx.lineTo(screenX, screenY + th);
  ctx.lineTo(screenX - tw / 2, screenY + th / 2);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = hazardBaseTintRgba(hazardType);
  ctx.fill();

  const pxCount = hazardOverlayGrainCount(hrng);
  for (let pi = 0; pi < pxCount; pi++) {
    const px = screenX - tw / 2 + hrng() * tw;
    const py = screenY + hrng() * th;
    const ps = hrng() < 0.4 ? 2 : 3;
    const shade = Math.floor(hrng() * 60) - 20;
    if (hazardType === "lava") {
      const isHot = hrng() < 0.12;
      ctx.fillStyle = rgbCss(hazardLavaGrainRgb(shade, isHot));
    } else if (hazardType === "ice") {
      ctx.fillStyle = rgbCss(hazardIceGrainRgb(shade));
    } else {
      const isTip = hrng() < 0.15;
      ctx.fillStyle = rgbCss(hazardSpikeGrainRgb(shade, isTip));
    }
    ctx.fillRect(Math.round(px), Math.round(py), ps, ps);
  }

  const tcx = screenX;
  const tcy = screenY + th / 2;
  ctx.globalAlpha = 0.9;
  ctx.font = `${Math.round(th * 0.65)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (hazardType === "lava") {
    const pulse = hazardLavaPulse(nowMs, hSeed);
    ctx.globalAlpha = pulse * 0.9;
    for (let di = 0; di < 4; di++) {
      const da = (di / 4) * Math.PI * 2;
      const dr = th * 0.2;
      const dx2 = Math.cos(da) * dr * 0.5;
      const dy2 = Math.sin(da) * dr * 0.3;
      ctx.fillStyle = `rgba(255,${180 + Math.floor(pulse * 60)},20,${pulse})`;
      ctx.fillRect(Math.round(tcx + dx2) - 2, Math.round(tcy + dy2) - 2, 4, 4);
    }
  } else if (hazardType === "ice") {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (let si = 0; si < 4; si++) {
      const sa = (si / 4) * Math.PI;
      const sl = th * 0.28;
      const sx1 = tcx + Math.cos(sa) * sl;
      const sy1 = tcy + Math.sin(sa) * sl * 0.5;
      const sx2 = tcx - Math.cos(sa) * sl;
      const sy2 = tcy - Math.sin(sa) * sl * 0.5;
      ctx.fillRect(Math.round(sx1) - 1, Math.round(sy1) - 1, 3, 3);
      ctx.fillRect(Math.round(sx2) - 1, Math.round(sy2) - 1, 3, 3);
    }
    ctx.fillRect(tcx - 1, tcy - 1, 3, 3);
  } else {
    ctx.fillStyle = "rgba(180,180,180,0.95)";
    const spikeOffsets = [-tw * 0.22, 0, tw * 0.22];
    for (const sox of spikeOffsets) {
      const sby = tcy - th * 0.18;
      ctx.fillRect(Math.round(tcx + sox) - 1, Math.round(sby) - 1, 2, 2);
      ctx.fillStyle = "rgba(120,120,120,0.85)";
      ctx.fillRect(Math.round(tcx + sox) - 2, Math.round(sby + 4), 4, 3);
      ctx.fillStyle = "rgba(180,180,180,0.95)";
    }
  }
  ctx.restore();
}
