import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import { maxPersistedHp } from "./adminSafety.ts";
import {
  LIVE_STARTER_IDS_IN_BOOT_PURGE,
  OFFICIAL_STARTER_SPELL_IDS,
  compoundingHpExceedsPersistCap,
  compoundingPlayerMaxHp,
  filterSpellBarForPersist,
  filterSpellBarKeysOnly,
  leftoverXpCannotAffordNextLevel,
  linearPersistMaxHp,
  officialStarterSpellIds,
  shouldHidePurgedCatalogRow,
} from "./spellCatalogEvolve.ts";

describe("purged catalog ids vs live names", () => {
  it("keeps OFFICIAL_STARTER_SPELL_IDS in lockstep with spellData", () => {
    assert.deepEqual(
      OFFICIAL_STARTER_SPELL_IDS,
      starterSpells.map((s) => s.id),
    );
  });

  it("does not hide live spell-inferno because it is named Inferno", () => {
    assert.equal(
      shouldHidePurgedCatalogRow({ id: "spell-inferno", name: "Inferno" }),
      false,
    );
    assert.equal(
      shouldHidePurgedCatalogRow({ id: "inferno", name: "Inferno" }),
      true,
    );
  });

  it("hides legacy fireball by id even if renamed", () => {
    assert.equal(
      shouldHidePurgedCatalogRow({ id: "fireball", name: "Solar Bolt" }),
      true,
    );
  });

  it("keeps physical_attack in the boot-purge hazard list while it is a starter", () => {
    const starters = officialStarterSpellIds();
    assert.ok(starters.includes("physical_attack"));
    assert.ok(LIVE_STARTER_IDS_IN_BOOT_PURGE.includes("physical_attack"));
  });
});

describe("setSpellBarOrder empty-keys vs starters", () => {
  const starters = officialStarterSpellIds();

  it("today's Motoko contains() drops the official first-bar save", () => {
    const first8 = starters.slice(0, 8);
    assert.deepEqual(filterSpellBarKeysOnly(first8, []), []);
  });

  it("empty keys on a create row keep starters (intended persist)", () => {
    const first8 = starters.slice(0, 8);
    assert.deepEqual(filterSpellBarForPersist(first8, [], starters), first8);
    assert.ok(first8.includes("physical_attack"));
  });

  it("does not grant a random catalog id when keys are empty", () => {
    assert.deepEqual(
      filterSpellBarForPersist(
        ["physical_attack", "void_collapse"],
        [],
        starters,
      ),
      ["physical_attack"],
    );
  });

  it("after a paid upgrade, only keys survive (no catalog-all)", () => {
    assert.deepEqual(
      filterSpellBarForPersist(
        ["physical_attack", "void_collapse", "starter-heal"],
        ["void_collapse"],
        starters,
      ),
      ["void_collapse"],
    );
  });
});

describe("unbounded HP formula vs persist cap", () => {
  it("compounding battle-init HP exceeds linear persist from level 10 at 5%", () => {
    assert.equal(maxPersistedHp(10, 5), 145);
    assert.equal(linearPersistMaxHp(10, 5), maxPersistedHp(10, 5));
    assert.equal(compoundingPlayerMaxHp(10, 5), Math.round(100 * 1.05 ** 9));
    assert.equal(compoundingHpExceedsPersistCap(10, 5), true);
    assert.equal(compoundingHpExceedsPersistCap(1, 5), false);
  });
});

describe("applyRewards pow2 short-circuit", () => {
  it("leftover below 100 cannot afford any level (min cost 100 * 2^0)", () => {
    assert.equal(leftoverXpCannotAffordNextLevel(0), true);
    assert.equal(leftoverXpCannotAffordNextLevel(99), true);
    assert.equal(leftoverXpCannotAffordNextLevel(100), false);
    assert.equal(leftoverXpCannotAffordNextLevel(10), true);
  });
});
