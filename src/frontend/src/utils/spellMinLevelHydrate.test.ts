import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  libraryIncludesIgnoringMinLevel,
  minLevelGateWithoutOwnershipWouldHideCatalogSpell,
  officialHydrateEnforcesSpellMinLevel,
  upgradeSpellChecksMinLevel,
} from "./spellMinLevelHydrate.ts";

describe("spellMinLevelHydrate", () => {
  it("keeps catalog spells visible below minLevel when unused", () => {
    const owned = new Set<string>();
    assert.equal(officialHydrateEnforcesSpellMinLevel(), false);
    assert.equal(upgradeSpellChecksMinLevel(), false);
    assert.equal(
      libraryIncludesIgnoringMinLevel({
        usableByPlayer: true,
        spellId: "void_collapse",
        ownedSpellIds: owned,
        minLevel: 30,
        playerLevel: 1,
      }),
      true,
    );
    assert.equal(
      minLevelGateWithoutOwnershipWouldHideCatalogSpell({
        playerLevel: 1,
        minLevel: 30,
        usableByPlayer: true,
        alreadyOwned: false,
      }),
      true,
    );
    assert.equal(
      minLevelGateWithoutOwnershipWouldHideCatalogSpell({
        playerLevel: 1,
        minLevel: 30,
        usableByPlayer: true,
        alreadyOwned: true,
      }),
      false,
    );
    assert.equal(
      libraryIncludesIgnoringMinLevel({
        usableByPlayer: false,
        spellId: "retired_bolt",
        ownedSpellIds: owned,
        minLevel: 1,
        playerLevel: 99,
      }),
      false,
    );
  });
});
