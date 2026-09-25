import assert from "node:assert/strict";
import { mapModifierIdentityRejected } from "./adminSafety.mapModifierIdentity.ts";

// Failure: official + Add Modifier uses id=mod_<timestamp> and type=slime_flood.
// The engine roll keys id; the HUD filters modifierType — this row never
// rolls and can hide a later live slime_flood overlay.
assert.equal(
  mapModifierIdentityRejected({
    id: "mod_1758800000000",
    modifierType: "slime_flood",
  }),
  "modifierType must match id so the live roll and HUD stay aligned",
);

// Failure: editing live slime_flood and switching the type dropdown to
// paper_windstorm keeps the slime_flood hook (id) but hides the HUD
// (visibleMapModifiers looks for paper_windstorm in the active id set).
assert.equal(
  mapModifierIdentityRejected({
    id: "slime_flood",
    modifierType: "paper_windstorm",
  }),
  "modifierType must match id so the live roll and HUD stay aligned",
);

// Failure: legacy lava_fields / custom ids have no engine hook. Storing
// them as active looks live and is a no-op.
assert.equal(
  mapModifierIdentityRejected({
    id: "lava_fields",
    modifierType: "lava_fields",
  }),
  "modifierType is not a recognized live modifier",
);
assert.equal(
  mapModifierIdentityRejected({ id: "custom", modifierType: "custom" }),
  "modifierType is not a recognized live modifier",
);

// Designed defaults and other live registry ids stay writable.
assert.equal(
  mapModifierIdentityRejected({
    id: "slime_flood",
    modifierType: "slime_flood",
  }),
  null,
);
assert.equal(
  mapModifierIdentityRejected({
    id: "paper_windstorm",
    modifierType: "paper_windstorm",
  }),
  null,
);
assert.equal(
  mapModifierIdentityRejected({ id: "doka_fever", modifierType: "doka_fever" }),
  null,
);
