import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PORTAL_WHIRLPOOL_COLORS,
  PORTAL_WHIRLPOOL_RADIUS,
  PORTAL_WHIRLPOOL_TIME_SCALE,
  REST_PORTAL_TIME_SCALE,
  drawPortalWhirlpool,
  portalWhirlpoolPalette,
  portalWhirlpoolTime,
  restPortalWhirlpoolTime,
} from "./portalWhirlpool.ts";

type CtxCall = { op: string; args: unknown[] };

function recordingCtx(): {
  ctx: CanvasRenderingContext2D;
  calls: CtxCall[];
} {
  const calls: CtxCall[] = [];
  const record =
    (op: string) =>
    (...args: unknown[]) => {
      calls.push({ op, args });
    };
  const ctx = {
    globalAlpha: 1,
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    save: record("save"),
    restore: record("restore"),
    translate: record("translate"),
    beginPath: record("beginPath"),
    closePath: record("closePath"),
    fill: record("fill"),
    stroke: record("stroke"),
    moveTo: record("moveTo"),
    lineTo: record("lineTo"),
    ellipse: record("ellipse"),
    arc: record("arc"),
    fillText: record("fillText"),
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

function ops(calls: CtxCall[]): string[] {
  return calls.map((c) => c.op);
}

describe("portalWhirlpoolPalette", () => {
  it("keeps the live dungeon / boss / rest / white layer colors", () => {
    assert.deepEqual(portalWhirlpoolPalette("dungeon"), [
      "#4a0000",
      "#8b0000",
      "#cc0000",
    ]);
    assert.deepEqual(portalWhirlpoolPalette("boss"), [
      "#1a0033",
      "#5b1fa0",
      "#9333ea",
    ]);
    assert.deepEqual(portalWhirlpoolPalette("rest"), [
      "#d0d0d0",
      "#e8e8e8",
      "#f8f8f8",
    ]);
    assert.deepEqual(portalWhirlpoolPalette("white"), [
      "#f5f5f5",
      "#ffffff",
      "#e8e8e8",
    ]);
    assert.deepEqual(
      portalWhirlpoolPalette("blue"),
      PORTAL_WHIRLPOOL_COLORS.blue,
    );
  });

  it("falls back to blue for an unknown portal id", () => {
    assert.deepEqual(portalWhirlpoolPalette("unknown"), [
      "#001133",
      "#003366",
      "#0066cc",
    ]);
    assert.equal(
      portalWhirlpoolPalette("not-a-portal"),
      PORTAL_WHIRLPOOL_COLORS.blue,
    );
  });
});

describe("portal whirlpool time scales", () => {
  it("uses 0.005 for the shared clock and 0.5× that for rest", () => {
    assert.equal(PORTAL_WHIRLPOOL_TIME_SCALE, 0.005);
    assert.equal(REST_PORTAL_TIME_SCALE, 0.5);
    assert.equal(PORTAL_WHIRLPOOL_RADIUS, 25);
    assert.equal(portalWhirlpoolTime(1000, 2), 1000 * 0.005 + 2);
    assert.equal(restPortalWhirlpoolTime(1000, 2), 1000 * 0.005 * 0.5 + 2);
    assert.notEqual(
      portalWhirlpoolTime(1000, 2),
      restPortalWhirlpoolTime(1000, 2),
    );
  });
});

describe("drawPortalWhirlpool", () => {
  it("anchors the swirl 10px above the iso tile top and balances save/restore", () => {
    const { ctx, calls } = recordingCtx();
    drawPortalWhirlpool(ctx, 40, 80, "blue", 0, 0);
    assert.deepEqual(calls.find((c) => c.op === "translate")?.args, [40, 70]);
    assert.equal(ops(calls).filter((op) => op === "save").length, 1);
    assert.equal(ops(calls).filter((op) => op === "restore").length, 1);
    assert.ok(ops(calls).indexOf("save") < ops(calls).indexOf("restore"));
  });

  it("rest portals draw rings and sparkles then return without the star or spirals", () => {
    const { ctx, calls } = recordingCtx();
    drawPortalWhirlpool(ctx, 0, 0, "rest", 0, 0);
    const names = ops(calls);
    assert.equal(
      names.filter((op) => op === "ellipse").length,
      4,
      "center glow + 3 rings",
    );
    assert.equal(names.filter((op) => op === "arc").length, 6);
    assert.equal(
      names.filter((op) => op === "fillText").length,
      0,
      "rest must not draw the boss star",
    );
    assert.ok(names.includes("restore"));
    const restoreAt = names.lastIndexOf("restore");
    assert.equal(
      names.slice(restoreAt + 1).includes("stroke"),
      false,
      "rest must not fall through into spiral layers",
    );
  });

  it("boss portals paint the star glyph and still stroke spiral layers", () => {
    const { ctx, calls } = recordingCtx();
    drawPortalWhirlpool(ctx, 0, 0, "boss", 0, 0);
    const star = calls.find((c) => c.op === "fillText");
    assert.deepEqual(star?.args, ["★", 0, 0]);
    assert.ok(ops(calls).filter((op) => op === "stroke").length >= 3);
  });

  it("dungeon portals skip the star but still stroke spiral layers", () => {
    const { ctx, calls } = recordingCtx();
    drawPortalWhirlpool(ctx, 0, 0, "dungeon", 0, 0);
    assert.equal(calls.filter((c) => c.op === "fillText").length, 0);
    assert.ok(ops(calls).filter((op) => op === "stroke").length >= 3);
  });

  it("strokes the unknown-id fallback with the blue last-layer color", () => {
    const { ctx, calls } = recordingCtx();
    drawPortalWhirlpool(ctx, 0, 0, "mystery", 0, 0);
    assert.equal(calls.filter((c) => c.op === "fillText").length, 0);
    assert.equal(ctx.strokeStyle, "#0066cc");
    assert.ok(ops(calls).includes("stroke"));
  });
});
