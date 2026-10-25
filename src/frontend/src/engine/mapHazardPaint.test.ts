import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { seededRng } from "./combatMath.ts";
import {
  drawHazardOverlay,
  hazardBaseTintRgba,
  hazardIceGrainRgb,
  hazardLavaGrainRgb,
  hazardLavaPulse,
  hazardOverlayGrainCount,
  hazardOverlaySeed,
  hazardSpikeGrainRgb,
  shouldPaintHazardOverlay,
} from "./mapHazardPaint.ts";

/**
 * Legacy WorldExploration formulas copied here so the extraction cannot
 * silently change seeds, tints, grain range, extra rng draws, or lava pulse.
 * Do not "improve" these.
 */
function legacyOverlaySeed(
  gridX: number,
  gridY: number,
  mapIdFirstCharCode: number,
): number {
  return Math.abs(gridX * 7331 + gridY * 5003 + mapIdFirstCharCode);
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
  let globalAlpha = 1;
  let font = "";
  let textAlign = "";
  let textBaseline = "";
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
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(v: unknown) {
      fillStyle = v;
      ops.push({ op: "fillStyle", v });
    },
    get globalAlpha() {
      return globalAlpha;
    },
    set globalAlpha(v: number) {
      globalAlpha = v;
      ops.push({ op: "globalAlpha", v });
    },
    get font() {
      return font;
    },
    set font(v: string) {
      font = v;
      ops.push({ op: "font", v });
    },
    get textAlign() {
      return textAlign;
    },
    set textAlign(v: string) {
      textAlign = v;
      ops.push({ op: "textAlign", v });
    },
    get textBaseline() {
      return textBaseline;
    },
    set textBaseline(v: string) {
      textBaseline = v;
      ops.push({ op: "textBaseline", v });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, ops };
}

describe("shouldPaintHazardOverlay", () => {
  it("paints floor lava/ice/spikes when the tile is not clicked", () => {
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "floor",
        hazardType: "lava",
        isClicked: false,
      }),
      true,
    );
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "floor",
        hazardType: "ice",
        isClicked: false,
      }),
      true,
    );
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "floor",
        hazardType: "spikes",
        isClicked: false,
      }),
      true,
    );
  });

  it("skips walls, portals, missing kinds, and clicked tiles", () => {
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "wall",
        hazardType: "lava",
        isClicked: false,
      }),
      false,
    );
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "portal",
        hazardType: "lava",
        isClicked: false,
      }),
      false,
    );
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "floor",
        hazardType: undefined,
        isClicked: false,
      }),
      false,
    );
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "floor",
        hazardType: "",
        isClicked: false,
      }),
      false,
    );
    assert.equal(
      shouldPaintHazardOverlay({
        tileType: "floor",
        hazardType: "lava",
        isClicked: true,
      }),
      false,
    );
  });
});

describe("hazardOverlaySeed / grain count / tints", () => {
  it("matches the live seed polynomial including map-id charCodeAt(0)", () => {
    const mapCode = "m".charCodeAt(0);
    for (const [gx, gy] of [
      [0, 0],
      [8, 8],
      [15, 0],
      [3, 11],
    ] as const) {
      assert.equal(
        hazardOverlaySeed(gx, gy, mapCode),
        legacyOverlaySeed(gx, gy, mapCode),
      );
    }
    assert.equal(
      hazardOverlaySeed(4, 9, 65),
      Math.abs(4 * 7331 + 9 * 5003 + 65),
    );
  });

  it("grain count is floor(rng*21)+30 (30–50)", () => {
    assert.equal(hazardOverlayGrainCount(seqRng([0])), 30);
    assert.equal(hazardOverlayGrainCount(seqRng([0.999])), 50);
  });

  it("tints lava, ice, and every other kind (including spike vs spikes)", () => {
    assert.equal(hazardBaseTintRgba("lava"), "rgba(180,30,0,0.68)");
    assert.equal(hazardBaseTintRgba("ice"), "rgba(100,200,255,0.55)");
    assert.equal(hazardBaseTintRgba("spikes"), "rgba(40,40,40,0.72)");
    assert.equal(hazardBaseTintRgba("spike"), "rgba(40,40,40,0.72)");
    assert.equal(hazardBaseTintRgba("poison"), "rgba(40,40,40,0.72)");
    assert.equal(hazardBaseTintRgba("fire"), "rgba(40,40,40,0.72)");
    assert.equal(hazardBaseTintRgba("void"), "rgba(40,40,40,0.72)");
  });
});

describe("hazard grain rgb / lava pulse", () => {
  it("lava hot path is 255,220,20 and ignores shade", () => {
    assert.deepEqual(hazardLavaGrainRgb(-20, true), { r: 255, g: 220, b: 20 });
    assert.deepEqual(hazardLavaGrainRgb(40, true), { r: 255, g: 220, b: 20 });
  });

  it("lava cool path uses abs(shade) on red and floors green at 0", () => {
    assert.deepEqual(hazardLavaGrainRgb(-20, false), { r: 180, g: 10, b: 0 });
    assert.deepEqual(hazardLavaGrainRgb(40, false), { r: 200, g: 70, b: 0 });
    assert.deepEqual(hazardLavaGrainRgb(100, false), { r: 255, g: 130, b: 0 });
    assert.deepEqual(hazardLavaGrainRgb(-40, false), { r: 200, g: 0, b: 0 });
  });

  it("ice uses min(255, 200+shade) then max(180, bv-20) / max(220, bv) / 255", () => {
    assert.deepEqual(hazardIceGrainRgb(-20), { r: 180, g: 220, b: 255 });
    assert.deepEqual(hazardIceGrainRgb(0), { r: 180, g: 220, b: 255 });
    assert.deepEqual(hazardIceGrainRgb(40), { r: 220, g: 240, b: 255 });
    assert.deepEqual(hazardIceGrainRgb(60), { r: 235, g: 255, b: 255 });
  });

  it("spikes tip is 170; body is max(30, 60+shade)", () => {
    assert.deepEqual(hazardSpikeGrainRgb(-40, true), {
      r: 170,
      g: 170,
      b: 170,
    });
    assert.deepEqual(hazardSpikeGrainRgb(-40, false), { r: 30, g: 30, b: 30 });
    assert.deepEqual(hazardSpikeGrainRgb(10, false), { r: 70, g: 70, b: 70 });
  });

  it("lava pulse is 0.6 + 0.4 * sin(nowMs * 0.004 + hSeed)", () => {
    assert.equal(hazardLavaPulse(0, 0), 0.6);
    assert.equal(
      hazardLavaPulse(1000, 12),
      0.6 + 0.4 * Math.sin(1000 * 0.004 + 12),
    );
  });
});

describe("drawHazardOverlay characterization", () => {
  it("opens with save + top-vertex diamond clip, then the kind tint", () => {
    const { ctx, ops } = mockCtx();
    drawHazardOverlay(ctx, 40, 10, "lava", 1, 2, 65, 80, 40, 0);
    assert.equal(ops[0]?.op, "save");
    assert.deepEqual(ops.slice(1, 7), [
      { op: "beginPath" },
      { op: "moveTo", x: 40, y: 10 },
      { op: "lineTo", x: 80, y: 30 },
      { op: "lineTo", x: 40, y: 50 },
      { op: "lineTo", x: 0, y: 30 },
      { op: "closePath" },
    ]);
    assert.equal(ops[7]?.op, "clip");
    const tint = ops.find((o) => o.op === "fill");
    assert.equal(tint?.fillStyle, "rgba(180,30,0,0.68)");
  });

  it("ice tint fill is rgba(100,200,255,0.55); spikes charcoal", () => {
    const ice = mockCtx();
    drawHazardOverlay(ice.ctx, 0, 0, "ice", 0, 0, 65, 80, 40, 0);
    assert.equal(
      ice.ops.find((o) => o.op === "fill")?.fillStyle,
      "rgba(100,200,255,0.55)",
    );
    const spikes = mockCtx();
    drawHazardOverlay(spikes.ctx, 0, 0, "spikes", 0, 0, 65, 80, 40, 0);
    assert.equal(
      spikes.ops.find((o) => o.op === "fill")?.fillStyle,
      "rgba(40,40,40,0.72)",
    );
    const poison = mockCtx();
    drawHazardOverlay(poison.ctx, 0, 0, "poison", 0, 0, 65, 80, 40, 0);
    assert.equal(
      poison.ops.find((o) => o.op === "fill")?.fillStyle,
      "rgba(40,40,40,0.72)",
    );
  });

  it("sets serif font / center / middle even though glyphs are fillRect", () => {
    const { ctx, ops } = mockCtx();
    drawHazardOverlay(ctx, 0, 0, "ice", 0, 0, 65, 80, 40, 0);
    assert.ok(ops.some((o) => o.op === "font" && o.v === "26px serif"));
    assert.ok(ops.some((o) => o.op === "textAlign" && o.v === "center"));
    assert.ok(ops.some((o) => o.op === "textBaseline" && o.v === "middle"));
  });

  it("lava glow uses injected nowMs, not Date.now", () => {
    const nowMs = 12_345;
    const hSeed = hazardOverlaySeed(3, 5, 77);
    const pulse = hazardLavaPulse(nowMs, hSeed);
    const { ctx, ops } = mockCtx();
    drawHazardOverlay(ctx, 50, 20, "lava", 3, 5, 77, 80, 40, nowMs);
    const pulseAlpha = ops.filter((o) => o.op === "globalAlpha").at(-1);
    assert.equal(pulseAlpha?.v, pulse * 0.9);
    const glow = ops.filter(
      (o) => o.op === "fillRect" && o.w === 4 && o.h === 4,
    );
    assert.equal(glow.length, 4);
    assert.equal(
      glow[0]?.fillStyle,
      `rgba(255,${180 + Math.floor(pulse * 60)},20,${pulse})`,
    );
  });

  it("ice draws 4 arms (8 rects) plus a 3x3 center, not lava glow", () => {
    const { ctx, ops } = mockCtx();
    drawHazardOverlay(ctx, 40, 10, "ice", 1, 1, 65, 80, 40, 0);
    const glyphs = ops.filter(
      (o) => o.op === "fillRect" && o.fillStyle === "rgba(255,255,255,0.9)",
    );
    assert.equal(glyphs.length, 9);
    assert.equal(
      ops.filter((o) => o.op === "globalAlpha" && o.v !== 0.9).length,
      0,
    );
  });

  it("spikes draw three tip/body pairs and reset fillStyle each body", () => {
    const { ctx, ops } = mockCtx();
    drawHazardOverlay(ctx, 40, 10, "spikes", 2, 2, 65, 80, 40, 0);
    const tips = ops.filter(
      (o) =>
        o.op === "fillRect" &&
        o.w === 2 &&
        o.h === 2 &&
        o.fillStyle === "rgba(180,180,180,0.95)",
    );
    const bodies = ops.filter(
      (o) =>
        o.op === "fillRect" &&
        o.w === 4 &&
        o.h === 3 &&
        o.fillStyle === "rgba(120,120,120,0.85)",
    );
    assert.equal(tips.length, 3);
    assert.equal(bodies.length, 3);
  });

  it("lava grain consumes the extra isHot rng draw; ice does not", () => {
    const seed = hazardOverlaySeed(6, 7, 90);
    const lavaCount = hazardOverlayGrainCount(seededRng(seed));
    const iceCount = hazardOverlayGrainCount(seededRng(seed));
    assert.equal(lavaCount, iceCount);

    // Replay the live grain loop: count draw + (x,y,size,shade) + optional isHot/isTip.
    function countGrainRng(kind: string): number {
      const rng = seededRng(seed);
      const n = hazardOverlayGrainCount(rng);
      let extra = 0;
      for (let i = 0; i < n; i++) {
        rng();
        rng();
        rng();
        rng();
        if (kind === "lava" || kind === "spikes") {
          rng();
          extra += 1;
        }
      }
      return 1 + n * 4 + extra;
    }

    assert.equal(countGrainRng("lava"), 1 + lavaCount * 5);
    assert.equal(countGrainRng("ice"), 1 + iceCount * 4);
    assert.equal(countGrainRng("spikes"), 1 + lavaCount * 5);
  });

  it("balanced save/restore", () => {
    for (const kind of ["lava", "ice", "spikes", "fire"] as const) {
      const { ctx, ops } = mockCtx();
      drawHazardOverlay(ctx, 0, 0, kind, 2, 2, 65, 80, 40, 0);
      const saves = ops.filter((o) => o.op === "save").length;
      const restores = ops.filter((o) => o.op === "restore").length;
      assert.equal(saves, restores);
      assert.equal(saves, 1);
    }
  });
});
