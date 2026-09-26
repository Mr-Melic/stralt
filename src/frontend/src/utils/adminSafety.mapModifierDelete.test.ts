import assert from "node:assert/strict";
import {
  isBuiltInMapModifierId,
  mapModifierHardDeleteRejected,
} from "./adminSafety.mapModifierDelete.ts";

// Failure: official Admin × on the seeded Slime Flood row.
assert.equal(isBuiltInMapModifierId("slime_flood"), true);
assert.equal(
  mapModifierHardDeleteRejected("slime_flood"),
  "Cannot delete a built-in map modifier; set active=false to retire it",
);
assert.equal(
  mapModifierHardDeleteRejected("paper_windstorm"),
  "Cannot delete a built-in map modifier; set active=false to retire it",
);

// Custom / legacy no-op rows may still be removed (they have no engine hook).
assert.equal(isBuiltInMapModifierId("mod_123"), false);
assert.equal(isBuiltInMapModifierId("lava_fields"), false);
assert.equal(isBuiltInMapModifierId("gravity_well"), false);
assert.equal(mapModifierHardDeleteRejected("mod_123"), null);
assert.equal(mapModifierHardDeleteRejected("lava_fields"), null);
assert.equal(mapModifierHardDeleteRejected("gravity_well"), null);

assert.equal(
  mapModifierHardDeleteRejected(""),
  "Map modifier id cannot be empty",
);
assert.ok(mapModifierHardDeleteRejected("x".repeat(65)));
