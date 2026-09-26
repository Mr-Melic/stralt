import assert from "node:assert/strict";
import { mapModifierLastLiveRejected } from "./adminSafety.mapModifierLastLive.ts";

const slime = {
  id: "slime_flood",
  active: true,
  triggerChance: 20,
};
const paper = {
  id: "paper_windstorm",
  active: true,
  triggerChance: 20,
};

// Failure: official Admin unchecks Eligible on the last remaining seeded row.
assert.equal(
  mapModifierLastLiveRejected({
    incoming: { ...paper, active: false },
    existing: [{ ...slime, active: false }, paper],
  }),
  "Cannot empty the live built-in map-modifier pool",
);
assert.equal(
  mapModifierLastLiveRejected({
    incoming: { ...slime, triggerChance: 0 },
    existing: [slime, { ...paper, active: false }],
  }),
  "Cannot empty the live built-in map-modifier pool",
);

// One seeded row may retire while the other stays live.
assert.equal(
  mapModifierLastLiveRejected({
    incoming: { ...slime, active: false },
    existing: [slime, paper],
  }),
  null,
);

// Custom / gravity_well rows may still be deactivated.
assert.equal(
  mapModifierLastLiveRejected({
    incoming: { id: "gravity_well", active: false, triggerChance: 20 },
    existing: [slime, paper],
  }),
  null,
);

assert.equal(
  mapModifierLastLiveRejected({
    incoming: { id: "", active: false, triggerChance: 20 },
    existing: [slime],
  }),
  "Map modifier id cannot be empty",
);
assert.ok(
  mapModifierLastLiveRejected({
    incoming: { id: "x".repeat(65), active: false, triggerChance: 20 },
    existing: [],
  }),
);
