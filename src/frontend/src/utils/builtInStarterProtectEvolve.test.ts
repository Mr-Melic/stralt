import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  builtInSpellIdsProtectLiveInnates,
  liveInnateSpellIds,
  physicalAttackIsBootPurged,
  physicalAttackIsBuiltIn,
} from "./builtInStarterProtectEvolve.ts";

describe("builtInStarterProtectEvolve", () => {
  it("lists live innates and documents that built-in delete-protection omits them", () => {
    const innates = liveInnateSpellIds();
    assert.ok(innates.includes("physical_attack"));
    assert.ok(innates.includes("starter-frost"));
    assert.ok(innates.includes("starter-heal"));
    assert.equal(innates.includes("spell-inferno"), false);
    assert.equal(builtInSpellIdsProtectLiveInnates(), false);
    assert.equal(physicalAttackIsBuiltIn(), false);
    assert.equal(physicalAttackIsBootPurged(), true);
  });
});
