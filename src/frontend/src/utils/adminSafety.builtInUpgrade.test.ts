import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isInnateSpellId,
  retiredSpellUpgradeRejected,
} from "./adminSafety.builtInUpgrade.ts";

describe("retiredSpellUpgradeRejected", () => {
  it("still rejects a retired catalog extra the player never owned", () => {
    assert.equal(
      retiredSpellUpgradeRejected({
        usableByPlayer: false,
        alreadyOwned: false,
        spellId: "custom_bolt",
      }),
      "Spell is retired",
    );
  });

  it("keeps owned extras upgradeable after retire", () => {
    assert.equal(
      retiredSpellUpgradeRejected({
        usableByPlayer: false,
        alreadyOwned: true,
        spellId: "custom_bolt",
      }),
      null,
    );
  });

  it("does not treat an unused built-in as unowned after retire", () => {
    // Failure: createCharacter / _starterCharacter persist empty
    // spellLevelKeys. Official play still shows starters from baseSpells.
    // adminSetSpellConfig(shadow_strike, usableByPlayer=false) then
    // upgradeSpell used to return "Spell is retired".
    assert.equal(isInnateSpellId("shadow_strike"), true);
    assert.equal(
      retiredSpellUpgradeRejected({
        usableByPlayer: false,
        alreadyOwned: false,
        spellId: "shadow_strike",
      }),
      null,
    );
    assert.equal(
      retiredSpellUpgradeRejected({
        usableByPlayer: false,
        alreadyOwned: false,
        spellId: "void_collapse",
      }),
      null,
    );
  });

  it("allows live catalog upgrades", () => {
    assert.equal(
      retiredSpellUpgradeRejected({
        usableByPlayer: true,
        alreadyOwned: false,
        spellId: "custom_bolt",
      }),
      null,
    );
  });
});
