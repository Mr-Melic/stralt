import assert from "node:assert/strict";
import { armDeathGuards, deathGuardsAreArmed } from "./deathGuards.ts";

const spent = {
  deathTriggered: { current: true },
  deathPenaltyApplied: { current: true },
};
assert.equal(
  deathGuardsAreArmed(spent),
  false,
  "in-battle death used to leave both guards set",
);

armDeathGuards(spent);
assert.equal(spent.deathTriggered.current, false);
assert.equal(spent.deathPenaltyApplied.current, false);
assert.equal(
  deathGuardsAreArmed(spent),
  true,
  "Death Realm / Respawn must re-arm so the next 0 HP can run",
);

const armed = {
  deathTriggered: { current: false },
  deathPenaltyApplied: { current: false },
};
assert.equal(deathGuardsAreArmed(armed), true);
armDeathGuards(armed);
assert.equal(deathGuardsAreArmed(armed), true);

console.log("deathGuards.test: ok");
