import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SHARED_NOISE_DURATION_SEC,
  fillWhiteNoise,
  sharedNoiseFrameCount,
} from "./soundEngine.ts";

describe("soundEngine noise buffer", () => {
  it("covers the longest synthesized noise burst at 44.1kHz", () => {
    const frames = sharedNoiseFrameCount(44100);
    assert.equal(frames, 44100);
    assert.ok(SHARED_NOISE_DURATION_SEC >= 0.6);
  });

  it("fills a channel with deterministic samples in [-1, 1)", () => {
    let i = 0;
    const seq = [0, 0.25, 0.5, 0.75, 1];
    const channel = new Float32Array(5);
    fillWhiteNoise(channel, () => seq[i++] ?? 0);
    assert.deepEqual(Array.from(channel), [-1, -0.5, 0, 0.5, 1]);
  });
});
