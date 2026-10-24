import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TILE_HEIGHT, TILE_WIDTH } from "../data/gameConstants.ts";
import { seededRng } from "./combatMath.ts";
import {
  ISO_FLOOR_DEFAULT_RGB,
  ISO_WALL_HEIGHT,
  drawIsometricTile,
  isoFloorColorSeed,
  isoFloorDepthPixelCount,
  isoFloorFamilyRgb,
  isoFloorGrainPixelCount,
  isoFloorGrainPixelSize,
  isoFloorTextureSeed,
  isoPortalPulseAlpha,
  isoWallBaseRgb,
  isoWallBottomPixelCount,
  isoWallFaceRgb,
  isoWallSeed,
  isoWallSidePixelCount,
} from "./tilePaint.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change seeds, grey range, face multipliers, or portal pulse.
 * Do not "improve" these.
 */
function legacyWallSeed(gridX: number, gridY: number): number {
  return Math.abs(gridX * 397 + gridY * 521 + (gridX + 1) * (gridY + 1) * 7);
}

function seqRng(values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i];
    i += 1;
    if (v === undefined) throw new Error(`rng exhausted at call ${i}`);
    return v;
  };
}

type CtxOp = { op: string; [k: string]: unknown };

function mockCtx(): { ctx: CanvasRenderingContext2D; ops: CtxOp[] } {
  const ops: CtxOp[] = [];
  let fillStyle: unknown = "";
  let strokeStyle: unknown = "";
  let lineWidth = 1;
  let globalAlpha = 1;
  const ctx = {
    beginPath() {
      ops.push({ op: "beginPath" });
    },
    moveTo(x: number, y: number) {
      ops.push({ op: "moveTo", x, y });
    },
    lineTo(x: number, y: number) {
      ops.push({ op: "lineTo", x, y });
    },
    closePath() {
      ops.push({ op: "closePath" });
    },
    fill() {
      ops.push({ op: "fill", fillStyle, globalAlpha });
    },
    stroke() {
      ops.push({ op: "stroke", strokeStyle, lineWidth, globalAlpha });
    },
    save() {
      ops.push({ op: "save" });
    },
    restore() {
      ops.push({ op: "restore" });
    },
    clip() {
      ops.push({ op: "clip" });
    },
    fillRect(x: number, y: number, w: number, h: number) {
      ops.push({ op: "fillRect", x, y, w, h, fillStyle, globalAlpha });
    },
    ellipse(
      x: number,
      y: number,
      rx: number,
      ry: number,
      rotation: number,
      start: number,
      end: number,
    ) {
      ops.push({ op: "ellipse", x, y, rx, ry, rotation, start, end });
    },
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(v: unknown) {
      fillStyle = v;
      ops.push({ op: "fillStyle", v });
    },
    get strokeStyle() {
      return strokeStyle;
    },
    set strokeStyle(v: unknown) {
      strokeStyle = v;
      ops.push({ op: "strokeStyle", v });
    },
    get lineWidth() {
      return lineWidth;
    },
    set lineWidth(v: number) {
      lineWidth = v;
    },
    get globalAlpha() {
      return globalAlpha;
    },
    set globalAlpha(v: number) {
      globalAlpha = v;
      ops.push({ op: "globalAlpha", v });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, ops };
}

describe("iso wall / floor seeds", () => {
  it("matches the live wall seed polynomial", () => {
    for (const [gx, gy] of [
      [0, 0],
      [8, 8],
      [15, 0],
      [3, 11],
    ] as const) {
      assert.equal(isoWallSeed(gx, gy), legacyWallSeed(gx, gy));
    }
  });

  it("keeps floor color vs texture seeds on different polynomials", () => {
    assert.equal(isoFloorColorSeed(4, 9), Math.abs(4 * 31 + 9 * 17));
    assert.equal(isoFloorTextureSeed(4, 9), Math.abs(4 * 7919 + 9 * 6151));
    assert.notEqual(isoFloorColorSeed(4, 9), isoFloorTextureSeed(4, 9));
  });
});

describe("isoWallBaseRgb / isoWallFaceRgb", () => {
  it("grey fallback is floor(rng*16)+42 (42–57) on all channels", () => {
    assert.deepEqual(isoWallBaseRgb(seqRng([0])), { r: 42, g: 42, b: 42 });
    assert.deepEqual(isoWallBaseRgb(seqRng([0.999])), {
      r: 57,
      g: 57,
      b: 57,
    });
  });

  it("picks palette by floor(rng*length) and strips only the first #", () => {
    const palette = ["#aabbcc", "##112233", "445566"];
    assert.deepEqual(isoWallBaseRgb(seqRng([0]), palette), {
      r: 0xaa,
      g: 0xbb,
      b: 0xcc,
    });
    assert.deepEqual(isoWallBaseRgb(seqRng([0.5]), palette), {
      r: Number.NaN,
      g: 0x12,
      b: 0x23,
    });
    assert.deepEqual(isoWallBaseRgb(seqRng([0.9]), palette), {
      r: 0x44,
      g: 0x55,
      b: 0x66,
    });
  });

  it("empty palette falls through to grey", () => {
    assert.deepEqual(isoWallBaseRgb(seqRng([0]), []), { r: 42, g: 42, b: 42 });
  });

  it("face multipliers match live  +20 / 0.77 / 0.72 / 0.68 / 0.62", () => {
    const faces = isoWallFaceRgb({ r: 100, g: 80, b: 60 });
    assert.deepEqual(faces.topFace, { r: 120, g: 100, b: 80 });
    assert.deepEqual(faces.right, { r: 77, g: 61, b: 46 });
    assert.deepEqual(faces.left, { r: 72, g: 57, b: 43 });
    assert.deepEqual(faces.bottom, { r: 68, g: 54, b: 40 });
    assert.deepEqual(faces.bottomLeft, { r: 62, g: 49, b: 37 });
  });

  it("top face clamps at 255", () => {
    assert.deepEqual(isoWallFaceRgb({ r: 250, g: 250, b: 250 }).topFace, {
      r: 255,
      g: 255,
      b: 255,
    });
  });
});

describe("iso floor family / portal pulse / grain counts", () => {
  it("lerps family channels with Math.round", () => {
    assert.deepEqual(
      isoFloorFamilyRgb(
        { r1: 10, g1: 20, b1: 30, r2: 20, g2: 40, b2: 50 },
        0.5,
      ),
      { r: 15, g: 30, b: 40 },
    );
  });

  it("portal pulse is 0.35 + 0.15 * sin(nowMs * 0.003)", () => {
    assert.equal(isoPortalPulseAlpha(0), 0.35);
    assert.equal(
      isoPortalPulseAlpha(1000),
      0.35 + 0.15 * Math.sin(1000 * 0.003),
    );
  });

  it("locks grain count ranges", () => {
    assert.equal(isoWallBottomPixelCount(seqRng([0])), 18);
    assert.equal(isoWallBottomPixelCount(seqRng([0.999])), 29);
    assert.equal(isoWallSidePixelCount(seqRng([0])), 40);
    assert.equal(isoWallSidePixelCount(seqRng([0.999])), 64);
    assert.equal(isoFloorGrainPixelCount(seqRng([0])), 40);
    assert.equal(isoFloorGrainPixelCount(seqRng([0.999])), 55);
    assert.equal(isoFloorDepthPixelCount(seqRng([0])), 8);
    assert.equal(isoFloorDepthPixelCount(seqRng([0.999])), 12);
  });

  it("floor grain size may consume two rng draws", () => {
    assert.equal(isoFloorGrainPixelSize(seqRng([0.1])), 1);
    assert.equal(isoFloorGrainPixelSize(seqRng([0.5, 0.1])), 2);
    assert.equal(isoFloorGrainPixelSize(seqRng([0.5, 0.9])), 3);
  });

  it("default floor rgb is 176,190,197", () => {
    assert.deepEqual(ISO_FLOOR_DEFAULT_RGB, { r: 176, g: 190, b: 197 });
  });

  it("wall height is 28 (barrierRender layer height)", () => {
    assert.equal(ISO_WALL_HEIGHT, 28);
  });
});

describe("drawIsometricTile characterization", () => {
  it("opens every tile with the top-vertex diamond", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(ctx, 40, 10, "floor", 1, 2, false, true);
    assert.deepEqual(ops.slice(0, 6), [
      { op: "beginPath" },
      { op: "moveTo", x: 40, y: 10 },
      { op: "lineTo", x: 40 + TILE_WIDTH / 2, y: 10 + TILE_HEIGHT / 2 },
      { op: "lineTo", x: 40, y: 10 + TILE_HEIGHT },
      { op: "lineTo", x: 40 - TILE_WIDTH / 2, y: 10 + TILE_HEIGHT / 2 },
      { op: "closePath" },
    ]);
  });

  it("clicked floor fills gold and skips grain", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(
      ctx,
      0,
      0,
      "floor",
      0,
      0,
      false,
      true,
      TILE_WIDTH,
      TILE_HEIGHT,
      { r1: 10, g1: 10, b1: 10, r2: 20, g2: 20, b2: 20 },
    );
    const fills = ops.filter((o) => o.op === "fill");
    assert.equal(fills[0]?.fillStyle, "#ffd700");
    assert.equal(
      ops.some((o) => o.op === "fillRect"),
      false,
    );
    assert.equal(
      ops.some((o) => o.op === "clip"),
      false,
    );
  });

  it("family floor uses seeded lerp, not the 176,190,197 fallback", () => {
    const family = {
      r1: 10,
      g1: 20,
      b1: 30,
      r2: 110,
      g2: 120,
      b2: 130,
    };
    const t = seededRng(isoFloorColorSeed(3, 5))();
    const expected = isoFloorFamilyRgb(family, t);
    const { ctx, ops } = mockCtx();
    drawIsometricTile(
      ctx,
      0,
      0,
      "floor",
      3,
      5,
      false,
      false,
      TILE_WIDTH,
      TILE_HEIGHT,
      family,
    );
    const diamondFill = ops.find((o) => o.op === "fill");
    assert.equal(
      diamondFill?.fillStyle,
      `rgb(${expected.r},${expected.g},${expected.b})`,
    );
    assert.notEqual(
      diamondFill?.fillStyle,
      `rgb(${ISO_FLOOR_DEFAULT_RGB.r},${ISO_FLOOR_DEFAULT_RGB.g},${ISO_FLOOR_DEFAULT_RGB.b})`,
    );
  });

  it("hovered floor overlays rgba(74,222,128,0.22) after the slab", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(ctx, 0, 0, "floor", 0, 0, true, false);
    const fills = ops.filter((o) => o.op === "fill");
    assert.equal(fills.at(-1)?.fillStyle, "rgba(74,222,128,0.22)");
  });

  it("hovered wall uses the live face colors, not family lerp", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(ctx, 10, 20, "wall", 2, 3, true, false);
    const fills = ops.filter((o) => o.op === "fill").map((o) => o.fillStyle);
    assert.equal(fills[0], "rgba(239,68,68,0.4)");
    assert.ok(fills.includes("#555555"));
    assert.ok(fills.includes("#333333"));
    assert.ok(fills.includes("#2a2a2a"));
    assert.ok(fills.includes("#1a1a1a"));
    assert.ok(fills.includes("#777777"));
    assert.equal(
      ops.some((o) => o.op === "fillRect"),
      false,
    );
  });

  it("clicked wall diamond is gold", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(ctx, 0, 0, "wall", 0, 0, false, true);
    const firstFill = ops.find((o) => o.op === "fill");
    assert.equal(firstFill?.fillStyle, "#ffd700");
  });

  it("unhovered wall raises the top face by ISO_WALL_HEIGHT", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(ctx, 40, 80, "wall", 1, 1, true, false);
    const topMove = ops.find(
      (o) => o.op === "moveTo" && o.x === 40 && o.y === 80 - ISO_WALL_HEIGHT,
    );
    assert.ok(topMove);
  });

  it("portal pulse ellipse uses injected nowMs, not Date.now", () => {
    const nowMs = 12_345;
    const { ctx, ops } = mockCtx();
    drawIsometricTile(
      ctx,
      50,
      20,
      "portal",
      0,
      0,
      false,
      false,
      80,
      40,
      undefined,
      undefined,
      nowMs,
    );
    const alpha = ops.find(
      (o) => o.op === "globalAlpha" && o.v !== 1 && o.v !== 1.0,
    );
    assert.equal(alpha?.v, isoPortalPulseAlpha(nowMs));
    const ellipse = ops.find((o) => o.op === "ellipse");
    assert.deepEqual(ellipse, {
      op: "ellipse",
      x: 50,
      y: 20 + 40 / 2,
      rx: 80 / 3,
      ry: 40 / 4,
      rotation: 0,
      start: 0,
      end: Math.PI * 2,
    });
    const fills = ops.filter((o) => o.op === "fill");
    assert.equal(fills[0]?.fillStyle, "#1e1a2e");
  });

  it("hovered portal fills #4a4060; clicked portal fills gold", () => {
    const hover = mockCtx();
    drawIsometricTile(hover.ctx, 0, 0, "portal", 0, 0, true, false);
    assert.equal(hover.ops.find((o) => o.op === "fill")?.fillStyle, "#4a4060");
    const click = mockCtx();
    drawIsometricTile(click.ctx, 0, 0, "portal", 0, 0, true, true);
    assert.equal(click.ops.find((o) => o.op === "fill")?.fillStyle, "#ffd700");
  });

  it("balanced save/restore on a textured family floor", () => {
    const { ctx, ops } = mockCtx();
    drawIsometricTile(
      ctx,
      0,
      0,
      "floor",
      2,
      2,
      false,
      false,
      TILE_WIDTH,
      TILE_HEIGHT,
      { r1: 40, g1: 40, b1: 40, r2: 80, g2: 80, b2: 80 },
    );
    const saves = ops.filter((o) => o.op === "save").length;
    const restores = ops.filter((o) => o.op === "restore").length;
    assert.equal(saves, restores);
    assert.ok(saves >= 1);
  });
});
