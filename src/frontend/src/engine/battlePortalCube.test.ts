import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BATTLE_PORTAL_CUBE_GRAIN_SIDE,
  BATTLE_PORTAL_CUBE_GRAIN_TOP,
  BATTLE_PORTAL_CUBE_HEIGHT,
  PORTAL_CUBE_LCG_A,
  PORTAL_CUBE_LCG_M,
  createPortalCubeRng,
  drawBattlePortalCube,
  drawPortalPixels,
  isDungeonPortalCubeColor,
  portalCubeFaceBounds,
  portalCubePalette,
  portalCubePixelRgb,
  portalCubeSeed,
} from "./battlePortalCube.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change seeds, LCG, grain counts, or dungeon-vs-teal palettes.
 * Do not "improve" these.
 */
function legacyPortalSeed(x: number, y: number): number {
  return x * 127 + y * 311;
}

function legacyNextRng(seed: number): () => number {
  let sv = Math.abs(seed) + 1;
  return () => {
    sv = (sv * 16807) % 2147483647;
    return (sv - 1) / 2147483646;
  };
}

function legacyPixelRgb(
  baseColor: string,
  bright: number,
): { r: number; g: number; b: number } {
  const bParsed = Number.parseInt(baseColor.slice(1), 16);
  return {
    r: Math.min(255, Math.max(0, ((bParsed >> 16) & 0xff) + bright * 30)),
    g: Math.min(255, Math.max(0, ((bParsed >> 8) & 0xff) + bright * 25)),
    b: Math.min(255, Math.max(0, (bParsed & 0xff) + bright * 20)),
  };
}

type CtxOp = { op: string; [k: string]: unknown };

function mockCtx(): { ctx: CanvasRenderingContext2D; ops: CtxOp[] } {
  const ops: CtxOp[] = [];
  let fillStyle: unknown = "";
  let strokeStyle: unknown = "";
  let lineWidth = 1;
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
      ops.push({ op: "fill", fillStyle });
    },
    stroke() {
      ops.push({ op: "stroke", strokeStyle, lineWidth });
    },
    save() {
      ops.push({ op: "save" });
    },
    restore() {
      ops.push({ op: "restore" });
    },
    fillRect(x: number, y: number, w: number, h: number) {
      ops.push({ op: "fillRect", x, y, w, h, fillStyle });
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
      ops.push({ op: "lineWidth", v });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, ops };
}

describe("portalCubeSeed / dungeon gate", () => {
  it("matches x*127 + y*311 including the origin (no abs)", () => {
    for (const [x, y] of [
      [0, 0],
      [8, 8],
      [15, 0],
      [3, 11],
    ] as const) {
      assert.equal(portalCubeSeed(x, y), legacyPortalSeed(x, y));
    }
    assert.equal(portalCubeSeed(0, 0), 0);
    assert.equal(portalCubeSeed(4, 9), 4 * 127 + 9 * 311);
  });

  it("only color === dungeon is the crimson cube", () => {
    assert.equal(isDungeonPortalCubeColor("dungeon"), true);
    for (const color of [
      "blue",
      "boss",
      "bossRush",
      "rest",
      "white",
      "progression",
      "gold",
      "",
    ]) {
      assert.equal(isDungeonPortalCubeColor(color), false);
    }
  });
});

describe("portalCubePalette", () => {
  it("keeps teal faces for every non-dungeon color", () => {
    const teal = portalCubePalette("blue");
    assert.deepEqual(teal, {
      top: "#00CED1",
      right: "#008B8B",
      left: "#006666",
      stroke: "#005a5c",
      front1: "#007a7a",
      front2: "#005c5c",
      rightStroke: "#004444",
      leftStroke: "#003333",
    });
    assert.deepEqual(portalCubePalette("boss"), teal);
    assert.deepEqual(portalCubePalette("rest"), teal);
    assert.deepEqual(portalCubePalette("white"), teal);
    assert.deepEqual(portalCubePalette("bossRush"), teal);
    assert.deepEqual(portalCubePalette("progression"), teal);
    assert.deepEqual(portalCubePalette("unknown"), teal);
  });

  it("dungeon uses crimson fills and distinct per-face strokes", () => {
    const dungeon = portalCubePalette("dungeon");
    assert.deepEqual(dungeon, {
      top: "#8b0000",
      right: "#660000",
      left: "#4a0000",
      stroke: "#2a0000",
      front1: "#550000",
      front2: "#3a0000",
      rightStroke: "#200000",
      leftStroke: "#150000",
    });
    assert.notEqual(dungeon.stroke, dungeon.rightStroke);
    assert.notEqual(dungeon.stroke, dungeon.leftStroke);
    assert.notEqual(dungeon.rightStroke, dungeon.leftStroke);
  });
});

describe("Park–Miller grain rng / pixel rgb", () => {
  it("LCG constants match the live nested nextRng", () => {
    assert.equal(PORTAL_CUBE_LCG_A, 16807);
    assert.equal(PORTAL_CUBE_LCG_M, 2147483647);
  });

  it("first draws match Math.abs(seed)+1 then sv*16807 % 2147483647", () => {
    for (const seed of [0, 1, 127, 4 * 127 + 9 * 311, 99]) {
      const live = legacyNextRng(seed);
      const extracted = createPortalCubeRng(seed);
      for (let i = 0; i < 8; i++) {
        assert.equal(extracted(), live());
      }
    }
  });

  it("pixel rgb matches live parseInt(slice(1)) ±30/±25/±20", () => {
    for (const color of ["#00CED1", "#8b0000", "#008B8B", "#4a0000"]) {
      for (const bright of [1, -1]) {
        assert.deepEqual(
          portalCubePixelRgb(color, bright),
          legacyPixelRgb(color, bright),
        );
      }
    }
    assert.deepEqual(portalCubePixelRgb("#00CED1", 1), {
      r: 30,
      g: 231,
      b: 229,
    });
    assert.deepEqual(portalCubePixelRgb("#00CED1", -1), {
      r: 0,
      g: 181,
      b: 189,
    });
    assert.deepEqual(portalCubePixelRgb("#8b0000", 1), {
      r: 169,
      g: 25,
      b: 20,
    });
    assert.deepEqual(portalCubePixelRgb("#8b0000", -1), {
      r: 109,
      g: 0,
      b: 0,
    });
  });

  it("face bounds are axis-aligned min/max of the polygon verts", () => {
    assert.deepEqual(portalCubeFaceBounds([10, 50, 10, -30], [0, 20, 40, 20]), {
      minX: -30,
      maxX: 50,
      minY: 0,
      maxY: 40,
    });
  });
});

describe("drawPortalPixels characterization", () => {
  it("emits count fillRects with unrounded rng coordinates", () => {
    const { ctx, ops } = mockCtx();
    const xs = [0, 10, 0, -10];
    const ys = [0, 5, 10, 5];
    drawPortalPixels(ctx, 12, "#00CED1", xs, ys, 10);
    const rects = ops.filter((o) => o.op === "fillRect");
    assert.equal(rects.length, 10);

    const rng = legacyNextRng(12);
    const { minX, maxX, minY, maxY } = portalCubeFaceBounds(xs, ys);
    for (let i = 0; i < 10; i++) {
      const px = minX + rng() * (maxX - minX);
      const py = minY + rng() * (maxY - minY);
      const sz = 1 + rng();
      const bright = rng() < 0.5 ? 1 : -1;
      const rgb = legacyPixelRgb("#00CED1", bright);
      assert.deepEqual(rects[i], {
        op: "fillRect",
        x: px,
        y: py,
        w: sz,
        h: sz,
        fillStyle: `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`,
      });
    }
  });

  it("does not wrap grain in save/restore (caller owns the cube save)", () => {
    const { ctx, ops } = mockCtx();
    drawPortalPixels(ctx, 1, "#8b0000", [0, 4], [0, 4], 3);
    assert.equal(
      ops.filter((o) => o.op === "save" || o.op === "restore").length,
      0,
    );
    assert.equal(ops.filter((o) => o.op === "fillRect").length, 3);
  });
});

describe("drawBattlePortalCube characterization", () => {
  it("opens with save and the top diamond, height 28", () => {
    assert.equal(BATTLE_PORTAL_CUBE_HEIGHT, 28);
    assert.equal(BATTLE_PORTAL_CUBE_GRAIN_TOP, 10);
    assert.equal(BATTLE_PORTAL_CUBE_GRAIN_SIDE, 9);

    const { ctx, ops } = mockCtx();
    drawBattlePortalCube(ctx, 40, 10, 80, 40, 1, 2, "blue");
    assert.equal(ops[0]?.op, "save");
    assert.deepEqual(ops.slice(1, 7), [
      { op: "beginPath" },
      { op: "moveTo", x: 40, y: 10 - 28 },
      { op: "lineTo", x: 40 + 40, y: 10 + 20 - 28 },
      { op: "lineTo", x: 40, y: 10 + 40 - 28 },
      { op: "lineTo", x: 40 - 40, y: 10 + 20 - 28 },
      { op: "closePath" },
    ]);
    const topFill = ops.find((o) => o.op === "fill");
    assert.equal(topFill?.fillStyle, "#00CED1");
  });

  it("dungeon top fill is #8b0000; teal top is #00CED1", () => {
    const dungeon = mockCtx();
    drawBattlePortalCube(dungeon.ctx, 0, 0, 80, 40, 0, 0, "dungeon");
    assert.equal(
      dungeon.ops.find((o) => o.op === "fill")?.fillStyle,
      "#8b0000",
    );
    const teal = mockCtx();
    drawBattlePortalCube(teal.ctx, 0, 0, 80, 40, 0, 0, "boss");
    assert.equal(teal.ops.find((o) => o.op === "fill")?.fillStyle, "#00CED1");
  });

  it("top stroke is not the right or left stroke", () => {
    const { ctx, ops } = mockCtx();
    drawBattlePortalCube(ctx, 0, 0, 80, 40, 3, 4, "dungeon");
    const strokes = ops.filter((o) => o.op === "stroke");
    assert.equal(strokes[0]?.strokeStyle, "#2a0000");
    assert.equal(strokes[0]?.lineWidth, 0.5);
    assert.equal(strokes[1]?.strokeStyle, "#200000");
    assert.equal(strokes[2]?.strokeStyle, "#150000");
    const seam = strokes.at(-1);
    assert.equal(seam?.strokeStyle, "#000000");
    assert.equal(seam?.lineWidth, 1.5);
  });

  it("paints 10+9+9 grain rects and no grain on the front faces", () => {
    const { ctx, ops } = mockCtx();
    drawBattlePortalCube(ctx, 40, 10, 80, 40, 2, 5, "blue");
    const rects = ops.filter((o) => o.op === "fillRect");
    assert.equal(
      rects.length,
      BATTLE_PORTAL_CUBE_GRAIN_TOP + BATTLE_PORTAL_CUBE_GRAIN_SIDE * 2,
    );
    const fills = ops.filter((o) => o.op === "fill");
    // top + right + left + two front faces
    assert.equal(fills.length, 5);
  });

  it("seeds the three faces as seed, seed+1, seed+2", () => {
    const gridX = 6;
    const gridY = 7;
    const seed = portalCubeSeed(gridX, gridY);
    const { ctx, ops } = mockCtx();
    drawBattlePortalCube(ctx, 20, 8, 64, 32, gridX, gridY, "blue");
    const rects = ops.filter((o) => o.op === "fillRect");
    const firstTop = rects[0];
    const firstRight = rects[BATTLE_PORTAL_CUBE_GRAIN_TOP];
    const firstLeft =
      rects[BATTLE_PORTAL_CUBE_GRAIN_TOP + BATTLE_PORTAL_CUBE_GRAIN_SIDE];

    const topRng = legacyNextRng(seed);
    const topPx = 20 - 32 + topRng() * 64;
    assert.equal(firstTop?.x, topPx);

    const rightRng = legacyNextRng(seed + 1);
    const rightPx = 20 + rightRng() * 32;
    assert.equal(firstRight?.x, rightPx);

    const leftRng = legacyNextRng(seed + 2);
    const leftPx = 20 - 32 + leftRng() * 32;
    assert.equal(firstLeft?.x, leftPx);
  });

  it("does not translate, ellipse, or draw whirlpool glyphs", () => {
    const { ctx, ops } = mockCtx();
    drawBattlePortalCube(ctx, 0, 0, 80, 40, 1, 1, "dungeon");
    assert.equal(
      ops.filter((o) =>
        ["translate", "ellipse", "arc", "clip", "fillText"].includes(
          o.op as string,
        ),
      ).length,
      0,
    );
  });

  it("balances a single save/restore around the cube", () => {
    for (const color of ["blue", "dungeon", "boss", "rest"] as const) {
      const { ctx, ops } = mockCtx();
      drawBattlePortalCube(ctx, 0, 0, 80, 40, 2, 2, color);
      const saves = ops.filter((o) => o.op === "save").length;
      const restores = ops.filter((o) => o.op === "restore").length;
      assert.equal(saves, restores);
      assert.equal(saves, 1);
      assert.equal(ops.at(-1)?.op, "restore");
    }
  });
});
