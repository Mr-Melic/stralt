import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  combatantLandingHazard,
  lavaLandingHpDamage,
  shouldApplySummonLandingHazard,
  spikeLandingHpDamage,
} from "./combatantLandingHazard.ts";

describe("lavaLandingHpDamage / spikeLandingHpDamage", () => {
  it("matches the enemy apply ranges (lava 8–15, spikes 5–10)", () => {
    assert.equal(lavaLandingHpDamage(() => 0), 8);
    assert.equal(lavaLandingHpDamage(() => 0.999), 15);
    assert.equal(spikeLandingHpDamage(() => 0), 5);
    assert.equal(spikeLandingHpDamage(() => 0.999), 10);
  });
});

describe("combatantLandingHazard", () => {
  it("returns lava burn + HP so summon landings can match enemy apply", () => {
    const effect = combatantLandingHazard("lava", () => 0);
    assert.deepEqual(effect, {
      kind: "lava",
      hpDamage: 8,
      burning: { duration: 3, dotDamagePerTurn: 3 },
    });
  });

  it("returns spike HP with no status row", () => {
    const effect = combatantLandingHazard("spikes", () => 0);
    assert.deepEqual(effect, { kind: "spikes", hpDamage: 5 });
  });

  it("returns ice Frozen MP debuff without HP loss", () => {
    const effect = combatantLandingHazard("ice");
    assert.deepEqual(effect, {
      kind: "ice",
      hpDamage: 0,
      frozenMp: { modifier: -2, duration: 2 },
    });
  });

  it("ignores unknown / empty hazard keys", () => {
    assert.equal(combatantLandingHazard(null), null);
    assert.equal(combatantLandingHazard(undefined), null);
    assert.equal(combatantLandingHazard("thorned_ground"), null);
  });
});

describe("shouldApplySummonLandingHazard", () => {
  it("is true only when the summon actually moved onto lava/spikes/ice", () => {
    assert.equal(
      shouldApplySummonLandingHazard({ moved: true, hazardKind: "lava" }),
      true,
    );
    assert.equal(
      shouldApplySummonLandingHazard({ moved: true, hazardKind: "spikes" }),
      true,
    );
    assert.equal(
      shouldApplySummonLandingHazard({ moved: true, hazardKind: "ice" }),
      true,
    );
    assert.equal(
      shouldApplySummonLandingHazard({ moved: false, hazardKind: "lava" }),
      false,
      "origin===dest must not re-tick the tile",
    );
    assert.equal(
      shouldApplySummonLandingHazard({ moved: true, hazardKind: null }),
      false,
    );
  });

  it("documents the control/executor gap: enemy apply charges; summon walks skip", () => {
    // Enemy apply (WX ~16874): if (newX !== originX || newY !== originY) + hazard.
    // applyControlledSummonWalk / executeSummonAction: updateCombatant position only.
    // Until those call sites consult this helper, a controlled wolf on lava
    // takes 0 while an enemy on the same tile takes 8–15.
    assert.equal(
      shouldApplySummonLandingHazard({ moved: true, hazardKind: "lava" }),
      true,
    );
  });
});
