import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AO_SHADE_INNER,
  AO_SHADE_OUTER,
  AO_SHADE_REACH_PX,
  SHADE_AO_BIT_LEFT,
  SHADE_AO_BIT_RIGHT,
  SHADE_AO_BIT_TOP_LEFT,
  SHADE_AO_BIT_TOP_RIGHT,
  aoLeftGradient,
  aoRightGradient,
  drawFloorOcclusionShade,
  shouldShadeAoLeft,
  shouldShadeAoRight,
} from "./shadeFloorOcclusion.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change bits, rgba, reach, or gradient endpoints.
 * Do not "improve" these.
 */
function legacyShouldRight(bits: number): boolean {
  return (bits & 4) !== 0;
}

function legacyShouldLeft(bits: number): boolean {
  return (bits & 8) !== 0;
}

function legacyRightGradient(
  x: number,
  y: number,
  tw: number,
  th: number,
): { x0: number; y0: number; x1: number; y1: number } {
  return {
    x0: x + tw / 2,
    y0: y + th / 2,
    x1: x + tw / 2 - 8,
    y1: y + th / 2,
  };
}

function legacyLeftGradient(
  x: number,
  y: number,
  tw: number,
  th: number,
): { x0: number; y0: number; x1: number; y1: number } {
  return {
    x0: x - tw / 2,
    y0: y + th / 2,
    x1: x - tw / 2 + 8,
    y1: y + th / 2,
  };
}

type CtxOp = { op: string; [k: string]: unknown };

function mockCtx(): { ctx: CanvasRenderingContext2D; ops: CtxOp[] } {
  const ops: CtxOp[] = [];
  let fillStyle: unknown = "";
  const gradient = {
    addColorStop(offset: number, color: string) {
      ops.push({ op: "addColorStop", offset, color });
    },
  };
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
    createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
      ops.push({ op: "createLinearGradient", x0, y0, x1, y1 });
      return gradient;
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

describe("AO shade bit gates", () => {
  it("locks live bit values 1/2 unused, 4 right, 8 left", () => {
    assert.equal(SHADE_AO_BIT_TOP_RIGHT, 1);
    assert.equal(SHADE_AO_BIT_TOP_LEFT, 2);
    assert.equal(SHADE_AO_BIT_RIGHT, 4);
    assert.equal(SHADE_AO_BIT_LEFT, 8);
    assert.equal(SHADE_AO_BIT_RIGHT | SHADE_AO_BIT_LEFT, 12);
  });

  it("shades only bits 4 and 8; bits 1/2 stay dark", () => {
    assert.equal(shouldShadeAoRight(0), false);
    assert.equal(shouldShadeAoLeft(0), false);
    assert.equal(shouldShadeAoRight(SHADE_AO_BIT_TOP_RIGHT), false);
    assert.equal(shouldShadeAoLeft(SHADE_AO_BIT_TOP_RIGHT), false);
    assert.equal(shouldShadeAoRight(SHADE_AO_BIT_TOP_LEFT), false);
    assert.equal(shouldShadeAoLeft(SHADE_AO_BIT_TOP_LEFT), false);
    assert.equal(
      shouldShadeAoRight(SHADE_AO_BIT_TOP_RIGHT | SHADE_AO_BIT_TOP_LEFT),
      false,
    );
    assert.equal(
      shouldShadeAoLeft(SHADE_AO_BIT_TOP_RIGHT | SHADE_AO_BIT_TOP_LEFT),
      false,
    );
    assert.equal(shouldShadeAoRight(SHADE_AO_BIT_RIGHT), true);
    assert.equal(shouldShadeAoLeft(SHADE_AO_BIT_RIGHT), false);
    assert.equal(shouldShadeAoRight(SHADE_AO_BIT_LEFT), false);
    assert.equal(shouldShadeAoLeft(SHADE_AO_BIT_LEFT), true);
    assert.equal(
      shouldShadeAoRight(SHADE_AO_BIT_RIGHT | SHADE_AO_BIT_LEFT),
      true,
    );
    assert.equal(
      shouldShadeAoLeft(SHADE_AO_BIT_RIGHT | SHADE_AO_BIT_LEFT),
      true,
    );
    for (const bits of [0, 1, 2, 3, 4, 8, 5, 12, 15, 255]) {
      assert.equal(shouldShadeAoRight(bits), legacyShouldRight(bits));
      assert.equal(shouldShadeAoLeft(bits), legacyShouldLeft(bits));
    }
  });
});

describe("AO shade constants / endpoints", () => {
  it("locks inner 0.22, outer transparent, 8px X reach", () => {
    assert.equal(AO_SHADE_INNER, "rgba(0,0,0,0.22)");
    assert.equal(AO_SHADE_OUTER, "rgba(0,0,0,0)");
    assert.equal(AO_SHADE_REACH_PX, 8);
  });

  it("right gradient matches live x+tw/2 inward 8px at mid-diamond Y", () => {
    for (const [x, y, tw, th] of [
      [40, 10, 80, 40],
      [0, 0, 64, 32],
      [12.5, 3, 70, 35],
    ] as const) {
      assert.deepEqual(
        aoRightGradient(x, y, tw, th),
        legacyRightGradient(x, y, tw, th),
      );
      const g = aoRightGradient(x, y, tw, th);
      assert.equal(g.y0, y + th / 2);
      assert.equal(g.y1, g.y0);
      assert.equal(g.x0 - g.x1, 8);
      assert.notEqual(g.y0, y + tw / 2);
    }
  });

  it("left gradient matches live x-tw/2 inward 8px; Y is th/2 not tw/2", () => {
    for (const [x, y, tw, th] of [
      [40, 10, 80, 40],
      [8, 4, 64, 32],
    ] as const) {
      assert.deepEqual(
        aoLeftGradient(x, y, tw, th),
        legacyLeftGradient(x, y, tw, th),
      );
      const g = aoLeftGradient(x, y, tw, th);
      assert.equal(g.y0, y + th / 2);
      assert.equal(g.x1 - g.x0, 8);
      assert.notEqual(g.x0, aoRightGradient(x, y, tw, th).x0);
    }
  });
});

describe("drawFloorOcclusionShade", () => {
  it("no-ops for 0 and unused iso-up bits 1/2", () => {
    for (const bits of [0, 1, 2, 3]) {
      const { ctx, ops } = mockCtx();
      drawFloorOcclusionShade(ctx, 40, 10, 80, 40, bits);
      assert.deepEqual(ops, []);
    }
  });

  it("right bit paints one linear gradient then the unrounded diamond", () => {
    const { ctx, ops } = mockCtx();
    drawFloorOcclusionShade(ctx, 40, 10, 80, 40, SHADE_AO_BIT_RIGHT);
    assert.equal(ops[0]?.op, "save");
    assert.equal(ops.at(-1)?.op, "restore");
    assert.equal(ops.filter((o) => o.op === "save").length, 1);
    assert.equal(ops.filter((o) => o.op === "restore").length, 1);
    assert.deepEqual(
      ops.find((o) => o.op === "createLinearGradient"),
      {
        op: "createLinearGradient",
        x0: 40 + 40,
        y0: 10 + 20,
        x1: 40 + 40 - 8,
        y1: 10 + 20,
      },
    );
    const stops = ops.filter((o) => o.op === "addColorStop");
    assert.deepEqual(stops, [
      { op: "addColorStop", offset: 0, color: AO_SHADE_INNER },
      { op: "addColorStop", offset: 1, color: AO_SHADE_OUTER },
    ]);
    const pathStart = ops.findIndex((o) => o.op === "beginPath");
    assert.deepEqual(ops.slice(pathStart, pathStart + 6), [
      { op: "beginPath" },
      { op: "moveTo", x: 40, y: 10 },
      { op: "lineTo", x: 80, y: 30 },
      { op: "lineTo", x: 40, y: 50 },
      { op: "lineTo", x: 0, y: 30 },
      { op: "closePath" },
    ]);
    assert.equal(ops.filter((o) => o.op === "fill").length, 1);
    assert.equal(ops.filter((o) => o.op === "stroke").length, 0);
    assert.equal(ops.filter((o) => o.op === "createRadialGradient").length, 0);
  });

  it("left bit uses the opposite X inward fade; independent of right", () => {
    const { ctx, ops } = mockCtx();
    drawFloorOcclusionShade(ctx, 40, 10, 80, 40, SHADE_AO_BIT_LEFT);
    assert.deepEqual(
      ops.find((o) => o.op === "createLinearGradient"),
      {
        op: "createLinearGradient",
        x0: 40 - 40,
        y0: 10 + 20,
        x1: 40 - 40 + 8,
        y1: 10 + 20,
      },
    );
    assert.equal(ops.filter((o) => o.op === "save").length, 1);
  });

  it("bits 4|8 paint right then left as two save/restore pairs", () => {
    const { ctx, ops } = mockCtx();
    drawFloorOcclusionShade(
      ctx,
      20,
      8,
      64,
      32,
      SHADE_AO_BIT_RIGHT | SHADE_AO_BIT_LEFT,
    );
    const grads = ops.filter((o) => o.op === "createLinearGradient");
    assert.equal(grads.length, 2);
    assert.deepEqual(grads[0], {
      op: "createLinearGradient",
      ...aoRightGradient(20, 8, 64, 32),
    });
    assert.deepEqual(grads[1], {
      op: "createLinearGradient",
      ...aoLeftGradient(20, 8, 64, 32),
    });
    assert.equal(ops.filter((o) => o.op === "save").length, 2);
    assert.equal(ops.filter((o) => o.op === "restore").length, 2);
    assert.equal(ops.filter((o) => o.op === "fill").length, 2);
    assert.equal(ops[0]?.op, "save");
    assert.equal(ops.at(-1)?.op, "restore");
  });

  it("does not emit whirlpool, grain, clip, or hover-radial ops", () => {
    const { ctx, ops } = mockCtx();
    drawFloorOcclusionShade(
      ctx,
      8,
      4,
      80,
      40,
      SHADE_AO_BIT_RIGHT | SHADE_AO_BIT_LEFT | SHADE_AO_BIT_TOP_RIGHT,
    );
    assert.equal(
      ops.filter((o) =>
        [
          "translate",
          "ellipse",
          "arc",
          "clip",
          "fillText",
          "fillRect",
          "createRadialGradient",
        ].includes(o.op as string),
      ).length,
      0,
    );
    // Unused bit 1 must not add a third shade.
    assert.equal(ops.filter((o) => o.op === "createLinearGradient").length, 2);
  });
});
