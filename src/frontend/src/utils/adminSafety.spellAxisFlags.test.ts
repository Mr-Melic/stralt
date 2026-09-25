import assert from "node:assert/strict";
import { spellAxisFlagsRejected } from "./adminSafety.spellAxisFlags.ts";

// Failure: both axis flags set. Official targeting only accepts tiles that
// are cardinal (linear) AND |dx|===|dy| (diagonal) — only the caster tile.
// minRange>=1 then rejects self, so the previous valid spell is gone.
assert.equal(
  spellAxisFlagsRejected({ linear: true, diagonal: true }),
  "linear and diagonal cannot both be set",
);

// Designed built-ins: shadow_strike is diagonal-only; thunder_clap is neither.
assert.equal(spellAxisFlagsRejected({ linear: false, diagonal: true }), null);
assert.equal(spellAxisFlagsRejected({ linear: true, diagonal: false }), null);
assert.equal(spellAxisFlagsRejected({ linear: false, diagonal: false }), null);
