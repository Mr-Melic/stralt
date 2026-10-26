/**
 * engine/battlePortalCube.ts
 *
 * In-battle portal cube paint used by WorldExploration when `inBattle` is
 * true. Overworld portals keep the whirlpool callback (`drawPortalWhirlpool`);
 * do **not** fold this cube into that swirl, `tilePaint` (floor/wall slabs),
 * `mapHazardPaint` (lava/ice/spikes overlay), or `barrierRender` (purple
 * towers).
 *
 * WorldExploration still owns:
 *   - the inBattle vs whirlpool branch
 *   - portal lookup / occupancy
 *   - iso screen anchor (`gridToScreen`)
 *   - dungeon-chain labels
 *   - rest-color override for the overworld swirl
 *
 * Only `color === "dungeon"` uses the crimson faces. Boss / bossRush / rest /
 * white / progression / unknown all stay teal — do not "fix" that.
 *
 * Top-face stroke (`#2a0000` / `#005a5c`) is **not** the right/left stroke
 * (`#200000` / `#004444` and `#150000` / `#003333`). Do not unify them.
 *
 * Pixel grain uses a Park–Miller LCG (`sv = abs(seed)+1`, then
 * `sv = sv * 16807 % 2147483647`). Do **not** reuse `seededRng` from
 * combatMath — that is a different stream. `parseInt(baseColor.slice(1), 16)`
 * stays inside the grain loop (live did not hoist it).
 *
 * Height is 28 so the cube matches `drawIsometricTile` walls and
 * `barrierRender` layer height. Do not import those modules from here.
 *
 * React-free. No gameplay / occupancy / LoS changes.
 */

/** Must match wall / barrier iso block height (28). */
export const BATTLE_PORTAL_CUBE_HEIGHT = 28;

export const BATTLE_PORTAL_CUBE_GRAIN_TOP = 10;
export const BATTLE_PORTAL_CUBE_GRAIN_SIDE = 9;

export const PORTAL_CUBE_LCG_A = 16807;
export const PORTAL_CUBE_LCG_M = 2147483647;

export type PortalCubePalette = {
  top: string;
  right: string;
  left: string;
  stroke: string;
  front1: string;
  front2: string;
  rightStroke: string;
  leftStroke: string;
};

export type PortalCubeRgb = { r: number; g: number; b: number };

/** Live check is strict `=== "dungeon"`. Boss/rest/white are teal. */
export function isDungeonPortalCubeColor(color: string): boolean {
  return color === "dungeon";
}

/** `x * 127 + y * 311`. Not abs()'d — live seed can be 0 at the origin. */
export function portalCubeSeed(gridX: number, gridY: number): number {
  return gridX * 127 + gridY * 311;
}

/**
 * Face fills + per-face strokes. Right/left stroke stay distinct from
 * `stroke` (top outline).
 */
export function portalCubePalette(color: string): PortalCubePalette {
  const isDungeonPortal = isDungeonPortalCubeColor(color);
  return {
    top: isDungeonPortal ? "#8b0000" : "#00CED1",
    right: isDungeonPortal ? "#660000" : "#008B8B",
    left: isDungeonPortal ? "#4a0000" : "#006666",
    stroke: isDungeonPortal ? "#2a0000" : "#005a5c",
    front1: isDungeonPortal ? "#550000" : "#007a7a",
    front2: isDungeonPortal ? "#3a0000" : "#005c5c",
    rightStroke: isDungeonPortal ? "#200000" : "#004444",
    leftStroke: isDungeonPortal ? "#150000" : "#003333",
  };
}

/**
 * Park–Miller LCG matching the nested `nextRng` inside the live cube.
 * Initial state is `Math.abs(seed) + 1`.
 */
export function createPortalCubeRng(seed: number): () => number {
  let sv = Math.abs(seed) + 1;
  return () => {
    sv = (sv * PORTAL_CUBE_LCG_A) % PORTAL_CUBE_LCG_M;
    return (sv - 1) / (PORTAL_CUBE_LCG_M - 1);
  };
}

export function portalCubeFaceBounds(
  xs: number[],
  ys: number[],
): { minX: number; maxX: number; minY: number; maxY: number } {
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/** `bright` is +1 or -1 from `rng() < 0.5`. */
export function portalCubePixelRgb(
  baseColor: string,
  bright: number,
): PortalCubeRgb {
  const bParsed = Number.parseInt(baseColor.slice(1), 16);
  return {
    r: Math.min(255, Math.max(0, ((bParsed >> 16) & 0xff) + bright * 30)),
    g: Math.min(255, Math.max(0, ((bParsed >> 8) & 0xff) + bright * 25)),
    b: Math.min(255, Math.max(0, (bParsed & 0xff) + bright * 20)),
  };
}

/**
 * Seeded pixel dots across a face's axis-aligned bounds. Count is 10 (top)
 * or 9 (sides). Coordinates are **not** rounded — live `fillRect` used the
 * raw rng floats.
 */
export function drawPortalPixels(
  ctx: CanvasRenderingContext2D,
  seed: number,
  baseColor: string,
  xs: number[],
  ys: number[],
  count: number,
): void {
  const { minX, maxX, minY, maxY } = portalCubeFaceBounds(xs, ys);
  const nextRng = createPortalCubeRng(seed);
  for (let i = 0; i < count; i++) {
    const px = minX + nextRng() * (maxX - minX);
    const py = minY + nextRng() * (maxY - minY);
    const sz = 1 + nextRng();
    const bright = nextRng() < 0.5 ? 1 : -1;
    const { r, g, b } = portalCubePixelRgb(baseColor, bright);
    ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
    ctx.fillRect(px, py, sz, sz);
  }
}

/**
 * Teal (or dungeon-crimson) iso cube at the portal's screen anchor.
 * Caller already decided this is an in-battle portal.
 */
export function drawBattlePortalCube(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  tw: number,
  th: number,
  gridX: number,
  gridY: number,
  color: string,
): void {
  const bh = BATTLE_PORTAL_CUBE_HEIGHT;
  const palette = portalCubePalette(color);
  const seed = portalCubeSeed(gridX, gridY);

  ctx.save();

  // Top face
  ctx.beginPath();
  ctx.moveTo(screenX, screenY - bh);
  ctx.lineTo(screenX + tw / 2, screenY + th / 2 - bh);
  ctx.lineTo(screenX, screenY + th - bh);
  ctx.lineTo(screenX - tw / 2, screenY + th / 2 - bh);
  ctx.closePath();
  ctx.fillStyle = palette.top;
  ctx.fill();
  ctx.strokeStyle = palette.stroke;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  drawPortalPixels(
    ctx,
    seed,
    palette.top,
    [screenX, screenX + tw / 2, screenX, screenX - tw / 2],
    [
      screenY - bh,
      screenY + th / 2 - bh,
      screenY + th - bh,
      screenY + th / 2 - bh,
    ],
    BATTLE_PORTAL_CUBE_GRAIN_TOP,
  );

  // Right face
  ctx.beginPath();
  ctx.moveTo(screenX + tw / 2, screenY + th / 2);
  ctx.lineTo(screenX + tw / 2, screenY + th / 2 - bh);
  ctx.lineTo(screenX, screenY - bh);
  ctx.lineTo(screenX, screenY);
  ctx.closePath();
  ctx.fillStyle = palette.right;
  ctx.fill();
  ctx.strokeStyle = palette.rightStroke;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  drawPortalPixels(
    ctx,
    seed + 1,
    palette.right,
    [screenX + tw / 2, screenX + tw / 2, screenX, screenX],
    [screenY + th / 2, screenY + th / 2 - bh, screenY - bh, screenY],
    BATTLE_PORTAL_CUBE_GRAIN_SIDE,
  );

  // Left face
  ctx.beginPath();
  ctx.moveTo(screenX - tw / 2, screenY + th / 2);
  ctx.lineTo(screenX - tw / 2, screenY + th / 2 - bh);
  ctx.lineTo(screenX, screenY - bh);
  ctx.lineTo(screenX, screenY);
  ctx.closePath();
  ctx.fillStyle = palette.left;
  ctx.fill();
  ctx.strokeStyle = palette.leftStroke;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  drawPortalPixels(
    ctx,
    seed + 2,
    palette.left,
    [screenX - tw / 2, screenX - tw / 2, screenX, screenX],
    [screenY + th / 2, screenY + th / 2 - bh, screenY - bh, screenY],
    BATTLE_PORTAL_CUBE_GRAIN_SIDE,
  );

  // Front faces (bottom cube)
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(screenX + tw / 2, screenY + th / 2);
  ctx.lineTo(screenX, screenY + th);
  ctx.closePath();
  ctx.fillStyle = palette.front1;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(screenX - tw / 2, screenY + th / 2);
  ctx.lineTo(screenX, screenY);
  ctx.lineTo(screenX, screenY + th);
  ctx.closePath();
  ctx.fillStyle = palette.front2;
  ctx.fill();
  // Dark seam
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(screenX, screenY + th);
  ctx.stroke();
  ctx.restore();
}
