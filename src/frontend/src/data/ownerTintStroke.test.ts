import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { strokeOwnerTint } from "./ownerTintStroke.ts";

function makeTintSpy(): CanvasRenderingContext2D & {
  shadowBlurSets: number[];
  strokeRectCount: number;
} {
  const shadowBlurSets: number[] = [];
  const spy = {
    shadowBlurSets,
    strokeRectCount: 0,
    strokeStyle: "",
    lineWidth: 0,
    save() {},
    restore() {},
    strokeRect() {
      spy.strokeRectCount += 1;
    },
  };
  Object.defineProperty(spy, "shadowBlur", {
    configurable: true,
    enumerable: true,
    get() {
      return 0;
    },
    set(value: number) {
      shadowBlurSets.push(value);
    },
  });
  return spy as CanvasRenderingContext2D & {
    shadowBlurSets: number[];
    strokeRectCount: number;
  };
}

describe("strokeOwnerTint", () => {
  it("keeps the side-color stroke without canvas shadowBlur", () => {
    const ctx = makeTintSpy();
    strokeOwnerTint(
      ctx,
      [
        [2, 2],
        [2, 2],
      ],
      40,
      20,
      "#22c55e",
      { x: 1, y: 1 },
    );
    assert.equal(ctx.strokeRectCount, 1);
    assert.equal(ctx.strokeStyle, "#22c55e");
    assert.equal(ctx.lineWidth, 2);
    assert.deepEqual(ctx.shadowBlurSets, []);
  });
});
