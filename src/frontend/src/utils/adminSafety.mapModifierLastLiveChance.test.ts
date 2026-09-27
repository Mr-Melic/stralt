import assert from "node:assert/strict";
import { mapModifierLastLiveChanceRejected } from "./adminSafety.mapModifierLastLiveChance.ts";

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

// Failure: adminSetMapModifierChance(last remaining seeded id, 0).
assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "paper_windstorm",
    chance: 0,
    existing: [{ ...slime, active: false }, paper],
  }),
  "Cannot empty the live built-in map-modifier pool",
);
assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "slime_flood",
    chance: 0,
    existing: [slime, { ...paper, active: false }],
  }),
  "Cannot empty the live built-in map-modifier pool",
);
assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "slime_flood",
    chance: 0,
    existing: [slime, { ...paper, triggerChance: 0 }],
  }),
  "Cannot empty the live built-in map-modifier pool",
);

// One seeded row may go to weight 0 while the other stays live.
assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "slime_flood",
    chance: 0,
    existing: [slime, paper],
  }),
  null,
);

// Custom / gravity_well rows may still be weight-0.
assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "gravity_well",
    chance: 0,
    existing: [slime, paper],
  }),
  null,
);

// Already-inactive seeded rows may still receive chance 0.
assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "slime_flood",
    chance: 0,
    existing: [
      { ...slime, active: false },
      { ...paper, active: false },
    ],
  }),
  null,
);

assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "slime_flood",
    chance: 20,
    existing: [slime],
  }),
  null,
);

assert.equal(
  mapModifierLastLiveChanceRejected({
    id: "",
    chance: 0,
    existing: [slime],
  }),
  "Map modifier id cannot be empty",
);
assert.ok(
  mapModifierLastLiveChanceRejected({
    id: "x".repeat(65),
    chance: 0,
    existing: [],
  }),
);
