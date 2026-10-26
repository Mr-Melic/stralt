import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldSkipEffectsSimulation } from "./effectsTickActivity.ts";

const idle = {
  shakeIntensity: 0,
  hitFlashCount: 0,
  hitStopActive: false,
  activeCount: 0,
  damageCount: 0,
  deathCount: 0,
  dokaCount: 0,
  floatCount: 0,
};

describe("shouldSkipEffectsSimulation", () => {
  it("skips when juice, shake, flash, and hit-stop are idle", () => {
    assert.equal(shouldSkipEffectsSimulation(idle), true);
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, shakeIntensity: 0.009 }),
      true,
    );
  });

  it("keeps ticking residual shake, hit-flash, hit-stop, or any live array", () => {
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, shakeIntensity: 0.01 }),
      false,
    );
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, hitFlashCount: 1 }),
      false,
    );
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, hitStopActive: true }),
      false,
    );
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, activeCount: 1 }),
      false,
    );
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, damageCount: 1 }),
      false,
    );
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, deathCount: 1 }),
      false,
    );
    assert.equal(shouldSkipEffectsSimulation({ ...idle, dokaCount: 1 }), false);
    assert.equal(
      shouldSkipEffectsSimulation({ ...idle, floatCount: 1 }),
      false,
    );
  });
});
