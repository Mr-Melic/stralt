import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ROW_SHIMMER_AMPLITUDE,
  ROW_SHIMMER_RATE,
  ROW_SHIMMER_RGB,
  ROW_SHIMMER_ROW_PHASE,
  drawRowShimmerOverlay,
  rowShimmerAlpha,
  rowShimmerFillRgba,
  shouldPaintRowShimmer,
} from "./combatLumaOverlay.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change rate, row phase, amplitude, clamp, or fill rgba.
 * Do not "improve" these.
 */
function legacyAlpha(nowMs: number, rowY: number): number {
  return Math.max(0, Math.sin(nowMs * 0.0008 + rowY * 0.3) * 0.03);
}

type CtxOp = { op: string; [k: string]: unknown };

function mockCtx(): { ctx: CanvasRenderingContext2D; ops: CtxOp[] } {
  const ops: CtxOp[] = [];
  let fillStyle: unknown = "";
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
      ops.push({ op: "stroke" });
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
      ops.push({ op: "fillRect", x, y, w, h });
    },
    createLinearGradient() {
      ops.push({ op: "createLinearGradient" });
      return { addColorStop() {} };
    },
    createRadialGradient() {
      ops.push({ op: "createRadialGradient" });
      return { addColorStop() {} };
    },
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(v: unknown) {
      fillStyle = v;
      ops.push({ op: "fillStyle", v });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, ops };
}

describe("row shimmer constants / alpha", () => {
  it("locks live rate 0.0008, row phase 0.3, amplitude 0.03, white rgb", () => {
    assert.equal(ROW_SHIMMER_RATE, 0.0008);
    assert.equal(ROW_SHIMMER_ROW_PHASE, 0.3);
    assert.equal(ROW_SHIMMER_AMPLITUDE, 0.03);
    assert.equal(ROW_SHIMMER_RGB, "255,255,255");
    assert.notEqual(ROW_SHIMMER_RATE, 0.003);
    assert.notEqual(ROW_SHIMMER_RATE, 0.004);
  });

  it("matches max(0, sin(now*0.0008 + y*0.3)*0.03) for sampled now/row", () => {
    for (const nowMs of [0, 16, 1000, 3333, 12_345]) {
      for (const rowY of [0, 1, 7, 8, 15]) {
        assert.equal(rowShimmerAlpha(nowMs, rowY), legacyAlpha(nowMs, rowY));
      }
    }
  });

  it("clamps the negative sine half to 0; does not abs it", () => {
    // sin(pi) == 0; sin(3pi/2) == -1 → live paints nothing, not 0.03.
    const zeroAt = Math.PI / ROW_SHIMMER_RATE;
    const negAt = (Math.PI * 1.5) / ROW_SHIMMER_RATE;
    assert.ok(rowShimmerAlpha(zeroAt, 0) < 1e-12);
    assert.equal(rowShimmerAlpha(negAt, 0), 0);
    assert.notEqual(rowShimmerAlpha(negAt, 0), ROW_SHIMMER_AMPLITUDE);
    assert.equal(shouldPaintRowShimmer(rowShimmerAlpha(negAt, 0)), false);
  });

  it("peak is +0.03 on the positive half, not 0.06 or 1", () => {
    const peakAt = Math.PI / 2 / ROW_SHIMMER_RATE;
    assert.ok(
      Math.abs(rowShimmerAlpha(peakAt, 0) - ROW_SHIMMER_AMPLITUDE) < 1e-12,
    );
    assert.equal(shouldPaintRowShimmer(rowShimmerAlpha(peakAt, 0)), true);
  });

  it("different rows at the same now do not share alpha", () => {
    const nowMs = 2500;
    assert.notEqual(rowShimmerAlpha(nowMs, 0), rowShimmerAlpha(nowMs, 1));
    assert.equal(rowShimmerAlpha(nowMs, 0), legacyAlpha(nowMs, 0));
    assert.equal(rowShimmerAlpha(nowMs, 1), legacyAlpha(nowMs, 1));
  });
});

describe("shouldPaintRowShimmer / fill rgba", () => {
  it("paints only alpha > 0", () => {
    assert.equal(shouldPaintRowShimmer(0), false);
    assert.equal(shouldPaintRowShimmer(-0.01), false);
    assert.equal(shouldPaintRowShimmer(0.0001), true);
    assert.equal(shouldPaintRowShimmer(0.03), true);
  });

  it("fill interpolates the raw alpha into rgba(255,255,255,alpha)", () => {
    assert.equal(rowShimmerFillRgba(0.012), "rgba(255,255,255,0.012)");
    assert.equal(
      rowShimmerFillRgba(0.03),
      `rgba(255,255,255,${ROW_SHIMMER_AMPLITUDE})`,
    );
  });
});

describe("drawRowShimmerOverlay", () => {
  it("no-ops for 0 and negative alpha (no save/path/fill)", () => {
    for (const alpha of [0, -0.01, -0.03]) {
      const { ctx, ops } = mockCtx();
      drawRowShimmerOverlay(ctx, 40, 10, 80, 40, alpha);
      assert.deepEqual(ops, []);
    }
  });

  it("paints unrounded top/right/bottom/left diamond then white fill", () => {
    const alpha = 0.021;
    const { ctx, ops } = mockCtx();
    drawRowShimmerOverlay(ctx, 40, 10, 80, 40, alpha);
    assert.equal(ops[0]?.op, "save");
    assert.equal(ops.at(-1)?.op, "restore");
    assert.equal(ops.filter((o) => o.op === "save").length, 1);
    assert.equal(ops.filter((o) => o.op === "restore").length, 1);
    assert.deepEqual(ops.slice(1, 7), [
      { op: "beginPath" },
      { op: "moveTo", x: 40, y: 10 },
      { op: "lineTo", x: 80, y: 30 },
      { op: "lineTo", x: 40, y: 50 },
      { op: "lineTo", x: 0, y: 30 },
      { op: "closePath" },
    ]);
    const fill = ops.find((o) => o.op === "fill");
    assert.equal(fill?.fillStyle, rowShimmerFillRgba(alpha));
    assert.equal(ops.filter((o) => o.op === "fill").length, 1);
  });

  it("does not stroke, clip, grain, or emit AO/hover gradients", () => {
    const { ctx, ops } = mockCtx();
    drawRowShimmerOverlay(ctx, 8, 4, 64, 32, 0.015);
    assert.equal(
      ops.filter((o) =>
        [
          "stroke",
          "clip",
          "fillRect",
          "createLinearGradient",
          "createRadialGradient",
          "translate",
          "ellipse",
          "arc",
          "fillText",
        ].includes(o.op as string),
      ).length,
      0,
    );
  });

  it("uses the injected alpha, not Date.now or a second sine", () => {
    const alpha = rowShimmerAlpha(12_345, 3);
    const { ctx, ops } = mockCtx();
    drawRowShimmerOverlay(ctx, 20, 8, 64, 32, alpha);
    if (!shouldPaintRowShimmer(alpha)) {
      assert.deepEqual(ops, []);
      return;
    }
    const fill = ops.find((o) => o.op === "fill");
    assert.equal(fill?.fillStyle, `rgba(255,255,255,${alpha})`);
    assert.equal(fill?.fillStyle, rowShimmerFillRgba(legacyAlpha(12_345, 3)));
  });
});
