import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PIXEL_PATTERN_CELL_SIZE,
  drawPixelPattern,
  pixelPatternCellColor,
  pixelPatternOrigin,
} from "./pixelPattern.ts";

type CtxCall = { op: string; args: unknown[] };

function recordingCtx(): {
  ctx: CanvasRenderingContext2D;
  calls: CtxCall[];
} {
  const calls: CtxCall[] = [];
  const ctx: {
    fillStyle: string;
    save: (...args: unknown[]) => void;
    restore: (...args: unknown[]) => void;
    fillRect: (...args: unknown[]) => void;
  } = {
    fillStyle: "",
    save: (...args: unknown[]) => {
      calls.push({ op: "save", args });
    },
    restore: (...args: unknown[]) => {
      calls.push({ op: "restore", args });
    },
    fillRect: (...args: unknown[]) => {
      calls.push({ op: "fillRect", args: [ctx.fillStyle, ...args] });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

function ops(calls: CtxCall[]): string[] {
  return calls.map((c) => c.op);
}

const COLORS = {
  primary: "#111111",
  secondary: "#222222",
  accent: "#333333",
  extra: "#444444",
};

describe("pixelPatternOrigin", () => {
  it("uses 3px cells and Math.round centering", () => {
    assert.equal(PIXEL_PATTERN_CELL_SIZE, 3);
    const pattern = [
      [1, 1],
      [1, 1],
    ];
    // 2×2 cells → 6×6 px; center at (10, 20) → start (7, 17)
    assert.deepEqual(pixelPatternOrigin(pattern, 10, 20), {
      startX: 7,
      startY: 17,
      pixelSize: 3,
      patternWidth: 6,
      patternHeight: 6,
    });
  });

  it("applies scale to width/height before rounding the origin", () => {
    const pattern = [[1, 1, 1, 1]];
    // 4×1 cells at 2× scale → 24×6 px; center (0, 0) → (-12, -3)
    assert.deepEqual(pixelPatternOrigin(pattern, 0, 0, { x: 2, y: 2 }), {
      startX: -12,
      startY: -3,
      pixelSize: 3,
      patternWidth: 24,
      patternHeight: 6,
    });
  });

  it("defaults scale to 1×1 when omitted", () => {
    const pattern = [[1]];
    assert.deepEqual(
      pixelPatternOrigin(pattern, 5, 5),
      pixelPatternOrigin(pattern, 5, 5, { x: 1, y: 1 }),
    );
  });
});

describe("pixelPatternCellColor", () => {
  it("skips zeros and maps 1/2/3 to secondary/accent/extra", () => {
    assert.equal(pixelPatternCellColor(0, COLORS), null);
    assert.equal(pixelPatternCellColor(1, COLORS), COLORS.secondary);
    assert.equal(pixelPatternCellColor(2, COLORS), COLORS.accent);
    assert.equal(pixelPatternCellColor(3, COLORS), COLORS.extra);
  });

  it("paints 3 as primary when extra is missing, and other non-zero as primary", () => {
    const noExtra = {
      primary: "#111111",
      secondary: "#222222",
      accent: "#333333",
    };
    assert.equal(pixelPatternCellColor(3, noExtra), noExtra.primary);
    assert.equal(pixelPatternCellColor(4, COLORS), COLORS.primary);
    assert.equal(pixelPatternCellColor(-1, COLORS), COLORS.primary);
  });
});

describe("drawPixelPattern", () => {
  it("pops canvas state with restore and never save", () => {
    const { ctx, calls } = recordingCtx();
    drawPixelPattern(ctx, [[1]], 0, 0, COLORS);
    assert.equal(ops(calls).filter((op) => op === "save").length, 0);
    assert.equal(ops(calls).filter((op) => op === "restore").length, 1);
    assert.equal(ops(calls).at(-1), "restore");
  });

  it("skips transparent cells and fills the rest at rounded origin + ceil size", () => {
    const { ctx, calls } = recordingCtx();
    const pattern = [
      [0, 1],
      [2, 3],
    ];
    drawPixelPattern(ctx, pattern, 10, 20, COLORS);
    const origin = pixelPatternOrigin(pattern, 10, 20);
    const rects = calls.filter((c) => c.op === "fillRect");
    assert.equal(rects.length, 3, "the zero cell must not fill");
    assert.deepEqual(rects[0]?.args, [
      COLORS.secondary,
      Math.round(origin.startX + 1 * origin.pixelSize),
      Math.round(origin.startY + 0 * origin.pixelSize),
      Math.ceil(origin.pixelSize),
      Math.ceil(origin.pixelSize),
    ]);
    assert.deepEqual(rects[1]?.args, [
      COLORS.accent,
      Math.round(origin.startX + 0 * origin.pixelSize),
      Math.round(origin.startY + 1 * origin.pixelSize),
      Math.ceil(origin.pixelSize),
      Math.ceil(origin.pixelSize),
    ]);
    assert.deepEqual(rects[2]?.args, [
      COLORS.extra,
      Math.round(origin.startX + 1 * origin.pixelSize),
      Math.round(origin.startY + 1 * origin.pixelSize),
      Math.ceil(origin.pixelSize),
      Math.ceil(origin.pixelSize),
    ]);
  });

  it("uses secondary, accent, extra, then primary for 1/2/3/other in fill order", () => {
    const { ctx, calls } = recordingCtx();
    drawPixelPattern(ctx, [[1, 2, 3, 9]], 0, 0, COLORS);
    assert.deepEqual(
      calls.filter((c) => c.op === "fillRect").map((c) => c.args[0]),
      [COLORS.secondary, COLORS.accent, COLORS.extra, COLORS.primary],
    );
  });

  it("ceils scaled cell size and still restores once", () => {
    const { ctx, calls } = recordingCtx();
    drawPixelPattern(ctx, [[1]], 0, 0, COLORS, { x: 1.5, y: 2 });
    const rect = calls.find((c) => c.op === "fillRect");
    assert.deepEqual(rect?.args.slice(3), [
      Math.ceil(3 * 1.5),
      Math.ceil(3 * 2),
    ]);
    assert.equal(ops(calls).filter((op) => op === "restore").length, 1);
    assert.equal(ops(calls).filter((op) => op === "save").length, 0);
  });
});
