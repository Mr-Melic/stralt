import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HOVER_GLOW_OUTER,
  HOVER_PULSE_AMP,
  HOVER_PULSE_BASE,
  HOVER_PULSE_RATE,
  RANGE_TILE_LINE_WIDTH,
  SPELL_RANGE_FILL,
  SPELL_RANGE_STROKE,
  WALK_TILE_FILL,
  WALK_TILE_STROKE,
  drawFloorHoverGlow,
  drawSpellRangeOverlay,
  drawWalkTileOverlay,
  floorHoverGlowRgb,
  floorHoverInnerRgba,
  floorHoverPulseAlpha,
  isoTileDiamondVertices,
  traceIsoTileDiamond,
} from "./combatTileOverlay.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change colors, pulse, diamond verts, or hover radius.
 * Do not "improve" these.
 */
function legacyPulse(nowMs: number): number {
  return 0.12 + Math.sin(nowMs * 0.003) * 0.05;
}

function legacyHoverRgb(
  isSpellHover: boolean,
  isMpHover: boolean,
): { r: number; g: number; b: number } {
  return {
    r: isSpellHover ? 100 : isMpHover ? 0 : 255,
    g: isSpellHover ? 150 : isMpHover ? 255 : 255,
    b: isSpellHover ? 255 : isMpHover ? 100 : 200,
  };
}

function legacyDiamond(
  x: number,
  y: number,
  tw: number,
  th: number,
): { x: number; y: number }[] {
  return [
    { x, y },
    { x: x + tw / 2, y: y + th / 2 },
    { x, y: y + th },
    { x: x - tw / 2, y: y + th / 2 },
  ];
}

type CtxOp = { op: string; [k: string]: unknown };

function mockCtx(): { ctx: CanvasRenderingContext2D; ops: CtxOp[] } {
  const ops: CtxOp[] = [];
  let fillStyle: unknown = "";
  let strokeStyle: unknown = "";
  let lineWidth = 1;
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
      ops.push({ op: "stroke", strokeStyle, lineWidth });
    },
    save() {
      ops.push({ op: "save" });
    },
    restore() {
      ops.push({ op: "restore" });
    },
    createRadialGradient(
      x0: number,
      y0: number,
      r0: number,
      x1: number,
      y1: number,
      r1: number,
    ) {
      ops.push({ op: "createRadialGradient", x0, y0, r0, x1, y1, r1 });
      return gradient;
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

describe("iso tile diamond", () => {
  it("matches live top/right/bottom/left verts without rounding", () => {
    for (const [x, y, tw, th] of [
      [40, 10, 80, 40],
      [0, 0, 64, 32],
      [12.5, 3, 70, 35],
    ] as const) {
      assert.deepEqual(
        isoTileDiamondVertices(x, y, tw, th),
        legacyDiamond(x, y, tw, th),
      );
    }
  });

  it("traces begin/move/line/line/line/close in that order", () => {
    const { ctx, ops } = mockCtx();
    traceIsoTileDiamond(ctx, 40, 10, 80, 40);
    assert.deepEqual(ops, [
      { op: "beginPath" },
      { op: "moveTo", x: 40, y: 10 },
      { op: "lineTo", x: 80, y: 30 },
      { op: "lineTo", x: 40, y: 50 },
      { op: "lineTo", x: 0, y: 30 },
      { op: "closePath" },
    ]);
  });
});

describe("walk / spell overlay colors", () => {
  it("locks the live green MP and blue spell rgba plus 1.5 stroke", () => {
    assert.equal(WALK_TILE_FILL, "rgba(0,200,80,0.35)");
    assert.equal(WALK_TILE_STROKE, "rgba(0,220,100,0.8)");
    assert.equal(SPELL_RANGE_FILL, "rgba(30,100,255,0.35)");
    assert.equal(SPELL_RANGE_STROKE, "rgba(60,140,255,0.85)");
    assert.equal(RANGE_TILE_LINE_WIDTH, 1.5);
    assert.notEqual(WALK_TILE_FILL, SPELL_RANGE_FILL);
    assert.notEqual(WALK_TILE_STROKE, SPELL_RANGE_STROKE);
  });
});

describe("drawWalkTileOverlay / drawSpellRangeOverlay", () => {
  it("walk fills green then strokes green at 1.5 inside one save/restore", () => {
    const { ctx, ops } = mockCtx();
    drawWalkTileOverlay(ctx, 40, 10, 80, 40);
    assert.equal(ops[0]?.op, "save");
    assert.equal(ops.at(-1)?.op, "restore");
    assert.equal(ops.filter((o) => o.op === "save").length, 1);
    assert.equal(ops.filter((o) => o.op === "restore").length, 1);
    const fill = ops.find((o) => o.op === "fill");
    const stroke = ops.find((o) => o.op === "stroke");
    assert.equal(fill?.fillStyle, WALK_TILE_FILL);
    assert.equal(stroke?.strokeStyle, WALK_TILE_STROKE);
    assert.equal(stroke?.lineWidth, 1.5);
    assert.equal(ops.filter((o) => o.op === "createRadialGradient").length, 0);
  });

  it("spell fills blue then strokes blue; walk and spell do not share fill", () => {
    const walk = mockCtx();
    drawWalkTileOverlay(walk.ctx, 0, 0, 64, 32);
    const spell = mockCtx();
    drawSpellRangeOverlay(spell.ctx, 0, 0, 64, 32);
    assert.equal(
      walk.ops.find((o) => o.op === "fill")?.fillStyle,
      WALK_TILE_FILL,
    );
    assert.equal(
      spell.ops.find((o) => o.op === "fill")?.fillStyle,
      SPELL_RANGE_FILL,
    );
    assert.equal(
      spell.ops.find((o) => o.op === "stroke")?.strokeStyle,
      SPELL_RANGE_STROKE,
    );
    assert.notEqual(
      walk.ops.find((o) => o.op === "fill")?.fillStyle,
      spell.ops.find((o) => o.op === "fill")?.fillStyle,
    );
  });

  it("does not emit whirlpool, grain, or clip ops", () => {
    const { ctx, ops } = mockCtx();
    drawWalkTileOverlay(ctx, 8, 4, 80, 40);
    drawSpellRangeOverlay(ctx, 8, 4, 80, 40);
    assert.equal(
      ops.filter((o) =>
        [
          "translate",
          "ellipse",
          "arc",
          "clip",
          "fillText",
          "fillRect",
        ].includes(o.op as string),
      ).length,
      0,
    );
  });
});

describe("floor hover glow", () => {
  it("pulse matches 0.12 + sin(now*0.003)*0.05", () => {
    assert.equal(HOVER_PULSE_BASE, 0.12);
    assert.equal(HOVER_PULSE_AMP, 0.05);
    assert.equal(HOVER_PULSE_RATE, 0.003);
    for (const nowMs of [0, 16, 1000, 3333]) {
      assert.equal(floorHoverPulseAlpha(nowMs), legacyPulse(nowMs));
    }
  });

  it("spell RGB wins over MP; default is cream 255,255,200", () => {
    assert.deepEqual(floorHoverGlowRgb(true, false), {
      r: 100,
      g: 150,
      b: 255,
    });
    assert.deepEqual(floorHoverGlowRgb(false, true), { r: 0, g: 255, b: 100 });
    assert.deepEqual(floorHoverGlowRgb(false, false), {
      r: 255,
      g: 255,
      b: 200,
    });
    assert.deepEqual(floorHoverGlowRgb(true, true), { r: 100, g: 150, b: 255 });
    for (const spell of [true, false]) {
      for (const mp of [true, false]) {
        assert.deepEqual(
          floorHoverGlowRgb(spell, mp),
          legacyHoverRgb(spell, mp),
        );
      }
    }
  });

  it("inner stop interpolates the pulse alpha; outer is rgba(0,0,0,0)", () => {
    assert.equal(HOVER_GLOW_OUTER, "rgba(0,0,0,0)");
    assert.equal(
      floorHoverInnerRgba({ r: 100, g: 150, b: 255 }, 0.17),
      "rgba(100,150,255,0.17)",
    );
  });

  it("radial center is tile mid-diamond; radius is tw/2 not th/2", () => {
    const { ctx, ops } = mockCtx();
    drawFloorHoverGlow(ctx, 40, 10, 80, 40, false, true, 0);
    const grad = ops.find((o) => o.op === "createRadialGradient");
    assert.deepEqual(grad, {
      op: "createRadialGradient",
      x0: 40,
      y0: 10 + 20,
      r0: 0,
      x1: 40,
      y1: 10 + 20,
      r1: 40,
    });
    assert.equal(grad?.r1, 80 / 2);
    assert.notEqual(grad?.r1, 40 / 2);
  });

  it("writes inner pulse stop then transparent black; no stroke", () => {
    const nowMs = 2500;
    const { ctx, ops } = mockCtx();
    drawFloorHoverGlow(ctx, 20, 8, 64, 32, true, false, nowMs);
    const stops = ops.filter((o) => o.op === "addColorStop");
    assert.deepEqual(stops, [
      {
        op: "addColorStop",
        offset: 0,
        color: floorHoverInnerRgba(
          floorHoverGlowRgb(true, false),
          legacyPulse(nowMs),
        ),
      },
      { op: "addColorStop", offset: 1, color: HOVER_GLOW_OUTER },
    ]);
    assert.equal(ops.filter((o) => o.op === "stroke").length, 0);
    assert.equal(ops[0]?.op, "save");
    assert.equal(ops.at(-1)?.op, "restore");
  });
});
