import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ICE_SLOW_DURATION,
  ICE_SLOW_MP_MODIFIER,
  LAVA_BURN_DOT_PER_TURN,
  LAVA_BURN_DURATION,
  LAVA_STEP_DAMAGE_MIN,
  LAVA_STEP_DAMAGE_SPAN,
  SPIKE_STEP_DAMAGE_MIN,
  SPIKE_STEP_DAMAGE_SPAN,
  rollLavaStepDamage,
  rollSpikeStepDamage,
} from "./hazardStep.ts";

describe("hazard step rolls (player RAF and enemy landing share these)", () => {
  it("keeps lava 8–15 and spikes 5–10 for the inlined Math.random formula", () => {
    assert.equal(LAVA_STEP_DAMAGE_MIN, 8);
    assert.equal(LAVA_STEP_DAMAGE_SPAN, 8);
    assert.equal(SPIKE_STEP_DAMAGE_MIN, 5);
    assert.equal(SPIKE_STEP_DAMAGE_SPAN, 6);
    assert.equal(
      rollLavaStepDamage(() => 0),
      8,
    );
    assert.equal(
      rollSpikeStepDamage(() => 0),
      5,
    );
    // Math.random is [0, 1): just-below-1 is the documented max.
    assert.equal(
      rollLavaStepDamage(() => 0.999),
      15,
    );
    assert.equal(
      rollSpikeStepDamage(() => 0.999),
      10,
    );
    assert.equal(
      rollLavaStepDamage(() => 0.5),
      12,
    );
    assert.equal(
      rollSpikeStepDamage(() => 0.5),
      8,
    );
  });

  it("matches the previous inlined 8+floor(rng*8) / 5+floor(rng*6) samples", () => {
    const samples = [0, 0.125, 0.25, 0.5, 0.75, 0.999];
    for (const u of samples) {
      assert.equal(
        rollLavaStepDamage(() => u),
        8 + Math.floor(u * 8),
      );
      assert.equal(
        rollSpikeStepDamage(() => u),
        5 + Math.floor(u * 6),
      );
    }
  });

  it("treats a non-finite rng as the documented minimum", () => {
    assert.equal(
      rollLavaStepDamage(() => Number.NaN),
      8,
    );
    assert.equal(
      rollSpikeStepDamage(() => Number.POSITIVE_INFINITY),
      5,
    );
  });
});

describe("lava burn / ice slow numbers stay the player and enemy copies", () => {
  it("burns 3 turns at 3 HP and slows 2 turns at -2 MP", () => {
    assert.equal(LAVA_BURN_DURATION, 3);
    assert.equal(LAVA_BURN_DOT_PER_TURN, 3);
    assert.equal(ICE_SLOW_DURATION, 2);
    assert.equal(ICE_SLOW_MP_MODIFIER, -2);
  });
});
