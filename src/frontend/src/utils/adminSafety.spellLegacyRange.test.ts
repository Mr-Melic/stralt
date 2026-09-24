import assert from "node:assert/strict";
import { spellLegacyRangeRejected } from "./adminSafety.spellLegacyRange.ts";

// Failure: Admin Range StatRow and maxRange are independent. Enemy AI uses
// Number(spell.range); player clicks use maxRange. range=10 / maxRange=3
// used to store and let hostiles outrange the player.
assert.equal(
  spellLegacyRangeRejected({ range: 10, maxRange: 3 }),
  "range cannot exceed maxRange",
);
assert.equal(
  spellLegacyRangeRejected({ range: 1_000_000, maxRange: 3 }),
  "range cannot exceed maxRange",
);
assert.equal(
  spellLegacyRangeRejected({ range: 1_000_000, maxRange: 0 }),
  "range cannot exceed maxRange",
);
assert.equal(
  spellLegacyRangeRejected({ range: Number.POSITIVE_INFINITY, maxRange: 5 }),
  "range cannot exceed maxRange",
);

// Designed: AI range may be shorter than player maxRange (starter kits).
assert.equal(spellLegacyRangeRejected({ range: 2, maxRange: 6 }), null);
assert.equal(spellLegacyRangeRejected({ range: 3, maxRange: 4 }), null);
assert.equal(spellLegacyRangeRejected({ range: 2, maxRange: 2 }), null);

// Shipped reflect_barrier: range=1, maxRange=0 (self). Re-save must not #err.
assert.equal(spellLegacyRangeRejected({ range: 1, maxRange: 0 }), null);
assert.equal(spellLegacyRangeRejected({ range: 0, maxRange: 0 }), null);
