import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  activeSpellsNatDivergesFromSpellBarOrder,
  getSessionStateDefaultBlood,
  officialUiCallsSaveActiveSpells,
  officialUiCallsUpdateSessionState,
  updateSessionStateOverwritesOptionals,
} from "./sessionStateEvolve.ts";

describe("sessionStateEvolve", () => {
  it("locks the orphan session API and Nat vs Text loadout split", () => {
    assert.equal(officialUiCallsUpdateSessionState(), false);
    assert.equal(officialUiCallsSaveActiveSpells(), false);
    assert.equal(getSessionStateDefaultBlood(), 50);
    assert.equal(updateSessionStateOverwritesOptionals(), true);
    assert.equal(activeSpellsNatDivergesFromSpellBarOrder(), true);
  });
});
