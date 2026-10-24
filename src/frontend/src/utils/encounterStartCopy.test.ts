import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ENCOUNTER_BANNER,
  ENCOUNTER_FIRST_MAP_HINT,
  ENCOUNTER_YOUR_TURN,
} from "./encounterStartCopy.ts";

describe("encounterStartCopy", () => {
  it("banner announces a pack fight, not only bosses", () => {
    assert.match(ENCOUNTER_BANNER(1), /Encounter/i);
    assert.match(ENCOUNTER_BANNER(3), /3 foes/);
    assert.equal(/boss/i.test(ENCOUNTER_BANNER(2)), false);
  });

  it("turn cue names AP vs MP jobs", () => {
    assert.match(ENCOUNTER_YOUR_TURN, /Walk.*MP/i);
    assert.match(ENCOUNTER_YOUR_TURN, /Attack.*AP/i);
    assert.match(ENCOUNTER_FIRST_MAP_HINT, /Walk onto/i);
    assert.match(ENCOUNTER_FIRST_MAP_HINT, /Portal/i);
  });
});
