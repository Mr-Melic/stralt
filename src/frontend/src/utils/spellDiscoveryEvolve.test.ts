import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  BOOT_PURGED_SPELL_IDS,
  LIVE_STARTER_SPELL_ID_PURGED_AT_BOOT,
  upgradeSpellMinLevelRejected,
  upgradeSpellWouldGrantUnownedCatalogId,
} from "./spellDiscoveryEvolve.ts";

describe("boot purge vs live starters", () => {
  it("still deletes physical_attack from spellConfigs on every upgrade", () => {
    assert.equal(LIVE_STARTER_SPELL_ID_PURGED_AT_BOOT, "physical_attack");
    assert.equal(physicalAttackSpell.id, "physical_attack");
    assert.ok(
      (BOOT_PURGED_SPELL_IDS as readonly string[]).includes(
        physicalAttackSpell.id,
      ),
    );
    assert.ok(starterSpells.some((s) => s.id === "physical_attack"));
  });

  it("does not list live spell-inferno (named Inferno) in the id purge", () => {
    assert.equal(
      (BOOT_PURGED_SPELL_IDS as readonly string[]).includes("spell-inferno"),
      false,
    );
    const inferno = starterSpells.find((s) => s.id === "spell-inferno");
    assert.equal(inferno?.name, "Inferno");
  });
});

describe("upgradeSpell minLevel grandfather", () => {
  it("blocks a first paid grant below minLevel", () => {
    assert.equal(
      upgradeSpellMinLevelRejected({
        playerLevel: 1,
        minLevel: 30,
        alreadyOwned: false,
      }),
      "Character level too low for this spell",
    );
  });

  it("lets a player who already owns the id keep upgrading after minLevel rises", () => {
    assert.equal(
      upgradeSpellMinLevelRejected({
        playerLevel: 4,
        minLevel: 30,
        alreadyOwned: true,
      }),
      null,
    );
  });

  it("does not treat empty spellLevelKeys as owned (create default)", () => {
    assert.equal(
      upgradeSpellWouldGrantUnownedCatalogId({
        alreadyOwned: false,
        usableByPlayer: true,
      }),
      true,
    );
    assert.equal(
      upgradeSpellWouldGrantUnownedCatalogId({
        alreadyOwned: true,
        usableByPlayer: true,
      }),
      false,
    );
    assert.equal(
      upgradeSpellWouldGrantUnownedCatalogId({
        alreadyOwned: false,
        usableByPlayer: false,
      }),
      false,
    );
  });
});
