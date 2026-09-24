import assert from "node:assert/strict";
import { spellTargetingRejected } from "./adminSafety.spellTargeting.ts";

// Failure: adminSetSpellConfig accepted range=1_000_000 while maxRange is
// capped at 20. Enemy AI uses Number(spell.range) from the backend catalog.
assert.equal(
  spellTargetingRejected({ range: 1_000_000 }),
  "range must be at most 20",
);
assert.equal(spellTargetingRejected({ range: 21 }), "range must be at most 20");
assert.equal(
  spellTargetingRejected({ range: Number.POSITIVE_INFINITY }),
  "range must be at most 20",
);
assert.equal(spellTargetingRejected({ range: 20 }), null);
assert.equal(spellTargetingRejected({ range: 0 }), null);
assert.equal(spellTargetingRejected({ range: 5, hitTiles: [[3, -2]] }), null);

// Failure: hitTiles offsets are Motoko Int with no bound; a 1e9 offset is
// not a tile on the 16×16 map and must not store as targeting metadata.
assert.equal(
  spellTargetingRejected({ range: 3, hitTiles: [[1_000_000_000, 0]] }),
  "hitTiles offsets must be between -20 and 20",
);
assert.equal(
  spellTargetingRejected({ range: 3, hitTiles: [[0, -21]] }),
  "hitTiles offsets must be between -20 and 20",
);
assert.equal(
  spellTargetingRejected({
    range: 3,
    hitTiles: [
      [20, 20],
      [-20, -20],
    ],
  }),
  null,
);
