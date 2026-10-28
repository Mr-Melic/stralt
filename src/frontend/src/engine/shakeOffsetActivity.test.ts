import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SHAKE_INTENSITY_EPSILON,
  ZERO_SHAKE_OFFSET,
  computeShakeOffset,
} from "./shakeOffsetActivity.ts";

describe("computeShakeOffset", () => {
  it("reuses the zero vector when shake is disabled", () => {
    const a = computeShakeOffset({ enabled: false, intensity: 4 });
    const b = computeShakeOffset({ enabled: false, intensity: 0 });
    assert.equal(a, ZERO_SHAKE_OFFSET);
    assert.equal(b, ZERO_SHAKE_OFFSET);
    assert.equal(a.x, 0);
    assert.equal(a.y, 0);
  });

  it("reuses the zero vector when intensity is below the tick floor", () => {
    const idle = computeShakeOffset({ enabled: true, intensity: 0 });
    const residual = computeShakeOffset({
      enabled: true,
      intensity: SHAKE_INTENSITY_EPSILON - 0.001,
    });
    assert.equal(idle, ZERO_SHAKE_OFFSET);
    assert.equal(residual, ZERO_SHAKE_OFFSET);
  });

  it("samples RNG only while intensity is live and keeps the existing formula", () => {
    const calls: number[] = [];
    const random = (): number => {
      calls.push(0.25);
      return 0.25;
    };
    const offset = computeShakeOffset({
      enabled: true,
      intensity: 2,
      random,
    });
    assert.equal(calls.length, 2);
    assert.equal(offset.x, (0.25 - 0.5) * 4);
    assert.equal(offset.y, (0.25 - 0.5) * 4);
    assert.notEqual(offset, ZERO_SHAKE_OFFSET);
  });

  it("does not sample RNG on the idle path", () => {
    let rolls = 0;
    computeShakeOffset({
      enabled: true,
      intensity: 0,
      random: () => {
        rolls += 1;
        return 0.9;
      },
    });
    assert.equal(rolls, 0);
  });
});
