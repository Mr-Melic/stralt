import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  discountedApCostMinus1Min1,
  mapModifierRegistry,
} from "./mapModifiers.ts";
import {
  planPlayerCastResources,
  shouldRejectCastForMissingAp,
} from "./playerCastPlan.ts";
import { canAffordCastAp, resolveCastApCost } from "./targeting.ts";

const ctx = {
  log: () => {},
  rng: () => 0,
};

describe("mapModifierRegistry MP/AP chain", () => {
  it("doubles movement cost once per active MP modifier, in registry order", () => {
    assert.equal(
      mapModifierRegistry.applyMpCost(2, new Set(["slime_flood"]), ctx),
      4,
    );
    assert.equal(
      mapModifierRegistry.applyMpCost(
        2,
        new Set(["slime_flood", "frozen_terrain"]),
        ctx,
      ),
      8,
    );
    assert.equal(mapModifierRegistry.applyMpCost(3, new Set(), ctx), 3);
  });

  it("stacks AP discounts and never drops a paid cost below 1", () => {
    assert.equal(discountedApCostMinus1Min1(3), 2);
    assert.equal(discountedApCostMinus1Min1(1), 1);
    assert.equal(discountedApCostMinus1Min1(0), 0);
    assert.equal(
      mapModifierRegistry.applyApCost(3, new Set(["arcane_surge"]), ctx),
      2,
    );
    assert.equal(
      mapModifierRegistry.applyApCost(
        3,
        new Set(["arcane_surge", "arcane_overflow"]),
        ctx,
      ),
      1,
    );
    assert.equal(
      mapModifierRegistry.applyApCost(1, new Set(["arcane_surge"]), ctx),
      1,
    );
  });

  it("does not raise a 0-AP catalog cost to 1 under Surge or Overflow", () => {
    assert.equal(
      mapModifierRegistry.applyApCost(0, new Set(["arcane_surge"]), ctx),
      0,
    );
    assert.equal(
      mapModifierRegistry.applyApCost(0, new Set(["arcane_overflow"]), ctx),
      0,
    );
    assert.equal(
      mapModifierRegistry.applyApCost(
        0,
        new Set(["arcane_surge", "arcane_overflow"]),
        ctx,
      ),
      0,
    );
  });

  it("lets empty-wallet Timestep execute under Arcane Surge (0 stays 0)", () => {
    const surge = (base: number) =>
      mapModifierRegistry.applyApCost(base, new Set(["arcane_surge"]), ctx);
    assert.equal(resolveCastApCost(0, surge), 0);
    assert.equal(
      shouldRejectCastForMissingAp({
        currentAp: 0,
        baseApCost: 0,
        applyApCost: surge,
      }),
      false,
    );
    assert.deepEqual(
      planPlayerCastResources({
        currentAp: 0,
        baseApCost: 0,
        cooldownTurnsRemaining: 0,
        applyApCost: surge,
      }),
      { ok: true, apCost: 0 },
    );
    assert.equal(canAffordCastAp(0, 2, surge), false);
    assert.equal(resolveCastApCost(2, surge), 1);
  });

  it("doubles Doka rewards under doka_fever only", () => {
    assert.equal(
      mapModifierRegistry.applyRewardMultiplier(
        10,
        new Set(["doka_fever"]),
        ctx,
      ),
      20,
    );
    assert.equal(
      mapModifierRegistry.applyRewardMultiplier(
        10,
        new Set(["slime_flood"]),
        ctx,
      ),
      10,
    );
  });
});
