import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BUILT_IN_SPELL_IDS } from "./adminSafety.ts";
import {
  HEAD_FRONTEND_INNATE_SPELL_IDS,
  HEAD_MOTOKO_DEFAULT_SPELL_IDS,
  aliasTableRequiredBeforePersistingInnateIds,
  appendingStarterSpellGrantsEveryExistingPlayer,
  frontendInnateOverlapsMotokoDefaultCatalog,
  liveFrontendInnateSpellIds,
  removingStarterSpellRevokesEveryCohortWithoutKeys,
  renamingStarterSpellPreservesOwnership,
  shouldAddRequiredCharacterOwnedSpellIds,
  upgradeSpellCanPersistLevelForInnateId,
} from "./starterSpellGrantPersist.ts";

describe("starterSpellGrantPersist", () => {
  it("live starterSpells are a 32-id innate grant with no Motoko default overlap", () => {
    const live = liveFrontendInnateSpellIds();
    assert.deepEqual(live, [...HEAD_FRONTEND_INNATE_SPELL_IDS]);
    assert.equal(live.length, 32);
    assert.ok(live.includes("physical_attack"));
    assert.ok(live.includes("starter-heal"));
    assert.ok(live.includes("summon-dire-wolf"));
    assert.deepEqual(HEAD_MOTOKO_DEFAULT_SPELL_IDS, [...BUILT_IN_SPELL_IDS]);
    assert.deepEqual(frontendInnateOverlapsMotokoDefaultCatalog(), []);
  });

  it("paid upgradeSpell cannot persist a level for a frontend-only innate", () => {
    assert.equal(
      upgradeSpellCanPersistLevelForInnateId("starter-shield"),
      false,
    );
    assert.equal(upgradeSpellCanPersistLevelForInnateId("spell-swap"), false);
    assert.equal(
      upgradeSpellCanPersistLevelForInnateId("summon-dire-wolf"),
      false,
    );
    assert.equal(
      upgradeSpellCanPersistLevelForInnateId("physical_attack"),
      false,
    );
    assert.equal(upgradeSpellCanPersistLevelForInnateId("shadow_strike"), true);
    assert.equal(upgradeSpellCanPersistLevelForInnateId(""), false);
  });

  it("does not approve a required ownedSpellIds field; aliases are required first", () => {
    assert.equal(appendingStarterSpellGrantsEveryExistingPlayer(), true);
    assert.equal(removingStarterSpellRevokesEveryCohortWithoutKeys(), true);
    assert.equal(renamingStarterSpellPreservesOwnership(), false);
    assert.equal(shouldAddRequiredCharacterOwnedSpellIds(), false);
    assert.equal(aliasTableRequiredBeforePersistingInnateIds(), true);
  });
});
